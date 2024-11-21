const url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

async function fetchGasolineras() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const gasolineras = data.ListaEESSPrecio.filter(
            g => g.Provincia === "ALICANTE"
        );

        const gasolineraBarata = gasolineras.reduce((barata, actual) => {
            return parseFloat(actual['Precio Gasolina 95 E5'].replace(',', '.')) <
                   parseFloat(barata['Precio Gasolina 95 E5'].replace(',', '.'))
                ? actual
                : barata;
        });

        mostrarGasolinera(gasolineraBarata);
    } catch (error) {
        console.error("Error al obtener las gasolineras:", error);
        document.getElementById("gasolinera-container").innerHTML =
            "<p>Error al cargar los datos. Inténtalo más tarde.</p>";
    }
}

function mostrarGasolinera(gasolinera) {
    const contenedor = document.getElementById("gasolinera-container");

    contenedor.innerHTML = `
        <h2>Gasolinera más barata</h2>
        <p><strong>Dirección:</strong> ${gasolinera.Dirección}</p>
        <p><strong>Municipio:</strong> ${gasolinera.Municipio}</p>
        <p><strong>Precio Gasolina 95:</strong> ${gasolinera['Precio Gasolina 95 E5']} €</p>
        <p><strong>Horario:</strong> ${gasolinera.Horario}</p>
    `;
}

// Llamada inicial a la función
fetchGasolineras();
