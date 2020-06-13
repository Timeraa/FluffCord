// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/@types/ClientOptions",
  [],
  function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Collection",
  [],
  function (exports_2, context_2) {
    "use strict";
    var Collection;
    var __moduleName = context_2 && context_2.id;
    return {
      setters: [],
      execute: function () {
        Collection = class Collection extends Map {
          array() {
            return [...this.values()];
          }
          entryArray() {
            return [...this.entries()];
          }
          keyArray() {
            return [...this.keys()];
          }
          map(mapper) {
            return this.array().map(mapper.bind(this));
          }
          flatMap(mapper) {
            return this.array().flatMap(mapper.bind(this));
          }
          limit(i) {
            return new Collection(this.entryArray().slice(0, i));
          }
          skip(i) {
            return new Collection(this.entryArray().slice(i));
          }
          random(i = 1) {
            const result = [], values = this.array();
            for (let j = 0; j < i; j++) {
              result.push(values[Math.floor(Math.random() * values.length)]);
            }
            return result;
          }
          randomKeys(i = 1) {
            const result = [], keys = this.keyArray();
            for (let j = 0; j < i; j++) {
              result.push(keys[Math.floor(Math.random() * keys.length)]);
            }
            return result;
          }
          reduce(accumulator, initialValue) {
            let prev;
            const values = this.array();
            if (initialValue) {
              prev = initialValue;
            }
            for (let i = 0; i < values.length; i++) {
              prev = accumulator(prev, values[i], i);
            }
            return prev;
          }
          find(f) {
            return this.array().find(f.bind(this));
          }
          findKey(f) {
            return this.keyArray().find(f.bind(this));
          }
          concat(...collections) {
            const col = new Collection();
            for (const merging of collections) {
              for (const [mergingKey, mergingValue] of merging.entries()) {
                col.set(mergingKey, mergingValue);
              }
            }
            return col;
          }
        };
        exports_2("default", Collection);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/@types/GatewayPayload",
  [],
  function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
 * on npm.
 *
 * ```
 * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
 * console.log(bgBlue(red(bold("Hello world!"))));
 * ```
 *
 * This module supports `NO_COLOR` environmental variable disabling any coloring
 * if `NO_COLOR` is set.
 *
 * This module is browser compatible. */
System.register(
  "https://deno.land/std/fmt/colors",
  [],
  function (exports_4, context_4) {
    "use strict";
    var noColor, enabled, ANSI_PATTERN;
    var __moduleName = context_4 && context_4.id;
    function setColorEnabled(value) {
      if (noColor) {
        return;
      }
      enabled = value;
    }
    exports_4("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
      return enabled;
    }
    exports_4("getColorEnabled", getColorEnabled);
    function code(open, close) {
      return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
      };
    }
    function run(str, code) {
      return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
    }
    function reset(str) {
      return run(str, code([0], 0));
    }
    exports_4("reset", reset);
    function bold(str) {
      return run(str, code([1], 22));
    }
    exports_4("bold", bold);
    function dim(str) {
      return run(str, code([2], 22));
    }
    exports_4("dim", dim);
    function italic(str) {
      return run(str, code([3], 23));
    }
    exports_4("italic", italic);
    function underline(str) {
      return run(str, code([4], 24));
    }
    exports_4("underline", underline);
    function inverse(str) {
      return run(str, code([7], 27));
    }
    exports_4("inverse", inverse);
    function hidden(str) {
      return run(str, code([8], 28));
    }
    exports_4("hidden", hidden);
    function strikethrough(str) {
      return run(str, code([9], 29));
    }
    exports_4("strikethrough", strikethrough);
    function black(str) {
      return run(str, code([30], 39));
    }
    exports_4("black", black);
    function red(str) {
      return run(str, code([31], 39));
    }
    exports_4("red", red);
    function green(str) {
      return run(str, code([32], 39));
    }
    exports_4("green", green);
    function yellow(str) {
      return run(str, code([33], 39));
    }
    exports_4("yellow", yellow);
    function blue(str) {
      return run(str, code([34], 39));
    }
    exports_4("blue", blue);
    function magenta(str) {
      return run(str, code([35], 39));
    }
    exports_4("magenta", magenta);
    function cyan(str) {
      return run(str, code([36], 39));
    }
    exports_4("cyan", cyan);
    function white(str) {
      return run(str, code([37], 39));
    }
    exports_4("white", white);
    function gray(str) {
      return run(str, code([90], 39));
    }
    exports_4("gray", gray);
    function bgBlack(str) {
      return run(str, code([40], 49));
    }
    exports_4("bgBlack", bgBlack);
    function bgRed(str) {
      return run(str, code([41], 49));
    }
    exports_4("bgRed", bgRed);
    function bgGreen(str) {
      return run(str, code([42], 49));
    }
    exports_4("bgGreen", bgGreen);
    function bgYellow(str) {
      return run(str, code([43], 49));
    }
    exports_4("bgYellow", bgYellow);
    function bgBlue(str) {
      return run(str, code([44], 49));
    }
    exports_4("bgBlue", bgBlue);
    function bgMagenta(str) {
      return run(str, code([45], 49));
    }
    exports_4("bgMagenta", bgMagenta);
    function bgCyan(str) {
      return run(str, code([46], 49));
    }
    exports_4("bgCyan", bgCyan);
    function bgWhite(str) {
      return run(str, code([47], 49));
    }
    exports_4("bgWhite", bgWhite);
    /* Special Color Sequences */
    function clampAndTruncate(n, max = 255, min = 0) {
      return Math.trunc(Math.max(Math.min(n, max), min));
    }
    /** Set text color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function rgb8(str, color) {
      return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_4("rgb8", rgb8);
    /** Set background color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function bgRgb8(str, color) {
      return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_4("bgRgb8", bgRgb8);
    /** Set text color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     *      rgba24("foo", 0xff00ff);
     *      rgba24("foo", {r: 255, g: 0, b: 255});
     */
    function rgb24(str, color) {
      if (typeof color === "number") {
        return run(
          str,
          code(
            [38, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff],
            39,
          ),
        );
      }
      return run(
        str,
        code([
          38,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 39),
      );
    }
    exports_4("rgb24", rgb24);
    /** Set background color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     *      bgRgba24("foo", 0xff00ff);
     *      bgRgba24("foo", {r: 255, g: 0, b: 255});
     */
    function bgRgb24(str, color) {
      if (typeof color === "number") {
        return run(
          str,
          code(
            [48, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff],
            49,
          ),
        );
      }
      return run(
        str,
        code([
          48,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 49),
      );
    }
    exports_4("bgRgb24", bgRgb24);
    function stripColor(string) {
      return string.replace(ANSI_PATTERN, "");
    }
    exports_4("stripColor", stripColor);
    return {
      setters: [],
      execute: function () {
        noColor = globalThis.Deno?.noColor ?? true;
        enabled = !noColor;
        // https://github.com/chalk/ansi-regex/blob/2b56fb0c7a07108e5b54241e8faec160d393aedb/index.js
        ANSI_PATTERN = new RegExp(
          [
            "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
            "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
          ].join("|"),
          "g",
        );
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/testing/diff",
  [],
  function (exports_5, context_5) {
    "use strict";
    var DiffType, REMOVED, COMMON, ADDED;
    var __moduleName = context_5 && context_5.id;
    function createCommon(A, B, reverse) {
      const common = [];
      if (A.length === 0 || B.length === 0) {
        return [];
      }
      for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
        if (
          A[reverse ? A.length - i - 1 : i] ===
            B[reverse ? B.length - i - 1 : i]
        ) {
          common.push(A[reverse ? A.length - i - 1 : i]);
        } else {
          return common;
        }
      }
      return common;
    }
    function diff(A, B) {
      const prefixCommon = createCommon(A, B);
      const suffixCommon = createCommon(
        A.slice(prefixCommon.length),
        B.slice(prefixCommon.length),
        true,
      ).reverse();
      A = suffixCommon.length
        ? A.slice(prefixCommon.length, -suffixCommon.length)
        : A.slice(prefixCommon.length);
      B = suffixCommon.length
        ? B.slice(prefixCommon.length, -suffixCommon.length)
        : B.slice(prefixCommon.length);
      const swapped = B.length > A.length;
      [A, B] = swapped ? [B, A] : [A, B];
      const M = A.length;
      const N = B.length;
      if (!M && !N && !suffixCommon.length && !prefixCommon.length) {
        return [];
      }
      if (!N) {
        return [
          ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
          ...A.map((a) => ({
            type: swapped ? DiffType.added : DiffType.removed,
            value: a,
          })),
          ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ];
      }
      const offset = N;
      const delta = M - N;
      const size = M + N + 1;
      const fp = new Array(size).fill({ y: -1 });
      /**
         * INFO:
         * This buffer is used to save memory and improve performance.
         * The first half is used to save route and last half is used to save diff
         * type.
         * This is because, when I kept new uint8array area to save type,performance
         * worsened.
         */
      const routes = new Uint32Array((M * N + size + 1) * 2);
      const diffTypesPtrOffset = routes.length / 2;
      let ptr = 0;
      let p = -1;
      function backTrace(A, B, current, swapped) {
        const M = A.length;
        const N = B.length;
        const result = [];
        let a = M - 1;
        let b = N - 1;
        let j = routes[current.id];
        let type = routes[current.id + diffTypesPtrOffset];
        while (true) {
          if (!j && !type) {
            break;
          }
          const prev = j;
          if (type === REMOVED) {
            result.unshift({
              type: swapped ? DiffType.removed : DiffType.added,
              value: B[b],
            });
            b -= 1;
          } else if (type === ADDED) {
            result.unshift({
              type: swapped ? DiffType.added : DiffType.removed,
              value: A[a],
            });
            a -= 1;
          } else {
            result.unshift({ type: DiffType.common, value: A[a] });
            a -= 1;
            b -= 1;
          }
          j = routes[prev];
          type = routes[prev + diffTypesPtrOffset];
        }
        return result;
      }
      function createFP(slide, down, k, M) {
        if (slide && slide.y === -1 && down && down.y === -1) {
          return { y: 0, id: 0 };
        }
        if (
          (down && down.y === -1) ||
          k === M ||
          (slide && slide.y) > (down && down.y) + 1
        ) {
          const prev = slide.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = ADDED;
          return { y: slide.y, id: ptr };
        } else {
          const prev = down.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = REMOVED;
          return { y: down.y + 1, id: ptr };
        }
      }
      function snake(k, slide, down, _offset, A, B) {
        const M = A.length;
        const N = B.length;
        if (k < -N || M < k) {
          return { y: -1, id: -1 };
        }
        const fp = createFP(slide, down, k, M);
        while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
          const prev = fp.id;
          ptr++;
          fp.id = ptr;
          fp.y += 1;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = COMMON;
        }
        return fp;
      }
      while (fp[delta + offset].y < N) {
        p = p + 1;
        for (let k = -p; k < delta; ++k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        for (let k = delta + p; k > delta; --k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        fp[delta + offset] = snake(
          delta,
          fp[delta - 1 + offset],
          fp[delta + 1 + offset],
          offset,
          A,
          B,
        );
      }
      return [
        ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ...backTrace(A, B, fp[delta + offset], swapped),
        ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
      ];
    }
    exports_5("default", diff);
    return {
      setters: [],
      execute: function () {
        (function (DiffType) {
          DiffType["removed"] = "removed";
          DiffType["common"] = "common";
          DiffType["added"] = "added";
        })(DiffType || (DiffType = {}));
        exports_5("DiffType", DiffType);
        REMOVED = 1;
        COMMON = 2;
        ADDED = 3;
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. Do not rely on good formatting of values
 * for AssertionError messages in browsers. */
System.register(
  "https://deno.land/std/testing/asserts",
  ["https://deno.land/std/fmt/colors", "https://deno.land/std/testing/diff"],
  function (exports_6, context_6) {
    "use strict";
    var colors_ts_1, diff_ts_1, CAN_NOT_DISPLAY, AssertionError;
    var __moduleName = context_6 && context_6.id;
    function format(v) {
      let string = globalThis.Deno ? Deno.inspect(v) : String(v);
      if (typeof v == "string") {
        string = `"${string.replace(/(?=["\\])/g, "\\")}"`;
      }
      return string;
    }
    function createColor(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return (s) => colors_ts_1.green(colors_ts_1.bold(s));
        case diff_ts_1.DiffType.removed:
          return (s) => colors_ts_1.red(colors_ts_1.bold(s));
        default:
          return colors_ts_1.white;
      }
    }
    function createSign(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return "+   ";
        case diff_ts_1.DiffType.removed:
          return "-   ";
        default:
          return "    ";
      }
    }
    function buildMessage(diffResult) {
      const messages = [];
      messages.push("");
      messages.push("");
      messages.push(
        `    ${colors_ts_1.gray(colors_ts_1.bold("[Diff]"))} ${
          colors_ts_1.red(colors_ts_1.bold("Actual"))
        } / ${colors_ts_1.green(colors_ts_1.bold("Expected"))}`,
      );
      messages.push("");
      messages.push("");
      diffResult.forEach((result) => {
        const c = createColor(result.type);
        messages.push(c(`${createSign(result.type)}${result.value}`));
      });
      messages.push("");
      return messages;
    }
    function isKeyedCollection(x) {
      return [Symbol.iterator, "size"].every((k) => k in x);
    }
    function equal(c, d) {
      const seen = new Map();
      return (function compare(a, b) {
        // Have to render RegExp & Date for string comparison
        // unless it's mistreated as object
        if (
          a &&
          b &&
          ((a instanceof RegExp && b instanceof RegExp) ||
            (a instanceof Date && b instanceof Date))
        ) {
          return String(a) === String(b);
        }
        if (Object.is(a, b)) {
          return true;
        }
        if (a && typeof a === "object" && b && typeof b === "object") {
          if (seen.get(a) === b) {
            return true;
          }
          if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
            return false;
          }
          if (isKeyedCollection(a) && isKeyedCollection(b)) {
            if (a.size !== b.size) {
              return false;
            }
            let unmatchedEntries = a.size;
            for (const [aKey, aValue] of a.entries()) {
              for (const [bKey, bValue] of b.entries()) {
                /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                if (
                  (aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                  (compare(aKey, bKey) && compare(aValue, bValue))
                ) {
                  unmatchedEntries--;
                }
              }
            }
            return unmatchedEntries === 0;
          }
          const merged = { ...a, ...b };
          for (const key in merged) {
            if (!compare(a && a[key], b && b[key])) {
              return false;
            }
          }
          seen.set(a, b);
          return true;
        }
        return false;
      })(c, d);
    }
    exports_6("equal", equal);
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
      if (!expr) {
        throw new AssertionError(msg);
      }
    }
    exports_6("assert", assert);
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     */
    function assertEquals(actual, expected, msg) {
      if (equal(actual, expected)) {
        return;
      }
      let message = "";
      const actualString = format(actual);
      const expectedString = format(expected);
      try {
        const diffResult = diff_ts_1.default(
          actualString.split("\n"),
          expectedString.split("\n"),
        );
        const diffMsg = buildMessage(diffResult).join("\n");
        message = `Values are not equal:\n${diffMsg}`;
      } catch (e) {
        message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
      }
      if (msg) {
        message = msg;
      }
      throw new AssertionError(message);
    }
    exports_6("assertEquals", assertEquals);
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     */
    function assertNotEquals(actual, expected, msg) {
      if (!equal(actual, expected)) {
        return;
      }
      let actualString;
      let expectedString;
      try {
        actualString = String(actual);
      } catch (e) {
        actualString = "[Cannot display]";
      }
      try {
        expectedString = String(expected);
      } catch (e) {
        expectedString = "[Cannot display]";
      }
      if (!msg) {
        msg = `actual: ${actualString} expected: ${expectedString}`;
      }
      throw new AssertionError(msg);
    }
    exports_6("assertNotEquals", assertNotEquals);
    /**
     * Make an assertion that `actual` and `expected` are strictly equal.  If
     * not then throw.
     */
    function assertStrictEq(actual, expected, msg) {
      if (actual === expected) {
        return;
      }
      let message;
      if (msg) {
        message = msg;
      } else {
        const actualString = format(actual);
        const expectedString = format(expected);
        if (actualString === expectedString) {
          const withOffset = actualString
            .split("\n")
            .map((l) => `     ${l}`)
            .join("\n");
          message =
            `Values have the same structure but are not reference-equal:\n\n${
              colors_ts_1.red(withOffset)
            }\n`;
        } else {
          try {
            const diffResult = diff_ts_1.default(
              actualString.split("\n"),
              expectedString.split("\n"),
            );
            const diffMsg = buildMessage(diffResult).join("\n");
            message = `Values are not strictly equal:\n${diffMsg}`;
          } catch (e) {
            message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
          }
        }
      }
      throw new AssertionError(message);
    }
    exports_6("assertStrictEq", assertStrictEq);
    /**
     * Make an assertion that actual contains expected. If not
     * then thrown.
     */
    function assertStrContains(actual, expected, msg) {
      if (!actual.includes(expected)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to contain: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_6("assertStrContains", assertStrContains);
    /**
     * Make an assertion that `actual` contains the `expected` values
     * If not then thrown.
     */
    function assertArrayContains(actual, expected, msg) {
      const missing = [];
      for (let i = 0; i < expected.length; i++) {
        let found = false;
        for (let j = 0; j < actual.length; j++) {
          if (equal(expected[i], actual[j])) {
            found = true;
            break;
          }
        }
        if (!found) {
          missing.push(expected[i]);
        }
      }
      if (missing.length === 0) {
        return;
      }
      if (!msg) {
        msg = `actual: "${actual}" expected to contain: "${expected}"`;
        msg += "\n";
        msg += `missing: ${missing}`;
      }
      throw new AssertionError(msg);
    }
    exports_6("assertArrayContains", assertArrayContains);
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then thrown
     */
    function assertMatch(actual, expected, msg) {
      if (!expected.test(actual)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to match: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_6("assertMatch", assertMatch);
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports_6("fail", fail);
    /** Executes a function, expecting it to throw.  If it does not, then it
     * throws.  An error class and a string that should be included in the
     * error message can also be asserted.
     */
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but was "${e.constructor.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_6("assertThrows", assertThrows);
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        await fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but got "${e.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_6("assertThrowsAsync", assertThrowsAsync);
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
      throw new AssertionError(msg || "unimplemented");
    }
    exports_6("unimplemented", unimplemented);
    /** Use this to assert unreachable code. */
    function unreachable() {
      throw new AssertionError("unreachable");
    }
    exports_6("unreachable", unreachable);
    return {
      setters: [
        function (colors_ts_1_1) {
          colors_ts_1 = colors_ts_1_1;
        },
        function (diff_ts_1_1) {
          diff_ts_1 = diff_ts_1_1;
        },
      ],
      execute: function () {
        CAN_NOT_DISPLAY = "[Cannot display]";
        AssertionError = class AssertionError extends Error {
          constructor(message) {
            super(message);
            this.name = "AssertionError";
          }
        };
        exports_6("AssertionError", AssertionError);
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/_constants",
  [],
  function (exports_7, context_7) {
    "use strict";
    var CHAR_UPPERCASE_A,
      CHAR_LOWERCASE_A,
      CHAR_UPPERCASE_Z,
      CHAR_LOWERCASE_Z,
      CHAR_DOT,
      CHAR_FORWARD_SLASH,
      CHAR_BACKWARD_SLASH,
      CHAR_VERTICAL_LINE,
      CHAR_COLON,
      CHAR_QUESTION_MARK,
      CHAR_UNDERSCORE,
      CHAR_LINE_FEED,
      CHAR_CARRIAGE_RETURN,
      CHAR_TAB,
      CHAR_FORM_FEED,
      CHAR_EXCLAMATION_MARK,
      CHAR_HASH,
      CHAR_SPACE,
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE,
      CHAR_LEFT_SQUARE_BRACKET,
      CHAR_RIGHT_SQUARE_BRACKET,
      CHAR_LEFT_ANGLE_BRACKET,
      CHAR_RIGHT_ANGLE_BRACKET,
      CHAR_LEFT_CURLY_BRACKET,
      CHAR_RIGHT_CURLY_BRACKET,
      CHAR_HYPHEN_MINUS,
      CHAR_PLUS,
      CHAR_DOUBLE_QUOTE,
      CHAR_SINGLE_QUOTE,
      CHAR_PERCENT,
      CHAR_SEMICOLON,
      CHAR_CIRCUMFLEX_ACCENT,
      CHAR_GRAVE_ACCENT,
      CHAR_AT,
      CHAR_AMPERSAND,
      CHAR_EQUAL,
      CHAR_0,
      CHAR_9,
      navigator,
      isWindows;
    var __moduleName = context_7 && context_7.id;
    return {
      setters: [],
      execute: function () {
        // Alphabet chars.
        exports_7("CHAR_UPPERCASE_A", CHAR_UPPERCASE_A = 65); /* A */
        exports_7("CHAR_LOWERCASE_A", CHAR_LOWERCASE_A = 97); /* a */
        exports_7("CHAR_UPPERCASE_Z", CHAR_UPPERCASE_Z = 90); /* Z */
        exports_7("CHAR_LOWERCASE_Z", CHAR_LOWERCASE_Z = 122); /* z */
        // Non-alphabetic chars.
        exports_7("CHAR_DOT", CHAR_DOT = 46); /* . */
        exports_7("CHAR_FORWARD_SLASH", CHAR_FORWARD_SLASH = 47); /* / */
        exports_7("CHAR_BACKWARD_SLASH", CHAR_BACKWARD_SLASH = 92); /* \ */
        exports_7("CHAR_VERTICAL_LINE", CHAR_VERTICAL_LINE = 124); /* | */
        exports_7("CHAR_COLON", CHAR_COLON = 58); /* : */
        exports_7("CHAR_QUESTION_MARK", CHAR_QUESTION_MARK = 63); /* ? */
        exports_7("CHAR_UNDERSCORE", CHAR_UNDERSCORE = 95); /* _ */
        exports_7("CHAR_LINE_FEED", CHAR_LINE_FEED = 10); /* \n */
        exports_7("CHAR_CARRIAGE_RETURN", CHAR_CARRIAGE_RETURN = 13); /* \r */
        exports_7("CHAR_TAB", CHAR_TAB = 9); /* \t */
        exports_7("CHAR_FORM_FEED", CHAR_FORM_FEED = 12); /* \f */
        exports_7("CHAR_EXCLAMATION_MARK", CHAR_EXCLAMATION_MARK = 33); /* ! */
        exports_7("CHAR_HASH", CHAR_HASH = 35); /* # */
        exports_7("CHAR_SPACE", CHAR_SPACE = 32); /*   */
        exports_7(
          "CHAR_NO_BREAK_SPACE",
          CHAR_NO_BREAK_SPACE = 160,
        ); /* \u00A0 */
        exports_7(
          "CHAR_ZERO_WIDTH_NOBREAK_SPACE",
          CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279,
        ); /* \uFEFF */
        exports_7(
          "CHAR_LEFT_SQUARE_BRACKET",
          CHAR_LEFT_SQUARE_BRACKET = 91,
        ); /* [ */
        exports_7(
          "CHAR_RIGHT_SQUARE_BRACKET",
          CHAR_RIGHT_SQUARE_BRACKET = 93,
        ); /* ] */
        exports_7(
          "CHAR_LEFT_ANGLE_BRACKET",
          CHAR_LEFT_ANGLE_BRACKET = 60,
        ); /* < */
        exports_7(
          "CHAR_RIGHT_ANGLE_BRACKET",
          CHAR_RIGHT_ANGLE_BRACKET = 62,
        ); /* > */
        exports_7(
          "CHAR_LEFT_CURLY_BRACKET",
          CHAR_LEFT_CURLY_BRACKET = 123,
        ); /* { */
        exports_7(
          "CHAR_RIGHT_CURLY_BRACKET",
          CHAR_RIGHT_CURLY_BRACKET = 125,
        ); /* } */
        exports_7("CHAR_HYPHEN_MINUS", CHAR_HYPHEN_MINUS = 45); /* - */
        exports_7("CHAR_PLUS", CHAR_PLUS = 43); /* + */
        exports_7("CHAR_DOUBLE_QUOTE", CHAR_DOUBLE_QUOTE = 34); /* " */
        exports_7("CHAR_SINGLE_QUOTE", CHAR_SINGLE_QUOTE = 39); /* ' */
        exports_7("CHAR_PERCENT", CHAR_PERCENT = 37); /* % */
        exports_7("CHAR_SEMICOLON", CHAR_SEMICOLON = 59); /* ; */
        exports_7(
          "CHAR_CIRCUMFLEX_ACCENT",
          CHAR_CIRCUMFLEX_ACCENT = 94,
        ); /* ^ */
        exports_7("CHAR_GRAVE_ACCENT", CHAR_GRAVE_ACCENT = 96); /* ` */
        exports_7("CHAR_AT", CHAR_AT = 64); /* @ */
        exports_7("CHAR_AMPERSAND", CHAR_AMPERSAND = 38); /* & */
        exports_7("CHAR_EQUAL", CHAR_EQUAL = 61); /* = */
        // Digits
        exports_7("CHAR_0", CHAR_0 = 48); /* 0 */
        exports_7("CHAR_9", CHAR_9 = 57); /* 9 */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigator = globalThis.navigator;
        isWindows = false;
        exports_7("isWindows", isWindows);
        if (globalThis.Deno != null) {
          exports_7("isWindows", isWindows = Deno.build.os == "windows");
        } else if (navigator?.appVersion != null) {
          exports_7(
            "isWindows",
            isWindows = navigator.appVersion.includes("Win"),
          );
        }
      },
    };
  },
);
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/_interface",
  [],
  function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/_util",
  ["https://deno.land/std/path/_constants"],
  function (exports_9, context_9) {
    "use strict";
    var _constants_ts_1;
    var __moduleName = context_9 && context_9.id;
    function assertPath(path) {
      if (typeof path !== "string") {
        throw new TypeError(
          `Path must be a string. Received ${JSON.stringify(path)}`,
        );
      }
    }
    exports_9("assertPath", assertPath);
    function isPosixPathSeparator(code) {
      return code === _constants_ts_1.CHAR_FORWARD_SLASH;
    }
    exports_9("isPosixPathSeparator", isPosixPathSeparator);
    function isPathSeparator(code) {
      return isPosixPathSeparator(code) ||
        code === _constants_ts_1.CHAR_BACKWARD_SLASH;
    }
    exports_9("isPathSeparator", isPathSeparator);
    function isWindowsDeviceRoot(code) {
      return ((code >= _constants_ts_1.CHAR_LOWERCASE_A &&
        code <= _constants_ts_1.CHAR_LOWERCASE_Z) ||
        (code >= _constants_ts_1.CHAR_UPPERCASE_A &&
          code <= _constants_ts_1.CHAR_UPPERCASE_Z));
    }
    exports_9("isWindowsDeviceRoot", isWindowsDeviceRoot);
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
      let res = "";
      let lastSegmentLength = 0;
      let lastSlash = -1;
      let dots = 0;
      let code;
      for (let i = 0, len = path.length; i <= len; ++i) {
        if (i < len) {
          code = path.charCodeAt(i);
        } else if (isPathSeparator(code)) {
          break;
        } else {
          code = _constants_ts_1.CHAR_FORWARD_SLASH;
        }
        if (isPathSeparator(code)) {
          if (lastSlash === i - 1 || dots === 1) {
            // NOOP
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (
              res.length < 2 ||
              lastSegmentLength !== 2 ||
              res.charCodeAt(res.length - 1) !== _constants_ts_1.CHAR_DOT ||
              res.charCodeAt(res.length - 2) !== _constants_ts_1.CHAR_DOT
            ) {
              if (res.length > 2) {
                const lastSlashIndex = res.lastIndexOf(separator);
                if (lastSlashIndex === -1) {
                  res = "";
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 -
                    res.lastIndexOf(separator);
                }
                lastSlash = i;
                dots = 0;
                continue;
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0) {
                res += `${separator}..`;
              } else {
                res = "..";
              }
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0) {
              res += separator + path.slice(lastSlash + 1, i);
            } else {
              res = path.slice(lastSlash + 1, i);
            }
            lastSegmentLength = i - lastSlash - 1;
          }
          lastSlash = i;
          dots = 0;
        } else if (code === _constants_ts_1.CHAR_DOT && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    exports_9("normalizeString", normalizeString);
    function _format(sep, pathObject) {
      const dir = pathObject.dir || pathObject.root;
      const base = pathObject.base ||
        (pathObject.name || "") + (pathObject.ext || "");
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep + base;
    }
    exports_9("_format", _format);
    return {
      setters: [
        function (_constants_ts_1_1) {
          _constants_ts_1 = _constants_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/win32",
  [
    "https://deno.land/std/path/_constants",
    "https://deno.land/std/path/_util",
    "https://deno.land/std/testing/asserts",
  ],
  function (exports_10, context_10) {
    "use strict";
    var _constants_ts_2, _util_ts_1, asserts_ts_1, sep, delimiter;
    var __moduleName = context_10 && context_10.id;
    function resolve(...pathSegments) {
      let resolvedDevice = "";
      let resolvedTail = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else if (!resolvedDevice) {
          if (globalThis.Deno == null) {
            throw new TypeError(
              "Resolved a drive-letter-less path without a CWD.",
            );
          }
          path = Deno.cwd();
        } else {
          if (globalThis.Deno == null) {
            throw new TypeError("Resolved a relative path without a CWD.");
          }
          // Windows has the concept of drive-specific current working
          // directories. If we've resolved a drive letter but not yet an
          // absolute path, get cwd for that drive, or the process cwd if
          // the drive cwd is not available. We're sure the device is not
          // a UNC path at this points, because UNC paths are always absolute.
          path = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
          // Verify that a cwd was found and that it actually points
          // to our drive. If not, default to the drive's root.
          if (
            path === undefined ||
            path.slice(0, 3).toLowerCase() !==
              `${resolvedDevice.toLowerCase()}\\`
          ) {
            path = `${resolvedDevice}\\`;
          }
        }
        _util_ts_1.assertPath(path);
        const len = path.length;
        // Skip empty entries
        if (len === 0) {
          continue;
        }
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
          if (_util_ts_1.isPathSeparator(code)) {
            // Possible UNC root
            // If we started with a separator, we know we at least have an
            // absolute path of some kind (UNC or otherwise)
            isAbsolute = true;
            if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
              // Matched double path separator at beginning
              let j = 2;
              let last = j;
              // Match 1 or more non-path separators
              for (; j < len; ++j) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                const firstPart = path.slice(last, j);
                // Matched!
                last = j;
                // Match 1 or more path separators
                for (; j < len; ++j) {
                  if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j < len && j !== last) {
                  // Matched!
                  last = j;
                  // Match 1 or more non-path separators
                  for (; j < len; ++j) {
                    if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                      break;
                    }
                  }
                  if (j === len) {
                    // We matched a UNC root only
                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                    rootEnd = j;
                  } else if (j !== last) {
                    // We matched a UNC root with leftovers
                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                    rootEnd = j;
                  }
                }
              }
            } else {
              rootEnd = 1;
            }
          } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
            // Possible device root
            if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
              device = path.slice(0, 2);
              rootEnd = 2;
              if (len > 2) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                  // Treat separator following drive name as an absolute path
                  // indicator
                  isAbsolute = true;
                  rootEnd = 3;
                }
              }
            }
          }
        } else if (_util_ts_1.isPathSeparator(code)) {
          // `path` contains just a path separator
          rootEnd = 1;
          isAbsolute = true;
        }
        if (
          device.length > 0 &&
          resolvedDevice.length > 0 &&
          device.toLowerCase() !== resolvedDevice.toLowerCase()
        ) {
          // This path points to another device so it is not applicable
          continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
          resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
          resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
          resolvedAbsolute = isAbsolute;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) {
          break;
        }
      }
      // At this point the path should be resolved to a full absolute path,
      // but handle relative paths to be safe (might happen when process.cwd()
      // fails)
      // Normalize the tail path
      resolvedTail = _util_ts_1.normalizeString(
        resolvedTail,
        !resolvedAbsolute,
        "\\",
        _util_ts_1.isPathSeparator,
      );
      return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail ||
        ".";
    }
    exports_10("resolve", resolve);
    function normalize(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = 0;
      let device;
      let isAbsolute = false;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          // If we started with a separator, we know we at least have an absolute
          // path of some kind (UNC or otherwise)
          isAbsolute = true;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              const firstPart = path.slice(last, j);
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  // Return the normalized version of the UNC root since there
                  // is nothing left to process
                  return `\\\\${firstPart}\\${path.slice(last)}\\`;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                  rootEnd = j;
                }
              }
            }
          } else {
            rootEnd = 1;
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            device = path.slice(0, 2);
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                // Treat separator following drive name as an absolute path
                // indicator
                isAbsolute = true;
                rootEnd = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid unnecessary
        // work
        return "\\";
      }
      let tail;
      if (rootEnd < len) {
        tail = _util_ts_1.normalizeString(
          path.slice(rootEnd),
          !isAbsolute,
          "\\",
          _util_ts_1.isPathSeparator,
        );
      } else {
        tail = "";
      }
      if (tail.length === 0 && !isAbsolute) {
        tail = ".";
      }
      if (
        tail.length > 0 &&
        _util_ts_1.isPathSeparator(path.charCodeAt(len - 1))
      ) {
        tail += "\\";
      }
      if (device === undefined) {
        if (isAbsolute) {
          if (tail.length > 0) {
            return `\\${tail}`;
          } else {
            return "\\";
          }
        } else if (tail.length > 0) {
          return tail;
        } else {
          return "";
        }
      } else if (isAbsolute) {
        if (tail.length > 0) {
          return `${device}\\${tail}`;
        } else {
          return `${device}\\`;
        }
      } else if (tail.length > 0) {
        return device + tail;
      } else {
        return device;
      }
    }
    exports_10("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return false;
      }
      const code = path.charCodeAt(0);
      if (_util_ts_1.isPathSeparator(code)) {
        return true;
      } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
        // Possible device root
        if (len > 2 && path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
            return true;
          }
        }
      }
      return false;
    }
    exports_10("isAbsolute", isAbsolute);
    function join(...paths) {
      const pathsCount = paths.length;
      if (pathsCount === 0) {
        return ".";
      }
      let joined;
      let firstPart = null;
      for (let i = 0; i < pathsCount; ++i) {
        const path = paths[i];
        _util_ts_1.assertPath(path);
        if (path.length > 0) {
          if (joined === undefined) {
            joined = firstPart = path;
          } else {
            joined += `\\${path}`;
          }
        }
      }
      if (joined === undefined) {
        return ".";
      }
      // Make sure that the joined path doesn't start with two slashes, because
      // normalize() will mistake it for an UNC path then.
      //
      // This step is skipped when it is very clear that the user actually
      // intended to point at an UNC path. This is assumed when the first
      // non-empty string arguments starts with exactly two slashes followed by
      // at least one more non-slash character.
      //
      // Note that for normalize() to treat a path as an UNC path it needs to
      // have at least 2 components, so we don't filter for that here.
      // This means that the user can use join to construct UNC paths from
      // a server name and a share name; for example:
      //   path.join('//server', 'share') -> '\\\\server\\share\\')
      let needsReplace = true;
      let slashCount = 0;
      asserts_ts_1.assert(firstPart != null);
      if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
          if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(1))) {
            ++slashCount;
            if (firstLen > 2) {
              if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(2))) {
                ++slashCount;
              } else {
                // We matched a UNC path in the first part
                needsReplace = false;
              }
            }
          }
        }
      }
      if (needsReplace) {
        // Find any more consecutive slashes we need to replace
        for (; slashCount < joined.length; ++slashCount) {
          if (!_util_ts_1.isPathSeparator(joined.charCodeAt(slashCount))) {
            break;
          }
        }
        // Replace the slashes if needed
        if (slashCount >= 2) {
          joined = `\\${joined.slice(slashCount)}`;
        }
      }
      return normalize(joined);
    }
    exports_10("join", join);
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    function relative(from, to) {
      _util_ts_1.assertPath(from);
      _util_ts_1.assertPath(to);
      if (from === to) {
        return "";
      }
      const fromOrig = resolve(from);
      const toOrig = resolve(to);
      if (fromOrig === toOrig) {
        return "";
      }
      from = fromOrig.toLowerCase();
      to = toOrig.toLowerCase();
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 0;
      let fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (
          from.charCodeAt(fromStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; fromEnd - 1 > fromStart; --fromEnd) {
        if (
          from.charCodeAt(fromEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 0;
      let toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; toEnd - 1 > toStart; --toEnd) {
        if (to.charCodeAt(toEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
              return toOrig.slice(toStart + i + 1);
            } else if (i === 2) {
              // We get here if `from` is the device root.
              // For example: from='C:\\'; to='C:\\foo'
              return toOrig.slice(toStart + i);
            }
          }
          if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo'
              lastCommonSep = i;
            } else if (i === 2) {
              // We get here if `to` is the device root.
              // For example: from='C:\\foo\\bar'; to='C:\\'
              lastCommonSep = 3;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_2.CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      // We found a mismatch before the first common path separator was seen, so
      // return the original `to`.
      if (i !== length && lastCommonSep === -1) {
        return toOrig;
      }
      let out = "";
      if (lastCommonSep === -1) {
        lastCommonSep = 0;
      }
      // Generate the relative path based on the path difference between `to` and
      // `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "\\..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
      } else {
        toStart += lastCommonSep;
        if (
          toOrig.charCodeAt(toStart) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          ++toStart;
        }
        return toOrig.slice(toStart, toEnd);
      }
    }
    exports_10("relative", relative);
    function toNamespacedPath(path) {
      // Note: this will *probably* throw somewhere.
      if (typeof path !== "string") {
        return path;
      }
      if (path.length === 0) {
        return "";
      }
      const resolvedPath = resolve(path);
      if (resolvedPath.length >= 3) {
        if (
          resolvedPath.charCodeAt(0) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          // Possible UNC root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            const code = resolvedPath.charCodeAt(2);
            if (
              code !== _constants_ts_2.CHAR_QUESTION_MARK &&
              code !== _constants_ts_2.CHAR_DOT
            ) {
              // Matched non-long UNC root, convert the path to a long UNC path
              return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
          // Possible device root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
            resolvedPath.charCodeAt(2) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            // Matched device root, convert the path to a long UNC path
            return `\\\\?\\${resolvedPath}`;
          }
        }
      }
      return path;
    }
    exports_10("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = -1;
      let end = -1;
      let matchedSlash = true;
      let offset = 0;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = offset = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  return path;
                }
                if (j !== last) {
                  // We matched a UNC root with leftovers
                  // Offset by 1 to include the separator after the UNC root to
                  // treat it as a "normal root" on top of a (UNC) root
                  rootEnd = offset = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = offset = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                rootEnd = offset = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        return path;
      }
      for (let i = len - 1; i >= offset; --i) {
        if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        if (rootEnd === -1) {
          return ".";
        } else {
          end = rootEnd;
        }
      }
      return path.slice(0, end);
    }
    exports_10("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_1.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (_util_ts_1.isWindowsDeviceRoot(drive)) {
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            start = 2;
          }
        }
      }
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= start; --i) {
          const code = path.charCodeAt(i);
          if (_util_ts_1.isPathSeparator(code)) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= start; --i) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_10("basename", basename);
    function extname(path) {
      _util_ts_1.assertPath(path);
      let start = 0;
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (
        path.length >= 2 &&
        path.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
        _util_ts_1.isWindowsDeviceRoot(path.charCodeAt(0))
      ) {
        start = startPart = 2;
      }
      for (let i = path.length - 1; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_10("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_1._format("\\", pathObject);
    }
    exports_10("format", format);
    function parse(path) {
      _util_ts_1.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      const len = path.length;
      if (len === 0) {
        return ret;
      }
      let rootEnd = 0;
      let code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  rootEnd = j;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  rootEnd = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                if (len === 3) {
                  // `path` contains just a drive root, exit early to avoid
                  // unnecessary work
                  ret.root = ret.dir = path;
                  return ret;
                }
                rootEnd = 3;
              }
            } else {
              // `path` contains just a drive root, exit early to avoid
              // unnecessary work
              ret.root = ret.dir = path;
              return ret;
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        ret.root = ret.dir = path;
        return ret;
      }
      if (rootEnd > 0) {
        ret.root = path.slice(0, rootEnd);
      }
      let startDot = -1;
      let startPart = rootEnd;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= rootEnd; --i) {
        code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          ret.base = ret.name = path.slice(startPart, end);
        }
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
      }
      // If the directory is the root, use the entire root as the `dir` including
      // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
      // trailing slash (`C:\abc\def` -> `C:\abc`).
      if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
      } else {
        ret.dir = ret.root;
      }
      return ret;
    }
    exports_10("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///C:/Users/foo"); // "C:\\Users\\foo"
     *      fromFileUrl("file:///home/foo"); // "\\home\\foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname
        .replace(/^\/*([A-Za-z]:)(\/|$)/, "$1/")
        .replace(/\//g, "\\");
    }
    exports_10("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_2_1) {
          _constants_ts_2 = _constants_ts_2_1;
        },
        function (_util_ts_1_1) {
          _util_ts_1 = _util_ts_1_1;
        },
        function (asserts_ts_1_1) {
          asserts_ts_1 = asserts_ts_1_1;
        },
      ],
      execute: function () {
        exports_10("sep", sep = "\\");
        exports_10("delimiter", delimiter = ";");
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/posix",
  ["https://deno.land/std/path/_constants", "https://deno.land/std/path/_util"],
  function (exports_11, context_11) {
    "use strict";
    var _constants_ts_3, _util_ts_2, sep, delimiter;
    var __moduleName = context_11 && context_11.id;
    // path.resolve([from ...], to)
    function resolve(...pathSegments) {
      let resolvedPath = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else {
          if (globalThis.Deno == null) {
            throw new TypeError("Resolved a relative path without a CWD.");
          }
          path = Deno.cwd();
        }
        _util_ts_2.assertPath(path);
        // Skip empty entries
        if (path.length === 0) {
          continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute =
          path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      }
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
      // Normalize the path
      resolvedPath = _util_ts_2.normalizeString(
        resolvedPath,
        !resolvedAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (resolvedAbsolute) {
        if (resolvedPath.length > 0) {
          return `/${resolvedPath}`;
        } else {
          return "/";
        }
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return ".";
      }
    }
    exports_11("resolve", resolve);
    function normalize(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      const trailingSeparator =
        path.charCodeAt(path.length - 1) === _constants_ts_3.CHAR_FORWARD_SLASH;
      // Normalize the path
      path = _util_ts_2.normalizeString(
        path,
        !isAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (path.length === 0 && !isAbsolute) {
        path = ".";
      }
      if (path.length > 0 && trailingSeparator) {
        path += "/";
      }
      if (isAbsolute) {
        return `/${path}`;
      }
      return path;
    }
    exports_11("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_2.assertPath(path);
      return path.length > 0 &&
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
    }
    exports_11("isAbsolute", isAbsolute);
    function join(...paths) {
      if (paths.length === 0) {
        return ".";
      }
      let joined;
      for (let i = 0, len = paths.length; i < len; ++i) {
        const path = paths[i];
        _util_ts_2.assertPath(path);
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `/${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalize(joined);
    }
    exports_11("join", join);
    function relative(from, to) {
      _util_ts_2.assertPath(from);
      _util_ts_2.assertPath(to);
      if (from === to) {
        return "";
      }
      from = resolve(from);
      to = resolve(to);
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 1;
      const fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (from.charCodeAt(fromStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 1;
      const toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='/foo/bar'; to='/foo/bar/baz'
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
              // We get here if `from` is the root
              // For example: from='/'; to='/foo'
              return to.slice(toStart + i);
            }
          } else if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='/foo/bar/baz'; to='/foo/bar'
              lastCommonSep = i;
            } else if (i === 0) {
              // We get here if `to` is the root.
              // For example: from='/foo'; to='/'
              lastCommonSep = 0;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_3.CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      let out = "";
      // Generate the relative path based on the path difference between `to`
      // and `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "/..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + to.slice(toStart + lastCommonSep);
      } else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          ++toStart;
        }
        return to.slice(toStart);
      }
    }
    exports_11("relative", relative);
    function toNamespacedPath(path) {
      // Non-op on posix systems
      return path;
    }
    exports_11("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const hasRoot = path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let end = -1;
      let matchedSlash = true;
      for (let i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        return hasRoot ? "/" : ".";
      }
      if (hasRoot && end === 1) {
        return "//";
      }
      return path.slice(0, end);
    }
    exports_11("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_2.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          const code = path.charCodeAt(i);
          if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= 0; --i) {
          if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_11("basename", basename);
    function extname(path) {
      _util_ts_2.assertPath(path);
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      for (let i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_11("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_2._format("/", pathObject);
    }
    exports_11("format", format);
    function parse(path) {
      _util_ts_2.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) {
        return ret;
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let start;
      if (isAbsolute) {
        ret.root = "/";
        start = 1;
      } else {
        start = 0;
      }
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          if (startPart === 0 && isAbsolute) {
            ret.base = ret.name = path.slice(1, end);
          } else {
            ret.base = ret.name = path.slice(startPart, end);
          }
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path.slice(1, startDot);
          ret.base = path.slice(1, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
      }
      if (startPart > 0) {
        ret.dir = path.slice(0, startPart - 1);
      } else if (isAbsolute) {
        ret.dir = "/";
      }
      return ret;
    }
    exports_11("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///home/foo"); // "/home/foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname;
    }
    exports_11("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_3_1) {
          _constants_ts_3 = _constants_ts_3_1;
        },
        function (_util_ts_2_1) {
          _util_ts_2 = _util_ts_2_1;
        },
      ],
      execute: function () {
        exports_11("sep", sep = "/");
        exports_11("delimiter", delimiter = ":");
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/separator",
  ["https://deno.land/std/path/_constants"],
  function (exports_12, context_12) {
    "use strict";
    var _constants_ts_4, SEP, SEP_PATTERN;
    var __moduleName = context_12 && context_12.id;
    return {
      setters: [
        function (_constants_ts_4_1) {
          _constants_ts_4 = _constants_ts_4_1;
        },
      ],
      execute: function () {
        exports_12("SEP", SEP = _constants_ts_4.isWindows ? "\\" : "/");
        exports_12(
          "SEP_PATTERN",
          SEP_PATTERN = _constants_ts_4.isWindows ? /[\\/]+/ : /\/+/,
        );
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/common",
  ["https://deno.land/std/path/separator"],
  function (exports_13, context_13) {
    "use strict";
    var separator_ts_1;
    var __moduleName = context_13 && context_13.id;
    /** Determines the common path from a set of paths, using an optional separator,
     * which defaults to the OS default separator.
     *
     *       import { common } from "https://deno.land/std/path/mod.ts";
     *       const p = common([
     *         "./deno/std/path/mod.ts",
     *         "./deno/std/fs/mod.ts",
     *       ]);
     *       console.log(p); // "./deno/std/"
     *
     */
    function common(paths, sep = separator_ts_1.SEP) {
      const [first = "", ...remaining] = paths;
      if (first === "" || remaining.length === 0) {
        return first.substring(0, first.lastIndexOf(sep) + 1);
      }
      const parts = first.split(sep);
      let endOfPrefix = parts.length;
      for (const path of remaining) {
        const compare = path.split(sep);
        for (let i = 0; i < endOfPrefix; i++) {
          if (compare[i] !== parts[i]) {
            endOfPrefix = i;
          }
        }
        if (endOfPrefix === 0) {
          return "";
        }
      }
      const prefix = parts.slice(0, endOfPrefix).join(sep);
      return prefix.endsWith(sep) ? prefix : `${prefix}${sep}`;
    }
    exports_13("common", common);
    return {
      setters: [
        function (separator_ts_1_1) {
          separator_ts_1 = separator_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// This file is ported from globrex@0.1.2
// MIT License
// Copyright (c) 2018 Terkel Gjervig Nielsen
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/_globrex",
  ["https://deno.land/std/path/_constants"],
  function (exports_14, context_14) {
    "use strict";
    var _constants_ts_5,
      SEP,
      SEP_ESC,
      SEP_RAW,
      GLOBSTAR,
      WILDCARD,
      GLOBSTAR_SEGMENT,
      WILDCARD_SEGMENT;
    var __moduleName = context_14 && context_14.id;
    /**
     * Convert any glob pattern to a JavaScript Regexp object
     * @param glob Glob pattern to convert
     * @param opts Configuration object
     * @returns Converted object with string, segments and RegExp object
     */
    function globrex(
      glob,
      {
        extended = false,
        globstar = false,
        strict = false,
        filepath = false,
        flags = "",
      } = {},
    ) {
      const sepPattern = new RegExp(`^${SEP}${strict ? "" : "+"}$`);
      let regex = "";
      let segment = "";
      let pathRegexStr = "";
      const pathSegments = [];
      // If we are doing extended matching, this boolean is true when we are inside
      // a group (eg {*.html,*.js}), and false otherwise.
      let inGroup = false;
      let inRange = false;
      // extglob stack. Keep track of scope
      const ext = [];
      // Helper function to build string and segments
      function add(str, options = { split: false, last: false, only: "" }) {
        const { split, last, only } = options;
        if (only !== "path") {
          regex += str;
        }
        if (filepath && only !== "regex") {
          pathRegexStr += str.match(sepPattern) ? SEP : str;
          if (split) {
            if (last) {
              segment += str;
            }
            if (segment !== "") {
              // change it 'includes'
              if (!flags.includes("g")) {
                segment = `^${segment}$`;
              }
              pathSegments.push(new RegExp(segment, flags));
            }
            segment = "";
          } else {
            segment += str;
          }
        }
      }
      let c, n;
      for (let i = 0; i < glob.length; i++) {
        c = glob[i];
        n = glob[i + 1];
        if (["\\", "$", "^", ".", "="].includes(c)) {
          add(`\\${c}`);
          continue;
        }
        if (c.match(sepPattern)) {
          add(SEP, { split: true });
          if (n != null && n.match(sepPattern) && !strict) {
            regex += "?";
          }
          continue;
        }
        if (c === "(") {
          if (ext.length) {
            add(`${c}?:`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ")") {
          if (ext.length) {
            add(c);
            const type = ext.pop();
            if (type === "@") {
              add("{1}");
            } else if (type === "!") {
              add(WILDCARD);
            } else {
              add(type);
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "|") {
          if (ext.length) {
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "+") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "@" && extended) {
          if (n === "(") {
            ext.push(c);
            continue;
          }
        }
        if (c === "!") {
          if (extended) {
            if (inRange) {
              add("^");
              continue;
            }
            if (n === "(") {
              ext.push(c);
              add("(?!");
              i++;
              continue;
            }
            add(`\\${c}`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "?") {
          if (extended) {
            if (n === "(") {
              ext.push(c);
            } else {
              add(".");
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "[") {
          if (inRange && n === ":") {
            i++; // skip [
            let value = "";
            while (glob[++i] !== ":") {
              value += glob[i];
            }
            if (value === "alnum") {
              add("(?:\\w|\\d)");
            } else if (value === "space") {
              add("\\s");
            } else if (value === "digit") {
              add("\\d");
            }
            i++; // skip last ]
            continue;
          }
          if (extended) {
            inRange = true;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "]") {
          if (extended) {
            inRange = false;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "{") {
          if (extended) {
            inGroup = true;
            add("(?:");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "}") {
          if (extended) {
            inGroup = false;
            add(")");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ",") {
          if (inGroup) {
            add("|");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "*") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          // Move over all consecutive "*"'s.
          // Also store the previous and next characters
          const prevChar = glob[i - 1];
          let starCount = 1;
          while (glob[i + 1] === "*") {
            starCount++;
            i++;
          }
          const nextChar = glob[i + 1];
          if (!globstar) {
            // globstar is disabled, so treat any number of "*" as one
            add(".*");
          } else {
            // globstar is enabled, so determine if this is a globstar segment
            const isGlobstar = starCount > 1 && // multiple "*"'s
              // from the start of the segment
              [SEP_RAW, "/", undefined].includes(prevChar) &&
              // to the end of the segment
              [SEP_RAW, "/", undefined].includes(nextChar);
            if (isGlobstar) {
              // it's a globstar, so match zero or more path segments
              add(GLOBSTAR, { only: "regex" });
              add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
              i++; // move over the "/"
            } else {
              // it's not a globstar, so only match one path segment
              add(WILDCARD, { only: "regex" });
              add(WILDCARD_SEGMENT, { only: "path" });
            }
          }
          continue;
        }
        add(c);
      }
      // When regexp 'g' flag is specified don't
      // constrain the regular expression with ^ & $
      if (!flags.includes("g")) {
        regex = `^${regex}$`;
        segment = `^${segment}$`;
        if (filepath) {
          pathRegexStr = `^${pathRegexStr}$`;
        }
      }
      const result = { regex: new RegExp(regex, flags) };
      // Push the last segment
      if (filepath) {
        pathSegments.push(new RegExp(segment, flags));
        result.path = {
          regex: new RegExp(pathRegexStr, flags),
          segments: pathSegments,
          globstar: new RegExp(
            !flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT,
            flags,
          ),
        };
      }
      return result;
    }
    exports_14("globrex", globrex);
    return {
      setters: [
        function (_constants_ts_5_1) {
          _constants_ts_5 = _constants_ts_5_1;
        },
      ],
      execute: function () {
        SEP = _constants_ts_5.isWindows ? `(?:\\\\|\\/)` : `\\/`;
        SEP_ESC = _constants_ts_5.isWindows ? `\\\\` : `/`;
        SEP_RAW = _constants_ts_5.isWindows ? `\\` : `/`;
        GLOBSTAR = `(?:(?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD = `(?:[^${SEP_ESC}/]*)`;
        GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD_SEGMENT = `(?:[^${SEP_ESC}/]*)`;
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/glob",
  [
    "https://deno.land/std/path/separator",
    "https://deno.land/std/path/_globrex",
    "https://deno.land/std/path/mod",
    "https://deno.land/std/testing/asserts",
  ],
  function (exports_15, context_15) {
    "use strict";
    var separator_ts_2, _globrex_ts_1, mod_ts_1, asserts_ts_2;
    var __moduleName = context_15 && context_15.id;
    /**
     * Generate a regex based on glob pattern and options
     * This was meant to be using the the `fs.walk` function
     * but can be used anywhere else.
     * Examples:
     *
     *     Looking for all the `ts` files:
     *     walkSync(".", {
     *       match: [globToRegExp("*.ts")]
     *     })
     *
     *     Looking for all the `.json` files in any subfolder:
     *     walkSync(".", {
     *       match: [globToRegExp(join("a", "**", "*.json"),{
     *         flags: "g",
     *         extended: true,
     *         globstar: true
     *       })]
     *     })
     *
     * @param glob - Glob pattern to be used
     * @param options - Specific options for the glob pattern
     * @returns A RegExp for the glob pattern
     */
    function globToRegExp(glob, { extended = false, globstar = true } = {}) {
      const result = _globrex_ts_1.globrex(glob, {
        extended,
        globstar,
        strict: false,
        filepath: true,
      });
      asserts_ts_2.assert(result.path != null);
      return result.path.regex;
    }
    exports_15("globToRegExp", globToRegExp);
    /** Test whether the given string is a glob */
    function isGlob(str) {
      const chars = { "{": "}", "(": ")", "[": "]" };
      /* eslint-disable-next-line max-len */
      const regex =
        /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
      if (str === "") {
        return false;
      }
      let match;
      while ((match = regex.exec(str))) {
        if (match[2]) {
          return true;
        }
        let idx = match.index + match[0].length;
        // if an open bracket/brace/paren is escaped,
        // set the index to the next closing character
        const open = match[1];
        const close = open ? chars[open] : null;
        if (open && close) {
          const n = str.indexOf(close, idx);
          if (n !== -1) {
            idx = n + 1;
          }
        }
        str = str.slice(idx);
      }
      return false;
    }
    exports_15("isGlob", isGlob);
    /** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
    function normalizeGlob(glob, { globstar = false } = {}) {
      if (!!glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
      }
      if (!globstar) {
        return mod_ts_1.normalize(glob);
      }
      const s = separator_ts_2.SEP_PATTERN.source;
      const badParentPattern = new RegExp(
        `(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`,
        "g",
      );
      return mod_ts_1.normalize(glob.replace(badParentPattern, "\0")).replace(
        /\0/g,
        "..",
      );
    }
    exports_15("normalizeGlob", normalizeGlob);
    /** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
    function joinGlobs(globs, { extended = false, globstar = false } = {}) {
      if (!globstar || globs.length == 0) {
        return mod_ts_1.join(...globs);
      }
      if (globs.length === 0) {
        return ".";
      }
      let joined;
      for (const glob of globs) {
        const path = glob;
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `${separator_ts_2.SEP}${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalizeGlob(joined, { extended, globstar });
    }
    exports_15("joinGlobs", joinGlobs);
    return {
      setters: [
        function (separator_ts_2_1) {
          separator_ts_2 = separator_ts_2_1;
        },
        function (_globrex_ts_1_1) {
          _globrex_ts_1 = _globrex_ts_1_1;
        },
        function (mod_ts_1_1) {
          mod_ts_1 = mod_ts_1_1;
        },
        function (asserts_ts_2_1) {
          asserts_ts_2 = asserts_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
System.register(
  "https://deno.land/std/path/mod",
  [
    "https://deno.land/std/path/_constants",
    "https://deno.land/std/path/win32",
    "https://deno.land/std/path/posix",
    "https://deno.land/std/path/common",
    "https://deno.land/std/path/separator",
    "https://deno.land/std/path/_interface",
    "https://deno.land/std/path/glob",
  ],
  function (exports_16, context_16) {
    "use strict";
    var _constants_ts_6,
      _win32,
      _posix,
      path,
      win32,
      posix,
      basename,
      delimiter,
      dirname,
      extname,
      format,
      fromFileUrl,
      isAbsolute,
      join,
      normalize,
      parse,
      relative,
      resolve,
      sep,
      toNamespacedPath;
    var __moduleName = context_16 && context_16.id;
    var exportedNames_1 = {
      "win32": true,
      "posix": true,
      "basename": true,
      "delimiter": true,
      "dirname": true,
      "extname": true,
      "format": true,
      "fromFileUrl": true,
      "isAbsolute": true,
      "join": true,
      "normalize": true,
      "parse": true,
      "relative": true,
      "resolve": true,
      "sep": true,
      "toNamespacedPath": true,
      "SEP": true,
      "SEP_PATTERN": true,
    };
    function exportStar_1(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) {
          exports[n] = m[n];
        }
      }
      exports_16(exports);
    }
    return {
      setters: [
        function (_constants_ts_6_1) {
          _constants_ts_6 = _constants_ts_6_1;
        },
        function (_win32_1) {
          _win32 = _win32_1;
        },
        function (_posix_1) {
          _posix = _posix_1;
        },
        function (common_ts_1_1) {
          exportStar_1(common_ts_1_1);
        },
        function (separator_ts_3_1) {
          exports_16({
            "SEP": separator_ts_3_1["SEP"],
            "SEP_PATTERN": separator_ts_3_1["SEP_PATTERN"],
          });
        },
        function (_interface_ts_1_1) {
          exportStar_1(_interface_ts_1_1);
        },
        function (glob_ts_1_1) {
          exportStar_1(glob_ts_1_1);
        },
      ],
      execute: function () {
        path = _constants_ts_6.isWindows ? _win32 : _posix;
        exports_16("win32", win32 = _win32);
        exports_16("posix", posix = _posix);
        exports_16("basename", basename = path.basename),
          exports_16("delimiter", delimiter = path.delimiter),
          exports_16("dirname", dirname = path.dirname),
          exports_16("extname", extname = path.extname),
          exports_16("format", format = path.format),
          exports_16("fromFileUrl", fromFileUrl = path.fromFileUrl),
          exports_16("isAbsolute", isAbsolute = path.isAbsolute),
          exports_16("join", join = path.join),
          exports_16("normalize", normalize = path.normalize),
          exports_16("parse", parse = path.parse),
          exports_16("relative", relative = path.relative),
          exports_16("resolve", resolve = path.resolve),
          exports_16("sep", sep = path.sep),
          exports_16(
            "toNamespacedPath",
            toNamespacedPath = path.toNamespacedPath,
          );
      },
    };
  },
);
System.register(
  "https://deno.land/std/fs/walk",
  ["https://deno.land/std/testing/asserts", "https://deno.land/std/path/mod"],
  function (exports_17, context_17) {
    "use strict";
    var asserts_ts_3, mod_ts_2, readDir, readDirSync, stat, statSync;
    var __moduleName = context_17 && context_17.id;
    function createWalkEntrySync(path) {
      path = mod_ts_2.normalize(path);
      const name = mod_ts_2.basename(path);
      const info = statSync(path);
      return {
        path,
        name,
        isFile: info.isFile,
        isDirectory: info.isDirectory,
        isSymlink: info.isSymlink,
      };
    }
    exports_17("createWalkEntrySync", createWalkEntrySync);
    async function createWalkEntry(path) {
      path = mod_ts_2.normalize(path);
      const name = mod_ts_2.basename(path);
      const info = await stat(path);
      return {
        path,
        name,
        isFile: info.isFile,
        isDirectory: info.isDirectory,
        isSymlink: info.isSymlink,
      };
    }
    exports_17("createWalkEntry", createWalkEntry);
    function include(path, exts, match, skip) {
      if (exts && !exts.some((ext) => path.endsWith(ext))) {
        return false;
      }
      if (match && !match.some((pattern) => !!path.match(pattern))) {
        return false;
      }
      if (skip && skip.some((pattern) => !!path.match(pattern))) {
        return false;
      }
      return true;
    }
    /** Walks the file tree rooted at root, yielding each file or directory in the
     * tree filtered according to the given options. The files are walked in lexical
     * order, which makes the output deterministic but means that for very large
     * directories walk() can be inefficient.
     *
     * Options:
     * - maxDepth?: number = Infinity;
     * - includeFiles?: boolean = true;
     * - includeDirs?: boolean = true;
     * - followSymlinks?: boolean = false;
     * - exts?: string[];
     * - match?: RegExp[];
     * - skip?: RegExp[];
     *
     *      for await (const entry of walk(".")) {
     *        console.log(entry.path);
     *        assert(entry.isFile);
     *      };
     */
    async function* walk(
      root,
      {
        maxDepth = Infinity,
        includeFiles = true,
        includeDirs = true,
        followSymlinks = false,
        exts = undefined,
        match = undefined,
        skip = undefined,
      } = {},
    ) {
      if (maxDepth < 0) {
        return;
      }
      if (includeDirs && include(root, exts, match, skip)) {
        yield await createWalkEntry(root);
      }
      if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
      }
      for await (const entry of readDir(root)) {
        if (entry.isSymlink) {
          if (followSymlinks) {
            // TODO(ry) Re-enable followSymlinks.
            asserts_ts_3.unimplemented();
          } else {
            continue;
          }
        }
        asserts_ts_3.assert(entry.name != null);
        const path = mod_ts_2.join(root, entry.name);
        if (entry.isFile) {
          if (includeFiles && include(path, exts, match, skip)) {
            yield { path, ...entry };
          }
        } else {
          yield* walk(path, {
            maxDepth: maxDepth - 1,
            includeFiles,
            includeDirs,
            followSymlinks,
            exts,
            match,
            skip,
          });
        }
      }
    }
    exports_17("walk", walk);
    /** Same as walk() but uses synchronous ops */
    function* walkSync(
      root,
      {
        maxDepth = Infinity,
        includeFiles = true,
        includeDirs = true,
        followSymlinks = false,
        exts = undefined,
        match = undefined,
        skip = undefined,
      } = {},
    ) {
      if (maxDepth < 0) {
        return;
      }
      if (includeDirs && include(root, exts, match, skip)) {
        yield createWalkEntrySync(root);
      }
      if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
      }
      for (const entry of readDirSync(root)) {
        if (entry.isSymlink) {
          if (followSymlinks) {
            asserts_ts_3.unimplemented();
          } else {
            continue;
          }
        }
        asserts_ts_3.assert(entry.name != null);
        const path = mod_ts_2.join(root, entry.name);
        if (entry.isFile) {
          if (includeFiles && include(path, exts, match, skip)) {
            yield { path, ...entry };
          }
        } else {
          yield* walkSync(path, {
            maxDepth: maxDepth - 1,
            includeFiles,
            includeDirs,
            followSymlinks,
            exts,
            match,
            skip,
          });
        }
      }
    }
    exports_17("walkSync", walkSync);
    return {
      setters: [
        function (asserts_ts_3_1) {
          asserts_ts_3 = asserts_ts_3_1;
        },
        function (mod_ts_2_1) {
          mod_ts_2 = mod_ts_2_1;
        },
      ],
      execute: function () {
        readDir = Deno.readDir,
          readDirSync = Deno.readDirSync,
          stat = Deno.stat,
          statSync = Deno.statSync;
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/handlers/_loader",
  [
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Collection",
    "https://deno.land/std/fs/walk",
    "https://deno.land/std/fmt/colors",
  ],
  function (exports_18, context_18) {
    "use strict";
    var Collection_ts_1, walk_ts_1, colors_ts_2, EventHandler;
    var __moduleName = context_18 && context_18.id;
    return {
      setters: [
        function (Collection_ts_1_1) {
          Collection_ts_1 = Collection_ts_1_1;
        },
        function (walk_ts_1_1) {
          walk_ts_1 = walk_ts_1_1;
        },
        function (colors_ts_2_1) {
          colors_ts_2 = colors_ts_2_1;
        },
      ],
      execute: function () {
        EventHandler = class EventHandler {
          constructor(client) {
            this.client = client;
            this.handlers = new Collection_ts_1.default();
          }
          async load() {
            if (this.handlers.size > 0) {
              return;
            }
            for await (const f of walk_ts_1.walk("./handlers")) {
              if (
                !f.isFile ||
                !f.name.endsWith(".ts") ||
                ["_loader.ts", "index.ts"].includes(f.name)
              ) {
                continue;
              }
              const temp = await context_18.import(`./${f.name}`);
              if (!temp.default || typeof temp.default !== "function") {
                return;
              }
              this.handlers.set(
                f.name.split(".")[0],
                temp.default.bind(this.client),
              );
            }
          }
          async dispatch(payload) {
            if (!payload.t) {
              return;
            }
            this.client.metrics.putReceivedEvent(payload.t);
            if (
              !this.client.options.omittedDebugEvents?.includes(payload.t) &&
              this.client.options.debug
            ) {
              if (!(!this.client.ready && payload.t === "GUILD_CREATE")) {
                //@ts-ignore
                this.client.debugLog(
                  colors_ts_2.rgb24(
                    `Emit ${colors_ts_2.cyan(payload.t)}`,
                    { r: 255, g: 255, b: 0 },
                  ),
                );
              }
              // @ts-ignore
              /* 			console.log(this.client.metrics.receivedEvents);
                         */
            }
            const handler = this.handlers.get(payload.t);
            if (!handler) {
              return;
            }
            await handler(payload.d);
          }
        };
        exports_18("default", EventHandler);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/GuildChannel",
  [],
  function (exports_19, context_19) {
    "use strict";
    var GuildChannel;
    var __moduleName = context_19 && context_19.id;
    return {
      setters: [],
      execute: function () {
        GuildChannel = class GuildChannel {
          constructor(guild, data) {
            this.client = guild.client;
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
              switch (keys[i]) {
                case "guild_id":
                  this.guild = guild;
                  break;
                case "id":
                  this.id = data.id;
                  break;
                default:
                  Reflect.set(this, keys[i], data[keys[i]]);
                  break;
              }
            }
          }
        };
        exports_19("default", GuildChannel);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Role",
  [],
  function (exports_20, context_20) {
    "use strict";
    var Role;
    var __moduleName = context_20 && context_20.id;
    return {
      setters: [],
      execute: function () {
        Role = class Role {
          constructor(data) {
            const roleKeys = Object.keys(data);
            for (let i = 0; i < roleKeys.length; i++) {
              if (roleKeys[i] === "permissions") {
                this.bitSet = data.permissions;
              }
              Reflect.set(this, roleKeys[i], data[roleKeys[i]]);
            }
          }
          // TODO: Role permissions
          get permissions() {
            return null;
          }
        };
        exports_20("default", Role);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/GuildMember",
  ["file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/User"],
  function (exports_21, context_21) {
    "use strict";
    var User_ts_1, GuildMember;
    var __moduleName = context_21 && context_21.id;
    return {
      setters: [
        function (User_ts_1_1) {
          User_ts_1 = User_ts_1_1;
        },
      ],
      execute: function () {
        GuildMember = class GuildMember {
          constructor(client, guild, member) {
            this.user = new User_ts_1.default(client, member.user);
            this.roles = member.roles.map((r) => guild.roles.get(r));
            this.nick = member.nick || null;
            this.joined_at = new Date(member.joined_at);
            this.premium_since = member.premium_since
              ? new Date(member.premium_since).getTime()
              : null;
            this.hoisted_role = guild.roles.get(member.hoisted_role);
            this.deaf = member.deaf;
            this.mute = member.mute;
          }
        };
        exports_21("default", GuildMember);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Reaction",
  ["file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Emoji"],
  function (exports_22, context_22) {
    "use strict";
    var Emoji_ts_1, Reaction;
    var __moduleName = context_22 && context_22.id;
    return {
      setters: [
        function (Emoji_ts_1_1) {
          Emoji_ts_1 = Emoji_ts_1_1;
        },
      ],
      execute: function () {
        Reaction = class Reaction {
          constructor(guild, data) {
            this.count = 0;
            this.me = false;
            const keys = Object.keys(data);
            console.log(guild.members.size);
            for (let i = 0; i < keys.length; i++) {
              switch (keys[i]) {
                case "emoji":
                  this.emoji = new Emoji_ts_1.default(guild, data.emoji);
                  break;
                case "user_id":
                  this.member = guild.members.get(data.user_id);
                  this.user = this.member.user;
                  break;
                default:
                  Reflect.set(this, keys[i], data[keys[i]]);
                  break;
              }
            }
          }
        };
        exports_22("default", Reaction);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Message",
  [
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/TextChannel",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/User",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Reaction",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Collection",
  ],
  function (exports_23, context_23) {
    "use strict";
    var TextChannel_ts_1, User_ts_2, Reaction_ts_1, Collection_ts_2, Message;
    var __moduleName = context_23 && context_23.id;
    return {
      setters: [
        function (TextChannel_ts_1_1) {
          TextChannel_ts_1 = TextChannel_ts_1_1;
        },
        function (User_ts_2_1) {
          User_ts_2 = User_ts_2_1;
        },
        function (Reaction_ts_1_1) {
          Reaction_ts_1 = Reaction_ts_1_1;
        },
        function (Collection_ts_2_1) {
          Collection_ts_2 = Collection_ts_2_1;
        },
      ],
      execute: function () {
        Message = class Message {
          constructor(client, data) {
            this.reactions = new Collection_ts_2.default();
            this.client = client;
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
              switch (keys[i]) {
                case "timestamp": {
                  this.timestamp = new Date(data.timestamp).getTime();
                  break;
                }
                case "reactions":
                  for (let i = 0; i < data.reactions.length; i++) {
                    this.reactions.set(
                      data.reactions[i].emoji.id ||
                        data.reactions[i].emoji.name,
                      new Reaction_ts_1.default(this.guild, data.reactions[i]),
                    );
                  }
                  break;
                case "guild_id": {
                  this.guild = client.guilds.get(data.guild_id);
                  //TODO Find out if this is actually necessary (probs not idk)
                  this.channel.guild = this.guild;
                  break;
                }
                case "channel_id": {
                  if (data.guild_id) {
                    this.channel =
                      (client.guilds.get(data.guild_id).channels.get(
                        data.channel_id,
                      ));
                  } else {
                    const guild = client.guilds.find((g) =>
                      g.channels.has(data.channel_id)
                    );
                    if (guild) {
                      this.guild = guild;
                      this.channel = guild.channels.get(data.channel_id);
                    } else {
                      this.channel = new TextChannel_ts_1.default(
                        this.guild,
                        data,
                      );
                    }
                  }
                  break;
                }
                case "member": {
                  this.member = client.guilds.get(data.guild_id).members.get(
                    data.author.id,
                  );
                  break;
                }
                case "author": {
                  this.author = new User_ts_2.default(client, data.author);
                  break;
                }
                default: {
                  Reflect.set(this, keys[i], data[keys[i]]);
                  break;
                }
              }
            }
          }
          reply(message, options = {
            tts: false,
          }) {
            return this.channel.send(
              `${this.author.toString()}, ${message}`,
              options,
            );
          }
          async delete(options = { timeout: 0 }) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                this.client
                  .request(
                    `channels/${this.channel.id}/messages/${this.id}`,
                    "DELETE",
                  )
                  .then(() => resolve(this))
                  .catch((err) => reject(`${err.code} - ${err.message}`));
              }, options.timeout);
            });
          }
          async react(emoji) {
            return this.client
              .request(
                `channels/${this.channel.id}/messages/${this.id}/reactions/${
                  encodeURI(emoji)
                }/@me`,
                "PUT",
              )
              .then(() => this)
              .catch((err) => {
                throw `${err.code} - ${err.message}`;
              });
          }
          async edit(content, options = {
            tts: false,
            embed: null,
          }) {
            const tts = options.tts, embed = options.embed;
            return this.client
              .request(
                `channels/${this.channel.id}/messages/${this.id}`,
                "PATCH",
                {
                  content,
                  tts,
                  embed,
                },
              )
              .then((msg) =>
                this.client.guilds.get(this.guild.id).messageCache.get(msg.id)
              )
              .catch((err) => {
                throw `${err.code} - ${err.message}`;
              });
          }
        };
        exports_23("default", Message);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/TextBasedChannel",
  [
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/GuildChannel",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Message",
  ],
  function (exports_24, context_24) {
    "use strict";
    var GuildChannel_ts_1, Message_ts_1, TextBasedChannel;
    var __moduleName = context_24 && context_24.id;
    return {
      setters: [
        function (GuildChannel_ts_1_1) {
          GuildChannel_ts_1 = GuildChannel_ts_1_1;
        },
        function (Message_ts_1_1) {
          Message_ts_1 = Message_ts_1_1;
        },
      ],
      execute: function () {
        TextBasedChannel = class TextBasedChannel
          extends GuildChannel_ts_1.default {
          constructor(guild, data) {
            super(guild, data);
            this.typingCounts = 0;
          }
          async send(content, options = {
            tts: false,
            embed: null,
          }) {
            const tts = options.tts, embed = options.embed;
            return this.client
              .request(`channels/${this.id}/messages`, "POST", {
                content,
                tts,
                embed,
              })
              .then((msg) => new Message_ts_1.default(this.client, msg))
              .catch((err) => {
                throw `${err.code} - ${err.message}`;
              });
          }
          async startTyping() {
            return new Promise((resolve, reject) => {
              this.typingCounts++;
              if (!this.typingInterval) {
                const callback = () => {
                  this.client
                    .request(`channels/${this.id}/typing`, "POST")
                    .then(resolve)
                    .catch((err) => reject(`${err.code} - ${err.message}`));
                };
                callback();
                this.typingInterval = setInterval(callback, 9000);
              } else {
                resolve();
              }
            });
          }
          stopTyping(force = false) {
            if (this.typingCounts === 0) {
              return;
            }
            if (!force) {
              this.typingCounts--;
            } else {
              this.typingCounts = 0;
            }
            if (this.typingCounts === 0) {
              clearInterval(this.typingInterval);
            }
          }
          async delete() {
            return this.client
              .request(`channels/${this.id}`, "DELETE")
              .then(() => this)
              .catch((err) => {
                throw `${err.code} - ${err.message}`;
              });
          }
          async fetch(id) {
            if (this.guild.messageCache.has(id)) {
              return this.guild.messageCache.get(id);
            }
            return this.client
              .request(`channels/${this.id}/messages/${id}`, "GET")
              .then((msg) => {
                const message = new Message_ts_1.default(this.client, msg);
                if (this.guild) {
                  this.guild.messageCache.set(message.id, message);
                }
                return message;
              })
              .catch((err) => {
                throw `${err.code} - ${err.message}`;
              });
          }
        };
        exports_24("default", TextBasedChannel);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/TextChannel",
  ["file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/TextBasedChannel"],
  function (exports_25, context_25) {
    "use strict";
    var TextBasedChannel_ts_1, TextChannel;
    var __moduleName = context_25 && context_25.id;
    return {
      setters: [
        function (TextBasedChannel_ts_1_1) {
          TextBasedChannel_ts_1 = TextBasedChannel_ts_1_1;
        },
      ],
      execute: function () {
        TextChannel = class TextChannel extends TextBasedChannel_ts_1.default {
          constructor(guild, data) {
            super(guild, data);
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
              Reflect.set(this, keys[i], data[keys[i]]);
            }
          }
        };
        exports_25("default", TextChannel);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/User",
  ["file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/TextChannel"],
  function (exports_26, context_26) {
    "use strict";
    var TextChannel_ts_2, User;
    var __moduleName = context_26 && context_26.id;
    return {
      setters: [
        function (TextChannel_ts_2_1) {
          TextChannel_ts_2 = TextChannel_ts_2_1;
        },
      ],
      execute: function () {
        User = class User {
          constructor(client, data) {
            this.client = client;
            this.bot = false;
            this.flags = 0;
            this.public_flags = 0;
            this.dmChannel = null;
            const userKeys = Object.keys(data);
            for (let i = 0; i < userKeys.length; i++) {
              Reflect.set(this, userKeys[i], data[userKeys[i]]);
            }
          }
          get tag() {
            return this.username + "#" + this.discriminator;
          }
          async openDM() {
            if (this.dmChannel) {
              return this.dmChannel;
            }
            return await this.client
              .request(`users/@me/channels`, "POST", { recipient_id: this.id })
              .then((c) => {
                const channel = new TextChannel_ts_2.default(
                  this.client.guilds.get(c.guild_id),
                  c,
                );
                this.dmChannel = channel;
                return channel;
              });
          }
          async send(content) {
            const ch = await this.openDM();
            return ch.send(content);
          }
          //TODO
          avatarURL(options) {}
          toString() {
            return `<@${this.id}>`;
          }
        };
        exports_26("default", User);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Emoji",
  ["file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/User"],
  function (exports_27, context_27) {
    "use strict";
    var User_ts_3, Emoji;
    var __moduleName = context_27 && context_27.id;
    return {
      setters: [
        function (User_ts_3_1) {
          User_ts_3 = User_ts_3_1;
        },
      ],
      execute: function () {
        Emoji = class Emoji {
          constructor(guild, data) {
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
              switch (keys[i]) {
                case "user":
                  this.user = new User_ts_3.default(guild.client, data.user);
                  break;
                default:
                  Reflect.set(this, keys[i], data[keys[i]]);
                  break;
              }
            }
          }
        };
        exports_27("default", Emoji);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/VoiceChannel",
  ["file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/GuildChannel"],
  function (exports_28, context_28) {
    "use strict";
    var GuildChannel_ts_2, VoiceChannel;
    var __moduleName = context_28 && context_28.id;
    return {
      setters: [
        function (GuildChannel_ts_2_1) {
          GuildChannel_ts_2 = GuildChannel_ts_2_1;
        },
      ],
      execute: function () {
        VoiceChannel = class VoiceChannel extends GuildChannel_ts_2.default {
          constructor(guild, data) {
            super(guild, data);
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
              Reflect.set(this, keys[i], data[keys[i]]);
            }
          }
        };
        exports_28("default", VoiceChannel);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/VoiceState",
  [],
  function (exports_29, context_29) {
    "use strict";
    var VoiceState;
    var __moduleName = context_29 && context_29.id;
    return {
      setters: [],
      execute: function () {
        VoiceState = class VoiceState {
          constructor(client, data) {
            this.client = client;
            this.self_stream = false;
            for (const key of Object.keys(data)) {
              if (["member"].includes(key)) {
                continue;
              }
              Reflect.set(this, key, data[key]);
            }
          }
          get guild() {
            return this.client.guilds.get(this.guild_id);
          }
          get member() {
            return this.guild?.members.get(this.user_id);
          }
          get channel() {
            return this.guild?.channels.get(this.channel_id);
          }
        };
        exports_29("default", VoiceState);
      },
    };
  },
);
System.register(
  "https://deno.land/std/encoding/utf8",
  [],
  function (exports_30, context_30) {
    "use strict";
    var encoder, decoder;
    var __moduleName = context_30 && context_30.id;
    /** Shorthand for new TextEncoder().encode() */
    function encode(input) {
      return encoder.encode(input);
    }
    exports_30("encode", encode);
    /** Shorthand for new TextDecoder().decode() */
    function decode(input) {
      return decoder.decode(input);
    }
    exports_30("decode", decode);
    return {
      setters: [],
      execute: function () {
        /** A default TextEncoder instance */
        exports_30("encoder", encoder = new TextEncoder());
        /** A default TextDecoder instance */
        exports_30("decoder", decoder = new TextDecoder());
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std/_util/has_own_property",
  [],
  function (exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    /**
     * Determines whether an object has a property with the specified name.
     * Avoid calling prototype builtin `hasOwnProperty` for two reasons:
     *
     * 1. `hasOwnProperty` is defined on the object as something else:
     *
     *      const options = {
     *        ending: 'utf8',
     *        hasOwnProperty: 'foo'
     *      };
     *      options.hasOwnProperty('ending') // throws a TypeError
     *
     * 2. The object doesn't inherit from `Object.prototype`:
     *
     *       const options = Object.create(null);
     *       options.ending = 'utf8';
     *       options.hasOwnProperty('ending'); // throws a TypeError
     *
     * @param obj A Object.
     * @param v A property name.
     * @see https://eslint.org/docs/rules/no-prototype-builtins
     */
    function hasOwnProperty(obj, v) {
      if (obj == null) {
        return false;
      }
      return Object.prototype.hasOwnProperty.call(obj, v);
    }
    exports_31("hasOwnProperty", hasOwnProperty);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std/io/util",
  ["https://deno.land/std/path/mod", "https://deno.land/std/encoding/utf8"],
  function (exports_32, context_32) {
    "use strict";
    var Buffer, mkdir, open, path, utf8_ts_1;
    var __moduleName = context_32 && context_32.id;
    /**
     * Copy bytes from one Uint8Array to another.  Bytes from `src` which don't fit
     * into `dst` will not be copied.
     *
     * @param src Source byte array
     * @param dst Destination byte array
     * @param off Offset into `dst` at which to begin writing values from `src`.
     * @return number of bytes copied
     */
    function copyBytes(src, dst, off = 0) {
      off = Math.max(0, Math.min(off, dst.byteLength));
      const dstBytesAvailable = dst.byteLength - off;
      if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
      }
      dst.set(src, off);
      return src.byteLength;
    }
    exports_32("copyBytes", copyBytes);
    function charCode(s) {
      return s.charCodeAt(0);
    }
    exports_32("charCode", charCode);
    function stringsReader(s) {
      return new Buffer(utf8_ts_1.encode(s).buffer);
    }
    exports_32("stringsReader", stringsReader);
    /** Create or open a temporal file at specified directory with prefix and
     *  postfix
     * */
    async function tempFile(dir, opts = { prefix: "", postfix: "" }) {
      const r = Math.floor(Math.random() * 1000000);
      const filepath = path.resolve(
        `${dir}/${opts.prefix || ""}${r}${opts.postfix || ""}`,
      );
      await mkdir(path.dirname(filepath), { recursive: true });
      const file = await open(filepath, {
        create: true,
        read: true,
        write: true,
        append: true,
      });
      return { file, filepath };
    }
    exports_32("tempFile", tempFile);
    return {
      setters: [
        function (path_1) {
          path = path_1;
        },
        function (utf8_ts_1_1) {
          utf8_ts_1 = utf8_ts_1_1;
        },
      ],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        Buffer = Deno.Buffer, mkdir = Deno.mkdir, open = Deno.open;
      },
    };
  },
);
// Based on https://github.com/golang/go/blob/891682/src/bufio/bufio.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
System.register(
  "https://deno.land/std/io/bufio",
  ["https://deno.land/std/io/util", "https://deno.land/std/testing/asserts"],
  function (exports_33, context_33) {
    "use strict";
    var util_ts_1,
      asserts_ts_4,
      DEFAULT_BUF_SIZE,
      MIN_BUF_SIZE,
      MAX_CONSECUTIVE_EMPTY_READS,
      CR,
      LF,
      BufferFullError,
      PartialReadError,
      BufReader,
      AbstractBufBase,
      BufWriter,
      BufWriterSync;
    var __moduleName = context_33 && context_33.id;
    /** Generate longest proper prefix which is also suffix array. */
    function createLPS(pat) {
      const lps = new Uint8Array(pat.length);
      lps[0] = 0;
      let prefixEnd = 0;
      let i = 1;
      while (i < lps.length) {
        if (pat[i] == pat[prefixEnd]) {
          prefixEnd++;
          lps[i] = prefixEnd;
          i++;
        } else if (prefixEnd === 0) {
          lps[i] = 0;
          i++;
        } else {
          prefixEnd = pat[prefixEnd - 1];
        }
      }
      return lps;
    }
    /** Read delimited bytes from a Reader. */
    async function* readDelim(reader, delim) {
      // Avoid unicode problems
      const delimLen = delim.length;
      const delimLPS = createLPS(delim);
      let inputBuffer = new Deno.Buffer();
      const inspectArr = new Uint8Array(Math.max(1024, delimLen + 1));
      // Modified KMP
      let inspectIndex = 0;
      let matchIndex = 0;
      while (true) {
        const result = await reader.read(inspectArr);
        if (result === null) {
          // Yield last chunk.
          yield inputBuffer.bytes();
          return;
        }
        if (result < 0) {
          // Discard all remaining and silently fail.
          return;
        }
        const sliceRead = inspectArr.subarray(0, result);
        await Deno.writeAll(inputBuffer, sliceRead);
        let sliceToProcess = inputBuffer.bytes();
        while (inspectIndex < sliceToProcess.length) {
          if (sliceToProcess[inspectIndex] === delim[matchIndex]) {
            inspectIndex++;
            matchIndex++;
            if (matchIndex === delimLen) {
              // Full match
              const matchEnd = inspectIndex - delimLen;
              const readyBytes = sliceToProcess.subarray(0, matchEnd);
              // Copy
              const pendingBytes = sliceToProcess.slice(inspectIndex);
              yield readyBytes;
              // Reset match, different from KMP.
              sliceToProcess = pendingBytes;
              inspectIndex = 0;
              matchIndex = 0;
            }
          } else {
            if (matchIndex === 0) {
              inspectIndex++;
            } else {
              matchIndex = delimLPS[matchIndex - 1];
            }
          }
        }
        // Keep inspectIndex and matchIndex.
        inputBuffer = new Deno.Buffer(sliceToProcess);
      }
    }
    exports_33("readDelim", readDelim);
    /** Read delimited strings from a Reader. */
    async function* readStringDelim(reader, delim) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      for await (const chunk of readDelim(reader, encoder.encode(delim))) {
        yield decoder.decode(chunk);
      }
    }
    exports_33("readStringDelim", readStringDelim);
    /** Read strings line-by-line from a Reader. */
    // eslint-disable-next-line require-await
    async function* readLines(reader) {
      yield* readStringDelim(reader, "\n");
    }
    exports_33("readLines", readLines);
    return {
      setters: [
        function (util_ts_1_1) {
          util_ts_1 = util_ts_1_1;
        },
        function (asserts_ts_4_1) {
          asserts_ts_4 = asserts_ts_4_1;
        },
      ],
      execute: function () {
        DEFAULT_BUF_SIZE = 4096;
        MIN_BUF_SIZE = 16;
        MAX_CONSECUTIVE_EMPTY_READS = 100;
        CR = util_ts_1.charCode("\r");
        LF = util_ts_1.charCode("\n");
        BufferFullError = class BufferFullError extends Error {
          constructor(partial) {
            super("Buffer full");
            this.partial = partial;
            this.name = "BufferFullError";
          }
        };
        exports_33("BufferFullError", BufferFullError);
        PartialReadError = class PartialReadError
          extends Deno.errors.UnexpectedEof {
          constructor() {
            super("Encountered UnexpectedEof, data only partially read");
            this.name = "PartialReadError";
          }
        };
        exports_33("PartialReadError", PartialReadError);
        /** BufReader implements buffering for a Reader object. */
        BufReader = class BufReader {
          constructor(rd, size = DEFAULT_BUF_SIZE) {
            this.r = 0; // buf read position.
            this.w = 0; // buf write position.
            this.eof = false;
            if (size < MIN_BUF_SIZE) {
              size = MIN_BUF_SIZE;
            }
            this._reset(new Uint8Array(size), rd);
          }
          // private lastByte: number;
          // private lastCharSize: number;
          /** return new BufReader unless r is BufReader */
          static create(r, size = DEFAULT_BUF_SIZE) {
            return r instanceof BufReader ? r : new BufReader(r, size);
          }
          /** Returns the size of the underlying buffer in bytes. */
          size() {
            return this.buf.byteLength;
          }
          buffered() {
            return this.w - this.r;
          }
          // Reads a new chunk into the buffer.
          async _fill() {
            // Slide existing data to beginning.
            if (this.r > 0) {
              this.buf.copyWithin(0, this.r, this.w);
              this.w -= this.r;
              this.r = 0;
            }
            if (this.w >= this.buf.byteLength) {
              throw Error("bufio: tried to fill full buffer");
            }
            // Read new data: try a limited number of times.
            for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
              const rr = await this.rd.read(this.buf.subarray(this.w));
              if (rr === null) {
                this.eof = true;
                return;
              }
              asserts_ts_4.assert(rr >= 0, "negative read");
              this.w += rr;
              if (rr > 0) {
                return;
              }
            }
            throw new Error(
              `No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`,
            );
          }
          /** Discards any buffered data, resets all state, and switches
                 * the buffered reader to read from r.
                 */
          reset(r) {
            this._reset(this.buf, r);
          }
          _reset(buf, rd) {
            this.buf = buf;
            this.rd = rd;
            this.eof = false;
            // this.lastByte = -1;
            // this.lastCharSize = -1;
          }
          /** reads data into p.
                 * It returns the number of bytes read into p.
                 * The bytes are taken from at most one Read on the underlying Reader,
                 * hence n may be less than len(p).
                 * To read exactly len(p) bytes, use io.ReadFull(b, p).
                 */
          async read(p) {
            let rr = p.byteLength;
            if (p.byteLength === 0) {
              return rr;
            }
            if (this.r === this.w) {
              if (p.byteLength >= this.buf.byteLength) {
                // Large read, empty buffer.
                // Read directly into p to avoid copy.
                const rr = await this.rd.read(p);
                const nread = rr ?? 0;
                asserts_ts_4.assert(nread >= 0, "negative read");
                // if (rr.nread > 0) {
                //   this.lastByte = p[rr.nread - 1];
                //   this.lastCharSize = -1;
                // }
                return rr;
              }
              // One read.
              // Do not use this.fill, which will loop.
              this.r = 0;
              this.w = 0;
              rr = await this.rd.read(this.buf);
              if (rr === 0 || rr === null) {
                return rr;
              }
              asserts_ts_4.assert(rr >= 0, "negative read");
              this.w += rr;
            }
            // copy as much as we can
            const copied = util_ts_1.copyBytes(
              this.buf.subarray(this.r, this.w),
              p,
              0,
            );
            this.r += copied;
            // this.lastByte = this.buf[this.r - 1];
            // this.lastCharSize = -1;
            return copied;
          }
          /** reads exactly `p.length` bytes into `p`.
                 *
                 * If successful, `p` is returned.
                 *
                 * If the end of the underlying stream has been reached, and there are no more
                 * bytes available in the buffer, `readFull()` returns `null` instead.
                 *
                 * An error is thrown if some bytes could be read, but not enough to fill `p`
                 * entirely before the underlying stream reported an error or EOF. Any error
                 * thrown will have a `partial` property that indicates the slice of the
                 * buffer that has been successfully filled with data.
                 *
                 * Ported from https://golang.org/pkg/io/#ReadFull
                 */
          async readFull(p) {
            let bytesRead = 0;
            while (bytesRead < p.length) {
              try {
                const rr = await this.read(p.subarray(bytesRead));
                if (rr === null) {
                  if (bytesRead === 0) {
                    return null;
                  } else {
                    throw new PartialReadError();
                  }
                }
                bytesRead += rr;
              } catch (err) {
                err.partial = p.subarray(0, bytesRead);
                throw err;
              }
            }
            return p;
          }
          /** Returns the next byte [0, 255] or `null`. */
          async readByte() {
            while (this.r === this.w) {
              if (this.eof) {
                return null;
              }
              await this._fill(); // buffer is empty.
            }
            const c = this.buf[this.r];
            this.r++;
            // this.lastByte = c;
            return c;
          }
          /** readString() reads until the first occurrence of delim in the input,
                 * returning a string containing the data up to and including the delimiter.
                 * If ReadString encounters an error before finding a delimiter,
                 * it returns the data read before the error and the error itself
                 * (often `null`).
                 * ReadString returns err != nil if and only if the returned data does not end
                 * in delim.
                 * For simple uses, a Scanner may be more convenient.
                 */
          async readString(delim) {
            if (delim.length !== 1) {
              throw new Error("Delimiter should be a single character");
            }
            const buffer = await this.readSlice(delim.charCodeAt(0));
            if (buffer === null) {
              return null;
            }
            return new TextDecoder().decode(buffer);
          }
          /** `readLine()` is a low-level line-reading primitive. Most callers should
                 * use `readString('\n')` instead or use a Scanner.
                 *
                 * `readLine()` tries to return a single line, not including the end-of-line
                 * bytes. If the line was too long for the buffer then `more` is set and the
                 * beginning of the line is returned. The rest of the line will be returned
                 * from future calls. `more` will be false when returning the last fragment
                 * of the line. The returned buffer is only valid until the next call to
                 * `readLine()`.
                 *
                 * The text returned from ReadLine does not include the line end ("\r\n" or
                 * "\n").
                 *
                 * When the end of the underlying stream is reached, the final bytes in the
                 * stream are returned. No indication or error is given if the input ends
                 * without a final line end. When there are no more trailing bytes to read,
                 * `readLine()` returns `null`.
                 *
                 * Calling `unreadByte()` after `readLine()` will always unread the last byte
                 * read (possibly a character belonging to the line end) even if that byte is
                 * not part of the line returned by `readLine()`.
                 */
          async readLine() {
            let line;
            try {
              line = await this.readSlice(LF);
            } catch (err) {
              let { partial } = err;
              asserts_ts_4.assert(
                partial instanceof Uint8Array,
                "bufio: caught error from `readSlice()` without `partial` property",
              );
              // Don't throw if `readSlice()` failed with `BufferFullError`, instead we
              // just return whatever is available and set the `more` flag.
              if (!(err instanceof BufferFullError)) {
                throw err;
              }
              // Handle the case where "\r\n" straddles the buffer.
              if (
                !this.eof &&
                partial.byteLength > 0 &&
                partial[partial.byteLength - 1] === CR
              ) {
                // Put the '\r' back on buf and drop it from line.
                // Let the next call to ReadLine check for "\r\n".
                asserts_ts_4.assert(
                  this.r > 0,
                  "bufio: tried to rewind past start of buffer",
                );
                this.r--;
                partial = partial.subarray(0, partial.byteLength - 1);
              }
              return { line: partial, more: !this.eof };
            }
            if (line === null) {
              return null;
            }
            if (line.byteLength === 0) {
              return { line, more: false };
            }
            if (line[line.byteLength - 1] == LF) {
              let drop = 1;
              if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                drop = 2;
              }
              line = line.subarray(0, line.byteLength - drop);
            }
            return { line, more: false };
          }
          /** `readSlice()` reads until the first occurrence of `delim` in the input,
                 * returning a slice pointing at the bytes in the buffer. The bytes stop
                 * being valid at the next read.
                 *
                 * If `readSlice()` encounters an error before finding a delimiter, or the
                 * buffer fills without finding a delimiter, it throws an error with a
                 * `partial` property that contains the entire buffer.
                 *
                 * If `readSlice()` encounters the end of the underlying stream and there are
                 * any bytes left in the buffer, the rest of the buffer is returned. In other
                 * words, EOF is always treated as a delimiter. Once the buffer is empty,
                 * it returns `null`.
                 *
                 * Because the data returned from `readSlice()` will be overwritten by the
                 * next I/O operation, most clients should use `readString()` instead.
                 */
          async readSlice(delim) {
            let s = 0; // search start index
            let slice;
            while (true) {
              // Search buffer.
              let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
              if (i >= 0) {
                i += s;
                slice = this.buf.subarray(this.r, this.r + i + 1);
                this.r += i + 1;
                break;
              }
              // EOF?
              if (this.eof) {
                if (this.r === this.w) {
                  return null;
                }
                slice = this.buf.subarray(this.r, this.w);
                this.r = this.w;
                break;
              }
              // Buffer full?
              if (this.buffered() >= this.buf.byteLength) {
                this.r = this.w;
                // #4521 The internal buffer should not be reused across reads because it causes corruption of data.
                const oldbuf = this.buf;
                const newbuf = this.buf.slice(0);
                this.buf = newbuf;
                throw new BufferFullError(oldbuf);
              }
              s = this.w - this.r; // do not rescan area we scanned before
              // Buffer is not full.
              try {
                await this._fill();
              } catch (err) {
                err.partial = slice;
                throw err;
              }
            }
            // Handle last byte, if any.
            // const i = slice.byteLength - 1;
            // if (i >= 0) {
            //   this.lastByte = slice[i];
            //   this.lastCharSize = -1
            // }
            return slice;
          }
          /** `peek()` returns the next `n` bytes without advancing the reader. The
                 * bytes stop being valid at the next read call.
                 *
                 * When the end of the underlying stream is reached, but there are unread
                 * bytes left in the buffer, those bytes are returned. If there are no bytes
                 * left in the buffer, it returns `null`.
                 *
                 * If an error is encountered before `n` bytes are available, `peek()` throws
                 * an error with the `partial` property set to a slice of the buffer that
                 * contains the bytes that were available before the error occurred.
                 */
          async peek(n) {
            if (n < 0) {
              throw Error("negative count");
            }
            let avail = this.w - this.r;
            while (avail < n && avail < this.buf.byteLength && !this.eof) {
              try {
                await this._fill();
              } catch (err) {
                err.partial = this.buf.subarray(this.r, this.w);
                throw err;
              }
              avail = this.w - this.r;
            }
            if (avail === 0 && this.eof) {
              return null;
            } else if (avail < n && this.eof) {
              return this.buf.subarray(this.r, this.r + avail);
            } else if (avail < n) {
              throw new BufferFullError(this.buf.subarray(this.r, this.w));
            }
            return this.buf.subarray(this.r, this.r + n);
          }
        };
        exports_33("BufReader", BufReader);
        AbstractBufBase = class AbstractBufBase {
          constructor() {
            this.usedBufferBytes = 0;
            this.err = null;
          }
          /** Size returns the size of the underlying buffer in bytes. */
          size() {
            return this.buf.byteLength;
          }
          /** Returns how many bytes are unused in the buffer. */
          available() {
            return this.buf.byteLength - this.usedBufferBytes;
          }
          /** buffered returns the number of bytes that have been written into the
                 * current buffer.
                 */
          buffered() {
            return this.usedBufferBytes;
          }
          checkBytesWritten(numBytesWritten) {
            if (numBytesWritten < this.usedBufferBytes) {
              if (numBytesWritten > 0) {
                this.buf.copyWithin(0, numBytesWritten, this.usedBufferBytes);
                this.usedBufferBytes -= numBytesWritten;
              }
              this.err = new Error("Short write");
              throw this.err;
            }
          }
        };
        /** BufWriter implements buffering for an deno.Writer object.
             * If an error occurs writing to a Writer, no more data will be
             * accepted and all subsequent writes, and flush(), will return the error.
             * After all data has been written, the client should call the
             * flush() method to guarantee all data has been forwarded to
             * the underlying deno.Writer.
             */
        BufWriter = class BufWriter extends AbstractBufBase {
          constructor(writer, size = DEFAULT_BUF_SIZE) {
            super();
            this.writer = writer;
            if (size <= 0) {
              size = DEFAULT_BUF_SIZE;
            }
            this.buf = new Uint8Array(size);
          }
          /** return new BufWriter unless writer is BufWriter */
          static create(writer, size = DEFAULT_BUF_SIZE) {
            return writer instanceof BufWriter
              ? writer
              : new BufWriter(writer, size);
          }
          /** Discards any unflushed buffered data, clears any error, and
                 * resets buffer to write its output to w.
                 */
          reset(w) {
            this.err = null;
            this.usedBufferBytes = 0;
            this.writer = w;
          }
          /** Flush writes any buffered data to the underlying io.Writer. */
          async flush() {
            if (this.err !== null) {
              throw this.err;
            }
            if (this.usedBufferBytes === 0) {
              return;
            }
            let numBytesWritten = 0;
            try {
              numBytesWritten = await this.writer.write(
                this.buf.subarray(0, this.usedBufferBytes),
              );
            } catch (e) {
              this.err = e;
              throw e;
            }
            this.checkBytesWritten(numBytesWritten);
            this.usedBufferBytes = 0;
          }
          /** Writes the contents of `data` into the buffer.  If the contents won't fully
                 * fit into the buffer, those bytes that can are copied into the buffer, the
                 * buffer is the flushed to the writer and the remaining bytes are copied into
                 * the now empty buffer.
                 *
                 * @return the number of bytes written to the buffer.
                 */
          async write(data) {
            if (this.err !== null) {
              throw this.err;
            }
            if (data.length === 0) {
              return 0;
            }
            let totalBytesWritten = 0;
            let numBytesWritten = 0;
            while (data.byteLength > this.available()) {
              if (this.buffered() === 0) {
                // Large write, empty buffer.
                // Write directly from data to avoid copy.
                try {
                  numBytesWritten = await this.writer.write(data);
                } catch (e) {
                  this.err = e;
                  throw e;
                }
              } else {
                numBytesWritten = util_ts_1.copyBytes(
                  data,
                  this.buf,
                  this.usedBufferBytes,
                );
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
              }
              totalBytesWritten += numBytesWritten;
              data = data.subarray(numBytesWritten);
            }
            numBytesWritten = util_ts_1.copyBytes(
              data,
              this.buf,
              this.usedBufferBytes,
            );
            this.usedBufferBytes += numBytesWritten;
            totalBytesWritten += numBytesWritten;
            return totalBytesWritten;
          }
        };
        exports_33("BufWriter", BufWriter);
        /** BufWriterSync implements buffering for a deno.WriterSync object.
             * If an error occurs writing to a WriterSync, no more data will be
             * accepted and all subsequent writes, and flush(), will return the error.
             * After all data has been written, the client should call the
             * flush() method to guarantee all data has been forwarded to
             * the underlying deno.WriterSync.
             */
        BufWriterSync = class BufWriterSync extends AbstractBufBase {
          constructor(writer, size = DEFAULT_BUF_SIZE) {
            super();
            this.writer = writer;
            if (size <= 0) {
              size = DEFAULT_BUF_SIZE;
            }
            this.buf = new Uint8Array(size);
          }
          /** return new BufWriterSync unless writer is BufWriterSync */
          static create(writer, size = DEFAULT_BUF_SIZE) {
            return writer instanceof BufWriterSync
              ? writer
              : new BufWriterSync(writer, size);
          }
          /** Discards any unflushed buffered data, clears any error, and
                 * resets buffer to write its output to w.
                 */
          reset(w) {
            this.err = null;
            this.usedBufferBytes = 0;
            this.writer = w;
          }
          /** Flush writes any buffered data to the underlying io.WriterSync. */
          flush() {
            if (this.err !== null) {
              throw this.err;
            }
            if (this.usedBufferBytes === 0) {
              return;
            }
            let numBytesWritten = 0;
            try {
              numBytesWritten = this.writer.writeSync(
                this.buf.subarray(0, this.usedBufferBytes),
              );
            } catch (e) {
              this.err = e;
              throw e;
            }
            this.checkBytesWritten(numBytesWritten);
            this.usedBufferBytes = 0;
          }
          /** Writes the contents of `data` into the buffer.  If the contents won't fully
                 * fit into the buffer, those bytes that can are copied into the buffer, the
                 * buffer is the flushed to the writer and the remaining bytes are copied into
                 * the now empty buffer.
                 *
                 * @return the number of bytes written to the buffer.
                 */
          writeSync(data) {
            if (this.err !== null) {
              throw this.err;
            }
            if (data.length === 0) {
              return 0;
            }
            let totalBytesWritten = 0;
            let numBytesWritten = 0;
            while (data.byteLength > this.available()) {
              if (this.buffered() === 0) {
                // Large write, empty buffer.
                // Write directly from data to avoid copy.
                try {
                  numBytesWritten = this.writer.writeSync(data);
                } catch (e) {
                  this.err = e;
                  throw e;
                }
              } else {
                numBytesWritten = util_ts_1.copyBytes(
                  data,
                  this.buf,
                  this.usedBufferBytes,
                );
                this.usedBufferBytes += numBytesWritten;
                this.flush();
              }
              totalBytesWritten += numBytesWritten;
              data = data.subarray(numBytesWritten);
            }
            numBytesWritten = util_ts_1.copyBytes(
              data,
              this.buf,
              this.usedBufferBytes,
            );
            this.usedBufferBytes += numBytesWritten;
            totalBytesWritten += numBytesWritten;
            return totalBytesWritten;
          }
        };
        exports_33("BufWriterSync", BufWriterSync);
      },
    };
  },
);
System.register(
  "https://deno.land/std/io/ioutil",
  ["https://deno.land/std/testing/asserts"],
  function (exports_34, context_34) {
    "use strict";
    var asserts_ts_5, DEFAULT_BUFFER_SIZE, MAX_SAFE_INTEGER;
    var __moduleName = context_34 && context_34.id;
    /** copy N size at the most.
     *  If read size is lesser than N, then returns nread
     * */
    async function copyN(r, dest, size) {
      let bytesRead = 0;
      let buf = new Uint8Array(DEFAULT_BUFFER_SIZE);
      while (bytesRead < size) {
        if (size - bytesRead < DEFAULT_BUFFER_SIZE) {
          buf = new Uint8Array(size - bytesRead);
        }
        const result = await r.read(buf);
        const nread = result ?? 0;
        bytesRead += nread;
        if (nread > 0) {
          let n = 0;
          while (n < nread) {
            n += await dest.write(buf.slice(n, nread));
          }
          asserts_ts_5.assert(n === nread, "could not write");
        }
        if (result === null) {
          break;
        }
      }
      return bytesRead;
    }
    exports_34("copyN", copyN);
    /** Read big endian 16bit short from BufReader */
    async function readShort(buf) {
      const high = await buf.readByte();
      if (high === null) {
        return null;
      }
      const low = await buf.readByte();
      if (low === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      return (high << 8) | low;
    }
    exports_34("readShort", readShort);
    /** Read big endian 32bit integer from BufReader */
    async function readInt(buf) {
      const high = await readShort(buf);
      if (high === null) {
        return null;
      }
      const low = await readShort(buf);
      if (low === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      return (high << 16) | low;
    }
    exports_34("readInt", readInt);
    /** Read big endian 64bit long from BufReader */
    async function readLong(buf) {
      const high = await readInt(buf);
      if (high === null) {
        return null;
      }
      const low = await readInt(buf);
      if (low === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      const big = (BigInt(high) << 32n) | BigInt(low);
      // We probably should provide a similar API that returns BigInt values.
      if (big > MAX_SAFE_INTEGER) {
        throw new RangeError(
          "Long value too big to be represented as a JavaScript number.",
        );
      }
      return Number(big);
    }
    exports_34("readLong", readLong);
    /** Slice number into 64bit big endian byte array */
    function sliceLongToBytes(d, dest = new Array(8)) {
      let big = BigInt(d);
      for (let i = 0; i < 8; i++) {
        dest[7 - i] = Number(big & 0xffn);
        big >>= 8n;
      }
      return dest;
    }
    exports_34("sliceLongToBytes", sliceLongToBytes);
    return {
      setters: [
        function (asserts_ts_5_1) {
          asserts_ts_5 = asserts_ts_5_1;
        },
      ],
      execute: function () {
        DEFAULT_BUFFER_SIZE = 32 * 1024;
        MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
      },
    };
  },
);
/*
 * [js-sha1]{@link https://github.com/emn178/js-sha1}
 *
 * @version 0.6.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
System.register(
  "https://deno.land/std/hash/sha1",
  [],
  function (exports_35, context_35) {
    "use strict";
    var HEX_CHARS, EXTRA, SHIFT, blocks, Sha1;
    var __moduleName = context_35 && context_35.id;
    return {
      setters: [],
      execute: function () {
        HEX_CHARS = "0123456789abcdef".split("");
        EXTRA = [-2147483648, 8388608, 32768, 128];
        SHIFT = [24, 16, 8, 0];
        blocks = [];
        Sha1 = class Sha1 {
          constructor(sharedMemory = false) {
            this.#h0 = 0x67452301;
            this.#h1 = 0xefcdab89;
            this.#h2 = 0x98badcfe;
            this.#h3 = 0x10325476;
            this.#h4 = 0xc3d2e1f0;
            this.#lastByteIndex = 0;
            if (sharedMemory) {
              blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] =
                  blocks[9] = blocks[10] = blocks[11] = blocks[12] =
                    blocks[13] = blocks[14] = blocks[15] = 0;
              this.#blocks = blocks;
            } else {
              this.#blocks = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ];
            }
            this.#h0 = 0x67452301;
            this.#h1 = 0xefcdab89;
            this.#h2 = 0x98badcfe;
            this.#h3 = 0x10325476;
            this.#h4 = 0xc3d2e1f0;
            this.#block = this.#start = this.#bytes = this.#hBytes = 0;
            this.#finalized = this.#hashed = false;
          }
          #blocks;
          #block;
          #start;
          #bytes;
          #hBytes;
          #finalized;
          #hashed;
          #h0;
          #h1;
          #h2;
          #h3;
          #h4;
          #lastByteIndex;
          update(message) {
            if (this.#finalized) {
              return this;
            }
            let msg;
            if (message instanceof ArrayBuffer) {
              msg = new Uint8Array(message);
            } else {
              msg = message;
            }
            let index = 0;
            const length = msg.length;
            const blocks = this.#blocks;
            while (index < length) {
              let i;
              if (this.#hashed) {
                this.#hashed = false;
                blocks[0] = this.#block;
                blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] =
                  blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] =
                    blocks[10] = blocks[11] = blocks[12] = blocks[13] =
                      blocks[14] = blocks[15] = 0;
              }
              if (typeof msg !== "string") {
                for (i = this.#start; index < length && i < 64; ++index) {
                  blocks[i >> 2] |= msg[index] << SHIFT[i++ & 3];
                }
              } else {
                for (i = this.#start; index < length && i < 64; ++index) {
                  let code = msg.charCodeAt(index);
                  if (code < 0x80) {
                    blocks[i >> 2] |= code << SHIFT[i++ & 3];
                  } else if (code < 0x800) {
                    blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                  } else if (code < 0xd800 || code >= 0xe000) {
                    blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) <<
                      SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                  } else {
                    code = 0x10000 +
                      (((code & 0x3ff) << 10) |
                        (msg.charCodeAt(++index) & 0x3ff));
                    blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) <<
                      SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) <<
                      SHIFT[i++ & 3];
                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                  }
                }
              }
              this.#lastByteIndex = i;
              this.#bytes += i - this.#start;
              if (i >= 64) {
                this.#block = blocks[16];
                this.#start = i - 64;
                this.hash();
                this.#hashed = true;
              } else {
                this.#start = i;
              }
            }
            if (this.#bytes > 4294967295) {
              this.#hBytes += (this.#bytes / 4294967296) >>> 0;
              this.#bytes = this.#bytes >>> 0;
            }
            return this;
          }
          finalize() {
            if (this.#finalized) {
              return;
            }
            this.#finalized = true;
            const blocks = this.#blocks;
            const i = this.#lastByteIndex;
            blocks[16] = this.#block;
            blocks[i >> 2] |= EXTRA[i & 3];
            this.#block = blocks[16];
            if (i >= 56) {
              if (!this.#hashed) {
                this.hash();
              }
              blocks[0] = this.#block;
              blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] =
                blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] =
                  blocks[10] = blocks[11] = blocks[12] = blocks[13] =
                    blocks[14] = blocks[15] = 0;
            }
            blocks[14] = (this.#hBytes << 3) | (this.#bytes >>> 29);
            blocks[15] = this.#bytes << 3;
            this.hash();
          }
          hash() {
            let a = this.#h0;
            let b = this.#h1;
            let c = this.#h2;
            let d = this.#h3;
            let e = this.#h4;
            let f;
            let j;
            let t;
            const blocks = this.#blocks;
            for (j = 16; j < 80; ++j) {
              t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^
                blocks[j - 16];
              blocks[j] = (t << 1) | (t >>> 31);
            }
            for (j = 0; j < 20; j += 5) {
              f = (b & c) | (~b & d);
              t = (a << 5) | (a >>> 27);
              e = (t + f + e + 1518500249 + blocks[j]) >>> 0;
              b = (b << 30) | (b >>> 2);
              f = (a & b) | (~a & c);
              t = (e << 5) | (e >>> 27);
              d = (t + f + d + 1518500249 + blocks[j + 1]) >>> 0;
              a = (a << 30) | (a >>> 2);
              f = (e & a) | (~e & b);
              t = (d << 5) | (d >>> 27);
              c = (t + f + c + 1518500249 + blocks[j + 2]) >>> 0;
              e = (e << 30) | (e >>> 2);
              f = (d & e) | (~d & a);
              t = (c << 5) | (c >>> 27);
              b = (t + f + b + 1518500249 + blocks[j + 3]) >>> 0;
              d = (d << 30) | (d >>> 2);
              f = (c & d) | (~c & e);
              t = (b << 5) | (b >>> 27);
              a = (t + f + a + 1518500249 + blocks[j + 4]) >>> 0;
              c = (c << 30) | (c >>> 2);
            }
            for (; j < 40; j += 5) {
              f = b ^ c ^ d;
              t = (a << 5) | (a >>> 27);
              e = (t + f + e + 1859775393 + blocks[j]) >>> 0;
              b = (b << 30) | (b >>> 2);
              f = a ^ b ^ c;
              t = (e << 5) | (e >>> 27);
              d = (t + f + d + 1859775393 + blocks[j + 1]) >>> 0;
              a = (a << 30) | (a >>> 2);
              f = e ^ a ^ b;
              t = (d << 5) | (d >>> 27);
              c = (t + f + c + 1859775393 + blocks[j + 2]) >>> 0;
              e = (e << 30) | (e >>> 2);
              f = d ^ e ^ a;
              t = (c << 5) | (c >>> 27);
              b = (t + f + b + 1859775393 + blocks[j + 3]) >>> 0;
              d = (d << 30) | (d >>> 2);
              f = c ^ d ^ e;
              t = (b << 5) | (b >>> 27);
              a = (t + f + a + 1859775393 + blocks[j + 4]) >>> 0;
              c = (c << 30) | (c >>> 2);
            }
            for (; j < 60; j += 5) {
              f = (b & c) | (b & d) | (c & d);
              t = (a << 5) | (a >>> 27);
              e = (t + f + e - 1894007588 + blocks[j]) >>> 0;
              b = (b << 30) | (b >>> 2);
              f = (a & b) | (a & c) | (b & c);
              t = (e << 5) | (e >>> 27);
              d = (t + f + d - 1894007588 + blocks[j + 1]) >>> 0;
              a = (a << 30) | (a >>> 2);
              f = (e & a) | (e & b) | (a & b);
              t = (d << 5) | (d >>> 27);
              c = (t + f + c - 1894007588 + blocks[j + 2]) >>> 0;
              e = (e << 30) | (e >>> 2);
              f = (d & e) | (d & a) | (e & a);
              t = (c << 5) | (c >>> 27);
              b = (t + f + b - 1894007588 + blocks[j + 3]) >>> 0;
              d = (d << 30) | (d >>> 2);
              f = (c & d) | (c & e) | (d & e);
              t = (b << 5) | (b >>> 27);
              a = (t + f + a - 1894007588 + blocks[j + 4]) >>> 0;
              c = (c << 30) | (c >>> 2);
            }
            for (; j < 80; j += 5) {
              f = b ^ c ^ d;
              t = (a << 5) | (a >>> 27);
              e = (t + f + e - 899497514 + blocks[j]) >>> 0;
              b = (b << 30) | (b >>> 2);
              f = a ^ b ^ c;
              t = (e << 5) | (e >>> 27);
              d = (t + f + d - 899497514 + blocks[j + 1]) >>> 0;
              a = (a << 30) | (a >>> 2);
              f = e ^ a ^ b;
              t = (d << 5) | (d >>> 27);
              c = (t + f + c - 899497514 + blocks[j + 2]) >>> 0;
              e = (e << 30) | (e >>> 2);
              f = d ^ e ^ a;
              t = (c << 5) | (c >>> 27);
              b = (t + f + b - 899497514 + blocks[j + 3]) >>> 0;
              d = (d << 30) | (d >>> 2);
              f = c ^ d ^ e;
              t = (b << 5) | (b >>> 27);
              a = (t + f + a - 899497514 + blocks[j + 4]) >>> 0;
              c = (c << 30) | (c >>> 2);
            }
            this.#h0 = (this.#h0 + a) >>> 0;
            this.#h1 = (this.#h1 + b) >>> 0;
            this.#h2 = (this.#h2 + c) >>> 0;
            this.#h3 = (this.#h3 + d) >>> 0;
            this.#h4 = (this.#h4 + e) >>> 0;
          }
          hex() {
            this.finalize();
            const h0 = this.#h0;
            const h1 = this.#h1;
            const h2 = this.#h2;
            const h3 = this.#h3;
            const h4 = this.#h4;
            return (HEX_CHARS[(h0 >> 28) & 0x0f] +
              HEX_CHARS[(h0 >> 24) & 0x0f] +
              HEX_CHARS[(h0 >> 20) & 0x0f] +
              HEX_CHARS[(h0 >> 16) & 0x0f] +
              HEX_CHARS[(h0 >> 12) & 0x0f] +
              HEX_CHARS[(h0 >> 8) & 0x0f] +
              HEX_CHARS[(h0 >> 4) & 0x0f] +
              HEX_CHARS[h0 & 0x0f] +
              HEX_CHARS[(h1 >> 28) & 0x0f] +
              HEX_CHARS[(h1 >> 24) & 0x0f] +
              HEX_CHARS[(h1 >> 20) & 0x0f] +
              HEX_CHARS[(h1 >> 16) & 0x0f] +
              HEX_CHARS[(h1 >> 12) & 0x0f] +
              HEX_CHARS[(h1 >> 8) & 0x0f] +
              HEX_CHARS[(h1 >> 4) & 0x0f] +
              HEX_CHARS[h1 & 0x0f] +
              HEX_CHARS[(h2 >> 28) & 0x0f] +
              HEX_CHARS[(h2 >> 24) & 0x0f] +
              HEX_CHARS[(h2 >> 20) & 0x0f] +
              HEX_CHARS[(h2 >> 16) & 0x0f] +
              HEX_CHARS[(h2 >> 12) & 0x0f] +
              HEX_CHARS[(h2 >> 8) & 0x0f] +
              HEX_CHARS[(h2 >> 4) & 0x0f] +
              HEX_CHARS[h2 & 0x0f] +
              HEX_CHARS[(h3 >> 28) & 0x0f] +
              HEX_CHARS[(h3 >> 24) & 0x0f] +
              HEX_CHARS[(h3 >> 20) & 0x0f] +
              HEX_CHARS[(h3 >> 16) & 0x0f] +
              HEX_CHARS[(h3 >> 12) & 0x0f] +
              HEX_CHARS[(h3 >> 8) & 0x0f] +
              HEX_CHARS[(h3 >> 4) & 0x0f] +
              HEX_CHARS[h3 & 0x0f] +
              HEX_CHARS[(h4 >> 28) & 0x0f] +
              HEX_CHARS[(h4 >> 24) & 0x0f] +
              HEX_CHARS[(h4 >> 20) & 0x0f] +
              HEX_CHARS[(h4 >> 16) & 0x0f] +
              HEX_CHARS[(h4 >> 12) & 0x0f] +
              HEX_CHARS[(h4 >> 8) & 0x0f] +
              HEX_CHARS[(h4 >> 4) & 0x0f] +
              HEX_CHARS[h4 & 0x0f]);
          }
          toString() {
            return this.hex();
          }
          digest() {
            this.finalize();
            const h0 = this.#h0;
            const h1 = this.#h1;
            const h2 = this.#h2;
            const h3 = this.#h3;
            const h4 = this.#h4;
            return [
              (h0 >> 24) & 0xff,
              (h0 >> 16) & 0xff,
              (h0 >> 8) & 0xff,
              h0 & 0xff,
              (h1 >> 24) & 0xff,
              (h1 >> 16) & 0xff,
              (h1 >> 8) & 0xff,
              h1 & 0xff,
              (h2 >> 24) & 0xff,
              (h2 >> 16) & 0xff,
              (h2 >> 8) & 0xff,
              h2 & 0xff,
              (h3 >> 24) & 0xff,
              (h3 >> 16) & 0xff,
              (h3 >> 8) & 0xff,
              h3 & 0xff,
              (h4 >> 24) & 0xff,
              (h4 >> 16) & 0xff,
              (h4 >> 8) & 0xff,
              h4 & 0xff,
            ];
          }
          array() {
            return this.digest();
          }
          arrayBuffer() {
            this.finalize();
            const buffer = new ArrayBuffer(20);
            const dataView = new DataView(buffer);
            dataView.setUint32(0, this.#h0);
            dataView.setUint32(4, this.#h1);
            dataView.setUint32(8, this.#h2);
            dataView.setUint32(12, this.#h3);
            dataView.setUint32(16, this.#h4);
            return buffer;
          }
        };
        exports_35("Sha1", Sha1);
      },
    };
  },
);
System.register(
  "https://deno.land/std/bytes/mod",
  ["https://deno.land/std/io/util"],
  function (exports_36, context_36) {
    "use strict";
    var util_ts_2;
    var __moduleName = context_36 && context_36.id;
    /** Find first index of binary pattern from a. If not found, then return -1
     * @param source soruce array
     * @param pat pattern to find in source array
     */
    function findIndex(source, pat) {
      const s = pat[0];
      for (let i = 0; i < source.length; i++) {
        if (source[i] !== s) {
          continue;
        }
        const pin = i;
        let matched = 1;
        let j = i;
        while (matched < pat.length) {
          j++;
          if (source[j] !== pat[j - pin]) {
            break;
          }
          matched++;
        }
        if (matched === pat.length) {
          return pin;
        }
      }
      return -1;
    }
    exports_36("findIndex", findIndex);
    /** Find last index of binary pattern from a. If not found, then return -1.
     * @param source soruce array
     * @param pat pattern to find in source array
     */
    function findLastIndex(source, pat) {
      const e = pat[pat.length - 1];
      for (let i = source.length - 1; i >= 0; i--) {
        if (source[i] !== e) {
          continue;
        }
        const pin = i;
        let matched = 1;
        let j = i;
        while (matched < pat.length) {
          j--;
          if (source[j] !== pat[pat.length - 1 - (pin - j)]) {
            break;
          }
          matched++;
        }
        if (matched === pat.length) {
          return pin - pat.length + 1;
        }
      }
      return -1;
    }
    exports_36("findLastIndex", findLastIndex);
    /** Check whether binary arrays are equal to each other.
     * @param source first array to check equality
     * @param match second array to check equality
     */
    function equal(source, match) {
      if (source.length !== match.length) {
        return false;
      }
      for (let i = 0; i < match.length; i++) {
        if (source[i] !== match[i]) {
          return false;
        }
      }
      return true;
    }
    exports_36("equal", equal);
    /** Check whether binary array starts with prefix.
     * @param source srouce array
     * @param prefix prefix array to check in source
     */
    function hasPrefix(source, prefix) {
      for (let i = 0, max = prefix.length; i < max; i++) {
        if (source[i] !== prefix[i]) {
          return false;
        }
      }
      return true;
    }
    exports_36("hasPrefix", hasPrefix);
    /** Check whether binary array ends with suffix.
     * @param source srouce array
     * @param suffix suffix array to check in source
     */
    function hasSuffix(source, suffix) {
      for (
        let srci = source.length - 1, sfxi = suffix.length - 1;
        sfxi >= 0;
        srci--, sfxi--
      ) {
        if (source[srci] !== suffix[sfxi]) {
          return false;
        }
      }
      return true;
    }
    exports_36("hasSuffix", hasSuffix);
    /** Repeat bytes. returns a new byte slice consisting of `count` copies of `b`.
     * @param origin The origin bytes
     * @param count The count you want to repeat.
     */
    function repeat(origin, count) {
      if (count === 0) {
        return new Uint8Array();
      }
      if (count < 0) {
        throw new Error("bytes: negative repeat count");
      } else if ((origin.length * count) / count !== origin.length) {
        throw new Error("bytes: repeat count causes overflow");
      }
      const int = Math.floor(count);
      if (int !== count) {
        throw new Error("bytes: repeat count must be an integer");
      }
      const nb = new Uint8Array(origin.length * count);
      let bp = util_ts_2.copyBytes(origin, nb);
      for (; bp < nb.length; bp *= 2) {
        util_ts_2.copyBytes(nb.slice(0, bp), nb, bp);
      }
      return nb;
    }
    exports_36("repeat", repeat);
    /** Concatenate two binary arrays and return new one.
     * @param origin origin array to concatenate
     * @param b array to concatenate with origin
     */
    function concat(origin, b) {
      const output = new Uint8Array(origin.length + b.length);
      output.set(origin, 0);
      output.set(b, origin.length);
      return output;
    }
    exports_36("concat", concat);
    /** Check srouce array contains pattern array.
     * @param source srouce array
     * @param pat patter array
     */
    function contains(source, pat) {
      return findIndex(source, pat) != -1;
    }
    exports_36("contains", contains);
    return {
      setters: [
        function (util_ts_2_1) {
          util_ts_2 = util_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Based on https://github.com/golang/go/tree/master/src/net/textproto
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
System.register(
  "https://deno.land/std/textproto/mod",
  [
    "https://deno.land/std/io/util",
    "https://deno.land/std/bytes/mod",
    "https://deno.land/std/encoding/utf8",
  ],
  function (exports_37, context_37) {
    "use strict";
    var util_ts_3, mod_ts_3, utf8_ts_2, invalidHeaderCharRegex, TextProtoReader;
    var __moduleName = context_37 && context_37.id;
    function str(buf) {
      if (buf == null) {
        return "";
      } else {
        return utf8_ts_2.decode(buf);
      }
    }
    return {
      setters: [
        function (util_ts_3_1) {
          util_ts_3 = util_ts_3_1;
        },
        function (mod_ts_3_1) {
          mod_ts_3 = mod_ts_3_1;
        },
        function (utf8_ts_2_1) {
          utf8_ts_2 = utf8_ts_2_1;
        },
      ],
      execute: function () {
        // FROM https://github.com/denoland/deno/blob/b34628a26ab0187a827aa4ebe256e23178e25d39/cli/js/web/headers.ts#L9
        invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
        TextProtoReader = class TextProtoReader {
          constructor(r) {
            this.r = r;
          }
          /** readLine() reads a single line from the TextProtoReader,
                 * eliding the final \n or \r\n from the returned string.
                 */
          async readLine() {
            const s = await this.readLineSlice();
            if (s === null) {
              return null;
            }
            return str(s);
          }
          /** ReadMIMEHeader reads a MIME-style header from r.
                 * The header is a sequence of possibly continued Key: Value lines
                 * ending in a blank line.
                 * The returned map m maps CanonicalMIMEHeaderKey(key) to a
                 * sequence of values in the same order encountered in the input.
                 *
                 * For example, consider this input:
                 *
                 *	My-Key: Value 1
                 *	Long-Key: Even
                 *	       Longer Value
                 *	My-Key: Value 2
                 *
                 * Given that input, ReadMIMEHeader returns the map:
                 *
                 *	map[string][]string{
                 *		"My-Key": {"Value 1", "Value 2"},
                 *		"Long-Key": {"Even Longer Value"},
                 *	}
                 */
          async readMIMEHeader() {
            const m = new Headers();
            let line;
            // The first line cannot start with a leading space.
            let buf = await this.r.peek(1);
            if (buf === null) {
              return null;
            } else if (
              buf[0] == util_ts_3.charCode(" ") ||
              buf[0] == util_ts_3.charCode("\t")
            ) {
              line = (await this.readLineSlice());
            }
            buf = await this.r.peek(1);
            if (buf === null) {
              throw new Deno.errors.UnexpectedEof();
            } else if (
              buf[0] == util_ts_3.charCode(" ") ||
              buf[0] == util_ts_3.charCode("\t")
            ) {
              throw new Deno.errors.InvalidData(
                `malformed MIME header initial line: ${str(line)}`,
              );
            }
            while (true) {
              const kv = await this.readLineSlice(); // readContinuedLineSlice
              if (kv === null) {
                throw new Deno.errors.UnexpectedEof();
              }
              if (kv.byteLength === 0) {
                return m;
              }
              // Key ends at first colon
              let i = kv.indexOf(util_ts_3.charCode(":"));
              if (i < 0) {
                throw new Deno.errors.InvalidData(
                  `malformed MIME header line: ${str(kv)}`,
                );
              }
              //let key = canonicalMIMEHeaderKey(kv.subarray(0, endKey));
              const key = str(kv.subarray(0, i));
              // As per RFC 7230 field-name is a token,
              // tokens consist of one or more chars.
              // We could throw `Deno.errors.InvalidData` here,
              // but better to be liberal in what we
              // accept, so if we get an empty key, skip it.
              if (key == "") {
                continue;
              }
              // Skip initial spaces in value.
              i++; // skip colon
              while (
                i < kv.byteLength &&
                (kv[i] == util_ts_3.charCode(" ") ||
                  kv[i] == util_ts_3.charCode("\t"))
              ) {
                i++;
              }
              const value = str(kv.subarray(i)).replace(
                invalidHeaderCharRegex,
                encodeURI,
              );
              // In case of invalid header we swallow the error
              // example: "Audio Mode" => invalid due to space in the key
              try {
                m.append(key, value);
              } catch {}
            }
          }
          async readLineSlice() {
            // this.closeDot();
            let line;
            while (true) {
              const r = await this.r.readLine();
              if (r === null) {
                return null;
              }
              const { line: l, more } = r;
              // Avoid the copy if the first call produced a full line.
              if (!line && !more) {
                // TODO(ry):
                // This skipSpace() is definitely misplaced, but I don't know where it
                // comes from nor how to fix it.
                if (this.skipSpace(l) === 0) {
                  return new Uint8Array(0);
                }
                return l;
              }
              line = line ? mod_ts_3.concat(line, l) : l;
              if (!more) {
                break;
              }
            }
            return line;
          }
          skipSpace(l) {
            let n = 0;
            for (let i = 0; i < l.length; i++) {
              if (
                l[i] === util_ts_3.charCode(" ") ||
                l[i] === util_ts_3.charCode("\t")
              ) {
                continue;
              }
              n++;
            }
            return n;
          }
        };
        exports_37("TextProtoReader", TextProtoReader);
      },
    };
  },
);
System.register(
  "https://deno.land/std/async/deferred",
  [],
  function (exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    /** Creates a Promise with the `reject` and `resolve` functions
     * placed as methods on the promise object itself. It allows you to do:
     *
     *     const p = deferred<number>();
     *     // ...
     *     p.resolve(42);
     */
    function deferred() {
      let methods;
      const promise = new Promise((resolve, reject) => {
        methods = { resolve, reject };
      });
      return Object.assign(promise, methods);
    }
    exports_38("deferred", deferred);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std/async/delay",
  [],
  function (exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    /* Resolves after the given number of milliseconds. */
    function delay(ms) {
      return new Promise((res) =>
        setTimeout(() => {
          res();
        }, ms)
      );
    }
    exports_39("delay", delay);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std/async/mux_async_iterator",
  ["https://deno.land/std/async/deferred"],
  function (exports_40, context_40) {
    "use strict";
    var deferred_ts_1, MuxAsyncIterator;
    var __moduleName = context_40 && context_40.id;
    return {
      setters: [
        function (deferred_ts_1_1) {
          deferred_ts_1 = deferred_ts_1_1;
        },
      ],
      execute: function () {
        /** The MuxAsyncIterator class multiplexes multiple async iterators into a
             * single stream. It currently makes a few assumptions:
             * - The iterators do not throw.
             * - The final result (the value returned and not yielded from the iterator)
             *   does not matter; if there is any, it is discarded.
             */
        MuxAsyncIterator = class MuxAsyncIterator {
          constructor() {
            this.iteratorCount = 0;
            this.yields = [];
            this.signal = deferred_ts_1.deferred();
          }
          add(iterator) {
            ++this.iteratorCount;
            this.callIteratorNext(iterator);
          }
          async callIteratorNext(iterator) {
            const { value, done } = await iterator.next();
            if (done) {
              --this.iteratorCount;
            } else {
              this.yields.push({ iterator, value });
            }
            this.signal.resolve();
          }
          async *iterate() {
            while (this.iteratorCount > 0) {
              // Sleep until any of the wrapped iterators yields.
              await this.signal;
              // Note that while we're looping over `yields`, new items may be added.
              for (let i = 0; i < this.yields.length; i++) {
                const { iterator, value } = this.yields[i];
                yield value;
                this.callIteratorNext(iterator);
              }
              // Clear the `yields` list and reset the `signal` promise.
              this.yields.length = 0;
              this.signal = deferred_ts_1.deferred();
            }
          }
          [Symbol.asyncIterator]() {
            return this.iterate();
          }
        };
        exports_40("MuxAsyncIterator", MuxAsyncIterator);
      },
    };
  },
);
System.register(
  "https://deno.land/std/async/mod",
  [
    "https://deno.land/std/async/deferred",
    "https://deno.land/std/async/delay",
    "https://deno.land/std/async/mux_async_iterator",
  ],
  function (exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    function exportStar_2(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_41(exports);
    }
    return {
      setters: [
        function (deferred_ts_2_1) {
          exportStar_2(deferred_ts_2_1);
        },
        function (delay_ts_1_1) {
          exportStar_2(delay_ts_1_1);
        },
        function (mux_async_iterator_ts_1_1) {
          exportStar_2(mux_async_iterator_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std/http/server",
  [
    "https://deno.land/std/encoding/utf8",
    "https://deno.land/std/io/bufio",
    "https://deno.land/std/testing/asserts",
    "https://deno.land/std/async/mod",
    "https://deno.land/std/http/_io",
  ],
  function (exports_42, context_42) {
    "use strict";
    var utf8_ts_3,
      bufio_ts_1,
      asserts_ts_6,
      mod_ts_4,
      _io_ts_1,
      listen,
      listenTls,
      ServerRequest,
      Server;
    var __moduleName = context_42 && context_42.id;
    /**
     * Create a HTTP server
     *
     *     import { serve } from "https://deno.land/std/http/server.ts";
     *     const body = "Hello World\n";
     *     const server = serve({ port: 8000 });
     *     for await (const req of server) {
     *       req.respond({ body });
     *     }
     */
    function serve(addr) {
      if (typeof addr === "string") {
        const [hostname, port] = addr.split(":");
        addr = { hostname, port: Number(port) };
      }
      const listener = listen(addr);
      return new Server(listener);
    }
    exports_42("serve", serve);
    /**
     * Start an HTTP server with given options and request handler
     *
     *     const body = "Hello World\n";
     *     const options = { port: 8000 };
     *     listenAndServe(options, (req) => {
     *       req.respond({ body });
     *     });
     *
     * @param options Server configuration
     * @param handler Request handler
     */
    async function listenAndServe(addr, handler) {
      const server = serve(addr);
      for await (const request of server) {
        handler(request);
      }
    }
    exports_42("listenAndServe", listenAndServe);
    /**
     * Create an HTTPS server with given options
     *
     *     const body = "Hello HTTPS";
     *     const options = {
     *       hostname: "localhost",
     *       port: 443,
     *       certFile: "./path/to/localhost.crt",
     *       keyFile: "./path/to/localhost.key",
     *     };
     *     for await (const req of serveTLS(options)) {
     *       req.respond({ body });
     *     }
     *
     * @param options Server configuration
     * @return Async iterable server instance for incoming requests
     */
    function serveTLS(options) {
      const tlsOptions = {
        ...options,
        transport: "tcp",
      };
      const listener = listenTls(tlsOptions);
      return new Server(listener);
    }
    exports_42("serveTLS", serveTLS);
    /**
     * Start an HTTPS server with given options and request handler
     *
     *     const body = "Hello HTTPS";
     *     const options = {
     *       hostname: "localhost",
     *       port: 443,
     *       certFile: "./path/to/localhost.crt",
     *       keyFile: "./path/to/localhost.key",
     *     };
     *     listenAndServeTLS(options, (req) => {
     *       req.respond({ body });
     *     });
     *
     * @param options Server configuration
     * @param handler Request handler
     */
    async function listenAndServeTLS(options, handler) {
      const server = serveTLS(options);
      for await (const request of server) {
        handler(request);
      }
    }
    exports_42("listenAndServeTLS", listenAndServeTLS);
    return {
      setters: [
        function (utf8_ts_3_1) {
          utf8_ts_3 = utf8_ts_3_1;
        },
        function (bufio_ts_1_1) {
          bufio_ts_1 = bufio_ts_1_1;
        },
        function (asserts_ts_6_1) {
          asserts_ts_6 = asserts_ts_6_1;
        },
        function (mod_ts_4_1) {
          mod_ts_4 = mod_ts_4_1;
        },
        function (_io_ts_1_1) {
          _io_ts_1 = _io_ts_1_1;
        },
      ],
      execute: function () {
        listen = Deno.listen, listenTls = Deno.listenTls;
        ServerRequest = class ServerRequest {
          constructor() {
            this.done = mod_ts_4.deferred();
            this._contentLength = undefined;
            this._body = null;
            this.finalized = false;
          }
          /**
                 * Value of Content-Length header.
                 * If null, then content length is invalid or not given (e.g. chunked encoding).
                 */
          get contentLength() {
            // undefined means not cached.
            // null means invalid or not provided.
            if (this._contentLength === undefined) {
              const cl = this.headers.get("content-length");
              if (cl) {
                this._contentLength = parseInt(cl);
                // Convert NaN to null (as NaN harder to test)
                if (Number.isNaN(this._contentLength)) {
                  this._contentLength = null;
                }
              } else {
                this._contentLength = null;
              }
            }
            return this._contentLength;
          }
          /**
                 * Body of the request.  The easiest way to consume the body is:
                 *
                 *     const buf: Uint8Array = await Deno.readAll(req.body);
                 */
          get body() {
            if (!this._body) {
              if (this.contentLength != null) {
                this._body = _io_ts_1.bodyReader(this.contentLength, this.r);
              } else {
                const transferEncoding = this.headers.get("transfer-encoding");
                if (transferEncoding != null) {
                  const parts = transferEncoding
                    .split(",")
                    .map((e) => e.trim().toLowerCase());
                  asserts_ts_6.assert(
                    parts.includes("chunked"),
                    'transfer-encoding must include "chunked" if content-length is not set',
                  );
                  this._body = _io_ts_1.chunkedBodyReader(this.headers, this.r);
                } else {
                  // Neither content-length nor transfer-encoding: chunked
                  this._body = _io_ts_1.emptyReader();
                }
              }
            }
            return this._body;
          }
          async respond(r) {
            let err;
            try {
              // Write our response!
              await _io_ts_1.writeResponse(this.w, r);
            } catch (e) {
              try {
                // Eagerly close on error.
                this.conn.close();
              } catch {}
              err = e;
            }
            // Signal that this request has been processed and the next pipelined
            // request on the same connection can be accepted.
            this.done.resolve(err);
            if (err) {
              // Error during responding, rethrow.
              throw err;
            }
          }
          async finalize() {
            if (this.finalized) {
              return;
            }
            // Consume unread body
            const body = this.body;
            const buf = new Uint8Array(1024);
            while ((await body.read(buf)) !== null) {}
            this.finalized = true;
          }
        };
        exports_42("ServerRequest", ServerRequest);
        Server = class Server {
          constructor(listener) {
            this.listener = listener;
            this.closing = false;
            this.connections = [];
          }
          close() {
            this.closing = true;
            this.listener.close();
            for (const conn of this.connections) {
              try {
                conn.close();
              } catch (e) {
                // Connection might have been already closed
                if (!(e instanceof Deno.errors.BadResource)) {
                  throw e;
                }
              }
            }
          }
          // Yields all HTTP requests on a single TCP connection.
          async *iterateHttpRequests(conn) {
            const reader = new bufio_ts_1.BufReader(conn);
            const writer = new bufio_ts_1.BufWriter(conn);
            while (!this.closing) {
              let request;
              try {
                request = await _io_ts_1.readRequest(conn, reader);
              } catch (error) {
                if (
                  error instanceof Deno.errors.InvalidData ||
                  error instanceof Deno.errors.UnexpectedEof
                ) {
                  // An error was thrown while parsing request headers.
                  await _io_ts_1.writeResponse(writer, {
                    status: 400,
                    body: utf8_ts_3.encode(`${error.message}\r\n\r\n`),
                  });
                }
                break;
              }
              if (request === null) {
                break;
              }
              request.w = writer;
              yield request;
              // Wait for the request to be processed before we accept a new request on
              // this connection.
              const responseError = await request.done;
              if (responseError) {
                // Something bad happened during response.
                // (likely other side closed during pipelined req)
                // req.done implies this connection already closed, so we can just return.
                this.untrackConnection(request.conn);
                return;
              }
              // Consume unread body and trailers if receiver didn't consume those data
              await request.finalize();
            }
            this.untrackConnection(conn);
            try {
              conn.close();
            } catch (e) {
              // might have been already closed
            }
          }
          trackConnection(conn) {
            this.connections.push(conn);
          }
          untrackConnection(conn) {
            const index = this.connections.indexOf(conn);
            if (index !== -1) {
              this.connections.splice(index, 1);
            }
          }
          // Accepts a new TCP connection and yields all HTTP requests that arrive on
          // it. When a connection is accepted, it also creates a new iterator of the
          // same kind and adds it to the request multiplexer so that another TCP
          // connection can be accepted.
          async *acceptConnAndIterateHttpRequests(mux) {
            if (this.closing) {
              return;
            }
            // Wait for a new connection.
            let conn;
            try {
              conn = await this.listener.accept();
            } catch (error) {
              if (error instanceof Deno.errors.BadResource) {
                return;
              }
              throw error;
            }
            this.trackConnection(conn);
            // Try to accept another connection and add it to the multiplexer.
            mux.add(this.acceptConnAndIterateHttpRequests(mux));
            // Yield the requests that arrive on the just-accepted connection.
            yield* this.iterateHttpRequests(conn);
          }
          [Symbol.asyncIterator]() {
            const mux = new mod_ts_4.MuxAsyncIterator();
            mux.add(this.acceptConnAndIterateHttpRequests(mux));
            return mux.iterate();
          }
        };
        exports_42("Server", Server);
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std/http/http_status",
  [],
  function (exports_43, context_43) {
    "use strict";
    var Status, STATUS_TEXT;
    var __moduleName = context_43 && context_43.id;
    return {
      setters: [],
      execute: function () {
        /** HTTP status codes */
        (function (Status) {
          /** RFC 7231, 6.2.1 */
          Status[Status["Continue"] = 100] = "Continue";
          /** RFC 7231, 6.2.2 */
          Status[Status["SwitchingProtocols"] = 101] = "SwitchingProtocols";
          /** RFC 2518, 10.1 */
          Status[Status["Processing"] = 102] = "Processing";
          /** RFC 7231, 6.3.1 */
          Status[Status["OK"] = 200] = "OK";
          /** RFC 7231, 6.3.2 */
          Status[Status["Created"] = 201] = "Created";
          /** RFC 7231, 6.3.3 */
          Status[Status["Accepted"] = 202] = "Accepted";
          /** RFC 7231, 6.3.4 */
          Status[Status["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
          /** RFC 7231, 6.3.5 */
          Status[Status["NoContent"] = 204] = "NoContent";
          /** RFC 7231, 6.3.6 */
          Status[Status["ResetContent"] = 205] = "ResetContent";
          /** RFC 7233, 4.1 */
          Status[Status["PartialContent"] = 206] = "PartialContent";
          /** RFC 4918, 11.1 */
          Status[Status["MultiStatus"] = 207] = "MultiStatus";
          /** RFC 5842, 7.1 */
          Status[Status["AlreadyReported"] = 208] = "AlreadyReported";
          /** RFC 3229, 10.4.1 */
          Status[Status["IMUsed"] = 226] = "IMUsed";
          /** RFC 7231, 6.4.1 */
          Status[Status["MultipleChoices"] = 300] = "MultipleChoices";
          /** RFC 7231, 6.4.2 */
          Status[Status["MovedPermanently"] = 301] = "MovedPermanently";
          /** RFC 7231, 6.4.3 */
          Status[Status["Found"] = 302] = "Found";
          /** RFC 7231, 6.4.4 */
          Status[Status["SeeOther"] = 303] = "SeeOther";
          /** RFC 7232, 4.1 */
          Status[Status["NotModified"] = 304] = "NotModified";
          /** RFC 7231, 6.4.5 */
          Status[Status["UseProxy"] = 305] = "UseProxy";
          /** RFC 7231, 6.4.7 */
          Status[Status["TemporaryRedirect"] = 307] = "TemporaryRedirect";
          /** RFC 7538, 3 */
          Status[Status["PermanentRedirect"] = 308] = "PermanentRedirect";
          /** RFC 7231, 6.5.1 */
          Status[Status["BadRequest"] = 400] = "BadRequest";
          /** RFC 7235, 3.1 */
          Status[Status["Unauthorized"] = 401] = "Unauthorized";
          /** RFC 7231, 6.5.2 */
          Status[Status["PaymentRequired"] = 402] = "PaymentRequired";
          /** RFC 7231, 6.5.3 */
          Status[Status["Forbidden"] = 403] = "Forbidden";
          /** RFC 7231, 6.5.4 */
          Status[Status["NotFound"] = 404] = "NotFound";
          /** RFC 7231, 6.5.5 */
          Status[Status["MethodNotAllowed"] = 405] = "MethodNotAllowed";
          /** RFC 7231, 6.5.6 */
          Status[Status["NotAcceptable"] = 406] = "NotAcceptable";
          /** RFC 7235, 3.2 */
          Status[Status["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
          /** RFC 7231, 6.5.7 */
          Status[Status["RequestTimeout"] = 408] = "RequestTimeout";
          /** RFC 7231, 6.5.8 */
          Status[Status["Conflict"] = 409] = "Conflict";
          /** RFC 7231, 6.5.9 */
          Status[Status["Gone"] = 410] = "Gone";
          /** RFC 7231, 6.5.10 */
          Status[Status["LengthRequired"] = 411] = "LengthRequired";
          /** RFC 7232, 4.2 */
          Status[Status["PreconditionFailed"] = 412] = "PreconditionFailed";
          /** RFC 7231, 6.5.11 */
          Status[Status["RequestEntityTooLarge"] = 413] =
            "RequestEntityTooLarge";
          /** RFC 7231, 6.5.12 */
          Status[Status["RequestURITooLong"] = 414] = "RequestURITooLong";
          /** RFC 7231, 6.5.13 */
          Status[Status["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
          /** RFC 7233, 4.4 */
          Status[Status["RequestedRangeNotSatisfiable"] = 416] =
            "RequestedRangeNotSatisfiable";
          /** RFC 7231, 6.5.14 */
          Status[Status["ExpectationFailed"] = 417] = "ExpectationFailed";
          /** RFC 7168, 2.3.3 */
          Status[Status["Teapot"] = 418] = "Teapot";
          /** RFC 7540, 9.1.2 */
          Status[Status["MisdirectedRequest"] = 421] = "MisdirectedRequest";
          /** RFC 4918, 11.2 */
          Status[Status["UnprocessableEntity"] = 422] = "UnprocessableEntity";
          /** RFC 4918, 11.3 */
          Status[Status["Locked"] = 423] = "Locked";
          /** RFC 4918, 11.4 */
          Status[Status["FailedDependency"] = 424] = "FailedDependency";
          /** RFC 8470, 5.2 */
          Status[Status["TooEarly"] = 425] = "TooEarly";
          /** RFC 7231, 6.5.15 */
          Status[Status["UpgradeRequired"] = 426] = "UpgradeRequired";
          /** RFC 6585, 3 */
          Status[Status["PreconditionRequired"] = 428] = "PreconditionRequired";
          /** RFC 6585, 4 */
          Status[Status["TooManyRequests"] = 429] = "TooManyRequests";
          /** RFC 6585, 5 */
          Status[Status["RequestHeaderFieldsTooLarge"] = 431] =
            "RequestHeaderFieldsTooLarge";
          /** RFC 7725, 3 */
          Status[Status["UnavailableForLegalReasons"] = 451] =
            "UnavailableForLegalReasons";
          /** RFC 7231, 6.6.1 */
          Status[Status["InternalServerError"] = 500] = "InternalServerError";
          /** RFC 7231, 6.6.2 */
          Status[Status["NotImplemented"] = 501] = "NotImplemented";
          /** RFC 7231, 6.6.3 */
          Status[Status["BadGateway"] = 502] = "BadGateway";
          /** RFC 7231, 6.6.4 */
          Status[Status["ServiceUnavailable"] = 503] = "ServiceUnavailable";
          /** RFC 7231, 6.6.5 */
          Status[Status["GatewayTimeout"] = 504] = "GatewayTimeout";
          /** RFC 7231, 6.6.6 */
          Status[Status["HTTPVersionNotSupported"] = 505] =
            "HTTPVersionNotSupported";
          /** RFC 2295, 8.1 */
          Status[Status["VariantAlsoNegotiates"] = 506] =
            "VariantAlsoNegotiates";
          /** RFC 4918, 11.5 */
          Status[Status["InsufficientStorage"] = 507] = "InsufficientStorage";
          /** RFC 5842, 7.2 */
          Status[Status["LoopDetected"] = 508] = "LoopDetected";
          /** RFC 2774, 7 */
          Status[Status["NotExtended"] = 510] = "NotExtended";
          /** RFC 6585, 6 */
          Status[Status["NetworkAuthenticationRequired"] = 511] =
            "NetworkAuthenticationRequired";
        })(Status || (Status = {}));
        exports_43("Status", Status);
        exports_43(
          "STATUS_TEXT",
          STATUS_TEXT = new Map([
            [Status.Continue, "Continue"],
            [Status.SwitchingProtocols, "Switching Protocols"],
            [Status.Processing, "Processing"],
            [Status.OK, "OK"],
            [Status.Created, "Created"],
            [Status.Accepted, "Accepted"],
            [Status.NonAuthoritativeInfo, "Non-Authoritative Information"],
            [Status.NoContent, "No Content"],
            [Status.ResetContent, "Reset Content"],
            [Status.PartialContent, "Partial Content"],
            [Status.MultiStatus, "Multi-Status"],
            [Status.AlreadyReported, "Already Reported"],
            [Status.IMUsed, "IM Used"],
            [Status.MultipleChoices, "Multiple Choices"],
            [Status.MovedPermanently, "Moved Permanently"],
            [Status.Found, "Found"],
            [Status.SeeOther, "See Other"],
            [Status.NotModified, "Not Modified"],
            [Status.UseProxy, "Use Proxy"],
            [Status.TemporaryRedirect, "Temporary Redirect"],
            [Status.PermanentRedirect, "Permanent Redirect"],
            [Status.BadRequest, "Bad Request"],
            [Status.Unauthorized, "Unauthorized"],
            [Status.PaymentRequired, "Payment Required"],
            [Status.Forbidden, "Forbidden"],
            [Status.NotFound, "Not Found"],
            [Status.MethodNotAllowed, "Method Not Allowed"],
            [Status.NotAcceptable, "Not Acceptable"],
            [Status.ProxyAuthRequired, "Proxy Authentication Required"],
            [Status.RequestTimeout, "Request Timeout"],
            [Status.Conflict, "Conflict"],
            [Status.Gone, "Gone"],
            [Status.LengthRequired, "Length Required"],
            [Status.PreconditionFailed, "Precondition Failed"],
            [Status.RequestEntityTooLarge, "Request Entity Too Large"],
            [Status.RequestURITooLong, "Request URI Too Long"],
            [Status.UnsupportedMediaType, "Unsupported Media Type"],
            [
              Status.RequestedRangeNotSatisfiable,
              "Requested Range Not Satisfiable",
            ],
            [Status.ExpectationFailed, "Expectation Failed"],
            [Status.Teapot, "I'm a teapot"],
            [Status.MisdirectedRequest, "Misdirected Request"],
            [Status.UnprocessableEntity, "Unprocessable Entity"],
            [Status.Locked, "Locked"],
            [Status.FailedDependency, "Failed Dependency"],
            [Status.TooEarly, "Too Early"],
            [Status.UpgradeRequired, "Upgrade Required"],
            [Status.PreconditionRequired, "Precondition Required"],
            [Status.TooManyRequests, "Too Many Requests"],
            [
              Status.RequestHeaderFieldsTooLarge,
              "Request Header Fields Too Large",
            ],
            [
              Status.UnavailableForLegalReasons,
              "Unavailable For Legal Reasons",
            ],
            [Status.InternalServerError, "Internal Server Error"],
            [Status.NotImplemented, "Not Implemented"],
            [Status.BadGateway, "Bad Gateway"],
            [Status.ServiceUnavailable, "Service Unavailable"],
            [Status.GatewayTimeout, "Gateway Timeout"],
            [Status.HTTPVersionNotSupported, "HTTP Version Not Supported"],
            [Status.VariantAlsoNegotiates, "Variant Also Negotiates"],
            [Status.InsufficientStorage, "Insufficient Storage"],
            [Status.LoopDetected, "Loop Detected"],
            [Status.NotExtended, "Not Extended"],
            [
              Status.NetworkAuthenticationRequired,
              "Network Authentication Required",
            ],
          ]),
        );
      },
    };
  },
);
System.register(
  "https://deno.land/std/http/_io",
  [
    "https://deno.land/std/io/bufio",
    "https://deno.land/std/textproto/mod",
    "https://deno.land/std/testing/asserts",
    "https://deno.land/std/encoding/utf8",
    "https://deno.land/std/http/server",
    "https://deno.land/std/http/http_status",
  ],
  function (exports_44, context_44) {
    "use strict";
    var bufio_ts_2,
      mod_ts_5,
      asserts_ts_7,
      utf8_ts_4,
      server_ts_1,
      http_status_ts_1;
    var __moduleName = context_44 && context_44.id;
    function emptyReader() {
      return {
        read(_) {
          return Promise.resolve(null);
        },
      };
    }
    exports_44("emptyReader", emptyReader);
    function bodyReader(contentLength, r) {
      let totalRead = 0;
      let finished = false;
      async function read(buf) {
        if (finished) {
          return null;
        }
        let result;
        const remaining = contentLength - totalRead;
        if (remaining >= buf.byteLength) {
          result = await r.read(buf);
        } else {
          const readBuf = buf.subarray(0, remaining);
          result = await r.read(readBuf);
        }
        if (result !== null) {
          totalRead += result;
        }
        finished = totalRead === contentLength;
        return result;
      }
      return { read };
    }
    exports_44("bodyReader", bodyReader);
    function chunkedBodyReader(h, r) {
      // Based on https://tools.ietf.org/html/rfc2616#section-19.4.6
      const tp = new mod_ts_5.TextProtoReader(r);
      let finished = false;
      const chunks = [];
      async function read(buf) {
        if (finished) {
          return null;
        }
        const [chunk] = chunks;
        if (chunk) {
          const chunkRemaining = chunk.data.byteLength - chunk.offset;
          const readLength = Math.min(chunkRemaining, buf.byteLength);
          for (let i = 0; i < readLength; i++) {
            buf[i] = chunk.data[chunk.offset + i];
          }
          chunk.offset += readLength;
          if (chunk.offset === chunk.data.byteLength) {
            chunks.shift();
            // Consume \r\n;
            if ((await tp.readLine()) === null) {
              throw new Deno.errors.UnexpectedEof();
            }
          }
          return readLength;
        }
        const line = await tp.readLine();
        if (line === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        // TODO: handle chunk extension
        const [chunkSizeString] = line.split(";");
        const chunkSize = parseInt(chunkSizeString, 16);
        if (Number.isNaN(chunkSize) || chunkSize < 0) {
          throw new Error("Invalid chunk size");
        }
        if (chunkSize > 0) {
          if (chunkSize > buf.byteLength) {
            let eof = await r.readFull(buf);
            if (eof === null) {
              throw new Deno.errors.UnexpectedEof();
            }
            const restChunk = new Uint8Array(chunkSize - buf.byteLength);
            eof = await r.readFull(restChunk);
            if (eof === null) {
              throw new Deno.errors.UnexpectedEof();
            } else {
              chunks.push({
                offset: 0,
                data: restChunk,
              });
            }
            return buf.byteLength;
          } else {
            const bufToFill = buf.subarray(0, chunkSize);
            const eof = await r.readFull(bufToFill);
            if (eof === null) {
              throw new Deno.errors.UnexpectedEof();
            }
            // Consume \r\n
            if ((await tp.readLine()) === null) {
              throw new Deno.errors.UnexpectedEof();
            }
            return chunkSize;
          }
        } else {
          asserts_ts_7.assert(chunkSize === 0);
          // Consume \r\n
          if ((await r.readLine()) === null) {
            throw new Deno.errors.UnexpectedEof();
          }
          await readTrailers(h, r);
          finished = true;
          return null;
        }
      }
      return { read };
    }
    exports_44("chunkedBodyReader", chunkedBodyReader);
    function isProhibidedForTrailer(key) {
      const s = new Set(["transfer-encoding", "content-length", "trailer"]);
      return s.has(key.toLowerCase());
    }
    /**
     * Read trailer headers from reader and append values to headers.
     * "trailer" field will be deleted.
     * */
    async function readTrailers(headers, r) {
      const headerKeys = parseTrailer(headers.get("trailer"));
      if (!headerKeys) {
        return;
      }
      const tp = new mod_ts_5.TextProtoReader(r);
      const result = await tp.readMIMEHeader();
      asserts_ts_7.assert(result !== null, "trailer must be set");
      for (const [k, v] of result) {
        if (!headerKeys.has(k)) {
          throw new Error("Undeclared trailer field");
        }
        headerKeys.delete(k);
        headers.append(k, v);
      }
      asserts_ts_7.assert(
        Array.from(headerKeys).length === 0,
        "Missing trailers",
      );
      headers.delete("trailer");
    }
    exports_44("readTrailers", readTrailers);
    function parseTrailer(field) {
      if (field == null) {
        return undefined;
      }
      const keys = field.split(",").map((v) => v.trim().toLowerCase());
      if (keys.length === 0) {
        throw new Error("Empty trailer");
      }
      for (const key of keys) {
        if (isProhibidedForTrailer(key)) {
          throw new Error(`Prohibited field for trailer`);
        }
      }
      return new Headers(keys.map((key) => [key, ""]));
    }
    async function writeChunkedBody(w, r) {
      const writer = bufio_ts_2.BufWriter.create(w);
      for await (const chunk of Deno.iter(r)) {
        if (chunk.byteLength <= 0) {
          continue;
        }
        const start = utf8_ts_4.encoder.encode(
          `${chunk.byteLength.toString(16)}\r\n`,
        );
        const end = utf8_ts_4.encoder.encode("\r\n");
        await writer.write(start);
        await writer.write(chunk);
        await writer.write(end);
      }
      const endChunk = utf8_ts_4.encoder.encode("0\r\n\r\n");
      await writer.write(endChunk);
    }
    exports_44("writeChunkedBody", writeChunkedBody);
    /** write trailer headers to writer. it mostly should be called after writeResponse */
    async function writeTrailers(w, headers, trailers) {
      const trailer = headers.get("trailer");
      if (trailer === null) {
        throw new Error('response headers must have "trailer" header field');
      }
      const transferEncoding = headers.get("transfer-encoding");
      if (transferEncoding === null || !transferEncoding.match(/^chunked/)) {
        throw new Error(
          `trailer headers is only allowed for "transfer-encoding: chunked": got "${transferEncoding}"`,
        );
      }
      const writer = bufio_ts_2.BufWriter.create(w);
      const trailerHeaderFields = trailer
        .split(",")
        .map((s) => s.trim().toLowerCase());
      for (const f of trailerHeaderFields) {
        asserts_ts_7.assert(
          !isProhibidedForTrailer(f),
          `"${f}" is prohibited for trailer header`,
        );
      }
      for (const [key, value] of trailers) {
        asserts_ts_7.assert(
          trailerHeaderFields.includes(key),
          `Not trailer header field: ${key}`,
        );
        await writer.write(utf8_ts_4.encoder.encode(`${key}: ${value}\r\n`));
      }
      await writer.write(utf8_ts_4.encoder.encode("\r\n"));
      await writer.flush();
    }
    exports_44("writeTrailers", writeTrailers);
    async function writeResponse(w, r) {
      const protoMajor = 1;
      const protoMinor = 1;
      const statusCode = r.status || 200;
      const statusText = http_status_ts_1.STATUS_TEXT.get(statusCode);
      const writer = bufio_ts_2.BufWriter.create(w);
      if (!statusText) {
        throw new Deno.errors.InvalidData("Bad status code");
      }
      if (!r.body) {
        r.body = new Uint8Array();
      }
      if (typeof r.body === "string") {
        r.body = utf8_ts_4.encoder.encode(r.body);
      }
      let out =
        `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r\n`;
      const headers = r.headers ?? new Headers();
      if (r.body && !headers.get("content-length")) {
        if (r.body instanceof Uint8Array) {
          out += `content-length: ${r.body.byteLength}\r\n`;
        } else if (!headers.get("transfer-encoding")) {
          out += "transfer-encoding: chunked\r\n";
        }
      }
      for (const [key, value] of headers) {
        out += `${key}: ${value}\r\n`;
      }
      out += `\r\n`;
      const header = utf8_ts_4.encoder.encode(out);
      const n = await writer.write(header);
      asserts_ts_7.assert(n === header.byteLength);
      if (r.body instanceof Uint8Array) {
        const n = await writer.write(r.body);
        asserts_ts_7.assert(n === r.body.byteLength);
      } else if (headers.has("content-length")) {
        const contentLength = headers.get("content-length");
        asserts_ts_7.assert(contentLength != null);
        const bodyLength = parseInt(contentLength);
        const n = await Deno.copy(r.body, writer);
        asserts_ts_7.assert(n === bodyLength);
      } else {
        await writeChunkedBody(writer, r.body);
      }
      if (r.trailers) {
        const t = await r.trailers();
        await writeTrailers(writer, headers, t);
      }
      await writer.flush();
    }
    exports_44("writeResponse", writeResponse);
    /**
     * ParseHTTPVersion parses a HTTP version string.
     * "HTTP/1.0" returns (1, 0).
     * Ported from https://github.com/golang/go/blob/f5c43b9/src/net/http/request.go#L766-L792
     */
    function parseHTTPVersion(vers) {
      switch (vers) {
        case "HTTP/1.1":
          return [1, 1];
        case "HTTP/1.0":
          return [1, 0];
        default: {
          const Big = 1000000; // arbitrary upper bound
          if (!vers.startsWith("HTTP/")) {
            break;
          }
          const dot = vers.indexOf(".");
          if (dot < 0) {
            break;
          }
          const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
          const major = Number(majorStr);
          if (!Number.isInteger(major) || major < 0 || major > Big) {
            break;
          }
          const minorStr = vers.substring(dot + 1);
          const minor = Number(minorStr);
          if (!Number.isInteger(minor) || minor < 0 || minor > Big) {
            break;
          }
          return [major, minor];
        }
      }
      throw new Error(`malformed HTTP version ${vers}`);
    }
    exports_44("parseHTTPVersion", parseHTTPVersion);
    async function readRequest(conn, bufr) {
      const tp = new mod_ts_5.TextProtoReader(bufr);
      const firstLine = await tp.readLine(); // e.g. GET /index.html HTTP/1.0
      if (firstLine === null) {
        return null;
      }
      const headers = await tp.readMIMEHeader();
      if (headers === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      const req = new server_ts_1.ServerRequest();
      req.conn = conn;
      req.r = bufr;
      [req.method, req.url, req.proto] = firstLine.split(" ", 3);
      [req.protoMinor, req.protoMajor] = parseHTTPVersion(req.proto);
      req.headers = headers;
      fixLength(req);
      return req;
    }
    exports_44("readRequest", readRequest);
    function fixLength(req) {
      const contentLength = req.headers.get("Content-Length");
      if (contentLength) {
        const arrClen = contentLength.split(",");
        if (arrClen.length > 1) {
          const distinct = [...new Set(arrClen.map((e) => e.trim()))];
          if (distinct.length > 1) {
            throw Error("cannot contain multiple Content-Length headers");
          } else {
            req.headers.set("Content-Length", distinct[0]);
          }
        }
        const c = req.headers.get("Content-Length");
        if (req.method === "HEAD" && c && c !== "0") {
          throw Error("http: method cannot contain a Content-Length");
        }
        if (c && req.headers.has("transfer-encoding")) {
          // A sender MUST NOT send a Content-Length header field in any message
          // that contains a Transfer-Encoding header field.
          // rfc: https://tools.ietf.org/html/rfc7230#section-3.3.2
          throw new Error(
            "http: Transfer-Encoding and Content-Length cannot be send together",
          );
        }
      }
    }
    return {
      setters: [
        function (bufio_ts_2_1) {
          bufio_ts_2 = bufio_ts_2_1;
        },
        function (mod_ts_5_1) {
          mod_ts_5 = mod_ts_5_1;
        },
        function (asserts_ts_7_1) {
          asserts_ts_7 = asserts_ts_7_1;
        },
        function (utf8_ts_4_1) {
          utf8_ts_4 = utf8_ts_4_1;
        },
        function (server_ts_1_1) {
          server_ts_1 = server_ts_1_1;
        },
        function (http_status_ts_1_1) {
          http_status_ts_1 = http_status_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std/ws/mod",
  [
    "https://deno.land/std/encoding/utf8",
    "https://deno.land/std/_util/has_own_property",
    "https://deno.land/std/io/bufio",
    "https://deno.land/std/io/ioutil",
    "https://deno.land/std/hash/sha1",
    "https://deno.land/std/http/_io",
    "https://deno.land/std/textproto/mod",
    "https://deno.land/std/async/deferred",
    "https://deno.land/std/testing/asserts",
    "https://deno.land/std/bytes/mod",
  ],
  function (exports_45, context_45) {
    "use strict";
    var utf8_ts_5,
      has_own_property_ts_1,
      bufio_ts_3,
      ioutil_ts_1,
      sha1_ts_1,
      _io_ts_2,
      mod_ts_6,
      deferred_ts_3,
      asserts_ts_8,
      mod_ts_7,
      OpCode,
      WebSocketImpl,
      kGUID,
      kSecChars;
    var __moduleName = context_45 && context_45.id;
    function isWebSocketCloseEvent(a) {
      return has_own_property_ts_1.hasOwnProperty(a, "code");
    }
    exports_45("isWebSocketCloseEvent", isWebSocketCloseEvent);
    function isWebSocketPingEvent(a) {
      return Array.isArray(a) && a[0] === "ping" && a[1] instanceof Uint8Array;
    }
    exports_45("isWebSocketPingEvent", isWebSocketPingEvent);
    function isWebSocketPongEvent(a) {
      return Array.isArray(a) && a[0] === "pong" && a[1] instanceof Uint8Array;
    }
    exports_45("isWebSocketPongEvent", isWebSocketPongEvent);
    /** Unmask masked websocket payload */
    function unmask(payload, mask) {
      if (mask) {
        for (let i = 0, len = payload.length; i < len; i++) {
          payload[i] ^= mask[i & 3];
        }
      }
    }
    exports_45("unmask", unmask);
    /** Write websocket frame to given writer */
    async function writeFrame(frame, writer) {
      const payloadLength = frame.payload.byteLength;
      let header;
      const hasMask = frame.mask ? 0x80 : 0;
      if (frame.mask && frame.mask.byteLength !== 4) {
        throw new Error(
          "invalid mask. mask must be 4 bytes: length=" + frame.mask.byteLength,
        );
      }
      if (payloadLength < 126) {
        header = new Uint8Array([0x80 | frame.opcode, hasMask | payloadLength]);
      } else if (payloadLength < 0xffff) {
        header = new Uint8Array([
          0x80 | frame.opcode,
          hasMask | 0b01111110,
          payloadLength >>> 8,
          payloadLength & 0x00ff,
        ]);
      } else {
        header = new Uint8Array([
          0x80 | frame.opcode,
          hasMask | 0b01111111,
          ...ioutil_ts_1.sliceLongToBytes(payloadLength),
        ]);
      }
      if (frame.mask) {
        header = mod_ts_7.concat(header, frame.mask);
      }
      unmask(frame.payload, frame.mask);
      header = mod_ts_7.concat(header, frame.payload);
      const w = bufio_ts_3.BufWriter.create(writer);
      await w.write(header);
      await w.flush();
    }
    exports_45("writeFrame", writeFrame);
    /** Read websocket frame from given BufReader
     * @throws `Deno.errors.UnexpectedEof` When peer closed connection without close frame
     * @throws `Error` Frame is invalid
     */
    async function readFrame(buf) {
      let b = await buf.readByte();
      asserts_ts_8.assert(b !== null);
      let isLastFrame = false;
      switch (b >>> 4) {
        case 0b1000:
          isLastFrame = true;
          break;
        case 0b0000:
          isLastFrame = false;
          break;
        default:
          throw new Error("invalid signature");
      }
      const opcode = b & 0x0f;
      // has_mask & payload
      b = await buf.readByte();
      asserts_ts_8.assert(b !== null);
      const hasMask = b >>> 7;
      let payloadLength = b & 0b01111111;
      if (payloadLength === 126) {
        const l = await ioutil_ts_1.readShort(buf);
        asserts_ts_8.assert(l !== null);
        payloadLength = l;
      } else if (payloadLength === 127) {
        const l = await ioutil_ts_1.readLong(buf);
        asserts_ts_8.assert(l !== null);
        payloadLength = Number(l);
      }
      // mask
      let mask;
      if (hasMask) {
        mask = new Uint8Array(4);
        asserts_ts_8.assert((await buf.readFull(mask)) !== null);
      }
      // payload
      const payload = new Uint8Array(payloadLength);
      asserts_ts_8.assert((await buf.readFull(payload)) !== null);
      return {
        isLastFrame,
        opcode,
        mask,
        payload,
      };
    }
    exports_45("readFrame", readFrame);
    // Create client-to-server mask, random 32bit number
    function createMask() {
      return crypto.getRandomValues(new Uint8Array(4));
    }
    /** Return whether given headers is acceptable for websocket  */
    function acceptable(req) {
      const upgrade = req.headers.get("upgrade");
      if (!upgrade || upgrade.toLowerCase() !== "websocket") {
        return false;
      }
      const secKey = req.headers.get("sec-websocket-key");
      return (req.headers.has("sec-websocket-key") &&
        typeof secKey === "string" &&
        secKey.length > 0);
    }
    exports_45("acceptable", acceptable);
    /** Create sec-websocket-accept header value with given nonce */
    function createSecAccept(nonce) {
      const sha1 = new sha1_ts_1.Sha1();
      sha1.update(nonce + kGUID);
      const bytes = sha1.digest();
      return btoa(String.fromCharCode(...bytes));
    }
    exports_45("createSecAccept", createSecAccept);
    /** Upgrade given TCP connection into websocket connection */
    async function acceptWebSocket(req) {
      const { conn, headers, bufReader, bufWriter } = req;
      if (acceptable(req)) {
        const sock = new WebSocketImpl({ conn, bufReader, bufWriter });
        const secKey = headers.get("sec-websocket-key");
        if (typeof secKey !== "string") {
          throw new Error("sec-websocket-key is not provided");
        }
        const secAccept = createSecAccept(secKey);
        await _io_ts_2.writeResponse(bufWriter, {
          status: 101,
          headers: new Headers({
            Upgrade: "websocket",
            Connection: "Upgrade",
            "Sec-WebSocket-Accept": secAccept,
          }),
        });
        return sock;
      }
      throw new Error("request is not acceptable");
    }
    exports_45("acceptWebSocket", acceptWebSocket);
    /** Create WebSocket-Sec-Key. Base64 encoded 16 bytes string */
    function createSecKey() {
      let key = "";
      for (let i = 0; i < 16; i++) {
        const j = Math.floor(Math.random() * kSecChars.length);
        key += kSecChars[j];
      }
      return btoa(key);
    }
    exports_45("createSecKey", createSecKey);
    async function handshake(url, headers, bufReader, bufWriter) {
      const { hostname, pathname, search } = url;
      const key = createSecKey();
      if (!headers.has("host")) {
        headers.set("host", hostname);
      }
      headers.set("upgrade", "websocket");
      headers.set("connection", "upgrade");
      headers.set("sec-websocket-key", key);
      headers.set("sec-websocket-version", "13");
      let headerStr = `GET ${pathname}${search} HTTP/1.1\r\n`;
      for (const [key, value] of headers) {
        headerStr += `${key}: ${value}\r\n`;
      }
      headerStr += "\r\n";
      await bufWriter.write(utf8_ts_5.encode(headerStr));
      await bufWriter.flush();
      const tpReader = new mod_ts_6.TextProtoReader(bufReader);
      const statusLine = await tpReader.readLine();
      if (statusLine === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      const m = statusLine.match(/^(?<version>\S+) (?<statusCode>\S+) /);
      if (!m) {
        throw new Error("ws: invalid status line: " + statusLine);
      }
      // @ts-expect-error
      const { version, statusCode } = m.groups;
      if (version !== "HTTP/1.1" || statusCode !== "101") {
        throw new Error(
          `ws: server didn't accept handshake: ` +
            `version=${version}, statusCode=${statusCode}`,
        );
      }
      const responseHeaders = await tpReader.readMIMEHeader();
      if (responseHeaders === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      const expectedSecAccept = createSecAccept(key);
      const secAccept = responseHeaders.get("sec-websocket-accept");
      if (secAccept !== expectedSecAccept) {
        throw new Error(
          `ws: unexpected sec-websocket-accept header: ` +
            `expected=${expectedSecAccept}, actual=${secAccept}`,
        );
      }
    }
    exports_45("handshake", handshake);
    /**
     * Connect to given websocket endpoint url.
     * Endpoint must be acceptable for URL.
     */
    async function connectWebSocket(endpoint, headers = new Headers()) {
      const url = new URL(endpoint);
      const { hostname } = url;
      let conn;
      if (url.protocol === "http:" || url.protocol === "ws:") {
        const port = parseInt(url.port || "80");
        conn = await Deno.connect({ hostname, port });
      } else if (url.protocol === "https:" || url.protocol === "wss:") {
        const port = parseInt(url.port || "443");
        conn = await Deno.connectTls({ hostname, port });
      } else {
        throw new Error("ws: unsupported protocol: " + url.protocol);
      }
      const bufWriter = new bufio_ts_3.BufWriter(conn);
      const bufReader = new bufio_ts_3.BufReader(conn);
      try {
        await handshake(url, headers, bufReader, bufWriter);
      } catch (err) {
        conn.close();
        throw err;
      }
      return new WebSocketImpl({
        conn,
        bufWriter,
        bufReader,
        mask: createMask(),
      });
    }
    exports_45("connectWebSocket", connectWebSocket);
    function createWebSocket(params) {
      return new WebSocketImpl(params);
    }
    exports_45("createWebSocket", createWebSocket);
    return {
      setters: [
        function (utf8_ts_5_1) {
          utf8_ts_5 = utf8_ts_5_1;
        },
        function (has_own_property_ts_1_1) {
          has_own_property_ts_1 = has_own_property_ts_1_1;
        },
        function (bufio_ts_3_1) {
          bufio_ts_3 = bufio_ts_3_1;
        },
        function (ioutil_ts_1_1) {
          ioutil_ts_1 = ioutil_ts_1_1;
        },
        function (sha1_ts_1_1) {
          sha1_ts_1 = sha1_ts_1_1;
        },
        function (_io_ts_2_1) {
          _io_ts_2 = _io_ts_2_1;
        },
        function (mod_ts_6_1) {
          mod_ts_6 = mod_ts_6_1;
        },
        function (deferred_ts_3_1) {
          deferred_ts_3 = deferred_ts_3_1;
        },
        function (asserts_ts_8_1) {
          asserts_ts_8 = asserts_ts_8_1;
        },
        function (mod_ts_7_1) {
          mod_ts_7 = mod_ts_7_1;
        },
      ],
      execute: function () {
        (function (OpCode) {
          OpCode[OpCode["Continue"] = 0] = "Continue";
          OpCode[OpCode["TextFrame"] = 1] = "TextFrame";
          OpCode[OpCode["BinaryFrame"] = 2] = "BinaryFrame";
          OpCode[OpCode["Close"] = 8] = "Close";
          OpCode[OpCode["Ping"] = 9] = "Ping";
          OpCode[OpCode["Pong"] = 10] = "Pong";
        })(OpCode || (OpCode = {}));
        exports_45("OpCode", OpCode);
        WebSocketImpl = class WebSocketImpl {
          constructor({ conn, bufReader, bufWriter, mask }) {
            this.sendQueue = [];
            this._isClosed = false;
            this.conn = conn;
            this.mask = mask;
            this.bufReader = bufReader || new bufio_ts_3.BufReader(conn);
            this.bufWriter = bufWriter || new bufio_ts_3.BufWriter(conn);
          }
          async *[Symbol.asyncIterator]() {
            let frames = [];
            let payloadsLength = 0;
            while (!this._isClosed) {
              let frame;
              try {
                frame = await readFrame(this.bufReader);
              } catch (e) {
                this.ensureSocketClosed();
                break;
              }
              unmask(frame.payload, frame.mask);
              switch (frame.opcode) {
                case OpCode.TextFrame:
                case OpCode.BinaryFrame:
                case OpCode.Continue:
                  frames.push(frame);
                  payloadsLength += frame.payload.length;
                  if (frame.isLastFrame) {
                    const concat = new Uint8Array(payloadsLength);
                    let offs = 0;
                    for (const frame of frames) {
                      concat.set(frame.payload, offs);
                      offs += frame.payload.length;
                    }
                    if (frames[0].opcode === OpCode.TextFrame) {
                      // text
                      yield utf8_ts_5.decode(concat);
                    } else {
                      // binary
                      yield concat;
                    }
                    frames = [];
                    payloadsLength = 0;
                  }
                  break;
                case OpCode.Close:
                  // [0x12, 0x34] -> 0x1234
                  const code = (frame.payload[0] << 8) | frame.payload[1];
                  const reason = utf8_ts_5.decode(
                    frame.payload.subarray(2, frame.payload.length),
                  );
                  await this.close(code, reason);
                  yield { code, reason };
                  return;
                case OpCode.Ping:
                  await this.enqueue({
                    opcode: OpCode.Pong,
                    payload: frame.payload,
                    isLastFrame: true,
                  });
                  yield ["ping", frame.payload];
                  break;
                case OpCode.Pong:
                  yield ["pong", frame.payload];
                  break;
                default:
              }
            }
          }
          dequeue() {
            const [entry] = this.sendQueue;
            if (!entry) {
              return;
            }
            if (this._isClosed) {
              return;
            }
            const { d, frame } = entry;
            writeFrame(frame, this.bufWriter)
              .then(() => d.resolve())
              .catch((e) => d.reject(e))
              .finally(() => {
                this.sendQueue.shift();
                this.dequeue();
              });
          }
          enqueue(frame) {
            if (this._isClosed) {
              throw new Deno.errors.ConnectionReset(
                "Socket has already been closed",
              );
            }
            const d = deferred_ts_3.deferred();
            this.sendQueue.push({ d, frame });
            if (this.sendQueue.length === 1) {
              this.dequeue();
            }
            return d;
          }
          send(data) {
            const opcode = typeof data === "string" ? OpCode.TextFrame
            : OpCode.BinaryFrame;
            const payload = typeof data === "string"
              ? utf8_ts_5.encode(data)
              : data;
            const isLastFrame = true;
            const frame = {
              isLastFrame,
              opcode,
              payload,
              mask: this.mask,
            };
            return this.enqueue(frame);
          }
          ping(data = "") {
            const payload = typeof data === "string"
              ? utf8_ts_5.encode(data)
              : data;
            const frame = {
              isLastFrame: true,
              opcode: OpCode.Ping,
              mask: this.mask,
              payload,
            };
            return this.enqueue(frame);
          }
          get isClosed() {
            return this._isClosed;
          }
          async close(code = 1000, reason) {
            try {
              const header = [code >>> 8, code & 0x00ff];
              let payload;
              if (reason) {
                const reasonBytes = utf8_ts_5.encode(reason);
                payload = new Uint8Array(2 + reasonBytes.byteLength);
                payload.set(header);
                payload.set(reasonBytes, 2);
              } else {
                payload = new Uint8Array(header);
              }
              await this.enqueue({
                isLastFrame: true,
                opcode: OpCode.Close,
                mask: this.mask,
                payload,
              });
            } catch (e) {
              throw e;
            } finally {
              this.ensureSocketClosed();
            }
          }
          closeForce() {
            this.ensureSocketClosed();
          }
          ensureSocketClosed() {
            if (this.isClosed) {
              return;
            }
            try {
              this.conn.close();
            } catch (e) {
              console.error(e);
            } finally {
              this._isClosed = true;
              const rest = this.sendQueue;
              this.sendQueue = [];
              rest.forEach((e) =>
                e.d.reject(
                  new Deno.errors.ConnectionReset(
                    "Socket has already been closed",
                  ),
                )
              );
            }
          }
        };
        kGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
        kSecChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.~_";
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/VoiceConnection",
  ["https://deno.land/std/ws/mod"],
  function (exports_46, context_46) {
    "use strict";
    var mod_ts_8, VoiceConnection;
    var __moduleName = context_46 && context_46.id;
    return {
      setters: [
        function (mod_ts_8_1) {
          mod_ts_8 = mod_ts_8_1;
        },
      ],
      execute: function () {
        VoiceConnection = class VoiceConnection {
          async connect(state, data) {
            this.state = state;
            this.data = data;
            this.ws = await mod_ts_8.connectWebSocket(
              `wss://${data.endpoint.replace(":80", "")}?v=4`,
            );
            return new Promise(async (resolve, reject) => {
              this.resolve = resolve;
              this.reject = reject;
              for await (const m of this.ws) {
                if (typeof m === "string") {
                  await this.handle(JSON.parse(m));
                } else if (mod_ts_8.isWebSocketCloseEvent(m)) {
                  //console.log(m.code, m.reason);
                }
              }
            });
          }
          heartbeat(interval) {
            this.ws.send(JSON.stringify({ op: 8, d: Date.now() }));
          }
          identify() {
            this.ws.send(JSON.stringify({
              op: 0,
              d: {
                server_id: this.state.guild_id,
                user_id: this.state.user_id,
                session_id: this.state.session_id,
                token: this.data.token,
              },
            }));
          }
          async handle(payload) {
            switch (payload.op) {
              case 8: {
                this.identify();
                setInterval(
                  this.heartbeat.bind(this, payload.d.heartbeat_interval),
                  payload.d.heartbeat_interval,
                );
                break;
              }
                // case 2: {
                // 	// @ts-ignore
                // 	this.udpSock = Deno.listen({
                // 		hostname: "golang.org",
                // 		port: 80,
                // 		// @ts-ignore
                // 		transport: "udp"
                // 	});
                // 	for await (const m of this.udpSock) console.log(m);
                // 	console.log(this.udpSock);
                // }
            }
          }
        };
        exports_46("default", VoiceConnection);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Guild",
  [
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Collection",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Emoji",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/GuildChannel",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/GuildMember",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Role",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/TextChannel",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/VoiceChannel",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/VoiceConnection",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/VoiceState",
  ],
  function (exports_47, context_47) {
    "use strict";
    var Collection_ts_3,
      Emoji_ts_2,
      GuildChannel_ts_3,
      GuildMember_ts_1,
      Role_ts_1,
      TextChannel_ts_3,
      VoiceChannel_ts_1,
      VoiceConnection_ts_1,
      VoiceState_ts_1,
      Guild;
    var __moduleName = context_47 && context_47.id;
    return {
      setters: [
        function (Collection_ts_3_1) {
          Collection_ts_3 = Collection_ts_3_1;
        },
        function (Emoji_ts_2_1) {
          Emoji_ts_2 = Emoji_ts_2_1;
        },
        function (GuildChannel_ts_3_1) {
          GuildChannel_ts_3 = GuildChannel_ts_3_1;
        },
        function (GuildMember_ts_1_1) {
          GuildMember_ts_1 = GuildMember_ts_1_1;
        },
        function (Role_ts_1_1) {
          Role_ts_1 = Role_ts_1_1;
        },
        function (TextChannel_ts_3_1) {
          TextChannel_ts_3 = TextChannel_ts_3_1;
        },
        function (VoiceChannel_ts_1_1) {
          VoiceChannel_ts_1 = VoiceChannel_ts_1_1;
        },
        function (VoiceConnection_ts_1_1) {
          VoiceConnection_ts_1 = VoiceConnection_ts_1_1;
        },
        function (VoiceState_ts_1_1) {
          VoiceState_ts_1 = VoiceState_ts_1_1;
        },
      ],
      execute: function () {
        Guild = class Guild {
          constructor(client, guild) {
            this.roles = new Collection_ts_3.default();
            this.voice_states = new Collection_ts_3.default();
            this.members = new Collection_ts_3.default();
            this.channels = new Collection_ts_3.default();
            this.messageCache = new Collection_ts_3.default();
            this.client = client;
            /**
                     * TODO
                     *	- emojis
                     *	- features
                     *	- voice_states
                     *	- presences
                     */
            const keys = Object.keys(guild);
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              switch (key) {
                case "channels":
                  guild.channels.forEach((channel) => {
                    channel.guild_id = guild.id;
                    switch (channel.type) {
                      case 0:
                        this.channels.set(
                          channel.id,
                          new TextChannel_ts_3.default(this, channel),
                        );
                        break;
                      case 1:
                        this.channels.set(
                          channel.id,
                          new TextChannel_ts_3.default(this, channel),
                        );
                        break;
                      case 2:
                        this.channels.set(
                          channel.id,
                          new VoiceChannel_ts_1.default(this, channel),
                        );
                        break;
                      /*case 4:
                                            this.channels.set(channel.id, new CategoryChannel(channel));
                                            break;
                                        case 5:
                                            this.channels.set(channel.id, new NewsChannel(channel));
                                            break;
                                        case 6:
                                            this.channels.set(channel.id, new StoreChannel(channel));
                                            break; */
                      default:
                        this.channels.set(
                          channel.id,
                          new GuildChannel_ts_3.default(this, channel),
                        );
                        break;
                    }
                  });
                  break;
                case "roles":
                  guild.roles.forEach((x) =>
                    this.roles.set(x.id, new Role_ts_1.default(x))
                  );
                  break;
                case "members":
                  guild.members.forEach((x) =>
                    this.members.set(
                      x.user.id,
                      new GuildMember_ts_1.default(client, this, x),
                    )
                  );
                  break;
                case "emojis":
                  this.emojis = guild.emojis.map((e) =>
                    new Emoji_ts_2.default(guild, e)
                  );
                  break;
                case "voice_states":
                  guild.voice_states.forEach((x) =>
                    this.voice_states.set(
                      x.user_id,
                      new VoiceState_ts_1.default(client, x),
                    )
                  );
                  break;
                default:
                  Reflect.set(this, key, guild[key]);
                  break;
              }
            }
          }
          async joinChannel(channel, deaf = false) {
            return new Promise((resolve, reject) => {
              if (!channel) {
                return reject("Unknown channel: " + channel);
              }
              this.client.ws?.send(JSON.stringify({
                op: 4,
                d: {
                  guild_id: this.id,
                  channel_id: channel.id,
                  self_mute: false,
                  self_deaf: deaf,
                },
              }));
              const con = new VoiceConnection_ts_1.default();
              this.client.on("raw", async (data) => {
                if (
                  data.t === "VOICE_SERVER_UPDATE" &&
                  data.d.guild_id === this.id
                ) {
                  await con.connect(
                    this.voice_states.get(this.client.user.id),
                    data.d,
                  );
                  resolve(con);
                }
              });
            });
          }
        };
        exports_47("default", Guild);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Metrics",
  ["file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Collection"],
  function (exports_48, context_48) {
    "use strict";
    var Collection_ts_4, Metrics;
    var __moduleName = context_48 && context_48.id;
    return {
      setters: [
        function (Collection_ts_4_1) {
          Collection_ts_4 = Collection_ts_4_1;
        },
      ],
      execute: function () {
        Metrics = class Metrics {
          constructor() {
            this.receivedEvents = new Collection_ts_4.default();
            this.requests = new Collection_ts_4.default();
            this.failedRequests = new Collection_ts_4.default();
            this.responseTimes = [];
          }
          putReceivedEvent(type) {
            const count = this.receivedEvents.has(type)
              ? this.receivedEvents.get(type) + 1
              : 1;
            this.receivedEvents.set(type, count);
          }
          totalReceivedEvents(from) {
            return from
              ? this.receivedEvents.get(from) || 0
              : [...this.receivedEvents.values()].reduce((x, y) => x + y);
          }
          putRequest(path) {
            const count = this.requests.has(path)
              ? this.requests.get(path) + 1
              : 1;
            this.requests.set(path, count);
          }
          totalRequests(from) {
            return from
              ? this.requests.get(from) || 0
              : [...this.requests.values()].reduce((x, y) => x + y);
          }
          putFailedRequest(path) {
            const count = this.failedRequests.has(path)
              ? this.failedRequests.get(path) + 1
              : 1;
            this.failedRequests.set(path, count);
          }
          totalFailedRequests(from) {
            return from
              ? this.failedRequests.get(from) || 0
              : [...this.failedRequests.values()].reduce((x, y) => x + y);
          }
          addResponseTime(time) {
            this.responseTimes.push(time);
          }
          avgResponseTime() {
            return (this.responseTimes.reduce((x, y) => x + y) /
              this.responseTimes.length);
          }
        };
        exports_48("default", Metrics);
      },
    };
  },
);
System.register(
  "https://deno.land/x/short_uuid/version",
  [],
  function (exports_49, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    return {
      setters: [],
      execute: function () {
        exports_49("default", "3.0.2");
      },
    };
  },
);
System.register(
  "https://deno.land/x/short_uuid/mod",
  ["https://deno.land/x/short_uuid/version"],
  function (exports_50, context_50) {
    "use strict";
    var version_ts_1,
      DEFAULT_UUID_LENGTH,
      DIGIT_FIRST_ASCII,
      DIGIT_LAST_ASCII,
      ALPHA_LOWER_FIRST_ASCII,
      ALPHA_LOWER_LAST_ASCII,
      ALPHA_UPPER_FIRST_ASCII,
      ALPHA_UPPER_LAST_ASCII,
      DICT_RANGES,
      DEFAULT_OPTIONS,
      ShortUniqueId;
    var __moduleName = context_50 && context_50.id;
    return {
      setters: [
        function (version_ts_1_1) {
          version_ts_1 = version_ts_1_1;
        },
      ],
      execute: function () {
        /**
             * 6 was chosen as the default UUID length since for most cases
             * it will be more than aptly suitable to provide millions of UUIDs
             * with a very low probability of producing a duplicate UUID.
             *
             * For example, with a dictionary including digits from 0 to 9,
             * as well as the alphabet from a to z both in UPPER and lower case,
             * the probability of generating a duplicate in 1,000,000 rounds
             * is ~0.00000002, or about 1 in 50,000,000.
             */
        DEFAULT_UUID_LENGTH = 6;
        DIGIT_FIRST_ASCII = 48;
        DIGIT_LAST_ASCII = 58;
        ALPHA_LOWER_FIRST_ASCII = 97;
        ALPHA_LOWER_LAST_ASCII = 123;
        ALPHA_UPPER_FIRST_ASCII = 65;
        ALPHA_UPPER_LAST_ASCII = 91;
        DICT_RANGES = {
          digits: [DIGIT_FIRST_ASCII, DIGIT_LAST_ASCII],
          lowerCase: [ALPHA_LOWER_FIRST_ASCII, ALPHA_LOWER_LAST_ASCII],
          upperCase: [ALPHA_UPPER_FIRST_ASCII, ALPHA_UPPER_LAST_ASCII],
        };
        DEFAULT_OPTIONS = {
          dictionary: [],
          shuffle: true,
          debug: false,
          length: DEFAULT_UUID_LENGTH,
        };
        /**
             * Generate random or sequential UUID of any length.
             *
             * ### Use as module
             *
             * ```js
             * // Deno (web module) Import
             * import ShortUniqueId from 'https://cdn.jsdelivr.net/npm/short-unique-id@latest/short_uuid/mod.ts';
             *
             * // ES6 / TypeScript Import
             * import ShortUniqueId from 'short-unique-id';
             *
             * //or Node.js require
             * const {default: ShortUniqueId} = require('short-unique-id');
             *
             * //Instantiate
             * const uid = new ShortUniqueId();
             *
             * // Random UUID
             * console.log(uid());
             *
             * // Sequential UUID
             * console.log(uid.seq());
             * ```
             *
             * ### Use in browser
             *
             * ```html
             * <!-- Import -->
             * <script src="https://cdn.jsdelivr.net/npm/short-unique-id@latest/dist/short-unique-id.min.js"></script>
             *
             * <!-- Usage -->
             * <script>
             *   // Instantiate
             *   var uid = new ShortUniqueId();
             *
             *   // Random UUID
             *   document.write(uid());
             *
             *   // Sequential UUID
             *   document.write(uid.seq());
             * </script>
             * ```
             *
             * ### Options
             *
             * Options can be passed when instantiating `uid`:
             *
             * ```js
             * const options = { ... };
             *
             * const uid = new ShortUniqueId(options);
             * ```
             *
             * For more information take a look at the [Options type definition](/globals.html#options).
             */
        ShortUniqueId = class ShortUniqueId extends Function {
          /* tslint:enable consistent-return */
          constructor(argOptions = {}) {
            super("...args", "return this.randomUUID(...args)");
            this.dictIndex = 0;
            this.dictRange = [];
            this.lowerBound = 0;
            this.upperBound = 0;
            this.dictLength = 0;
            const options = {
              ...DEFAULT_OPTIONS,
              ...argOptions,
            };
            this.counter = 0;
            this.debug = false;
            this.dict = [];
            this.version = version_ts_1.default;
            const { dictionary: userDict, shuffle, length } = options;
            this.uuidLength = length;
            if (userDict && userDict.length > 1) {
              this.setDictionary(userDict);
            } else {
              let i;
              this.dictIndex = i = 0;
              Object.keys(DICT_RANGES).forEach((rangeType) => {
                const rangeTypeKey = rangeType;
                this.dictRange = DICT_RANGES[rangeTypeKey];
                this.lowerBound = this.dictRange[0];
                this.upperBound = this.dictRange[1];
                for (
                  this.dictIndex = i = this.lowerBound;
                  this.lowerBound <= this.upperBound
                    ? i < this.upperBound
                    : i > this.upperBound;
                  this.dictIndex = this.lowerBound <= this.upperBound
                    ? i += 1
                    : i -= 1
                ) {
                  this.dict.push(String.fromCharCode(this.dictIndex));
                }
              });
            }
            if (shuffle) {
              // Shuffle Dictionary for removing selection bias.
              const PROBABILITY = 0.5;
              this.setDictionary(
                this.dict.sort(() => Math.random() - PROBABILITY),
              );
            } else {
              this.setDictionary(this.dict);
            }
            this.debug = options.debug;
            this.log(this.dict);
            this.log(
              (`Generator instantiated with Dictionary Size ${this.dictLength}`),
            );
            const instance = this.bind(this);
            Object.getOwnPropertyNames(this).forEach((prop) => {
              if (
                !(/arguments|caller|callee|length|name|prototype/).test(prop)
              ) {
                const propKey = prop;
                instance[prop] = this[propKey];
              }
            });
            return instance;
          }
          /* tslint:disable consistent-return */
          log(...args) {
            const finalArgs = [...args];
            finalArgs[0] = `[short-unique-id] ${args[0]}`;
            /* tslint:disable no-console */
            if (this.debug === true) {
              if (typeof console !== "undefined" && console !== null) {
                return console.log(...finalArgs);
              }
            }
            /* tslint:enable no-console */
          }
          /** Change the dictionary after initialization. */
          setDictionary(dictionary) {
            this.dict = dictionary;
            // Cache Dictionary Length for future usage.
            this.dictLength = this.dict.length; // Resets internal counter.
            this.counter = 0;
          }
          seq() {
            return this.sequentialUUID();
          }
          /**
                 * Generates UUID based on internal counter that's incremented after each ID generation.
                 * @alias `const uid = new ShortUniqueId(); uid.seq();`
                 */
          sequentialUUID() {
            let counterDiv;
            let counterRem;
            let id = "";
            counterDiv = this.counter;
            /* tslint:disable no-constant-condition */
            while (true) {
              counterRem = counterDiv % this.dictLength;
              counterDiv = Math.trunc(counterDiv / this.dictLength);
              id += this.dict[counterRem];
              if (counterDiv === 0) {
                break;
              }
            }
            /* tslint:enable no-constant-condition */
            this.counter += 1;
            return id;
          }
          /**
                 * Generates UUID by creating each part randomly.
                 * @alias `const uid = new ShortUniqueId(); uid(uuidLength: number);`
                 */
          randomUUID(uuidLength = this.uuidLength || DEFAULT_UUID_LENGTH) {
            let id;
            let randomPartIdx;
            let j;
            let idIndex;
            if (
              (uuidLength === null || typeof uuidLength === "undefined") ||
              uuidLength < 1
            ) {
              throw new Error("Invalid UUID Length Provided");
            }
            // Generate random ID parts from Dictionary.
            id = "";
            for (
              idIndex = j = 0;
              0 <= uuidLength
                ? j < uuidLength
                : j > uuidLength;
              idIndex = 0 <= uuidLength ? j += 1 : j -= 1
            ) {
              randomPartIdx =
                parseInt((Math.random() * this.dictLength).toFixed(0), 10) %
                this.dictLength;
              id += this.dict[randomPartIdx];
            }
            // Return random generated ID.
            return id;
          }
          /**
                 * Calculates total number of possible UUIDs.
                 *
                 * Given that:
                 *
                 * - `H` is the total number of possible UUIDs
                 * - `n` is the number of unique characters in the dictionary
                 * - `l` is the UUID length
                 *
                 * Then `H` is defined as `n` to the power of `l`:
                 *
                 * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%20H=n%5El)
                 *
                 * This function returns `H`.
                 */
          availableUUIDs(uuidLength = this.uuidLength) {
            return parseFloat(
              Math.pow([...new Set(this.dict)].length, uuidLength).toFixed(0),
            );
          }
          /**
                 * Calculates approximate number of hashes before first collision.
                 *
                 * Given that:
                 *
                 * - `H` is the total number of possible UUIDs, or in terms of this library,
                 * the result of running `availableUUIDs()`
                 * - the expected number of values we have to choose before finding the
                 * first collision can be expressed as the quantity `Q(H)`
                 *
                 * Then `Q(H)` can be approximated as the square root of the of the product
                 * of half of pi times `H`:
                 *
                 * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%20Q(H)%5Capprox%5Csqrt%7B%5Cfrac%7B%5Cpi%7D%7B2%7DH%7D)
                 *
                 * This function returns `Q(H)`.
                 */
          approxMaxBeforeCollision(
            rounds = this.availableUUIDs(this.uuidLength),
          ) {
            return parseFloat(Math.sqrt((Math.PI / 2) * rounds).toFixed(20));
          }
          /**
                 * Calculates probability of generating duplicate UUIDs (a collision) in a
                 * given number of UUID generation rounds.
                 *
                 * Given that:
                 *
                 * - `r` is the maximum number of times that `randomUUID()` will be called,
                 * or better said the number of _rounds_
                 * - `H` is the total number of possible UUIDs, or in terms of this library,
                 * the result of running `availableUUIDs()`
                 *
                 * Then the probability of collision `p(r; H)` can be approximated as the result
                 * of dividing the square root of the of the product of half of pi times `H` by `H`:
                 *
                 * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%20p(r%3B%20H)%5Capprox%5Cfrac%7B%5Csqrt%7B%5Cfrac%7B%5Cpi%7D%7B2%7Dr%7D%7D%7BH%7D)
                 *
                 * This function returns `p(r; H)`.
                 *
                 * (Useful if you are wondering _"If I use this lib and expect to perform at most
                 * `r` rounds of UUID generations, what is the probability that I will hit a duplicate UUID?"_.)
                 */
          collisionProbability(
            rounds = this.availableUUIDs(this.uuidLength),
            uuidLength = this.uuidLength,
          ) {
            return parseFloat(
              (this.approxMaxBeforeCollision(rounds) /
                this.availableUUIDs(uuidLength)).toFixed(20),
            );
          }
          /**
                 * Calculate a "uniqueness" score (from 0 to 1) of UUIDs based on size of
                 * dictionary and chosen UUID length.
                 *
                 * Given that:
                 *
                 * - `H` is the total number of possible UUIDs, or in terms of this library,
                 * the result of running `availableUUIDs()`
                 * - `Q(H)` is the approximate number of hashes before first collision,
                 * or in terms of this library, the result of running `approxMaxBeforeCollision()`
                 *
                 * Then `uniqueness` can be expressed as the additive inverse of the probability of
                 * generating a "word" I had previously generated (a duplicate) at any given iteration
                 * up to the the total number of possible UUIDs expressed as the quotiend of `Q(H)` and `H`:
                 *
                 * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%201-%5Cfrac%7BQ(H)%7D%7BH%7D)
                 *
                 * (Useful if you need a value to rate the "quality" of the combination of given dictionary
                 * and UUID length. The closer to 1, higher the uniqueness and thus better the quality.)
                 */
          uniqueness(rounds = this.availableUUIDs(this.uuidLength)) {
            const score = parseFloat(
              (1 - (this.approxMaxBeforeCollision(rounds) / rounds)).toFixed(
                20,
              ),
            );
            return (score > 1) ? (1) : ((score < 0) ? 0 : score);
          }
          /**
                 * Return the version of this module.
                 */
          getVersion() {
            return this.version;
          }
        };
        exports_50("default", ShortUniqueId);
      },
    };
  },
);
System.register(
  "https://deno.land/x/url_join/mod",
  [],
  function (exports_51, context_51) {
    "use strict";
    var urlJoin, normalize;
    var __moduleName = context_51 && context_51.id;
    return {
      setters: [],
      execute: function () {
        exports_51(
          "urlJoin",
          urlJoin = function (...args) {
            let input;
            if (typeof args[0] === "object") {
              input = args[0];
            } else {
              input = [].slice.call(args);
            }
            return normalize(input);
          },
        );
        normalize = (strArray) => {
          const resultArray = [];
          if (strArray.length === 0) {
            return "";
          }
          if (typeof strArray[0] !== "string") {
            throw new TypeError(
              "Url must be a string. Received " + strArray[0],
            );
          }
          // If the first part is a plain protocol, we combine it with the next part.
          if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
            const first = strArray.shift();
            strArray[0] = first + strArray[0];
          }
          // There must be two or three slashes in the file protocol, two slashes in anything else.
          if (strArray[0].match(/^file:\/\/\//)) {
            strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
          } else {
            strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
          }
          for (let i = 0; i < strArray.length; i++) {
            let component = strArray[i];
            if (typeof component !== "string") {
              throw new TypeError(
                "Url must be a string. Received " + component,
              );
            }
            if (component === "") {
              continue;
            }
            if (i > 0) {
              // Removing the starting slashes for each component but the first.
              component = component.replace(/^[\/]+/, "");
            }
            if (i < strArray.length - 1) {
              // Removing the ending slashes for each component but the last.
              component = component.replace(/[\/]+$/, "");
            } else {
              // For the last component we will combine multiple slashes to a single one.
              component = component.replace(/[\/]+$/, "/");
            }
            resultArray.push(component);
          }
          let str = resultArray.join("/");
          // Each input component is now separated by a single slash except the possible first plain protocol part.
          // remove trailing slash before parameters or hash
          str = str.replace(/\/(\?|&|#[^!])/g, "$1");
          // replace ? in parameters with &
          let parts = str.split("?");
          str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
          return str;
        };
      },
    };
  },
);
System.register(
  "https://deno.land/x/axiod/interfaces",
  [],
  function (exports_52, context_52) {
    "use strict";
    var __moduleName = context_52 && context_52.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/axiod/helpers",
  [],
  function (exports_53, context_53) {
    "use strict";
    var methods;
    var __moduleName = context_53 && context_53.id;
    return {
      setters: [],
      execute: function () {
        exports_53(
          "methods",
          methods = [
            "get",
            "post",
            "put",
            "delete",
            "options",
            "head",
            "connect",
            "trace",
            "patch",
          ],
        );
      },
    };
  },
);
System.register(
  "https://deno.land/x/axiod/mod",
  ["https://deno.land/x/url_join/mod", "https://deno.land/x/axiod/helpers"],
  function (exports_54, context_54) {
    "use strict";
    var mod_ts_9, helpers_ts_1;
    var __moduleName = context_54 && context_54.id;
    function axiod(url, config) {
      if (typeof url === "string") {
        return axiod.request(
          Object.assign({}, axiod.defaults, { url }, config),
        );
      }
      return axiod.request(Object.assign({}, axiod.defaults, url));
    }
    return {
      setters: [
        function (mod_ts_9_1) {
          mod_ts_9 = mod_ts_9_1;
        },
        function (helpers_ts_1_1) {
          helpers_ts_1 = helpers_ts_1_1;
        },
      ],
      execute: function () {
        axiod.defaults = {
          url: "/",
          method: "get",
          timeout: 0,
          withCredentials: false,
          validateStatus: (status) => {
            return status >= 200 && status < 300;
          },
        };
        axiod.create = (config) => {
          const instance = Object.assign({}, axiod);
          instance.defaults = Object.assign({}, axiod.defaults, config);
          instance.defaults.timeout = 1000;
          return instance;
        };
        axiod.request = (
          {
            url = "/",
            baseURL,
            method,
            headers,
            params,
            data,
            timeout,
            withCredentials,
            auth,
            validateStatus,
            paramsSerializer,
            transformRequest,
            transformResponse,
          },
        ) => {
          // Url and Base url
          if (baseURL) {
            url = mod_ts_9.urlJoin(baseURL, url);
          }
          // Method
          if (method) {
            if (
              helpers_ts_1.methods.indexOf(method.toLowerCase().trim()) === -1
            ) {
              throw new Error(`Method ${method} is not supported`);
            } else {
              method = method.toLowerCase().trim();
            }
          } else {
            method = "get";
          }
          // Params
          let _params = "";
          if (params) {
            if (paramsSerializer) {
              _params = paramsSerializer(params);
            } else {
              _params = Object.keys(params)
                .map((key) => {
                  return (encodeURIComponent(key) + "=" +
                    encodeURIComponent(params[key]));
                })
                .join("&");
            }
          }
          // Add credentials to header
          if (withCredentials) {
            if (auth?.username && auth?.password) {
              if (!headers) {
                headers = {};
              }
              headers["Authorization"] = "Basic " +
                btoa(
                  unescape(
                    encodeURIComponent(`${auth.username}:${auth.password}`),
                  ),
                );
            }
          }
          // Create fetch Request Config
          const fetchRequestObject = {};
          // Add method to Request Config
          if (method !== "get") {
            fetchRequestObject.method = method.toUpperCase();
          }
          // Add params to Request Config Url
          if (_params) {
            url = mod_ts_9.urlJoin(url, `?${params}`);
          }
          // Add body to Request Config
          if (data && method !== "get") {
            // transformRequest
            if (
              transformRequest &&
              Array.isArray(transformRequest) &&
              transformRequest.length > 0
            ) {
              for (var i = 0; i < (transformRequest || []).length; i++) {
                if (transformRequest && transformRequest[i]) {
                  data = transformRequest[i](data, headers);
                }
              }
            }
            if (typeof data === "string" || data instanceof FormData) {
              fetchRequestObject.body = data;
            } else {
              try {
                fetchRequestObject.body = JSON.stringify(data);
                if (!headers) {
                  headers = {};
                }
                headers["Accept"] = "application/json";
                headers["Content-Type"] = "application/json";
              } catch (ex) {}
            }
          }
          // Add headers to Request Config
          if (headers) {
            const _headers = new Headers();
            Object.keys(headers).forEach((header) => {
              if (headers && headers[header]) {
                _headers.set(header, headers[header]);
              }
            });
            fetchRequestObject.headers = _headers;
          }
          // [TODO] Mouadh HSOUMI
          // Remove commented test when Abort is supported by Deno
          // https://github.com/denoland/deno/issues/5471
          // https://github.com/Code-Hex/deno-context/issues/8
          // Timeout
          // const controller = new AbortController();
          // fetchRequestObject.signal = controller.signal;
          // let timeoutVar: number = 0;
          // console.log("timeout", timeout);
          // if ((timeout || 0) > 0) {
          //   timeoutVar = setTimeout(() => {
          //     timeoutVar = 0;
          //     console.log("Cancecled controller.abort()");
          //     controller.abort();
          //   }, timeout);
          // }
          // Start request
          return fetch(url, fetchRequestObject).then(async (x) => {
            // // Clear timeout
            // if (timeoutVar) {
            //   clearTimeout(timeoutVar);
            // }
            const _status = x.status;
            const _statusText = x.statusText;
            // Data
            let _data = null;
            // Check content type and then do the needed transformations
            const contentType = x.headers.get("content-type") || "";
            if (contentType.toLowerCase().indexOf("json") === -1) {
              // Try to convert to json
              try {
                _data = await x.json();
              } catch (ex) {
                _data = await x.text();
              }
            } else {
              _data = await x.json();
            }
            // transformResponse
            if (transformResponse) {
              if (
                transformResponse &&
                Array.isArray(transformResponse) &&
                transformResponse.length > 0
              ) {
                for (var i = 0; i < (transformResponse || []).length; i++) {
                  if (transformResponse && transformResponse[i]) {
                    _data = transformResponse[i](_data);
                  }
                }
              }
            }
            const _headers = x.headers;
            const _config = {
              url,
              baseURL,
              method,
              headers,
              params,
              data,
              timeout,
              withCredentials,
              auth,
              paramsSerializer,
            };
            // Validate the status code
            let isValidStatus = true;
            if (validateStatus) {
              isValidStatus = validateStatus(_status);
            } else {
              isValidStatus = _status >= 200 && _status < 300;
            }
            if (isValidStatus) {
              return Promise.resolve({
                status: _status,
                statusText: _statusText,
                data: _data,
                headers: _headers,
                config: _config,
              });
            } else {
              const error = {
                response: {
                  status: _status,
                  statusText: _statusText,
                  data: _data,
                  headers: _headers,
                },
                config: _config,
              };
              return Promise.reject(error);
            }
          });
        };
        axiod.get = (url, config) => {
          return axiod.request(
            Object.assign({}, { url }, config, { method: "get" }),
          );
        };
        axiod.post = (url, data, config) => {
          return axiod.request(
            Object.assign({}, { url }, config, { method: "post", data }),
          );
        };
        axiod.put = (url, data, config) => {
          return axiod.request(
            Object.assign({}, { url }, config, { method: "put", data }),
          );
        };
        axiod.delete = (url, data, config) => {
          return axiod.request(
            Object.assign({}, { url }, config, { method: "delete", data }),
          );
        };
        axiod.options = (url, data, config) => {
          return axiod.request(
            Object.assign({}, { url }, config, { method: "options", data }),
          );
        };
        axiod.head = (url, data, config) => {
          return axiod.request(
            Object.assign({}, { url }, config, { method: "head", data }),
          );
        };
        axiod.connect = (url, data, config) => {
          return axiod.request(
            Object.assign({}, { url }, config, { method: "connect", data }),
          );
        };
        axiod.trace = (url, data, config) => {
          return axiod.request(
            Object.assign({}, { url }, config, { method: "trace", data }),
          );
        };
        axiod.patch = (url, data, config) => {
          return axiod.request(
            Object.assign({}, { url }, config, { method: "patch", data }),
          );
        };
        exports_54("default", axiod);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/RequestHandler",
  [
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Collection",
    "https://deno.land/std/fmt/colors",
    "https://deno.land/x/short_uuid/mod",
    "https://deno.land/x/axiod/mod",
  ],
  function (exports_55, context_55) {
    "use strict";
    var Collection_ts_5, colors_ts_3, mod_ts_10, mod_ts_11, uid, RequestHandler;
    var __moduleName = context_55 && context_55.id;
    return {
      setters: [
        function (Collection_ts_5_1) {
          Collection_ts_5 = Collection_ts_5_1;
        },
        function (colors_ts_3_1) {
          colors_ts_3 = colors_ts_3_1;
        },
        function (mod_ts_10_1) {
          mod_ts_10 = mod_ts_10_1;
        },
        function (mod_ts_11_1) {
          mod_ts_11 = mod_ts_11_1;
        },
      ],
      execute: function () {
        uid = new mod_ts_10.default();
        //TODO Handle Global Ratelimit
        RequestHandler = class RequestHandler {
          constructor(client) {
            this.currentGlobalRateLimit = 0;
            this.routeLimitReset = new Collection_ts_5.default();
            this.pendingRequests = new Collection_ts_5.default();
            this.client = client;
          }
          request(method, path, body = null, requestId = "") {
            return new Promise(async (resolve, reject) => {
              let pendingRequests = this.pendingRequests.get(path) || [];
              if (requestId === "") {
                requestId = uid();
                pendingRequests.push({
                  id: requestId,
                  resolve,
                  reject,
                  method,
                  path,
                  body,
                });
                this.pendingRequests.set(path, pendingRequests);
              }
              let data = {
                body,
                method,
                headers: new Headers({
                  Authorization: `Bot ${this.client.options.token}`,
                  "Content-Type": "application/json",
                }),
              };
              if (data.body === null) {
                delete data.body;
              }
              if (this.client.options.debugRequests) {
                // @ts-ignore
                this.client.debugLog(
                  `${colors_ts_3.magenta(method)} ${
                    colors_ts_3.cyan(path.startsWith("/") ? path : `/${path}`)
                  }`,
                );
              }
              const start = performance.now(),
                res = await mod_ts_11.default(path, {
                  baseURL: "https://discord.com/api/v6/",
                  method,
                  data: body,
                  headers: {
                    Authorization: `Bot ${this.client.options.token}`,
                    "Content-Type": "application/json",
                  },
                }).catch((e) => e.response);
              this.client.metrics.addResponseTime(performance.now() - start);
              //* Too many requests
              if (res.status === 429) {
                if (!this.routeLimitReset.has(path)) {
                  this.client.metrics.putFailedRequest(
                    path.startsWith("/") ? path : `/${path}`,
                  );
                  // @ts-ignore
                  this.client.debugLog(
                    colors_ts_3.red(
                      `${method} ${path} hit ratelimit, retry in ${
                        res.headers.get("X-RateLimit-Reset-After")
                      } seconds.`,
                    ),
                  );
                  this.routeLimitReset.set(path, {
                    timeout: setTimeout(
                      () => this.rateLimitExpired(path),
                      parseInt(res.headers.get("X-RateLimit-Reset-After")) *
                        1000,
                    ),
                    limit: res.headers.get("X-RateLimit-Limit"),
                  });
                }
                return;
              }
              pendingRequests = this.pendingRequests.get(path) || [];
              const response = res.status !== 204 ? res.data : null,
                request = pendingRequests.find((pR) => pR.id === requestId);
              if (res.status < 200 || res.status > 299) {
                this.client.metrics.putFailedRequest(
                  path.startsWith("/") ? path : `/${path}`,
                );
                request?.reject(response);
                reject(response);
              } else {
                this.client.metrics.putRequest(
                  path.startsWith("/") ? path : `/${path}`,
                );
                resolve(response);
                request?.resolve(response);
              }
              pendingRequests = pendingRequests.filter((pR) =>
                pR.id !== requestId
              );
              this.pendingRequests.set(path, pendingRequests);
            });
          }
          rateLimitExpired(path) {
            let pendingRequests = this.pendingRequests.get(path);
            this.routeLimitReset.delete(path);
            pendingRequests?.map((r) => //@ts-ignore
            this.request(r.method, r.path, r.body, r.id));
          }
        };
        exports_55("default", RequestHandler);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/constants",
  [],
  function (exports_56, context_56) {
    "use strict";
    var DISCORD_API_BASE,
      DISCORD_GATEWAY_URL,
      USER_AGENT,
      VOICE_ENCRPYTION_MODE;
    var __moduleName = context_56 && context_56.id;
    return {
      setters: [],
      execute: function () {
        exports_56(
          "DISCORD_API_BASE",
          DISCORD_API_BASE = "https://discord.com/api/v6/",
        );
        exports_56(
          "DISCORD_GATEWAY_URL",
          DISCORD_GATEWAY_URL = "wss://gateway.discord.gg/?v=6&encoding=json",
        );
        exports_56(
          "USER_AGENT",
          USER_AGENT =
            "DiscordBot (https://github.com/Timeraa/FluffCord, 1.0.0)",
        );
        exports_56(
          "VOICE_ENCRPYTION_MODE",
          VOICE_ENCRPYTION_MODE = "xsalsa20_poly1305",
        );
      },
    };
  },
);
System.register(
  "https://deno.land/x/events/mod",
  [],
  function (exports_57, context_57) {
    "use strict";
    var EventEmitter;
    var __moduleName = context_57 && context_57.id;
    return {
      setters: [],
      execute: function () {
        EventEmitter = class EventEmitter {
          constructor() {
            this.events = new Map();
            this.#defaultMaxListeners = 10;
          }
          #defaultMaxListeners;
          get defaultMaxListeners() {
            return this.#defaultMaxListeners;
          }
          set defaultMaxListeners(n) {
            if (Number.isInteger(n) || n < 0) {
              const error = new RangeError(
                'The value of "defaultMaxListeners" is out of range. It must be a non-negative integer. Received ' +
                  n +
                  ".",
              );
              throw error;
            }
            this.#defaultMaxListeners = n;
          }
          addListener(eventName, listener) {
            return this.on(eventName, listener);
          }
          emit(eventName, ...args) {
            const listeners = this.events.get(eventName);
            if (listeners === undefined) {
              if (eventName === "error") {
                const error = args[0];
                if (error instanceof Error) {
                  throw error;
                }
                throw new Error("Unhandled error.");
              }
              return false;
            }
            const copyListeners = [...listeners];
            for (const listener of copyListeners) {
              listener.apply(this, args);
            }
            return true;
          }
          setMaxListeners(n) {
            if (!Number.isInteger(n) || n < 0) {
              throw new RangeError(
                'The value of "n" is out of range. It must be a non-negative integer. Received ' +
                  n +
                  ".",
              );
            }
            this.maxListeners = n;
            return this;
          }
          getMaxListeners() {
            if (this.maxListeners === undefined) {
              return this.defaultMaxListeners;
            }
            return this.maxListeners;
          }
          listenerCount(eventName) {
            const events = this.events.get(eventName);
            return events === undefined ? 0 : events.length;
          }
          eventNames() {
            return Reflect.ownKeys(this.events);
          }
          listeners(eventName) {
            const listeners = this.events.get(eventName);
            return listeners === undefined ? [] : listeners;
          }
          off(eventName, listener) {
            return this.removeListener(eventName, listener);
          }
          on(eventName, listener, prepend) {
            if (this.events.has(eventName) === false) {
              this.events.set(eventName, []);
            }
            const events = this.events.get(eventName);
            if (prepend) {
              events.unshift(listener);
            } else {
              events.push(listener);
            }
            // newListener
            if (eventName !== "newListener" && this.events.has("newListener")) {
              this.emit("newListener", eventName, listener);
            }
            // warn
            const maxListener = this.getMaxListeners();
            const eventLength = events.length;
            if (
              maxListener > 0 && eventLength > maxListener && !events.warned
            ) {
              events.warned = true;
              const warning = new Error(
                `Possible EventEmitter memory leak detected.
         ${this.listenerCount(eventName)} ${eventName.toString()} listeners.
         Use emitter.setMaxListeners() to increase limit`,
              );
              warning.name = "MaxListenersExceededWarning";
              console.warn(warning);
            }
            return this;
          }
          removeAllListeners(eventName) {
            const events = this.events;
            // Not listening for removeListener, no need to emit
            if (!events.has("removeListener")) {
              if (arguments.length === 0) {
                this.events = new Map();
              } else if (events.has(eventName)) {
                events.delete(eventName);
              }
              return this;
            }
            // Emit removeListener for all listeners on all events
            if (arguments.length === 0) {
              for (const key of events.keys()) {
                if (key === "removeListener") {
                  continue;
                }
                this.removeAllListeners(key);
              }
              this.removeAllListeners("removeListener");
              this.events = new Map();
              return this;
            }
            const listeners = events.get(eventName);
            if (listeners !== undefined) {
              listeners.map((listener) => {
                this.removeListener(eventName, listener);
              });
            }
            return this;
          }
          removeListener(eventName, listener) {
            const events = this.events;
            if (events.size === 0) {
              return this;
            }
            const list = events.get(eventName);
            if (list === undefined) {
              return this;
            }
            const index = list.findIndex((item) =>
              item === listener || item.listener === listener
            );
            if (index === -1) {
              return this;
            }
            list.splice(index, 1);
            if (list.length === 0) {
              this.events.delete(eventName);
            }
            if (events.has("removeListener")) {
              this.emit("removeListener", eventName, listener);
            }
            return this;
          }
          once(eventName, listener) {
            this.on(eventName, this.onceWrap(eventName, listener));
            return this;
          }
          onceWrap(eventName, listener) {
            const wrapper = function (...args // eslint-disable-line @typescript-eslint/no-explicit-any
            ) {
              this.context.removeListener(this.eventName, this.wrapedListener);
              this.listener.apply(this.context, args);
            };
            const wrapperContext = {
              eventName: eventName,
              listener: listener,
              wrapedListener: wrapper,
              context: this,
            };
            const wrapped = wrapper.bind(wrapperContext);
            wrapperContext.wrapedListener = wrapped;
            wrapped.listener = listener;
            return wrapped;
          }
          prependListener(eventName, listener) {
            return this.on(eventName, listener, true);
          }
          prependOnceListener(eventName, listener) {
            this.prependListener(eventName, this.onceWrap(eventName, listener));
            return this;
          }
          rawListeners(eventName) {
            const events = this.events;
            if (events === undefined) {
              return [];
            }
            const listeners = events.get(eventName);
            if (listeners === undefined) {
              return [];
            }
            return [...listeners];
          }
        };
        exports_57("default", EventEmitter);
      },
    };
  },
);
System.register(
  "https://deno.land/std/node/_utils",
  [],
  function (exports_58, context_58) {
    "use strict";
    var __moduleName = context_58 && context_58.id;
    function notImplemented(msg) {
      const message = msg ? `Not implemented: ${msg}` : "Not implemented";
      throw new Error(message);
    }
    exports_58("notImplemented", notImplemented);
    function intoCallbackAPI(
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      func,
      cb,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      ...args
    ) {
      func(...args)
        .then((value) => cb && cb(null, value))
        .catch((err) => cb && cb(err, null));
    }
    exports_58("intoCallbackAPI", intoCallbackAPI);
    function intoCallbackAPIWithIntercept(
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      func,
      interceptor,
      cb,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      ...args
    ) {
      func(...args)
        .then((value) => cb && cb(null, interceptor(value)))
        .catch((err) => cb && cb(err, null));
    }
    exports_58("intoCallbackAPIWithIntercept", intoCallbackAPIWithIntercept);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std/node/process",
  ["https://deno.land/std/node/_utils"],
  function (exports_59, context_59) {
    "use strict";
    var _utils_ts_1,
      version,
      versions,
      platform,
      arch,
      pid,
      cwd,
      chdir,
      exit,
      process;
    var __moduleName = context_59 && context_59.id;
    function on(_event, _callback) {
      // TODO(rsp): to be implemented
      _utils_ts_1.notImplemented();
    }
    return {
      setters: [
        function (_utils_ts_1_1) {
          _utils_ts_1 = _utils_ts_1_1;
        },
      ],
      execute: function () {
        version = `v${Deno.version.deno}`;
        versions = {
          node: Deno.version.deno,
          ...Deno.version,
        };
        platform = Deno.build.os === "windows" ? "win32" : Deno.build.os;
        arch = Deno.build.arch;
        pid = Deno.pid, cwd = Deno.cwd, chdir = Deno.chdir, exit = Deno.exit;
        exports_59(
          "process",
          process = {
            version,
            versions,
            platform,
            arch,
            pid,
            cwd,
            chdir,
            exit,
            on,
            get env() {
              // using getter to avoid --allow-env unless it's used
              return Deno.env.toObject();
            },
            get argv() {
              // Deno.execPath() also requires --allow-env
              return [Deno.execPath(), ...Deno.args];
            },
          },
        );
        Object.defineProperty(process, Symbol.toStringTag, {
          enumerable: false,
          writable: true,
          configurable: false,
          value: "process",
        });
        Object.defineProperty(globalThis, "process", {
          value: process,
          enumerable: false,
          writable: true,
          configurable: true,
        });
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Client",
  [
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Collection",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/handlers/_loader",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/Metrics",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Classes/RequestHandler",
    "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/constants",
    "https://deno.land/std/ws/mod",
    "https://deno.land/std/fmt/colors",
    "https://deno.land/x/events/mod",
    "https://deno.land/std/node/process",
  ],
  function (exports_60, context_60) {
    "use strict";
    var Collection_ts_6,
      _loader_ts_1,
      Metrics_ts_1,
      RequestHandler_ts_1,
      constants_ts_1,
      mod_ts_12,
      colors,
      mod_ts_13,
      process_ts_1,
      Client;
    var __moduleName = context_60 && context_60.id;
    return {
      setters: [
        function (Collection_ts_6_1) {
          Collection_ts_6 = Collection_ts_6_1;
        },
        function (_loader_ts_1_1) {
          _loader_ts_1 = _loader_ts_1_1;
        },
        function (Metrics_ts_1_1) {
          Metrics_ts_1 = Metrics_ts_1_1;
        },
        function (RequestHandler_ts_1_1) {
          RequestHandler_ts_1 = RequestHandler_ts_1_1;
        },
        function (constants_ts_1_1) {
          constants_ts_1 = constants_ts_1_1;
        },
        function (mod_ts_12_1) {
          mod_ts_12 = mod_ts_12_1;
        },
        function (colors_1) {
          colors = colors_1;
        },
        function (mod_ts_13_1) {
          mod_ts_13 = mod_ts_13_1;
        },
        function (process_ts_1_1) {
          process_ts_1 = process_ts_1_1;
        },
      ],
      execute: function () {
        Client = class Client extends mod_ts_13.default {
          constructor(options) {
            super();
            this.ws = null;
            this.unavailableGuilds = [];
            this.sessionId = null;
            this.guilds = new Collection_ts_6.default();
            this.metrics = new Metrics_ts_1.default();
            this.ready = false;
            this.user = null;
            this.requesthandler = new RequestHandler_ts_1.default(this);
            this.seq = 0;
            this.lastHeartbeat = -1;
            this.lastHeartbeatAck = -1;
            this.eventHandler = new _loader_ts_1.default(this);
            this.connected = false;
            this.options = options;
          }
          async request(path, method, body = null) {
            // @ts-ignore
            return this.requesthandler.request(method, path, body);
          }
          async login() {
            return new Promise(async (resolve, reject) => {
              const now = Date.now();
              //* Load all events
              await this.eventHandler.load();
              this.ws = await mod_ts_12.connectWebSocket(
                constants_ts_1.DISCORD_GATEWAY_URL,
              );
              for await (const message of this.ws) {
                if (typeof message === "string") {
                  if (!this.connected) {
                    const difference = Date.now() - now;
                    this.debugLog(colors.green(`WS connected (${
                      difference < 500
                        ? difference
                        : difference < 1000
                        ? colors.yellow(difference.toString())
                        : colors.red(difference.toString())
                    }ms)!`));
                    resolve();
                    this.connected = true;
                  }
                  await this.handle(JSON.parse(message));
                } else if (mod_ts_12.isWebSocketCloseEvent(message)) {
                  this.ready = false;
                  this.connected = false;
                  this.debugLog(
                    colors.red(
                      message.code.toString() + (message.reason || "N/A"),
                    ),
                  );
                  if (!this.sessionId) {
                    reject("Server closed connection before client was ready!");
                  } else {
                    reject(
                      `Server closed connection unexpectedly (${message.code}, ${message
                        .reason || "N/A"})`,
                    );
                  }
                }
              }
            });
          }
          debugLog(...message) {
            if (this.options.debug) {
              console.log(
                colors.white(colors.bold("FluffCord")),
                colors.cyan("-"),
                message.join(" "),
              );
            }
          }
          heartbeat() {
            this.lastHeartbeat = Date.now();
            this.ws?.send(JSON.stringify({
              op: 1,
              d: this.seq
                ? this.seq
                : null,
            }));
          }
          identify() {
            this.ws?.send(JSON.stringify({
              op: 2,
              d: {
                token: this.options.token,
                properties: {
                  $os: process_ts_1.process.platform,
                  $browser: "FluffCord",
                  $device: "FluffCord",
                },
              },
            }));
          }
          async handle(payload) {
            switch (payload.op) {
              //* Dispatch
              case 0: {
                this.emit("raw", payload);
                await this.eventHandler.dispatch(payload);
                break;
              }
              //* Hello
              case 10: {
                this.debugLog(
                  colors.magenta(
                    `Heartbeating at ${payload.d.heartbeat_interval}ms!`,
                  ),
                );
                this.heartbeat();
                this.identify();
                this.interval = setInterval(
                  this.heartbeat.bind(this),
                  payload.d.heartbeat_interval,
                );
                break;
              }
              //* Heartbeat ACK
              case 11: {
                this.lastHeartbeatAck = Date.now();
                const difference = this.lastHeartbeatAck - this.lastHeartbeat;
                this.debugLog(
                  colors.magenta(
                    `Received a heartbeat ACK, which took ${
                      difference < 500
                        ? colors.green(difference.toString())
                        : difference < 1000
                        ? colors.yellow(difference.toString())
                        : colors.red(difference.toString())
                    }ms!`,
                  ),
                );
                break;
              }
            }
          }
          handleDisconnect(message) {
            this.debugLog(
              colors.red(message.code.toString() + (message.reason || "N/A")),
            );
          }
          get ping() {
            return this.lastHeartbeatAck - this.lastHeartbeat;
          }
        };
        exports_60("default", Client);
      },
    };
  },
);
System.register(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/index",
  ["file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/Client"],
  function (exports_61, context_61) {
    "use strict";
    var Client_ts_1;
    var __moduleName = context_61 && context_61.id;
    return {
      setters: [
        function (Client_ts_1_1) {
          Client_ts_1 = Client_ts_1_1;
        },
      ],
      execute: function () {
        exports_61("default", Client_ts_1.default);
      },
    };
  },
);

const __exp = __instantiate(
  "file:///C:/Users/metzf/Documents/Development/Deno/FluffCord/index",
);
export default __exp["default"];
