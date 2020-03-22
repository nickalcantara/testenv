varying vec2 vUv;
varying float wave;
uniform float time;

#pragma glslify: snoise = require('glsl-noise/simplex/3d');

void main() {
  vUv = uv;

  vec3 pos = position;

  float noiseFreq = 3.5;
  float noiseAmp = 0.05;

  vec3 noisePos = vec3(pos.x * noiseFreq + time, pos.y, pos.z);

  pos.z += snoise(noisePos) * noiseAmp;

  wave = pos.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}