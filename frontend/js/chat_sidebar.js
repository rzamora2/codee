function initializeChat($container) {
    // Use jQuery's find method to locate the chatbox inside $container
    let $chatbox = $container.find("#chatbox");
    if (!$chatbox.length) {
        console.error("Chatbox element not found within the container.");
        return;
    }

    // Get elements from within the chatbox
    const messagesContainer = $chatbox.find(".chat-messages")[0];
    const inputField = $chatbox.find("#chat-input-field")[0];
    const sendButton = $chatbox.find("#chat-send-button")[0];

    // Function to append messages to the chat area
    function appendMessage(role, text) {
        const messageElem = document.createElement("div");
        messageElem.className = `chat-message ${role}`;
        messageElem.textContent = text;
        messagesContainer.appendChild(messageElem);
        // Optionally, scroll to show the new message
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Async function to send messages to your backend
    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        appendMessage('user', text);
        inputField.value = '';

        try {
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });
            const data = await response.json();
            appendMessage('assistant', data.reply);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            appendMessage('assistant', 'Error: Could not get a response.');
        }
    }

    // Attach event listeners to send messages when clicking the button or pressing Enter
    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
}
