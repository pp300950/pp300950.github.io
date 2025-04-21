import { translations } from './translations.js';

//making functions globally available via window object for easy acces
Object.assign(window, {
  applyTranslations,
  saveAndRender,
  addTodo,
  renderTodos,
  toggleExpand,
  editTodoById,
  findTodoIndexById,
  toggleDoneById,
  deleteTodoById,
  formatDate,
  encodeBase64Unicode,
  decodeBase64Unicode,
  updateShareURL,
  copyLink,
  getTodosFromURL,
  editTodo,
  getCurrentTranslation,
  saveEdit,
  closeEditModal,
  showSuccessModal,
  closeSuccessModal,
  closeSettingsModal,
  applySettings,
  loadSettings,
  loadLanguage,
});

//function to apply translations for the UI based on the selected language
function applyTranslations(language) {
  const t = translations[language] || translations.en;

  //updating UI texts according to the language selected
  document.querySelector('h1').textContent = t.title;
  document.getElementById('todo-input').placeholder = t.placeholderInput;
  document.getElementById('todo-description').placeholder = t.placeholderDesc;
  document.getElementById('add-btn').textContent = t.addButton;
  document.getElementById('sort-label').textContent = t.sortLabel;

  const sortOrder = document.getElementById('sort-order');
  sortOrder.options[0].text = t.sortUpdatedDesc;
  sortOrder.options[1].text = t.sortUpdatedAsc;
  sortOrder.options[2].text = t.sortAlphaAsc;
  sortOrder.options[3].text = t.sortAlphaDesc;

  document.querySelector('#edit-modal h2').textContent = t.editTitle;
  document.getElementById('edit-input').placeholder = t.editPlaceholder;
  document.getElementById('edit-detail').placeholder = t.placeholderDesc;

  const modalButtons = document.querySelectorAll('.modal-buttons button');
  modalButtons[0].textContent = t.saveButton;
  modalButtons[1].textContent = t.cancelButton;

  document.querySelector('#success-modal h2').textContent = t.successTitle;
  document.querySelector('#success-modal button').textContent = t.successButton;
  document.querySelector('#settings-modal h2').textContent = t.settingsTitle;
  document.querySelector('label[for="font-select"]').textContent = t.fontLabel;
  document.querySelector('label[for="font-size-input"]').textContent =
    t.fontSizeLabel;
  document.querySelector('label[for="user-email-input"]').textContent =
    t.emailLabel;
  document.getElementById('save-settings-btn').textContent = t.saveButton;
  document.getElementById('reminder-label').textContent = t.reminderLabel;
}

//event listener to change the language when the user selects a new language
document.getElementById('language-selector').addEventListener('change', (e) => {
  const selectedLanguage = e.target.value;
  localStorage.setItem('language', selectedLanguage);
  applyTranslations(selectedLanguage);
});

let editingTodoId = null;
let todos =
  getTodosFromURL() || JSON.parse(localStorage.getItem('todos')) || [];
renderTodos();

document.getElementById('sort-order').addEventListener('change', renderTodos);

//adding todos using button or enter key
addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

//save todos to localStorage and render them
function saveAndRender() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}




//Function toggle the expanded state of a to-do item
function toggleExpand(id) {
  //Loop through all todos and toggle the expanded property of the one with the matching ID
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.expanded = !todo.expanded; //toggle the expanded state
    } else {
      todo.expanded = false; 
    }
    return todo;
  });
  renderTodos(); //Re-render the todo list to reflect the changes
}


//open the edit modal for a specific todo by its ID
function editTodoById(id) {
  const todo = todos.find((t) => t.id === id); //Find the todo by ID
  if (!todo) return;

  //Set the current todo's title and detail in the edit modal fields
  document.getElementById('edit-input').value = todo.title || '';
  document.getElementById('edit-detail').value = todo.detail || '';
  editingTodoId = id; //set the todo ID for later reference
  document.getElementById('edit-modal').style.display = 'block'; 
}

//find the index of a todo by its ID
function findTodoIndexById(id) {
  return todos.findIndex((t) => t.id === id); // Return the index of the todo
}

//toggle the "done" state of a todo item by its ID
function toggleDoneById(id) {
  const idx = findTodoIndexById(id); 
  if (idx === -1) return;
  todos[idx].done = !todos[idx].done; //toggle the "done" state
  todos[idx].updated = new Date().toISOString(); 
  saveAndRender(); // Save and re-render the todos
}

//delete a todo item by its iD
function deleteTodoById(id) {
  const idx = findTodoIndexById(id); //find todo index by ID
  if (idx === -1) return;
  todos.splice(idx, 1); // Remove the todo from the list
  saveAndRender();
}

//date string into a readable format
function formatDate(str) {
  const d = new Date(str); //convert the string to a Date object
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month} ${hours}:${minutes}`; 
}

//encoding and decoding data in base64
function encodeBase64Unicode(str) {
  return btoa(unescape(encodeURIComponent(str))); // Convert string to Base64
}

function decodeBase64Unicode(str) {
  return decodeURIComponent(escape(atob(str))); // Decode Base64 string
}

//update the share URL with the current todo list
function updateShareURL() {
  const encoded = encodeBase64Unicode(JSON.stringify(todos)); //Encode todo to Base64
  const url = `${location.origin}${location.pathname}?list=${encoded}`; //Generate shareable URL
  const shortText = `${url.substring(0, 60)}...`; // Shorten the URL for display

  const shareEl = document.getElementById('share-link');
  const t = getCurrentTranslation();
  shareEl.innerHTML = `
    🔗 ${t.shareLink}: <a href="${url}" target="_blank">${shortText}</a>
    <button onclick="copyLink('${url}')" style="margin-left:5px;">📋</button>`; // Display share URL with copy button
}



//function to open the edit modal for a specific todo item by index
let editIndex = null;
function editTodo(index) {
  editIndex = index;
  document.getElementById('edit-input').value = todos[index].text; // Set the todo title in the edit input
  document.getElementById('edit-modal').style.display = 'flex'; 
}

function getCurrentTranslation() {
  const lang = localStorage.getItem('language') || 'en'; 
  return translations[lang] || translations.en;
}
import { translations } from './translations.js';

//making functions globally available via window object for easy acces
Object.assign(window, {
  applyTranslations,
  saveAndRender,
  addTodo,
  renderTodos,
  toggleExpand,
  editTodoById,
  findTodoIndexById,
  toggleDoneById,
  deleteTodoById,
  formatDate,
  encodeBase64Unicode,
  decodeBase64Unicode,
  updateShareURL,
  copyLink,
  getTodosFromURL,
  editTodo,
  getCurrentTranslation,
  saveEdit,
  closeEditModal,
  showSuccessModal,
  closeSuccessModal,
  closeSettingsModal,
  applySettings,
  loadSettings,
  loadLanguage,
});

//function to apply translations for the UI based on the selected language
function applyTranslations(language) {
  const t = translations[language] || translations.en;

  //updating UI texts according to the language selected
  document.querySelector('h1').textContent = t.title;
  document.getElementById('todo-input').placeholder = t.placeholderInput;
  document.getElementById('todo-description').placeholder = t.placeholderDesc;
  document.getElementById('add-btn').textContent = t.addButton;
  document.getElementById('sort-label').textContent = t.sortLabel;

  const sortOrder = document.getElementById('sort-order');
  sortOrder.options[0].text = t.sortUpdatedDesc;
  sortOrder.options[1].text = t.sortUpdatedAsc;
  sortOrder.options[2].text = t.sortAlphaAsc;
  sortOrder.options[3].text = t.sortAlphaDesc;

  document.querySelector('#edit-modal h2').textContent = t.editTitle;
  document.getElementById('edit-input').placeholder = t.editPlaceholder;
  document.getElementById('edit-detail').placeholder = t.placeholderDesc;

  const modalButtons = document.querySelectorAll('.modal-buttons button');
  modalButtons[0].textContent = t.saveButton;
  modalButtons[1].textContent = t.cancelButton;

  document.querySelector('#success-modal h2').textContent = t.successTitle;
  document.querySelector('#success-modal button').textContent = t.successButton;
  document.querySelector('#settings-modal h2').textContent = t.settingsTitle;
  document.querySelector('label[for="font-select"]').textContent = t.fontLabel;
  document.querySelector('label[for="font-size-input"]').textContent =
    t.fontSizeLabel;
  document.querySelector('label[for="user-email-input"]').textContent =
    t.emailLabel;
  document.getElementById('save-settings-btn').textContent = t.saveButton;
  document.getElementById('reminder-label').textContent = t.reminderLabel;
}

//event listener to change the language when the user selects a new language
document.getElementById('language-selector').addEventListener('change', (e) => {
  const selectedLanguage = e.target.value;
  localStorage.setItem('language', selectedLanguage);
  applyTranslations(selectedLanguage);
});

let editingTodoId = null;
let todos =
  getTodosFromURL() || JSON.parse(localStorage.getItem('todos')) || [];
renderTodos();

document.getElementById('sort-order').addEventListener('change', renderTodos);

//adding todos using button or enter key
addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

//save todos to localStorage and render them
function saveAndRender() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}




//Function toggle the expanded state of a to-do item
function toggleExpand(id) {
  //Loop through all todos and toggle the expanded property of the one with the matching ID
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.expanded = !todo.expanded; //toggle the expanded state
    } else {
      todo.expanded = false; 
    }
    return todo;
  });
  renderTodos(); //Re-render the todo list to reflect the changes
}


//open the edit modal for a specific todo by its ID
function editTodoById(id) {
  const todo = todos.find((t) => t.id === id); //Find the todo by ID
  if (!todo) return;

  //Set the current todo's title and detail in the edit modal fields
  document.getElementById('edit-input').value = todo.title || '';
  document.getElementById('edit-detail').value = todo.detail || '';
  editingTodoId = id; //set the todo ID for later reference
  document.getElementById('edit-modal').style.display = 'block'; 
}

//find the index of a todo by its ID
function findTodoIndexById(id) {
  return todos.findIndex((t) => t.id === id); // Return the index of the todo
}

//toggle the "done" state of a todo item by its ID
function toggleDoneById(id) {
  const idx = findTodoIndexById(id); 
  if (idx === -1) return;
  todos[idx].done = !todos[idx].done; //toggle the "done" state
  todos[idx].updated = new Date().toISOString(); 
  saveAndRender(); // Save and re-render the todos
}

//delete a todo item by its iD
function deleteTodoById(id) {
  const idx = findTodoIndexById(id); //find todo index by ID
  if (idx === -1) return;
  todos.splice(idx, 1); // Remove the todo from the list
  saveAndRender();
}

//date string into a readable format
function formatDate(str) {
  const d = new Date(str); //convert the string to a Date object
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month} ${hours}:${minutes}`; 
}

//encoding and decoding data in base64
function encodeBase64Unicode(str) {
  return btoa(unescape(encodeURIComponent(str))); // Convert string to Base64
}

function decodeBase64Unicode(str) {
  return decodeURIComponent(escape(atob(str))); // Decode Base64 string
}

//update the share URL with the current todo list
function updateShareURL() {
  const encoded = encodeBase64Unicode(JSON.stringify(todos)); //Encode todo to Base64
  const url = `${location.origin}${location.pathname}?list=${encoded}`; //Generate shareable URL
  const shortText = `${url.substring(0, 60)}...`; // Shorten the URL for display

  const shareEl = document.getElementById('share-link');
  const t = getCurrentTranslation();
  shareEl.innerHTML = `
    🔗 ${t.shareLink}: <a href="${url}" target="_blank">${shortText}</a>
    <button onclick="copyLink('${url}')" style="margin-left:5px;">📋</button>`; // Display share URL with copy button
}



//function to open the edit modal for a specific todo item by index
let editIndex = null;
function editTodo(index) {
  editIndex = index;
  document.getElementById('edit-input').value = todos[index].text; // Set the todo title in the edit input
  document.getElementById('edit-modal').style.display = 'flex'; 
}

function getCurrentTranslation() {
  const lang = localStorage.getItem('language') || 'en'; 
  return translations[lang] || translations.en;
}
