import * as THREE from "three"
import imagesLoaded from "imagesloaded";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import gsap from "gsap";
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
// import { backgroundIntensity } from "three/src/nodes/TSL.js";

import texture from "/2.jpg"
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
        this.currentScroll = 0

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(0, 0);

        this.clock = new THREE.Clock();


        this.images = [...document.querySelectorAll("img")];

        const preLoadImages = new Promise((resolve, reject) => {
            imagesLoaded(
                document.querySelectorAll('img'),
                { background: true },
                function () {
                    console.log('all images are loaded');
                    resolve();
                }
            );
        });

        preLoadImages.then(() => {

            // this.scroll = new Lenis({
            //     autoRaf: true
            // });

            // this.scroll = new Lenis({
            //     autoRaf: true
            // });
            this.scroll = new Lenis({
                // lerp: 0.075,
                smoothWheel: true,
                autoRaf: false, // Disable autoRaf to control RAF manually
            });

            this.addImages()
            this.setPosition()
            this.mouseMovement()
            this.resize()
            this.setupResize()
            // this.addObjects()
            this.render()

            // window.addEventListener("scroll", () => {
            //     this.currentScroll = window.scrollY
            //     this.setPosition()
            //     // console.log(window.scrollY)
            // })

            // this.scroll.on("scroll", ({ scroll }) => {
            //     this.currentScroll = scroll;
            //     this.setPosition();
            // });
        })
        

        // this.addImages()
        // this.setPosition()
        // this.resize()
        // this.setupResize()
        // this.addObjects()
        // this.render()
    }

    mouseMovement() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.height) * 2 + 1;
    
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children);
    
            // Reset uHover for all materials to avoid lingering effects
            // this.materialArr.forEach((material) => {
            //     material.uniforms.uHover.value.set(0.5, 0.5); // Neutral position
            // });
    
            if (intersects.length > 0) {
                let obj = intersects[0].object;
                obj.material.uniforms.uHover.value = intersects[0].uv;
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
        this.camera.updateProjectionMatrix()
        this.setPosition()
        // this.updatePlanePosition();
    }

    // addImages() {
    //     this.material = new THREE.ShaderMaterial({
    //         side: THREE.DoubleSide,
    //         uniforms: {
    //             time: { value: 0 },
    //             uImage: {value: 0},
    //             uHover: { value: new THREE.Vector2(0.5,0.5) },
    //             uHoverState: { value : 0 },
    //             // aspect: { value: new THREE.Vector2(1, 1) },
    //             // uMouse: {value : this.mouse},
    //             // uEnter: { value : null}
    //         },
    //         vertexShader: vertex,
    //         fragmentShader: fragment,
    //         // wireframe: true
    //     });

    //     this.materialArr = []

    //     this.imageStore = this.images.map(img => {
    //         let imgBounds = img.getBoundingClientRect()

    //         let texture = new THREE.Texture(img)
    //         texture.needsUpdate = true

    //         let imgGeo = new THREE.PlaneGeometry(1, 1,50,50)
    //         imgGeo.scale(imgBounds.width, imgBounds.height, 0);
            
    //         // let imgMat = new THREE.MeshBasicMaterial({
    //         //     color: "blue",
    //         //     wireframe: true
    //         // })
    //         let imgMat = this.material.clone()
    //         imgMat.uniforms.uImage.value = texture
    //         this.materialArr.push(imgMat)

    //         img.addEventListener("mouseenter", ()=> {
    //             gsap.to(imgMat.uniforms.uHoverState, {
    //                 duration: 1,
    //                 value: 1,
    //                 ease: "linear"
    //             })
    //         })
    //         img.addEventListener("mouseleave", ()=> {
    //             gsap.to(imgMat.uniforms.uHoverState, {
    //                 duration: 1,
    //                 value: 0,
    //                 ease: "linear"
    //             })
    //         })
            
            
            
    //         let imgMesh = new THREE.Mesh(imgGeo, imgMat)
    //         this.scene.add(imgMesh)

    //         return {
    //             img : img,
    //             mesh : imgMesh,
    //             top : imgBounds.top,
    //             left : imgBounds.left,
    //             width : imgBounds.width,
    //             height : imgBounds.height
    //         }

    //     })
    // }

    // addImages() {
    //     // let listNums = document.querySelectorAll(".list_num");
    //     // let listNumHeight = listNums[0].offsetHeight
    //     // let listTitles = document.querySelectorAll(".list_title");
    //     // let listTitlesHeight = listTitles[0].offsetHeight

    //     this.material = new THREE.ShaderMaterial({
    //         side: THREE.DoubleSide,
    //         uniforms: {
    //             uTime: { value: 0 },
    //             uImage: { value: null },
    //             uHover: { value: new THREE.Vector2(0.5, 0.5) },
    //             uHoverState: { value: 0 },
    //             aspect: { value : new THREE.Vector2(0.5,0.5)}
    //         },
    //         vertexShader: vertex,
    //         fragmentShader: fragment,
    //     });
    
    //     this.materialArr = [];
    
    //     this.imageStore = this.images.map((img) => {
    //         let imgBounds = img.getBoundingClientRect();
    
    //         // Create texture from image
    //         let texture = new THREE.Texture(img);
    //         texture.needsUpdate = true;
    //         texture.encoding = THREE.sRGBEncoding; // Correct color encoding
    //         texture.minFilter = THREE.LinearFilter; // Smooth texture rendering
    //         texture.magFilter = THREE.LinearFilter;
    
    //         // Create plane geometry with correct dimensions
    //         let imgGeo = new THREE.PlaneGeometry(imgBounds.width, imgBounds.height, 50, 50);
    
    //         // Clone material and assign texture
    //         let imgMat = this.material.clone();
    //         imgMat.uniforms.uImage.value = texture;
    //         imgMat.uniforms.aspect.value = new THREE.Vector2(imgBounds.width, imgBounds.height)
    //         this.materialArr.push(imgMat);
    
    //         // Add hover events
    //         img.addEventListener("mouseenter", () => {
    //             gsap.to(imgMat.uniforms.uHoverState, {
    //                 duration: 0.5,
    //                 value: 1,
    //                 ease: "circ.inOut",
    //             });
    //             // gsap.to(`.list_num`, {
    //             //     // y: "2vw",
    //             //     y: listNumHeight / 2,
    //             //     duration: 0.5,
    //             // });
    //             // gsap.to(".list_title", {
    //             //     y: -listTitlesHeight / 2,
    //             //     duration: 0.5,
    //             // });

    //         });
    //         img.addEventListener("mouseleave", () => {
    //             gsap.to(imgMat.uniforms.uHoverState, {
    //                 duration: 0.5,
    //                 value: 0,
    //                 ease: "circ.inOut",
    //             });
    //             // gsap.to(`.list_num`, {
    //             //     y: 0,
    //             //     duration: 0.5,
    //             // });
    //             // gsap.to(".list_title", {
    //             //     y: 0,
    //             //     duration: 0.5,
    //             // });
    //         });

    
    //         // Create mesh
    //         let imgMesh = new THREE.Mesh(imgGeo, imgMat);
    //         this.scene.add(imgMesh);
    
    //         return {
    //             img: img,
    //             mesh: imgMesh,
    //             top: imgBounds.top,
    //             left: imgBounds.left,
    //             width: imgBounds.width,
    //             height: imgBounds.height,
    //         };
    //     });
    // }

    addImages() {
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uImage: { value: null },
                uImage1: { value: new THREE.TextureLoader().load(texture)},
                uHover: { value: new THREE.Vector2(0.5, 0.5) },
                uHoverState: { value: 0 },
                aspect: { value: new THREE.Vector2(1, 1) }, // Default aspect
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });
    
        this.materialArr = [];
    
        this.imageStore = this.images.map((img) => {
            let imgBounds = img.getBoundingClientRect();
    
            // Create texture from image
            let texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            // texture.encoding = THREE.sRGBEncoding;
            // texture.minFilter = THREE.LinearFilter;
            // texture.magFilter = THREE.LinearFilter;
    
            // Create plane geometry with correct dimensions
            // let imgGeo = new THREE.PlaneGeometry(imgBounds.width, imgBounds.height, 50, 50);
            let imgGeo = new THREE.PlaneGeometry(1, 1,50,50)
            imgGeo.scale(imgBounds.width, imgBounds.height, 0);
    
            // Clone material and assign texture
            let imgMat = this.material.clone();
            imgMat.uniforms.uImage.value = texture;
            imgMat.uniforms.aspect.value = new THREE.Vector2(imgBounds.width / imgBounds.height, 1); // Aspect ratio for shader
            this.materialArr.push(imgMat);

            // Find .list_num and .list_title for this image
            const projectContainer = img.closest('.project_container');
            const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
            const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;
            
            // Calculate heights for animations (if elements exist)
            const listNumHeight = listNum ? listNum.offsetHeight : 0;
            const listTitleHeight = listTitle ? listTitle.offsetHeight : 0;
    
            // // Add hover events
            // img.addEventListener("mouseenter", () => {
            //     gsap.to(imgMat.uniforms.uHoverState, {
            //         duration: 0.5,
            //         value: 1,
            //         ease: "circ.inOut",
            //     });
            // });
            img.addEventListener("mouseenter", () => {
                console.log('Mouse enter:', img.src);
                gsap.to(imgMat.uniforms.uHoverState, {
                    duration: 0.5,
                    value: 1,
                    ease: "circ.inOut",
                });
                if (listNum) {
                    gsap.to(listNum, {
                        y: listNumHeight / 2,
                        duration: 0.5,
                        ease: "circ.inOut",
                    });
                }
                if (listTitle) {
                    gsap.to(listTitle, {
                        y: -listTitleHeight / 2,
                        duration: 0.5,
                        ease: "circ.inOut",
                    });
                }
            });
            // img.addEventListener("mouseleave", () => {
            //     gsap.to(imgMat.uniforms.uHoverState, {
            //         duration: 0.5,
            //         value: 0,
            //         ease: "circ.inOut",
            //     });
            // });
            img.addEventListener("mouseleave", () => {
                console.log('Mouse leave:', img.src);
                gsap.to(imgMat.uniforms.uHoverState, {
                    duration: 0.5,
                    value: 0,
                    ease: "circ.inOut",
                });
                if (listNum) {
                    gsap.to(listNum, {
                        y: 0,
                        duration: 0.5,
                        ease: "circ.inOut",
                    });
                }
                if (listTitle) {
                    gsap.to(listTitle, {
                        y: 0,
                        duration: 0.5,
                        ease: "circ.inOut",
                    });
                }
            });
    
            // Create mesh
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
        this.imageStore.forEach(img => {
            img.mesh.position.x = img.left - this.width/2 + img.width/2
            img.mesh.position.y = this.currentScroll - img.top + this.height/2 - img.height/2
        })
    }


    // addObjects() {
    //     this.material = new THREE.ShaderMaterial({
    //         // extensions: {
    //         //     derivatives: "#extension GL_OES_standard_derivatives : enable",
    //         // },
    //         side: THREE.DoubleSide,
    //         // uniforms: {
    //         //     time: { value: 0 },
    //         //     // resolution: { value: new THREE.Vector4() },
    //         //     aspect: { value: new THREE.Vector2(1, 1) },
    //         //     uMouse: {value : this.mouse},
    //         //     uEnter: { value : null}
    //         // },
    //         vertexShader: vertex,
    //         fragmentShader: fragment,
    //         wireframe: true
    //     });

    //     // this.material = new THREE.MeshBasicMaterial({
    //     //     color: "red"
    //     // })
    //     this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    //     this.plain = new THREE.Mesh(this.geometry, this.material);
    //     this.scene.add(this.plain);
    // }



    render() {
        this.time += 0.01;
        // this.time += this.clock.getDelta();

        // Manually update Lenis
        this.scroll.raf(performance.now());
        this.currentScroll = this.scroll.scroll; // Use correct property for scroll position
        this.setPosition();

        this.materialArr.forEach(material => {
            material.uniforms.uTime.value = this.time
            // console.log()
        })


        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}