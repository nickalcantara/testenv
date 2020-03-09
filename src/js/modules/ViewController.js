import { debounce, onScreen } from '../helpers';

export default class ViewController {
  constructor() {
    this.$nodes = {
      images: document.querySelectorAll('img[data-src]'),
    };

    this.data = {
      imagesLoaded: [],
      imageQueue: [],
    };

    this.setImageQueue();

    this.debouncedResize = new CustomEvent('debouncedResize');
    this.throttledScroll = new CustomEvent('throttledScroll');

    this.init();
  }

  init() {
    this.evaluateImageQueue();
    this.addCustomEvents();
    this.lazyLoader();
  }

  lazyLoader() {
    window.addEventListener('throttledScroll', () => {
      this.evaluateImageQueue();
    });
  }

  setImageQueue() {
    const { images } = this.$nodes;
    images.forEach(image => {
      this.data.imageQueue.push(image);

      image.parentNode.style.paddingBottom = `${(image.dataset.height /
        image.dataset.width) *
        100}%`;
    });
  }

  evaluateImageQueue() {
    const { data } = this;
    const load = data.imageQueue.filter(image =>
      onScreen(image, { threshold: window.innerHeight })
    );

    load.forEach(image => {
      if (!image.getAttribute('src')) {
        image.setAttribute('src', image.dataset.src);
        image.classList.add('loaded');
        data.imagesLoaded.push(image);
      }
    });
  }

  addCustomEvents() {
    window.addEventListener(
      'resize',
      debounce(() => {
        this.emitResizeEvent();
      }, 100)
    );
    window.addEventListener(
      'scroll',
      debounce(() => {
        this.emitScrollEvent();
      }, 10)
    );
  }

  emitResizeEvent() {
    window.dispatchEvent(this.debouncedResize);
  }

  emitScrollEvent() {
    window.dispatchEvent(this.throttledScroll);
  }
}
