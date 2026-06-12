import { signInFunction, signOutFunction, auth } from "./firebaseConfig.js";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";
import { renderExtractedBill } from './renderExtractedBill.js';

const signInBtn = document.getElementById('signBtn');
const signOutBtn = document.getElementById('signOutBtn');
const authCard = document.getElementById('authCard');

const signUpBtn = document.getElementById('signUp');
const createUserBtn = document.getElementById('createUserBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const logAlreadyUserBtn = document.getElementById('logAlreadyUser');
const alreadyEmailInput = document.getElementById('alreadyEmail');
const alreadyPasswordInput = document.getElementById('alreadyPassword');
const logUserBtn = document.getElementById('logUserBtn');

const inputContainer = document.getElementById('inputContainer');
const input = document.getElementById('input');
const inputMsg = document.getElementById('inputMsg');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const form = document.getElementById('uploadForm');
const previewContainer = document.getElementById('previewContainer');
const infoOutputContainer = document.getElementById('infoOutputContainer');
const loading = document.getElementById('loading');

let previewURL;

function show(el) { el.hidden = false; }
function hide(el) { el.hidden = true; }

function cancelPreview() {
    previewContainer.innerHTML = '';
    previewContainer.classList.add('hidden');
    input.value = '';
    inputMsg.textContent = 'No file selected yet';
    submitBtn.disabled = true;
    hide(cancelBtn);
}

input.addEventListener('cancel', cancelPreview);
cancelBtn.addEventListener('click', cancelPreview);

input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF, JPG, or PNG file.');
        input.value = '';
        return;
    }

    if (previewURL) URL.revokeObjectURL(previewURL);
    previewContainer.innerHTML = '';
    previewURL = URL.createObjectURL(file);

    if (file.type === 'application/pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = previewURL;
        iframe.className = 'w-full h-full';
        previewContainer.appendChild(iframe);
    } else {
        const img = document.createElement('img');
        img.src = previewURL;
        img.className = 'w-full h-full object-contain';
        previewContainer.appendChild(img);
    }

    previewContainer.classList.remove('hidden');
    inputMsg.textContent = `${file.name} — ${(file.size / 1024).toFixed(1)} KB`;
    submitBtn.disabled = false;
    show(cancelBtn);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    const file = input.files[0];
    if (!file) return;

    show(loading);
    submitBtn.disabled = true;

    const storage = getStorage();
    const uid = auth.currentUser.uid;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const billRef = ref(storage, `users/${uid}/${ts}/${file.name}`);

    try {
        await uploadBytes(billRef, file, { contentType: file.type });
        const idToken = await auth.currentUser.getIdToken();

        const res = await fetch('/v1/api/ai/extract-bill', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ storagePath: billRef.fullPath }),
        });

        const data = await res.json();
        hide(loading);

        if (!res.ok) {
            infoOutputContainer.textContent = data?.msg ?? 'Extraction failed.';
            return;
        }

        renderExtractedBill(infoOutputContainer, data.data);

        URL.revokeObjectURL(previewURL);
        cancelPreview();
        inputMsg.textContent = 'Bill submitted successfully!';
        setTimeout(() => { inputMsg.textContent = 'Ready for another upload!'; }, 3000);

    } catch (err) {
        hide(loading);
        console.error('Submit error:', err);
    } finally {
        submitBtn.disabled = false;
    }
});

signInBtn?.addEventListener('click', async () => {
    try {
        const user = await signInFunction();
        if (user) {
            const idToken = await user.getIdToken();
            await fetch('/v1/api/me', { method: 'GET', headers: { Authorization: `Bearer ${idToken}` } });
        }
    } catch (err) {
        console.error('[ui] sign-in failed', err?.code, err?.message);
    }
});

signOutBtn?.addEventListener('click', async () => {
    try {
        await signOutFunction();
    } catch (err) {
        console.error('Sign out error:', err);
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        hide(authCard);
        show(signOutBtn);
        show(inputContainer);
    } else {
        show(authCard);
        hide(signOutBtn);
        hide(inputContainer);
        infoOutputContainer.innerHTML = '';
    }
});

signUpBtn?.addEventListener('click', () => {
    show(emailInput);
    show(passwordInput);
    show(createUserBtn);
    hide(signUpBtn);
});

createUserBtn?.addEventListener('click', async () => {
    try {
        const result = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        const idToken = await result.user.getIdToken();
        await fetch('/v1/api/me', { method: 'GET', headers: { Authorization: `Bearer ${idToken}` } });
        emailInput.value = '';
        passwordInput.value = '';
    } catch (err) {
        console.error('Create user error:', err.message);
        alert(err.message);
    }
});

logAlreadyUserBtn?.addEventListener('click', () => {
    show(alreadyEmailInput);
    show(alreadyPasswordInput);
    show(logUserBtn);
    hide(logAlreadyUserBtn);
});

logUserBtn?.addEventListener('click', async () => {
    try {
        const result = await signInWithEmailAndPassword(auth, alreadyEmailInput.value, alreadyPasswordInput.value);
        const idToken = await result.user.getIdToken();
        await fetch('/v1/api/me', { method: 'GET', headers: { Authorization: `Bearer ${idToken}` } });
        alreadyEmailInput.value = '';
        alreadyPasswordInput.value = '';
    } catch (err) {
        console.error('Sign in error:', err.message);
        alert('Invalid email or password.');
    }
});