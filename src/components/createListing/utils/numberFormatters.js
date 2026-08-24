// utils/numberFormatters.js
export const formatDisplayNumber = (val) => {
  if (!val && val !== 0) return "";
  const cleaned = String(val).replace(/,/g, "").trim();
  if (isNaN(cleaned) || cleaned === "") return "";
  return Number(cleaned).toLocaleString("en-US");
};

export const sanitizeNumericInput = (rawVal) => {
  return rawVal.replace(/[^0-9]/g, "");
};