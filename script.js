const API_URL = "https://shadoww617-nyayabot.hf.space/ask";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("queryInput");
const askBtn = document.getElementById("askBtn");
const languageBox = document.getElementById("language");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addLawCard(text) {
  const div = document.createElement("div");
  div.className = "law-card";
  div.innerText = text;
  chatBox.appendChild(div);
}

async function askQuestion() {
  const query = input.value.trim();
  if (!query) return;

  addMessage(query, "user");
  input.value = "";

  addMessage("Thinking...", "bot");

  try {
    const response = await fetch(
      `${API_URL}?query=${encodeURIComponent(query)}`,
      { method: "POST" }
    );

    const data = await response.json();

    // remove "Thinking..."
    chatBox.lastChild.remove();

    // MAIN FIX — these keys exist
    addMessage(data.answer, "bot");

    languageBox.innerText =
      "Detected language: " + (data.language || "unknown");

  } catch (err) {
    chatBox.lastChild.remove();
    addMessage("Server not responding. Try again.", "bot");
  }
}

askBtn.addEventListener("click", askQuestion);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askQuestion();
  }
});
