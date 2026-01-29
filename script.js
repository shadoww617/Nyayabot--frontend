const API_URL = "https://shadoww617-nyayabot.hf.space/ask";

function addMessage(text, type) {
    const chat = document.getElementById("chat-container");
    const div = document.createElement("div");
    div.className = `message ${type}`;
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {
        const res = await fetch(
            `${API_URL}?query=${encodeURIComponent(text)}`,
            { method: "POST" }
        );

        if (!res.ok) throw new Error("server");

        const data = await res.json();
        addMessage(data.answer, "bot");

    } catch (err) {
        addMessage(
            "⚠️ Server is sleeping or restarting. Please wait 20–30 seconds and try again.",
            "bot"
        );
    }
}
