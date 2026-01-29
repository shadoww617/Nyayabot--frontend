const API_URL = "https://shadoww617-nyayabot.hf.space/ask";
let chatHistory = [];

function quickAsk(text) {
  document.getElementById("userInput").value = text;
  askQuestion();
}

function clearChat() {
  document.getElementById("chat").innerHTML = "";
  chatHistory = [];
}

async function askQuestion() {
  const input = document.getElementById("userInput");
  const query = input.value.trim();
  if (!query) return;

  appendUser(query);
  input.value = "";

  const botDiv = appendBot("Thinking...");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        history: chatHistory
      })
    });

    if (!res.ok) throw new Error("HF sleeping");

    const data = await res.json();

    botDiv.innerHTML = formatAnswer(data.answer, data.references);

    chatHistory.push({
      user: query,
      bot: data.answer
    });

  } catch (err) {
    botDiv.innerHTML =
      "⚠️ Server is restarting or sleeping. Please retry after 10–15 seconds.";
  }
}

function appendUser(text) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = "msg user";
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function appendBot(text) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = "msg bot";
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function formatAnswer(answer, refs) {
  let html = answer.replace(/\n/g, "<br>");

  if (refs && refs.length > 0) {
    html += `<div class="refs"><b>Law References:</b><ul>`;
    refs.forEach(r => html += `<li>${r}</li>`);
    html += "</ul></div>";
  }

  return html;
}
