varying vec2 vUv;
varying float vCircle;

uniform vec2 uMouse;
uniform float uEnter;

void main() {
    vUv = uv;
    vec3 pos = position;

    float circle = smoothstep(0.5, 0. , distance(uMouse, vUv));
    vCircle = circle;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}