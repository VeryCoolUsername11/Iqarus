//Created by the help of AI
document.addEventListener('DOMContentLoaded', () => {
  // Get references to task-related DOM elements
  const taskList = document.getElementById('task-list');
  const taskDescInput = document.getElementById('task-desc');
  const taskStatusInput = document.getElementById('task-status');
  const taskAssigneeInput = document.getElementById('task-assignee');
  const addTaskBtn = document.getElementById('add-task-btn');

  // Get references to messaging-related DOM elements
  const messageInput = document.getElementById('message-input');
  const sendMessageBtn = document.getElementById('send-message-btn');
  const receivedMessage = document.getElementById('received-message');

  // Get references to aggregated data lists
  const socialMediaList = document.getElementById('social-media-list');
  const newsList = document.getElementById('news-list');
  const communicationsList = document.getElementById('communications-list');

  // Array to store tasks
  let tasks = [];

  // Add task event listener
  addTaskBtn.addEventListener('click', () => {
    // Create a new task object from input values
    const newTask = {
      description: taskDescInput.value,
      status: taskStatusInput.value,
      assignee: taskAssigneeInput.value
    };
    // Add the new task to the tasks array
    tasks.push(newTask);
    // Render the updated tasks list
    renderTasks();
    // Clear the input fields
    taskDescInput.value = '';
    taskStatusInput.value = '';
    taskAssigneeInput.value = '';
  });

  // Function to render the tasks list
  function renderTasks() {
    // Clear the existing tasks list
    taskList.innerHTML = '';
    // Iterate over each task and create list items
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = `${task.description} - ${task.status} - ${task.assignee}`;
      
      // Add delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Done';
      deleteBtn.addEventListener('click', () => {
        tasks.splice(index, 1); // Remove task from array
        renderTasks(); // Re-render tasks
      });

      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  // Simple encryption function (Caesar Cipher for demonstration)
  function encrypt(message) {
    return message.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 3)).join('');
  }

  // Simple decryption function (Caesar Cipher for demonstration)
  function decrypt(message) {
    return message.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 3)).join('');
  }

  sendMessageBtn.addEventListener('click', () => {
    const encryptedMessage = encrypt(messageInput.value);
    // Simulate sending the message to the server and receiving it back
    setTimeout(() => {
      const decryptedMessage = decrypt(encryptedMessage);
      receivedMessage.textContent = `Received: ${decryptedMessage}`;
    }, 1000);
    messageInput.value = '';
  });

  // Simulated data fetching for aggregation (you would replace this with actual API calls)
  function fetchAggregatedData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          socialMedia: ['Post 1 from Twitter', 'Post 2 from Twitter'],
          news: ['News 1 from NewsAPI', 'News 2 from NewsAPI'],
          communications: ['Message 1 from Comm API', 'Message 2 from Comm API']
        });
      }, 1000);
    });
  }

  // Fetch and display aggregated data
  fetchAggregatedData().then(data => {
    data.socialMedia.forEach(post => {
      const li = document.createElement('li');
      li.textContent = post;
      socialMediaList.appendChild(li);
    });

    data.news.forEach(newsItem => {
      const li = document.createElement('li');
      li.textContent = newsItem;
      newsList.appendChild(li);
    });

    data.communications.forEach(message => {
      const li = document.createElement('li');
      li.textContent = message;
      communicationsList.appendChild(li);
    });
  });
});
