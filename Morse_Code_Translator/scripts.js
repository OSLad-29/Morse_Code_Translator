// Morse code mappings
const morseCodeMap = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
  5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  " ": "/", ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
  "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...",
  ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-",
  "_": "..--.-", "\"": ".-..-.", "$": "...-..-", "@": ".--.-."
};

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([char, code]) => [code, char])
);

// Encode text to Morse code
function encodeText() {
  const input = document.getElementById("inputText").value.toUpperCase();
  const output = input
    .split("")
    .map(char => morseCodeMap[char] || "")
    .join(" ");
  document.getElementById("outputText").value = output;
  playMorseCode(output);
}

// Decode Morse code to text
function decodeText() {
  const input = document.getElementById("inputText").value.trim();
  const output = input
    .split(" ")
    .map(code => reverseMorseCodeMap[code] || "")
    .join("");
  document.getElementById("outputText").value = output;
}

// Play Morse code as beeps
function playMorseCode(code) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let time = audioCtx.currentTime;

  const dotTime = 0.1;
  const dashTime = dotTime * 3;

  for (let symbol of code) {
    if (symbol === ".") {
      playBeep(audioCtx, time, dotTime);
      time += dotTime + dotTime;
    } else if (symbol === "-") {
      playBeep(audioCtx, time, dashTime);
      time += dashTime + dotTime;
    } else if (symbol === "/") {
      time += dotTime * 7;
    } else {
      time += dotTime * 3;
    }
  }
}

// Create a beep
function playBeep(audioCtx, startTime, duration) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(750, startTime);
  gainNode.gain.setValueAtTime(parseFloat(document.getElementById("volumeSlider").value), startTime);
  oscillator.connect(gainNode).connect(audioCtx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

// Volume control
document.getElementById("volumeSlider").addEventListener("input", (e) => {
  volume = parseFloat(e.target.value);
});

// Brightness control (with localStorage)
const brightnessSlider = document.getElementById("brightnessRange");
const savedBrightness = localStorage.getItem("brightness");

if (savedBrightness) {
  document.body.style.setProperty("--brightness", savedBrightness);
  brightnessSlider.value = savedBrightness;
}

brightnessSlider.addEventListener("input", () => {
  const value = brightnessSlider.value;
  document.body.style.setProperty("--brightness", value);
  localStorage.setItem("brightness", value);
});

// Theme selector (dark / blue)
const themeSelect = document.getElementById("themeSelect");
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.body.classList.add(savedTheme);
  themeSelect.value = savedTheme;
}

themeSelect.addEventListener("change", (e) => {
  document.body.classList.remove("dark", "blue");
  const selected = e.target.value;
  if (selected !== "dark") {
    document.body.classList.add(selected);
  }
  localStorage.setItem("theme", selected);
});