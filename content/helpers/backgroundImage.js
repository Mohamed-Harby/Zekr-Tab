const setBackgroundImage = () => {
  const imagePath = chrome.runtime.getURL("../data/background/back-dark.jpg");

  const image = new Image();
  image.src = imagePath;
  const imageElement = document.getElementById("natureImage");
  imageElement.style.display = "none";

  image.addEventListener("load", function () {
    imageElement.src = image.src;
    imageElement.style.display = "block";
  });
};

export { setBackgroundImage };
