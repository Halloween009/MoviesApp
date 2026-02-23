export function getGuestSessionId() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )guest_session_id=([^;]*)/);
  return match ? match[1] : "";
}
