import { EditPage } from './pages/edit/index.js';

const root = document.getElementById('root');
const params = new URLSearchParams(window.location.search);
const id = params.get('id') ? parseInt(params.get('id')) : null;

const editPage = new EditPage(root, id);
editPage.render();
