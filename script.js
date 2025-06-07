const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filters button');

const sound = {
  add: new Audio('notifikasi-gemes-319096.mp3'),
  complete: new Audio('complete_sound-98972.mp3'),
  delete: new Audio('mag-remove-92075.mp3'),
};

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  const filtered = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'task-done' : '';

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
      <span class="task-text">${task.text}</span>
      <button class="delete-btn" data-index="${index}">🗑️</button>
    `;
    taskList.appendChild(li);
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = '';
    renderTasks(getActiveFilter());
  }
});

taskList.addEventListener('click', e => {
  const index = e.target.dataset.index;
  if (e.target.type === 'checkbox') {
    tasks[index].completed = !tasks[index].completed;
    renderTasks(getActiveFilter());
  } else if (e.target.classList.contains('delete-btn')) {
    tasks.splice(index, 1);
    renderTasks(getActiveFilter());
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filters .active').classList.remove('active');
    btn.classList.add('active');
    renderTasks(btn.dataset.filter);
  });
});

function getActiveFilter() {
  return document.querySelector('.filters .active').dataset.filter;
}

renderTasks();
addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    sound.add.play(); // Play sound
    taskInput.value = '';
    renderTasks(getActiveFilter());
  }
});
taskList.addEventListener('click', e => {
  const index = e.target.dataset.index;
  if (e.target.type === 'checkbox') {
    tasks[index].completed = !tasks[index].completed;
    sound.complete.play(); // ✅ Checkbox sound
    renderTasks(getActiveFilter());
  } else if (e.target.classList.contains('delete-btn')) {
    tasks.splice(index, 1);
    sound.delete.play(); // 🗑️ Delete sound
    renderTasks(getActiveFilter());
  }
});
