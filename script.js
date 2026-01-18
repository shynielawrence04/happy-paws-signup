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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const touched = { name: false, email: false, password: false };

function validateName(showError = true) {
  const ok = nameInput.value.trim() !== "";
  if (showError) nameError.textContent = ok ? "" : "Name is required";
  return ok;
}

function validateEmail(showError = true) {
  const ok = emailPattern.test(emailInput.value.trim());
  if (showError) emailError.textContent = ok ? "" : "Enter a valid email";
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

/* Toggle green borderrand tick icon */
function setFieldState(fieldDiv, input, isValid, isTouched) {
  if (isTouched && isValid) {
    fieldDiv.classList.add("valid");
    input.classList.add("valid");
  } else {
    fieldDiv.classList.remove("valid");
    input.classList.remove("valid");
  }
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

function checkForm() {
  const nameOk = validateName(touched.name);
  const emailOk = validateEmail(touched.email);
  const passOk = validatePassword(touched.password);

  setFieldState(nameField, nameInput, nameOk, touched.name);
  setFieldState(emailField, emailInput, emailOk, touched.email);
  setFieldState(passwordField, passwordInput, passOk, touched.password);

  const valid = nameOk && emailOk && passOk;
  submitBtn.disabled = !valid;

  setPetMood(valid);
}

[nameInput, emailInput, passwordInput].forEach((input) => {
  input.addEventListener("blur", () => {
    touched[input.id] = true;
    checkForm();
  });

  input.addEventListener("input", () => {
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

/* Model-helpers */
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

    openModal();

    form.reset();
    touched.name = touched.email = touched.password = false;

    // removing success states after reset
    nameField.classList.remove("valid"); nameInput.classList.remove("valid");
    emailField.classList.remove("valid"); emailInput.classList.remove("valid");
    passwordField.classList.remove("valid"); passwordInput.classList.remove("valid");

    pet.classList.remove("show-love");
    checkForm();
  }
});

// Initializing
checkForm();
