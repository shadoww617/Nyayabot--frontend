const API_URL = "http://127.0.0.1:8000/ask"; // temporary

const chat = document.getElementById("chat");

function addMessage(html) {
  chat.innerHTML += html;
  chat.scrollTop = chat.scrollHeight;
}

async function ask() {
  const input = document.getElementById("query");
  const question = input.value.trim();
  if (!question) return;

  addMessage(`
    <div class="message user">
      <b>You:</b><br>${question}
    </div>
  `);

  input.value = "";

  addMessage(`<div class="message bot">Thinking...</div>`);

  const response = await fetch(`${API_URL}?query=${encodeURIComponent(question)}`, {
    method: "POST"
  });

  const data = await response.json();

  let table = "";
  data.citations.forEach(c => {
    table += `<tr><td>${c}</td></tr>`;
  });

  chat.lastChild.innerHTML = `
    <b>🔍 Extracted Legal Information</b>
    <div class="section-box">
      <table class="table">${table}</table>
    </div>

    <br><b>🧠 Explanation</b><br><br>
    ${data.explanation}

    <div style="margin-top:10px;color:#fbbf24;">
      ⚠️ Educational information only. Not legal advice.
    </div>
  `;
}
