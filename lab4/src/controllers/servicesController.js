const servicesService = require('../services/servicesService');

// GET /services?title=...
const getAllServices = (req, res) => {
    const { title } = req.query;
    const services = servicesService.findAll(title);
    res.json(services);
};

// GET /services/:id
const getServiceById = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'id должен быть числом' });
    }
    const service = servicesService.findOne(id);
    if (!service) {
        return res.status(404).json({ error: 'Услуга не найдена' });
    }
    res.json(service);
};

// POST /services
const createService = (req, res) => {
    const { title, revenue, text, src } = req.body;
    if (!title || revenue === undefined || !text) {
        return res.status(400).json({ error: 'Обязательные поля: title, revenue, text' });
    }
    if (typeof revenue !== 'number' || revenue <= 0) {
        return res.status(400).json({ error: 'revenue должен быть положительным числом' });
    }
    const newService = servicesService.create({ title, revenue, text, src: src || '' });
    res.status(201).json(newService);
};

// PATCH /services/:id
const updateService = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'id должен быть числом' });
    }
    if (req.body.revenue !== undefined) {
        if (typeof req.body.revenue !== 'number' || req.body.revenue <= 0) {
            return res.status(400).json({ error: 'revenue должен быть положительным числом' });
        }
    }
    const updated = servicesService.update(id, req.body);
    if (!updated) {
        return res.status(404).json({ error: 'Услуга не найдена' });
    }
    res.json(updated);
};

// DELETE /services/:id
const deleteService = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'id должен быть числом' });
    }
    const success = servicesService.remove(id);
    if (!success) {
        return res.status(404).json({ error: 'Услуга не найдена' });
    }
    res.status(204).send();
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
