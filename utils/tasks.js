// ============================================================
// Задание 2.12 — isEqual
// Применение в теме: проверяем, не дублируется ли услуга
// перед добавлением в реестр услуг компании
// ============================================================

/**
 * Сравнивает два значения любого типа (включая массивы и объекты).
 * Используется для проверки дублирования услуг в реестре.
 * @param {*} serviceA - первое значение (услуга, строка, число и т.д.)
 * @param {*} serviceB - второе значение
 * @returns {boolean}
 */
export function isEqual(serviceA, serviceB) {
    // Если типы разные — точно не равны
    if (typeof serviceA !== typeof serviceB) return false;

    // null отдельно — typeof null === 'object'
    if (serviceA === null && serviceB === null) return true;
    if (serviceA === null || serviceB === null) return false;

    // Массив — условно считаем отдельным типом
    if (Array.isArray(serviceA) && Array.isArray(serviceB)) {
        if (serviceA.length !== serviceB.length) return false;
        for (let i = 0; i < serviceA.length; i++) {
            if (!isEqual(serviceA[i], serviceB[i])) return false;
        }
        return true;
    }

    // Если один массив, а другой нет
    if (Array.isArray(serviceA) !== Array.isArray(serviceB)) return false;

    // Объект
    if (typeof serviceA === 'object') {
        const keysA = Object.keys(serviceA);
        const keysB = Object.keys(serviceB);
        if (keysA.length !== keysB.length) return false;
        for (const key of keysA) {
            if (!isEqual(serviceA[key], serviceB[key])) return false;
        }
        return true;
    }

    // Примитивы: number, string, boolean, undefined
    return serviceA === serviceB;
}

// ============================================================
// Задание 3.3 — flatten
// Применение в теме: у каждой услуги есть вложенные категории
// (например, категория → подкатегории → теги).
// Раскрываем в плоский список для отображения всех тегов услуги.
// ============================================================

/**
 * Раскрывает вложенные массивы категорий услуги в один плоский список.
 * @param {Array} serviceCategories - вложенный массив категорий/тегов
 * @returns {Array} - плоский массив
 */
export function flatten(serviceCategories) {
    const result = [];
    for (const item of serviceCategories) {
        if (Array.isArray(item)) {
            // Рекурсивно раскрываем вложенные массивы
            const nested = flatten(item);
            for (const nestedItem of nested) {
                result.push(nestedItem);
            }
        } else {
            result.push(item);
        }
    }
    return result;
}

// ============================================================
// Демонстрация с данными по теме "Услуги / Добавочный капитал"
// ============================================================

/**
 * Запускает демонстрацию обеих функций.
 * Возвращает объект с результатами для отображения на странице.
 */
export function runDemo() {
    // --- isEqual demo ---

    // Объект-услуга (используем объект по требованию задания)
    const serviceAlpha = {
        title: 'Бухгалтерский аутсорсинг',
        revenue: 85000,
        tags: ['учёт', 'налоги']
    };

    const serviceBeta = {
        title: 'Бухгалтерский аутсорсинг',
        revenue: 85000,
        tags: ['учёт', 'налоги']
    };

    const serviceGamma = {
        title: 'Финансовый консалтинг',
        revenue: 320000,
        tags: ['анализ']
    };

    // Коллекция (массив) — реестр уже добавленных услуг
    const serviceRegistry = [serviceAlpha, serviceGamma];

    // Цикл с постусловием — проверяем реестр до тех пор,
    // пока не найдём дубликат или не просмотрим все записи
    let registryIndex = 0;
    let duplicateFound = false;
    let checkedService = null;

    do {
        checkedService = serviceRegistry[registryIndex];
        if (isEqual(checkedService, serviceBeta)) {
            duplicateFound = true;
        }
        registryIndex++;
    } while (!duplicateFound && registryIndex < serviceRegistry.length);

    const isEqualResults = [
        {
            label: 'Две одинаковые услуги (объекты)',
            a: JSON.stringify(serviceAlpha),
            b: JSON.stringify(serviceBeta),
            result: isEqual(serviceAlpha, serviceBeta)
        },
        {
            label: 'Разные услуги',
            a: JSON.stringify(serviceAlpha),
            b: JSON.stringify(serviceGamma),
            result: isEqual(serviceAlpha, serviceGamma)
        },
        {
            label: 'Одинаковые строки (название услуги)',
            a: '"Аудит"',
            b: '"Аудит"',
            result: isEqual('Аудит', 'Аудит')
        },
        {
            label: 'Число и строка (выручка)',
            a: '85000',
            b: '"85000"',
            result: isEqual(85000, '85000')
        },
        {
            label: `Поиск дубликата в реестре (цикл do-while, проверено записей: ${registryIndex})`,
            a: '"Бухгалтерский аутсорсинг"',
            b: 'реестр услуг',
            result: duplicateFound
        }
    ];

    // --- flatten demo ---

    // Вложенные категории услуг (строка — название, массив — структура)
    const serviceName = 'Финансовый консалтинг';
    const nestedCategories = [
        'Финансы',
        ['Анализ', ['Бюджетирование', 'Прогнозирование']],
        'Консалтинг',
        [['Добавочный капитал', 'Активы'], 'Аудит']
    ];

    const flatCategories = flatten(nestedCategories);

    return {
        isEqualResults,
        flattenInput: JSON.stringify(nestedCategories),
        flattenOutput: JSON.stringify(flatCategories),
        serviceName,
        duplicateFound,
        registryIndex
    };
}
