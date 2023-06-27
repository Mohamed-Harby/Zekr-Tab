// Function to convert English numerals to Arabic numerals
function convertToArabicNumerals(string) {
  console.log("string: " + string);
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(string).replace(
    /\d/g,
    (digit) => arabicNumerals[Number(digit)]
  );
}

export default convertToArabicNumerals;
