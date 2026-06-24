const API_URL = 'http://localhost:3000/todos';
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const grid = document.getElementById('todo-grid');


async function fetchTodos() {
    const res = await fetch(API_URL);
    const todos = await res.json();
    render(todos);
}


function render(todos) {
    grid.innerHTML = '';
    todos.forEach(todo => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <p class="todo-text" data-id="${todo.id}">${todo.text}</p>
            <span>${todo.time}</span>
            <button class="delete-btn" onclick="deleteTodo('${todo.id}')">⊗</button>
        `;

        const textElement = card.querySelector('.todo-text');
        textElement.addEventListener('click', () => startEditing(textElement, todo));

        grid.appendChild(card);
    });
}


function startEditing(element, todo) {

    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.value = todo.text;
    inputEdit.className = 'edit-input';

    const saveChanges = async () => {
        const newText = inputEdit.value.trim();
        if (newText && newText !== todo.text) {
            await fetch(`${API_URL}/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...todo, text: newText })
            });
        }
        fetchTodos(); 
    };

    inputEdit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveChanges();
    });


    inputEdit.addEventListener('blur', saveChanges);


    element.replaceWith(inputEdit);
    inputEdit.focus();
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTodo = {
        text: input.value,
        time: timeString
    };

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
    });

    input.value = '';
    fetchTodos();
});


async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    fetchTodos();
}


fetchTodos();