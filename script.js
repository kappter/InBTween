// Simple state
const state = {
  personA: "",
  personB: "",
  topic: "",
  round: 1,
  lastMessageFromA: ""
};

// DOM
const setupScreen = document.getElementById("setup-screen");
const circleScreen = document.getElementById("circle-screen");
const setupForm = document.getElementById("setup-form");

const sessionTitle = document.getElementById("session-title");
const roundLabel = document.getElementById("round-label");
const topicLabel = document.getElementById("topic-label");

const repAEl = document.getElementById("repA");
const repBEl = document.getElementById("repB");
const repANameEl = document.getElementById("repA-name");
const repBNameEl = document.getElementById("repB-name");

const promptText = document.getElementById("prompt-text");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const logEl = document.getElementById("log");

// Animation controls
const circle = document.getElementById("topic-circle");
const orbit = circle.querySelector(".orbit");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");

// ---- Setup ----

setupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(setupForm);
  state.personA = formData.get("personA").trim();
  state.personB = formData.get("personB").trim();
  state.topic = formData.get("topic").trim();

  repANameEl.textContent = `${state.personA}'s Rep`;
  repBNameEl.textContent = `${state.personB}'s Rep`;
  topicLabel.textContent = state.topic;
  sessionTitle.textContent = `${state.personA} & ${state.personB}`;
  state.round = 1;
  state.lastMessageFromA = "";
  logEl.innerHTML = "";
  messageInput.disabled = false;
  pauseBtn.textContent = "Pause";

  setupScreen.classList.remove("active");
  circleScreen.classList.add("active");

  updateRoundUI();
  // Optionally auto-start animation when dialogue begins
  startAnimation();
});

// ---- Dialogue flow ----

function updateRoundUI() {
  if (state.round === 1) {
    roundLabel.textContent = "Round 1: Rep A shares";
    promptText.textContent =
      `Speaking as ${state.personA}'s representative, describe what has been happening for them around “${state.topic}”. Use third person (“they…”).`;
    setActiveRep("A");
  } else if (state.round === 2) {
    roundLabel.textContent = "Round 2: Rep B mirrors";
    promptText.textContent =
      `Speaking as ${state.personB}'s representative, mirror what you heard about ${state.personA}. Start with “If I got it, I think you said…” and ask “Is there more?” when you are done.`;
    setActiveRep("B");
  } else {
    roundLabel.textContent = "Done for now";
    promptText.textContent =
      "You’ve completed two rounds. If you like, you can now talk in your own voices without the app.";
    messageInput.disabled = true;
    setActiveRep(null);
    stopAnimation();
  }
}

function setActiveRep(which) {
  repAEl.classList.toggle("active", which === "A");
  repBEl.classList.toggle("active", which === "B");
}

// Messages
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  if (state.round === 1) {
    addLogEntry("A", repANameEl.textContent, text);
    state.lastMessageFromA = text;
    state.round = 2;
    updateRoundUI();
  } else if (state.round === 2) {
    addLogEntry("B", repBNameEl.textContent, text);
    state.round = 3;
    updateRoundUI();
  }

  messageInput.value = "";
  messageInput.focus();
});

function addLogEntry(side, speakerLabel, text) {
  const entry = document.createElement("div");
  entry.className = `log-entry rep${side}`;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = speakerLabel;

  const body = document.createElement("div");
  body.className = "text";
  body.textContent = text;

  entry.appendChild(meta);
  entry.appendChild(body);
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

// ---- Animation controls ----

function setPlayState(state) {
  circle.style.animationPlayState = state;
  orbit.style.animationPlayState = state;
}

function startAnimation() {
  circle.classList.remove("animating");
  void circle.offsetWidth; // force reflow
  circle.classList.add("animating");
  setPlayState("running");
  pauseBtn.textContent = "Pause";
}

function pauseAnimation() {
  const current = getComputedStyle(circle).animationPlayState;
  const next = current === "running" ? "paused" : "running";
  setPlayState(next);
  pauseBtn.textContent = next === "running" ? "Pause" : "Resume";
}

function stopAnimation() {
  circle.classList.remove("animating");
  circle.style.animationPlayState = "";
  orbit.style.animationPlayState = "";
  pauseBtn.textContent = "Pause";
}

// Bind buttons
startBtn.addEventListener("click", startAnimation);
pauseBtn.addEventListener("click", pauseAnimation);
stopBtn.addEventListener("click", stopAnimation);
