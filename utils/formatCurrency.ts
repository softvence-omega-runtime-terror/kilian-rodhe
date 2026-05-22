export const formatCurrency = (amount: number | string): string => {
  let numericAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^0-9.-]+/g, ""))
    : amount;
  
  if (isNaN(numericAmount) || numericAmount == null) {
    return '0,00 €';
  }
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(numericAmount);
};
