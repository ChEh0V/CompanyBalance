import { calcAdditionalCapital, formatRub } from '../../data/services.js';

export class ServiceCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        const capital = calcAdditionalCapital(data.revenue);
        return `
            <div class="service-card" id="card-${data.id}">
                <img class="service-card__img" src="${data.src}" alt="${data.title}">
                <div class="service-card__body">
                    <div class="service-card__title">${data.title}</div>
                    <div class="service-card__revenue">Выручка: ${formatRub(data.revenue)}</div>
                    <div class="service-card__capital">Доб. капитал: ${formatRub(capital)}</div>
                    <div class="service-card__text">${data.text}</div>
                    <div class="service-card__actions">
                        <button class="btn-detail" id="btn-detail-${data.id}" data-id="${data.id}">Подробнее</button>
                        <button class="btn-delete" id="btn-delete-${data.id}" data-id="${data.id}">✕ Удалить</button>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data, onDetail, onDelete) {
        document.getElementById(`btn-detail-${data.id}`)
            .addEventListener('click', onDetail);
        document.getElementById(`btn-delete-${data.id}`)
            .addEventListener('click', onDelete);
    }

    render(data, onDetail, onDelete) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, onDetail, onDelete);
    }
}
