export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  const truncate = text.slice(0, maxLength);
  return truncate.slice(0, truncate.lastIndexOf(" ")) + "...";
}
