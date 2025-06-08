export function getErrorUid(input: string): string {
  return window.btoa(encodeURIComponent(input));
}
