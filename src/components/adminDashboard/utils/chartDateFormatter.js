export const formatChartDate = (dateStr) => {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr.replace(" ", "T"));
  if (isNaN(dateObj.getTime())) return dateStr;

  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};