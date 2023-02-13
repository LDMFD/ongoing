export const CurrencyFromString = (n) => {
    let point = n.indexOf('.');
    let pence = 0;
    if (point !== -1) {
        let n2 = n.substring(0, point) + n.substring(n.length-2);
        pence = parseInt(n2);
    } else {
        pence = parseInt(n);
        pence *= 100;
    }
    return pence;
}

export const CurrencyToString = (n) => (
    `${parseInt(n) / 100}`
);

export const FormatCurrency = (n) => (
    CurrencyFormatter.format(n / 100)
)

export const FormatCurrencyPence = (n) => {
    let s = CurrencyFormatterPence.format(n / 100);
    if (s.match(/\.00/)) {
        return s.substring(0, s.length - 3);
    }
    return s;
};

export const FormatPercent = (n) => (
    `${PercentageFormatter.format(n)}%`
);

export const FormatCharge = (percent, charge) => {
    let res = isNaN(charge) ? '-' : FormatCurrencyPence(charge);
    let pct = isNaN(percent) ? null : FormatPercent(percent);
    if (pct !== null && !isNaN(charge)) {
        res += ` (${pct})`;
    }
    return res;
}

const CurrencyFormatter = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
  
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const CurrencyFormatterPence = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
  
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const PercentageFormatter = new Intl.NumberFormat('en-UK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});
