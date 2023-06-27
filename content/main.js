import convertToArabicNumerals from "./helpers/arabicNumerals.js";

import { setHijriDate } from "./helpers/hijriDate.js";
import { setBackgroundImage } from "./helpers/backgroundImage.js";
import { setQuote } from "./helpers/quote.js";
import { setClock } from "./helpers/clock.js";

// Set the Hijri date in the HTML elements

setBackgroundImage();
setClock("ar");
setHijriDate("ar");
setQuote();

const zekrButton = document.getElementById("zekrButton");
const zekrCounter = document.getElementById("zekrCounter");
zekrCounter.textContent = convertToArabicNumerals(0);

let counter = parseInt(zekrCounter.textContent) || 0;

zekrButton.addEventListener("click", () => {
  if (counter >= 999) {
    counter = 0;
  }
  counter++;
  zekrCounter.textContent = convertToArabicNumerals(counter.toString());
  zekrCounter.classList.add("increase");
  zekrButton.classList.add("clicked");

  // Remove the class after a delay to reset the animation
  setTimeout(() => {
    zekrCounter.classList.remove("increase");
    zekrButton.classList.remove("clicked");
  }, 220);
});

const azkar = [
  "سُبْحَانَ اللهِ",
  "الْحَمْدُ للهِ",
  "اللهُ أَكْبَرُ",
  "لَا إِلَهَ إِلَّا اللهُ",
  "أَسْتَغْفِرُ اللهَ",
  "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
  "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
];

let idx = Math.floor(Math.random() * azkar.length);
zekrButton.innerText = azkar[idx];

const rightArrow = document.getElementById("zekrChangeImageRight");
const leftArrow = document.getElementById("zekrChangeImageLeft");

rightArrow.addEventListener("click", () => {
  idx++;
  if (idx >= azkar.length) {
    idx = 0;
  }
  zekrButton.innerText = azkar[idx];
  zekrCounter.textContent = convertToArabicNumerals(0);
  counter = 0;
});

leftArrow.addEventListener("click", () => {
  idx--;
  if (idx < 0) {
    idx = azkar.length - 1;
  }
  zekrButton.innerText = azkar[idx];
  zekrCounter.textContent = convertToArabicNumerals(0);
  counter = 0;
});

// Azan

// Azan

const getLocation = () => {
  return new Promise((resolve, reject) => {
    // Check if the Geolocation API is supported by the browser
    if (navigator.geolocation) {
      // Request the user's location
      navigator.geolocation.getCurrentPosition(
        function (position) {
          // Extract latitude and longitude from the position object
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Use the latitude and longitude values
          console.log("Latitude: " + latitude);
          console.log("Longitude: " + longitude);

          // Resolve the promise with the obtained coordinates
          resolve({ latitude, longitude });
        },
        function (error) {
          console.log(
            "An error occurred while retrieving location: " + error.message
          );
          reject(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      reject(new Error("Geolocation is not supported."));
    }
  });
};

// Function to get prayer times using the latitude and longitude
function getPrayerTimes(latitude, longitude) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return new Promise((resolve, reject) => {
    const url = `http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=5`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let prayerTimes = data.data[day - 1].timings;
        // keep only main prayers
        prayerTimes = Object.keys(prayerTimes).filter((prayer) => {
          return (
            prayer === "Fajr" ||
            prayer === "Dhuhr" ||
            prayer === "Asr" ||
            prayer === "Maghrib" ||
            prayer === "Isha" ||
            prayer === "Sunrise"
          );
        });
        // Convert the prayer times array to an object
        prayerTimes = prayerTimes.reduce((obj, prayer) => {
          obj[prayer] = data.data[day - 1].timings[prayer];
          return obj;
        }, {});
        console.log("prayerTimes", prayerTimes);
        resolve(prayerTimes); // Resolve the Promise with the prayer times
      })
      .catch((error) => {
        console.log("An error occurred:", error);
        reject(error); // Reject the Promise with the error
      });
  });
}

// Example usage with asynchronous code
// getLocation();
//   .then(({ latitude, longitude }) => {
//     getPrayerTimes(latitude, longitude);
//   })
//   .catch((error) => {
//     console.log("Error:", error);
//   });

const prayerTimesAsync = async () => {
  const { longitude, latitude } = await getLocation();
  const times = await getPrayerTimes(latitude, longitude);
  console.log("times", times);
  return times;
};

const stringToTimeinMS = (stringTime) => {
  // ignore what is after the first space
  stringTime = stringTime.split(" ")[0];
  const time = stringTime.split(":");
  const date = new Date();
  date.setHours(time[0]);
  date.setMinutes(time[1]);
  const timeInMilliseconds = date.getTime();
  return timeInMilliseconds;
};

const nextPrayerAsync = async () => {
  const times = await prayerTimesAsync();
  console.log("times", times);
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prayerTimesArray = Object.entries(times);

  const nextPrayer = prayerTimesArray.find((prayer) => {
    const prayerTimeInMilliseconds = stringToTimeinMS(prayer[1]);
    return prayerTimeInMilliseconds > currentTime;
  });
  return nextPrayer;
};

const prayerNameToArabic = (prayerName) => {
  switch (prayerName) {
    case "Asr":
      return "العصر";
    case "Dhuhr":
      return "الظهر";
    case "Fajr":
      return "الفجر";
    case "Firstthird":
      return "الثلث الأول من الليل";
    case "Imsak":
      return "الإمساك";
    case "Isha":
      return "العشاء";
    case "Lastthird":
      return "الثلث الأخير من الليل";
    case "Maghrib":
      return "المغرب";
    case "Midnight":
      return "منتصف الليل";
    case "Sunrise":
      return "الشروق";
    case "Sunset":
      return "الغروب";
  }
};

const nextPrayerName = document.getElementById("nextPrayerName");
const nextPrayerRemainingTime = document.getElementById(
  "nextPrayerRemainingTime"
);

const getTimeDifference = (time) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prayerTimeInMilliseconds = stringToTimeinMS(time);
  const timeDifference = prayerTimeInMilliseconds - currentTime;
  return timeDifference;
};
const updateNextPrayer = async () => {
  const nextPrayer = await nextPrayerAsync();
  const nextPrayerArabicName = prayerNameToArabic(nextPrayer[0]);
  const timeDifference = getTimeDifference(nextPrayer[1].split(" ")[0]);
  const timeDifferenceInMinutes = Math.floor(timeDifference / 60000);
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
  const timeDifferenceInMinutesRemainder = timeDifferenceInMinutes % 60;
  const timeDifferenceInHoursArabic = convertToArabicNumerals(
    "-" +
      timeDifferenceInHours.toString() +
      ":" +
      timeDifferenceInMinutesRemainder
  );
  nextPrayerRemainingTime.textContent = timeDifferenceInHoursArabic;
  nextPrayerName.textContent = nextPrayerArabicName + " بعد";
  if (timeDifferenceInHours === 0 && timeDifferenceInMinutesRemainder < 30) {
    nextPrayerRemainingTime.style.color = "red";
  }
};

const updatePrayerInfo = async () => {
  await updateNextPrayer();
};

// Call updatePrayerInfo immediately
updatePrayerInfo();

// Update prayer info every minute
setInterval(updatePrayerInfo, 60000);

const allPrayers = document.getElementById("allPrayers");

const updateAllPrayers = async () => {
  const times = await prayerTimesAsync();
  const prayerTimesArray = Object.entries(times);
  console.log("prayerTimesArray", prayerTimesArray);
  const prayerTimesArrayArabic = prayerTimesArray.map((prayer) => {
    const prayerName = prayerNameToArabic(prayer[0]);
    const prayerTime = prayer[1].split(" ")[0];
    console.log("prayerName", prayerName);
    console.log("prayerTime", prayerTime);
    return [prayerName, prayerTime];
  });
  allPrayers.innerHTML = "";
  const prayers = [];
  prayerTimesArrayArabic.forEach((prayer) => {
    console.log("prayer", prayer);
    const prayerName = prayer[0];
    const prayerTime = prayer[1];
    const prayerElement = document.createElement("div");
    prayerElement.id = "prayer";
    prayerElement.innerHTML = `<div class="prayerName">${prayerName}</div><div class="prayerTime">${prayerTime}</div>`;
    prayers.push(prayerElement);
  });
  for (let i = 0; i < prayers.length; i++) {
    console.log("prayers[i]", prayers[i]);
    allPrayers.appendChild(prayers[i]);
  }
};

const nextPrayerContainer = document.getElementById("nextPrayerContainer");
const nextPrayer = document.getElementById("nextPrayer");
// const allPrayers = document.getElementById("allPrayers");

nextPrayer.addEventListener("click", () => {
  nextPrayer.style.display = "none";
  allPrayers.style.display = "flex";
  nextPrayerContainer.style.width = "350px";
  updateAllPrayers();
});

allPrayers.addEventListener("click", () => {
  allPrayers.style.display = "none";
  nextPrayer.style.display = "flex";
  nextPrayerContainer.style.width = "150px";
});
