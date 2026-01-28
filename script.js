const API = "https://shadoww617-nyayabot.hf.space/ask";

let history = [];

function add(text, type) {
  const chat = document.getElementById("chat");
  const msg = document.createElement("div");
  msg.className = "msg " + type;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = text;

  msg.appendChild(bubble);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function ask() {
  const input = document.getElementById("query");
  const q = input.value.trim();
  if (!q) return;

  add(q, "user");
  input.value = "";

  history.push({ role: "user", content: q });
  if (history.length > 6) history = history.slice(-6);

  add("Thinking...", "bot");

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        history: history
      })
    });

    const data = await res.json();

    add(data.answer, "bot");
    history.push({ role: "assistant", content: data.answer });

    document.getElementById("info").innerText =
      "Detected language: " + data.language;

  } catch {
    add("Server waking up. Try again shortly.", "bot");
  }
}
