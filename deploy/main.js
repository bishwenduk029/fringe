var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module) => () => {
  if (!module) {
    module = {exports: {}};
    callback(module.exports, module);
  }
  return module.exports;
};
var __exportStar = (target, module, desc) => {
  __markAsModule(target);
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module) => {
  if (module && module.__esModule)
    return module;
  return __exportStar(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", {value: module, enumerable: true}), module);
};

// node_modules/pino-std-serializers/lib/err.js
var require_err = __commonJS((exports, module) => {
  "use strict";
  module.exports = errSerializer;
  var {toString} = Object.prototype;
  var seen = Symbol("circular-ref-tag");
  var rawSymbol = Symbol("pino-raw-err-ref");
  var pinoErrProto = Object.create({}, {
    type: {
      enumerable: true,
      writable: true,
      value: void 0
    },
    message: {
      enumerable: true,
      writable: true,
      value: void 0
    },
    stack: {
      enumerable: true,
      writable: true,
      value: void 0
    },
    raw: {
      enumerable: false,
      get: function() {
        return this[rawSymbol];
      },
      set: function(val) {
        this[rawSymbol] = val;
      }
    }
  });
  Object.defineProperty(pinoErrProto, rawSymbol, {
    writable: true,
    value: {}
  });
  function errSerializer(err) {
    if (!(err instanceof Error)) {
      return err;
    }
    err[seen] = void 0;
    const _err = Object.create(pinoErrProto);
    _err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
    _err.message = err.message;
    _err.stack = err.stack;
    for (const key in err) {
      if (_err[key] === void 0) {
        const val = err[key];
        if (val instanceof Error) {
          if (!val.hasOwnProperty(seen)) {
            _err[key] = errSerializer(val);
          }
        } else {
          _err[key] = val;
        }
      }
    }
    delete err[seen];
    _err.raw = err;
    return _err;
  }
});

// node_modules/pino-std-serializers/lib/req.js
var require_req = __commonJS((exports, module) => {
  "use strict";
  module.exports = {
    mapHttpRequest,
    reqSerializer
  };
  var rawSymbol = Symbol("pino-raw-req-ref");
  var pinoReqProto = Object.create({}, {
    id: {
      enumerable: true,
      writable: true,
      value: ""
    },
    method: {
      enumerable: true,
      writable: true,
      value: ""
    },
    url: {
      enumerable: true,
      writable: true,
      value: ""
    },
    headers: {
      enumerable: true,
      writable: true,
      value: {}
    },
    remoteAddress: {
      enumerable: true,
      writable: true,
      value: ""
    },
    remotePort: {
      enumerable: true,
      writable: true,
      value: ""
    },
    raw: {
      enumerable: false,
      get: function() {
        return this[rawSymbol];
      },
      set: function(val) {
        this[rawSymbol] = val;
      }
    }
  });
  Object.defineProperty(pinoReqProto, rawSymbol, {
    writable: true,
    value: {}
  });
  function reqSerializer(req) {
    const connection = req.info || req.socket;
    const _req = Object.create(pinoReqProto);
    _req.id = typeof req.id === "function" ? req.id() : req.id || (req.info ? req.info.id : void 0);
    _req.method = req.method;
    if (req.originalUrl) {
      _req.url = req.originalUrl;
    } else {
      _req.url = req.path || (req.url ? req.url.path || req.url : void 0);
    }
    _req.headers = req.headers;
    _req.remoteAddress = connection && connection.remoteAddress;
    _req.remotePort = connection && connection.remotePort;
    _req.raw = req.raw || req;
    return _req;
  }
  function mapHttpRequest(req) {
    return {
      req: reqSerializer(req)
    };
  }
});

// node_modules/pino-std-serializers/lib/res.js
var require_res = __commonJS((exports, module) => {
  "use strict";
  module.exports = {
    mapHttpResponse,
    resSerializer
  };
  var rawSymbol = Symbol("pino-raw-res-ref");
  var pinoResProto = Object.create({}, {
    statusCode: {
      enumerable: true,
      writable: true,
      value: 0
    },
    headers: {
      enumerable: true,
      writable: true,
      value: ""
    },
    raw: {
      enumerable: false,
      get: function() {
        return this[rawSymbol];
      },
      set: function(val) {
        this[rawSymbol] = val;
      }
    }
  });
  Object.defineProperty(pinoResProto, rawSymbol, {
    writable: true,
    value: {}
  });
  function resSerializer(res) {
    const _res = Object.create(pinoResProto);
    _res.statusCode = res.statusCode;
    _res.headers = res.getHeaders ? res.getHeaders() : res._headers;
    _res.raw = res;
    return _res;
  }
  function mapHttpResponse(res) {
    return {
      res: resSerializer(res)
    };
  }
});

// node_modules/pino-std-serializers/index.js
var require_pino_std_serializers = __commonJS((exports, module) => {
  "use strict";
  var errSerializer = require_err();
  var reqSerializers = require_req();
  var resSerializers = require_res();
  module.exports = {
    err: errSerializer,
    mapHttpRequest: reqSerializers.mapHttpRequest,
    mapHttpResponse: resSerializers.mapHttpResponse,
    req: reqSerializers.reqSerializer,
    res: resSerializers.resSerializer,
    wrapErrorSerializer: function wrapErrorSerializer(customSerializer) {
      if (customSerializer === errSerializer)
        return customSerializer;
      return function wrapErrSerializer(err) {
        return customSerializer(errSerializer(err));
      };
    },
    wrapRequestSerializer: function wrapRequestSerializer(customSerializer) {
      if (customSerializer === reqSerializers.reqSerializer)
        return customSerializer;
      return function wrappedReqSerializer(req) {
        return customSerializer(reqSerializers.reqSerializer(req));
      };
    },
    wrapResponseSerializer: function wrapResponseSerializer(customSerializer) {
      if (customSerializer === resSerializers.resSerializer)
        return customSerializer;
      return function wrappedResSerializer(res) {
        return customSerializer(resSerializers.resSerializer(res));
      };
    }
  };
});

// node_modules/fast-redact/lib/validator.js
var require_validator = __commonJS((exports, module) => {
  "use strict";
  var {createContext, runInContext} = require("vm");
  module.exports = validator;
  function validator(opts = {}) {
    const {
      ERR_PATHS_MUST_BE_STRINGS = () => "fast-redact - Paths must be (non-empty) strings",
      ERR_INVALID_PATH = (s) => `fast-redact \u2013 Invalid path (${s})`
    } = opts;
    return function validate({paths}) {
      paths.forEach((s) => {
        if (typeof s !== "string") {
          throw Error(ERR_PATHS_MUST_BE_STRINGS());
        }
        try {
          if (/〇/.test(s))
            throw Error();
          const proxy = new Proxy({}, {get: () => proxy, set: () => {
            throw Error();
          }});
          const expr = (s[0] === "[" ? "" : ".") + s.replace(/^\*/, "\u3007").replace(/\.\*/g, ".\u3007").replace(/\[\*\]/g, "[\u3007]");
          if (/\n|\r|;/.test(expr))
            throw Error();
          if (/\/\*/.test(expr))
            throw Error();
          runInContext(`
          (function () {
            'use strict'
            o${expr}
            if ([o${expr}].length !== 1) throw Error()
          })()
        `, createContext({o: proxy, \u3007: null}), {
            codeGeneration: {strings: false, wasm: false}
          });
        } catch (e) {
          throw Error(ERR_INVALID_PATH(s));
        }
      });
    };
  }
});

// node_modules/fast-redact/lib/rx.js
var require_rx = __commonJS((exports, module) => {
  "use strict";
  module.exports = /[^.[\]]+|\[((?:.)*?)\]/g;
});

// node_modules/fast-redact/lib/parse.js
var require_parse = __commonJS((exports, module) => {
  "use strict";
  var rx = require_rx();
  module.exports = parse2;
  function parse2({paths}) {
    const wildcards = [];
    var wcLen = 0;
    const secret = paths.reduce(function(o, strPath, ix) {
      var path = strPath.match(rx).map((p) => p.replace(/'|"|`/g, ""));
      const leadingBracket = strPath[0] === "[";
      path = path.map((p) => {
        if (p[0] === "[")
          return p.substr(1, p.length - 2);
        else
          return p;
      });
      const star = path.indexOf("*");
      if (star > -1) {
        const before = path.slice(0, star);
        const beforeStr = before.join(".");
        const after = path.slice(star + 1, path.length);
        if (after.indexOf("*") > -1)
          throw Error("fast-redact \u2013 Only one wildcard per path is supported");
        const nested = after.length > 0;
        wcLen++;
        wildcards.push({
          before,
          beforeStr,
          after,
          nested
        });
      } else {
        o[strPath] = {
          path,
          val: void 0,
          precensored: false,
          circle: "",
          escPath: JSON.stringify(strPath),
          leadingBracket
        };
      }
      return o;
    }, {});
    return {wildcards, wcLen, secret};
  }
});

// node_modules/fast-redact/lib/redactor.js
var require_redactor = __commonJS((exports, module) => {
  "use strict";
  var rx = require_rx();
  module.exports = redactor;
  function redactor({secret, serialize, wcLen, strict, isCensorFct, censorFctTakesPath}, state) {
    const redact = Function("o", `
    if (typeof o !== 'object' || o == null) {
      ${strictImpl(strict, serialize)}
    }
    const { censor, secret } = this
    ${redactTmpl(secret, isCensorFct, censorFctTakesPath)}
    this.compileRestore()
    ${dynamicRedactTmpl(wcLen > 0, isCensorFct, censorFctTakesPath)}
    ${resultTmpl(serialize)}
  `).bind(state);
    if (serialize === false) {
      redact.restore = (o) => state.restore(o);
    }
    return redact;
  }
  function redactTmpl(secret, isCensorFct, censorFctTakesPath) {
    return Object.keys(secret).map((path) => {
      const {escPath, leadingBracket, path: arrPath} = secret[path];
      const skip = leadingBracket ? 1 : 0;
      const delim = leadingBracket ? "" : ".";
      const hops = [];
      var match;
      while ((match = rx.exec(path)) !== null) {
        const [, ix] = match;
        const {index, input} = match;
        if (index > skip)
          hops.push(input.substring(0, index - (ix ? 0 : 1)));
      }
      var existence = hops.map((p) => `o${delim}${p}`).join(" && ");
      if (existence.length === 0)
        existence += `o${delim}${path} != null`;
      else
        existence += ` && o${delim}${path} != null`;
      const circularDetection = `
      switch (true) {
        ${hops.reverse().map((p) => `
          case o${delim}${p} === censor:
            secret[${escPath}].circle = ${JSON.stringify(p)}
            break
        `).join("\n")}
      }
    `;
      const censorArgs = censorFctTakesPath ? `val, ${JSON.stringify(arrPath)}` : `val`;
      return `
      if (${existence}) {
        const val = o${delim}${path}
        if (val === censor) {
          secret[${escPath}].precensored = true
        } else {
          secret[${escPath}].val = val
          o${delim}${path} = ${isCensorFct ? `censor(${censorArgs})` : "censor"}
          ${circularDetection}
        }
      }
    `;
    }).join("\n");
  }
  function dynamicRedactTmpl(hasWildcards, isCensorFct, censorFctTakesPath) {
    return hasWildcards === true ? `
    {
      const { wildcards, wcLen, groupRedact, nestedRedact } = this
      for (var i = 0; i < wcLen; i++) {
        const { before, beforeStr, after, nested } = wildcards[i]
        if (nested === true) {
          secret[beforeStr] = secret[beforeStr] || []
          nestedRedact(secret[beforeStr], o, before, after, censor, ${isCensorFct}, ${censorFctTakesPath})
        } else secret[beforeStr] = groupRedact(o, before, censor, ${isCensorFct}, ${censorFctTakesPath})
      }
    }
  ` : "";
  }
  function resultTmpl(serialize) {
    return serialize === false ? `return o` : `
    var s = this.serialize(o)
    this.restore(o)
    return s
  `;
  }
  function strictImpl(strict, serialize) {
    return strict === true ? `throw Error('fast-redact: primitives cannot be redacted')` : serialize === false ? `return o` : `return this.serialize(o)`;
  }
});

// node_modules/fast-redact/lib/modifiers.js
var require_modifiers = __commonJS((exports, module) => {
  "use strict";
  module.exports = {
    groupRedact,
    groupRestore,
    nestedRedact,
    nestedRestore
  };
  function groupRestore({keys, values, target}) {
    if (target == null)
      return;
    const length = keys.length;
    for (var i = 0; i < length; i++) {
      const k = keys[i];
      target[k] = values[i];
    }
  }
  function groupRedact(o, path, censor, isCensorFct, censorFctTakesPath) {
    const target = get(o, path);
    if (target == null)
      return {keys: null, values: null, target: null, flat: true};
    const keys = Object.keys(target);
    const keysLength = keys.length;
    const pathLength = path.length;
    const pathWithKey = censorFctTakesPath ? [...path] : void 0;
    const values = new Array(keysLength);
    for (var i = 0; i < keysLength; i++) {
      const key = keys[i];
      values[i] = target[key];
      if (censorFctTakesPath) {
        pathWithKey[pathLength] = key;
        target[key] = censor(target[key], pathWithKey);
      } else if (isCensorFct) {
        target[key] = censor(target[key]);
      } else {
        target[key] = censor;
      }
    }
    return {keys, values, target, flat: true};
  }
  function nestedRestore(arr) {
    const length = arr.length;
    for (var i = 0; i < length; i++) {
      const {key, target, value} = arr[i];
      target[key] = value;
    }
  }
  function nestedRedact(store, o, path, ns, censor, isCensorFct, censorFctTakesPath) {
    const target = get(o, path);
    if (target == null)
      return;
    const keys = Object.keys(target);
    const keysLength = keys.length;
    for (var i = 0; i < keysLength; i++) {
      const key = keys[i];
      const {value, parent, exists} = specialSet(target, key, path, ns, censor, isCensorFct, censorFctTakesPath);
      if (exists === true && parent !== null) {
        store.push({key: ns[ns.length - 1], target: parent, value});
      }
    }
    return store;
  }
  function has(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  function specialSet(o, k, path, afterPath, censor, isCensorFct, censorFctTakesPath) {
    const afterPathLen = afterPath.length;
    const lastPathIndex = afterPathLen - 1;
    const originalKey = k;
    var i = -1;
    var n;
    var nv;
    var ov;
    var oov = null;
    var exists = true;
    ov = n = o[k];
    if (typeof n !== "object")
      return {value: null, parent: null, exists};
    while (n != null && ++i < afterPathLen) {
      k = afterPath[i];
      oov = ov;
      if (!(k in n)) {
        exists = false;
        break;
      }
      ov = n[k];
      nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov) : censor;
      n[k] = has(n, k) && nv === ov || nv === void 0 && censor !== void 0 ? n[k] : nv;
      n = n[k];
      if (typeof n !== "object")
        break;
    }
    return {value: ov, parent: oov, exists};
  }
  function get(o, p) {
    var i = -1;
    var l = p.length;
    var n = o;
    while (n != null && ++i < l) {
      n = n[p[i]];
    }
    return n;
  }
});

// node_modules/fast-redact/lib/restorer.js
var require_restorer = __commonJS((exports, module) => {
  "use strict";
  var {groupRestore, nestedRestore} = require_modifiers();
  module.exports = restorer;
  function restorer({secret, wcLen}) {
    return function compileRestore() {
      if (this.restore)
        return;
      const paths = Object.keys(secret).filter((path) => secret[path].precensored === false);
      const resetters = resetTmpl(secret, paths);
      const hasWildcards = wcLen > 0;
      const state = hasWildcards ? {secret, groupRestore, nestedRestore} : {secret};
      this.restore = Function("o", restoreTmpl(resetters, paths, hasWildcards)).bind(state);
    };
  }
  function resetTmpl(secret, paths) {
    return paths.map((path) => {
      const {circle, escPath, leadingBracket} = secret[path];
      const delim = leadingBracket ? "" : ".";
      const reset = circle ? `o.${circle} = secret[${escPath}].val` : `o${delim}${path} = secret[${escPath}].val`;
      const clear = `secret[${escPath}].val = undefined`;
      return `
      if (secret[${escPath}].val !== undefined) {
        try { ${reset} } catch (e) {}
        ${clear}
      }
    `;
    }).join("");
  }
  function restoreTmpl(resetters, paths, hasWildcards) {
    const dynamicReset = hasWildcards === true ? `
    const keys = Object.keys(secret)
    const len = keys.length
    for (var i = ${paths.length}; i < len; i++) {
      const k = keys[i]
      const o = secret[k]
      if (o.flat === true) this.groupRestore(o)
      else this.nestedRestore(o)
      secret[k] = null
    }
  ` : "";
    return `
    const secret = this.secret
    ${resetters}
    ${dynamicReset}
    return o
  `;
  }
});

// node_modules/fast-redact/lib/state.js
var require_state = __commonJS((exports, module) => {
  "use strict";
  module.exports = state;
  function state(o) {
    const {
      secret,
      censor,
      compileRestore,
      serialize,
      groupRedact,
      nestedRedact,
      wildcards,
      wcLen
    } = o;
    const builder = [{secret, censor, compileRestore}];
    if (serialize !== false)
      builder.push({serialize});
    if (wcLen > 0)
      builder.push({groupRedact, nestedRedact, wildcards, wcLen});
    return Object.assign(...builder);
  }
});

// node_modules/fast-redact/index.js
var require_fast_redact = __commonJS((exports, module) => {
  "use strict";
  var validator = require_validator();
  var parse2 = require_parse();
  var redactor = require_redactor();
  var restorer = require_restorer();
  var {groupRedact, nestedRedact} = require_modifiers();
  var state = require_state();
  var rx = require_rx();
  var validate = validator();
  var noop = (o) => o;
  noop.restore = noop;
  var DEFAULT_CENSOR = "[REDACTED]";
  fastRedact.rx = rx;
  fastRedact.validator = validator;
  module.exports = fastRedact;
  function fastRedact(opts = {}) {
    const paths = Array.from(new Set(opts.paths || []));
    const serialize = "serialize" in opts ? opts.serialize === false ? opts.serialize : typeof opts.serialize === "function" ? opts.serialize : JSON.stringify : JSON.stringify;
    const remove = opts.remove;
    if (remove === true && serialize !== JSON.stringify) {
      throw Error("fast-redact \u2013 remove option may only be set when serializer is JSON.stringify");
    }
    const censor = remove === true ? void 0 : "censor" in opts ? opts.censor : DEFAULT_CENSOR;
    const isCensorFct = typeof censor === "function";
    const censorFctTakesPath = isCensorFct && censor.length > 1;
    if (paths.length === 0)
      return serialize || noop;
    validate({paths, serialize, censor});
    const {wildcards, wcLen, secret} = parse2({paths, censor});
    const compileRestore = restorer({secret, wcLen});
    const strict = "strict" in opts ? opts.strict : true;
    return redactor({secret, wcLen, serialize, strict, isCensorFct, censorFctTakesPath}, state({
      secret,
      censor,
      compileRestore,
      serialize,
      groupRedact,
      nestedRedact,
      wildcards,
      wcLen
    }));
  }
});

// node_modules/pino/lib/symbols.js
var require_symbols = __commonJS((exports, module) => {
  "use strict";
  var setLevelSym = Symbol("pino.setLevel");
  var getLevelSym = Symbol("pino.getLevel");
  var levelValSym = Symbol("pino.levelVal");
  var useLevelLabelsSym = Symbol("pino.useLevelLabels");
  var useOnlyCustomLevelsSym = Symbol("pino.useOnlyCustomLevels");
  var mixinSym = Symbol("pino.mixin");
  var lsCacheSym = Symbol("pino.lsCache");
  var chindingsSym = Symbol("pino.chindings");
  var parsedChindingsSym = Symbol("pino.parsedChindings");
  var asJsonSym = Symbol("pino.asJson");
  var writeSym = Symbol("pino.write");
  var redactFmtSym = Symbol("pino.redactFmt");
  var timeSym = Symbol("pino.time");
  var timeSliceIndexSym = Symbol("pino.timeSliceIndex");
  var streamSym = Symbol("pino.stream");
  var stringifySym = Symbol("pino.stringify");
  var stringifiersSym = Symbol("pino.stringifiers");
  var endSym = Symbol("pino.end");
  var formatOptsSym = Symbol("pino.formatOpts");
  var messageKeySym = Symbol("pino.messageKey");
  var nestedKeySym = Symbol("pino.nestedKey");
  var wildcardFirstSym = Symbol("pino.wildcardFirst");
  var serializersSym = Symbol.for("pino.serializers");
  var formattersSym = Symbol.for("pino.formatters");
  var hooksSym = Symbol.for("pino.hooks");
  var needsMetadataGsym = Symbol.for("pino.metadata");
  module.exports = {
    setLevelSym,
    getLevelSym,
    levelValSym,
    useLevelLabelsSym,
    mixinSym,
    lsCacheSym,
    chindingsSym,
    parsedChindingsSym,
    asJsonSym,
    writeSym,
    serializersSym,
    redactFmtSym,
    timeSym,
    timeSliceIndexSym,
    streamSym,
    stringifySym,
    stringifiersSym,
    endSym,
    formatOptsSym,
    messageKeySym,
    nestedKeySym,
    wildcardFirstSym,
    needsMetadataGsym,
    useOnlyCustomLevelsSym,
    formattersSym,
    hooksSym
  };
});

// node_modules/pino/lib/redaction.js
var require_redaction = __commonJS((exports, module) => {
  "use strict";
  var fastRedact = require_fast_redact();
  var {redactFmtSym, wildcardFirstSym} = require_symbols();
  var {rx, validator} = fastRedact;
  var validate = validator({
    ERR_PATHS_MUST_BE_STRINGS: () => "pino \u2013 redacted paths must be strings",
    ERR_INVALID_PATH: (s) => `pino \u2013 redact paths array contains an invalid path (${s})`
  });
  var CENSOR = "[Redacted]";
  var strict = false;
  function redaction(opts, serialize) {
    const {paths, censor} = handle(opts);
    const shape = paths.reduce((o, str) => {
      rx.lastIndex = 0;
      const first = rx.exec(str);
      const next = rx.exec(str);
      let ns = first[1] !== void 0 ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, "$1") : first[0];
      if (ns === "*") {
        ns = wildcardFirstSym;
      }
      if (next === null) {
        o[ns] = null;
        return o;
      }
      if (o[ns] === null) {
        return o;
      }
      const {index} = next;
      const nextPath = `${str.substr(index, str.length - 1)}`;
      o[ns] = o[ns] || [];
      if (ns !== wildcardFirstSym && o[ns].length === 0) {
        o[ns].push(...o[wildcardFirstSym] || []);
      }
      if (ns === wildcardFirstSym) {
        Object.keys(o).forEach(function(k) {
          if (o[k]) {
            o[k].push(nextPath);
          }
        });
      }
      o[ns].push(nextPath);
      return o;
    }, {});
    const result = {
      [redactFmtSym]: fastRedact({paths, censor, serialize, strict})
    };
    const topCensor = (...args) => {
      return typeof censor === "function" ? serialize(censor(...args)) : serialize(censor);
    };
    return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
      if (shape[k] === null) {
        o[k] = (value) => topCensor(value, [k]);
      } else {
        const wrappedCensor = typeof censor === "function" ? (value, path) => {
          return censor(value, [k, ...path]);
        } : censor;
        o[k] = fastRedact({
          paths: shape[k],
          censor: wrappedCensor,
          serialize,
          strict
        });
      }
      return o;
    }, result);
  }
  function handle(opts) {
    if (Array.isArray(opts)) {
      opts = {paths: opts, censor: CENSOR};
      validate(opts);
      return opts;
    }
    let {paths, censor = CENSOR, remove} = opts;
    if (Array.isArray(paths) === false) {
      throw Error("pino \u2013 redact must contain an array of strings");
    }
    if (remove === true)
      censor = void 0;
    validate({paths, censor});
    return {paths, censor};
  }
  module.exports = redaction;
});

// node_modules/pino/lib/time.js
var require_time = __commonJS((exports, module) => {
  "use strict";
  var nullTime = () => "";
  var epochTime = () => `,"time":${Date.now()}`;
  var unixTime = () => `,"time":${Math.round(Date.now() / 1e3)}`;
  var isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"`;
  module.exports = {nullTime, epochTime, unixTime, isoTime};
});

// node_modules/flatstr/index.js
var require_flatstr = __commonJS((exports, module) => {
  "use strict";
  function flatstr(s) {
    s | 0;
    return s;
  }
  module.exports = flatstr;
});

// node_modules/atomic-sleep/index.js
var require_atomic_sleep = __commonJS((exports, module) => {
  "use strict";
  if (typeof SharedArrayBuffer !== "undefined" && typeof Atomics !== "undefined") {
    let sleep = function(ms) {
      const valid = ms > 0 && ms < Infinity;
      if (valid === false) {
        if (typeof ms !== "number" && typeof ms !== "bigint") {
          throw TypeError("sleep: ms must be a number");
        }
        throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
      }
      Atomics.wait(nil, 0, 0, Number(ms));
    };
    const nil = new Int32Array(new SharedArrayBuffer(4));
    module.exports = sleep;
  } else {
    let sleep = function(ms) {
      const valid = ms > 0 && ms < Infinity;
      if (valid === false) {
        if (typeof ms !== "number" && typeof ms !== "bigint") {
          throw TypeError("sleep: ms must be a number");
        }
        throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
      }
      const target = Date.now() + Number(ms);
      while (target > Date.now()) {
      }
    };
    module.exports = sleep;
  }
});

// node_modules/sonic-boom/index.js
var require_sonic_boom = __commonJS((exports, module) => {
  "use strict";
  var fs2 = require("fs");
  var EventEmitter = require("events");
  var flatstr = require_flatstr();
  var inherits = require("util").inherits;
  var BUSY_WRITE_TIMEOUT = 100;
  var sleep = require_atomic_sleep();
  var MAX_WRITE = 16 * 1024 * 1024;
  function openFile(file, sonic) {
    sonic._opening = true;
    sonic._writing = true;
    sonic._asyncDrainScheduled = false;
    sonic.file = file;
    function fileOpened(err, fd) {
      if (err) {
        sonic.emit("error", err);
        return;
      }
      sonic.fd = fd;
      sonic._reopening = false;
      sonic._opening = false;
      sonic._writing = false;
      sonic.emit("ready");
      if (sonic._reopening) {
        return;
      }
      var len = sonic._buf.length;
      if (len > 0 && len > sonic.minLength && !sonic.destroyed) {
        actualWrite(sonic);
      }
    }
    if (sonic.sync) {
      const fd = fs2.openSync(file, "a");
      fileOpened(null, fd);
      process.nextTick(() => sonic.emit("ready"));
    } else {
      fs2.open(file, "a", fileOpened);
    }
  }
  function SonicBoom(opts) {
    if (!(this instanceof SonicBoom)) {
      return new SonicBoom(opts);
    }
    var {fd, dest, minLength, sync} = opts || {};
    fd = fd || dest;
    this._buf = "";
    this.fd = -1;
    this._writing = false;
    this._writingBuf = "";
    this._ending = false;
    this._reopening = false;
    this._asyncDrainScheduled = false;
    this.file = null;
    this.destroyed = false;
    this.sync = sync || false;
    this.minLength = minLength || 0;
    if (typeof fd === "number") {
      this.fd = fd;
      process.nextTick(() => this.emit("ready"));
    } else if (typeof fd === "string") {
      openFile(fd, this);
    } else {
      throw new Error("SonicBoom supports only file descriptors and files");
    }
    this.release = (err, n) => {
      if (err) {
        if (err.code === "EAGAIN") {
          if (this.sync) {
            try {
              sleep(BUSY_WRITE_TIMEOUT);
              this.release(void 0, 0);
            } catch (err2) {
              this.release(err2);
            }
          } else {
            setTimeout(() => {
              fs2.write(this.fd, this._writingBuf, "utf8", this.release);
            }, BUSY_WRITE_TIMEOUT);
          }
        } else {
          this.emit("error", err);
        }
        return;
      }
      if (this._writingBuf.length !== n) {
        this._writingBuf = this._writingBuf.slice(n);
        if (this.sync) {
          try {
            do {
              n = fs2.writeSync(this.fd, this._writingBuf, "utf8");
              this._writingBuf = this._writingBuf.slice(n);
            } while (this._writingBuf.length !== 0);
          } catch (err2) {
            this.release(err2);
            return;
          }
        } else {
          fs2.write(this.fd, this._writingBuf, "utf8", this.release);
          return;
        }
      }
      this._writingBuf = "";
      if (this.destroyed) {
        return;
      }
      var len = this._buf.length;
      if (this._reopening) {
        this._writing = false;
        this._reopening = false;
        this.reopen();
      } else if (len > 0 && len > this.minLength) {
        actualWrite(this);
      } else if (this._ending) {
        if (len > 0) {
          actualWrite(this);
        } else {
          this._writing = false;
          actualClose(this);
        }
      } else {
        this._writing = false;
        if (this.sync) {
          if (!this._asyncDrainScheduled) {
            this._asyncDrainScheduled = true;
            process.nextTick(emitDrain, this);
          }
        } else {
          this.emit("drain");
        }
      }
    };
    this.on("newListener", function(name) {
      if (name === "drain") {
        this._asyncDrainScheduled = false;
      }
    });
  }
  function emitDrain(sonic) {
    const hasListeners = sonic.listenerCount("drain") > 0;
    if (!hasListeners)
      return;
    sonic._asyncDrainScheduled = false;
    sonic.emit("drain");
  }
  inherits(SonicBoom, EventEmitter);
  SonicBoom.prototype.write = function(data) {
    if (this.destroyed) {
      throw new Error("SonicBoom destroyed");
    }
    this._buf += data;
    var len = this._buf.length;
    if (!this._writing && len > this.minLength) {
      actualWrite(this);
    }
    return len < 16384;
  };
  SonicBoom.prototype.flush = function() {
    if (this.destroyed) {
      throw new Error("SonicBoom destroyed");
    }
    if (this._writing || this.minLength <= 0) {
      return;
    }
    actualWrite(this);
  };
  SonicBoom.prototype.reopen = function(file) {
    if (this.destroyed) {
      throw new Error("SonicBoom destroyed");
    }
    if (this._opening) {
      this.once("ready", () => {
        this.reopen(file);
      });
      return;
    }
    if (this._ending) {
      return;
    }
    if (!this.file) {
      throw new Error("Unable to reopen a file descriptor, you must pass a file to SonicBoom");
    }
    this._reopening = true;
    if (this._writing) {
      return;
    }
    fs2.close(this.fd, (err) => {
      if (err) {
        return this.emit("error", err);
      }
    });
    openFile(file || this.file, this);
  };
  SonicBoom.prototype.end = function() {
    if (this.destroyed) {
      throw new Error("SonicBoom destroyed");
    }
    if (this._opening) {
      this.once("ready", () => {
        this.end();
      });
      return;
    }
    if (this._ending) {
      return;
    }
    this._ending = true;
    if (!this._writing && this._buf.length > 0 && this.fd >= 0) {
      actualWrite(this);
      return;
    }
    if (this._writing) {
      return;
    }
    actualClose(this);
  };
  SonicBoom.prototype.flushSync = function() {
    if (this.destroyed) {
      throw new Error("SonicBoom destroyed");
    }
    if (this.fd < 0) {
      throw new Error("sonic boom is not ready yet");
    }
    if (this._buf.length > 0) {
      fs2.writeSync(this.fd, this._buf, "utf8");
      this._buf = "";
    }
  };
  SonicBoom.prototype.destroy = function() {
    if (this.destroyed) {
      return;
    }
    actualClose(this);
  };
  function actualWrite(sonic) {
    sonic._writing = true;
    var buf = sonic._buf;
    var release = sonic.release;
    if (buf.length > MAX_WRITE) {
      buf = buf.slice(0, MAX_WRITE);
      sonic._buf = sonic._buf.slice(MAX_WRITE);
    } else {
      sonic._buf = "";
    }
    flatstr(buf);
    sonic._writingBuf = buf;
    if (sonic.sync) {
      try {
        var written = fs2.writeSync(sonic.fd, buf, "utf8");
        release(null, written);
      } catch (err) {
        release(err);
      }
    } else {
      fs2.write(sonic.fd, buf, "utf8", release);
    }
  }
  function actualClose(sonic) {
    if (sonic.fd === -1) {
      sonic.once("ready", actualClose.bind(null, sonic));
      return;
    }
    fs2.close(sonic.fd, (err) => {
      if (err) {
        sonic.emit("error", err);
        return;
      }
      if (sonic._ending && !sonic._writing) {
        sonic.emit("finish");
      }
      sonic.emit("close");
    });
    sonic.destroyed = true;
    sonic._buf = "";
  }
  module.exports = SonicBoom;
});

// node_modules/quick-format-unescaped/index.js
var require_quick_format_unescaped = __commonJS((exports, module) => {
  "use strict";
  function tryStringify(o) {
    try {
      return JSON.stringify(o);
    } catch (e) {
      return '"[Circular]"';
    }
  }
  module.exports = format;
  function format(f, args, opts) {
    var ss = opts && opts.stringify || tryStringify;
    var offset = 1;
    if (typeof f === "object" && f !== null) {
      var len = args.length + offset;
      if (len === 1)
        return f;
      var objects = new Array(len);
      objects[0] = ss(f);
      for (var index = 1; index < len; index++) {
        objects[index] = ss(args[index]);
      }
      return objects.join(" ");
    }
    if (typeof f !== "string") {
      return f;
    }
    var argLen = args.length;
    if (argLen === 0)
      return f;
    var x = "";
    var str = "";
    var a = 1 - offset;
    var lastPos = -1;
    var flen = f && f.length || 0;
    for (var i = 0; i < flen; ) {
      if (f.charCodeAt(i) === 37 && i + 1 < flen) {
        lastPos = lastPos > -1 ? lastPos : 0;
        switch (f.charCodeAt(i + 1)) {
          case 100:
            if (a >= argLen)
              break;
            if (lastPos < i)
              str += f.slice(lastPos, i);
            if (args[a] == null)
              break;
            str += Number(args[a]);
            lastPos = i = i + 2;
            break;
          case 79:
          case 111:
          case 106:
            if (a >= argLen)
              break;
            if (lastPos < i)
              str += f.slice(lastPos, i);
            if (args[a] === void 0)
              break;
            var type = typeof args[a];
            if (type === "string") {
              str += "'" + args[a] + "'";
              lastPos = i + 2;
              i++;
              break;
            }
            if (type === "function") {
              str += args[a].name || "<anonymous>";
              lastPos = i + 2;
              i++;
              break;
            }
            str += ss(args[a]);
            lastPos = i + 2;
            i++;
            break;
          case 115:
            if (a >= argLen)
              break;
            if (lastPos < i)
              str += f.slice(lastPos, i);
            str += String(args[a]);
            lastPos = i + 2;
            i++;
            break;
          case 37:
            if (lastPos < i)
              str += f.slice(lastPos, i);
            str += "%";
            lastPos = i + 2;
            i++;
            break;
        }
        ++a;
      }
      ++i;
    }
    if (lastPos === -1)
      return f;
    else if (lastPos < flen) {
      str += f.slice(lastPos);
    }
    return str;
  }
});

// node_modules/fast-safe-stringify/index.js
var require_fast_safe_stringify = __commonJS((exports, module) => {
  module.exports = stringify;
  stringify.default = stringify;
  stringify.stable = deterministicStringify;
  stringify.stableStringify = deterministicStringify;
  var arr = [];
  var replacerStack = [];
  function stringify(obj, replacer, spacer) {
    decirc(obj, "", [], void 0);
    var res;
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer);
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
    }
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
    return res;
  }
  function decirc(val, k, stack, parent) {
    var i;
    if (typeof val === "object" && val !== null) {
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === val) {
          var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
          if (propertyDescriptor.get !== void 0) {
            if (propertyDescriptor.configurable) {
              Object.defineProperty(parent, k, {value: "[Circular]"});
              arr.push([parent, k, val, propertyDescriptor]);
            } else {
              replacerStack.push([val, k]);
            }
          } else {
            parent[k] = "[Circular]";
            arr.push([parent, k, val]);
          }
          return;
        }
      }
      stack.push(val);
      if (Array.isArray(val)) {
        for (i = 0; i < val.length; i++) {
          decirc(val[i], i, stack, val);
        }
      } else {
        var keys = Object.keys(val);
        for (i = 0; i < keys.length; i++) {
          var key = keys[i];
          decirc(val[key], key, stack, val);
        }
      }
      stack.pop();
    }
  }
  function compareFunction(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }
  function deterministicStringify(obj, replacer, spacer) {
    var tmp = deterministicDecirc(obj, "", [], void 0) || obj;
    var res;
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer);
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
    }
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
    return res;
  }
  function deterministicDecirc(val, k, stack, parent) {
    var i;
    if (typeof val === "object" && val !== null) {
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === val) {
          var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
          if (propertyDescriptor.get !== void 0) {
            if (propertyDescriptor.configurable) {
              Object.defineProperty(parent, k, {value: "[Circular]"});
              arr.push([parent, k, val, propertyDescriptor]);
            } else {
              replacerStack.push([val, k]);
            }
          } else {
            parent[k] = "[Circular]";
            arr.push([parent, k, val]);
          }
          return;
        }
      }
      if (typeof val.toJSON === "function") {
        return;
      }
      stack.push(val);
      if (Array.isArray(val)) {
        for (i = 0; i < val.length; i++) {
          deterministicDecirc(val[i], i, stack, val);
        }
      } else {
        var tmp = {};
        var keys = Object.keys(val).sort(compareFunction);
        for (i = 0; i < keys.length; i++) {
          var key = keys[i];
          deterministicDecirc(val[key], key, stack, val);
          tmp[key] = val[key];
        }
        if (parent !== void 0) {
          arr.push([parent, k, val]);
          parent[k] = tmp;
        } else {
          return tmp;
        }
      }
      stack.pop();
    }
  }
  function replaceGetterValues(replacer) {
    replacer = replacer !== void 0 ? replacer : function(k, v) {
      return v;
    };
    return function(key, val) {
      if (replacerStack.length > 0) {
        for (var i = 0; i < replacerStack.length; i++) {
          var part = replacerStack[i];
          if (part[1] === key && part[0] === val) {
            val = "[Circular]";
            replacerStack.splice(i, 1);
            break;
          }
        }
      }
      return replacer.call(this, key, val);
    };
  }
});

// node_modules/pino/lib/tools.js
var require_tools = __commonJS((exports, module) => {
  "use strict";
  var format = require_quick_format_unescaped();
  var {mapHttpRequest, mapHttpResponse} = require_pino_std_serializers();
  var SonicBoom = require_sonic_boom();
  var stringifySafe = require_fast_safe_stringify();
  var {
    lsCacheSym,
    chindingsSym,
    parsedChindingsSym,
    writeSym,
    serializersSym,
    formatOptsSym,
    endSym,
    stringifiersSym,
    stringifySym,
    wildcardFirstSym,
    needsMetadataGsym,
    redactFmtSym,
    streamSym,
    nestedKeySym,
    formattersSym,
    messageKeySym
  } = require_symbols();
  function noop() {
  }
  function genLog(level, hook) {
    if (!hook)
      return LOG;
    return function hookWrappedLog(...args) {
      hook.call(this, args, LOG, level);
    };
    function LOG(o, ...n) {
      if (typeof o === "object") {
        let msg = o;
        if (o !== null) {
          if (o.method && o.headers && o.socket) {
            o = mapHttpRequest(o);
          } else if (typeof o.setHeader === "function") {
            o = mapHttpResponse(o);
          }
        }
        if (this[nestedKeySym])
          o = {[this[nestedKeySym]]: o};
        let formatParams;
        if (msg === null && n.length === 0) {
          formatParams = [null];
        } else {
          msg = n.shift();
          formatParams = n;
        }
        this[writeSym](o, format(msg, formatParams, this[formatOptsSym]), level);
      } else {
        this[writeSym](null, format(o, n, this[formatOptsSym]), level);
      }
    }
  }
  function asString(str) {
    let result = "";
    let last = 0;
    let found = false;
    let point = 255;
    const l = str.length;
    if (l > 100) {
      return JSON.stringify(str);
    }
    for (var i = 0; i < l && point >= 32; i++) {
      point = str.charCodeAt(i);
      if (point === 34 || point === 92) {
        result += str.slice(last, i) + "\\";
        last = i;
        found = true;
      }
    }
    if (!found) {
      result = str;
    } else {
      result += str.slice(last);
    }
    return point < 32 ? JSON.stringify(str) : '"' + result + '"';
  }
  function asJson(obj, msg, num, time) {
    const stringify2 = this[stringifySym];
    const stringifiers = this[stringifiersSym];
    const end = this[endSym];
    const chindings = this[chindingsSym];
    const serializers = this[serializersSym];
    const formatters = this[formattersSym];
    const messageKey = this[messageKeySym];
    let data = this[lsCacheSym][num] + time;
    data = data + chindings;
    let value;
    const notHasOwnProperty = obj.hasOwnProperty === void 0;
    if (formatters.log) {
      obj = formatters.log(obj);
    }
    if (msg !== void 0) {
      obj[messageKey] = msg;
    }
    const wildcardStringifier = stringifiers[wildcardFirstSym];
    for (const key in obj) {
      value = obj[key];
      if ((notHasOwnProperty || obj.hasOwnProperty(key)) && value !== void 0) {
        value = serializers[key] ? serializers[key](value) : value;
        const stringifier = stringifiers[key] || wildcardStringifier;
        switch (typeof value) {
          case "undefined":
          case "function":
            continue;
          case "number":
            if (Number.isFinite(value) === false) {
              value = null;
            }
          case "boolean":
            if (stringifier)
              value = stringifier(value);
            break;
          case "string":
            value = (stringifier || asString)(value);
            break;
          default:
            value = (stringifier || stringify2)(value);
        }
        if (value === void 0)
          continue;
        data += ',"' + key + '":' + value;
      }
    }
    return data + end;
  }
  function asChindings(instance, bindings) {
    let value;
    let data = instance[chindingsSym];
    const stringify2 = instance[stringifySym];
    const stringifiers = instance[stringifiersSym];
    const wildcardStringifier = stringifiers[wildcardFirstSym];
    const serializers = instance[serializersSym];
    const formatter = instance[formattersSym].bindings;
    bindings = formatter(bindings);
    for (const key in bindings) {
      value = bindings[key];
      const valid = key !== "level" && key !== "serializers" && key !== "formatters" && key !== "customLevels" && bindings.hasOwnProperty(key) && value !== void 0;
      if (valid === true) {
        value = serializers[key] ? serializers[key](value) : value;
        value = (stringifiers[key] || wildcardStringifier || stringify2)(value);
        if (value === void 0)
          continue;
        data += ',"' + key + '":' + value;
      }
    }
    return data;
  }
  function getPrettyStream(opts, prettifier, dest, instance) {
    if (prettifier && typeof prettifier === "function") {
      prettifier = prettifier.bind(instance);
      return prettifierMetaWrapper(prettifier(opts), dest, opts);
    }
    try {
      const prettyFactory = require("pino-pretty");
      prettyFactory.asMetaWrapper = prettifierMetaWrapper;
      return prettifierMetaWrapper(prettyFactory(opts), dest, opts);
    } catch (e) {
      throw Error("Missing `pino-pretty` module: `pino-pretty` must be installed separately");
    }
  }
  function prettifierMetaWrapper(pretty, dest, opts) {
    opts = Object.assign({suppressFlushSyncWarning: false}, opts);
    let warned = false;
    return {
      [needsMetadataGsym]: true,
      lastLevel: 0,
      lastMsg: null,
      lastObj: null,
      lastLogger: null,
      flushSync() {
        if (opts.suppressFlushSyncWarning || warned) {
          return;
        }
        warned = true;
        setMetadataProps(dest, this);
        dest.write(pretty(Object.assign({
          level: 40,
          msg: "pino.final with prettyPrint does not support flushing",
          time: Date.now()
        }, this.chindings())));
      },
      chindings() {
        const lastLogger = this.lastLogger;
        let chindings = null;
        if (!lastLogger) {
          return null;
        }
        if (lastLogger.hasOwnProperty(parsedChindingsSym)) {
          chindings = lastLogger[parsedChindingsSym];
        } else {
          chindings = JSON.parse("{" + lastLogger[chindingsSym].substr(1) + "}");
          lastLogger[parsedChindingsSym] = chindings;
        }
        return chindings;
      },
      write(chunk) {
        const lastLogger = this.lastLogger;
        const chindings = this.chindings();
        let time = this.lastTime;
        if (time.match(/^\d+/)) {
          time = parseInt(time);
        } else {
          time = time.slice(1, -1);
        }
        const lastObj = this.lastObj;
        const lastMsg = this.lastMsg;
        const errorProps = null;
        const formatters = lastLogger[formattersSym];
        const formattedObj = formatters.log ? formatters.log(lastObj) : lastObj;
        const messageKey = lastLogger[messageKeySym];
        if (lastMsg && formattedObj && !formattedObj.hasOwnProperty(messageKey)) {
          formattedObj[messageKey] = lastMsg;
        }
        const obj = Object.assign({
          level: this.lastLevel,
          time
        }, formattedObj, errorProps);
        const serializers = lastLogger[serializersSym];
        const keys = Object.keys(serializers);
        for (var i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (obj[key] !== void 0) {
            obj[key] = serializers[key](obj[key]);
          }
        }
        for (const key in chindings) {
          if (!obj.hasOwnProperty(key)) {
            obj[key] = chindings[key];
          }
        }
        const stringifiers = lastLogger[stringifiersSym];
        const redact = stringifiers[redactFmtSym];
        const formatted = pretty(typeof redact === "function" ? redact(obj) : obj);
        if (formatted === void 0)
          return;
        setMetadataProps(dest, this);
        dest.write(formatted);
      }
    };
  }
  function hasBeenTampered(stream) {
    return stream.write !== stream.constructor.prototype.write;
  }
  function buildSafeSonicBoom(opts) {
    const stream = new SonicBoom(opts);
    stream.on("error", filterBrokenPipe);
    return stream;
    function filterBrokenPipe(err) {
      if (err.code === "EPIPE") {
        stream.write = noop;
        stream.end = noop;
        stream.flushSync = noop;
        stream.destroy = noop;
        return;
      }
      stream.removeListener("error", filterBrokenPipe);
      stream.emit("error", err);
    }
  }
  function createArgsNormalizer(defaultOptions) {
    return function normalizeArgs(instance, opts = {}, stream) {
      if (typeof opts === "string") {
        stream = buildSafeSonicBoom({dest: opts, sync: true});
        opts = {};
      } else if (typeof stream === "string") {
        stream = buildSafeSonicBoom({dest: stream, sync: true});
      } else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
        stream = opts;
        opts = null;
      }
      opts = Object.assign({}, defaultOptions, opts);
      if ("extreme" in opts) {
        throw Error("The extreme option has been removed, use pino.destination({ sync: false }) instead");
      }
      if ("onTerminated" in opts) {
        throw Error("The onTerminated option has been removed, use pino.final instead");
      }
      if ("changeLevelName" in opts) {
        process.emitWarning("The changeLevelName option is deprecated and will be removed in v7. Use levelKey instead.", {code: "changeLevelName_deprecation"});
        opts.levelKey = opts.changeLevelName;
        delete opts.changeLevelName;
      }
      const {enabled, prettyPrint, prettifier, messageKey} = opts;
      if (enabled === false)
        opts.level = "silent";
      stream = stream || process.stdout;
      if (stream === process.stdout && stream.fd >= 0 && !hasBeenTampered(stream)) {
        stream = buildSafeSonicBoom({fd: stream.fd, sync: true});
      }
      if (prettyPrint) {
        const prettyOpts = Object.assign({messageKey}, prettyPrint);
        stream = getPrettyStream(prettyOpts, prettifier, stream, instance);
      }
      return {opts, stream};
    };
  }
  function final(logger2, handler) {
    if (typeof logger2 === "undefined" || typeof logger2.child !== "function") {
      throw Error("expected a pino logger instance");
    }
    const hasHandler = typeof handler !== "undefined";
    if (hasHandler && typeof handler !== "function") {
      throw Error("if supplied, the handler parameter should be a function");
    }
    const stream = logger2[streamSym];
    if (typeof stream.flushSync !== "function") {
      throw Error("final requires a stream that has a flushSync method, such as pino.destination");
    }
    const finalLogger = new Proxy(logger2, {
      get: (logger3, key) => {
        if (key in logger3.levels.values) {
          return (...args) => {
            logger3[key](...args);
            stream.flushSync();
          };
        }
        return logger3[key];
      }
    });
    if (!hasHandler) {
      return finalLogger;
    }
    return (err = null, ...args) => {
      try {
        stream.flushSync();
      } catch (e) {
      }
      return handler(err, finalLogger, ...args);
    };
  }
  function stringify(obj) {
    try {
      return JSON.stringify(obj);
    } catch (_) {
      return stringifySafe(obj);
    }
  }
  function buildFormatters(level, bindings, log) {
    return {
      level,
      bindings,
      log
    };
  }
  function setMetadataProps(dest, that) {
    if (dest[needsMetadataGsym] === true) {
      dest.lastLevel = that.lastLevel;
      dest.lastMsg = that.lastMsg;
      dest.lastObj = that.lastObj;
      dest.lastTime = that.lastTime;
      dest.lastLogger = that.lastLogger;
    }
  }
  module.exports = {
    noop,
    buildSafeSonicBoom,
    getPrettyStream,
    asChindings,
    asJson,
    genLog,
    createArgsNormalizer,
    final,
    stringify,
    buildFormatters
  };
});

// node_modules/pino/lib/levels.js
var require_levels = __commonJS((exports, module) => {
  "use strict";
  var flatstr = require_flatstr();
  var {
    lsCacheSym,
    levelValSym,
    useOnlyCustomLevelsSym,
    streamSym,
    formattersSym,
    hooksSym
  } = require_symbols();
  var {noop, genLog} = require_tools();
  var levels = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60
  };
  var levelMethods = {
    fatal: (hook) => {
      const logFatal = genLog(levels.fatal, hook);
      return function(...args) {
        const stream = this[streamSym];
        logFatal.call(this, ...args);
        if (typeof stream.flushSync === "function") {
          try {
            stream.flushSync();
          } catch (e) {
          }
        }
      };
    },
    error: (hook) => genLog(levels.error, hook),
    warn: (hook) => genLog(levels.warn, hook),
    info: (hook) => genLog(levels.info, hook),
    debug: (hook) => genLog(levels.debug, hook),
    trace: (hook) => genLog(levels.trace, hook)
  };
  var nums = Object.keys(levels).reduce((o, k) => {
    o[levels[k]] = k;
    return o;
  }, {});
  var initialLsCache = Object.keys(nums).reduce((o, k) => {
    o[k] = flatstr('{"level":' + Number(k));
    return o;
  }, {});
  function genLsCache(instance) {
    const formatter = instance[formattersSym].level;
    const {labels} = instance.levels;
    const cache = {};
    for (const label in labels) {
      const level = formatter(labels[label], Number(label));
      cache[label] = JSON.stringify(level).slice(0, -1);
    }
    instance[lsCacheSym] = cache;
    return instance;
  }
  function isStandardLevel(level, useOnlyCustomLevels) {
    if (useOnlyCustomLevels) {
      return false;
    }
    switch (level) {
      case "fatal":
      case "error":
      case "warn":
      case "info":
      case "debug":
      case "trace":
        return true;
      default:
        return false;
    }
  }
  function setLevel(level) {
    const {labels, values} = this.levels;
    if (typeof level === "number") {
      if (labels[level] === void 0)
        throw Error("unknown level value" + level);
      level = labels[level];
    }
    if (values[level] === void 0)
      throw Error("unknown level " + level);
    const preLevelVal = this[levelValSym];
    const levelVal = this[levelValSym] = values[level];
    const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym];
    const hook = this[hooksSym].logMethod;
    for (const key in values) {
      if (levelVal > values[key]) {
        this[key] = noop;
        continue;
      }
      this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook);
    }
    this.emit("level-change", level, levelVal, labels[preLevelVal], preLevelVal);
  }
  function getLevel(level) {
    const {levels: levels2, levelVal} = this;
    return levels2 && levels2.labels ? levels2.labels[levelVal] : "";
  }
  function isLevelEnabled(logLevel) {
    const {values} = this.levels;
    const logLevelVal = values[logLevel];
    return logLevelVal !== void 0 && logLevelVal >= this[levelValSym];
  }
  function mappings(customLevels = null, useOnlyCustomLevels = false) {
    const customNums = customLevels ? Object.keys(customLevels).reduce((o, k) => {
      o[customLevels[k]] = k;
      return o;
    }, {}) : null;
    const labels = Object.assign(Object.create(Object.prototype, {Infinity: {value: "silent"}}), useOnlyCustomLevels ? null : nums, customNums);
    const values = Object.assign(Object.create(Object.prototype, {silent: {value: Infinity}}), useOnlyCustomLevels ? null : levels, customLevels);
    return {labels, values};
  }
  function assertDefaultLevelFound(defaultLevel, customLevels, useOnlyCustomLevels) {
    if (typeof defaultLevel === "number") {
      const values = [].concat(Object.keys(customLevels || {}).map((key) => customLevels[key]), useOnlyCustomLevels ? [] : Object.keys(nums).map((level) => +level), Infinity);
      if (!values.includes(defaultLevel)) {
        throw Error(`default level:${defaultLevel} must be included in custom levels`);
      }
      return;
    }
    const labels = Object.assign(Object.create(Object.prototype, {silent: {value: Infinity}}), useOnlyCustomLevels ? null : levels, customLevels);
    if (!(defaultLevel in labels)) {
      throw Error(`default level:${defaultLevel} must be included in custom levels`);
    }
  }
  function assertNoLevelCollisions(levels2, customLevels) {
    const {labels, values} = levels2;
    for (const k in customLevels) {
      if (k in values) {
        throw Error("levels cannot be overridden");
      }
      if (customLevels[k] in labels) {
        throw Error("pre-existing level values cannot be used for new levels");
      }
    }
  }
  module.exports = {
    initialLsCache,
    genLsCache,
    levelMethods,
    getLevel,
    setLevel,
    isLevelEnabled,
    mappings,
    assertNoLevelCollisions,
    assertDefaultLevelFound
  };
});

// node_modules/pino/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "pino",
    version: "6.11.0",
    description: "super fast, all natural json logger",
    main: "pino.js",
    browser: "./browser.js",
    files: [
      "pino.js",
      "bin.js",
      "browser.js",
      "pretty.js",
      "usage.txt",
      "test",
      "docs",
      "example.js",
      "lib"
    ],
    scripts: {
      docs: "docsify serve",
      "browser-test": "airtap --local 8080 test/browser*test.js",
      lint: "eslint .",
      test: "npm run lint && tap --100 test/*test.js test/*/*test.js",
      "cov-ui": "tap --coverage-report=html test/*test.js test/*/*test.js",
      bench: "node benchmarks/utils/runbench all",
      "bench-basic": "node benchmarks/utils/runbench basic",
      "bench-object": "node benchmarks/utils/runbench object",
      "bench-deep-object": "node benchmarks/utils/runbench deep-object",
      "bench-multi-arg": "node benchmarks/utils/runbench multi-arg",
      "bench-longs-tring": "node benchmarks/utils/runbench long-string",
      "bench-child": "node benchmarks/utils/runbench child",
      "bench-child-child": "node benchmarks/utils/runbench child-child",
      "bench-child-creation": "node benchmarks/utils/runbench child-creation",
      "bench-formatters": "node benchmarks/utils/runbench formatters",
      "update-bench-doc": "node benchmarks/utils/generate-benchmark-doc > docs/benchmarks.md"
    },
    bin: {
      pino: "./bin.js"
    },
    precommit: "test",
    repository: {
      type: "git",
      url: "git+https://github.com/pinojs/pino.git"
    },
    keywords: [
      "fast",
      "logger",
      "stream",
      "json"
    ],
    author: "Matteo Collina <hello@matteocollina.com>",
    contributors: [
      "David Mark Clements <huperekchuno@googlemail.com>",
      "James Sumners <james.sumners@gmail.com>",
      "Thomas Watson Steen <w@tson.dk> (https://twitter.com/wa7son)"
    ],
    license: "MIT",
    bugs: {
      url: "https://github.com/pinojs/pino/issues"
    },
    homepage: "http://getpino.io",
    devDependencies: {
      airtap: "3.0.0",
      benchmark: "^2.1.4",
      bole: "^4.0.0",
      bunyan: "^1.8.14",
      "docsify-cli": "^4.4.1",
      eslint: "^7.17.0",
      "eslint-config-standard": "^16.0.2",
      "eslint-plugin-import": "^2.22.1",
      "eslint-plugin-node": "^11.1.0",
      "eslint-plugin-promise": "^4.2.1",
      execa: "^4.0.0",
      fastbench: "^1.0.1",
      "flush-write-stream": "^2.0.0",
      "import-fresh": "^3.2.1",
      log: "^6.0.0",
      loglevel: "^1.6.7",
      "pino-pretty": "^4.1.0",
      "pre-commit": "^1.2.2",
      proxyquire: "^2.1.3",
      pump: "^3.0.0",
      semver: "^7.0.0",
      split2: "^3.1.1",
      steed: "^1.1.3",
      "strip-ansi": "^6.0.0",
      tap: "^14.10.8",
      tape: "^5.0.0",
      through2: "^4.0.0",
      winston: "^3.3.3"
    },
    dependencies: {
      "fast-redact": "^3.0.0",
      "fast-safe-stringify": "^2.0.7",
      flatstr: "^1.0.12",
      "pino-std-serializers": "^3.1.0",
      "quick-format-unescaped": "^4.0.1",
      "sonic-boom": "^1.0.2"
    }
  };
});

// node_modules/pino/lib/meta.js
var require_meta = __commonJS((exports, module) => {
  "use strict";
  var {version} = require_package();
  module.exports = {version};
});

// node_modules/pino/lib/proto.js
var require_proto = __commonJS((exports, module) => {
  "use strict";
  var {EventEmitter} = require("events");
  var SonicBoom = require_sonic_boom();
  var flatstr = require_flatstr();
  var {
    lsCacheSym,
    levelValSym,
    setLevelSym,
    getLevelSym,
    chindingsSym,
    parsedChindingsSym,
    mixinSym,
    asJsonSym,
    writeSym,
    timeSym,
    timeSliceIndexSym,
    streamSym,
    serializersSym,
    formattersSym,
    useOnlyCustomLevelsSym,
    needsMetadataGsym
  } = require_symbols();
  var {
    getLevel,
    setLevel,
    isLevelEnabled,
    mappings,
    initialLsCache,
    genLsCache,
    assertNoLevelCollisions
  } = require_levels();
  var {
    asChindings,
    asJson,
    buildFormatters
  } = require_tools();
  var {
    version
  } = require_meta();
  var constructor = class Pino {
  };
  var prototype = {
    constructor,
    child,
    bindings,
    setBindings,
    flush,
    isLevelEnabled,
    version,
    get level() {
      return this[getLevelSym]();
    },
    set level(lvl) {
      this[setLevelSym](lvl);
    },
    get levelVal() {
      return this[levelValSym];
    },
    set levelVal(n) {
      throw Error("levelVal is read-only");
    },
    [lsCacheSym]: initialLsCache,
    [writeSym]: write,
    [asJsonSym]: asJson,
    [getLevelSym]: getLevel,
    [setLevelSym]: setLevel
  };
  Object.setPrototypeOf(prototype, EventEmitter.prototype);
  module.exports = function() {
    return Object.create(prototype);
  };
  var resetChildingsFormatter = (bindings2) => bindings2;
  function child(bindings2) {
    if (!bindings2) {
      throw Error("missing bindings for child Pino");
    }
    const serializers = this[serializersSym];
    const formatters = this[formattersSym];
    const instance = Object.create(this);
    if (bindings2.hasOwnProperty("serializers") === true) {
      instance[serializersSym] = Object.create(null);
      for (const k in serializers) {
        instance[serializersSym][k] = serializers[k];
      }
      const parentSymbols = Object.getOwnPropertySymbols(serializers);
      for (var i = 0; i < parentSymbols.length; i++) {
        const ks = parentSymbols[i];
        instance[serializersSym][ks] = serializers[ks];
      }
      for (const bk in bindings2.serializers) {
        instance[serializersSym][bk] = bindings2.serializers[bk];
      }
      const bindingsSymbols = Object.getOwnPropertySymbols(bindings2.serializers);
      for (var bi = 0; bi < bindingsSymbols.length; bi++) {
        const bks = bindingsSymbols[bi];
        instance[serializersSym][bks] = bindings2.serializers[bks];
      }
    } else
      instance[serializersSym] = serializers;
    if (bindings2.hasOwnProperty("formatters")) {
      const {level, bindings: chindings, log} = bindings2.formatters;
      instance[formattersSym] = buildFormatters(level || formatters.level, chindings || resetChildingsFormatter, log || formatters.log);
    } else {
      instance[formattersSym] = buildFormatters(formatters.level, resetChildingsFormatter, formatters.log);
    }
    if (bindings2.hasOwnProperty("customLevels") === true) {
      assertNoLevelCollisions(this.levels, bindings2.customLevels);
      instance.levels = mappings(bindings2.customLevels, instance[useOnlyCustomLevelsSym]);
      genLsCache(instance);
    }
    instance[chindingsSym] = asChindings(instance, bindings2);
    const childLevel = bindings2.level || this.level;
    instance[setLevelSym](childLevel);
    return instance;
  }
  function bindings() {
    const chindings = this[chindingsSym];
    const chindingsJson = `{${chindings.substr(1)}}`;
    const bindingsFromJson = JSON.parse(chindingsJson);
    delete bindingsFromJson.pid;
    delete bindingsFromJson.hostname;
    return bindingsFromJson;
  }
  function setBindings(newBindings) {
    const chindings = asChindings(this, newBindings);
    this[chindingsSym] = chindings;
    delete this[parsedChindingsSym];
  }
  function write(_obj, msg, num) {
    const t = this[timeSym]();
    const mixin = this[mixinSym];
    const objError = _obj instanceof Error;
    let obj;
    if (_obj === void 0 || _obj === null) {
      obj = mixin ? mixin({}) : {};
    } else {
      obj = Object.assign(mixin ? mixin(_obj) : {}, _obj);
      if (!msg && objError) {
        msg = _obj.message;
      }
      if (objError) {
        obj.stack = _obj.stack;
        if (!obj.type) {
          obj.type = "Error";
        }
      }
    }
    const s = this[asJsonSym](obj, msg, num, t);
    const stream = this[streamSym];
    if (stream[needsMetadataGsym] === true) {
      stream.lastLevel = num;
      stream.lastObj = obj;
      stream.lastMsg = msg;
      stream.lastTime = t.slice(this[timeSliceIndexSym]);
      stream.lastLogger = this;
    }
    if (stream instanceof SonicBoom)
      stream.write(s);
    else
      stream.write(flatstr(s));
  }
  function flush() {
    const stream = this[streamSym];
    if ("flush" in stream)
      stream.flush();
  }
});

// node_modules/pino/pino.js
var require_pino = __commonJS((exports, module) => {
  "use strict";
  var os = require("os");
  var stdSerializers = require_pino_std_serializers();
  var redaction = require_redaction();
  var time = require_time();
  var proto = require_proto();
  var symbols = require_symbols();
  var {assertDefaultLevelFound, mappings, genLsCache} = require_levels();
  var {
    createArgsNormalizer,
    asChindings,
    final,
    stringify,
    buildSafeSonicBoom,
    buildFormatters,
    noop
  } = require_tools();
  var {version} = require_meta();
  var {
    chindingsSym,
    redactFmtSym,
    serializersSym,
    timeSym,
    timeSliceIndexSym,
    streamSym,
    stringifySym,
    stringifiersSym,
    setLevelSym,
    endSym,
    formatOptsSym,
    messageKeySym,
    nestedKeySym,
    mixinSym,
    useOnlyCustomLevelsSym,
    formattersSym,
    hooksSym
  } = symbols;
  var {epochTime, nullTime} = time;
  var {pid} = process;
  var hostname = os.hostname();
  var defaultErrorSerializer = stdSerializers.err;
  var defaultOptions = {
    level: "info",
    messageKey: "msg",
    nestedKey: null,
    enabled: true,
    prettyPrint: false,
    base: {pid, hostname},
    serializers: Object.assign(Object.create(null), {
      err: defaultErrorSerializer
    }),
    formatters: Object.assign(Object.create(null), {
      bindings(bindings) {
        return bindings;
      },
      level(label, number) {
        return {level: number};
      }
    }),
    hooks: {
      logMethod: void 0
    },
    timestamp: epochTime,
    name: void 0,
    redact: null,
    customLevels: null,
    levelKey: void 0,
    useOnlyCustomLevels: false
  };
  var normalize2 = createArgsNormalizer(defaultOptions);
  var serializers = Object.assign(Object.create(null), stdSerializers);
  function pino2(...args) {
    const instance = {};
    const {opts, stream} = normalize2(instance, ...args);
    const {
      redact,
      crlf,
      serializers: serializers2,
      timestamp,
      messageKey,
      nestedKey,
      base,
      name,
      level,
      customLevels,
      useLevelLabels,
      changeLevelName,
      levelKey,
      mixin,
      useOnlyCustomLevels,
      formatters,
      hooks
    } = opts;
    const allFormatters = buildFormatters(formatters.level, formatters.bindings, formatters.log);
    if (useLevelLabels && !(changeLevelName || levelKey)) {
      process.emitWarning("useLevelLabels is deprecated, use the formatters.level option instead", "Warning", "PINODEP001");
      allFormatters.level = labelsFormatter;
    } else if ((changeLevelName || levelKey) && !useLevelLabels) {
      process.emitWarning("changeLevelName and levelKey are deprecated, use the formatters.level option instead", "Warning", "PINODEP002");
      allFormatters.level = levelNameFormatter(changeLevelName || levelKey);
    } else if ((changeLevelName || levelKey) && useLevelLabels) {
      process.emitWarning("useLevelLabels is deprecated, use the formatters.level option instead", "Warning", "PINODEP001");
      process.emitWarning("changeLevelName and levelKey are deprecated, use the formatters.level option instead", "Warning", "PINODEP002");
      allFormatters.level = levelNameLabelFormatter(changeLevelName || levelKey);
    }
    if (serializers2[Symbol.for("pino.*")]) {
      process.emitWarning("The pino.* serializer is deprecated, use the formatters.log options instead", "Warning", "PINODEP003");
      allFormatters.log = serializers2[Symbol.for("pino.*")];
    }
    if (!allFormatters.bindings) {
      allFormatters.bindings = defaultOptions.formatters.bindings;
    }
    if (!allFormatters.level) {
      allFormatters.level = defaultOptions.formatters.level;
    }
    const stringifiers = redact ? redaction(redact, stringify) : {};
    const formatOpts = redact ? {stringify: stringifiers[redactFmtSym]} : {stringify};
    const end = "}" + (crlf ? "\r\n" : "\n");
    const coreChindings = asChindings.bind(null, {
      [chindingsSym]: "",
      [serializersSym]: serializers2,
      [stringifiersSym]: stringifiers,
      [stringifySym]: stringify,
      [formattersSym]: allFormatters
    });
    let chindings = "";
    if (base !== null) {
      if (name === void 0) {
        chindings = coreChindings(base);
      } else {
        chindings = coreChindings(Object.assign({}, base, {name}));
      }
    }
    const time2 = timestamp instanceof Function ? timestamp : timestamp ? epochTime : nullTime;
    const timeSliceIndex = time2().indexOf(":") + 1;
    if (useOnlyCustomLevels && !customLevels)
      throw Error("customLevels is required if useOnlyCustomLevels is set true");
    if (mixin && typeof mixin !== "function")
      throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`);
    assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels);
    const levels = mappings(customLevels, useOnlyCustomLevels);
    Object.assign(instance, {
      levels,
      [useOnlyCustomLevelsSym]: useOnlyCustomLevels,
      [streamSym]: stream,
      [timeSym]: time2,
      [timeSliceIndexSym]: timeSliceIndex,
      [stringifySym]: stringify,
      [stringifiersSym]: stringifiers,
      [endSym]: end,
      [formatOptsSym]: formatOpts,
      [messageKeySym]: messageKey,
      [nestedKeySym]: nestedKey,
      [serializersSym]: serializers2,
      [mixinSym]: mixin,
      [chindingsSym]: chindings,
      [formattersSym]: allFormatters,
      [hooksSym]: hooks,
      silent: noop
    });
    Object.setPrototypeOf(instance, proto());
    genLsCache(instance);
    instance[setLevelSym](level);
    return instance;
  }
  function labelsFormatter(label, number) {
    return {level: label};
  }
  function levelNameFormatter(name) {
    return function(label, number) {
      return {[name]: number};
    };
  }
  function levelNameLabelFormatter(name) {
    return function(label, number) {
      return {[name]: label};
    };
  }
  module.exports = pino2;
  module.exports.extreme = (dest = process.stdout.fd) => {
    process.emitWarning("The pino.extreme() option is deprecated and will be removed in v7. Use pino.destination({ sync: false }) instead.", {code: "extreme_deprecation"});
    return buildSafeSonicBoom({dest, minLength: 4096, sync: false});
  };
  module.exports.destination = (dest = process.stdout.fd) => {
    if (typeof dest === "object") {
      dest.dest = dest.dest || process.stdout.fd;
      return buildSafeSonicBoom(dest);
    } else {
      return buildSafeSonicBoom({dest, minLength: 0, sync: true});
    }
  };
  module.exports.final = final;
  module.exports.levels = mappings();
  module.exports.stdSerializers = serializers;
  module.exports.stdTimeFunctions = Object.assign({}, time);
  module.exports.symbols = symbols;
  module.exports.version = version;
  module.exports.default = pino2;
  module.exports.pino = pino2;
});

// node_modules/node-dir/lib/paths.js
var require_paths = __commonJS((exports) => {
  var fs2 = require("fs");
  var path = require("path");
  exports.promiseFiles = function promiseFiles(dir2, type, options) {
    type = type || "file";
    var processor = function(res, rej) {
      var cb = function(err, data) {
        if (err)
          return rej(err);
        res(data);
      };
      exports.files(dir2, type, cb, options);
    };
    return new Promise(processor);
  };
  exports.files = function files(dir2, type, callback, options) {
    var ofType = typeof type;
    if (ofType == "object") {
      options = options || type;
      type = "file";
      callback = function() {
      };
    } else if (ofType !== "string") {
      callback = type;
      type = "file";
    }
    options = options || {};
    var pending, results = {
      files: [],
      dirs: []
    };
    var done = function() {
      if (type === "combine") {
        results = results.files.concat(results.dirs);
      } else if (!type || options.ignoreType || ["all", "combine"].indexOf(type) >= 0) {
        results = results;
      } else {
        results = results[type + "s"];
      }
      if (options.sync)
        return;
      callback(null, results);
    };
    var getStatHandler = function(statPath, name, lstatCalled) {
      return function(err, stat) {
        if (err) {
          if (!lstatCalled) {
            return fs2.lstat(statPath, getStatHandler(statPath, name, true));
          }
          return callback(err);
        }
        var pushVal = options.shortName ? name : statPath;
        if (stat && stat.isDirectory() && stat.mode !== 17115) {
          if (type !== "file") {
            results.dirs.push(pushVal);
          }
          if (options.recursive == null || options.recursive) {
            var subloop = function(err2, res) {
              if (err2) {
                return callback(err2);
              }
              if (type === "combine") {
                results.files = results.files.concat(res);
              } else if (type === "all") {
                results.files = results.files.concat(res.files);
                results.dirs = results.dirs.concat(res.dirs);
              } else if (type === "file") {
                results.files = results.files.concat(res.files);
              } else {
                results.dirs = results.dirs.concat(res.dirs);
              }
              if (!--pending) {
                done();
              }
            };
            var newOptions = Object.assign({}, options);
            newOptions.ignoreType = true;
            var moreResults = files(statPath, type, subloop, newOptions);
            if (options.sync) {
              subloop(null, moreResults);
            }
          } else if (!--pending) {
            done();
          }
        } else {
          if (type !== "dir") {
            results.files.push(pushVal);
          }
          if (!--pending) {
            done();
          }
        }
      };
    };
    var bufdir = Buffer.from(dir2);
    const onDirRead = function(err, list) {
      if (err)
        return callback(err);
      pending = list.length;
      if (!pending)
        return done();
      for (var file, i = 0, l = list.length; i < l; i++) {
        var fname = list[i].toString();
        file = path.join(dir2, fname);
        var buffile = Buffer.concat([bufdir, Buffer.from(path.sep), list[i]]);
        if (options.sync) {
          var res = fs2.statSync(buffile);
          getStatHandler(file, fname)(null, res);
        } else {
          fs2.stat(buffile, getStatHandler(file, fname));
        }
      }
      return results;
    };
    const onStat = function(err, stat) {
      if (err)
        return callback(err);
      if (stat && stat.mode === 17115)
        return done();
      if (options.sync) {
        const list = fs2.readdirSync(bufdir, {encoding: "buffer"});
        return onDirRead(null, list);
      } else {
        fs2.readdir(bufdir, {encoding: "buffer"}, onDirRead);
      }
    };
    if (options.sync) {
      const stat = fs2.statSync(bufdir);
      return onStat(null, stat);
    } else {
      fs2.stat(bufdir, onStat);
    }
  };
  exports.paths = function paths(dir2, combine, callback) {
    var type;
    if (typeof combine === "function") {
      callback = combine;
      combine = false;
    }
    exports.files(dir2, "all", function(err, results) {
      if (err)
        return callback(err);
      if (combine) {
        callback(null, results.files.concat(results.dirs));
      } else {
        callback(null, results);
      }
    });
  };
  exports.subdirs = function subdirs(dir2, callback, type, options) {
    options = options || {};
    const iCallback = function(err, subdirs2) {
      if (err)
        return callback(err);
      if (type == "combine") {
        subdirs2 = subdirs2.files.concat(subdirs2.dirs);
      }
      if (options.sync)
        return subdirs2;
      callback(null, subdirs2);
    };
    const res = exports.files(dir2, "dir", iCallback, options);
    if (options && options.sync) {
      return iCallback(null, res);
    }
  };
});

// node_modules/node-dir/lib/readfiles.js
var require_readfiles = __commonJS((exports, module) => {
  var fs2 = require("fs");
  var path = require("path");
  function extend(target, source, modify) {
    var result = target ? modify ? target : extend({}, target, true) : {};
    if (!source)
      return result;
    for (var key in source) {
      if (source.hasOwnProperty(key) && source[key] !== void 0) {
        result[key] = source[key];
      }
    }
    return result;
  }
  function matches(str, match) {
    if (Array.isArray(match))
      return match.indexOf(str) > -1;
    return match.test(str);
  }
  function readFiles(dir2, options, callback, complete) {
    if (typeof options === "function") {
      complete = callback;
      callback = options;
      options = {};
    }
    if (typeof options === "string")
      options = {
        encoding: options
      };
    options = extend({
      recursive: true,
      encoding: "utf8",
      doneOnErr: true
    }, options);
    var files = [];
    var done = function(err) {
      if (typeof complete === "function") {
        if (err)
          return complete(err);
        complete(null, files);
      }
    };
    fs2.readdir(dir2, function(err, list) {
      if (err) {
        if (options.doneOnErr === true) {
          if (err.code === "EACCES")
            return done();
          return done(err);
        }
      }
      var i = 0;
      if (options.reverse === true || typeof options.sort == "string" && /reverse|desc/i.test(options.sort)) {
        list = list.reverse();
      } else if (options.sort !== false)
        list = list.sort();
      (function next() {
        var filename = list[i++];
        if (!filename)
          return done(null, files);
        var file = path.join(dir2, filename);
        fs2.stat(file, function(err2, stat) {
          if (err2 && options.doneOnErr === true)
            return done(err2);
          if (stat && stat.isDirectory()) {
            if (options.recursive) {
              if (options.matchDir && !matches(filename, options.matchDir))
                return next();
              if (options.excludeDir && matches(filename, options.excludeDir))
                return next();
              readFiles(file, options, callback, function(err3, sfiles) {
                if (err3 && options.doneOnErr === true)
                  return done(err3);
                files = files.concat(sfiles);
                next();
              });
            } else
              next();
          } else if (stat && stat.isFile()) {
            if (options.match && !matches(filename, options.match))
              return next();
            if (options.exclude && matches(filename, options.exclude))
              return next();
            if (options.filter && !options.filter(filename))
              return next();
            if (options.shortName)
              files.push(filename);
            else
              files.push(file);
            fs2.readFile(file, options.encoding, function(err3, data) {
              if (err3) {
                if (err3.code === "EACCES")
                  return next();
                if (options.doneOnErr === true) {
                  return done(err3);
                }
              }
              if (callback.length > 3)
                if (options.shortName)
                  callback(null, data, filename, next);
                else
                  callback(null, data, file, next);
              else
                callback(null, data, next);
            });
          } else {
            next();
          }
        });
      })();
    });
  }
  module.exports = readFiles;
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS((exports, module) => {
  module.exports = function(xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
      var x = fn(xs[i], i);
      if (isArray(x))
        res.push.apply(res, x);
      else
        res.push(x);
    }
    return res;
  };
  var isArray = Array.isArray || function(xs) {
    return Object.prototype.toString.call(xs) === "[object Array]";
  };
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS((exports, module) => {
  "use strict";
  module.exports = balanced;
  function balanced(a, b, str) {
    if (a instanceof RegExp)
      a = maybeMatch(a, str);
    if (b instanceof RegExp)
      b = maybeMatch(b, str);
    var r = range(a, b, str);
    return r && {
      start: r[0],
      end: r[1],
      pre: str.slice(0, r[0]),
      body: str.slice(r[0] + a.length, r[1]),
      post: str.slice(r[1] + b.length)
    };
  }
  function maybeMatch(reg, str) {
    var m = str.match(reg);
    return m ? m[0] : null;
  }
  balanced.range = range;
  function range(a, b, str) {
    var begs, beg, left, right, result;
    var ai = str.indexOf(a);
    var bi = str.indexOf(b, ai + 1);
    var i = ai;
    if (ai >= 0 && bi > 0) {
      begs = [];
      left = str.length;
      while (i >= 0 && !result) {
        if (i == ai) {
          begs.push(i);
          ai = str.indexOf(a, i + 1);
        } else if (begs.length == 1) {
          result = [begs.pop(), bi];
        } else {
          beg = begs.pop();
          if (beg < left) {
            left = beg;
            right = bi;
          }
          bi = str.indexOf(b, i + 1);
        }
        i = ai < bi && ai >= 0 ? ai : bi;
      }
      if (begs.length) {
        result = [left, right];
      }
    }
    return result;
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS((exports, module) => {
  var concatMap = require_concat_map();
  var balanced = require_balanced_match();
  module.exports = expandTop;
  var escSlash = "\0SLASH" + Math.random() + "\0";
  var escOpen = "\0OPEN" + Math.random() + "\0";
  var escClose = "\0CLOSE" + Math.random() + "\0";
  var escComma = "\0COMMA" + Math.random() + "\0";
  var escPeriod = "\0PERIOD" + Math.random() + "\0";
  function numeric(str) {
    return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
  }
  function escapeBraces(str) {
    return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
  }
  function unescapeBraces(str) {
    return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
  }
  function parseCommaParts(str) {
    if (!str)
      return [""];
    var parts = [];
    var m = balanced("{", "}", str);
    if (!m)
      return str.split(",");
    var pre = m.pre;
    var body = m.body;
    var post = m.post;
    var p = pre.split(",");
    p[p.length - 1] += "{" + body + "}";
    var postParts = parseCommaParts(post);
    if (post.length) {
      p[p.length - 1] += postParts.shift();
      p.push.apply(p, postParts);
    }
    parts.push.apply(parts, p);
    return parts;
  }
  function expandTop(str) {
    if (!str)
      return [];
    if (str.substr(0, 2) === "{}") {
      str = "\\{\\}" + str.substr(2);
    }
    return expand(escapeBraces(str), true).map(unescapeBraces);
  }
  function embrace(str) {
    return "{" + str + "}";
  }
  function isPadded(el) {
    return /^-?0\d/.test(el);
  }
  function lte(i, y) {
    return i <= y;
  }
  function gte(i, y) {
    return i >= y;
  }
  function expand(str, isTop) {
    var expansions = [];
    var m = balanced("{", "}", str);
    if (!m || /\$$/.test(m.pre))
      return [str];
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions) {
      if (m.post.match(/,.*\}/)) {
        str = m.pre + "{" + m.body + escClose + m.post;
        return expand(str);
      }
      return [str];
    }
    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        n = expand(n[0], false).map(embrace);
        if (n.length === 1) {
          var post = m.post.length ? expand(m.post, false) : [""];
          return post.map(function(p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }
    var pre = m.pre;
    var post = m.post.length ? expand(m.post, false) : [""];
    var N;
    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length);
      var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);
      N = [];
      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === "\\")
            c = "";
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join("0");
              if (i < 0)
                c = "-" + z + c.slice(1);
              else
                c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = concatMap(n, function(el) {
        return expand(el, false);
      });
    }
    for (var j = 0; j < N.length; j++) {
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion)
          expansions.push(expansion);
      }
    }
    return expansions;
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS((exports, module) => {
  module.exports = minimatch;
  minimatch.Minimatch = Minimatch;
  var path = {sep: "/"};
  try {
    path = require("path");
  } catch (er) {
  }
  var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
  var expand = require_brace_expansion();
  var plTypes = {
    "!": {open: "(?:(?!(?:", close: "))[^/]*?)"},
    "?": {open: "(?:", close: ")?"},
    "+": {open: "(?:", close: ")+"},
    "*": {open: "(?:", close: ")*"},
    "@": {open: "(?:", close: ")"}
  };
  var qmark = "[^/]";
  var star = qmark + "*?";
  var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
  var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
  var reSpecials = charSet("().*{}+?[]^$\\!");
  function charSet(s) {
    return s.split("").reduce(function(set, c) {
      set[c] = true;
      return set;
    }, {});
  }
  var slashSplit = /\/+/;
  minimatch.filter = filter;
  function filter(pattern, options) {
    options = options || {};
    return function(p, i, list) {
      return minimatch(p, pattern, options);
    };
  }
  function ext(a, b) {
    a = a || {};
    b = b || {};
    var t = {};
    Object.keys(b).forEach(function(k) {
      t[k] = b[k];
    });
    Object.keys(a).forEach(function(k) {
      t[k] = a[k];
    });
    return t;
  }
  minimatch.defaults = function(def) {
    if (!def || !Object.keys(def).length)
      return minimatch;
    var orig = minimatch;
    var m = function minimatch2(p, pattern, options) {
      return orig.minimatch(p, pattern, ext(def, options));
    };
    m.Minimatch = function Minimatch2(pattern, options) {
      return new orig.Minimatch(pattern, ext(def, options));
    };
    return m;
  };
  Minimatch.defaults = function(def) {
    if (!def || !Object.keys(def).length)
      return Minimatch;
    return minimatch.defaults(def).Minimatch;
  };
  function minimatch(p, pattern, options) {
    if (typeof pattern !== "string") {
      throw new TypeError("glob pattern string required");
    }
    if (!options)
      options = {};
    if (!options.nocomment && pattern.charAt(0) === "#") {
      return false;
    }
    if (pattern.trim() === "")
      return p === "";
    return new Minimatch(pattern, options).match(p);
  }
  function Minimatch(pattern, options) {
    if (!(this instanceof Minimatch)) {
      return new Minimatch(pattern, options);
    }
    if (typeof pattern !== "string") {
      throw new TypeError("glob pattern string required");
    }
    if (!options)
      options = {};
    pattern = pattern.trim();
    if (path.sep !== "/") {
      pattern = pattern.split(path.sep).join("/");
    }
    this.options = options;
    this.set = [];
    this.pattern = pattern;
    this.regexp = null;
    this.negate = false;
    this.comment = false;
    this.empty = false;
    this.make();
  }
  Minimatch.prototype.debug = function() {
  };
  Minimatch.prototype.make = make;
  function make() {
    if (this._made)
      return;
    var pattern = this.pattern;
    var options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    var set = this.globSet = this.braceExpand();
    if (options.debug)
      this.debug = console.error;
    this.debug(this.pattern, set);
    set = this.globParts = set.map(function(s) {
      return s.split(slashSplit);
    });
    this.debug(this.pattern, set);
    set = set.map(function(s, si, set2) {
      return s.map(this.parse, this);
    }, this);
    this.debug(this.pattern, set);
    set = set.filter(function(s) {
      return s.indexOf(false) === -1;
    });
    this.debug(this.pattern, set);
    this.set = set;
  }
  Minimatch.prototype.parseNegate = parseNegate;
  function parseNegate() {
    var pattern = this.pattern;
    var negate = false;
    var options = this.options;
    var negateOffset = 0;
    if (options.nonegate)
      return;
    for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset)
      this.pattern = pattern.substr(negateOffset);
    this.negate = negate;
  }
  minimatch.braceExpand = function(pattern, options) {
    return braceExpand(pattern, options);
  };
  Minimatch.prototype.braceExpand = braceExpand;
  function braceExpand(pattern, options) {
    if (!options) {
      if (this instanceof Minimatch) {
        options = this.options;
      } else {
        options = {};
      }
    }
    pattern = typeof pattern === "undefined" ? this.pattern : pattern;
    if (typeof pattern === "undefined") {
      throw new TypeError("undefined pattern");
    }
    if (options.nobrace || !pattern.match(/\{.*\}/)) {
      return [pattern];
    }
    return expand(pattern);
  }
  Minimatch.prototype.parse = parse2;
  var SUBPARSE = {};
  function parse2(pattern, isSub) {
    if (pattern.length > 1024 * 64) {
      throw new TypeError("pattern is too long");
    }
    var options = this.options;
    if (!options.noglobstar && pattern === "**")
      return GLOBSTAR;
    if (pattern === "")
      return "";
    var re = "";
    var hasMagic = !!options.nocase;
    var escaping = false;
    var patternListStack = [];
    var negativeLists = [];
    var stateChar;
    var inClass = false;
    var reClassStart = -1;
    var classStart = -1;
    var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
    var self = this;
    function clearStateChar() {
      if (stateChar) {
        switch (stateChar) {
          case "*":
            re += star;
            hasMagic = true;
            break;
          case "?":
            re += qmark;
            hasMagic = true;
            break;
          default:
            re += "\\" + stateChar;
            break;
        }
        self.debug("clearStateChar %j %j", stateChar, re);
        stateChar = false;
      }
    }
    for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
      this.debug("%s	%s %s %j", pattern, i, re, c);
      if (escaping && reSpecials[c]) {
        re += "\\" + c;
        escaping = false;
        continue;
      }
      switch (c) {
        case "/":
          return false;
        case "\\":
          clearStateChar();
          escaping = true;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
          if (inClass) {
            this.debug("  in class");
            if (c === "!" && i === classStart + 1)
              c = "^";
            re += c;
            continue;
          }
          self.debug("call clearStateChar %j", stateChar);
          clearStateChar();
          stateChar = c;
          if (options.noext)
            clearStateChar();
          continue;
        case "(":
          if (inClass) {
            re += "(";
            continue;
          }
          if (!stateChar) {
            re += "\\(";
            continue;
          }
          patternListStack.push({
            type: stateChar,
            start: i - 1,
            reStart: re.length,
            open: plTypes[stateChar].open,
            close: plTypes[stateChar].close
          });
          re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
          this.debug("plType %j %j", stateChar, re);
          stateChar = false;
          continue;
        case ")":
          if (inClass || !patternListStack.length) {
            re += "\\)";
            continue;
          }
          clearStateChar();
          hasMagic = true;
          var pl = patternListStack.pop();
          re += pl.close;
          if (pl.type === "!") {
            negativeLists.push(pl);
          }
          pl.reEnd = re.length;
          continue;
        case "|":
          if (inClass || !patternListStack.length || escaping) {
            re += "\\|";
            escaping = false;
            continue;
          }
          clearStateChar();
          re += "|";
          continue;
        case "[":
          clearStateChar();
          if (inClass) {
            re += "\\" + c;
            continue;
          }
          inClass = true;
          classStart = i;
          reClassStart = re.length;
          re += c;
          continue;
        case "]":
          if (i === classStart + 1 || !inClass) {
            re += "\\" + c;
            escaping = false;
            continue;
          }
          if (inClass) {
            var cs = pattern.substring(classStart + 1, i);
            try {
              RegExp("[" + cs + "]");
            } catch (er) {
              var sp = this.parse(cs, SUBPARSE);
              re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
              hasMagic = hasMagic || sp[1];
              inClass = false;
              continue;
            }
          }
          hasMagic = true;
          inClass = false;
          re += c;
          continue;
        default:
          clearStateChar();
          if (escaping) {
            escaping = false;
          } else if (reSpecials[c] && !(c === "^" && inClass)) {
            re += "\\";
          }
          re += c;
      }
    }
    if (inClass) {
      cs = pattern.substr(classStart + 1);
      sp = this.parse(cs, SUBPARSE);
      re = re.substr(0, reClassStart) + "\\[" + sp[0];
      hasMagic = hasMagic || sp[1];
    }
    for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
      var tail = re.slice(pl.reStart + pl.open.length);
      this.debug("setting tail", re, pl);
      tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
        if (!$2) {
          $2 = "\\";
        }
        return $1 + $1 + $2 + "|";
      });
      this.debug("tail=%j\n   %s", tail, tail, pl, re);
      var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
      hasMagic = true;
      re = re.slice(0, pl.reStart) + t + "\\(" + tail;
    }
    clearStateChar();
    if (escaping) {
      re += "\\\\";
    }
    var addPatternStart = false;
    switch (re.charAt(0)) {
      case ".":
      case "[":
      case "(":
        addPatternStart = true;
    }
    for (var n = negativeLists.length - 1; n > -1; n--) {
      var nl = negativeLists[n];
      var nlBefore = re.slice(0, nl.reStart);
      var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
      var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
      var nlAfter = re.slice(nl.reEnd);
      nlLast += nlAfter;
      var openParensBefore = nlBefore.split("(").length - 1;
      var cleanAfter = nlAfter;
      for (i = 0; i < openParensBefore; i++) {
        cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
      }
      nlAfter = cleanAfter;
      var dollar = "";
      if (nlAfter === "" && isSub !== SUBPARSE) {
        dollar = "$";
      }
      var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
      re = newRe;
    }
    if (re !== "" && hasMagic) {
      re = "(?=.)" + re;
    }
    if (addPatternStart) {
      re = patternStart + re;
    }
    if (isSub === SUBPARSE) {
      return [re, hasMagic];
    }
    if (!hasMagic) {
      return globUnescape(pattern);
    }
    var flags = options.nocase ? "i" : "";
    try {
      var regExp = new RegExp("^" + re + "$", flags);
    } catch (er) {
      return new RegExp("$.");
    }
    regExp._glob = pattern;
    regExp._src = re;
    return regExp;
  }
  minimatch.makeRe = function(pattern, options) {
    return new Minimatch(pattern, options || {}).makeRe();
  };
  Minimatch.prototype.makeRe = makeRe;
  function makeRe() {
    if (this.regexp || this.regexp === false)
      return this.regexp;
    var set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    var options = this.options;
    var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
    var flags = options.nocase ? "i" : "";
    var re = set.map(function(pattern) {
      return pattern.map(function(p) {
        return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
      }).join("\\/");
    }).join("|");
    re = "^(?:" + re + ")$";
    if (this.negate)
      re = "^(?!" + re + ").*$";
    try {
      this.regexp = new RegExp(re, flags);
    } catch (ex) {
      this.regexp = false;
    }
    return this.regexp;
  }
  minimatch.match = function(list, pattern, options) {
    options = options || {};
    var mm = new Minimatch(pattern, options);
    list = list.filter(function(f) {
      return mm.match(f);
    });
    if (mm.options.nonull && !list.length) {
      list.push(pattern);
    }
    return list;
  };
  Minimatch.prototype.match = match;
  function match(f, partial) {
    this.debug("match", f, this.pattern);
    if (this.comment)
      return false;
    if (this.empty)
      return f === "";
    if (f === "/" && partial)
      return true;
    var options = this.options;
    if (path.sep !== "/") {
      f = f.split(path.sep).join("/");
    }
    f = f.split(slashSplit);
    this.debug(this.pattern, "split", f);
    var set = this.set;
    this.debug(this.pattern, "set", set);
    var filename;
    var i;
    for (i = f.length - 1; i >= 0; i--) {
      filename = f[i];
      if (filename)
        break;
    }
    for (i = 0; i < set.length; i++) {
      var pattern = set[i];
      var file = f;
      if (options.matchBase && pattern.length === 1) {
        file = [filename];
      }
      var hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate)
          return true;
        return !this.negate;
      }
    }
    if (options.flipNegate)
      return false;
    return this.negate;
  }
  Minimatch.prototype.matchOne = function(file, pattern, partial) {
    var options = this.options;
    this.debug("matchOne", {this: this, file, pattern});
    this.debug("matchOne", file.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      var p = pattern[pi];
      var f = file[fi];
      this.debug(pattern, p, f);
      if (p === false)
        return false;
      if (p === GLOBSTAR) {
        this.debug("GLOBSTAR", [pattern, p, f]);
        var fr = fi;
        var pr = pi + 1;
        if (pr === pl) {
          this.debug("** at the end");
          for (; fi < fl; fi++) {
            if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
              return false;
          }
          return true;
        }
        while (fr < fl) {
          var swallowee = file[fr];
          this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
          if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
            this.debug("globstar found match!", fr, fl, swallowee);
            return true;
          } else {
            if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
              this.debug("dot detected!", file, fr, pattern, pr);
              break;
            }
            this.debug("globstar swallow a segment, and continue");
            fr++;
          }
        }
        if (partial) {
          this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
          if (fr === fl)
            return true;
        }
        return false;
      }
      var hit;
      if (typeof p === "string") {
        if (options.nocase) {
          hit = f.toLowerCase() === p.toLowerCase();
        } else {
          hit = f === p;
        }
        this.debug("string match", p, f, hit);
      } else {
        hit = f.match(p);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit)
        return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      var emptyFileEnd = fi === fl - 1 && file[fi] === "";
      return emptyFileEnd;
    }
    throw new Error("wtf?");
  };
  function globUnescape(s) {
    return s.replace(/\\(.)/g, "$1");
  }
  function regExpEscape(s) {
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
});

// node_modules/node-dir/lib/readfilesstream.js
var require_readfilesstream = __commonJS((exports, module) => {
  var fs2 = require("fs");
  var mm = require_minimatch();
  var path = require("path");
  function extend(target, source, modify) {
    var result = target ? modify ? target : extend({}, target, true) : {};
    if (!source)
      return result;
    for (var key in source) {
      if (source.hasOwnProperty(key) && source[key] !== void 0) {
        result[key] = source[key];
      }
    }
    return result;
  }
  function matches(str, match) {
    if (Array.isArray(match)) {
      var l = match.length;
      for (var s = 0; s < l; s++) {
        if (mm(str, match[s])) {
          return true;
        }
      }
      return false;
    }
    return match.test(str);
  }
  function readFilesStream(dir2, options, callback, complete) {
    if (typeof options === "function") {
      complete = callback;
      callback = options;
      options = {};
    }
    if (typeof options === "string")
      options = {
        encoding: options
      };
    options = extend({
      recursive: true,
      encoding: "utf8",
      doneOnErr: true
    }, options);
    var files = [];
    var done = function(err) {
      if (typeof complete === "function") {
        if (err)
          return complete(err);
        complete(null, files);
      }
    };
    fs2.readdir(dir2, function(err, list) {
      if (err) {
        if (options.doneOnErr === true) {
          if (err.code === "EACCES")
            return done();
          return done(err);
        }
      }
      var i = 0;
      if (options.reverse === true || typeof options.sort == "string" && /reverse|desc/i.test(options.sort)) {
        list = list.reverse();
      } else if (options.sort !== false)
        list = list.sort();
      (function next() {
        var filename = list[i++];
        if (!filename)
          return done(null, files);
        var file = path.join(dir2, filename);
        fs2.stat(file, function(err2, stat) {
          if (err2 && options.doneOnErr === true)
            return done(err2);
          if (stat && stat.isDirectory()) {
            if (options.recursive) {
              if (options.matchDir && !matches(filename, options.matchDir))
                return next();
              if (options.excludeDir && matches(filename, options.excludeDir))
                return next();
              readFilesStream(file, options, callback, function(err3, sfiles) {
                if (err3 && options.doneOnErr === true)
                  return done(err3);
                files = files.concat(sfiles);
                next();
              });
            } else
              next();
          } else if (stat && stat.isFile()) {
            if (options.match && !matches(filename, options.match))
              return next();
            if (options.exclude && matches(filename, options.exclude))
              return next();
            if (options.filter && !options.filter(filename))
              return next();
            if (options.shortName)
              files.push(filename);
            else
              files.push(file);
            var stream = fs2.createReadStream(file);
            if (options.encoding !== null) {
              stream.setEncoding(options.encoding);
            }
            stream.on("error", function(err3) {
              if (options.doneOnErr === true)
                return done(err3);
              next();
            });
            if (callback.length > 3)
              if (options.shortName)
                callback(null, stream, filename, next);
              else
                callback(null, stream, file, next);
            else
              callback(null, stream, next);
          } else {
            next();
          }
        });
      })();
    });
  }
  module.exports = readFilesStream;
});

// node_modules/node-dir/index.js
var require_node_dir = __commonJS((exports) => {
  var dirpaths = require_paths();
  Object.assign(exports, dirpaths);
  exports.readFiles = require_readfiles();
  exports.readFilesStream = require_readfilesstream();
});

// node_modules/redis/lib/utils.js
var require_utils = __commonJS((exports, module) => {
  "use strict";
  function replyToObject(reply) {
    if (reply.length === 0 || !(reply instanceof Array)) {
      return null;
    }
    var obj = {};
    for (var i = 0; i < reply.length; i += 2) {
      obj[reply[i].toString("binary")] = reply[i + 1];
    }
    return obj;
  }
  function replyToStrings(reply) {
    if (reply instanceof Buffer) {
      return reply.toString();
    }
    if (reply instanceof Array) {
      var res = new Array(reply.length);
      for (var i = 0; i < reply.length; i++) {
        res[i] = replyToStrings(reply[i]);
      }
      return res;
    }
    return reply;
  }
  function print2(err, reply) {
    if (err) {
      console.log(err.toString());
    } else {
      console.log("Reply: " + reply);
    }
  }
  var camelCase;
  function clone2(obj) {
    var copy;
    if (Array.isArray(obj)) {
      copy = new Array(obj.length);
      for (var i = 0; i < obj.length; i++) {
        copy[i] = clone2(obj[i]);
      }
      return copy;
    }
    if (Object.prototype.toString.call(obj) === "[object Object]") {
      copy = {};
      var elems = Object.keys(obj);
      var elem;
      while (elem = elems.pop()) {
        if (elem === "tls") {
          copy[elem] = obj[elem];
          continue;
        }
        var snake_case = elem.replace(/[A-Z][^A-Z]/g, "_$&").toLowerCase();
        if (snake_case !== elem.toLowerCase()) {
          camelCase = true;
        }
        copy[snake_case] = clone2(obj[elem]);
      }
      return copy;
    }
    return obj;
  }
  function convenienceClone(obj) {
    camelCase = false;
    obj = clone2(obj) || {};
    if (camelCase) {
      obj.camel_case = true;
    }
    return obj;
  }
  function callbackOrEmit(self, callback, err, res) {
    if (callback) {
      callback(err, res);
    } else if (err) {
      self.emit("error", err);
    }
  }
  function replyInOrder(self, callback, err, res, queue) {
    var command_obj;
    if (queue) {
      command_obj = queue.peekBack();
    } else {
      command_obj = self.offline_queue.peekBack() || self.command_queue.peekBack();
    }
    if (!command_obj) {
      process.nextTick(function() {
        callbackOrEmit(self, callback, err, res);
      });
    } else {
      var tmp = command_obj.callback;
      command_obj.callback = tmp ? function(e, r) {
        tmp(e, r);
        callbackOrEmit(self, callback, err, res);
      } : function(e, r) {
        if (e) {
          self.emit("error", e);
        }
        callbackOrEmit(self, callback, err, res);
      };
    }
  }
  module.exports = {
    reply_to_strings: replyToStrings,
    reply_to_object: replyToObject,
    print: print2,
    err_code: /^([A-Z]+)\s+(.+)$/,
    monitor_regex: /^[0-9]{10,11}\.[0-9]+ \[[0-9]+ .+\]( ".+?")+$/,
    clone: convenienceClone,
    callback_or_emit: callbackOrEmit,
    reply_in_order: replyInOrder
  };
});

// node_modules/redis/lib/command.js
var require_command = __commonJS((exports, module) => {
  "use strict";
  var betterStackTraces = /development/i.test(process.env.NODE_ENV) || /\bredis\b/i.test(process.env.NODE_DEBUG);
  function Command(command, args, callback, call_on_write) {
    this.command = command;
    this.args = args;
    this.buffer_args = false;
    this.callback = callback;
    this.call_on_write = call_on_write;
    if (betterStackTraces) {
      this.error = new Error();
    }
  }
  module.exports = Command;
});

// node_modules/denque/index.js
var require_denque = __commonJS((exports, module) => {
  "use strict";
  function Denque(array, options) {
    var options = options || {};
    this._head = 0;
    this._tail = 0;
    this._capacity = options.capacity;
    this._capacityMask = 3;
    this._list = new Array(4);
    if (Array.isArray(array)) {
      this._fromArray(array);
    }
  }
  Denque.prototype.peekAt = function peekAt(index) {
    var i = index;
    if (i !== (i | 0)) {
      return void 0;
    }
    var len = this.size();
    if (i >= len || i < -len)
      return void 0;
    if (i < 0)
      i += len;
    i = this._head + i & this._capacityMask;
    return this._list[i];
  };
  Denque.prototype.get = function get(i) {
    return this.peekAt(i);
  };
  Denque.prototype.peek = function peek() {
    if (this._head === this._tail)
      return void 0;
    return this._list[this._head];
  };
  Denque.prototype.peekFront = function peekFront() {
    return this.peek();
  };
  Denque.prototype.peekBack = function peekBack() {
    return this.peekAt(-1);
  };
  Object.defineProperty(Denque.prototype, "length", {
    get: function length() {
      return this.size();
    }
  });
  Denque.prototype.size = function size() {
    if (this._head === this._tail)
      return 0;
    if (this._head < this._tail)
      return this._tail - this._head;
    else
      return this._capacityMask + 1 - (this._head - this._tail);
  };
  Denque.prototype.unshift = function unshift(item) {
    if (item === void 0)
      return this.size();
    var len = this._list.length;
    this._head = this._head - 1 + len & this._capacityMask;
    this._list[this._head] = item;
    if (this._tail === this._head)
      this._growArray();
    if (this._capacity && this.size() > this._capacity)
      this.pop();
    if (this._head < this._tail)
      return this._tail - this._head;
    else
      return this._capacityMask + 1 - (this._head - this._tail);
  };
  Denque.prototype.shift = function shift() {
    var head = this._head;
    if (head === this._tail)
      return void 0;
    var item = this._list[head];
    this._list[head] = void 0;
    this._head = head + 1 & this._capacityMask;
    if (head < 2 && this._tail > 1e4 && this._tail <= this._list.length >>> 2)
      this._shrinkArray();
    return item;
  };
  Denque.prototype.push = function push(item) {
    if (item === void 0)
      return this.size();
    var tail = this._tail;
    this._list[tail] = item;
    this._tail = tail + 1 & this._capacityMask;
    if (this._tail === this._head) {
      this._growArray();
    }
    if (this._capacity && this.size() > this._capacity) {
      this.shift();
    }
    if (this._head < this._tail)
      return this._tail - this._head;
    else
      return this._capacityMask + 1 - (this._head - this._tail);
  };
  Denque.prototype.pop = function pop() {
    var tail = this._tail;
    if (tail === this._head)
      return void 0;
    var len = this._list.length;
    this._tail = tail - 1 + len & this._capacityMask;
    var item = this._list[this._tail];
    this._list[this._tail] = void 0;
    if (this._head < 2 && tail > 1e4 && tail <= len >>> 2)
      this._shrinkArray();
    return item;
  };
  Denque.prototype.removeOne = function removeOne(index) {
    var i = index;
    if (i !== (i | 0)) {
      return void 0;
    }
    if (this._head === this._tail)
      return void 0;
    var size = this.size();
    var len = this._list.length;
    if (i >= size || i < -size)
      return void 0;
    if (i < 0)
      i += size;
    i = this._head + i & this._capacityMask;
    var item = this._list[i];
    var k;
    if (index < size / 2) {
      for (k = index; k > 0; k--) {
        this._list[i] = this._list[i = i - 1 + len & this._capacityMask];
      }
      this._list[i] = void 0;
      this._head = this._head + 1 + len & this._capacityMask;
    } else {
      for (k = size - 1 - index; k > 0; k--) {
        this._list[i] = this._list[i = i + 1 + len & this._capacityMask];
      }
      this._list[i] = void 0;
      this._tail = this._tail - 1 + len & this._capacityMask;
    }
    return item;
  };
  Denque.prototype.remove = function remove(index, count) {
    var i = index;
    var removed;
    var del_count = count;
    if (i !== (i | 0)) {
      return void 0;
    }
    if (this._head === this._tail)
      return void 0;
    var size = this.size();
    var len = this._list.length;
    if (i >= size || i < -size || count < 1)
      return void 0;
    if (i < 0)
      i += size;
    if (count === 1 || !count) {
      removed = new Array(1);
      removed[0] = this.removeOne(i);
      return removed;
    }
    if (i === 0 && i + count >= size) {
      removed = this.toArray();
      this.clear();
      return removed;
    }
    if (i + count > size)
      count = size - i;
    var k;
    removed = new Array(count);
    for (k = 0; k < count; k++) {
      removed[k] = this._list[this._head + i + k & this._capacityMask];
    }
    i = this._head + i & this._capacityMask;
    if (index + count === size) {
      this._tail = this._tail - count + len & this._capacityMask;
      for (k = count; k > 0; k--) {
        this._list[i = i + 1 + len & this._capacityMask] = void 0;
      }
      return removed;
    }
    if (index === 0) {
      this._head = this._head + count + len & this._capacityMask;
      for (k = count - 1; k > 0; k--) {
        this._list[i = i + 1 + len & this._capacityMask] = void 0;
      }
      return removed;
    }
    if (i < size / 2) {
      this._head = this._head + index + count + len & this._capacityMask;
      for (k = index; k > 0; k--) {
        this.unshift(this._list[i = i - 1 + len & this._capacityMask]);
      }
      i = this._head - 1 + len & this._capacityMask;
      while (del_count > 0) {
        this._list[i = i - 1 + len & this._capacityMask] = void 0;
        del_count--;
      }
      if (index < 0)
        this._tail = i;
    } else {
      this._tail = i;
      i = i + count + len & this._capacityMask;
      for (k = size - (count + index); k > 0; k--) {
        this.push(this._list[i++]);
      }
      i = this._tail;
      while (del_count > 0) {
        this._list[i = i + 1 + len & this._capacityMask] = void 0;
        del_count--;
      }
    }
    if (this._head < 2 && this._tail > 1e4 && this._tail <= len >>> 2)
      this._shrinkArray();
    return removed;
  };
  Denque.prototype.splice = function splice(index, count) {
    var i = index;
    if (i !== (i | 0)) {
      return void 0;
    }
    var size = this.size();
    if (i < 0)
      i += size;
    if (i > size)
      return void 0;
    if (arguments.length > 2) {
      var k;
      var temp;
      var removed;
      var arg_len = arguments.length;
      var len = this._list.length;
      var arguments_index = 2;
      if (!size || i < size / 2) {
        temp = new Array(i);
        for (k = 0; k < i; k++) {
          temp[k] = this._list[this._head + k & this._capacityMask];
        }
        if (count === 0) {
          removed = [];
          if (i > 0) {
            this._head = this._head + i + len & this._capacityMask;
          }
        } else {
          removed = this.remove(i, count);
          this._head = this._head + i + len & this._capacityMask;
        }
        while (arg_len > arguments_index) {
          this.unshift(arguments[--arg_len]);
        }
        for (k = i; k > 0; k--) {
          this.unshift(temp[k - 1]);
        }
      } else {
        temp = new Array(size - (i + count));
        var leng = temp.length;
        for (k = 0; k < leng; k++) {
          temp[k] = this._list[this._head + i + count + k & this._capacityMask];
        }
        if (count === 0) {
          removed = [];
          if (i != size) {
            this._tail = this._head + i + len & this._capacityMask;
          }
        } else {
          removed = this.remove(i, count);
          this._tail = this._tail - leng + len & this._capacityMask;
        }
        while (arguments_index < arg_len) {
          this.push(arguments[arguments_index++]);
        }
        for (k = 0; k < leng; k++) {
          this.push(temp[k]);
        }
      }
      return removed;
    } else {
      return this.remove(i, count);
    }
  };
  Denque.prototype.clear = function clear() {
    this._head = 0;
    this._tail = 0;
  };
  Denque.prototype.isEmpty = function isEmpty() {
    return this._head === this._tail;
  };
  Denque.prototype.toArray = function toArray() {
    return this._copyArray(false);
  };
  Denque.prototype._fromArray = function _fromArray(array) {
    for (var i = 0; i < array.length; i++)
      this.push(array[i]);
  };
  Denque.prototype._copyArray = function _copyArray(fullCopy) {
    var newArray = [];
    var list = this._list;
    var len = list.length;
    var i;
    if (fullCopy || this._head > this._tail) {
      for (i = this._head; i < len; i++)
        newArray.push(list[i]);
      for (i = 0; i < this._tail; i++)
        newArray.push(list[i]);
    } else {
      for (i = this._head; i < this._tail; i++)
        newArray.push(list[i]);
    }
    return newArray;
  };
  Denque.prototype._growArray = function _growArray() {
    if (this._head) {
      this._list = this._copyArray(true);
      this._head = 0;
    }
    this._tail = this._list.length;
    this._list.length *= 2;
    this._capacityMask = this._capacityMask << 1 | 1;
  };
  Denque.prototype._shrinkArray = function _shrinkArray() {
    this._list.length >>>= 1;
    this._capacityMask >>>= 1;
  };
  module.exports = Denque;
});

// node_modules/redis-errors/lib/old.js
var require_old = __commonJS((exports, module) => {
  "use strict";
  var assert = require("assert");
  var util = require("util");
  function RedisError(message) {
    Object.defineProperty(this, "message", {
      value: message || "",
      configurable: true,
      writable: true
    });
    Error.captureStackTrace(this, this.constructor);
  }
  util.inherits(RedisError, Error);
  Object.defineProperty(RedisError.prototype, "name", {
    value: "RedisError",
    configurable: true,
    writable: true
  });
  function ParserError(message, buffer, offset) {
    assert(buffer);
    assert.strictEqual(typeof offset, "number");
    Object.defineProperty(this, "message", {
      value: message || "",
      configurable: true,
      writable: true
    });
    const tmp = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    Error.captureStackTrace(this, this.constructor);
    Error.stackTraceLimit = tmp;
    this.offset = offset;
    this.buffer = buffer;
  }
  util.inherits(ParserError, RedisError);
  Object.defineProperty(ParserError.prototype, "name", {
    value: "ParserError",
    configurable: true,
    writable: true
  });
  function ReplyError(message) {
    Object.defineProperty(this, "message", {
      value: message || "",
      configurable: true,
      writable: true
    });
    const tmp = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    Error.captureStackTrace(this, this.constructor);
    Error.stackTraceLimit = tmp;
  }
  util.inherits(ReplyError, RedisError);
  Object.defineProperty(ReplyError.prototype, "name", {
    value: "ReplyError",
    configurable: true,
    writable: true
  });
  function AbortError2(message) {
    Object.defineProperty(this, "message", {
      value: message || "",
      configurable: true,
      writable: true
    });
    Error.captureStackTrace(this, this.constructor);
  }
  util.inherits(AbortError2, RedisError);
  Object.defineProperty(AbortError2.prototype, "name", {
    value: "AbortError",
    configurable: true,
    writable: true
  });
  function InterruptError(message) {
    Object.defineProperty(this, "message", {
      value: message || "",
      configurable: true,
      writable: true
    });
    Error.captureStackTrace(this, this.constructor);
  }
  util.inherits(InterruptError, AbortError2);
  Object.defineProperty(InterruptError.prototype, "name", {
    value: "InterruptError",
    configurable: true,
    writable: true
  });
  module.exports = {
    RedisError,
    ParserError,
    ReplyError,
    AbortError: AbortError2,
    InterruptError
  };
});

// node_modules/redis-errors/lib/modern.js
var require_modern = __commonJS((exports, module) => {
  "use strict";
  var assert = require("assert");
  var RedisError = class extends Error {
    get name() {
      return this.constructor.name;
    }
  };
  var ParserError = class extends RedisError {
    constructor(message, buffer, offset) {
      assert(buffer);
      assert.strictEqual(typeof offset, "number");
      const tmp = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      super(message);
      Error.stackTraceLimit = tmp;
      this.offset = offset;
      this.buffer = buffer;
    }
    get name() {
      return this.constructor.name;
    }
  };
  var ReplyError = class extends RedisError {
    constructor(message) {
      const tmp = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      super(message);
      Error.stackTraceLimit = tmp;
    }
    get name() {
      return this.constructor.name;
    }
  };
  var AbortError2 = class extends RedisError {
    get name() {
      return this.constructor.name;
    }
  };
  var InterruptError = class extends AbortError2 {
    get name() {
      return this.constructor.name;
    }
  };
  module.exports = {
    RedisError,
    ParserError,
    ReplyError,
    AbortError: AbortError2,
    InterruptError
  };
});

// node_modules/redis-errors/index.js
var require_redis_errors = __commonJS((exports, module) => {
  "use strict";
  var Errors = process.version.charCodeAt(1) < 55 && process.version.charCodeAt(2) === 46 ? require_old() : require_modern();
  module.exports = Errors;
});

// node_modules/redis/lib/customErrors.js
var require_customErrors = __commonJS((exports, module) => {
  "use strict";
  var util = require("util");
  var assert = require("assert");
  var RedisError = require_redis_errors().RedisError;
  var ADD_STACKTRACE = false;
  function AbortError2(obj, stack) {
    assert(obj, "The options argument is required");
    assert.strictEqual(typeof obj, "object", "The options argument has to be of type object");
    Object.defineProperty(this, "message", {
      value: obj.message || "",
      configurable: true,
      writable: true
    });
    if (stack || stack === void 0) {
      Error.captureStackTrace(this, AbortError2);
    }
    for (var keys = Object.keys(obj), key = keys.pop(); key; key = keys.pop()) {
      this[key] = obj[key];
    }
  }
  function AggregateError(obj) {
    assert(obj, "The options argument is required");
    assert.strictEqual(typeof obj, "object", "The options argument has to be of type object");
    AbortError2.call(this, obj, ADD_STACKTRACE);
    Object.defineProperty(this, "message", {
      value: obj.message || "",
      configurable: true,
      writable: true
    });
    Error.captureStackTrace(this, AggregateError);
    for (var keys = Object.keys(obj), key = keys.pop(); key; key = keys.pop()) {
      this[key] = obj[key];
    }
  }
  util.inherits(AbortError2, RedisError);
  util.inherits(AggregateError, AbortError2);
  Object.defineProperty(AbortError2.prototype, "name", {
    value: "AbortError",
    configurable: true,
    writable: true
  });
  Object.defineProperty(AggregateError.prototype, "name", {
    value: "AggregateError",
    configurable: true,
    writable: true
  });
  module.exports = {
    AbortError: AbortError2,
    AggregateError
  };
});

// node_modules/redis-parser/lib/parser.js
var require_parser = __commonJS((exports, module) => {
  "use strict";
  var Buffer2 = require("buffer").Buffer;
  var StringDecoder = require("string_decoder").StringDecoder;
  var decoder = new StringDecoder();
  var errors = require_redis_errors();
  var ReplyError = errors.ReplyError;
  var ParserError = errors.ParserError;
  var bufferPool = Buffer2.allocUnsafe(32 * 1024);
  var bufferOffset = 0;
  var interval = null;
  var counter = 0;
  var notDecreased = 0;
  function parseSimpleNumbers(parser) {
    const length = parser.buffer.length - 1;
    var offset = parser.offset;
    var number = 0;
    var sign = 1;
    if (parser.buffer[offset] === 45) {
      sign = -1;
      offset++;
    }
    while (offset < length) {
      const c1 = parser.buffer[offset++];
      if (c1 === 13) {
        parser.offset = offset + 1;
        return sign * number;
      }
      number = number * 10 + (c1 - 48);
    }
  }
  function parseStringNumbers(parser) {
    const length = parser.buffer.length - 1;
    var offset = parser.offset;
    var number = 0;
    var res = "";
    if (parser.buffer[offset] === 45) {
      res += "-";
      offset++;
    }
    while (offset < length) {
      var c1 = parser.buffer[offset++];
      if (c1 === 13) {
        parser.offset = offset + 1;
        if (number !== 0) {
          res += number;
        }
        return res;
      } else if (number > 429496728) {
        res += number * 10 + (c1 - 48);
        number = 0;
      } else if (c1 === 48 && number === 0) {
        res += 0;
      } else {
        number = number * 10 + (c1 - 48);
      }
    }
  }
  function parseSimpleString(parser) {
    const start = parser.offset;
    const buffer = parser.buffer;
    const length = buffer.length - 1;
    var offset = start;
    while (offset < length) {
      if (buffer[offset++] === 13) {
        parser.offset = offset + 1;
        if (parser.optionReturnBuffers === true) {
          return parser.buffer.slice(start, offset - 1);
        }
        return parser.buffer.toString("utf8", start, offset - 1);
      }
    }
  }
  function parseLength(parser) {
    const length = parser.buffer.length - 1;
    var offset = parser.offset;
    var number = 0;
    while (offset < length) {
      const c1 = parser.buffer[offset++];
      if (c1 === 13) {
        parser.offset = offset + 1;
        return number;
      }
      number = number * 10 + (c1 - 48);
    }
  }
  function parseInteger(parser) {
    if (parser.optionStringNumbers === true) {
      return parseStringNumbers(parser);
    }
    return parseSimpleNumbers(parser);
  }
  function parseBulkString(parser) {
    const length = parseLength(parser);
    if (length === void 0) {
      return;
    }
    if (length < 0) {
      return null;
    }
    const offset = parser.offset + length;
    if (offset + 2 > parser.buffer.length) {
      parser.bigStrSize = offset + 2;
      parser.totalChunkSize = parser.buffer.length;
      parser.bufferCache.push(parser.buffer);
      return;
    }
    const start = parser.offset;
    parser.offset = offset + 2;
    if (parser.optionReturnBuffers === true) {
      return parser.buffer.slice(start, offset);
    }
    return parser.buffer.toString("utf8", start, offset);
  }
  function parseError(parser) {
    var string = parseSimpleString(parser);
    if (string !== void 0) {
      if (parser.optionReturnBuffers === true) {
        string = string.toString();
      }
      return new ReplyError(string);
    }
  }
  function handleError(parser, type) {
    const err = new ParserError("Protocol error, got " + JSON.stringify(String.fromCharCode(type)) + " as reply type byte", JSON.stringify(parser.buffer), parser.offset);
    parser.buffer = null;
    parser.returnFatalError(err);
  }
  function parseArray(parser) {
    const length = parseLength(parser);
    if (length === void 0) {
      return;
    }
    if (length < 0) {
      return null;
    }
    const responses = new Array(length);
    return parseArrayElements(parser, responses, 0);
  }
  function pushArrayCache(parser, array, pos) {
    parser.arrayCache.push(array);
    parser.arrayPos.push(pos);
  }
  function parseArrayChunks(parser) {
    const tmp = parser.arrayCache.pop();
    var pos = parser.arrayPos.pop();
    if (parser.arrayCache.length) {
      const res = parseArrayChunks(parser);
      if (res === void 0) {
        pushArrayCache(parser, tmp, pos);
        return;
      }
      tmp[pos++] = res;
    }
    return parseArrayElements(parser, tmp, pos);
  }
  function parseArrayElements(parser, responses, i) {
    const bufferLength = parser.buffer.length;
    while (i < responses.length) {
      const offset = parser.offset;
      if (parser.offset >= bufferLength) {
        pushArrayCache(parser, responses, i);
        return;
      }
      const response = parseType(parser, parser.buffer[parser.offset++]);
      if (response === void 0) {
        if (!(parser.arrayCache.length || parser.bufferCache.length)) {
          parser.offset = offset;
        }
        pushArrayCache(parser, responses, i);
        return;
      }
      responses[i] = response;
      i++;
    }
    return responses;
  }
  function parseType(parser, type) {
    switch (type) {
      case 36:
        return parseBulkString(parser);
      case 43:
        return parseSimpleString(parser);
      case 42:
        return parseArray(parser);
      case 58:
        return parseInteger(parser);
      case 45:
        return parseError(parser);
      default:
        return handleError(parser, type);
    }
  }
  function decreaseBufferPool() {
    if (bufferPool.length > 50 * 1024) {
      if (counter === 1 || notDecreased > counter * 2) {
        const minSliceLen = Math.floor(bufferPool.length / 10);
        const sliceLength = minSliceLen < bufferOffset ? bufferOffset : minSliceLen;
        bufferOffset = 0;
        bufferPool = bufferPool.slice(sliceLength, bufferPool.length);
      } else {
        notDecreased++;
        counter--;
      }
    } else {
      clearInterval(interval);
      counter = 0;
      notDecreased = 0;
      interval = null;
    }
  }
  function resizeBuffer(length) {
    if (bufferPool.length < length + bufferOffset) {
      const multiplier = length > 1024 * 1024 * 75 ? 2 : 3;
      if (bufferOffset > 1024 * 1024 * 111) {
        bufferOffset = 1024 * 1024 * 50;
      }
      bufferPool = Buffer2.allocUnsafe(length * multiplier + bufferOffset);
      bufferOffset = 0;
      counter++;
      if (interval === null) {
        interval = setInterval(decreaseBufferPool, 50);
      }
    }
  }
  function concatBulkString(parser) {
    const list = parser.bufferCache;
    const oldOffset = parser.offset;
    var chunks = list.length;
    var offset = parser.bigStrSize - parser.totalChunkSize;
    parser.offset = offset;
    if (offset <= 2) {
      if (chunks === 2) {
        return list[0].toString("utf8", oldOffset, list[0].length + offset - 2);
      }
      chunks--;
      offset = list[list.length - 2].length + offset;
    }
    var res = decoder.write(list[0].slice(oldOffset));
    for (var i = 1; i < chunks - 1; i++) {
      res += decoder.write(list[i]);
    }
    res += decoder.end(list[i].slice(0, offset - 2));
    return res;
  }
  function concatBulkBuffer(parser) {
    const list = parser.bufferCache;
    const oldOffset = parser.offset;
    const length = parser.bigStrSize - oldOffset - 2;
    var chunks = list.length;
    var offset = parser.bigStrSize - parser.totalChunkSize;
    parser.offset = offset;
    if (offset <= 2) {
      if (chunks === 2) {
        return list[0].slice(oldOffset, list[0].length + offset - 2);
      }
      chunks--;
      offset = list[list.length - 2].length + offset;
    }
    resizeBuffer(length);
    const start = bufferOffset;
    list[0].copy(bufferPool, start, oldOffset, list[0].length);
    bufferOffset += list[0].length - oldOffset;
    for (var i = 1; i < chunks - 1; i++) {
      list[i].copy(bufferPool, bufferOffset);
      bufferOffset += list[i].length;
    }
    list[i].copy(bufferPool, bufferOffset, 0, offset - 2);
    bufferOffset += offset - 2;
    return bufferPool.slice(start, bufferOffset);
  }
  var JavascriptRedisParser = class {
    constructor(options) {
      if (!options) {
        throw new TypeError("Options are mandatory.");
      }
      if (typeof options.returnError !== "function" || typeof options.returnReply !== "function") {
        throw new TypeError("The returnReply and returnError options have to be functions.");
      }
      this.setReturnBuffers(!!options.returnBuffers);
      this.setStringNumbers(!!options.stringNumbers);
      this.returnError = options.returnError;
      this.returnFatalError = options.returnFatalError || options.returnError;
      this.returnReply = options.returnReply;
      this.reset();
    }
    reset() {
      this.offset = 0;
      this.buffer = null;
      this.bigStrSize = 0;
      this.totalChunkSize = 0;
      this.bufferCache = [];
      this.arrayCache = [];
      this.arrayPos = [];
    }
    setReturnBuffers(returnBuffers) {
      if (typeof returnBuffers !== "boolean") {
        throw new TypeError("The returnBuffers argument has to be a boolean");
      }
      this.optionReturnBuffers = returnBuffers;
    }
    setStringNumbers(stringNumbers) {
      if (typeof stringNumbers !== "boolean") {
        throw new TypeError("The stringNumbers argument has to be a boolean");
      }
      this.optionStringNumbers = stringNumbers;
    }
    execute(buffer) {
      if (this.buffer === null) {
        this.buffer = buffer;
        this.offset = 0;
      } else if (this.bigStrSize === 0) {
        const oldLength = this.buffer.length;
        const remainingLength = oldLength - this.offset;
        const newBuffer = Buffer2.allocUnsafe(remainingLength + buffer.length);
        this.buffer.copy(newBuffer, 0, this.offset, oldLength);
        buffer.copy(newBuffer, remainingLength, 0, buffer.length);
        this.buffer = newBuffer;
        this.offset = 0;
        if (this.arrayCache.length) {
          const arr = parseArrayChunks(this);
          if (arr === void 0) {
            return;
          }
          this.returnReply(arr);
        }
      } else if (this.totalChunkSize + buffer.length >= this.bigStrSize) {
        this.bufferCache.push(buffer);
        var tmp = this.optionReturnBuffers ? concatBulkBuffer(this) : concatBulkString(this);
        this.bigStrSize = 0;
        this.bufferCache = [];
        this.buffer = buffer;
        if (this.arrayCache.length) {
          this.arrayCache[0][this.arrayPos[0]++] = tmp;
          tmp = parseArrayChunks(this);
          if (tmp === void 0) {
            return;
          }
        }
        this.returnReply(tmp);
      } else {
        this.bufferCache.push(buffer);
        this.totalChunkSize += buffer.length;
        return;
      }
      while (this.offset < this.buffer.length) {
        const offset = this.offset;
        const type = this.buffer[this.offset++];
        const response = parseType(this, type);
        if (response === void 0) {
          if (!(this.arrayCache.length || this.bufferCache.length)) {
            this.offset = offset;
          }
          return;
        }
        if (type === 45) {
          this.returnError(response);
        } else {
          this.returnReply(response);
        }
      }
      this.buffer = null;
    }
  };
  module.exports = JavascriptRedisParser;
});

// node_modules/redis-parser/index.js
var require_redis_parser = __commonJS((exports, module) => {
  "use strict";
  module.exports = require_parser();
});

// node_modules/redis-commands/commands.json
var require_commands = __commonJS((exports, module) => {
  module.exports = {
    acl: {
      arity: -2,
      flags: [
        "admin",
        "noscript",
        "loading",
        "stale",
        "skip_slowlog"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    append: {
      arity: 3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    asking: {
      arity: 1,
      flags: [
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    auth: {
      arity: -2,
      flags: [
        "noscript",
        "loading",
        "stale",
        "skip_monitor",
        "skip_slowlog",
        "fast",
        "no_auth"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    bgrewriteaof: {
      arity: 1,
      flags: [
        "admin",
        "noscript"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    bgsave: {
      arity: -1,
      flags: [
        "admin",
        "noscript"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    bitcount: {
      arity: -2,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    bitfield: {
      arity: -2,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    bitfield_ro: {
      arity: -2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    bitop: {
      arity: -4,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 2,
      keyStop: -1,
      step: 1
    },
    bitpos: {
      arity: -3,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    blpop: {
      arity: -3,
      flags: [
        "write",
        "noscript"
      ],
      keyStart: 1,
      keyStop: -2,
      step: 1
    },
    brpop: {
      arity: -3,
      flags: [
        "write",
        "noscript"
      ],
      keyStart: 1,
      keyStop: -2,
      step: 1
    },
    brpoplpush: {
      arity: 4,
      flags: [
        "write",
        "denyoom",
        "noscript"
      ],
      keyStart: 1,
      keyStop: 2,
      step: 1
    },
    bzpopmax: {
      arity: -3,
      flags: [
        "write",
        "noscript",
        "fast"
      ],
      keyStart: 1,
      keyStop: -2,
      step: 1
    },
    bzpopmin: {
      arity: -3,
      flags: [
        "write",
        "noscript",
        "fast"
      ],
      keyStart: 1,
      keyStop: -2,
      step: 1
    },
    client: {
      arity: -2,
      flags: [
        "admin",
        "noscript",
        "random",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    cluster: {
      arity: -2,
      flags: [
        "admin",
        "random",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    command: {
      arity: -1,
      flags: [
        "random",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    config: {
      arity: -2,
      flags: [
        "admin",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    dbsize: {
      arity: 1,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    debug: {
      arity: -2,
      flags: [
        "admin",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    decr: {
      arity: 2,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    decrby: {
      arity: 3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    del: {
      arity: -2,
      flags: [
        "write"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    discard: {
      arity: 1,
      flags: [
        "noscript",
        "loading",
        "stale",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    dump: {
      arity: 2,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    echo: {
      arity: 2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    eval: {
      arity: -3,
      flags: [
        "noscript",
        "movablekeys"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    evalsha: {
      arity: -3,
      flags: [
        "noscript",
        "movablekeys"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    exec: {
      arity: 1,
      flags: [
        "noscript",
        "loading",
        "stale",
        "skip_monitor",
        "skip_slowlog"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    exists: {
      arity: -2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    expire: {
      arity: 3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    expireat: {
      arity: 3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    flushall: {
      arity: -1,
      flags: [
        "write"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    flushdb: {
      arity: -1,
      flags: [
        "write"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    geoadd: {
      arity: -5,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    geodist: {
      arity: -4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    geohash: {
      arity: -2,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    geopos: {
      arity: -2,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    georadius: {
      arity: -6,
      flags: [
        "write",
        "movablekeys"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    georadius_ro: {
      arity: -6,
      flags: [
        "readonly",
        "movablekeys"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    georadiusbymember: {
      arity: -5,
      flags: [
        "write",
        "movablekeys"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    georadiusbymember_ro: {
      arity: -5,
      flags: [
        "readonly",
        "movablekeys"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    get: {
      arity: 2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    getbit: {
      arity: 3,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    getrange: {
      arity: 4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    getset: {
      arity: 3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hdel: {
      arity: -3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hello: {
      arity: -2,
      flags: [
        "noscript",
        "loading",
        "stale",
        "skip_monitor",
        "skip_slowlog",
        "fast",
        "no_auth"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    hexists: {
      arity: 3,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hget: {
      arity: 3,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hgetall: {
      arity: 2,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hincrby: {
      arity: 4,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hincrbyfloat: {
      arity: 4,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hkeys: {
      arity: 2,
      flags: [
        "readonly",
        "sort_for_script"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hlen: {
      arity: 2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hmget: {
      arity: -3,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hmset: {
      arity: -4,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    "host:": {
      arity: -1,
      flags: [
        "readonly",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    hscan: {
      arity: -3,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hset: {
      arity: -4,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hsetnx: {
      arity: 4,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hstrlen: {
      arity: 3,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    hvals: {
      arity: 2,
      flags: [
        "readonly",
        "sort_for_script"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    incr: {
      arity: 2,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    incrby: {
      arity: 3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    incrbyfloat: {
      arity: 3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    info: {
      arity: -1,
      flags: [
        "random",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    keys: {
      arity: 2,
      flags: [
        "readonly",
        "sort_for_script"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    lastsave: {
      arity: 1,
      flags: [
        "readonly",
        "random",
        "loading",
        "stale",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    latency: {
      arity: -2,
      flags: [
        "admin",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    lindex: {
      arity: 3,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    linsert: {
      arity: 5,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    llen: {
      arity: 2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    lolwut: {
      arity: -1,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    lpop: {
      arity: 2,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    lpos: {
      arity: -3,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    lpush: {
      arity: -3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    lpushx: {
      arity: -3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    lrange: {
      arity: 4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    lrem: {
      arity: 4,
      flags: [
        "write"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    lset: {
      arity: 4,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    ltrim: {
      arity: 4,
      flags: [
        "write"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    memory: {
      arity: -2,
      flags: [
        "readonly",
        "random",
        "movablekeys"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    mget: {
      arity: -2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    migrate: {
      arity: -6,
      flags: [
        "write",
        "random",
        "movablekeys"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    module: {
      arity: -2,
      flags: [
        "admin",
        "noscript"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    monitor: {
      arity: 1,
      flags: [
        "admin",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    move: {
      arity: 3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    mset: {
      arity: -3,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 2
    },
    msetnx: {
      arity: -3,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 2
    },
    multi: {
      arity: 1,
      flags: [
        "noscript",
        "loading",
        "stale",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    object: {
      arity: -2,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 2,
      keyStop: 2,
      step: 1
    },
    persist: {
      arity: 2,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    pexpire: {
      arity: 3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    pexpireat: {
      arity: 3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    pfadd: {
      arity: -2,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    pfcount: {
      arity: -2,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    pfdebug: {
      arity: -3,
      flags: [
        "write",
        "admin"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    pfmerge: {
      arity: -2,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    pfselftest: {
      arity: 1,
      flags: [
        "admin"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    ping: {
      arity: -1,
      flags: [
        "stale",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    post: {
      arity: -1,
      flags: [
        "readonly",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    psetex: {
      arity: 4,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    psubscribe: {
      arity: -2,
      flags: [
        "pubsub",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    psync: {
      arity: 3,
      flags: [
        "admin",
        "noscript"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    pttl: {
      arity: 2,
      flags: [
        "readonly",
        "random",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    publish: {
      arity: 3,
      flags: [
        "pubsub",
        "loading",
        "stale",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    pubsub: {
      arity: -2,
      flags: [
        "pubsub",
        "random",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    punsubscribe: {
      arity: -1,
      flags: [
        "pubsub",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    quit: {
      arity: 1,
      flags: [
        "loading",
        "stale",
        "readonly"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    randomkey: {
      arity: 1,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    readonly: {
      arity: 1,
      flags: [
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    readwrite: {
      arity: 1,
      flags: [
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    rename: {
      arity: 3,
      flags: [
        "write"
      ],
      keyStart: 1,
      keyStop: 2,
      step: 1
    },
    renamenx: {
      arity: 3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 2,
      step: 1
    },
    replconf: {
      arity: -1,
      flags: [
        "admin",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    replicaof: {
      arity: 3,
      flags: [
        "admin",
        "noscript",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    restore: {
      arity: -4,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    "restore-asking": {
      arity: -4,
      flags: [
        "write",
        "denyoom",
        "asking"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    role: {
      arity: 1,
      flags: [
        "readonly",
        "noscript",
        "loading",
        "stale",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    rpop: {
      arity: 2,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    rpoplpush: {
      arity: 3,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 2,
      step: 1
    },
    rpush: {
      arity: -3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    rpushx: {
      arity: -3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    sadd: {
      arity: -3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    save: {
      arity: 1,
      flags: [
        "admin",
        "noscript"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    scan: {
      arity: -2,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    scard: {
      arity: 2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    script: {
      arity: -2,
      flags: [
        "noscript"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    sdiff: {
      arity: -2,
      flags: [
        "readonly",
        "sort_for_script"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    sdiffstore: {
      arity: -3,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    select: {
      arity: 2,
      flags: [
        "loading",
        "stale",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    set: {
      arity: -3,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    setbit: {
      arity: 4,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    setex: {
      arity: 4,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    setnx: {
      arity: 3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    setrange: {
      arity: 4,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    shutdown: {
      arity: -1,
      flags: [
        "admin",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    sinter: {
      arity: -2,
      flags: [
        "readonly",
        "sort_for_script"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    sinterstore: {
      arity: -3,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    sismember: {
      arity: 3,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    slaveof: {
      arity: 3,
      flags: [
        "admin",
        "noscript",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    slowlog: {
      arity: -2,
      flags: [
        "admin",
        "random",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    smembers: {
      arity: 2,
      flags: [
        "readonly",
        "sort_for_script"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    smove: {
      arity: 4,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 2,
      step: 1
    },
    sort: {
      arity: -2,
      flags: [
        "write",
        "denyoom",
        "movablekeys"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    spop: {
      arity: -2,
      flags: [
        "write",
        "random",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    srandmember: {
      arity: -2,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    srem: {
      arity: -3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    sscan: {
      arity: -3,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    stralgo: {
      arity: -2,
      flags: [
        "readonly",
        "movablekeys"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    strlen: {
      arity: 2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    subscribe: {
      arity: -2,
      flags: [
        "pubsub",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    substr: {
      arity: 4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    sunion: {
      arity: -2,
      flags: [
        "readonly",
        "sort_for_script"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    sunionstore: {
      arity: -3,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    swapdb: {
      arity: 3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    sync: {
      arity: 1,
      flags: [
        "admin",
        "noscript"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    time: {
      arity: 1,
      flags: [
        "readonly",
        "random",
        "loading",
        "stale",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    touch: {
      arity: -2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    ttl: {
      arity: 2,
      flags: [
        "readonly",
        "random",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    type: {
      arity: 2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    unlink: {
      arity: -2,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    unsubscribe: {
      arity: -1,
      flags: [
        "pubsub",
        "noscript",
        "loading",
        "stale"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    unwatch: {
      arity: 1,
      flags: [
        "noscript",
        "loading",
        "stale",
        "fast"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    wait: {
      arity: 3,
      flags: [
        "noscript"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    watch: {
      arity: -2,
      flags: [
        "noscript",
        "loading",
        "stale",
        "fast"
      ],
      keyStart: 1,
      keyStop: -1,
      step: 1
    },
    xack: {
      arity: -4,
      flags: [
        "write",
        "random",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xadd: {
      arity: -5,
      flags: [
        "write",
        "denyoom",
        "random",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xclaim: {
      arity: -6,
      flags: [
        "write",
        "random",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xdel: {
      arity: -3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xgroup: {
      arity: -2,
      flags: [
        "write",
        "denyoom"
      ],
      keyStart: 2,
      keyStop: 2,
      step: 1
    },
    xinfo: {
      arity: -2,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 2,
      keyStop: 2,
      step: 1
    },
    xlen: {
      arity: 2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xpending: {
      arity: -3,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xrange: {
      arity: -4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xread: {
      arity: -4,
      flags: [
        "readonly",
        "movablekeys"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xreadgroup: {
      arity: -7,
      flags: [
        "write",
        "movablekeys"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xrevrange: {
      arity: -4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xsetid: {
      arity: 3,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    xtrim: {
      arity: -2,
      flags: [
        "write",
        "random"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zadd: {
      arity: -4,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zcard: {
      arity: 2,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zcount: {
      arity: 4,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zincrby: {
      arity: 4,
      flags: [
        "write",
        "denyoom",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zinterstore: {
      arity: -4,
      flags: [
        "write",
        "denyoom",
        "movablekeys"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    },
    zlexcount: {
      arity: 4,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zpopmax: {
      arity: -2,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zpopmin: {
      arity: -2,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zrange: {
      arity: -4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zrangebylex: {
      arity: -4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zrangebyscore: {
      arity: -4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zrank: {
      arity: 3,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zrem: {
      arity: -3,
      flags: [
        "write",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zremrangebylex: {
      arity: 4,
      flags: [
        "write"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zremrangebyrank: {
      arity: 4,
      flags: [
        "write"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zremrangebyscore: {
      arity: 4,
      flags: [
        "write"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zrevrange: {
      arity: -4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zrevrangebylex: {
      arity: -4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zrevrangebyscore: {
      arity: -4,
      flags: [
        "readonly"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zrevrank: {
      arity: 3,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zscan: {
      arity: -3,
      flags: [
        "readonly",
        "random"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zscore: {
      arity: 3,
      flags: [
        "readonly",
        "fast"
      ],
      keyStart: 1,
      keyStop: 1,
      step: 1
    },
    zunionstore: {
      arity: -4,
      flags: [
        "write",
        "denyoom",
        "movablekeys"
      ],
      keyStart: 0,
      keyStop: 0,
      step: 0
    }
  };
});

// node_modules/redis-commands/index.js
var require_redis_commands = __commonJS((exports) => {
  "use strict";
  var commands = require_commands();
  exports.list = Object.keys(commands);
  var flags = {};
  exports.list.forEach(function(commandName) {
    flags[commandName] = commands[commandName].flags.reduce(function(flags2, flag) {
      flags2[flag] = true;
      return flags2;
    }, {});
  });
  exports.exists = function(commandName) {
    return Boolean(commands[commandName]);
  };
  exports.hasFlag = function(commandName, flag) {
    if (!flags[commandName]) {
      throw new Error("Unknown command " + commandName);
    }
    return Boolean(flags[commandName][flag]);
  };
  exports.getKeyIndexes = function(commandName, args, options) {
    var command = commands[commandName];
    if (!command) {
      throw new Error("Unknown command " + commandName);
    }
    if (!Array.isArray(args)) {
      throw new Error("Expect args to be an array");
    }
    var keys = [];
    var i, keyStart, keyStop, parseExternalKey;
    switch (commandName) {
      case "zunionstore":
      case "zinterstore":
        keys.push(0);
      case "eval":
      case "evalsha":
        keyStop = Number(args[1]) + 2;
        for (i = 2; i < keyStop; i++) {
          keys.push(i);
        }
        break;
      case "sort":
        parseExternalKey = options && options.parseExternalKey;
        keys.push(0);
        for (i = 1; i < args.length - 1; i++) {
          if (typeof args[i] !== "string") {
            continue;
          }
          var directive = args[i].toUpperCase();
          if (directive === "GET") {
            i += 1;
            if (args[i] !== "#") {
              if (parseExternalKey) {
                keys.push([i, getExternalKeyNameLength(args[i])]);
              } else {
                keys.push(i);
              }
            }
          } else if (directive === "BY") {
            i += 1;
            if (parseExternalKey) {
              keys.push([i, getExternalKeyNameLength(args[i])]);
            } else {
              keys.push(i);
            }
          } else if (directive === "STORE") {
            i += 1;
            keys.push(i);
          }
        }
        break;
      case "migrate":
        if (args[2] === "") {
          for (i = 5; i < args.length - 1; i++) {
            if (args[i].toUpperCase() === "KEYS") {
              for (var j = i + 1; j < args.length; j++) {
                keys.push(j);
              }
              break;
            }
          }
        } else {
          keys.push(2);
        }
        break;
      case "xreadgroup":
      case "xread":
        for (i = commandName === "xread" ? 0 : 3; i < args.length - 1; i++) {
          if (String(args[i]).toUpperCase() === "STREAMS") {
            for (j = i + 1; j <= i + (args.length - 1 - i) / 2; j++) {
              keys.push(j);
            }
            break;
          }
        }
        break;
      default:
        if (command.step > 0) {
          keyStart = command.keyStart - 1;
          keyStop = command.keyStop > 0 ? command.keyStop : args.length + command.keyStop + 1;
          for (i = keyStart; i < keyStop; i += command.step) {
            keys.push(i);
          }
        }
        break;
    }
    return keys;
  };
  function getExternalKeyNameLength(key) {
    if (typeof key !== "string") {
      key = String(key);
    }
    var hashPos = key.indexOf("->");
    return hashPos === -1 ? key.length : hashPos;
  }
});

// node_modules/redis/lib/debug.js
var require_debug = __commonJS((exports, module) => {
  "use strict";
  var index = require_redis();
  function debug() {
    if (index.debug_mode) {
      var data = Array.prototype.slice.call(arguments);
      data.unshift(new Date().toISOString());
      console.error.apply(null, data);
    }
  }
  module.exports = debug;
});

// node_modules/redis/lib/createClient.js
var require_createClient = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  var URL = require("url");
  module.exports = function createClient(port_arg, host_arg, options) {
    if (typeof port_arg === "number" || typeof port_arg === "string" && /^\d+$/.test(port_arg)) {
      var host;
      if (typeof host_arg === "string") {
        host = host_arg;
      } else {
        if (options && host_arg) {
          throw new TypeError("Unknown type of connection in createClient()");
        }
        options = options || host_arg;
      }
      options = utils.clone(options);
      options.host = host || options.host;
      options.port = port_arg;
    } else if (typeof port_arg === "string" || port_arg && port_arg.url) {
      options = utils.clone(port_arg.url ? port_arg : host_arg || options);
      var url = port_arg.url || port_arg;
      var parsed = URL.parse(url, true, true);
      if (parsed.slashes) {
        if (parsed.auth) {
          options.password = parsed.auth.slice(parsed.auth.indexOf(":") + 1);
        }
        if (parsed.protocol) {
          if (parsed.protocol === "rediss:") {
            options.tls = options.tls || {};
          } else if (parsed.protocol !== "redis:") {
            console.warn('node_redis: WARNING: You passed "' + parsed.protocol.substring(0, parsed.protocol.length - 1) + '" as protocol instead of the "redis" protocol!');
          }
        }
        if (parsed.pathname && parsed.pathname !== "/") {
          options.db = parsed.pathname.substr(1);
        }
        if (parsed.hostname) {
          options.host = parsed.hostname;
        }
        if (parsed.port) {
          options.port = parsed.port;
        }
        if (parsed.search !== "") {
          var elem;
          for (elem in parsed.query) {
            if (elem in options) {
              if (options[elem] === parsed.query[elem]) {
                console.warn("node_redis: WARNING: You passed the " + elem + " option twice!");
              } else {
                throw new RangeError("The " + elem + " option is added twice and does not match");
              }
            }
            options[elem] = parsed.query[elem];
          }
        }
      } else if (parsed.hostname) {
        throw new RangeError('The redis url must begin with slashes "//" or contain slashes after the redis protocol');
      } else {
        options.path = url;
      }
    } else if (typeof port_arg === "object" || port_arg === void 0) {
      options = utils.clone(port_arg || options);
      options.host = options.host || host_arg;
      if (port_arg && arguments.length !== 1) {
        throw new TypeError("Too many arguments passed to createClient. Please only pass the options object");
      }
    }
    if (!options) {
      throw new TypeError("Unknown type of connection in createClient()");
    }
    return options;
  };
});

// node_modules/redis/lib/multi.js
var require_multi = __commonJS((exports, module) => {
  "use strict";
  var Queue = require_denque();
  var utils = require_utils();
  var Command = require_command();
  function Multi(client, args) {
    this._client = client;
    this.queue = new Queue();
    var command, tmp_args;
    if (args) {
      for (var i = 0; i < args.length; i++) {
        command = args[i][0];
        tmp_args = args[i].slice(1);
        if (Array.isArray(command)) {
          this[command[0]].apply(this, command.slice(1).concat(tmp_args));
        } else {
          this[command].apply(this, tmp_args);
        }
      }
    }
  }
  function pipeline_transaction_command(self, command_obj, index) {
    var tmp = command_obj.callback;
    command_obj.callback = function(err, reply) {
      if (err && index !== -1) {
        if (tmp) {
          tmp(err);
        }
        err.position = index;
        self.errors.push(err);
      }
      self.wants_buffers[index] = command_obj.buffer_args;
      command_obj.callback = tmp;
    };
    self._client.internal_send_command(command_obj);
  }
  Multi.prototype.exec_atomic = Multi.prototype.EXEC_ATOMIC = Multi.prototype.execAtomic = function exec_atomic(callback) {
    if (this.queue.length < 2) {
      return this.exec_batch(callback);
    }
    return this.exec(callback);
  };
  function multi_callback(self, err, replies) {
    var i = 0, command_obj;
    if (err) {
      err.errors = self.errors;
      if (self.callback) {
        self.callback(err);
      } else if (err.code !== "CONNECTION_BROKEN") {
        self._client.emit("error", err);
      }
      return;
    }
    if (replies) {
      while (command_obj = self.queue.shift()) {
        if (replies[i] instanceof Error) {
          var match = replies[i].message.match(utils.err_code);
          if (match) {
            replies[i].code = match[1];
          }
          replies[i].command = command_obj.command.toUpperCase();
          if (typeof command_obj.callback === "function") {
            command_obj.callback(replies[i]);
          }
        } else {
          replies[i] = self._client.handle_reply(replies[i], command_obj.command, self.wants_buffers[i]);
          if (typeof command_obj.callback === "function") {
            command_obj.callback(null, replies[i]);
          }
        }
        i++;
      }
    }
    if (self.callback) {
      self.callback(null, replies);
    }
  }
  Multi.prototype.exec_transaction = function exec_transaction(callback) {
    if (this.monitoring || this._client.monitoring) {
      var err = new RangeError("Using transaction with a client that is in monitor mode does not work due to faulty return values of Redis.");
      err.command = "EXEC";
      err.code = "EXECABORT";
      return utils.reply_in_order(this._client, callback, err);
    }
    var self = this;
    var len = self.queue.length;
    self.errors = [];
    self.callback = callback;
    self._client.cork();
    self.wants_buffers = new Array(len);
    pipeline_transaction_command(self, new Command("multi", []), -1);
    for (var index = 0; index < len; index++) {
      pipeline_transaction_command(self, self.queue.get(index), index);
    }
    self._client.internal_send_command(new Command("exec", [], function(err2, replies) {
      multi_callback(self, err2, replies);
    }));
    self._client.uncork();
    return !self._client.should_buffer;
  };
  function batch_callback(self, cb, i) {
    return function batch_callback2(err, res) {
      if (err) {
        self.results[i] = err;
        self.results[i].position = i;
      } else {
        self.results[i] = res;
      }
      cb(err, res);
    };
  }
  Multi.prototype.exec = Multi.prototype.EXEC = Multi.prototype.exec_batch = function exec_batch(callback) {
    var self = this;
    var len = self.queue.length;
    var index = 0;
    var command_obj;
    if (len === 0) {
      utils.reply_in_order(self._client, callback, null, []);
      return !self._client.should_buffer;
    }
    self._client.cork();
    if (!callback) {
      while (command_obj = self.queue.shift()) {
        self._client.internal_send_command(command_obj);
      }
      self._client.uncork();
      return !self._client.should_buffer;
    }
    var callback_without_own_cb = function(err, res) {
      if (err) {
        self.results.push(err);
        var i = self.results.length - 1;
        self.results[i].position = i;
      } else {
        self.results.push(res);
      }
    };
    var last_callback = function(cb) {
      return function(err, res) {
        cb(err, res);
        callback(null, self.results);
      };
    };
    self.results = [];
    while (command_obj = self.queue.shift()) {
      if (typeof command_obj.callback === "function") {
        command_obj.callback = batch_callback(self, command_obj.callback, index);
      } else {
        command_obj.callback = callback_without_own_cb;
      }
      if (typeof callback === "function" && index === len - 1) {
        command_obj.callback = last_callback(command_obj.callback);
      }
      this._client.internal_send_command(command_obj);
      index++;
    }
    self._client.uncork();
    return !self._client.should_buffer;
  };
  module.exports = Multi;
});

// node_modules/redis/lib/individualCommands.js
var require_individualCommands = __commonJS(() => {
  "use strict";
  var utils = require_utils();
  var debug = require_debug();
  var Multi = require_multi();
  var Command = require_command();
  var no_password_is_set = /no password is set/;
  var loading = /LOADING/;
  var RedisClient = require_redis().RedisClient;
  RedisClient.prototype.multi = RedisClient.prototype.MULTI = function multi(args) {
    var multi2 = new Multi(this, args);
    multi2.exec = multi2.EXEC = multi2.exec_transaction;
    return multi2;
  };
  RedisClient.prototype.batch = RedisClient.prototype.BATCH = function batch(args) {
    return new Multi(this, args);
  };
  function select_callback(self, db, callback) {
    return function(err, res) {
      if (err === null) {
        self.selected_db = db;
      }
      utils.callback_or_emit(self, callback, err, res);
    };
  }
  RedisClient.prototype.select = RedisClient.prototype.SELECT = function select(db, callback) {
    return this.internal_send_command(new Command("select", [db], select_callback(this, db, callback)));
  };
  Multi.prototype.select = Multi.prototype.SELECT = function select(db, callback) {
    this.queue.push(new Command("select", [db], select_callback(this._client, db, callback)));
    return this;
  };
  RedisClient.prototype.monitor = RedisClient.prototype.MONITOR = function monitor(callback) {
    var self = this;
    var call_on_write = function() {
      self.monitoring = true;
    };
    return this.internal_send_command(new Command("monitor", [], callback, call_on_write));
  };
  Multi.prototype.monitor = Multi.prototype.MONITOR = function monitor(callback) {
    if (this.exec !== this.exec_transaction) {
      var self = this;
      var call_on_write = function() {
        self._client.monitoring = true;
      };
      this.queue.push(new Command("monitor", [], callback, call_on_write));
      return this;
    }
    this.monitoring = true;
    return this;
  };
  function quit_callback(self, callback) {
    return function(err, res) {
      if (err && err.code === "NR_CLOSED") {
        err = null;
        res = "OK";
      }
      utils.callback_or_emit(self, callback, err, res);
      if (self.stream.writable) {
        self.stream.destroy();
      }
    };
  }
  RedisClient.prototype.QUIT = RedisClient.prototype.quit = function quit(callback) {
    var backpressure_indicator = this.internal_send_command(new Command("quit", [], quit_callback(this, callback)));
    this.closing = true;
    this.ready = false;
    return backpressure_indicator;
  };
  Multi.prototype.QUIT = Multi.prototype.quit = function quit(callback) {
    var self = this._client;
    var call_on_write = function() {
      self.closing = true;
      self.ready = false;
    };
    this.queue.push(new Command("quit", [], quit_callback(self, callback), call_on_write));
    return this;
  };
  function info_callback(self, callback) {
    return function(err, res) {
      if (res) {
        var obj = {};
        var lines = res.toString().split("\r\n");
        var line, parts, sub_parts;
        for (var i = 0; i < lines.length; i++) {
          parts = lines[i].split(":");
          if (parts[1]) {
            if (parts[0].indexOf("db") === 0) {
              sub_parts = parts[1].split(",");
              obj[parts[0]] = {};
              while (line = sub_parts.pop()) {
                line = line.split("=");
                obj[parts[0]][line[0]] = +line[1];
              }
            } else {
              obj[parts[0]] = parts[1];
            }
          }
        }
        obj.versions = [];
        if (obj.redis_version) {
          obj.redis_version.split(".").forEach(function(num) {
            obj.versions.push(+num);
          });
        }
        self.server_info = obj;
      } else {
        self.server_info = {};
      }
      utils.callback_or_emit(self, callback, err, res);
    };
  }
  RedisClient.prototype.info = RedisClient.prototype.INFO = function info(section, callback) {
    var args = [];
    if (typeof section === "function") {
      callback = section;
    } else if (section !== void 0) {
      args = Array.isArray(section) ? section : [section];
    }
    return this.internal_send_command(new Command("info", args, info_callback(this, callback)));
  };
  Multi.prototype.info = Multi.prototype.INFO = function info(section, callback) {
    var args = [];
    if (typeof section === "function") {
      callback = section;
    } else if (section !== void 0) {
      args = Array.isArray(section) ? section : [section];
    }
    this.queue.push(new Command("info", args, info_callback(this._client, callback)));
    return this;
  };
  function auth_callback(self, pass, callback) {
    return function(err, res) {
      if (err) {
        if (no_password_is_set.test(err.message)) {
          self.warn("Warning: Redis server does not require a password, but a password was supplied.");
          err = null;
          res = "OK";
        } else if (loading.test(err.message)) {
          debug("Redis still loading, trying to authenticate later");
          setTimeout(function() {
            self.auth(pass, callback);
          }, 100);
          return;
        }
      }
      utils.callback_or_emit(self, callback, err, res);
    };
  }
  RedisClient.prototype.auth = RedisClient.prototype.AUTH = function auth(pass, callback) {
    debug("Sending auth to " + this.address + " id " + this.connection_id);
    this.auth_pass = pass;
    var ready = this.ready;
    this.ready = ready || this.offline_queue.length === 0;
    var tmp = this.internal_send_command(new Command("auth", [pass], auth_callback(this, pass, callback)));
    this.ready = ready;
    return tmp;
  };
  Multi.prototype.auth = Multi.prototype.AUTH = function auth(pass, callback) {
    debug("Sending auth to " + this.address + " id " + this.connection_id);
    this.auth_pass = pass;
    this.queue.push(new Command("auth", [pass], auth_callback(this._client, callback)));
    return this;
  };
  RedisClient.prototype.client = RedisClient.prototype.CLIENT = function client() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0];
      callback = arguments[1];
    } else if (Array.isArray(arguments[1])) {
      if (len === 3) {
        callback = arguments[2];
      }
      len = arguments[1].length;
      arr = new Array(len + 1);
      arr[0] = arguments[0];
      for (; i < len; i += 1) {
        arr[i + 1] = arguments[1][i];
      }
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this;
    var call_on_write = void 0;
    if (arr.length === 2 && arr[0].toString().toUpperCase() === "REPLY") {
      var reply_on_off = arr[1].toString().toUpperCase();
      if (reply_on_off === "ON" || reply_on_off === "OFF" || reply_on_off === "SKIP") {
        call_on_write = function() {
          self.reply = reply_on_off;
        };
      }
    }
    return this.internal_send_command(new Command("client", arr, callback, call_on_write));
  };
  Multi.prototype.client = Multi.prototype.CLIENT = function client() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0];
      callback = arguments[1];
    } else if (Array.isArray(arguments[1])) {
      if (len === 3) {
        callback = arguments[2];
      }
      len = arguments[1].length;
      arr = new Array(len + 1);
      arr[0] = arguments[0];
      for (; i < len; i += 1) {
        arr[i + 1] = arguments[1][i];
      }
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this._client;
    var call_on_write = void 0;
    if (arr.length === 2 && arr[0].toString().toUpperCase() === "REPLY") {
      var reply_on_off = arr[1].toString().toUpperCase();
      if (reply_on_off === "ON" || reply_on_off === "OFF" || reply_on_off === "SKIP") {
        call_on_write = function() {
          self.reply = reply_on_off;
        };
      }
    }
    this.queue.push(new Command("client", arr, callback, call_on_write));
    return this;
  };
  RedisClient.prototype.hmset = RedisClient.prototype.HMSET = function hmset() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0];
      callback = arguments[1];
    } else if (Array.isArray(arguments[1])) {
      if (len === 3) {
        callback = arguments[2];
      }
      len = arguments[1].length;
      arr = new Array(len + 1);
      arr[0] = arguments[0];
      for (; i < len; i += 1) {
        arr[i + 1] = arguments[1][i];
      }
    } else if (typeof arguments[1] === "object" && (arguments.length === 2 || arguments.length === 3 && (typeof arguments[2] === "function" || typeof arguments[2] === "undefined"))) {
      arr = [arguments[0]];
      for (var field in arguments[1]) {
        arr.push(field, arguments[1][field]);
      }
      callback = arguments[2];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    return this.internal_send_command(new Command("hmset", arr, callback));
  };
  Multi.prototype.hmset = Multi.prototype.HMSET = function hmset() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0];
      callback = arguments[1];
    } else if (Array.isArray(arguments[1])) {
      if (len === 3) {
        callback = arguments[2];
      }
      len = arguments[1].length;
      arr = new Array(len + 1);
      arr[0] = arguments[0];
      for (; i < len; i += 1) {
        arr[i + 1] = arguments[1][i];
      }
    } else if (typeof arguments[1] === "object" && (arguments.length === 2 || arguments.length === 3 && (typeof arguments[2] === "function" || typeof arguments[2] === "undefined"))) {
      arr = [arguments[0]];
      for (var field in arguments[1]) {
        arr.push(field, arguments[1][field]);
      }
      callback = arguments[2];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    this.queue.push(new Command("hmset", arr, callback));
    return this;
  };
  RedisClient.prototype.subscribe = RedisClient.prototype.SUBSCRIBE = function subscribe() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0].slice(0);
      callback = arguments[1];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this;
    var call_on_write = function() {
      self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    return this.internal_send_command(new Command("subscribe", arr, callback, call_on_write));
  };
  Multi.prototype.subscribe = Multi.prototype.SUBSCRIBE = function subscribe() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0].slice(0);
      callback = arguments[1];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this._client;
    var call_on_write = function() {
      self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    this.queue.push(new Command("subscribe", arr, callback, call_on_write));
    return this;
  };
  RedisClient.prototype.unsubscribe = RedisClient.prototype.UNSUBSCRIBE = function unsubscribe() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0].slice(0);
      callback = arguments[1];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this;
    var call_on_write = function() {
      self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    return this.internal_send_command(new Command("unsubscribe", arr, callback, call_on_write));
  };
  Multi.prototype.unsubscribe = Multi.prototype.UNSUBSCRIBE = function unsubscribe() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0].slice(0);
      callback = arguments[1];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this._client;
    var call_on_write = function() {
      self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    this.queue.push(new Command("unsubscribe", arr, callback, call_on_write));
    return this;
  };
  RedisClient.prototype.psubscribe = RedisClient.prototype.PSUBSCRIBE = function psubscribe() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0].slice(0);
      callback = arguments[1];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this;
    var call_on_write = function() {
      self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    return this.internal_send_command(new Command("psubscribe", arr, callback, call_on_write));
  };
  Multi.prototype.psubscribe = Multi.prototype.PSUBSCRIBE = function psubscribe() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0].slice(0);
      callback = arguments[1];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this._client;
    var call_on_write = function() {
      self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    this.queue.push(new Command("psubscribe", arr, callback, call_on_write));
    return this;
  };
  RedisClient.prototype.punsubscribe = RedisClient.prototype.PUNSUBSCRIBE = function punsubscribe() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0].slice(0);
      callback = arguments[1];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this;
    var call_on_write = function() {
      self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    return this.internal_send_command(new Command("punsubscribe", arr, callback, call_on_write));
  };
  Multi.prototype.punsubscribe = Multi.prototype.PUNSUBSCRIBE = function punsubscribe() {
    var arr, len = arguments.length, callback, i = 0;
    if (Array.isArray(arguments[0])) {
      arr = arguments[0].slice(0);
      callback = arguments[1];
    } else {
      len = arguments.length;
      if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
        len--;
        callback = arguments[len];
      }
      arr = new Array(len);
      for (; i < len; i += 1) {
        arr[i] = arguments[i];
      }
    }
    var self = this._client;
    var call_on_write = function() {
      self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    this.queue.push(new Command("punsubscribe", arr, callback, call_on_write));
    return this;
  };
});

// node_modules/redis/lib/extendedApi.js
var require_extendedApi = __commonJS(() => {
  "use strict";
  var utils = require_utils();
  var debug = require_debug();
  var RedisClient = require_redis().RedisClient;
  var Command = require_command();
  var noop = function() {
  };
  RedisClient.prototype.send_command = RedisClient.prototype.sendCommand = function(command, args, callback) {
    if (typeof command !== "string") {
      throw new TypeError('Wrong input type "' + (command !== null && command !== void 0 ? command.constructor.name : command) + '" for command name');
    }
    command = command.toLowerCase();
    if (!Array.isArray(args)) {
      if (args === void 0 || args === null) {
        args = [];
      } else if (typeof args === "function" && callback === void 0) {
        callback = args;
        args = [];
      } else {
        throw new TypeError('Wrong input type "' + args.constructor.name + '" for args');
      }
    }
    if (typeof callback !== "function" && callback !== void 0) {
      throw new TypeError('Wrong input type "' + (callback !== null ? callback.constructor.name : "null") + '" for callback function');
    }
    if (command === "multi" || typeof this[command] !== "function") {
      return this.internal_send_command(new Command(command, args, callback));
    }
    if (typeof callback === "function") {
      args = args.concat([callback]);
    }
    return this[command].apply(this, args);
  };
  RedisClient.prototype.end = function(flush) {
    if (flush) {
      this.flush_and_error({
        message: "Connection forcefully ended and command aborted.",
        code: "NR_CLOSED"
      });
    } else if (arguments.length === 0) {
      this.warn("Using .end() without the flush parameter is deprecated and throws from v.3.0.0 on.\nPlease check the doku (https://github.com/NodeRedis/node_redis) and explictly use flush.");
    }
    if (this.retry_timer) {
      clearTimeout(this.retry_timer);
      this.retry_timer = null;
    }
    this.stream.removeAllListeners();
    this.stream.on("error", noop);
    this.connected = false;
    this.ready = false;
    this.closing = true;
    return this.stream.destroySoon();
  };
  RedisClient.prototype.unref = function() {
    if (this.connected) {
      debug("Unref'ing the socket connection");
      this.stream.unref();
    } else {
      debug("Not connected yet, will unref later");
      this.once("connect", function() {
        this.unref();
      });
    }
  };
  RedisClient.prototype.duplicate = function(options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = null;
    }
    var existing_options = utils.clone(this.options);
    options = utils.clone(options);
    for (var elem in options) {
      existing_options[elem] = options[elem];
    }
    var client = new RedisClient(existing_options);
    client.selected_db = options.db || this.selected_db;
    if (typeof callback === "function") {
      var ready_listener = function() {
        callback(null, client);
        client.removeAllListeners(error_listener);
      };
      var error_listener = function(err) {
        callback(err);
        client.end(true);
      };
      client.once("ready", ready_listener);
      client.once("error", error_listener);
      return;
    }
    return client;
  };
});

// node_modules/redis/lib/commands.js
var require_commands2 = __commonJS((exports, module) => {
  "use strict";
  var commands = require_redis_commands();
  var Multi = require_multi();
  var RedisClient = require_redis().RedisClient;
  var Command = require_command();
  var addCommand = function(command) {
    var commandName = command.replace(/(?:^([0-9])|[^a-zA-Z0-9_$])/g, "_$1");
    if (!RedisClient.prototype[command]) {
      RedisClient.prototype[command.toUpperCase()] = RedisClient.prototype[command] = function() {
        var arr;
        var len = arguments.length;
        var callback;
        var i = 0;
        if (Array.isArray(arguments[0])) {
          arr = arguments[0];
          if (len === 2) {
            callback = arguments[1];
          }
        } else if (len > 1 && Array.isArray(arguments[1])) {
          if (len === 3) {
            callback = arguments[2];
          }
          len = arguments[1].length;
          arr = new Array(len + 1);
          arr[0] = arguments[0];
          for (; i < len; i += 1) {
            arr[i + 1] = arguments[1][i];
          }
        } else {
          if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
            len--;
            callback = arguments[len];
          }
          arr = new Array(len);
          for (; i < len; i += 1) {
            arr[i] = arguments[i];
          }
        }
        return this.internal_send_command(new Command(command, arr, callback));
      };
      if (commandName !== command) {
        RedisClient.prototype[commandName.toUpperCase()] = RedisClient.prototype[commandName] = RedisClient.prototype[command];
      }
      Object.defineProperty(RedisClient.prototype[command], "name", {
        value: commandName
      });
    }
    if (!Multi.prototype[command]) {
      Multi.prototype[command.toUpperCase()] = Multi.prototype[command] = function() {
        var arr;
        var len = arguments.length;
        var callback;
        var i = 0;
        if (Array.isArray(arguments[0])) {
          arr = arguments[0];
          if (len === 2) {
            callback = arguments[1];
          }
        } else if (len > 1 && Array.isArray(arguments[1])) {
          if (len === 3) {
            callback = arguments[2];
          }
          len = arguments[1].length;
          arr = new Array(len + 1);
          arr[0] = arguments[0];
          for (; i < len; i += 1) {
            arr[i + 1] = arguments[1][i];
          }
        } else {
          if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
            len--;
            callback = arguments[len];
          }
          arr = new Array(len);
          for (; i < len; i += 1) {
            arr[i] = arguments[i];
          }
        }
        this.queue.push(new Command(command, arr, callback));
        return this;
      };
      if (commandName !== command) {
        Multi.prototype[commandName.toUpperCase()] = Multi.prototype[commandName] = Multi.prototype[command];
      }
      Object.defineProperty(Multi.prototype[command], "name", {
        value: commandName
      });
    }
  };
  commands.list.forEach(addCommand);
  module.exports = addCommand;
});

// node_modules/redis/index.js
var require_redis = __commonJS((exports) => {
  "use strict";
  var net = require("net");
  var tls = require("tls");
  var util = require("util");
  var utils = require_utils();
  var Command = require_command();
  var Queue = require_denque();
  var errorClasses = require_customErrors();
  var EventEmitter = require("events");
  var Parser2 = require_redis_parser();
  var RedisErrors = require_redis_errors();
  var commands = require_redis_commands();
  var debug = require_debug();
  var unifyOptions = require_createClient();
  var SUBSCRIBE_COMMANDS = {
    subscribe: true,
    unsubscribe: true,
    psubscribe: true,
    punsubscribe: true
  };
  function noop() {
  }
  function handle_detect_buffers_reply(reply, command, buffer_args) {
    if (buffer_args === false || this.message_buffers) {
      reply = utils.reply_to_strings(reply);
    }
    if (command === "hgetall") {
      reply = utils.reply_to_object(reply);
    }
    return reply;
  }
  exports.debug_mode = /\bredis\b/i.test(process.env.NODE_DEBUG);
  function RedisClient(options, stream) {
    options = utils.clone(options);
    EventEmitter.call(this);
    var cnx_options = {};
    var self = this;
    for (var tls_option in options.tls) {
      cnx_options[tls_option] = options.tls[tls_option];
      if (tls_option === "port" || tls_option === "host" || tls_option === "path" || tls_option === "family") {
        options[tls_option] = options.tls[tls_option];
      }
    }
    if (stream) {
      options.stream = stream;
      this.address = '"Private stream"';
    } else if (options.path) {
      cnx_options.path = options.path;
      this.address = options.path;
    } else {
      cnx_options.port = +options.port || 6379;
      cnx_options.host = options.host || "127.0.0.1";
      cnx_options.family = !options.family && net.isIP(cnx_options.host) || (options.family === "IPv6" ? 6 : 4);
      this.address = cnx_options.host + ":" + cnx_options.port;
    }
    this.connection_options = cnx_options;
    this.connection_id = RedisClient.connection_id++;
    this.connected = false;
    this.ready = false;
    if (options.socket_keepalive === void 0) {
      options.socket_keepalive = true;
    }
    if (options.socket_initial_delay === void 0) {
      options.socket_initial_delay = 0;
    }
    for (var command in options.rename_commands) {
      options.rename_commands[command.toLowerCase()] = options.rename_commands[command];
    }
    options.return_buffers = !!options.return_buffers;
    options.detect_buffers = !!options.detect_buffers;
    if (options.return_buffers && options.detect_buffers) {
      self.warn("WARNING: You activated return_buffers and detect_buffers at the same time. The return value is always going to be a buffer.");
      options.detect_buffers = false;
    }
    if (options.detect_buffers) {
      this.handle_reply = handle_detect_buffers_reply;
    }
    this.should_buffer = false;
    this.command_queue = new Queue();
    this.offline_queue = new Queue();
    this.pipeline_queue = new Queue();
    this.connect_timeout = +options.connect_timeout || 36e5;
    this.enable_offline_queue = options.enable_offline_queue === false ? false : true;
    this.initialize_retry_vars();
    this.pub_sub_mode = 0;
    this.subscription_set = {};
    this.monitoring = false;
    this.message_buffers = false;
    this.closing = false;
    this.server_info = {};
    this.auth_pass = options.auth_pass || options.password;
    this.selected_db = options.db;
    this.fire_strings = true;
    this.pipeline = false;
    this.sub_commands_left = 0;
    this.times_connected = 0;
    this.buffers = options.return_buffers || options.detect_buffers;
    this.options = options;
    this.reply = "ON";
    this.create_stream();
    this.on("newListener", function(event) {
      if ((event === "message_buffer" || event === "pmessage_buffer" || event === "messageBuffer" || event === "pmessageBuffer") && !this.buffers && !this.message_buffers) {
        this.reply_parser.optionReturnBuffers = true;
        this.message_buffers = true;
        this.handle_reply = handle_detect_buffers_reply;
      }
    });
  }
  util.inherits(RedisClient, EventEmitter);
  RedisClient.connection_id = 0;
  function create_parser(self) {
    return new Parser2({
      returnReply: function(data) {
        self.return_reply(data);
      },
      returnError: function(err) {
        self.return_error(err);
      },
      returnFatalError: function(err) {
        err.message += ". Please report this.";
        self.ready = false;
        self.flush_and_error({
          message: "Fatal error encountered. Command aborted.",
          code: "NR_FATAL"
        }, {
          error: err,
          queues: ["command_queue"]
        });
        self.emit("error", err);
        self.create_stream();
      },
      returnBuffers: self.buffers || self.message_buffers,
      stringNumbers: self.options.string_numbers || false
    });
  }
  RedisClient.prototype.create_stream = function() {
    var self = this;
    this.reply_parser = create_parser(this);
    if (this.options.stream) {
      if (this.stream) {
        return;
      }
      this.stream = this.options.stream;
    } else {
      if (this.stream) {
        this.stream.removeAllListeners();
        this.stream.destroy();
      }
      if (this.options.tls) {
        this.stream = tls.connect(this.connection_options);
      } else {
        this.stream = net.createConnection(this.connection_options);
      }
    }
    if (this.options.connect_timeout) {
      this.stream.setTimeout(this.connect_timeout, function() {
        self.retry_totaltime = self.connect_timeout;
        self.connection_gone("timeout");
      });
    }
    var connect_event = this.options.tls ? "secureConnect" : "connect";
    this.stream.once(connect_event, function() {
      this.removeAllListeners("timeout");
      self.times_connected++;
      self.on_connect();
    });
    this.stream.on("data", function(buffer_from_socket) {
      debug("Net read " + self.address + " id " + self.connection_id);
      self.reply_parser.execute(buffer_from_socket);
    });
    this.stream.on("error", function(err) {
      self.on_error(err);
    });
    this.stream.once("close", function(hadError) {
      self.connection_gone("close");
    });
    this.stream.once("end", function() {
      self.connection_gone("end");
    });
    this.stream.on("drain", function() {
      self.drain();
    });
    this.stream.setNoDelay();
    if (this.auth_pass !== void 0) {
      this.ready = true;
      this.auth(this.auth_pass, function(err) {
        if (err && err.code !== "UNCERTAIN_STATE") {
          self.emit("error", err);
        }
      });
      this.ready = false;
    }
  };
  RedisClient.prototype.handle_reply = function(reply, command) {
    if (command === "hgetall") {
      reply = utils.reply_to_object(reply);
    }
    return reply;
  };
  RedisClient.prototype.cork = noop;
  RedisClient.prototype.uncork = noop;
  RedisClient.prototype.initialize_retry_vars = function() {
    this.retry_timer = null;
    this.retry_totaltime = 0;
    this.retry_delay = 200;
    this.retry_backoff = 1.7;
    this.attempts = 1;
  };
  RedisClient.prototype.warn = function(msg) {
    var self = this;
    process.nextTick(function() {
      if (self.listeners("warning").length !== 0) {
        self.emit("warning", msg);
      } else {
        console.warn("node_redis:", msg);
      }
    });
  };
  RedisClient.prototype.flush_and_error = function(error_attributes, options) {
    options = options || {};
    var aggregated_errors = [];
    var queue_names = options.queues || ["command_queue", "offline_queue"];
    for (var i = 0; i < queue_names.length; i++) {
      if (queue_names[i] === "command_queue") {
        error_attributes.message += " It might have been processed.";
      } else {
        error_attributes.message = error_attributes.message.replace(" It might have been processed.", "");
      }
      for (var command_obj = this[queue_names[i]].shift(); command_obj; command_obj = this[queue_names[i]].shift()) {
        var err = new errorClasses.AbortError(error_attributes);
        if (command_obj.error) {
          err.stack = err.stack + command_obj.error.stack.replace(/^Error.*?\n/, "\n");
        }
        err.command = command_obj.command.toUpperCase();
        if (command_obj.args && command_obj.args.length) {
          err.args = command_obj.args;
        }
        if (options.error) {
          err.origin = options.error;
        }
        if (typeof command_obj.callback === "function") {
          command_obj.callback(err);
        } else {
          aggregated_errors.push(err);
        }
      }
    }
    if (exports.debug_mode && aggregated_errors.length) {
      var error;
      if (aggregated_errors.length === 1) {
        error = aggregated_errors[0];
      } else {
        error_attributes.message = error_attributes.message.replace("It", "They").replace(/command/i, "$&s");
        error = new errorClasses.AggregateError(error_attributes);
        error.errors = aggregated_errors;
      }
      this.emit("error", error);
    }
  };
  RedisClient.prototype.on_error = function(err) {
    if (this.closing) {
      return;
    }
    err.message = "Redis connection to " + this.address + " failed - " + err.message;
    debug(err.message);
    this.connected = false;
    this.ready = false;
    if (!this.options.retry_strategy) {
      this.emit("error", err);
    }
    this.connection_gone("error", err);
  };
  RedisClient.prototype.on_connect = function() {
    debug("Stream connected " + this.address + " id " + this.connection_id);
    this.connected = true;
    this.ready = false;
    this.emitted_end = false;
    this.stream.setKeepAlive(this.options.socket_keepalive, this.options.socket_initial_delay);
    this.stream.setTimeout(0);
    this.emit("connect");
    this.initialize_retry_vars();
    if (this.options.no_ready_check) {
      this.on_ready();
    } else {
      this.ready_check();
    }
  };
  RedisClient.prototype.on_ready = function() {
    var self = this;
    debug("on_ready called " + this.address + " id " + this.connection_id);
    this.ready = true;
    this.cork = function() {
      self.pipeline = true;
      if (self.stream.cork) {
        self.stream.cork();
      }
    };
    this.uncork = function() {
      if (self.fire_strings) {
        self.write_strings();
      } else {
        self.write_buffers();
      }
      self.pipeline = false;
      self.fire_strings = true;
      if (self.stream.uncork) {
        self.stream.uncork();
      }
    };
    if (this.selected_db !== void 0) {
      this.internal_send_command(new Command("select", [this.selected_db]));
    }
    if (this.monitoring) {
      this.internal_send_command(new Command("monitor", []));
    }
    var callback_count = Object.keys(this.subscription_set).length;
    if (!this.options.disable_resubscribing && callback_count) {
      var callback = function() {
        callback_count--;
        if (callback_count === 0) {
          self.emit("ready");
        }
      };
      debug("Sending pub/sub on_ready commands");
      for (var key in this.subscription_set) {
        var command = key.slice(0, key.indexOf("_"));
        var args = this.subscription_set[key];
        this[command]([args], callback);
      }
      this.send_offline_queue();
      return;
    }
    this.send_offline_queue();
    this.emit("ready");
  };
  RedisClient.prototype.on_info_cmd = function(err, res) {
    if (err) {
      if (err.message === "ERR unknown command 'info'") {
        this.on_ready();
        return;
      }
      err.message = "Ready check failed: " + err.message;
      this.emit("error", err);
      return;
    }
    if (!res) {
      debug("The info command returned without any data.");
      this.on_ready();
      return;
    }
    if (!this.server_info.loading || this.server_info.loading === "0") {
      if (this.server_info.master_link_status && this.server_info.master_link_status !== "up") {
        this.server_info.loading_eta_seconds = 0.05;
      } else {
        debug("Redis server ready.");
        this.on_ready();
        return;
      }
    }
    var retry_time = +this.server_info.loading_eta_seconds * 1e3;
    if (retry_time > 1e3) {
      retry_time = 1e3;
    }
    debug("Redis server still loading, trying again in " + retry_time);
    setTimeout(function(self) {
      self.ready_check();
    }, retry_time, this);
  };
  RedisClient.prototype.ready_check = function() {
    var self = this;
    debug("Checking server ready state...");
    this.ready = true;
    this.info(function(err, res) {
      self.on_info_cmd(err, res);
    });
    this.ready = false;
  };
  RedisClient.prototype.send_offline_queue = function() {
    for (var command_obj = this.offline_queue.shift(); command_obj; command_obj = this.offline_queue.shift()) {
      debug("Sending offline command: " + command_obj.command);
      this.internal_send_command(command_obj);
    }
    this.drain();
  };
  var retry_connection = function(self, error) {
    debug("Retrying connection...");
    var reconnect_params = {
      delay: self.retry_delay,
      attempt: self.attempts,
      error
    };
    if (self.options.camel_case) {
      reconnect_params.totalRetryTime = self.retry_totaltime;
      reconnect_params.timesConnected = self.times_connected;
    } else {
      reconnect_params.total_retry_time = self.retry_totaltime;
      reconnect_params.times_connected = self.times_connected;
    }
    self.emit("reconnecting", reconnect_params);
    self.retry_totaltime += self.retry_delay;
    self.attempts += 1;
    self.retry_delay = Math.round(self.retry_delay * self.retry_backoff);
    self.create_stream();
    self.retry_timer = null;
  };
  RedisClient.prototype.connection_gone = function(why, error) {
    if (this.retry_timer) {
      return;
    }
    error = error || null;
    debug("Redis connection is gone from " + why + " event.");
    this.connected = false;
    this.ready = false;
    this.cork = noop;
    this.uncork = noop;
    this.pipeline = false;
    this.pub_sub_mode = 0;
    if (!this.emitted_end) {
      this.emit("end");
      this.emitted_end = true;
    }
    if (this.closing) {
      debug("Connection ended by quit / end command, not retrying.");
      this.flush_and_error({
        message: "Stream connection ended and command aborted.",
        code: "NR_CLOSED"
      }, {
        error
      });
      return;
    }
    if (typeof this.options.retry_strategy === "function") {
      var retry_params = {
        attempt: this.attempts,
        error
      };
      if (this.options.camel_case) {
        retry_params.totalRetryTime = this.retry_totaltime;
        retry_params.timesConnected = this.times_connected;
      } else {
        retry_params.total_retry_time = this.retry_totaltime;
        retry_params.times_connected = this.times_connected;
      }
      this.retry_delay = this.options.retry_strategy(retry_params);
      if (typeof this.retry_delay !== "number") {
        if (this.retry_delay instanceof Error) {
          error = this.retry_delay;
        }
        var errorMessage = "Redis connection in broken state: retry aborted.";
        this.flush_and_error({
          message: errorMessage,
          code: "CONNECTION_BROKEN"
        }, {
          error
        });
        var retryError = new Error(errorMessage);
        retryError.code = "CONNECTION_BROKEN";
        if (error) {
          retryError.origin = error;
        }
        this.end(false);
        this.emit("error", retryError);
        return;
      }
    }
    if (this.retry_totaltime >= this.connect_timeout) {
      var message = "Redis connection in broken state: connection timeout exceeded.";
      this.flush_and_error({
        message,
        code: "CONNECTION_BROKEN"
      }, {
        error
      });
      var err = new Error(message);
      err.code = "CONNECTION_BROKEN";
      if (error) {
        err.origin = error;
      }
      this.end(false);
      this.emit("error", err);
      return;
    }
    if (this.options.retry_unfulfilled_commands) {
      this.offline_queue.unshift.apply(this.offline_queue, this.command_queue.toArray());
      this.command_queue.clear();
    } else if (this.command_queue.length !== 0) {
      this.flush_and_error({
        message: "Redis connection lost and command aborted.",
        code: "UNCERTAIN_STATE"
      }, {
        error,
        queues: ["command_queue"]
      });
    }
    if (this.retry_totaltime + this.retry_delay > this.connect_timeout) {
      this.retry_delay = this.connect_timeout - this.retry_totaltime;
    }
    debug("Retry connection in " + this.retry_delay + " ms");
    this.retry_timer = setTimeout(retry_connection, this.retry_delay, this, error);
  };
  RedisClient.prototype.return_error = function(err) {
    var command_obj = this.command_queue.shift();
    if (command_obj.error) {
      err.stack = command_obj.error.stack.replace(/^Error.*?\n/, "ReplyError: " + err.message + "\n");
    }
    err.command = command_obj.command.toUpperCase();
    if (command_obj.args && command_obj.args.length) {
      err.args = command_obj.args;
    }
    if (this.pub_sub_mode > 1) {
      this.pub_sub_mode--;
    }
    var match = err.message.match(utils.err_code);
    if (match) {
      err.code = match[1];
    }
    utils.callback_or_emit(this, command_obj.callback, err);
  };
  RedisClient.prototype.drain = function() {
    this.should_buffer = false;
  };
  function normal_reply(self, reply) {
    var command_obj = self.command_queue.shift();
    if (typeof command_obj.callback === "function") {
      if (command_obj.command !== "exec") {
        reply = self.handle_reply(reply, command_obj.command, command_obj.buffer_args);
      }
      command_obj.callback(null, reply);
    } else {
      debug("No callback for reply");
    }
  }
  function subscribe_unsubscribe(self, reply, type) {
    var command_obj = self.command_queue.get(0);
    var buffer = self.options.return_buffers || self.options.detect_buffers && command_obj.buffer_args;
    var channel = buffer || reply[1] === null ? reply[1] : reply[1].toString();
    var count = +reply[2];
    debug(type, channel);
    if (channel !== null) {
      self.emit(type, channel, count);
      if (type === "subscribe" || type === "psubscribe") {
        self.subscription_set[type + "_" + channel] = channel;
      } else {
        type = type === "unsubscribe" ? "subscribe" : "psubscribe";
        delete self.subscription_set[type + "_" + channel];
      }
    }
    if (command_obj.args.length === 1 || self.sub_commands_left === 1 || command_obj.args.length === 0 && (count === 0 || channel === null)) {
      if (count === 0) {
        var running_command;
        var i = 1;
        self.pub_sub_mode = 0;
        while (running_command = self.command_queue.get(i)) {
          if (SUBSCRIBE_COMMANDS[running_command.command]) {
            self.pub_sub_mode = i;
            break;
          }
          i++;
        }
      }
      self.command_queue.shift();
      if (typeof command_obj.callback === "function") {
        command_obj.callback(null, channel);
      }
      self.sub_commands_left = 0;
    } else {
      if (self.sub_commands_left !== 0) {
        self.sub_commands_left--;
      } else {
        self.sub_commands_left = command_obj.args.length ? command_obj.args.length - 1 : count;
      }
    }
  }
  function return_pub_sub(self, reply) {
    var type = reply[0].toString();
    if (type === "message") {
      if (!self.options.return_buffers || self.message_buffers) {
        self.emit("message", reply[1].toString(), reply[2].toString());
        self.emit("message_buffer", reply[1], reply[2]);
        self.emit("messageBuffer", reply[1], reply[2]);
      } else {
        self.emit("message", reply[1], reply[2]);
      }
    } else if (type === "pmessage") {
      if (!self.options.return_buffers || self.message_buffers) {
        self.emit("pmessage", reply[1].toString(), reply[2].toString(), reply[3].toString());
        self.emit("pmessage_buffer", reply[1], reply[2], reply[3]);
        self.emit("pmessageBuffer", reply[1], reply[2], reply[3]);
      } else {
        self.emit("pmessage", reply[1], reply[2], reply[3]);
      }
    } else {
      subscribe_unsubscribe(self, reply, type);
    }
  }
  RedisClient.prototype.return_reply = function(reply) {
    if (this.monitoring) {
      var replyStr;
      if (this.buffers && Buffer.isBuffer(reply)) {
        replyStr = reply.toString();
      } else {
        replyStr = reply;
      }
      if (typeof replyStr === "string" && utils.monitor_regex.test(replyStr)) {
        var timestamp = replyStr.slice(0, replyStr.indexOf(" "));
        var args = replyStr.slice(replyStr.indexOf('"') + 1, -1).split('" "').map(function(elem) {
          return elem.replace(/\\"/g, '"');
        });
        this.emit("monitor", timestamp, args, replyStr);
        return;
      }
    }
    if (this.pub_sub_mode === 0) {
      normal_reply(this, reply);
    } else if (this.pub_sub_mode !== 1) {
      this.pub_sub_mode--;
      normal_reply(this, reply);
    } else if (!(reply instanceof Array) || reply.length <= 2) {
      normal_reply(this, reply);
    } else {
      return_pub_sub(this, reply);
    }
  };
  function handle_offline_command(self, command_obj) {
    var command = command_obj.command;
    var err, msg;
    if (self.closing || !self.enable_offline_queue) {
      command = command.toUpperCase();
      if (!self.closing) {
        if (self.stream.writable) {
          msg = "The connection is not yet established and the offline queue is deactivated.";
        } else {
          msg = "Stream not writeable.";
        }
      } else {
        msg = "The connection is already closed.";
      }
      err = new errorClasses.AbortError({
        message: command + " can't be processed. " + msg,
        code: "NR_CLOSED",
        command
      });
      if (command_obj.args.length) {
        err.args = command_obj.args;
      }
      utils.reply_in_order(self, command_obj.callback, err);
    } else {
      debug("Queueing " + command + " for next server connection.");
      self.offline_queue.push(command_obj);
    }
    self.should_buffer = true;
  }
  RedisClient.prototype.internal_send_command = function(command_obj) {
    var arg, prefix_keys;
    var i = 0;
    var command_str = "";
    var args = command_obj.args;
    var command = command_obj.command;
    var len = args.length;
    var big_data = false;
    var args_copy = new Array(len);
    if (process.domain && command_obj.callback) {
      command_obj.callback = process.domain.bind(command_obj.callback);
    }
    if (this.ready === false || this.stream.writable === false) {
      handle_offline_command(this, command_obj);
      return false;
    }
    for (i = 0; i < len; i += 1) {
      if (typeof args[i] === "string") {
        if (args[i].length > 3e4) {
          big_data = true;
          args_copy[i] = Buffer.from(args[i], "utf8");
        } else {
          args_copy[i] = args[i];
        }
      } else if (typeof args[i] === "object") {
        if (args[i] instanceof Date) {
          args_copy[i] = args[i].toString();
        } else if (Buffer.isBuffer(args[i])) {
          args_copy[i] = args[i];
          command_obj.buffer_args = true;
          big_data = true;
        } else {
          var invalidArgError = new Error("node_redis: The " + command.toUpperCase() + " command contains a invalid argument type.\nOnly strings, dates and buffers are accepted. Please update your code to use valid argument types.");
          invalidArgError.command = command_obj.command.toUpperCase();
          if (command_obj.args && command_obj.args.length) {
            invalidArgError.args = command_obj.args;
          }
          if (command_obj.callback) {
            command_obj.callback(invalidArgError);
            return false;
          }
          throw invalidArgError;
        }
      } else if (typeof args[i] === "undefined") {
        var undefinedArgError = new Error("node_redis: The " + command.toUpperCase() + ' command contains a invalid argument type of "undefined".\nOnly strings, dates and buffers are accepted. Please update your code to use valid argument types.');
        undefinedArgError.command = command_obj.command.toUpperCase();
        if (command_obj.args && command_obj.args.length) {
          undefinedArgError.args = command_obj.args;
        }
        command_obj.callback(undefinedArgError);
        return false;
      } else {
        args_copy[i] = "" + args[i];
      }
    }
    if (this.options.prefix) {
      prefix_keys = commands.getKeyIndexes(command, args_copy);
      for (i = prefix_keys.pop(); i !== void 0; i = prefix_keys.pop()) {
        args_copy[i] = this.options.prefix + args_copy[i];
      }
    }
    if (this.options.rename_commands && this.options.rename_commands[command]) {
      command = this.options.rename_commands[command];
    }
    command_str = "*" + (len + 1) + "\r\n$" + command.length + "\r\n" + command + "\r\n";
    if (big_data === false) {
      for (i = 0; i < len; i += 1) {
        arg = args_copy[i];
        command_str += "$" + Buffer.byteLength(arg) + "\r\n" + arg + "\r\n";
      }
      debug("Send " + this.address + " id " + this.connection_id + ": " + command_str);
      this.write(command_str);
    } else {
      debug("Send command (" + command_str + ") has Buffer arguments");
      this.fire_strings = false;
      this.write(command_str);
      for (i = 0; i < len; i += 1) {
        arg = args_copy[i];
        if (typeof arg === "string") {
          this.write("$" + Buffer.byteLength(arg) + "\r\n" + arg + "\r\n");
        } else {
          this.write("$" + arg.length + "\r\n");
          this.write(arg);
          this.write("\r\n");
        }
        debug("send_command: buffer send " + arg.length + " bytes");
      }
    }
    if (command_obj.call_on_write) {
      command_obj.call_on_write();
    }
    if (this.reply === "ON") {
      this.command_queue.push(command_obj);
    } else {
      if (command_obj.callback) {
        utils.reply_in_order(this, command_obj.callback, null, void 0, this.command_queue);
      }
      if (this.reply === "SKIP") {
        this.reply = "SKIP_ONE_MORE";
      } else if (this.reply === "SKIP_ONE_MORE") {
        this.reply = "ON";
      }
    }
    return !this.should_buffer;
  };
  RedisClient.prototype.write_strings = function() {
    var str = "";
    for (var command = this.pipeline_queue.shift(); command; command = this.pipeline_queue.shift()) {
      if (str.length + command.length > 4 * 1024 * 1024) {
        this.should_buffer = !this.stream.write(str);
        str = "";
      }
      str += command;
    }
    if (str !== "") {
      this.should_buffer = !this.stream.write(str);
    }
  };
  RedisClient.prototype.write_buffers = function() {
    for (var command = this.pipeline_queue.shift(); command; command = this.pipeline_queue.shift()) {
      this.should_buffer = !this.stream.write(command);
    }
  };
  RedisClient.prototype.write = function(data) {
    if (this.pipeline === false) {
      this.should_buffer = !this.stream.write(data);
      return;
    }
    this.pipeline_queue.push(data);
  };
  Object.defineProperty(exports, "debugMode", {
    get: function() {
      return this.debug_mode;
    },
    set: function(val) {
      this.debug_mode = val;
    }
  });
  Object.defineProperty(RedisClient.prototype, "command_queue_length", {
    get: function() {
      return this.command_queue.length;
    }
  });
  Object.defineProperty(RedisClient.prototype, "offline_queue_length", {
    get: function() {
      return this.offline_queue.length;
    }
  });
  Object.defineProperty(RedisClient.prototype, "retryDelay", {
    get: function() {
      return this.retry_delay;
    }
  });
  Object.defineProperty(RedisClient.prototype, "retryBackoff", {
    get: function() {
      return this.retry_backoff;
    }
  });
  Object.defineProperty(RedisClient.prototype, "commandQueueLength", {
    get: function() {
      return this.command_queue.length;
    }
  });
  Object.defineProperty(RedisClient.prototype, "offlineQueueLength", {
    get: function() {
      return this.offline_queue.length;
    }
  });
  Object.defineProperty(RedisClient.prototype, "shouldBuffer", {
    get: function() {
      return this.should_buffer;
    }
  });
  Object.defineProperty(RedisClient.prototype, "connectionId", {
    get: function() {
      return this.connection_id;
    }
  });
  Object.defineProperty(RedisClient.prototype, "serverInfo", {
    get: function() {
      return this.server_info;
    }
  });
  exports.createClient = function() {
    return new RedisClient(unifyOptions.apply(null, arguments));
  };
  exports.RedisClient = RedisClient;
  exports.print = utils.print;
  exports.Multi = require_multi();
  exports.AbortError = errorClasses.AbortError;
  exports.RedisError = RedisErrors.RedisError;
  exports.ParserError = RedisErrors.ParserError;
  exports.ReplyError = RedisErrors.ReplyError;
  exports.AggregateError = errorClasses.AggregateError;
  require_individualCommands();
  require_extendedApi();
  exports.addCommand = exports.add_command = require_commands2();
});

// node_modules/handy-redis/dist/flatten.js
var require_flatten = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.flattenDeep = void 0;
  var flattenDeep = (array) => {
    const flat = [];
    for (const item of array) {
      if (Array.isArray(item)) {
        for (const val of exports.flattenDeep(item)) {
          flat.push(val);
        }
      } else {
        flat.push(item);
      }
    }
    return flat;
  };
  exports.flattenDeep = flattenDeep;
});

// node_modules/handy-redis/dist/node_redis/multi.js
var require_multi2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.WrappedNodeRedisMultiImpl = void 0;
  var nodeRedis = require_redis();
  var flatten_1 = require_flatten();
  var util_1 = require("util");
  var WrappedNodeRedisMultiImpl = class _WrappedNodeRedisMulti {
    constructor(multi) {
      this.nodeRedisMulti = multi;
      this.exec = util_1.promisify(multi.exec.bind(multi));
      this.exec_atomic = util_1.promisify(multi.exec.bind(multi));
    }
    static create(multi) {
      return new exports.WrappedNodeRedisMultiImpl(multi);
    }
  };
  exports.WrappedNodeRedisMultiImpl = WrappedNodeRedisMultiImpl;
  Object.keys(nodeRedis.Multi.prototype).filter((method) => method !== "exec" && method !== "exec_atomic").forEach((method) => {
    exports.WrappedNodeRedisMultiImpl.prototype[method] = function(...args) {
      this.nodeRedisMulti[method](flatten_1.flattenDeep(args));
      return this;
    };
  });
});

// node_modules/handy-redis/dist/node_redis/index.js
var require_node_redis = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.createNodeRedisClient = exports.addNodeRedisCommand = void 0;
  var nodeRedis = require_redis();
  var flatten_1 = require_flatten();
  var multi_1 = require_multi2();
  var WrappedNodeRedisClientImpl = class _WrappedNodeRedisClient {
    constructor(nodeRedis2) {
      this.nodeRedis = nodeRedis2;
      this.redis = nodeRedis2;
    }
    multi() {
      return multi_1.WrappedNodeRedisMultiImpl.create(this.nodeRedis.multi());
    }
    batch() {
      return multi_1.WrappedNodeRedisMultiImpl.create(this.nodeRedis.batch());
    }
    end(flush) {
      return this.nodeRedis.end(flush);
    }
  };
  var addCommands = (methods) => {
    methods.forEach((method) => {
      WrappedNodeRedisClientImpl.prototype[method] = function(...args) {
        return new Promise((resolve, reject) => {
          const flattenedArgs = [
            ...flatten_1.flattenDeep(args),
            (err, reply) => err ? reject(err) : resolve(reply)
          ];
          return this.nodeRedis[method](...flattenedArgs);
        });
      };
    });
  };
  addCommands(Object.keys(nodeRedis.RedisClient.prototype).filter((method) => method === method.toLowerCase() && !(method in WrappedNodeRedisClientImpl.prototype)));
  var addNodeRedisCommand = (command) => {
    nodeRedis.addCommand(command);
    addCommands([command]);
  };
  exports.addNodeRedisCommand = addNodeRedisCommand;
  var createNodeRedisClient2 = (...clientArgs) => {
    const nodeRedisInstance = typeof clientArgs[0] === "object" && typeof clientArgs[0].scan === "function" ? clientArgs[0] : nodeRedis.createClient.apply(null, clientArgs);
    return new WrappedNodeRedisClientImpl(nodeRedisInstance);
  };
  exports.createNodeRedisClient = createNodeRedisClient2;
});

// node_modules/handy-redis/dist/index.js
var require_dist = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.createHandyClient = exports.createNodeRedisClient = exports.addNodeRedisCommand = void 0;
  var node_redis_1 = require_node_redis();
  var node_redis_2 = require_node_redis();
  Object.defineProperty(exports, "addNodeRedisCommand", {enumerable: true, get: function() {
    return node_redis_2.addNodeRedisCommand;
  }});
  Object.defineProperty(exports, "createNodeRedisClient", {enumerable: true, get: function() {
    return node_redis_2.createNodeRedisClient;
  }});
  exports.createHandyClient = node_redis_1.createNodeRedisClient;
});

// node_modules/connection-string/dist/types.js
var require_types = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.HostType = void 0;
  var HostType;
  (function(HostType2) {
    HostType2["domain"] = "domain";
    HostType2["socket"] = "socket";
    HostType2["IPv4"] = "IPv4";
    HostType2["IPv6"] = "IPv6";
  })(HostType = exports.HostType || (exports.HostType = {}));
});

// node_modules/connection-string/dist/static.js
var require_static = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.parseHost = exports.validateUrl = exports.hasText = exports.decode = exports.encode = exports.fullHostName = void 0;
  var types_1 = require_types();
  function fullHostName(obj, options) {
    var a = "";
    if (obj.name) {
      var skipEncoding = obj.type === types_1.HostType.IPv4 || obj.type === types_1.HostType.IPv6;
      a = skipEncoding ? obj.name : encode(obj.name, options !== null && options !== void 0 ? options : {});
    }
    if (obj.port) {
      a += ":" + obj.port;
    }
    return a;
  }
  exports.fullHostName = fullHostName;
  function encode(text, options) {
    text = encodeURIComponent(text);
    if (options.plusForSpace) {
      text = text.replace(/%20/g, "+");
    }
    return options.encodeDollar ? text : text.replace(/%24/g, "$");
  }
  exports.encode = encode;
  function decode(text) {
    return decodeURIComponent(text.replace(/\+/g, "%20"));
  }
  exports.decode = decode;
  function hasText(txt) {
    return typeof txt === "string" && /\S/.test(txt);
  }
  exports.hasText = hasText;
  function validateUrl(url) {
    var idx = url.search(/[^a-z0-9-._:\/?[\]@!$&'()*+,;=%]/i);
    if (idx >= 0) {
      var s = JSON.stringify(url[idx]).replace(/^"|"$/g, "'");
      throw new Error("Invalid URL character " + s + " at position " + idx);
    }
  }
  exports.validateUrl = validateUrl;
  function parseHost(host, direct) {
    if (direct) {
      if (typeof host !== "string") {
        throw new TypeError('Invalid "host" parameter: ' + JSON.stringify(host));
      }
      host = host.trim();
    }
    var m, isIPv6;
    if (host[0] === "[") {
      m = host.match(/((\[[0-9a-z:%]{2,45}])(?::(-?[0-9a-z]+))?)/i);
      isIPv6 = true;
    } else {
      if (direct) {
        m = host.match(/(([a-z0-9.$/\- ]*)(?::(-?[0-9a-z]+))?)/i);
      } else {
        m = host.match(/(([a-z0-9.+$%\-]*)(?::(-?[0-9a-z]+))?)/i);
      }
    }
    if (m) {
      var h_1 = {};
      if (m[2]) {
        if (isIPv6) {
          h_1.name = m[2];
          h_1.type = types_1.HostType.IPv6;
        } else {
          if (m[2].match(/([0-9]{1,3}\.){3}[0-9]{1,3}/)) {
            h_1.name = m[2];
            h_1.type = types_1.HostType.IPv4;
          } else {
            h_1.name = direct ? m[2] : decode(m[2]);
            h_1.type = h_1.name.match(/\/|.*\.sock$/i) ? types_1.HostType.socket : types_1.HostType.domain;
          }
        }
      }
      if (m[3]) {
        var p = m[3], port = parseInt(p);
        if (port > 0 && port < 65536 && port.toString() === p) {
          h_1.port = port;
        } else {
          throw new Error("Invalid port: " + JSON.stringify(p) + ". Valid port range is: [1...65535]");
        }
      }
      if (h_1.name || h_1.port) {
        Object.defineProperty(h_1, "toString", {
          value: function(options) {
            return fullHostName(h_1, options);
          },
          enumerable: false
        });
        return h_1;
      }
    }
    return null;
  }
  exports.parseHost = parseHost;
});

// node_modules/connection-string/dist/main.js
var require_main = __commonJS((exports) => {
  "use strict";
  var __spreadArrays = exports && exports.__spreadArrays || function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.ConnectionString = void 0;
  var util_1 = require("util");
  var os_1 = require("os");
  var types_1 = require_types();
  var static_1 = require_static();
  var errInvalidDefaults = 'Invalid "defaults" parameter: ';
  var ConnectionString2 = function() {
    function ConnectionString3(cs, defaults) {
      var _this = this;
      if (!(this instanceof ConnectionString3)) {
        throw new TypeError("Class constructor ConnectionString cannot be invoked without 'new'");
      }
      cs = cs !== null && cs !== void 0 ? cs : "";
      if (typeof cs !== "string") {
        throw new TypeError("Invalid connection string: " + JSON.stringify(cs));
      }
      if (typeof (defaults !== null && defaults !== void 0 ? defaults : {}) !== "object") {
        throw new TypeError(errInvalidDefaults + JSON.stringify(defaults));
      }
      cs = cs.trim();
      static_1.validateUrl(cs);
      var m = cs.match(/^(.*)?:\/\//);
      if (m) {
        var p = m[1];
        if (p) {
          var m2 = p.match(/^([a-z]+[a-z0-9+-.:]*)/i);
          if (p && (!m2 || m2[1] !== p)) {
            throw new Error("Invalid protocol name: " + p);
          }
          this.protocol = p;
        }
        cs = cs.substr(m[0].length);
      }
      m = cs.match(/^([\w-_.+!*'()$%]*):?([\w-_.+!*'()$%]*)@/);
      if (m) {
        if (m[1]) {
          this.user = static_1.decode(m[1]);
        }
        if (m[2]) {
          this.password = static_1.decode(m[2]);
        }
        cs = cs.substr(m[0].length);
      }
      if (cs[0] !== "/") {
        var endOfHosts = cs.search(/[\/?]/);
        var hosts = (endOfHosts === -1 ? cs : cs.substr(0, endOfHosts)).split(",");
        hosts.forEach(function(h) {
          var host = static_1.parseHost(h);
          if (host) {
            if (!_this.hosts) {
              _this.hosts = [];
            }
            _this.hosts.push(host);
          }
        });
        if (endOfHosts >= 0) {
          cs = cs.substr(endOfHosts);
        }
      }
      m = cs.match(/\/([\w-_.+!*'()$%]+)/g);
      if (m) {
        this.path = m.map(function(s) {
          return static_1.decode(s.substr(1));
        });
      }
      var idx = cs.indexOf("?");
      if (idx !== -1) {
        cs = cs.substr(idx + 1);
        m = cs.match(/([\w-_.+!*'()$%]+)=([\w-_.+!*'()$%,]+)/g);
        if (m) {
          var params_1 = {};
          m.forEach(function(s) {
            var _a;
            var a = s.split("=");
            var prop = static_1.decode(a[0]);
            var val = a[1].split(",").map(static_1.decode);
            if (prop in params_1) {
              if (Array.isArray(params_1[prop])) {
                (_a = params_1[prop]).push.apply(_a, val);
              } else {
                params_1[prop] = __spreadArrays([params_1[prop]], val);
              }
            } else {
              params_1[prop] = val.length > 1 ? val : val[0];
            }
          });
          this.params = params_1;
        }
      }
      if (defaults) {
        this.setDefaults(defaults);
      }
    }
    Object.defineProperty(ConnectionString3.prototype, "host", {
      get: function() {
        var _a;
        return (_a = this.hosts) === null || _a === void 0 ? void 0 : _a[0].toString();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ConnectionString3.prototype, "hostname", {
      get: function() {
        var _a;
        return (_a = this.hosts) === null || _a === void 0 ? void 0 : _a[0].name;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ConnectionString3.prototype, "port", {
      get: function() {
        var _a;
        return (_a = this.hosts) === null || _a === void 0 ? void 0 : _a[0].port;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ConnectionString3.prototype, "type", {
      get: function() {
        var _a;
        return (_a = this.hosts) === null || _a === void 0 ? void 0 : _a[0].type;
      },
      enumerable: false,
      configurable: true
    });
    ConnectionString3.parseHost = function(host) {
      return static_1.parseHost(host, true);
    };
    ConnectionString3.prototype.toString = function(options) {
      var s = this.protocol ? this.protocol + "://" : "";
      var opts = options || {};
      if (this.user || this.password) {
        if (this.user) {
          s += static_1.encode(this.user, opts);
        }
        if (this.password) {
          s += ":";
          var h = opts.passwordHash;
          if (h) {
            var code = typeof h === "string" && h[0] || "#";
            s += code.repeat(this.password.length);
          } else {
            s += static_1.encode(this.password, opts);
          }
        }
        s += "@";
      }
      if (Array.isArray(this.hosts)) {
        s += this.hosts.map(function(h2) {
          return static_1.fullHostName(h2, options);
        }).join();
      }
      if (Array.isArray(this.path)) {
        this.path.forEach(function(seg) {
          s += "/" + static_1.encode(seg, opts);
        });
      }
      if (this.params && typeof this.params === "object") {
        var params = [];
        for (var a in this.params) {
          var value = this.params[a];
          value = Array.isArray(value) ? value : [value];
          value = value.map(function(v) {
            return static_1.encode(typeof v === "string" ? v : JSON.stringify(v), opts);
          }).join();
          if (opts.plusForSpace) {
            value = value.replace(/%20/g, "+");
          }
          params.push(static_1.encode(a, opts) + "=" + value);
        }
        if (params.length) {
          s += "?" + params.join("&");
        }
      }
      return s;
    };
    ConnectionString3.prototype.setDefaults = function(defaults) {
      if (!defaults || typeof defaults !== "object") {
        throw new TypeError(errInvalidDefaults + JSON.stringify(defaults));
      }
      if (!("protocol" in this) && static_1.hasText(defaults.protocol)) {
        this.protocol = defaults.protocol && defaults.protocol.trim();
      }
      if (Array.isArray(defaults.hosts)) {
        var hosts_1 = Array.isArray(this.hosts) ? this.hosts : [];
        var dhHosts = defaults.hosts.filter(function(d) {
          return d && typeof d === "object";
        });
        dhHosts.forEach(function(dh) {
          var dhName = static_1.hasText(dh.name) ? dh.name.trim() : void 0;
          var h = {name: dhName, port: dh.port, type: dh.type};
          var found = false;
          for (var i = 0; i < hosts_1.length; i++) {
            var thisHost = static_1.fullHostName(hosts_1[i]), defHost = static_1.fullHostName(h);
            if (thisHost.toLowerCase() === defHost.toLowerCase()) {
              found = true;
              break;
            }
          }
          if (!found) {
            var obj_1 = {};
            if (h.name) {
              if (h.type && h.type in types_1.HostType) {
                obj_1.name = h.name;
                obj_1.type = h.type;
              } else {
                var t = static_1.parseHost(h.name, true);
                if (t) {
                  obj_1.name = t.name;
                  obj_1.type = t.type;
                }
              }
            }
            var p = h.port;
            if (typeof p === "number" && p > 0 && p < 65536) {
              obj_1.port = p;
            }
            if (obj_1.name || obj_1.port) {
              Object.defineProperty(obj_1, "toString", {
                value: function(options) {
                  return static_1.fullHostName(obj_1, options);
                }
              });
              hosts_1.push(obj_1);
            }
          }
        });
        if (hosts_1.length) {
          this.hosts = hosts_1;
        }
      }
      if (!("user" in this) && static_1.hasText(defaults.user)) {
        this.user = defaults.user.trim();
      }
      if (!("password" in this) && static_1.hasText(defaults.password)) {
        this.password = defaults.password.trim();
      }
      if (!("path" in this) && Array.isArray(defaults.path)) {
        var s = defaults.path.filter(static_1.hasText);
        if (s.length) {
          this.path = s;
        }
      }
      if (defaults.params && typeof defaults.params === "object") {
        var keys = Object.keys(defaults.params);
        if (keys.length) {
          if (this.params && typeof this.params === "object") {
            for (var a in defaults.params) {
              if (!(a in this.params)) {
                this.params[a] = defaults.params[a];
              }
            }
          } else {
            this.params = {};
            for (var b in defaults.params) {
              this.params[b] = defaults.params[b];
            }
          }
        }
      }
      return this;
    };
    return ConnectionString3;
  }();
  exports.ConnectionString = ConnectionString2;
  (function() {
    ["setDefaults", "toString"].forEach(function(prop) {
      var desc = Object.getOwnPropertyDescriptor(ConnectionString2.prototype, prop);
      desc.enumerable = false;
      Object.defineProperty(ConnectionString2.prototype, prop, desc);
    });
    var inspecting = false;
    if (util_1.inspect.custom) {
      Object.defineProperty(ConnectionString2.prototype, util_1.inspect.custom, {
        value: function() {
          if (inspecting) {
            return this;
          }
          inspecting = true;
          var options = {colors: process.stdout.isTTY};
          var src = util_1.inspect(this, options);
          var _a = this, host = _a.host, hostname = _a.hostname, port = _a.port, type = _a.type;
          var vp = util_1.inspect({host, hostname, port, type}, options);
          inspecting = false;
          return "" + src + os_1.EOL + "Virtual Properties: " + vp;
        }
      });
    }
  })();
});

// node_modules/connection-string/dist/index.js
var require_dist2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.HostType = exports.ConnectionString = void 0;
  var main_1 = require_main();
  Object.defineProperty(exports, "ConnectionString", {enumerable: true, get: function() {
    return main_1.ConnectionString;
  }});
  var types_1 = require_types();
  Object.defineProperty(exports, "HostType", {enumerable: true, get: function() {
    return types_1.HostType;
  }});
});

// index.ts
import http2 from "http";

// node_modules/node-fetch/lib/index.mjs
import Stream from "stream";
import http from "http";
import Url from "url";
import https from "https";
import zlib from "zlib";
var Readable = Stream.Readable;
var BUFFER = Symbol("buffer");
var TYPE = Symbol("type");
var Blob = class {
  constructor() {
    this[TYPE] = "";
    const blobParts = arguments[0];
    const options = arguments[1];
    const buffers = [];
    let size = 0;
    if (blobParts) {
      const a = blobParts;
      const length = Number(a.length);
      for (let i = 0; i < length; i++) {
        const element = a[i];
        let buffer;
        if (element instanceof Buffer) {
          buffer = element;
        } else if (ArrayBuffer.isView(element)) {
          buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
        } else if (element instanceof ArrayBuffer) {
          buffer = Buffer.from(element);
        } else if (element instanceof Blob) {
          buffer = element[BUFFER];
        } else {
          buffer = Buffer.from(typeof element === "string" ? element : String(element));
        }
        size += buffer.length;
        buffers.push(buffer);
      }
    }
    this[BUFFER] = Buffer.concat(buffers);
    let type = options && options.type !== void 0 && String(options.type).toLowerCase();
    if (type && !/[^\u0020-\u007E]/.test(type)) {
      this[TYPE] = type;
    }
  }
  get size() {
    return this[BUFFER].length;
  }
  get type() {
    return this[TYPE];
  }
  text() {
    return Promise.resolve(this[BUFFER].toString());
  }
  arrayBuffer() {
    const buf = this[BUFFER];
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return Promise.resolve(ab);
  }
  stream() {
    const readable = new Readable();
    readable._read = function() {
    };
    readable.push(this[BUFFER]);
    readable.push(null);
    return readable;
  }
  toString() {
    return "[object Blob]";
  }
  slice() {
    const size = this.size;
    const start = arguments[0];
    const end = arguments[1];
    let relativeStart, relativeEnd;
    if (start === void 0) {
      relativeStart = 0;
    } else if (start < 0) {
      relativeStart = Math.max(size + start, 0);
    } else {
      relativeStart = Math.min(start, size);
    }
    if (end === void 0) {
      relativeEnd = size;
    } else if (end < 0) {
      relativeEnd = Math.max(size + end, 0);
    } else {
      relativeEnd = Math.min(end, size);
    }
    const span = Math.max(relativeEnd - relativeStart, 0);
    const buffer = this[BUFFER];
    const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
    const blob = new Blob([], {type: arguments[2]});
    blob[BUFFER] = slicedBuffer;
    return blob;
  }
};
Object.defineProperties(Blob.prototype, {
  size: {enumerable: true},
  type: {enumerable: true},
  slice: {enumerable: true}
});
Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
  value: "Blob",
  writable: false,
  enumerable: false,
  configurable: true
});
function FetchError(message, type, systemError) {
  Error.call(this, message);
  this.message = message;
  this.type = type;
  if (systemError) {
    this.code = this.errno = systemError.code;
  }
  Error.captureStackTrace(this, this.constructor);
}
FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = "FetchError";
var convert;
try {
  convert = require("encoding").convert;
} catch (e) {
}
var INTERNALS = Symbol("Body internals");
var PassThrough = Stream.PassThrough;
function Body(body) {
  var _this = this;
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
  let size = _ref$size === void 0 ? 0 : _ref$size;
  var _ref$timeout = _ref.timeout;
  let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
  if (body == null) {
    body = null;
  } else if (isURLSearchParams(body)) {
    body = Buffer.from(body.toString());
  } else if (isBlob(body))
    ;
  else if (Buffer.isBuffer(body))
    ;
  else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
    body = Buffer.from(body);
  } else if (ArrayBuffer.isView(body)) {
    body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  } else if (body instanceof Stream)
    ;
  else {
    body = Buffer.from(String(body));
  }
  this[INTERNALS] = {
    body,
    disturbed: false,
    error: null
  };
  this.size = size;
  this.timeout = timeout;
  if (body instanceof Stream) {
    body.on("error", function(err) {
      const error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
      _this[INTERNALS].error = error;
    });
  }
}
Body.prototype = {
  get body() {
    return this[INTERNALS].body;
  },
  get bodyUsed() {
    return this[INTERNALS].disturbed;
  },
  arrayBuffer() {
    return consumeBody.call(this).then(function(buf) {
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    });
  },
  blob() {
    let ct = this.headers && this.headers.get("content-type") || "";
    return consumeBody.call(this).then(function(buf) {
      return Object.assign(new Blob([], {
        type: ct.toLowerCase()
      }), {
        [BUFFER]: buf
      });
    });
  },
  json() {
    var _this2 = this;
    return consumeBody.call(this).then(function(buffer) {
      try {
        return JSON.parse(buffer.toString());
      } catch (err) {
        return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
      }
    });
  },
  text() {
    return consumeBody.call(this).then(function(buffer) {
      return buffer.toString();
    });
  },
  buffer() {
    return consumeBody.call(this);
  },
  textConverted() {
    var _this3 = this;
    return consumeBody.call(this).then(function(buffer) {
      return convertBody(buffer, _this3.headers);
    });
  }
};
Object.defineProperties(Body.prototype, {
  body: {enumerable: true},
  bodyUsed: {enumerable: true},
  arrayBuffer: {enumerable: true},
  blob: {enumerable: true},
  json: {enumerable: true},
  text: {enumerable: true}
});
Body.mixIn = function(proto) {
  for (const name of Object.getOwnPropertyNames(Body.prototype)) {
    if (!(name in proto)) {
      const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
      Object.defineProperty(proto, name, desc);
    }
  }
};
function consumeBody() {
  var _this4 = this;
  if (this[INTERNALS].disturbed) {
    return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
  }
  this[INTERNALS].disturbed = true;
  if (this[INTERNALS].error) {
    return Body.Promise.reject(this[INTERNALS].error);
  }
  let body = this.body;
  if (body === null) {
    return Body.Promise.resolve(Buffer.alloc(0));
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return Body.Promise.resolve(body);
  }
  if (!(body instanceof Stream)) {
    return Body.Promise.resolve(Buffer.alloc(0));
  }
  let accum = [];
  let accumBytes = 0;
  let abort = false;
  return new Body.Promise(function(resolve, reject) {
    let resTimeout;
    if (_this4.timeout) {
      resTimeout = setTimeout(function() {
        abort = true;
        reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
      }, _this4.timeout);
    }
    body.on("error", function(err) {
      if (err.name === "AbortError") {
        abort = true;
        reject(err);
      } else {
        reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
      }
    });
    body.on("data", function(chunk) {
      if (abort || chunk === null) {
        return;
      }
      if (_this4.size && accumBytes + chunk.length > _this4.size) {
        abort = true;
        reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
        return;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    });
    body.on("end", function() {
      if (abort) {
        return;
      }
      clearTimeout(resTimeout);
      try {
        resolve(Buffer.concat(accum, accumBytes));
      } catch (err) {
        reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
      }
    });
  });
}
function convertBody(buffer, headers) {
  if (typeof convert !== "function") {
    throw new Error("The package `encoding` must be installed to use the textConverted() function");
  }
  const ct = headers.get("content-type");
  let charset = "utf-8";
  let res, str;
  if (ct) {
    res = /charset=([^;]*)/i.exec(ct);
  }
  str = buffer.slice(0, 1024).toString();
  if (!res && str) {
    res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
  }
  if (!res && str) {
    res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
    if (!res) {
      res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
      if (res) {
        res.pop();
      }
    }
    if (res) {
      res = /charset=(.*)/i.exec(res.pop());
    }
  }
  if (!res && str) {
    res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
  }
  if (res) {
    charset = res.pop();
    if (charset === "gb2312" || charset === "gbk") {
      charset = "gb18030";
    }
  }
  return convert(buffer, "UTF-8", charset).toString();
}
function isURLSearchParams(obj) {
  if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
    return false;
  }
  return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
}
function isBlob(obj) {
  return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}
function clone(instance) {
  let p1, p2;
  let body = instance.body;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof Stream && typeof body.getBoundary !== "function") {
    p1 = new PassThrough();
    p2 = new PassThrough();
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS].body = p1;
    body = p2;
  }
  return body;
}
function extractContentType(body) {
  if (body === null) {
    return null;
  } else if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  } else if (isURLSearchParams(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  } else if (isBlob(body)) {
    return body.type || null;
  } else if (Buffer.isBuffer(body)) {
    return null;
  } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
    return null;
  } else if (ArrayBuffer.isView(body)) {
    return null;
  } else if (typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  } else if (body instanceof Stream) {
    return null;
  } else {
    return "text/plain;charset=UTF-8";
  }
}
function getTotalBytes(instance) {
  const body = instance.body;
  if (body === null) {
    return 0;
  } else if (isBlob(body)) {
    return body.size;
  } else if (Buffer.isBuffer(body)) {
    return body.length;
  } else if (body && typeof body.getLengthSync === "function") {
    if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
      return body.getLengthSync();
    }
    return null;
  } else {
    return null;
  }
}
function writeToStream(dest, instance) {
  const body = instance.body;
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
}
Body.Promise = global.Promise;
var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
function validateName(name) {
  name = `${name}`;
  if (invalidTokenRegex.test(name) || name === "") {
    throw new TypeError(`${name} is not a legal HTTP header name`);
  }
}
function validateValue(value) {
  value = `${value}`;
  if (invalidHeaderCharRegex.test(value)) {
    throw new TypeError(`${value} is not a legal HTTP header value`);
  }
}
function find(map, name) {
  name = name.toLowerCase();
  for (const key in map) {
    if (key.toLowerCase() === name) {
      return key;
    }
  }
  return void 0;
}
var MAP = Symbol("map");
var Headers = class {
  constructor() {
    let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
    this[MAP] = Object.create(null);
    if (init instanceof Headers) {
      const rawHeaders = init.raw();
      const headerNames = Object.keys(rawHeaders);
      for (const headerName of headerNames) {
        for (const value of rawHeaders[headerName]) {
          this.append(headerName, value);
        }
      }
      return;
    }
    if (init == null)
      ;
    else if (typeof init === "object") {
      const method = init[Symbol.iterator];
      if (method != null) {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        const pairs = [];
        for (const pair of init) {
          if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
            throw new TypeError("Each header pair must be iterable");
          }
          pairs.push(Array.from(pair));
        }
        for (const pair of pairs) {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          this.append(pair[0], pair[1]);
        }
      } else {
        for (const key of Object.keys(init)) {
          const value = init[key];
          this.append(key, value);
        }
      }
    } else {
      throw new TypeError("Provided initializer must be an object");
    }
  }
  get(name) {
    name = `${name}`;
    validateName(name);
    const key = find(this[MAP], name);
    if (key === void 0) {
      return null;
    }
    return this[MAP][key].join(", ");
  }
  forEach(callback) {
    let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
    let pairs = getHeaders(this);
    let i = 0;
    while (i < pairs.length) {
      var _pairs$i = pairs[i];
      const name = _pairs$i[0], value = _pairs$i[1];
      callback.call(thisArg, value, name, this);
      pairs = getHeaders(this);
      i++;
    }
  }
  set(name, value) {
    name = `${name}`;
    value = `${value}`;
    validateName(name);
    validateValue(value);
    const key = find(this[MAP], name);
    this[MAP][key !== void 0 ? key : name] = [value];
  }
  append(name, value) {
    name = `${name}`;
    value = `${value}`;
    validateName(name);
    validateValue(value);
    const key = find(this[MAP], name);
    if (key !== void 0) {
      this[MAP][key].push(value);
    } else {
      this[MAP][name] = [value];
    }
  }
  has(name) {
    name = `${name}`;
    validateName(name);
    return find(this[MAP], name) !== void 0;
  }
  delete(name) {
    name = `${name}`;
    validateName(name);
    const key = find(this[MAP], name);
    if (key !== void 0) {
      delete this[MAP][key];
    }
  }
  raw() {
    return this[MAP];
  }
  keys() {
    return createHeadersIterator(this, "key");
  }
  values() {
    return createHeadersIterator(this, "value");
  }
  [Symbol.iterator]() {
    return createHeadersIterator(this, "key+value");
  }
};
Headers.prototype.entries = Headers.prototype[Symbol.iterator];
Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
  value: "Headers",
  writable: false,
  enumerable: false,
  configurable: true
});
Object.defineProperties(Headers.prototype, {
  get: {enumerable: true},
  forEach: {enumerable: true},
  set: {enumerable: true},
  append: {enumerable: true},
  has: {enumerable: true},
  delete: {enumerable: true},
  keys: {enumerable: true},
  values: {enumerable: true},
  entries: {enumerable: true}
});
function getHeaders(headers) {
  let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
  const keys = Object.keys(headers[MAP]).sort();
  return keys.map(kind === "key" ? function(k) {
    return k.toLowerCase();
  } : kind === "value" ? function(k) {
    return headers[MAP][k].join(", ");
  } : function(k) {
    return [k.toLowerCase(), headers[MAP][k].join(", ")];
  });
}
var INTERNAL = Symbol("internal");
function createHeadersIterator(target, kind) {
  const iterator = Object.create(HeadersIteratorPrototype);
  iterator[INTERNAL] = {
    target,
    kind,
    index: 0
  };
  return iterator;
}
var HeadersIteratorPrototype = Object.setPrototypeOf({
  next() {
    if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
      throw new TypeError("Value of `this` is not a HeadersIterator");
    }
    var _INTERNAL = this[INTERNAL];
    const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
    const values = getHeaders(target, kind);
    const len = values.length;
    if (index >= len) {
      return {
        value: void 0,
        done: true
      };
    }
    this[INTERNAL].index = index + 1;
    return {
      value: values[index],
      done: false
    };
  }
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
  value: "HeadersIterator",
  writable: false,
  enumerable: false,
  configurable: true
});
function exportNodeCompatibleHeaders(headers) {
  const obj = Object.assign({__proto__: null}, headers[MAP]);
  const hostHeaderKey = find(headers[MAP], "Host");
  if (hostHeaderKey !== void 0) {
    obj[hostHeaderKey] = obj[hostHeaderKey][0];
  }
  return obj;
}
function createHeadersLenient(obj) {
  const headers = new Headers();
  for (const name of Object.keys(obj)) {
    if (invalidTokenRegex.test(name)) {
      continue;
    }
    if (Array.isArray(obj[name])) {
      for (const val of obj[name]) {
        if (invalidHeaderCharRegex.test(val)) {
          continue;
        }
        if (headers[MAP][name] === void 0) {
          headers[MAP][name] = [val];
        } else {
          headers[MAP][name].push(val);
        }
      }
    } else if (!invalidHeaderCharRegex.test(obj[name])) {
      headers[MAP][name] = [obj[name]];
    }
  }
  return headers;
}
var INTERNALS$1 = Symbol("Response internals");
var STATUS_CODES = http.STATUS_CODES;
var Response = class {
  constructor() {
    let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    Body.call(this, body, opts);
    const status = opts.status || 200;
    const headers = new Headers(opts.headers);
    if (body != null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: opts.url,
      status,
      statusText: opts.statusText || STATUS_CODES[status],
      headers,
      counter: opts.counter
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  clone() {
    return new Response(clone(this), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected
    });
  }
};
Body.mixIn(Response.prototype);
Object.defineProperties(Response.prototype, {
  url: {enumerable: true},
  status: {enumerable: true},
  ok: {enumerable: true},
  redirected: {enumerable: true},
  statusText: {enumerable: true},
  headers: {enumerable: true},
  clone: {enumerable: true}
});
Object.defineProperty(Response.prototype, Symbol.toStringTag, {
  value: "Response",
  writable: false,
  enumerable: false,
  configurable: true
});
var INTERNALS$2 = Symbol("Request internals");
var parse_url = Url.parse;
var format_url = Url.format;
var streamDestructionSupported = "destroy" in Stream.Readable.prototype;
function isRequest(input) {
  return typeof input === "object" && typeof input[INTERNALS$2] === "object";
}
function isAbortSignal(signal) {
  const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
  return !!(proto && proto.constructor.name === "AbortSignal");
}
var Request = class {
  constructor(input) {
    let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let parsedURL;
    if (!isRequest(input)) {
      if (input && input.href) {
        parsedURL = parse_url(input.href);
      } else {
        parsedURL = parse_url(`${input}`);
      }
      input = {};
    } else {
      parsedURL = parse_url(input.url);
    }
    let method = init.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
    Body.call(this, inputBody, {
      timeout: init.timeout || input.timeout || 0,
      size: init.size || input.size || 0
    });
    const headers = new Headers(init.headers || input.headers || {});
    if (inputBody != null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init)
      signal = init.signal;
    if (signal != null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS$2] = {
      method,
      redirect: init.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20;
    this.compress = init.compress !== void 0 ? init.compress : input.compress !== void 0 ? input.compress : true;
    this.counter = init.counter || input.counter || 0;
    this.agent = init.agent || input.agent;
  }
  get method() {
    return this[INTERNALS$2].method;
  }
  get url() {
    return format_url(this[INTERNALS$2].parsedURL);
  }
  get headers() {
    return this[INTERNALS$2].headers;
  }
  get redirect() {
    return this[INTERNALS$2].redirect;
  }
  get signal() {
    return this[INTERNALS$2].signal;
  }
  clone() {
    return new Request(this);
  }
};
Body.mixIn(Request.prototype);
Object.defineProperty(Request.prototype, Symbol.toStringTag, {
  value: "Request",
  writable: false,
  enumerable: false,
  configurable: true
});
Object.defineProperties(Request.prototype, {
  method: {enumerable: true},
  url: {enumerable: true},
  headers: {enumerable: true},
  redirect: {enumerable: true},
  clone: {enumerable: true},
  signal: {enumerable: true}
});
function getNodeRequestOptions(request) {
  const parsedURL = request[INTERNALS$2].parsedURL;
  const headers = new Headers(request[INTERNALS$2].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  if (!parsedURL.protocol || !parsedURL.hostname) {
    throw new TypeError("Only absolute URLs are supported");
  }
  if (!/^https?:$/.test(parsedURL.protocol)) {
    throw new TypeError("Only HTTP(S) protocols are supported");
  }
  if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
    throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
  }
  let contentLengthValue = null;
  if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body != null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number") {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate");
  }
  let agent = request.agent;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  return Object.assign({}, parsedURL, {
    method: request.method,
    headers: exportNodeCompatibleHeaders(headers),
    agent
  });
}
function AbortError(message) {
  Error.call(this, message);
  this.type = "aborted";
  this.message = message;
  Error.captureStackTrace(this, this.constructor);
}
AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = "AbortError";
var PassThrough$1 = Stream.PassThrough;
var resolve_url = Url.resolve;
function fetch(url, opts) {
  if (!fetch.Promise) {
    throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
  }
  Body.Promise = fetch.Promise;
  return new fetch.Promise(function(resolve, reject) {
    const request = new Request(url, opts);
    const options = getNodeRequestOptions(request);
    const send = (options.protocol === "https:" ? https : http).request;
    const signal = request.signal;
    let response = null;
    const abort = function abort2() {
      let error = new AbortError("The user aborted a request.");
      reject(error);
      if (request.body && request.body instanceof Stream.Readable) {
        request.body.destroy(error);
      }
      if (!response || !response.body)
        return;
      response.body.emit("error", error);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = function abortAndFinalize2() {
      abort();
      finalize();
    };
    const req = send(options);
    let reqTimeout;
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    function finalize() {
      req.abort();
      if (signal)
        signal.removeEventListener("abort", abortAndFinalize);
      clearTimeout(reqTimeout);
    }
    if (request.timeout) {
      req.once("socket", function(socket) {
        reqTimeout = setTimeout(function() {
          reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
          finalize();
        }, request.timeout);
      });
    }
    req.on("error", function(err) {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    req.on("response", function(res) {
      clearTimeout(reqTimeout);
      const headers = createHeadersLenient(res.headers);
      if (fetch.isRedirect(res.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : resolve_url(request.url, location);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (err) {
                reject(err);
              }
            }
            break;
          case "follow":
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOpts = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              timeout: request.timeout,
              size: request.size
            };
            if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
              requestOpts.method = "GET";
              requestOpts.body = void 0;
              requestOpts.headers.delete("content-length");
            }
            resolve(fetch(new Request(locationURL, requestOpts)));
            finalize();
            return;
        }
      }
      res.once("end", function() {
        if (signal)
          signal.removeEventListener("abort", abortAndFinalize);
      });
      let body = res.pipe(new PassThrough$1());
      const response_options = {
        url: request.url,
        status: res.statusCode,
        statusText: res.statusMessage,
        headers,
        size: request.size,
        timeout: request.timeout,
        counter: request.counter
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
        response = new Response(body, response_options);
        resolve(response);
        return;
      }
      const zlibOptions = {
        flush: zlib.Z_SYNC_FLUSH,
        finishFlush: zlib.Z_SYNC_FLUSH
      };
      if (codings == "gzip" || codings == "x-gzip") {
        body = body.pipe(zlib.createGunzip(zlibOptions));
        response = new Response(body, response_options);
        resolve(response);
        return;
      }
      if (codings == "deflate" || codings == "x-deflate") {
        const raw = res.pipe(new PassThrough$1());
        raw.once("data", function(chunk) {
          if ((chunk[0] & 15) === 8) {
            body = body.pipe(zlib.createInflate());
          } else {
            body = body.pipe(zlib.createInflateRaw());
          }
          response = new Response(body, response_options);
          resolve(response);
        });
        return;
      }
      if (codings == "br" && typeof zlib.createBrotliDecompress === "function") {
        body = body.pipe(zlib.createBrotliDecompress());
        response = new Response(body, response_options);
        resolve(response);
        return;
      }
      response = new Response(body, response_options);
      resolve(response);
    });
    writeToStream(req, request);
  });
}
fetch.isRedirect = function(code) {
  return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};
fetch.Promise = global.Promise;
var lib_default = fetch;

// src/logging.ts
var import_pino = __toModule(require_pino());
var logger = import_pino.default();
var logging_default = logger;

// src/pages/pagesContext.ts
var import_node_dir = __toModule(require_node_dir());
var buildPagesContext = async (directory, pattern) => {
  try {
    const files = await import_node_dir.default.promiseFiles(directory);
    return files.filter((fileName) => !pattern.test(fileName));
  } catch (error) {
    logging_default.error(error);
  }
  return [];
};
var pagesContext_default = buildPagesContext;

// src/pages/index.ts
import fs from "fs";
var DYNAMIC_PAGE = new RegExp("\\[(\\w+)\\]", "g");
function resolvePagePath(pagePath, keys) {
  const pagesMap = keys.map((page2) => {
    let test = page2;
    let parts = [];
    test = test.replace("/", "\\/").replace(/^\./, "").replace(/\.(js|jsx|ts|tsx|graphql)$/, "");
    return {
      page: page2,
      pagePath: page2.replace(/^\./, "").replace(/\.(js|jsx|ts|tsx|graphql)$/, ""),
      parts,
      test: new RegExp("^" + test + "$", "")
    };
  });
  let page = pagesMap.find((p) => p.pagePath.indexOf(pagePath) >= 0);
  if (!page) {
    pagesMap.sort((a) => a.page.includes("index") ? -1 : 1);
    page = pagesMap.find((p) => p.test.test(pagePath));
  }
  if (!page) {
    page = pagesMap.find((p) => p.test.test(pagePath + "/index"));
  }
  if (!page)
    return null;
  return page;
}
async function getPage(pagePath, context, isGraphQL = false) {
  try {
    const resolvedPage = resolvePagePath(pagePath, context);
    if (!resolvedPage) {
      return null;
    }
    if (isGraphQL) {
      const query = await fs.promises.readFile(resolvedPage.page, "utf-8");
      return {
        ...resolvedPage,
        context: query
      };
    }
    const pageContext = await import(resolvedPage.page);
    return {
      ...resolvedPage,
      context: pageContext
    };
  } catch (e) {
    logging_default.error(e);
  }
}

// src/cache/implementations/RedisCache.ts
var import_handy_redis = __toModule(require_dist());
var import_connection_string = __toModule(require_dist2());
var RedisCache = class {
  constructor() {
    if (process.env.REDIS_HOST) {
      this.cache = import_handy_redis.createNodeRedisClient({});
    } else if (process.env.FLY_REDIS_CACHE_URL) {
      const redisCredentials = new import_connection_string.ConnectionString(process.env.FLY_REDIS_CACHE_URL);
      this.cache = import_handy_redis.createNodeRedisClient({
        host: redisCredentials.hosts[0].name,
        port: redisCredentials.hosts[0].port,
        password: redisCredentials.password
      });
    }
  }
  async get(key) {
    const result = await this.cache.get(`${key}:`);
    return JSON.parse(result);
  }
  async put(key, value) {
    await this.cache.set(key, JSON.stringify(value));
    return;
  }
};
var RedisCache_default = RedisCache;

// src/cache/functions.ts
function getDocumentDefinitions(definitions) {
  let operationDefinition = void 0;
  const fragmentMap = {};
  for (const definition of definitions) {
    switch (definition.kind) {
      case "OperationDefinition":
        operationDefinition = definition;
        break;
      case "FragmentDefinition":
        fragmentMap[definition.name.value] = definition;
        break;
      default:
        throw new Error("This is not an executable document");
    }
  }
  const rootFieldNode = {
    kind: "Field",
    name: {
      kind: "Name",
      value: "data"
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: operationDefinition.selectionSet.selections
    }
  };
  return [fragmentMap, rootFieldNode];
}
function expandFragments(resolveType, obj, selectionNodes, fragmentMap) {
  const fieldNodes = [];
  for (const selectionNode of selectionNodes) {
    switch (selectionNode.kind) {
      case "Field":
        fieldNodes.push(selectionNode);
        break;
      case "InlineFragment": {
        const fragmentTypeName = selectionNode.typeCondition && selectionNode.typeCondition.name.value;
        const objTypeName = resolveType(obj);
        if (fragmentTypeName === objTypeName) {
          fieldNodes.push(...expandFragments(resolveType, obj, selectionNode.selectionSet.selections, fragmentMap));
        }
        break;
      }
      case "FragmentSpread": {
        const fragment = fragmentMap[selectionNode.name.value];
        const fragmentTypeName = fragment.typeCondition && fragment.typeCondition.name.value;
        const objTypeName = resolveType(obj);
        if (fragmentTypeName === objTypeName) {
          fieldNodes.push(...expandFragments(resolveType, obj, fragment.selectionSet.selections, fragmentMap));
        }
        break;
      }
      default:
        throw new Error("Unknown selection node field kind: " + selectionNode.kind);
    }
  }
  return fieldNodes;
}
function resolveValueNode(valueNode, variables) {
  switch (valueNode.kind) {
    case "Variable":
      return variables[valueNode.name.value];
    case "NullValue":
      return null;
    case "ListValue":
      return valueNode.values.map((f) => resolveValueNode(f, variables));
    case "ObjectValue":
      const valueObject = {};
      for (const field of valueNode.fields) {
        valueObject[field.name.value] = resolveValueNode(field.value, variables);
      }
      return valueObject;
    default:
      return valueNode.value;
  }
}
function fieldNameWithArguments(fieldNode, variables) {
  const argumentsObject = {};
  for (const argumentNode of fieldNode.arguments) {
    argumentsObject[argumentNode.name.value] = resolveValueNode(argumentNode.value, variables);
  }
  const hashedArgs = JSON.stringify(argumentsObject);
  return fieldNode.name.value + "(" + hashedArgs + ")";
}
var defaultGetObjectId = (object) => {
  return object.id === void 0 ? void 0 : `${object.__typename}:${object.id}`;
};
var defaultResolveType = (object) => {
  if (object.__typename === void 0) {
    throw new Error("__typename cannot be undefined.");
  }
  return object.__typename;
};
function shouldIncludeField(directives, variables = {}) {
  let finalInclude = true;
  for (const directive of directives) {
    let directiveInclude = true;
    if (directive.name.value === "skip" || directive.name.value === "include") {
      if (directive.arguments) {
        for (const arg of directive.arguments) {
          if (arg.name.value === "if") {
            let argValue;
            if (arg.value.kind === "Variable") {
              argValue = variables && !!variables[arg.value.name.value];
            } else if (arg.value.kind === "BooleanValue") {
              argValue = arg.value.value;
            } else {
              throw new Error(`The if argument must be of type Boolean!, found '${arg.value.kind}'`);
            }
            const argInclude = directive.name.value === "include" ? argValue : !argValue;
            directiveInclude = directiveInclude && argInclude;
          }
        }
      }
      finalInclude = finalInclude && directiveInclude;
    }
  }
  return finalInclude;
}

// src/cache/normalize.ts
function normalize(query, variables, data, getObjectId = defaultGetObjectId, resolveType = defaultResolveType) {
  const [fragmentMap, rootFieldNode] = getDocumentDefinitions(query.definitions);
  const stack = [];
  const normMap = Object.create(null);
  stack.push([rootFieldNode, Object.create(null), data, "ROOT_QUERY"]);
  let getObjectIdToUse = (_) => "ROOT_QUERY";
  let firstIteration = true;
  while (stack.length > 0) {
    const [
      fieldNode,
      parentNormObjOrArray,
      responseObjectOrArray,
      fallbackId
    ] = stack.pop();
    let keyOrNewParentArray = null;
    if (!responseObjectOrArray) {
      keyOrNewParentArray = null;
    } else if (!Array.isArray(responseObjectOrArray)) {
      const responseObject = responseObjectOrArray;
      const objectToIdResult = getObjectIdToUse(responseObject);
      keyOrNewParentArray = objectToIdResult ? objectToIdResult : fallbackId;
      let normObj = normMap[keyOrNewParentArray];
      if (!normObj) {
        normObj = Object.create(null);
        normMap[keyOrNewParentArray] = normObj;
      }
      const expandedSelections = expandFragments(resolveType, responseObjectOrArray, fieldNode.selectionSet.selections, fragmentMap);
      for (const field of expandedSelections) {
        const include = field.directives ? shouldIncludeField(field.directives, variables) : true;
        if (include) {
          const responseFieldValue = responseObject[field.alias && field.alias.value || field.name.value];
          const normFieldName = field.arguments && field.arguments.length > 0 ? fieldNameWithArguments(field, variables) : field.name.value;
          if (responseFieldValue !== null && field.selectionSet) {
            stack.push([
              field,
              normObj,
              responseFieldValue,
              keyOrNewParentArray + "." + normFieldName
            ]);
          } else {
            normObj[normFieldName] = responseFieldValue;
          }
        }
      }
    } else {
      const responseArray = responseObjectOrArray;
      keyOrNewParentArray = [];
      for (let i = 0; i < responseArray.length; i++) {
        console.log(JSON.stringify(responseArray[i]));
        stack.push([
          fieldNode,
          keyOrNewParentArray,
          responseArray[i],
          fallbackId + "." + i.toString()
        ]);
      }
    }
    if (Array.isArray(parentNormObjOrArray)) {
      const parentArray = parentNormObjOrArray;
      parentArray.unshift(keyOrNewParentArray);
    } else {
      const key = fieldNode.arguments && fieldNode.arguments.length > 0 ? fieldNameWithArguments(fieldNode, variables) : fieldNode.name.value;
      const parentNormObj = parentNormObjOrArray;
      parentNormObj[key] = keyOrNewParentArray;
    }
    if (firstIteration) {
      getObjectIdToUse = getObjectId;
      firstIteration = false;
    }
  }
  return normMap;
}

// src/cache/denormalize.ts
async function denormalize(query, variables, normMap, resolveType = defaultResolveType) {
  const [fragmentMap, rootFieldNode] = getDocumentDefinitions(query.definitions);
  const stack = [];
  const response = {};
  const usedFieldsMap = {};
  stack.push([
    rootFieldNode,
    "ROOT_QUERY",
    response,
    void 0,
    "ROOT_QUERY",
    "ROOT_QUERY"
  ]);
  while (stack.length > 0) {
    const [
      fieldNode,
      idOrIdArray,
      parentObjectOrArray,
      parentResponseKey,
      parentNormKey,
      fieldNameInParent
    ] = stack.pop();
    let responseObjectOrNewParentArray;
    if (idOrIdArray === null) {
      responseObjectOrNewParentArray = null;
    } else if (!Array.isArray(idOrIdArray)) {
      const key = idOrIdArray;
      console.log(key);
      const normObj = await normMap.get(key);
      if (normObj === void 0) {
        return {
          data: void 0,
          fields: {[parentNormKey]: new Set([fieldNameInParent])}
        };
      }
      let usedFields = usedFieldsMap[key];
      if (usedFields === void 0) {
        usedFields = new Set();
        usedFieldsMap[key] = usedFields;
      }
      if (Array.isArray(parentObjectOrArray)) {
        responseObjectOrNewParentArray = parentObjectOrArray[parentResponseKey] || Object.create(null);
      } else {
        responseObjectOrNewParentArray = parentObjectOrArray[parentResponseKey] || Object.create(null);
      }
      const expandedSelections = expandFragments(resolveType, normObj, fieldNode.selectionSet.selections, fragmentMap);
      for (const field of expandedSelections) {
        const include = field.directives ? shouldIncludeField(field.directives, variables) : true;
        if (include) {
          const fieldName = field.arguments && field.arguments.length > 0 ? fieldNameWithArguments(field, variables) : field.name.value;
          usedFields.add(fieldName);
          const normObjValue = normObj[fieldName];
          if (normObjValue !== null && field.selectionSet) {
            stack.push([
              field,
              normObjValue,
              responseObjectOrNewParentArray,
              field.alias && field.alias.value || field.name.value,
              key,
              fieldName
            ]);
          } else {
            if (normObjValue !== void 0) {
              ;
              responseObjectOrNewParentArray[field.alias && field.alias.value || field.name.value] = normObjValue;
            } else {
              return {
                data: void 0,
                fields: {[key]: new Set([fieldName])}
              };
            }
          }
        }
      }
    } else {
      const idArray = idOrIdArray;
      responseObjectOrNewParentArray = parentObjectOrArray[parentResponseKey] || [];
      for (let i = 0; i < idArray.length; i++) {
        const idArrayItem = idArray[i];
        stack.push([
          fieldNode,
          idArrayItem,
          responseObjectOrNewParentArray,
          i,
          parentNormKey,
          fieldNameInParent
        ]);
      }
    }
    if (Array.isArray(parentObjectOrArray)) {
      const parentArray = parentObjectOrArray;
      parentArray[parentResponseKey] = responseObjectOrNewParentArray;
    } else {
      const parentObject = parentObjectOrArray;
      parentObject[parentResponseKey || fieldNode.alias && fieldNode.alias.value || fieldNode.name.value] = responseObjectOrNewParentArray;
    }
  }
  const data = response.data;
  return {
    data,
    fields: usedFieldsMap
  };
}

// src/cache/norm-map.ts
async function merge(normMap, newNormMap) {
  for (const key of Object.keys(newNormMap)) {
    let updatedNormMap = {};
    const current = await normMap.get(key);
    updatedNormMap = {
      ...current || {},
      ...newNormMap[key]
    };
    normMap.put(key, updatedNormMap);
  }
}

// node_modules/graphql/jsutils/isObjectLike.mjs
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof4(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof4(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function isObjectLike(value) {
  return _typeof(value) == "object" && value !== null;
}

// node_modules/graphql/polyfills/symbols.mjs
var SYMBOL_ITERATOR = typeof Symbol === "function" && Symbol.iterator != null ? Symbol.iterator : "@@iterator";
var SYMBOL_ASYNC_ITERATOR = typeof Symbol === "function" && Symbol.asyncIterator != null ? Symbol.asyncIterator : "@@asyncIterator";
var SYMBOL_TO_STRING_TAG = typeof Symbol === "function" && Symbol.toStringTag != null ? Symbol.toStringTag : "@@toStringTag";

// node_modules/graphql/language/location.mjs
function getLocation(source, position) {
  var lineRegexp = /\r\n|[\n\r]/g;
  var line = 1;
  var column = position + 1;
  var match;
  while ((match = lineRegexp.exec(source.body)) && match.index < position) {
    line += 1;
    column = position + 1 - (match.index + match[0].length);
  }
  return {
    line,
    column
  };
}

// node_modules/graphql/language/printLocation.mjs
function printLocation(location) {
  return printSourceLocation(location.source, getLocation(location.source, location.start));
}
function printSourceLocation(source, sourceLocation) {
  var firstLineColumnOffset = source.locationOffset.column - 1;
  var body = whitespace(firstLineColumnOffset) + source.body;
  var lineIndex = sourceLocation.line - 1;
  var lineOffset = source.locationOffset.line - 1;
  var lineNum = sourceLocation.line + lineOffset;
  var columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  var columnNum = sourceLocation.column + columnOffset;
  var locationStr = "".concat(source.name, ":").concat(lineNum, ":").concat(columnNum, "\n");
  var lines = body.split(/\r\n|[\n\r]/g);
  var locationLine = lines[lineIndex];
  if (locationLine.length > 120) {
    var subLineIndex = Math.floor(columnNum / 80);
    var subLineColumnNum = columnNum % 80;
    var subLines = [];
    for (var i = 0; i < locationLine.length; i += 80) {
      subLines.push(locationLine.slice(i, i + 80));
    }
    return locationStr + printPrefixedLines([["".concat(lineNum), subLines[0]]].concat(subLines.slice(1, subLineIndex + 1).map(function(subLine) {
      return ["", subLine];
    }), [[" ", whitespace(subLineColumnNum - 1) + "^"], ["", subLines[subLineIndex + 1]]]));
  }
  return locationStr + printPrefixedLines([
    ["".concat(lineNum - 1), lines[lineIndex - 1]],
    ["".concat(lineNum), locationLine],
    ["", whitespace(columnNum - 1) + "^"],
    ["".concat(lineNum + 1), lines[lineIndex + 1]]
  ]);
}
function printPrefixedLines(lines) {
  var existingLines = lines.filter(function(_ref) {
    var _ = _ref[0], line = _ref[1];
    return line !== void 0;
  });
  var padLen = Math.max.apply(Math, existingLines.map(function(_ref2) {
    var prefix = _ref2[0];
    return prefix.length;
  }));
  return existingLines.map(function(_ref3) {
    var prefix = _ref3[0], line = _ref3[1];
    return leftPad(padLen, prefix) + (line ? " | " + line : " |");
  }).join("\n");
}
function whitespace(len) {
  return Array(len + 1).join(" ");
}
function leftPad(len, str) {
  return whitespace(len - str.length) + str;
}

// node_modules/graphql/error/GraphQLError.mjs
function _typeof2(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof2 = function _typeof4(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof2 = function _typeof4(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof2(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  if (superClass)
    _setPrototypeOf(subClass, superClass);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof2(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2))
      return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2))
        return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, {constructor: {value: Wrapper, enumerable: false, writable: true, configurable: true}});
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
var GraphQLError = /* @__PURE__ */ function(_Error) {
  _inherits(GraphQLError2, _Error);
  var _super = _createSuper(GraphQLError2);
  function GraphQLError2(message, nodes, source, positions, path, originalError, extensions) {
    var _locations2, _source2, _positions2, _extensions2;
    var _this;
    _classCallCheck(this, GraphQLError2);
    _this = _super.call(this, message);
    var _nodes = Array.isArray(nodes) ? nodes.length !== 0 ? nodes : void 0 : nodes ? [nodes] : void 0;
    var _source = source;
    if (!_source && _nodes) {
      var _nodes$0$loc;
      _source = (_nodes$0$loc = _nodes[0].loc) === null || _nodes$0$loc === void 0 ? void 0 : _nodes$0$loc.source;
    }
    var _positions = positions;
    if (!_positions && _nodes) {
      _positions = _nodes.reduce(function(list, node) {
        if (node.loc) {
          list.push(node.loc.start);
        }
        return list;
      }, []);
    }
    if (_positions && _positions.length === 0) {
      _positions = void 0;
    }
    var _locations;
    if (positions && source) {
      _locations = positions.map(function(pos) {
        return getLocation(source, pos);
      });
    } else if (_nodes) {
      _locations = _nodes.reduce(function(list, node) {
        if (node.loc) {
          list.push(getLocation(node.loc.source, node.loc.start));
        }
        return list;
      }, []);
    }
    var _extensions = extensions;
    if (_extensions == null && originalError != null) {
      var originalExtensions = originalError.extensions;
      if (isObjectLike(originalExtensions)) {
        _extensions = originalExtensions;
      }
    }
    Object.defineProperties(_assertThisInitialized(_this), {
      name: {
        value: "GraphQLError"
      },
      message: {
        value: message,
        enumerable: true,
        writable: true
      },
      locations: {
        value: (_locations2 = _locations) !== null && _locations2 !== void 0 ? _locations2 : void 0,
        enumerable: _locations != null
      },
      path: {
        value: path !== null && path !== void 0 ? path : void 0,
        enumerable: path != null
      },
      nodes: {
        value: _nodes !== null && _nodes !== void 0 ? _nodes : void 0
      },
      source: {
        value: (_source2 = _source) !== null && _source2 !== void 0 ? _source2 : void 0
      },
      positions: {
        value: (_positions2 = _positions) !== null && _positions2 !== void 0 ? _positions2 : void 0
      },
      originalError: {
        value: originalError
      },
      extensions: {
        value: (_extensions2 = _extensions) !== null && _extensions2 !== void 0 ? _extensions2 : void 0,
        enumerable: _extensions != null
      }
    });
    if (originalError === null || originalError === void 0 ? void 0 : originalError.stack) {
      Object.defineProperty(_assertThisInitialized(_this), "stack", {
        value: originalError.stack,
        writable: true,
        configurable: true
      });
      return _possibleConstructorReturn(_this);
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(_assertThisInitialized(_this), GraphQLError2);
    } else {
      Object.defineProperty(_assertThisInitialized(_this), "stack", {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }
    return _this;
  }
  _createClass(GraphQLError2, [{
    key: "toString",
    value: function toString() {
      return printError(this);
    }
  }, {
    key: SYMBOL_TO_STRING_TAG,
    get: function get() {
      return "Object";
    }
  }]);
  return GraphQLError2;
}(/* @__PURE__ */ _wrapNativeSuper(Error));
function printError(error) {
  var output = error.message;
  if (error.nodes) {
    for (var _i2 = 0, _error$nodes2 = error.nodes; _i2 < _error$nodes2.length; _i2++) {
      var node = _error$nodes2[_i2];
      if (node.loc) {
        output += "\n\n" + printLocation(node.loc);
      }
    }
  } else if (error.source && error.locations) {
    for (var _i4 = 0, _error$locations2 = error.locations; _i4 < _error$locations2.length; _i4++) {
      var location = _error$locations2[_i4];
      output += "\n\n" + printSourceLocation(error.source, location);
    }
  }
  return output;
}

// node_modules/graphql/error/syntaxError.mjs
function syntaxError(source, position, description) {
  return new GraphQLError("Syntax Error: ".concat(description), void 0, source, [position]);
}

// node_modules/graphql/language/kinds.mjs
var Kind = Object.freeze({
  NAME: "Name",
  DOCUMENT: "Document",
  OPERATION_DEFINITION: "OperationDefinition",
  VARIABLE_DEFINITION: "VariableDefinition",
  SELECTION_SET: "SelectionSet",
  FIELD: "Field",
  ARGUMENT: "Argument",
  FRAGMENT_SPREAD: "FragmentSpread",
  INLINE_FRAGMENT: "InlineFragment",
  FRAGMENT_DEFINITION: "FragmentDefinition",
  VARIABLE: "Variable",
  INT: "IntValue",
  FLOAT: "FloatValue",
  STRING: "StringValue",
  BOOLEAN: "BooleanValue",
  NULL: "NullValue",
  ENUM: "EnumValue",
  LIST: "ListValue",
  OBJECT: "ObjectValue",
  OBJECT_FIELD: "ObjectField",
  DIRECTIVE: "Directive",
  NAMED_TYPE: "NamedType",
  LIST_TYPE: "ListType",
  NON_NULL_TYPE: "NonNullType",
  SCHEMA_DEFINITION: "SchemaDefinition",
  OPERATION_TYPE_DEFINITION: "OperationTypeDefinition",
  SCALAR_TYPE_DEFINITION: "ScalarTypeDefinition",
  OBJECT_TYPE_DEFINITION: "ObjectTypeDefinition",
  FIELD_DEFINITION: "FieldDefinition",
  INPUT_VALUE_DEFINITION: "InputValueDefinition",
  INTERFACE_TYPE_DEFINITION: "InterfaceTypeDefinition",
  UNION_TYPE_DEFINITION: "UnionTypeDefinition",
  ENUM_TYPE_DEFINITION: "EnumTypeDefinition",
  ENUM_VALUE_DEFINITION: "EnumValueDefinition",
  INPUT_OBJECT_TYPE_DEFINITION: "InputObjectTypeDefinition",
  DIRECTIVE_DEFINITION: "DirectiveDefinition",
  SCHEMA_EXTENSION: "SchemaExtension",
  SCALAR_TYPE_EXTENSION: "ScalarTypeExtension",
  OBJECT_TYPE_EXTENSION: "ObjectTypeExtension",
  INTERFACE_TYPE_EXTENSION: "InterfaceTypeExtension",
  UNION_TYPE_EXTENSION: "UnionTypeExtension",
  ENUM_TYPE_EXTENSION: "EnumTypeExtension",
  INPUT_OBJECT_TYPE_EXTENSION: "InputObjectTypeExtension"
});

// node_modules/graphql/jsutils/invariant.mjs
function invariant(condition, message) {
  var booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(message != null ? message : "Unexpected invariant triggered.");
  }
}

// node_modules/graphql/jsutils/nodejsCustomInspectSymbol.mjs
var nodejsCustomInspectSymbol = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : void 0;
var nodejsCustomInspectSymbol_default = nodejsCustomInspectSymbol;

// node_modules/graphql/jsutils/defineInspect.mjs
function defineInspect(classObject) {
  var fn = classObject.prototype.toJSON;
  typeof fn === "function" || invariant(0);
  classObject.prototype.inspect = fn;
  if (nodejsCustomInspectSymbol_default) {
    classObject.prototype[nodejsCustomInspectSymbol_default] = fn;
  }
}

// node_modules/graphql/language/ast.mjs
var Location = /* @__PURE__ */ function() {
  function Location2(startToken, endToken, source) {
    this.start = startToken.start;
    this.end = endToken.end;
    this.startToken = startToken;
    this.endToken = endToken;
    this.source = source;
  }
  var _proto = Location2.prototype;
  _proto.toJSON = function toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  };
  return Location2;
}();
defineInspect(Location);
var Token = /* @__PURE__ */ function() {
  function Token2(kind, start, end, line, column, prev, value) {
    this.kind = kind;
    this.start = start;
    this.end = end;
    this.line = line;
    this.column = column;
    this.value = value;
    this.prev = prev;
    this.next = null;
  }
  var _proto2 = Token2.prototype;
  _proto2.toJSON = function toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  };
  return Token2;
}();
defineInspect(Token);
function isNode(maybeNode) {
  return maybeNode != null && typeof maybeNode.kind === "string";
}

// node_modules/graphql/language/tokenKind.mjs
var TokenKind = Object.freeze({
  SOF: "<SOF>",
  EOF: "<EOF>",
  BANG: "!",
  DOLLAR: "$",
  AMP: "&",
  PAREN_L: "(",
  PAREN_R: ")",
  SPREAD: "...",
  COLON: ":",
  EQUALS: "=",
  AT: "@",
  BRACKET_L: "[",
  BRACKET_R: "]",
  BRACE_L: "{",
  PIPE: "|",
  BRACE_R: "}",
  NAME: "Name",
  INT: "Int",
  FLOAT: "Float",
  STRING: "String",
  BLOCK_STRING: "BlockString",
  COMMENT: "Comment"
});

// node_modules/graphql/jsutils/inspect.mjs
function _typeof3(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof3 = function _typeof4(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof3 = function _typeof4(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof3(obj);
}
var MAX_ARRAY_LENGTH = 10;
var MAX_RECURSIVE_DEPTH = 2;
function inspect(value) {
  return formatValue(value, []);
}
function formatValue(value, seenValues) {
  switch (_typeof3(value)) {
    case "string":
      return JSON.stringify(value);
    case "function":
      return value.name ? "[function ".concat(value.name, "]") : "[function]";
    case "object":
      if (value === null) {
        return "null";
      }
      return formatObjectValue(value, seenValues);
    default:
      return String(value);
  }
}
function formatObjectValue(value, previouslySeenValues) {
  if (previouslySeenValues.indexOf(value) !== -1) {
    return "[Circular]";
  }
  var seenValues = [].concat(previouslySeenValues, [value]);
  var customInspectFn = getCustomFn(value);
  if (customInspectFn !== void 0) {
    var customValue = customInspectFn.call(value);
    if (customValue !== value) {
      return typeof customValue === "string" ? customValue : formatValue(customValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }
  return formatObject(value, seenValues);
}
function formatObject(object, seenValues) {
  var keys = Object.keys(object);
  if (keys.length === 0) {
    return "{}";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[" + getObjectTag(object) + "]";
  }
  var properties = keys.map(function(key) {
    var value = formatValue(object[key], seenValues);
    return key + ": " + value;
  });
  return "{ " + properties.join(", ") + " }";
}
function formatArray(array, seenValues) {
  if (array.length === 0) {
    return "[]";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[Array]";
  }
  var len = Math.min(MAX_ARRAY_LENGTH, array.length);
  var remaining = array.length - len;
  var items = [];
  for (var i = 0; i < len; ++i) {
    items.push(formatValue(array[i], seenValues));
  }
  if (remaining === 1) {
    items.push("... 1 more item");
  } else if (remaining > 1) {
    items.push("... ".concat(remaining, " more items"));
  }
  return "[" + items.join(", ") + "]";
}
function getCustomFn(object) {
  var customInspectFn = object[String(nodejsCustomInspectSymbol_default)];
  if (typeof customInspectFn === "function") {
    return customInspectFn;
  }
  if (typeof object.inspect === "function") {
    return object.inspect;
  }
}
function getObjectTag(object) {
  var tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
  if (tag === "Object" && typeof object.constructor === "function") {
    var name = object.constructor.name;
    if (typeof name === "string" && name !== "") {
      return name;
    }
  }
  return tag;
}

// node_modules/graphql/jsutils/devAssert.mjs
function devAssert(condition, message) {
  var booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(message);
  }
}

// node_modules/graphql/jsutils/instanceOf.mjs
var instanceOf_default = process.env.NODE_ENV === "production" ? function instanceOf(value, constructor) {
  return value instanceof constructor;
} : function instanceOf2(value, constructor) {
  if (value instanceof constructor) {
    return true;
  }
  if (value) {
    var valueClass = value.constructor;
    var className = constructor.name;
    if (className && valueClass && valueClass.name === className) {
      throw new Error("Cannot use ".concat(className, ' "').concat(value, '" from another module or realm.\n\nEnsure that there is only one instance of "graphql" in the node_modules\ndirectory. If different versions of "graphql" are the dependencies of other\nrelied on modules, use "resolutions" to ensure only one version is installed.\n\nhttps://yarnpkg.com/en/docs/selective-version-resolutions\n\nDuplicate "graphql" modules cannot be used at the same time since different\nversions may have different capabilities and behavior. The data from one\nversion used in the function from another could produce confusing and\nspurious results.'));
    }
  }
  return false;
};

// node_modules/graphql/language/source.mjs
function _defineProperties2(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass2(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties2(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties2(Constructor, staticProps);
  return Constructor;
}
var Source = /* @__PURE__ */ function() {
  function Source2(body) {
    var name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "GraphQL request";
    var locationOffset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
      line: 1,
      column: 1
    };
    typeof body === "string" || devAssert(0, "Body must be a string. Received: ".concat(inspect(body), "."));
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    this.locationOffset.line > 0 || devAssert(0, "line in locationOffset is 1-indexed and must be positive.");
    this.locationOffset.column > 0 || devAssert(0, "column in locationOffset is 1-indexed and must be positive.");
  }
  _createClass2(Source2, [{
    key: SYMBOL_TO_STRING_TAG,
    get: function get() {
      return "Source";
    }
  }]);
  return Source2;
}();
function isSource(source) {
  return instanceOf_default(source, Source);
}

// node_modules/graphql/language/directiveLocation.mjs
var DirectiveLocation = Object.freeze({
  QUERY: "QUERY",
  MUTATION: "MUTATION",
  SUBSCRIPTION: "SUBSCRIPTION",
  FIELD: "FIELD",
  FRAGMENT_DEFINITION: "FRAGMENT_DEFINITION",
  FRAGMENT_SPREAD: "FRAGMENT_SPREAD",
  INLINE_FRAGMENT: "INLINE_FRAGMENT",
  VARIABLE_DEFINITION: "VARIABLE_DEFINITION",
  SCHEMA: "SCHEMA",
  SCALAR: "SCALAR",
  OBJECT: "OBJECT",
  FIELD_DEFINITION: "FIELD_DEFINITION",
  ARGUMENT_DEFINITION: "ARGUMENT_DEFINITION",
  INTERFACE: "INTERFACE",
  UNION: "UNION",
  ENUM: "ENUM",
  ENUM_VALUE: "ENUM_VALUE",
  INPUT_OBJECT: "INPUT_OBJECT",
  INPUT_FIELD_DEFINITION: "INPUT_FIELD_DEFINITION"
});

// node_modules/graphql/language/blockString.mjs
function dedentBlockStringValue(rawString) {
  var lines = rawString.split(/\r\n|[\n\r]/g);
  var commonIndent = getBlockStringIndentation(rawString);
  if (commonIndent !== 0) {
    for (var i = 1; i < lines.length; i++) {
      lines[i] = lines[i].slice(commonIndent);
    }
  }
  var startLine = 0;
  while (startLine < lines.length && isBlank(lines[startLine])) {
    ++startLine;
  }
  var endLine = lines.length;
  while (endLine > startLine && isBlank(lines[endLine - 1])) {
    --endLine;
  }
  return lines.slice(startLine, endLine).join("\n");
}
function isBlank(str) {
  for (var i = 0; i < str.length; ++i) {
    if (str[i] !== " " && str[i] !== "	") {
      return false;
    }
  }
  return true;
}
function getBlockStringIndentation(value) {
  var _commonIndent;
  var isFirstLine = true;
  var isEmptyLine = true;
  var indent2 = 0;
  var commonIndent = null;
  for (var i = 0; i < value.length; ++i) {
    switch (value.charCodeAt(i)) {
      case 13:
        if (value.charCodeAt(i + 1) === 10) {
          ++i;
        }
      case 10:
        isFirstLine = false;
        isEmptyLine = true;
        indent2 = 0;
        break;
      case 9:
      case 32:
        ++indent2;
        break;
      default:
        if (isEmptyLine && !isFirstLine && (commonIndent === null || indent2 < commonIndent)) {
          commonIndent = indent2;
        }
        isEmptyLine = false;
    }
  }
  return (_commonIndent = commonIndent) !== null && _commonIndent !== void 0 ? _commonIndent : 0;
}
function printBlockString(value) {
  var indentation = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  var preferMultipleLines = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  var isSingleLine = value.indexOf("\n") === -1;
  var hasLeadingSpace = value[0] === " " || value[0] === "	";
  var hasTrailingQuote = value[value.length - 1] === '"';
  var hasTrailingSlash = value[value.length - 1] === "\\";
  var printAsMultipleLines = !isSingleLine || hasTrailingQuote || hasTrailingSlash || preferMultipleLines;
  var result = "";
  if (printAsMultipleLines && !(isSingleLine && hasLeadingSpace)) {
    result += "\n" + indentation;
  }
  result += indentation ? value.replace(/\n/g, "\n" + indentation) : value;
  if (printAsMultipleLines) {
    result += "\n";
  }
  return '"""' + result.replace(/"""/g, '\\"""') + '"""';
}

// node_modules/graphql/language/lexer.mjs
var Lexer = /* @__PURE__ */ function() {
  function Lexer2(source) {
    var startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0, null);
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }
  var _proto = Lexer2.prototype;
  _proto.advance = function advance() {
    this.lastToken = this.token;
    var token = this.token = this.lookahead();
    return token;
  };
  _proto.lookahead = function lookahead() {
    var token = this.token;
    if (token.kind !== TokenKind.EOF) {
      do {
        var _token$next;
        token = (_token$next = token.next) !== null && _token$next !== void 0 ? _token$next : token.next = readToken(this, token);
      } while (token.kind === TokenKind.COMMENT);
    }
    return token;
  };
  return Lexer2;
}();
function isPunctuatorTokenKind(kind) {
  return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
}
function printCharCode(code) {
  return isNaN(code) ? TokenKind.EOF : code < 127 ? JSON.stringify(String.fromCharCode(code)) : '"\\u'.concat(("00" + code.toString(16).toUpperCase()).slice(-4), '"');
}
function readToken(lexer, prev) {
  var source = lexer.source;
  var body = source.body;
  var bodyLength = body.length;
  var pos = prev.end;
  while (pos < bodyLength) {
    var code = body.charCodeAt(pos);
    var _line = lexer.line;
    var _col = 1 + pos - lexer.lineStart;
    switch (code) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++pos;
        continue;
      case 10:
        ++pos;
        ++lexer.line;
        lexer.lineStart = pos;
        continue;
      case 13:
        if (body.charCodeAt(pos + 1) === 10) {
          pos += 2;
        } else {
          ++pos;
        }
        ++lexer.line;
        lexer.lineStart = pos;
        continue;
      case 33:
        return new Token(TokenKind.BANG, pos, pos + 1, _line, _col, prev);
      case 35:
        return readComment(source, pos, _line, _col, prev);
      case 36:
        return new Token(TokenKind.DOLLAR, pos, pos + 1, _line, _col, prev);
      case 38:
        return new Token(TokenKind.AMP, pos, pos + 1, _line, _col, prev);
      case 40:
        return new Token(TokenKind.PAREN_L, pos, pos + 1, _line, _col, prev);
      case 41:
        return new Token(TokenKind.PAREN_R, pos, pos + 1, _line, _col, prev);
      case 46:
        if (body.charCodeAt(pos + 1) === 46 && body.charCodeAt(pos + 2) === 46) {
          return new Token(TokenKind.SPREAD, pos, pos + 3, _line, _col, prev);
        }
        break;
      case 58:
        return new Token(TokenKind.COLON, pos, pos + 1, _line, _col, prev);
      case 61:
        return new Token(TokenKind.EQUALS, pos, pos + 1, _line, _col, prev);
      case 64:
        return new Token(TokenKind.AT, pos, pos + 1, _line, _col, prev);
      case 91:
        return new Token(TokenKind.BRACKET_L, pos, pos + 1, _line, _col, prev);
      case 93:
        return new Token(TokenKind.BRACKET_R, pos, pos + 1, _line, _col, prev);
      case 123:
        return new Token(TokenKind.BRACE_L, pos, pos + 1, _line, _col, prev);
      case 124:
        return new Token(TokenKind.PIPE, pos, pos + 1, _line, _col, prev);
      case 125:
        return new Token(TokenKind.BRACE_R, pos, pos + 1, _line, _col, prev);
      case 34:
        if (body.charCodeAt(pos + 1) === 34 && body.charCodeAt(pos + 2) === 34) {
          return readBlockString(source, pos, _line, _col, prev, lexer);
        }
        return readString(source, pos, _line, _col, prev);
      case 45:
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return readNumber(source, pos, code, _line, _col, prev);
      case 65:
      case 66:
      case 67:
      case 68:
      case 69:
      case 70:
      case 71:
      case 72:
      case 73:
      case 74:
      case 75:
      case 76:
      case 77:
      case 78:
      case 79:
      case 80:
      case 81:
      case 82:
      case 83:
      case 84:
      case 85:
      case 86:
      case 87:
      case 88:
      case 89:
      case 90:
      case 95:
      case 97:
      case 98:
      case 99:
      case 100:
      case 101:
      case 102:
      case 103:
      case 104:
      case 105:
      case 106:
      case 107:
      case 108:
      case 109:
      case 110:
      case 111:
      case 112:
      case 113:
      case 114:
      case 115:
      case 116:
      case 117:
      case 118:
      case 119:
      case 120:
      case 121:
      case 122:
        return readName(source, pos, _line, _col, prev);
    }
    throw syntaxError(source, pos, unexpectedCharacterMessage(code));
  }
  var line = lexer.line;
  var col = 1 + pos - lexer.lineStart;
  return new Token(TokenKind.EOF, bodyLength, bodyLength, line, col, prev);
}
function unexpectedCharacterMessage(code) {
  if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
    return "Cannot contain the invalid character ".concat(printCharCode(code), ".");
  }
  if (code === 39) {
    return `Unexpected single quote character ('), did you mean to use a double quote (")?`;
  }
  return "Cannot parse the unexpected character ".concat(printCharCode(code), ".");
}
function readComment(source, start, line, col, prev) {
  var body = source.body;
  var code;
  var position = start;
  do {
    code = body.charCodeAt(++position);
  } while (!isNaN(code) && (code > 31 || code === 9));
  return new Token(TokenKind.COMMENT, start, position, line, col, prev, body.slice(start + 1, position));
}
function readNumber(source, start, firstCode, line, col, prev) {
  var body = source.body;
  var code = firstCode;
  var position = start;
  var isFloat = false;
  if (code === 45) {
    code = body.charCodeAt(++position);
  }
  if (code === 48) {
    code = body.charCodeAt(++position);
    if (code >= 48 && code <= 57) {
      throw syntaxError(source, position, "Invalid number, unexpected digit after 0: ".concat(printCharCode(code), "."));
    }
  } else {
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46) {
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 69 || code === 101) {
    isFloat = true;
    code = body.charCodeAt(++position);
    if (code === 43 || code === 45) {
      code = body.charCodeAt(++position);
    }
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46 || isNameStart(code)) {
    throw syntaxError(source, position, "Invalid number, expected digit but got: ".concat(printCharCode(code), "."));
  }
  return new Token(isFloat ? TokenKind.FLOAT : TokenKind.INT, start, position, line, col, prev, body.slice(start, position));
}
function readDigits(source, start, firstCode) {
  var body = source.body;
  var position = start;
  var code = firstCode;
  if (code >= 48 && code <= 57) {
    do {
      code = body.charCodeAt(++position);
    } while (code >= 48 && code <= 57);
    return position;
  }
  throw syntaxError(source, position, "Invalid number, expected digit but got: ".concat(printCharCode(code), "."));
}
function readString(source, start, line, col, prev) {
  var body = source.body;
  var position = start + 1;
  var chunkStart = position;
  var code = 0;
  var value = "";
  while (position < body.length && !isNaN(code = body.charCodeAt(position)) && code !== 10 && code !== 13) {
    if (code === 34) {
      value += body.slice(chunkStart, position);
      return new Token(TokenKind.STRING, start, position + 1, line, col, prev, value);
    }
    if (code < 32 && code !== 9) {
      throw syntaxError(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
    }
    ++position;
    if (code === 92) {
      value += body.slice(chunkStart, position - 1);
      code = body.charCodeAt(position);
      switch (code) {
        case 34:
          value += '"';
          break;
        case 47:
          value += "/";
          break;
        case 92:
          value += "\\";
          break;
        case 98:
          value += "\b";
          break;
        case 102:
          value += "\f";
          break;
        case 110:
          value += "\n";
          break;
        case 114:
          value += "\r";
          break;
        case 116:
          value += "	";
          break;
        case 117: {
          var charCode = uniCharCode(body.charCodeAt(position + 1), body.charCodeAt(position + 2), body.charCodeAt(position + 3), body.charCodeAt(position + 4));
          if (charCode < 0) {
            var invalidSequence = body.slice(position + 1, position + 5);
            throw syntaxError(source, position, "Invalid character escape sequence: \\u".concat(invalidSequence, "."));
          }
          value += String.fromCharCode(charCode);
          position += 4;
          break;
        }
        default:
          throw syntaxError(source, position, "Invalid character escape sequence: \\".concat(String.fromCharCode(code), "."));
      }
      ++position;
      chunkStart = position;
    }
  }
  throw syntaxError(source, position, "Unterminated string.");
}
function readBlockString(source, start, line, col, prev, lexer) {
  var body = source.body;
  var position = start + 3;
  var chunkStart = position;
  var code = 0;
  var rawValue = "";
  while (position < body.length && !isNaN(code = body.charCodeAt(position))) {
    if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
      rawValue += body.slice(chunkStart, position);
      return new Token(TokenKind.BLOCK_STRING, start, position + 3, line, col, prev, dedentBlockStringValue(rawValue));
    }
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      throw syntaxError(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
    }
    if (code === 10) {
      ++position;
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 13) {
      if (body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
      rawValue += body.slice(chunkStart, position) + '"""';
      position += 4;
      chunkStart = position;
    } else {
      ++position;
    }
  }
  throw syntaxError(source, position, "Unterminated string.");
}
function uniCharCode(a, b, c, d) {
  return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
}
function char2hex(a) {
  return a >= 48 && a <= 57 ? a - 48 : a >= 65 && a <= 70 ? a - 55 : a >= 97 && a <= 102 ? a - 87 : -1;
}
function readName(source, start, line, col, prev) {
  var body = source.body;
  var bodyLength = body.length;
  var position = start + 1;
  var code = 0;
  while (position !== bodyLength && !isNaN(code = body.charCodeAt(position)) && (code === 95 || code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122)) {
    ++position;
  }
  return new Token(TokenKind.NAME, start, position, line, col, prev, body.slice(start, position));
}
function isNameStart(code) {
  return code === 95 || code >= 65 && code <= 90 || code >= 97 && code <= 122;
}

// node_modules/graphql/language/parser.mjs
function parse(source, options) {
  var parser = new Parser(source, options);
  return parser.parseDocument();
}
var Parser = /* @__PURE__ */ function() {
  function Parser2(source, options) {
    var sourceObj = isSource(source) ? source : new Source(source);
    this._lexer = new Lexer(sourceObj);
    this._options = options;
  }
  var _proto = Parser2.prototype;
  _proto.parseName = function parseName() {
    var token = this.expectToken(TokenKind.NAME);
    return {
      kind: Kind.NAME,
      value: token.value,
      loc: this.loc(token)
    };
  };
  _proto.parseDocument = function parseDocument() {
    var start = this._lexer.token;
    return {
      kind: Kind.DOCUMENT,
      definitions: this.many(TokenKind.SOF, this.parseDefinition, TokenKind.EOF),
      loc: this.loc(start)
    };
  };
  _proto.parseDefinition = function parseDefinition() {
    if (this.peek(TokenKind.NAME)) {
      switch (this._lexer.token.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
        case "schema":
        case "scalar":
        case "type":
        case "interface":
        case "union":
        case "enum":
        case "input":
        case "directive":
          return this.parseTypeSystemDefinition();
        case "extend":
          return this.parseTypeSystemExtension();
      }
    } else if (this.peek(TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    } else if (this.peekDescription()) {
      return this.parseTypeSystemDefinition();
    }
    throw this.unexpected();
  };
  _proto.parseOperationDefinition = function parseOperationDefinition() {
    var start = this._lexer.token;
    if (this.peek(TokenKind.BRACE_L)) {
      return {
        kind: Kind.OPERATION_DEFINITION,
        operation: "query",
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet(),
        loc: this.loc(start)
      };
    }
    var operation = this.parseOperationType();
    var name;
    if (this.peek(TokenKind.NAME)) {
      name = this.parseName();
    }
    return {
      kind: Kind.OPERATION_DEFINITION,
      operation,
      name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  };
  _proto.parseOperationType = function parseOperationType() {
    var operationToken = this.expectToken(TokenKind.NAME);
    switch (operationToken.value) {
      case "query":
        return "query";
      case "mutation":
        return "mutation";
      case "subscription":
        return "subscription";
    }
    throw this.unexpected(operationToken);
  };
  _proto.parseVariableDefinitions = function parseVariableDefinitions() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseVariableDefinition, TokenKind.PAREN_R);
  };
  _proto.parseVariableDefinition = function parseVariableDefinition() {
    var start = this._lexer.token;
    return {
      kind: Kind.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseValueLiteral(true) : void 0,
      directives: this.parseDirectives(true),
      loc: this.loc(start)
    };
  };
  _proto.parseVariable = function parseVariable() {
    var start = this._lexer.token;
    this.expectToken(TokenKind.DOLLAR);
    return {
      kind: Kind.VARIABLE,
      name: this.parseName(),
      loc: this.loc(start)
    };
  };
  _proto.parseSelectionSet = function parseSelectionSet() {
    var start = this._lexer.token;
    return {
      kind: Kind.SELECTION_SET,
      selections: this.many(TokenKind.BRACE_L, this.parseSelection, TokenKind.BRACE_R),
      loc: this.loc(start)
    };
  };
  _proto.parseSelection = function parseSelection() {
    return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
  };
  _proto.parseField = function parseField() {
    var start = this._lexer.token;
    var nameOrAlias = this.parseName();
    var alias;
    var name;
    if (this.expectOptionalToken(TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }
    return {
      kind: Kind.FIELD,
      alias,
      name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0,
      loc: this.loc(start)
    };
  };
  _proto.parseArguments = function parseArguments(isConst) {
    var item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  };
  _proto.parseArgument = function parseArgument() {
    var start = this._lexer.token;
    var name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return {
      kind: Kind.ARGUMENT,
      name,
      value: this.parseValueLiteral(false),
      loc: this.loc(start)
    };
  };
  _proto.parseConstArgument = function parseConstArgument() {
    var start = this._lexer.token;
    return {
      kind: Kind.ARGUMENT,
      name: this.parseName(),
      value: (this.expectToken(TokenKind.COLON), this.parseValueLiteral(true)),
      loc: this.loc(start)
    };
  };
  _proto.parseFragment = function parseFragment() {
    var start = this._lexer.token;
    this.expectToken(TokenKind.SPREAD);
    var hasTypeCondition = this.expectOptionalKeyword("on");
    if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
      return {
        kind: Kind.FRAGMENT_SPREAD,
        name: this.parseFragmentName(),
        directives: this.parseDirectives(false),
        loc: this.loc(start)
      };
    }
    return {
      kind: Kind.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  };
  _proto.parseFragmentDefinition = function parseFragmentDefinition() {
    var _this$_options;
    var start = this._lexer.token;
    this.expectKeyword("fragment");
    if (((_this$_options = this._options) === null || _this$_options === void 0 ? void 0 : _this$_options.experimentalFragmentVariables) === true) {
      return {
        kind: Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet(),
        loc: this.loc(start)
      };
    }
    return {
      kind: Kind.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  };
  _proto.parseFragmentName = function parseFragmentName() {
    if (this._lexer.token.value === "on") {
      throw this.unexpected();
    }
    return this.parseName();
  };
  _proto.parseValueLiteral = function parseValueLiteral(isConst) {
    var token = this._lexer.token;
    switch (token.kind) {
      case TokenKind.BRACKET_L:
        return this.parseList(isConst);
      case TokenKind.BRACE_L:
        return this.parseObject(isConst);
      case TokenKind.INT:
        this._lexer.advance();
        return {
          kind: Kind.INT,
          value: token.value,
          loc: this.loc(token)
        };
      case TokenKind.FLOAT:
        this._lexer.advance();
        return {
          kind: Kind.FLOAT,
          value: token.value,
          loc: this.loc(token)
        };
      case TokenKind.STRING:
      case TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();
      case TokenKind.NAME:
        this._lexer.advance();
        switch (token.value) {
          case "true":
            return {
              kind: Kind.BOOLEAN,
              value: true,
              loc: this.loc(token)
            };
          case "false":
            return {
              kind: Kind.BOOLEAN,
              value: false,
              loc: this.loc(token)
            };
          case "null":
            return {
              kind: Kind.NULL,
              loc: this.loc(token)
            };
          default:
            return {
              kind: Kind.ENUM,
              value: token.value,
              loc: this.loc(token)
            };
        }
      case TokenKind.DOLLAR:
        if (!isConst) {
          return this.parseVariable();
        }
        break;
    }
    throw this.unexpected();
  };
  _proto.parseStringLiteral = function parseStringLiteral() {
    var token = this._lexer.token;
    this._lexer.advance();
    return {
      kind: Kind.STRING,
      value: token.value,
      block: token.kind === TokenKind.BLOCK_STRING,
      loc: this.loc(token)
    };
  };
  _proto.parseList = function parseList(isConst) {
    var _this = this;
    var start = this._lexer.token;
    var item = function item2() {
      return _this.parseValueLiteral(isConst);
    };
    return {
      kind: Kind.LIST,
      values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R),
      loc: this.loc(start)
    };
  };
  _proto.parseObject = function parseObject(isConst) {
    var _this2 = this;
    var start = this._lexer.token;
    var item = function item2() {
      return _this2.parseObjectField(isConst);
    };
    return {
      kind: Kind.OBJECT,
      fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R),
      loc: this.loc(start)
    };
  };
  _proto.parseObjectField = function parseObjectField(isConst) {
    var start = this._lexer.token;
    var name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return {
      kind: Kind.OBJECT_FIELD,
      name,
      value: this.parseValueLiteral(isConst),
      loc: this.loc(start)
    };
  };
  _proto.parseDirectives = function parseDirectives(isConst) {
    var directives = [];
    while (this.peek(TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }
    return directives;
  };
  _proto.parseDirective = function parseDirective(isConst) {
    var start = this._lexer.token;
    this.expectToken(TokenKind.AT);
    return {
      kind: Kind.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst),
      loc: this.loc(start)
    };
  };
  _proto.parseTypeReference = function parseTypeReference() {
    var start = this._lexer.token;
    var type;
    if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
      type = this.parseTypeReference();
      this.expectToken(TokenKind.BRACKET_R);
      type = {
        kind: Kind.LIST_TYPE,
        type,
        loc: this.loc(start)
      };
    } else {
      type = this.parseNamedType();
    }
    if (this.expectOptionalToken(TokenKind.BANG)) {
      return {
        kind: Kind.NON_NULL_TYPE,
        type,
        loc: this.loc(start)
      };
    }
    return type;
  };
  _proto.parseNamedType = function parseNamedType() {
    var start = this._lexer.token;
    return {
      kind: Kind.NAMED_TYPE,
      name: this.parseName(),
      loc: this.loc(start)
    };
  };
  _proto.parseTypeSystemDefinition = function parseTypeSystemDefinition() {
    var keywordToken = this.peekDescription() ? this._lexer.lookahead() : this._lexer.token;
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
    }
    throw this.unexpected(keywordToken);
  };
  _proto.peekDescription = function peekDescription() {
    return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
  };
  _proto.parseDescription = function parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  };
  _proto.parseSchemaDefinition = function parseSchemaDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword("schema");
    var directives = this.parseDirectives(true);
    var operationTypes = this.many(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    return {
      kind: Kind.SCHEMA_DEFINITION,
      description,
      directives,
      operationTypes,
      loc: this.loc(start)
    };
  };
  _proto.parseOperationTypeDefinition = function parseOperationTypeDefinition() {
    var start = this._lexer.token;
    var operation = this.parseOperationType();
    this.expectToken(TokenKind.COLON);
    var type = this.parseNamedType();
    return {
      kind: Kind.OPERATION_TYPE_DEFINITION,
      operation,
      type,
      loc: this.loc(start)
    };
  };
  _proto.parseScalarTypeDefinition = function parseScalarTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword("scalar");
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.SCALAR_TYPE_DEFINITION,
      description,
      name,
      directives,
      loc: this.loc(start)
    };
  };
  _proto.parseObjectTypeDefinition = function parseObjectTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword("type");
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    return {
      kind: Kind.OBJECT_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields,
      loc: this.loc(start)
    };
  };
  _proto.parseImplementsInterfaces = function parseImplementsInterfaces() {
    var _this$_options2;
    if (!this.expectOptionalKeyword("implements")) {
      return [];
    }
    if (((_this$_options2 = this._options) === null || _this$_options2 === void 0 ? void 0 : _this$_options2.allowLegacySDLImplementsInterfaces) === true) {
      var types = [];
      this.expectOptionalToken(TokenKind.AMP);
      do {
        types.push(this.parseNamedType());
      } while (this.expectOptionalToken(TokenKind.AMP) || this.peek(TokenKind.NAME));
      return types;
    }
    return this.delimitedMany(TokenKind.AMP, this.parseNamedType);
  };
  _proto.parseFieldsDefinition = function parseFieldsDefinition() {
    var _this$_options3;
    if (((_this$_options3 = this._options) === null || _this$_options3 === void 0 ? void 0 : _this$_options3.allowLegacySDLEmptyFields) === true && this.peek(TokenKind.BRACE_L) && this._lexer.lookahead().kind === TokenKind.BRACE_R) {
      this._lexer.advance();
      this._lexer.advance();
      return [];
    }
    return this.optionalMany(TokenKind.BRACE_L, this.parseFieldDefinition, TokenKind.BRACE_R);
  };
  _proto.parseFieldDefinition = function parseFieldDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    var args = this.parseArgumentDefs();
    this.expectToken(TokenKind.COLON);
    var type = this.parseTypeReference();
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.FIELD_DEFINITION,
      description,
      name,
      arguments: args,
      type,
      directives,
      loc: this.loc(start)
    };
  };
  _proto.parseArgumentDefs = function parseArgumentDefs() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseInputValueDef, TokenKind.PAREN_R);
  };
  _proto.parseInputValueDef = function parseInputValueDef() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    this.expectToken(TokenKind.COLON);
    var type = this.parseTypeReference();
    var defaultValue;
    if (this.expectOptionalToken(TokenKind.EQUALS)) {
      defaultValue = this.parseValueLiteral(true);
    }
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.INPUT_VALUE_DEFINITION,
      description,
      name,
      type,
      defaultValue,
      directives,
      loc: this.loc(start)
    };
  };
  _proto.parseInterfaceTypeDefinition = function parseInterfaceTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword("interface");
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    return {
      kind: Kind.INTERFACE_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields,
      loc: this.loc(start)
    };
  };
  _proto.parseUnionTypeDefinition = function parseUnionTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword("union");
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var types = this.parseUnionMemberTypes();
    return {
      kind: Kind.UNION_TYPE_DEFINITION,
      description,
      name,
      directives,
      types,
      loc: this.loc(start)
    };
  };
  _proto.parseUnionMemberTypes = function parseUnionMemberTypes() {
    return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
  };
  _proto.parseEnumTypeDefinition = function parseEnumTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword("enum");
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var values = this.parseEnumValuesDefinition();
    return {
      kind: Kind.ENUM_TYPE_DEFINITION,
      description,
      name,
      directives,
      values,
      loc: this.loc(start)
    };
  };
  _proto.parseEnumValuesDefinition = function parseEnumValuesDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseEnumValueDefinition, TokenKind.BRACE_R);
  };
  _proto.parseEnumValueDefinition = function parseEnumValueDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.ENUM_VALUE_DEFINITION,
      description,
      name,
      directives,
      loc: this.loc(start)
    };
  };
  _proto.parseInputObjectTypeDefinition = function parseInputObjectTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword("input");
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var fields = this.parseInputFieldsDefinition();
    return {
      kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
      description,
      name,
      directives,
      fields,
      loc: this.loc(start)
    };
  };
  _proto.parseInputFieldsDefinition = function parseInputFieldsDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseInputValueDef, TokenKind.BRACE_R);
  };
  _proto.parseTypeSystemExtension = function parseTypeSystemExtension() {
    var keywordToken = this._lexer.lookahead();
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
      }
    }
    throw this.unexpected(keywordToken);
  };
  _proto.parseSchemaExtension = function parseSchemaExtension() {
    var start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("schema");
    var directives = this.parseDirectives(true);
    var operationTypes = this.optionalMany(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    if (directives.length === 0 && operationTypes.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: Kind.SCHEMA_EXTENSION,
      directives,
      operationTypes,
      loc: this.loc(start)
    };
  };
  _proto.parseScalarTypeExtension = function parseScalarTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("scalar");
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    if (directives.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: Kind.SCALAR_TYPE_EXTENSION,
      name,
      directives,
      loc: this.loc(start)
    };
  };
  _proto.parseObjectTypeExtension = function parseObjectTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("type");
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: Kind.OBJECT_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields,
      loc: this.loc(start)
    };
  };
  _proto.parseInterfaceTypeExtension = function parseInterfaceTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("interface");
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: Kind.INTERFACE_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields,
      loc: this.loc(start)
    };
  };
  _proto.parseUnionTypeExtension = function parseUnionTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("union");
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var types = this.parseUnionMemberTypes();
    if (directives.length === 0 && types.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: Kind.UNION_TYPE_EXTENSION,
      name,
      directives,
      types,
      loc: this.loc(start)
    };
  };
  _proto.parseEnumTypeExtension = function parseEnumTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("enum");
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var values = this.parseEnumValuesDefinition();
    if (directives.length === 0 && values.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: Kind.ENUM_TYPE_EXTENSION,
      name,
      directives,
      values,
      loc: this.loc(start)
    };
  };
  _proto.parseInputObjectTypeExtension = function parseInputObjectTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("input");
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var fields = this.parseInputFieldsDefinition();
    if (directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return {
      kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
      name,
      directives,
      fields,
      loc: this.loc(start)
    };
  };
  _proto.parseDirectiveDefinition = function parseDirectiveDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword("directive");
    this.expectToken(TokenKind.AT);
    var name = this.parseName();
    var args = this.parseArgumentDefs();
    var repeatable = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    var locations = this.parseDirectiveLocations();
    return {
      kind: Kind.DIRECTIVE_DEFINITION,
      description,
      name,
      arguments: args,
      repeatable,
      locations,
      loc: this.loc(start)
    };
  };
  _proto.parseDirectiveLocations = function parseDirectiveLocations() {
    return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
  };
  _proto.parseDirectiveLocation = function parseDirectiveLocation() {
    var start = this._lexer.token;
    var name = this.parseName();
    if (DirectiveLocation[name.value] !== void 0) {
      return name;
    }
    throw this.unexpected(start);
  };
  _proto.loc = function loc(startToken) {
    var _this$_options4;
    if (((_this$_options4 = this._options) === null || _this$_options4 === void 0 ? void 0 : _this$_options4.noLocation) !== true) {
      return new Location(startToken, this._lexer.lastToken, this._lexer.source);
    }
  };
  _proto.peek = function peek(kind) {
    return this._lexer.token.kind === kind;
  };
  _proto.expectToken = function expectToken(kind) {
    var token = this._lexer.token;
    if (token.kind === kind) {
      this._lexer.advance();
      return token;
    }
    throw syntaxError(this._lexer.source, token.start, "Expected ".concat(getTokenKindDesc(kind), ", found ").concat(getTokenDesc(token), "."));
  };
  _proto.expectOptionalToken = function expectOptionalToken(kind) {
    var token = this._lexer.token;
    if (token.kind === kind) {
      this._lexer.advance();
      return token;
    }
    return void 0;
  };
  _proto.expectKeyword = function expectKeyword(value) {
    var token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this._lexer.advance();
    } else {
      throw syntaxError(this._lexer.source, token.start, 'Expected "'.concat(value, '", found ').concat(getTokenDesc(token), "."));
    }
  };
  _proto.expectOptionalKeyword = function expectOptionalKeyword(value) {
    var token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this._lexer.advance();
      return true;
    }
    return false;
  };
  _proto.unexpected = function unexpected(atToken) {
    var token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
    return syntaxError(this._lexer.source, token.start, "Unexpected ".concat(getTokenDesc(token), "."));
  };
  _proto.any = function any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    var nodes = [];
    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }
    return nodes;
  };
  _proto.optionalMany = function optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      var nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    return [];
  };
  _proto.many = function many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    var nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));
    return nodes;
  };
  _proto.delimitedMany = function delimitedMany(delimiterKind, parseFn) {
    this.expectOptionalToken(delimiterKind);
    var nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (this.expectOptionalToken(delimiterKind));
    return nodes;
  };
  return Parser2;
}();
function getTokenDesc(token) {
  var value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? ' "'.concat(value, '"') : "");
}
function getTokenKindDesc(kind) {
  return isPunctuatorTokenKind(kind) ? '"'.concat(kind, '"') : kind;
}

// node_modules/graphql/language/visitor.mjs
var QueryDocumentKeys = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: ["name", "variableDefinitions", "directives", "selectionSet"],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: ["description", "name", "interfaces", "directives", "fields"],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: ["description", "name", "type", "defaultValue", "directives"],
  InterfaceTypeDefinition: ["description", "name", "interfaces", "directives", "fields"],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
};
var BREAK = Object.freeze({});
function visit(root, visitor) {
  var visitorKeys = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : QueryDocumentKeys;
  var stack = void 0;
  var inArray = Array.isArray(root);
  var keys = [root];
  var index = -1;
  var edits = [];
  var node = void 0;
  var key = void 0;
  var parent = void 0;
  var path = [];
  var ancestors = [];
  var newRoot = root;
  do {
    index++;
    var isLeaving = index === keys.length;
    var isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? void 0 : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray) {
          node = node.slice();
        } else {
          var clone2 = {};
          for (var _i2 = 0, _Object$keys2 = Object.keys(node); _i2 < _Object$keys2.length; _i2++) {
            var k = _Object$keys2[_i2];
            clone2[k] = node[k];
          }
          node = clone2;
        }
        var editOffset = 0;
        for (var ii = 0; ii < edits.length; ii++) {
          var editKey = edits[ii][0];
          var editValue = edits[ii][1];
          if (inArray) {
            editKey -= editOffset;
          }
          if (inArray && editValue === null) {
            node.splice(editKey, 1);
            editOffset++;
          } else {
            node[editKey] = editValue;
          }
        }
      }
      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? inArray ? index : keys[index] : void 0;
      node = parent ? parent[key] : newRoot;
      if (node === null || node === void 0) {
        continue;
      }
      if (parent) {
        path.push(key);
      }
    }
    var result = void 0;
    if (!Array.isArray(node)) {
      if (!isNode(node)) {
        throw new Error("Invalid AST Node: ".concat(inspect(node), "."));
      }
      var visitFn = getVisitFn(visitor, node.kind, isLeaving);
      if (visitFn) {
        result = visitFn.call(visitor, node, key, parent, path, ancestors);
        if (result === BREAK) {
          break;
        }
        if (result === false) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== void 0) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (isNode(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
    }
    if (result === void 0 && isEdited) {
      edits.push([key, node]);
    }
    if (isLeaving) {
      path.pop();
    } else {
      var _visitorKeys$node$kin;
      stack = {
        inArray,
        index,
        keys,
        edits,
        prev: stack
      };
      inArray = Array.isArray(node);
      keys = inArray ? node : (_visitorKeys$node$kin = visitorKeys[node.kind]) !== null && _visitorKeys$node$kin !== void 0 ? _visitorKeys$node$kin : [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== void 0);
  if (edits.length !== 0) {
    newRoot = edits[edits.length - 1][1];
  }
  return newRoot;
}
function getVisitFn(visitor, kind, isLeaving) {
  var kindVisitor = visitor[kind];
  if (kindVisitor) {
    if (!isLeaving && typeof kindVisitor === "function") {
      return kindVisitor;
    }
    var kindSpecificVisitor = isLeaving ? kindVisitor.leave : kindVisitor.enter;
    if (typeof kindSpecificVisitor === "function") {
      return kindSpecificVisitor;
    }
  } else {
    var specificVisitor = isLeaving ? visitor.leave : visitor.enter;
    if (specificVisitor) {
      if (typeof specificVisitor === "function") {
        return specificVisitor;
      }
      var specificKindVisitor = specificVisitor[kind];
      if (typeof specificKindVisitor === "function") {
        return specificKindVisitor;
      }
    }
  }
}

// node_modules/graphql/language/printer.mjs
function print(ast) {
  return visit(ast, {
    leave: printDocASTReducer
  });
}
var MAX_LINE_LENGTH = 80;
var printDocASTReducer = {
  Name: function Name(node) {
    return node.value;
  },
  Variable: function Variable(node) {
    return "$" + node.name;
  },
  Document: function Document(node) {
    return join(node.definitions, "\n\n") + "\n";
  },
  OperationDefinition: function OperationDefinition(node) {
    var op = node.operation;
    var name = node.name;
    var varDefs = wrap("(", join(node.variableDefinitions, ", "), ")");
    var directives = join(node.directives, " ");
    var selectionSet = node.selectionSet;
    return !name && !directives && !varDefs && op === "query" ? selectionSet : join([op, join([name, varDefs]), directives, selectionSet], " ");
  },
  VariableDefinition: function VariableDefinition(_ref) {
    var variable = _ref.variable, type = _ref.type, defaultValue = _ref.defaultValue, directives = _ref.directives;
    return variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " "));
  },
  SelectionSet: function SelectionSet(_ref2) {
    var selections = _ref2.selections;
    return block(selections);
  },
  Field: function Field(_ref3) {
    var alias = _ref3.alias, name = _ref3.name, args = _ref3.arguments, directives = _ref3.directives, selectionSet = _ref3.selectionSet;
    var prefix = wrap("", alias, ": ") + name;
    var argsLine = prefix + wrap("(", join(args, ", "), ")");
    if (argsLine.length > MAX_LINE_LENGTH) {
      argsLine = prefix + wrap("(\n", indent(join(args, "\n")), "\n)");
    }
    return join([argsLine, join(directives, " "), selectionSet], " ");
  },
  Argument: function Argument(_ref4) {
    var name = _ref4.name, value = _ref4.value;
    return name + ": " + value;
  },
  FragmentSpread: function FragmentSpread(_ref5) {
    var name = _ref5.name, directives = _ref5.directives;
    return "..." + name + wrap(" ", join(directives, " "));
  },
  InlineFragment: function InlineFragment(_ref6) {
    var typeCondition = _ref6.typeCondition, directives = _ref6.directives, selectionSet = _ref6.selectionSet;
    return join(["...", wrap("on ", typeCondition), join(directives, " "), selectionSet], " ");
  },
  FragmentDefinition: function FragmentDefinition(_ref7) {
    var name = _ref7.name, typeCondition = _ref7.typeCondition, variableDefinitions = _ref7.variableDefinitions, directives = _ref7.directives, selectionSet = _ref7.selectionSet;
    return "fragment ".concat(name).concat(wrap("(", join(variableDefinitions, ", "), ")"), " ") + "on ".concat(typeCondition, " ").concat(wrap("", join(directives, " "), " ")) + selectionSet;
  },
  IntValue: function IntValue(_ref8) {
    var value = _ref8.value;
    return value;
  },
  FloatValue: function FloatValue(_ref9) {
    var value = _ref9.value;
    return value;
  },
  StringValue: function StringValue(_ref10, key) {
    var value = _ref10.value, isBlockString = _ref10.block;
    return isBlockString ? printBlockString(value, key === "description" ? "" : "  ") : JSON.stringify(value);
  },
  BooleanValue: function BooleanValue(_ref11) {
    var value = _ref11.value;
    return value ? "true" : "false";
  },
  NullValue: function NullValue() {
    return "null";
  },
  EnumValue: function EnumValue(_ref12) {
    var value = _ref12.value;
    return value;
  },
  ListValue: function ListValue(_ref13) {
    var values = _ref13.values;
    return "[" + join(values, ", ") + "]";
  },
  ObjectValue: function ObjectValue(_ref14) {
    var fields = _ref14.fields;
    return "{" + join(fields, ", ") + "}";
  },
  ObjectField: function ObjectField(_ref15) {
    var name = _ref15.name, value = _ref15.value;
    return name + ": " + value;
  },
  Directive: function Directive(_ref16) {
    var name = _ref16.name, args = _ref16.arguments;
    return "@" + name + wrap("(", join(args, ", "), ")");
  },
  NamedType: function NamedType(_ref17) {
    var name = _ref17.name;
    return name;
  },
  ListType: function ListType(_ref18) {
    var type = _ref18.type;
    return "[" + type + "]";
  },
  NonNullType: function NonNullType(_ref19) {
    var type = _ref19.type;
    return type + "!";
  },
  SchemaDefinition: addDescription(function(_ref20) {
    var directives = _ref20.directives, operationTypes = _ref20.operationTypes;
    return join(["schema", join(directives, " "), block(operationTypes)], " ");
  }),
  OperationTypeDefinition: function OperationTypeDefinition(_ref21) {
    var operation = _ref21.operation, type = _ref21.type;
    return operation + ": " + type;
  },
  ScalarTypeDefinition: addDescription(function(_ref22) {
    var name = _ref22.name, directives = _ref22.directives;
    return join(["scalar", name, join(directives, " ")], " ");
  }),
  ObjectTypeDefinition: addDescription(function(_ref23) {
    var name = _ref23.name, interfaces = _ref23.interfaces, directives = _ref23.directives, fields = _ref23.fields;
    return join(["type", name, wrap("implements ", join(interfaces, " & ")), join(directives, " "), block(fields)], " ");
  }),
  FieldDefinition: addDescription(function(_ref24) {
    var name = _ref24.name, args = _ref24.arguments, type = _ref24.type, directives = _ref24.directives;
    return name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + ": " + type + wrap(" ", join(directives, " "));
  }),
  InputValueDefinition: addDescription(function(_ref25) {
    var name = _ref25.name, type = _ref25.type, defaultValue = _ref25.defaultValue, directives = _ref25.directives;
    return join([name + ": " + type, wrap("= ", defaultValue), join(directives, " ")], " ");
  }),
  InterfaceTypeDefinition: addDescription(function(_ref26) {
    var name = _ref26.name, interfaces = _ref26.interfaces, directives = _ref26.directives, fields = _ref26.fields;
    return join(["interface", name, wrap("implements ", join(interfaces, " & ")), join(directives, " "), block(fields)], " ");
  }),
  UnionTypeDefinition: addDescription(function(_ref27) {
    var name = _ref27.name, directives = _ref27.directives, types = _ref27.types;
    return join(["union", name, join(directives, " "), types && types.length !== 0 ? "= " + join(types, " | ") : ""], " ");
  }),
  EnumTypeDefinition: addDescription(function(_ref28) {
    var name = _ref28.name, directives = _ref28.directives, values = _ref28.values;
    return join(["enum", name, join(directives, " "), block(values)], " ");
  }),
  EnumValueDefinition: addDescription(function(_ref29) {
    var name = _ref29.name, directives = _ref29.directives;
    return join([name, join(directives, " ")], " ");
  }),
  InputObjectTypeDefinition: addDescription(function(_ref30) {
    var name = _ref30.name, directives = _ref30.directives, fields = _ref30.fields;
    return join(["input", name, join(directives, " "), block(fields)], " ");
  }),
  DirectiveDefinition: addDescription(function(_ref31) {
    var name = _ref31.name, args = _ref31.arguments, repeatable = _ref31.repeatable, locations = _ref31.locations;
    return "directive @" + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + (repeatable ? " repeatable" : "") + " on " + join(locations, " | ");
  }),
  SchemaExtension: function SchemaExtension(_ref32) {
    var directives = _ref32.directives, operationTypes = _ref32.operationTypes;
    return join(["extend schema", join(directives, " "), block(operationTypes)], " ");
  },
  ScalarTypeExtension: function ScalarTypeExtension(_ref33) {
    var name = _ref33.name, directives = _ref33.directives;
    return join(["extend scalar", name, join(directives, " ")], " ");
  },
  ObjectTypeExtension: function ObjectTypeExtension(_ref34) {
    var name = _ref34.name, interfaces = _ref34.interfaces, directives = _ref34.directives, fields = _ref34.fields;
    return join(["extend type", name, wrap("implements ", join(interfaces, " & ")), join(directives, " "), block(fields)], " ");
  },
  InterfaceTypeExtension: function InterfaceTypeExtension(_ref35) {
    var name = _ref35.name, interfaces = _ref35.interfaces, directives = _ref35.directives, fields = _ref35.fields;
    return join(["extend interface", name, wrap("implements ", join(interfaces, " & ")), join(directives, " "), block(fields)], " ");
  },
  UnionTypeExtension: function UnionTypeExtension(_ref36) {
    var name = _ref36.name, directives = _ref36.directives, types = _ref36.types;
    return join(["extend union", name, join(directives, " "), types && types.length !== 0 ? "= " + join(types, " | ") : ""], " ");
  },
  EnumTypeExtension: function EnumTypeExtension(_ref37) {
    var name = _ref37.name, directives = _ref37.directives, values = _ref37.values;
    return join(["extend enum", name, join(directives, " "), block(values)], " ");
  },
  InputObjectTypeExtension: function InputObjectTypeExtension(_ref38) {
    var name = _ref38.name, directives = _ref38.directives, fields = _ref38.fields;
    return join(["extend input", name, join(directives, " "), block(fields)], " ");
  }
};
function addDescription(cb) {
  return function(node) {
    return join([node.description, cb(node)], "\n");
  };
}
function join(maybeArray) {
  var _maybeArray$filter$jo;
  var separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter(function(x) {
    return x;
  }).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : "";
}
function block(array) {
  return wrap("{\n", indent(join(array, "\n")), "\n}");
}
function wrap(start, maybeString) {
  var end = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
  return maybeString != null && maybeString !== "" ? start + maybeString + end : "";
}
function indent(str) {
  return wrap("  ", str.replace(/\n/g, "\n  "));
}
function isMultiline(str) {
  return str.indexOf("\n") !== -1;
}
function hasMultilineItems(maybeArray) {
  return maybeArray != null && maybeArray.some(isMultiline);
}

// src/handler.ts
var FRINGE_CACHE = "fringe_cache";
var buildHandler = async (source, pattern) => {
  try {
    logging_default.info("Building the page context for all files");
    const pagesContext = await pagesContext_default(source, pattern);
    logging_default.info("Setting up Redis Cache");
    let cache = new RedisCache_default();
    const main = async (req, res) => {
      const result = await processRequest(pagesContext, req, cache);
      if (!result) {
        res.end(`Page not found: ${req.url}`);
      }
      res.end(result);
    };
    return main;
  } catch (error) {
    logging_default.error(JSON.stringify(error));
  }
};
var processRequest = async (pagesContext, req, cache) => {
  const normalizedPathname = normalizePathname(req.url);
  if (pageIsApi(normalizedPathname)) {
    return processApiRequests(normalizedPathname, pagesContext);
  }
  if (pageIsGraphql(normalizedPathname)) {
    return processGraphQLRequests(normalizedPathname, pagesContext, cache);
  }
};
var processApiRequests = async (normalizedPathname, pagesContext) => {
  const page = await getPage(normalizedPathname, pagesContext);
  if (!page)
    return null;
  const response = await page.context.default();
  return response;
};
var processGraphQLRequests = async (normalizedPathname, pagesContext, cache) => {
  const page = await getPage(normalizedPathname, pagesContext, true);
  if (!page)
    return null;
  const response = await executeGQL(page.context, {}, cache);
  return response;
};
function normalizePathname(pathname) {
  return pathname === "/" || /graphql$/.test(pathname) ? "/index" : pathname;
}
function pageIsApi(page) {
  return page.indexOf("/api/") >= 0;
}
function pageIsGraphql(page) {
  return page.indexOf("/graphql/") >= 0;
}
async function executeGQL(graphqlQuery, variables = {}, cache) {
  try {
    const ast = parse(graphqlQuery);
    const {updatedAST, cacheFields} = extractCacheKeyFields(ast);
    let response = getFromCache(cache, updatedAST);
    console.log(JSON.stringify(response));
    if (!response || !response.data) {
      const result = await lib_default("https://api.spacex.land/graphql", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query: `${print(updatedAST)}`,
          variables
        })
      });
      response = await result.json();
      const getKey = (obj) => `${obj.__typename}:${cacheFields.map((cacheField) => obj[cacheField]).join(":")}`;
      const normMap = normalize(updatedAST, void 0, response.data, getKey);
      merge(cache, normMap);
    }
    return JSON.stringify(response.data);
  } catch (error) {
    logging_default.error(error);
  }
}
function extractCacheKeyFields(ast) {
  let cacheFields = [];
  let visitor = {
    Field(node) {
      if (node.directives.length) {
        cacheFields = node.directives.reduce((cacheFields2, directive) => {
          if (directive.name.value === FRINGE_CACHE)
            return [...cacheFields2, node.name.value];
        }, cacheFields);
        return {
          ...node,
          directives: node.directives.filter((directive) => directive.name.value !== FRINGE_CACHE)
        };
      }
    }
  };
  const updatedAST = visit(ast, visitor);
  return {updatedAST, cacheFields};
}
function getFromCache(cache, query) {
  const denormResult = denormalize(query, {}, cache);
  const setToJSON = (k, v) => v instanceof Set ? Array.from(v) : v;
  return JSON.parse(JSON.stringify(denormResult, setToJSON));
}
var handler_default = buildHandler;

// index.ts
var FRINGE_PORT = process.env.PORT || 8080;
var filePattern = new RegExp("/.(js|jsx|ts|tsx|graphql)$/g");
var startApp = async (pages, pattern = filePattern) => {
  const handler = await handler_default(pages, pattern);
  const server = http2.createServer(handler);
  try {
    server.listen(FRINGE_PORT, () => {
      logging_default.info(`Server started on port ${FRINGE_PORT}`);
    });
  } catch (error) {
    logging_default.error(`Server failed to start ${JSON.stringify(error)}`);
  }
};
var fringe_default = startApp;
export {
  fringe_default as default
};
