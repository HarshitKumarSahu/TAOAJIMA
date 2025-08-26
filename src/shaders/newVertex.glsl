uniform float uTime;
varying float vNoise;
varying vec2 vUv;
uniform vec2 uHover;
uniform float uHoverState;
varying float vCircle;
uniform vec2 aspect;

uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec4 uCorners;

varying vec2 vSize;

void main() {
    float PI = 3.1415926;
    vUv = uv;
    vec3 newPosition = position;

    vec2 correctAspectHover = vec2(uHover.x * aspect.x / aspect.y, uHover.y);
    vec2 correctAspectUV = vec2(vUv.x * aspect.x / aspect.y, vUv.y);

    float radius = 0.575;
    float amplitude = 0.1125;
    float frequency = 20.0;
    float circle = smoothstep(radius, 0.0, distance(correctAspectUV, correctAspectHover));
    vCircle = circle;

    float dist = distance(correctAspectUV, correctAspectHover);

    float scaleFactor = 0.2;
    float waves = sin(dist * frequency - uTime * 7.) * amplitude;
    newPosition.x += -uHover.x * .125 * uHoverState;
    newPosition.xy *= 1.0 + scaleFactor * uHoverState;
    newPosition.z += waves * circle * uHoverState;
    vCircle = waves * circle * uHoverState;




    float sine = sin(PI * uProgress);
    float wavesNew = sine * 0.1 * sin( 5. * length(uv) + 15. * uProgress);

    vec4 defaultState =  modelMatrix * vec4(newPosition, 1.0);
    vec4 fullScreenState = vec4(newPosition, 1.0);
    fullScreenState.x *= uResolution.x;
    fullScreenState.y *= uResolution.y;
    fullScreenState.z += uCorners.y;
    float cornersProgress = mix(
        mix(uCorners.z, uCorners.w, uv.x),
        mix(uCorners.x, uCorners.y, uv.x),
        uv.y
    );
 
    vec4 finalState =  mix(defaultState, fullScreenState, cornersProgress + wavesNew);

    vSize = mix(uQuadSize,uResolution, cornersProgress);

    gl_Position = projectionMatrix * viewMatrix * finalState;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}