const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

// GET /services/         — список с фильтром по title и category
// POST /services/        — создать новую услугу
// GET /services/:id      — получить по id
// PATCH /services/:id    — обновить по id
// DELETE /services/:id   — удалить по id

router.get('/', servicesController.getAllServices);
router.post('/', servicesController.createService);
router.get('/:id', servicesController.getServiceById);
router.patch('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);

module.exports = router;
