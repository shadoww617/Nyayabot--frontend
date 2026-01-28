const API = "https://shadoww617-nyayabot.hf.space/ask";

let history = [];

function add(text, type, laws = []) {
  const chat = document.getElementById("chat");

  const msg = document.createElement("div");
  msg.className = "msg " + type;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = text;

  msg.appendChild(bubble);

  if (laws.length > 0) {
    const lawBox = document.createElement("div");
    lawBox.className = "laws";
    lawBox.innerHTML = "<b>Relevant Laws:</b><br>" +
      laws.map(l => `• ${l.section}`).join("<br>");
    msg.appendChild(lawBox);
  }

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function sample(q) {
  document.getElementById("query").value = q;
}

function clearChat() {
  document.getElementById("chat").innerHTML = "";
  history = [];
}

async function ask() {
  const input = document.getElementById("query");
  const q = input.value.trim();
  if (!q) return;

  add(q, "user");
  input.value = "";

  history.push({ role: "user", content: q });
  history = history.slice(-6);

  add("Thinking...", "bot");

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q, history })
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      add("Server restarting. Please wait 30 seconds.", "bot");
      return;
    }

    if (!data.answer) {
      add("Backend is waking up. Try again shortly.", "bot");
      return;
    }

    add(data.answer, "bot", data.laws || []);

    history.push({ role: "assistant", content: data.answer });

  } catch (err) {
    add("Network error. Backend may be rebuilding.", "bot");
  }
}
