# Localizador de Gasolineras Cercanas
En este proyecto me pondría de nota un 9.

## Descripción
Este proyecto es una aplicación web que muestra las gasolineras más cercanas al usuario, ordenadas por precio de Gasolina 95. Además, permite visualizar estas gasolineras en un mapa interactivo, proporcionando enlaces directos a Google Maps para obtener indicaciones hacia ellas.

El objetivo principal es ofrecer una herramienta práctica y fácil de usar para ahorrar tiempo y dinero al buscar combustibles a precios competitivos.

## Características
- **Mapa interactivo**: Centrado en la ubicación actual del usuario, con marcadores personalizados para gasolineras.
- **Orden por precio**: Las gasolineras se ordenan según el precio de la Gasolina 95 E5.
- **Información detallada**: Muestra nombre, dirección, localidad y precios tanto de Gasolina 95 como de Diésel.
- **Enlaces a Google Maps**: Cada gasolinera incluye un enlace directo para obtener indicaciones.
- **Compatibilidad móvil**: Diseño responsivo para una experiencia óptima en diferentes dispositivos.

## Tecnologías utilizadas
- **HTML5**: Estructura del proyecto.
- **CSS3**: Estilización y diseño responsivo.
- **JavaScript**: Lógica del mapa interactivo y gestión de datos.
- **Leaflet.js**: Biblioteca para mapas interactivos.
- **OpenStreetMap**: Fuente de datos del mapa.

## Requisitos
- Navegador moderno con soporte para geolocalización.
- Conexión a internet para cargar el mapa y datos de la API del Ministerio para la Transición Ecológica.

## Instalación y uso
1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/usuario/localizador-gasolineras.git
   ```

2. **Abre el archivo `index.html` en tu navegador**.

3. **Concede permisos de ubicación** cuando el navegador los solicite.

4. **Explora** el mapa para ver las gasolineras más cercanas o consulta la lista ordenada por precio.

## Estructura del proyecto
```
localizador-gasolineras/
├── index.html       # Página principal
├── styles.css       # Archivo de estilos
├── script.js        # Lógica y funcionalidad
└── README.md        # Documentación
```

## Detalles importantes
### **Geolocalización**
- Si el usuario no concede permisos para la geolocalización, el mapa se centrará en el centro de España (Madrid).
- Se mostrará un mensaje de advertencia si la geolocalización no está disponible.

### **API utilizada**
Los datos de las gasolineras provienen de la API pública del Ministerio para la Transición Ecológica:
- URL: [https://sedeaplicaciones.minetur.gob.es](https://sedeaplicaciones.minetur.gob.es)
- La API puede sufrir cambios o interrupciones, lo que podría afectar la funcionalidad.

### **Errores conocidos**
- En algunos casos, las coordenadas proporcionadas por la API pueden tener errores, lo que afecta la ubicación precisa de las gasolineras.
- La aplicación requiere conexión a internet para cargar los datos y mapas correctamente.

## Mejoras sugeridas
- **Filtros avanzados**: Permitir al usuario ajustar el rango de búsqueda o priorizar otros combustibles.
- **Modo oscuro**: Mejorar la experiencia de uso nocturna.
- **Internacionalización**: Implementar soporte para múltiples idiomas.
- **Vehiculos eléctricos**: Que te indique los puntos de carga eléctricos.
- **Tipo de vehículo**: Que te de a elegir el tipo de vehiculo, es decir, de combustión o eléctrico.

## Autor
Desarrollado con la guía de [Héctor](hectorlm203@gmail.com). Si encuentras errores o tienes sugerencias, no dudes en crear un issue en el repositorio.

## Licencia
Este proyecto se distribuye bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente bajo los términos de esta licencia.
