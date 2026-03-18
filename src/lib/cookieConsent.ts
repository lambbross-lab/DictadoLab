export type CookieConsent = 'accepted' | 'rejected' | null;

const COOKIE_CONSENT_KEY = 'dictadolab_cookie_consent';

export function getCookieConsent(): CookieConsent {
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === 'accepted' || value === 'rejected') return value;
  return null;
}

export function setCookieConsent(value: Exclude<CookieConsent, null>) {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new Event('cookie-consent-updated'));
}

export function clearCookieConsent() {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.dispatchEvent(new Event('cookie-consent-updated'));
}