import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

const GOLD = '#f5a53d';

/**
 * Dark-card 6-digit code entry, used by both Signup (verify a brand-new
 * account's email) and Login (verify email / confirm first login) - the
 * same two-step email-code flow already live on the website
 * (LinkpiiAdminWeb's Signup.jsx/Login.jsx, calling the same
 * /verify-email-code, /resend-verification-code, /verify-login-code,
 * /resend-login-code backend endpoints).
 *
 * This component only owns the code input + verifying/resending/message
 * state; the caller supplies `onVerify`/`onResend` (each returning the
 * backend's `{ success, message|error }` shape) and `onVerified`, which
 * fires once a verify call succeeds so the caller can navigate/dispatch.
 */
const VerifyCodeCard = ({ title, description, verifyLabel = 'Verify', onVerify, onVerified, onResend }) => {
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleVerify = async () => {
    if (!code.trim()) {
      setMessage({ text: 'Please enter the 6-digit code.', type: 'error' });
      return;
    }
    setVerifying(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await onVerify(code.trim());
      if (res && res.success) {
        setMessage({ text: res.message || 'Verified!', type: 'success' });
        onVerified && onVerified(res);
      } else {
        setMessage({ text: (res && (res.message || res.error)) || 'Invalid or expired code.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await onResend();
      if (res && res.success) {
        setMessage({ text: res.message || 'A new code has been sent to your email.', type: 'success' });
      } else {
        setMessage({ text: (res && (res.message || res.error)) || 'Could not resend code.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}

      <View style={styles.card}>
        {message.text ? (
          <View style={[styles.banner, message.type === 'error' ? styles.bannerError : styles.bannerSuccess]}>
            <Text style={[styles.bannerText, message.type === 'error' ? styles.bannerTextError : styles.bannerTextSuccess]}>
              {message.text}
            </Text>
          </View>
        ) : null}

        <TextInput
          style={styles.codeInput}
          placeholder="------"
          placeholderTextColor="#444"
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />

        <TouchableOpacity
          style={[styles.verifyButton, verifying && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={verifying}
          activeOpacity={0.85}
        >
          {verifying ? <ActivityIndicator color="#000" /> : <Text style={styles.verifyButtonText}>{verifyLabel}</Text>}
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Text style={styles.resendPrompt}>Didn't get a code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={resending}>
            <Text style={[styles.resendLink, resending && styles.resendLinkDisabled]}>
              {resending ? 'Sending...' : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: '#9a9a9a',
    fontSize: 14,
    marginBottom: 22,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#0d0d0d',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  banner: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  bannerError: {
    backgroundColor: 'rgba(229,72,77,0.12)',
    borderColor: 'rgba(229,72,77,0.4)',
  },
  bannerSuccess: {
    backgroundColor: 'rgba(66,196,122,0.12)',
    borderColor: 'rgba(66,196,122,0.4)',
  },
  bannerText: {
    fontSize: 13,
    textAlign: 'center',
  },
  bannerTextError: {
    color: '#ff8086',
  },
  bannerTextSuccess: {
    color: '#6fe3a0',
  },
  codeInput: {
    backgroundColor: '#141414',
    borderWidth: 1.5,
    borderColor: '#262626',
    borderRadius: 14,
    height: 54,
    color: '#fff',
    fontSize: 22,
    letterSpacing: 10,
    marginBottom: 16,
  },
  verifyButton: {
    backgroundColor: GOLD,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  resendPrompt: {
    color: '#9a9a9a',
    fontSize: 13,
  },
  resendLink: {
    color: GOLD,
    fontSize: 13,
    fontWeight: '700',
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
});

export default VerifyCodeCard;
