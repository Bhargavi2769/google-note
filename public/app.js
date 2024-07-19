
document.getElementById('show-register-form').addEventListener('click', () => {
    document.getElementById('welcome-message').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

document.getElementById('show-login-form').addEventListener('click', () => {
    document.getElementById('welcome-message').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('note-app').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('welcome-message').style.display = 'block';
});

document.getElementById('register-btn').addEventListener('click', async () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            alert('User registered successfully');
            document.getElementById('show-login-form').click();
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error(error);
        alert('Registration failed');
    }
});

document.getElementById('login-btn').addEventListener('click', async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('note-app').style.display = 'block';
            document.getElementById('logout-btn').style.display = 'block';
            fetchNotesFromServer();
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error(error);
        alert('Login failed');
    }
});




document.getElementById('add-note').addEventListener('click', () => {
    const noteText = document.getElementById('note-text').value;
    const noteLabel = document.getElementById('note-label').value;
    if (noteText.trim() === '') return;

    addNoteToUI(noteText, noteLabel);
    saveNoteToServer(noteText, noteLabel);
    document.getElementById('note-text').value = '';
    document.getElementById('note-label').value = '';
});

function addNoteToUI(noteText, noteLabel, noteId) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.setAttribute('data-id', noteId);
    noteElement.innerHTML = `
        <div>${noteText}</div>
        ${noteLabel ? `<div class="note-label">${noteLabel}</div>` : ''}
        <div class="note-buttons">
            <button class="edit-note">✏️</button>
            <button class="delete-note">🗑️</button>
        </div>
    `;

    noteElement.querySelector('.edit-note').addEventListener('click', () => editNoteInUI(noteElement));
    noteElement.querySelector('.delete-note').addEventListener('click', () => deleteNoteFromServer(noteElement));

    document.getElementById('notes-container').appendChild(noteElement);
}

function editNoteInUI(noteElement) {
    const noteId = noteElement.getAttribute('data-id');
    const newText = prompt('Edit your note:', noteElement.firstChild.textContent);
    const newLabel = prompt('Edit your label:', noteElement.querySelector('.note-label')?.textContent || '');
    if (newText === null) return;

    noteElement.firstChild.textContent = newText;
    if (newLabel !== null) {
        const labelElement = noteElement.querySelector('.note-label');
        if (labelElement) {
            labelElement.textContent = newLabel;
        } else {
            const newLabelElement = document.createElement('div');
            newLabelElement.classList.add('note-label');
            newLabelElement.textContent = newLabel;
            noteElement.appendChild(newLabelElement);
        }
    }

    updateNoteOnServer(noteId, newText, newLabel);
}

async function saveNoteToServer(noteText, noteLabel) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ text: noteText, label: noteLabel })
        });
        const savedNote = await response.json();
        addNoteToUI(savedNote.text, savedNote.label, savedNote._id);
    } catch (error) {
        console.error(error);
    }
}

async function updateNoteOnServer(noteId, newText, newLabel) {
    try {
        const token = localStorage.getItem('token');
        await fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ text: newText, label: newLabel })
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteNoteFromServer(noteElement) {
    const noteId = noteElement.getAttribute('data-id');
    try {
        const token = localStorage.getItem('token');
        await fetch(`/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        noteElement.remove();
    } catch (error) {
        console.error(error);
    }
}

async function fetchNotesFromServer() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/notes', {
            headers: {
                'Authorization': token
            }
        });
        const notes = await response.json();
        notes.forEach(note => addNoteToUI(note.text, note.label, note._id));
    } catch (error) {
        console.error(error);
    }
}

// Check if user is already logged in
if (localStorage.getItem('token')) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('note-app').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'block';
    fetchNotesFromServer();
}