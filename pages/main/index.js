import { ServiceCardComponent } from '../../components/service-card/index.js';
import { mockServices } from '../../data/services.js';
import { runDemo } from '../../utils/tasks.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.services = [...mockServices];
        this.filterValue = '';
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
                    <button class="btn-add" id="btn-add">+ Добавить услугу</button>
                    <button class="btn-demo" id="btn-demo">🔬 Показать демо функций</button>
                </div>
                <div id="demo-block" class="demo-block" style="display:none;"></div>
                <div class="cards-grid" id="cards-grid"></div>
            </div>
        `;
    }

    getDemoHTML(demo) {
        const isEqualRows = demo.isEqualResults.map(r => `
            <tr>
                <td>${r.label}</td>
                <td class="demo-code">${r.a}</td>
                <td class="demo-code">${r.b}</td>
                <td class="${r.result ? 'demo-true' : 'demo-false'}">${r.result}</td>
            </tr>
        `).join('');

        return `
            <div class="demo-section">
                <h3 class="demo-title">📋 Задание 2.12 — <code>isEqual</code></h3>
                <p class="demo-desc">
                    Проверяем дублирование услуг в реестре компании.<br>
                    Цикл <code>do-while</code> перебирает реестр услуг до тех пор,
                    пока не найден дубликат или не просмотрены все записи.
                </p>
                <table class="demo-table">
                    <thead>
                        <tr>
                            <th>Сценарий</th>
                            <th>Значение A</th>
                            <th>Значение B</th>
                            <th>Результат</th>
                        </tr>
                    </thead>
                    <tbody>${isEqualRows}</tbody>
                </table>
            </div>

            <div class="demo-section">
                <h3 class="demo-title">📋 Задание 3.3 — <code>flatten</code></h3>
                <p class="demo-desc">
                    Раскрываем вложенные категории услуги
                    <strong>«${demo.serviceName}»</strong>
                    в плоский список тегов.
                </p>
                <div class="demo-flatten">
                    <div class="demo-io">
                        <span class="demo-label">Вложенные категории:</span>
                        <code class="demo-code-block">${demo.flattenInput}</code>
                    </div>
                    <div class="demo-arrow">↓ flatten()</div>
                    <div class="demo-io">
                        <span class="demo-label">Плоский список:</span>
                        <code class="demo-code-block">${demo.flattenOutput}</code>
                    </div>
                </div>
            </div>
        `;
    }

    toggleDemo() {
        const block = document.getElementById('demo-block');
        const btn = document.getElementById('btn-demo');
        if (block.style.display === 'none') {
            const demo = runDemo();
            block.innerHTML = this.getDemoHTML(demo);
            block.style.display = 'block';
            btn.textContent = '✖ Скрыть демо';
        } else {
            block.style.display = 'none';
            btn.textContent = '🔬 Показать демо функций';
        }
    }

    addService() {
        if (this.services.length === 0) return;
        const first = this.services[0];
        const newId = Math.max(...this.services.map(s => s.id)) + 1;
        this.services.push({ ...first, id: newId, title: first.title + ' (копия)' });
        this.renderCards();
    }

    deleteService(id) {
        this.services = this.services.filter(s => s.id !== id);
        this.renderCards();
    }

    openDetail(id) {
        window.location.href = `product.html?id=${id}`;
    }

    renderCards() {
        const grid = this.gridRoot;
        grid.innerHTML = '';
        const filtered = this.services.filter(s =>
            s.title.toLowerCase().includes(this.filterValue.toLowerCase())
        );
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state">Услуги не найдены 🔍</div>';
            return;
        }
        filtered.forEach(item => {
            const card = new ServiceCardComponent(grid);
            card.render(
                item,
                (e) => this.openDetail(parseInt(e.target.dataset.id)),
                (e) => this.deleteService(parseInt(e.target.dataset.id))
            );
        });
    }

    addListeners() {
        document.getElementById('filter-input').addEventListener('input', (e) => {
            this.filterValue = e.target.value;
            this.renderCards();
        });
        document.getElementById('btn-add').addEventListener('click', () => {
            this.addService();
        });
        document.getElementById('btn-demo').addEventListener('click', () => {
            this.toggleDemo();
        });
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.renderCards();
        this.addListeners();
    }
}
