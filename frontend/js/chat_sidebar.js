// js/chat-sidebar.js
(function() {
    const messagesContainer = document.querySelector('#chat-sidebar .chat-messages');
    const inputField = document.getElementById('chat-input-field');
    const sendButton = document.getElementById('chat-send-button');
    

    // Function to append messages to the chat
    function appendMessage(role, text) {
        const messageElem = document.createElement('div');
        messageElem.className = `chat-message ${role}`;
        messageElem.textContent = text;
        messagesContainer.appendChild(messageElem);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Function to send a message to the backend API
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

    // Event listeners for sending messages
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
})();
