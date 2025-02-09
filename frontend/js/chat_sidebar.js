function initializeChat($container, chatOutputEditor) {
    // Instead of directly using sourceEditor.getValue(),
    // use window.currentCode which gets updated when the source changes.
    let codeContent = (typeof sourceEditor !== "undefined" && sourceEditor.getValue())
                      ? sourceEditor.getValue()
                      : window.currentCode || "";

    console.log("Code content from source editor:", codeContent);
    // Use codeContent as needed...

    // Set up chat sending, etc.
    const inputField = $container.find("#chat-input-field")[0];
    const sendButton = $container.find("#chat-send-button")[0];

    let chatHistory = [];
    function updateChatOutput() {
        chatOutputEditor.setValue(chatHistory.join("\n"));
    }

    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        chatHistory.push("User: " + text);
        updateChatOutput();
        inputField.value = '';

        // Optionally, update prompt with code context
        let prompt = text;
        if (typeof sourceEditor !== "undefined") {
            prompt += "\n\nCode Context:\n" + sourceEditor.getValue();
        } else if (window.currentCode) {
            prompt += "\n\nCode Context:\n" + window.currentCode;
        }

        try {
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt })
            });
            const data = await response.json();
            chatHistory.push("Assistant: " + data.reply);
            updateChatOutput();
        } catch (error) {
            console.error('Error fetching AI response:', error);
            chatHistory.push("Assistant: Error: Could not get a response.");
            updateChatOutput();
        }
    }

    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
}
