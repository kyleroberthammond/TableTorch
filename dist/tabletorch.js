import ie from "react";
var q = { exports: {} }, b = {};
/** @license React v16.14.0
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var te;
function De() {
  if (te)
    return b;
  te = 1;
  var R = ie, D = 60103;
  if (b.Fragment = 60107, typeof Symbol == "function" && Symbol.for) {
    var h = Symbol.for;
    D = h("react.element"), b.Fragment = h("react.fragment");
  }
  var k = R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, j = Object.prototype.hasOwnProperty, w = { key: !0, ref: !0, __self: !0, __source: !0 };
  function T(p, s, P) {
    var l, E = {}, O = null, m = null;
    P !== void 0 && (O = "" + P), s.key !== void 0 && (O = "" + s.key), s.ref !== void 0 && (m = s.ref);
    for (l in s)
      j.call(s, l) && !w.hasOwnProperty(l) && (E[l] = s[l]);
    if (p && p.defaultProps)
      for (l in s = p.defaultProps, s)
        E[l] === void 0 && (E[l] = s[l]);
    return { $$typeof: D, type: p, key: O, ref: m, props: E, _owner: k.current };
  }
  return b.jsx = T, b.jsxs = T, b;
}
var M = {};
/** @license React v16.14.0
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ae;
function ke() {
  return ae || (ae = 1, function(R) {
    process.env.NODE_ENV !== "production" && function() {
      var D = ie, h = 60103, k = 60106;
      R.Fragment = 60107;
      var j = 60108, w = 60114, T = 60109, p = 60110, s = 60112, P = 60113, l = 60120, E = 60115, O = 60116, m = 60121, F = 60122, N = 60117, J = 60129, z = 60131;
      if (typeof Symbol == "function" && Symbol.for) {
        var o = Symbol.for;
        h = o("react.element"), k = o("react.portal"), R.Fragment = o("react.fragment"), j = o("react.strict_mode"), w = o("react.profiler"), T = o("react.provider"), p = o("react.context"), s = o("react.forward_ref"), P = o("react.suspense"), l = o("react.suspense_list"), E = o("react.memo"), O = o("react.lazy"), m = o("react.block"), F = o("react.server.block"), N = o("react.fundamental"), o("react.scope"), o("react.opaque.id"), J = o("react.debug_trace_mode"), o("react.offscreen"), z = o("react.legacy_hidden");
      }
      var K = typeof Symbol == "function" && Symbol.iterator, ue = "@@iterator";
      function fe(e) {
        if (e === null || typeof e != "object")
          return null;
        var r = K && e[K] || e[ue];
        return typeof r == "function" ? r : null;
      }
      var A = D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function d(e) {
        {
          for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), t = 1; t < r; t++)
            n[t - 1] = arguments[t];
          oe("error", e, n);
        }
      }
      function oe(e, r, n) {
        {
          var t = A.ReactDebugCurrentFrame, u = "";
          if (x) {
            var f = v(x.type), i = x._owner;
            u += le(f, x._source, i && v(i.type));
          }
          u += t.getStackAddendum(), u !== "" && (r += "%s", n = n.concat([u]));
          var a = n.map(function(c) {
            return "" + c;
          });
          a.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, a);
        }
      }
      var se = !1;
      function ce(e) {
        return !!(typeof e == "string" || typeof e == "function" || e === R.Fragment || e === w || e === J || e === j || e === P || e === l || e === z || se || typeof e == "object" && e !== null && (e.$$typeof === O || e.$$typeof === E || e.$$typeof === T || e.$$typeof === p || e.$$typeof === s || e.$$typeof === N || e.$$typeof === m || e[0] === F));
      }
      var I = /^(.*)[\\\/]/;
      function le(e, r, n) {
        var t = "";
        if (r) {
          var u = r.fileName, f = u.replace(I, "");
          if (/^index\./.test(f)) {
            var i = u.match(I);
            if (i) {
              var a = i[1];
              if (a) {
                var c = a.replace(I, "");
                f = c + "/" + f;
              }
            }
          }
          t = " (at " + f + ":" + r.lineNumber + ")";
        } else
          n && (t = " (created by " + n + ")");
        return `
    in ` + (e || "Unknown") + t;
      }
      var de = 1;
      function ve(e) {
        return e._status === de ? e._result : null;
      }
      function _e(e, r, n) {
        var t = r.displayName || r.name || "";
        return e.displayName || (t !== "" ? n + "(" + t + ")" : n);
      }
      function v(e) {
        if (e == null)
          return null;
        if (typeof e.tag == "number" && d("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), typeof e == "function")
          return e.displayName || e.name || null;
        if (typeof e == "string")
          return e;
        switch (e) {
          case R.Fragment:
            return "Fragment";
          case k:
            return "Portal";
          case w:
            return "Profiler";
          case j:
            return "StrictMode";
          case P:
            return "Suspense";
          case l:
            return "SuspenseList";
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case p:
              return "Context.Consumer";
            case T:
              return "Context.Provider";
            case s:
              return _e(e, e.render, "ForwardRef");
            case E:
              return v(e.type);
            case m:
              return v(e.render);
            case O: {
              var r = e, n = ve(r);
              if (n)
                return v(n);
              break;
            }
          }
        return null;
      }
      var G = {};
      A.ReactDebugCurrentFrame;
      var x = null;
      function Y(e) {
        x = e;
      }
      function Re(e, r, n, t, u) {
        {
          var f = Function.call.bind(Object.prototype.hasOwnProperty);
          for (var i in e)
            if (f(e, i)) {
              var a = void 0;
              try {
                if (typeof e[i] != "function") {
                  var c = Error((t || "React class") + ": " + n + " type `" + i + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[i] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw c.name = "Invariant Violation", c;
                }
                a = e[i](r, i, t, n, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (_) {
                a = _;
              }
              a && !(a instanceof Error) && (Y(u), d("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", t || "React class", n, i, typeof a), Y(null)), a instanceof Error && !(a.message in G) && (G[a.message] = !0, Y(u), d("Failed %s type: %s", n, a.message), Y(null));
            }
        }
      }
      var S = A.ReactCurrentOwner, $ = Object.prototype.hasOwnProperty, Ee = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, H, X, L;
      L = {};
      function pe(e) {
        if ($.call(e, "ref")) {
          var r = Object.getOwnPropertyDescriptor(e, "ref").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.ref !== void 0;
      }
      function ge(e) {
        if ($.call(e, "key")) {
          var r = Object.getOwnPropertyDescriptor(e, "key").get;
          if (r && r.isReactWarning)
            return !1;
        }
        return e.key !== void 0;
      }
      function he(e, r) {
        if (typeof e.ref == "string" && S.current && r && S.current.stateNode !== r) {
          var n = v(S.current.type);
          L[n] || (d('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', v(S.current.type), e.ref), L[n] = !0);
        }
      }
      function Oe(e, r) {
        {
          var n = function() {
            H || (H = !0, d("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
          };
          n.isReactWarning = !0, Object.defineProperty(e, "key", {
            get: n,
            configurable: !0
          });
        }
      }
      function Te(e, r) {
        {
          var n = function() {
            X || (X = !0, d("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
          };
          n.isReactWarning = !0, Object.defineProperty(e, "ref", {
            get: n,
            configurable: !0
          });
        }
      }
      var Pe = function(e, r, n, t, u, f, i) {
        var a = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: h,
          // Built-in properties that belong on the element
          type: e,
          key: r,
          ref: n,
          props: i,
          // Record the component responsible for creating this element.
          _owner: f
        };
        return a._store = {}, Object.defineProperty(a._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(a, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: t
        }), Object.defineProperty(a, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: u
        }), Object.freeze && (Object.freeze(a.props), Object.freeze(a)), a;
      };
      function me(e, r, n, t, u) {
        {
          var f, i = {}, a = null, c = null;
          n !== void 0 && (a = "" + n), ge(r) && (a = "" + r.key), pe(r) && (c = r.ref, he(r, u));
          for (f in r)
            $.call(r, f) && !Ee.hasOwnProperty(f) && (i[f] = r[f]);
          if (e && e.defaultProps) {
            var _ = e.defaultProps;
            for (f in _)
              i[f] === void 0 && (i[f] = _[f]);
          }
          if (a || c) {
            var g = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
            a && Oe(i, g), c && Te(i, g);
          }
          return Pe(e, a, c, u, t, S.current, i);
        }
      }
      var W = A.ReactCurrentOwner;
      A.ReactDebugCurrentFrame;
      function y(e) {
        x = e;
      }
      var V;
      V = !1;
      function U(e) {
        return typeof e == "object" && e !== null && e.$$typeof === h;
      }
      function Z() {
        {
          if (W.current) {
            var e = v(W.current.type);
            if (e)
              return `

Check the render method of \`` + e + "`.";
          }
          return "";
        }
      }
      function xe(e) {
        {
          if (e !== void 0) {
            var r = e.fileName.replace(/^.*[\\\/]/, ""), n = e.lineNumber;
            return `

Check your code at ` + r + ":" + n + ".";
          }
          return "";
        }
      }
      var Q = {};
      function ye(e) {
        {
          var r = Z();
          if (!r) {
            var n = typeof e == "string" ? e : e.displayName || e.name;
            n && (r = `

Check the top-level render call using <` + n + ">.");
          }
          return r;
        }
      }
      function ee(e, r) {
        {
          if (!e._store || e._store.validated || e.key != null)
            return;
          e._store.validated = !0;
          var n = ye(r);
          if (Q[n])
            return;
          Q[n] = !0;
          var t = "";
          e && e._owner && e._owner !== W.current && (t = " It was passed a child from " + v(e._owner.type) + "."), y(e), d('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', n, t), y(null);
        }
      }
      function re(e, r) {
        {
          if (typeof e != "object")
            return;
          if (Array.isArray(e))
            for (var n = 0; n < e.length; n++) {
              var t = e[n];
              U(t) && ee(t, r);
            }
          else if (U(e))
            e._store && (e._store.validated = !0);
          else if (e) {
            var u = fe(e);
            if (typeof u == "function" && u !== e.entries)
              for (var f = u.call(e), i; !(i = f.next()).done; )
                U(i.value) && ee(i.value, r);
          }
        }
      }
      function Ce(e) {
        {
          var r = e.type;
          if (r == null || typeof r == "string")
            return;
          var n;
          if (typeof r == "function")
            n = r.propTypes;
          else if (typeof r == "object" && (r.$$typeof === s || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          r.$$typeof === E))
            n = r.propTypes;
          else
            return;
          if (n) {
            var t = v(r);
            Re(n, e.props, "prop", t, e);
          } else if (r.PropTypes !== void 0 && !V) {
            V = !0;
            var u = v(r);
            d("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", u || "Unknown");
          }
          typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && d("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function be(e) {
        {
          for (var r = Object.keys(e.props), n = 0; n < r.length; n++) {
            var t = r[n];
            if (t !== "children" && t !== "key") {
              y(e), d("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", t), y(null);
              break;
            }
          }
          e.ref !== null && (y(e), d("Invalid attribute `ref` supplied to `React.Fragment`."), y(null));
        }
      }
      function ne(e, r, n, t, u, f) {
        {
          var i = ce(e);
          if (!i) {
            var a = "";
            (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (a += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var c = xe(u);
            c ? a += c : a += Z();
            var _;
            e === null ? _ = "null" : Array.isArray(e) ? _ = "array" : e !== void 0 && e.$$typeof === h ? (_ = "<" + (v(e.type) || "Unknown") + " />", a = " Did you accidentally export a JSX literal instead of a component?") : _ = typeof e, d("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", _, a);
          }
          var g = me(e, r, n, u, f);
          if (g == null)
            return g;
          if (i) {
            var C = r.children;
            if (C !== void 0)
              if (t)
                if (Array.isArray(C)) {
                  for (var B = 0; B < C.length; B++)
                    re(C[B], e);
                  Object.freeze && Object.freeze(C);
                } else
                  d("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
              else
                re(C, e);
          }
          return e === R.Fragment ? be(g) : Ce(g), g;
        }
      }
      function je(e, r, n) {
        return ne(e, r, n, !0);
      }
      function we(e, r, n) {
        return ne(e, r, n, !1);
      }
      var Ae = we, Se = je;
      R.jsx = Ae, R.jsxs = Se;
    }();
  }(M)), M;
}
process.env.NODE_ENV === "production" ? q.exports = De() : q.exports = ke();
var Ye = q.exports;
function $e() {
  return /* @__PURE__ */ Ye.jsx("div", { children: "Just trying a few things" });
}
export {
  $e as default
};
