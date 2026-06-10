import { calcAdditionalCapital, formatRub, getRate } from '../../data/services.js';
import { runDemo } from '../../utils/tasks.js';

export class ServiceCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getDemoHTML(demo) {
        const rows = demo.isEqualResults.map(r => `
            <tr>
                <td>${r.label}</td>
                <td class="demo-code">${r.a}</td>
                <td class="demo-code">${r.b}</td>
                <td class="${r.result ? 'demo-true' : 'demo-false'}">${r.result}</td>
            </tr>
        `).join('');

        return `
            <div class="card-demo">
                <div class="demo-section">
                    <h4 class="demo-title">📋 Задание 2.12 — <code>isEqual</code></h4>
                    <p class="demo-desc">
                        Проверка дублирования услуги в реестре компании.
                        Цикл <code>do-while</code> перебирает реестр до нахождения дубликата.
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
                        <tbody>${rows}</tbody>
                    </table>
                </div>
                <div class="demo-section">
                    <h4 class="demo-title">📋 Задание 3.3 — <code>flatten</code></h4>
                    <p class="demo-desc">
                        Раскрываем вложенные категории услуги
                        <strong>«${demo.serviceName}»</strong> в плоский список.
                    </p>
                    <div class="demo-flatten">
                        <span class="demo-label">Вложенные категории:</span>
                        <code class="demo-code-block">${demo.flattenInput}</code>
                        <div class="demo-arrow">↓ flatten()</div>
                        <span class="demo-label">Плоский список:</span>
                        <code class="demo-code-block">${demo.flattenOutput}</code>
                    </div>
                </div>
            </div>
        `;
    }

    getHTML(data) {
        const capital = calcAdditionalCapital(data.revenue);
        const rate = getRate(data.revenue);
        return `
            <div class="service-card" id="card-${data.id}">
                <img class="service-card__img" src="${data.src}" alt="${data.title}">
                <div class="service-card__body">
                    <div class="service-card__category">${data.category}</div>
                    <div class="service-card__title">${data.title}</div>
                    <div class="service-card__revenue">Выручка: ${formatRub(data.revenue)}</div>
                    <div class="service-card__rate">Ставка: ${rate}</div>
                    <div class="service-card__capital">Доб. капитал: ${formatRub(capital)}</div>
                    <div class="service-card__text">${data.text}</div>
                    <div class="card-demo-container" id="demo-container-${data.id}" style="display:none;"></div>
                    <div class="service-card__actions">
                        <button class="btn-detail" data-id="${data.id}">Подробнее</button>
                        <button class="btn-edit" data-id="${data.id}">✏️ Изменить</button>
                        <button class="btn-demo-card" data-id="${data.id}">🔬 Демо</button>
                        <button class="btn-delete" data-id="${data.id}">✕</button>
                    </div>
                </div>
            </div>
        `;
    }

    toggleDemo(data) {
        const container = document.getElementById(`demo-container-${data.id}`);
        const btn = document.querySelector(`#card-${data.id} .btn-demo-card`);
        if (container.style.display === 'none') {
            const demo = runDemo(data);
            container.innerHTML = this.getDemoHTML(demo);
            container.style.display = 'block';
            btn.textContent = '✖ Скрыть';
        } else {
            container.style.display = 'none';
            btn.textContent = '🔬 Демо';
        }
    }

    addListeners(data, onDetail, onDelete, onEdit) {
        document.querySelector(`#card-${data.id} .btn-detail`)
            .addEventListener('click', onDetail);
        document.querySelector(`#card-${data.id} .btn-delete`)
            .addEventListener('click', onDelete);
        document.querySelector(`#card-${data.id} .btn-demo-card`)
            .addEventListener('click', () => this.toggleDemo(data));
        if (onEdit) {
            document.querySelector(`#card-${data.id} .btn-edit`)
                .addEventListener('click', onEdit);
        }
    }

    render(data, onDetail, onDelete, onEdit) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.addListeners(data, onDetail, onDelete, onEdit);
    }
}
