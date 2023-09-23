document.addEventListener("DOMContentLoaded", () => {
    const botonTema = document.getElementById("botonTema");
    const buscar = document.getElementById("buscar");
    const listaRopa = document.getElementById("listaRopa");
    const carrito = document.getElementById("carrito");
    const precioTotal = document.getElementById("precioTotal");

    // Inicializar tema guardado en LocalStorage (claro u oscuro)
    const guardarTema = localStorage.getItem("tema");
    if (guardarTema) {
        document.body.classList.add(guardarTema);
    }

    // Cambiar de tema
    botonTema.addEventListener("click", () => {
        if (document.body.classList.contains("claro")) {
            document.body.classList.remove("claro");
            document.body.classList.add("oscuro");
            localStorage.setItem("tema", "oscuro");
        } else {
            document.body.classList.remove("oscuro");
            document.body.classList.add("claro");
            localStorage.setItem("tema", "claro");
        }
    });

    // Datos de prendas de ropa
    const ropa = [
        { id: 1, nombre: "Remera", precio: 20 },
        { id: 2, nombre: "Pantalón", precio: 40 },
        { id: 3, nombre: "Zapatillas", precio: 60 },   
        { id: 4, nombre: "Campera", precio: 50 },
        { id: 5, nombre: "Short", precio: 30 },
        { id: 6, nombre: "Medias", precio: 10 },
        { id: 7, nombre: "Buzo", precio: 45 },
    ];

    // Obtener el carrito almacenado
    let itemsCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Función para guardar el carrito
    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(itemsCarrito));
    }

    // Función para calcular y mostrar el total del carrito
    function totalCarrito() {
        let total = 0;
        itemsCarrito.forEach((itemId) => {
            const itemSeleccionado = ropa.find((item) => item.id === itemId);
            if (itemSeleccionado) {
                total += itemSeleccionado.precio;
            }
        });
        precioTotal.textContent = total.toFixed(2);
    }

    // Función para mostrar el carrito
    function mostrarCarrito() {
        carrito.innerHTML = "";
        itemsCarrito.forEach((itemId) => {
            const itemSeleccionado = ropa.find((item) => item.id === itemId);
            if (itemSeleccionado) {
                const itemCarrito = document.createElement("li");
                itemCarrito.innerHTML = `${itemSeleccionado.nombre} - ${itemSeleccionado.precio} pesos <button data-id="${itemId}">Eliminar</button>`;
                carrito.appendChild(itemCarrito);
            }
        });
        guardarCarrito();
        totalCarrito();
    }

    // Cargar el carrito almacenado
    mostrarCarrito();

    // Filtrar prendas por nombre
    buscar.addEventListener("input", () => {
        const buscarRopa = buscar.value.toLowerCase();
        const filtrarRopa = ropa.filter((item) => item.nombre.toLowerCase().includes(buscarRopa));
        if (buscarRopa === "") {
            mostrarRopa();
        } else {
            mostrarRopa(filtrarRopa);
        }
    });

    // Función para mostrar todas las prendas de ropa
    function mostrarRopa(prendas = ropa) {
        listaRopa.innerHTML = "";
        prendas.forEach((item) => {
            const todaLaRopa = document.createElement("div");
            todaLaRopa.classList.add("todaLaRopa");
            todaLaRopa.innerHTML = `<h3>${item.nombre}</h3><p>Precio: ${item.precio} pesos</p><button data-id="${item.id}">Agregar al carrito</button>`;
            listaRopa.appendChild(todaLaRopa);
        });
    }

    // Agregar prenda al carrito
    listaRopa.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const itemId = parseInt(event.target.getAttribute("data-id"));
            const itemSeleccionado = ropa.find((item) => item.id === itemId);
            if (itemSeleccionado) {
                const itemCarrito = document.createElement("li");
                itemCarrito.innerHTML = `${itemSeleccionado.nombre} - ${itemSeleccionado.precio} pesos <button data-id="${itemId}">Eliminar</button>`;
                carrito.appendChild(itemCarrito);
                itemsCarrito.push(itemId);
                guardarCarrito();
                totalCarrito();
            }
        }
    });

    // Eliminar prenda del carrito
    carrito.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const itemId = parseInt(event.target.getAttribute("data-id"));
            const itemSeleccionado = ropa.find((item) => item.id === itemId);
            if (itemSeleccionado) {
                Swal.fire({
                    title: '¿Seguro que quieres eliminar esta prenda del carrito?',
                    text: `Eliminar "${itemSeleccionado.nombre}" del carrito`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const itemIndex = itemsCarrito.indexOf(itemId);
                        if (itemIndex !== -1) {
                            itemsCarrito.splice(itemIndex, 1);
                            mostrarCarrito();
                            totalCarrito();
                            Swal.fire(
                                'Eliminado',
                                `"${itemSeleccionado.nombre}" ha sido eliminado del carrito.`,
                                'success'
                            );
                        }
                    }
                });
            }
        }
    });


    // Cargar todas las prendas al cargar la página
    mostrarRopa();
});
