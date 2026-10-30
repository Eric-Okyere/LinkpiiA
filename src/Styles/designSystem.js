/**
 * Shared design tokens for the redesigned "core marketplace" screens
 * (Hot tab, Buy tab, sell/detail flows). This is a fresh palette and
 * token set, not a port of the shelved feature/android-design-refresh
 * branch's theme.js (which only swapped the old #f5a53d orange for a
 * single gold hex across existing styles, with no typography/spacing/
 * radius/shadow scale of its own).
 *
 * Anchored to the Linkpii logo (gold eagle mark, near-black wordmark,
 * "Grow your business" tagline on white) rather than an arbitrary pick -
 * a marketplace app whose UI shares nothing with its own logo reads as
 * unfinished. ink/brand below are warm neutral + amber-gold scales that
 * sit close to the logo's palette while being more refined than a flat
 * color swap: a real typography scale, consistent radii, and a single
 * shared shadow recipe so every redesigned screen looks like one system
 * instead of screen-by-screen guesswork.
 */

const colors = {
  // Warm neutral ("ink") scale - doubles as text and surface colors.
  ink900: '#1C1917',
  ink700: '#44403C',
  ink500: '#78716C',
  ink300: '#D6D3D1',
  ink100: '#F5F5F4',

  // Brand gold, distinct from both the app's old #f5a53d and the shelved
  // branch's #ab6c0f - a slightly deeper, more "premium marketplace" amber.
  brand700: '#B45309',
  brand600: '#D97706',
  brand500: '#F59E0B',
  brand100: '#FEF3C7',

  surface: '#FFFFFF',
  background: '#FAFAF9',
  border: '#E7E5E4',

  success: '#16A34A',
  successTint: '#DCFCE7',
  danger: '#DC2626',
  dangerTint: '#FEE2E2',
  whatsapp: '#25D366',
  whatsappTint: '#E7FAF0',

  overlay: 'rgba(28, 25, 23, 0.55)',
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };

const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };

// Single shared shadow recipe (RN needs both the iOS shadow* props and
// Android's elevation) so every card/sheet/modal in the redesign reads
// as the same depth system instead of ad hoc per-screen elevation values.
const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
};

const typography = {
  title: { fontSize: 20, fontWeight: '800', color: colors.ink900 },
  heading: { fontSize: 16, fontWeight: '700', color: colors.ink900 },
  body: { fontSize: 14, fontWeight: '400', color: colors.ink700 },
  bodyStrong: { fontSize: 14, fontWeight: '700', color: colors.ink900 },
  caption: { fontSize: 12, fontWeight: '600', color: colors.ink500 },
  micro: { fontSize: 10, fontWeight: '600', color: colors.ink500 },
  price: { fontSize: 14, fontWeight: '800', color: colors.brand700 },
};

const theme = { colors, spacing, radius, shadow, typography };

export default theme;
export { colors, spacing, radius, shadow, typography };
