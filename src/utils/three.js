import * as THREE from "three";

import vertex from "../shaders/vertex.glsl"
import fragment from "../shaders/fragment.glsl"

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
        // this.renderer.setClearColor("#111", 1);
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
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.images = Array.from(document.querySelectorAll("img"));
        this.planes = [];

        this.time = 0;
        this.isPlaying = true;
        this.mouse = 0;

        this.addObjects();
        // this.mouseEvent();
        // this.addPost();
        this.imgPlanes();
        this.resize();
        this.setupResize();
        this.render();
        //   this.settings();
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
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            // wireframe : true,
        });

        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.plain = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plain);
    }

    imgPlanes() {
        this.images.forEach(image => {
            const imageBounds = image.getBoundingClientRect();
            const texture = new THREE.TextureLoader().load(image.src);
            const material = new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    uTexture: { value: texture },
                    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                    uHover: { value: 0 }
                }
            });
            const geometry = new THREE.PlaneGeometry(imageBounds.width, imageBounds.height);
            const plane = new THREE.Mesh(geometry, material);
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

    // settings() {
    //   this.settings = {
    //       howmuchrgb: 1,
    //   };
    //   this.gui = new dat.GUI();
    //   // this.gui.add(this.settings, "howmuchrgb", 0, 1, 0.01).onChange((value) => {
    //   //   this.material.uniforms.progress.value = value;
    //   // });
    //   this.gui.add(this.settings, "howmuchrgb", 0, 1, 0.01);
    // }

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

        this.updatePlanePosition();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}
