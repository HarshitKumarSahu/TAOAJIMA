// varying vec2 vUv;
// // varying float vCircle;
// uniform sampler2D uImage;
// uniform float uTime;
// varying float vNoise;

// void main() {

//     vec2 newUV = vUv;


//     vec4 imgTexture = texture2D(uImage, newUV);



//     // gl_FragColor = vec4(vNoise, 0.0, 0.0, 1.0); // Red color
//     gl_FragColor = imgTexture; // Red color
//     gl_FragColor.rgb += 0.1 * vec3(vNoise); // Red color
// }

// varying vec2 vUv;
// // varying float vNoise;
// uniform sampler2D uImage;
// uniform float uTime;
// uniform vec2 uHover;
// uniform float uHoverState;
// varying float vCircle;

// void main() {
//     // Sample the texture
//     vec4 imgTexture = texture2D(uImage, vUv);

//     // Apply noise effect to enhance hover
//     vec3 color = imgTexture.rgb;
//     // color += 0.005 * vNoise; // Subtle noise effect to avoid washing out the image

//     // Ensure alpha is preserved
//     // gl_FragColor = vec4(color, imgTexture.a);
//     gl_FragColor = imgTexture;

//     gl_FragColor.rgb += vCircle/2.;
// }

varying vec2 vUv;
uniform sampler2D uImage;
uniform float uTime;
uniform vec2 uHover;
uniform float uHoverState;
varying float vCircle;

void main() {
    float distortionStrength = vCircle * 0.05;
    vec2 distortedUV = vUv + vec2(distortionStrength * sin(uTime), distortionStrength * cos(uTime));

    vec4 imgTexture = texture2D(uImage, distortedUV);

    vec3 color = imgTexture.rgb;
    color += vCircle * .715;

    gl_FragColor = vec4(color, imgTexture.a);
}