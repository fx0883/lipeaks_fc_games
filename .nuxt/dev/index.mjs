import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import { resolve as resolve$1, dirname, join } from 'node:path';
import nodeCrypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, setCookie, removeResponseHeader, createError, getRequestHost, getRequestProtocol, setHeader, getQuery as getQuery$1, getHeader, getRouterParam, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getResponseStatusText } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/h3/dist/index.mjs';
import { escapeHtml } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/@vue/shared/dist/shared.cjs.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import destr, { destr as destr$1 } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/destr/dist/index.mjs';
import { stringify, uneval } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/devalue/index.js';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/unhead/dist/server.mjs';
import defu, { defuFn, defu as defu$1, createDefu } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/defu/dist/defu.mjs';
import { toRouteMatcher, createRouter } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/radix3/dist/index.mjs';
import consola, { consola as consola$1, createConsola } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/consola/dist/index.mjs';
import { klona } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/klona/dist/index.mjs';
import { snakeCase } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/scule/dist/index.mjs';
import { isVNode, toValue, isRef } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/vue/index.mjs';
import { createHooks } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://D:/GitHub/lipeaks_fc_games/node_modules/unstorage/drivers/fs.mjs';
import { digest } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/ohash/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import { ErrorParser } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/youch-core/build/index.js';
import { Youch } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/nitropack/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/nitropack/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/errx/dist/index.js';
import devalue from 'file://D:/GitHub/lipeaks_fc_games/node_modules/@nuxt/devalue/dist/devalue.mjs';
import { createPathIndexLanguageParser, parseAcceptLanguage } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/@intlify/utils/dist/index.mjs';
import { parse } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/cookie-es/dist/index.mjs';
import { createRouterMatcher } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/vue-router/dist/vue-router.node.mjs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$2 } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/pathe/dist/index.mjs';
import { renderToString } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/vue/server-renderer/index.mjs';
import { walkResolver } from 'file://D:/GitHub/lipeaks_fc_games/node_modules/unhead/dist/utils.mjs';

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withoutLeadingSlash(input = "") {
  return (hasLeadingSlash(input) ? input.slice(1) : input) || "/";
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}
function withHttps(input) {
  return withProtocol(input, "https://");
}
function withoutProtocol(input) {
  return withProtocol(input, "");
}
function withProtocol(input, protocol) {
  let match = input.match(PROTOCOL_REGEX);
  if (!match) {
    match = input.match(/^\/{2,}/);
  }
  if (!match) {
    return protocol + input;
  }
  return protocol + input.slice(match[0].length);
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const serverAssets = [{"baseName":"server","dir":"D:/GitHub/lipeaks_fc_games/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage$1 = createStorage({});

storage$1.mount('/assets', assets$1);

storage$1.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/GitHub/lipeaks_fc_games","watchOptions":{"ignored":[null]}}));
storage$1.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/GitHub/lipeaks_fc_games/server","watchOptions":{"ignored":[null]}}));
storage$1.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/GitHub/lipeaks_fc_games/.nuxt"}));
storage$1.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/GitHub/lipeaks_fc_games/.nuxt/cache"}));
storage$1.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"D:/GitHub/lipeaks_fc_games/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage$1, base) : storage$1;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/api/**": {
        "cache": {
          "maxAge": 300,
          "swr": true
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable",
          "X-Robots-Tag": "noindex"
        },
        "robots": "noindex"
      },
      "/emulatorjs/**": {
        "headers": {
          "cache-control": "public, max-age=31536000"
        }
      },
      "/__sitemap__/style.xsl": {
        "headers": {
          "Content-Type": "application/xslt+xml"
        }
      },
      "/sitemap.xml": {
        "redirect": {
          "to": "/sitemap_index.xml",
          "statusCode": 307
        }
      },
      "/sitemap_index.xml": {
        "headers": {
          "Content-Type": "text/xml; charset=UTF-8",
          "Cache-Control": "public, max-age=600, must-revalidate",
          "X-Sitemap-Prerendered": "2025-08-22T11:49:03.407Z"
        }
      },
      "/__sitemap__/en-US.xml": {
        "headers": {
          "Content-Type": "text/xml; charset=UTF-8",
          "Cache-Control": "public, max-age=600, must-revalidate",
          "X-Sitemap-Prerendered": "2025-08-22T11:49:03.407Z"
        }
      },
      "/__sitemap__/zh-CN.xml": {
        "headers": {
          "Content-Type": "text/xml; charset=UTF-8",
          "Cache-Control": "public, max-age=600, must-revalidate",
          "X-Sitemap-Prerendered": "2025-08-22T11:49:03.407Z"
        }
      },
      "/__sitemap__/ja-JP.xml": {
        "headers": {
          "Content-Type": "text/xml; charset=UTF-8",
          "Cache-Control": "public, max-age=600, must-revalidate",
          "X-Sitemap-Prerendered": "2025-08-22T11:49:03.407Z"
        }
      },
      "/__sitemap__/ar-AR.xml": {
        "headers": {
          "Content-Type": "text/xml; charset=UTF-8",
          "Cache-Control": "public, max-age=600, must-revalidate",
          "X-Sitemap-Prerendered": "2025-08-22T11:49:03.407Z"
        }
      },
      "/_nuxt": {
        "robots": "noindex",
        "headers": {
          "X-Robots-Tag": "noindex"
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "baseUrl": "https://games.espressox.online",
    "i18n": {
      "baseUrl": "https://games.espressox.online",
      "defaultLocale": "en",
      "rootRedirect": "",
      "redirectStatusCode": 302,
      "skipSettingLocaleOnNavigate": false,
      "locales": [
        {
          "code": "en",
          "iso": "en-US",
          "name": "English",
          "language": "en-US",
          "_hreflang": "en-US",
          "_sitemap": "en-US"
        },
        {
          "code": "zh",
          "iso": "zh-CN",
          "name": "简体中文",
          "language": "zh-CN",
          "_hreflang": "zh-CN",
          "_sitemap": "zh-CN"
        },
        {
          "code": "ja",
          "iso": "ja-JP",
          "name": "日本語",
          "language": "ja-JP",
          "_hreflang": "ja-JP",
          "_sitemap": "ja-JP"
        },
        {
          "code": "ar",
          "iso": "ar-AR",
          "name": "العربية",
          "dir": "rtl",
          "language": "ar-AR",
          "_hreflang": "ar-AR",
          "_sitemap": "ar-AR"
        }
      ],
      "detectBrowserLanguage": {
        "alwaysRedirect": false,
        "cookieCrossOrigin": false,
        "cookieDomain": "",
        "cookieKey": "fc-game-language",
        "cookieSecure": false,
        "fallbackLocale": "en",
        "redirectOn": "root",
        "useCookie": true,
        "onlyOnRoot": true
      },
      "experimental": {
        "localeDetector": "",
        "typedPages": true,
        "typedOptionsAndMessages": false,
        "alternateLinkCanonicalQueries": true,
        "devCache": false,
        "cacheLifetime": "",
        "stripMessagesPayload": false,
        "preload": false,
        "strictSeo": false,
        "nitroContextDetection": true
      },
      "domainLocales": {
        "en": {
          "domain": ""
        },
        "zh": {
          "domain": ""
        },
        "ja": {
          "domain": ""
        },
        "ar": {
          "domain": ""
        }
      }
    }
  },
  "sitemap": {
    "isI18nMapped": true,
    "sitemapName": "sitemap.xml",
    "isMultiSitemap": true,
    "excludeAppSources": [],
    "cacheMaxAgeSeconds": 0,
    "autoLastmod": false,
    "defaultSitemapsChunkSize": 1000,
    "minify": false,
    "sortEntries": true,
    "debug": false,
    "discoverImages": true,
    "discoverVideos": true,
    "sitemapsPathPrefix": "/__sitemap__/",
    "isNuxtContentDocumentDriven": false,
    "xsl": "/__sitemap__/style.xsl",
    "xslTips": true,
    "xslColumns": [
      {
        "label": "URL",
        "width": "50%"
      },
      {
        "label": "Images",
        "width": "25%",
        "select": "count(image:image)"
      },
      {
        "label": "Last Updated",
        "width": "25%",
        "select": "concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"
      }
    ],
    "credits": true,
    "version": "7.4.3",
    "sitemaps": {
      "index": {
        "sitemapName": "index",
        "_route": "sitemap_index.xml",
        "sitemaps": [],
        "include": [],
        "exclude": []
      },
      "en-US": {
        "include": [],
        "exclude": [
          "/_**",
          "/_nuxt/**"
        ],
        "includeAppSources": true,
        "sitemapName": "en-US",
        "_route": "/__sitemap__/en-US.xml"
      },
      "zh-CN": {
        "include": [],
        "exclude": [
          "/_**",
          "/_nuxt/**"
        ],
        "includeAppSources": true,
        "sitemapName": "zh-CN",
        "_route": "/__sitemap__/zh-CN.xml"
      },
      "ja-JP": {
        "include": [],
        "exclude": [
          "/_**",
          "/_nuxt/**"
        ],
        "includeAppSources": true,
        "sitemapName": "ja-JP",
        "_route": "/__sitemap__/ja-JP.xml"
      },
      "ar-AR": {
        "include": [],
        "exclude": [
          "/_**",
          "/_nuxt/**"
        ],
        "includeAppSources": true,
        "sitemapName": "ar-AR",
        "_route": "/__sitemap__/ar-AR.xml"
      }
    },
    "autoI18n": {
      "differentDomains": false,
      "defaultLocale": "en",
      "locales": [
        {
          "code": "en",
          "iso": "en-US",
          "file": "en-US.json",
          "name": "English",
          "language": "en-US",
          "_hreflang": "en-US",
          "_sitemap": "en-US"
        },
        {
          "code": "zh",
          "iso": "zh-CN",
          "file": "zh-CN.json",
          "name": "简体中文",
          "language": "zh-CN",
          "_hreflang": "zh-CN",
          "_sitemap": "zh-CN"
        },
        {
          "code": "ja",
          "iso": "ja-JP",
          "file": "ja-JP.json",
          "name": "日本語",
          "language": "ja-JP",
          "_hreflang": "ja-JP",
          "_sitemap": "ja-JP"
        },
        {
          "code": "ar",
          "iso": "ar-AR",
          "file": "ar-AR.json",
          "name": "العربية",
          "dir": "rtl",
          "language": "ar-AR",
          "_hreflang": "ar-AR",
          "_sitemap": "ar-AR"
        }
      ],
      "strategy": "prefix_except_default",
      "pages": {}
    }
  },
  "nuxt-site-config": {
    "stack": [
      {
        "_context": "system",
        "_priority": -15,
        "name": "lipeaks_fc_games",
        "env": "development"
      },
      {
        "_context": "package.json",
        "_priority": -10,
        "name": "vue-lipeaks-game"
      },
      {
        "_context": "@nuxtjs/i18n",
        "url": "https://games.espressox.online",
        "defaultLocale": "en-US"
      }
    ],
    "version": "3.2.2",
    "debug": false,
    "multiTenancy": []
  },
  "nuxt-robots": {
    "version": "5.5.0",
    "isNuxtContentV2": false,
    "debug": false,
    "credits": true,
    "groups": [
      {
        "comment": [],
        "disallow": [
          "/admin/",
          "/zh/admin/",
          "/ja/admin/",
          "/ar/admin/",
          "/private/",
          "/zh/private/",
          "/ja/private/",
          "/ar/private/",
          "/api/"
        ],
        "allow": [
          "/",
          "/zh/",
          "/ja/",
          "/ar/",
          "/game/",
          "/zh/game/",
          "/ja/game/",
          "/ar/game/",
          "/category/",
          "/zh/category/",
          "/ja/category/",
          "/ar/category/",
          "/search/",
          "/zh/search/",
          "/ja/search/",
          "/ar/search/",
          "/stats/",
          "/zh/stats/",
          "/ja/stats/",
          "/ar/stats/"
        ],
        "userAgent": [
          "*"
        ],
        "contentUsage": [],
        "_indexable": true,
        "_rules": [
          {
            "pattern": "/admin/",
            "allow": false
          },
          {
            "pattern": "/zh/admin/",
            "allow": false
          },
          {
            "pattern": "/ja/admin/",
            "allow": false
          },
          {
            "pattern": "/ar/admin/",
            "allow": false
          },
          {
            "pattern": "/private/",
            "allow": false
          },
          {
            "pattern": "/zh/private/",
            "allow": false
          },
          {
            "pattern": "/ja/private/",
            "allow": false
          },
          {
            "pattern": "/ar/private/",
            "allow": false
          },
          {
            "pattern": "/api/",
            "allow": false
          },
          {
            "pattern": "/",
            "allow": true
          },
          {
            "pattern": "/zh/",
            "allow": true
          },
          {
            "pattern": "/ja/",
            "allow": true
          },
          {
            "pattern": "/ar/",
            "allow": true
          },
          {
            "pattern": "/game/",
            "allow": true
          },
          {
            "pattern": "/zh/game/",
            "allow": true
          },
          {
            "pattern": "/ja/game/",
            "allow": true
          },
          {
            "pattern": "/ar/game/",
            "allow": true
          },
          {
            "pattern": "/category/",
            "allow": true
          },
          {
            "pattern": "/zh/category/",
            "allow": true
          },
          {
            "pattern": "/ja/category/",
            "allow": true
          },
          {
            "pattern": "/ar/category/",
            "allow": true
          },
          {
            "pattern": "/search/",
            "allow": true
          },
          {
            "pattern": "/zh/search/",
            "allow": true
          },
          {
            "pattern": "/ja/search/",
            "allow": true
          },
          {
            "pattern": "/ar/search/",
            "allow": true
          },
          {
            "pattern": "/stats/",
            "allow": true
          },
          {
            "pattern": "/zh/stats/",
            "allow": true
          },
          {
            "pattern": "/ja/stats/",
            "allow": true
          },
          {
            "pattern": "/ar/stats/",
            "allow": true
          }
        ]
      }
    ],
    "sitemap": [
      "https://games.espressox.online/sitemap.xml",
      "https://games.espressox.online/sitemap-index.xml",
      "/sitemap_index.xml"
    ],
    "header": true,
    "robotsEnabledValue": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "robotsDisabledValue": "noindex, nofollow",
    "cacheControl": "max-age=14400, must-revalidate",
    "botDetection": true
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
    defaultRes.body.stack = defaultRes.body.stack.join("\n");
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve$1(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _IotP0XvfmESiEVk7S_dvgBQufIuTWaZqHPKO_CQqeQ = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "D:/GitHub/lipeaks_fc_games";

const appHead = {"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"name":"robots","content":"index, follow"},{"name":"description","content":"Play hundreds of classic NES and arcade games online for free. No download required. Includes Contra, Super Mario Bros, Pac-Man and more retro favorites."},{"name":"keywords","content":"classic games, NES games, arcade games, retro gaming, online emulator, free games, FC games, Nintendo"},{"name":"author","content":"Lipeaks"},{"property":"og:title","content":"Lipeaks - Play Classic NES & Arcade Games Online Free"},{"property":"og:description","content":"Play hundreds of classic NES and arcade games online for free. No download required."},{"property":"og:image","content":"https://games.espressox.online/images/og-image.png"},{"property":"og:url","content":"https://games.espressox.online/"},{"property":"og:type","content":"website"},{"property":"og:site_name","content":"Lipeaks"},{"name":"twitter:card","content":"summary_large_image"},{"name":"twitter:title","content":"Lipeaks - Play Classic NES & Arcade Games Online Free"},{"name":"twitter:description","content":"Play hundreds of classic NES and arcade games online for free. No download required."},{"name":"twitter:image","content":"https://games.espressox.online/images/twitter-card.png"}],"link":[{"rel":"icon","href":"/favicon.ico"},{"rel":"canonical","href":"https://games.espressox.online/"},{"rel":"preconnect","href":"https://games.espressox.online"},{"rel":"dns-prefetch","href":"https://games.espressox.online"}],"style":[],"script":[],"noscript":[],"title":"Lipeaks - Play Classic NES & Arcade Games Online Free","titleTemplate":"%s"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : void 0,
  URL: (data) => data instanceof URL ? data.toString() : void 0
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _kxytyvEBFnYRyszZULKfuKHW40coEfiY5VRM3lUSg = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === globalThis._importMeta_.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola$1.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola$1.wrapConsole();
}

function normalizeSiteConfig(config) {
  if (typeof config.indexable !== "undefined")
    config.indexable = String(config.indexable) !== "false";
  if (typeof config.trailingSlash !== "undefined" && !config.trailingSlash)
    config.trailingSlash = String(config.trailingSlash) !== "false";
  if (config.url && !hasProtocol(String(config.url), { acceptRelative: true, strict: false }))
    config.url = withHttps(String(config.url));
  const keys = Object.keys(config).sort((a, b) => a.localeCompare(b));
  const newConfig = {};
  for (const k of keys)
    newConfig[k] = config[k];
  return newConfig;
}
function createSiteConfigStack(options) {
  const debug = options?.debug || false;
  const stack = [];
  function push(input) {
    if (!input || typeof input !== "object" || Object.keys(input).length === 0) {
      return () => {
      };
    }
    if (!input._context && debug) {
      let lastFunctionName = new Error("tmp").stack?.split("\n")[2].split(" ")[5];
      if (lastFunctionName?.includes("/"))
        lastFunctionName = "anonymous";
      input._context = lastFunctionName;
    }
    const entry = {};
    for (const k in input) {
      const val = input[k];
      if (typeof val !== "undefined" && val !== "")
        entry[k] = val;
    }
    let idx;
    if (Object.keys(entry).filter((k) => !k.startsWith("_")).length > 0)
      idx = stack.push(entry);
    return () => {
      if (typeof idx !== "undefined") {
        stack.splice(idx - 1, 1);
      }
    };
  }
  function get(options2) {
    const siteConfig = {};
    if (options2?.debug)
      siteConfig._context = {};
    siteConfig._priority = {};
    for (const o in stack.sort((a, b) => (a._priority || 0) - (b._priority || 0))) {
      for (const k in stack[o]) {
        const key = k;
        const val = options2?.resolveRefs ? toValue(stack[o][k]) : stack[o][k];
        if (!k.startsWith("_") && typeof val !== "undefined" && val !== "") {
          siteConfig[k] = val;
          if (typeof stack[o]._priority !== "undefined" && stack[o]._priority !== -1) {
            siteConfig._priority[key] = stack[o]._priority;
          }
          if (options2?.debug)
            siteConfig._context[key] = stack[o]._context?.[key] || stack[o]._context || "anonymous";
        }
      }
    }
    return options2?.skipNormalize ? siteConfig : normalizeSiteConfig(siteConfig);
  }
  return {
    stack,
    push,
    get
  };
}

function envSiteConfig(env) {
  return Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith("NUXT_SITE_") || k.startsWith("NUXT_PUBLIC_SITE_")).map(([k, v]) => [
    k.replace(/^NUXT_(PUBLIC_)?SITE_/, "").split("_").map((s, i) => i === 0 ? s.toLowerCase() : s[0].toUpperCase() + s.slice(1).toLowerCase()).join(""),
    v
  ]));
}

const logger$2 = /* @__PURE__ */ createConsola({
  defaults: {
    tag: "nuxt-site-config"
  }
});

function useSiteConfig(e, _options) {
  if (!e.context._initedSiteConfig) {
    logger$2.warn("Site config has not been initialized yet. If you're trying to access site config in a server middleware then this not yet supported. See https://github.com/harlan-zw/nuxt-seo/issues/397");
  }
  e.context.siteConfig = e.context.siteConfig || createSiteConfigStack();
  const options = defu$1(_options, useRuntimeConfig(e)["nuxt-site-config"], { debug: false });
  return e.context.siteConfig.get(options);
}

const _8QnRRniQJjElkxS0VjZRFH6demQwWlawu4OI3b0wg = defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook("render:html", async (ctx, { event }) => {
    const routeOptions = getRouteRules(event);
    const isIsland = process.env.NUXT_COMPONENT_ISLANDS && event.path.startsWith("/__nuxt_island");
    event.path;
    const noSSR = event.context.nuxt?.noSSR || routeOptions.ssr === false && !isIsland || (false);
    if (noSSR) {
      const siteConfig = Object.fromEntries(
        Object.entries(useSiteConfig(event)).map(([k, v]) => [k, toValue(v)])
      );
      ctx.body.push(`<script>window.__NUXT_SITE_CONFIG__=${devalue(siteConfig)}<\/script>`);
    }
  });
});

const KNOWN_SEARCH_BOTS = [
  {
    pattern: "googlebot",
    name: "googlebot",
    secondaryPatterns: ["google.com/bot.html"]
  },
  {
    pattern: "bingbot",
    name: "bingbot",
    secondaryPatterns: ["msnbot"]
  },
  {
    pattern: "yandexbot",
    name: "yandexbot"
  },
  {
    pattern: "baiduspider",
    name: "baiduspider",
    secondaryPatterns: ["baidu.com"]
  },
  {
    pattern: "duckduckbot",
    name: "duckduckbot",
    secondaryPatterns: ["duckduckgo.com"]
  },
  {
    pattern: "slurp",
    name: "yahoo"
  }
];
const SOCIAL_BOTS = [
  {
    pattern: "twitterbot",
    name: "twitter",
    secondaryPatterns: ["twitter"]
  },
  {
    pattern: "facebookexternalhit",
    name: "facebook",
    secondaryPatterns: ["facebook.com"]
  },
  {
    pattern: "linkedinbot",
    name: "linkedin",
    secondaryPatterns: ["linkedin"]
  },
  {
    pattern: "pinterestbot",
    name: "pinterest",
    secondaryPatterns: ["pinterest"]
  },
  {
    pattern: "discordbot",
    name: "discord",
    secondaryPatterns: ["discordapp"]
  }
];
const SEO_BOTS = [
  {
    pattern: "mj12bot",
    name: "majestic12",
    secondaryPatterns: ["majestic12.co.uk/bot"]
  },
  {
    pattern: "ahrefsbot",
    name: "ahrefs",
    secondaryPatterns: ["ahrefs.com"]
  },
  {
    pattern: "semrushbot",
    name: "semrush",
    secondaryPatterns: ["semrush.com/bot"]
  },
  {
    pattern: "screaming frog",
    name: "screaming-frog",
    secondaryPatterns: ["screamingfrog.co.uk"]
  },
  {
    pattern: "rogerbot",
    name: "moz"
  }
];
const AI_BOTS = [
  {
    pattern: "anthropic",
    name: "anthropic"
  },
  {
    pattern: "claude",
    name: "claude"
  },
  {
    pattern: "gptbot",
    name: "gpt",
    secondaryPatterns: ["openai.com"]
  },
  {
    pattern: "googlebot-news",
    name: "google-news"
  },
  {
    pattern: "cohere",
    name: "cohere",
    secondaryPatterns: ["cohere.com"]
  },
  {
    pattern: "ccbot",
    name: "commoncrawl",
    secondaryPatterns: ["commoncrawl.org"]
  },
  {
    pattern: "perplexitybot",
    name: "perplexity",
    secondaryPatterns: ["perplexity.ai"]
  }
];
const HTTP_TOOL_BOTS = [
  {
    pattern: "python-requests",
    name: "requests",
    secondaryPatterns: ["python"]
  },
  {
    pattern: "wget",
    name: "wget"
  },
  {
    pattern: "curl",
    name: "curl",
    secondaryPatterns: ["curl"]
  }
];
const SECURITY_SCANNING_BOTS = [
  {
    pattern: "zgrab",
    name: "zgrab"
  },
  {
    pattern: "masscan",
    name: "masscan"
  },
  {
    pattern: "nmap",
    name: "nmap",
    secondaryPatterns: ["insecure.org"]
  },
  {
    pattern: "nikto",
    name: "nikto"
  },
  {
    pattern: "wpscan",
    name: "wpscan"
  }
];
const SCRAPING_BOTS = [
  {
    pattern: "scrapy",
    name: "scrapy",
    secondaryPatterns: ["scrapy.org"]
  }
];
const AUTOMATION_BOTS = [
  {
    pattern: "phantomjs",
    name: "phantomjs"
  },
  {
    pattern: "headless",
    name: "headless-browser"
  },
  {
    pattern: "playwright",
    name: "playwright"
  },
  {
    pattern: "selenium",
    name: "selenium",
    secondaryPatterns: ["webdriver"]
  },
  {
    pattern: "puppeteer",
    name: "puppeteer",
    secondaryPatterns: ["headless"]
  }
];
const GENERIC_BOTS = [
  {
    pattern: "bot",
    name: "generic-bot"
  },
  {
    pattern: "spider",
    name: "generic-spider"
  },
  {
    pattern: "crawler",
    name: "generic-crawler"
  },
  {
    pattern: "scraper",
    name: "generic-scraper"
  }
];
const BOT_MAP = [
  {
    type: "search-engine",
    bots: KNOWN_SEARCH_BOTS,
    trusted: true
  },
  {
    type: "social",
    bots: SOCIAL_BOTS,
    trusted: true
  },
  {
    type: "seo",
    bots: SEO_BOTS,
    trusted: true
  },
  {
    type: "ai",
    bots: AI_BOTS,
    trusted: true
  },
  {
    type: "generic",
    bots: GENERIC_BOTS,
    trusted: false
  },
  {
    type: "automation",
    bots: AUTOMATION_BOTS,
    trusted: false
  },
  {
    type: "http-tool",
    bots: HTTP_TOOL_BOTS,
    trusted: false
  },
  {
    type: "security-scanner",
    bots: SECURITY_SCANNING_BOTS,
    trusted: false
  },
  {
    type: "scraping",
    bots: SCRAPING_BOTS,
    trusted: false
  }
];
function matches(pattern, path) {
  const pathLength = path.length;
  const patternLength = pattern.length;
  const matchingLengths = Array.from({ length: pathLength + 1 }).fill(0);
  let numMatchingLengths = 1;
  let p = 0;
  while (p < patternLength) {
    if (pattern[p] === "$" && p + 1 === patternLength) {
      return matchingLengths[numMatchingLengths - 1] === pathLength;
    }
    if (pattern[p] === "*") {
      numMatchingLengths = pathLength - matchingLengths[0] + 1;
      for (let i = 1; i < numMatchingLengths; i++) {
        matchingLengths[i] = matchingLengths[i - 1] + 1;
      }
    } else {
      let numMatches = 0;
      for (let i = 0; i < numMatchingLengths; i++) {
        const matchLength = matchingLengths[i];
        if (matchLength < pathLength && path[matchLength] === pattern[p]) {
          matchingLengths[numMatches++] = matchLength + 1;
        }
      }
      if (numMatches === 0) {
        return false;
      }
      numMatchingLengths = numMatches;
    }
    p++;
  }
  return true;
}
function matchPathToRule(path, _rules) {
  let matchedRule = null;
  const rules = _rules.filter(Boolean);
  const rulesLength = rules.length;
  let i = 0;
  while (i < rulesLength) {
    const rule = rules[i];
    if (!rule || !matches(rule.pattern, path)) {
      i++;
      continue;
    }
    if (!matchedRule || rule.pattern.length > matchedRule.pattern.length) {
      matchedRule = rule;
    } else if (rule.pattern.length === matchedRule.pattern.length && rule.allow && !matchedRule.allow) {
      matchedRule = rule;
    }
    i++;
  }
  return matchedRule;
}
function asArray(v) {
  return typeof v === "undefined" ? [] : Array.isArray(v) ? v : [v];
}
function generateRobotsTxt({ groups, sitemaps }) {
  const lines = [];
  for (const group of groups) {
    for (const comment of group.comment || [])
      lines.push(`# ${comment}`);
    for (const userAgent of group.userAgent || ["*"])
      lines.push(`User-agent: ${userAgent}`);
    for (const allow of group.allow || [])
      lines.push(`Allow: ${allow}`);
    for (const disallow of group.disallow || [])
      lines.push(`Disallow: ${disallow}`);
    for (const cleanParam of group.cleanParam || [])
      lines.push(`Clean-param: ${cleanParam}`);
    for (const contentUsage of group.contentUsage || [])
      lines.push(`Content-Usage: ${contentUsage}`);
    lines.push("");
  }
  for (const sitemap of sitemaps)
    lines.push(`Sitemap: ${sitemap}`);
  return lines.join("\n");
}
createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value))
    obj[key] = Array.from(/* @__PURE__ */ new Set([...obj[key], ...value]));
  return obj[key];
});
function createPatternMap() {
  const patternMap = /* @__PURE__ */ new Map();
  for (const def of BOT_MAP) {
    for (const bot of def.bots) {
      const patterns = [bot.pattern, ...bot.secondaryPatterns || []];
      for (const pattern of patterns) {
        patternMap.set(pattern.toLowerCase(), {
          botName: bot.name,
          botCategory: def.type,
          trusted: def.trusted
        });
      }
    }
  }
  return patternMap;
}

function useRuntimeConfigNuxtRobots(event) {
  return useRuntimeConfig(event)["nuxt-robots"];
}

const logger$1 = createConsola({
  defaults: { tag: "@nuxtjs/robots" }
});

async function resolveRobotsTxtContext(e, nitro = useNitroApp()) {
  const { groups, sitemap: sitemaps } = useRuntimeConfigNuxtRobots(e);
  const generateRobotsTxtCtx = {
    event: e,
    context: e ? "robots.txt" : "init",
    ...JSON.parse(JSON.stringify({ groups, sitemaps }))
  };
  await nitro.hooks.callHook("robots:config", generateRobotsTxtCtx);
  nitro._robots.ctx = generateRobotsTxtCtx;
  return generateRobotsTxtCtx;
}

const _m0Fy8YSeoHLgSoEKgGsooIEQtZTetDxmpyLZODZz8c = defineNitroPlugin(async (nitroApp) => {
  const { isNuxtContentV2, robotsDisabledValue, botDetection } = useRuntimeConfigNuxtRobots();
  if (botDetection !== false) {
    nitroApp._robotsPatternMap = createPatternMap();
  }
  nitroApp._robots = {};
  await resolveRobotsTxtContext(void 0, nitroApp);
  const nuxtContentUrls = /* @__PURE__ */ new Set();
  if (isNuxtContentV2) {
    let urls;
    try {
      urls = await (await nitroApp.localFetch("/__robots__/nuxt-content.json", {})).json();
    } catch (e) {
      logger$1.error("Failed to read robot rules from content files.", e);
    }
    if (urls && Array.isArray(urls) && urls.length) {
      urls.forEach((url) => nuxtContentUrls.add(withoutTrailingSlash(url)));
    }
  }
  if (nuxtContentUrls.size) {
    nitroApp._robots.nuxtContentUrls = nuxtContentUrls;
  }
});

function useI18nContext(event) {
  if (event.context.nuxtI18n == null) {
    throw new Error("Nuxt I18n server context has not been set up yet.");
  }
  return event.context.nuxtI18n;
}
function tryUseI18nContext(event) {
  return event.context.nuxtI18n;
}
const headers = new Headers({ "x-nuxt-i18n": "internal" });
{
  headers.set("Cache-Control", "no-cache");
}
function createI18nContext() {
  return {
    messages: {},
    slp: {},
    localeConfigs: {},
    trackMap: {},
    vueI18nOptions: void 0,
    trackKey(key, locale) {
      this.trackMap[locale] ??= /* @__PURE__ */ new Set();
      this.trackMap[locale].add(key);
    }
  };
}

/*!
  * shared v9.14.5
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
const _create = Object.create;
const create = (obj = null) => _create(obj);
/* eslint-enable */
/**
 * Useful Utilities By Evan you
 * Modified by kazuya kawaguchi
 * MIT License
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/index.ts
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/codeframe.ts
 */
const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (val) => val !== null && typeof val === 'object';
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);

const isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function deepCopy(src, des) {
    // src and des should both be objects, and none of them can be a array
    if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
        throw new Error('Invalid value');
    }
    const stack = [{ src, des }];
    while (stack.length) {
        const { src, des } = stack.pop();
        // using `Object.keys` which skips prototype properties
        Object.keys(src).forEach(key => {
            if (key === '__proto__') {
                return;
            }
            // if src[key] is an object/array, set des[key]
            // to empty object/array to prevent setting by reference
            if (isObject(src[key]) && !isObject(des[key])) {
                des[key] = Array.isArray(src[key]) ? [] : create();
            }
            if (isNotObjectOrIsArray(des[key]) || isNotObjectOrIsArray(src[key])) {
                // replace with src[key] when:
                // src[key] or des[key] is not an object, or
                // src[key] or des[key] is an array
                des[key] = src[key];
            }
            else {
                // src[key] and des[key] are both objects, merge them
                stack.push({ src: src[key], des: des[key] });
            }
        });
    }
}

function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
  const matchedLocales = matchBrowserLocale(
    locales.map((l) => ({ code: l.code, language: l.language || l.code })),
    browserLocales
  );
  return matchedLocales.sort(compareBrowserLocale).at(0)?.code ?? "";
}

// @ts-nocheck
const localeCodes =  [
  "en",
  "zh",
  "ja",
  "ar"
];
const localeLoaders = {
  en: [
    {
      key: "locale_en_45US_46json_2415ae49",
      load: () => Promise.resolve().then(function () { return enUS$1; }),
      cache: true
    }
  ],
  zh: [
    {
      key: "locale_zh_45CN_46json_902a66f7",
      load: () => Promise.resolve().then(function () { return zhCN$1; }),
      cache: true
    }
  ],
  ja: [
    {
      key: "locale_ja_45JP_46json_0172af5a",
      load: () => Promise.resolve().then(function () { return jaJP$1; }),
      cache: true
    }
  ],
  ar: [
    {
      key: "locale_ar_45AR_46json_95edce5d",
      load: () => Promise.resolve().then(function () { return arAR$1; }),
      cache: true
    }
  ]
};
const vueI18nConfigs = [];
const normalizedLocales = [
  {
    code: "en",
    iso: "en-US",
    name: "English",
    language: "en-US",
    _hreflang: "en-US",
    _sitemap: "en-US"
  },
  {
    code: "zh",
    iso: "zh-CN",
    name: "简体中文",
    language: "zh-CN",
    _hreflang: "zh-CN",
    _sitemap: "zh-CN"
  },
  {
    code: "ja",
    iso: "ja-JP",
    name: "日本語",
    language: "ja-JP",
    _hreflang: "ja-JP",
    _sitemap: "ja-JP"
  },
  {
    code: "ar",
    iso: "ar-AR",
    name: "العربية",
    dir: "rtl",
    language: "ar-AR",
    _hreflang: "ar-AR",
    _sitemap: "ar-AR"
  }
];

function createLocaleConfigs(fallbackLocale) {
  const localeConfigs = {};
  for (const locale of localeCodes) {
    const fallbacks = getFallbackLocaleCodes(fallbackLocale, [locale]);
    const cacheable = isLocaleWithFallbacksCacheable(locale, fallbacks);
    localeConfigs[locale] = { fallbacks, cacheable };
  }
  return localeConfigs;
}
function getFallbackLocaleCodes(fallback, locales) {
  if (fallback === false) return [];
  if (isArray(fallback)) return fallback;
  let fallbackLocales = [];
  if (isString(fallback)) {
    if (locales.every((locale) => locale !== fallback)) {
      fallbackLocales.push(fallback);
    }
    return fallbackLocales;
  }
  const targets = [...locales, "default"];
  for (const locale of targets) {
    if (locale in fallback == false) continue;
    fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)];
  }
  return fallbackLocales;
}
function isLocaleCacheable(locale) {
  return localeLoaders[locale] != null && localeLoaders[locale].every((loader) => loader.cache !== false);
}
function isLocaleWithFallbacksCacheable(locale, fallbackLocales) {
  return isLocaleCacheable(locale) && fallbackLocales.every((fallbackLocale) => isLocaleCacheable(fallbackLocale));
}
function getDefaultLocaleForDomain(host) {
  return normalizedLocales.find((l) => !!l.defaultForDomains?.includes(host))?.code;
}
const isSupportedLocale = (locale) => localeCodes.includes(locale || "");

const __nuxtMock = { runWithContext: async (fn) => await fn() };
async function loadVueI18nOptions(vueI18nConfigs) {
  const nuxtApp = __nuxtMock;
  const vueI18nOptions = { messages: {} };
  for (const configFile of vueI18nConfigs) {
    const resolver = await configFile().then((x) => x.default);
    const resolved = isFunction(resolver) ? await nuxtApp.runWithContext(() => resolver()) : resolver;
    deepCopy(resolved, vueI18nOptions);
  }
  vueI18nOptions.fallbackLocale ??= false;
  return vueI18nOptions;
}
const isModule = (val) => toTypeString(val) === "[object Module]";
const isResolvedModule = (val) => isModule(val) || true;
async function getLocaleMessages(locale, loader) {
  const nuxtApp = __nuxtMock;
  try {
    const getter = await nuxtApp.runWithContext(loader.load).then((x) => isResolvedModule(x) ? x.default : x);
    return isFunction(getter) ? await nuxtApp.runWithContext(() => getter(locale)) : getter;
  } catch (e) {
    throw new Error(`Failed loading locale (${locale}): ` + e.message);
  }
}
async function getLocaleMessagesMerged(locale, loaders = []) {
  const nuxtApp = __nuxtMock;
  const merged = {};
  for (const loader of loaders) {
    deepCopy(await nuxtApp.runWithContext(async () => await getLocaleMessages(locale, loader)), merged);
  }
  return merged;
}

const setupVueI18nOptions = async (defaultLocale) => {
  const options = await loadVueI18nOptions(vueI18nConfigs);
  options.locale = defaultLocale || options.locale || "en-US";
  options.defaultLocale = defaultLocale;
  options.fallbackLocale ??= false;
  options.messages ??= {};
  for (const locale of localeCodes) {
    options.messages[locale] ??= {};
  }
  return options;
};

function useRuntimeI18n(nuxtApp) {
  {
    return useRuntimeConfig().public.i18n;
  }
}
function useI18nDetection(nuxtApp) {
  const detectBrowserLanguage = useRuntimeI18n().detectBrowserLanguage;
  const detect = detectBrowserLanguage || {};
  return {
    ...detect,
    enabled: !!detectBrowserLanguage,
    cookieKey: detect.cookieKey || "i18n_redirected"
  };
}
function resolveRootRedirect(config) {
  if (!config) return void 0;
  return {
    path: "/" + (isString(config) ? config : config.path).replace(/^\//, ""),
    code: !isString(config) && config.statusCode || 302
  };
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

const separator = "___";
const pathLanguageParser = createPathIndexLanguageParser(0);
const getLocaleFromRoutePath = (path) => pathLanguageParser(path);
const getLocaleFromRouteName = (name) => name.split(separator).at(1) ?? "";
function normalizeInput(input) {
  return typeof input !== "object" ? String(input) : String(input?.name || input?.path || "");
}
function getLocaleFromRoute(route) {
  const input = normalizeInput(route);
  return input[0] === "/" ? getLocaleFromRoutePath(input) : getLocaleFromRouteName(input);
}

function matchDomainLocale(locales, host, pathLocale) {
  const normalizeDomain = (domain = "") => domain.replace(/https?:\/\//, "");
  const matches = locales.filter(
    (locale) => normalizeDomain(locale.domain) === host || toArray(locale.domains).includes(host)
  );
  if (matches.length <= 1) {
    return matches[0]?.code;
  }
  return (
    // match by current path locale
    matches.find((l) => l.code === pathLocale)?.code || // fallback to default locale for the domain
    matches.find((l) => l.defaultForDomains?.includes(host) ?? l.domainDefault)?.code
  );
}

const getCookieLocale = (event, cookieName) => {
  const cookieValue = getRequestHeader(event, "cookie") || "";
  return parse(cookieValue)[cookieName];
};
const getRouteLocale = (event, route) => getLocaleFromRoute(route);
const getHeaderLocale = (event) => {
  return findBrowserLocale(normalizedLocales, parseAcceptLanguage(getRequestHeader(event, "accept-language") || ""));
};
const getHostLocale = (event, path, domainLocales) => {
  const host = getRequestURL(event, { xForwardedHost: true }).host;
  const locales = normalizedLocales.map((l) => ({
    ...l,
    domain: domainLocales[l.code]?.domain ?? l.domain
  }));
  return matchDomainLocale(locales, host, getLocaleFromRoutePath(path));
};
const useDetectors = (event, config, nuxtApp) => {
  if (!event) {
    throw new Error("H3Event is required for server-side locale detection");
  }
  const runtimeI18n = useRuntimeI18n();
  return {
    cookie: () => getCookieLocale(event, config.cookieKey),
    header: () => getHeaderLocale(event) ,
    navigator: () => void 0,
    host: (path) => getHostLocale(event, path, runtimeI18n.domainLocales),
    route: (path) => getRouteLocale(event, path)
  };
};

// Generated by @nuxtjs/i18n
const pathToI18nConfig = {
  "/": {
    "en": "/",
    "zh": "/",
    "ja": "/",
    "ar": "/"
  },
  "/stats": {
    "en": "/stats",
    "zh": "/stats",
    "ja": "/stats",
    "ar": "/stats"
  },
  "/search": {
    "en": "/search",
    "zh": "/search",
    "ja": "/search",
    "ar": "/search"
  },
  "/:slug(.*)*": {
    "en": "/:slug(.*)*",
    "zh": "/:slug(.*)*",
    "ja": "/:slug(.*)*",
    "ar": "/:slug(.*)*"
  },
  "/game/:id()": {
    "en": "/game/:id()",
    "zh": "/game/:id()",
    "ja": "/game/:id()",
    "ar": "/game/:id()"
  },
  "/category/:id()": {
    "en": "/category/:id()",
    "zh": "/category/:id()",
    "ja": "/category/:id()",
    "ar": "/category/:id()"
  },
  "/ndefined": {
    "en": "/ndefined",
    "zh": "/ndefined",
    "ja": "/ndefined",
    "ar": "/ndefined"
  }
};
const i18nPathToPath = {
  "/": "/",
  "/stats": "/stats",
  "/search": "/search",
  "/:slug(.*)*": "/:slug(.*)*",
  "/game/:id()": "/game/:id()",
  "/category/:id()": "/category/:id()",
  "/ndefined": "/ndefined"
};

const matcher = createRouterMatcher([], {});
for (const path of Object.keys(i18nPathToPath)) {
  matcher.addRoute({ path, component: () => "", meta: {} });
}
const getI18nPathToI18nPath = (path, locale) => {
  if (!path || !locale) return;
  const plainPath = i18nPathToPath[path];
  const i18nConfig = pathToI18nConfig[plainPath];
  if (i18nConfig && i18nConfig[locale]) {
    return i18nConfig[locale] === true ? plainPath : i18nConfig[locale];
  }
};
function isExistingNuxtRoute(path) {
  if (path === "") return;
  const resolvedMatch = matcher.resolve({ path }, { path: "/", name: "", matched: [], params: {}, meta: {} });
  return resolvedMatch.matched.length > 0 ? resolvedMatch : void 0;
}
function matchLocalized(path, locale, defaultLocale) {
  if (path === "") return;
  const parsed = parsePath(path);
  const resolvedMatch = matcher.resolve(
    { path: parsed.pathname || "/" },
    { path: "/", name: "", matched: [], params: {}, meta: {} }
  );
  if (resolvedMatch.matched.length > 0) {
    const alternate = getI18nPathToI18nPath(resolvedMatch.matched[0].path, locale);
    const match = matcher.resolve(
      { params: resolvedMatch.params },
      { path: alternate || "/", name: "", matched: [], params: {}, meta: {} }
    );
    const isPrefixable = prefixable(locale, defaultLocale);
    return withLeadingSlash(joinURL(isPrefixable ? locale : "", match.path));
  }
}
function prefixable(currentLocale, defaultLocale) {
  return   (currentLocale !== defaultLocale || "prefix_except_default" === "prefix");
}

const getHost = (event) => getRequestURL(event, { xForwardedHost: true }).host;
function* detect(detectors, detection, path) {
  if (detection.enabled) {
    yield { locale: detectors.cookie(), source: "cookie" };
    yield { locale: detectors.header(), source: "header" };
  }
  {
    yield { locale: detectors.route(path), source: "route" };
  }
  yield { locale: detection.fallbackLocale, source: "fallback" };
}
const _reLcxUBdo_Uh2CN_1YOtkN25gL1_JNbB6Eel7xwm0Z8 = defineNitroPlugin(async (nitro) => {
  const runtimeI18n = useRuntimeI18n();
  const rootRedirect = resolveRootRedirect(runtimeI18n.rootRedirect);
  const _defaultLocale = runtimeI18n.defaultLocale || "";
  try {
    const cacheStorage = useStorage("cache");
    const cachedKeys = await cacheStorage.getKeys("nitro:handlers:i18n");
    await Promise.all(cachedKeys.map((key) => cacheStorage.removeItem(key)));
  } catch {
  }
  const detection = useI18nDetection();
  const cookieOptions = {
    path: "/",
    domain: detection.cookieDomain || void 0,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: detection.cookieSecure
  };
  const createBaseUrlGetter = () => {
    isFunction(runtimeI18n.baseUrl) ? "" : runtimeI18n.baseUrl || "";
    if (isFunction(runtimeI18n.baseUrl)) {
      console.warn("[nuxt-i18n] Configuring baseUrl as a function is deprecated and will be removed in v11.");
      return () => "";
    }
    return (event, defaultLocale) => {
      return "";
    };
  };
  function resolveRedirectPath(event, path, pathLocale, defaultLocale, detector) {
    let locale = "";
    for (const detected of detect(detector, detection, event.path)) {
      if (detected.locale && isSupportedLocale(detected.locale)) {
        locale = detected.locale;
        break;
      }
    }
    locale ||= defaultLocale;
    function getLocalizedMatch(locale2) {
      const res = matchLocalized(path || "/", locale2, defaultLocale);
      if (res && res !== event.path) {
        return res;
      }
    }
    let resolvedPath = void 0;
    let redirectCode = 302;
    const requestURL = getRequestURL(event);
    if (rootRedirect && requestURL.pathname === "/") {
      locale = detection.enabled && locale || defaultLocale;
      resolvedPath = isSupportedLocale(detector.route(rootRedirect.path)) && rootRedirect.path || matchLocalized(rootRedirect.path, locale, defaultLocale);
      redirectCode = rootRedirect.code;
    } else if (runtimeI18n.redirectStatusCode) {
      redirectCode = runtimeI18n.redirectStatusCode;
    }
    switch (detection.redirectOn) {
      case "root":
        if (requestURL.pathname !== "/") break;
      // fallthrough (root has no prefix)
      case "no prefix":
        if (pathLocale) break;
      // fallthrough to resolve
      case "all":
        resolvedPath ??= getLocalizedMatch(locale);
        break;
    }
    if (requestURL.pathname === "/" && "prefix_except_default" === "prefix") ;
    return { path: resolvedPath, code: redirectCode, locale };
  }
  const baseUrlGetter = createBaseUrlGetter();
  nitro.hooks.hook("request", async (event) => {
    const options = await setupVueI18nOptions(getDefaultLocaleForDomain(getHost(event)) || _defaultLocale);
    const url = getRequestURL(event);
    const ctx = createI18nContext();
    event.context.nuxtI18n = ctx;
    {
      const detector = useDetectors(event, detection);
      const localeSegment = detector.route(event.path);
      const pathLocale = isSupportedLocale(localeSegment) && localeSegment || void 0;
      const path = pathLocale && url.pathname.slice(pathLocale.length + 1) || url.pathname;
      if (!url.pathname.includes("/_i18n/") && !isExistingNuxtRoute(path)) {
        return;
      }
      const resolved = resolveRedirectPath(event, path, pathLocale, options.defaultLocale, detector);
      if (resolved.path && resolved.path !== url.pathname) {
        ctx.detectLocale = resolved.locale;
        detection.useCookie && setCookie(event, detection.cookieKey, resolved.locale, cookieOptions);
        await sendRedirect(
          event,
          joinURL(baseUrlGetter(event, options.defaultLocale), resolved.path + url.search),
          resolved.code
        );
        return;
      }
    }
    const localeConfigs = createLocaleConfigs(options.fallbackLocale);
    ctx.vueI18nOptions = options;
    ctx.localeConfigs = localeConfigs;
  });
  nitro.hooks.hook("render:html", (htmlContext, { event }) => {
    tryUseI18nContext(event);
  });
});

const plugins = [
  _IotP0XvfmESiEVk7S_dvgBQufIuTWaZqHPKO_CQqeQ,
_kxytyvEBFnYRyszZULKfuKHW40coEfiY5VRM3lUSg,
_8QnRRniQJjElkxS0VjZRFH6demQwWlawu4OI3b0wg,
_m0Fy8YSeoHLgSoEKgGsooIEQtZTetDxmpyLZODZz8c,
_reLcxUBdo_Uh2CN_1YOtkN25gL1_JNbB6Eel7xwm0Z8
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$2(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _enxOxg = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

function useNitroOrigin(e) {
  const cert = process.env.NITRO_SSL_CERT;
  const key = process.env.NITRO_SSL_KEY;
  let host = process.env.NITRO_HOST || process.env.HOST || false;
  let port = false;
  port = process.env.NITRO_PORT || process.env.PORT || "3000";
  let protocol = cert && key || false ? "https" : "http";
  if (process.env.__NUXT_DEV__) {
    const origin = JSON.parse(process.env.__NUXT_DEV__).proxy.url;
    host = withoutProtocol(origin);
    protocol = origin.includes("https") ? "https" : "http";
  } else if (process.env.NUXT_VITE_NODE_OPTIONS) {
    const origin = JSON.parse(process.env.NUXT_VITE_NODE_OPTIONS).baseURL.replace("/__nuxt_vite_node__", "");
    host = withoutProtocol(origin);
    protocol = origin.includes("https") ? "https" : "http";
  } else if (e) {
    host = getRequestHost(e, { xForwardedHost: true }) || host;
    protocol = getRequestProtocol(e, { xForwardedProto: true }) || protocol;
  }
  if (typeof host === "string" && host.includes(":")) {
    port = host.split(":").pop();
    host = host.split(":")[0];
  }
  port = port ? `:${port}` : "";
  return withTrailingSlash(`${protocol}://${host}${port}`);
}

const _izjMFr = eventHandler(async (e) => {
  if (e.context._initedSiteConfig)
    return;
  const runtimeConfig = useRuntimeConfig(e);
  const config = runtimeConfig["nuxt-site-config"];
  const nitroApp = useNitroApp();
  const siteConfig = e.context.siteConfig || createSiteConfigStack({
    debug: config.debug
  });
  const nitroOrigin = useNitroOrigin(e);
  e.context.siteConfigNitroOrigin = nitroOrigin;
  {
    siteConfig.push({
      _context: "nitro:init",
      _priority: -4,
      url: nitroOrigin
    });
  }
  siteConfig.push({
    _context: "runtimeEnv",
    _priority: 0,
    ...runtimeConfig.site || {},
    ...runtimeConfig.public.site || {},
    // @ts-expect-error untyped
    ...envSiteConfig(globalThis._importMeta_.env)
    // just in-case, shouldn't be needed
  });
  const buildStack = config.stack || [];
  buildStack.forEach((c) => siteConfig.push(c));
  if (e.context._nitro.routeRules.site) {
    siteConfig.push({
      _context: "route-rules",
      ...e.context._nitro.routeRules.site
    });
  }
  if (config.multiTenancy) {
    const host = parseURL(nitroOrigin).host;
    const tenant = config.multiTenancy?.find((t) => t.hosts.includes(host));
    if (tenant) {
      siteConfig.push({
        _context: `multi-tenancy:${host}`,
        _priority: 0,
        ...tenant.config
      });
    }
  }
  const ctx = { siteConfig, event: e };
  await nitroApp.hooks.callHook("site-config:init", ctx);
  e.context.siteConfig = ctx.siteConfig;
  e.context._initedSiteConfig = true;
});

const _PVDCbf = eventHandler(async (e) => {
  const siteConfig = useSiteConfig(e);
  const nitroOrigin = useNitroOrigin(e);
  const runtimeConfig = useRuntimeConfig(e);
  const stack = e.context.siteConfig.stack;
  setHeader(e, "Content-Type", "application/json");
  return {
    config: siteConfig,
    stack,
    nitroOrigin,
    version: runtimeConfig["nuxt-site-config"].version
  };
});

function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  let origin = withoutTrailingSlash(options.absolute ? options.siteUrl : "");
  if (base !== "/" && origin.endsWith(base)) {
    origin = origin.slice(0, origin.indexOf(base));
  }
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
const fileExtensions = [
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
  // Documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "md",
  "markdown",
  // Archives
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  // Audio
  "mp3",
  "wav",
  "flac",
  "ogg",
  "opus",
  "m4a",
  "aac",
  "midi",
  "mid",
  // Video
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  // Web
  "html",
  "css",
  "js",
  "json",
  "xml",
  "tsx",
  "jsx",
  "ts",
  "vue",
  "svelte",
  "xsl",
  "rss",
  "atom",
  // Programming
  "php",
  "py",
  "rb",
  "java",
  "c",
  "cpp",
  "h",
  "go",
  // Data formats
  "csv",
  "tsv",
  "sql",
  "yaml",
  "yml",
  // Fonts
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  // Executables/Binaries
  "exe",
  "msi",
  "apk",
  "ipa",
  "dmg",
  "iso",
  "bin",
  // Scripts/Config
  "bat",
  "cmd",
  "sh",
  "env",
  "htaccess",
  "conf",
  "toml",
  "ini",
  // Package formats
  "deb",
  "rpm",
  "jar",
  "war",
  // E-books
  "epub",
  "mobi",
  // Common temporary/backup files
  "log",
  "tmp",
  "bak",
  "old",
  "sav"
];
function isPathFile(path) {
  const lastSegment = path.split("/").pop();
  const ext = (lastSegment || path).match(/\.[0-9a-z]+$/i)?.[0];
  return ext && fileExtensions.includes(ext.replace(".", ""));
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  if (isPathFile($url.pathname))
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}

function createSitePathResolver(e, options = {}) {
  const siteConfig = useSiteConfig(e);
  const nitroOrigin = useNitroOrigin(e);
  const nuxtBase = useRuntimeConfig(e).app.baseURL || "/";
  return (path) => {
    return resolveSitePath(path, {
      ...options,
      siteUrl: options.canonical !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    });
  };
}
function withSiteUrl(e, path, options = {}) {
  const siteConfig = e.context.siteConfig?.get();
  let siteUrl = e.context.siteConfigNitroOrigin;
  if ((options.canonical !== false || false) && siteConfig.url)
    siteUrl = siteConfig.url;
  return resolveSitePath(path, {
    absolute: true,
    siteUrl,
    trailingSlash: siteConfig.trailingSlash,
    base: e.context.nitro.baseURL,
    withBase: options.withBase
  });
}

const ROBOT_DIRECTIVE_VALUES = {
  // Standard directives
  enabled: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  disabled: "noindex, nofollow",
  index: "index",
  noindex: "noindex",
  follow: "follow",
  nofollow: "nofollow",
  none: "none",
  all: "all",
  // Non-standard directives (not part of official robots spec)
  noai: "noai",
  noimageai: "noimageai"
};
function formatMaxImagePreview(value) {
  return `max-image-preview:${value}`;
}
function formatMaxSnippet(value) {
  return `max-snippet:${value}`;
}
function formatMaxVideoPreview(value) {
  return `max-video-preview:${value}`;
}

function getSiteIndexable(e) {
  const { env, indexable } = useSiteConfig(e);
  if (typeof indexable !== "undefined")
    return String(indexable) === "true";
  return env === "production";
}

function getSiteRobotConfig(e) {
  const query = getQuery$1(e);
  const hints = [];
  const { groups, debug } = useRuntimeConfigNuxtRobots(e);
  let indexable = getSiteIndexable(e);
  const queryIndexableEnabled = String(query.mockProductionEnv) === "true" || query.mockProductionEnv === "";
  {
    const { _context } = useSiteConfig(e, { debug: debug || true });
    if (queryIndexableEnabled) {
      indexable = true;
      hints.push("You are mocking a production enviroment with ?mockProductionEnv query.");
    } else if (!indexable && _context.indexable === "nuxt-robots:config") {
      hints.push("You are blocking indexing with your Nuxt Robots config.");
    } else if (!queryIndexableEnabled && !_context.indexable) {
      hints.push(`Indexing is blocked in development. You can mock a production environment with ?mockProductionEnv query.`);
    } else if (!indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is blocked by site config set by ${_context.indexable}.`);
    } else if (indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is enabled from ${_context.indexable}.`);
    }
  }
  if (groups.some((g) => g.userAgent.includes("*") && g.disallow.includes("/"))) {
    indexable = false;
    hints.push("You are blocking all user agents with a wildcard `Disallow /`.");
  } else if (groups.some((g) => g.disallow.includes("/"))) {
    hints.push("You are blocking specific user agents with `Disallow /`.");
  }
  return { indexable, hints };
}

const _vYkeCO = defineEventHandler(async (e) => {
  const nitroApp = useNitroApp();
  const { indexable, hints } = getSiteRobotConfig(e);
  const { credits, isNuxtContentV2, cacheControl } = useRuntimeConfigNuxtRobots(e);
  let robotsTxtCtx = {
    sitemaps: [],
    groups: [
      {
        allow: [],
        comment: [],
        userAgent: ["*"],
        disallow: ["/"]
      }
    ]
  };
  if (indexable) {
    robotsTxtCtx = await resolveRobotsTxtContext(e);
    robotsTxtCtx.sitemaps = [...new Set(
      asArray(robotsTxtCtx.sitemaps).map((s) => !s.startsWith("http") ? withSiteUrl(e, s, { withBase: true}) : s)
    )];
    if (isNuxtContentV2) {
      const contentWithRobotRules = await e.$fetch("/__robots__/nuxt-content.json", {
        headers: {
          Accept: "application/json"
        }
      });
      if (String(contentWithRobotRules).trim().startsWith("<!DOCTYPE")) {
        logger$1.error("Invalid HTML returned from /__robots__/nuxt-content.json, skipping.");
      } else {
        for (const group of robotsTxtCtx.groups) {
          if (group.userAgent.includes("*")) {
            group.disallow.push(...contentWithRobotRules);
            group.disallow = group.disallow.filter(Boolean);
          }
        }
      }
    }
  }
  let robotsTxt = generateRobotsTxt(robotsTxtCtx);
  if (hints.length) {
    robotsTxt += `
# DEVELOPMENT HINTS:
# - ${hints.join("\n# - ")}
`;
  }
  if (credits) {
    robotsTxt = [
      `# START nuxt-robots (${indexable ? "indexable" : "indexing disabled"})`,
      robotsTxt,
      "# END nuxt-robots"
    ].filter(Boolean).join("\n");
  }
  setHeader(e, "Content-Type", "text/plain; charset=utf-8");
  setHeader(e, "Cache-Control", "no-store" );
  const hookCtx = { robotsTxt, e };
  await nitroApp.hooks.callHook("robots:robots-txt", hookCtx);
  return hookCtx.robotsTxt;
});

function withoutQuery$1(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher$1(e) {
  const { nitro, app } = useRuntimeConfig(e);
  const _routeRulesMatcher = toRouteMatcher(
    createRouter({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [withoutTrailingSlash(path), rules])
      )
    })
  );
  return (path) => {
    return defu$1({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(withoutTrailingSlash(withoutQuery$1(path)), app.baseURL)
    ).reverse());
  };
}

function normaliseRobotsRouteRule(config) {
  let allow;
  if (typeof config.robots === "boolean")
    allow = config.robots;
  else if (typeof config.robots === "object" && "indexable" in config.robots && typeof config.robots.indexable !== "undefined")
    allow = config.robots.indexable;
  let rule;
  if (typeof config.robots === "object" && config.robots !== null) {
    if ("rule" in config.robots && typeof config.robots.rule !== "undefined") {
      rule = config.robots.rule;
    } else if (!("indexable" in config.robots)) {
      const directives = [];
      for (const [key, value] of Object.entries(config.robots)) {
        if (value === false || value === null || value === void 0)
          continue;
        if (key in ROBOT_DIRECTIVE_VALUES && typeof value === "boolean" && value) {
          directives.push(ROBOT_DIRECTIVE_VALUES[key]);
        } else if (key === "max-image-preview" && typeof value === "string") {
          directives.push(formatMaxImagePreview(value));
        } else if (key === "max-snippet" && typeof value === "number") {
          directives.push(formatMaxSnippet(value));
        } else if (key === "max-video-preview" && typeof value === "number") {
          directives.push(formatMaxVideoPreview(value));
        }
      }
      if (directives.length > 0) {
        rule = directives.join(", ");
      }
    }
  } else if (typeof config.robots === "string") {
    rule = config.robots;
  }
  if (rule && typeof allow === "undefined") {
    const disallowIndicators = ["none", "noindex", "noai", "noimageai"];
    allow = !disallowIndicators.some(
      (indicator) => rule === indicator || rule.split(",").some((part) => part.trim() === indicator)
    );
  }
  if (typeof allow === "undefined" && typeof rule === "undefined")
    return;
  return {
    allow,
    rule
  };
}

function getPathRobotConfig(e, options) {
  const runtimeConfig = useRuntimeConfig(e);
  const { robotsDisabledValue, robotsEnabledValue, isNuxtContentV2 } = useRuntimeConfigNuxtRobots(e);
  if (!options?.skipSiteIndexable) {
    if (!getSiteRobotConfig(e).indexable) {
      return {
        rule: robotsDisabledValue,
        indexable: false,
        debug: {
          source: "Site Config"
        }
      };
    }
  }
  const path = options?.path || e.path;
  let userAgent = options?.userAgent;
  if (!userAgent) {
    try {
      userAgent = getRequestHeader(e, "User-Agent");
    } catch {
    }
  }
  const nitroApp = useNitroApp();
  const groups = [
    // run explicit user agent matching first
    ...nitroApp._robots.ctx.groups.filter((g) => {
      if (userAgent) {
        return g.userAgent.some((ua) => ua.toLowerCase().includes(userAgent.toLowerCase()));
      }
      return false;
    }),
    // run wildcard matches second
    ...nitroApp._robots.ctx.groups.filter((g) => g.userAgent.includes("*"))
  ];
  for (const group of groups) {
    if (!group._indexable) {
      return {
        indexable: false,
        rule: robotsDisabledValue,
        debug: {
          source: "/robots.txt",
          line: `Disallow: /`
        }
      };
    }
    const robotsTxtRule = matchPathToRule(path, group._rules || []);
    if (robotsTxtRule) {
      if (!robotsTxtRule.allow) {
        return {
          indexable: false,
          rule: robotsDisabledValue,
          debug: {
            source: "/robots.txt",
            line: `Disallow: ${robotsTxtRule.pattern}`
          }
        };
      }
      break;
    }
  }
  if (isNuxtContentV2 && nitroApp._robots?.nuxtContentUrls?.has(withoutTrailingSlash(path))) {
    return {
      indexable: false,
      rule: robotsDisabledValue,
      debug: {
        source: "Nuxt Content"
      }
    };
  }
  nitroApp._robotsRuleMatcher = nitroApp._robotsRuleMatcher || createNitroRouteRuleMatcher$1(e);
  let routeRulesPath = path;
  if (runtimeConfig.public?.i18n?.locales) {
    const { locales } = runtimeConfig.public.i18n;
    const locale = locales.find((l) => routeRulesPath.startsWith(`/${l.code}`));
    if (locale) {
      routeRulesPath = routeRulesPath.replace(`/${locale.code}`, "");
    }
  }
  const routeRules = normaliseRobotsRouteRule(nitroApp._robotsRuleMatcher(routeRulesPath));
  if (routeRules && (typeof routeRules.allow !== "undefined" || typeof routeRules.rule !== "undefined")) {
    return {
      indexable: routeRules.allow ?? false,
      rule: routeRules.rule || (routeRules.allow ? robotsEnabledValue : robotsDisabledValue),
      debug: {
        source: "Route Rules"
      }
    };
  }
  return {
    indexable: true,
    rule: robotsEnabledValue
  };
}

const _CGKcst = defineEventHandler(async (e) => {
  if (e.path === "/robots.txt" || e.path.startsWith("/__") || e.path.startsWith("/api") || e.path.startsWith("/_nuxt"))
    return;
  const nuxtRobotsConfig = useRuntimeConfigNuxtRobots(e);
  if (nuxtRobotsConfig) {
    const { header } = nuxtRobotsConfig;
    const robotConfig = getPathRobotConfig(e, { skipSiteIndexable: Boolean(getQuery$1(e)?.mockProductionEnv) });
    if (header) {
      setHeader(e, "X-Robots-Tag", robotConfig.rule);
    }
    e.context.robots = robotConfig;
  }
});

const _dwoqYh = defineEventHandler(async (e) => {
  const runtimeConfig = useRuntimeConfigNuxtRobots(e);
  const { indexable, hints } = getSiteRobotConfig(e);
  const siteConfig = useSiteConfig(e);
  const robotsTxt = await e.$fetch("/robots.txt", {
    query: getQuery$1(e)
  });
  return {
    robotsTxt,
    indexable,
    hints,
    runtimeConfig,
    siteConfig: {
      url: siteConfig.url,
      env: siteConfig.env,
      indexable: siteConfig.indexable
    }
  };
});

const _bbyk2i = defineEventHandler(async (e) => {
  const query = getQuery$1(e);
  const path = query.path;
  delete query.path;
  const res = await $fetch.raw(withQuery(path, query));
  const html = res._data;
  const robotsHeader = String(res.headers.get("x-robots-tag"));
  const robotsMeta = String(html).match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'](?:[^>]+data-hint=["']([^"']+)["'])?[^>]*>/i);
  const [, robotsContent = null, robotsHint = null] = robotsMeta || [];
  const [source, line] = robotsHint ? robotsHint.split(",") : [null, null];
  return {
    rule: robotsContent,
    indexable: !(robotsContent?.includes("noindex") && robotsHeader?.includes("noindex")),
    crawlable: !(source === "/robots.txt"),
    path,
    debug: {
      source,
      line
    },
    robotsHeader,
    robotsContent
  };
});

const logger = createConsola({
  defaults: {
    tag: "@nuxt/sitemap"
  }
});
const merger = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value))
    obj[key] = Array.from(/* @__PURE__ */ new Set([...obj[key], ...value]));
  return obj[key];
});
function mergeOnKey(arr, key) {
  const seen = /* @__PURE__ */ new Map();
  let resultLength = 0;
  const result = Array.from({ length: arr.length });
  for (const item of arr) {
    const k = item[key];
    if (seen.has(k)) {
      const existingIndex = seen.get(k);
      result[existingIndex] = merger(item, result[existingIndex]);
    } else {
      seen.set(k, resultLength);
      result[resultLength++] = item;
    }
  }
  return result.slice(0, resultLength);
}
function splitForLocales(path, locales) {
  const prefix = withLeadingSlash(path).split("/")[1];
  if (locales.includes(prefix))
    return [prefix, path.replace(`/${prefix}`, "")];
  return [null, path];
}
const StringifiedRegExpPattern = /\/(.*?)\/([gimsuy]*)$/;
function normalizeRuntimeFilters(input) {
  return (input || []).map((rule) => {
    if (rule instanceof RegExp || typeof rule === "string")
      return rule;
    const match = rule.regex.match(StringifiedRegExpPattern);
    if (match)
      return new RegExp(match[1], match[2]);
    return false;
  }).filter(Boolean);
}
function createPathFilter(options = {}) {
  const urlFilter = createFilter(options);
  return (loc) => {
    let path = loc;
    try {
      path = parseURL(loc).pathname;
    } catch {
      return false;
    }
    return urlFilter(path);
  };
}
function createFilter(options = {}) {
  const include = options.include || [];
  const exclude = options.exclude || [];
  if (include.length === 0 && exclude.length === 0)
    return () => true;
  return function(path) {
    for (const v of [{ rules: exclude, result: false }, { rules: include, result: true }]) {
      const regexRules = v.rules.filter((r) => r instanceof RegExp);
      if (regexRules.some((r) => r.test(path)))
        return v.result;
      const stringRules = v.rules.filter((r) => typeof r === "string");
      if (stringRules.length > 0) {
        const routes = {};
        for (const r of stringRules) {
          if (r === path)
            return v.result;
          routes[r] = true;
        }
        const routeRulesMatcher = toRouteMatcher(createRouter({ routes, strictTrailingSlash: false }));
        if (routeRulesMatcher.matchAll(path).length > 0)
          return Boolean(v.result);
      }
    }
    return include.length === 0;
  };
}

function xmlEscape(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function useSitemapRuntimeConfig(e) {
  const clone = JSON.parse(JSON.stringify(useRuntimeConfig(e).sitemap));
  for (const k in clone.sitemaps) {
    const sitemap = clone.sitemaps[k];
    sitemap.include = normalizeRuntimeFilters(sitemap.include);
    sitemap.exclude = normalizeRuntimeFilters(sitemap.exclude);
    clone.sitemaps[k] = sitemap;
  }
  return Object.freeze(clone);
}

function isValidString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function parseNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const num = Number.parseFloat(value.trim());
    return Number.isNaN(num) ? void 0 : num;
  }
  return void 0;
}
function parseInteger(value) {
  if (typeof value === "number") return Math.floor(value);
  if (typeof value === "string" && value.trim()) {
    const num = Number.parseInt(value.trim(), 10);
    return Number.isNaN(num) ? void 0 : num;
  }
  return void 0;
}
function extractUrlFromParsedElement(urlElement, warnings) {
  if (!isValidString(urlElement.loc)) {
    warnings.push({
      type: "validation",
      message: "URL entry missing required loc element",
      context: { url: String(urlElement.loc || "undefined") }
    });
    return null;
  }
  const urlObj = { loc: urlElement.loc };
  if (isValidString(urlElement.lastmod)) {
    urlObj.lastmod = urlElement.lastmod;
  }
  if (isValidString(urlElement.changefreq)) {
    const validFreqs = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
    if (validFreqs.includes(urlElement.changefreq)) {
      urlObj.changefreq = urlElement.changefreq;
    } else {
      warnings.push({
        type: "validation",
        message: "Invalid changefreq value",
        context: { url: urlElement.loc, field: "changefreq", value: urlElement.changefreq }
      });
    }
  }
  const priority = parseNumber(urlElement.priority);
  if (priority !== void 0 && !Number.isNaN(priority)) {
    if (priority < 0 || priority > 1) {
      warnings.push({
        type: "validation",
        message: "Priority value should be between 0.0 and 1.0, clamping to valid range",
        context: { url: urlElement.loc, field: "priority", value: priority }
      });
    }
    urlObj.priority = Math.max(0, Math.min(1, priority));
  } else if (urlElement.priority !== void 0) {
    warnings.push({
      type: "validation",
      message: "Invalid priority value",
      context: { url: urlElement.loc, field: "priority", value: urlElement.priority }
    });
  }
  if (urlElement.image) {
    const images = Array.isArray(urlElement.image) ? urlElement.image : [urlElement.image];
    const validImages = images.map((img) => {
      if (isValidString(img.loc)) {
        return { loc: img.loc };
      } else {
        warnings.push({
          type: "validation",
          message: "Image missing required loc element",
          context: { url: urlElement.loc, field: "image.loc" }
        });
        return null;
      }
    }).filter((img) => img !== null);
    if (validImages.length > 0) {
      urlObj.images = validImages;
    }
  }
  if (urlElement.video) {
    const videos = Array.isArray(urlElement.video) ? urlElement.video : [urlElement.video];
    const validVideos = videos.map((video) => {
      const missingFields = [];
      if (!isValidString(video.title)) missingFields.push("title");
      if (!isValidString(video.thumbnail_loc)) missingFields.push("thumbnail_loc");
      if (!isValidString(video.description)) missingFields.push("description");
      if (!isValidString(video.content_loc)) missingFields.push("content_loc");
      if (missingFields.length > 0) {
        warnings.push({
          type: "validation",
          message: `Video missing required fields: ${missingFields.join(", ")}`,
          context: { url: urlElement.loc, field: "video" }
        });
        return null;
      }
      const videoObj = {
        title: video.title,
        thumbnail_loc: video.thumbnail_loc,
        description: video.description,
        content_loc: video.content_loc
      };
      if (isValidString(video.player_loc)) {
        videoObj.player_loc = video.player_loc;
      }
      const duration = parseInteger(video.duration);
      if (duration !== void 0) {
        videoObj.duration = duration;
      } else if (video.duration !== void 0) {
        warnings.push({
          type: "validation",
          message: "Invalid video duration value",
          context: { url: urlElement.loc, field: "video.duration", value: video.duration }
        });
      }
      if (isValidString(video.expiration_date)) {
        videoObj.expiration_date = video.expiration_date;
      }
      const rating = parseNumber(video.rating);
      if (rating !== void 0) {
        if (rating < 0 || rating > 5) {
          warnings.push({
            type: "validation",
            message: "Video rating should be between 0.0 and 5.0",
            context: { url: urlElement.loc, field: "video.rating", value: rating }
          });
        }
        videoObj.rating = rating;
      } else if (video.rating !== void 0) {
        warnings.push({
          type: "validation",
          message: "Invalid video rating value",
          context: { url: urlElement.loc, field: "video.rating", value: video.rating }
        });
      }
      const viewCount = parseInteger(video.view_count);
      if (viewCount !== void 0) {
        videoObj.view_count = viewCount;
      } else if (video.view_count !== void 0) {
        warnings.push({
          type: "validation",
          message: "Invalid video view_count value",
          context: { url: urlElement.loc, field: "video.view_count", value: video.view_count }
        });
      }
      if (isValidString(video.publication_date)) {
        videoObj.publication_date = video.publication_date;
      }
      if (isValidString(video.family_friendly)) {
        const validValues = ["yes", "no"];
        if (validValues.includes(video.family_friendly)) {
          videoObj.family_friendly = video.family_friendly;
        } else {
          warnings.push({
            type: "validation",
            message: 'Invalid video family_friendly value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: "video.family_friendly", value: video.family_friendly }
          });
        }
      }
      if (isValidString(video.requires_subscription)) {
        const validValues = ["yes", "no"];
        if (validValues.includes(video.requires_subscription)) {
          videoObj.requires_subscription = video.requires_subscription;
        } else {
          warnings.push({
            type: "validation",
            message: 'Invalid video requires_subscription value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: "video.requires_subscription", value: video.requires_subscription }
          });
        }
      }
      if (isValidString(video.live)) {
        const validValues = ["yes", "no"];
        if (validValues.includes(video.live)) {
          videoObj.live = video.live;
        } else {
          warnings.push({
            type: "validation",
            message: 'Invalid video live value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: "video.live", value: video.live }
          });
        }
      }
      if (video.restriction && typeof video.restriction === "object") {
        const restriction = video.restriction;
        if (isValidString(restriction.relationship) && isValidString(restriction["#text"])) {
          const validRelationships = ["allow", "deny"];
          if (validRelationships.includes(restriction.relationship)) {
            videoObj.restriction = {
              relationship: restriction.relationship,
              restriction: restriction["#text"]
            };
          } else {
            warnings.push({
              type: "validation",
              message: 'Invalid video restriction relationship, should be "allow" or "deny"',
              context: { url: urlElement.loc, field: "video.restriction.relationship", value: restriction.relationship }
            });
          }
        }
      }
      if (video.platform && typeof video.platform === "object") {
        const platform = video.platform;
        if (isValidString(platform.relationship) && isValidString(platform["#text"])) {
          const validRelationships = ["allow", "deny"];
          if (validRelationships.includes(platform.relationship)) {
            videoObj.platform = {
              relationship: platform.relationship,
              platform: platform["#text"]
            };
          } else {
            warnings.push({
              type: "validation",
              message: 'Invalid video platform relationship, should be "allow" or "deny"',
              context: { url: urlElement.loc, field: "video.platform.relationship", value: platform.relationship }
            });
          }
        }
      }
      if (video.price) {
        const prices = Array.isArray(video.price) ? video.price : [video.price];
        const validPrices = prices.map((price) => {
          const priceValue = price["#text"];
          if (priceValue == null || typeof priceValue !== "string" && typeof priceValue !== "number") {
            warnings.push({
              type: "validation",
              message: "Video price missing value",
              context: { url: urlElement.loc, field: "video.price" }
            });
            return null;
          }
          const validTypes = ["rent", "purchase", "package", "subscription"];
          if (price.type && !validTypes.includes(price.type)) {
            warnings.push({
              type: "validation",
              message: `Invalid video price type "${price.type}", should be one of: ${validTypes.join(", ")}`,
              context: { url: urlElement.loc, field: "video.price.type", value: price.type }
            });
          }
          return {
            price: String(priceValue),
            currency: price.currency,
            type: price.type
          };
        }).filter((p) => p !== null);
        if (validPrices.length > 0) {
          videoObj.price = validPrices;
        }
      }
      if (video.uploader && typeof video.uploader === "object") {
        const uploader = video.uploader;
        if (isValidString(uploader.info) && isValidString(uploader["#text"])) {
          videoObj.uploader = {
            uploader: uploader["#text"],
            info: uploader.info
          };
        } else {
          warnings.push({
            type: "validation",
            message: "Video uploader missing required info or name",
            context: { url: urlElement.loc, field: "video.uploader" }
          });
        }
      }
      if (video.tag) {
        const tags = Array.isArray(video.tag) ? video.tag : [video.tag];
        const validTags = tags.filter(isValidString);
        if (validTags.length > 0) {
          videoObj.tag = validTags;
        }
      }
      return videoObj;
    }).filter((video) => video !== null);
    if (validVideos.length > 0) {
      urlObj.videos = validVideos;
    }
  }
  if (urlElement.link) {
    const links = Array.isArray(urlElement.link) ? urlElement.link : [urlElement.link];
    const alternatives = links.map((link) => {
      if (link.rel === "alternate" && isValidString(link.hreflang) && isValidString(link.href)) {
        return {
          hreflang: link.hreflang,
          href: link.href
        };
      } else {
        warnings.push({
          type: "validation",
          message: 'Alternative link missing required rel="alternate", hreflang, or href',
          context: { url: urlElement.loc, field: "link" }
        });
        return null;
      }
    }).filter((alt) => alt !== null);
    if (alternatives.length > 0) {
      urlObj.alternatives = alternatives;
    }
  }
  if (urlElement.news && typeof urlElement.news === "object") {
    const news = urlElement.news;
    if (isValidString(news.title) && isValidString(news.publication_date) && news.publication && isValidString(news.publication.name) && isValidString(news.publication.language)) {
      urlObj.news = {
        title: news.title,
        publication_date: news.publication_date,
        publication: {
          name: news.publication.name,
          language: news.publication.language
        }
      };
    } else {
      warnings.push({
        type: "validation",
        message: "News entry missing required fields (title, publication_date, publication.name, publication.language)",
        context: { url: urlElement.loc, field: "news" }
      });
    }
  }
  const filteredUrlObj = Object.fromEntries(
    Object.entries(urlObj).filter(
      ([_, value]) => value != null && (!Array.isArray(value) || value.length > 0)
    )
  );
  return filteredUrlObj;
}
async function parseSitemapXml(xml) {
  const warnings = [];
  if (!xml) {
    throw new Error("Empty XML input provided");
  }
  const { XMLParser } = await import('file://D:/GitHub/lipeaks_fc_games/node_modules/fast-xml-parser/src/fxp.js');
  const parser = new XMLParser({
    isArray: (tagName) => ["url", "image", "video", "link", "tag", "price"].includes(tagName),
    removeNSPrefix: true,
    parseAttributeValue: false,
    ignoreAttributes: false,
    attributeNamePrefix: "",
    trimValues: true
  });
  try {
    const parsed = parser.parse(xml);
    if (!parsed?.urlset) {
      throw new Error("XML does not contain a valid urlset element");
    }
    if (!parsed.urlset.url) {
      throw new Error("Sitemap contains no URL entries");
    }
    const urls = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
    const validUrls = urls.map((url) => extractUrlFromParsedElement(url, warnings)).filter((url) => url !== null);
    if (validUrls.length === 0 && urls.length > 0) {
      warnings.push({
        type: "validation",
        message: "No valid URLs found in sitemap after validation"
      });
    }
    return { urls: validUrls, warnings };
  } catch (error) {
    if (error instanceof Error && (error.message === "Empty XML input provided" || error.message === "XML does not contain a valid urlset element" || error.message === "Sitemap contains no URL entries")) {
      throw error;
    }
    throw new Error(`Failed to parse XML: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function tryFetchWithFallback(url, options, event) {
  const isExternalUrl = !url.startsWith("/");
  if (isExternalUrl) {
    const strategies = [
      // Strategy 1: Use globalThis.$fetch (original approach)
      () => globalThis.$fetch(url, options),
      // Strategy 2: If event is available, try using event context even for external URLs
      event ? () => event.$fetch(url, options) : null,
      // Strategy 3: Use native fetch as last resort
      () => $fetch(url, options)
    ].filter(Boolean);
    let lastError = null;
    for (const strategy of strategies) {
      try {
        return await strategy();
      } catch (error) {
        lastError = error;
        continue;
      }
    }
    throw lastError;
  }
  const fetchContainer = url.startsWith("/") && event ? event : globalThis;
  return await fetchContainer.$fetch(url, options);
}
async function fetchDataSource(input, event) {
  const context = typeof input.context === "string" ? { name: input.context } : input.context || { name: "fetch" };
  const url = typeof input.fetch === "string" ? input.fetch : input.fetch[0];
  const options = typeof input.fetch === "string" ? {} : input.fetch[1];
  const start = Date.now();
  const isExternalUrl = !url.startsWith("/");
  const timeout = isExternalUrl ? 1e4 : options.timeout || 5e3;
  const timeoutController = new AbortController();
  const abortRequestTimeout = setTimeout(() => timeoutController.abort(), timeout);
  try {
    let isMaybeErrorResponse = false;
    const isXmlRequest = parseURL(url).pathname.endsWith(".xml");
    const mergedHeaders = defu$1(
      options?.headers,
      {
        Accept: isXmlRequest ? "text/xml" : "application/json"
      },
      event ? { host: getRequestHost(event, { xForwardedHost: true }) } : {}
    );
    const fetchOptions = {
      ...options,
      responseType: isXmlRequest ? "text" : "json",
      signal: timeoutController.signal,
      headers: mergedHeaders,
      // Use ofetch's built-in retry for external sources
      ...isExternalUrl && {
        retry: 2,
        retryDelay: 200
      },
      // @ts-expect-error untyped
      onResponse({ response }) {
        if (typeof response._data === "string" && response._data.startsWith("<!DOCTYPE html>"))
          isMaybeErrorResponse = true;
      }
    };
    const res = await tryFetchWithFallback(url, fetchOptions, event);
    const timeTakenMs = Date.now() - start;
    if (isMaybeErrorResponse) {
      return {
        ...input,
        context,
        urls: [],
        timeTakenMs,
        error: "Received HTML response instead of JSON"
      };
    }
    let urls = [];
    if (typeof res === "object") {
      urls = res.urls || res;
    } else if (typeof res === "string" && parseURL(url).pathname.endsWith(".xml")) {
      const result = await parseSitemapXml(res);
      urls = result.urls;
    }
    return {
      ...input,
      context,
      timeTakenMs,
      urls
    };
  } catch (_err) {
    const error = _err;
    if (isExternalUrl) {
      const errorInfo = {
        url,
        timeout,
        error: error.message,
        statusCode: error.response?.status,
        statusText: error.response?.statusText,
        method: options?.method || "GET"
      };
      logger.error("Failed to fetch external source.", errorInfo);
    } else {
      logger.error("Failed to fetch source.", { url, error: error.message });
    }
    return {
      ...input,
      context,
      urls: [],
      error: error.message,
      _isFailure: true
      // Mark as failure to prevent caching
    };
  } finally {
    if (abortRequestTimeout) {
      clearTimeout(abortRequestTimeout);
    }
  }
}
function globalSitemapSources() {
  return Promise.resolve().then(function () { return globalSources; }).then((m) => m.sources);
}
function childSitemapSources(definition) {
  return definition?._hasSourceChunk ? Promise.resolve().then(function () { return childSources; }).then((m) => m.sources[definition.sitemapName] || []) : Promise.resolve([]);
}
async function resolveSitemapSources(sources, event) {
  return (await Promise.all(
    sources.map((source) => {
      if (typeof source === "object" && "urls" in source) {
        return {
          timeTakenMs: 0,
          ...source,
          urls: source.urls
        };
      }
      if (source.fetch)
        return fetchDataSource(source, event);
      return {
        ...source,
        error: "Invalid source"
      };
    })
  )).flat();
}

const _H25AEE = defineEventHandler(async (e) => {
  const _runtimeConfig = useSitemapRuntimeConfig();
  const { sitemaps: _sitemaps } = _runtimeConfig;
  const runtimeConfig = { ..._runtimeConfig };
  delete runtimeConfig.sitemaps;
  const globalSources = await globalSitemapSources();
  const nitroOrigin = useNitroOrigin(e);
  const sitemaps = {};
  for (const s of Object.keys(_sitemaps)) {
    sitemaps[s] = {
      ..._sitemaps[s],
      sources: await resolveSitemapSources(await childSitemapSources(_sitemaps[s]), e)
    };
  }
  return {
    nitroOrigin,
    sitemaps,
    runtimeConfig,
    globalSources: await resolveSitemapSources(globalSources, e)
  };
});

const _fag6cl = defineEventHandler(async (e) => {
  const fixPath = createSitePathResolver(e, { absolute: false, withBase: true });
  const { sitemapName: fallbackSitemapName, cacheMaxAgeSeconds, version, xslColumns, xslTips } = useSitemapRuntimeConfig();
  setHeader(e, "Content-Type", "application/xslt+xml");
  if (cacheMaxAgeSeconds)
    setHeader(e, "Cache-Control", `public, max-age=${cacheMaxAgeSeconds}, must-revalidate`);
  else
    setHeader(e, "Cache-Control", `no-cache, no-store`);
  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="icon" style="margin-right: 4px; font-size: 25px;" width="1em" height="1em" viewBox="0 0 32 32"><path fill="#93c5fd" d="M4 26h4v4H4zm10 0h4v4h-4zm10 0h4v4h-4zm1-10h-8v-2h-2v2H7a2.002 2.002 0 0 0-2 2v6h2v-6h8v6h2v-6h8v6h2v-6a2.002 2.002 0 0 0-2-2zM9 2v10h14V2zm2 2h2v6h-2zm10 6h-6V4h6z"></path></svg>`;
  const creditName = `<a href="https://github.com/nuxt-modules/sitemap" style="color: black; display: flex; align-items: center; font-weight: 500;" target="_blank" rel="noopener">${svgIcon} Nuxt Sitemap v${version}</a>`;
  const { name: siteName, url: siteUrl } = useSiteConfig(e);
  const referrer = getHeader(e, "Referer") || "/";
  const referrerPath = parseURL(referrer).pathname;
  const isNotIndexButHasIndex = referrerPath !== "/sitemap.xml" && referrerPath !== "/sitemap_index.xml" && referrerPath.endsWith(".xml");
  const sitemapName = parseURL(referrer).pathname.split("/").pop()?.split("-sitemap")[0] || fallbackSitemapName;
  const title = `${siteName}${sitemapName !== "sitemap.xml" ? ` - ${sitemapName === "sitemap_index.xml" ? "index" : sitemapName}` : ""}`.replace(/&/g, "&amp;");
  const canonicalQuery = getQuery(referrer).canonical;
  const isShowingCanonical = typeof canonicalQuery !== "undefined" && canonicalQuery !== "false";
  const conditionalTips = [
    'You are looking at a <a href="https://developer.mozilla.org/en-US/docs/Web/XSLT/Transforming_XML_with_XSLT/An_Overview" style="color: #398465" target="_blank">XML stylesheet</a>. Read the <a href="https://nuxtseo.com/sitemap/guides/customising-ui" style="color: #398465" target="_blank">docs</a> to learn how to customize it. View the page source to see the raw XML.',
    `URLs missing? Check Nuxt Devtools Sitemap tab (or the <a href="${xmlEscape(withQuery("/__sitemap__/debug.json", { sitemap: sitemapName }))}" style="color: #398465" target="_blank">debug endpoint</a>).`
  ];
  const fetchErrors = [];
  const xslQuery = getQuery$1(e);
  if (xslQuery.error_messages) {
    const errorMessages = xslQuery.error_messages;
    const errorUrls = xslQuery.error_urls;
    if (errorMessages) {
      const messages = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
      const urls = Array.isArray(errorUrls) ? errorUrls : errorUrls ? [errorUrls] : [];
      messages.forEach((msg, i) => {
        const errorParts = [xmlEscape(msg)];
        if (urls[i]) {
          errorParts.push(xmlEscape(urls[i]));
        }
        fetchErrors.push(`<strong style="color: #dc2626;">Error ${i + 1}:</strong> ${errorParts.join(" - ")}`);
      });
    }
  }
  if (!isShowingCanonical) {
    const canonicalPreviewUrl = withQuery(referrer, { canonical: "" });
    conditionalTips.push(`Your canonical site URL is <strong>${xmlEscape(siteUrl)}</strong>.`);
    conditionalTips.push(`You can preview your canonical sitemap by visiting <a href="${xmlEscape(canonicalPreviewUrl)}" style="color: #398465; white-space: nowrap;">${xmlEscape(fixPath(canonicalPreviewUrl))}?canonical</a>`);
  } else {
    conditionalTips.push(`You are viewing the canonical sitemap. You can switch to using the request origin: <a href="${xmlEscape(fixPath(referrer))}" style="color: #398465; white-space: nowrap ">${xmlEscape(fixPath(referrer))}</a>`);
  }
  const hasRuntimeErrors = fetchErrors.length > 0;
  const showDevTips = xslTips !== false;
  const showSidebar = showDevTips || hasRuntimeErrors;
  const devTips = showDevTips ? conditionalTips.map((t) => `<li><p>${t}</p></li>`).join("\n") : "";
  const runtimeErrors = hasRuntimeErrors ? fetchErrors.map((t) => `<li><p>${t}</p></li>`).join("\n") : "";
  let columns = [...xslColumns];
  if (!columns.length) {
    columns = [
      { label: "URL", width: "50%" },
      { label: "Images", width: "25%", select: "count(image:image)" },
      { label: "Last Updated", width: "25%", select: "concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))" }
    ];
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
          body {
            font-family: Inter, Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: #333;
          }

          table {
            border: none;
            border-collapse: collapse;
          }

          .bg-yellow-200 {
            background-color: #fef9c3;
          }

          .p-5 {
            padding: 1.25rem;
          }

          .rounded {
            border-radius: 4px;
            }

          .shadow {
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }

          #sitemap tr:nth-child(odd) td {
            background-color: #f8f8f8 !important;
          }

          #sitemap tbody tr:hover td {
            background-color: #fff;
          }

          #sitemap tbody tr:hover td, #sitemap tbody tr:hover td a {
            color: #000;
          }

          .expl a {
            color: #398465;
            font-weight: 600;
          }

          .expl a:visited {
            color: #398465;
          }

          a {
            color: #000;
            text-decoration: none;
          }

          a:visited {
            color: #777;
          }

          a:hover {
            text-decoration: underline;
          }

          td {
            font-size: 12px;
          }

          .text-2xl {
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.25;
          }

          th {
            text-align: left;
            padding-right: 30px;
            font-size: 12px;
          }

          thead th {
            border-bottom: 1px solid #000;
          }
          .fixed { position: fixed; }
          .right-2 { right: 2rem; }
          .top-2 { top: 2rem; }
          .w-30 { width: 30rem; }
          p { margin: 0; }
          li { padding-bottom: 0.5rem; line-height: 1.5; }
          h1 { margin: 0; }
          .mb-5 { margin-bottom: 1.25rem; }
          .mb-3 { margin-bottom: 0.75rem; }
        </style>
      </head>
      <body>
        <div style="grid-template-columns: 1fr 1fr; display: grid; margin: 3rem;">
            <div>
             <div id="content">
          <h1 class="text-2xl mb-3">XML Sitemap</h1>
          <h2>${xmlEscape(title)}</h2>
          ${isNotIndexButHasIndex ? `<p style="font-size: 12px; margin-bottom: 1rem;"><a href="${xmlEscape(fixPath("/sitemap_index.xml"))}">${xmlEscape(fixPath("/sitemap_index.xml"))}</a></p>` : ""}
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <p class="expl" style="margin-bottom: 1rem;">
              This XML Sitemap Index file contains
              <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps.
            </p>
            <table id="sitemap" cellpadding="3">
              <thead>
                <tr>
                  <th width="75%">Sitemap</th>
                  <th width="25%">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <xsl:variable name="sitemapURL">
                    <xsl:value-of select="sitemap:loc"/>
                  </xsl:variable>
                  <tr>
                    <td>
                      <a href="{$sitemapURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:value-of
                        select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
            <p class="expl" style="margin-bottom: 1rem;">
              This XML Sitemap contains
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.
            </p>
            <table id="sitemap" cellpadding="3">
              <thead>
                <tr>
                  ${columns.map((c) => `<th width="${c.width}">${c.label}</th>`).join("\n")}
                </tr>
              </thead>
              <tbody>
                <xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
                <xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    ${columns.filter((c) => c.label !== "URL").map((c) => `<td>
<xsl:value-of select="${c.select}"/>
</td>`).join("\n")}
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>
        </div>
                    ${showSidebar ? `<div class="w-30 top-2 shadow rounded p-5 right-2" style="margin: 0 auto;">
                      ${showDevTips ? `<div><p><strong>Development Tips</strong></p><ul style="margin: 1rem 0; padding: 0;">${devTips}</ul></div>` : ""}
                      ${hasRuntimeErrors ? `<div${showDevTips ? ' style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;"' : ""}><p><strong style="color: #dc2626;">Runtime Errors</strong></p><ul style="margin: 1rem 0; padding: 0;">${runtimeErrors}</ul></div>` : ""}
                      ${showDevTips ? `<p style="margin-top: 1rem;">${creditName}</p>` : ""}
                    </div>` : ""}
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;
});

function withoutQuery(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher() {
  const { nitro, app } = useRuntimeConfig();
  const _routeRulesMatcher = toRouteMatcher(
    createRouter({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [path === "/" ? path : withoutTrailingSlash(path), rules])
      )
    })
  );
  return (pathOrUrl) => {
    const path = pathOrUrl[0] === "/" ? pathOrUrl : parseURL(pathOrUrl, app.baseURL).pathname;
    const pathWithoutQuery = withoutQuery(path);
    return defu$1({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(pathWithoutQuery === "/" ? pathWithoutQuery : withoutTrailingSlash(pathWithoutQuery), app.baseURL)
    ).reverse());
  };
}

function resolve(s, resolvers) {
  if (typeof s === "undefined" || !resolvers)
    return s;
  s = typeof s === "string" ? s : s.toString();
  if (hasProtocol(s, { acceptRelative: true, strict: false }))
    return resolvers.fixSlashes(s);
  return resolvers.canonicalUrlResolver(s);
}
function removeTrailingSlash(s) {
  return s.replace(/\/(\?|#|$)/, "$1");
}
function preNormalizeEntry(_e, resolvers) {
  const e = typeof _e === "string" ? { loc: _e } : { ..._e };
  if (e.url && !e.loc) {
    e.loc = e.url;
    delete e.url;
  }
  if (typeof e.loc !== "string") {
    e.loc = "";
  }
  e.loc = removeTrailingSlash(e.loc);
  e._abs = hasProtocol(e.loc, { acceptRelative: false, strict: false });
  try {
    e._path = e._abs ? parseURL(e.loc) : parsePath(e.loc);
  } catch (e2) {
    e2._path = null;
  }
  if (e._path) {
    const query = parseQuery(e._path.search);
    const qs = stringifyQuery(query);
    e._relativeLoc = `${encodePath(e._path?.pathname)}${qs.length ? `?${qs}` : ""}`;
    if (e._path.host) {
      e.loc = stringifyParsedURL(e._path);
    } else {
      e.loc = e._relativeLoc;
    }
  } else if (!isEncoded(e.loc)) {
    e.loc = encodeURI(e.loc);
  }
  if (e.loc === "")
    e.loc = `/`;
  e.loc = resolve(e.loc, resolvers);
  e._key = `${e._sitemap || ""}${withoutTrailingSlash(e.loc)}`;
  return e;
}
function isEncoded(url) {
  try {
    return url !== decodeURIComponent(url);
  } catch {
    return false;
  }
}
function normaliseEntry(_e, defaults, resolvers) {
  const e = defu$1(_e, defaults);
  if (e.lastmod) {
    const date = normaliseDate(e.lastmod);
    if (date)
      e.lastmod = date;
    else
      delete e.lastmod;
  }
  if (!e.lastmod)
    delete e.lastmod;
  e.loc = resolve(e.loc, resolvers);
  if (e.alternatives) {
    const alternatives = e.alternatives.map((a) => ({ ...a }));
    for (let i = 0; i < alternatives.length; i++) {
      const alt = alternatives[i];
      if (typeof alt.href === "string") {
        alt.href = resolve(alt.href, resolvers);
      } else if (typeof alt.href === "object" && alt.href) {
        alt.href = resolve(alt.href.href, resolvers);
      }
    }
    e.alternatives = mergeOnKey(alternatives, "hreflang");
  }
  if (e.images) {
    const images = e.images.map((i) => ({ ...i }));
    for (let i = 0; i < images.length; i++) {
      images[i].loc = resolve(images[i].loc, resolvers);
    }
    e.images = mergeOnKey(images, "loc");
  }
  if (e.videos) {
    const videos = e.videos.map((v) => ({ ...v }));
    for (let i = 0; i < videos.length; i++) {
      if (videos[i].content_loc) {
        videos[i].content_loc = resolve(videos[i].content_loc, resolvers);
      }
    }
    e.videos = mergeOnKey(videos, "content_loc");
  }
  return e;
}
const IS_VALID_W3C_DATE = [
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  /^\d{4}-[01]\d-[0-3]\d$/,
  /^\d{4}-[01]\d$/,
  /^\d{4}$/
];
function isValidW3CDate(d) {
  return IS_VALID_W3C_DATE.some((r) => r.test(d));
}
function normaliseDate(d) {
  if (typeof d === "string") {
    if (d.includes("T")) {
      const t = d.split("T")[1];
      if (!t.includes("+") && !t.includes("-") && !t.includes("Z")) {
        d += "Z";
      }
    }
    if (!isValidW3CDate(d))
      return false;
    d = new Date(d);
    d.setMilliseconds(0);
    if (Number.isNaN(d.getTime()))
      return false;
  }
  const z = (n) => `0${n}`.slice(-2);
  const date = `${d.getUTCFullYear()}-${z(d.getUTCMonth() + 1)}-${z(d.getUTCDate())}`;
  if (d.getUTCHours() > 0 || d.getUTCMinutes() > 0 || d.getUTCSeconds() > 0) {
    return `${date}T${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}Z`;
  }
  return date;
}

function sortInPlace(urls) {
  urls.sort((a, b) => {
    const aLoc = typeof a === "string" ? a : a.loc;
    const bLoc = typeof b === "string" ? b : b.loc;
    const aSegments = aLoc.split("/").length;
    const bSegments = bLoc.split("/").length;
    if (aSegments !== bSegments) {
      return aSegments - bSegments;
    }
    return aLoc.localeCompare(bLoc, void 0, { numeric: true });
  });
  return urls;
}

function parseChunkInfo(sitemapName, sitemaps, defaultChunkSize = 1e3) {
  if (typeof sitemaps.chunks !== "undefined" && !Number.isNaN(Number(sitemapName))) {
    return {
      isChunked: true,
      baseSitemapName: "sitemap",
      chunkIndex: Number(sitemapName),
      chunkSize: defaultChunkSize
    };
  }
  if (sitemapName.includes("-")) {
    const parts = sitemapName.split("-");
    const lastPart = parts.pop();
    if (!Number.isNaN(Number(lastPart))) {
      const baseSitemapName = parts.join("-");
      const baseSitemap = sitemaps[baseSitemapName];
      if (baseSitemap && (baseSitemap.chunks || baseSitemap._isChunking)) {
        const chunkSize = typeof baseSitemap.chunks === "number" ? baseSitemap.chunks : baseSitemap.chunkSize || defaultChunkSize;
        return {
          isChunked: true,
          baseSitemapName,
          chunkIndex: Number(lastPart),
          chunkSize
        };
      }
    }
  }
  return {
    isChunked: false,
    baseSitemapName: sitemapName,
    chunkIndex: void 0,
    chunkSize: defaultChunkSize
  };
}
function getSitemapConfig(sitemapName, sitemaps, defaultChunkSize = 1e3) {
  const chunkInfo = parseChunkInfo(sitemapName, sitemaps, defaultChunkSize);
  if (chunkInfo.isChunked) {
    if (chunkInfo.baseSitemapName === "sitemap" && typeof sitemaps.chunks !== "undefined") {
      return {
        ...sitemaps.chunks,
        sitemapName,
        _isChunking: true,
        _chunkSize: chunkInfo.chunkSize
      };
    }
    const baseSitemap = sitemaps[chunkInfo.baseSitemapName];
    if (baseSitemap) {
      return {
        ...baseSitemap,
        sitemapName,
        // Use the full name with chunk index
        _isChunking: true,
        _chunkSize: chunkInfo.chunkSize
      };
    }
  }
  return sitemaps[sitemapName];
}
function sliceUrlsForChunk(urls, sitemapName, sitemaps, defaultChunkSize = 1e3) {
  const chunkInfo = parseChunkInfo(sitemapName, sitemaps, defaultChunkSize);
  if (chunkInfo.isChunked && chunkInfo.chunkIndex !== void 0) {
    const startIndex = chunkInfo.chunkIndex * chunkInfo.chunkSize;
    const endIndex = (chunkInfo.chunkIndex + 1) * chunkInfo.chunkSize;
    return urls.slice(startIndex, endIndex);
  }
  return urls;
}

function escapeValueForXml(value) {
  if (value === true || value === false)
    return value ? "yes" : "no";
  return xmlEscape(String(value));
}
const URLSET_OPENING_TAG = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
function buildUrlXml(url) {
  const capacity = 50;
  const parts = Array.from({ length: capacity });
  let partIndex = 0;
  parts[partIndex++] = "    <url>";
  if (url.loc) {
    parts[partIndex++] = `        <loc>${escapeValueForXml(url.loc)}</loc>`;
  }
  if (url.lastmod) {
    parts[partIndex++] = `        <lastmod>${url.lastmod}</lastmod>`;
  }
  if (url.changefreq) {
    parts[partIndex++] = `        <changefreq>${url.changefreq}</changefreq>`;
  }
  if (url.priority !== void 0) {
    const priorityValue = Number.parseFloat(String(url.priority));
    const formattedPriority = priorityValue % 1 === 0 ? String(priorityValue) : priorityValue.toFixed(1);
    parts[partIndex++] = `        <priority>${formattedPriority}</priority>`;
  }
  const keys = Object.keys(url).filter((k) => !k.startsWith("_") && !["loc", "lastmod", "changefreq", "priority"].includes(k));
  for (const key of keys) {
    const value = url[key];
    if (value === void 0 || value === null) continue;
    switch (key) {
      case "alternatives":
        if (Array.isArray(value) && value.length > 0) {
          for (const alt of value) {
            const attrs = Object.entries(alt).map(([k, v]) => `${k}="${escapeValueForXml(v)}"`).join(" ");
            parts[partIndex++] = `        <xhtml:link rel="alternate" ${attrs} />`;
          }
        }
        break;
      case "images":
        if (Array.isArray(value) && value.length > 0) {
          for (const img of value) {
            parts[partIndex++] = "        <image:image>";
            parts[partIndex++] = `            <image:loc>${escapeValueForXml(img.loc)}</image:loc>`;
            if (img.title) parts[partIndex++] = `            <image:title>${escapeValueForXml(img.title)}</image:title>`;
            if (img.caption) parts[partIndex++] = `            <image:caption>${escapeValueForXml(img.caption)}</image:caption>`;
            if (img.geo_location) parts[partIndex++] = `            <image:geo_location>${escapeValueForXml(img.geo_location)}</image:geo_location>`;
            if (img.license) parts[partIndex++] = `            <image:license>${escapeValueForXml(img.license)}</image:license>`;
            parts[partIndex++] = "        </image:image>";
          }
        }
        break;
      case "videos":
        if (Array.isArray(value) && value.length > 0) {
          for (const video of value) {
            parts[partIndex++] = "        <video:video>";
            parts[partIndex++] = `            <video:title>${escapeValueForXml(video.title)}</video:title>`;
            if (video.thumbnail_loc) {
              parts[partIndex++] = `            <video:thumbnail_loc>${escapeValueForXml(video.thumbnail_loc)}</video:thumbnail_loc>`;
            }
            parts[partIndex++] = `            <video:description>${escapeValueForXml(video.description)}</video:description>`;
            if (video.content_loc) {
              parts[partIndex++] = `            <video:content_loc>${escapeValueForXml(video.content_loc)}</video:content_loc>`;
            }
            if (video.player_loc) {
              const attrs = video.player_loc.allow_embed ? ' allow_embed="yes"' : "";
              const autoplay = video.player_loc.autoplay ? ' autoplay="yes"' : "";
              parts[partIndex++] = `            <video:player_loc${attrs}${autoplay}>${escapeValueForXml(video.player_loc)}</video:player_loc>`;
            }
            if (video.duration !== void 0) {
              parts[partIndex++] = `            <video:duration>${video.duration}</video:duration>`;
            }
            if (video.expiration_date) {
              parts[partIndex++] = `            <video:expiration_date>${video.expiration_date}</video:expiration_date>`;
            }
            if (video.rating !== void 0) {
              parts[partIndex++] = `            <video:rating>${video.rating}</video:rating>`;
            }
            if (video.view_count !== void 0) {
              parts[partIndex++] = `            <video:view_count>${video.view_count}</video:view_count>`;
            }
            if (video.publication_date) {
              parts[partIndex++] = `            <video:publication_date>${video.publication_date}</video:publication_date>`;
            }
            if (video.family_friendly !== void 0) {
              parts[partIndex++] = `            <video:family_friendly>${video.family_friendly === "yes" || video.family_friendly === true ? "yes" : "no"}</video:family_friendly>`;
            }
            if (video.restriction) {
              const relationship = video.restriction.relationship || "allow";
              parts[partIndex++] = `            <video:restriction relationship="${relationship}">${escapeValueForXml(video.restriction.restriction)}</video:restriction>`;
            }
            if (video.platform) {
              const relationship = video.platform.relationship || "allow";
              parts[partIndex++] = `            <video:platform relationship="${relationship}">${escapeValueForXml(video.platform.platform)}</video:platform>`;
            }
            if (video.requires_subscription !== void 0) {
              parts[partIndex++] = `            <video:requires_subscription>${video.requires_subscription === "yes" || video.requires_subscription === true ? "yes" : "no"}</video:requires_subscription>`;
            }
            if (video.price) {
              const prices = Array.isArray(video.price) ? video.price : [video.price];
              for (const price of prices) {
                const attrs = [];
                if (price.currency) attrs.push(`currency="${price.currency}"`);
                if (price.type) attrs.push(`type="${price.type}"`);
                const attrsStr = attrs.length > 0 ? " " + attrs.join(" ") : "";
                parts[partIndex++] = `            <video:price${attrsStr}>${escapeValueForXml(price.price)}</video:price>`;
              }
            }
            if (video.uploader) {
              const info = video.uploader.info ? ` info="${escapeValueForXml(video.uploader.info)}"` : "";
              parts[partIndex++] = `            <video:uploader${info}>${escapeValueForXml(video.uploader.uploader)}</video:uploader>`;
            }
            if (video.live !== void 0) {
              parts[partIndex++] = `            <video:live>${video.live === "yes" || video.live === true ? "yes" : "no"}</video:live>`;
            }
            if (video.tag) {
              const tags = Array.isArray(video.tag) ? video.tag : [video.tag];
              for (const tag of tags) {
                parts[partIndex++] = `            <video:tag>${escapeValueForXml(tag)}</video:tag>`;
              }
            }
            if (video.category) {
              parts[partIndex++] = `            <video:category>${escapeValueForXml(video.category)}</video:category>`;
            }
            if (video.gallery_loc) {
              const title = video.gallery_loc.title ? ` title="${escapeValueForXml(video.gallery_loc.title)}"` : "";
              parts[partIndex++] = `            <video:gallery_loc${title}>${escapeValueForXml(video.gallery_loc)}</video:gallery_loc>`;
            }
            parts[partIndex++] = "        </video:video>";
          }
        }
        break;
      case "news":
        if (value) {
          parts[partIndex++] = "        <news:news>";
          parts[partIndex++] = "            <news:publication>";
          parts[partIndex++] = `                <news:name>${escapeValueForXml(value.publication.name)}</news:name>`;
          parts[partIndex++] = `                <news:language>${escapeValueForXml(value.publication.language)}</news:language>`;
          parts[partIndex++] = "            </news:publication>";
          if (value.title) {
            parts[partIndex++] = `            <news:title>${escapeValueForXml(value.title)}</news:title>`;
          }
          if (value.publication_date) {
            parts[partIndex++] = `            <news:publication_date>${value.publication_date}</news:publication_date>`;
          }
          if (value.access) {
            parts[partIndex++] = `            <news:access>${value.access}</news:access>`;
          }
          if (value.genres) {
            parts[partIndex++] = `            <news:genres>${escapeValueForXml(value.genres)}</news:genres>`;
          }
          if (value.keywords) {
            parts[partIndex++] = `            <news:keywords>${escapeValueForXml(value.keywords)}</news:keywords>`;
          }
          if (value.stock_tickers) {
            parts[partIndex++] = `            <news:stock_tickers>${escapeValueForXml(value.stock_tickers)}</news:stock_tickers>`;
          }
          parts[partIndex++] = "        </news:news>";
        }
        break;
    }
  }
  parts[partIndex++] = "    </url>";
  return parts.slice(0, partIndex).join("\n");
}
function urlsToXml(urls, resolvers, { version, xsl, credits, minify }, errorInfo) {
  const estimatedSize = urls.length + 5;
  const xmlParts = Array.from({ length: estimatedSize });
  let partIndex = 0;
  let xslHref = xsl ? resolvers.relativeBaseUrlResolver(xsl) : false;
  if (xslHref && errorInfo && errorInfo.messages.length > 0) {
    xslHref = withQuery(xslHref, {
      errors: "true",
      error_messages: errorInfo.messages,
      error_urls: errorInfo.urls
    });
  }
  if (xslHref) {
    xmlParts[partIndex++] = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${escapeValueForXml(xslHref)}"?>`;
  } else {
    xmlParts[partIndex++] = '<?xml version="1.0" encoding="UTF-8"?>';
  }
  xmlParts[partIndex++] = URLSET_OPENING_TAG;
  for (const url of urls) {
    xmlParts[partIndex++] = buildUrlXml(url);
  }
  xmlParts[partIndex++] = "</urlset>";
  if (credits) {
    xmlParts[partIndex++] = `<!-- XML Sitemap generated by @nuxtjs/sitemap v${version} at ${(/* @__PURE__ */ new Date()).toISOString()} -->`;
  }
  const xmlContent = xmlParts.slice(0, partIndex);
  if (minify) {
    return xmlContent.join("").replace(/(?<!<[^>]*)\s(?![^<]*>)/g, "");
  }
  return xmlContent.join("\n");
}

function resolveSitemapEntries(sitemap, urls, runtimeConfig, resolvers) {
  const {
    autoI18n,
    isI18nMapped
  } = runtimeConfig;
  const filterPath = createPathFilter({
    include: sitemap.include,
    exclude: sitemap.exclude
  });
  const _urls = urls.map((_e) => {
    const e = preNormalizeEntry(_e, resolvers);
    if (!e.loc || !filterPath(e.loc))
      return false;
    return e;
  }).filter(Boolean);
  let validI18nUrlsForTransform = [];
  let warnIncorrectI18nTransformUsage = false;
  const withoutPrefixPaths = {};
  if (autoI18n && autoI18n.strategy !== "no_prefix") {
    const localeCodes = autoI18n.locales.map((l) => l.code);
    validI18nUrlsForTransform = _urls.map((_e, i) => {
      if (_e._abs)
        return false;
      const split = splitForLocales(_e._relativeLoc, localeCodes);
      let localeCode = split[0];
      const pathWithoutPrefix = split[1];
      if (!localeCode)
        localeCode = autoI18n.defaultLocale;
      const e = _e;
      e._pathWithoutPrefix = pathWithoutPrefix;
      const locale = autoI18n.locales.find((l) => l.code === localeCode);
      if (!locale)
        return false;
      e._locale = locale;
      e._index = i;
      e._key = `${e._sitemap || ""}${e._path?.pathname || "/"}${e._path.search}`;
      withoutPrefixPaths[pathWithoutPrefix] = withoutPrefixPaths[pathWithoutPrefix] || [];
      if (!withoutPrefixPaths[pathWithoutPrefix].some((e2) => e2._locale.code === locale.code))
        withoutPrefixPaths[pathWithoutPrefix].push(e);
      return e;
    }).filter(Boolean);
    for (const e of validI18nUrlsForTransform) {
      if (!e._i18nTransform && !e.alternatives?.length) {
        const alternatives = withoutPrefixPaths[e._pathWithoutPrefix].map((u) => {
          const entries = [];
          if (u._locale.code === autoI18n.defaultLocale) {
            entries.push({
              href: u.loc,
              hreflang: "x-default"
            });
          }
          entries.push({
            href: u.loc,
            hreflang: u._locale._hreflang || autoI18n.defaultLocale
          });
          return entries;
        }).flat().filter(Boolean);
        if (alternatives.length)
          e.alternatives = alternatives;
      } else if (e._i18nTransform) {
        delete e._i18nTransform;
        if (autoI18n.strategy === "no_prefix") {
          warnIncorrectI18nTransformUsage = true;
        }
        if (autoI18n.differentDomains) {
          e.alternatives = [
            {
              // apply default locale domain
              ...autoI18n.locales.find((l) => [l.code, l.language].includes(autoI18n.defaultLocale)),
              code: "x-default"
            },
            ...autoI18n.locales.filter((l) => !!l.domain)
          ].map((locale) => {
            return {
              hreflang: locale._hreflang,
              href: joinURL(withHttps(locale.domain), e._pathWithoutPrefix)
            };
          });
        } else {
          for (const l of autoI18n.locales) {
            let loc = e._pathWithoutPrefix;
            if (autoI18n.pages) {
              const pageKey = e._pathWithoutPrefix.replace(/^\//, "").replace(/\/index$/, "") || "index";
              const pageMappings = autoI18n.pages[pageKey];
              if (pageMappings && pageMappings[l.code] !== void 0) {
                const customPath = pageMappings[l.code];
                if (customPath === false)
                  continue;
                if (typeof customPath === "string")
                  loc = customPath.startsWith("/") ? customPath : `/${customPath}`;
              } else if (!autoI18n.differentDomains && !(["prefix_and_default", "prefix_except_default"].includes(autoI18n.strategy) && l.code === autoI18n.defaultLocale)) {
                loc = joinURL(`/${l.code}`, e._pathWithoutPrefix);
              }
            } else {
              if (!autoI18n.differentDomains && !(["prefix_and_default", "prefix_except_default"].includes(autoI18n.strategy) && l.code === autoI18n.defaultLocale))
                loc = joinURL(`/${l.code}`, e._pathWithoutPrefix);
            }
            const _sitemap = isI18nMapped ? l._sitemap : void 0;
            const newEntry = preNormalizeEntry({
              _sitemap,
              ...e,
              _index: void 0,
              _key: `${_sitemap || ""}${loc || "/"}${e._path.search}`,
              _locale: l,
              loc,
              alternatives: [{ code: "x-default", _hreflang: "x-default" }, ...autoI18n.locales].map((locale) => {
                const code = locale.code === "x-default" ? autoI18n.defaultLocale : locale.code;
                const isDefault = locale.code === "x-default" || locale.code === autoI18n.defaultLocale;
                let href = e._pathWithoutPrefix;
                if (autoI18n.pages) {
                  const pageKey = e._pathWithoutPrefix.replace(/^\//, "").replace(/\/index$/, "") || "index";
                  const pageMappings = autoI18n.pages[pageKey];
                  if (pageMappings && pageMappings[code] !== void 0) {
                    const customPath = pageMappings[code];
                    if (customPath === false)
                      return false;
                    if (typeof customPath === "string")
                      href = customPath.startsWith("/") ? customPath : `/${customPath}`;
                  } else if (autoI18n.strategy === "prefix") {
                    href = joinURL("/", code, e._pathWithoutPrefix);
                  } else if (["prefix_and_default", "prefix_except_default"].includes(autoI18n.strategy)) {
                    if (!isDefault) {
                      href = joinURL("/", code, e._pathWithoutPrefix);
                    }
                  }
                } else {
                  if (autoI18n.strategy === "prefix") {
                    href = joinURL("/", code, e._pathWithoutPrefix);
                  } else if (["prefix_and_default", "prefix_except_default"].includes(autoI18n.strategy)) {
                    if (!isDefault) {
                      href = joinURL("/", code, e._pathWithoutPrefix);
                    }
                  }
                }
                if (!filterPath(href))
                  return false;
                return {
                  hreflang: locale._hreflang,
                  href
                };
              }).filter(Boolean)
            }, resolvers);
            if (e._locale.code === newEntry._locale.code) {
              _urls[e._index] = newEntry;
              e._index = void 0;
            } else {
              _urls.push(newEntry);
            }
          }
        }
      }
      if (isI18nMapped) {
        e._sitemap = e._sitemap || e._locale._sitemap;
        e._key = `${e._sitemap || ""}${e.loc || "/"}${e._path.search}`;
      }
      if (e._index)
        _urls[e._index] = e;
    }
  }
  if (warnIncorrectI18nTransformUsage) {
    logger.warn("You're using _i18nTransform with the `no_prefix` strategy. This will cause issues with the sitemap. Please remove the _i18nTransform flag or change i18n strategy.");
  }
  return _urls;
}
async function buildSitemapUrls(sitemap, resolvers, runtimeConfig, nitro) {
  const {
    sitemaps,
    // enhancing
    autoI18n,
    isI18nMapped,
    isMultiSitemap,
    // sorting
    sortEntries,
    // chunking
    defaultSitemapsChunkSize
  } = runtimeConfig;
  const chunkInfo = parseChunkInfo(sitemap.sitemapName, sitemaps, defaultSitemapsChunkSize);
  function maybeSort(urls2) {
    return sortEntries ? sortInPlace(urls2) : urls2;
  }
  function maybeSlice(urls2) {
    return sliceUrlsForChunk(urls2, sitemap.sitemapName, sitemaps, defaultSitemapsChunkSize);
  }
  if (autoI18n?.differentDomains) {
    const domain = autoI18n.locales.find((e) => [e.language, e.code].includes(sitemap.sitemapName))?.domain;
    if (domain) {
      const _tester = resolvers.canonicalUrlResolver;
      resolvers.canonicalUrlResolver = (path) => resolveSitePath(path, {
        absolute: true,
        withBase: false,
        siteUrl: withHttps(domain),
        trailingSlash: _tester("/test/").endsWith("/"),
        base: "/"
      });
    }
  }
  let effectiveSitemap = sitemap;
  const baseSitemapName = chunkInfo.baseSitemapName;
  if (chunkInfo.isChunked && baseSitemapName !== sitemap.sitemapName && sitemaps[baseSitemapName]) {
    effectiveSitemap = sitemaps[baseSitemapName];
  }
  let sourcesInput = effectiveSitemap.includeAppSources ? await globalSitemapSources() : [];
  sourcesInput.push(...await childSitemapSources(effectiveSitemap));
  if (nitro && resolvers.event) {
    const ctx = {
      event: resolvers.event,
      sitemapName: baseSitemapName,
      sources: sourcesInput
    };
    await nitro.hooks.callHook("sitemap:sources", ctx);
    sourcesInput = ctx.sources;
  }
  const sources = await resolveSitemapSources(sourcesInput, resolvers.event);
  const failedSources = sources.filter((source) => source.error && source._isFailure).map((source) => ({
    url: typeof source.fetch === "string" ? source.fetch : source.fetch?.[0] || "unknown",
    error: source.error || "Unknown error"
  }));
  const resolvedCtx = {
    urls: sources.flatMap((s) => s.urls),
    sitemapName: sitemap.sitemapName,
    event: resolvers.event
  };
  await nitro?.hooks.callHook("sitemap:input", resolvedCtx);
  const enhancedUrls = resolveSitemapEntries(sitemap, resolvedCtx.urls, { autoI18n, isI18nMapped }, resolvers);
  const filteredUrls = enhancedUrls.filter((e) => {
    if (isMultiSitemap && e._sitemap && sitemap.sitemapName)
      return e._sitemap === sitemap.sitemapName;
    return true;
  });
  const sortedUrls = maybeSort(filteredUrls);
  const urls = maybeSlice(sortedUrls);
  return { urls, failedSources };
}

function useNitroUrlResolvers(e) {
  const canonicalQuery = getQuery$1(e).canonical;
  const isShowingCanonical = typeof canonicalQuery !== "undefined" && canonicalQuery !== "false";
  const siteConfig = useSiteConfig(e);
  return {
    event: e,
    fixSlashes: (path) => fixSlashes(siteConfig.trailingSlash, path),
    // we need these as they depend on the nitro event
    canonicalUrlResolver: createSitePathResolver(e, {
      canonical: isShowingCanonical || false,
      absolute: true,
      withBase: true
    }),
    relativeBaseUrlResolver: createSitePathResolver(e, { absolute: false, withBase: true })
  };
}
async function buildSitemapXml(event, definition, resolvers, runtimeConfig) {
  const { sitemapName } = definition;
  const nitro = useNitroApp();
  const { urls: sitemapUrls, failedSources } = await buildSitemapUrls(definition, resolvers, runtimeConfig, nitro);
  const routeRuleMatcher = createNitroRouteRuleMatcher();
  const { autoI18n } = runtimeConfig;
  let validCount = 0;
  for (let i = 0; i < sitemapUrls.length; i++) {
    const u = sitemapUrls[i];
    const path = u._path?.pathname || u.loc;
    if (!getPathRobotConfig(event, { path, skipSiteIndexable: true }).indexable)
      continue;
    let routeRules = routeRuleMatcher(path);
    if (autoI18n?.locales && autoI18n?.strategy !== "no_prefix") {
      const match = splitForLocales(path, autoI18n.locales.map((l) => l.code));
      const pathWithoutPrefix = match[1];
      if (pathWithoutPrefix && pathWithoutPrefix !== path)
        routeRules = defu$1(routeRules, routeRuleMatcher(pathWithoutPrefix));
    }
    if (routeRules.sitemap === false)
      continue;
    if (typeof routeRules.robots !== "undefined" && !routeRules.robots)
      continue;
    const hasRobotsDisabled = Object.entries(routeRules.headers || {}).some(([name, value]) => name.toLowerCase() === "x-robots-tag" && value.toLowerCase().includes("noindex"));
    if (routeRules.redirect || hasRobotsDisabled)
      continue;
    sitemapUrls[validCount++] = routeRules.sitemap ? defu$1(u, routeRules.sitemap) : u;
  }
  sitemapUrls.length = validCount;
  const locSize = sitemapUrls.length;
  const resolvedCtx = {
    urls: sitemapUrls,
    sitemapName,
    event
  };
  await nitro.hooks.callHook("sitemap:resolved", resolvedCtx);
  if (resolvedCtx.urls.length !== locSize) {
    resolvedCtx.urls = resolvedCtx.urls.map((e) => preNormalizeEntry(e, resolvers));
  }
  const maybeSort = (urls2) => runtimeConfig.sortEntries ? sortInPlace(urls2) : urls2;
  const normalizedPreDedupe = resolvedCtx.urls.map((e) => normaliseEntry(e, definition.defaults, resolvers));
  const urls = maybeSort(mergeOnKey(normalizedPreDedupe, "_key").map((e) => normaliseEntry(e, definition.defaults, resolvers)));
  if (definition._isChunking && definition.sitemapName.includes("-")) {
    const parts = definition.sitemapName.split("-");
    const lastPart = parts.pop();
    if (!Number.isNaN(Number(lastPart))) {
      const chunkIndex = Number(lastPart);
      const baseSitemapName = parts.join("-");
      if (urls.length === 0 && chunkIndex > 0) {
        throw createError({
          statusCode: 404,
          message: `Sitemap chunk ${chunkIndex} for "${baseSitemapName}" does not exist.`
        });
      }
    }
  }
  const errorInfo = failedSources.length > 0 ? {
    messages: failedSources.map((f) => f.error),
    urls: failedSources.map((f) => f.url)
  } : void 0;
  const sitemap = urlsToXml(urls, resolvers, runtimeConfig, errorInfo);
  const ctx = { sitemap, sitemapName, event };
  await nitro.hooks.callHook("sitemap:output", ctx);
  return ctx.sitemap;
}
defineCachedFunction(
  buildSitemapXml,
  {
    name: "sitemap:xml",
    group: "sitemap",
    maxAge: 60 * 10,
    // Default 10 minutes
    base: "sitemap",
    // Use the sitemap storage
    getKey: (event, definition) => {
      const host = getHeader(event, "host") || getHeader(event, "x-forwarded-host") || "";
      const proto = getHeader(event, "x-forwarded-proto") || "https";
      const sitemapName = definition.sitemapName || "default";
      return `${sitemapName}-${proto}-${host}`;
    },
    swr: true
    // Enable stale-while-revalidate
  }
);
async function createSitemap(event, definition, runtimeConfig) {
  const resolvers = useNitroUrlResolvers(event);
  const xml = await buildSitemapXml(event, definition, resolvers, runtimeConfig);
  setHeader(event, "Content-Type", "text/xml; charset=UTF-8");
  if (runtimeConfig.cacheMaxAgeSeconds) {
    setHeader(event, "Cache-Control", `public, max-age=${runtimeConfig.cacheMaxAgeSeconds}, s-maxage=${runtimeConfig.cacheMaxAgeSeconds}, stale-while-revalidate=3600`);
    const now = /* @__PURE__ */ new Date();
    setHeader(event, "X-Sitemap-Generated", now.toISOString());
    setHeader(event, "X-Sitemap-Cache-Duration", `${runtimeConfig.cacheMaxAgeSeconds}s`);
    const expiryTime = new Date(now.getTime() + runtimeConfig.cacheMaxAgeSeconds * 1e3);
    setHeader(event, "X-Sitemap-Cache-Expires", expiryTime.toISOString());
    const remainingSeconds = Math.floor((expiryTime.getTime() - now.getTime()) / 1e3);
    setHeader(event, "X-Sitemap-Cache-Remaining", `${remainingSeconds}s`);
  } else {
    setHeader(event, "Cache-Control", `no-cache, no-store`);
  }
  event.context._isSitemap = true;
  return xml;
}

const _QytLxl = defineEventHandler(async (e) => {
  const runtimeConfig = useSitemapRuntimeConfig();
  const { sitemaps } = runtimeConfig;
  if ("index" in sitemaps) {
    return sendRedirect(e, withBase("/sitemap_index.xml", useRuntimeConfig().app.baseURL), 302 );
  }
  return createSitemap(e, Object.values(sitemaps)[0], runtimeConfig);
});

const storage = prefixStorage(useStorage(), "i18n");
function cachedFunctionI18n(fn, opts) {
  opts = { maxAge: 1, ...opts };
  const pending = {};
  async function get(key, resolver) {
    const isPending = pending[key];
    if (!isPending) {
      pending[key] = Promise.resolve(resolver());
    }
    try {
      return await pending[key];
    } finally {
      delete pending[key];
    }
  }
  return async (...args) => {
    const key = [opts.name, opts.getKey(...args)].join(":").replace(/:\/$/, ":index");
    const maxAge = opts.maxAge ?? 1;
    const isCacheable = !opts.shouldBypassCache(...args) && maxAge >= 0;
    const cache = isCacheable && await storage.getItemRaw(key);
    if (!cache || cache.ttl < Date.now()) {
      pending[key] = Promise.resolve(fn(...args));
      const value = await get(key, () => fn(...args));
      if (isCacheable) {
        await storage.setItemRaw(key, { ttl: Date.now() + maxAge * 1e3, value, mtime: Date.now() });
      }
      return value;
    }
    return cache.value;
  };
}

const _getMessages = async (locale) => {
  return { [locale]: await getLocaleMessagesMerged(locale, localeLoaders[locale]) };
};
cachedFunctionI18n(_getMessages, {
  name: "messages",
  maxAge: -1 ,
  getKey: (locale) => locale,
  shouldBypassCache: (locale) => !isLocaleCacheable(locale)
});
const getMessages = _getMessages ;
const _getMergedMessages = async (locale, fallbackLocales) => {
  const merged = {};
  try {
    if (fallbackLocales.length > 0) {
      const messages = await Promise.all(fallbackLocales.map(getMessages));
      for (const message2 of messages) {
        deepCopy(message2, merged);
      }
    }
    const message = await getMessages(locale);
    deepCopy(message, merged);
    return merged;
  } catch (e) {
    throw new Error("Failed to merge messages: " + e.message);
  }
};
const getMergedMessages = cachedFunctionI18n(_getMergedMessages, {
  name: "merged-single",
  maxAge: -1 ,
  getKey: (locale, fallbackLocales) => `${locale}-[${[...new Set(fallbackLocales)].sort().join("-")}]`,
  shouldBypassCache: (locale, fallbackLocales) => !isLocaleWithFallbacksCacheable(locale, fallbackLocales)
});
const _getAllMergedMessages = async (locales) => {
  const merged = {};
  try {
    const messages = await Promise.all(locales.map(getMessages));
    for (const message of messages) {
      deepCopy(message, merged);
    }
    return merged;
  } catch (e) {
    throw new Error("Failed to merge messages: " + e.message);
  }
};
cachedFunctionI18n(_getAllMergedMessages, {
  name: "merged-all",
  maxAge: -1 ,
  getKey: (locales) => locales.join("-"),
  shouldBypassCache: (locales) => !locales.every((locale) => isLocaleCacheable(locale))
});

const _messagesHandler = defineEventHandler(async (event) => {
  const locale = getRouterParam(event, "locale");
  if (!locale) {
    throw createError({ status: 400, message: "Locale not specified." });
  }
  const ctx = useI18nContext(event);
  if (ctx.localeConfigs && locale in ctx.localeConfigs === false) {
    throw createError({ status: 404, message: `Locale '${locale}' not found.` });
  }
  const messages = await getMergedMessages(locale, ctx.localeConfigs?.[locale]?.fallbacks ?? []);
  deepCopy(messages, ctx.messages);
  return ctx.messages;
});
const _cachedMessageLoader = defineCachedFunction(_messagesHandler, {
  name: "i18n:messages-internal",
  maxAge: -1 ,
  getKey: (event) => getRouterParam(event, "locale") ?? "null",
  shouldBypassCache(event) {
    const locale = getRouterParam(event, "locale");
    if (locale == null) return false;
    return !useI18nContext(event).localeConfigs?.[locale]?.cacheable;
  }
});
defineCachedEventHandler(_cachedMessageLoader, {
  name: "i18n:messages",
  maxAge: -1 ,
  swr: false,
  getKey: (event) => getRouterParam(event, "locale") ?? "null"
});
const _VXDdDX = _messagesHandler ;

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
};

function createSSRContext(event) {
  const ssrContext = {
    url: event.path,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || (false),
    head: createHead(unheadOptions),
    error: false,
    nuxt: void 0,
    /* NuxtApp */
    payload: {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set()
  };
  return ssrContext;
}
function setSSRError(ssrContext, error) {
  ssrContext.error = true;
  ssrContext.payload = { error };
  ssrContext.url = error.url;
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('file://D:/GitHub/lipeaks_fc_games/.nuxt//dist/server/server.mjs').then((r) => r.default || r);
const getClientManifest = () => import('file://D:/GitHub/lipeaks_fc_games/.nuxt//dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString: renderToString$1,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
      const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
      const appTemplate = APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG;
      const loaderTemplate = r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "";
      return appTemplate + loaderTemplate;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function getRenderer(ssrContext) {
  return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
function getServerComponentHTML(body) {
  const match = body.match(ROOT_NODE_REGEX);
  return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, id, slot] = match;
      if (!slot || clientUid !== id) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const ISLAND_SUFFIX_RE = /\.json(\?.*)?$/;
const _SxA8c9 = defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();
  setResponseHeaders(event, {
    "content-type": "application/json;charset=utf-8",
    "x-powered-by": "Nuxt"
  });
  const islandContext = await getIslandContext(event);
  const ssrContext = {
    ...createSSRContext(event),
    islandContext,
    noSSR: false,
    url: islandContext.url
  };
  const renderer = await getSSRRenderer();
  const renderResult = await renderer.renderToString(ssrContext).catch(async (error) => {
    await ssrContext.nuxt?.hooks.callHook("app:error", error);
    throw error;
  });
  const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult });
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  {
    const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
    const link = [];
    for (const resource of Object.values(styles)) {
      if ("inline" in getQuery(resource.file)) {
        continue;
      }
      if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      ssrContext.head.push({ link }, { mode: "server" });
    }
  }
  const islandHead = {};
  for (const entry of ssrContext.head.entries.values()) {
    for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
      const currentValue = islandHead[key];
      if (Array.isArray(currentValue)) {
        currentValue.push(...value);
      }
      islandHead[key] = value;
    }
  }
  const islandResponse = {
    id: islandContext.id,
    head: islandHead,
    html: getServerComponentHTML(renderResult.html),
    components: getClientIslandResponse(ssrContext),
    slots: getSlotIslandResponse(ssrContext)
  };
  await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
  return islandResponse;
});
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr$1(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}

const _lazy_FAegqR = () => Promise.resolve().then(function () { return renderer$1; });
const _lazy_cyM0Sz = () => Promise.resolve().then(function () { return sitemap_index_xml$1; });
const _lazy_EkG4re = () => Promise.resolve().then(function () { return _sitemap__xml$1; });

const handlers = [
  { route: '', handler: _enxOxg, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_FAegqR, lazy: true, middleware: false, method: undefined },
  { route: '', handler: _izjMFr, lazy: false, middleware: true, method: undefined },
  { route: '/__site-config__/debug.json', handler: _PVDCbf, lazy: false, middleware: false, method: undefined },
  { route: '/robots.txt', handler: _vYkeCO, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _CGKcst, lazy: false, middleware: true, method: undefined },
  { route: '/__robots__/debug.json', handler: _dwoqYh, lazy: false, middleware: false, method: undefined },
  { route: '/__robots__/debug-path.json', handler: _bbyk2i, lazy: false, middleware: false, method: undefined },
  { route: '/sitemap_index.xml', handler: _lazy_cyM0Sz, lazy: true, middleware: false, method: undefined },
  { route: '/__sitemap__/**:sitemap', handler: _lazy_EkG4re, lazy: true, middleware: false, method: undefined },
  { route: '/__sitemap__/debug.json', handler: _H25AEE, lazy: false, middleware: false, method: undefined },
  { route: '/__sitemap__/**:sitemap', handler: _lazy_EkG4re, lazy: true, middleware: true, method: undefined },
  { route: '/__sitemap__/style.xsl', handler: _fag6cl, lazy: false, middleware: false, method: undefined },
  { route: '/sitemap.xml', handler: _QytLxl, lazy: false, middleware: false, method: undefined },
  { route: '/_i18n/:locale/messages.json', handler: _VXDdDX, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/api/**', handler: _lazy_FAegqR, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_FAegqR, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineNitroPlugin(def) {
  return def;
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = { "appName": "Nuxt", "statusCode": 500, "statusMessage": "Server error", "description": "An error occurred in the application and the page could not be served.", "stack": "" };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + escapeHtml(messages.statusCode) + " - " + escapeHtml(messages.statusMessage || "Internal Server Error") + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script><style>*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.absolute{position:absolute}.top-6{top:1.5rem}.z-10{z-index:10}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-8{margin-bottom:2rem}.inline-block{display:inline-block}.h-auto{height:auto}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.overflow-y-auto{overflow-y:auto}.border{border-width:1px}.border-b-0{border-bottom-width:0}.border-black\\/5{border-color:#0000000d}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.bg-gray-50\\/50{background-color:#f5f5f580}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-12{padding-top:3rem}.text-6xl{font-size:3.75rem;line-height:1}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.hover\\:text-\\[\\#00DC82\\]:hover{--un-text-opacity:1;color:rgb(0 220 130/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.hover\\:underline:hover{text-decoration-line:underline}.underline-offset-3{text-underline-offset:3px}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:border-white\\/10{border-color:#ffffff1a}.dark\\:bg-\\[\\#020420\\]{--un-bg-opacity:1;background-color:rgb(2 4 32/var(--un-bg-opacity))}.dark\\:bg-white\\/5{background-color:#ffffff0d}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:right-6{right:1.5rem}.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}.sm\\:text-8xl{font-size:6rem;line-height:1}}</style></head><body class="antialiased bg-white dark:bg-[#020420] dark:text-white flex flex-col font-sans min-h-screen pt-12 px-10 text-black"><h1 class="font-medium mb-4 sm:text-8xl text-6xl">` + escapeHtml(messages.statusCode) + '</h1><p class="font-light leading-tight mb-8 sm:text-2xl text-xl">' + escapeHtml(messages.description) + '</p><a href="https://nuxt.com/docs/getting-started/error-handling?utm_source=nuxt-error-dev-page" target="_blank" class="absolute font-medium hover:text-[#00DC82] hover:underline inline-block mx-auto sm:right-6 text-sm top-6 underline-offset-3">Customize this page</a><div class="bg-gray-50/50 border border-b-0 border-black/5 dark:bg-white/5 dark:border-white/10 flex-1 h-auto overflow-y-auto rounded-t-md"><div class="font-light leading-tight p-8 text-xl z-10">' + escapeHtml(messages.stack) + "</div></div></body></html>";
};

const errorDev = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

var app$3 = {
	title: "Lipeaks",
	subtitle: "Classic Gaming Platform",
	loading: "Loading...",
	error: "Error",
	retry: "Retry",
	close: "Close",
	confirm: "Confirm",
	cancel: "Cancel"
};
var nav$3 = {
	home: "Home",
	search: "Search",
	searchPlaceholder: "Search games...",
	searchButton: "Search",
	tagline: "Classic Games, Endless Fun"
};
var footer$3 = {
	aboutUs: "About Us",
	aboutUsDesc: "Lipeaks Game Paradise is a nostalgic retro game online platform, allowing you to relive the joy of classic games.",
	quickLinks: "Quick Links",
	contactUs: "Contact Us",
	email: "Email: contact[at]fcgame.com",
	siteStats: "Site Statistics",
	copyright: "© {year} Lipeaks. All rights reserved.",
	licensedUnder: "Licensed under the {licenseName}.",
	sourceCode: "Source Code"
};
var stats$1 = {
	visitorStatistics: "Visitor Statistics",
	totalVisitors: "Total Visitors",
	todayVisitors: "Today's Visitors",
	yesterdayVisitors: "Yesterday's Visitors",
	daysOnline: "Days Online",
	welcomeNewVisitor: "Welcome new friend! Thanks for visiting 🎮",
	pageSubtitle: "Understand website traffic and technical information",
	multiPlatform: "Multi-Platform",
	platformSupport: "Platform Support",
	freeForever: "Free Forever",
	serviceType: "Service Type",
	techInfo: "Technology Stack",
	frontendFramework: "Frontend Framework",
	styling: "Styling System",
	progressiveWebApp: "Progressive Web App",
	buildTool: "Build Tool",
	privacyTitle: "Privacy Protection",
	localStorage: "Local Storage",
	localStorageDesc: "Visit data is only stored locally in your browser and never uploaded to servers",
	noCookies: "No Cookies",
	noCookiesDesc: "We don't use any tracking cookies, fully protecting your privacy",
	anonymousData: "Anonymous Statistics",
	anonymousDataDesc: "All statistics are anonymous, no personal information is collected",
	developerOptions: "Developer Options",
	resetStats: "Reset Statistics",
	showRawData: "Show Raw Data",
	hideRawData: "Hide Raw Data",
	rawDataTitle: "Raw Statistics Data"
};
var categories$3 = {
	fc: {
		name: "FC Games",
		description: "Classic Nintendo Entertainment System games collection, including action, shooting, RPG and other classic games",
		action: {
			name: "FC Action",
			description: "Platform jumping, side-scrolling shooting and other skill-based FC games"
		},
		stg: {
			name: "FC Shooting",
			description: "Flying shooting and tank shooting FC games"
		},
		rpg: {
			name: "FC RPG",
			description: "Role-playing FC games with adventure and storylines"
		},
		puzzle: {
			name: "FC Puzzle",
			description: "FC puzzle games that require thinking and problem-solving"
		},
		spg: {
			name: "FC Sports",
			description: "FC sports games including football, basketball, etc."
		},
		tab: {
			name: "FC Table",
			description: "FC board and table games"
		},
		etc: {
			name: "FC Others",
			description: "Other types of FC games"
		}
	},
	arcade: {
		name: "Arcade Games",
		description: "Classic arcade games collection, including fighting, shooting, action and other classic arcade games",
		fighting: {
			name: "Arcade Fighting",
			description: "Classic arcade fighting games like King of Fighters, Street Fighter series"
		},
		shooting: {
			name: "Arcade Shooting",
			description: "Arcade shooting games including flight shooting and light gun shooting"
		},
		action: {
			name: "Arcade Action",
			description: "Arcade action adventure games like Metal Slug series"
		},
		puzzle: {
			name: "Arcade Puzzle",
			description: "Arcade puzzle games like Tetris, Puzzle Bobble, etc."
		},
		racing: {
			name: "Arcade Racing",
			description: "Arcade racing and car games"
		},
		sports: {
			name: "Arcade Sports",
			description: "Arcade sports and athletic games"
		},
		etc: {
			name: "Arcade Others",
			description: "Other types of arcade games"
		}
	}
};
var home$3 = {
	title: "Lipeaks Game Paradise",
	heroSubtitle: "Relive the classics and enjoy gaming fun! Explore hundreds of classic games and start your gaming journey anytime, anywhere.",
	totalGames: "Total Games",
	categories: "Categories",
	totalPlays: "Total Plays",
	startPlaying: "Start Playing",
	gameCategories: "Game Categories",
	categoriesSubtitle: "Choose your favorite game types and discover more exciting content",
	categoryDefaultDesc: "Carefully selected quality games for the best gaming experience",
	games: "games",
	playNow: "Play Now",
	recommendedGames: "Recommended Games",
	recommendedGamesSubtitle: "Carefully selected classic games for the best gaming experience",
	noDescription: "No description available",
	plays: "plays",
	loadingRecommendedGames: "Loading recommended games...",
	noRecommendedGames: "No recommended games available",
	features: "Platform Features",
	instantPlay: "Instant Play",
	instantPlayDesc: "No download required, play classic games directly in your browser",
	saveProgress: "Save Progress",
	saveProgressDesc: "Automatically save game progress, continue your adventure anytime",
	multiLanguage: "Multi-language Support",
	multiLanguageDesc: "Support for Chinese, English, Japanese, Arabic and more languages",
	mobileReady: "Mobile Ready",
	mobileReadyDesc: "Perfect adaptation for mobile and tablet, enjoy gaming fun anywhere"
};
var game$3 = {
	loading: "Loading game...",
	playCount: "Played {count} times",
	category: "Category",
	author: "Author",
	size: "Size",
	version: "Version",
	region: "Region",
	description: "Game Description",
	gameLoaded: "Game loaded: {name}",
	gameStarted: "Game started: {name}",
	gamePaused: "Game paused: {name}",
	gameResumed: "Game resumed: {name}",
	gameError: "Game error occurred",
	readyToPlay: "Ready to Play",
	rating: "Rating",
	popularBadge: "Popular Game",
	legendaryBadge: "Legendary Classic",
	playGame: "Play Game",
	running: "Running",
	ready: "Ready",
	statistics: "Game Statistics",
	totalPlays: "Total Plays",
	playTime: "Play Time",
	popularity: "Popularity Rank",
	completionRate: "Completion Rate",
	controls: "Controls",
	movement: "Movement",
	buttonA: "A Button",
	buttonB: "B Button",
	start: "Start",
	select: "Select",
	coin: "Coin",
	button1: "Button 1",
	button2: "Button 2",
	button3: "Button 3",
	button4: "Button 4",
	loadingTip: "Tip: If the screen is not loading, please click on the emulator screen with your mouse.",
	noDescription: "No description available"
};
var category$3 = {
	gamesCount: "{count} games total",
	noGames: "No games in this category",
	loadingGames: "Loading game data...",
	categoryBadge: "Game Category",
	defaultDescription: "Carefully selected quality games for the best gaming experience",
	totalGames: "Total Games",
	popularGames: "Popular Games",
	totalPlayTime: "Total Play Time",
	searchInCategory: "Search in Category",
	searchPlaceholder: "Search game names, authors...",
	sortBy: "Sort By",
	sortByName: "Sort by Name",
	sortByPopularity: "Sort by Popularity",
	sortByNewest: "Sort by Newest",
	gridView: "Grid View",
	listView: "List View",
	gamesInCategory: "Category Games",
	showingResults: "Showing {count} / {total} games",
	totalGamesAdded: "Total {total} games",
	hotBadge: "Hot",
	topBadge: "Top",
	noDescription: "No description available",
	plays: "plays",
	playNow: "Play Now",
	moreInfo: "More Info",
	noSearchResults: "No games found",
	tryDifferentSearch: "Please try different keywords",
	noGamesDescription: "No games available in this category yet, please check other categories",
	clearSearch: "Clear Search",
	backToHome: "Back to Home"
};
var pagination$1 = {
	showing: "Showing {start}-{end} of {total}",
	perPage: "per page",
	firstPage: "First page",
	lastPage: "Last page",
	prevPage: "Previous page",
	nextPage: "Next page",
	prev: "Prev",
	next: "Next",
	goToPage: "Go to page",
	pageNumber: "Page number",
	go: "Go"
};
var search$3 = {
	resultsTitle: "Search Results: \"{query}\"",
	resultsCount: "Found {count} results",
	noResults: "No games found related to \"{query}\"",
	noResultsHelp: "Please try other keywords or browse",
	allGames: "all games",
	searching: "Searching..."
};
var notFound$3 = {
	title: "Page Not Found",
	message: "Sorry, the page you are looking for does not exist.",
	backHome: "Back to Home"
};
var emulator$3 = {
	initializing: "Initializing emulator...",
	loadingGame: "Loading game...",
	gameLoaded: "Game loaded successfully",
	gameError: "Failed to load game",
	pause: "Pause",
	resume: "Resume",
	restart: "Restart",
	fullscreen: "Fullscreen",
	exitFullscreen: "Exit Fullscreen",
	save: "Save",
	load: "Load",
	keyHelp: "Controls",
	controls: "Controls",
	settings: "Settings",
	volume: "Volume",
	mute: "Mute",
	unmute: "Unmute",
	pauseTooltip: "Pause game",
	resumeTooltip: "Resume game",
	restartTooltip: "Restart game",
	fullscreenTooltip: "Enter fullscreen",
	exitFullscreenTooltip: "Exit fullscreen",
	saveTooltip: "Save game state",
	loadTooltip: "Load game state",
	keyHelpTooltip: "Show/hide controls help",
	controlsTooltip: "Show/hide control mappings",
	settingsTooltip: "Open emulator settings",
	settingsOpened: "Emulator settings menu opened",
	settingsClosed: "Emulator settings menu closed",
	settingsNotAvailable: "Emulator settings not available",
	emulatorNotReady: "Emulator not ready",
	settingsError: "Error opening settings",
	muteTooltip: "Mute",
	unmuteTooltip: "Unmute"
};
var controls$3 = {
	controls: "Controls",
	keyMappings: "Key Mappings",
	up: "Up",
	down: "Down",
	left: "Left",
	right: "Right",
	buttonA: "A",
	buttonAA: "AA",
	buttonB: "B",
	buttonBB: "BB",
	start: "Start",
	select: "Select"
};
var errors$3 = {
	fetchCategories: "Failed to fetch categories",
	fetchGames: "Failed to fetch games for category {category}",
	fetchGameById: "Failed to fetch game with id {id}",
	searchError: "Search error occurred",
	emulatorInit: "Failed to initialize emulator",
	gameLoad: "Failed to load game",
	networkError: "Network error occurred",
	unknownError: "Unknown error occurred"
};
var language$3 = {
	"switch": "Language",
	current: "Current language: {language}"
};
var routes$3 = {
	home: "Home - Lipeaks Game Paradise",
	game: "Game - Lipeaks Game Paradise",
	category: "Category - Lipeaks Game Paradise",
	search: "Search Results - Lipeaks Game Paradise",
	searchWithQuery: "Search \"{query}\" - Lipeaks Game Paradise",
	stats: "Site Statistics - Lipeaks Game Paradise",
	notFound: "Page Not Found - Lipeaks Game Paradise"
};
var games$3 = {
	noDescription: "No description available",
	unknownAuthor: "Unknown",
	descriptionTemplate: "{gameName} - Classic {gameType} {platform} Game",
	genericDescription: "Classic {platform} Game",
	seoDescription: "{gameName} is a classic {platform} game created by {author}, played {playCount} times.",
	platforms: {
		fc: "NES",
		arcade: "Arcade"
	},
	gameTypes: {
		"动作": "Action",
		"射击": "Shooting",
		"角色扮演": "RPG",
		"益智": "Puzzle",
		"体育": "Sports",
		"桌游": "Board Game",
		"格斗": "Fighting",
		"竞速": "Racing",
		"动作射击": "Action Shooting",
		"模拟射击": "Simulation Shooting",
		"动作冒险": "Action Adventure",
		"策略": "Strategy",
		"运动": "Sports",
		"竞赛": "Racing"
	},
	nameRules: {
		directMappings: {
			"恶魔城": "Castlevania",
			"魂斗罗": "Contra",
			"超级马里奥": "Super Mario",
			"塞尔达传说": "The Legend of Zelda",
			"拳皇": "The King of Fighters",
			"街头霸王": "Street Fighter",
			"合金弹头": "Metal Slug",
			"坦克大战": "Battle City",
			"双截龙": "Double Dragon",
			"忍者神龟": "Teenage Mutant Ninja Turtles",
			"洛克人": "Mega Man",
			"最终幻想": "Final Fantasy",
			"勇者斗恶龙": "Dragon Quest"
		},
		versionMarkers: {
			"(日版)": "(Japanese)",
			"(美版)": "(US)",
			"(欧版)": "(European)",
			"(亚洲版)": "(Asian)",
			"[汉化]": "[Chinese]",
			"[修改]": "[Modified]"
		},
		gameSeries: {
			"2": "2",
			"3": "3",
			"4": "4",
			II: "II",
			III: "III",
			IV: "IV"
		}
	}
};
const enUS = {
	app: app$3,
	nav: nav$3,
	footer: footer$3,
	stats: stats$1,
	categories: categories$3,
	home: home$3,
	game: game$3,
	category: category$3,
	pagination: pagination$1,
	search: search$3,
	notFound: notFound$3,
	emulator: emulator$3,
	controls: controls$3,
	errors: errors$3,
	language: language$3,
	routes: routes$3,
	games: games$3
};

const enUS$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  app: app$3,
  categories: categories$3,
  category: category$3,
  controls: controls$3,
  default: enUS,
  emulator: emulator$3,
  errors: errors$3,
  footer: footer$3,
  game: game$3,
  games: games$3,
  home: home$3,
  language: language$3,
  nav: nav$3,
  notFound: notFound$3,
  pagination: pagination$1,
  routes: routes$3,
  search: search$3,
  stats: stats$1
}, Symbol.toStringTag, { value: 'Module' }));

var app$2 = {
	title: "Lipeaks",
	subtitle: "经典游戏平台",
	loading: "加载中...",
	error: "错误",
	retry: "重试",
	close: "关闭",
	confirm: "确认",
	cancel: "取消"
};
var nav$2 = {
	home: "首页",
	search: "搜索",
	searchPlaceholder: "搜索游戏...",
	searchButton: "搜索",
	tagline: "经典游戏，无限乐趣"
};
var footer$2 = {
	aboutUs: "关于我们",
	aboutUsDesc: "Lipeaks游戏乐园是一个怀旧复古游戏在线平台，让您重温经典游戏的乐趣。",
	quickLinks: "快速链接",
	contactUs: "联系我们",
	email: "邮箱: contact[at]fcgame.com",
	siteStats: "网站统计",
	copyright: "© {year} Lipeaks. 保留所有权利。",
	licensedUnder: "根据 {licenseName} 许可证授权。",
	sourceCode: "源代码"
};
var stats = {
	visitorStatistics: "访客统计",
	totalVisitors: "总访客",
	todayVisitors: "今日访客",
	yesterdayVisitors: "昨日访客",
	daysOnline: "运行天数",
	welcomeNewVisitor: "欢迎新朋友！感谢您的访问 🎮",
	pageSubtitle: "了解网站访问情况和技术信息",
	multiPlatform: "多平台",
	platformSupport: "平台支持",
	freeForever: "永久免费",
	serviceType: "服务类型",
	techInfo: "技术栈",
	frontendFramework: "前端框架",
	styling: "样式系统",
	progressiveWebApp: "渐进式应用",
	buildTool: "构建工具",
	privacyTitle: "隐私保护",
	localStorage: "本地存储",
	localStorageDesc: "访问数据仅存储在您的浏览器本地，不会上传到服务器",
	noCookies: "无Cookie",
	noCookiesDesc: "我们不使用任何追踪Cookie，完全保护您的隐私",
	anonymousData: "匿名统计",
	anonymousDataDesc: "所有统计数据都是匿名的，不收集任何个人信息",
	developerOptions: "开发者选项",
	resetStats: "重置统计",
	showRawData: "显示原始数据",
	hideRawData: "隐藏原始数据",
	rawDataTitle: "原始统计数据"
};
var categories$2 = {
	fc: {
		name: "FC游戏",
		description: "经典红白机游戏合集，包含动作、射击、角色扮演等各类经典游戏",
		action: {
			name: "FC动作",
			description: "包含平台跳跃、横版射击等需要操作技巧的FC游戏"
		},
		stg: {
			name: "FC射击",
			description: "以飞行射击、坦克射击为主的FC射击游戏"
		},
		rpg: {
			name: "FC角色",
			description: "角色扮演类FC游戏，包含冒险和故事情节"
		},
		puzzle: {
			name: "FC益智",
			description: "需要思考和解谜的FC益智游戏"
		},
		spg: {
			name: "FC体育",
			description: "体育运动类FC游戏，包含足球、篮球等"
		},
		tab: {
			name: "FC桌游",
			description: "棋牌、桌面类FC游戏"
		},
		etc: {
			name: "FC其他",
			description: "其他类型的FC游戏"
		}
	},
	arcade: {
		name: "街机游戏",
		description: "经典街机游戏合集，包含格斗、射击、动作等各类经典街机游戏",
		fighting: {
			name: "街机格斗",
			description: "经典街机格斗游戏，如拳皇、街霸系列"
		},
		shooting: {
			name: "街机射击",
			description: "街机射击游戏，包含飞行射击和光线枪射击"
		},
		action: {
			name: "街机动作",
			description: "街机动作冒险游戏，如合金弹头系列"
		},
		puzzle: {
			name: "街机益智",
			description: "街机益智游戏，如俄罗斯方块、泡泡龙等"
		},
		racing: {
			name: "街机竞速",
			description: "街机赛车竞速游戏"
		},
		sports: {
			name: "街机体育",
			description: "街机体育运动游戏"
		},
		etc: {
			name: "街机其他",
			description: "其他类型的街机游戏"
		}
	}
};
var home$2 = {
	title: "Lipeaks游戏乐园",
	heroSubtitle: "重温经典，畅享游戏乐趣！探索数百款经典游戏，随时随地开始你的游戏之旅。",
	totalGames: "游戏总数",
	categories: "分类数量",
	totalPlays: "总游玩次数",
	startPlaying: "开始游戏",
	gameCategories: "游戏分类",
	categoriesSubtitle: "选择你喜欢的游戏类型，发现更多精彩内容",
	categoryDefaultDesc: "精选优质游戏，带给你最佳的游戏体验",
	games: "款游戏",
	playNow: "立即游玩",
	recommendedGames: "推荐游戏",
	recommendedGamesSubtitle: "精选经典游戏，为您带来最佳游戏体验",
	noDescription: "暂无游戏介绍",
	plays: "次游玩",
	loadingRecommendedGames: "正在加载推荐游戏...",
	noRecommendedGames: "暂无推荐游戏",
	features: "平台特色",
	instantPlay: "即点即玩",
	instantPlayDesc: "无需下载安装，打开浏览器即可畅玩经典游戏",
	saveProgress: "进度保存",
	saveProgressDesc: "自动保存游戏进度，随时继续你的游戏冒险",
	multiLanguage: "多语言支持",
	multiLanguageDesc: "支持中文、英文、日文、阿拉伯文等多种语言",
	mobileReady: "移动端适配",
	mobileReadyDesc: "完美适配手机和平板，随时随地享受游戏乐趣"
};
var game$2 = {
	loading: "加载中...",
	playCount: "已玩 {count} 次",
	category: "分类",
	author: "作者",
	size: "大小",
	version: "版本",
	region: "地区",
	description: "游戏介绍",
	gameLoaded: "游戏已加载：{name}",
	gameStarted: "游戏已开始：{name}",
	gamePaused: "游戏已暂停：{name}",
	gameResumed: "游戏已恢复：{name}",
	gameError: "游戏发生错误",
	readyToPlay: "准备游玩",
	rating: "评分",
	popularBadge: "热门游戏",
	legendaryBadge: "传奇经典",
	playGame: "开始游戏",
	running: "运行中",
	ready: "就绪",
	statistics: "游戏统计",
	totalPlays: "总游玩次数",
	playTime: "游玩时长",
	popularity: "人气排名",
	completionRate: "完成度",
	controls: "操作说明",
	movement: "移动",
	buttonA: "A键",
	buttonB: "B键",
	start: "开始",
	select: "选择",
	coin: "投币",
	button1: "按钮1",
	button2: "按钮2",
	button3: "按钮3",
	button4: "按钮4",
	loadingTip: "小提示：如果画面没有loading，请用鼠标点击一下模拟器屏幕。",
	noDescription: "暂无游戏介绍"
};
var category$2 = {
	gamesCount: "共 {count} 款游戏",
	noGames: "该分类下暂无游戏",
	loadingGames: "正在加载游戏数据...",
	categoryBadge: "游戏分类",
	defaultDescription: "精选优质游戏，带给你最佳的游戏体验",
	totalGames: "游戏总数",
	popularGames: "热门游戏",
	totalPlayTime: "总游玩时长",
	searchInCategory: "在分类中搜索",
	searchPlaceholder: "搜索游戏名称、作者...",
	sortBy: "排序方式",
	sortByName: "按名称排序",
	sortByPopularity: "按热度排序",
	sortByNewest: "按最新排序",
	gridView: "网格视图",
	listView: "列表视图",
	gamesInCategory: "分类游戏",
	showingResults: "显示 {count} / {total} 款游戏",
	totalGamesAdded: "总计 {total} 个游戏",
	hotBadge: "热门",
	topBadge: "精品",
	noDescription: "暂无游戏介绍",
	plays: "次游玩",
	playNow: "立即游玩",
	moreInfo: "详情",
	noSearchResults: "未找到相关游戏",
	tryDifferentSearch: "请尝试使用不同的关键词搜索",
	noGamesDescription: "该分类下暂时没有游戏，请查看其他分类",
	clearSearch: "清除搜索",
	backToHome: "返回首页"
};
var pagination = {
	showing: "显示第 {start}-{end} 个，共 {total} 个",
	perPage: "个/页",
	firstPage: "首页",
	lastPage: "末页",
	prevPage: "上一页",
	nextPage: "下一页",
	prev: "上一页",
	next: "下一页",
	goToPage: "跳转到",
	pageNumber: "页码",
	go: "跳转"
};
var search$2 = {
	resultsTitle: "搜索结果: \"{query}\"",
	resultsCount: "共找到 {count} 个结果",
	noResults: "未找到与 \"{query}\" 相关的游戏",
	noResultsHelp: "请尝试其他关键词或浏览",
	allGames: "所有游戏",
	searching: "正在搜索..."
};
var notFound$2 = {
	title: "页面未找到",
	message: "抱歉，您访问的页面不存在。",
	backHome: "返回首页"
};
var emulator$2 = {
	initializing: "正在初始化模拟器...",
	loadingGame: "正在加载游戏...",
	gameLoaded: "游戏加载成功",
	gameError: "游戏加载失败",
	pause: "暂停",
	resume: "继续",
	restart: "重启",
	fullscreen: "全屏",
	exitFullscreen: "退出全屏",
	save: "保存",
	load: "加载",
	keyHelp: "按键",
	controls: "控制器",
	settings: "设置",
	volume: "音量",
	mute: "静音",
	unmute: "取消静音",
	pauseTooltip: "暂停游戏",
	resumeTooltip: "继续游戏",
	restartTooltip: "重新开始游戏",
	fullscreenTooltip: "进入全屏",
	exitFullscreenTooltip: "退出全屏",
	saveTooltip: "保存游戏状态",
	loadTooltip: "加载游戏状态",
	keyHelpTooltip: "显示/隐藏按键说明",
	controlsTooltip: "显示/隐藏控制器映射",
	settingsTooltip: "打开模拟器设置",
	settingsOpened: "模拟器设置菜单已打开",
	settingsClosed: "模拟器设置菜单已关闭",
	settingsNotAvailable: "模拟器设置不可用",
	emulatorNotReady: "模拟器未就绪",
	settingsError: "打开设置时出错",
	muteTooltip: "静音",
	unmuteTooltip: "取消静音"
};
var controls$2 = {
	controls: "控制器",
	keyMappings: "按键映射",
	up: "上",
	down: "下",
	left: "左",
	right: "右",
	buttonA: "A",
	buttonAA: "AA",
	buttonB: "B",
	buttonBB: "BB",
	start: "Start",
	select: "Select"
};
var errors$2 = {
	fetchCategories: "获取分类失败",
	fetchGames: "获取分类 {category} 的游戏失败",
	fetchGameById: "获取游戏 {id} 失败",
	searchError: "搜索错误",
	emulatorInit: "模拟器初始化失败",
	gameLoad: "游戏加载失败",
	networkError: "网络错误",
	unknownError: "未知错误"
};
var language$2 = {
	"switch": "语言",
	current: "当前语言：{language}"
};
var routes$2 = {
	home: "首页 - Lipeaks游戏乐园",
	game: "游戏 - Lipeaks游戏乐园",
	category: "分类 - Lipeaks游戏乐园",
	search: "搜索结果 - Lipeaks游戏乐园",
	searchWithQuery: "搜索\"{query}\" - Lipeaks游戏乐园",
	stats: "网站统计 - Lipeaks游戏乐园",
	notFound: "页面未找到 - Lipeaks游戏乐园"
};
var games$2 = {
	noDescription: "暂无描述",
	unknownAuthor: "未知",
	descriptionTemplate: "{gameName} - {gameType}{platform}游戏",
	genericDescription: "经典{platform}游戏",
	seoDescription: "{gameName}是一款经典的{platform}游戏，由{author}制作，已被玩过{playCount}次。",
	platforms: {
		fc: "FC",
		arcade: "街机"
	},
	gameTypes: {
		"动作": "动作",
		"射击": "射击",
		"角色扮演": "角色扮演",
		"益智": "益智",
		"体育": "体育",
		"桌游": "桌游",
		"格斗": "格斗",
		"竞速": "竞速",
		"动作射击": "动作射击",
		"模拟射击": "模拟射击",
		"动作冒险": "动作冒险",
		"策略": "策略",
		"运动": "运动",
		"竞赛": "竞赛"
	},
	nameRules: {
		directMappings: {
			"恶魔城": "恶魔城",
			"魂斗罗": "魂斗罗",
			"超级马里奥": "超级马里奥",
			"塞尔达传说": "塞尔达传说",
			"拳皇": "拳皇",
			"街头霸王": "街头霸王",
			"合金弹头": "合金弹头"
		},
		versionMarkers: {
			"(日版)": "(日版)",
			"(美版)": "(美版)",
			"(欧版)": "(欧版)",
			"(亚洲版)": "(亚洲版)",
			"[汉化]": "[汉化]",
			"[修改]": "[修改]"
		},
		gameSeries: {
			"2": "2",
			"3": "3",
			"4": "4",
			II: "II",
			III: "III",
			IV: "IV"
		}
	}
};
const zhCN = {
	app: app$2,
	nav: nav$2,
	footer: footer$2,
	stats: stats,
	categories: categories$2,
	home: home$2,
	game: game$2,
	category: category$2,
	pagination: pagination,
	search: search$2,
	notFound: notFound$2,
	emulator: emulator$2,
	controls: controls$2,
	errors: errors$2,
	language: language$2,
	routes: routes$2,
	games: games$2
};

const zhCN$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  app: app$2,
  categories: categories$2,
  category: category$2,
  controls: controls$2,
  default: zhCN,
  emulator: emulator$2,
  errors: errors$2,
  footer: footer$2,
  game: game$2,
  games: games$2,
  home: home$2,
  language: language$2,
  nav: nav$2,
  notFound: notFound$2,
  pagination: pagination,
  routes: routes$2,
  search: search$2,
  stats: stats
}, Symbol.toStringTag, { value: 'Module' }));

var app$1 = {
	title: "Lipeaks",
	subtitle: "クラシックゲームプラットフォーム",
	loading: "読み込み中...",
	error: "エラー",
	retry: "再試行",
	close: "閉じる",
	confirm: "確認",
	cancel: "キャンセル"
};
var nav$1 = {
	home: "ホーム",
	search: "検索",
	searchPlaceholder: "ゲームを検索...",
	searchButton: "検索"
};
var footer$1 = {
	aboutUs: "私たちについて",
	aboutUsDesc: "Lipeaksゲームパラダイスは、懐かしいレトロゲームのオンラインプラットフォームで、クラシックゲームの楽しさを再体験できます。",
	quickLinks: "クイックリンク",
	contactUs: "お問い合わせ",
	email: "メール: contact[at]fcgame.com",
	copyright: "© {year} Lipeaks. 全著作権所有。",
	licensedUnder: "{licenseName} の下でライセンスされています。",
	sourceCode: "ソースコード"
};
var home$1 = {
	title: "Lipeaksゲームパラダイス",
	gameCategories: "ゲームカテゴリ",
	recommendedGames: "おすすめゲーム",
	loadingRecommendedGames: "おすすめゲームを読み込み中...",
	noRecommendedGames: "おすすめゲームがありません"
};
var game$1 = {
	loading: "読み込み中...",
	playCount: "{count}回プレイ済み",
	category: "カテゴリ",
	author: "作者",
	size: "サイズ",
	version: "バージョン",
	region: "地域",
	description: "ゲームの説明",
	gameLoaded: "ゲームがロードされました: {name}",
	gameStarted: "ゲームが開始されました: {name}",
	gamePaused: "ゲームが一時停止されました: {name}",
	gameResumed: "ゲームが再開されました: {name}",
	gameError: "ゲームエラーが発生しました",
	controls: "操作説明",
	movement: "移動",
	buttonA: "Aボタン",
	buttonB: "Bボタン",
	start: "スタート",
	select: "セレクト",
	coin: "コイン",
	button1: "ボタン1",
	button2: "ボタン2",
	button3: "ボタン3",
	button4: "ボタン4",
	loadingTip: "ヒント：画面が読み込まれない場合は、マウスでエミュレーター画面をクリックしてください。"
};
var category$1 = {
	gamesCount: "合計{count}ゲーム",
	noGames: "このカテゴリにはゲームがありません",
	loadingGames: "ゲームデータを読み込み中..."
};
var search$1 = {
	resultsTitle: "検索結果: \"{query}\"",
	resultsCount: "{count}件の結果が見つかりました",
	noResults: "\"{query}\"に関連するゲームが見つかりませんでした",
	noResultsHelp: "他のキーワードを試すか、",
	allGames: "すべてのゲーム",
	searching: "検索中..."
};
var notFound$1 = {
	title: "ページが見つかりません",
	message: "申し訳ございませんが、お探しのページは存在しません。",
	backHome: "ホームに戻る"
};
var emulator$1 = {
	initializing: "エミュレータを初期化中...",
	loadingGame: "ゲームを読み込み中...",
	gameLoaded: "ゲームの読み込みが完了しました",
	gameError: "ゲームの読み込みに失敗しました",
	pause: "一時停止",
	resume: "再開",
	restart: "再起動",
	fullscreen: "フルスクリーン",
	exitFullscreen: "フルスクリーン終了",
	save: "保存",
	load: "読み込み",
	keyHelp: "操作方法",
	controls: "コントロール",
	settings: "設定",
	volume: "音量",
	mute: "ミュート",
	unmute: "ミュート解除",
	pauseTooltip: "ゲームを一時停止",
	resumeTooltip: "ゲームを再開",
	restartTooltip: "ゲームを再起動",
	fullscreenTooltip: "フルスクリーンに入る",
	exitFullscreenTooltip: "フルスクリーンを終了",
	saveTooltip: "ゲーム状態を保存",
	loadTooltip: "ゲーム状態を読み込み",
	keyHelpTooltip: "操作説明を表示/非表示",
	controlsTooltip: "コントロールマッピングを表示/非表示",
	settingsTooltip: "エミュレーター設定を開く",
	settingsOpened: "エミュレーター設定メニューを開きました",
	settingsClosed: "エミュレーター設定メニューを閉じました",
	settingsNotAvailable: "エミュレーター設定が利用できません",
	emulatorNotReady: "エミュレーターの準備ができていません",
	settingsError: "設定を開く際にエラーが発生しました",
	muteTooltip: "ミュート",
	unmuteTooltip: "ミュート解除"
};
var controls$1 = {
	controls: "コントロール",
	keyMappings: "キーマッピング",
	up: "上",
	down: "下",
	left: "左",
	right: "右",
	buttonA: "A",
	buttonAA: "AA",
	buttonB: "B",
	buttonBB: "BB",
	start: "スタート",
	select: "セレクト"
};
var errors$1 = {
	fetchCategories: "カテゴリの取得に失敗しました",
	fetchGames: "カテゴリ {category} のゲーム取得に失敗しました",
	fetchGameById: "ゲーム {id} の取得に失敗しました",
	searchError: "検索エラーが発生しました",
	emulatorInit: "エミュレータの初期化に失敗しました",
	gameLoad: "ゲームの読み込みに失敗しました",
	networkError: "ネットワークエラーが発生しました",
	unknownError: "不明なエラーが発生しました"
};
var language$1 = {
	"switch": "言語",
	current: "現在の言語: {language}"
};
var routes$1 = {
	home: "ホーム - Lipeaksゲームパラダイス",
	game: "ゲーム - Lipeaksゲームパラダイス",
	category: "カテゴリ - Lipeaksゲームパラダイス",
	search: "検索結果 - Lipeaksゲームパラダイス",
	searchWithQuery: "検索\"{query}\" - Lipeaksゲームパラダイス",
	notFound: "ページが見つかりません - Lipeaksゲームパラダイス"
};
var categories$1 = {
	fc: {
		name: "FCゲーム",
		description: "クラシックなファミリーコンピュータゲーム集、アクション、シューティング、RPGなど各種クラシックゲーム",
		action: {
			name: "FCアクション",
			description: "プラットフォームジャンプ、横スクロールシューティングなど操作技巧が必要なFCゲーム"
		},
		stg: {
			name: "FCシューティング",
			description: "フライトシューティング、タンクシューティングを中心としたFCシューティングゲーム"
		},
		rpg: {
			name: "FCロールプレイング",
			description: "ロールプレイング系FCゲーム、冒険とストーリーを含む"
		},
		puzzle: {
			name: "FCパズル",
			description: "思考と謎解きが必要なFCパズルゲーム"
		},
		spg: {
			name: "FCスポーツ",
			description: "サッカー、バスケットボールなどを含むFCスポーツゲーム"
		},
		tab: {
			name: "FCテーブルゲーム",
			description: "カードゲーム、テーブルゲーム系FCゲーム"
		},
		etc: {
			name: "FCその他",
			description: "その他のタイプのFCゲーム"
		}
	},
	arcade: {
		name: "アーケードゲーム",
		description: "クラシックアーケードゲーム集、格闘、シューティング、アクションなど各種クラシックアーケードゲーム",
		fighting: {
			name: "アーケード格闘",
			description: "キング・オブ・ファイターズ、ストリートファイターシリーズなどクラシックアーケード格闘ゲーム"
		},
		shooting: {
			name: "アーケードシューティング",
			description: "フライトシューティングとライトガンシューティングを含むアーケードシューティングゲーム"
		},
		action: {
			name: "アーケードアクション",
			description: "メタルスラッグシリーズなどアーケードアクションアドベンチャーゲーム"
		},
		puzzle: {
			name: "アーケードパズル",
			description: "テトリス、パズルボブルなどアーケードパズルゲーム"
		},
		racing: {
			name: "アーケードレーシング",
			description: "アーケードレーシングカーゲーム"
		},
		sports: {
			name: "アーケードスポーツ",
			description: "アーケードスポーツ運動ゲーム"
		},
		etc: {
			name: "アーケードその他",
			description: "その他のタイプのアーケードゲーム"
		}
	}
};
var games$1 = {
	noDescription: "説明がありません",
	unknownAuthor: "不明",
	descriptionTemplate: "{gameName} - クラシック{gameType}{platform}ゲーム",
	genericDescription: "クラシック{platform}ゲーム",
	seoDescription: "{gameName}は{author}によって作られたクラシック{platform}ゲームで、{playCount}回プレイされています。",
	platforms: {
		fc: "ファミコン",
		arcade: "アーケード"
	},
	gameTypes: {
		"动作": "アクション",
		"射击": "シューティング",
		"角色扮演": "RPG",
		"益智": "パズル",
		"体育": "スポーツ",
		"桌游": "ボードゲーム",
		"格斗": "格闘",
		"竞速": "レーシング",
		"动作射击": "アクションシューティング",
		"模拟射击": "シミュレーションシューティング",
		"动作冒险": "アクションアドベンチャー",
		"策略": "ストラテジー",
		"运动": "スポーツ",
		"竞赛": "レーシング"
	},
	nameRules: {
		directMappings: {
			"恶魔城": "悪魔城ドラキュラ",
			"魂斗罗": "魂斗羅",
			"超级马里奥": "スーパーマリオ",
			"塞尔达传说": "ゼルダの伝説",
			"拳皇": "ザ・キング・オブ・ファイターズ",
			"街头霸王": "ストリートファイター",
			"合金弹头": "メタルスラッグ"
		},
		versionMarkers: {
			"(日版)": "(日本版)",
			"(美版)": "(アメリカ版)",
			"(欧版)": "(ヨーロッパ版)",
			"(亚洲版)": "(アジア版)",
			"[汉化]": "[中国語化]",
			"[修改]": "[改造]"
		},
		gameSeries: {
			"2": "2",
			"3": "3",
			"4": "4",
			II: "II",
			III: "III",
			IV: "IV"
		}
	}
};
const jaJP = {
	app: app$1,
	nav: nav$1,
	footer: footer$1,
	home: home$1,
	game: game$1,
	category: category$1,
	search: search$1,
	notFound: notFound$1,
	emulator: emulator$1,
	controls: controls$1,
	errors: errors$1,
	language: language$1,
	routes: routes$1,
	categories: categories$1,
	games: games$1
};

const jaJP$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  app: app$1,
  categories: categories$1,
  category: category$1,
  controls: controls$1,
  default: jaJP,
  emulator: emulator$1,
  errors: errors$1,
  footer: footer$1,
  game: game$1,
  games: games$1,
  home: home$1,
  language: language$1,
  nav: nav$1,
  notFound: notFound$1,
  routes: routes$1,
  search: search$1
}, Symbol.toStringTag, { value: 'Module' }));

var app = {
	title: "Lipeaks",
	subtitle: "منصة الألعاب الكلاسيكية",
	loading: "جارٍ التحميل...",
	error: "خطأ",
	retry: "إعادة المحاولة",
	close: "إغلاق",
	confirm: "تأكيد",
	cancel: "إلغاء"
};
var nav = {
	home: "الرئيسية",
	search: "بحث",
	searchPlaceholder: "البحث عن الألعاب...",
	searchButton: "بحث"
};
var footer = {
	aboutUs: "من نحن",
	aboutUsDesc: "جنة ألعاب Lipeaks هي منصة ألعاب كلاسيكية عبر الإنترنت، تتيح لك إعادة تجربة متعة الألعاب الكلاسيكية.",
	quickLinks: "روابط سريعة",
	contactUs: "اتصل بنا",
	email: "البريد الإلكتروني: contact[at]fcgame.com",
	copyright: "© {year} Lipeaks. جميع الحقوق محفوظة.",
	licensedUnder: "مرخص بموجب {licenseName}.",
	sourceCode: "كود المصدر"
};
var home = {
	title: "جنة ألعاب Lipeaks",
	gameCategories: "فئات الألعاب",
	recommendedGames: "الألعاب الموصى بها",
	loadingRecommendedGames: "جارٍ تحميل الألعاب الموصى بها...",
	noRecommendedGames: "لا توجد ألعاب موصى بها متاحة"
};
var game = {
	loading: "جارٍ التحميل...",
	playCount: "تم اللعب {count} مرة",
	category: "الفئة",
	author: "المؤلف",
	size: "الحجم",
	version: "الإصدار",
	region: "المنطقة",
	description: "وصف اللعبة",
	gameLoaded: "تم تحميل اللعبة: {name}",
	gameStarted: "بدأت اللعبة: {name}",
	gamePaused: "تم إيقاف اللعبة مؤقتاً: {name}",
	gameResumed: "تم استئناف اللعبة: {name}",
	gameError: "حدث خطأ في اللعبة",
	controls: "أدوات التحكم",
	movement: "الحركة",
	buttonA: "زر أ",
	buttonB: "زر ب",
	start: "بداية",
	select: "اختيار",
	coin: "عملة",
	button1: "زر 1",
	button2: "زر 2",
	button3: "زر 3",
	button4: "زر 4",
	loadingTip: "نصيحة: إذا لم تكن الشاشة تحمل، يرجى النقر على شاشة المحاكي بالماوس."
};
var category = {
	gamesCount: "إجمالي {count} ألعاب",
	noGames: "لا توجد ألعاب في هذه الفئة",
	loadingGames: "جارٍ تحميل بيانات الألعاب..."
};
var search = {
	resultsTitle: "نتائج البحث: \"{query}\"",
	resultsCount: "تم العثور على {count} نتيجة",
	noResults: "لم يتم العثور على ألعاب متعلقة بـ \"{query}\"",
	noResultsHelp: "يرجى تجربة كلمات مفتاحية أخرى أو تصفح",
	allGames: "جميع الألعاب",
	searching: "جارٍ البحث..."
};
var notFound = {
	title: "الصفحة غير موجودة",
	message: "عذراً، الصفحة التي تبحث عنها غير موجودة.",
	backHome: "العودة للرئيسية"
};
var emulator = {
	initializing: "جارٍ تهيئة المحاكي...",
	loadingGame: "جارٍ تحميل اللعبة...",
	gameLoaded: "تم تحميل اللعبة بنجاح",
	gameError: "فشل في تحميل اللعبة",
	pause: "إيقاف مؤقت",
	resume: "استئناف",
	restart: "إعادة التشغيل",
	fullscreen: "ملء الشاشة",
	exitFullscreen: "إنهاء ملء الشاشة",
	save: "حفظ",
	load: "تحميل",
	keyHelp: "أزرار التحكم",
	controls: "التحكم",
	settings: "الإعدادات",
	volume: "مستوى الصوت",
	mute: "كتم الصوت",
	unmute: "إلغاء كتم الصوت",
	pauseTooltip: "إيقاف اللعبة مؤقتاً",
	resumeTooltip: "استئناف اللعبة",
	restartTooltip: "إعادة تشغيل اللعبة",
	fullscreenTooltip: "الدخول في وضع ملء الشاشة",
	exitFullscreenTooltip: "الخروج من وضع ملء الشاشة",
	saveTooltip: "حفظ حالة اللعبة",
	loadTooltip: "تحميل حالة اللعبة",
	keyHelpTooltip: "إظهار/إخفاء مساعدة أزرار التحكم",
	controlsTooltip: "إظهار/إخفاء خريطة أزرار التحكم",
	settingsTooltip: "فتح إعدادات المحاكي",
	settingsOpened: "تم فتح قائمة إعدادات المحاكي",
	settingsClosed: "تم إغلاق قائمة إعدادات المحاكي",
	settingsNotAvailable: "إعدادات المحاكي غير متوفرة",
	emulatorNotReady: "المحاكي غير جاهز",
	settingsError: "خطأ في فتح الإعدادات",
	muteTooltip: "كتم الصوت",
	unmuteTooltip: "إلغاء كتم الصوت"
};
var controls = {
	controls: "التحكم",
	keyMappings: "تخطيط الأزرار",
	up: "أعلى",
	down: "أسفل",
	left: "يسار",
	right: "يمين",
	buttonA: "أ",
	buttonAA: "أأ",
	buttonB: "ب",
	buttonBB: "بب",
	start: "بداية",
	select: "اختيار"
};
var errors = {
	fetchCategories: "فشل في جلب الفئات",
	fetchGames: "فشل في جلب ألعاب الفئة {category}",
	fetchGameById: "فشل في جلب اللعبة {id}",
	searchError: "حدث خطأ في البحث",
	emulatorInit: "فشل في تهيئة المحاكي",
	gameLoad: "فشل في تحميل اللعبة",
	networkError: "حدث خطأ في الشبكة",
	unknownError: "حدث خطأ غير معروف"
};
var language = {
	"switch": "اللغة",
	current: "اللغة الحالية: {language}"
};
var routes = {
	home: "الرئيسية - جنة ألعاب Lipeaks",
	game: "لعبة - جنة ألعاب Lipeaks",
	category: "فئة - جنة ألعاب Lipeaks",
	search: "نتائج البحث - جنة ألعاب Lipeaks",
	searchWithQuery: "البحث عن \"{query}\" - جنة ألعاب Lipeaks",
	notFound: "الصفحة غير موجودة - جنة ألعاب Lipeaks"
};
var categories = {
	fc: {
		name: "ألعاب FC",
		description: "مجموعة ألعاب الفاميكوم الكلاسيكية، تشمل الحركة والإطلاق وألعاب الأدوار وغيرها من الألعاب الكلاسيكية",
		action: {
			name: "حركة FC",
			description: "ألعاب FC التي تتطلب مهارات تشغيلية مثل القفز على المنصات والإطلاق الجانبي"
		},
		stg: {
			name: "إطلاق FC",
			description: "ألعاب الإطلاق FC التي تركز على إطلاق الطيران وإطلاق الدبابات"
		},
		rpg: {
			name: "أدوار FC",
			description: "ألعاب تمثيل الأدوار FC، تشمل المغامرة والقصص"
		},
		puzzle: {
			name: "ألغاز FC",
			description: "ألعاب الألغاز FC التي تتطلب التفكير وحل الألغاز"
		},
		spg: {
			name: "رياضة FC",
			description: "ألعاب الرياضة FC تشمل كرة القدم وكرة السلة وغيرها"
		},
		tab: {
			name: "طاولة FC",
			description: "ألعاب الورق والطاولة FC"
		},
		etc: {
			name: "أخرى FC",
			description: "أنواع أخرى من ألعاب FC"
		}
	},
	arcade: {
		name: "ألعاب الآركيد",
		description: "مجموعة ألعاب الآركيد الكلاسيكية، تشمل القتال والإطلاق والحركة وغيرها من ألعاب الآركيد الكلاسيكية",
		fighting: {
			name: "قتال الآركيد",
			description: "ألعاب القتال الآركيد الكلاسيكية مثل سلسلة ملك المقاتلين وستريت فايتر"
		},
		shooting: {
			name: "إطلاق الآركيد",
			description: "ألعاب الإطلاق الآركيد تشمل إطلاق الطيران وإطلاق المسدس الضوئي"
		},
		action: {
			name: "حركة الآركيد",
			description: "ألعاب الحركة والمغامرة الآركيد مثل سلسلة معدن الرصاصة"
		},
		puzzle: {
			name: "ألغاز الآركيد",
			description: "ألعاب الألغاز الآركيد مثل تيتريس وفقاعة الألغاز وغيرها"
		},
		racing: {
			name: "سباق الآركيد",
			description: "ألعاب سباق السيارات الآركيد"
		},
		sports: {
			name: "رياضة الآركيد",
			description: "ألعاب الرياضة الآركيد"
		},
		etc: {
			name: "أخرى الآركيد",
			description: "أنواع أخرى من ألعاب الآركيد"
		}
	}
};
var games = {
	noDescription: "لا يوجد وصف",
	unknownAuthor: "غير معروف",
	descriptionTemplate: "{gameName} - لعبة {gameType} {platform} كلاسيكية",
	genericDescription: "لعبة {platform} كلاسيكية",
	seoDescription: "{gameName} هي لعبة {platform} كلاسيكية من إنشاء {author}، تم لعبها {playCount} مرة.",
	platforms: {
		fc: "إن إي إس",
		arcade: "أركيد"
	},
	gameTypes: {
		"动作": "أكشن",
		"射击": "رماية",
		"角色扮演": "آر بي جي",
		"益智": "ألغاز",
		"体育": "رياضة",
		"桌游": "ألعاب الطاولة",
		"格斗": "قتال",
		"竞速": "سباق",
		"动作射击": "أكشن رماية",
		"模拟射击": "محاكاة الرماية",
		"动作冒险": "أكشن مغامرة",
		"策略": "استراتيجية",
		"运动": "رياضة",
		"竞赛": "سباق"
	},
	nameRules: {
		directMappings: {
			"恶魔城": "كاسلفانيا",
			"魂斗罗": "كونترا",
			"超级马里奥": "سوبر ماريو",
			"塞尔达传说": "أسطورة زيلدا",
			"拳皇": "ملك المقاتلين",
			"街头霸王": "ستريت فايتر",
			"合金弹头": "ميتال سلوغ"
		},
		versionMarkers: {
			"(日版)": "(يابانية)",
			"(美版)": "(أمريكية)",
			"(欧版)": "(أوروبية)",
			"(亚洲版)": "(آسيوية)",
			"[汉化]": "[معربة]",
			"[修改]": "[معدلة]"
		},
		gameSeries: {
			"2": "2",
			"3": "3",
			"4": "4",
			II: "II",
			III: "III",
			IV: "IV"
		}
	}
};
const arAR = {
	app: app,
	nav: nav,
	footer: footer,
	home: home,
	game: game,
	category: category,
	search: search,
	notFound: notFound,
	emulator: emulator,
	controls: controls,
	errors: errors,
	language: language,
	routes: routes,
	categories: categories,
	games: games
};

const arAR$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  app: app,
  categories: categories,
  category: category,
  controls: controls,
  default: arAR,
  emulator: emulator,
  errors: errors,
  footer: footer,
  game: game,
  games: games,
  home: home,
  language: language,
  nav: nav,
  notFound: notFound,
  routes: routes,
  search: search
}, Symbol.toStringTag, { value: 'Module' }));

const sources$1 = [
    {
        "context": {
            "name": "sitemap:urls",
            "description": "Set with the `sitemap.urls` config."
        },
        "urls": [],
        "sourceType": "user"
    },
    {
        "context": {
            "name": "nuxt:pages",
            "description": "Generated from your static page files.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:pages'] }`."
            ]
        },
        "urls": [
            {
                "loc": "/",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/"
                    }
                ]
            },
            {
                "loc": "/zh",
                "_sitemap": "zh-CN",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/"
                    }
                ]
            },
            {
                "loc": "/ja",
                "_sitemap": "ja-JP",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/"
                    }
                ]
            },
            {
                "loc": "/ar",
                "_sitemap": "ar-AR",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/"
                    }
                ]
            },
            {
                "loc": "/stats",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/stats"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh/stats"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja/stats"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar/stats"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/stats"
                    }
                ]
            },
            {
                "loc": "/zh/stats",
                "_sitemap": "zh-CN",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/stats"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh/stats"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja/stats"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar/stats"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/stats"
                    }
                ]
            },
            {
                "loc": "/ja/stats",
                "_sitemap": "ja-JP",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/stats"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh/stats"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja/stats"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar/stats"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/stats"
                    }
                ]
            },
            {
                "loc": "/ar/stats",
                "_sitemap": "ar-AR",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/stats"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh/stats"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja/stats"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar/stats"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/stats"
                    }
                ]
            },
            {
                "loc": "/search",
                "_sitemap": "en-US",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/search"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh/search"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja/search"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar/search"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/search"
                    }
                ]
            },
            {
                "loc": "/zh/search",
                "_sitemap": "zh-CN",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/search"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh/search"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja/search"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar/search"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/search"
                    }
                ]
            },
            {
                "loc": "/ja/search",
                "_sitemap": "ja-JP",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/search"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh/search"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja/search"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar/search"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/search"
                    }
                ]
            },
            {
                "loc": "/ar/search",
                "_sitemap": "ar-AR",
                "alternatives": [
                    {
                        "hreflang": "en-US",
                        "href": "/search"
                    },
                    {
                        "hreflang": "zh-CN",
                        "href": "/zh/search"
                    },
                    {
                        "hreflang": "ja-JP",
                        "href": "/ja/search"
                    },
                    {
                        "hreflang": "ar-AR",
                        "href": "/ar/search"
                    },
                    {
                        "hreflang": "x-default",
                        "href": "/search"
                    }
                ]
            },
            {
                "loc": "/sitemap.xml",
                "_sitemap": "en-US"
            },
            {
                "loc": "/zh/sitemap.xml",
                "_sitemap": "en-US"
            },
            {
                "loc": "/ja/sitemap.xml",
                "_sitemap": "en-US"
            },
            {
                "loc": "/ar/sitemap.xml",
                "_sitemap": "en-US"
            }
        ],
        "sourceType": "app"
    },
    {
        "context": {
            "name": "nuxt:prerender",
            "description": "Generated at build time when prerendering.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:prerender'] }`."
            ]
        },
        "urls": [
            "/"
        ],
        "sourceType": "app"
    }
];

const globalSources = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  sources: sources$1
}, Symbol.toStringTag, { value: 'Module' }));

const sources = {
    "en-US": [],
    "zh-CN": [],
    "ja-JP": [],
    "ar-AR": []
};

const childSources = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  sources: sources
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
  return {
    body: stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) ,
    statusCode: getResponseStatus(ssrContext.event),
    statusMessage: getResponseStatusText(ssrContext.event),
    headers: {
      "content-type": "application/json;charset=utf-8" ,
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}

const renderSSRHeadOptions = {"omitLineBreaks":true};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const ssrContext = createSSRContext(event);
  const headEntryOptions = { mode: "server" };
  ssrContext.head.push(appHead, headEntryOptions);
  if (ssrError) {
    ssrError.statusCode &&= Number.parseInt(ssrError.statusCode);
    if (typeof ssrError.data === "string") {
      try {
        ssrError.data = destr(ssrError.data);
      } catch {
      }
    }
    setSSRError(ssrContext, ssrError);
  }
  const isRenderingPayload = PAYLOAD_URL_RE.test(ssrContext.url);
  if (isRenderingPayload) {
    const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
    ssrContext.url = url;
    event._path = event.node.req.url = url;
  }
  const routeOptions = getRouteRules(event);
  if (routeOptions.ssr === false) {
    ssrContext.noSSR = true;
  }
  const renderer = await getRenderer(ssrContext);
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  const inlinedStyles = [];
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response = renderPayloadResponse(ssrContext);
    return response;
  }
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest && !NO_SCRIPTS) {
    ssrContext.head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  const link = [];
  for (const resource of Object.values(styles)) {
    if ("inline" in getQuery(resource.file)) {
      continue;
    }
    link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
  }
  if (link.length) {
    ssrContext.head.push({ link }, headEntryOptions);
  }
  if (!NO_SCRIPTS) {
    ssrContext.head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    const tagPosition = "head";
    ssrContext.head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition,
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
  const htmlContext = {
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      replaceIslandTeleports(ssrContext, _rendered.html) ,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  return {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
});
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}

const renderer$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: renderer
}, Symbol.toStringTag, { value: 'Module' }));

defineCachedFunction(
  async (event, resolvers, runtimeConfig, nitro) => {
    return buildSitemapIndexInternal(resolvers, runtimeConfig, nitro);
  },
  {
    name: "sitemap:index",
    group: "sitemap",
    maxAge: 60 * 10,
    // 10 minutes default
    base: "sitemap",
    // Use the sitemap storage
    getKey: (event) => {
      const host = getHeader(event, "host") || getHeader(event, "x-forwarded-host") || "";
      const proto = getHeader(event, "x-forwarded-proto") || "https";
      return `sitemap-index-${proto}-${host}`;
    },
    swr: true
    // Enable stale-while-revalidate
  }
);
async function buildSitemapIndexInternal(resolvers, runtimeConfig, nitro) {
  const {
    sitemaps,
    // enhancing
    autoLastmod,
    // chunking
    defaultSitemapsChunkSize,
    autoI18n,
    isI18nMapped,
    sortEntries,
    sitemapsPathPrefix
  } = runtimeConfig;
  if (!sitemaps)
    throw new Error("Attempting to build a sitemap index without required `sitemaps` configuration.");
  function maybeSort(urls) {
    return sortEntries ? sortInPlace(urls) : urls;
  }
  const chunks = {};
  const allFailedSources = [];
  for (const sitemapName in sitemaps) {
    if (sitemapName === "index" || sitemapName === "chunks") continue;
    const sitemapConfig = sitemaps[sitemapName];
    if (sitemapConfig.chunks || sitemapConfig._isChunking) {
      sitemapConfig._isChunking = true;
      sitemapConfig._chunkSize = typeof sitemapConfig.chunks === "number" ? sitemapConfig.chunks : sitemapConfig.chunkSize || defaultSitemapsChunkSize || 1e3;
    } else {
      chunks[sitemapName] = chunks[sitemapName] || { urls: [] };
    }
  }
  if (typeof sitemaps.chunks !== "undefined") {
    const sitemap = sitemaps.chunks;
    let sourcesInput = await globalSitemapSources();
    if (nitro && resolvers.event) {
      const ctx = {
        event: resolvers.event,
        sitemapName: sitemap.sitemapName,
        sources: sourcesInput
      };
      await nitro.hooks.callHook("sitemap:sources", ctx);
      sourcesInput = ctx.sources;
    }
    const sources = await resolveSitemapSources(sourcesInput, resolvers.event);
    const failedSources = sources.filter((source) => source.error && source._isFailure).map((source) => ({
      url: typeof source.fetch === "string" ? source.fetch : source.fetch?.[0] || "unknown",
      error: source.error || "Unknown error"
    }));
    allFailedSources.push(...failedSources);
    const resolvedCtx = {
      urls: sources.flatMap((s) => s.urls),
      sitemapName: sitemap.sitemapName,
      event: resolvers.event
    };
    await nitro?.hooks.callHook("sitemap:input", resolvedCtx);
    const normalisedUrls = resolveSitemapEntries(sitemap, resolvedCtx.urls, { autoI18n, isI18nMapped }, resolvers);
    const enhancedUrls = normalisedUrls.map((e) => defu$1(e, sitemap.defaults));
    const sortedUrls = maybeSort(enhancedUrls);
    sortedUrls.forEach((url, i) => {
      const chunkIndex = Math.floor(i / defaultSitemapsChunkSize);
      chunks[chunkIndex] = chunks[chunkIndex] || { urls: [] };
      chunks[chunkIndex].urls.push(url);
    });
  }
  const entries = [];
  for (const name in chunks) {
    const sitemap = chunks[name];
    const entry = {
      _sitemapName: name,
      sitemap: resolvers.canonicalUrlResolver(joinURL(sitemapsPathPrefix || "", `/${name}.xml`))
    };
    let lastmod = sitemap.urls.filter((a) => !!a?.lastmod).map((a) => typeof a.lastmod === "string" ? new Date(a.lastmod) : a.lastmod).sort((a, b) => (b?.getTime() || 0) - (a?.getTime() || 0))?.[0];
    if (!lastmod && autoLastmod)
      lastmod = /* @__PURE__ */ new Date();
    if (lastmod)
      entry.lastmod = normaliseDate(lastmod);
    entries.push(entry);
  }
  for (const sitemapName in sitemaps) {
    if (sitemapName !== "index" && sitemaps[sitemapName]._isChunking) {
      const sitemapConfig = sitemaps[sitemapName];
      const chunkSize = sitemapConfig._chunkSize || defaultSitemapsChunkSize || 1e3;
      let sourcesInput = sitemapConfig.includeAppSources ? await globalSitemapSources() : [];
      sourcesInput.push(...await childSitemapSources(sitemapConfig));
      if (nitro && resolvers.event) {
        const ctx = {
          event: resolvers.event,
          sitemapName: sitemapConfig.sitemapName,
          sources: sourcesInput
        };
        await nitro.hooks.callHook("sitemap:sources", ctx);
        sourcesInput = ctx.sources;
      }
      const sources = await resolveSitemapSources(sourcesInput, resolvers.event);
      const failedSources = sources.filter((source) => source.error && source._isFailure).map((source) => ({
        url: typeof source.fetch === "string" ? source.fetch : source.fetch?.[0] || "unknown",
        error: source.error || "Unknown error"
      }));
      allFailedSources.push(...failedSources);
      const resolvedCtx = {
        urls: sources.flatMap((s) => s.urls),
        sitemapName: sitemapConfig.sitemapName,
        event: resolvers.event
      };
      await nitro?.hooks.callHook("sitemap:input", resolvedCtx);
      const normalisedUrls = resolveSitemapEntries(sitemapConfig, resolvedCtx.urls, { autoI18n, isI18nMapped }, resolvers);
      const totalUrls = normalisedUrls.length;
      const chunkCount = Math.ceil(totalUrls / chunkSize);
      sitemapConfig._chunkCount = chunkCount;
      for (let i = 0; i < chunkCount; i++) {
        const chunkName = `${sitemapName}-${i}`;
        const entry = {
          _sitemapName: chunkName,
          sitemap: resolvers.canonicalUrlResolver(joinURL(sitemapsPathPrefix || "", `/${chunkName}.xml`))
        };
        const chunkUrls = normalisedUrls.slice(i * chunkSize, (i + 1) * chunkSize);
        let lastmod = chunkUrls.filter((a) => !!a?.lastmod).map((a) => typeof a.lastmod === "string" ? new Date(a.lastmod) : a.lastmod).sort((a, b) => (b?.getTime() || 0) - (a?.getTime() || 0))?.[0];
        if (!lastmod && autoLastmod)
          lastmod = /* @__PURE__ */ new Date();
        if (lastmod)
          entry.lastmod = normaliseDate(lastmod);
        entries.push(entry);
      }
    }
  }
  if (sitemaps.index) {
    entries.push(...sitemaps.index.sitemaps.map((entry) => {
      return typeof entry === "string" ? { sitemap: entry } : entry;
    }));
  }
  return { entries, failedSources: allFailedSources };
}
function urlsToIndexXml(sitemaps, resolvers, { version, xsl, credits, minify }, errorInfo) {
  const sitemapXml = sitemaps.map((e) => [
    "    <sitemap>",
    `        <loc>${escapeValueForXml(e.sitemap)}</loc>`,
    // lastmod is optional
    e.lastmod ? `        <lastmod>${escapeValueForXml(e.lastmod)}</lastmod>` : false,
    "    </sitemap>"
  ].filter(Boolean).join("\n")).join("\n");
  const xmlParts = [
    '<?xml version="1.0" encoding="UTF-8"?>'
  ];
  if (xsl) {
    let relativeBaseUrl = resolvers.relativeBaseUrlResolver?.(xsl) ?? xsl;
    if (errorInfo && errorInfo.messages.length > 0) {
      relativeBaseUrl = withQuery(relativeBaseUrl, {
        errors: "true",
        error_messages: errorInfo.messages,
        error_urls: errorInfo.urls
      });
    }
    xmlParts.push(`<?xml-stylesheet type="text/xsl" href="${escapeValueForXml(relativeBaseUrl)}"?>`);
  }
  xmlParts.push(
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemapXml,
    "</sitemapindex>"
  );
  if (credits) {
    xmlParts.push(`<!-- XML Sitemap Index generated by @nuxtjs/sitemap v${version} at ${(/* @__PURE__ */ new Date()).toISOString()} -->`);
  }
  return minify ? xmlParts.join("").replace(/(?<!<[^>]*)\s(?![^<]*>)/g, "") : xmlParts.join("\n");
}
async function buildSitemapIndex(resolvers, runtimeConfig, nitro) {
  return buildSitemapIndexInternal(resolvers, runtimeConfig, nitro);
}

const sitemap_index_xml = defineEventHandler(async (e) => {
  const runtimeConfig = useSitemapRuntimeConfig();
  const nitro = useNitroApp();
  const resolvers = useNitroUrlResolvers(e);
  const { entries: sitemaps, failedSources } = await buildSitemapIndex(resolvers, runtimeConfig, nitro);
  const indexResolvedCtx = { sitemaps, event: e };
  await nitro.hooks.callHook("sitemap:index-resolved", indexResolvedCtx);
  const errorInfo = failedSources.length > 0 ? {
    messages: failedSources.map((f) => f.error),
    urls: failedSources.map((f) => f.url)
  } : void 0;
  const output = urlsToIndexXml(indexResolvedCtx.sitemaps, resolvers, runtimeConfig, errorInfo);
  const ctx = { sitemap: output, sitemapName: "sitemap", event: e };
  await nitro.hooks.callHook("sitemap:output", ctx);
  setHeader(e, "Content-Type", "text/xml; charset=UTF-8");
  if (runtimeConfig.cacheMaxAgeSeconds) {
    setHeader(e, "Cache-Control", `public, max-age=${runtimeConfig.cacheMaxAgeSeconds}, s-maxage=${runtimeConfig.cacheMaxAgeSeconds}, stale-while-revalidate=3600`);
    const now = /* @__PURE__ */ new Date();
    setHeader(e, "X-Sitemap-Generated", now.toISOString());
    setHeader(e, "X-Sitemap-Cache-Duration", `${runtimeConfig.cacheMaxAgeSeconds}s`);
    const expiryTime = new Date(now.getTime() + runtimeConfig.cacheMaxAgeSeconds * 1e3);
    setHeader(e, "X-Sitemap-Cache-Expires", expiryTime.toISOString());
    const remainingSeconds = Math.floor((expiryTime.getTime() - now.getTime()) / 1e3);
    setHeader(e, "X-Sitemap-Cache-Remaining", `${remainingSeconds}s`);
  } else {
    setHeader(e, "Cache-Control", `no-cache, no-store`);
  }
  return ctx.sitemap;
});

const sitemap_index_xml$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sitemap_index_xml
}, Symbol.toStringTag, { value: 'Module' }));

const _sitemap__xml = defineEventHandler(async (e) => {
  const runtimeConfig = useSitemapRuntimeConfig(e);
  const { sitemaps } = runtimeConfig;
  let sitemapName = getRouterParam(e, "sitemap");
  if (!sitemapName) {
    const path = e.path;
    const match = path.match(/(?:\/__sitemap__\/)?([^/]+)\.xml$/);
    if (match) {
      sitemapName = match[1];
    }
  }
  if (!sitemapName) {
    return createError({
      statusCode: 400,
      message: "Invalid sitemap request"
    });
  }
  sitemapName = withoutLeadingSlash(withoutTrailingSlash(sitemapName.replace(".xml", "").replace("__sitemap__/", "").replace(runtimeConfig.sitemapsPathPrefix || "", "")));
  const chunkInfo = parseChunkInfo(sitemapName, sitemaps, runtimeConfig.defaultSitemapsChunkSize);
  const isAutoChunked = typeof sitemaps.chunks !== "undefined" && !Number.isNaN(Number(sitemapName));
  const sitemapExists = sitemapName in sitemaps || chunkInfo.baseSitemapName in sitemaps || isAutoChunked;
  if (!sitemapExists) {
    return createError({
      statusCode: 404,
      message: `Sitemap "${sitemapName}" not found.`
    });
  }
  if (chunkInfo.isChunked && chunkInfo.chunkIndex !== void 0) {
    const baseSitemap = sitemaps[chunkInfo.baseSitemapName];
    if (baseSitemap && !baseSitemap.chunks && !baseSitemap._isChunking) {
      return createError({
        statusCode: 404,
        message: `Sitemap "${chunkInfo.baseSitemapName}" does not support chunking.`
      });
    }
    if (baseSitemap?._chunkCount !== void 0 && chunkInfo.chunkIndex >= baseSitemap._chunkCount) {
      return createError({
        statusCode: 404,
        message: `Chunk ${chunkInfo.chunkIndex} does not exist for sitemap "${chunkInfo.baseSitemapName}".`
      });
    }
  }
  const sitemapConfig = getSitemapConfig(sitemapName, sitemaps, runtimeConfig.defaultSitemapsChunkSize);
  return createSitemap(e, sitemapConfig, runtimeConfig);
});

const _sitemap__xml$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sitemap__xml
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
