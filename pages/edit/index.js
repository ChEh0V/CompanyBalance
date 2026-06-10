import { fetchServiceById, createService, updateService } from '../../data/api.js';
import { calcAdditionalCapital, formatRub, getRate } from '../../data/services.js';

export class EditPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
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

                        <div id="save-error" class="error-msg" style="display:none;"></div>
                        <div id="save-success" class="success-msg" style="display:none;">✅ Сохранено!</div>

                        <div class="edit-form">
                            <div class="form-group">
                                <label class="form-label">Название услуги</label>
                                <input class="form-input" id="field-title" type="text"
                                    placeholder="Введите название..."
                                    value="${isEdit ? data.title : ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Категория</label>
                                <input class="form-input" id="field-category" type="text"
                                    placeholder="Например: Консалтинг"
                                    value="${isEdit ? data.category : ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Выручка от услуги (₽)</label>
                                <input class="form-input" id="field-revenue" type="number"
                                    placeholder="Например: 150000"
                                    value="${isEdit ? data.revenue : ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Добавочный капитал (расчёт)</label>
                                <div class="calc-result">
                                    <span id="calc-capital">${isEdit ? formatRub(capital) : '—'}</span>
                                    <span class="calc-rate" id="calc-rate">ставка: ${rate}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Описание услуги</label>
                                <textarea class="form-input form-textarea" id="field-text"
                                    placeholder="Описание услуги...">${isEdit ? data.text : ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">URL изображения</label>
                                <input class="form-input" id="field-src" type="text"
                                    placeholder="https://..."
                                    value="${isEdit ? data.src : ''}">
                            </div>
                            ${isEdit ? `<img class="edit-preview" id="preview-img" src="${data.src}" alt="">` : ''}
                        </div>

                        <div class="product-actions">
                            <button class="btn-save" id="btn-save">
                                💾 ${isEdit ? 'Сохранить изменения' : 'Создать услугу'}
                            </button>
                            <a href="index.html" class="btn-back">← Назад к списку</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addFormListeners() {
        // Живой пересчёт добавочного капитала при вводе выручки
        const revenueInput = document.getElementById('field-revenue');
        if (revenueInput) {
            revenueInput.addEventListener('input', () => {
                const val = parseFloat(revenueInput.value);
                if (!isNaN(val) && val > 0) {
                    document.getElementById('calc-capital').textContent = formatRub(calcAdditionalCapital(val));
                    document.getElementById('calc-rate').textContent = 'ставка: ' + getRate(val);
                }
            });
        }

        // Предпросмотр изображения
        const srcInput = document.getElementById('field-src');
        const preview = document.getElementById('preview-img');
        if (srcInput && preview) {
            srcInput.addEventListener('input', () => {
                preview.src = srcInput.value;
            });
        }

        document.getElementById('btn-save').addEventListener('click', () => this.save());
    }

    async save() {
        const title = document.getElementById('field-title').value.trim();
        const category = document.getElementById('field-category').value.trim();
        const revenue = parseFloat(document.getElementById('field-revenue').value);
        const text = document.getElementById('field-text').value.trim();
        const src = document.getElementById('field-src').value.trim();

        const errorEl = document.getElementById('save-error');
        const successEl = document.getElementById('save-success');
        errorEl.style.display = 'none';
        successEl.style.display = 'none';

        if (!title || !category || isNaN(revenue) || !text || !src) {
            errorEl.textContent = 'Заполните все поля корректно.';
            errorEl.style.display = 'block';
            return;
        }

        const data = { title, category, revenue, text, src };

        try {
            if (this.id) {
                await updateService(this.id, data);
            } else {
                await createService(data);
            }
            successEl.style.display = 'block';
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        } catch (err) {
            errorEl.textContent = 'Ошибка: ' + err.message;
            errorEl.style.display = 'block';
        }
    }

    async render() {
        this.parent.innerHTML = '';
        if (this.id) {
            this.parent.innerHTML = '<div class="empty-state">Загрузка...</div>';
            try {
                const data = await fetchServiceById(this.id);
                this.parent.innerHTML = '';
                this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
            } catch {
                this.parent.innerHTML = '<div class="empty-state">Услуга не найдена. <a href="index.html">← Вернуться</a></div>';
                return;
            }
        } else {
            this.parent.insertAdjacentHTML('beforeend', this.getHTML(null));
        }
        this.addFormListeners();
    }
}
