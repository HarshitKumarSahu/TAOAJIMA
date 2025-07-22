varying vec2 vUv;
varying float vCircle;

void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0); // Red color
    gl_FragColor = vec4(vCircle,0.0, 0.0, 1.0); // Red color
}
