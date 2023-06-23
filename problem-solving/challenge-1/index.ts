export const numbersFractionCalculator = (numbers: number[]) => {
  let positives = 0;
  let negative = 0;
  let zeros = 0;
  numbers.forEach(num => {
    if (num > 0) {
      positives++;
    } else if (num < 0) {
      negative++;
    } else if (num === 0){
      zeros++;
    }
  });

  return {
      positives: (positives / numbers.length).toFixed(6),
      negative: (negative / numbers.length).toFixed(6),
      zeros: (zeros / numbers.length).toFixed(6),
  };
};
