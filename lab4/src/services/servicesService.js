const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

// Вычисляем рекомендуемый добавочный капитал
function calcAdditionalCapital(revenue) {
    if (revenue <= 100000) return Math.round(revenue * 0.20 * 100) / 100;
    if (revenue <= 500000) return Math.round(revenue * 0.15 * 100) / 100;
    return Math.round(revenue * 0.10 * 100) / 100;
}

// Обогащаем запись полем additionalCapital
function enrich(service) {
    return {
        ...service,
        additionalCapital: calcAdditionalCapital(service.revenue)
    };
}

// GET /services?title=...
const findAll = (title) => {
    const services = fileService.readData(dataFilePath);
    const filtered = title
        ? services.filter(s => s.title.toLowerCase().includes(title.toLowerCase()))
        : services;
    return filtered.map(enrich);
};

// GET /services/:id
const findOne = (id) => {
    const services = fileService.readData(dataFilePath);
    const found = services.find(s => s.id === id);
    return found ? enrich(found) : null;
};

// POST /services
const create = (data) => {
    const services = fileService.readData(dataFilePath);
    const newId = services.length > 0
        ? Math.max(...services.map(s => s.id)) + 1
        : 1;
    const newService = { id: newId, ...data };
    services.push(newService);
    fileService.writeData(dataFilePath, services);
    return enrich(newService);
};

// PATCH /services/:id
const update = (id, data) => {
    const services = fileService.readData(dataFilePath);
    const index = services.findIndex(s => s.id === id);
    if (index === -1) return null;
    const { id: _ignored, ...safeData } = data;
    services[index] = { ...services[index], ...safeData };
    fileService.writeData(dataFilePath, services);
    return enrich(services[index]);
};

// DELETE /services/:id
const remove = (id) => {
    const services = fileService.readData(dataFilePath);
    const filtered = services.filter(s => s.id !== id);
    if (filtered.length === services.length) return false;
    fileService.writeData(dataFilePath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
