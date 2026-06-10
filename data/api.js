// API URL — бэкенд из лабы 4 на порту 3000
const API_URL = 'http://localhost:3000/services';

/**
 * XHR GET — получить все услуги (с фильтром)
 * @param {string} title - фильтр по названию
 * @param {string} category - фильтр по категории
 * @param {function} onSuccess - колбэк при успехе
 * @param {function} onError - колбэк при ошибке
 */
export function fetchServices(title, category, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    let url = API_URL;
    const params = [];
    if (title) params.push('title=' + encodeURIComponent(title));
    if (category) params.push('category=' + encodeURIComponent(category));
    if (params.length) url += '?' + params.join('&');

    xhr.open('GET', url);
    xhr.responseType = 'json';

    xhr.onload = () => {
        if (xhr.status === 200) {
            onSuccess(xhr.response);
        } else {
            onError('Ошибка: ' + xhr.status);
        }
    };

    xhr.onerror = () => onError('Сетевая ошибка');
    xhr.send();
}

/**
 * XHR GET — получить услугу по id
 */
export function fetchServiceById(id, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${API_URL}/${id}`);
    xhr.responseType = 'json';

    xhr.onload = () => {
        if (xhr.status === 200) {
            onSuccess(xhr.response);
        } else {
            onError('Услуга не найдена');
        }
    };

    xhr.onerror = () => onError('Сетевая ошибка');
    xhr.send();
}

/**
 * XHR POST — создать услугу
 */
export function createService(data, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_URL);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';

    xhr.onload = () => {
        if (xhr.status === 201) {
            onSuccess(xhr.response);
        } else {
            onError(xhr.response?.error || 'Ошибка создания');
        }
    };

    xhr.onerror = () => onError('Сетевая ошибка');
    xhr.send(JSON.stringify(data));
}

/**
 * XHR PATCH — обновить услугу
 */
export function updateService(id, data, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `${API_URL}/${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';

    xhr.onload = () => {
        if (xhr.status === 200) {
            onSuccess(xhr.response);
        } else {
            onError(xhr.response?.error || 'Ошибка обновления');
        }
    };

    xhr.onerror = () => onError('Сетевая ошибка');
    xhr.send(JSON.stringify(data));
}

/**
 * XHR DELETE — удалить услугу
 */
export function deleteService(id, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${API_URL}/${id}`);

    xhr.onload = () => {
        if (xhr.status === 204) {
            onSuccess();
        } else {
            onError('Ошибка удаления');
        }
    };

    xhr.onerror = () => onError('Сетевая ошибка');
    xhr.send();
}
