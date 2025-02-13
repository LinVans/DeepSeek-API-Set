let startTime; // 用于记录请求开始时间

async function sendMessage() {
    const userInput = document.getElementById('user-message').value.trim();
    if (!userInput) return;

    // 清空输入框并显示用户消息
    document.getElementById('user-message').value = '';
    appendMessage('user', `<strong>你：</strong>${userInput}`);

    // 显示加载动画
    document.getElementById('loading').style.display = 'block';
    
    // 记录开始时间
    startTime = new Date();

    try {
        const model = document.getElementById('model-selector').value;
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `message=${encodeURIComponent(userInput)}&model=${encodeURIComponent(model)}`
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // 计算响应时间
        const endTime = new Date();
        const responseTime = ((endTime - startTime) / 1000).toFixed(2);
        
        // 隐藏加载动画
        document.getElementById('loading').style.display = 'none';
        
        // 添加机器人回复和响应时间
        appendMessage('bot', `<strong>Deepseek：</strong>${data.response}`, responseTime);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        // 显示错误消息
        appendMessage('bot', `<strong>Deepseek：</strong>发生了一个错误，请稍后再试。<br>错误信息：${error.message}`);
    }
}

function appendMessage(sender, message, responseTime = null) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-${sender}`;
    
    // 使用 innerHTML 来保留 HTML 格式
    messageDiv.innerHTML = message;
    
    // 如果是机器人回复且有响应时间，添加响应时间信息
    if (sender === 'bot' && responseTime) {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'response-time';
        timeDiv.textContent = `响应时长：${responseTime}秒`;
        messageDiv.appendChild(timeDiv);
    }
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 添加回车发送功能
document.getElementById('user-message').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
