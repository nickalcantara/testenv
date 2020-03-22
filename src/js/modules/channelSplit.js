const channelSplit = document.querySelector('.channel-split');

export default () => {
  if (!channelSplit) return;
  const THREE = require('three');

  let vertexShader = require('raw-loader!glslify-loader!../../shaders/channelSplit.vert');
  let fragmentShader = require('raw-loader!glslify-loader!../../shaders/channelSplit.frag');

  const module = {
    name: 'ChannelSplit',
    $nodes: {},

    data: {
      // imageSrc: 'https://source.unsplash.com/random/400x600',
      imageSrc:
        'https://images.unsplash.com/photo-1513772929411-94fdbe59a307?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
      texture: false,
      renderer: new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      }),
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      ),
      clock: new THREE.Clock(),
      textureLoader: new THREE.TextureLoader(),
      renderLoop: false,
      geometry: new THREE.PlaneGeometry(0.4, 0.6, 24, 24),
      material: false,
    },

    hooks: {
      created: () => {
        const { methods } = module;

        methods.prepareMesh();
        methods.instantiateScene();
        methods.render();
      },

      ready: () => {},

      debouncedResize: () => {
        const { data } = module;
        const { camera, renderer } = data;
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      },
    },
    methods: {
      prepareMesh: () => {
        const { data, methods } = module;

        data.texture = methods.prepareTexture(data.imageSrc);

        data.material = new THREE.ShaderMaterial({
          vertexShader: vertexShader.default,
          fragmentShader: fragmentShader.default,
          uniforms: {
            time: { value: 0.0 },
            texture: { type: new THREE.Texture(), value: data.texture },
          },
        });
      },
      instantiateScene: () => {
        const { data } = module;
        const { renderer, scene, camera, geometry, material } = data;

        channelSplit.appendChild(renderer.domElement);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);

        data.mesh = new THREE.Mesh(geometry, material);
        camera.position.set(0, 0, 1);
        data.mesh.position.set(0, 0, 0);
        scene.add(data.mesh);
        window.scene = scene;
      },

      render: () => {
        const { scene, camera, clock, material } = module.data;
        material.uniforms.time.value = clock.getElapsedTime();
        module.data.renderer.render(scene, camera);
        requestAnimationFrame(module.methods.render);
      },

      prepareTexture: textureSrc => {
        const { textureLoader, renderer } = module.data;
        const image = textureLoader.load(textureSrc);

        image.anisotropy = renderer.capabilities.getMaxAnisotropy();
        image.minFilter = THREE.LinearFilter;
        image.magFilter = THREE.LinearFilter;
        return image;
      },
    },
  };

  module.hooks.created(module.nodes);
  return module;
};
