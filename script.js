const STORAGE_QUEUES = "queues";
const STORAGE_COUNTERS = "counters";

let queues = JSON.parse(localStorage.getItem(STORAGE_QUEUES) || "[]");
let counters = JSON.parse(localStorage.getItem(STORAGE_COUNTERS) || JSON.stringify({
  ML: 1, CD: 1, PB: 1, HK: 1
}));
let selectedService = "";

const prefixes = {
  "Mobile Legends: Bang Bang": "ML",
  "Call of Duty: Mobile": "CD",
  "PUBG Mobile": "PB",
  "Honor of Kings": "HK"
};

const serviceButtons = document.querySelectorAll(".service-btn");
const queueForm = document.getElementById("queueForm");

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    serviceButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    selectedService = button.dataset.service;
    showError("");
  });
});

queueForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getNumber();
});

function showError(message) {
  document.getElementById("errorMessage").textContent = message;
}

function getNumber() {
  if (!selectedService) {
    showError("Please select a game first.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const gameId = document.getElementById("gameId").value.trim();
  const serverId = document.getElementById("serverId").value.trim();

  if (!name || !email || !gameId || !serverId) {
    showError("Please complete all fields before getting a queue number.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showError("Please enter a valid email address.");
    document.getElementById("customerEmail").focus();
    return;
  }

  const prefix = prefixes[selectedService];
  const number = `${prefix}-${String(counters[prefix]).padStart(3, "0")}`;

  const newQueue = {
    number,
    service: selectedService,
    name,
    email,
    gameId,
    serverId,
    status: "Waiting",
    createdAt: new Date().toISOString()
  };

  queues.push(newQueue);
  counters[prefix] += 1;

  localStorage.setItem(STORAGE_QUEUES, JSON.stringify(queues));
  localStorage.setItem(STORAGE_COUNTERS, JSON.stringify(counters));

  document.getElementById("myNumber").textContent = number;
  document.getElementById("myName").textContent = name;
  document.getElementById("myEmail").textContent = email;
  document.getElementById("myService").textContent = selectedService;
  document.getElementById("myGameId").textContent = gameId;
  document.getElementById("myServerId").textContent = serverId;
  document.getElementById("myStatus").textContent = "Waiting";

  document.getElementById("servicePage").classList.add("hidden");
  document.getElementById("ticketPage").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showServices() {
  document.getElementById("ticketPage").classList.add("hidden");
  document.getElementById("servicePage").classList.remove("hidden");
  queueForm.reset();
  selectedService = "";
  serviceButtons.forEach((button) => button.classList.remove("selected"));
  showError("");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
