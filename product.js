import { ProductPage } from './pages/product/index.js';

const root = document.getElementById('root');

// Читаем ?id=3 из адресной строки
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));

const productPage = new ProductPage(root, id);
productPage.render();
