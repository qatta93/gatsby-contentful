var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a, prop, b2[prop]);
    }
  return a;
};
var __spreadProps = (a, b2) => __defProps(a, __getOwnPropDescs(b2));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module2) {
    var fs2 = require("fs");
    var path = require("path");
    function log(message) {
      console.log(`[dotenv][DEBUG] ${message}`);
    }
    var NEWLINE = "\n";
    var RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
    var RE_NEWLINES = /\\n/g;
    var NEWLINES_MATCH = /\n|\r|\r\n/;
    function parse2(src, options) {
      const debug = Boolean(options && options.debug);
      const obj = {};
      src.toString().split(NEWLINES_MATCH).forEach(function(line, idx) {
        const keyValueArr = line.match(RE_INI_KEY_VAL);
        if (keyValueArr != null) {
          const key = keyValueArr[1];
          let val = keyValueArr[2] || "";
          const end = val.length - 1;
          const isDoubleQuoted = val[0] === '"' && val[end] === '"';
          const isSingleQuoted = val[0] === "'" && val[end] === "'";
          if (isSingleQuoted || isDoubleQuoted) {
            val = val.substring(1, end);
            if (isDoubleQuoted) {
              val = val.replace(RE_NEWLINES, NEWLINE);
            }
          } else {
            val = val.trim();
          }
          obj[key] = val;
        } else if (debug) {
          log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
        }
      });
      return obj;
    }
    function config(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let debug = false;
      if (options) {
        if (options.path != null) {
          dotenvPath = options.path;
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
        if (options.debug != null) {
          debug = true;
        }
      }
      try {
        const parsed = parse2(fs2.readFileSync(dotenvPath, { encoding }), { debug });
        Object.keys(parsed).forEach(function(key) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = parsed[key];
          } else if (debug) {
            log(`"${key}" is already defined in \`process.env\` and will not be overwritten`);
          }
        });
        return { parsed };
      } catch (e) {
        return { error: e };
      }
    }
    module2.exports.config = config;
    module2.exports.parse = parse2;
  }
});

// functions/productQuantity.ts
__export(exports, {
  handler: () => handler
});

// node_modules/postgres/src/index.js
var import_os = __toModule(require("os"));
var import_fs = __toModule(require("fs"));
var import_stream2 = __toModule(require("stream"));

// node_modules/postgres/src/query.js
var originCache = new Map();
var originStackCache = new Map();
var originError = Symbol("OriginError");
var CLOSE = {};
var Query = class extends Promise {
  constructor(strings, args, handler2, canceller, options = {}) {
    let resolve, reject;
    super((a, b2) => {
      resolve = a;
      reject = b2;
    });
    this.tagged = Array.isArray(strings.raw);
    this.strings = strings;
    this.args = args;
    this.handler = handler2;
    this.canceller = canceller;
    this.options = options;
    this.state = null;
    this.statement = null;
    this.resolve = (x) => (this.active = false, resolve(x));
    this.reject = (x) => (this.active = false, reject(x));
    this.active = false;
    this.cancelled = null;
    this.executed = false;
    this.signature = "";
    this[originError] = handler2.debug || !this.tagged ? new Error() : cachedError(this.strings);
  }
  get origin() {
    return this.handler.debug || !this.tagged ? this[originError].stack : originStackCache.has(this.strings) ? originStackCache.get(this.strings) : originStackCache.set(this.strings, this[originError].stack).get(this.strings);
  }
  static get [Symbol.species]() {
    return Promise;
  }
  cancel() {
    return this.canceller && (this.canceller(this), this.canceller = null);
  }
  async readable() {
    this.options.simple = true;
    this.options.prepare = false;
    this.streaming = true;
    return this;
  }
  async writable() {
    this.options.simple = true;
    this.options.prepare = false;
    this.streaming = true;
    return this;
  }
  cursor(rows = 1, fn) {
    this.options.simple = false;
    if (typeof rows === "function") {
      fn = rows;
      rows = 1;
    }
    this.cursorRows = rows;
    if (typeof fn === "function")
      return this.cursorFn = fn, this;
    let prev;
    return {
      [Symbol.asyncIterator]: () => ({
        next: () => {
          if (this.executed && !this.active)
            return { done: true };
          prev && prev();
          const promise = new Promise((resolve, reject) => {
            this.cursorFn = (value) => {
              resolve({ value, done: false });
              return new Promise((r) => prev = r);
            };
            this.resolve = () => (this.active = false, resolve({ done: true }));
            this.reject = (x) => (this.active = false, reject(x));
          });
          this.execute();
          return promise;
        },
        return() {
          prev && prev(CLOSE);
          return { done: true };
        }
      })
    };
  }
  describe() {
    this.onlyDescribe = true;
    return this;
  }
  stream() {
    throw new Error(".stream has been renamed to .forEach");
  }
  forEach(fn) {
    this.forEachFn = fn;
    return this;
  }
  raw() {
    this.isRaw = true;
    return this;
  }
  async handle() {
    !this.executed && (this.executed = true) && await 1 && this.handler(this);
  }
  execute() {
    this.handle();
    return this;
  }
  then() {
    this.handle();
    return super.then.apply(this, arguments);
  }
  catch() {
    this.handle();
    return super.catch.apply(this, arguments);
  }
  finally() {
    this.handle();
    return super.finally.apply(this, arguments);
  }
};
function cachedError(xs) {
  if (originCache.has(xs))
    return originCache.get(xs);
  const x = Error.stackTraceLimit;
  Error.stackTraceLimit = 4;
  originCache.set(xs, new Error());
  Error.stackTraceLimit = x;
  return originCache.get(xs);
}

// node_modules/postgres/src/errors.js
var PostgresError = class extends Error {
  constructor(x) {
    super(x.message);
    this.name = this.constructor.name;
    Object.assign(this, x);
  }
};
var Errors = {
  connection,
  postgres,
  generic,
  notSupported
};
function connection(x, options, socket) {
  const { host, port } = socket || options;
  const error = Object.assign(new Error("write " + x + " " + (options.path || host + ":" + port)), {
    code: x,
    errno: x,
    address: options.path || host
  }, options.path ? {} : { port });
  Error.captureStackTrace(error, connection);
  return error;
}
function postgres(x) {
  const error = new PostgresError(x);
  Error.captureStackTrace(error, postgres);
  return error;
}
function generic(code, message) {
  const error = Object.assign(new Error(code + ": " + message), { code });
  Error.captureStackTrace(error, generic);
  return error;
}
function notSupported(x) {
  const error = Object.assign(new Error(x + " (B) is not supported"), {
    code: "MESSAGE_NOT_SUPPORTED",
    name: x
  });
  Error.captureStackTrace(error, notSupported);
  return error;
}

// node_modules/postgres/src/types.js
var types = {
  string: {
    to: 25,
    from: null,
    serialize: (x) => "" + x
  },
  number: {
    to: 0,
    from: [21, 23, 26, 700, 701],
    serialize: (x) => "" + x,
    parse: (x) => +x
  },
  json: {
    to: 114,
    from: [114, 3802],
    serialize: (x) => JSON.stringify(x),
    parse: (x) => JSON.parse(x)
  },
  boolean: {
    to: 16,
    from: 16,
    serialize: (x) => x === true ? "t" : "f",
    parse: (x) => x === "t"
  },
  date: {
    to: 1184,
    from: [1082, 1114, 1184],
    serialize: (x) => (x instanceof Date ? x : new Date(x)).toISOString(),
    parse: (x) => new Date(x)
  },
  bytea: {
    to: 17,
    from: 17,
    serialize: (x) => "\\x" + Buffer.from(x).toString("hex"),
    parse: (x) => Buffer.from(x.slice(2), "hex")
  }
};
var NotTagged = class {
  then() {
    notTagged();
  }
  catch() {
    notTagged();
  }
  finally() {
    notTagged();
  }
};
var Identifier = class extends NotTagged {
  constructor(value) {
    super();
    this.value = escapeIdentifier(value);
  }
};
var Parameter = class extends NotTagged {
  constructor(value, type, array) {
    super();
    this.value = value;
    this.type = type;
    this.array = array;
  }
};
var Builder = class extends NotTagged {
  constructor(first, rest) {
    super();
    this.first = first;
    this.rest = rest;
  }
  build(before, parameters, types2, transform) {
    const keyword = builders.map(([x, fn]) => ({ fn, i: before.search(x) })).sort((a, b2) => a.i - b2.i).pop();
    if (keyword.i === -1)
      throw new Error("Could not infer helper mode");
    return keyword.fn(this.first, this.rest, parameters, types2, transform);
  }
};
function handleValue(x, parameters, types2) {
  const value = x instanceof Parameter ? x.value : x;
  if (value === void 0)
    throw Errors.generic("UNDEFINED_VALUE", "Undefined values are not allowed");
  return "$" + types2.push(x instanceof Parameter ? (parameters.push(x.value), x.array ? x.array[x.type || inferType(x.value)] || x.type || firstIsString(x.value) : x.type) : (parameters.push(x), inferType(x)));
}
var defaultHandlers = typeHandlers(types);
function valuesBuilder(first, parameters, types2, transform, columns) {
  let value;
  return first.map((row) => "(" + columns.map((column) => {
    value = row[column];
    return value instanceof Query ? value.strings[0] : value instanceof Identifier ? value.value : handleValue(value, parameters, types2);
  }).join(",") + ")").join(",");
}
function values(first, rest, parameters, types2, transform) {
  const multi = Array.isArray(first[0]);
  const columns = rest.length ? rest.flat() : Object.keys(multi ? first[0] : first);
  return valuesBuilder(multi ? first : [first], parameters, types2, transform, columns);
}
var builders = Object.entries({
  values,
  in: values,
  update(first, rest, parameters, types2, transform) {
    return (rest.length ? rest.flat() : Object.keys(first)).map((x) => escapeIdentifier(transform.column.to ? transform.column.to(x) : x) + "=" + handleValue(first[x], parameters, types2));
  },
  select(first, rest, parameters, types2, transform) {
    typeof first === "string" && (first = [first].concat(rest));
    if (Array.isArray(first))
      return first.map((x) => escapeIdentifier(transform.column.to ? transform.column.to(x) : x)).join(",");
    let value;
    const columns = rest.length ? rest.flat() : Object.keys(first);
    return columns.map((x) => {
      value = first[x];
      return (value instanceof Query ? value.strings[0] : value instanceof Identifier ? value.value : handleValue(value, parameters, types2)) + " as " + escapeIdentifier(transform.column.to ? transform.column.to(x) : x);
    }).join(",");
  },
  insert(first, rest, parameters, types2, transform) {
    const columns = rest.length ? rest.flat() : Object.keys(Array.isArray(first) ? first[0] : first);
    return "(" + columns.map((x) => escapeIdentifier(transform.column.to ? transform.column.to(x) : x)).join(",") + ")values" + valuesBuilder(Array.isArray(first) ? first : [first], parameters, types2, transform, columns);
  }
}).map(([x, fn]) => [new RegExp("(^|[\\s(])" + x, "i"), fn]);
function notTagged() {
  throw Errors.generic("NOT_TAGGED_CALL", "Query not called as a tagged template literal");
}
var serializers = defaultHandlers.serializers;
var parsers = defaultHandlers.parsers;
function firstIsString(x) {
  if (Array.isArray(x))
    return firstIsString(x[0]);
  return typeof x === "string" ? 1009 : 0;
}
var mergeUserTypes = function(types2) {
  const user = typeHandlers(types2 || {});
  return {
    serializers: Object.assign({}, serializers, user.serializers),
    parsers: Object.assign({}, parsers, user.parsers)
  };
};
function typeHandlers(types2) {
  return Object.keys(types2).reduce((acc, k) => {
    types2[k].from && [].concat(types2[k].from).forEach((x) => acc.parsers[x] = types2[k].parse);
    acc.serializers[types2[k].to] = types2[k].serialize;
    types2[k].from && [].concat(types2[k].from).forEach((x) => acc.serializers[x] = types2[k].serialize);
    return acc;
  }, { parsers: {}, serializers: {} });
}
var escapeIdentifier = function escape(str) {
  return '"' + str.replace(/"/g, '""').replace(/\./g, '"."') + '"';
};
var inferType = function inferType2(x) {
  return x instanceof Parameter ? x.type : x instanceof Date ? 1184 : x instanceof Uint8Array ? 17 : x === true || x === false ? 16 : typeof x === "bigint" ? 1700 : Array.isArray(x) ? inferType2(x[0]) : 0;
};
var escapeBackslash = /\\/g;
var escapeQuote = /"/g;
function arrayEscape(x) {
  return x.replace(escapeBackslash, "\\\\").replace(escapeQuote, '\\"');
}
var arraySerializer = function arraySerializer2(xs, serializer) {
  if (Array.isArray(xs) === false)
    return xs;
  if (!xs.length)
    return "{}";
  const first = xs[0];
  if (Array.isArray(first) && !first.type)
    return "{" + xs.map((x) => arraySerializer2(x, serializer)).join(",") + "}";
  return "{" + xs.map((x) => '"' + arrayEscape(serializer ? serializer(x.type ? x.value : x) : "" + x) + '"').join(",") + "}";
};
var arrayParserState = {
  i: 0,
  char: null,
  str: "",
  quoted: false,
  last: 0
};
var arrayParser = function arrayParser2(x, parser) {
  arrayParserState.i = arrayParserState.last = 0;
  return arrayParserLoop(arrayParserState, x, parser);
};
function arrayParserLoop(s, x, parser) {
  const xs = [];
  for (; s.i < x.length; s.i++) {
    s.char = x[s.i];
    if (s.quoted) {
      if (s.char === "\\") {
        s.str += x[++s.i];
      } else if (s.char === '"') {
        xs.push(parser ? parser(s.str) : s.str);
        s.str = "";
        s.quoted = x[s.i + 1] === '"';
        s.last = s.i + 2;
      } else {
        s.str += s.char;
      }
    } else if (s.char === '"') {
      s.quoted = true;
    } else if (s.char === "{") {
      s.last = ++s.i;
      xs.push(arrayParserLoop(s, x, parser));
    } else if (s.char === "}") {
      s.quoted = false;
      s.last < s.i && xs.push(parser ? parser(x.slice(s.last, s.i)) : x.slice(s.last, s.i));
      s.last = s.i + 1;
      break;
    } else if (s.char === "," && s.p !== "}" && s.p !== '"') {
      xs.push(parser ? parser(x.slice(s.last, s.i)) : x.slice(s.last, s.i));
      s.last = s.i + 1;
    }
    s.p = s.char;
  }
  s.last < s.i && xs.push(parser ? parser(x.slice(s.last, s.i + 1)) : x.slice(s.last, s.i + 1));
  return xs;
}
var toCamel = (x) => {
  let str = x[0];
  for (let i = 1; i < x.length; i++)
    str += x[i] === "_" ? x[++i].toUpperCase() : x[i];
  return str;
};
var toPascal = (x) => {
  let str = x[0].toUpperCase();
  for (let i = 1; i < x.length; i++)
    str += x[i] === "_" ? x[++i].toUpperCase() : x[i];
  return str;
};
var toKebab = (x) => x.replace(/_/g, "-");
var fromCamel = (x) => x.replace(/([A-Z])/g, "_$1").toLowerCase();
var fromPascal = (x) => (x.slice(0, 1) + x.slice(1).replace(/([A-Z])/g, "_$1")).toLowerCase();
var fromKebab = (x) => x.replace(/-/g, "_");

// node_modules/postgres/src/connection.js
var import_net = __toModule(require("net"));
var import_tls = __toModule(require("tls"));
var import_crypto = __toModule(require("crypto"));
var import_stream = __toModule(require("stream"));

// node_modules/postgres/src/result.js
var Result = class extends Array {
  constructor() {
    super();
    Object.defineProperties(this, {
      count: { value: null, writable: true },
      state: { value: null, writable: true },
      command: { value: null, writable: true },
      columns: { value: null, writable: true },
      statement: { value: null, writable: true }
    });
  }
  static get [Symbol.species]() {
    return Array;
  }
};

// node_modules/postgres/src/queue.js
var queue_default = Queue;
function Queue(initial = []) {
  let xs = initial.slice();
  let index = 0;
  return {
    get length() {
      return xs.length - index;
    },
    remove: (x) => {
      const index2 = xs.indexOf(x);
      return index2 === -1 ? null : (xs.splice(index2, 1), x);
    },
    push: (x) => (xs.push(x), x),
    shift: () => {
      const out = xs[index++];
      if (index === xs.length) {
        index = 0;
        xs = [];
      } else {
        xs[index - 1] = void 0;
      }
      return out;
    }
  };
}

// node_modules/postgres/src/bytes.js
var size = 256;
var buffer = Buffer.allocUnsafe(size);
var messages = "BCcDdEFfHPpQSX".split("").reduce((acc, x) => {
  const v = x.charCodeAt(0);
  acc[x] = () => {
    buffer[0] = v;
    b.i = 5;
    return b;
  };
  return acc;
}, {});
var b = Object.assign(reset, messages, {
  N: String.fromCharCode(0),
  i: 0,
  inc(x) {
    b.i += x;
    return b;
  },
  str(x) {
    const length = Buffer.byteLength(x);
    fit(length);
    b.i += buffer.write(x, b.i, length, "utf8");
    return b;
  },
  i16(x) {
    fit(2);
    buffer.writeUInt16BE(x, b.i);
    b.i += 2;
    return b;
  },
  i32(x, i) {
    if (i || i === 0) {
      buffer.writeUInt32BE(x, i);
      return b;
    }
    fit(4);
    buffer.writeUInt32BE(x, b.i);
    b.i += 4;
    return b;
  },
  z(x) {
    fit(x);
    buffer.fill(0, b.i, b.i + x);
    b.i += x;
    return b;
  },
  raw(x) {
    buffer = Buffer.concat([buffer.slice(0, b.i), x]);
    b.i = buffer.length;
    return b;
  },
  end(at = 1) {
    buffer.writeUInt32BE(b.i - at, at);
    const out = buffer.slice(0, b.i);
    b.i = 0;
    buffer = Buffer.allocUnsafe(size);
    return out;
  }
});
var bytes_default = b;
function fit(x) {
  if (buffer.length - b.i < x) {
    const prev = buffer, length = prev.length;
    buffer = Buffer.allocUnsafe(length + (length >> 1) + x);
    prev.copy(buffer);
  }
}
function reset() {
  b.i = 0;
  return b;
}

// node_modules/postgres/src/connection.js
var connection_default = Connection;
var uid = 1;
var Sync = bytes_default().S().end();
var Flush = bytes_default().H().end();
var SSLRequest = bytes_default().i32(8).i32(80877103).end(8);
var ExecuteUnnamed = Buffer.concat([bytes_default().E().str(bytes_default.N).i32(0).end(), Sync]);
var DescribeUnnamed = bytes_default().D().str("S").str(bytes_default.N).end();
var noop = () => {
};
var retryRoutines = new Set([
  "FetchPreparedStatement",
  "RevalidateCachedQuery",
  "transformAssignedExpr"
]);
var errorFields = {
  83: "severity_local",
  86: "severity",
  67: "code",
  77: "message",
  68: "detail",
  72: "hint",
  80: "position",
  112: "internal_position",
  113: "internal_query",
  87: "where",
  115: "schema_name",
  116: "table_name",
  99: "column_name",
  100: "data type_name",
  110: "constraint_name",
  70: "file",
  76: "line",
  82: "routine"
};
function Connection(options, { onopen = noop, onend = noop, ondrain = noop, onclose = noop } = {}) {
  const {
    ssl,
    max,
    user,
    host,
    port,
    database,
    parsers: parsers2,
    transform,
    onnotice,
    onnotify,
    onparameter,
    max_pipeline,
    keep_alive,
    backoff: backoff2,
    target_session_attrs
  } = options;
  const sent = queue_default(), id = uid++, backend = { pid: null, secret: null }, idleTimer = timer(end, options.idle_timeout), lifeTimer = timer(end, options.max_lifetime), connectTimer = timer(connectTimedOut, options.connect_timeout);
  let socket = createSocket(), result = new Result(), incoming = Buffer.alloc(0), needsTypes = options.fetch_types, backendParameters = {}, statements = {}, state = "closed", statementId = Math.random().toString(36).slice(2), statementCount = 1, closedDate = 0, remaining = 0, hostIndex = 0, retries = 0, length = 0, delay = 0, rows = 0, serverSignature = null, nextWriteTimer = null, terminated = false, incomings = null, results = null, initial = null, ending = null, stream = null, chunk = null, ended = null, nonce = null, query = null, final = null;
  const connection2 = {
    get state() {
      return state;
    },
    set state(x) {
      state = x;
      state === "open" ? idleTimer.start() : idleTimer.cancel();
    },
    connect(query2) {
      initial = query2;
      reconnect();
    },
    terminate,
    execute,
    cancel,
    end,
    count: 0,
    id
  };
  return connection2;
  function createSocket() {
    const x = import_net.default.Socket();
    x.on("error", error);
    x.on("close", closed);
    x.on("drain", drain);
    return x;
  }
  function cancel({ pid, secret }, resolve, reject) {
    socket.removeAllListeners();
    socket = import_net.default.Socket();
    socket.on("connect", () => socket.write(bytes_default().i32(16).i32(80877102).i32(pid).i32(secret).end(16)));
    socket.once("error", reject);
    socket.once("close", resolve);
    connect();
  }
  function execute(q) {
    if (terminated)
      return q.reject(Errors.connection("CONNECTION_DESTROYED", options));
    if (q.cancelled)
      return;
    try {
      q.state = backend;
      query ? sent.push(q) : (query = q, query.active = true);
      build(q);
      return write(toBuffer(q)) && !q.describeFirst && sent.length < max_pipeline && (!q.options.onexecute || q.options.onexecute(connection2));
    } catch (error2) {
      sent.length === 0 && write(Sync);
      errored(error2);
      return true;
    }
  }
  function toBuffer(q) {
    if (q.parameters.length >= 65534)
      throw Errors.generic("MAX_PARAMETERS_EXCEEDED", "Max number of parameters (65534) exceeded");
    return q.options.simple ? bytes_default().Q().str(q.strings[0] + bytes_default.N).end() : q.describeFirst ? Buffer.concat([describe(q), Flush]) : q.prepare ? q.prepared ? prepared(q) : Buffer.concat([describe(q), prepared(q)]) : unnamed(q);
  }
  function describe(q) {
    return Buffer.concat([
      Parse(q.statement.string, q.parameters, q.statement.types, q.statement.name),
      Describe("S", q.statement.name)
    ]);
  }
  function prepared(q) {
    return Buffer.concat([
      Bind(q.parameters, q.statement.types, q.statement.name, q.cursorName),
      q.cursorFn ? Execute("", q.cursorRows) : ExecuteUnnamed
    ]);
  }
  function unnamed(q) {
    return Buffer.concat([
      Parse(q.statement.string, q.parameters, q.statement.types),
      DescribeUnnamed,
      prepared(q)
    ]);
  }
  function build(q) {
    const parameters = [], types2 = [];
    const string = stringify(q, q.strings[0], q.args[0], parameters, types2);
    !q.tagged && q.args.forEach((x) => handleValue(x, parameters, types2));
    q.prepare = options.prepare && ("prepare" in q.options ? q.options.prepare : true);
    q.string = string;
    q.signature = q.prepare && types2 + string;
    q.onlyDescribe && delete statements[q.signature];
    q.parameters = q.parameters || parameters;
    q.prepared = q.prepare && q.signature in statements;
    q.describeFirst = q.onlyDescribe || parameters.length && !q.prepared;
    q.statement = q.prepared ? statements[q.signature] : { string, types: types2, name: q.prepare ? statementId + statementCount++ : "" };
    typeof options.debug === "function" && options.debug(id, string, parameters, types2);
  }
  function stringify(q, string, value, parameters, types2) {
    for (let i = 1; i < q.strings.length; i++) {
      string += (value instanceof Query ? fragment(string, value, parameters, types2) : value instanceof Identifier ? value.value : value instanceof Builder ? value.build(string, parameters, types2, options.transform) : handleValue(value, parameters, types2)) + q.strings[i];
      value = q.args[i];
    }
    return string;
  }
  function fragment(string, q, parameters, types2) {
    q.fragment = true;
    return stringify(q, q.strings[0], q.args[0], parameters, types2);
  }
  function write(x, fn) {
    chunk = chunk ? Buffer.concat([chunk, x]) : Buffer.from(x);
    if (fn || chunk.length >= 1024)
      return nextWrite(fn);
    nextWriteTimer === null && (nextWriteTimer = setImmediate(nextWrite));
    return true;
  }
  function nextWrite(fn) {
    const x = socket.write(chunk, fn);
    nextWriteTimer !== null && clearImmediate(nextWriteTimer);
    chunk = nextWriteTimer = null;
    return x;
  }
  function connectTimedOut() {
    errored(Errors.connection("CONNECT_TIMEOUT", options, socket));
    socket.destroy();
  }
  async function secure() {
    write(SSLRequest);
    const canSSL = await new Promise((r) => socket.once("data", (x) => r(x[0] === 83)));
    if (!canSSL && ssl === "prefer")
      return connected();
    socket.removeAllListeners();
    socket = import_tls.default.connect(__spreadValues({
      socket
    }, ssl === "require" || ssl === "allow" || ssl === "prefer" ? { rejectUnauthorized: false } : ssl));
    socket.on("secureConnect", connected);
    socket.on("error", error);
    socket.on("close", closed);
    socket.on("drain", drain);
  }
  function drain() {
    ondrain(connection2);
  }
  function data(x) {
    if (incomings) {
      incomings.push(x);
      remaining -= x.length;
      if (remaining >= 0)
        return;
    }
    incoming = incomings ? Buffer.concat(incomings, length - remaining) : incoming.length === 0 ? x : Buffer.concat([incoming, x], incoming.length + x.length);
    while (incoming.length > 4) {
      length = incoming.readUInt32BE(1);
      if (length >= incoming.length) {
        remaining = length - incoming.length;
        incomings = [incoming];
        break;
      }
      try {
        handle(incoming.slice(0, length + 1));
      } catch (e) {
        query && (query.cursorFn || query.describeFirst) && write(Sync);
        errored(e);
      }
      incoming = incoming.slice(length + 1);
      remaining = 0;
      incomings = null;
    }
  }
  function connect() {
    terminated = false;
    backendParameters = {};
    connectTimer.start();
    socket.on("connect", ssl ? secure : connected);
    if (options.path)
      return socket.connect(options.path);
    socket.connect(port[hostIndex], host[hostIndex]);
    hostIndex = (hostIndex + 1) % port.length;
  }
  function reconnect() {
    setTimeout(connect, closedDate ? closedDate + delay - Date.now() : 0);
  }
  function connected() {
    try {
      statements = {};
      needsTypes = options.fetch_types;
      statementId = Math.random().toString(36).slice(2);
      statementCount = 1;
      lifeTimer.start();
      socket.on("data", data);
      socket.setKeepAlive(true, 1e3 * keep_alive);
      const s = StartupMessage();
      write(s);
    } catch (err) {
      error(err);
    }
  }
  function error(err) {
    if (connection2.state === "connecting" && options.host[retries + 1])
      return;
    errored(err);
    while (sent.length)
      queryError(sent.shift(), err);
  }
  function errored(err) {
    stream && (stream.destroy(err), stream = null);
    query && queryError(query, err);
    initial && (queryError(initial, err), initial = null);
  }
  function queryError(query2, err) {
    query2.reject(Object.create(err, {
      stack: { value: err.stack + query2.origin.replace(/.*\n/, "\n"), enumerable: options.debug },
      query: { value: query2.string, enumerable: options.debug },
      parameters: { value: query2.parameters, enumerable: options.debug },
      args: { value: query2.args, enumerable: options.debug },
      types: { value: query2.statement && query2.statement.types, enumerable: options.debug }
    }));
  }
  function end() {
    return ending || (!connection2.reserved && onend(connection2), !connection2.reserved && !initial && !query && sent.length === 0 ? Promise.resolve(terminate()) : ending = new Promise((r) => ended = r));
  }
  function terminate() {
    terminated = true;
    if (stream || query || initial || sent.length)
      error(Errors.connection("CONNECTION_DESTROYED", options));
    clearImmediate(nextWriteTimer);
    socket.removeListener("data", data);
    socket.removeListener("connect", connected);
    socket.readyState !== "closed" && socket.end(bytes_default().X().end());
    ended && (ended(), ending = ended = null);
  }
  function closed(hadError) {
    incoming = Buffer.alloc(0);
    remaining = 0;
    incomings = null;
    clearImmediate(nextWriteTimer);
    socket.removeListener("data", data);
    socket.removeListener("connect", connected);
    idleTimer.cancel();
    lifeTimer.cancel();
    connectTimer.cancel();
    if (socket.encrypted) {
      socket.removeAllListeners();
      socket = createSocket();
    }
    if (initial)
      return reconnect();
    !hadError && (query || sent.length) && error(Errors.connection("CONNECTION_CLOSED", options, socket));
    closedDate = Date.now();
    hadError && options.shared.retries++;
    delay = (typeof backoff2 === "function" ? backoff2(options.shared.retries) : backoff2) * 1e3;
    onclose(connection2);
  }
  function handle(xs, x = xs[0]) {
    (x === 68 ? DataRow : x === 100 ? CopyData : x === 65 ? NotificationResponse : x === 83 ? ParameterStatus : x === 90 ? ReadyForQuery : x === 67 ? CommandComplete : x === 50 ? BindComplete : x === 49 ? ParseComplete : x === 116 ? ParameterDescription : x === 84 ? RowDescription : x === 82 ? Authentication : x === 110 ? NoData : x === 75 ? BackendKeyData : x === 69 ? ErrorResponse : x === 115 ? PortalSuspended : x === 51 ? CloseComplete : x === 71 ? CopyInResponse : x === 78 ? NoticeResponse : x === 72 ? CopyOutResponse : x === 99 ? CopyDone : x === 73 ? EmptyQueryResponse : x === 86 ? FunctionCallResponse : x === 118 ? NegotiateProtocolVersion : x === 87 ? CopyBothResponse : UnknownMessage)(xs);
  }
  function DataRow(x) {
    let index = 7;
    let length2;
    let column;
    let value;
    const row = query.isRaw ? new Array(query.statement.columns.length) : {};
    for (let i = 0; i < query.statement.columns.length; i++) {
      column = query.statement.columns[i];
      length2 = x.readInt32BE(index);
      index += 4;
      value = length2 === -1 ? null : query.isRaw ? x.slice(index, index += length2) : column.parser === void 0 ? x.toString("utf8", index, index += length2) : column.parser.array === true ? column.parser(x.toString("utf8", index + 1, index += length2)) : column.parser(x.toString("utf8", index, index += length2));
      query.isRaw ? row[i] = value : row[column.name] = transform.value.from ? transform.value.from(value) : value;
    }
    query.forEachFn ? query.forEachFn(transform.row.from ? transform.row.from(row) : row, result) : result[rows++] = transform.row.from ? transform.row.from(row) : row;
  }
  function ParameterStatus(x) {
    const [k, v] = x.toString("utf8", 5, x.length - 1).split(bytes_default.N);
    backendParameters[k] = v;
    if (options.parameters[k] !== v) {
      options.parameters[k] = v;
      onparameter && onparameter(k, v);
    }
  }
  function ReadyForQuery(x) {
    query && query.options.simple && query.resolve(results || result);
    query = results = null;
    result = new Result();
    connectTimer.cancel();
    if (initial) {
      if (target_session_attrs) {
        if (!backendParameters.in_hot_standby || !backendParameters.default_transaction_read_only)
          return fetchState();
        else if (tryNext(target_session_attrs, backendParameters))
          return terminate();
      }
      if (needsTypes)
        return fetchArrayTypes();
      execute(initial);
      options.shared.retries = retries = initial = 0;
      return;
    }
    while (sent.length && (query = sent.shift()) && (query.active = true) && query.cancelled)
      Connection(options, {}).cancel(query.state, query.cancelled.resolve, query.cancelled.reject);
    if (query)
      return;
    connection2.reserved ? x[5] === 73 ? ending ? terminate() : (connection2.reserved = null, onopen(connection2)) : connection2.reserved() : ending ? terminate() : onopen(connection2);
  }
  function CommandComplete(x) {
    rows = 0;
    for (let i = x.length - 1; i > 0; i--) {
      if (x[i] === 32 && x[i + 1] < 58 && result.count === null)
        result.count = +x.toString("utf8", i + 1, x.length - 1);
      if (x[i - 1] >= 65) {
        result.command = x.toString("utf8", 5, i);
        result.state = backend;
        break;
      }
    }
    final && (final(), final = null);
    if (result.command === "BEGIN" && max !== 1 && !connection2.reserved)
      return errored(Errors.generic("UNSAFE_TRANSACTION", "Only use sql.begin or max: 1"));
    if (query.options.simple)
      return;
    if (query.cursorFn) {
      result.count && query.cursorFn(result);
      write(Sync);
    }
    query.resolve(result);
  }
  function ParseComplete() {
    query.parsing = false;
  }
  function BindComplete() {
    !result.statement && (result.statement = query.statement);
    result.columns = query.statement.columns;
  }
  function ParameterDescription(x) {
    const length2 = x.readUInt16BE(5);
    for (let i = 0; i < length2; ++i)
      !query.statement.types[i] && (query.statement.types[i] = x.readUInt32BE(7 + i * 4));
    query.prepare && (statements[query.signature] = query.statement);
    query.describeFirst && !query.onlyDescribe && (write(prepared(query)), query.describeFirst = false);
  }
  function RowDescription(x) {
    if (result.command) {
      results = results || [result];
      results.push(result = new Result());
      result.count = null;
      query.statement.columns = null;
    }
    const length2 = x.readUInt16BE(5);
    let index = 7;
    let start;
    query.statement.columns = Array(length2);
    for (let i = 0; i < length2; ++i) {
      start = index;
      while (x[index++] !== 0)
        ;
      const type = x.readUInt32BE(index + 6);
      query.statement.columns[i] = {
        name: transform.column.from ? transform.column.from(x.toString("utf8", start, index - 1)) : x.toString("utf8", start, index - 1),
        parser: parsers2[type],
        type
      };
      index += 18;
    }
    result.statement = query.statement;
    if (query.onlyDescribe)
      return query.resolve(query.statement), write(Sync);
  }
  async function Authentication(x, type = x.readUInt32BE(5)) {
    (type === 3 ? AuthenticationCleartextPassword : type === 5 ? AuthenticationMD5Password : type === 10 ? SASL : type === 11 ? SASLContinue : type === 12 ? SASLFinal : type !== 0 ? UnknownAuth : noop)(x, type);
  }
  async function AuthenticationCleartextPassword() {
    write(bytes_default().p().str(await Pass()).z(1).end());
  }
  async function AuthenticationMD5Password(x) {
    write(bytes_default().p().str("md5" + md5(Buffer.concat([Buffer.from(md5(await Pass() + user)), x.slice(9)]))).z(1).end());
  }
  function SASL() {
    bytes_default().p().str("SCRAM-SHA-256" + bytes_default.N);
    const i = bytes_default.i;
    nonce = import_crypto.default.randomBytes(18).toString("base64");
    write(bytes_default.inc(4).str("n,,n=*,r=" + nonce).i32(bytes_default.i - i - 4, i).end());
  }
  async function SASLContinue(x) {
    const res = x.toString("utf8", 9).split(",").reduce((acc, x2) => (acc[x2[0]] = x2.slice(2), acc), {});
    const saltedPassword = import_crypto.default.pbkdf2Sync(await Pass(), Buffer.from(res.s, "base64"), parseInt(res.i), 32, "sha256");
    const clientKey = hmac(saltedPassword, "Client Key");
    const auth = "n=*,r=" + nonce + ",r=" + res.r + ",s=" + res.s + ",i=" + res.i + ",c=biws,r=" + res.r;
    serverSignature = hmac(hmac(saltedPassword, "Server Key"), auth).toString("base64");
    write(bytes_default().p().str("c=biws,r=" + res.r + ",p=" + xor(clientKey, hmac(sha256(clientKey), auth)).toString("base64")).end());
  }
  function SASLFinal(x) {
    if (x.toString("utf8", 9).split(bytes_default.N, 1)[0].slice(2) === serverSignature)
      return;
    errored(Errors.generic("SASL_SIGNATURE_MISMATCH", "The server did not return the correct signature"));
    socket.destroy();
  }
  function Pass() {
    return Promise.resolve(typeof options.pass === "function" ? options.pass() : options.pass);
  }
  function NoData() {
    result.statement = query.statement;
    result.statement.columns = [];
    if (query.onlyDescribe)
      return query.resolve(query.statement), write(Sync);
  }
  function BackendKeyData(x) {
    backend.pid = x.readUInt32BE(5);
    backend.secret = x.readUInt32BE(9);
  }
  async function fetchArrayTypes() {
    needsTypes = false;
    const types2 = await new Query([`
      select b.oid, b.typarray
      from pg_catalog.pg_type a
      left join pg_catalog.pg_type b on b.oid = a.typelem
      where a.typcategory = 'A'
      group by b.oid, b.typarray
      order by b.oid
    `], [], execute);
    types2.forEach(({ oid, typarray }) => addArrayType(oid, typarray));
  }
  function addArrayType(oid, typarray) {
    const parser = options.parsers[oid];
    options.shared.typeArrayMap[oid] = typarray;
    options.parsers[typarray] = (xs) => arrayParser(xs, parser);
    options.parsers[typarray].array = true;
    options.serializers[typarray] = (xs) => arraySerializer(xs, options.serializers[oid]);
  }
  function tryNext(x, xs) {
    return x === "read-write" && xs.default_transaction_read_only === "on" || x === "read-only" && xs.default_transaction_read_only === "off" || x === "primary" && xs.in_hot_standby === "off" || x === "standby" && xs.in_hot_standby === "on" || x === "prefer-standby" && xs.in_hot_standby === "off" && options.host[retries];
  }
  function fetchState() {
    const query2 = new Query([`
      show transaction_read_only;
      select pg_catalog.pg_is_in_recovery()
    `], [], execute, null, { simple: true });
    query2.resolve = ([[a], [b2]]) => {
      backendParameters.default_transaction_read_only = a.transaction_read_only;
      backendParameters.in_hot_standby = b2.pg_is_in_recovery ? "on" : "off";
    };
    query2.execute();
  }
  function ErrorResponse(x) {
    query && (query.cursorFn || query.describeFirst) && write(Sync);
    const error2 = Errors.postgres(parseError(x));
    query && query.retried ? errored(query.retried) : query && retryRoutines.has(error2.routine) ? retry(query, error2) : errored(error2);
  }
  function retry(q, error2) {
    delete statements[q.signature];
    q.retried = error2;
    execute(q);
  }
  function NotificationResponse(x) {
    if (!onnotify)
      return;
    let index = 9;
    while (x[index++] !== 0)
      ;
    onnotify(x.toString("utf8", 9, index - 1), x.toString("utf8", index, x.length - 1));
  }
  async function PortalSuspended() {
    try {
      const x = await Promise.resolve(query.cursorFn(result));
      rows = 0;
      x === CLOSE ? write(Close(query.portal)) : (result = new Result(), write(Execute("", query.cursorRows)));
    } catch (err) {
      write(Sync);
      query.reject(err);
    }
  }
  function CloseComplete() {
    result.count && query.cursorFn(result);
    query.resolve(result);
  }
  function CopyInResponse() {
    stream = new import_stream.default.Writable({
      write(chunk2, encoding, callback) {
        socket.write(bytes_default().d().raw(chunk2).end(), callback);
      },
      destroy(error2, callback) {
        callback(error2);
        socket.write(bytes_default().f().str(error2 + bytes_default.N).end());
      },
      final(callback) {
        socket.write(bytes_default().c().end());
        final = callback;
      }
    });
    query.resolve(stream);
  }
  function CopyOutResponse() {
    stream = new import_stream.default.Readable({
      read() {
        socket.resume();
      }
    });
    query.resolve(stream);
  }
  function CopyBothResponse() {
    stream = new import_stream.default.Duplex({
      read() {
        socket.resume();
      },
      write(chunk2, encoding, callback) {
        socket.write(bytes_default().d().raw(chunk2).end(), callback);
      },
      destroy(error2, callback) {
        callback(error2);
        socket.write(bytes_default().f().str(error2 + bytes_default.N).end());
      },
      final(callback) {
        socket.write(bytes_default().c().end());
        final = callback;
      }
    });
    query.resolve(stream);
  }
  function CopyData(x) {
    stream.push(x.slice(5)) || socket.pause();
  }
  function CopyDone() {
    stream.push(null);
    stream = null;
  }
  function NoticeResponse(x) {
    onnotice ? onnotice(parseError(x)) : console.log(parseError(x));
  }
  function EmptyQueryResponse() {
  }
  function FunctionCallResponse() {
    errored(Errors.notSupported("FunctionCallResponse"));
  }
  function NegotiateProtocolVersion() {
    errored(Errors.notSupported("NegotiateProtocolVersion"));
  }
  function UnknownMessage(x) {
    console.error("Postgres.js : Unknown Message:", x[0]);
  }
  function UnknownAuth(x, type) {
    console.error("Postgres.js : Unknown Auth:", type);
  }
  function Bind(parameters, types2, statement = "", portal = "") {
    let prev, type;
    bytes_default().B().str(portal + bytes_default.N).str(statement + bytes_default.N).i16(0).i16(parameters.length);
    parameters.forEach((x, i) => {
      if (x === null)
        return bytes_default.i32(4294967295);
      type = types2[i];
      parameters[i] = x = type in options.serializers ? options.serializers[type](x) : "" + x;
      prev = bytes_default.i;
      bytes_default.inc(4).str(x).i32(bytes_default.i - prev - 4, prev);
    });
    bytes_default.i16(0);
    return bytes_default.end();
  }
  function Parse(str, parameters, types2, name = "") {
    bytes_default().P().str(name + bytes_default.N).str(str + bytes_default.N).i16(parameters.length);
    parameters.forEach((x, i) => bytes_default.i32(types2[i] || 0));
    return bytes_default.end();
  }
  function Describe(x, name = "") {
    return bytes_default().D().str(x).str(name + bytes_default.N).end();
  }
  function Execute(portal = "", rows2 = 0) {
    return Buffer.concat([
      bytes_default().E().str(portal + bytes_default.N).i32(rows2).end(),
      Flush
    ]);
  }
  function Close(portal = "") {
    return Buffer.concat([
      bytes_default().C().str("P").str(portal + bytes_default.N).end(),
      bytes_default().S().end()
    ]);
  }
  function StartupMessage() {
    return bytes_default().inc(4).i16(3).z(2).str(Object.entries(Object.assign({
      user,
      database,
      client_encoding: "'utf-8'"
    }, options.connection)).filter(([, v]) => v).map(([k, v]) => k + bytes_default.N + v).join(bytes_default.N)).z(2).end(0);
  }
}
function parseError(x) {
  const error = {};
  let start = 5;
  for (let i = 5; i < x.length - 1; i++) {
    if (x[i] === 0) {
      error[errorFields[x[start]]] = x.toString("utf8", start + 1, i);
      start = i + 1;
    }
  }
  return error;
}
function md5(x) {
  return import_crypto.default.createHash("md5").update(x).digest("hex");
}
function hmac(key, x) {
  return import_crypto.default.createHmac("sha256", key).update(x).digest();
}
function sha256(x) {
  return import_crypto.default.createHash("sha256").update(x).digest();
}
function xor(a, b2) {
  const length = Math.max(a.length, b2.length);
  const buffer2 = Buffer.allocUnsafe(length);
  for (let i = 0; i < length; i++)
    buffer2[i] = a[i] ^ b2[i];
  return buffer2;
}
function timer(fn, seconds) {
  seconds = typeof seconds === "function" ? seconds() : seconds;
  if (!seconds)
    return { cancel: noop, start: noop };
  let timer2;
  return {
    cancel() {
      timer2 && (clearTimeout(timer2), timer2 = null);
    },
    start() {
      timer2 && clearTimeout(timer2);
      timer2 = setTimeout(done, seconds * 1e3, arguments).unref();
    }
  };
  function done(args) {
    fn.apply(null, args);
    timer2 = null;
  }
}

// node_modules/postgres/src/subscribe.js
function Subscribe(postgres2, options) {
  const listeners = new Map();
  let connection2;
  return async function subscribe(event, fn) {
    event = parseEvent(event);
    options.max = 1;
    options.onclose = onclose;
    options.connection = __spreadProps(__spreadValues({}, options.connection), {
      replication: "database"
    });
    let stream, ended = false;
    const sql = postgres2(options), slot = "postgresjs_" + Math.random().toString(36).slice(2), end = sql.end;
    sql.end = async () => {
      ended = true;
      stream && await new Promise((r) => (stream.once("end", r), stream.end()));
      return end();
    };
    !connection2 && (subscribe.sql = sql, connection2 = init(sql, slot, options.publications));
    const fns = listeners.has(event) ? listeners.get(event).add(fn) : listeners.set(event, new Set([fn]));
    const unsubscribe = () => {
      fns.delete(fn);
      fns.size === 0 && listeners.delete(event);
    };
    return connection2.then((x) => (stream = x, { unsubscribe }));
    async function onclose() {
      stream = null;
      !ended && (stream = await init(sql, slot, options.publications));
    }
  };
  async function init(sql, slot, publications = "alltables") {
    if (!publications)
      throw new Error("Missing publication names");
    const [x] = await sql.unsafe(`CREATE_REPLICATION_SLOT ${slot} TEMPORARY LOGICAL pgoutput NOEXPORT_SNAPSHOT`);
    const stream = await sql.unsafe(`START_REPLICATION SLOT ${slot} LOGICAL ${x.consistent_point} (proto_version '1', publication_names '${publications}')`).writable();
    const state = {
      lsn: Buffer.concat(x.consistent_point.split("/").map((x2) => Buffer.from(("00000000" + x2).slice(-8), "hex")))
    };
    stream.on("data", data);
    stream.on("error", (error) => {
      console.error("Logical Replication Error - Reconnecting", error);
      sql.end();
    });
    return stream;
    function data(x2) {
      if (x2[0] === 119)
        parse(x2.slice(25), state, sql.options.parsers, handle);
      else if (x2[0] === 107 && x2[17])
        pong();
    }
    function handle(a, b2) {
      const path = b2.relation.schema + "." + b2.relation.table;
      call("*", a, b2);
      call("*:" + path, a, b2);
      b2.relation.keys.length && call("*:" + path + "=" + b2.relation.keys.map((x2) => a[x2.name]), a, b2);
      call(b2.command, a, b2);
      call(b2.command + ":" + path, a, b2);
      b2.relation.keys.length && call(b2.command + ":" + path + "=" + b2.relation.keys.map((x2) => a[x2.name]), a, b2);
    }
    function pong() {
      const x2 = Buffer.alloc(34);
      x2[0] = "r".charCodeAt(0);
      x2.fill(state.lsn, 1);
      x2.writeBigInt64BE(BigInt(Date.now() - Date.UTC(2e3, 0, 1)) * BigInt(1e3), 25);
      stream.write(x2);
    }
  }
  function call(x, a, b2) {
    listeners.has(x) && listeners.get(x).forEach((fn) => fn(a, b2, x));
  }
}
function Time(x) {
  return new Date(Date.UTC(2e3, 0, 1) + Number(x / BigInt(1e3)));
}
function parse(x, state, parsers2, handle) {
  const char = (acc, [k, v]) => (acc[k.charCodeAt(0)] = v, acc);
  Object.entries({
    R: (x2) => {
      let i = 1;
      const r = state[x2.readUInt32BE(i)] = {
        schema: String(x2.slice(i += 4, i = x2.indexOf(0, i))) || "pg_catalog",
        table: String(x2.slice(i + 1, i = x2.indexOf(0, i + 1))),
        columns: Array(x2.readUInt16BE(i += 2)),
        keys: []
      };
      i += 2;
      let columnIndex = 0, column;
      while (i < x2.length) {
        column = r.columns[columnIndex++] = {
          key: x2[i++],
          name: String(x2.slice(i, i = x2.indexOf(0, i))),
          type: x2.readUInt32BE(i += 1),
          parser: parsers2[x2.readUInt32BE(i)],
          atttypmod: x2.readUInt32BE(i += 4)
        };
        column.key && r.keys.push(column);
        i += 4;
      }
    },
    Y: () => {
    },
    O: () => {
    },
    B: (x2) => {
      state.date = Time(x2.readBigInt64BE(9));
      state.lsn = x2.slice(1, 9);
    },
    I: (x2) => {
      let i = 1;
      const relation = state[x2.readUInt32BE(i)];
      const row = {};
      tuples(x2, row, relation.columns, i += 7);
      handle(row, {
        command: "insert",
        relation
      });
    },
    D: (x2) => {
      let i = 1;
      const relation = state[x2.readUInt32BE(i)];
      i += 4;
      const key = x2[i] === 75;
      const row = key || x2[i] === 79 ? {} : null;
      tuples(x2, row, key ? relation.keys : relation.columns, i += 3);
      handle(row, {
        command: "delete",
        relation,
        key
      });
    },
    U: (x2) => {
      let i = 1;
      const relation = state[x2.readUInt32BE(i)];
      i += 4;
      const key = x2[i] === 75;
      const old = key || x2[i] === 79 ? {} : null;
      old && (i = tuples(x2, old, key ? relation.keys : relation.columns, ++i));
      const row = {};
      i = tuples(x2, row, relation.columns, i += 3);
      handle(row, {
        command: "update",
        relation,
        key,
        old
      });
    },
    T: () => {
    },
    C: () => {
    }
  }).reduce(char, {})[x[0]](x);
}
function tuples(x, row, columns, xi) {
  let type, column;
  for (let i = 0; i < columns.length; i++) {
    type = x[xi++];
    column = columns[i];
    row[column.name] = type === 110 ? null : type === 117 ? void 0 : column.parser === void 0 ? x.toString("utf8", xi + 4, xi += 4 + x.readUInt32BE(xi)) : column.parser.array === true ? column.parser(x.toString("utf8", xi + 5, xi += 4 + x.readUInt32BE(xi))) : column.parser(x.toString("utf8", xi + 4, xi += 4 + x.readUInt32BE(xi)));
  }
  return xi;
}
function parseEvent(x) {
  const xs = x.match(/^(\*|insert|update|delete)?:?([^.]+?\.?[^=]+)?=?(.+)?/i) || [];
  if (!xs)
    throw new Error("Malformed subscribe pattern: " + x);
  const [, command, path, key] = xs;
  return (command || "*") + (path ? ":" + (path.indexOf(".") === -1 ? "public." + path : path) : "") + (key ? "=" + key : "");
}

// node_modules/postgres/src/index.js
Object.assign(Postgres, {
  PostgresError,
  toPascal,
  toCamel,
  toKebab,
  fromPascal,
  fromCamel,
  fromKebab,
  BigInt
});
var src_default = Postgres;
function Postgres(a, b2) {
  const options = parseOptions(a, b2), subscribe = Subscribe(Postgres, __spreadValues({}, options));
  let ending = false;
  const queries = queue_default(), connections = [...Array(options.max)].map(() => connection_default(options, { onopen, onend, ondrain, onclose })), closed = queue_default(connections), reserved = queue_default(), open = queue_default(), busy = queue_default(), full = queue_default(), ended = queue_default(), connecting = queue_default(), queues = { closed, ended, connecting, reserved, open, busy, full };
  const sql = Sql(handler2);
  Object.assign(sql, {
    get parameters() {
      return options.parameters;
    },
    largeObject,
    subscribe,
    CLOSE,
    END: CLOSE,
    PostgresError,
    options,
    listen,
    notify,
    begin,
    end
  });
  return sql;
  function Sql(handler3, instant) {
    handler3.debug = options.debug;
    Object.entries(options.types).reduce((acc, [name, type]) => {
      acc[name] = (x) => new Parameter(x, type.to);
      return acc;
    }, typed);
    Object.assign(sql2, {
      types: typed,
      typed,
      unsafe,
      array,
      json,
      file
    });
    return sql2;
    function typed(value, type) {
      return new Parameter(value, type);
    }
    function sql2(strings, ...args) {
      const query = strings && Array.isArray(strings.raw) ? new Query(strings, args, handler3, cancel) : typeof strings === "string" && !args.length ? new Identifier(options.transform.column.to ? options.transform.column.to(strings) : strings) : new Builder(strings, args);
      instant && query instanceof Query && query.execute();
      return query;
    }
    function unsafe(string, args = [], options2 = {}) {
      arguments.length === 2 && !Array.isArray(args) && (options2 = args, args = []);
      const query = new Query([string], args, handler3, cancel, __spreadProps(__spreadValues({
        prepare: false
      }, options2), {
        simple: "simple" in options2 ? options2.simple : args.length === 0
      }));
      instant && query.execute();
      return query;
    }
    function file(path, args = [], options2 = {}) {
      arguments.length === 2 && !Array.isArray(args) && (options2 = args, args = []);
      const query = new Query([], args, (query2) => {
        import_fs.default.readFile(path, "utf8", (err, string) => {
          if (err)
            return query2.reject(err);
          query2.strings = [string];
          handler3(query2);
        });
      }, cancel, __spreadProps(__spreadValues({}, options2), {
        simple: "simple" in options2 ? options2.simple : args.length === 0
      }));
      instant && query.execute();
      return query;
    }
  }
  async function listen(name, fn) {
    const sql2 = listen.sql || (listen.sql = Postgres(__spreadProps(__spreadValues({}, options), {
      max: 1,
      idle_timeout: null,
      max_lifetime: null,
      fetch_types: false,
      onclose() {
        Object.entries(listen.channels).forEach(([channel2, { listeners }]) => {
          delete listen.channels[channel2];
          Promise.all(listeners.map((fn2) => listen(channel2, fn2).catch(() => {
          })));
        });
      },
      onnotify(c, x) {
        c in listen.channels && listen.channels[c].listeners.forEach((fn2) => fn2(x));
      }
    })));
    const channels = listen.channels || (listen.channels = {}), exists = name in channels, channel = exists ? channels[name] : channels[name] = { listeners: [fn] };
    if (exists) {
      channel.listeners.push(fn);
      return Promise.resolve(__spreadProps(__spreadValues({}, channel.result), { unlisten }));
    }
    channel.result = await sql2`listen ${sql2(name)}`;
    channel.result.unlisten = unlisten;
    return channel.result;
    async function unlisten() {
      if (name in channels === false)
        return;
      channel.listeners = channel.listeners.filter((x) => x !== fn);
      if (channels[name].listeners.length)
        return;
      delete channels[name];
      return sql2`unlisten ${sql2(name)}`;
    }
  }
  async function notify(channel, payload) {
    return await sql`select pg_notify(${channel}, ${"" + payload})`;
  }
  async function begin(options2, fn) {
    !fn && (fn = options2, options2 = "");
    const queries2 = queue_default();
    let savepoints = 0, connection2;
    try {
      await sql.unsafe("begin " + options2.replace(/[^a-z ]/ig, ""), [], { onexecute });
      return await scope(connection2, fn);
    } catch (error) {
      throw error;
    }
    async function scope(c, fn2, name) {
      const sql2 = Sql(handler3, true);
      sql2.savepoint = savepoint;
      let errored;
      name && await sql2`savepoint ${sql2(name)}`;
      try {
        const result = await new Promise((resolve, reject) => {
          errored = reject;
          const x = fn2(sql2);
          Promise.resolve(Array.isArray(x) ? Promise.all(x) : x).then(resolve, reject);
        });
        !name && await sql2`commit`;
        return result;
      } catch (e) {
        await (name ? sql2`rollback to ${sql2(name)}` : sql2`rollback`);
        throw e;
      }
      function savepoint(name2, fn3) {
        if (name2 && Array.isArray(name2.raw))
          return savepoint((sql3) => sql3.apply(sql3, arguments));
        arguments.length === 1 && (fn3 = name2, name2 = null);
        return scope(c, fn3, "s" + savepoints++ + (name2 ? "_" + name2 : ""));
      }
      function handler3(q) {
        errored && q.catch(errored);
        c.state === "full" ? queries2.push(q) : c.execute(q) || (c.state = "full", full.push(c));
      }
    }
    function onexecute(c) {
      queues[c.state].remove(c);
      c.state = "reserved";
      c.reserved = () => queries2.length ? c.execute(queries2.shift()) : c.state = "reserved";
      reserved.push(c);
      connection2 = c;
    }
  }
  function largeObject(oid, mode = 131072 | 262144) {
    return new Promise(async (resolve, reject) => {
      await sql.begin(async (sql2) => {
        let finish;
        !oid && ([{ oid }] = await sql2`select lo_creat(-1) as oid`);
        const [{ fd }] = await sql2`select lo_open(${oid}, ${mode}) as fd`;
        const lo = {
          writable,
          readable,
          close: () => sql2`select lo_close(${fd})`.then(finish),
          tell: () => sql2`select lo_tell64(${fd})`,
          read: (x) => sql2`select loread(${fd}, ${x}) as data`,
          write: (x) => sql2`select lowrite(${fd}, ${x})`,
          truncate: (x) => sql2`select lo_truncate64(${fd}, ${x})`,
          seek: (x, whence = 0) => sql2`select lo_lseek64(${fd}, ${x}, ${whence})`,
          size: () => sql2`
            select
              lo_lseek64(${fd}, location, 0) as position,
              seek.size
            from (
              select
                lo_lseek64($1, 0, 2) as size,
                tell.location
              from (select lo_tell64($1) as location) tell
            ) seek
          `
        };
        resolve(lo);
        return new Promise(async (r) => finish = r);
        async function readable({
          highWaterMark = 2048 * 8,
          start = 0,
          end: end2 = Infinity
        } = {}) {
          let max = end2 - start;
          start && await lo.seek(start);
          return new import_stream2.default.Readable({
            highWaterMark,
            async read(size2) {
              const l = size2 > max ? size2 - max : size2;
              max -= size2;
              const [{ data }] = await lo.read(l);
              this.push(data);
              if (data.length < size2)
                this.push(null);
            }
          });
        }
        async function writable({
          highWaterMark = 2048 * 8,
          start = 0
        } = {}) {
          start && await lo.seek(start);
          return new import_stream2.default.Writable({
            highWaterMark,
            write(chunk, encoding, callback) {
              lo.write(chunk).then(() => callback(), callback);
            }
          });
        }
      }).catch(reject);
    });
  }
  function json(x) {
    return new Parameter(x, 3802);
  }
  function array(x, type) {
    if (!Array.isArray(x))
      return array(Array.from(arguments));
    return new Parameter(x, type || (x.length ? inferType(x) || 25 : 0), options.shared.typeArrayMap);
  }
  function handler2(query) {
    if (ending)
      return query.reject(Errors.connection("CONNECTION_ENDED", options, options));
    if (open.length)
      return go(open, query);
    if (closed.length)
      return connect(closed.shift(), query);
    busy.length ? go(busy, query) : queries.push(query);
  }
  function go(xs, query) {
    const c = xs.shift();
    return c.execute(query) ? (c.state = "busy", busy.push(c)) : (c.state = "full", full.push(c));
  }
  function cancel(query) {
    return new Promise((resolve, reject) => {
      query.state ? query.active ? connection_default(options, {}).cancel(query.state, resolve, reject) : query.cancelled = { resolve, reject } : (queries.remove(query), query.cancelled = true, query.reject(Errors.generic("57014", "canceling statement due to user request")), resolve());
    });
  }
  async function end({ timeout = null } = {}) {
    if (ending)
      return ending;
    await 1;
    let timer2;
    return ending = Promise.race([
      new Promise((r) => timeout !== null && (timer2 = setTimeout(destroy, timeout * 1e3, r))),
      Promise.all(connections.map((c) => c.end()).concat(listen.sql ? listen.sql.end({ timeout: 0 }) : [], subscribe.sql ? subscribe.sql.end({ timeout: 0 }) : []))
    ]).then(() => clearTimeout(timer2));
  }
  async function destroy(resolve) {
    await Promise.all(connections.map((c) => c.terminate()));
    while (queries.length)
      queries.shift().reject(Errors.connection("CONNECTION_DESTROYED", options));
    resolve();
  }
  function connect(c, query) {
    c.state = "connecting";
    connecting.push(c);
    c.connect(query);
  }
  function onend(c) {
    queues[c.state].remove(c);
    c.state = "ended";
    ended.push(c);
  }
  function onopen(c) {
    queues[c.state].remove(c);
    if (queries.length === 0)
      return c.state = "open", open.push(c);
    let max = Math.ceil(queries.length / (connecting.length + 1)), ready = true;
    while (ready && queries.length && max-- > 0)
      ready = c.execute(queries.shift());
    ready ? (c.state = "busy", busy.push(c)) : (c.state = "full", full.push(c));
  }
  function ondrain(c) {
    full.remove(c);
    onopen(c);
  }
  function onclose(c) {
    queues[c.state].remove(c);
    c.state = "closed";
    c.reserved = null;
    options.onclose && options.onclose(c.id);
    queries.length ? connect(c, queries.shift()) : queues.closed.push(c);
  }
}
function parseOptions(a, b2) {
  if (a && a.shared)
    return a;
  const env = process.env, o = (typeof a === "string" ? b2 : a) || {}, { url, multihost } = parseUrl(a, env), query = url.searchParams, host = o.hostname || o.host || multihost || url.hostname || env.PGHOST || "localhost", port = o.port || url.port || env.PGPORT || 5432, user = o.user || o.username || url.username || env.PGUSERNAME || env.PGUSER || osUsername();
  return Object.assign({
    host: Array.isArray(host) ? host : host.split(",").map((x) => x.split(":")[0]),
    port: Array.isArray(port) ? port : host.split(",").map((x) => parseInt(x.split(":")[1] || port)),
    path: o.path || host.indexOf("/") > -1 && host + "/.s.PGSQL." + port,
    database: o.database || o.db || (url.pathname || "").slice(1) || env.PGDATABASE || user,
    user,
    pass: o.pass || o.password || url.password || env.PGPASSWORD || "",
    max: o.max || query.get("max") || 10,
    types: o.types || {},
    ssl: o.ssl || parseSSL(query.get("sslmode") || query.get("ssl")) || false,
    idle_timeout: o.idle_timeout || query.get("idle_timeout") || env.PGIDLE_TIMEOUT || warn(o.timeout),
    connect_timeout: o.connect_timeout || query.get("connect_timeout") || env.PGCONNECT_TIMEOUT || 30,
    max_lifetime: o.max_lifetime || url.max_lifetime || max_lifetime,
    max_pipeline: o.max_pipeline || url.max_pipeline || 100,
    backoff: o.backoff || url.backoff || backoff,
    keep_alive: o.keep_alive || url.keep_alive || 60,
    prepare: "prepare" in o ? o.prepare : "no_prepare" in o ? !o.no_prepare : true,
    onnotice: o.onnotice,
    onnotify: o.onnotify,
    onclose: o.onclose,
    onparameter: o.onparameter,
    transform: parseTransform(o.transform || {}),
    connection: Object.assign({ application_name: "postgres.js" }, o.connection),
    target_session_attrs: tsa(o, url, env),
    debug: o.debug,
    fetch_types: "fetch_types" in o ? o.fetch_types : true,
    parameters: {},
    shared: { retries: 0, typeArrayMap: {} }
  }, mergeUserTypes(o.types));
}
function tsa(o, url, env) {
  const x = o.target_session_attrs || url.searchParams.get("target_session_attrs") || env.PGTARGETSESSIONATTRS;
  if (!x || ["read-write", "read-only", "primary", "standby", "prefer-standby"].includes(x))
    return x;
  throw new Error("target_session_attrs " + x + " is not supported");
}
function backoff(retries) {
  return (0.5 + Math.random() / 2) * Math.min(3 ** retries / 100, 20);
}
function max_lifetime() {
  return 60 * (30 + Math.random() * 30);
}
function parseTransform(x) {
  return {
    column: {
      from: typeof x.column === "function" ? x.column : x.column && x.column.from,
      to: x.column && x.column.to
    },
    value: {
      from: typeof x.value === "function" ? x.value : x.value && x.value.from,
      to: x.value && x.value.to
    },
    row: {
      from: typeof x.row === "function" ? x.row : x.row && x.row.from,
      to: x.row && x.row.to
    }
  };
}
function parseSSL(x) {
  return x !== "disable" && x !== "false" && x;
}
function parseUrl(url) {
  if (typeof url !== "string")
    return { url: { searchParams: new Map() } };
  let host = url;
  host = host.slice(host.indexOf("://") + 3);
  host = host.split(/[?/]/)[0];
  host = host.slice(host.indexOf("@") + 1);
  return {
    url: new URL(url.replace(host, host.split(",")[0])),
    multihost: host.indexOf(",") > -1 && host
  };
}
function warn(x) {
  typeof x !== "undefined" && console.log("The timeout option is deprecated, use idle_timeout instead");
  return x;
}
function osUsername() {
  try {
    return import_os.default.userInfo().username;
  } catch (_) {
    return process.env.USERNAME || process.env.USER || process.env.LOGNAME;
  }
}

// functions/productQuantity.ts
require_main().config();
var handler = async (event, context) => {
  try {
    const { id } = JSON.parse(event.body);
    const sql = src_default(process.env.DB_URL);
    const data = await sql`SELECT quantity FROM products WHERE id = ${id}`;
    await sql.end();
    return {
      statusCode: 200,
      body: JSON.stringify(data[0])
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : "an error happened";
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=productQuantity.js.map
