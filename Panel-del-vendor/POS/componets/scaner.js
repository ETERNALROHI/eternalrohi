// scanner-component.js

// scanner-component.js

class BarcodeScannerComponent {
    constructor(containerId, options = {}) {
        this.containerId = containerId; // El ID del div donde se renderizará nuestro componente
        this.readerId = 'reader';       // ID fijo para el div del escáner de html5-qrcode
        this.resultId = 'result';       // ID fijo para el div de resultados
        this.decodedTextElementId = 'decodedText'; // ID fijo para el span del texto decodificado

        this.html5QrcodeScanner = null; // Se inicializará al renderizar
        this.decodedTextElement = null; // Referencia al span donde se muestra el resultado
        this.resultParagraph = null;    // Referencia al párrafo que contiene el resultado

        // Opciones por defecto para html5-qrcode, puedes sobreescribirlas
        this.scannerOptions = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            disableFlip: false,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA, Html5QrcodeScanType.SCAN_TYPE_FILE],
            ...options.scannerOptions // Fusiona opciones pasadas por el usuario
        };

        // Nuevo: Callback para manejar el resultado fuera del componente
        this.onResult = options.onResult || null; 
        // Nuevo: Controla si se debe crear y mostrar el área de resultado
        this.showResultArea = options.showResultArea !== undefined ? options.showResultArea : true; 

        // Diccionario de traducciones
        this.translations = {
            "Requesting camera permissions...": "Solicitando permisos de cámara...",
            "Request Camera Permissions": "Solicitar Permisos de Cámara",
            "No cameras found.": "No se encontraron cámaras.",
            "Start Scanning": "Iniciar Escáner",
            "Stop Scanning": "Detener Escáner",
            "Select camera": "Seleccionar cámara",
            "Scanner paused": "Escáner pausado",
            "Scan an Image File": "Escanear un Archivo de Imagen",
            "No camera found": "No se encontró la cámara",
            "Camera access denied": "Acceso a la cámara denegado",
            "NotAllowedError": "Permiso denegado",
            "NotFoundError": "Cámara no encontrada",
            "OverconstrainedError": "La cámara no cumple los requisitos",
            "StreamApiNotSupportedError": "API de stream no compatible",
            "Secure connection required (HTTPS)": "Se requiere conexión segura (HTTPS)",
            "Scan using camera directly":"Escanear usando la cámara directamente",
            "Choose Image - No image choosen":"Elegir imagen - No hay ninguna imagen elegida",
            "Launching Camera...":"Iniciando cámara...",

            "Código detectado:": "Código detectado:",
            "Ninguno": "Ninguno",
            // Puedes añadir más traducciones aquí si identificas nuevos textos
        };
    }

    // Método para crear y adjuntar el HTML al DOM
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Contenedor con ID '${this.containerId}' no encontrado.`);
            return;
        }

        // Aplicar la clase de estilo del wrapper al contenedor del componente
        container.classList.add('scanner-container-wrapper');

        // Crear el div del lector
        const readerDiv = document.createElement('div');
        readerDiv.id = this.readerId;
        readerDiv.style.width = '100%'; // Asegura que ocupe el ancho disponible

        // Adjuntar al contenedor principal
        container.appendChild(readerDiv);
        
        // Crear el div de resultados SOLO SI showResultArea es true
        if (this.showResultArea) { 
            const resultDiv = document.createElement('div');
            resultDiv.id = this.resultId;
            const resultP = document.createElement('p');
            resultP.textContent = this.translations["Código detectado:"] + " ";
            this.decodedTextElement = document.createElement('span');
            this.decodedTextElement.id = this.decodedTextElementId;
            this.decodedTextElement.textContent = this.translations["Ninguno"];
            resultP.appendChild(this.decodedTextElement);
            resultDiv.appendChild(resultP);
            container.appendChild(resultDiv); // Adjuntar resultDiv al contenedor
            this.resultParagraph = resultP; // Guardar referencia al párrafo
        } else {
            // Si no se muestra, asegúrate de que decodedTextElement y resultParagraph sean null o vacíos
            this.decodedTextElement = null;
            this.resultParagraph = null;
        }

        // Inicializar el escáner de html5-qrcode
        this.html5QrcodeScanner = new Html5QrcodeScanner(
            this.readerId,
            this.scannerOptions,
            /* verbose= */ false
        );

        // Renderizar el escáner con sus callbacks
        this.html5QrcodeScanner.render(
            this.onScanSuccess.bind(this), // 'this' se mantiene en el contexto de la clase
            this.onScanFailure.bind(this)
        );

        // Configurar el MutationObserver para traducciones dinámicas
        this.setupTranslationObserver();

        // Aplicar traducciones iniciales después de un breve retardo
        setTimeout(() => this.applyTranslations(), 100);
    }

    onScanSuccess(decodedText, decodedResult) {
        console.log(`Code matched = ${decodedText}`, decodedResult);
        // Actualiza el texto en el DOM solo si el elemento de resultados existe
        if (this.decodedTextElement && this.resultParagraph) { 
            if (!this.resultParagraph.textContent.startsWith(this.translations["Código detectado:"])) {
                this.resultParagraph.textContent = this.translations["Código detectado:"] + " ";
                this.resultParagraph.appendChild(this.decodedTextElement);
            }
            this.decodedTextElement.textContent = decodedText;
        }

        // Llama al callback externo si está definido
        if (this.onResult && typeof this.onResult === 'function') {
            this.onResult(decodedText, decodedResult);
        }
    }

    onScanFailure(error) {
        // console.warn(`Code scan error = ${error}`);
        // La librería html5-qrcode ya maneja muchos mensajes de error internamente.
    }

    applyTranslations() {
        const readerElement = document.getElementById(this.readerId);
        if (!readerElement) return; // Salir si el lector no se ha renderizado aún

        // Traducir botones dinámicos y enlaces
        readerElement.querySelectorAll( // Busca solo dentro de nuestro componente
            '#html5-qrcode-button-camera-start, ' +
            '#html5-qrcode-button-camera-stop, ' +
            '#html5-qrcode-button-file-selection, ' +
            '#html5-qrcode-anchor-scan-type-change, ' +
            '#html5-qrcode-button-camera-permission'
        ).forEach(element => {
            const originalText = element.textContent.trim();
            if (this.translations[originalText] && element.textContent !== this.translations[originalText]) {
                 Promise.resolve().then(() => {
                     element.textContent = this.translations[originalText];
                 });
            }
        });

        // Traducir mensajes en el header de la cámara
        const permissionMessage = readerElement.querySelector('#reader__header_message');
        if (permissionMessage) {
            const originalText = permissionMessage.textContent.trim();
            if (this.translations[originalText] && !originalText.includes("Troubleshoot") && permissionMessage.textContent !== this.translations[originalText]) {
                Promise.resolve().then(() => {
                    permissionMessage.textContent = this.translations[originalText];
                });
            }
        }

        // Traducir la opción por defecto del selector de cámara
        const cameraSelect = readerElement.querySelector('#html5-qrcode-select-camera');
        if (cameraSelect) {
            const defaultOption = cameraSelect.querySelector('option');
            if (defaultOption && defaultOption.textContent.trim() === "Select camera" && this.translations["Select camera"]) {
                if (defaultOption.textContent !== this.translations["Select camera"]) {
                    Promise.resolve().then(() => {
                        defaultOption.textContent = this.translations["Select camera"];
                    });
                }
            }
        }

        // Traducir el mensaje "Scanner paused"
        const scannerPausedDiv = readerElement.querySelector('#reader__scan_region > div[style*="Scanner paused"]');
        if (scannerPausedDiv && scannerPausedDiv.textContent.trim() === "Scanner paused") {
            if (scannerPausedDiv.textContent !== this.translations["Scanner paused"]) {
                Promise.resolve().then(() => {
                    scannerPausedDiv.textContent = this.translations["Scanner paused"];
                });
            }
        }

        // Traducir el texto de tus propios elementos (del resultado), solo si existen
        if (this.showResultArea && this.resultParagraph && this.resultParagraph.firstChild && this.resultParagraph.firstChild.nodeType === Node.TEXT_NODE) {
            const originalText = this.resultParagraph.firstChild.nodeValue.trim();
            if (this.translations[originalText]) {
                this.resultParagraph.firstChild.nodeValue = this.translations[originalText] + " ";
            }
        }
        if (this.showResultArea && this.decodedTextElement && this.decodedTextElement.textContent.trim() === "Ninguno" && this.translations["Ninguno"]) {
            this.decodedTextElement.textContent = this.translations["Ninguno"];
        }
    }

    setupTranslationObserver() {
        const readerElement = document.getElementById(this.readerId);
        if (!readerElement) return;

        const observer = new MutationObserver((mutationsList, observer) => {
            this.applyTranslations(); // Re-aplicar traducciones en cada cambio
        });

        observer.observe(readerElement, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }

    // Métodos para controlar el escáner externamente (opcional)
    // Nota: El método stop() de html5-qrcode ya remueve el lector del DOM.
    // Si quieres control más fino, tendrías que ver la API de html5-qrcode.
    start() {
        if (this.html5QrcodeScanner && !this.html5QrcodeScanner.is){
            this.html5QrcodeScanner.start(/* args... */);
        }
    }

    stop() {
        if (this.html5QrcodeScanner) {
            this.html5QrcodeScanner.stop().catch(err => {
                console.error("Error al detener el escáner:", err);
            });
        }
    }

    // Método para limpiar el escáner (removerlo del DOM)
    clearScanner() {
        console.log("Intentando limpiar el escáner...");
        if (this.html5QrcodeScanner) {
            // html5QrcodeScanner.clear() devuelve una promesa
            return this.html5QrcodeScanner.clear().then(() => {
                console.log("html5QrcodeScanner.clear() completado.");
                const container = document.getElementById(this.containerId);
                if (container) {
                    const readerDiv = document.getElementById(this.readerId);
                    const resultDiv = document.getElementById(this.resultId); 
                    if (readerDiv) {
                        container.removeChild(readerDiv);
                        console.log("readerDiv removido del DOM.");
                    }
                    if (resultDiv) { // Solo si showResultArea fue true y se creó
                        container.removeChild(resultDiv);
                        console.log("resultDiv removido del DOM.");
                    }
                }
                // Aquí podrías opcionalmente resetear las referencias internas si lo necesitaras
                this.html5QrcodeScanner = null; 
                this.decodedTextElement = null;
                this.resultParagraph = null;
                return true; // Para indicar que la limpieza fue exitosa
            }).catch(err => {
                console.error("Error al limpiar el escáner (html5QrcodeScanner.clear):", err);
                // Si hay un error, aún intentamos remover los elementos del DOM si están
                const container = document.getElementById(this.containerId);
                if (container) {
                    const readerDiv = document.getElementById(this.readerId);
                    const resultDiv = document.getElementById(this.resultId);
                    if (readerDiv) container.removeChild(readerDiv);
                    if (resultDiv) container.removeChild(resultDiv);
                }
                this.html5QrcodeScanner = null; // Intentar resetear la instancia
                throw err; // Re-lanzar el error para que sea capturado en script.js
            });
        } else {
            console.log("No hay instancia de myScanner para limpiar.");
            // Si no hay escáner para limpiar, aseguramos que el DOM esté vacío de sus elementos
            const container = document.getElementById(this.containerId);
            if (container) {
                const readerDiv = document.getElementById(this.readerId);
                const resultDiv = document.getElementById(this.resultId);
                if (readerDiv) container.removeChild(readerDiv);
                if (resultDiv) container.removeChild(resultDiv);
            }
            return Promise.resolve(false); // Retorna una promesa resuelta indicando que no había escáner activo
        }
    }
}