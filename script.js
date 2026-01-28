const API = "https://shadoww617-nyayabot.hf.space/ask";

function add(text, type) {
  const box = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.className = "msg " + type;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = text;

  msg.appendChild(bubble);
  box.appendChild(msg);

  box.scrollTop = box.scrollHeight;
}

function sample(text) {
  document.getElementById("queryInput").value = text;
}

async function ask() {
  const input = document.getElementById("queryInput");
  const q = input.value.trim();
  if (!q) return;

  add(q, "user");
  input.value = "";

  add("⏳ Analyzing legal context…", "bot");
  document.getElementById("status").innerText = "Connecting to NyayaBot…";

  async function fetchRetry(retry = 1) {
    try {
      const res = await fetch(API + "?query=" + encodeURIComponent(q), {
        method: "POST"
      });

      if (!res.ok) throw new Error("Server");

      return await res.json();
    } catch (e) {
      if (retry > 0) {
        document.getElementById("status").innerText =
          "Waking server… retrying";
        await new Promise(r => setTimeout(r, 2500));
        return fetchRetry(retry - 1);
      }
      throw e;
    }
  }

  try {
    const data = await fetchRetry(1);

    add("📘 " + data.answer, "bot");
    document.getElementById("status").innerText = "Answer generated";

  } catch (err) {
    add("⚠️ Server unavailable. Please retry in 30 seconds.", "bot");
    document.getElementById("status").innerText = "Backend sleeping";
  }
}
