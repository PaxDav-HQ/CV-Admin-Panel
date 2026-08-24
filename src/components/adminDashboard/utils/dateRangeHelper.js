export const getDateRange = (rangeType) => {
  const end = new Date();
  const start = new Date();

  switch (rangeType) {
    case "Daily":
      start.setDate(end.getDate() - 1);
      break;
    case "Weekly":
      start.setDate(end.getDate() - 7);
      break;
    case "Monthly":
      start.setMonth(end.getMonth() - 1);
      break;
    case "Yearly":
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setMonth(end.getMonth() - 1);
  }

  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
};