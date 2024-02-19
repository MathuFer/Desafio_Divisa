function mostrarHistorial() {
    const monedaSeleccionada = document.getElementById('moneda').value;

    fetch(`https://mindicador.cl/api/${monedaSeleccionada}`)
    .then(res => res.json())
    .then(data => {
        const historial = data.serie.slice(-10);
        const fechas = historial.map(dia => dia.fecha.substring(0, 10));
        const valores = historial.map(dia => dia.valor);

        const ctx = document.getElementById('grafico').getContext('2d');
        
        if (window.grafico instanceof Chart) {
            window.grafico.destroy();
        }

        window.grafico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Historial últimos 10 días',
                    data: valores,
                    borderColor: 'red', 
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Hubo un problema al obtener los datos:', error);
    });
}



async function getMonedas() {
    const res = await fetch("https://mindicador.cl/api/");
    const data = await res.json();
    const monedas = Object.keys(data);

    const selectMoneda = document.getElementById('moneda');
    monedas.forEach(moneda => {
        if (moneda !== 'autor' && moneda !== 'fecha' && moneda !== 'version') {
            const option = document.createElement('option');
            option.value = moneda;
            option.textContent = data[moneda].nombre;
            selectMoneda.appendChild(option);
        }
    });
}

function convertir() {
    const montoInput = document.getElementById('monto').value;
    const monedaSeleccionada = document.getElementById('moneda').value;

    fetch(`https://mindicador.cl/api/${monedaSeleccionada}`)
    .then(res => res.json())
    .then(data => {
        const valorMoneda = data.serie[0].valor;
        const resultado = montoInput / valorMoneda;
        document.getElementById('resultado').innerText = `Resultado: 
        ${resultado.toFixed(2)} ${data.codigo}`;

        // Llamar a mostrarHistorial después de obtener los datos y calcular el resultado
        mostrarHistorial();
    })
    .catch(error => {
        console.error('Hubo un problema al obtener los datos:', error);
        document.getElementById('resultado').innerText = 'Hubo un problema al realizar la conversión.';
    });
}

document.addEventListener('DOMContentLoaded', getMonedas);

