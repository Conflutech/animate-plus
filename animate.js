const animate = (() => {

  "use strict";


  // func utils
  // ===============================================================================================

  const compose = (...funcs) => value => funcs.reduce((a, b) => b(a), value);

  const not = func => (...args) => !func(...args);

  const easing = {

    linear(t, b, c, d) {
      return b + (t / d * c);
    },

    easeInQuad(t, b, c, d) {
      return c*(t/=d)*t + b;
    },

    easeInCubic(t, b, c, d) {
      return c*(t/=d)*t*t + b;
    },

    easeInQuart(t, b, c, d) {
      return c*(t/=d)*t*t*t + b;
    },

    easeInQuint(t, b, c, d) {
      return c*(t/=d)*t*t*t*t + b;
    },

    easeInSine(t, b, c, d) {
      return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },

    easeInExpo(t, b, c, d) {
      return t==0 ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },

    easeInCirc(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },

    easeInElastic(t, b, c, d) {
      var s=1.70158;var p=0;var a=c;
      if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3;
      if (a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },

    easeInBack(t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c*(t/=d)*t*((s+1)*t - s) + b;
    },

    easeOutQuad(t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    },

    easeOutCubic(t, b, c, d) {
      return c*((t=t/d-1)*t*t + 1) + b;
    },

    easeOutQuart(t, b, c, d) {
      return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },

    easeOutQuint(t, b, c, d) {
      return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },

    easeOutSine(t, b, c, d) {
      return c * Math.sin(t/d * (Math.PI/2)) + b;
    },

    easeOutExpo(t, b, c, d) {
      return t==d ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },

    easeOutCirc(t, b, c, d) {
      return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },

    easeOutElastic(t, b, c, d) {
      var s=1.70158;var p=0;var a=c;
      if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3;
      if (a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },

    easeOutBack(t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },

    easeOutBounce(t, b, c, d) {
      if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
      } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
      } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
      } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
      }
    },

    easeInOutQuad(t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t + b;
      return -c/2 * ((--t)*(t-2) - 1) + b;
    },

    easeInOutCubic(t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t*t + b;
      return c/2*((t-=2)*t*t + 2) + b;
    },

    easeInOutQuart(t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
      return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },

    easeInOutQuint(t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
      return c/2*((t-=2)*t*t*t*t + 2) + b;
    },

    easeInOutSine(t, b, c, d) {
      return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },

    easeInOutExpo(t, b, c, d) {
      if (t==0) return b;
      if (t==d) return b+c;
      if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
      return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    easeInOutCirc(t, b, c, d) {
      if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
      return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },

    easeInOutElastic(t, b, c, d) {
      var s=1.70158;var p=0;var a=c;
      if (t==0) return b; if ((t/=d/2)==2) return b+c; if (!p) p=d*(.3*1.5);
      if (a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
      return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },

    easeInOutBack(t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
      return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }

  };


  // array utils
  // ===============================================================================================

  const first = arr => arr[0];
  const last = arr => first(arr.slice(-1));
  const tail = arr => arr.slice(1);

  const flatten = arr => arr.reduce((a, b) => a.concat(b));

  const contains = (() =>
    Array.prototype.includes
      ? (arr, value) => arr.includes(value)
      : (arr, value) => arr.some(el => el === value)
  )();

  const difference = (arr, ...others) => {
    const combined = flatten(others);
    return arr.filter(el => not(contains)(combined, el));
  };


  // map utils
  // ===============================================================================================

  const getKeys = (() => {
    if (Array.from)
      return map => Array.from(map.keys());
    return map => {
      const keys = [];
      map.forEach((value, key) => keys.push(key));
      return keys;
    };
  })();

  const toMap = (() => {
    const convert = obj => {
      const map = new Map();
      Object.keys(obj).forEach(key => map.set(key, obj[key]));
      return map;
    };
    return obj => obj instanceof Map ? obj : convert(obj);
  })();

  const cloneMap = (() => {
    try {
      new Map(new Map());
    }
    catch (e) {
      return map => {
        const clone = new Map();
        map.forEach((value, key) => clone.set(key, value));
        return clone;
      };
    };
    return map => new Map(map);
  })();


  // dom
  // ===============================================================================================

  const getElements = el => domArray(typeof el == "string" ? select(el) : el);

  const select = selector => {
    if (/^[\#.]?[\w-]+$/.test(selector)) {
      if (first(selector) == ".")
        return document.getElementsByClassName(tail(selector));
      if (first(selector) == "#")
        return document.getElementById(tail(selector));
      return document.getElementsByTagName(selector);
    }
    return document.querySelectorAll(selector);
  };

  const domArray = obj => {
    if (Array.isArray(obj)) return obj;
    if (obj.nodeType) return [obj];
    if (obj instanceof NodeList || obj instanceof HTMLCollection) return [...obj];
    return obj.get();
  };


  // params
  // ===============================================================================================

  const defaults = new Map();
  ["el", "delay", "begin", "complete", "loop", "direction"].forEach(key => defaults.set(key, null));
  defaults.set("duration", 1000);
  defaults.set("easing", "easeOutElastic");

  const fillBlankParams = (() => {
    const required = getKeys(defaults).filter(key => defaults.get(key));
    const isFilled = params => required.every(param => params.has(param));
    const fill = params => {
      const map = cloneMap(params);
      required.forEach(param => {
        if (!map.has(param)) map.set(param, defaults.get(param));
      });
      return map;
    };
    return params => isFilled(params) ? params : fill(params);
  })();

  const buildMissingArrays = (() => {
    const propIsArray = params => prop => Array.isArray(params.get(prop));
    const isValid = params => getCSSprops(params).every(propIsArray(params));
    const missingArrays = params => getCSSprops(params).filter(not(propIsArray(params)));
    return params => {
      if (isValid(params)) return params;
      const map = cloneMap(params);
      missingArrays(map).forEach(key => map.set(key, [defaultCSSvalues.get(key), map.get(key)]));
      return map;
    };
  })();

  const ensureRGB = (() => {
    const hasHex = params => prop => params.get(prop).some(isHex);
    const isValid = params => !getSVGprops(params).some(hasHex(params));
    const needConvert = params => getSVGprops(params).filter(hasHex(params));
    return params => {
      if (isValid(params)) return params;
      const map = cloneMap(params);
      needConvert(params).forEach(key => map.set(key, map.get(key).map(toRGB)));
      return map;
    };
  })();

  const setElements = params => {
    const map = cloneMap(params);
    map.set("el", getElements(params.get("el")));
    return map;
  };

  const reverseDirection = params => {
    const map = cloneMap(params);
    getAnimatedProps(params).forEach(prop => map.set(prop, map.get(prop).slice().reverse()));
    return map;
  };

  const setInitialDirection = params =>
    params.get("direction") == "reverse" ? reverseDirection(params) : params;

  const validateParams = compose(
    toMap, fillBlankParams, buildMissingArrays, ensureRGB, setElements, setInitialDirection
  );


  // params filters
  // ===============================================================================================

  const getAnimatedProps = (() => {
    const excluded = getKeys(defaults);
    const isProp = param => not(contains)(excluded, param);
    return params => getKeys(params).filter(isProp);
  })();

  const getCSSprops = (() => {
    const isCSSprop = prop => contains(supportedCSSprops, prop);
    return params => getKeys(params).filter(isCSSprop);
  })();

  const getSVGprops = params =>
    difference(getAnimatedProps(params), getCSSprops(params));


  // CSS props
  // ===============================================================================================

  const supportedCSSprops = ["opacity", "skewX", "skewY", "perspective"].concat(
    ...["translate", "scale", "rotate"].map(func => ["X", "Y", "Z"].map(axis => func + axis))
  );

  const defaultCSSvalues = new Map();
  supportedCSSprops.forEach(prop =>
    defaultCSSvalues.set(prop, contains(["opacity", "scaleX", "scaleY"], prop) ? 1 : 0)
  );


  // transforms
  // ===============================================================================================

  const isTransformFunction = (() => {
    const transformFunctions = supportedCSSprops.filter(prop => prop != "opacity");
    return str => contains(transformFunctions, str);
  })();

  const combineTransformFunctions = (transformFunctions, values) =>
    transformFunctions.reduce((a, b, i) => {
      const transformFunction = `${b}(${addUnit(b, values[i])})`;
      return a ? `${a} ${transformFunction}` : transformFunction;
    }, null);

  const addUnit = (() => {
    const hasUnit = value => /\D$/.test(value);
    return (transformFunction, value) => {
      if (hasUnit(value) || /scale/.test(transformFunction))
        return value;
      if (/rotate|skew/.test(transformFunction))
        return `${value}deg`;
      return `${value}px`;
    };
  })();


  // value manipulation
  // ===============================================================================================

  const recomposeValue = (digits, others) =>
    others.reduce((a, b, i) => a + digits[i-1] + b);

  const splitDigits = (() => {
    const re = /-?\d*\.?\d+/g;
    const toStr = value => typeof value == "string" ? value : String(value);
    return value => {
      const split = new Map();
      split.set("digits", toStr(value).match(re).map(Number));
      split.set("others", toStr(value).split(re));
      return split;
    };
  })();


  // color
  // ===============================================================================================

  const isHex = val => /^#/.test(val);
  const isRGB = val => /^rgb/.test(val);

  const toRGB = (() => {
    const expand = hex =>
      hex.length < 7 ? hex.split("").reduce((a, b) => a + b + b) : hex;
    const convert = hex =>
      hex.match(/[\d\w]{2}/g).map(val => parseInt(val, 16));
    return hex => {
      if (isRGB(hex)) return hex;
      const [r, g, b] = compose(expand, convert)(hex);
      return `rgb(${r}, ${g}, ${b})`;
    };
  })();


  // progress
  // ===============================================================================================

  const getProgress = (() => {
    const colorCheck = compose(first, isRGB);
    return (params, elapsed) =>
      prop => {
        const [from, to] = params.get(prop).map(splitDigits);
        const isColor = colorCheck(params.get(prop));
        const progress = to.get("digits").map((digit, i) => {
          const start = from.get("digits")[i];
          if (start == digit) return start;
          const end = digit - start;
          const result = easing[params.get("easing")](elapsed, start, end, params.get("duration"));
          return isColor ? Math.round(result) : result;
        });
        return recomposeValue(progress, to.get("others"));
      };
  })();

  const getFinalValues = params =>
    prop => recomposeValue(...compose(last, splitDigits)(params.get(prop)).values());

  const setProgress = (() => {
    var transform;
    return (el, props, progress) => {
      var transforms;
      props.forEach((prop, i) => {
        if (prop == "opacity") {
          el.style.opacity = progress[i];
          return;
        }
        if (isTransformFunction(prop)) {
          if (!transforms) {
            transforms = new Map();
            ["functions", "values"].forEach(key => transforms.set(key, []));
          }
          transforms.get("functions").push(prop);
          transforms.get("values").push(progress[i]);
          return;
        }
        el.setAttribute(prop, progress[i]);
      });
      if (!transforms)
        return;
      if (!transform)
        transform = "transform" in document.body.style ? "transform" : "-webkit-transform";
      el.style[transform] = combineTransformFunctions(...transforms.values());
    };
  })();


  // start / end
  // ===============================================================================================

  const begin = (() => {
    const start = (callback, params) => {
      if (params.get("begin")) params.get("begin")(params.get("el"));
      requestAnimationFrame(callback);
    };
    return (callback, params) =>
      params.get("delay")
        ? setTimeout(() => start(callback, params), params.get("delay"))
        : start(callback, params);
  })();

  const complete = params => {
    if (params.get("complete")) params.get("complete")(params.get("el"));
    if (params.get("loop")) loop(params);
  }

  const loop = params =>
    animate((() => {
      if (params.get("direction") == "alternate")
        return reverseDirection(params);
      if (params.get("direction") == "reverse") {
        const map = cloneMap(params);
        map.delete("direction");
        return map;
      }
      return params;
    })());


  // public
  // ===============================================================================================

  return params => {
    const validatedParams = validateParams(params);
    const animatedProps = getAnimatedProps(validatedParams);
    const time = new Map();

    const step = now => {
      if (!time.has("start")) time.set("start", now);
      time.set("elapsed", now - time.get("start"));
      const running = time.get("elapsed") < validatedParams.get("duration");
      const progress = animatedProps.map(running
        ? getProgress(validatedParams, time.get("elapsed"))
        : getFinalValues(validatedParams)
      );
      validatedParams.get("el").forEach(el => setProgress(el, animatedProps, progress));
      running ? requestAnimationFrame(step) : complete(validatedParams);
    };

    begin(step, validatedParams);
  };

})();
