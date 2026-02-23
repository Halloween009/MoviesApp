export function getRatingColor(rating: number | undefined) {
  if (typeof rating !== "number" || isNaN(rating)) return;
  if (rating <= 3) return "#E90000";
  if (rating > 3 && rating <= 5) return "#E97E00";
  if (rating > 5 && rating <= 7) return "#E9D100";
  if (rating > 7) return "#66E900";
}
