import * as THREE from "three"
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import gsap from "gsap";

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


        this.time = 0;


        this.images = [...document.querySelectorAll("img")];
        

        this.addImages()
        this.setPosition()
        this.resize()
        this.setupResize()
        this.addObjects()
        this.render()
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
        this.camera.updateProjectionMatrix()
        // this.updatePlanePosition();
    }

    addImages() {
        this.imageStore = this.images.map(img => {
            let imgBounds = img.getBoundingClientRect()

            let imgGeo = new THREE.PlaneGeometry(imgBounds.width, imgBounds.height,50,50)
            let imgMat = new THREE.MeshBasicMaterial({
                color: "blue",
                wireframe: true
            })
            let imgMesh = new THREE.Mesh(imgGeo, imgMat)
            
            this.scene.add(imgMesh)

            return {
                img : img,
                mesh : imgMesh,
                top : imgBounds.top,
                left : imgBounds.left,
                width : imgBounds.width,
                height : imgBounds.height
            }

        })
    }

    setPosition() {
        this.imageStore.forEach(img => {
            img.mesh.position.x = img.left - this.width/2 + img.width/2
            img.mesh.position.y = -img.top + this.height/2 - img.height/2
        })
    }


    addObjects() {
        this.material = new THREE.ShaderMaterial({
            // extensions: {
            //     derivatives: "#extension GL_OES_standard_derivatives : enable",
            // },
            side: THREE.DoubleSide,
            // uniforms: {
            //     time: { value: 0 },
            //     // resolution: { value: new THREE.Vector4() },
            //     aspect: { value: new THREE.Vector2(1, 1) },
            //     uMouse: {value : this.mouse},
            //     uEnter: { value : null}
            // },
            vertexShader: vertex,
            fragmentShader: fragment,
            wireframe: true
        });

        // this.material = new THREE.MeshBasicMaterial({
        //     color: "red"
        // })
        this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
        this.plain = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plain);
    }



    render() {
        this.time += 0.01;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}