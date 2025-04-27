document.addEventListener('DOMContentLoaded', function () { // Single Listener Starts Here

    // --- Form Submission Logic ---
    const sendButton = document.getElementById('send-button');
    const noteTextarea = document.getElementById('thought-textarea');

    if (sendButton && noteTextarea) {
        sendButton.addEventListener('click', function (event) {
            event.preventDefault();
            sendNote(noteTextarea.value);
        });

        noteTextarea.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendNote(noteTextarea.value);
            }
        });
    } else {
        console.warn('Send button or note textarea not found for submission logic.');
    }

    // --- Note Sending Function ---
    async function sendNote(text) {
        const noteText = text.trim();
        if (!noteText) {
            console.warn("Attempted to send an empty note.");
            if (noteTextarea) {
                noteTextarea.classList.add('border-red-500', 'ring-red-500');
                setTimeout(() => {
                    noteTextarea.classList.remove('border-red-500', 'ring-red-500');
                }, 1500);
            }
            return;
        }
        try {
            const authStateString = localStorage.getItem('auth_state');
            let token = null;
            if (authStateString) {
                try {
                    token = JSON.parse(authStateString)?.accessToken;
                } catch (e) {
                    console.error("Failed to parse auth_state:", e);
                }
            }
            if (!token) {
                console.log("User not logged in. Storing note locally.");
                localStorage.setItem('cohesive_initial_note', noteText);
                window.location.href = '/app.html';
                return;
            }
            console.log("User logged in. Sending note via API.");
            const noteData = {
                noteId: {id: {value: generateUUID()}}, originalText: noteText, improvedText: null, parentId: null, reminder: null,
                actionTime: null, tags: null, links: null, isPinned: false
            };
            sendButton.disabled = true;
            sendButton.classList.add('opacity-75', 'cursor-not-allowed');
            const response = await fetch('/notes', {
                method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}, body: JSON.stringify(noteData)
            });
            if (response.ok) {
                console.log("Note created successfully via API.");
                localStorage.removeItem('cohesive_initial_note');
                window.location.href = '/app.html';
            } else {
                const errorBody = await response.text();
                console.error(`API Error (${response.status}):`, errorBody);
                localStorage.setItem('cohesive_initial_note', noteText);
                window.location.href = '/app.html';
            }
        } catch (error) {
            console.error('Error during sendNote:', error);
            localStorage.setItem('cohesive_initial_note', noteText);
            window.location.href = '/app.html';
        } finally {
            if (sendButton) {
                sendButton.disabled = false;
                sendButton.classList.remove('opacity-75', 'cursor-not-allowed');
            }
        }
    }

    // Helper function (UUID generation)
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


    // --- Placeholder Rotation Logic ---
    const placeholders = ["Capture that brilliant idea...", "Jot down that meeting action item...", "Save the book recommendation...", "Record that flash of inspiration...", "What's on your mind right now?"];
    let currentPlaceholderIndex = 0;

    function rotatePlaceholders() {
        if (noteTextarea) {
            noteTextarea.classList.add('placeholder-fade'); // You might need CSS for this class if you want fade effect
            setTimeout(() => {
                currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
                noteTextarea.setAttribute('placeholder', placeholders[currentPlaceholderIndex]);
                noteTextarea.classList.remove('placeholder-fade');
            }, 250);
        }
    }

    if (noteTextarea) {
        noteTextarea.setAttribute('placeholder', placeholders[0]);
        setInterval(rotatePlaceholders, 4000);
    }


    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {root: null, threshold: 0.1, rootMargin: "0px 0px -50px 0px"};
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    };
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });


    // --- Pricing Toggle Logic ---
    const monthlyButton = document.getElementById('toggle-monthly');
    const annualButton = document.getElementById('toggle-annual');
    const glider = document.getElementById('toggle-glider');
    const proPriceAmount = document.getElementById('pro-price-amount');
    const proPriceBilling = document.getElementById('pro-price-billing');
    const proPriceSave = document.getElementById('pro-price-save');
    const proCtaButton = document.getElementById('pro-cta-button');

    function updatePricing(isAnnual) {
        const selected = isAnnual ? 'annual' : 'monthly';
        const prices = {
            monthly: {amount: '€12.99', billing: 'Billed monthly', saveVisible: false, planLink: '/app.html?plan=pro_monthly'}, // Corrected link
            annual: {amount: '€9.99', billing: 'Billed as €119.88 per year', saveVisible: true, planLink: '/app.html?plan=pro_annual'} // Corrected link
        };
        const activeButton = isAnnual ? annualButton : monthlyButton;
        const inactiveButton = isAnnual ? monthlyButton : annualButton;

        activeButton.classList.add('text-white', 'font-semibold');
        activeButton.classList.remove('text-gray-500', 'font-medium');
        inactiveButton.classList.add('text-gray-500', 'font-medium');
        inactiveButton.classList.remove('text-white', 'font-semibold');

        if (glider && activeButton && activeButton.offsetParent !== null) { // Check if button is visible/layout ready
            setTimeout(() => { // Delay calculation slightly to ensure accurate offsetWidth/offsetLeft
                const buttonWidth = activeButton.offsetWidth;
                const buttonOffsetLeft = activeButton.offsetLeft;
                glider.style.width = `${buttonWidth}px`;
                glider.style.transform = `translateX(${buttonOffsetLeft}px)`;
            }, 0);
        }

        if (proPriceAmount && proPriceBilling && proPriceSave) {
            proPriceAmount.textContent = prices[selected].amount;
            proPriceBilling.textContent = prices[selected].billing;
            proPriceSave.style.display = prices[selected].saveVisible ? 'inline-flex' : 'none';
        }
        if (proCtaButton) {
            // Update this if you want the button link to change based on selection
            proCtaButton.href = `/app.html?plan=${selected === 'annual' ? 'pro_annual' : 'pro_monthly'}`;
        }
    }

    if (monthlyButton && annualButton) {
        monthlyButton.addEventListener('click', () => updatePricing(false));
        annualButton.addEventListener('click', () => updatePricing(true));
        // Initial state + slight delay for layout calculation
        setTimeout(() => updatePricing(true), 50);
    }

}); // Single Listener Ends Here



