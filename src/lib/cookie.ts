/**
 * Set a cookie with a name, value, and expiration date
 */
export function setCookie(name: string, value: string, days: number): void {
  const date = new Date();

  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/;`;
}

/**
 * Get a cookie by name
 */
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));

  const parsedCookie = cookie?.trim().split('=').at(1) ?? null;

  return parsedCookie;
}

/**
 * Remove a cookie by setting its expiration date to a past date
 */
export function removeCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=-1; Path=/;`;
}
