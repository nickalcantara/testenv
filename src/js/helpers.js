export function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function() {
    let context = this,
      args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function throttle(fn, limit) {
  let waiting = false;

  return (...args) => {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;

      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

// replacement for jQuery offset
export const offset = (node, value, warning = false) => {
  // if the node has an offsetParent that isn't the body...
  if (node.offsetParent !== document.body) {
    // add the node's offsetTop to the value.
    value += node.offsetTop;
    // call the function again, passing the node's offsetParent and the running value.

    if (node.offsetParent === null) {
      if (!warning) {
        // uncomment below line if you need to debug a miscalculation
        console.warn(
          `The offsetParent of ${node.className ||
            node.id} is null. The node's offsetParent may have a position of "fixed" or a display of "none" that could interfere with offset calculations.`
        );
      }

      warning = true;
      return offset(node.parentElement, value, warning);
    } else {
      return offset(node.offsetParent, value);
    }
  } else {
    // if the node is relative to the body, add the offsetTop and return.
    return (value += node.offsetTop);
  }
};

export function inThreshold(val, threshold, comparison) {
  const min = comparison - threshold;
  const max = comparison + threshold;

  return val > min && val < max;
}

export function onScreen(el, options = { threshold: window.innerHeight / 2 }) {
  let offsetValue = 0; // this value is reassigned with offset().
  const elOffset = offset(el, offsetValue, false);

  if (inThreshold(window.pageYOffset, options.threshold, elOffset)) {
    return true;
  } else {
    return false;
  }
}
