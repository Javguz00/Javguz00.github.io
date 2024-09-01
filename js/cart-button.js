document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartContainer = document.getElementById('cart-container');
    const closeCart = document.getElementById('close-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const carritoItems = JSON.parse(localStorage.getItem('carritoItems')) || {};
  
    // Mostrar el carrito cuando se hace clic en el botón
    cartButton.addEventListener('click', () => {
      cartContainer.classList.remove('hidden');
      updateCartDisplay();
    });
  
    // Cerrar el carrito cuando se hace clic en "Cerrar"
    closeCart.addEventListener('click', () => {
      cartContainer.classList.add('hidden');
    });
  
    // Actualizar el contador del carrito
    function updateCartDisplay() {
      cartItems.innerHTML = '';
      let total = 0;
      let itemCount = 0;
  
      for (const [name, { price, quantity, imgSrc }] of Object.entries(carritoItems)) {
        total += price * quantity;
        itemCount += quantity;
  
        const item = document.createElement('div');
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
        cartItems.appendChild(item);
      }
  
      cartCount.textContent = itemCount;
    }
  
    // Inicializar la visualización del carrito al cargar la página
    updateCartDisplay();
  });
  