export const formatNaira = (amount, { showDecimals = false } = {}) => {
  const numericValue = Number(amount) || 0;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(numericValue);
};