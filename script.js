const API_URL = "https://shadoww617-nyayabot.hf.space/ask";

function addMessage(text, type) {
    const chatBox = document.getElementById("chatBox");

    const msg = document.createElement("div");
    msg.className = `message ${type}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerText = text;

    msg.appendChild(bubble);
    chatBox.appendChild(msg);

    chatBox.scrollTop = chatBox.scrollHeight;
}

async function askQuestion() {
    const input = document.getElementById("queryInput");
    const question = input.value.trim();

    if (!question) return;

    addMessage(question, "user");
    input.value = "";

    addMessage("Analyzing legal context...", "bot");

    try {
        const response = await fetch(`${API_URL}?query=${encodeURIComponent(question)}`, {
            method: "POST",
            headers: {
                "accept": "application/json"
            }
        });

        const data = await response.json();

        const answer =
            `📘 Legal Explanation:\n\n${data.answer}`;

        addMessage(answer, "bot");

    } catch (err) {
        addMessage("⚠️ Server error. Please try again later.", "bot");
    }
}
