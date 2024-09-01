document.addEventListener('DOMContentLoaded', () => {
    const carritoLista = document.getElementById('carrito-lista');
    const carritoTotal = document.getElementById('carrito-total');
    const carritoItems = JSON.parse(localStorage.getItem('carritoItems')) || {};

    function updateCarrito() {
        carritoLista.innerHTML = '';
        let total = 0;

        for (const [name, { price, quantity, imgSrc }] of Object.entries(carritoItems)) {
            total += price * quantity;

            const item = document.createElement('li');
            item.classList.add('carrito-item');
            item.innerHTML = `
                <div class="carrito-item__imagen">
                    <img src="${imgSrc}" alt="Imagen del producto">
                </div>
                <div class="carrito-item__detalles">
                    <p class="carrito-item__nombre">${name}</p>
                    <p class="carrito-item__cantidad">Cantidad: 
                        <button class="carrito-item__modificar" data-name="${name}" data-action="decrease">-</button> 
                        ${quantity} 
                        <button class="carrito-item__modificar" data-name="${name}" data-action="increase">+</button>
                    </p>
                    <p class="carrito-item__precio">Precio: $${(price * quantity).toFixed(2)}</p>
                </div>
                <button class="carrito-item__modificar" data-name="${name}" data-action="remove">Eliminar</button>
            `;
            carritoLista.appendChild(item);
        }

        carritoTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    carritoLista.addEventListener('click', (e) => {
        const button = e.target;
        const name = button.dataset.name;
        const action = button.dataset.action;

        if (name && action) {
            if (action === 'increase') {
                carritoItems[name].quantity += 1;
            } else if (action === 'decrease') {
                if (carritoItems[name].quantity > 1) {
                    carritoItems[name].quantity -= 1;
                }
            } else if (action === 'remove') {
                delete carritoItems[name];
            }

            updateCarrito();
        }
    });

    document.getElementById('finalizar-compra').addEventListener('click', () => {
        localStorage.removeItem('carritoItems');
        alert('Gracias por su compra.');
        // Redirigir a otra página si es necesario
        window.location.href = 'index.html'; // Cambia a la página deseada
    });

    updateCarrito(); // Inicializar el carrito al cargar la página
});
