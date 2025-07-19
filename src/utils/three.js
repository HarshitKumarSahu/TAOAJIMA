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
    
        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.height,
            0.001,
            1000
        );
        this.camera.position.set(0, 0, 2);
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
        this.time = 0;
        this.isPlaying = true;
        this.mouse = 0;
    
        this.addObjects();
        // this.mouseEvent();
        // this.addPost();
        this.resize();
        this.render();
        this.setupResize();
        //   this.settings();
    }
    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                // mouse: { type: "f", value: 0 },
                // landscape: { value: t },
                resolution: { type: "v4", value: new THREE.Vector4() },
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
        this.camera.updateProjectionMatrix();
    }
  
    stop() {
        this.isPlaying = false;
    }
  
    play() {
        if (!this.isPlaying) {
            this.render();
            this.isPlaying = true;
        }
    }
  
    render() {
        if (!this.isPlaying) return;
        this.time += 0.001;
        this.material.uniforms.time.value = this.time;

        this.plain.rotation.x += 0.05 

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}
