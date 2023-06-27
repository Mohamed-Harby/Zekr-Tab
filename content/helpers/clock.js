import convertToArabicNumerals from "./arabicNumerals.js";

const getTimestamp = () => {
  const currentDate = new Date();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  const amOrPm = hours >= 0 && hours < 12 ? "am" : "pm";
  hours = hours % 12 || 12;
  return { hours, minutes, amOrPm };
};

const formatTime = (hours, minutes, amOrPm, format) => {
  if (format === "ar") {
    amOrPm = amOrPm === "am" ? "ص" : "م";
    return convertToArabicNumerals(
      `${hours}:${String(minutes).padStart(2, "0")} ${amOrPm}`
    );
  }
  return `${hours}:${String(minutes).padStart(2, "0")} ${amOrPm}`;
};

const setClock = (format) => {
  const clock = document.getElementById("clock");
  const updateClock = () => {
    const { hours, minutes, amOrPm } = getTimestamp();
    const formattedTime = formatTime(hours, minutes, amOrPm, format);
    clock.textContent = formattedTime;
  };
  updateClock();
  setInterval(updateClock, 60000);
};

export { setClock };
