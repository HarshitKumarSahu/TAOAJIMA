import * as THREE from "three";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import gsap from "gsap";

export default class Three {
    constructor(options) {
        this.scene = new THREE.Scene();
        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container.appendChild(this.renderer.domElement);

        this.cameraDistance = 5;
        this.fov = 2 * Math.atan((this.height / 2) / this.cameraDistance) * (180 / Math.PI);
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            this.width / this.height,
            0.1,
            100
        );
        this.camera.position.set(0, 0, this.cameraDistance);

        this.images = Array.from(document.querySelectorAll("img"));
        this.planes = [];

        this.time = 0;
        this.isPlaying = true;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hasMouseMoved = false; // Track if mouse has moved
        this.hoveredPlane = null; // Track currently hovered plane

        this.addObjects();
        this.mouseEvent();
        this.imgPlanes();
        this.resize();
        this.setupResize();
        this.render();
    }

    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector4() },
                uvRate1: { value: new THREE.Vector2(1, 1) },
                uMouse: {value : this.mouse}
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.plain = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plain);
    }

    imgPlanes() {
        this.images.forEach((image) => {
            const imageBounds = image.getBoundingClientRect();
            const texture = new THREE.TextureLoader().load(image.src);
            const geometry = new THREE.PlaneGeometry(imageBounds.width, imageBounds.height);
            const plane = new THREE.Mesh(geometry, this.material);
            plane.position.set(
                imageBounds.left - this.width / 2 + imageBounds.width / 2,
                -imageBounds.top + this.height / 2 - imageBounds.height / 2,
                0
            );
            this.planes.push(plane);
            this.scene.add(plane);
        });
    }

    updatePlanePosition() {
        this.planes.forEach((plane, index) => {
            const image = this.images[index];
            if (!image) return;
            const imageBounds = image.getBoundingClientRect();
            plane.position.set(
                imageBounds.left - this.width / 2 + imageBounds.width / 2,
                -imageBounds.top + this.height / 2 - imageBounds.height / 2,
                0
            );
        });
    }

    onHover(plane) {
        let listNums = document.querySelectorAll(".list_num");
        let listNumHeight = listNums[0].offsetHeight
        let listTitles = document.querySelectorAll(".list_title");
        let listTitlesHeight = listTitles[0].offsetHeight

        console.log(listNumHeight , listTitlesHeight)
        
        // Only trigger animation if this is a new hover
        if (this.hoveredPlane !== plane) {
            this.hoveredPlane = plane; // Update hovered plane
            gsap.to(`.list_num`, {
                // y: "2vw",
                y: listNumHeight / 2,
                duration: 0.5,
            });
            gsap.to(".list_title", {
                y: -listTitlesHeight / 2,
                duration: 0.5,
            });
        }
    }

    onHoverEnd() {
        // Reset animations when hover ends
        if (this.hoveredPlane) {
            this.hoveredPlane = null;
            gsap.to(`.list_num`, {
                y: 0,
                duration: 0.5,
            });
            gsap.to(".list_title", {
                y: 0,
                duration: 0.5,
            });
        }
    }

    mouseEvent() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.height) * 2 + 1;
            this.hasMouseMoved = true; // Mark that mouse has moved
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
        this.updatePlanePosition();
    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.render();
        }
    }

    render() {
        if (!this.isPlaying) return;
        this.time += 0.001;
        if (this.material && this.material.uniforms && this.material.uniforms.time) {
            this.material.uniforms.time.value = this.time;
        }

        // Only check intersections if mouse has moved
        if (this.hasMouseMoved) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.planes);

            if (intersects.length > 0) {
                // Call onHover for the first intersected plane
                this.onHover(intersects[0].object);
            } else {
                // No intersections, end hover state
                this.onHoverEnd();
            }
        }

        this.updatePlanePosition();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}