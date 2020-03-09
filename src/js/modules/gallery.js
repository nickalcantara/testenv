const { tween } = require('popmotion');

const gallery = document.querySelector('.gallery');

export default () => {
  if (!gallery) return;

  const module = {
    name: 'gallery',
    $nodes: {
      slider: gallery.querySelector('.gallery__container'),
      slides: gallery.querySelectorAll('.gallery__slide'),
      liners: gallery.querySelectorAll('.gallery__slide-liner'),
      figures: gallery.querySelectorAll('.gallery__figure'),
      images: gallery.querySelectorAll('.gallery__figure img'),
      previous: gallery.querySelectorAll('.gallery__previous'),
      next: gallery.querySelectorAll('.gallery__next'),
    },

    data: {
      maxLinerWidth: 0,
      actualSlideWidth: 0,
      activeIndex: 0,
      translateValue: 0,
      slideCount: 0,
    },

    hooks: {
      created: () => {
        const { methods } = module;
        methods.addListeners();
        methods.setMaxSlideWidth();
      },

      ready: () => {
        const { methods } = module;

        methods.indexSlides();
      },

      resize: () => {
        const { methods } = module;
        methods.setMaxSlideWidth();
      },
    },

    methods: {
      addListeners() {
        const { $nodes, methods } = module;

        $nodes.previous.forEach(button => {
          button.addEventListener('click', methods.previous);
        });

        $nodes.next.forEach(button => {
          button.addEventListener('click', methods.next);
        });

        window.addEventListener('resize', methods.setMaxSlideWidth);
      },

      goToActiveIndex() {
        const { $nodes, data } = module;

        data.translateValue = -data.actualSlideWidth * data.activeIndex;
        $nodes.slider.style.transform = `translate3d(${data.translateValue}px, 0, 0)`;
      },

      previous() {
        const { data, methods } = module;

        if (data.activeIndex - 1 < 0) {
          data.activeIndex = data.slideCount - 1;
        } else {
          data.activeIndex--;
        }

        methods.goToActiveIndex();
      },

      next() {
        const { data, methods } = module;

        if (data.activeIndex + 1 === data.slideCount) {
          data.activeIndex = 0;
        } else {
          data.activeIndex++;
        }

        methods.goToActiveIndex();
      },

      indexSlides() {
        const { $nodes, data } = module;

        $nodes.slides.forEach((slide, index) => {
          slide.dataset.index = index;
        });

        data.slideCount = $nodes.slides.length;
      },

      resizeSlides() {
        const { $nodes, methods, data } = module;
        $nodes.liners.forEach(liner => {
          liner.style.maxWidth = `${data.maxLinerWidth}px`;
        });

        data.actualSlideWidth = $nodes.slides[0].offsetWidth;
        methods.goToActiveIndex();
      },

      setMaxSlideWidth() {
        const { data, methods } = module;
        const lastMaxWidth = data.maxLinerWidth;

        data.maxLinerWidth = gallery.offsetWidth * 0.9;
        if (data.maxLinerWidth !== lastMaxWidth) {
          methods.resizeSlides();
        }
      },
    },
  };

  return module;
};
