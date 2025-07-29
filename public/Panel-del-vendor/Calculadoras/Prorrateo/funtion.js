document.addEventListener('DOMContentLoaded',()=>{
    //obtener los elementos del html
    const calculadoracontenedor = document.querySelector('.calculator-container');
    const selectModeInfo = document.getElementById('modeInfo');
    const infoData = document.getElementById('infoData');
    const addButton = document.getElementById('addProductBtn');
    const descripcionMode = document.getElementById('descripcionMode')
    const tableinfo = document.getElementById('dataInfo');
    const errorMG = document.getElementById('errorMG')
    const totalCostDisplay = document.getElementById('totalCostDisplay');
    //inputs gastos
    const totalBillCost = document.getElementById('totalBillCost');
    const totalFreightCost = document.getElementById('totalFreightCost');
    const totalCustomsPercentage= document.getElementById('totalCustomsPercentage');
    const totalInsuranceCost= document.getElementById('totalInsuranceCost');
    const otherCosts= document.getElementById('otherCosts');
    const marginalG = document.getElementById('marginalG');

    //inputs de producto
    const nameproduct = document.getElementById('nameproduct');
    const Uproduct = document.getElementById('Uproduct');
    const costB= document.getElementById('costB');

    //Array save
    let listproduct= [];
    
    function sumTotal(){
        let suma=0
        totalCostDisplay.textContent='';
        listproduct.forEach((product,index)=>{
            suma =suma+ product.costoTotal;
        });
        totalCostDisplay.textContent = `Costo Total de la Compra (Prorrateado): Q${suma}`
        
    }
    //tabla funciones
    function renderProducts(){
        console.table(listproduct)
        tableinfo.innerHTML ='';
        listproduct.forEach((product,index)=>{
            
            tableinfo.innerHTML+=`
            <tr>
            <td>${index+1}</td>
            <td>${product.name}</td>
            <td>${product.unidades}</td>
            <td>Q${product.costoU}</td>
            <td>Q${product.costoTotal}</td>
            <td>${(product.margen)*100}%</td>
            </tr>`
        })
        sumTotal();
    }
    //actualizaciones
    function descripcionUpddate(){
        if(selectModeInfo.value === 'Unitario'){
        descripcionMode.innerHTML = '<p id="descripcionMode" style="color: brown;">Descripción:Util al momento de calcular uno o varios productos con costos/gastos muy distintos<br>(Borra todas las casillas automaticamente)</p>'
        }else{
            descripcionMode.innerHTML='<p id="descripcionMode" style="color: brown;">Descripción: Util para productos con costos/gasto iguales o similares <br>(Borra solo las casillas del producto indivivual automaticamente)</p>'
        }
    }
    
    addButton.addEventListener('click',()=>{
        //obtener datos
        const nombre = nameproduct.value;
        const costoUnitario = costB.value;
        const Uexist = Uproduct.value;
        const totalfac = totalBillCost.value;
        const totalFletTransp = totalFreightCost.value;
        const totalAdunualPorcentaje = totalCustomsPercentage.value;
        const totalSeguros = totalInsuranceCost.value;
        const otrosCostos = otherCosts.value;
        const margenAGanar = marginalG.value;

        if (nombre ===''||
            costoUnitario<0 || isNaN(costoUnitario)||
            Uexist<0|| isNaN(Uexist)||
            totalfac<0 || isNaN(totalfac)||
            totalFletTransp<0 || isNaN(totalFletTransp)||
            totalAdunualPorcentaje < 0 || isNaN(totalAdunualPorcentaje)||
            totalSeguros<0||isNaN(totalSeguros)||
            otrosCostos<0||isNaN(otrosCostos)||
            margenAGanar<0 || isNaN(margenAGanar)){

                errorMG.classList.remove('hidden');
                console.log('No se pudo wey')
                return;

            }else{
                errorMG.classList.add('hidden');
                let sumaDecostos = 0;
                listproduct.forEach((product,index)=>{
                    sumaDecostos = sumaDecostos+product.costoTotal;
                });
                
                const costototalproducto = costoUnitario*Uexist
                listproduct.push({type:selectModeInfo.value,name:nombre,
                    unidades:Uexist,
                    costoU:costoUnitario,costoTotal:costototalproducto,
                    margen:margenAGanar/100,
                    totalFactura:totalfac,
                    totalAdunual:totalAdunualPorcentaje/100,
                    seguro:totalSeguros,
                    otrosGastos:otrosCostos});

                let sumaGastos = 0;
                listproduct.forEach((product,index)=>{
                    sumaGastos = sumaGastos+product.totalAdunual+product.totalAdunual+product.seguro+product.otrosGastos;
                });
                console.log(sumaGastos)
                renderProducts();
            }
        //renderProducts();
    });

    selectModeInfo.addEventListener('change',()=>{
        descripcionUpddate();
    });
});