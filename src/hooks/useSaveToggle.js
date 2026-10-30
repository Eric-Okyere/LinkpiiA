import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';

/**
 * Persisted "save for later" toggle for a listing's heart/like button -
 * the Android equivalent of the website's own useSaveToggle hook
 * (LinkpiiAdminWeb src/hooks/useSaveToggle.js), against the exact same
 * backend endpoint: farmbackend's controllers/Likes.js, mounted per
 * category as POST/GET /<categoryPath>/:id/like (e.g. "fashionpost" for
 * products, "shops" for shops - matches each route file's mount prefix
 * in index.js, not the model name).
 *
 * Before this hook, the app's LikeButton only toggled local component
 * state - tapping the heart animated but never actually saved anything,
 * and nothing synced with the "My Saved Items" list the backend already
 * supports (GET /saved/:userId) or with the website.
 */
export default function useSaveToggle(categoryPath, itemId) {
  // state.user is the logged-in user's id itself (see Redux/reducers.js -
  // LOGGED_IN/SIGN_IN store the id string directly as `user`), not an
  // object with an .id field.
  const userId = useSelector((state) => state.user);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryPath || !itemId) return undefined;
    let cancelled = false;

    const url = userId
      ? `${baseURL}${categoryPath}/${itemId}/like?userId=${userId}`
      : `${baseURL}${categoryPath}/${itemId}/like`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data && data.success) {
          setLiked(!!data.liked);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [categoryPath, itemId, userId]);

  const toggle = async (onNeedsLogin) => {
    if (!userId) {
      onNeedsLogin && onNeedsLogin();
      return;
    }
    if (loading || !itemId || !categoryPath) return;

    setLoading(true);
    const previouslyLiked = liked;
    setLiked(!previouslyLiked); // optimistic, matches LikeButton's own tap animation

    try {
      const res = await fetch(`${baseURL}${categoryPath}/${itemId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data && data.success) {
        setLiked(!!data.liked);
      } else {
        setLiked(previouslyLiked); // revert on failure
      }
    } catch (error) {
      setLiked(previouslyLiked); // revert on failure
    } finally {
      setLoading(false);
    }
  };

  return { liked, loading, toggle };
}
