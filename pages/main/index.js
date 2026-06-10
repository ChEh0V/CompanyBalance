import { ServiceCardComponent } from '../../components/service-card/index.js';
import { fetchServices, deleteService } from '../../data/api.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.services = [];
        this.filterTitle = '';
        this.filterCategory = '';
    }

    get gridRoot() {
        return document.getElementById('cards-grid');
    }

    getHTML() {
        return `
            <div class="page-container">
                <div class="toolbar">
                    <input
                        class="filter-input"
                        id="filter-input"
                        type="text"
                        placeholder="🔍 Фильтр по названию..."
                    >
                    <input
                        class="filter-input"
                        id="filter-category"
                        type="text"
                        placeholder="🏷 Фильтр по категории..."
                        style="max-width:220px;"
                    >
                    <button class="btn-search" id="btn-search">Найти</button>
                    <button class="btn-add" id="btn-add">+ Добавить услугу</button>
                </div>
                <div id="error-msg" class="error-msg" style="display:none;"></div>
                <div class="cards-grid" id="cards-grid">
                    <div class="empty-state">Загрузка...</div>
                </div>
            </div>
        `;
    }

    showError(msg) {
        const el = document.getElementById('error-msg');
        el.textContent = msg;
        el.style.display = 'block';
    }

    hideError() {
        const el = document.getElementById('error-msg');
        if (el) el.style.display = 'none';
    }

    async loadServices() {
        this.hideError();
        const grid = this.gridRoot;
        grid.innerHTML = '<div class="empty-state">Загрузка...</div>';
        try {
            this.services = await fetchServices(this.filterTitle, this.filterCategory);
            this.renderCards();
        } catch (err) {
            this.showError('Ошибка загрузки: ' + err.message);
            grid.innerHTML = '';
        }
    }

    async deleteServiceHandler(id) {
        try {
            await deleteService(id);
            await this.loadServices();
        } catch (err) {
            this.showError('Ошибка удаления: ' + err.message);
        }
    }

    openDetail(id) {
        window.location.href = `product.html?id=${id}`;
    }

    openEdit(id) {
        window.location.href = `edit.html?id=${id}`;
    }

    renderCards() {
        const grid = this.gridRoot;
        grid.innerHTML = '';
        if (this.services.length === 0) {
            grid.innerHTML = '<div class="empty-state">Услуги не найдены 🔍</div>';
            return;
        }
        this.services.forEach(item => {
            const card = new ServiceCardComponent(grid);
            card.render(
                item,
                (e) => this.openDetail(parseInt(e.target.dataset.id)),
                (e) => this.deleteServiceHandler(parseInt(e.target.dataset.id)),
                (e) => this.openEdit(parseInt(e.target.dataset.id))
            );
        });
    }

    addListeners() {
        document.getElementById('btn-search').addEventListener('click', () => {
            this.filterTitle = document.getElementById('filter-input').value;
            this.filterCategory = document.getElementById('filter-category').value;
            this.loadServices();
        });

        document.getElementById('filter-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.filterTitle = e.target.value;
                this.filterCategory = document.getElementById('filter-category').value;
                this.loadServices();
            }
        });

        document.getElementById('btn-add').addEventListener('click', () => {
            window.location.href = 'edit.html';
        });
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.addListeners();
        this.loadServices();
    }
}
