document.addEventListener('DOMContentLoaded', ()=>{
    const costosinput = document.querySelector('.costosinput');
    const margeninput = document.querySelector('.margeninput');
    const ivaselect = document.querySelector('.ivaselect');
    const calcularB = document.querySelector('.calcularbutton');
    const mess = document.querySelector('.mess')
    const ivaresultado = document.querySelector('.ivaresultado');
    const ganancia = document.querySelector('.ganancia');
    const ventapublica = document.querySelector('.ventapublica');
    const comisiones = document.querySelector('.comisiones');
    const gananciabruta = document.querySelector('.gananciabruta');

    function GananciasNB(neta, bruta){
        if(neta>!-0){
            ganancia.textContent = `Ganancia neta: ${neta.toFixed(2)}`;
            ganancia.style.color = 'var(--success-color)';
        }else{
            ganancia.style.color = 'var(--error-color)';
            ganancia.textContent = `Perdida Neta:(Aumenta tu margen): ${neta.toFixed(2)}`;
        }
        if(bruta>!-0){
            gananciabruta.textContent = `Ganancia bruta: ${bruta.toFixed(2)}`;
            gananciabruta.style.color = 'var(--success-color)';
        }else{
            gananciabruta.textContent = `Perdida brutas(Aumenta tu margen): ${bruta.toFixed(2)}`;
            gananciabruta.style.color = 'var(--error-color)';
        
        }
    }
    calcularB.addEventListener('click', ()=>{
        const costo = parseFloat(costosinput.value);
        const margen = parseFloat(margeninput.value);
        const iva = parseFloat(ivaselect.value);
       
        if(costo>0&& margen>0){
            const resultadoV = ((costo*(margen/100)+costo));
            const resultadoI = resultadoV*iva;
            const resultadoC = resultadoV*0.075;
            const resultadoG = resultadoV-costo-resultadoC-resultadoI;
            const resultadoGB = resultadoV-costo;

            GananciasNB(resultadoG,resultadoGB)
            
            ventapublica.textContent = `Precio al publico: ${resultadoV.toFixed(2)}`;
            ivaresultado.textContent = `IVA a pagar: ${resultadoI.toFixed(2)}`;
            comisiones.textContent= `Comisiones(7.5%): ${resultadoC.toFixed(2)}`;
        }else{
            mess.textContent =  'Porfavor llene los datos numericos de forma correcta'
            setTimeout(() => {
                mess.textContent =''
            }, 3000);
            return;
        }
        

        
       
    });
});