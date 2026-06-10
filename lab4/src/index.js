const express = require('express');
const path = require('path');
const servicesRouter = require('./routes/services');
const servicesService = require('./services/servicesService');

const app = express();
const PORT = 3001;

const DATA_FILE_PATH = path.join(__dirname, 'data/services.json');
servicesService.init(DATA_FILE_PATH);

// 1. Парсинг JSON
app.use(express.json());

// 2. Логирование запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 3. Маршруты
app.use('/services', servicesRouter);

// 4. 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// 5. Обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
