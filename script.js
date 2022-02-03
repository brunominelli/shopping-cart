const cartItems = document.querySelector('.cart__items');
const emptyCart = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');
totalPrice.innerText = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function setCart() {
  const cart = document.querySelector('.cart');
  saveCartItems(cart.children[0].innerHTML);
}

function cartItemClickListener(event) {
  // const itemPrice = event.target.innerText.split('$')[1];
  event.target.remove();
  setCart();
}

function getCart() {
  cartItems.innerHTML = getSavedCartItems();
  cartItems.addEventListener('click', cartItemClickListener);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item item';
  li.innerText = `SKU: ${sku}\n\nNAME: ${name}\n\nPRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function sum({ price }) {
  const currentPrice = parseFloat(totalPrice.innerText);
  const itemPrice = parseFloat(price);
  const result = currentPrice + itemPrice;
  totalPrice.innerText = result;
}

function clearCart() {
  cartItems.innerHTML = '';
  totalPrice.innerText = 0;
  setCart();
}

function loadingAPI() {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'carregando...';
  document.querySelector('.items').appendChild(loading);
}

function stopLoadingAPI() {
  document.querySelector('.loading').remove();
}

async function getProduct(product) {
  const { results } = await fetchProducts(product);
  results.forEach((item) => {
    const { id, title, thumbnail } = item;
    const items = document.querySelector('.items');
    const listProducts = createProductItemElement({ sku: id, name: title, image: thumbnail });
    items.appendChild(listProducts);
  });
}

async function getItem(event) {
  const item = event.target.parentNode;
  const itemID = getSkuFromProductItem(item);
  const { id, title, price } = await fetchItem(itemID);
  const setItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  cartItems.appendChild(setItem);
  sum({ price });
  setCart();
}

window.onload = async () => {
  loadingAPI();
  await getProduct('computador');
  stopLoadingAPI();
  getCart();
  const buttonsItemAdd = document.querySelectorAll('.item__add');
  buttonsItemAdd.forEach((button) => button.addEventListener('click', getItem));
  emptyCart.addEventListener('click', clearCart);
};
