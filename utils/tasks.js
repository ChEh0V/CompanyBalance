// ============================================================
// Задание 2.12 — isEqual
// Применение: проверяем дублирование услуги перед добавлением в реестр
// ============================================================

/**
 * Сравнивает два значения любого типа (включая массивы и объекты).
 * Используется для проверки дублирования услуг в реестре.
 * @param {*} a - первое значение
 * @param {*} b - второе значение
 * @returns {boolean}
 */
export function isEqual(a, b) {
    if (typeof a !== typeof b) return false;
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i])) return false;
        }
        return true;
    }

    if (Array.isArray(a) !== Array.isArray(b)) return false;

    if (typeof a === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (const key of keysA) {
            if (!isEqual(a[key], b[key])) return false;
        }
        return true;
    }

    return a === b;
}

// ============================================================
// Задание 3.3 — flatten
// Применение: раскрываем вложенные категории услуги в плоский список
// ============================================================

/**
 * Раскрывает вложенные массивы в один плоский список.
 * @param {Array} arr - вложенный массив
 * @returns {Array} - плоский массив
 */
export function flatten(arr) {
    const result = [];
    for (const item of arr) {
        if (Array.isArray(item)) {
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
// Демонстрация — вызывается при клике «Показать демо» на карточке
// ============================================================

/**
 * Запускает демонстрацию isEqual и flatten для конкретной услуги.
 * @param {Object} service - объект услуги
 * @returns {Object} результаты для отображения
 */
export function runDemo(service) {
    // --- isEqual: проверяем дубликат в реестре ---
    const registry = [
        { title: 'Бухгалтерский аутсорсинг', revenue: 85000, category: 'Учёт и налоги' },
        { title: 'Финансовый консалтинг', revenue: 320000, category: 'Консалтинг' }
    ];

    const candidate = { title: service.title, revenue: service.revenue, category: service.category };

    let i = 0;
    let duplicateFound = false;
    let checked = null;

    do {
        checked = registry[i];
        if (isEqual(checked, candidate)) {
            duplicateFound = true;
        }
        i++;
    } while (!duplicateFound && i < registry.length);

    const isEqualResults = [
        {
            label: 'Одинаковые объекты услуг',
            a: JSON.stringify(registry[0]),
            b: JSON.stringify(registry[0]),
            result: isEqual(registry[0], registry[0])
        },
        {
            label: 'Разные услуги',
            a: `"${registry[0].title}"`,
            b: `"${registry[1].title}"`,
            result: isEqual(registry[0], registry[1])
        },
        {
            label: 'Одинаковые строки (категория)',
            a: `"${service.category}"`,
            b: `"${service.category}"`,
            result: isEqual(service.category, service.category)
        },
        {
            label: 'Число и строка (выручка)',
            a: String(service.revenue),
            b: `"${service.revenue}"`,
            result: isEqual(service.revenue, String(service.revenue))
        },
        {
            label: `Поиск дубликата «${service.title}» в реестре (do-while, проверено: ${i})`,
            a: `"${service.title}"`,
            b: 'реестр услуг',
            result: duplicateFound
        }
    ];

    // --- flatten: категории услуги ---
    const nestedCategories = [
        service.category,
        ['Финансы', ['Бюджетирование', 'Прогнозирование']],
        'Консалтинг',
        [['Добавочный капитал', 'Активы'], 'Аудит']
    ];

    const flatCategories = flatten(nestedCategories);

    return {
        isEqualResults,
        flattenInput: JSON.stringify(nestedCategories),
        flattenOutput: JSON.stringify(flatCategories),
        serviceName: service.title
    };
}
