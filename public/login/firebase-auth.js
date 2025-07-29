document.addEventListener('DOMContentLoaded', () => {
    // 1. **TU CONFIGURACIÓN DE FIREBASE AQUÍ**
    // Pega el objeto firebaseConfig que copiaste de la consola de Firebase
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
    firebase.initializeApp(firebaseConfig);

    // Obtén la instancia de Autenticación
    const auth = firebase.auth();

    // 2. Referencias a elementos del DOM
    const registerEmailInput = document.getElementById('registerEmail');
    const registerPasswordInput = document.getElementById('registerPassword');
    const registerButton = document.getElementById('registerButton');

    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginButton = document.getElementById('loginButton');

    const logoutButton = document.getElementById('logoutButton');
    const userInfoDiv = document.getElementById('user-info');
    const authFormsDiv = document.getElementById('auth-forms');
    const userEmailSpan = document.getElementById('userEmail');
    const authMessage = document.getElementById('auth-message');
    const mainBody = document.getElementById('body')

    // 3. Funciones de ayuda para mostrar mensajes
    function showMessage(message, type = 'info') {
        authMessage.textContent = message;
        authMessage.className = `message ${type}`; // Aplica clase para estilo (success, error, info)
    }

    function clearMessage() {
        authMessage.textContent = '';
        authMessage.className = 'message';
    }

    // 4. Lógica de Registro de Usuario
    registerButton.addEventListener('click', async () => {
        clearMessage();
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;

        if (email.length < 5 || password.length < 6) {
            showMessage("El correo y la contraseña deben tener al menos 6 caracteres.", "error");
            return;
        }

        try {
            // Crea un nuevo usuario con correo y contraseña
            await auth.createUserWithEmailAndPassword(email, password);
            showMessage("¡Registro exitoso! Ya puedes iniciar sesión.", "success");
            // Limpia los campos de registro
            registerEmailInput.value = '';
            registerPasswordInput.value = '';
        } catch (error) {
            // Manejo de errores de Firebase Auth
            console.error("Error al registrar:", error.message);
            if (error.code === 'auth/email-already-in-use') {
                showMessage("El correo ya está registrado.", "error");
            } else if (error.code === 'auth/invalid-email') {
                showMessage("Formato de correo electrónico inválido.", "error");
            }  else {
                showMessage(`Error al registrar: ${error.message}`, "error");
            }
            registerEmailInput.value = '';
            registerPasswordInput.value = '';
        }
    });

    // 5. Lógica de Inicio de Sesión de Usuario
    loginButton.addEventListener('click', async () => {
        clearMessage();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        try {
            // Inicia sesión con correo y contraseña
            await auth.signInWithEmailAndPassword(email, password);
            showMessage("¡Sesión iniciada correctamente!", "success");
        
            window.location.assign('file:///C:/Users/LENOVO%20GAMING/OneDrive/Desktop/proyectos/page.html');
            
            // Los campos de login se limpian al cambiar el estado de autenticación
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                showMessage("Credenciales inválidas. Verifica tu correo y contraseña.", "error");
            } else if (error.code === 'auth/invalid-email') {
                showMessage("Formato de correo electrónico inválido.", "error");
            }else if (error.code === 'auth/invalid-credential') {
                showMessage("contraseña incorrecta", "error");
                loginPasswordInput.value = '';
            }else {
                showMessage(`Error al iniciar sesión: ${error.message}`, "error");
            }
        }
    });

    // 6. Lógica de Cierre de Sesión
    logoutButton.addEventListener('click', async () => {
        clearMessage();
        try {
            await auth.signOut();
            showMessage("Sesión cerrada.", "info");
        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
            showMessage(`Error al cerrar sesión: ${error.message}`, "error");
        }
    });

    // 7. **Listener de Estado de Autenticación**
    // Esto se ejecuta cada vez que el estado de autenticación cambia (login, logout)
    auth.onAuthStateChanged(user => {
        clearMessage(); // Limpia mensajes al cambiar de estado
        if (user) {
            // Usuario está logueado
            authFormsDiv.classList.add('hidden'); // Oculta los formularios
            userInfoDiv.classList.remove('hidden'); // Muestra la info del usuario
            userEmailSpan.textContent = user.email; // Muestra el correo del usuario
            // Limpia los campos de login al pasar a la vista de usuario logueado
            loginEmailInput.value = '';
            loginPasswordInput.value = '';
            registerEmailInput.value='';
            registerPasswordInput.value='';
        } else {
            // Usuario no está logueado
            authFormsDiv.classList.remove('hidden'); // Muestra los formularios
            userInfoDiv.classList.add('hidden'); // Oculta la info del usuario
            userEmailSpan.textContent = ''; // Limpia el correo
        }
    });
});