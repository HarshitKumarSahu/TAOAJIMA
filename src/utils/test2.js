import * as THREE from "three";
import imagesLoaded from "imagesloaded";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import gsap from "gsap";
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default class Three {
    constructor(options) {
        this.scene = new THREE.Scene();
        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.cameraDistance = 5;
        this.fov = 2 * Math.atan((this.height / 2) / this.cameraDistance) * (180 / Math.PI);
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            this.width / this.height,
            0.1,
            100
        );
        this.camera.position.set(0, 0, this.cameraDistance);

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
        // Make canvas transparent to mouse events
        this.renderer.domElement.style.pointerEvents = 'none';
        // Ensure container is positioned
        this.container.style.position = 'relative';
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '2';

        this.time = 0;
        this.currentScroll = 0;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(0, 0);
        this.targetUV = new THREE.Vector2(0.5, 0.5);
        this.lerpFactor = 0.1;

        this.images = [...document.querySelectorAll("img")];
        // Ensure images are interactive
        this.images.forEach((img) => {
            img.style.position = 'relative';
            img.style.zIndex = '1';
            img.style.pointerEvents = 'auto';
        });

        const preLoadImages = new Promise((resolve, reject) => {
            imagesLoaded(
                document.querySelectorAll('img'),
                { background: true },
                () => {
                    console.log('all images are loaded');
                    resolve();
                }
            );
        });

        preLoadImages.then(() => {
            this.scroll = new Lenis({
                smoothWheel: true,
                autoRaf: false,
            });

            this.addImages();
            this.setPosition();
            this.mouseMovement();
            this.resize();
            this.setupResize();
            this.render();
        });
    }

    mouseMovement() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children);

            if (intersects.length > 0) {
                let obj = intersects[0].object;
                this.targetUV.copy(intersects[0].uv);
            } else {
                this.targetUV.set(0.5, 0.5);
            }
        });
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.fov = 2 * Math.atan((this.height / 2) / this.cameraDistance) * (180 / Math.PI);
        this.camera.updateProjectionMatrix();
        this.setPosition();
    }

    addImages() {
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uImage: { value: null },
                uHover: { value: new THREE.Vector2(0.5, 0.5) },
                uHoverState: { value: 0 },
                aspect: { value: new THREE.Vector2(1, 1) },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.materialArr = [];

        this.imageStore = this.images.map((img) => {
            let imgBounds = img.getBoundingClientRect();

            let texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            texture.encoding = THREE.sRGBEncoding;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            console.log('Image src:', img.src);

            let imgGeo = new THREE.PlaneGeometry(imgBounds.width, imgBounds.height, 50, 50);

            let imgMat = this.material.clone();
            imgMat.uniforms.uImage.value = texture;
            imgMat.uniforms.aspect.value = new THREE.Vector2(imgBounds.width / imgBounds.height, 1);
            this.materialArr.push(imgMat);

            img.addEventListener("mouseenter", () => {
                console.log('Mouse enter:', img.src);
                gsap.to(imgMat.uniforms.uHoverState, {
                    duration: 0.5,
                    value: 1,
                    ease: "circ.inOut",
                });
            });
            img.addEventListener("mouseleave", () => {
                console.log('Mouse leave:', img.src);
                gsap.to(imgMat.uniforms.uHoverState, {
                    duration: 0.5,
                    value: 0,
                    ease: "circ.inOut",
                });
            });

            let imgMesh = new THREE.Mesh(imgGeo, imgMat);
            this.scene.add(imgMesh);

            return {
                img: img,
                mesh: imgMesh,
                top: imgBounds.top,
                left: imgBounds.left,
                width: imgBounds.width,
                height: imgBounds.height,
            };
        });
    }

    setPosition() {
        this.imageStore.forEach((img) => {
            img.mesh.position.x = img.left - this.width / 2 + img.width / 2;
            img.mesh.position.y = this.currentScroll - img.top + this.height / 2 - img.height / 2;
        });
    }

    render() {
        this.time += 0.1;

        this.scroll.raf(performance.now());
        this.currentScroll = this.scroll.scroll;
        this.setPosition();

        this.materialArr.forEach((material) => {
            material.uniforms.uTime.value = this.time;
            material.uniforms.uHover.value.lerp(this.targetUV, this.lerpFactor);
        });

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}