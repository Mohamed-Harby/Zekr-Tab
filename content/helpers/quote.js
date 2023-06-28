import duas from "../data/duas.js";

const setQuote = () => {
  const quote = duas[Math.floor(Math.random() * duas.length)]["ar"];
  document.getElementById("quote").innerText = quote;
};

export { setQuote };
