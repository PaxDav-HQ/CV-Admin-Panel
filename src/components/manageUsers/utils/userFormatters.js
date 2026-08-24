export const formatDateTime = (dateString) => {
  if (!dateString) return { date: "—", time: "" };
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return { date: dateString, time: "" };

  const date = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
};