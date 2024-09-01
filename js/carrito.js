document.addEventListener('DOMContentLoaded', () => {
    const productos = document.querySelectorAll('.producto');
    const carritoLista = document.getElementById('carrito-lista');
    const carritoTotal = document.getElementById('carrito-total');
    const carritoItems = JSON.parse(localStorage.getItem('carritoItems')) || {};

    function updateCarrito() {
        carritoLista.innerHTML = '';
        let total = 0;

        Object.entries(carritoItems).forEach(([name, { price, quantity, imgSrc }]) => {
            total += price * quantity;

            const item = document.createElement('li');
            item.classList.add('carrito-item');
            item.innerHTML = `
                <div class="carrito-item__imagen">
                    <img src="${imgSrc}" alt="Imagen del producto">
                </div>
                <div class="carrito-item__detalles">
                    <p class="carrito-item__nombre">${name}</p>
                    <p class="carrito-item__cantidad">Cantidad: ${quantity}</p>
                    <p class="carrito-item__precio">Precio: $${(price * quantity).toFixed(2)}</p>
                </div>
            `;
            carritoLista.appendChild(item);
        });

        carritoTotal.textContent = `Total: $${total.toFixed(2)}`;
        localStorage.setItem('carritoItems', JSON.stringify(carritoItems));
    }

    function handleDragStart(e) {
        const productoElemento = e.target.closest('.producto');
        e.dataTransfer.setData('text/name', productoElemento.dataset.name);
        e.dataTransfer.setData('text/price', productoElemento.dataset.price);
        e.dataTransfer.setData('text/img', productoElemento.querySelector('.producto__imagen').src);
        e.target.classList.add('dragging');
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleTouchStart(e) {
        const touch = e.touches[0];
        const productoElemento = e.target.closest('.producto');
        e.target.classList.add('dragging');

        e.target.dataset.touching = true;
        e.target.dataset.touchName = productoElemento.dataset.name;
        e.target.dataset.touchPrice = productoElemento.dataset.price;
        e.target.dataset.touchImg = productoElemento.querySelector('.producto__imagen').src;
    }

    function handleTouchMove(e) {
        e.preventDefault();
    }

    function handleTouchEnd(e) {
        if (e.target.dataset.touching) {
            const name = e.target.dataset.touchName;
            const price = parseFloat(e.target.dataset.touchPrice);
            const imgSrc = e.target.dataset.touchImg;

            if (!carritoItems[name]) {
                carritoItems[name] = { price, quantity: 0, imgSrc };
            }

            carritoItems[name].quantity += 1;
            updateCarrito();

            e.target.classList.remove('dragging');
            delete e.target.dataset.touching;
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const name = e.dataTransfer.getData('text/name');
        const price = parseFloat(e.dataTransfer.getData('text/price'));
        const imgSrc = e.dataTransfer.getData('text/img');

        if (name && price) {
            if (!carritoItems[name]) {
                carritoItems[name] = { price, quantity: 0, imgSrc };
            }

            carritoItems[name].quantity += 1;
            updateCarrito();
        }
    }

    productos.forEach(producto => {
        producto.addEventListener('dragstart', handleDragStart);
        producto.addEventListener('dragend', handleDragEnd);
        producto.addEventListener('touchstart', handleTouchStart);
        producto.addEventListener('touchmove', handleTouchMove);
        producto.addEventListener('touchend', handleTouchEnd);
    });

    carritoLista.addEventListener('dragover', handleDragOver);
    carritoLista.addEventListener('drop', handleDrop);

    function mostrarPais() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
                    .then(response => response.json())
                    .then(data => {
                        const geolocalizacion = document.getElementById('geolocalizacion');
                        if (data.countryName) {
                            geolocalizacion.textContent = `País: ${data.countryName}`;
                        } else {
                            geolocalizacion.textContent = 'No se pudo determinar el país.';
                        }
                    })
                    .catch(() => {
                        const geolocalizacion = document.getElementById('geolocalizacion');
                        geolocalizacion.textContent = 'Error al obtener la información del país.';
                    });
            }, () => {
                const geolocalizacion = document.getElementById('geolocalizacion');
                geolocalizacion.textContent = 'Geolocalización no disponible.';
            });
        } else {
            const geolocalizacion = document.getElementById('geolocalizacion');
            geolocalizacion.textContent = 'Geolocalización no soportada por el navegador.';
        }
    }

    updateCarrito();
    mostrarPais();
});