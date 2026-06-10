const express = require('express');
const path = require('path');
const servicesRouter = require('./routes/services');
const servicesService = require('./services/servicesService');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data/services.json');
servicesService.init(DATA_FILE_PATH);

// 1. Парсинг JSON
app.use(express.json());

// 2. Раздача статики фронтенда из lab6 (папка public копируется сюда)
app.use(express.static(path.join(__dirname, '..', 'public')));

// 3. Логирование
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 4. Роуты API
app.use('/services', servicesRouter);

// 5. Для лабы 5 — CORS (при запуске фронта отдельно)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// 6. 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// 7. Обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
    console.log(`API:            http://localhost:${PORT}/services`);
    console.log(`Фронтенд:       http://localhost:${PORT}/`);
});
