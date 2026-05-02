export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}