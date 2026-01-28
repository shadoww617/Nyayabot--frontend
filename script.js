const chat = document.getElementById("chat");
const input = document.getElementById("userInput");

/* ============================
   Add Message
============================ */

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-msg" : "bot-msg";
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

/* ============================
   Send Message
============================ */

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const thinkingId = addThinking();

  try {
    const response = await fetchWithRetry(
      "https://shadoww617-nyayabot.hf.space/ask?query=" +
        encodeURIComponent(text),
      2
    );

    const data = await response.json();

    removeThinking(thinkingId);

    if (data.answer) {
      addMessage(data.answer, "bot");
    } else {
      addMessage(
        "⚠️ Server returned an unexpected response.",
        "bot"
      );
    }
  } catch (err) {
    removeThinking(thinkingId);
    addMessage(
      "⚠️ Server is sleeping or restarting. Please try again in 20–30 seconds.",
      "bot"
    );
  }
}

/* ============================
   Thinking Bubble
============================ */

function addThinking() {
  const msg = document.createElement("div");
  msg.className = "bot-msg";
  msg.textContent = "Thinking...";
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  return msg;
}

function removeThinking(el) {
  if (el) el.remove();
}

/* ============================
   Retry Logic (HF sleep)
============================ */

async function fetchWithRetry(url, retries) {
  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error("Server error");
    return res;
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise((r) => setTimeout(r, 3000));
    return fetchWithRetry(url, retries - 1);
  }
}

/* ============================
   Enter key support
============================ */

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
