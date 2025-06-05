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
  Object.entries(morseCodeMap).map(([k, v]) => [v, k])
);

function encodeText() {
  const input = document.getElementById("inputText").value.toUpperCase();
  const output = input.split("").map(char => morseCodeMap[char] || "").join(" ");
  document.getElementById("outputText").value = output;
  playMorseCode(output);
}

function decodeText() {
  const input = document.getElementById("inputText").value.trim();
  const output = input.split(" ").map(code => reverseMorseCodeMap[code] || "").join("");
  document.getElementById("outputText").value = output;
}

function playMorseCode(code) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let time = audioCtx.currentTime;

  const dotTime = 0.1;
  const dashTime = dotTime * 3;
  const volume = parseFloat(document.getElementById("volumeSlider").value);

  for (let symbol of code) {
    if (symbol === ".") {
      playBeep(audioCtx, time, dotTime, volume);
      time += dotTime + dotTime;
    } else if (symbol === "-") {
      playBeep(audioCtx, time, dashTime, volume);
      time += dashTime + dotTime;
    } else if (symbol === "/") {
      time += dotTime * 7;
    } else {
      time += dotTime * 3;
    }
  }
}

function playBeep(audioCtx, startTime, duration, volume) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(750, startTime);
  gainNode.gain.setValueAtTime(volume, startTime);
  oscillator.connect(gainNode).connect(audioCtx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

// Theme switcher logic
document.getElementById("themeSelect").addEventListener("change", (e) => {
  const theme = e.target.value;
  document.body.className = ""; // Clear all theme classes
  if (theme === "blue") {
    document.body.classList.add("theme-blue");
  } else if (theme === "solarized") {
    document.body.classList.add("theme-solarized");
  }
});
