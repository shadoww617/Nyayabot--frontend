const API = "https://shadoww617-nyayabot.hf.space/ask";
let history = [];

async function send() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const payload = {
    query: text,
    history: history
  };

  history.push({ role: "user", text });

  addMessage("Thinking...", "bot");

  const res = await fetch(API, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  document.querySelector(".bot:last-child").remove();

  addMessage(data.answer, "bot");

  history.push({ role: "assistant", text: data.answer });

  showLaws(data.laws);
}

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = cls;
  div.innerText = text;
  document.getElementById("chat").appendChild(div);
  window.scrollTo(0, document.body.scrollHeight);
}

function showLaws(laws) {
  const box = document.getElementById("law-box");
  box.innerHTML = "";

  if (!laws || laws.length === 0) return;

  laws.forEach(l => {
    const d = document.createElement("div");
    d.className = "law";
    d.innerText = "📘 " + l;
    box.appendChild(d);
  });
}
