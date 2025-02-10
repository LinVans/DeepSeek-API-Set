function sendMessage() {
    let message = document.getElementById('user-message').value;
    let model = document.getElementById('model-selector').value;

    if (message.trim() === "") return;

    let messagesDiv = document.getElementById('messages');

    // 显示用户消息
    messagesDiv.innerHTML += `<div class="message-user"><strong>你：</strong>${message}</div>`;
    document.getElementById('user-message').value = '';  // 清空输入框

    // 显示“思考中...”提示
    let loadingMessage = document.getElementById('loading');
    loadingMessage.style.display = 'block';

    // 请求后端获取 AI 回复
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `message=${encodeURIComponent(message)}&model=${encodeURIComponent(model)}`
    })
    .then(response => response.json())
    .then(data => {
        // 隐藏“思考中...”提示
        loadingMessage.style.display = 'none';

        // 显示 Deepseek 回复
        messagesDiv.innerHTML += `<div class="message-bot"><strong>Deepseek：</strong>${data.response}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;  // 滚动到最新消息
    })
    .catch(error => {
        // 处理错误并隐藏加载提示
        loadingMessage.style.display = 'none';
        console.error("Error:", error);
        messagesDiv.innerHTML += `<div class="message-bot"><strong>Deepseek：</strong>发生了一个错误，请稍后再试。</div>`;
    });
}
