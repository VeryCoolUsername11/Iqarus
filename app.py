from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
import requests
from Crypto.Cipher import AES
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coordination.db'
app.config['SECRET_KEY'] = 'secret!'
db = SQLAlchemy(app)
socketio = SocketIO(app)

# Generate a key for AES encryption
key = os.urandom(16)

def encrypt_message(message):
    cipher = AES.new(key, AES.MODE_EAX)
    nonce = cipher.nonce
    ciphertext, tag = cipher.encrypt_and_digest(message.encode('utf-8'))
    return nonce + ciphertext

def decrypt_message(ciphertext):
    nonce = ciphertext[:16]
    cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
    plaintext = cipher.decrypt(ciphertext[16:])
    return plaintext.decode('utf-8')

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    assignee = db.Column(db.String(100), nullable=False)

@app.route('/get_social_media_data', methods=['GET'])
def get_social_media_data():
    response = requests.get('https://api.twitter.com/2/tweets/search/recent', params={
        'query': 'crisis',
        'max_results': 10
    }, headers={
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    })
    data = response.json()
    return jsonify(data)

@app.route('/get_news_data', methods=['GET'])
def get_news_data():
    response = requests.get('https://newsapi.org/v2/everything', params={
        'q': 'crisis',
        'apiKey': 'YOUR_NEWS_API_KEY'
    })
    data = response.json()
    return jsonify(data)

@app.route('/get_direct_communications', methods=['GET'])
def get_direct_communications():
    data = {"messages": ["Message 1", "Message 2"]}
    return jsonify(data)

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.get_json()
    new_task = Task(description=data['description'], status=data['status'], assignee=data['assignee'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task added successfully'})

@app.route('/update_task', methods=['PUT'])
def update_task():
    data = request.get_json()
    task = Task.query.get(data['id'])
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    task.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Task updated successfully'})

@app.route('/get_tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    tasks_list = [{'id': task.id, 'description': task.description, 'status': task.status, 'assignee': task.assignee} for task in tasks]
    return jsonify(tasks_list)

@socketio.on('message')
def handle_message(data):
    encrypted_message = encrypt_message(data['message'])
    emit('response', {'message': encrypted_message}, broadcast=True)

if __name__ == '__main__':
    db.create_all()
    socketio.run(app, debug=True)