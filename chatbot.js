const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const messages = document.getElementById("chatMessages");
const statusText = document.getElementById("chatStatus");
const sendButton = document.getElementById("chatSend");

function showMessage(text, kind) {
    const p = document.createElement("p");

    p.className = kind === "user"
        ? "user-message"
        : "bot-message";

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

    if (!CONFIG || !CONFIG.apiKey) {
        statusText.textContent = "API configuration is missing.";
        return;
    }

    showMessage(question, "user");
    input.value = "";

    sendButton.disabled = true;
    statusText.textContent = "Thinking...";

    try {
        const response = await fetch(
            `${CONFIG.baseUrl}/chat/completions`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${CONFIG.apiKey}`
                },

                body: JSON.stringify({
                    model: CONFIG.model,
                    temperature: 0.7,

                    messages: [
                        {
                            role: "system",

                            content: `You are Yash Dadoo's personal portfolio chatbot.

Here is information about Yash:

- Name: Yash Dadoo
- Education: BTech in Artificial Intelligence and Machine Learning
- University: JECRC University
- Skills: C, C++, HTML, CSS, JavaScript and Python.
- Interests: Programming, web development and problem solving.
- GitHub: https://github.com/YashDevCodes

Projects:
1. Palindrome Checker
2. Personal Portfolio
3. Fibonacci Series
4. Factorial Calculator

Answer questions about Yash using only this information.
Be friendly, professional and concise.
Never invent personal information.
Keep answers under 80 words.`
                        },

                        {
                            role: "user",
                            content: question
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            throw new Error(
                errorData.error?.message ||
                `API Error: ${response.status}`
            );
        }

        const data = await response.json();

        const aiReply =
            data.choices?.[0]?.message?.content;

        if (!aiReply) {
            throw new Error("No AI response received.");
        }

        showMessage(aiReply, "bot");

        statusText.textContent = "";

    } catch (error) {

        console.error("Chatbot Error:", error);

        statusText.textContent =
            "Error: " + error.message;

    } finally {

        sendButton.disabled = false;
        input.focus();

    }
});
