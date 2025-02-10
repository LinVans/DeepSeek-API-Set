from flask import Flask, render_template, request, jsonify
import http.client
import json
import os

# 导入配置
from config import API_KEY

app = Flask(__name__)


def get_response_from_proxy(message, model="deepseek-r1"):
    """通过中间商 API 获取响应"""
    conn = http.client.HTTPSConnection("xiaoai.plus")

    # 构造消息数据
    payload = json.dumps({
        "messages": [
            {
                "role": "system",
                "content": "你是一个大语言模型机器人"
            },
            {
                "role": "user",
                "content": message
            }
        ],
        "stream": False,
        "model": model,
        "temperature": 0.5,
        "presence_penalty": 0,
        "frequency_penalty": 0,
        "top_p": 1
    })

    # 设置请求头
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }

    # 发起请求
    try:
        conn.request("POST", "/v1/chat/completions", payload, headers)
        res = conn.getresponse()
        data = res.read()
        response_data = json.loads(data.decode("utf-8"))

        # 返回 API 返回的消息
        return response_data['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error: {e}")
        return "发生了一个错误，请稍后再试。"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.form['message']
    model = request.form.get('model', 'deepseek-r1')  # 可以选择模型
    bot_response = get_response_from_proxy(user_message, model)
    return jsonify({'response': bot_response})


if __name__ == '__main__':
    app.run(debug=True)
