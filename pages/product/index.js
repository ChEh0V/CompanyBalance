import { fetchServiceById } from '../../data/api.js';
import { calcAdditionalCapital, formatRub, getRate } from '../../data/services.js';

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getHTML(data) {
        const capital = calcAdditionalCapital(data.revenue);
        const rate = getRate(data.revenue);
        return `
            <div class="product-page">
                <div class="product-card">
                    <img class="product-card__img" src="${data.src}" alt="${data.title}">
                    <div class="product-card__body">
                        <div class="product-card__category">${data.category}</div>
                        <div class="product-card__title">${data.title}</div>
                        <div class="product-card__meta">
                            <div class="meta-item">
                                <span class="meta-label">Выручка от услуги</span>
                                <span class="meta-value">${formatRub(data.revenue)}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Ставка</span>
                                <span class="meta-value">${rate}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Добавочный капитал</span>
                                <span class="meta-value highlight">${formatRub(capital)}</span>
                            </div>
                        </div>
                        <div class="product-card__text">${data.text}</div>
                        <div id="three-container" class="three-container"></div>
                        <div class="product-actions">
                            <a href="edit.html?id=${data.id}" class="btn-edit">✏️ Редактировать</a>
                            <a href="index.html" class="btn-back">← Назад к списку</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async render() {
        this.parent.innerHTML = '<div class="empty-state">Загрузка...</div>';
        try {
            const data = await fetchServiceById(this.id);
            this.parent.innerHTML = '';
            this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
            this.initThreeJS();
        } catch {
            this.parent.innerHTML = '<div class="empty-state">Услуга не найдена. <a href="index.html">← Вернуться</a></div>';
        }
    }

    initThreeJS() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => this.buildScene();
        document.head.appendChild(script);
    }

    buildScene() {
        const container = document.getElementById('three-container');
        if (!container) return;
        const W = container.clientWidth || 400;
        const H = 220;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
        camera.position.set(0, 2, 5);
        camera.lookAt(0, 0, 0);

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dir = new THREE.DirectionalLight(0xffd700, 1.2);
        dir.position.set(3, 5, 3);
        scene.add(dir);

        const coinGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.12, 32);
        const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
        const coins = [];
        [-1.8, 0, 1.8].forEach((x, idx) => {
            for (let j = 0; j < idx + 2; j++) {
                const coin = new THREE.Mesh(coinGeo, coinMat);
                coin.position.set(x, j * 0.14 - 0.5, 0);
                scene.add(coin);
                coins.push(coin);
            }
        });

        const floor = new THREE.Mesh(
            new THREE.BoxGeometry(5, 0.08, 2),
            new THREE.MeshStandardMaterial({ color: 0x1a4a3a, roughness: 0.8 })
        );
        floor.position.y = -0.55;
        scene.add(floor);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame++;
            coins.forEach((c, i) => { c.rotation.y = frame * 0.01 + i * 0.3; });
            renderer.render(scene, camera);
        };
        animate();
    }
}
