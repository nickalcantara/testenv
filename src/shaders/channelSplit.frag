varying vec2 vUv;
varying float wave;
uniform sampler2D texture;

void main() {
  float _wave = wave * 0.3;

  float r = texture2D(texture, vUv - _wave).r;
  float g = texture2D(texture, vUv).g;
  float b = texture2D(texture, vUv + _wave).b;

  vec3 texture = vec3(r, g, b);

  gl_FragColor = vec4(texture, 1.0);
}