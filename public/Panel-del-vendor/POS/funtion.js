document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const scannedCode = urlParams.get('code'); // Obtener el valor del parámetro 'code'

    const displayCodeElement = document.getElementById('displayCode');
    if (scannedCode) {
        displayCodeElement.textContent = scannedCode;
    } else {
        displayCodeElement.textContent = 'No se encontró ningún código.';
    }

    // Lógica para el botón de volver
    const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = './scanercam/page.html'; // Ajusta la ruta a tu página del escáner
            });
    }

    // Aquí puedes añadir más lógica para usar el 'scannedCode'
    // Por ejemplo, hacer una petición a tu base de datos con este código para obtener detalles del producto.
});