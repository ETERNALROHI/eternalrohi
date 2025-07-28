document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const productNameInput = document.getElementById('productNameInput');
    const productDescriptionInput = document.getElementById('productDescriptionInput');
    const useGeminiDescripcionButton = document.getElementById('useGeminiDescripcion');
    const productQuantityInput = document.getElementById('productQuantityInput');
    const productPriceInput = document.getElementById('productPriceInput');
    const productCodeInput = document.getElementById('productCodeInput');
    const useCameraButton = document.getElementById('useCameraButton');
    const categoryProductSelect = document.getElementById('categoryProduct');
    const modeUseSelect = document.getElementById('modeUse');
    const PublicarProductoButton = document.getElementById('PublicarProducto');

    const scannerAppContainer = document.getElementById('scannerAppContainer');
    const TitleFormScanner = document.querySelector('.TitleForm'); // Título del escáner

    let myScanner = null; // Instancia del escáner

    // Función para mostrar y (re)iniciar el escáner
    function onScanner() {
        console.log("--- onScanner() llamado ---");

        // 1. Mostrar elementos relacionados con el escáner
        TitleFormScanner.classList.remove('hidden');
        scannerAppContainer.classList.remove('hidden');
        
        // **CORRECCIÓN AQUÍ:** Primero vaciamos el contenedor, luego lo llenamos con el span si no existe
        // o aseguramos que el span se crea con el render() de BarcodeScannerComponent
        // La forma más segura es que el span se inyecte con el HTML inicial o con el render del componente.
        // Dado que se remueve en offScanner(), lo mejor es volver a inyectarlo o asegurarnos que el componente lo inyecte.

        // Antes de crear la instancia, vaciamos por si quedó algo.
        scannerAppContainer.innerHTML = ''; 
        
        // **AÑADIR EL SPAN DE NUEVO SI NO LO HACE EL COMPONENTE:**
        // Si tu BarcodeScannerComponent no crea automáticamente el span .scanner-tip, necesitas agregarlo aquí.
        // Ojo: Si ya lo tienes en el HTML estático, y luego lo vacías con innerHTML = '', se pierde.
        // La mejor práctica es que el tip sea parte del HTML, y solo lo muestres/ocultes, no lo elimines.
        
        // Vamos a asumir que el span .scanner-tip debe ser parte de scannerAppContainer desde el HTML,
        // y que offScanner() lo oculta, no lo elimina.

        // Si el span estaba en el HTML y oculto, ahora lo mostramos:
        const scannerTipSpan = scannerAppContainer.querySelector('.scanner-tip');
        if (scannerTipSpan) { // Asegúrate de que el span exista ANTES de manipularlo
            scannerTipSpan.classList.remove('hidden'); 
        } else {
            // Si el span no existe (porque fue eliminado por innerHTML = ''), lo creamos y lo añadimos
            const newScannerTip = document.createElement('span');
            newScannerTip.classList.add('scanner-tip');
            newScannerTip.textContent = 'Asegúrese de que el código es el correcto';
            scannerAppContainer.appendChild(newScannerTip);
        }
        
        useCameraButton.classList.add('hidden'); // Ocultar el botón "Escanear por cámara"

        // 3. Inicializar o renderizar el escáner
        if (!myScanner) { 
            console.log("Creando nueva instancia de BarcodeScannerComponent.");
            myScanner = new BarcodeScannerComponent('scannerAppContainer', {
                onResult: (scannedText, scannedResult) => {
                    console.log("¡Resultado obtenido fuera del componente!", scannedText);
                    if (productCodeInput) {
                        productCodeInput.value = scannedText; 
                        offScanner(); // Ocultar y detener el escáner después de obtener el código
                    }
                },
                showResultArea: false // Mantenemos en false si no quieres el div de resultado visible
            });
            myScanner.render(); // Renderiza el componente por primera vez
        } else {
            console.warn("onScanner() llamado pero myScanner ya existe. Esto no debería ocurrir si offScanner() limpia correctamente.");
        }
        
        console.log("Escáner visible, botón 'Escanear por cámara' oculto.");
    }

    // Función para ocultar y detener el escáner
    function offScanner() {
        console.log("--- offScanner() llamado ---");
        // Ocultar elementos relacionados con el escáner y mostrar el botón de activar
        TitleFormScanner.classList.add('hidden');
        scannerAppContainer.classList.add('hidden');
        
        // **CORRECCIÓN AQUÍ:** Ocultar el span de tip si existe
        const scannerTipSpan = scannerAppContainer.querySelector('.scanner-tip');
        if (scannerTipSpan) {
            scannerTipSpan.classList.add('hidden'); 
        }

        useCameraButton.classList.remove('hidden');
        
        console.log("Contenedor del escáner y título ocultos, botón 'Escanear por cámara' visible.");

        if (myScanner) {
            console.log("Llamando a myScanner.clearScanner().");
            myScanner.clearScanner().then(() => {
                console.log("myScanner.clearScanner() completado exitosamente en script.js.");
                myScanner = null; // Reiniciar la variable para que se cree una nueva instancia la próxima vez
            }).catch(error => {
                console.error("Error capturado en script.js al limpiar el escáner:", error);
                myScanner = null; // En caso de error, también reiniciamos la instancia
            });
        } else {
            console.log("myScanner es null. No hay escáner activo para limpiar.");
        }
    }

    // --- Lógica inicial al cargar la página ---

    // Ocultar el escáner y el título del escáner al inicio
    offScanner(); // Esto también mostrará el botón useCameraButton inicialmente

    // Event listener para el botón "Escanear por cámara"
    useCameraButton.addEventListener('click', () => {
        onScanner(); // Mostrar e inicializar/reiniciar el escáner
    });

    // Event listener para el botón "Publicar Producto" (ejemplo)
    PublicarProductoButton.addEventListener('click', () => {
        const productData = {
            name: productNameInput.value,
            description: productDescriptionInput.value,
            quantity: productQuantityInput.value,
            price: productPriceInput.value,
            code: productCodeInput.value,
            category: categoryProductSelect.value,
            mode: modeUseSelect.value
        };
        console.log("Datos del producto a publicar:", productData);
        alert("Producto listo para publicar (ver consola)");
        // Aquí podrías enviar los datos a un servidor, guardarlos localmente, etc.
    });

    // Event listener para el botón "Usar Gemini para crear una descripción" (ejemplo)
    useGeminiDescripcionButton.addEventListener('click', () => {
        alert("Integración con Gemini para descripción (funcionalidad no implementada en este demo)");
        // Aquí iría la lógica para llamar a la API de Gemini
        // productDescriptionInput.value = "Descripción generada por Gemini..."; 
    });
});