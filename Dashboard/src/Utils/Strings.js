export const CurrencyFormatter = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
  
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const CurrencyFormatterPence = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
  
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
