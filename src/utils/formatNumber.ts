function _stripInsignificantZeros(str: string, decimal: string) {
  const parts = str.split(decimal);
  const integerPart = parts[0];
  const decimalPart = parts[1].replace(/0+$/, '');

  if (decimalPart.length > 0) {
    return integerPart + decimal + decimalPart;
  }

  return integerPart;
}

function toFixed(value: number, precision: number): string {
  const power = Math.pow(10, precision);

  // Multiply up by precision, round accurately, then divide and use native toFixed():
  return (Math.round((value + 1e-8) * power) / power).toFixed(precision);
}

interface FormatOptions {
  precision: number;  // default precision on numbers is 0
  thousand: string;
  decimal: string;
  stripZeros: boolean;
}

export function formatNumber(number: number, opts: Partial<FormatOptions> = {}): string {
  let options: FormatOptions = {
    decimal: '.',       // decimal point separator
    thousand: ',',      // thousands separator
    precision: 2,       // decimal places
    stripZeros: false,  // strip insignificant zeros from decimal part
    ...opts,
  }

  const negative = number < 0 ? '-' : '';
  const base = parseInt(toFixed(Math.abs(number), options.precision), 10) + '';
  const mod = base.length > 3 ? base.length % 3 : 0;

  const formatted = negative +
    (mod ? base.substr(0, mod) + options.thousand : '') +
    base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1' + options.thousand) +
    (options.precision > 0 ? options.decimal + toFixed(Math.abs(number), options.precision).split('.')[1] : '');

  return options.stripZeros ? _stripInsignificantZeros(formatted, options.decimal) : formatted;
}
