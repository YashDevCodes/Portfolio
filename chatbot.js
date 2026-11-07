const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const messages = document.getElementById("chatMessages");
const statusText = document.getElementById("chatStatus");
const sendButton = document.getElementById("chatSend");

function showMessage(text, kind) {
    const p = document.createElement("p");
    p.className = kind === "user" ? "user-message" : "bot-message";
    p.textContent = text;
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = input.value.trim();

    if (!question) {
        statusText.textContent = "Please type a question.";
        return;
    }

    showMessage(question, "user");
    input.value = "";
    sendButton.disabled = true;
    statusText.textContent = "Thinking...";

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        showMessage(data.reply, "bot");
        statusText.textContent = "";

    } catch (error) {
        console.error("Chatbot Error:", error);
        statusText.textContent = error.message;
    } finally {
        sendButton.disabled = false;
        input.focus();
    }
});
