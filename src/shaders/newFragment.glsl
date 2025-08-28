// varying vec2 vUv;
// uniform sampler2D uImage;
// uniform sampler2D uImage1;
// uniform float uTime;
// uniform vec2 uHover;
// uniform float uHoverState;
// varying float vCircle;
// uniform vec2 uTextureSize;  // Changed from float to vec2 to match vertex shader

// varying vec2 vSize;

// vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize) {
//     vec2 tempUV = uv - vec2(0.5);

//     float quadAspect = quadSize.x/quadSize.y;
//     float textureAspect = textureSize.x/textureSize.y;

//     if(quadAspect<textureAspect) {
//         tempUV = tempUV * vec2(quadAspect/textureAspect, 1.);
//     } else {
//         tempUV = tempUV * vec2(1.,textureAspect/quadAspect);
//     }

//     tempUV += vec2(0.5);
//     return tempUV;
// }

// void main() {
//     vec2 newUv = getUV(vUv, uTextureSize, vSize);
//     float distortionStrength = vCircle * 0.05;
//     vec2 distortedUV = vUv + vec2(distortionStrength * sin(uTime), distortionStrength * cos(uTime));

//     vec4 imgTexture = texture2D(uImage, distortedUV);

//     vec3 color = imgTexture.rgb;
//     color += vCircle * 0.715;

//     vec2 p = newUv;
//     float x = uHoverState;

//     // Diagonal transition from bottom-right to top-left
//     float diag = (p.x - p.y) * .65; // Diagonal coordinate (difference of x and y)
//     float sineWave = sin(diag * 3.14159 + 0.01 * 0.5) * 0.5 + 0.5; // Slower sine wave
//     x = smoothstep(0.0, 1.0, x * 2.45 + diag - 1.0 + sineWave * 0.75); // Slower transition

//     vec4 f = mix(
//         texture2D(uImage, (p - 0.5) * (1.0 - x) + 0.5),
//         texture2D(uImage1, (p - 0.5) * x + 0.5),
//         x
//     );

//     gl_FragColor = f;
//     // gl_FragColor.rgb += vCircle/3.;
//     // gl_FragColor = vec4(vCircle,0.,0.,1.);
// }














// varying vec2 vUv;
// uniform sampler2D uImage;
// uniform sampler2D uImage1;
// uniform float uTime;
// uniform vec2 uHover;
// uniform float uHoverState;
// varying float vCircle;
// uniform vec2 uTextureSize;
// uniform float uIsFullScreen; // New uniform
// varying vec2 vSize;

// vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize) {
//     vec2 tempUV = uv - vec2(0.5);

//     float quadAspect = quadSize.x / quadSize.y;
//     float textureAspect = textureSize.x / textureSize.y;

//     if (quadAspect < textureAspect) {
//         tempUV = tempUV * vec2(quadAspect / textureAspect, 1.);
//     } else {
//         tempUV = tempUV * vec2(1., textureAspect / quadAspect);
//     }

//     tempUV += vec2(0.5);
//     return tempUV;
// }

// void main() {
//     vec2 newUv = getUV(vUv, uTextureSize, vSize);
//     float distortionStrength = vCircle * 0.05;
//     vec2 distortedUV = newUv + vec2(distortionStrength * sin(uTime), distortionStrength * cos(uTime));

//     vec4 imgTexture = texture2D(uImage, distortedUV);
//     vec4 videoTexture = texture2D(uImage1, distortedUV);

//     vec3 color = imgTexture.rgb;
//     color += vCircle * 0.715;

//     // Use video texture in full-screen, image texture otherwise
//     vec4 finalTexture = mix(imgTexture, videoTexture, uIsFullScreen);

//     gl_FragColor = finalTexture;
// }












// varying vec2 vUv;
// uniform sampler2D uImage;
// uniform sampler2D uImage1;
// uniform float uTime;
// uniform vec2 uHover;
// uniform float uHoverState;
// varying float vCircle;
// uniform vec2 uTextureSize;
// uniform float uIsFullScreen;
// varying vec2 vSize;

// vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize) {
//     vec2 tempUV = uv - vec2(0.5);

//     float quadAspect = quadSize.x / quadSize.y;
//     float textureAspect = textureSize.x / textureSize.y;

//     if (quadAspect < textureAspect) {
//         tempUV = tempUV * vec2(quadAspect / textureAspect, 1.);
//     } else {
//         tempUV = tempUV * vec2(1., textureAspect / quadAspect);
//     }

//     tempUV += vec2(0.5);
//     return tempUV;
// }

// void main() {
//     vec2 newUv = getUV(vUv, uTextureSize, vSize);
//     float distortionStrength = vCircle * 0.05;
//     vec2 distortedUV = newUv + vec2(distortionStrength * sin(uTime), distortionStrength * cos(uTime));

//     vec4 imgTexture = texture2D(uImage, distortedUV);
//     vec4 videoTexture = texture2D(uImage1, distortedUV);

//     vec3 color = imgTexture.rgb;
//     color += vCircle * 0.715;

//     // Transition between image and video based on hover state when not in full-screen
//     // Use video texture directly in full-screen mode
//     vec4 finalTexture = uIsFullScreen > 0.5 ? videoTexture : mix(imgTexture, videoTexture, uHoverState);

//     gl_FragColor = finalTexture;
// }






varying vec2 vUv;
uniform sampler2D uImage;
uniform sampler2D uImage1;
uniform float uTime;
uniform vec2 uHover;
uniform float uHoverState;
varying float vCircle;
uniform vec2 uTextureSize;
uniform float uIsFullScreen;
varying vec2 vSize;

vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize) {
    vec2 tempUV = uv - vec2(0.5);

    float quadAspect = quadSize.x / quadSize.y;
    float textureAspect = textureSize.x / textureSize.y;

    if (quadAspect < textureAspect) {
        tempUV = tempUV * vec2(quadAspect / textureAspect, 1.);
    } else {
        tempUV = tempUV * vec2(1., textureAspect / quadAspect);
    }

    tempUV += vec2(0.5);
    return tempUV;
}

void main() {
    vec2 newUv = getUV(vUv, uTextureSize, vSize);
    float distortionStrength = vCircle * 0.05;
    vec2 distortedUV = newUv + vec2(distortionStrength * sin(uTime), distortionStrength * cos(uTime));

    vec4 imgTexture = texture2D(uImage, distortedUV);
    vec4 videoTexture = texture2D(uImage1, distortedUV);

    vec3 color = imgTexture.rgb;
    color += vCircle * 0.715;

    vec4 finalTexture;
    if (uIsFullScreen > 0.5) {
        // Show video texture directly in full-screen mode
        finalTexture = videoTexture;
    } else {
        // Diagonal transition effect for hover
        vec2 p = newUv;
        float x = uHoverState;
        float diag = (p.x - p.y) * 0.65; // Diagonal coordinate (difference of x and y)
        float sineWave = sin(diag * 3.14159 + 0.01 * 0.5) * 0.5 + 0.5; // Slower sine wave
        x = smoothstep(0.0, 1.0, x * 2.45 + diag - 1.0 + sineWave * 0.75); // Slower transition

        finalTexture = mix(
            texture2D(uImage, (p - 0.5) * (1.0 - x) + 0.5),
            texture2D(uImage1, (p - 0.5) * x + 0.5),
            x
        );
    }

    gl_FragColor = finalTexture;
    gl_FragColor.rgb += vCircle/2.;
}