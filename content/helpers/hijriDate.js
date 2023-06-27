import convertToArabicNumerals from "./arabicNumerals.js";

const hijriDateFormatters = {
  ar: new Intl.DateTimeFormat("ar", {
    calendar: "islamic-umalqura",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }),
  en: new Intl.DateTimeFormat("en", {
    calendar: "islamic-umalqura",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }),
};

const getHijriDate = (format) => {
  const currentDate = new Date();
  const hijriDateFormatter =
    hijriDateFormatters[format] || hijriDateFormatters.en;
  return hijriDateFormatter.format(currentDate);
};

const getArabicFormattedHijriDate = (format) => {
  const hijriDate = getHijriDate(format);
  return convertToArabicNumerals(hijriDate);
};

const setHijriDate = (format) => {
  const hijriDateElement = document.getElementById("hijriDate");

  const updateHijriDate = () => {
    const hijriDate =
      format === "ar"
        ? getArabicFormattedHijriDate(format)
        : getHijriDate(format);
    hijriDateElement.textContent = hijriDate;
  };

  updateHijriDate();
  setInterval(updateHijriDate, 60000);
};

export { setHijriDate };
