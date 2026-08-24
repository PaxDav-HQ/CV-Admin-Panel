export const formatListingDateTime = (createdAtRaw) => {
  if (!createdAtRaw) return { date: "—", time: "" };
  const dateObj = new Date(createdAtRaw.replace(" ", "T"));
  if (isNaN(dateObj.getTime())) return { date: createdAtRaw, time: "" };

  const date = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
};