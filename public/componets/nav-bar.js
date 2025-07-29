document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarLinks = document.getElementById('navbarLinks');
    const mainContent = document.getElementById('mainContent'); // Referencia al contenido principal
    const body = document.body; // Referencia al body para añadir/quitar clases

    if (navbarToggle && navbarLinks && mainContent) {
        navbarToggle.addEventListener('click', () => {
            navbarLinks.classList.toggle('active'); // Alterna la clase 'active' en los enlaces (para el slide-in)
            navbarToggle.classList.toggle('active'); // Alterna la clase 'active' en el botón de hamburguesa
            body.classList.toggle('menu-open'); // Añade/quita la clase para mover el main content
        });

        // Opcional: Cerrar el menú si se hace clic fuera de él (solo para móviles)
        // Esto crea un overlay invisible que captura clics
        document.addEventListener('click', (event) => {
            // Verificar si el clic no fue dentro del menú ni en el botón de toggle
            if (window.innerWidth <= 992 && !navbarLinks.contains(event.target) && !navbarToggle.contains(event.target)) {
                if (navbarLinks.classList.contains('active')) {
                    navbarLinks.classList.remove('active');
                    navbarToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            }
        });

        // Cerrar el menú si se redimensiona la ventana a un tamaño de escritorio
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) { // El breakpoint que definimos en CSS
                if (navbarLinks.classList.contains('active')) {
                    navbarLinks.classList.remove('active');
                    navbarToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            }
        });

        // Lógica para los botones de búsqueda (opcional, si quieres que hagan algo)
        const buscadorDesktop = document.getElementById('BuscadorDesktop');
        const buscadorMobile = document.getElementById('BuscadorMobile');
        const searchButtons = document.querySelectorAll('.search-btn'); // Selecciona ambos botones

        searchButtons.forEach(button => {
            button.addEventListener('click', () => {
                let query = '';
                if (button.parentElement.classList.contains('navbar-search-desktop')) {
                    query = buscadorDesktop.value.trim();
                } else if (button.parentElement.classList.contains('navbar-search-mobile')) {
                    query = buscadorMobile.value.trim();
                }

                if (query) {
                    console.log("Realizando búsqueda:", query);
                    alert(`Buscando: "${query}"`);
                    // Aquí iría tu lógica de búsqueda real
                    // Puedes redirigir, filtrar resultados, etc.
                }
            });
        });

        // Permitir búsqueda con Enter en ambos campos
        if (buscadorDesktop) {
            buscadorDesktop.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Evitar envío de formulario si lo hubiera
                    searchButtons.forEach(button => {
                        if (button.parentElement.classList.contains('navbar-search-desktop')) {
                            button.click(); // Simula un clic en el botón de búsqueda
                        }
                    });
                }
            });
        }

        if (buscadorMobile) {
            buscadorMobile.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Evitar envío de formulario si lo hubiera
                    searchButtons.forEach(button => {
                        if (button.parentElement.classList.contains('navbar-search-mobile')) {
                            button.click(); // Simula un clic en el botón de búsqueda
                        }
                    });
                }
            });
        }

    } else {
        console.warn("Algunos elementos de navegación (navbarToggle, navbarLinks o mainContent) no fueron encontrados. El menú responsive o la lógica de movimiento no funcionará.");
    }
});