const servicesService = require('../services/servicesService');

// GET /services?title=...&category=...
const getAllServices = (req, res) => {
    const { title, category } = req.query;
    const services = servicesService.findAll(title, category);
    res.json(services);
};

// GET /services/:id
const getServiceById = (req, res) => {
    const id = parseInt(req.params.id);
    const service = servicesService.findOne(id);
    if (!service) {
        return res.status(404).json({ error: 'Услуга не найдена' });
    }
    res.json(service);
};

// POST /services
const createService = (req, res) => {
    const { title, revenue, category, text, src } = req.body;
    if (!title || !revenue || !category || !text || !src) {
        return res.status(400).json({ error: 'Не все поля заполнены: title, revenue, category, text, src' });
    }
    const newService = servicesService.create({ title, revenue: Number(revenue), category, text, src });
    res.status(201).json(newService);
};

// PATCH /services/:id
const updateService = (req, res) => {
    const id = parseInt(req.params.id);
    const updated = servicesService.update(id, req.body);
    if (!updated) {
        return res.status(404).json({ error: 'Услуга не найдена' });
    }
    res.json(updated);
};

// DELETE /services/:id
const deleteService = (req, res) => {
    const id = parseInt(req.params.id);
    const success = servicesService.remove(id);
    if (!success) {
        return res.status(404).json({ error: 'Услуга не найдена' });
    }
    res.status(204).send();
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };
