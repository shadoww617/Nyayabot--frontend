const chat = document.getElementById("chat-box");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let conversationContext = [];

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-msg" : "bot-msg";
  msg.innerText = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function addThinking() {
  const msg = document.createElement("div");
  msg.className = "bot-msg";
  msg.innerText = "Thinking...";
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  return msg;
}

function removeThinking(el) {
  if (el) el.remove();
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  conversationContext.push("User: " + text);
  input.value = "";

  const thinking = addThinking();

  try {
    const response = await fetchWithRetry(
      "https://shadoww617-nyayabot.hf.space/ask?query=" +
        encodeURIComponent(
          conversationContext.slice(-6).join("\n")
        ),
      2
    );

    const data = await response.json();
    removeThinking(thinking);

    if (data.answer) {
      addMessage(data.answer, "bot");
      conversationContext.push("Bot: " + data.answer);
    } else {
      addMessage("⚠️ Unexpected server response.", "bot");
    }

  } catch {
    removeThinking(thinking);
    addMessage(
      "⚠️ HuggingFace backend is sleeping or restarting. Please wait 20–30 seconds.",
      "bot"
    );
  }
}

async function fetchWithRetry(url, retries) {
  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error();
    return res;
  } catch {
    if (retries <= 0) throw new Error();
    await new Promise(r => setTimeout(r, 3000));
    return fetchWithRetry(url, retries - 1);
  }
}

sendBtn.onclick = sendMessage;

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
