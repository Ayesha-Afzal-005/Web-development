const MAX_PER_PRODUCT = 5;

let cart = [];   

const addButtons = document.querySelectorAll('.collection-card button');
const cartToggle = document.getElementById('cart-toggle');
const cartBadge  = document.getElementById('cart-badge');
const miniCart   = document.getElementById('mini-cart');
const itemsList  = document.getElementById('mini-cart-items');
const totalSpan  = document.getElementById('cart-total');

function getProduct(button) {
  const card  = button.closest('.collection-card');
  const name  = card.querySelector('h3').textContent.trim();
  const price = parseInt(card.querySelector('p').textContent.replace(/[^\d]/g, ''), 10);
  return { name, price };
}

function countOf(name) {
  return cart.filter(item => item.name === name).length;
}

function updateButtons() {
  addButtons.forEach(button => {
    const { name } = getProduct(button);
    if (countOf(name) >= MAX_PER_PRODUCT) {
      button.textContent = 'Limit reached';
      button.disabled = true;
    } else {
      button.textContent = 'Add to Cart';
      button.disabled = false;
    }
  });
}

function render() {
  cartBadge.textContent = cart.length;

  if (cart.length === 0) {
    itemsList.innerHTML = '<li class="mini-cart-empty">Your cart is empty.</li>';
  } else {
    itemsList.innerHTML = cart.map((item, index) => `
      <li class="mini-cart-item">
        <span class="mini-cart-name">${item.name}</span>
        <span class="mini-cart-price">Rs.${item.price.toLocaleString('en-US')}</span>
        <button type="button" class="mini-cart-remove" data-index="${index}">Remove</button>
      </li>`).join('');
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalSpan.textContent = 'Rs.' + total.toLocaleString('en-US');

  updateButtons();
}

addButtons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();               // stops the card link from opening product.html
    const product = getProduct(button);
    if (countOf(product.name) < MAX_PER_PRODUCT) {
      cart.push(product);
      render();
    }
  });
});
 
itemsList.addEventListener('click', event => {
  if (event.target.classList.contains('mini-cart-remove')) {
    cart.splice(Number(event.target.dataset.index), 1);
    render();
  }
});
 
cartToggle.addEventListener('click', event => {
  event.preventDefault();                
  const opening = miniCart.hidden;
  miniCart.hidden = !opening;
  cartToggle.setAttribute('aria-expanded', String(opening));
});
 
render();
 