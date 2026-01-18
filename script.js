const form = document.getElementById("regForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const nameField = document.getElementById("nameField");
const emailField = document.getElementById("emailField");
const passwordField = document.getElementById("passwordField");

const pet = document.getElementById("pet");
const petCaption = document.getElementById("petCaption");

const modalOverlay = document.getElementById("modalOverlay");
const modalOk = document.getElementById("modalOk");

/*  mood meter */
const moodFill = document.getElementById("moodFill");
const moodLabel = document.getElementById("moodLabel");

/*  encouragement */
const encourageText = document.getElementById("encourageText");

/*password tips */
const passTipsWrap = document.getElementById("passTipsWrap");
const tipLen = document.getElementById("tipLen");
const tipLetter = document.getElementById("tipLetter");
const tipNumber = document.getElementById("tipNumber");

/* sound toggle */
const soundToggle = document.getElementById("soundToggle");

/* Better email pattern */
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|in|co|io)$/;

const touched = { name: false, email: false, password: false };

/* AUDIO (Web Audio API)*/
let audioCtx = null;
let audioReady = false;

function initAudio() {
  if (audioReady) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioReady = true;
}

function playTone({ freq = 440, duration = 0.08, type = "sine", gain = 0.06 }) {
  if (!soundToggle?.checked) return;
  if (!audioReady) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(g);
  g.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function soundPop() {
  playTone({ freq: 620, duration: 0.06, type: "triangle", gain: 0.05 });
}

function soundSuccess() {
  playTone({ freq: 523.25, duration: 0.09, type: "sine", gain: 0.06 });
  setTimeout(() => playTone({ freq: 659.25, duration: 0.09, type: "sine", gain: 0.06 }), 110);
  setTimeout(() => playTone({ freq: 783.99, duration: 0.10, type: "sine", gain: 0.06 }), 220);
}

["click", "keydown", "touchstart"].forEach(evt => {
  document.addEventListener(evt, () => {
    initAudio();
    if (audioCtx?.state === "suspended") audioCtx.resume();
  }, { once: true });
});


/* encouragement messages */
let lastEncourageAt = 0;

const encourageMessages = {
  start: [
    "Tip: Start with your name ✨",
    "Let’s do this! Your name first 🐾",
    "Hello human! Type your name 😄"
  ],
  nameDone: [
    "Nice name! Now your email 📩",
    "Great! Email next 📨",
    "Looking good! Add your email 💌"
  ],
  emailDone: [
    "Almost there! Create a password 🔒",
    "One step left — password time 😎",
    "Now set a password to protect your account 🛡️"
  ],
  allDone: [
    "Yay! You’re ready to join! 🎉",
    "Everything looks perfect! Click Join 💖",
    "Dog is happy now! Submit ✅🐶"
  ],
  fixError: [
    "Oops! Fix that and you’re good 💡",
    "Almost! Just a tiny correction ✨",
    "You’ve got this — fix the field 💪"
  ]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setEncouragement(text) {
  const now = Date.now();
  if (now - lastEncourageAt < 450) return;
  lastEncourageAt = now;
  encourageText.textContent = text;
}

/* validation */
function validateName(showError = true) {
  const ok = nameInput.value.trim() !== "";
  if (showError) nameError.textContent = ok ? "" : "Name is required";
  return ok;
}

function validateEmail(showError = true) {
  const ok = emailPattern.test(emailInput.value.trim());
  if (showError) emailError.textContent = ok ? "" : "Enter a valid email (e.g. name@gmail.com)";
  return ok;
}

function validatePassword(showError = true) {
  const ok = passwordInput.value.length >= 6;
  if (showError) passwordError.textContent = ok ? "" : "Minimum 6 characters required";
  return ok;
}

function allTouched() {
  return touched.name && touched.email && touched.password;
}

function setFieldState(fieldDiv, input, isValid, isTouched) {
  if (isTouched && isValid) {
    fieldDiv.classList.add("valid");
    input.classList.add("valid");
  } else {
    fieldDiv.classList.remove("valid");
    input.classList.remove("valid");
  }
}

/* password tips */
function updatePasswordTips() {
  const val = passwordInput.value;
  const hasLen = val.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(val);
  const hasNumber = /[0-9]/.test(val);

  tipLen.textContent = (hasLen ? "✅" : "❌") + " At least 6 characters";
  tipLetter.textContent = (hasLetter ? "✅" : "❌") + " Contains a letter (A–Z)";
  tipNumber.textContent = (hasNumber ? "✅" : "❌") + " Contains a number (0–9)";

  tipLen.classList.toggle("done", hasLen);
  tipLetter.classList.toggle("done", hasLetter);
  tipNumber.classList.toggle("done", hasNumber);
}

/* mood meter */
function updateMoodMeter(nameOk, emailOk, passOk) {
  let score = 0;
  if (nameOk) score++;
  if (emailOk) score++;
  if (passOk) score++;

  const percent = Math.round((score / 3) * 100);
  moodFill.style.width = percent + "%";
  moodLabel.textContent = `Mood: ${percent}%`;
  return percent;
}

function setPetMood(isValid) {
  pet.classList.remove("bounce");

  if (isValid) {
    pet.classList.add("happy");
    pet.classList.remove("sad");
    petCaption.textContent = "Yay! You can submit now 🎉";

    if (allTouched()) pet.classList.add("show-love");
    else pet.classList.remove("show-love");
  } else {
    pet.classList.add("sad");
    pet.classList.remove("happy");
    pet.classList.remove("show-love");
    petCaption.textContent = "Fill the form to make me happy!";
  }
}

let prevState = { nameOk: false, emailOk: false, passOk: false };

function checkForm() {
  const nameOk = validateName(touched.name);
  const emailOk = validateEmail(touched.email);
  const passOk = validatePassword(touched.password);

  setFieldState(nameField, nameInput, nameOk, touched.name);
  setFieldState(emailField, emailInput, emailOk, touched.email);
  setFieldState(passwordField, passwordInput, passOk, touched.password);

  
  if (passTipsWrap.classList.contains("show")) {
    updatePasswordTips();
  }

  const percent = updateMoodMeter(nameOk, emailOk, passOk);

  const valid = nameOk && emailOk && passOk;
  submitBtn.disabled = !valid;

  setPetMood(valid);

  // audio pop on first-time valid
  if (!prevState.nameOk && nameOk) soundPop();
  if (!prevState.emailOk && emailOk) soundPop();
  if (!prevState.passOk && passOk) soundPop();

  // encouragement logic
  const becameInvalid =
    (prevState.nameOk && !nameOk && touched.name) ||
    (prevState.emailOk && !emailOk && touched.email) ||
    (prevState.passOk && !passOk && touched.password);

  const becameValid =
    (!prevState.nameOk && nameOk) ||
    (!prevState.emailOk && emailOk) ||
    (!prevState.passOk && passOk);

  if (becameInvalid) {
    setEncouragement(pick(encourageMessages.fixError));
  } else if (valid) {
    setEncouragement(pick(encourageMessages.allDone));
  } else if (becameValid) {
    if (nameOk && !emailOk) setEncouragement(pick(encourageMessages.nameDone));
    else if (nameOk && emailOk && !passOk) setEncouragement(pick(encourageMessages.emailDone));
    else setEncouragement(pick(encourageMessages.start));
  } else {
    if (percent === 0) setEncouragement(pick(encourageMessages.start));
    else if (nameOk && !emailOk) setEncouragement(pick(encourageMessages.nameDone));
    else if (nameOk && emailOk && !passOk) setEncouragement(pick(encourageMessages.emailDone));
  }

  prevState = { nameOk, emailOk, passOk };
}

/* show/hide password tips */
function showPassTips() {
  passTipsWrap.classList.add("show");
  updatePasswordTips(); 
}

function hidePassTipsIfEmpty() {
  if (passwordInput.value.trim() === "") {
    passTipsWrap.classList.remove("show");
  }
}

passwordInput.addEventListener("focus", showPassTips);
passwordInput.addEventListener("input", showPassTips);
passwordInput.addEventListener("blur", hidePassTipsIfEmpty);

/* events */
[nameInput, emailInput, passwordInput].forEach((input) => {
  input.addEventListener("blur", () => {
    touched[input.id] = true;
    checkForm();
  });

  input.addEventListener("input", () => {
    initAudio();
    checkForm();
  });
});

submitBtn.addEventListener("mouseenter", () => {
  if (!submitBtn.disabled) {
    pet.classList.remove("wag");
    void pet.offsetWidth;
    pet.classList.add("wag");
  }
});

/* modal helpers */
function openModal() {
  modalOverlay.classList.add("show");
  modalOk.focus();
}

function closeModal() {
  modalOverlay.classList.remove("show");
}

modalOk.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("show")) closeModal();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  touched.name = touched.email = touched.password = true;

  checkForm();

  if (!submitBtn.disabled) {
    pet.classList.remove("bounce");
    void pet.offsetWidth;
    pet.classList.add("bounce");

    soundSuccess();
    openModal();

    form.reset();
    touched.name = touched.email = touched.password = false;

    // reset UI states
    nameField.classList.remove("valid"); nameInput.classList.remove("valid");
    emailField.classList.remove("valid"); emailInput.classList.remove("valid");
    passwordField.classList.remove("valid"); passwordInput.classList.remove("valid");

    pet.classList.remove("show-love");
    passTipsWrap.classList.remove("show");

    // reset messages
    encourageText.textContent = "Tip: Start with your name ✨";
    petCaption.textContent = "Fill the form to make me happy!";

    prevState = { nameOk: false, emailOk: false, passOk: false };
    checkForm();
  }
});

/* initialize */
checkForm();

/* toggle label text */
if (soundToggle) {
  soundToggle.addEventListener("change", () => {
    const label = soundToggle.closest(".sound-toggle");
    if (label) label.lastChild.textContent = soundToggle.checked ? " 🔊 Sounds ON" : " 🔇 Sounds OFF";
  });
}
