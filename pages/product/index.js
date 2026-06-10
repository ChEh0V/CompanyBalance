import { mockServices, calcAdditionalCapital, formatRub } from '../../data/services.js';

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData() {
        return mockServices.find(s => s.id === this.id) || null;
    }

    getHTML(data) {
        const capital = calcAdditionalCapital(data.revenue);
        const rate = data.revenue <= 100000 ? '20%'
                   : data.revenue <= 500000 ? '15%'
                   : '10%';
        return `
            <div class="product-page">
                <div class="product-card">
                    <img class="product-card__img" src="${data.src}" alt="${data.title}">
                    <div class="product-card__body">
                        <div class="product-card__title">${data.title}</div>
                        <div class="product-card__meta">
                            <div class="meta-item">
                                <span class="meta-label">Выручка от услуги</span>
                                <span class="meta-value">${formatRub(data.revenue)}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Ставка</span>
                                <span class="meta-value">${rate}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Добавочный капитал</span>
                                <span class="meta-value">${formatRub(capital)}</span>
                            </div>
                        </div>
                        <div class="product-card__text">${data.text}</div>
                        <a href="index.html" class="btn-back">← Назад к списку</a>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        this.parent.innerHTML = '';
        const data = this.getData();
        if (!data) {
            this.parent.innerHTML = '<div class="empty-state">Услуга не найдена. <a href="index.html">← Вернуться</a></div>';
            return;
        }
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
    }
}
