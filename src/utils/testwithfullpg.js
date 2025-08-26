
import * as THREE from "three"
import imagesLoaded from "imagesloaded";
import vertex from "../shaders/newVertex.glsl";
import fragment from "../shaders/newFragment.glsl";
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
            this.addClickEvents()
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
                uProgress: { value: 0 },
                uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
                uTextureSize: { value: new THREE.Vector2(1, 1) }, 
                uResolution: { value: new THREE.Vector2(this.width, this.height) },
                uQuadSize: { value: new THREE.Vector2(1, 1) } // Matches geometry size
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
            imgMat.uniforms.uTextureSize.value = new THREE.Vector2(imgBounds.width , imgBounds.height);
            imgMat.uniforms.uQuadSize.value = new THREE.Vector2(imgBounds.width , imgBounds.height);

            this.materialArr.push(imgMat);

            // Find .list_num and .list_title for this image
            const projectContainer = img.closest('.project_container');
            const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
            const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;

            // Calculate heights for animations
            const listNumHeight = listNum ? listNum.offsetHeight : 0;
            const listTitleHeight = listTitle ? listTitle.offsetHeight : 0;

            img.addEventListener("mouseenter", () => {
                // console.log('Mouse enter:', img.src);
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
                // console.log('Mouse leave:', img.src);
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

    addClickEvents(){
        this.imageStore.forEach(i=>{
            i.img.addEventListener('click',()=>{
                let tl = gsap.timeline()
                .to(i.mesh.material.uniforms.uCorners.value,{
                    w:1,
                    duration: 0.4
                })
                .to(i.mesh.material.uniforms.uCorners.value,{
                    y:1,
                    duration: 0.4
                },0.1)
                .to(i.mesh.material.uniforms.uCorners.value,{
                    z:1,
                    duration: 0.4
                },0.2)
                .to(i.mesh.material.uniforms.uCorners.value,{
                    x:1,
                    duration: 0.4
                },0.3)
            })
        })
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