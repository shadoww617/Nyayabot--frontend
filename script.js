const chat = document.getElementById("chat");
const input = document.getElementById("userInput");

let conversationHistory = [];

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-msg" : "ai-msg";
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const thinking = document.createElement("div");
  thinking.className = "ai-msg thinking";
  thinking.textContent = "Thinking...";
  chat.appendChild(thinking);

  try {
    const response = await fetchWithRetry(
      "https://shadoww617-nyayabot.hf.space/ask",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          history: conversationHistory
        })
      },
      2
    );

    const data = await response.json();
    thinking.remove();

    addMessage(data.answer, "ai");

    conversationHistory.push(
      { role: "user", content: text },
      { role: "assistant", content: data.answer }
    );

  } catch {
    thinking.remove();
    addMessage(
      "⚠️ Server is sleeping or restarting. Please wait 20–30 seconds and try again.",
      "ai"
    );
  }
}

async function fetchWithRetry(url, options, retries) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error();
    return res;
  } catch {
    if (retries <= 0) throw new Error();
    await new Promise(r => setTimeout(r, 3000));
    return fetchWithRetry(url, options, retries - 1);
  }
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
