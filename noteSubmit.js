// noteSubmit.js
// This file handles sending notes from the landing page to the Cohesive app

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-button');
    const editableInput = document.getElementById('note-input-editable');

    if (!sendButton || !editableInput) {
        console.error('Required elements not found');
        return;
    }

    // Function to generate a UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Function to get the current date in ISO format
    function getCurrentDate() {
        return new Date().toISOString();
    }

    // Function to send the note to the app
    async function sendNoteToApp(text) {
        try {
            // Check if the user is already logged in by checking for a token in localStorage
            const authState = localStorage.getItem('auth_state');

            if (!authState) {
                // Store the note in localStorage for the app to use
                localStorage.setItem('cohesive_initial_note', text);
                window.location.href = '/app.html';
                return;
            }

            // Prepare the note data using the CreateNote structure
            const noteData = {
                noteId: {
                    id: {
                        value: generateUUID()
                    }
                },
                originalText: text,
                improvedText: null,
                parentId: null,
                reminder: null,
                actionTime: null,
                tags: null,
                links: null,
                isPinned: false
            };

            // Parse the auth state to get the token
            const parsedAuthState = JSON.parse(authState);
            const token = parsedAuthState.accessToken;

            if (!token) {
                console.error('No access token found');
                window.location.href = '/app.html?initialNote=' + encodeURIComponent(text);
                return;
            }

            // Send the API request
            const response = await fetch('/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(noteData)
            });

            if (response.ok) {
                // Redirect to the app on success
                window.location.href = '/app.html';
            } else {
                // Handle error
                console.error('Failed to create note:', await response.text());
                // Store the note in localStorage for the app to use
                localStorage.setItem('cohesive_initial_note', text);
                window.location.href = '/app.html';
            }
        } catch (error) {
            console.error('Error creating note:', error);
            // Store the note in localStorage for the app to use
            localStorage.setItem('cohesive_initial_note', text);
            window.location.href = '/app.html';
        }
    }

    // Handle send button click
    sendButton.addEventListener('click', function (e) {
        e.preventDefault();
        const noteText = editableInput.innerText.trim();

        if (noteText) {
            sendNoteToApp(noteText);
        }
    });

    // Handle enter key in contenteditable field (without shift)
    editableInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const noteText = editableInput.innerText.trim();

            if (noteText) {
                sendNoteToApp(noteText);
            }
        }
    });
});
