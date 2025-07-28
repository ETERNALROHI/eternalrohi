

document.addEventListener('DOMContentLoaded', () => {
    const costosinput = document.querySelector('.costosinput');
    const margeninput = document.querySelector('.margeninput');
    const costoEInput = document.querySelector('.costoEInput');
    const montoMinInput = document.querySelector('.montoMinimoInput');
    const ivaselect = document.querySelector('.ivaselect');
    const comisionselect = document.querySelector('.comisionselect'); // Asumiendo que añadirás un select para la comisión
    const calcularB = document.querySelector('.calcularbutton');
    const mess = document.querySelector('.mess');
    const ivaresultado = document.querySelector('.ivaresultado');
    const ganancia = document.querySelector('.ganancia'); // Ganancia Neta
    const ventapublica = document.querySelector('.ventapublica'); // Precio Normal
    const precioFinal = document.querySelector('.precioFinal'); // Precio Final al Público
    const comisionesDisplay = document.querySelector('.comisiones'); // Renombrado para evitar conflicto
    const gananciabruta = document.querySelector('.gananciabruta'); // Ganancia Bruta

    // Función para actualizar la visualización de las ganancias neta y bruta
    function actualizarResultados(neta, bruta) {
        if (neta >= 0) {
            ganancia.textContent = `Ganancia neta: ${neta.toFixed(2)}`;
            ganancia.style.color = 'var(--success-color)'; // Color para ganancia
        } else {
            ganancia.style.color = 'var(--error-color)'; // Color para pérdida
            ganancia.textContent = `Pérdida Neta (Aumenta tu margen): ${neta.toFixed(2)}`;
        }
        
        if (bruta >= 0) {
            gananciabruta.textContent = `Ganancia bruta: ${bruta.toFixed(2)}`;
            gananciabruta.style.color = 'var(--success-color)'; // Color para ganancia
        } else {
            gananciabruta.textContent = `Pérdida bruta (Aumenta tu margen): ${bruta.toFixed(2)}`;
            gananciabruta.style.color = 'var(--error-color)'; // Color para pérdida
        }
    }

    // Listener de evento para el botón de calcular
    calcularB.addEventListener('click', () => {
        const costo = parseFloat(costosinput.value);
        const margen = parseFloat(margeninput.value);
        const costoEnvioPromedio = parseFloat(costoEInput.value);
        const montoMinEnvioGratis = parseFloat(montoMinInput.value);
        const tasaIVA = parseFloat(ivaselect.value);
        // Asumiendo que tienes un select/input para la tasa de comisión
        // Si es un select, asegúrate de que su valor sea el decimal (ej. 0.075 o 0.065)
        const comisionRate = parseFloat(comisionselect ? comisionselect.value : 0.075); // Por defecto 0.075 si no hay select

        // --- Validación de entradas combinada y robusta ---
        if (isNaN(costo) || costo <= 0 || // El costo y el margen deben ser > 0
            isNaN(margen) || margen <= 0 ||
            isNaN(costoEnvioPromedio) || costoEnvioPromedio < 0 || // El costo de envío puede ser 0 si no aplica
            isNaN(montoMinEnvioGratis) || montoMinEnvioGratis <= 0 || // El monto mínimo debe ser > 0 para evitar división por cero
            isNaN(tasaIVA) || tasaIVA < 0 || // La tasa de IVA puede ser 0 si no aplica
            isNaN(comisionRate) || comisionRate < 0) { // La tasa de comisión puede ser 0
            
            mess.textContent = '¡Error! Por favor, ingrese valores numéricos válidos y positivos donde corresponda (costo, margen, monto mínimo de envío gratis).';
            setTimeout(() => {
                mess.textContent = '';
            }, 7000); // Tiempo extendido para que el usuario lea el mensaje de error
            return;
        }

        // --- Lógica de Cálculo ---

        // 1. Precio Normal del Producto (Costo + Margen)
        const precioNormalBase = costo * (1 + (margen / 100));
        
        // 2. Costo de Envío Prorrateado en el Precio del Producto
        const costoEnvioProrrateado = (costoEnvioPromedio / montoMinEnvioGratis) * precioNormalBase;
        
        // 3. Precio Final al Público (lo que el cliente paga, incluyendo el prorrateo del envío)
        const precioFinalPublico = precioNormalBase + costoEnvioProrrateado;
        
        // 4. IVA a Pagar (calculado sobre el Precio Final al Público)
        const ivaCalculado = precioFinalPublico * tasaIVA;
        
        // 5. Comisiones (aplicado el porcentaje seleccionado sobre el Precio Final al Público)
        const comisionesCalculadas = precioFinalPublico * comisionRate;
        
        // 6. Ganancia Bruta (Margen original antes de IVA y Comisiones)
        // Esto representa la ganancia que el vendedor deseaba antes de las deducciones fiscales y de plataforma.
        const gananciaBruta = precioFinalPublico - costo - costoEnvioProrrateado; 
        
        // 7. Ganancia Neta (Ganancia final después de todas las deducciones: costos, envío prorrateado, IVA, comisiones)
        const gananciaNeta = precioFinalPublico - costo - costoEnvioProrrateado - ivaCalculado - comisionesCalculadas;

        // --- Mostrar Resultados ---

        ventapublica.textContent = `Precio Normal: ${precioNormalBase.toFixed(2)}`;
        precioFinal.textContent = `Precio Final (Público): ${precioFinalPublico.toFixed(2)}`;
        ivaresultado.textContent = `IVA a pagar: ${ivaCalculado.toFixed(2)}`;
        // Muestra el porcentaje real de comisión que se está usando
        comisionesDisplay.textContent = `Comisiones (${(comisionRate * 100).toFixed(1)}%): ${comisionesCalculadas.toFixed(2)}`;
        
        actualizarResultados(gananciaNeta, gananciaBruta);

        mess.textContent = ''; // Limpiar mensaje de error si el cálculo fue exitoso
    });
});