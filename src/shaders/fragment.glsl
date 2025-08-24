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








// varying vec2 vUv;
// uniform sampler2D uImage;
// uniform float uTime;
// uniform vec2 uHover;
// uniform float uHoverState;
// varying float vCircle;

// void main() {
//     vec2 newUv = vUv;
//     float distortionStrength = vCircle * 0.05;
//     vec2 distortedUV = vUv + vec2(distortionStrength * sin(uTime), distortionStrength * cos(uTime));

//     vec4 imgTexture = texture2D(uImage, distortedUV);

//     vec3 color = imgTexture.rgb;
//     color += vCircle * .715;

//     vec2 p = newUv;
// 	float x = uHoverState;
// 	x = smoothstep(.0,1.0,(x*2.0+p.y-1.0));
// 	vec4 f = mix(
// 		texture2D(uImage, (p-.5)*(1.-x)+.5), 
// 		texture2D(uImage, (p-.5)*x+.5), 
// 		x
//     );
// 	gl_FragColor = f;

//     // gl_FragColor = vec4(color, imgTexture.a);
// }
















































varying vec2 vUv;
uniform sampler2D uImage;
uniform sampler2D uImage1;
uniform float uTime;
uniform vec2 uHover;
uniform float uHoverState;
varying float vCircle;

void main() {
    vec2 newUv = vUv;
    float distortionStrength = vCircle * 0.05;
    vec2 distortedUV = vUv + vec2(distortionStrength * sin(uTime), distortionStrength * cos(uTime));

    vec4 imgTexture = texture2D(uImage, distortedUV);

    vec3 color = imgTexture.rgb;
    color += vCircle * 0.715;

    vec2 p = newUv;
    float x = uHoverState;

    // Diagonal transition from bottom-right to top-left
    float diag = (p.x - p.y) * .65; // Diagonal coordinate (difference of x and y)
    float sineWave = sin(diag * 3.14159 + 0.01 * 0.5) * 0.5 + 0.5; // Slower sine wave
    x = smoothstep(0.0, 1.0, x * 2.45 + diag - 1.0 + sineWave * 0.75); // Slower transition

    vec4 f = mix(
        texture2D(uImage, (p - 0.5) * (1.0 - x) + 0.5),
        texture2D(uImage1, (p - 0.5) * x + 0.5),
        x
    );

    gl_FragColor = f;
    // gl_FragColor.rgb += vCircle/3.;
    // gl_FragColor = vec4(vCircle,0.,0.,1.);
}


