import { fetchServiceById } from '../../data/api.js';
import { calcAdditionalCapital, formatRub, getRate } from '../../data/services.js';

export class EditPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id; // null = создание, число = редактирование
    }

    getHTML(data) {
        const isEdit = !!data;
        const capital = isEdit ? calcAdditionalCapital(data.revenue) : 0;
        const rate = isEdit ? getRate(data.revenue) : '—';

        return `
            <div class="product-page">
                <div class="product-card">
                    <div class="product-card__body">
                        <div class="product-card__category">
                            ${isEdit ? '✏️ Редактирование услуги' : '➕ Новая услуга'}
                        </div>
                        <div class="edit-info">
                            💡 В лабораторной работе 5 поля доступны для просмотра и ввода.<
                            Кнопка «Сохранить» появится в лабораторной работе 6.
                        </div>

                        <div class="edit-form">
                            <div class="form-group">
                                <label class="form-label">Название услуги</label>
                                <input
                                    class="form-input"
                                    id="field-title"
                                    type="text"
                                    placeholder="Введите название..."
                                    value="${isEdit ? data.title : ''}"
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label">Категория</label>
                                <input
                                    class="form-input"
                                    id="field-category"
                                    type="text"
                                    placeholder="Например: Консалтинг"
                                    value="${isEdit ? data.category : ''}"
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label">Выручка от услуги (₽)</label>
                                <input
                                    class="form-input"
                                    id="field-revenue"
                                    type="number"
                                    placeholder="Например: 150000"
                                    value="${isEdit ? data.revenue : ''}"
                                >
                            </div>

                            ${isEdit ? `
                            <div class="form-group">
                                <label class="form-label">Добавочный капитал (расчёт)</label>
                                <div class="calc-result">
                                    <span id="calc-capital">${formatRub(capital)}</span>
                                    <span class="calc-rate">ставка: ${rate}</span>
                                </div>
                            </div>
                            ` : ''}

                            <div class="form-group">
                                <label class="form-label">Описание услуги</label>
                                <textarea
                                    class="form-input form-textarea"
                                    id="field-text"
                                    placeholder="Описание услуги..."
                                >${isEdit ? data.text : ''}</textarea>
                            </div>

                            <div class="form-group">
                                <label class="form-label">URL изображения</label>
                                <input
                                    class="form-input"
                                    id="field-src"
                                    type="text"
                                    placeholder="https://..."
                                    value="${isEdit ? data.src : ''}"
                                >
                            </div>

                            ${isEdit ? `<img class="edit-preview" src="${data.src}" alt="${data.title}">` : ''}
                        </div>

                        <div class="product-actions">
                            <button class="btn-save-disabled" disabled title="Сохранение появится в лабораторной работе 6">
                                💾 Сохранить (доступно в ЛР-6)
                            </button>
                            <a href="index.html" class="btn-back">← Назад к списку</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        this.parent.innerHTML = '';
        if (this.id) {
            this.parent.innerHTML = '<div class="empty-state">Загрузка...</div>';
            fetchServiceById(
                this.id,
                (data) => {
                    this.parent.innerHTML = '';
                    this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
                },
                () => {
                    this.parent.innerHTML = '<div class="empty-state">Услуга не найдена. <a href="index.html">← Вернуться</a></div>';
                }
            );
        } else {
            this.parent.insertAdjacentHTML('beforeend', this.getHTML(null));
        }
    }
}
