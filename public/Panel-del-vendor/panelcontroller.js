document.addEventListener('DOMContentLoaded', () => {

    const sellerCalculatorsSelect = document.getElementById('sellerCalculatorsSelect');

    sellerCalculatorsSelect.addEventListener('change', (event) => {
        const selectedPage = event.target.value;
        if (selectedPage !== "") {
            console.log(`Redirigiendo a: ${selectedPage}`);
            
            window.location.href = selectedPage;
        } else {
            console.log("Se seleccionó la opción por defecto de las calculadoras.");
            // Si la primera opción es un "placeholder", puedes redirigir a una página principal
            // o simplemente no hacer nada como ahora.
            // window.location.href = "panel-principal.html"; 
        }
        if(sellerCalculatorsSelect.value===''){
            window.location.reload(true);
        }
        
    });
    
});