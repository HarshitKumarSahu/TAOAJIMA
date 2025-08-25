// import * as THREE from "three"
// import imagesLoaded from "imagesloaded";
// import vertex from "../shaders/vertex.glsl";
// import fragment from "../shaders/fragment.glsl";
// import gsap from "gsap";
// import Lenis from 'lenis'
// import 'lenis/dist/lenis.css'

// import texture from "/1.mp4"
// export default class Three {
//     constructor(options) {
//         this.scene = new THREE.Scene();
//         this.container = options.dom;
//         this.width = this.container.offsetWidth;
//         this.height = this.container.offsetHeight;

//         this.cameraDistance = 5;
//         this.fov = 2 * Math.atan((this.height / 2) / this.cameraDistance) * (180 / Math.PI);
//         this.camera = new THREE.PerspectiveCamera(
//             this.fov,
//             this.width / this.height,
//             0.1,
//             100
//         );
//         this.camera.position.set(0, 0, this.cameraDistance);

//         this.renderer = new THREE.WebGLRenderer({
//             alpha: true,
//             antialias: true,
//         });
//         this.renderer.setPixelRatio(window.devicePixelRatio);
//         this.renderer.setSize(this.width, this.height);
//         this.renderer.physicallyCorrectLights = true;
//         this.renderer.outputEncoding = THREE.sRGBEncoding;
//         this.container.appendChild(this.renderer.domElement);


//         this.time = 0;
//         this.currentScroll = 0

//         this.raycaster = new THREE.Raycaster();
//         this.mouse = new THREE.Vector2(0, 0);

//         this.clock = new THREE.Clock();


//         this.images = [...document.querySelectorAll("img")];

//         const preLoadImages = new Promise((resolve, reject) => {
//             imagesLoaded(
//                 document.querySelectorAll('img'),
//                 { background: true },
//                 function () {
//                     console.log('all images are loaded');
//                     resolve();
//                 }
//             );
//         });

//         preLoadImages.then(() => {
//             this.scroll = new Lenis({
//                 // lerp: 0.075,
//                 smoothWheel: true,
//                 autoRaf: false, // Disable autoRaf to control RAF manually
//             });

//             this.addImages()
//             this.setPosition()
//             this.mouseMovement()
//             this.resize()
//             this.setupResize()
//             // this.addObjects()
//             this.render()

//         })
        
//     }

//     mouseMovement() {
//         window.addEventListener('mousemove', (event) => {
//             this.mouse.x = (event.clientX / this.width) * 2 - 1;
//             this.mouse.y = -(event.clientY / this.height) * 2 + 1;
    
//             this.raycaster.setFromCamera(this.mouse, this.camera);
//             const intersects = this.raycaster.intersectObjects(this.scene.children);
    
    
//             if (intersects.length > 0) {
//                 let obj = intersects[0].object;
//                 obj.material.uniforms.uHover.value = intersects[0].uv;
//             }
//         });
//     }

//     setupResize() {
//         window.addEventListener("resize", this.resize.bind(this));
//     }

//     resize() {
//         this.width = this.container.offsetWidth;
//         this.height = this.container.offsetHeight;
//         this.renderer.setSize(this.width, this.height);
//         this.camera.aspect = this.width / this.height;
//         this.camera.fov = 2 * Math.atan((this.height / 2) / this.cameraDistance) * (180 / Math.PI);
//         this.camera.updateProjectionMatrix()
//         this.setPosition()
//         // this.updatePlanePosition();
//     }


//     addImages() {

//         const video = document.createElement('video');
//         video.src = '/1.mp4'; // Path to your video
//         video.loop = true;
//         video.muted = true; // Mute to allow autoplay
//         video.crossOrigin = 'anonymous'; // If video is hosted externally
//         video.play().catch(error => console.error('Video playback failed:', error));

//         // Create video texture
//         const videoTexture = new THREE.VideoTexture(video);
//         // videoTexture.minFilter = THREE.LinearFilter;
//         // videoTexture.magFilter = THREE.LinearFilter;
//         // videoTexture.format = THREE.RGBAFormat;
//         // videoTexture.encoding = THREE.sRGBEncoding;

//         this.material = new THREE.ShaderMaterial({
//             side: THREE.DoubleSide,
//             uniforms: {
//                 uTime: { value: 0 },
//                 uImage: { value: null },
//                 uImage1: { value: videoTexture }, // Use video texture
//                 uHover: { value: new THREE.Vector2(0.5, 0.5) },
//                 uHoverState: { value: 0 },
//                 aspect: { value: new THREE.Vector2(1, 1) }, // Default aspect
//             },
//             vertexShader: vertex,
//             fragmentShader: fragment,
//         });
    
//         this.materialArr = [];
    
//         this.imageStore = this.images.map((img) => {
//             let imgBounds = img.getBoundingClientRect();
    
//             // Create texture from image
//             let texture = new THREE.Texture(img);
//             texture.needsUpdate = true;
//             // texture.encoding = THREE.sRGBEncoding;
//             // texture.minFilter = THREE.LinearFilter;
//             // texture.magFilter = THREE.LinearFilter;
    
//             // Create plane geometry with correct dimensions
//             // let imgGeo = new THREE.PlaneGeometry(imgBounds.width, imgBounds.height, 50, 50);
//             let imgGeo = new THREE.PlaneGeometry(1, 1,50,50)
//             imgGeo.scale(imgBounds.width, imgBounds.height, 1);
    
//             // Clone material and assign texture
//             let imgMat = this.material.clone();
//             imgMat.uniforms.uImage.value = texture;
//             imgMat.uniforms.aspect.value = new THREE.Vector2(imgBounds.width / imgBounds.height, 1); // Aspect ratio for shader
//             this.materialArr.push(imgMat);

//             // Find .list_num and .list_title for this image
//             const projectContainer = img.closest('.project_container');
//             const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
//             const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;
            
//             // Calculate heights for animations (if elements exist)
//             const listNumHeight = listNum ? listNum.offsetHeight : 0;
//             const listTitleHeight = listTitle ? listTitle.offsetHeight : 0;
    
//             img.addEventListener("mouseenter", () => {
//                 console.log('Mouse enter:', img.src);
//                 gsap.to(imgMat.uniforms.uHoverState, {
//                     duration: 0.5,
//                     value: 1,
//                     ease: "circ.inOut",
//                 });
//                 if (listNum) {
//                     gsap.to(listNum, {
//                         y: listNumHeight / 2,
//                         duration: 0.5,
//                         ease: "circ.inOut",
//                     });
//                 }
//                 if (listTitle) {
//                     gsap.to(listTitle, {
//                         y: -listTitleHeight / 2,
//                         duration: 0.5,
//                         ease: "circ.inOut",
//                     });
//                 }
//             });
//             img.addEventListener("mouseleave", () => {
//                 console.log('Mouse leave:', img.src);
//                 gsap.to(imgMat.uniforms.uHoverState, {
//                     duration: 0.5,
//                     value: 0,
//                     ease: "circ.inOut",
//                 });
//                 if (listNum) {
//                     gsap.to(listNum, {
//                         y: 0,
//                         duration: 0.5,
//                         ease: "circ.inOut",
//                     });
//                 }
//                 if (listTitle) {
//                     gsap.to(listTitle, {
//                         y: 0,
//                         duration: 0.5,
//                         ease: "circ.inOut",
//                     });
//                 }
//             });
    
//             // Create mesh
//             let imgMesh = new THREE.Mesh(imgGeo, imgMat);
//             this.scene.add(imgMesh);
    
//             return {
//                 img: img,
//                 mesh: imgMesh,
//                 top: imgBounds.top,
//                 left: imgBounds.left,
//                 width: imgBounds.width,
//                 height: imgBounds.height,
//             };
//         });
//     }


//     setPosition() {
//         this.imageStore.forEach(img => {
//             img.mesh.position.x = img.left - this.width/2 + img.width/2
//             img.mesh.position.y = this.currentScroll - img.top + this.height/2 - img.height/2
//         })
//     }





//     render() {
//         this.time += 0.01;
//         // this.time += this.clock.getDelta();

//         // Manually update Lenis
//         this.scroll.raf(performance.now());
//         this.currentScroll = this.scroll.scroll; // Use correct property for scroll position
//         this.setPosition();

//         this.materialArr.forEach(material => {
//             material.uniforms.uTime.value = this.time
//             // console.log()
//         })


//         this.renderer.render(this.scene, this.camera);
//         requestAnimationFrame(this.render.bind(this));
//     }
// }










import * as THREE from "three"
import imagesLoaded from "imagesloaded";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import gsap from "gsap";
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

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
        this.currentScroll = 0;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(0, 0);

        this.clock = new THREE.Clock();

        this.images = [...document.querySelectorAll("img[data-webgl-media]")];
        this.videos = [...document.querySelectorAll("video.project_video")];

        const preloadAssets = new Promise((resolve, reject) => {
            // Preload images
            const imagesPromise = new Promise((res) => {
                imagesLoaded(
                    document.querySelectorAll('img[data-webgl-media]'),
                    { background: true },
                    () => {
                        console.log('All images are loaded');
                        res();
                    }
                );
            });

            // Preload videos
            const videosPromise = new Promise((res) => {
                let loadedVideos = 0;
                const totalVideos = this.videos.length;

                if (totalVideos === 0) {
                    res();
                    return;
                }

                this.videos.forEach((video) => {
                    video.load();
                    video.onloadeddata = () => {
                        loadedVideos++;
                        if (loadedVideos === totalVideos) {
                            console.log('All videos are loaded');
                            res();
                        }
                    };
                    video.onerror = () => {
                        console.error(`Failed to load video: ${video.src}`);
                        loadedVideos++;
                        if (loadedVideos === totalVideos) {
                            res();
                        }
                    };
                });
            });

            Promise.all([imagesPromise, videosPromise]).then(() => {
                resolve();
            });
        });

        preloadAssets.then(() => {
            this.scroll = new Lenis({
                smoothWheel: true,
                autoRaf: false,
                // infinite: true
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
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.setPosition();

    }

    addImages() {
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uImage: { value: null },
                uImage1: { value: null },
                uHover: { value: new THREE.Vector2(0.5, 0.5) },
                uHoverState: { value: 0 },
                aspect: { value: new THREE.Vector2(1, 1) },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.materialArr = [];

        this.imageStore = this.images.map((img, index) => {
            let imgBounds = img.getBoundingClientRect();

            // Get corresponding video
            const video = this.videos[index];
            if (!video) {
                console.error(`No video found for image index ${index}`);
                return null;
            }

            // Ensure video is playing
            video.play().catch(error => console.error(`Video playback failed for ${video.src}:`, error));

            // Create video texture
            const videoTexture = new THREE.VideoTexture(video);

            // Create texture from image
            let texture = new THREE.Texture(img);
            texture.needsUpdate = true;

            // Create plane geometry with correct dimensions
            let imgGeo = new THREE.PlaneGeometry(1, 1, 50, 50);
            // imgGeo.scale(imgBounds.width, imgBounds.height, 1);

            // Clone material and assign textures
            let imgMat = this.material.clone();
            imgMat.uniforms.uImage.value = texture;
            imgMat.uniforms.uImage1.value = videoTexture;
            imgMat.uniforms.aspect.value = new THREE.Vector2(imgBounds.width / imgBounds.height, 1);
            this.materialArr.push(imgMat);

            // Find .list_num and .list_title for this image
            const projectContainer = img.closest('.project_container');
            const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
            const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;

            // Calculate heights for animations
            const listNumHeight = listNum ? listNum.offsetHeight : 0;
            const listTitleHeight = listTitle ? listTitle.offsetHeight : 0;

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
            imgMesh.scale.set(imgBounds.width, imgBounds.height, 1);
            this.scene.add(imgMesh);

            return {
                img: img,
                mesh: imgMesh,
                top: imgBounds.top,
                left: imgBounds.left,
                width: imgBounds.width,
                height: imgBounds.height,
            };
        }).filter(item => item !== null); // Remove null entries if any video is missing
    }

    setPosition() {
        // this.imageStore.forEach(img => {
        //     img.mesh.position.x = img.left - this.width/2 + img.width/2;
        //     img.mesh.position.y = this.currentScroll - img.top + this.height/2 - img.height/2;
        // });
        this.imageStore.forEach(img => {
            const bounds = img.img.getBoundingClientRect();
            img.top = bounds.top + window.scrollY; // Adjust for document scroll position
            img.left = bounds.left;
            img.width = bounds.width;
            img.height = bounds.height;
    
            img.mesh.position.x = img.left - this.width/2 + img.width/2;
            img.mesh.position.y = this.currentScroll - img.top + this.height/2 - img.height/2;
        });
    }

    render() {
        this.time += 0.01;

        // Manually update Lenis
        this.scroll.raf(performance.now());
        this.currentScroll = this.scroll.scroll;
        this.setPosition();

        this.materialArr.forEach(material => {
            material.uniforms.uTime.value = this.time;
        });

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}