import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAGzDstoqjuRsmPp-_x4IoL1CUVKmhLkcw",
    authDomain: "eternalrohi.firebaseapp.com",
    projectId: "eternalrohi",
    storageBucket: "eternalrohi.firebasestorage.app",
    messagingSenderId: "194948591144",
    appId: "1:194948591144:web:f44ec34a758c0d2e180f1d",
    measurementId: "G-MFJTJRWGCC"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Opcional, para analíticas
const auth = getAuth(app); // Obtiene la instancia de autenticación

// --- Referencias a elementos del DOM para la autenticación ---
const authModal = document.getElementById('authModal');
const closeModalButton = document.getElementById('closeModalButton');
const showLoginModalButton = document.getElementById('showLoginModal');

const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginErrorMessage = document.getElementById('loginErrorMessage');

const registerForm = document.getElementById('registerForm');
const registerEmailInput = document.getElementById('registerEmail');
const registerPasswordInput = document.getElementById('registerPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const registerErrorMessage = document.getElementById('registerErrorMessage');

const showRegisterFormLink = document.getElementById('showRegisterForm');
const showLoginFormLink = document.getElementById('showLoginForm');

const googleSignInButton = document.getElementById('googleSignInButton');
const facebookSignInButton = document.getElementById('facebookSignInButton');
const googleSignUpButton = document.getElementById('googleSignUpButton');
const facebookSignUpButton = document.getElementById('facebookSignUpButton');

const logoutButton = document.getElementById('logoutButton');
const welcomeMessageSpan = document.getElementById('welcome-message');
const authButtonsContainer = document.getElementById('auth-buttons-container'); // Contenedor de los botones de auth en la navbar
const forgotPasswordLink = document.getElementById('forgotPasswordLink');


// --- Funciones de Utilidad para el Modal ---
function showModal() {
    authModal.classList.remove('hidden');
    // Asegurarse de que el formulario de login es el que se muestra por defecto
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    // Limpiar mensajes de error
    loginErrorMessage.textContent = '';
    registerErrorMessage.textContent = '';
}

function hideModal() {
    authModal.classList.add('hidden');
    // Limpiar campos de formulario al cerrar
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    registerEmailInput.value = '';
    registerPasswordInput.value = '';
    confirmPasswordInput.value = '';
}

function displayError(element, message) {
    element.textContent = message;
    setTimeout(() => {
        element.textContent = ''; // Limpiar mensaje después de 5 segundos
    }, 5000);
}

// --- Manejadores de Eventos del Modal ---
showLoginModalButton.addEventListener('click', showModal);
closeModalButton.addEventListener('click', hideModal);

// Cerrar modal al hacer clic fuera del contenido
authModal.addEventListener('click', (event) => {
    if (event.target === authModal) {
        hideModal();
    }
});

showRegisterFormLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginErrorMessage.textContent = ''; // Limpiar mensaje de login
});

showLoginFormLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    registerErrorMessage.textContent = ''; // Limpiar mensaje de registro
});

// --- Funcionalidad de Olvidé Contraseña ---
forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = loginEmailInput.value.trim();
    if (email) {
        try {
            await sendPasswordResetEmail(auth, email);
            displayError(loginErrorMessage, "Correo de restablecimiento enviado. Revisa tu bandeja de entrada.");
        } catch (error) {
            console.error("Error al enviar restablecimiento de contraseña:", error.code, error.message);
            displayError(loginErrorMessage, "Error al enviar correo: " + (error.message || "Verifica el correo."));
        }
    } else {
        displayError(loginErrorMessage, "Por favor, ingresa tu correo electrónico para restablecer la contraseña.");
    }
});


// --- Manejadores de Autenticación ---

// Registro con Correo y Contraseña
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        displayError(registerErrorMessage, "Las contraseñas no coinciden.");
        return;
    }
    if (password.length < 6) {
        displayError(registerErrorMessage, "La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Usuario registrado:", userCredential.user);
        hideModal(); // Cierra el modal al registrarse con éxito
        // Firebase Functions: Aquí podrías llamar a una Cloud Function para establecer un rol inicial
        // Ejemplo: await callFirebaseFunction('setUserRole', { uid: userCredential.user.uid, role: 'cliente' });
    } catch (error) {
        console.error("Error de registro:", error.code, error.message);
        let errorMessage = "Error al registrarse. Inténtalo de nuevo.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "El correo electrónico ya está en uso.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "El formato del correo electrónico es inválido.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "La contraseña es demasiado débil.";
        }
        displayError(registerErrorMessage, errorMessage);
    }
});

// Inicio de Sesión con Correo y Contraseña
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario ha iniciado sesión:", userCredential.user);
        hideModal(); // Cierra el modal al iniciar sesión con éxito
    } catch (error) {
        console.error("Error de inicio de sesión:", error.code, error.message);
        let errorMessage = "Error al iniciar sesión. Verifica tus credenciales.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "Correo o contraseña incorrectos.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "El formato del correo electrónico es inválido.";
        }
        displayError(loginErrorMessage, errorMessage);
    }
});

// Inicio de Sesión/Registro con Google
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async (isSignUp) => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        console.log(`Usuario ${isSignUp ? 'registrado/iniciado' : 'iniciado'} con Google:`, userCredential.user);
        hideModal();
        // Firebase Functions: Si es un nuevo usuario, podrías llamar a una Cloud Function
        // para establecer un rol inicial o guardar datos adicionales en Firestore.
        // if (userCredential.additionalUserInfo.isNewUser) {
        //     await callFirebaseFunction('setUserRole', { uid: userCredential.user.uid, role: 'cliente' });
        // }
    } catch (error) {
        console.error("Error con Google Sign-In:", error.code, error.message);
        let errorMessage = "Error al iniciar sesión con Google.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = "Ventana de Google cerrada.";
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = "Solicitud de ventana emergente cancelada.";
        }
        displayError(isSignUp ? registerErrorMessage : loginErrorMessage, errorMessage);
    }
};
googleSignInButton.addEventListener('click', () => signInWithGoogle(false));
googleSignUpButton.addEventListener('click', () => signInWithGoogle(true));


// Inicio de Sesión/Registro con Facebook
const facebookProvider = new FacebookAuthProvider();
const signInWithFacebook = async (isSignUp) => {
    try {
        const userCredential = await signInWithPopup(auth, facebookProvider);
        console.log(`Usuario ${isSignUp ? 'registrado/iniciado' : 'iniciado'} con Facebook:`, userCredential.user);
        hideModal();
        // Firebase Functions: Similar a Google, para nuevos usuarios.
    } catch (error) {
        console.error("Error con Facebook Sign-In:", error.code, error.message);
        let errorMessage = "Error al iniciar sesión con Facebook.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = "Ventana de Facebook cerrada.";
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = "Solicitud de ventana emergente cancelada.";
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = "Ya existe una cuenta con este correo usando otro método. Inicia sesión con ese método.";
        }
        displayError(isSignUp ? registerErrorMessage : loginErrorMessage, errorMessage);
    }
};
facebookSignInButton.addEventListener('click', () => signInWithFacebook(false));
facebookSignUpButton.addEventListener('click', () => signInWithFacebook(true));


// Cerrar Sesión
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log("Usuario ha cerrado sesión.");
    } catch (error) {
        console.error("Error al cerrar sesión:", error.code, error.message);
        alert("Error al cerrar sesión: " + error.message);
    }
});

// --- Gestión del Estado de Autenticación (onAuthStateChanged) ---
// Este observador se activa cada vez que el estado de autenticación cambia (login, logout, recarga de página)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario está logueado
        console.log("Estado de autenticación: Usuario logueado", user);
        welcomeMessageSpan.textContent = `¡Hola, ${user.displayName || user.email}!`;
        welcomeMessageSpan.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        showLoginModalButton.classList.add('hidden'); // Oculta el botón de "Acceder/Registrarse"
        // Aquí podrías redirigir al usuario a su panel de control o mostrar contenido personalizado
    } else {
        // Usuario no está logueado
        console.log("Estado de autenticación: Usuario no logueado");
        welcomeMessageSpan.classList.add('hidden');
        logoutButton.classList.add('hidden');
        showLoginModalButton.classList.remove('hidden'); // Muestra el botón de "Acceder/Registrarse"
        // Aquí podrías redirigir a la página de inicio o mostrar contenido genérico
    }
});


// --- Lógica del Escáner (ELIMINADA PARA LA PÁGINA DE INICIO) ---
// Este bloque de código ha sido eliminado para que este script.js sea exclusivo de la página de inicio
// y sus funcionalidades de autenticación. Si necesitas el escáner en otras páginas,
// deberás incluir el script del escáner y su lógica en esos archivos JS específicos.

// El código que estaba aquí para el escáner (onScanner, offScanner, etc.) ha sido removido.

document.addEventListener('DOMContentLoaded', () => {
    // Estas referencias son para los elementos del formulario de producto que NO están en esta página de inicio.
    // Si este script.js es SOLO para la página de inicio, estos elementos no existen aquí.
    // Se comentan o eliminan si no se usan para evitar errores de "null".
    /*
    const productCodeInput = document.getElementById('productCodeInput');
    const useCameraButton = document.getElementById('useCameraButton');
    const scannerAppContainer = document.getElementById('scannerAppContainer');
    const TitleFormScanner = document.querySelector('.TitleForm'); 
    let myScanner = null; // Instancia del escáner
    */

    // Los event listeners para el formulario de producto (si el formulario no está en esta página)
    // también deberían ser eliminados o movidos al script.js de la página del formulario de producto.
    /*
    const PublicarProductoButton = document.getElementById('PublicarProducto');
    if (PublicarProductoButton) { 
        PublicarProductoButton.addEventListener('click', () => {
            const productData = {
                name: document.getElementById('productNameInput').value,
                description: document.getElementById('productDescriptionInput').value,
                quantity: document.getElementById('productQuantityInput').value,
                price: document.getElementById('productPriceInput').value,
                code: document.getElementById('productCodeInput').value,
                category: document.getElementById('categoryProduct').value,
                mode: document.getElementById('modeUse').value
            };
            console.log("Datos del producto a publicar:", productData);
            alert("Producto listo para publicar (ver consola)");
        });
    }

    const useGeminiDescripcionButton = document.getElementById('useGeminiDescripcion');
    if (useGeminiDescripcionButton) { 
        useGeminiDescripcionButton.addEventListener('click', () => {
            alert("Integración con Gemini para descripción (funcionalidad no implementada en este demo)");
        });
    }
    */
});
