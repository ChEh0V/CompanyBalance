// В лабе 6 фронт раздаётся с бэкенда (порт 3000),
// поэтому запросы идут на тот же домен — CORS не нужен
const API_URL = '/services';

/**
 * fetch GET — получить все услуги с фильтром
 */
export async function fetchServices(title, category) {
    let url = API_URL;
    const params = [];
    if (title) params.push('title=' + encodeURIComponent(title));
    if (category) params.push('category=' + encodeURIComponent(category));
    if (params.length) url += '?' + params.join('&');

    const response = await fetch(url);
    if (!response.ok) throw new Error('Ошибка: ' + response.status);
    return response.json();
}

/**
 * fetch GET — получить услугу по id
 */
export async function fetchServiceById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Услуга не найдена');
    return response.json();
}

/**
 * fetch POST — создать услугу
 */
export async function createService(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Ошибка создания');
    }
    return response.json();
}

/**
 * fetch PATCH — обновить услугу
 */
export async function updateService(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Ошибка обновления');
    }
    return response.json();
}

/**
 * fetch DELETE — удалить услугу
 */
export async function deleteService(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Ошибка удаления');
}
