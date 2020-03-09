import ViewController from './modules/ViewController';
import gallery from './modules/gallery';

window.__ViewController = new ViewController();

let modules = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  modules = [gallery()];

  modules.forEach(module => {
    if (typeof module.hooks.created === 'function') {
      module.hooks.created();
    }
  });
});

window.addEventListener('readystatechange', () => {
  console.log('readystatechange');
});

window.addEventListener('load', () => {
  // defer non-instant work until the page has actually "loaded".
  console.log('load');
  modules.forEach(module => {
    if (typeof module.hooks.ready === 'function') {
      module.hooks.ready();
    }
  });

  window.addEventListener('debouncedResize', () => {
    modules.forEach(module => {
      if (typeof module.hooks.debouncedResize === 'function')
        module.hooks.debouncedResize();
    });
  });

  window.addEventListener('resize', () => {
    modules.forEach(module => {
      if (typeof module.hooks.resize === 'function') {
        module.hooks.resize();
      }
    });
  });
});
