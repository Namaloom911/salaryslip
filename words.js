function numberToWords(num) {
    if (num === 0) return "Zero";
  
    const belowTwenty = [
      "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
    ];
  
    const tens = [
      "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];
  
    const scales = ["Thousand", "Million"];
  
    function convertToWords(n) {
      if (n < 20) {
        return belowTwenty[n - 1];
      } else if (n < 100) {
        const tensPart = tens[Math.floor(n / 10) - 2];
        const unitsPart = n % 10 === 0 ? "" : " " + belowTwenty[n % 10 - 1];
        return tensPart + unitsPart;
      } else if (n < 1000) {
        const hundredsPart = belowTwenty[Math.floor(n / 100) - 1] + " Hundred";
        const remainderPart = n % 100 === 0 ? "" : " " + convertToWords(n % 100);
        return hundredsPart + remainderPart;
      }
    }
  
    let result = "";
    let scaleIndex = -1;
  
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        const chunkInWords = convertToWords(chunk);
        const scale = scaleIndex >= 0 ? " " + scales[scaleIndex] : "";
        result = chunkInWords + scale + (result ? " " + result : "");
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }
  
    return result.trim();
  }
  
  export default numberToWords;
  