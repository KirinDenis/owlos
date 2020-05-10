/*! jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.1.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=r.isArray(d)))?(e?(e=!1,f=c&&r.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext,B=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,C=/^.[^:#\[\.,]*$/;function D(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):C.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(D(this,a||[],!1))},not:function(a){return this.pushStack(D(this,a||[],!0))},is:function(a){return!!D(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var E,F=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,G=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||E,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:F.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),B.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};G.prototype=r.fn,E=r(d);var H=/^(?:parents|prev(?:Until|All))/,I={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function J(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return J(a,"nextSibling")},prev:function(a){return J(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return a.contentDocument||r.merge([],a.childNodes)}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(I[a]||r.uniqueSort(e),H.test(a)&&e.reverse()),this.pushStack(e)}});var K=/[^\x20\t\r\n\f]+/g;function L(a){var b={};return r.each(a.match(K)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?L(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function M(a){return a}function N(a){throw a}function O(a,b,c){var d;try{a&&r.isFunction(d=a.promise)?d.call(a).done(b).fail(c):a&&r.isFunction(d=a.then)?d.call(a,b,c):b.call(void 0,a)}catch(a){c.call(void 0,a)}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,M,e),g(f,c,N,e)):(f++,j.call(a,g(f,c,M,e),g(f,c,N,e),g(f,c,M,c.notifyWith))):(d!==M&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==N&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:M,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:M)),c[2][3].add(g(0,a,r.isFunction(d)?d:N))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(O(a,g.done(h(c)).resolve,g.reject),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)O(e[c],h(c),g.reject);return g.promise()}});var P=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&P.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var Q=r.Deferred();r.fn.ready=function(a){return Q.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,holdReady:function(a){a?r.readyWait++:r.ready(!0)},ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||Q.resolveWith(d,[r]))}}),r.ready.then=Q.then;function R(){d.removeEventListener("DOMContentLoaded",R),
a.removeEventListener("load",R),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",R),a.addEventListener("load",R));var S=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)S(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},T=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function U(){this.expando=r.expando+U.uid++}U.uid=1,U.prototype={cache:function(a){var b=a[this.expando];return b||(b={},T(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){r.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(K)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var V=new U,W=new U,X=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Y=/[A-Z]/g;function Z(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:X.test(a)?JSON.parse(a):a)}function $(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Y,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=Z(c)}catch(e){}W.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return W.hasData(a)||V.hasData(a)},data:function(a,b,c){return W.access(a,b,c)},removeData:function(a,b){W.remove(a,b)},_data:function(a,b,c){return V.access(a,b,c)},_removeData:function(a,b){V.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=W.get(f),1===f.nodeType&&!V.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),$(f,d,e[d])));V.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){W.set(this,a)}):S(this,function(b){var c;if(f&&void 0===b){if(c=W.get(f,a),void 0!==c)return c;if(c=$(f,a),void 0!==c)return c}else this.each(function(){W.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){W.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=V.get(a,b),c&&(!d||r.isArray(c)?d=V.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return V.get(a,c)||V.access(a,c,{empty:r.Callbacks("once memory").add(function(){V.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=V.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var _=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,aa=new RegExp("^(?:([+-])=|)("+_+")([a-z%]*)$","i"),ba=["Top","Right","Bottom","Left"],ca=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function ea(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&aa.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.node=j,d.start=k,d.end=e)),e}var fa={};function ga(a){var b,c=a.ownerDocument,d=a.nodeName,e=fa[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),fa[d]=e,e)}function ha(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=V.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&ca(d)&&(e[f]=ga(d))):"none"!==c&&(e[f]="none",V.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ha(this,!0)},hide:function(){return ha(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){ca(this)?r(this).show():r(this).hide()})}});var ia=/^(?:checkbox|radio)$/i,ja=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,ka=/^$|\/(?:java|ecma)script/i,la={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};la.optgroup=la.option,la.tbody=la.tfoot=la.colgroup=la.caption=la.thead,la.th=la.td;function ma(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&r.nodeName(a,b)?r.merge([a],c):c}function na(a,b){for(var c=0,d=a.length;c<d;c++)V.set(a[c],"globalEval",!b||V.get(b[c],"globalEval"))}var oa=/<|&#?\w+;/;function pa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(oa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ja.exec(f)||["",""])[1].toLowerCase(),i=la[h]||la._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=ma(l.appendChild(f),"script"),j&&na(g),c){k=0;while(f=g[k++])ka.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var qa=d.documentElement,ra=/^key/,sa=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ta=/^([^.]*)(?:\.(.+)|)/;function ua(){return!0}function va(){return!1}function wa(){try{return d.activeElement}catch(a){}}function xa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)xa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=va;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(qa,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(K)||[""],j=b.length;while(j--)h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.hasData(a)&&V.get(a);if(q&&(i=q.events)){b=(b||"").match(K)||[""],j=b.length;while(j--)if(h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&V.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(V.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==wa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===wa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&r.nodeName(this,"input"))return this.click(),!1},_default:function(a){return r.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ua:va,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:va,isPropagationStopped:va,isImmediatePropagationStopped:va,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ua,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ua,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ua,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&ra.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&sa.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return xa(this,a,b,c,d)},one:function(a,b,c,d){return xa(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=va),this.each(function(){r.event.remove(this,a,c,b)})}});var ya=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,za=/<script|<style|<link/i,Aa=/checked\s*(?:[^=]|=\s*.checked.)/i,Ba=/^true\/(.*)/,Ca=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Da(a,b){return r.nodeName(a,"table")&&r.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a:a}function Ea(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Fa(a){var b=Ba.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ga(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(V.hasData(a)&&(f=V.access(a),g=V.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}W.hasData(a)&&(h=W.access(a),i=r.extend({},h),W.set(b,i))}}function Ha(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ia.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ia(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Aa.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ia(f,b,c,d)});if(m&&(e=pa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(ma(e,"script"),Ea),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,ma(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Fa),l=0;l<i;l++)j=h[l],ka.test(j.type||"")&&!V.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Ca,""),k))}return a}function Ja(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(ma(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&na(ma(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(ya,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=ma(h),f=ma(a),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);if(b)if(c)for(f=f||ma(a),g=g||ma(h),d=0,e=f.length;d<e;d++)Ga(f[d],g[d]);else Ga(a,h);return g=ma(h,"script"),g.length>0&&na(g,!i&&ma(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(T(c)){if(b=c[V.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[V.expando]=void 0}c[W.expando]&&(c[W.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ja(this,a,!0)},remove:function(a){return Ja(this,a)},text:function(a){return S(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.appendChild(a)}})},prepend:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(ma(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return S(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!za.test(a)&&!la[(ja.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(ma(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ia(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(ma(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var Ka=/^margin/,La=new RegExp("^("+_+")(?!px)[a-z%]+$","i"),Ma=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",qa.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,qa.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Na(a,b,c){var d,e,f,g,h=a.style;return c=c||Ma(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&La.test(g)&&Ka.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Oa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Pa=/^(none|table(?!-c[ea]).+)/,Qa={position:"absolute",visibility:"hidden",display:"block"},Ra={letterSpacing:"0",fontWeight:"400"},Sa=["Webkit","Moz","ms"],Ta=d.createElement("div").style;function Ua(a){if(a in Ta)return a;var b=a[0].toUpperCase()+a.slice(1),c=Sa.length;while(c--)if(a=Sa[c]+b,a in Ta)return a}function Va(a,b,c){var d=aa.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Wa(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ba[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ba[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ba[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ba[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ba[f]+"Width",!0,e)));return g}function Xa(a,b,c){var d,e=!0,f=Ma(a),g="border-box"===r.css(a,"boxSizing",!1,f);if(a.getClientRects().length&&(d=a.getBoundingClientRect()[b]),d<=0||null==d){if(d=Na(a,b,f),(d<0||null==d)&&(d=a.style[b]),La.test(d))return d;e=g&&(o.boxSizingReliable()||d===a.style[b]),d=parseFloat(d)||0}return d+Wa(a,b,c||(g?"border":"content"),e,f)+"px"}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Na(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=a.style;return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=aa.exec(c))&&e[1]&&(c=ea(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b);return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Na(a,b,d)),"normal"===e&&b in Ra&&(e=Ra[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Pa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?Xa(a,b,d):da(a,Qa,function(){return Xa(a,b,d)})},set:function(a,c,d){var e,f=d&&Ma(a),g=d&&Wa(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=aa.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Va(a,c,g)}}}),r.cssHooks.marginLeft=Oa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Na(a,"marginLeft"))||a.getBoundingClientRect().left-da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ba[d]+b]=f[d]||f[d-2]||f[0];return e}},Ka.test(a)||(r.cssHooks[a+b].set=Va)}),r.fn.extend({css:function(a,b){return S(this,function(a,b,c){var d,e,f={},g=0;if(r.isArray(b)){for(d=Ma(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function Ya(a,b,c,d,e){return new Ya.prototype.init(a,b,c,d,e)}r.Tween=Ya,Ya.prototype={constructor:Ya,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.node=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=Ya.propHooks[this.prop];return a&&a.get?a.get(this):Ya.propHooks._default.get(this)},run:function(a){var b,c=Ya.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ya.propHooks._default.set(this),this}},Ya.prototype.init.prototype=Ya.prototype,Ya.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.node)}}},Ya.propHooks.scrollTop=Ya.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=Ya.prototype.init,r.fx.step={};var Za,$a,_a=/^(?:toggle|show|hide)$/,ab=/queueHooks$/;function bb(){$a&&(a.requestAnimationFrame(bb),r.fx.tick())}function cb(){return a.setTimeout(function(){Za=void 0}),Za=r.now()}function db(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ba[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function eb(a,b,c){for(var d,e=(hb.tweeners[b]||[]).concat(hb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function fb(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&ca(a),q=V.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],_a.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=V.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ha([a],!0),j=a.style.display||j,k=r.css(a,"display"),ha([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=V.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ha([a],!0),m.done(function(){p||ha([a]),V.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=eb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function gb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],r.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function hb(a,b,c){var d,e,f=0,g=hb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Za||cb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:Za||cb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(gb(k,j.opts.specialEasing);f<g;f++)if(d=hb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,eb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}r.Animation=r.extend(hb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return ea(c.elem,a,aa.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(K);for(var c,d=0,e=a.length;d<e;d++)c=a[d],hb.tweeners[c]=hb.tweeners[c]||[],hb.tweeners[c].unshift(b)},prefilters:[fb],prefilter:function(a,b){b?hb.prefilters.unshift(a):hb.prefilters.push(a)}}),r.speed=function(a,b,c){var e=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off||d.hidden?e.duration=0:"number"!=typeof e.duration&&(e.duration in r.fx.speeds?e.duration=r.fx.speeds[e.duration]:e.duration=r.fx.speeds._default),null!=e.queue&&e.queue!==!0||(e.queue="fx"),e.old=e.complete,e.complete=function(){r.isFunction(e.old)&&e.old.call(this),e.queue&&r.dequeue(this,e.queue)},e},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(ca).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=hb(this,r.extend({},a),f);(e||V.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=V.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&ab.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=V.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(db(b,!0),a,d,e)}}),r.each({slideDown:db("show"),slideUp:db("hide"),slideToggle:db("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(Za=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),Za=void 0},r.fx.timer=function(a){r.timers.push(a),a()?r.fx.start():r.timers.pop()},r.fx.interval=13,r.fx.start=function(){$a||($a=a.requestAnimationFrame?a.requestAnimationFrame(bb):a.setInterval(r.fx.tick,r.fx.interval))},r.fx.stop=function(){a.cancelAnimationFrame?a.cancelAnimationFrame($a):a.clearInterval($a),$a=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var ib,jb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return S(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?ib:void 0)),
void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&r.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(K);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),ib={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=jb[b]||r.find.attr;jb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=jb[g],jb[g]=e,e=null!=c(a,b,d)?g:null,jb[g]=f),e}});var kb=/^(?:input|select|textarea|button)$/i,lb=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return S(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):kb.test(a.nodeName)||lb.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function mb(a){var b=a.match(K)||[];return b.join(" ")}function nb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,nb(this)))});if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,nb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,nb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(K)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=nb(this),b&&V.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":V.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+mb(nb(c))+" ").indexOf(b)>-1)return!0;return!1}});var ob=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":r.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(ob,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:mb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!r.nodeName(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(r.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var pb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!pb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,pb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(V.get(h,"events")||{})[b.type]&&V.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&T(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!T(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=V.access(d,b);e||d.addEventListener(a,c,!0),V.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=V.access(d,b)-1;e?V.access(d,b,e):(d.removeEventListener(a,c,!0),V.remove(d,b))}}});var qb=a.location,rb=r.now(),sb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var tb=/\[\]$/,ub=/\r?\n/g,vb=/^(?:submit|button|image|reset|file)$/i,wb=/^(?:input|select|textarea|keygen)/i;function xb(a,b,c,d){var e;if(r.isArray(b))r.each(b,function(b,e){c||tb.test(a)?d(a,e):xb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)xb(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(r.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)xb(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&wb.test(this.nodeName)&&!vb.test(a)&&(this.checked||!ia.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:r.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(ub,"\r\n")}}):{name:b.name,value:c.replace(ub,"\r\n")}}).get()}});var yb=/%20/g,zb=/#.*$/,Ab=/([?&])_=[^&]*/,Bb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Cb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Db=/^(?:GET|HEAD)$/,Eb=/^\/\//,Fb={},Gb={},Hb="*/".concat("*"),Ib=d.createElement("a");Ib.href=qb.href;function Jb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(K)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Kb(a,b,c,d){var e={},f=a===Gb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Lb(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Mb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Nb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:qb.href,type:"GET",isLocal:Cb.test(qb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Hb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Lb(Lb(a,r.ajaxSettings),b):Lb(r.ajaxSettings,a)},ajaxPrefilter:Jb(Fb),ajaxTransport:Jb(Gb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Bb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||qb.href)+"").replace(Eb,qb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(K)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Ib.protocol+"//"+Ib.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Kb(Fb,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Db.test(o.type),f=o.url.replace(zb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(yb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(sb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Ab,"$1"),n=(sb.test(f)?"&":"?")+"_="+rb++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Hb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Kb(Gb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Mb(o,y,d)),v=Nb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Ob={0:200,1223:204},Pb=r.ajaxSettings.xhr();o.cors=!!Pb&&"withCredentials"in Pb,o.ajax=Pb=!!Pb,r.ajaxTransport(function(b){var c,d;if(o.cors||Pb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Ob[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Qb=[],Rb=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Qb.pop()||r.expando+"_"+rb++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Rb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Rb.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Rb,"$1"+e):b.jsonp!==!1&&(b.url+=(sb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Qb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=B.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=pa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=mb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length};function Sb(a){return r.isWindow(a)?a:9===a.nodeType&&a.defaultView}r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),d.width||d.height?(e=f.ownerDocument,c=Sb(e),b=e.documentElement,{top:d.top+c.pageYOffset-b.clientTop,left:d.left+c.pageXOffset-b.clientLeft}):d):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),r.nodeName(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||qa})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return S(this,function(a,d,e){var f=Sb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Oa(o.pixelPosition,function(a,c){if(c)return c=Na(a,b),La.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return S(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.parseJSON=JSON.parse,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Tb=a.jQuery,Ub=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Ub),b&&a.jQuery===r&&(a.jQuery=Tb),r},b||(a.jQuery=a.$=r),r});
/*!
 DataTables 1.10.18
 ©2008-2018 SpryMedia Ltd - datatables.net/license
*/
(function(h){"function"===typeof define&&define.amd?define(["jquery"],function(E){return h(E,window,document)}):"object"===typeof exports?module.exports=function(E,H){E||(E=window);H||(H="undefined"!==typeof window?require("jquery"):require("jquery")(E));return h(H,E,E.document)}:h(jQuery,window,document)})(function(h,E,H,k){function Z(a){var b,c,d={};h.each(a,function(e){if((b=e.match(/^([^A-Z]+?)([A-Z])/))&&-1!=="a aa ai ao as b fn i m o s ".indexOf(b[1]+" "))c=e.replace(b[0],b[2].toLowerCase()),
d[c]=e,"o"===b[1]&&Z(a[e])});a._hungarianMap=d}function J(a,b,c){a._hungarianMap||Z(a);var d;h.each(b,function(e){d=a._hungarianMap[e];if(d!==k&&(c||b[d]===k))"o"===d.charAt(0)?(b[d]||(b[d]={}),h.extend(!0,b[d],b[e]),J(a[d],b[d],c)):b[d]=b[e]})}function Ca(a){var b=n.defaults.oLanguage,c=b.sDecimal;c&&Da(c);if(a){var d=a.sZeroRecords;!a.sEmptyTable&&(d&&"No data available in table"===b.sEmptyTable)&&F(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&(d&&"Loading..."===b.sLoadingRecords)&&F(a,
a,"sZeroRecords","sLoadingRecords");a.sInfoThousands&&(a.sThousands=a.sInfoThousands);(a=a.sDecimal)&&c!==a&&Da(a)}}function eb(a){A(a,"ordering","bSort");A(a,"orderMulti","bSortMulti");A(a,"orderClasses","bSortClasses");A(a,"orderCellsTop","bSortCellsTop");A(a,"order","aaSorting");A(a,"orderFixed","aaSortingFixed");A(a,"paging","bPaginate");A(a,"pagingType","sPaginationType");A(a,"pageLength","iDisplayLength");A(a,"searching","bFilter");"boolean"===typeof a.sScrollX&&(a.sScrollX=a.sScrollX?"100%":
"");"boolean"===typeof a.scrollX&&(a.scrollX=a.scrollX?"100%":"");if(a=a.aoSearchCols)for(var b=0,c=a.length;b<c;b++)a[b]&&J(n.models.oSearch,a[b])}function fb(a){A(a,"orderable","bSortable");A(a,"orderData","aDataSort");A(a,"orderSequence","asSorting");A(a,"orderDataType","sortDataType");var b=a.aDataSort;"number"===typeof b&&!h.isArray(b)&&(a.aDataSort=[b])}function gb(a){if(!n.__browser){var b={};n.__browser=b;var c=h("<div/>").css({position:"fixed",top:0,left:-1*h(E).scrollLeft(),height:1,width:1,
overflow:"hidden"}).append(h("<div/>").css({position:"absolute",top:1,left:1,width:100,overflow:"scroll"}).append(h("<div/>").css({width:"100%",height:10}))).appendTo("body"),d=c.children(),e=d.children();b.barWidth=d[0].offsetWidth-d[0].clientWidth;b.bScrollOversize=100===e[0].offsetWidth&&100!==d[0].clientWidth;b.bScrollbarLeft=1!==Math.round(e.offset().left);b.bBounding=c[0].getBoundingClientRect().width?!0:!1;c.remove()}h.extend(a.oBrowser,n.__browser);a.oScroll.iBarWidth=n.__browser.barWidth}
function hb(a,b,c,d,e,f){var g,j=!1;c!==k&&(g=c,j=!0);for(;d!==e;)a.hasOwnProperty(d)&&(g=j?b(g,a[d],d,a):a[d],j=!0,d+=f);return g}function Ea(a,b){var c=n.defaults.column,d=a.aoColumns.length,c=h.extend({},n.models.oColumn,c,{nTh:b?b:H.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:"",aDataSort:c.aDataSort?c.aDataSort:[d],mData:c.mData?c.mData:d,idx:d});a.aoColumns.push(c);c=a.aoPreSearchCols;c[d]=h.extend({},n.models.oSearch,c[d]);ka(a,d,h(b).data())}function ka(a,b,c){var b=a.aoColumns[b],
d=a.oClasses,e=h(b.nTh);if(!b.sWidthOrig){b.sWidthOrig=e.attr("width")||null;var f=(e.attr("style")||"").match(/width:\s*(\d+[pxem%]+)/);f&&(b.sWidthOrig=f[1])}c!==k&&null!==c&&(fb(c),J(n.defaults.column,c),c.mDataProp!==k&&!c.mData&&(c.mData=c.mDataProp),c.sType&&(b._sManualType=c.sType),c.className&&!c.sClass&&(c.sClass=c.className),c.sClass&&e.addClass(c.sClass),h.extend(b,c),F(b,c,"sWidth","sWidthOrig"),c.iDataSort!==k&&(b.aDataSort=[c.iDataSort]),F(b,c,"aDataSort"));var g=b.mData,j=S(g),i=b.mRender?
S(b.mRender):null,c=function(a){return"string"===typeof a&&-1!==a.indexOf("@")};b._bAttrSrc=h.isPlainObject(g)&&(c(g.sort)||c(g.type)||c(g.filter));b._setter=null;b.fnGetData=function(a,b,c){var d=j(a,b,k,c);return i&&b?i(d,b,a,c):d};b.fnSetData=function(a,b,c){return N(g)(a,b,c)};"number"!==typeof g&&(a._rowReadObject=!0);a.oFeatures.bSort||(b.bSortable=!1,e.addClass(d.sSortableNone));a=-1!==h.inArray("asc",b.asSorting);c=-1!==h.inArray("desc",b.asSorting);!b.bSortable||!a&&!c?(b.sSortingClass=d.sSortableNone,
b.sSortingClassJUI=""):a&&!c?(b.sSortingClass=d.sSortableAsc,b.sSortingClassJUI=d.sSortJUIAscAllowed):!a&&c?(b.sSortingClass=d.sSortableDesc,b.sSortingClassJUI=d.sSortJUIDescAllowed):(b.sSortingClass=d.sSortable,b.sSortingClassJUI=d.sSortJUI)}function $(a){if(!1!==a.oFeatures.bAutoWidth){var b=a.aoColumns;Fa(a);for(var c=0,d=b.length;c<d;c++)b[c].nTh.style.width=b[c].sWidth}b=a.oScroll;(""!==b.sY||""!==b.sX)&&la(a);r(a,null,"column-sizing",[a])}function aa(a,b){var c=ma(a,"bVisible");return"number"===
typeof c[b]?c[b]:null}function ba(a,b){var c=ma(a,"bVisible"),c=h.inArray(b,c);return-1!==c?c:null}function V(a){var b=0;h.each(a.aoColumns,function(a,d){d.bVisible&&"none"!==h(d.nTh).css("display")&&b++});return b}function ma(a,b){var c=[];h.map(a.aoColumns,function(a,e){a[b]&&c.push(e)});return c}function Ga(a){var b=a.aoColumns,c=a.aoData,d=n.ext.type.detect,e,f,g,j,i,h,l,q,t;e=0;for(f=b.length;e<f;e++)if(l=b[e],t=[],!l.sType&&l._sManualType)l.sType=l._sManualType;else if(!l.sType){g=0;for(j=d.length;g<
j;g++){i=0;for(h=c.length;i<h;i++){t[i]===k&&(t[i]=B(a,i,e,"type"));q=d[g](t[i],a);if(!q&&g!==d.length-1)break;if("html"===q)break}if(q){l.sType=q;break}}l.sType||(l.sType="string")}}function ib(a,b,c,d){var e,f,g,j,i,m,l=a.aoColumns;if(b)for(e=b.length-1;0<=e;e--){m=b[e];var q=m.targets!==k?m.targets:m.aTargets;h.isArray(q)||(q=[q]);f=0;for(g=q.length;f<g;f++)if("number"===typeof q[f]&&0<=q[f]){for(;l.length<=q[f];)Ea(a);d(q[f],m)}else if("number"===typeof q[f]&&0>q[f])d(l.length+q[f],m);else if("string"===
typeof q[f]){j=0;for(i=l.length;j<i;j++)("_all"==q[f]||h(l[j].nTh).hasClass(q[f]))&&d(j,m)}}if(c){e=0;for(a=c.length;e<a;e++)d(e,c[e])}}function O(a,b,c,d){var e=a.aoData.length,f=h.extend(!0,{},n.models.oRow,{src:c?"dom":"data",idx:e});f._aData=b;a.aoData.push(f);for(var g=a.aoColumns,j=0,i=g.length;j<i;j++)g[j].sType=null;a.aiDisplayMaster.push(e);b=a.rowIdFn(b);b!==k&&(a.aIds[b]=f);(c||!a.oFeatures.bDeferRender)&&Ha(a,e,c,d);return e}function na(a,b){var c;b instanceof h||(b=h(b));return b.map(function(b,
e){c=Ia(a,e);return O(a,c.data,e,c.cells)})}function B(a,b,c,d){var e=a.iDraw,f=a.aoColumns[c],g=a.aoData[b]._aData,j=f.sDefaultContent,i=f.fnGetData(g,d,{settings:a,row:b,col:c});if(i===k)return a.iDrawError!=e&&null===j&&(K(a,0,"Requested unknown parameter "+("function"==typeof f.mData?"{function}":"'"+f.mData+"'")+" for row "+b+", column "+c,4),a.iDrawError=e),j;if((i===g||null===i)&&null!==j&&d!==k)i=j;else if("function"===typeof i)return i.call(g);return null===i&&"display"==d?"":i}function jb(a,
b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d,{settings:a,row:b,col:c})}function Ja(a){return h.map(a.match(/(\\.|[^\.])+/g)||[""],function(a){return a.replace(/\\\./g,".")})}function S(a){if(h.isPlainObject(a)){var b={};h.each(a,function(a,c){c&&(b[a]=S(c))});return function(a,c,f,g){var j=b[c]||b._;return j!==k?j(a,c,f,g):a}}if(null===a)return function(a){return a};if("function"===typeof a)return function(b,c,f,g){return a(b,c,f,g)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||
-1!==a.indexOf("("))){var c=function(a,b,f){var g,j;if(""!==f){j=Ja(f);for(var i=0,m=j.length;i<m;i++){f=j[i].match(ca);g=j[i].match(W);if(f){j[i]=j[i].replace(ca,"");""!==j[i]&&(a=a[j[i]]);g=[];j.splice(0,i+1);j=j.join(".");if(h.isArray(a)){i=0;for(m=a.length;i<m;i++)g.push(c(a[i],b,j))}a=f[0].substring(1,f[0].length-1);a=""===a?g:g.join(a);break}else if(g){j[i]=j[i].replace(W,"");a=a[j[i]]();continue}if(null===a||a[j[i]]===k)return k;a=a[j[i]]}}return a};return function(b,e){return c(b,e,a)}}return function(b){return b[a]}}
function N(a){if(h.isPlainObject(a))return N(a._);if(null===a)return function(){};if("function"===typeof a)return function(b,d,e){a(b,"set",d,e)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var b=function(a,d,e){var e=Ja(e),f;f=e[e.length-1];for(var g,j,i=0,m=e.length-1;i<m;i++){g=e[i].match(ca);j=e[i].match(W);if(g){e[i]=e[i].replace(ca,"");a[e[i]]=[];f=e.slice();f.splice(0,i+1);g=f.join(".");if(h.isArray(d)){j=0;for(m=d.length;j<m;j++)f={},b(f,d[j],g),
a[e[i]].push(f)}else a[e[i]]=d;return}j&&(e[i]=e[i].replace(W,""),a=a[e[i]](d));if(null===a[e[i]]||a[e[i]]===k)a[e[i]]={};a=a[e[i]]}if(f.match(W))a[f.replace(W,"")](d);else a[f.replace(ca,"")]=d};return function(c,d){return b(c,d,a)}}return function(b,d){b[a]=d}}function Ka(a){return D(a.aoData,"_aData")}function oa(a){a.aoData.length=0;a.aiDisplayMaster.length=0;a.aiDisplay.length=0;a.aIds={}}function pa(a,b,c){for(var d=-1,e=0,f=a.length;e<f;e++)a[e]==b?d=e:a[e]>b&&a[e]--; -1!=d&&c===k&&a.splice(d,
1)}function da(a,b,c,d){var e=a.aoData[b],f,g=function(c,d){for(;c.childNodes.length;)c.removeChild(c.firstChild);c.innerHTML=B(a,b,d,"display")};if("dom"===c||(!c||"auto"===c)&&"dom"===e.src)e._aData=Ia(a,e,d,d===k?k:e._aData).data;else{var j=e.anCells;if(j)if(d!==k)g(j[d],d);else{c=0;for(f=j.length;c<f;c++)g(j[c],c)}}e._aSortData=null;e._aFilterData=null;g=a.aoColumns;if(d!==k)g[d].sType=null;else{c=0;for(f=g.length;c<f;c++)g[c].sType=null;La(a,e)}}function Ia(a,b,c,d){var e=[],f=b.firstChild,g,
j,i=0,m,l=a.aoColumns,q=a._rowReadObject,d=d!==k?d:q?{}:[],t=function(a,b){if("string"===typeof a){var c=a.indexOf("@");-1!==c&&(c=a.substring(c+1),N(a)(d,b.getAttribute(c)))}},G=function(a){if(c===k||c===i)j=l[i],m=h.trim(a.innerHTML),j&&j._bAttrSrc?(N(j.mData._)(d,m),t(j.mData.sort,a),t(j.mData.type,a),t(j.mData.filter,a)):q?(j._setter||(j._setter=N(j.mData)),j._setter(d,m)):d[i]=m;i++};if(f)for(;f;){g=f.nodeName.toUpperCase();if("TD"==g||"TH"==g)G(f),e.push(f);f=f.nextSibling}else{e=b.anCells;
f=0;for(g=e.length;f<g;f++)G(e[f])}if(b=b.firstChild?b:b.nTr)(b=b.getAttribute("id"))&&N(a.rowId)(d,b);return{data:d,cells:e}}function Ha(a,b,c,d){var e=a.aoData[b],f=e._aData,g=[],j,i,m,l,q;if(null===e.nTr){j=c||H.createElement("tr");e.nTr=j;e.anCells=g;j._DT_RowIndex=b;La(a,e);l=0;for(q=a.aoColumns.length;l<q;l++){m=a.aoColumns[l];i=c?d[l]:H.createElement(m.sCellType);i._DT_CellIndex={row:b,column:l};g.push(i);if((!c||m.mRender||m.mData!==l)&&(!h.isPlainObject(m.mData)||m.mData._!==l+".display"))i.innerHTML=
B(a,b,l,"display");m.sClass&&(i.className+=" "+m.sClass);m.bVisible&&!c?j.appendChild(i):!m.bVisible&&c&&i.parentNode.removeChild(i);m.fnCreatedCell&&m.fnCreatedCell.call(a.oInstance,i,B(a,b,l),f,b,l)}r(a,"aoRowCreatedCallback",null,[j,f,b,g])}e.nTr.setAttribute("role","row")}function La(a,b){var c=b.nTr,d=b._aData;if(c){var e=a.rowIdFn(d);e&&(c.id=e);d.DT_RowClass&&(e=d.DT_RowClass.split(" "),b.__rowc=b.__rowc?qa(b.__rowc.concat(e)):e,h(c).removeClass(b.__rowc.join(" ")).addClass(d.DT_RowClass));
d.DT_RowAttr&&h(c).attr(d.DT_RowAttr);d.DT_RowData&&h(c).data(d.DT_RowData)}}function kb(a){var b,c,d,e,f,g=a.nTHead,j=a.nTFoot,i=0===h("th, td",g).length,m=a.oClasses,l=a.aoColumns;i&&(e=h("<tr/>").appendTo(g));b=0;for(c=l.length;b<c;b++)f=l[b],d=h(f.nTh).addClass(f.sClass),i&&d.appendTo(e),a.oFeatures.bSort&&(d.addClass(f.sSortingClass),!1!==f.bSortable&&(d.attr("tabindex",a.iTabIndex).attr("aria-controls",a.sTableId),Ma(a,f.nTh,b))),f.sTitle!=d[0].innerHTML&&d.html(f.sTitle),Na(a,"header")(a,d,
f,m);i&&ea(a.aoHeader,g);h(g).find(">tr").attr("role","row");h(g).find(">tr>th, >tr>td").addClass(m.sHeaderTH);h(j).find(">tr>th, >tr>td").addClass(m.sFooterTH);if(null!==j){a=a.aoFooter[0];b=0;for(c=a.length;b<c;b++)f=l[b],f.nTf=a[b].cell,f.sClass&&h(f.nTf).addClass(f.sClass)}}function fa(a,b,c){var d,e,f,g=[],j=[],i=a.aoColumns.length,m;if(b){c===k&&(c=!1);d=0;for(e=b.length;d<e;d++){g[d]=b[d].slice();g[d].nTr=b[d].nTr;for(f=i-1;0<=f;f--)!a.aoColumns[f].bVisible&&!c&&g[d].splice(f,1);j.push([])}d=
0;for(e=g.length;d<e;d++){if(a=g[d].nTr)for(;f=a.firstChild;)a.removeChild(f);f=0;for(b=g[d].length;f<b;f++)if(m=i=1,j[d][f]===k){a.appendChild(g[d][f].cell);for(j[d][f]=1;g[d+i]!==k&&g[d][f].cell==g[d+i][f].cell;)j[d+i][f]=1,i++;for(;g[d][f+m]!==k&&g[d][f].cell==g[d][f+m].cell;){for(c=0;c<i;c++)j[d+c][f+m]=1;m++}h(g[d][f].cell).attr("rowspan",i).attr("colspan",m)}}}}function P(a){var b=r(a,"aoPreDrawCallback","preDraw",[a]);if(-1!==h.inArray(!1,b))C(a,!1);else{var b=[],c=0,d=a.asStripeClasses,e=
d.length,f=a.oLanguage,g=a.iInitDisplayStart,j="ssp"==y(a),i=a.aiDisplay;a.bDrawing=!0;g!==k&&-1!==g&&(a._iDisplayStart=j?g:g>=a.fnRecordsDisplay()?0:g,a.iInitDisplayStart=-1);var g=a._iDisplayStart,m=a.fnDisplayEnd();if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++,C(a,!1);else if(j){if(!a.bDestroying&&!lb(a))return}else a.iDraw++;if(0!==i.length){f=j?a.aoData.length:m;for(j=j?0:g;j<f;j++){var l=i[j],q=a.aoData[l];null===q.nTr&&Ha(a,l);var t=q.nTr;if(0!==e){var G=d[c%e];q._sRowStripe!=G&&(h(t).removeClass(q._sRowStripe).addClass(G),
q._sRowStripe=G)}r(a,"aoRowCallback",null,[t,q._aData,c,j,l]);b.push(t);c++}}else c=f.sZeroRecords,1==a.iDraw&&"ajax"==y(a)?c=f.sLoadingRecords:f.sEmptyTable&&0===a.fnRecordsTotal()&&(c=f.sEmptyTable),b[0]=h("<tr/>",{"class":e?d[0]:""}).append(h("<td />",{valign:"top",colSpan:V(a),"class":a.oClasses.sRowEmpty}).html(c))[0];r(a,"aoHeaderCallback","header",[h(a.nTHead).children("tr")[0],Ka(a),g,m,i]);r(a,"aoFooterCallback","footer",[h(a.nTFoot).children("tr")[0],Ka(a),g,m,i]);d=h(a.nTBody);d.children().detach();
d.append(h(b));r(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1}}function T(a,b){var c=a.oFeatures,d=c.bFilter;c.bSort&&mb(a);d?ga(a,a.oPreviousSearch):a.aiDisplay=a.aiDisplayMaster.slice();!0!==b&&(a._iDisplayStart=0);a._drawHold=b;P(a);a._drawHold=!1}function nb(a){var b=a.oClasses,c=h(a.nTable),c=h("<div/>").insertBefore(c),d=a.oFeatures,e=h("<div/>",{id:a.sTableId+"_wrapper","class":b.sWrapper+(a.nTFoot?"":" "+b.sNoFooter)});a.nHolding=c[0];a.nTableWrapper=e[0];a.nTableReinsertBefore=
a.nTable.nextSibling;for(var f=a.sDom.split(""),g,j,i,m,l,q,k=0;k<f.length;k++){g=null;j=f[k];if("<"==j){i=h("<div/>")[0];m=f[k+1];if("'"==m||'"'==m){l="";for(q=2;f[k+q]!=m;)l+=f[k+q],q++;"H"==l?l=b.sJUIHeader:"F"==l&&(l=b.sJUIFooter);-1!=l.indexOf(".")?(m=l.split("."),i.id=m[0].substr(1,m[0].length-1),i.className=m[1]):"#"==l.charAt(0)?i.id=l.substr(1,l.length-1):i.className=l;k+=q}e.append(i);e=h(i)}else if(">"==j)e=e.parent();else if("l"==j&&d.bPaginate&&d.bLengthChange)g=ob(a);else if("f"==j&&
d.bFilter)g=pb(a);else if("r"==j&&d.bProcessing)g=qb(a);else if("t"==j)g=rb(a);else if("i"==j&&d.bInfo)g=sb(a);else if("p"==j&&d.bPaginate)g=tb(a);else if(0!==n.ext.feature.length){i=n.ext.feature;q=0;for(m=i.length;q<m;q++)if(j==i[q].cFeature){g=i[q].fnInit(a);break}}g&&(i=a.aanFeatures,i[j]||(i[j]=[]),i[j].push(g),e.append(g))}c.replaceWith(e);a.nHolding=null}function ea(a,b){var c=h(b).children("tr"),d,e,f,g,j,i,m,l,q,k;a.splice(0,a.length);f=0;for(i=c.length;f<i;f++)a.push([]);f=0;for(i=c.length;f<
i;f++){d=c[f];for(e=d.firstChild;e;){if("TD"==e.nodeName.toUpperCase()||"TH"==e.nodeName.toUpperCase()){l=1*e.getAttribute("colspan");q=1*e.getAttribute("rowspan");l=!l||0===l||1===l?1:l;q=!q||0===q||1===q?1:q;g=0;for(j=a[f];j[g];)g++;m=g;k=1===l?!0:!1;for(j=0;j<l;j++)for(g=0;g<q;g++)a[f+g][m+j]={cell:e,unique:k},a[f+g].nTr=d}e=e.nextSibling}}}function ra(a,b,c){var d=[];c||(c=a.aoHeader,b&&(c=[],ea(c,b)));for(var b=0,e=c.length;b<e;b++)for(var f=0,g=c[b].length;f<g;f++)if(c[b][f].unique&&(!d[f]||
!a.bSortCellsTop))d[f]=c[b][f].cell;return d}function sa(a,b,c){r(a,"aoServerParams","serverParams",[b]);if(b&&h.isArray(b)){var d={},e=/(.*?)\[\]$/;h.each(b,function(a,b){var c=b.name.match(e);c?(c=c[0],d[c]||(d[c]=[]),d[c].push(b.value)):d[b.name]=b.value});b=d}var f,g=a.ajax,j=a.oInstance,i=function(b){r(a,null,"xhr",[a,b,a.jqXHR]);c(b)};if(h.isPlainObject(g)&&g.data){f=g.data;var m="function"===typeof f?f(b,a):f,b="function"===typeof f&&m?m:h.extend(!0,b,m);delete g.data}m={data:b,success:function(b){var c=
b.error||b.sError;c&&K(a,0,c);a.json=b;i(b)},dataType:"json",cache:!1,type:a.sServerMethod,error:function(b,c){var d=r(a,null,"xhr",[a,null,a.jqXHR]);-1===h.inArray(!0,d)&&("parsererror"==c?K(a,0,"Invalid JSON response",1):4===b.readyState&&K(a,0,"Ajax error",7));C(a,!1)}};a.oAjaxData=b;r(a,null,"preXhr",[a,b]);a.fnServerData?a.fnServerData.call(j,a.sAjaxSource,h.map(b,function(a,b){return{name:b,value:a}}),i,a):a.sAjaxSource||"string"===typeof g?a.jqXHR=h.ajax(h.extend(m,{url:g||a.sAjaxSource})):
"function"===typeof g?a.jqXHR=g.call(j,b,i,a):(a.jqXHR=h.ajax(h.extend(m,g)),g.data=f)}function lb(a){return a.bAjaxDataGet?(a.iDraw++,C(a,!0),sa(a,ub(a),function(b){vb(a,b)}),!1):!0}function ub(a){var b=a.aoColumns,c=b.length,d=a.oFeatures,e=a.oPreviousSearch,f=a.aoPreSearchCols,g,j=[],i,m,l,k=X(a);g=a._iDisplayStart;i=!1!==d.bPaginate?a._iDisplayLength:-1;var t=function(a,b){j.push({name:a,value:b})};t("sEcho",a.iDraw);t("iColumns",c);t("sColumns",D(b,"sName").join(","));t("iDisplayStart",g);t("iDisplayLength",
i);var G={draw:a.iDraw,columns:[],order:[],start:g,length:i,search:{value:e.sSearch,regex:e.bRegex}};for(g=0;g<c;g++)m=b[g],l=f[g],i="function"==typeof m.mData?"function":m.mData,G.columns.push({data:i,name:m.sName,searchable:m.bSearchable,orderable:m.bSortable,search:{value:l.sSearch,regex:l.bRegex}}),t("mDataProp_"+g,i),d.bFilter&&(t("sSearch_"+g,l.sSearch),t("bRegex_"+g,l.bRegex),t("bSearchable_"+g,m.bSearchable)),d.bSort&&t("bSortable_"+g,m.bSortable);d.bFilter&&(t("sSearch",e.sSearch),t("bRegex",
e.bRegex));d.bSort&&(h.each(k,function(a,b){G.order.push({column:b.col,dir:b.dir});t("iSortCol_"+a,b.col);t("sSortDir_"+a,b.dir)}),t("iSortingCols",k.length));b=n.ext.legacy.ajax;return null===b?a.sAjaxSource?j:G:b?j:G}function vb(a,b){var c=ta(a,b),d=b.sEcho!==k?b.sEcho:b.draw,e=b.iTotalRecords!==k?b.iTotalRecords:b.recordsTotal,f=b.iTotalDisplayRecords!==k?b.iTotalDisplayRecords:b.recordsFiltered;if(d){if(1*d<a.iDraw)return;a.iDraw=1*d}oa(a);a._iRecordsTotal=parseInt(e,10);a._iRecordsDisplay=parseInt(f,
10);d=0;for(e=c.length;d<e;d++)O(a,c[d]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;P(a);a._bInitComplete||ua(a,b);a.bAjaxDataGet=!0;C(a,!1)}function ta(a,b){var c=h.isPlainObject(a.ajax)&&a.ajax.dataSrc!==k?a.ajax.dataSrc:a.sAjaxDataProp;return"data"===c?b.aaData||b[c]:""!==c?S(c)(b):b}function pb(a){var b=a.oClasses,c=a.sTableId,d=a.oLanguage,e=a.oPreviousSearch,f=a.aanFeatures,g='<input type="search" class="'+b.sFilterInput+'"/>',j=d.sSearch,j=j.match(/_INPUT_/)?j.replace("_INPUT_",
g):j+g,b=h("<div/>",{id:!f.f?c+"_filter":null,"class":b.sFilter}).append(h("<label/>").append(j)),f=function(){var b=!this.value?"":this.value;b!=e.sSearch&&(ga(a,{sSearch:b,bRegex:e.bRegex,bSmart:e.bSmart,bCaseInsensitive:e.bCaseInsensitive}),a._iDisplayStart=0,P(a))},g=null!==a.searchDelay?a.searchDelay:"ssp"===y(a)?400:0,i=h("input",b).val(e.sSearch).attr("placeholder",d.sSearchPlaceholder).on("keyup.DT search.DT input.DT paste.DT cut.DT",g?Oa(f,g):f).on("keypress.DT",function(a){if(13==a.keyCode)return!1}).attr("aria-controls",
c);h(a.nTable).on("search.dt.DT",function(b,c){if(a===c)try{i[0]!==H.activeElement&&i.val(e.sSearch)}catch(d){}});return b[0]}function ga(a,b,c){var d=a.oPreviousSearch,e=a.aoPreSearchCols,f=function(a){d.sSearch=a.sSearch;d.bRegex=a.bRegex;d.bSmart=a.bSmart;d.bCaseInsensitive=a.bCaseInsensitive};Ga(a);if("ssp"!=y(a)){wb(a,b.sSearch,c,b.bEscapeRegex!==k?!b.bEscapeRegex:b.bRegex,b.bSmart,b.bCaseInsensitive);f(b);for(b=0;b<e.length;b++)xb(a,e[b].sSearch,b,e[b].bEscapeRegex!==k?!e[b].bEscapeRegex:e[b].bRegex,
e[b].bSmart,e[b].bCaseInsensitive);yb(a)}else f(b);a.bFiltered=!0;r(a,null,"search",[a])}function yb(a){for(var b=n.ext.search,c=a.aiDisplay,d,e,f=0,g=b.length;f<g;f++){for(var j=[],i=0,m=c.length;i<m;i++)e=c[i],d=a.aoData[e],b[f](a,d._aFilterData,e,d._aData,i)&&j.push(e);c.length=0;h.merge(c,j)}}function xb(a,b,c,d,e,f){if(""!==b){for(var g=[],j=a.aiDisplay,d=Pa(b,d,e,f),e=0;e<j.length;e++)b=a.aoData[j[e]]._aFilterData[c],d.test(b)&&g.push(j[e]);a.aiDisplay=g}}function wb(a,b,c,d,e,f){var d=Pa(b,
d,e,f),f=a.oPreviousSearch.sSearch,g=a.aiDisplayMaster,j,e=[];0!==n.ext.search.length&&(c=!0);j=zb(a);if(0>=b.length)a.aiDisplay=g.slice();else{if(j||c||f.length>b.length||0!==b.indexOf(f)||a.bSorted)a.aiDisplay=g.slice();b=a.aiDisplay;for(c=0;c<b.length;c++)d.test(a.aoData[b[c]]._sFilterRow)&&e.push(b[c]);a.aiDisplay=e}}function Pa(a,b,c,d){a=b?a:Qa(a);c&&(a="^(?=.*?"+h.map(a.match(/"[^"]+"|[^ ]+/g)||[""],function(a){if('"'===a.charAt(0))var b=a.match(/^"(.*)"$/),a=b?b[1]:a;return a.replace('"',
"")}).join(")(?=.*?")+").*$");return RegExp(a,d?"i":"")}function zb(a){var b=a.aoColumns,c,d,e,f,g,j,i,h,l=n.ext.type.search;c=!1;d=0;for(f=a.aoData.length;d<f;d++)if(h=a.aoData[d],!h._aFilterData){j=[];e=0;for(g=b.length;e<g;e++)c=b[e],c.bSearchable?(i=B(a,d,e,"filter"),l[c.sType]&&(i=l[c.sType](i)),null===i&&(i=""),"string"!==typeof i&&i.toString&&(i=i.toString())):i="",i.indexOf&&-1!==i.indexOf("&")&&(va.innerHTML=i,i=Wb?va.textContent:va.innerText),i.replace&&(i=i.replace(/[\r\n]/g,"")),j.push(i);
h._aFilterData=j;h._sFilterRow=j.join("  ");c=!0}return c}function Ab(a){return{search:a.sSearch,smart:a.bSmart,regex:a.bRegex,caseInsensitive:a.bCaseInsensitive}}function Bb(a){return{sSearch:a.search,bSmart:a.smart,bRegex:a.regex,bCaseInsensitive:a.caseInsensitive}}function sb(a){var b=a.sTableId,c=a.aanFeatures.i,d=h("<div/>",{"class":a.oClasses.sInfo,id:!c?b+"_info":null});c||(a.aoDrawCallback.push({fn:Cb,sName:"information"}),d.attr("role","status").attr("aria-live","polite"),h(a.nTable).attr("aria-describedby",
b+"_info"));return d[0]}function Cb(a){var b=a.aanFeatures.i;if(0!==b.length){var c=a.oLanguage,d=a._iDisplayStart+1,e=a.fnDisplayEnd(),f=a.fnRecordsTotal(),g=a.fnRecordsDisplay(),j=g?c.sInfo:c.sInfoEmpty;g!==f&&(j+=" "+c.sInfoFiltered);j+=c.sInfoPostFix;j=Db(a,j);c=c.fnInfoCallback;null!==c&&(j=c.call(a.oInstance,a,d,e,f,g,j));h(b).html(j)}}function Db(a,b){var c=a.fnFormatNumber,d=a._iDisplayStart+1,e=a._iDisplayLength,f=a.fnRecordsDisplay(),g=-1===e;return b.replace(/_START_/g,c.call(a,d)).replace(/_END_/g,
c.call(a,a.fnDisplayEnd())).replace(/_MAX_/g,c.call(a,a.fnRecordsTotal())).replace(/_TOTAL_/g,c.call(a,f)).replace(/_PAGE_/g,c.call(a,g?1:Math.ceil(d/e))).replace(/_PAGES_/g,c.call(a,g?1:Math.ceil(f/e)))}function ha(a){var b,c,d=a.iInitDisplayStart,e=a.aoColumns,f;c=a.oFeatures;var g=a.bDeferLoading;if(a.bInitialised){nb(a);kb(a);fa(a,a.aoHeader);fa(a,a.aoFooter);C(a,!0);c.bAutoWidth&&Fa(a);b=0;for(c=e.length;b<c;b++)f=e[b],f.sWidth&&(f.nTh.style.width=v(f.sWidth));r(a,null,"preInit",[a]);T(a);e=
y(a);if("ssp"!=e||g)"ajax"==e?sa(a,[],function(c){var f=ta(a,c);for(b=0;b<f.length;b++)O(a,f[b]);a.iInitDisplayStart=d;T(a);C(a,!1);ua(a,c)},a):(C(a,!1),ua(a))}else setTimeout(function(){ha(a)},200)}function ua(a,b){a._bInitComplete=!0;(b||a.oInit.aaData)&&$(a);r(a,null,"plugin-init",[a,b]);r(a,"aoInitComplete","init",[a,b])}function Ra(a,b){var c=parseInt(b,10);a._iDisplayLength=c;Sa(a);r(a,null,"length",[a,c])}function ob(a){for(var b=a.oClasses,c=a.sTableId,d=a.aLengthMenu,e=h.isArray(d[0]),f=
e?d[0]:d,d=e?d[1]:d,e=h("<select/>",{name:c+"_length","aria-controls":c,"class":b.sLengthSelect}),g=0,j=f.length;g<j;g++)e[0][g]=new Option("number"===typeof d[g]?a.fnFormatNumber(d[g]):d[g],f[g]);var i=h("<div><label/></div>").addClass(b.sLength);a.aanFeatures.l||(i[0].id=c+"_length");i.children().append(a.oLanguage.sLengthMenu.replace("_MENU_",e[0].outerHTML));h("select",i).val(a._iDisplayLength).on("change.DT",function(){Ra(a,h(this).val());P(a)});h(a.nTable).on("length.dt.DT",function(b,c,d){a===
c&&h("select",i).val(d)});return i[0]}function tb(a){var b=a.sPaginationType,c=n.ext.pager[b],d="function"===typeof c,e=function(a){P(a)},b=h("<div/>").addClass(a.oClasses.sPaging+b)[0],f=a.aanFeatures;d||c.fnInit(a,b,e);f.p||(b.id=a.sTableId+"_paginate",a.aoDrawCallback.push({fn:function(a){if(d){var b=a._iDisplayStart,i=a._iDisplayLength,h=a.fnRecordsDisplay(),l=-1===i,b=l?0:Math.ceil(b/i),i=l?1:Math.ceil(h/i),h=c(b,i),k,l=0;for(k=f.p.length;l<k;l++)Na(a,"pageButton")(a,f.p[l],l,h,b,i)}else c.fnUpdate(a,
e)},sName:"pagination"}));return b}function Ta(a,b,c){var d=a._iDisplayStart,e=a._iDisplayLength,f=a.fnRecordsDisplay();0===f||-1===e?d=0:"number"===typeof b?(d=b*e,d>f&&(d=0)):"first"==b?d=0:"previous"==b?(d=0<=e?d-e:0,0>d&&(d=0)):"next"==b?d+e<f&&(d+=e):"last"==b?d=Math.floor((f-1)/e)*e:K(a,0,"Unknown paging action: "+b,5);b=a._iDisplayStart!==d;a._iDisplayStart=d;b&&(r(a,null,"page",[a]),c&&P(a));return b}function qb(a){return h("<div/>",{id:!a.aanFeatures.r?a.sTableId+"_processing":null,"class":a.oClasses.sProcessing}).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]}
function C(a,b){a.oFeatures.bProcessing&&h(a.aanFeatures.r).css("display",b?"block":"none");r(a,null,"processing",[a,b])}function rb(a){var b=h(a.nTable);b.attr("role","grid");var c=a.oScroll;if(""===c.sX&&""===c.sY)return a.nTable;var d=c.sX,e=c.sY,f=a.oClasses,g=b.children("caption"),j=g.length?g[0]._captionSide:null,i=h(b[0].cloneNode(!1)),m=h(b[0].cloneNode(!1)),l=b.children("tfoot");l.length||(l=null);i=h("<div/>",{"class":f.sScrollWrapper}).append(h("<div/>",{"class":f.sScrollHead}).css({overflow:"hidden",
position:"relative",border:0,width:d?!d?null:v(d):"100%"}).append(h("<div/>",{"class":f.sScrollHeadInner}).css({"box-sizing":"content-box",width:c.sXInner||"100%"}).append(i.removeAttr("id").css("margin-left",0).append("top"===j?g:null).append(b.children("thead"))))).append(h("<div/>",{"class":f.sScrollBody}).css({position:"relative",overflow:"auto",width:!d?null:v(d)}).append(b));l&&i.append(h("<div/>",{"class":f.sScrollFoot}).css({overflow:"hidden",border:0,width:d?!d?null:v(d):"100%"}).append(h("<div/>",
{"class":f.sScrollFootInner}).append(m.removeAttr("id").css("margin-left",0).append("bottom"===j?g:null).append(b.children("tfoot")))));var b=i.children(),k=b[0],f=b[1],t=l?b[2]:null;if(d)h(f).on("scroll.DT",function(){var a=this.scrollLeft;k.scrollLeft=a;l&&(t.scrollLeft=a)});h(f).css(e&&c.bCollapse?"max-height":"height",e);a.nScrollHead=k;a.nScrollBody=f;a.nScrollFoot=t;a.aoDrawCallback.push({fn:la,sName:"scrolling"});return i[0]}function la(a){var b=a.oScroll,c=b.sX,d=b.sXInner,e=b.sY,b=b.iBarWidth,
f=h(a.nScrollHead),g=f[0].style,j=f.children("div"),i=j[0].style,m=j.children("table"),j=a.nScrollBody,l=h(j),q=j.style,t=h(a.nScrollFoot).children("div"),n=t.children("table"),o=h(a.nTHead),p=h(a.nTable),s=p[0],r=s.style,u=a.nTFoot?h(a.nTFoot):null,x=a.oBrowser,U=x.bScrollOversize,Xb=D(a.aoColumns,"nTh"),Q,L,R,w,Ua=[],y=[],z=[],A=[],B,C=function(a){a=a.style;a.paddingTop="0";a.paddingBottom="0";a.borderTopWidth="0";a.borderBottomWidth="0";a.height=0};L=j.scrollHeight>j.clientHeight;if(a.scrollBarVis!==
L&&a.scrollBarVis!==k)a.scrollBarVis=L,$(a);else{a.scrollBarVis=L;p.children("thead, tfoot").remove();u&&(R=u.clone().prependTo(p),Q=u.find("tr"),R=R.find("tr"));w=o.clone().prependTo(p);o=o.find("tr");L=w.find("tr");w.find("th, td").removeAttr("tabindex");c||(q.width="100%",f[0].style.width="100%");h.each(ra(a,w),function(b,c){B=aa(a,b);c.style.width=a.aoColumns[B].sWidth});u&&I(function(a){a.style.width=""},R);f=p.outerWidth();if(""===c){r.width="100%";if(U&&(p.find("tbody").height()>j.offsetHeight||
"scroll"==l.css("overflow-y")))r.width=v(p.outerWidth()-b);f=p.outerWidth()}else""!==d&&(r.width=v(d),f=p.outerWidth());I(C,L);I(function(a){z.push(a.innerHTML);Ua.push(v(h(a).css("width")))},L);I(function(a,b){if(h.inArray(a,Xb)!==-1)a.style.width=Ua[b]},o);h(L).height(0);u&&(I(C,R),I(function(a){A.push(a.innerHTML);y.push(v(h(a).css("width")))},R),I(function(a,b){a.style.width=y[b]},Q),h(R).height(0));I(function(a,b){a.innerHTML='<div class="dataTables_sizing">'+z[b]+"</div>";a.childNodes[0].style.height=
"0";a.childNodes[0].style.overflow="hidden";a.style.width=Ua[b]},L);u&&I(function(a,b){a.innerHTML='<div class="dataTables_sizing">'+A[b]+"</div>";a.childNodes[0].style.height="0";a.childNodes[0].style.overflow="hidden";a.style.width=y[b]},R);if(p.outerWidth()<f){Q=j.scrollHeight>j.offsetHeight||"scroll"==l.css("overflow-y")?f+b:f;if(U&&(j.scrollHeight>j.offsetHeight||"scroll"==l.css("overflow-y")))r.width=v(Q-b);(""===c||""!==d)&&K(a,1,"Possible column misalignment",6)}else Q="100%";q.width=v(Q);
g.width=v(Q);u&&(a.nScrollFoot.style.width=v(Q));!e&&U&&(q.height=v(s.offsetHeight+b));c=p.outerWidth();m[0].style.width=v(c);i.width=v(c);d=p.height()>j.clientHeight||"scroll"==l.css("overflow-y");e="padding"+(x.bScrollbarLeft?"Left":"Right");i[e]=d?b+"px":"0px";u&&(n[0].style.width=v(c),t[0].style.width=v(c),t[0].style[e]=d?b+"px":"0px");p.children("colgroup").insertBefore(p.children("thead"));l.scroll();if((a.bSorted||a.bFiltered)&&!a._drawHold)j.scrollTop=0}}function I(a,b,c){for(var d=0,e=0,
f=b.length,g,j;e<f;){g=b[e].firstChild;for(j=c?c[e].firstChild:null;g;)1===g.nodeType&&(c?a(g,j,d):a(g,d),d++),g=g.nextSibling,j=c?j.nextSibling:null;e++}}function Fa(a){var b=a.nTable,c=a.aoColumns,d=a.oScroll,e=d.sY,f=d.sX,g=d.sXInner,j=c.length,i=ma(a,"bVisible"),m=h("th",a.nTHead),l=b.getAttribute("width"),k=b.parentNode,t=!1,n,o,p=a.oBrowser,d=p.bScrollOversize;(n=b.style.width)&&-1!==n.indexOf("%")&&(l=n);for(n=0;n<i.length;n++)o=c[i[n]],null!==o.sWidth&&(o.sWidth=Eb(o.sWidthOrig,k),t=!0);if(d||
!t&&!f&&!e&&j==V(a)&&j==m.length)for(n=0;n<j;n++)i=aa(a,n),null!==i&&(c[i].sWidth=v(m.eq(n).width()));else{j=h(b).clone().css("visibility","hidden").removeAttr("id");j.find("tbody tr").remove();var s=h("<tr/>").appendTo(j.find("tbody"));j.find("thead, tfoot").remove();j.append(h(a.nTHead).clone()).append(h(a.nTFoot).clone());j.find("tfoot th, tfoot td").css("width","");m=ra(a,j.find("thead")[0]);for(n=0;n<i.length;n++)o=c[i[n]],m[n].style.width=null!==o.sWidthOrig&&""!==o.sWidthOrig?v(o.sWidthOrig):
"",o.sWidthOrig&&f&&h(m[n]).append(h("<div/>").css({width:o.sWidthOrig,margin:0,padding:0,border:0,height:1}));if(a.aoData.length)for(n=0;n<i.length;n++)t=i[n],o=c[t],h(Fb(a,t)).clone(!1).append(o.sContentPadding).appendTo(s);h("[name]",j).removeAttr("name");o=h("<div/>").css(f||e?{position:"absolute",top:0,left:0,height:1,right:0,overflow:"hidden"}:{}).append(j).appendTo(k);f&&g?j.width(g):f?(j.css("width","auto"),j.removeAttr("width"),j.width()<k.clientWidth&&l&&j.width(k.clientWidth)):e?j.width(k.clientWidth):
l&&j.width(l);for(n=e=0;n<i.length;n++)k=h(m[n]),g=k.outerWidth()-k.width(),k=p.bBounding?Math.ceil(m[n].getBoundingClientRect().width):k.outerWidth(),e+=k,c[i[n]].sWidth=v(k-g);b.style.width=v(e);o.remove()}l&&(b.style.width=v(l));if((l||f)&&!a._reszEvt)b=function(){h(E).on("resize.DT-"+a.sInstance,Oa(function(){$(a)}))},d?setTimeout(b,1E3):b(),a._reszEvt=!0}function Eb(a,b){if(!a)return 0;var c=h("<div/>").css("width",v(a)).appendTo(b||H.body),d=c[0].offsetWidth;c.remove();return d}function Fb(a,
b){var c=Gb(a,b);if(0>c)return null;var d=a.aoData[c];return!d.nTr?h("<td/>").html(B(a,c,b,"display"))[0]:d.anCells[b]}function Gb(a,b){for(var c,d=-1,e=-1,f=0,g=a.aoData.length;f<g;f++)c=B(a,f,b,"display")+"",c=c.replace(Yb,""),c=c.replace(/&nbsp;/g," "),c.length>d&&(d=c.length,e=f);return e}function v(a){return null===a?"0px":"number"==typeof a?0>a?"0px":a+"px":a.match(/\d$/)?a+"px":a}function X(a){var b,c,d=[],e=a.aoColumns,f,g,j,i;b=a.aaSortingFixed;c=h.isPlainObject(b);var m=[];f=function(a){a.length&&
!h.isArray(a[0])?m.push(a):h.merge(m,a)};h.isArray(b)&&f(b);c&&b.pre&&f(b.pre);f(a.aaSorting);c&&b.post&&f(b.post);for(a=0;a<m.length;a++){i=m[a][0];f=e[i].aDataSort;b=0;for(c=f.length;b<c;b++)g=f[b],j=e[g].sType||"string",m[a]._idx===k&&(m[a]._idx=h.inArray(m[a][1],e[g].asSorting)),d.push({src:i,col:g,dir:m[a][1],index:m[a]._idx,type:j,formatter:n.ext.type.order[j+"-pre"]})}return d}function mb(a){var b,c,d=[],e=n.ext.type.order,f=a.aoData,g=0,j,i=a.aiDisplayMaster,h;Ga(a);h=X(a);b=0;for(c=h.length;b<
c;b++)j=h[b],j.formatter&&g++,Hb(a,j.col);if("ssp"!=y(a)&&0!==h.length){b=0;for(c=i.length;b<c;b++)d[i[b]]=b;g===h.length?i.sort(function(a,b){var c,e,g,j,i=h.length,k=f[a]._aSortData,n=f[b]._aSortData;for(g=0;g<i;g++)if(j=h[g],c=k[j.col],e=n[j.col],c=c<e?-1:c>e?1:0,0!==c)return"asc"===j.dir?c:-c;c=d[a];e=d[b];return c<e?-1:c>e?1:0}):i.sort(function(a,b){var c,g,j,i,k=h.length,n=f[a]._aSortData,o=f[b]._aSortData;for(j=0;j<k;j++)if(i=h[j],c=n[i.col],g=o[i.col],i=e[i.type+"-"+i.dir]||e["string-"+i.dir],
c=i(c,g),0!==c)return c;c=d[a];g=d[b];return c<g?-1:c>g?1:0})}a.bSorted=!0}function Ib(a){for(var b,c,d=a.aoColumns,e=X(a),a=a.oLanguage.oAria,f=0,g=d.length;f<g;f++){c=d[f];var j=c.asSorting;b=c.sTitle.replace(/<.*?>/g,"");var i=c.nTh;i.removeAttribute("aria-sort");c.bSortable&&(0<e.length&&e[0].col==f?(i.setAttribute("aria-sort","asc"==e[0].dir?"ascending":"descending"),c=j[e[0].index+1]||j[0]):c=j[0],b+="asc"===c?a.sSortAscending:a.sSortDescending);i.setAttribute("aria-label",b)}}function Va(a,
b,c,d){var e=a.aaSorting,f=a.aoColumns[b].asSorting,g=function(a,b){var c=a._idx;c===k&&(c=h.inArray(a[1],f));return c+1<f.length?c+1:b?null:0};"number"===typeof e[0]&&(e=a.aaSorting=[e]);c&&a.oFeatures.bSortMulti?(c=h.inArray(b,D(e,"0")),-1!==c?(b=g(e[c],!0),null===b&&1===e.length&&(b=0),null===b?e.splice(c,1):(e[c][1]=f[b],e[c]._idx=b)):(e.push([b,f[0],0]),e[e.length-1]._idx=0)):e.length&&e[0][0]==b?(b=g(e[0]),e.length=1,e[0][1]=f[b],e[0]._idx=b):(e.length=0,e.push([b,f[0]]),e[0]._idx=0);T(a);"function"==
typeof d&&d(a)}function Ma(a,b,c,d){var e=a.aoColumns[c];Wa(b,{},function(b){!1!==e.bSortable&&(a.oFeatures.bProcessing?(C(a,!0),setTimeout(function(){Va(a,c,b.shiftKey,d);"ssp"!==y(a)&&C(a,!1)},0)):Va(a,c,b.shiftKey,d))})}function wa(a){var b=a.aLastSort,c=a.oClasses.sSortColumn,d=X(a),e=a.oFeatures,f,g;if(e.bSort&&e.bSortClasses){e=0;for(f=b.length;e<f;e++)g=b[e].src,h(D(a.aoData,"anCells",g)).removeClass(c+(2>e?e+1:3));e=0;for(f=d.length;e<f;e++)g=d[e].src,h(D(a.aoData,"anCells",g)).addClass(c+
(2>e?e+1:3))}a.aLastSort=d}function Hb(a,b){var c=a.aoColumns[b],d=n.ext.order[c.sSortDataType],e;d&&(e=d.call(a.oInstance,a,b,ba(a,b)));for(var f,g=n.ext.type.order[c.sType+"-pre"],j=0,i=a.aoData.length;j<i;j++)if(c=a.aoData[j],c._aSortData||(c._aSortData=[]),!c._aSortData[b]||d)f=d?e[j]:B(a,j,b,"sort"),c._aSortData[b]=g?g(f):f}function xa(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b={time:+new Date,start:a._iDisplayStart,length:a._iDisplayLength,order:h.extend(!0,[],a.aaSorting),search:Ab(a.oPreviousSearch),
columns:h.map(a.aoColumns,function(b,d){return{visible:b.bVisible,search:Ab(a.aoPreSearchCols[d])}})};r(a,"aoStateSaveParams","stateSaveParams",[a,b]);a.oSavedState=b;a.fnStateSaveCallback.call(a.oInstance,a,b)}}function Jb(a,b,c){var d,e,f=a.aoColumns,b=function(b){if(b&&b.time){var g=r(a,"aoStateLoadParams","stateLoadParams",[a,b]);if(-1===h.inArray(!1,g)&&(g=a.iStateDuration,!(0<g&&b.time<+new Date-1E3*g)&&!(b.columns&&f.length!==b.columns.length))){a.oLoadedState=h.extend(!0,{},b);b.start!==k&&
(a._iDisplayStart=b.start,a.iInitDisplayStart=b.start);b.length!==k&&(a._iDisplayLength=b.length);b.order!==k&&(a.aaSorting=[],h.each(b.order,function(b,c){a.aaSorting.push(c[0]>=f.length?[0,c[1]]:c)}));b.search!==k&&h.extend(a.oPreviousSearch,Bb(b.search));if(b.columns){d=0;for(e=b.columns.length;d<e;d++)g=b.columns[d],g.visible!==k&&(f[d].bVisible=g.visible),g.search!==k&&h.extend(a.aoPreSearchCols[d],Bb(g.search))}r(a,"aoStateLoaded","stateLoaded",[a,b])}}c()};if(a.oFeatures.bStateSave){var g=
a.fnStateLoadCallback.call(a.oInstance,a,b);g!==k&&b(g)}else c()}function ya(a){var b=n.settings,a=h.inArray(a,D(b,"nTable"));return-1!==a?b[a]:null}function K(a,b,c,d){c="DataTables warning: "+(a?"table id="+a.sTableId+" - ":"")+c;d&&(c+=". For more information about this error, please see http://datatables.net/tn/"+d);if(b)E.console&&console.log&&console.log(c);else if(b=n.ext,b=b.sErrMode||b.errMode,a&&r(a,null,"error",[a,d,c]),"alert"==b)alert(c);else{if("throw"==b)throw Error(c);"function"==
typeof b&&b(a,d,c)}}function F(a,b,c,d){h.isArray(c)?h.each(c,function(c,d){h.isArray(d)?F(a,b,d[0],d[1]):F(a,b,d)}):(d===k&&(d=c),b[c]!==k&&(a[d]=b[c]))}function Xa(a,b,c){var d,e;for(e in b)b.hasOwnProperty(e)&&(d=b[e],h.isPlainObject(d)?(h.isPlainObject(a[e])||(a[e]={}),h.extend(!0,a[e],d)):a[e]=c&&"data"!==e&&"aaData"!==e&&h.isArray(d)?d.slice():d);return a}function Wa(a,b,c){h(a).on("click.DT",b,function(b){h(a).blur();c(b)}).on("keypress.DT",b,function(a){13===a.which&&(a.preventDefault(),c(a))}).on("selectstart.DT",
function(){return!1})}function z(a,b,c,d){c&&a[b].push({fn:c,sName:d})}function r(a,b,c,d){var e=[];b&&(e=h.map(a[b].slice().reverse(),function(b){return b.fn.apply(a.oInstance,d)}));null!==c&&(b=h.Event(c+".dt"),h(a.nTable).trigger(b,d),e.push(b.result));return e}function Sa(a){var b=a._iDisplayStart,c=a.fnDisplayEnd(),d=a._iDisplayLength;b>=c&&(b=c-d);b-=b%d;if(-1===d||0>b)b=0;a._iDisplayStart=b}function Na(a,b){var c=a.renderer,d=n.ext.renderer[b];return h.isPlainObject(c)&&c[b]?d[c[b]]||d._:"string"===
typeof c?d[c]||d._:d._}function y(a){return a.oFeatures.bServerSide?"ssp":a.ajax||a.sAjaxSource?"ajax":"dom"}function ia(a,b){var c=[],c=Kb.numbers_length,d=Math.floor(c/2);b<=c?c=Y(0,b):a<=d?(c=Y(0,c-2),c.push("ellipsis"),c.push(b-1)):(a>=b-1-d?c=Y(b-(c-2),b):(c=Y(a-d+2,a+d-1),c.push("ellipsis"),c.push(b-1)),c.splice(0,0,"ellipsis"),c.splice(0,0,0));c.DT_el="span";return c}function Da(a){h.each({num:function(b){return za(b,a)},"num-fmt":function(b){return za(b,a,Ya)},"html-num":function(b){return za(b,
a,Aa)},"html-num-fmt":function(b){return za(b,a,Aa,Ya)}},function(b,c){x.type.order[b+a+"-pre"]=c;b.match(/^html\-/)&&(x.type.search[b+a]=x.type.search.html)})}function Lb(a){return function(){var b=[ya(this[n.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return n.ext.internal[a].apply(this,b)}}var n=function(a){this.$=function(a,b){return this.api(!0).$(a,b)};this._=function(a,b){return this.api(!0).rows(a,b).data()};this.api=function(a){return a?new s(ya(this[x.iApiIndex])):new s(this)};
this.fnAddData=function(a,b){var c=this.api(!0),d=h.isArray(a)&&(h.isArray(a[0])||h.isPlainObject(a[0]))?c.rows.add(a):c.row.add(a);(b===k||b)&&c.draw();return d.flatten().toArray()};this.fnAdjustColumnSizing=function(a){var b=this.api(!0).columns.adjust(),c=b.settings()[0],d=c.oScroll;a===k||a?b.draw(!1):(""!==d.sX||""!==d.sY)&&la(c)};this.fnClearTable=function(a){var b=this.api(!0).clear();(a===k||a)&&b.draw()};this.fnClose=function(a){this.api(!0).row(a).child.hide()};this.fnDeleteRow=function(a,
b,c){var d=this.api(!0),a=d.rows(a),e=a.settings()[0],h=e.aoData[a[0][0]];a.remove();b&&b.call(this,e,h);(c===k||c)&&d.draw();return h};this.fnDestroy=function(a){this.api(!0).destroy(a)};this.fnDraw=function(a){this.api(!0).draw(a)};this.fnFilter=function(a,b,c,d,e,h){e=this.api(!0);null===b||b===k?e.search(a,c,d,h):e.column(b).search(a,c,d,h);e.draw()};this.fnGetData=function(a,b){var c=this.api(!0);if(a!==k){var d=a.nodeName?a.nodeName.toLowerCase():"";return b!==k||"td"==d||"th"==d?c.cell(a,b).data():
c.row(a).data()||null}return c.data().toArray()};this.fnGetNodes=function(a){var b=this.api(!0);return a!==k?b.row(a).node():b.rows().nodes().flatten().toArray()};this.fnGetPosition=function(a){var b=this.api(!0),c=a.nodeName.toUpperCase();return"TR"==c?b.row(a).index():"TD"==c||"TH"==c?(a=b.cell(a).index(),[a.row,a.columnVisible,a.column]):null};this.fnIsOpen=function(a){return this.api(!0).row(a).child.isShown()};this.fnOpen=function(a,b,c){return this.api(!0).row(a).child(b,c).show().child()[0]};
this.fnPageChange=function(a,b){var c=this.api(!0).page(a);(b===k||b)&&c.draw(!1)};this.fnSetColumnVis=function(a,b,c){a=this.api(!0).column(a).visible(b);(c===k||c)&&a.columns.adjust().draw()};this.fnSettings=function(){return ya(this[x.iApiIndex])};this.fnSort=function(a){this.api(!0).order(a).draw()};this.fnSortListener=function(a,b,c){this.api(!0).order.listener(a,b,c)};this.fnUpdate=function(a,b,c,d,e){var h=this.api(!0);c===k||null===c?h.row(b).data(a):h.cell(b,c).data(a);(e===k||e)&&h.columns.adjust();
(d===k||d)&&h.draw();return 0};this.fnVersionCheck=x.fnVersionCheck;var b=this,c=a===k,d=this.length;c&&(a={});this.oApi=this.internal=x.internal;for(var e in n.ext.internal)e&&(this[e]=Lb(e));this.each(function(){var e={},g=1<d?Xa(e,a,!0):a,j=0,i,e=this.getAttribute("id"),m=!1,l=n.defaults,q=h(this);if("table"!=this.nodeName.toLowerCase())K(null,0,"Non-table node initialisation ("+this.nodeName+")",2);else{eb(l);fb(l.column);J(l,l,!0);J(l.column,l.column,!0);J(l,h.extend(g,q.data()));var t=n.settings,
j=0;for(i=t.length;j<i;j++){var o=t[j];if(o.nTable==this||o.nTHead&&o.nTHead.parentNode==this||o.nTFoot&&o.nTFoot.parentNode==this){var s=g.bRetrieve!==k?g.bRetrieve:l.bRetrieve;if(c||s)return o.oInstance;if(g.bDestroy!==k?g.bDestroy:l.bDestroy){o.oInstance.fnDestroy();break}else{K(o,0,"Cannot reinitialise DataTable",3);return}}if(o.sTableId==this.id){t.splice(j,1);break}}if(null===e||""===e)this.id=e="DataTables_Table_"+n.ext._unique++;var p=h.extend(!0,{},n.models.oSettings,{sDestroyWidth:q[0].style.width,
sInstance:e,sTableId:e});p.nTable=this;p.oApi=b.internal;p.oInit=g;t.push(p);p.oInstance=1===b.length?b:q.dataTable();eb(g);Ca(g.oLanguage);g.aLengthMenu&&!g.iDisplayLength&&(g.iDisplayLength=h.isArray(g.aLengthMenu[0])?g.aLengthMenu[0][0]:g.aLengthMenu[0]);g=Xa(h.extend(!0,{},l),g);F(p.oFeatures,g,"bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" "));F(p,g,["asStripeClasses","ajax","fnServerData","fnFormatNumber","sServerMethod",
"aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","sAjaxSource","sAjaxDataProp","iStateDuration","sDom","bSortCellsTop","iTabIndex","fnStateLoadCallback","fnStateSaveCallback","renderer","searchDelay","rowId",["iCookieDuration","iStateDuration"],["oSearch","oPreviousSearch"],["aoSearchCols","aoPreSearchCols"],["iDisplayLength","_iDisplayLength"]]);F(p.oScroll,g,[["sScrollX","sX"],["sScrollXInner","sXInner"],["sScrollY","sY"],["bScrollCollapse","bCollapse"]]);F(p.oLanguage,g,"fnInfoCallback");
z(p,"aoDrawCallback",g.fnDrawCallback,"user");z(p,"aoServerParams",g.fnServerParams,"user");z(p,"aoStateSaveParams",g.fnStateSaveParams,"user");z(p,"aoStateLoadParams",g.fnStateLoadParams,"user");z(p,"aoStateLoaded",g.fnStateLoaded,"user");z(p,"aoRowCallback",g.fnRowCallback,"user");z(p,"aoRowCreatedCallback",g.fnCreatedRow,"user");z(p,"aoHeaderCallback",g.fnHeaderCallback,"user");z(p,"aoFooterCallback",g.fnFooterCallback,"user");z(p,"aoInitComplete",g.fnInitComplete,"user");z(p,"aoPreDrawCallback",
g.fnPreDrawCallback,"user");p.rowIdFn=S(g.rowId);gb(p);var u=p.oClasses;h.extend(u,n.ext.classes,g.oClasses);q.addClass(u.sTable);p.iInitDisplayStart===k&&(p.iInitDisplayStart=g.iDisplayStart,p._iDisplayStart=g.iDisplayStart);null!==g.iDeferLoading&&(p.bDeferLoading=!0,e=h.isArray(g.iDeferLoading),p._iRecordsDisplay=e?g.iDeferLoading[0]:g.iDeferLoading,p._iRecordsTotal=e?g.iDeferLoading[1]:g.iDeferLoading);var v=p.oLanguage;h.extend(!0,v,g.oLanguage);v.sUrl&&(h.ajax({dataType:"json",url:v.sUrl,success:function(a){Ca(a);
J(l.oLanguage,a);h.extend(true,v,a);ha(p)},error:function(){ha(p)}}),m=!0);null===g.asStripeClasses&&(p.asStripeClasses=[u.sStripeOdd,u.sStripeEven]);var e=p.asStripeClasses,x=q.children("tbody").find("tr").eq(0);-1!==h.inArray(!0,h.map(e,function(a){return x.hasClass(a)}))&&(h("tbody tr",this).removeClass(e.join(" ")),p.asDestroyStripes=e.slice());e=[];t=this.getElementsByTagName("thead");0!==t.length&&(ea(p.aoHeader,t[0]),e=ra(p));if(null===g.aoColumns){t=[];j=0;for(i=e.length;j<i;j++)t.push(null)}else t=
g.aoColumns;j=0;for(i=t.length;j<i;j++)Ea(p,e?e[j]:null);ib(p,g.aoColumnDefs,t,function(a,b){ka(p,a,b)});if(x.length){var w=function(a,b){return a.getAttribute("data-"+b)!==null?b:null};h(x[0]).children("th, td").each(function(a,b){var c=p.aoColumns[a];if(c.mData===a){var d=w(b,"sort")||w(b,"order"),e=w(b,"filter")||w(b,"search");if(d!==null||e!==null){c.mData={_:a+".display",sort:d!==null?a+".@data-"+d:k,type:d!==null?a+".@data-"+d:k,filter:e!==null?a+".@data-"+e:k};ka(p,a)}}})}var U=p.oFeatures,
e=function(){if(g.aaSorting===k){var a=p.aaSorting;j=0;for(i=a.length;j<i;j++)a[j][1]=p.aoColumns[j].asSorting[0]}wa(p);U.bSort&&z(p,"aoDrawCallback",function(){if(p.bSorted){var a=X(p),b={};h.each(a,function(a,c){b[c.src]=c.dir});r(p,null,"order",[p,a,b]);Ib(p)}});z(p,"aoDrawCallback",function(){(p.bSorted||y(p)==="ssp"||U.bDeferRender)&&wa(p)},"sc");var a=q.children("caption").each(function(){this._captionSide=h(this).css("caption-side")}),b=q.children("thead");b.length===0&&(b=h("<thead/>").appendTo(q));
p.nTHead=b[0];b=q.children("tbody");b.length===0&&(b=h("<tbody/>").appendTo(q));p.nTBody=b[0];b=q.children("tfoot");if(b.length===0&&a.length>0&&(p.oScroll.sX!==""||p.oScroll.sY!==""))b=h("<tfoot/>").appendTo(q);if(b.length===0||b.children().length===0)q.addClass(u.sNoFooter);else if(b.length>0){p.nTFoot=b[0];ea(p.aoFooter,p.nTFoot)}if(g.aaData)for(j=0;j<g.aaData.length;j++)O(p,g.aaData[j]);else(p.bDeferLoading||y(p)=="dom")&&na(p,h(p.nTBody).children("tr"));p.aiDisplay=p.aiDisplayMaster.slice();
p.bInitialised=true;m===false&&ha(p)};g.bStateSave?(U.bStateSave=!0,z(p,"aoDrawCallback",xa,"state_save"),Jb(p,g,e)):e()}});b=null;return this},x,s,o,u,Za={},Mb=/[\r\n]/g,Aa=/<.*?>/g,Zb=/^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/,$b=RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)","g"),Ya=/[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi,M=function(a){return!a||!0===a||"-"===a?!0:!1},Nb=function(a){var b=parseInt(a,10);return!isNaN(b)&&
isFinite(a)?b:null},Ob=function(a,b){Za[b]||(Za[b]=RegExp(Qa(b),"g"));return"string"===typeof a&&"."!==b?a.replace(/\./g,"").replace(Za[b],"."):a},$a=function(a,b,c){var d="string"===typeof a;if(M(a))return!0;b&&d&&(a=Ob(a,b));c&&d&&(a=a.replace(Ya,""));return!isNaN(parseFloat(a))&&isFinite(a)},Pb=function(a,b,c){return M(a)?!0:!(M(a)||"string"===typeof a)?null:$a(a.replace(Aa,""),b,c)?!0:null},D=function(a,b,c){var d=[],e=0,f=a.length;if(c!==k)for(;e<f;e++)a[e]&&a[e][b]&&d.push(a[e][b][c]);else for(;e<
f;e++)a[e]&&d.push(a[e][b]);return d},ja=function(a,b,c,d){var e=[],f=0,g=b.length;if(d!==k)for(;f<g;f++)a[b[f]][c]&&e.push(a[b[f]][c][d]);else for(;f<g;f++)e.push(a[b[f]][c]);return e},Y=function(a,b){var c=[],d;b===k?(b=0,d=a):(d=b,b=a);for(var e=b;e<d;e++)c.push(e);return c},Qb=function(a){for(var b=[],c=0,d=a.length;c<d;c++)a[c]&&b.push(a[c]);return b},qa=function(a){var b;a:{if(!(2>a.length)){b=a.slice().sort();for(var c=b[0],d=1,e=b.length;d<e;d++){if(b[d]===c){b=!1;break a}c=b[d]}}b=!0}if(b)return a.slice();
b=[];var e=a.length,f,g=0,d=0;a:for(;d<e;d++){c=a[d];for(f=0;f<g;f++)if(b[f]===c)continue a;b.push(c);g++}return b};n.util={throttle:function(a,b){var c=b!==k?b:200,d,e;return function(){var b=this,g=+new Date,j=arguments;d&&g<d+c?(clearTimeout(e),e=setTimeout(function(){d=k;a.apply(b,j)},c)):(d=g,a.apply(b,j))}},escapeRegex:function(a){return a.replace($b,"\\$1")}};var A=function(a,b,c){a[b]!==k&&(a[c]=a[b])},ca=/\[.*?\]$/,W=/\(\)$/,Qa=n.util.escapeRegex,va=h("<div>")[0],Wb=va.textContent!==k,Yb=
/<.*?>/g,Oa=n.util.throttle,Rb=[],w=Array.prototype,ac=function(a){var b,c,d=n.settings,e=h.map(d,function(a){return a.nTable});if(a){if(a.nTable&&a.oApi)return[a];if(a.nodeName&&"table"===a.nodeName.toLowerCase())return b=h.inArray(a,e),-1!==b?[d[b]]:null;if(a&&"function"===typeof a.settings)return a.settings().toArray();"string"===typeof a?c=h(a):a instanceof h&&(c=a)}else return[];if(c)return c.map(function(){b=h.inArray(this,e);return-1!==b?d[b]:null}).toArray()};s=function(a,b){if(!(this instanceof
s))return new s(a,b);var c=[],d=function(a){(a=ac(a))&&(c=c.concat(a))};if(h.isArray(a))for(var e=0,f=a.length;e<f;e++)d(a[e]);else d(a);this.context=qa(c);b&&h.merge(this,b);this.selector={rows:null,cols:null,opts:null};s.extend(this,this,Rb)};n.Api=s;h.extend(s.prototype,{any:function(){return 0!==this.count()},concat:w.concat,context:[],count:function(){return this.flatten().length},each:function(a){for(var b=0,c=this.length;b<c;b++)a.call(this,this[b],b,this);return this},eq:function(a){var b=
this.context;return b.length>a?new s(b[a],this[a]):null},filter:function(a){var b=[];if(w.filter)b=w.filter.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)a.call(this,this[c],c,this)&&b.push(this[c]);return new s(this.context,b)},flatten:function(){var a=[];return new s(this.context,a.concat.apply(a,this.toArray()))},join:w.join,indexOf:w.indexOf||function(a,b){for(var c=b||0,d=this.length;c<d;c++)if(this[c]===a)return c;return-1},iterator:function(a,b,c,d){var e=[],f,g,j,h,m,l=this.context,
n,o,u=this.selector;"string"===typeof a&&(d=c,c=b,b=a,a=!1);g=0;for(j=l.length;g<j;g++){var r=new s(l[g]);if("table"===b)f=c.call(r,l[g],g),f!==k&&e.push(f);else if("columns"===b||"rows"===b)f=c.call(r,l[g],this[g],g),f!==k&&e.push(f);else if("column"===b||"column-rows"===b||"row"===b||"cell"===b){o=this[g];"column-rows"===b&&(n=Ba(l[g],u.opts));h=0;for(m=o.length;h<m;h++)f=o[h],f="cell"===b?c.call(r,l[g],f.row,f.column,g,h):c.call(r,l[g],f,g,h,n),f!==k&&e.push(f)}}return e.length||d?(a=new s(l,a?
e.concat.apply([],e):e),b=a.selector,b.rows=u.rows,b.cols=u.cols,b.opts=u.opts,a):this},lastIndexOf:w.lastIndexOf||function(a,b){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,map:function(a){var b=[];if(w.map)b=w.map.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)b.push(a.call(this,this[c],c));return new s(this.context,b)},pluck:function(a){return this.map(function(b){return b[a]})},pop:w.pop,push:w.push,reduce:w.reduce||function(a,b){return hb(this,a,b,0,this.length,
1)},reduceRight:w.reduceRight||function(a,b){return hb(this,a,b,this.length-1,-1,-1)},reverse:w.reverse,selector:null,shift:w.shift,slice:function(){return new s(this.context,this)},sort:w.sort,splice:w.splice,toArray:function(){return w.slice.call(this)},to$:function(){return h(this)},toJQuery:function(){return h(this)},unique:function(){return new s(this.context,qa(this))},unshift:w.unshift});s.extend=function(a,b,c){if(c.length&&b&&(b instanceof s||b.__dt_wrapper)){var d,e,f,g=function(a,b,c){return function(){var d=
b.apply(a,arguments);s.extend(d,d,c.methodExt);return d}};d=0;for(e=c.length;d<e;d++)f=c[d],b[f.name]="function"===typeof f.val?g(a,f.val,f):h.isPlainObject(f.val)?{}:f.val,b[f.name].__dt_wrapper=!0,s.extend(a,b[f.name],f.propExt)}};s.register=o=function(a,b){if(h.isArray(a))for(var c=0,d=a.length;c<d;c++)s.register(a[c],b);else for(var e=a.split("."),f=Rb,g,j,c=0,d=e.length;c<d;c++){g=(j=-1!==e[c].indexOf("()"))?e[c].replace("()",""):e[c];var i;a:{i=0;for(var m=f.length;i<m;i++)if(f[i].name===g){i=
f[i];break a}i=null}i||(i={name:g,val:{},methodExt:[],propExt:[]},f.push(i));c===d-1?i.val=b:f=j?i.methodExt:i.propExt}};s.registerPlural=u=function(a,b,c){s.register(a,c);s.register(b,function(){var a=c.apply(this,arguments);return a===this?this:a instanceof s?a.length?h.isArray(a[0])?new s(a.context,a[0]):a[0]:k:a})};o("tables()",function(a){var b;if(a){b=s;var c=this.context;if("number"===typeof a)a=[c[a]];else var d=h.map(c,function(a){return a.nTable}),a=h(d).filter(a).map(function(){var a=h.inArray(this,
d);return c[a]}).toArray();b=new b(a)}else b=this;return b});o("table()",function(a){var a=this.tables(a),b=a.context;return b.length?new s(b[0]):a});u("tables().nodes()","table().node()",function(){return this.iterator("table",function(a){return a.nTable},1)});u("tables().body()","table().body()",function(){return this.iterator("table",function(a){return a.nTBody},1)});u("tables().header()","table().header()",function(){return this.iterator("table",function(a){return a.nTHead},1)});u("tables().footer()",
"table().footer()",function(){return this.iterator("table",function(a){return a.nTFoot},1)});u("tables().containers()","table().container()",function(){return this.iterator("table",function(a){return a.nTableWrapper},1)});o("draw()",function(a){return this.iterator("table",function(b){"page"===a?P(b):("string"===typeof a&&(a="full-hold"===a?!1:!0),T(b,!1===a))})});o("page()",function(a){return a===k?this.page.info().page:this.iterator("table",function(b){Ta(b,a)})});o("page.info()",function(){if(0===
this.context.length)return k;var a=this.context[0],b=a._iDisplayStart,c=a.oFeatures.bPaginate?a._iDisplayLength:-1,d=a.fnRecordsDisplay(),e=-1===c;return{page:e?0:Math.floor(b/c),pages:e?1:Math.ceil(d/c),start:b,end:a.fnDisplayEnd(),length:c,recordsTotal:a.fnRecordsTotal(),recordsDisplay:d,serverSide:"ssp"===y(a)}});o("page.len()",function(a){return a===k?0!==this.context.length?this.context[0]._iDisplayLength:k:this.iterator("table",function(b){Ra(b,a)})});var Sb=function(a,b,c){if(c){var d=new s(a);
d.one("draw",function(){c(d.ajax.json())})}if("ssp"==y(a))T(a,b);else{C(a,!0);var e=a.jqXHR;e&&4!==e.readyState&&e.abort();sa(a,[],function(c){oa(a);for(var c=ta(a,c),d=0,e=c.length;d<e;d++)O(a,c[d]);T(a,b);C(a,!1)})}};o("ajax.json()",function(){var a=this.context;if(0<a.length)return a[0].json});o("ajax.params()",function(){var a=this.context;if(0<a.length)return a[0].oAjaxData});o("ajax.reload()",function(a,b){return this.iterator("table",function(c){Sb(c,!1===b,a)})});o("ajax.url()",function(a){var b=
this.context;if(a===k){if(0===b.length)return k;b=b[0];return b.ajax?h.isPlainObject(b.ajax)?b.ajax.url:b.ajax:b.sAjaxSource}return this.iterator("table",function(b){h.isPlainObject(b.ajax)?b.ajax.url=a:b.ajax=a})});o("ajax.url().load()",function(a,b){return this.iterator("table",function(c){Sb(c,!1===b,a)})});var ab=function(a,b,c,d,e){var f=[],g,j,i,m,l,n;i=typeof b;if(!b||"string"===i||"function"===i||b.length===k)b=[b];i=0;for(m=b.length;i<m;i++){j=b[i]&&b[i].split&&!b[i].match(/[\[\(:]/)?b[i].split(","):
[b[i]];l=0;for(n=j.length;l<n;l++)(g=c("string"===typeof j[l]?h.trim(j[l]):j[l]))&&g.length&&(f=f.concat(g))}a=x.selector[a];if(a.length){i=0;for(m=a.length;i<m;i++)f=a[i](d,e,f)}return qa(f)},bb=function(a){a||(a={});a.filter&&a.search===k&&(a.search=a.filter);return h.extend({search:"none",order:"current",page:"all"},a)},cb=function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].length)return a[0]=a[b],a[0].length=1,a.length=1,a.context=[a.context[b]],a;a.length=0;return a},Ba=function(a,b){var c,
d,e,f=[],g=a.aiDisplay;e=a.aiDisplayMaster;var j=b.search;c=b.order;d=b.page;if("ssp"==y(a))return"removed"===j?[]:Y(0,e.length);if("current"==d){c=a._iDisplayStart;for(d=a.fnDisplayEnd();c<d;c++)f.push(g[c])}else if("current"==c||"applied"==c)if("none"==j)f=e.slice();else if("applied"==j)f=g.slice();else{if("removed"==j){var i={};c=0;for(d=g.length;c<d;c++)i[g[c]]=null;f=h.map(e,function(a){return!i.hasOwnProperty(a)?a:null})}}else if("index"==c||"original"==c){c=0;for(d=a.aoData.length;c<d;c++)"none"==
j?f.push(c):(e=h.inArray(c,g),(-1===e&&"removed"==j||0<=e&&"applied"==j)&&f.push(c))}return f};o("rows()",function(a,b){a===k?a="":h.isPlainObject(a)&&(b=a,a="");var b=bb(b),c=this.iterator("table",function(c){var e=b,f;return ab("row",a,function(a){var b=Nb(a),i=c.aoData;if(b!==null&&!e)return[b];f||(f=Ba(c,e));if(b!==null&&h.inArray(b,f)!==-1)return[b];if(a===null||a===k||a==="")return f;if(typeof a==="function")return h.map(f,function(b){var c=i[b];return a(b,c._aData,c.nTr)?b:null});if(a.nodeName){var b=
a._DT_RowIndex,m=a._DT_CellIndex;if(b!==k)return i[b]&&i[b].nTr===a?[b]:[];if(m)return i[m.row]&&i[m.row].nTr===a?[m.row]:[];b=h(a).closest("*[data-dt-row]");return b.length?[b.data("dt-row")]:[]}if(typeof a==="string"&&a.charAt(0)==="#"){b=c.aIds[a.replace(/^#/,"")];if(b!==k)return[b.idx]}b=Qb(ja(c.aoData,f,"nTr"));return h(b).filter(a).map(function(){return this._DT_RowIndex}).toArray()},c,e)},1);c.selector.rows=a;c.selector.opts=b;return c});o("rows().nodes()",function(){return this.iterator("row",
function(a,b){return a.aoData[b].nTr||k},1)});o("rows().data()",function(){return this.iterator(!0,"rows",function(a,b){return ja(a.aoData,b,"_aData")},1)});u("rows().cache()","row().cache()",function(a){return this.iterator("row",function(b,c){var d=b.aoData[c];return"search"===a?d._aFilterData:d._aSortData},1)});u("rows().invalidate()","row().invalidate()",function(a){return this.iterator("row",function(b,c){da(b,c,a)})});u("rows().indexes()","row().index()",function(){return this.iterator("row",
function(a,b){return b},1)});u("rows().ids()","row().id()",function(a){for(var b=[],c=this.context,d=0,e=c.length;d<e;d++)for(var f=0,g=this[d].length;f<g;f++){var h=c[d].rowIdFn(c[d].aoData[this[d][f]]._aData);b.push((!0===a?"#":"")+h)}return new s(c,b)});u("rows().remove()","row().remove()",function(){var a=this;this.iterator("row",function(b,c,d){var e=b.aoData,f=e[c],g,h,i,m,l;e.splice(c,1);g=0;for(h=e.length;g<h;g++)if(i=e[g],l=i.anCells,null!==i.nTr&&(i.nTr._DT_RowIndex=g),null!==l){i=0;for(m=
l.length;i<m;i++)l[i]._DT_CellIndex.row=g}pa(b.aiDisplayMaster,c);pa(b.aiDisplay,c);pa(a[d],c,!1);0<b._iRecordsDisplay&&b._iRecordsDisplay--;Sa(b);c=b.rowIdFn(f._aData);c!==k&&delete b.aIds[c]});this.iterator("table",function(a){for(var c=0,d=a.aoData.length;c<d;c++)a.aoData[c].idx=c});return this});o("rows.add()",function(a){var b=this.iterator("table",function(b){var c,f,g,h=[];f=0;for(g=a.length;f<g;f++)c=a[f],c.nodeName&&"TR"===c.nodeName.toUpperCase()?h.push(na(b,c)[0]):h.push(O(b,c));return h},
1),c=this.rows(-1);c.pop();h.merge(c,b);return c});o("row()",function(a,b){return cb(this.rows(a,b))});o("row().data()",function(a){var b=this.context;if(a===k)return b.length&&this.length?b[0].aoData[this[0]]._aData:k;var c=b[0].aoData[this[0]];c._aData=a;h.isArray(a)&&c.nTr.id&&N(b[0].rowId)(a,c.nTr.id);da(b[0],this[0],"data");return this});o("row().node()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]].nTr||null:null});o("row.add()",function(a){a instanceof h&&
a.length&&(a=a[0]);var b=this.iterator("table",function(b){return a.nodeName&&"TR"===a.nodeName.toUpperCase()?na(b,a)[0]:O(b,a)});return this.row(b[0])});var db=function(a,b){var c=a.context;if(c.length&&(c=c[0].aoData[b!==k?b:a[0]])&&c._details)c._details.remove(),c._detailsShow=k,c._details=k},Tb=function(a,b){var c=a.context;if(c.length&&a.length){var d=c[0].aoData[a[0]];if(d._details){(d._detailsShow=b)?d._details.insertAfter(d.nTr):d._details.detach();var e=c[0],f=new s(e),g=e.aoData;f.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details");
0<D(g,"_details").length&&(f.on("draw.dt.DT_details",function(a,b){e===b&&f.rows({page:"current"}).eq(0).each(function(a){a=g[a];a._detailsShow&&a._details.insertAfter(a.nTr)})}),f.on("column-visibility.dt.DT_details",function(a,b){if(e===b)for(var c,d=V(b),f=0,h=g.length;f<h;f++)c=g[f],c._details&&c._details.children("td[colspan]").attr("colspan",d)}),f.on("destroy.dt.DT_details",function(a,b){if(e===b)for(var c=0,d=g.length;c<d;c++)g[c]._details&&db(f,c)}))}}};o("row().child()",function(a,b){var c=
this.context;if(a===k)return c.length&&this.length?c[0].aoData[this[0]]._details:k;if(!0===a)this.child.show();else if(!1===a)db(this);else if(c.length&&this.length){var d=c[0],c=c[0].aoData[this[0]],e=[],f=function(a,b){if(h.isArray(a)||a instanceof h)for(var c=0,k=a.length;c<k;c++)f(a[c],b);else a.nodeName&&"tr"===a.nodeName.toLowerCase()?e.push(a):(c=h("<tr><td/></tr>").addClass(b),h("td",c).addClass(b).html(a)[0].colSpan=V(d),e.push(c[0]))};f(a,b);c._details&&c._details.detach();c._details=h(e);
c._detailsShow&&c._details.insertAfter(c.nTr)}return this});o(["row().child.show()","row().child().show()"],function(){Tb(this,!0);return this});o(["row().child.hide()","row().child().hide()"],function(){Tb(this,!1);return this});o(["row().child.remove()","row().child().remove()"],function(){db(this);return this});o("row().child.isShown()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]]._detailsShow||!1:!1});var bc=/^([^:]+):(name|visIdx|visible)$/,Ub=function(a,b,
c,d,e){for(var c=[],d=0,f=e.length;d<f;d++)c.push(B(a,e[d],b));return c};o("columns()",function(a,b){a===k?a="":h.isPlainObject(a)&&(b=a,a="");var b=bb(b),c=this.iterator("table",function(c){var e=a,f=b,g=c.aoColumns,j=D(g,"sName"),i=D(g,"nTh");return ab("column",e,function(a){var b=Nb(a);if(a==="")return Y(g.length);if(b!==null)return[b>=0?b:g.length+b];if(typeof a==="function"){var e=Ba(c,f);return h.map(g,function(b,f){return a(f,Ub(c,f,0,0,e),i[f])?f:null})}var k=typeof a==="string"?a.match(bc):
"";if(k)switch(k[2]){case "visIdx":case "visible":b=parseInt(k[1],10);if(b<0){var n=h.map(g,function(a,b){return a.bVisible?b:null});return[n[n.length+b]]}return[aa(c,b)];case "name":return h.map(j,function(a,b){return a===k[1]?b:null});default:return[]}if(a.nodeName&&a._DT_CellIndex)return[a._DT_CellIndex.column];b=h(i).filter(a).map(function(){return h.inArray(this,i)}).toArray();if(b.length||!a.nodeName)return b;b=h(a).closest("*[data-dt-column]");return b.length?[b.data("dt-column")]:[]},c,f)},
1);c.selector.cols=a;c.selector.opts=b;return c});u("columns().header()","column().header()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTh},1)});u("columns().footer()","column().footer()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTf},1)});u("columns().data()","column().data()",function(){return this.iterator("column-rows",Ub,1)});u("columns().dataSrc()","column().dataSrc()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].mData},
1)});u("columns().cache()","column().cache()",function(a){return this.iterator("column-rows",function(b,c,d,e,f){return ja(b.aoData,f,"search"===a?"_aFilterData":"_aSortData",c)},1)});u("columns().nodes()","column().nodes()",function(){return this.iterator("column-rows",function(a,b,c,d,e){return ja(a.aoData,e,"anCells",b)},1)});u("columns().visible()","column().visible()",function(a,b){var c=this.iterator("column",function(b,c){if(a===k)return b.aoColumns[c].bVisible;var f=b.aoColumns,g=f[c],j=b.aoData,
i,m,l;if(a!==k&&g.bVisible!==a){if(a){var n=h.inArray(!0,D(f,"bVisible"),c+1);i=0;for(m=j.length;i<m;i++)l=j[i].nTr,f=j[i].anCells,l&&l.insertBefore(f[c],f[n]||null)}else h(D(b.aoData,"anCells",c)).detach();g.bVisible=a;fa(b,b.aoHeader);fa(b,b.aoFooter);b.aiDisplay.length||h(b.nTBody).find("td[colspan]").attr("colspan",V(b));xa(b)}});a!==k&&(this.iterator("column",function(c,e){r(c,null,"column-visibility",[c,e,a,b])}),(b===k||b)&&this.columns.adjust());return c});u("columns().indexes()","column().index()",
function(a){return this.iterator("column",function(b,c){return"visible"===a?ba(b,c):c},1)});o("columns.adjust()",function(){return this.iterator("table",function(a){$(a)},1)});o("column.index()",function(a,b){if(0!==this.context.length){var c=this.context[0];if("fromVisible"===a||"toData"===a)return aa(c,b);if("fromData"===a||"toVisible"===a)return ba(c,b)}});o("column()",function(a,b){return cb(this.columns(a,b))});o("cells()",function(a,b,c){h.isPlainObject(a)&&(a.row===k?(c=a,a=null):(c=b,b=null));
h.isPlainObject(b)&&(c=b,b=null);if(null===b||b===k)return this.iterator("table",function(b){var d=a,e=bb(c),f=b.aoData,g=Ba(b,e),j=Qb(ja(f,g,"anCells")),i=h([].concat.apply([],j)),l,m=b.aoColumns.length,n,o,u,s,r,v;return ab("cell",d,function(a){var c=typeof a==="function";if(a===null||a===k||c){n=[];o=0;for(u=g.length;o<u;o++){l=g[o];for(s=0;s<m;s++){r={row:l,column:s};if(c){v=f[l];a(r,B(b,l,s),v.anCells?v.anCells[s]:null)&&n.push(r)}else n.push(r)}}return n}if(h.isPlainObject(a))return a.column!==
k&&a.row!==k&&h.inArray(a.row,g)!==-1?[a]:[];c=i.filter(a).map(function(a,b){return{row:b._DT_CellIndex.row,column:b._DT_CellIndex.column}}).toArray();if(c.length||!a.nodeName)return c;v=h(a).closest("*[data-dt-row]");return v.length?[{row:v.data("dt-row"),column:v.data("dt-column")}]:[]},b,e)});var d=this.columns(b),e=this.rows(a),f,g,j,i,m;this.iterator("table",function(a,b){f=[];g=0;for(j=e[b].length;g<j;g++){i=0;for(m=d[b].length;i<m;i++)f.push({row:e[b][g],column:d[b][i]})}},1);var l=this.cells(f,
c);h.extend(l.selector,{cols:b,rows:a,opts:c});return l});u("cells().nodes()","cell().node()",function(){return this.iterator("cell",function(a,b,c){return(a=a.aoData[b])&&a.anCells?a.anCells[c]:k},1)});o("cells().data()",function(){return this.iterator("cell",function(a,b,c){return B(a,b,c)},1)});u("cells().cache()","cell().cache()",function(a){a="search"===a?"_aFilterData":"_aSortData";return this.iterator("cell",function(b,c,d){return b.aoData[c][a][d]},1)});u("cells().render()","cell().render()",
function(a){return this.iterator("cell",function(b,c,d){return B(b,c,d,a)},1)});u("cells().indexes()","cell().index()",function(){return this.iterator("cell",function(a,b,c){return{row:b,column:c,columnVisible:ba(a,c)}},1)});u("cells().invalidate()","cell().invalidate()",function(a){return this.iterator("cell",function(b,c,d){da(b,c,a,d)})});o("cell()",function(a,b,c){return cb(this.cells(a,b,c))});o("cell().data()",function(a){var b=this.context,c=this[0];if(a===k)return b.length&&c.length?B(b[0],
c[0].row,c[0].column):k;jb(b[0],c[0].row,c[0].column,a);da(b[0],c[0].row,"data",c[0].column);return this});o("order()",function(a,b){var c=this.context;if(a===k)return 0!==c.length?c[0].aaSorting:k;"number"===typeof a?a=[[a,b]]:a.length&&!h.isArray(a[0])&&(a=Array.prototype.slice.call(arguments));return this.iterator("table",function(b){b.aaSorting=a.slice()})});o("order.listener()",function(a,b,c){return this.iterator("table",function(d){Ma(d,a,b,c)})});o("order.fixed()",function(a){if(!a){var b=
this.context,b=b.length?b[0].aaSortingFixed:k;return h.isArray(b)?{pre:b}:b}return this.iterator("table",function(b){b.aaSortingFixed=h.extend(!0,{},a)})});o(["columns().order()","column().order()"],function(a){var b=this;return this.iterator("table",function(c,d){var e=[];h.each(b[d],function(b,c){e.push([c,a])});c.aaSorting=e})});o("search()",function(a,b,c,d){var e=this.context;return a===k?0!==e.length?e[0].oPreviousSearch.sSearch:k:this.iterator("table",function(e){e.oFeatures.bFilter&&ga(e,
h.extend({},e.oPreviousSearch,{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),1)})});u("columns().search()","column().search()",function(a,b,c,d){return this.iterator("column",function(e,f){var g=e.aoPreSearchCols;if(a===k)return g[f].sSearch;e.oFeatures.bFilter&&(h.extend(g[f],{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),ga(e,e.oPreviousSearch,1))})});o("state()",function(){return this.context.length?this.context[0].oSavedState:
null});o("state.clear()",function(){return this.iterator("table",function(a){a.fnStateSaveCallback.call(a.oInstance,a,{})})});o("state.loaded()",function(){return this.context.length?this.context[0].oLoadedState:null});o("state.save()",function(){return this.iterator("table",function(a){xa(a)})});n.versionCheck=n.fnVersionCheck=function(a){for(var b=n.version.split("."),a=a.split("."),c,d,e=0,f=a.length;e<f;e++)if(c=parseInt(b[e],10)||0,d=parseInt(a[e],10)||0,c!==d)return c>d;return!0};n.isDataTable=
n.fnIsDataTable=function(a){var b=h(a).get(0),c=!1;if(a instanceof n.Api)return!0;h.each(n.settings,function(a,e){var f=e.nScrollHead?h("table",e.nScrollHead)[0]:null,g=e.nScrollFoot?h("table",e.nScrollFoot)[0]:null;if(e.nTable===b||f===b||g===b)c=!0});return c};n.tables=n.fnTables=function(a){var b=!1;h.isPlainObject(a)&&(b=a.api,a=a.visible);var c=h.map(n.settings,function(b){if(!a||a&&h(b.nTable).is(":visible"))return b.nTable});return b?new s(c):c};n.camelToHungarian=J;o("$()",function(a,b){var c=
this.rows(b).nodes(),c=h(c);return h([].concat(c.filter(a).toArray(),c.find(a).toArray()))});h.each(["on","one","off"],function(a,b){o(b+"()",function(){var a=Array.prototype.slice.call(arguments);a[0]=h.map(a[0].split(/\s/),function(a){return!a.match(/\.dt\b/)?a+".dt":a}).join(" ");var d=h(this.tables().nodes());d[b].apply(d,a);return this})});o("clear()",function(){return this.iterator("table",function(a){oa(a)})});o("settings()",function(){return new s(this.context,this.context)});o("init()",function(){var a=
this.context;return a.length?a[0].oInit:null});o("data()",function(){return this.iterator("table",function(a){return D(a.aoData,"_aData")}).flatten()});o("destroy()",function(a){a=a||!1;return this.iterator("table",function(b){var c=b.nTableWrapper.parentNode,d=b.oClasses,e=b.nTable,f=b.nTBody,g=b.nTHead,j=b.nTFoot,i=h(e),f=h(f),k=h(b.nTableWrapper),l=h.map(b.aoData,function(a){return a.nTr}),o;b.bDestroying=!0;r(b,"aoDestroyCallback","destroy",[b]);a||(new s(b)).columns().visible(!0);k.off(".DT").find(":not(tbody *)").off(".DT");
h(E).off(".DT-"+b.sInstance);e!=g.parentNode&&(i.children("thead").detach(),i.append(g));j&&e!=j.parentNode&&(i.children("tfoot").detach(),i.append(j));b.aaSorting=[];b.aaSortingFixed=[];wa(b);h(l).removeClass(b.asStripeClasses.join(" "));h("th, td",g).removeClass(d.sSortable+" "+d.sSortableAsc+" "+d.sSortableDesc+" "+d.sSortableNone);f.children().detach();f.append(l);g=a?"remove":"detach";i[g]();k[g]();!a&&c&&(c.insertBefore(e,b.nTableReinsertBefore),i.css("width",b.sDestroyWidth).removeClass(d.sTable),
(o=b.asDestroyStripes.length)&&f.children().each(function(a){h(this).addClass(b.asDestroyStripes[a%o])}));c=h.inArray(b,n.settings);-1!==c&&n.settings.splice(c,1)})});h.each(["column","row","cell"],function(a,b){o(b+"s().every()",function(a){var d=this.selector.opts,e=this;return this.iterator(b,function(f,g,h,i,m){a.call(e[b](g,"cell"===b?h:d,"cell"===b?d:k),g,h,i,m)})})});o("i18n()",function(a,b,c){var d=this.context[0],a=S(a)(d.oLanguage);a===k&&(a=b);c!==k&&h.isPlainObject(a)&&(a=a[c]!==k?a[c]:
a._);return a.replace("%d",c)});n.version="1.10.18";n.settings=[];n.models={};n.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0};n.models.oRow={nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,_sRowStripe:"",src:null,idx:-1};n.models.oColumn={idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,
sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};n.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,
bSort:!0,bSortMulti:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:null,fnServerParams:null,fnStateLoadCallback:function(a){try{return JSON.parse((-1===a.iStateDuration?sessionStorage:localStorage).getItem("DataTables_"+
a.sInstance+"_"+location.pathname))}catch(b){}},fnStateLoadParams:null,fnStateLoaded:null,fnStateSaveCallback:function(a,b){try{(-1===a.iStateDuration?sessionStorage:localStorage).setItem("DataTables_"+a.sInstance+"_"+location.pathname,JSON.stringify(b))}catch(c){}},fnStateSaveParams:null,iStateDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},
oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sDecimal:"",sThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sSearchPlaceholder:"",sUrl:"",sZeroRecords:"No matching records found"},oSearch:h.extend({},
n.models.oSearch),sAjaxDataProp:"data",sAjaxSource:null,sDom:"lfrtip",searchDelay:null,sPaginationType:"simple_numbers",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET",renderer:null,rowId:"DT_RowId"};Z(n.defaults);n.defaults.column={aDataSort:null,iDataSort:-1,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bVisible:!0,fnCreatedCell:null,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};
Z(n.defaults.column);n.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortMulti:null,bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1,bScrollbarLeft:!1,bBounding:!1,barWidth:0},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aIds:{},aoColumns:[],aoHeader:[],
aoFooter:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,searchDelay:null,sPaginationType:"two_button",
iStateDuration:0,aoStateSave:[],aoStateLoad:[],oSavedState:null,oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,json:k,oAjaxData:k,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iRecordsTotal:0,_iRecordsDisplay:0,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return"ssp"==y(this)?1*this._iRecordsTotal:
this.aiDisplayMaster.length},fnRecordsDisplay:function(){return"ssp"==y(this)?1*this._iRecordsDisplay:this.aiDisplay.length},fnDisplayEnd:function(){var a=this._iDisplayLength,b=this._iDisplayStart,c=b+a,d=this.aiDisplay.length,e=this.oFeatures,f=e.bPaginate;return e.bServerSide?!1===f||-1===a?b+d:Math.min(b+a,this._iRecordsDisplay):!f||c>d||-1===a?d:c},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null,aLastSort:[],oPlugins:{},rowIdFn:null,rowId:null};n.ext=x={buttons:{},
classes:{},builder:"-source-",errMode:"alert",feature:[],search:[],selector:{cell:[],column:[],row:[]},internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},order:{},type:{detect:[],search:{},order:{}},_unique:0,fnVersionCheck:n.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:n.version};h.extend(x,{afnFiltering:x.search,aTypes:x.type.detect,ofnSearch:x.type.search,oSort:x.type.order,afnSortData:x.order,aoFeatures:x.feature,oApi:x.internal,oStdClasses:x.classes,oPagination:x.pager});
h.extend(n.ext.classes,{sTable:"dataTable",sNoFooter:"no-footer",sPageButton:"paginate_button",sPageButtonActive:"current",sPageButtonDisabled:"disabled",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",
sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sFilterInput:"",sLengthSelect:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sHeaderTH:"",sFooterTH:"",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",
sJUIHeader:"",sJUIFooter:""});var Kb=n.ext.pager;h.extend(Kb,{simple:function(){return["previous","next"]},full:function(){return["first","previous","next","last"]},numbers:function(a,b){return[ia(a,b)]},simple_numbers:function(a,b){return["previous",ia(a,b),"next"]},full_numbers:function(a,b){return["first","previous",ia(a,b),"next","last"]},first_last_numbers:function(a,b){return["first",ia(a,b),"last"]},_numbers:ia,numbers_length:7});h.extend(!0,n.ext.renderer,{pageButton:{_:function(a,b,c,d,e,
f){var g=a.oClasses,j=a.oLanguage.oPaginate,i=a.oLanguage.oAria.paginate||{},m,l,n=0,o=function(b,d){var k,s,u,r,v=function(b){Ta(a,b.data.action,true)};k=0;for(s=d.length;k<s;k++){r=d[k];if(h.isArray(r)){u=h("<"+(r.DT_el||"div")+"/>").appendTo(b);o(u,r)}else{m=null;l="";switch(r){case "ellipsis":b.append('<span class="ellipsis">&#x2026;</span>');break;case "first":m=j.sFirst;l=r+(e>0?"":" "+g.sPageButtonDisabled);break;case "previous":m=j.sPrevious;l=r+(e>0?"":" "+g.sPageButtonDisabled);break;case "next":m=
j.sNext;l=r+(e<f-1?"":" "+g.sPageButtonDisabled);break;case "last":m=j.sLast;l=r+(e<f-1?"":" "+g.sPageButtonDisabled);break;default:m=r+1;l=e===r?g.sPageButtonActive:""}if(m!==null){u=h("<a>",{"class":g.sPageButton+" "+l,"aria-controls":a.sTableId,"aria-label":i[r],"data-dt-idx":n,tabindex:a.iTabIndex,id:c===0&&typeof r==="string"?a.sTableId+"_"+r:null}).html(m).appendTo(b);Wa(u,{action:r},v);n++}}}},s;try{s=h(b).find(H.activeElement).data("dt-idx")}catch(u){}o(h(b).empty(),d);s!==k&&h(b).find("[data-dt-idx="+
s+"]").focus()}}});h.extend(n.ext.type.detect,[function(a,b){var c=b.oLanguage.sDecimal;return $a(a,c)?"num"+c:null},function(a){if(a&&!(a instanceof Date)&&!Zb.test(a))return null;var b=Date.parse(a);return null!==b&&!isNaN(b)||M(a)?"date":null},function(a,b){var c=b.oLanguage.sDecimal;return $a(a,c,!0)?"num-fmt"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Pb(a,c)?"html-num"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Pb(a,c,!0)?"html-num-fmt"+c:null},function(a){return M(a)||
"string"===typeof a&&-1!==a.indexOf("<")?"html":null}]);h.extend(n.ext.type.search,{html:function(a){return M(a)?a:"string"===typeof a?a.replace(Mb," ").replace(Aa,""):""},string:function(a){return M(a)?a:"string"===typeof a?a.replace(Mb," "):a}});var za=function(a,b,c,d){if(0!==a&&(!a||"-"===a))return-Infinity;b&&(a=Ob(a,b));a.replace&&(c&&(a=a.replace(c,"")),d&&(a=a.replace(d,"")));return 1*a};h.extend(x.type.order,{"date-pre":function(a){a=Date.parse(a);return isNaN(a)?-Infinity:a},"html-pre":function(a){return M(a)?
"":a.replace?a.replace(/<.*?>/g,"").toLowerCase():a+""},"string-pre":function(a){return M(a)?"":"string"===typeof a?a.toLowerCase():!a.toString?"":a.toString()},"string-asc":function(a,b){return a<b?-1:a>b?1:0},"string-desc":function(a,b){return a<b?1:a>b?-1:0}});Da("");h.extend(!0,n.ext.renderer,{header:{_:function(a,b,c,d){h(a.nTable).on("order.dt.DT",function(e,f,g,h){if(a===f){e=c.idx;b.removeClass(c.sSortingClass+" "+d.sSortAsc+" "+d.sSortDesc).addClass(h[e]=="asc"?d.sSortAsc:h[e]=="desc"?d.sSortDesc:
c.sSortingClass)}})},jqueryui:function(a,b,c,d){h("<div/>").addClass(d.sSortJUIWrapper).append(b.contents()).append(h("<span/>").addClass(d.sSortIcon+" "+c.sSortingClassJUI)).appendTo(b);h(a.nTable).on("order.dt.DT",function(e,f,g,h){if(a===f){e=c.idx;b.removeClass(d.sSortAsc+" "+d.sSortDesc).addClass(h[e]=="asc"?d.sSortAsc:h[e]=="desc"?d.sSortDesc:c.sSortingClass);b.find("span."+d.sSortIcon).removeClass(d.sSortJUIAsc+" "+d.sSortJUIDesc+" "+d.sSortJUI+" "+d.sSortJUIAscAllowed+" "+d.sSortJUIDescAllowed).addClass(h[e]==
"asc"?d.sSortJUIAsc:h[e]=="desc"?d.sSortJUIDesc:c.sSortingClassJUI)}})}}});var Vb=function(a){return"string"===typeof a?a.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):a};n.render={number:function(a,b,c,d,e){return{display:function(f){if("number"!==typeof f&&"string"!==typeof f)return f;var g=0>f?"-":"",h=parseFloat(f);if(isNaN(h))return Vb(f);h=h.toFixed(c);f=Math.abs(h);h=parseInt(f,10);f=c?b+(f-h).toFixed(c).substring(2):"";return g+(d||"")+h.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
a)+f+(e||"")}}},text:function(){return{display:Vb}}};h.extend(n.ext.internal,{_fnExternApiFunc:Lb,_fnBuildAjax:sa,_fnAjaxUpdate:lb,_fnAjaxParameters:ub,_fnAjaxUpdateDraw:vb,_fnAjaxDataSrc:ta,_fnAddColumn:Ea,_fnColumnOptions:ka,_fnAdjustColumnSizing:$,_fnVisibleToColumnIndex:aa,_fnColumnIndexToVisible:ba,_fnVisbleColumns:V,_fnGetColumns:ma,_fnColumnTypes:Ga,_fnApplyColumnDefs:ib,_fnHungarianMap:Z,_fnCamelToHungarian:J,_fnLanguageCompat:Ca,_fnBrowserDetect:gb,_fnAddData:O,_fnAddTr:na,_fnNodeToDataIndex:function(a,
b){return b._DT_RowIndex!==k?b._DT_RowIndex:null},_fnNodeToColumnIndex:function(a,b,c){return h.inArray(c,a.aoData[b].anCells)},_fnGetCellData:B,_fnSetCellData:jb,_fnSplitObjNotation:Ja,_fnGetObjectDataFn:S,_fnSetObjectDataFn:N,_fnGetDataMaster:Ka,_fnClearTable:oa,_fnDeleteIndex:pa,_fnInvalidate:da,_fnGetRowElements:Ia,_fnCreateTr:Ha,_fnBuildHead:kb,_fnDrawHead:fa,_fnDraw:P,_fnReDraw:T,_fnAddOptionsHtml:nb,_fnDetectHeader:ea,_fnGetUniqueThs:ra,_fnFeatureHtmlFilter:pb,_fnFilterComplete:ga,_fnFilterCustom:yb,
_fnFilterColumn:xb,_fnFilter:wb,_fnFilterCreateSearch:Pa,_fnEscapeRegex:Qa,_fnFilterData:zb,_fnFeatureHtmlInfo:sb,_fnUpdateInfo:Cb,_fnInfoMacros:Db,_fnInitialise:ha,_fnInitComplete:ua,_fnLengthChange:Ra,_fnFeatureHtmlLength:ob,_fnFeatureHtmlPaginate:tb,_fnPageChange:Ta,_fnFeatureHtmlProcessing:qb,_fnProcessingDisplay:C,_fnFeatureHtmlTable:rb,_fnScrollDraw:la,_fnApplyToChildren:I,_fnCalculateColumnWidths:Fa,_fnThrottle:Oa,_fnConvertToWidth:Eb,_fnGetWidestNode:Fb,_fnGetMaxLenString:Gb,_fnStringToCss:v,
_fnSortFlatten:X,_fnSort:mb,_fnSortAria:Ib,_fnSortListener:Va,_fnSortAttachListener:Ma,_fnSortingClasses:wa,_fnSortData:Hb,_fnSaveState:xa,_fnLoadState:Jb,_fnSettingsFromNode:ya,_fnLog:K,_fnMap:F,_fnBindAction:Wa,_fnCallbackReg:z,_fnCallbackFire:r,_fnLengthOverflow:Sa,_fnRenderer:Na,_fnDataSource:y,_fnRowAttributes:La,_fnExtend:Xa,_fnCalculateEnd:function(){}});h.fn.dataTable=n;n.$=h;h.fn.dataTableSettings=n.settings;h.fn.dataTableExt=n.ext;h.fn.DataTable=function(a){return h(this).dataTable(a).api()};
h.each(n,function(a,b){h.fn.DataTable[a]=b});return h.fn.dataTable});
/*
 Copyright (C) Federico Zivolo 2017
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */(function(e,t){'object'==typeof exports&&'undefined'!=typeof module?module.exports=t():'function'==typeof define&&define.amd?define(t):e.Popper=t()})(this,function(){'use strict';function e(e){return e&&'[object Function]'==={}.toString.call(e)}function t(e,t){if(1!==e.nodeType)return[];var o=getComputedStyle(e,null);return t?o[t]:o}function o(e){return'HTML'===e.nodeName?e:e.parentNode||e.host}function n(e){if(!e)return document.body;switch(e.nodeName){case'HTML':case'BODY':return e.ownerDocument.body;case'#document':return e.body;}var i=t(e),r=i.overflow,p=i.overflowX,s=i.overflowY;return /(auto|scroll)/.test(r+s+p)?e:n(o(e))}function r(e){var o=e&&e.offsetParent,i=o&&o.nodeName;return i&&'BODY'!==i&&'HTML'!==i?-1!==['TD','TABLE'].indexOf(o.nodeName)&&'static'===t(o,'position')?r(o):o:e?e.ownerDocument.documentElement:document.documentElement}function p(e){var t=e.nodeName;return'BODY'!==t&&('HTML'===t||r(e.firstElementChild)===e)}function s(e){return null===e.parentNode?e:s(e.parentNode)}function d(e,t){if(!e||!e.nodeType||!t||!t.nodeType)return document.documentElement;var o=e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING,i=o?e:t,n=o?t:e,a=document.createRange();a.setStart(i,0),a.setEnd(n,0);var l=a.commonAncestorContainer;if(e!==l&&t!==l||i.contains(n))return p(l)?l:r(l);var f=s(e);return f.host?d(f.host,t):d(e,s(t).host)}function a(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:'top',o='top'===t?'scrollTop':'scrollLeft',i=e.nodeName;if('BODY'===i||'HTML'===i){var n=e.ownerDocument.documentElement,r=e.ownerDocument.scrollingElement||n;return r[o]}return e[o]}function l(e,t){var o=2<arguments.length&&void 0!==arguments[2]&&arguments[2],i=a(t,'top'),n=a(t,'left'),r=o?-1:1;return e.top+=i*r,e.bottom+=i*r,e.left+=n*r,e.right+=n*r,e}function f(e,t){var o='x'===t?'Left':'Top',i='Left'==o?'Right':'Bottom';return parseFloat(e['border'+o+'Width'],10)+parseFloat(e['border'+i+'Width'],10)}function m(e,t,o,i){return J(t['offset'+e],t['scroll'+e],o['client'+e],o['offset'+e],o['scroll'+e],ie()?o['offset'+e]+i['margin'+('Height'===e?'Top':'Left')]+i['margin'+('Height'===e?'Bottom':'Right')]:0)}function h(){var e=document.body,t=document.documentElement,o=ie()&&getComputedStyle(t);return{height:m('Height',e,t,o),width:m('Width',e,t,o)}}function c(e){return se({},e,{right:e.left+e.width,bottom:e.top+e.height})}function g(e){var o={};if(ie())try{o=e.getBoundingClientRect();var i=a(e,'top'),n=a(e,'left');o.top+=i,o.left+=n,o.bottom+=i,o.right+=n}catch(e){}else o=e.getBoundingClientRect();var r={left:o.left,top:o.top,width:o.right-o.left,height:o.bottom-o.top},p='HTML'===e.nodeName?h():{},s=p.width||e.clientWidth||r.right-r.left,d=p.height||e.clientHeight||r.bottom-r.top,l=e.offsetWidth-s,m=e.offsetHeight-d;if(l||m){var g=t(e);l-=f(g,'x'),m-=f(g,'y'),r.width-=l,r.height-=m}return c(r)}function u(e,o){var i=ie(),r='HTML'===o.nodeName,p=g(e),s=g(o),d=n(e),a=t(o),f=parseFloat(a.borderTopWidth,10),m=parseFloat(a.borderLeftWidth,10),h=c({top:p.top-s.top-f,left:p.left-s.left-m,width:p.width,height:p.height});if(h.marginTop=0,h.marginLeft=0,!i&&r){var u=parseFloat(a.marginTop,10),b=parseFloat(a.marginLeft,10);h.top-=f-u,h.bottom-=f-u,h.left-=m-b,h.right-=m-b,h.marginTop=u,h.marginLeft=b}return(i?o.contains(d):o===d&&'BODY'!==d.nodeName)&&(h=l(h,o)),h}function b(e){var t=e.ownerDocument.documentElement,o=u(e,t),i=J(t.clientWidth,window.innerWidth||0),n=J(t.clientHeight,window.innerHeight||0),r=a(t),p=a(t,'left'),s={top:r-o.top+o.marginTop,left:p-o.left+o.marginLeft,width:i,height:n};return c(s)}function w(e){var i=e.nodeName;return'BODY'===i||'HTML'===i?!1:'fixed'===t(e,'position')||w(o(e))}function y(e,t,i,r){var p={top:0,left:0},s=d(e,t);if('viewport'===r)p=b(s);else{var a;'scrollParent'===r?(a=n(o(t)),'BODY'===a.nodeName&&(a=e.ownerDocument.documentElement)):'window'===r?a=e.ownerDocument.documentElement:a=r;var l=u(a,s);if('HTML'===a.nodeName&&!w(s)){var f=h(),m=f.height,c=f.width;p.top+=l.top-l.marginTop,p.bottom=m+l.top,p.left+=l.left-l.marginLeft,p.right=c+l.left}else p=l}return p.left+=i,p.top+=i,p.right-=i,p.bottom-=i,p}function E(e){var t=e.width,o=e.height;return t*o}function v(e,t,o,i,n){var r=5<arguments.length&&void 0!==arguments[5]?arguments[5]:0;if(-1===e.indexOf('auto'))return e;var p=y(o,i,r,n),s={top:{width:p.width,height:t.top-p.top},right:{width:p.right-t.right,height:p.height},bottom:{width:p.width,height:p.bottom-t.bottom},left:{width:t.left-p.left,height:p.height}},d=Object.keys(s).map(function(e){return se({key:e},s[e],{area:E(s[e])})}).sort(function(e,t){return t.area-e.area}),a=d.filter(function(e){var t=e.width,i=e.height;return t>=o.clientWidth&&i>=o.clientHeight}),l=0<a.length?a[0].key:d[0].key,f=e.split('-')[1];return l+(f?'-'+f:'')}function O(e,t,o){var i=d(t,o);return u(o,i)}function L(e){var t=getComputedStyle(e),o=parseFloat(t.marginTop)+parseFloat(t.marginBottom),i=parseFloat(t.marginLeft)+parseFloat(t.marginRight),n={width:e.offsetWidth+i,height:e.offsetHeight+o};return n}function x(e){var t={left:'right',right:'left',bottom:'top',top:'bottom'};return e.replace(/left|right|bottom|top/g,function(e){return t[e]})}function S(e,t,o){o=o.split('-')[0];var i=L(e),n={width:i.width,height:i.height},r=-1!==['right','left'].indexOf(o),p=r?'top':'left',s=r?'left':'top',d=r?'height':'width',a=r?'width':'height';return n[p]=t[p]+t[d]/2-i[d]/2,n[s]=o===s?t[s]-i[a]:t[x(s)],n}function T(e,t){return Array.prototype.find?e.find(t):e.filter(t)[0]}function D(e,t,o){if(Array.prototype.findIndex)return e.findIndex(function(e){return e[t]===o});var i=T(e,function(e){return e[t]===o});return e.indexOf(i)}function C(t,o,i){var n=void 0===i?t:t.slice(0,D(t,'name',i));return n.forEach(function(t){t['function']&&console.warn('`modifier.function` is deprecated, use `modifier.fn`!');var i=t['function']||t.fn;t.enabled&&e(i)&&(o.offsets.popper=c(o.offsets.popper),o.offsets.reference=c(o.offsets.reference),o=i(o,t))}),o}function N(){if(!this.state.isDestroyed){var e={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};e.offsets.reference=O(this.state,this.popper,this.reference),e.placement=v(this.options.placement,e.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),e.originalPlacement=e.placement,e.offsets.popper=S(this.popper,e.offsets.reference,e.placement),e.offsets.popper.position='absolute',e=C(this.modifiers,e),this.state.isCreated?this.options.onUpdate(e):(this.state.isCreated=!0,this.options.onCreate(e))}}function k(e,t){return e.some(function(e){var o=e.name,i=e.enabled;return i&&o===t})}function W(e){for(var t=[!1,'ms','Webkit','Moz','O'],o=e.charAt(0).toUpperCase()+e.slice(1),n=0;n<t.length-1;n++){var i=t[n],r=i?''+i+o:e;if('undefined'!=typeof document.body.style[r])return r}return null}function P(){return this.state.isDestroyed=!0,k(this.modifiers,'applyStyle')&&(this.popper.removeAttribute('x-placement'),this.popper.style.left='',this.popper.style.position='',this.popper.style.top='',this.popper.style[W('transform')]=''),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function B(e){var t=e.ownerDocument;return t?t.defaultView:window}function H(e,t,o,i){var r='BODY'===e.nodeName,p=r?e.ownerDocument.defaultView:e;p.addEventListener(t,o,{passive:!0}),r||H(n(p.parentNode),t,o,i),i.push(p)}function A(e,t,o,i){o.updateBound=i,B(e).addEventListener('resize',o.updateBound,{passive:!0});var r=n(e);return H(r,'scroll',o.updateBound,o.scrollParents),o.scrollElement=r,o.eventsEnabled=!0,o}function I(){this.state.eventsEnabled||(this.state=A(this.reference,this.options,this.state,this.scheduleUpdate))}function M(e,t){return B(e).removeEventListener('resize',t.updateBound),t.scrollParents.forEach(function(e){e.removeEventListener('scroll',t.updateBound)}),t.updateBound=null,t.scrollParents=[],t.scrollElement=null,t.eventsEnabled=!1,t}function R(){this.state.eventsEnabled&&(cancelAnimationFrame(this.scheduleUpdate),this.state=M(this.reference,this.state))}function U(e){return''!==e&&!isNaN(parseFloat(e))&&isFinite(e)}function Y(e,t){Object.keys(t).forEach(function(o){var i='';-1!==['width','height','top','right','bottom','left'].indexOf(o)&&U(t[o])&&(i='px'),e.style[o]=t[o]+i})}function j(e,t){Object.keys(t).forEach(function(o){var i=t[o];!1===i?e.removeAttribute(o):e.setAttribute(o,t[o])})}function F(e,t,o){var i=T(e,function(e){var o=e.name;return o===t}),n=!!i&&e.some(function(e){return e.name===o&&e.enabled&&e.order<i.order});if(!n){var r='`'+t+'`';console.warn('`'+o+'`'+' modifier is required by '+r+' modifier in order to work, be sure to include it before '+r+'!')}return n}function K(e){return'end'===e?'start':'start'===e?'end':e}function q(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1],o=ae.indexOf(e),i=ae.slice(o+1).concat(ae.slice(0,o));return t?i.reverse():i}function V(e,t,o,i){var n=e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),r=+n[1],p=n[2];if(!r)return e;if(0===p.indexOf('%')){var s;switch(p){case'%p':s=o;break;case'%':case'%r':default:s=i;}var d=c(s);return d[t]/100*r}if('vh'===p||'vw'===p){var a;return a='vh'===p?J(document.documentElement.clientHeight,window.innerHeight||0):J(document.documentElement.clientWidth,window.innerWidth||0),a/100*r}return r}function z(e,t,o,i){var n=[0,0],r=-1!==['right','left'].indexOf(i),p=e.split(/(\+|\-)/).map(function(e){return e.trim()}),s=p.indexOf(T(p,function(e){return-1!==e.search(/,|\s/)}));p[s]&&-1===p[s].indexOf(',')&&console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');var d=/\s*,\s*|\s+/,a=-1===s?[p]:[p.slice(0,s).concat([p[s].split(d)[0]]),[p[s].split(d)[1]].concat(p.slice(s+1))];return a=a.map(function(e,i){var n=(1===i?!r:r)?'height':'width',p=!1;return e.reduce(function(e,t){return''===e[e.length-1]&&-1!==['+','-'].indexOf(t)?(e[e.length-1]=t,p=!0,e):p?(e[e.length-1]+=t,p=!1,e):e.concat(t)},[]).map(function(e){return V(e,n,t,o)})}),a.forEach(function(e,t){e.forEach(function(o,i){U(o)&&(n[t]+=o*('-'===e[i-1]?-1:1))})}),n}function G(e,t){var o,i=t.offset,n=e.placement,r=e.offsets,p=r.popper,s=r.reference,d=n.split('-')[0];return o=U(+i)?[+i,0]:z(i,p,s,d),'left'===d?(p.top+=o[0],p.left-=o[1]):'right'===d?(p.top+=o[0],p.left+=o[1]):'top'===d?(p.left+=o[0],p.top-=o[1]):'bottom'===d&&(p.left+=o[0],p.top+=o[1]),e.popper=p,e}for(var _=Math.min,X=Math.floor,J=Math.max,Q='undefined'!=typeof window&&'undefined'!=typeof document,Z=['Edge','Trident','Firefox'],$=0,ee=0;ee<Z.length;ee+=1)if(Q&&0<=navigator.userAgent.indexOf(Z[ee])){$=1;break}var i,te=Q&&window.Promise,oe=te?function(e){var t=!1;return function(){t||(t=!0,window.Promise.resolve().then(function(){t=!1,e()}))}}:function(e){var t=!1;return function(){t||(t=!0,setTimeout(function(){t=!1,e()},$))}},ie=function(){return void 0==i&&(i=-1!==navigator.appVersion.indexOf('MSIE 10')),i},ne=function(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')},re=function(){function e(e,t){for(var o,n=0;n<t.length;n++)o=t[n],o.enumerable=o.enumerable||!1,o.configurable=!0,'value'in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}return function(t,o,i){return o&&e(t.prototype,o),i&&e(t,i),t}}(),pe=function(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e},se=Object.assign||function(e){for(var t,o=1;o<arguments.length;o++)for(var i in t=arguments[o],t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},de=['auto-start','auto','auto-end','top-start','top','top-end','right-start','right','right-end','bottom-end','bottom','bottom-start','left-end','left','left-start'],ae=de.slice(3),le={FLIP:'flip',CLOCKWISE:'clockwise',COUNTERCLOCKWISE:'counterclockwise'},fe=function(){function t(o,i){var n=this,r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};ne(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(n.update)},this.update=oe(this.update.bind(this)),this.options=se({},t.Defaults,r),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=o&&o.jquery?o[0]:o,this.popper=i&&i.jquery?i[0]:i,this.options.modifiers={},Object.keys(se({},t.Defaults.modifiers,r.modifiers)).forEach(function(e){n.options.modifiers[e]=se({},t.Defaults.modifiers[e]||{},r.modifiers?r.modifiers[e]:{})}),this.modifiers=Object.keys(this.options.modifiers).map(function(e){return se({name:e},n.options.modifiers[e])}).sort(function(e,t){return e.order-t.order}),this.modifiers.forEach(function(t){t.enabled&&e(t.onLoad)&&t.onLoad(n.reference,n.popper,n.options,t,n.state)}),this.update();var p=this.options.eventsEnabled;p&&this.enableEventListeners(),this.state.eventsEnabled=p}return re(t,[{key:'update',value:function(){return N.call(this)}},{key:'destroy',value:function(){return P.call(this)}},{key:'enableEventListeners',value:function(){return I.call(this)}},{key:'disableEventListeners',value:function(){return R.call(this)}}]),t}();return fe.Utils=('undefined'==typeof window?global:window).PopperUtils,fe.placements=de,fe.Defaults={placement:'bottom',eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:{shift:{order:100,enabled:!0,fn:function(e){var t=e.placement,o=t.split('-')[0],i=t.split('-')[1];if(i){var n=e.offsets,r=n.reference,p=n.popper,s=-1!==['bottom','top'].indexOf(o),d=s?'left':'top',a=s?'width':'height',l={start:pe({},d,r[d]),end:pe({},d,r[d]+r[a]-p[a])};e.offsets.popper=se({},p,l[i])}return e}},offset:{order:200,enabled:!0,fn:G,offset:0},preventOverflow:{order:300,enabled:!0,fn:function(e,t){var o=t.boundariesElement||r(e.instance.popper);e.instance.reference===o&&(o=r(o));var i=y(e.instance.popper,e.instance.reference,t.padding,o);t.boundaries=i;var n=t.priority,p=e.offsets.popper,s={primary:function(e){var o=p[e];return p[e]<i[e]&&!t.escapeWithReference&&(o=J(p[e],i[e])),pe({},e,o)},secondary:function(e){var o='right'===e?'left':'top',n=p[o];return p[e]>i[e]&&!t.escapeWithReference&&(n=_(p[o],i[e]-('right'===e?p.width:p.height))),pe({},o,n)}};return n.forEach(function(e){var t=-1===['left','top'].indexOf(e)?'secondary':'primary';p=se({},p,s[t](e))}),e.offsets.popper=p,e},priority:['left','right','top','bottom'],padding:5,boundariesElement:'scrollParent'},keepTogether:{order:400,enabled:!0,fn:function(e){var t=e.offsets,o=t.popper,i=t.reference,n=e.placement.split('-')[0],r=X,p=-1!==['top','bottom'].indexOf(n),s=p?'right':'bottom',d=p?'left':'top',a=p?'width':'height';return o[s]<r(i[d])&&(e.offsets.popper[d]=r(i[d])-o[a]),o[d]>r(i[s])&&(e.offsets.popper[d]=r(i[s])),e}},arrow:{order:500,enabled:!0,fn:function(e,o){var i;if(!F(e.instance.modifiers,'arrow','keepTogether'))return e;var n=o.element;if('string'==typeof n){if(n=e.instance.popper.querySelector(n),!n)return e;}else if(!e.instance.popper.contains(n))return console.warn('WARNING: `arrow.element` must be child of its popper element!'),e;var r=e.placement.split('-')[0],p=e.offsets,s=p.popper,d=p.reference,a=-1!==['left','right'].indexOf(r),l=a?'height':'width',f=a?'Top':'Left',m=f.toLowerCase(),h=a?'left':'top',g=a?'bottom':'right',u=L(n)[l];d[g]-u<s[m]&&(e.offsets.popper[m]-=s[m]-(d[g]-u)),d[m]+u>s[g]&&(e.offsets.popper[m]+=d[m]+u-s[g]),e.offsets.popper=c(e.offsets.popper);var b=d[m]+d[l]/2-u/2,w=t(e.instance.popper),y=parseFloat(w['margin'+f],10),E=parseFloat(w['border'+f+'Width'],10),v=b-e.offsets.popper[m]-y-E;return v=J(_(s[l]-u,v),0),e.arrowElement=n,e.offsets.arrow=(i={},pe(i,m,Math.round(v)),pe(i,h,''),i),e},element:'[x-arrow]'},flip:{order:600,enabled:!0,fn:function(e,t){if(k(e.instance.modifiers,'inner'))return e;if(e.flipped&&e.placement===e.originalPlacement)return e;var o=y(e.instance.popper,e.instance.reference,t.padding,t.boundariesElement),i=e.placement.split('-')[0],n=x(i),r=e.placement.split('-')[1]||'',p=[];switch(t.behavior){case le.FLIP:p=[i,n];break;case le.CLOCKWISE:p=q(i);break;case le.COUNTERCLOCKWISE:p=q(i,!0);break;default:p=t.behavior;}return p.forEach(function(s,d){if(i!==s||p.length===d+1)return e;i=e.placement.split('-')[0],n=x(i);var a=e.offsets.popper,l=e.offsets.reference,f=X,m='left'===i&&f(a.right)>f(l.left)||'right'===i&&f(a.left)<f(l.right)||'top'===i&&f(a.bottom)>f(l.top)||'bottom'===i&&f(a.top)<f(l.bottom),h=f(a.left)<f(o.left),c=f(a.right)>f(o.right),g=f(a.top)<f(o.top),u=f(a.bottom)>f(o.bottom),b='left'===i&&h||'right'===i&&c||'top'===i&&g||'bottom'===i&&u,w=-1!==['top','bottom'].indexOf(i),y=!!t.flipVariations&&(w&&'start'===r&&h||w&&'end'===r&&c||!w&&'start'===r&&g||!w&&'end'===r&&u);(m||b||y)&&(e.flipped=!0,(m||b)&&(i=p[d+1]),y&&(r=K(r)),e.placement=i+(r?'-'+r:''),e.offsets.popper=se({},e.offsets.popper,S(e.instance.popper,e.offsets.reference,e.placement)),e=C(e.instance.modifiers,e,'flip'))}),e},behavior:'flip',padding:5,boundariesElement:'viewport'},inner:{order:700,enabled:!1,fn:function(e){var t=e.placement,o=t.split('-')[0],i=e.offsets,n=i.popper,r=i.reference,p=-1!==['left','right'].indexOf(o),s=-1===['top','left'].indexOf(o);return n[p?'left':'top']=r[o]-(s?n[p?'width':'height']:0),e.placement=x(t),e.offsets.popper=c(n),e}},hide:{order:800,enabled:!0,fn:function(e){if(!F(e.instance.modifiers,'hide','preventOverflow'))return e;var t=e.offsets.reference,o=T(e.instance.modifiers,function(e){return'preventOverflow'===e.name}).boundaries;if(t.bottom<o.top||t.left>o.right||t.top>o.bottom||t.right<o.left){if(!0===e.hide)return e;e.hide=!0,e.attributes['x-out-of-boundaries']=''}else{if(!1===e.hide)return e;e.hide=!1,e.attributes['x-out-of-boundaries']=!1}return e}},computeStyle:{order:850,enabled:!0,fn:function(e,t){var o=t.x,i=t.y,n=e.offsets.popper,p=T(e.instance.modifiers,function(e){return'applyStyle'===e.name}).gpuAcceleration;void 0!==p&&console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');var s,d,a=void 0===p?t.gpuAcceleration:p,l=r(e.instance.popper),f=g(l),m={position:n.position},h={left:X(n.left),top:X(n.top),bottom:X(n.bottom),right:X(n.right)},c='bottom'===o?'top':'bottom',u='right'===i?'left':'right',b=W('transform');if(d='bottom'==c?-f.height+h.bottom:h.top,s='right'==u?-f.width+h.right:h.left,a&&b)m[b]='translate3d('+s+'px, '+d+'px, 0)',m[c]=0,m[u]=0,m.willChange='transform';else{var w='bottom'==c?-1:1,y='right'==u?-1:1;m[c]=d*w,m[u]=s*y,m.willChange=c+', '+u}var E={"x-placement":e.placement};return e.attributes=se({},E,e.attributes),e.styles=se({},m,e.styles),e.arrowStyles=se({},e.offsets.arrow,e.arrowStyles),e},gpuAcceleration:!0,x:'bottom',y:'right'},applyStyle:{order:900,enabled:!0,fn:function(e){return Y(e.instance.popper,e.styles),j(e.instance.popper,e.attributes),e.arrowElement&&Object.keys(e.arrowStyles).length&&Y(e.arrowElement,e.arrowStyles),e},onLoad:function(e,t,o,i,n){var r=O(n,t,e),p=v(o.placement,r,t,e,o.modifiers.flip.boundariesElement,o.modifiers.flip.padding);return t.setAttribute('x-placement',p),Y(t,{position:'absolute'}),o},gpuAcceleration:void 0}}},fe});
//# sourceMappingURL=popper.min.js.map

/*!
  * Bootstrap v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("jquery"),require("popper.js")):"function"==typeof define&&define.amd?define(["exports","jquery","popper.js"],e):e((t=t||self).bootstrap={},t.jQuery,t.Popper)}(this,function(t,g,u){"use strict";function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function s(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}function l(o){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},e=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(e=e.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),e.forEach(function(t){var e,n,i;e=o,i=r[n=t],n in e?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i})}return o}g=g&&g.hasOwnProperty("default")?g.default:g,u=u&&u.hasOwnProperty("default")?u.default:u;var e="transitionend";function n(t){var e=this,n=!1;return g(this).one(_.TRANSITION_END,function(){n=!0}),setTimeout(function(){n||_.triggerTransitionEnd(e)},t),this}var _={TRANSITION_END:"bsTransitionEnd",getUID:function(t){for(;t+=~~(1e6*Math.random()),document.getElementById(t););return t},getSelectorFromElement:function(t){var e=t.getAttribute("data-target");if(!e||"#"===e){var n=t.getAttribute("href");e=n&&"#"!==n?n.trim():""}try{return document.querySelector(e)?e:null}catch(t){return null}},getTransitionDurationFromElement:function(t){if(!t)return 0;var e=g(t).css("transition-duration"),n=g(t).css("transition-delay"),i=parseFloat(e),o=parseFloat(n);return i||o?(e=e.split(",")[0],n=n.split(",")[0],1e3*(parseFloat(e)+parseFloat(n))):0},reflow:function(t){return t.offsetHeight},triggerTransitionEnd:function(t){g(t).trigger(e)},supportsTransitionEnd:function(){return Boolean(e)},isElement:function(t){return(t[0]||t).nodeType},typeCheckConfig:function(t,e,n){for(var i in n)if(Object.prototype.hasOwnProperty.call(n,i)){var o=n[i],r=e[i],s=r&&_.isElement(r)?"element":(a=r,{}.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase());if(!new RegExp(o).test(s))throw new Error(t.toUpperCase()+': Option "'+i+'" provided type "'+s+'" but expected type "'+o+'".')}var a},findShadowRoot:function(t){if(!document.documentElement.attachShadow)return null;if("function"!=typeof t.getRootNode)return t instanceof ShadowRoot?t:t.parentNode?_.findShadowRoot(t.parentNode):null;var e=t.getRootNode();return e instanceof ShadowRoot?e:null}};g.fn.emulateTransitionEnd=n,g.event.special[_.TRANSITION_END]={bindType:e,delegateType:e,handle:function(t){if(g(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}};var o="alert",r="bs.alert",a="."+r,c=g.fn[o],h={CLOSE:"close"+a,CLOSED:"closed"+a,CLICK_DATA_API:"click"+a+".data-api"},f="alert",d="fade",m="show",p=function(){function i(t){this._element=t}var t=i.prototype;return t.close=function(t){var e=this._element;t&&(e=this._getRootElement(t)),this._triggerCloseEvent(e).isDefaultPrevented()||this._removeElement(e)},t.dispose=function(){g.removeData(this._element,r),this._element=null},t._getRootElement=function(t){var e=_.getSelectorFromElement(t),n=!1;return e&&(n=document.querySelector(e)),n||(n=g(t).closest("."+f)[0]),n},t._triggerCloseEvent=function(t){var e=g.Event(h.CLOSE);return g(t).trigger(e),e},t._removeElement=function(e){var n=this;if(g(e).removeClass(m),g(e).hasClass(d)){var t=_.getTransitionDurationFromElement(e);g(e).one(_.TRANSITION_END,function(t){return n._destroyElement(e,t)}).emulateTransitionEnd(t)}else this._destroyElement(e)},t._destroyElement=function(t){g(t).detach().trigger(h.CLOSED).remove()},i._jQueryInterface=function(n){return this.each(function(){var t=g(this),e=t.data(r);e||(e=new i(this),t.data(r,e)),"close"===n&&e[n](this)})},i._handleDismiss=function(e){return function(t){t&&t.preventDefault(),e.close(this)}},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}}]),i}();g(document).on(h.CLICK_DATA_API,'[data-dismiss="alert"]',p._handleDismiss(new p)),g.fn[o]=p._jQueryInterface,g.fn[o].Constructor=p,g.fn[o].noConflict=function(){return g.fn[o]=c,p._jQueryInterface};var v="button",y="bs.button",E="."+y,C=".data-api",T=g.fn[v],S="active",b="btn",I="focus",D='[data-toggle^="button"]',w='[data-toggle="buttons"]',A='input:not([type="hidden"])',N=".active",O=".btn",k={CLICK_DATA_API:"click"+E+C,FOCUS_BLUR_DATA_API:"focus"+E+C+" blur"+E+C},P=function(){function n(t){this._element=t}var t=n.prototype;return t.toggle=function(){var t=!0,e=!0,n=g(this._element).closest(w)[0];if(n){var i=this._element.querySelector(A);if(i){if("radio"===i.type)if(i.checked&&this._element.classList.contains(S))t=!1;else{var o=n.querySelector(N);o&&g(o).removeClass(S)}if(t){if(i.hasAttribute("disabled")||n.hasAttribute("disabled")||i.classList.contains("disabled")||n.classList.contains("disabled"))return;i.checked=!this._element.classList.contains(S),g(i).trigger("change")}i.focus(),e=!1}}e&&this._element.setAttribute("aria-pressed",!this._element.classList.contains(S)),t&&g(this._element).toggleClass(S)},t.dispose=function(){g.removeData(this._element,y),this._element=null},n._jQueryInterface=function(e){return this.each(function(){var t=g(this).data(y);t||(t=new n(this),g(this).data(y,t)),"toggle"===e&&t[e]()})},s(n,null,[{key:"VERSION",get:function(){return"4.3.1"}}]),n}();g(document).on(k.CLICK_DATA_API,D,function(t){t.preventDefault();var e=t.target;g(e).hasClass(b)||(e=g(e).closest(O)),P._jQueryInterface.call(g(e),"toggle")}).on(k.FOCUS_BLUR_DATA_API,D,function(t){var e=g(t.target).closest(O)[0];g(e).toggleClass(I,/^focus(in)?$/.test(t.type))}),g.fn[v]=P._jQueryInterface,g.fn[v].Constructor=P,g.fn[v].noConflict=function(){return g.fn[v]=T,P._jQueryInterface};var L="carousel",j="bs.carousel",H="."+j,R=".data-api",x=g.fn[L],F={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},U={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},W="next",q="prev",M="left",K="right",Q={SLIDE:"slide"+H,SLID:"slid"+H,KEYDOWN:"keydown"+H,MOUSEENTER:"mouseenter"+H,MOUSELEAVE:"mouseleave"+H,TOUCHSTART:"touchstart"+H,TOUCHMOVE:"touchmove"+H,TOUCHEND:"touchend"+H,POINTERDOWN:"pointerdown"+H,POINTERUP:"pointerup"+H,DRAG_START:"dragstart"+H,LOAD_DATA_API:"load"+H+R,CLICK_DATA_API:"click"+H+R},B="carousel",V="active",Y="slide",z="carousel-item-right",X="carousel-item-left",$="carousel-item-next",G="carousel-item-prev",J="pointer-event",Z=".active",tt=".active.carousel-item",et=".carousel-item",nt=".carousel-item img",it=".carousel-item-next, .carousel-item-prev",ot=".carousel-indicators",rt="[data-slide], [data-slide-to]",st='[data-ride="carousel"]',at={TOUCH:"touch",PEN:"pen"},lt=function(){function r(t,e){this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this.touchStartX=0,this.touchDeltaX=0,this._config=this._getConfig(e),this._element=t,this._indicatorsElement=this._element.querySelector(ot),this._touchSupported="ontouchstart"in document.documentElement||0<navigator.maxTouchPoints,this._pointerEvent=Boolean(window.PointerEvent||window.MSPointerEvent),this._addEventListeners()}var t=r.prototype;return t.next=function(){this._isSliding||this._slide(W)},t.nextWhenVisible=function(){!document.hidden&&g(this._element).is(":visible")&&"hidden"!==g(this._element).css("visibility")&&this.next()},t.prev=function(){this._isSliding||this._slide(q)},t.pause=function(t){t||(this._isPaused=!0),this._element.querySelector(it)&&(_.triggerTransitionEnd(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null},t.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config.interval&&!this._isPaused&&(this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))},t.to=function(t){var e=this;this._activeElement=this._element.querySelector(tt);var n=this._getItemIndex(this._activeElement);if(!(t>this._items.length-1||t<0))if(this._isSliding)g(this._element).one(Q.SLID,function(){return e.to(t)});else{if(n===t)return this.pause(),void this.cycle();var i=n<t?W:q;this._slide(i,this._items[t])}},t.dispose=function(){g(this._element).off(H),g.removeData(this._element,j),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null},t._getConfig=function(t){return t=l({},F,t),_.typeCheckConfig(L,t,U),t},t._handleSwipe=function(){var t=Math.abs(this.touchDeltaX);if(!(t<=40)){var e=t/this.touchDeltaX;0<e&&this.prev(),e<0&&this.next()}},t._addEventListeners=function(){var e=this;this._config.keyboard&&g(this._element).on(Q.KEYDOWN,function(t){return e._keydown(t)}),"hover"===this._config.pause&&g(this._element).on(Q.MOUSEENTER,function(t){return e.pause(t)}).on(Q.MOUSELEAVE,function(t){return e.cycle(t)}),this._config.touch&&this._addTouchEventListeners()},t._addTouchEventListeners=function(){var n=this;if(this._touchSupported){var e=function(t){n._pointerEvent&&at[t.originalEvent.pointerType.toUpperCase()]?n.touchStartX=t.originalEvent.clientX:n._pointerEvent||(n.touchStartX=t.originalEvent.touches[0].clientX)},i=function(t){n._pointerEvent&&at[t.originalEvent.pointerType.toUpperCase()]&&(n.touchDeltaX=t.originalEvent.clientX-n.touchStartX),n._handleSwipe(),"hover"===n._config.pause&&(n.pause(),n.touchTimeout&&clearTimeout(n.touchTimeout),n.touchTimeout=setTimeout(function(t){return n.cycle(t)},500+n._config.interval))};g(this._element.querySelectorAll(nt)).on(Q.DRAG_START,function(t){return t.preventDefault()}),this._pointerEvent?(g(this._element).on(Q.POINTERDOWN,function(t){return e(t)}),g(this._element).on(Q.POINTERUP,function(t){return i(t)}),this._element.classList.add(J)):(g(this._element).on(Q.TOUCHSTART,function(t){return e(t)}),g(this._element).on(Q.TOUCHMOVE,function(t){var e;(e=t).originalEvent.touches&&1<e.originalEvent.touches.length?n.touchDeltaX=0:n.touchDeltaX=e.originalEvent.touches[0].clientX-n.touchStartX}),g(this._element).on(Q.TOUCHEND,function(t){return i(t)}))}},t._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.which){case 37:t.preventDefault(),this.prev();break;case 39:t.preventDefault(),this.next()}},t._getItemIndex=function(t){return this._items=t&&t.parentNode?[].slice.call(t.parentNode.querySelectorAll(et)):[],this._items.indexOf(t)},t._getItemByDirection=function(t,e){var n=t===W,i=t===q,o=this._getItemIndex(e),r=this._items.length-1;if((i&&0===o||n&&o===r)&&!this._config.wrap)return e;var s=(o+(t===q?-1:1))%this._items.length;return-1===s?this._items[this._items.length-1]:this._items[s]},t._triggerSlideEvent=function(t,e){var n=this._getItemIndex(t),i=this._getItemIndex(this._element.querySelector(tt)),o=g.Event(Q.SLIDE,{relatedTarget:t,direction:e,from:i,to:n});return g(this._element).trigger(o),o},t._setActiveIndicatorElement=function(t){if(this._indicatorsElement){var e=[].slice.call(this._indicatorsElement.querySelectorAll(Z));g(e).removeClass(V);var n=this._indicatorsElement.children[this._getItemIndex(t)];n&&g(n).addClass(V)}},t._slide=function(t,e){var n,i,o,r=this,s=this._element.querySelector(tt),a=this._getItemIndex(s),l=e||s&&this._getItemByDirection(t,s),c=this._getItemIndex(l),h=Boolean(this._interval);if(o=t===W?(n=X,i=$,M):(n=z,i=G,K),l&&g(l).hasClass(V))this._isSliding=!1;else if(!this._triggerSlideEvent(l,o).isDefaultPrevented()&&s&&l){this._isSliding=!0,h&&this.pause(),this._setActiveIndicatorElement(l);var u=g.Event(Q.SLID,{relatedTarget:l,direction:o,from:a,to:c});if(g(this._element).hasClass(Y)){g(l).addClass(i),_.reflow(l),g(s).addClass(n),g(l).addClass(n);var f=parseInt(l.getAttribute("data-interval"),10);this._config.interval=f?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,f):this._config.defaultInterval||this._config.interval;var d=_.getTransitionDurationFromElement(s);g(s).one(_.TRANSITION_END,function(){g(l).removeClass(n+" "+i).addClass(V),g(s).removeClass(V+" "+i+" "+n),r._isSliding=!1,setTimeout(function(){return g(r._element).trigger(u)},0)}).emulateTransitionEnd(d)}else g(s).removeClass(V),g(l).addClass(V),this._isSliding=!1,g(this._element).trigger(u);h&&this.cycle()}},r._jQueryInterface=function(i){return this.each(function(){var t=g(this).data(j),e=l({},F,g(this).data());"object"==typeof i&&(e=l({},e,i));var n="string"==typeof i?i:e.slide;if(t||(t=new r(this,e),g(this).data(j,t)),"number"==typeof i)t.to(i);else if("string"==typeof n){if("undefined"==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n]()}else e.interval&&e.ride&&(t.pause(),t.cycle())})},r._dataApiClickHandler=function(t){var e=_.getSelectorFromElement(this);if(e){var n=g(e)[0];if(n&&g(n).hasClass(B)){var i=l({},g(n).data(),g(this).data()),o=this.getAttribute("data-slide-to");o&&(i.interval=!1),r._jQueryInterface.call(g(n),i),o&&g(n).data(j).to(o),t.preventDefault()}}},s(r,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return F}}]),r}();g(document).on(Q.CLICK_DATA_API,rt,lt._dataApiClickHandler),g(window).on(Q.LOAD_DATA_API,function(){for(var t=[].slice.call(document.querySelectorAll(st)),e=0,n=t.length;e<n;e++){var i=g(t[e]);lt._jQueryInterface.call(i,i.data())}}),g.fn[L]=lt._jQueryInterface,g.fn[L].Constructor=lt,g.fn[L].noConflict=function(){return g.fn[L]=x,lt._jQueryInterface};var ct="collapse",ht="bs.collapse",ut="."+ht,ft=g.fn[ct],dt={toggle:!0,parent:""},gt={toggle:"boolean",parent:"(string|element)"},_t={SHOW:"show"+ut,SHOWN:"shown"+ut,HIDE:"hide"+ut,HIDDEN:"hidden"+ut,CLICK_DATA_API:"click"+ut+".data-api"},mt="show",pt="collapse",vt="collapsing",yt="collapsed",Et="width",Ct="height",Tt=".show, .collapsing",St='[data-toggle="collapse"]',bt=function(){function a(e,t){this._isTransitioning=!1,this._element=e,this._config=this._getConfig(t),this._triggerArray=[].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'));for(var n=[].slice.call(document.querySelectorAll(St)),i=0,o=n.length;i<o;i++){var r=n[i],s=_.getSelectorFromElement(r),a=[].slice.call(document.querySelectorAll(s)).filter(function(t){return t===e});null!==s&&0<a.length&&(this._selector=s,this._triggerArray.push(r))}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}var t=a.prototype;return t.toggle=function(){g(this._element).hasClass(mt)?this.hide():this.show()},t.show=function(){var t,e,n=this;if(!this._isTransitioning&&!g(this._element).hasClass(mt)&&(this._parent&&0===(t=[].slice.call(this._parent.querySelectorAll(Tt)).filter(function(t){return"string"==typeof n._config.parent?t.getAttribute("data-parent")===n._config.parent:t.classList.contains(pt)})).length&&(t=null),!(t&&(e=g(t).not(this._selector).data(ht))&&e._isTransitioning))){var i=g.Event(_t.SHOW);if(g(this._element).trigger(i),!i.isDefaultPrevented()){t&&(a._jQueryInterface.call(g(t).not(this._selector),"hide"),e||g(t).data(ht,null));var o=this._getDimension();g(this._element).removeClass(pt).addClass(vt),this._element.style[o]=0,this._triggerArray.length&&g(this._triggerArray).removeClass(yt).attr("aria-expanded",!0),this.setTransitioning(!0);var r="scroll"+(o[0].toUpperCase()+o.slice(1)),s=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,function(){g(n._element).removeClass(vt).addClass(pt).addClass(mt),n._element.style[o]="",n.setTransitioning(!1),g(n._element).trigger(_t.SHOWN)}).emulateTransitionEnd(s),this._element.style[o]=this._element[r]+"px"}}},t.hide=function(){var t=this;if(!this._isTransitioning&&g(this._element).hasClass(mt)){var e=g.Event(_t.HIDE);if(g(this._element).trigger(e),!e.isDefaultPrevented()){var n=this._getDimension();this._element.style[n]=this._element.getBoundingClientRect()[n]+"px",_.reflow(this._element),g(this._element).addClass(vt).removeClass(pt).removeClass(mt);var i=this._triggerArray.length;if(0<i)for(var o=0;o<i;o++){var r=this._triggerArray[o],s=_.getSelectorFromElement(r);if(null!==s)g([].slice.call(document.querySelectorAll(s))).hasClass(mt)||g(r).addClass(yt).attr("aria-expanded",!1)}this.setTransitioning(!0);this._element.style[n]="";var a=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,function(){t.setTransitioning(!1),g(t._element).removeClass(vt).addClass(pt).trigger(_t.HIDDEN)}).emulateTransitionEnd(a)}}},t.setTransitioning=function(t){this._isTransitioning=t},t.dispose=function(){g.removeData(this._element,ht),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},t._getConfig=function(t){return(t=l({},dt,t)).toggle=Boolean(t.toggle),_.typeCheckConfig(ct,t,gt),t},t._getDimension=function(){return g(this._element).hasClass(Et)?Et:Ct},t._getParent=function(){var t,n=this;_.isElement(this._config.parent)?(t=this._config.parent,"undefined"!=typeof this._config.parent.jquery&&(t=this._config.parent[0])):t=document.querySelector(this._config.parent);var e='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]',i=[].slice.call(t.querySelectorAll(e));return g(i).each(function(t,e){n._addAriaAndCollapsedClass(a._getTargetFromElement(e),[e])}),t},t._addAriaAndCollapsedClass=function(t,e){var n=g(t).hasClass(mt);e.length&&g(e).toggleClass(yt,!n).attr("aria-expanded",n)},a._getTargetFromElement=function(t){var e=_.getSelectorFromElement(t);return e?document.querySelector(e):null},a._jQueryInterface=function(i){return this.each(function(){var t=g(this),e=t.data(ht),n=l({},dt,t.data(),"object"==typeof i&&i?i:{});if(!e&&n.toggle&&/show|hide/.test(i)&&(n.toggle=!1),e||(e=new a(this,n),t.data(ht,e)),"string"==typeof i){if("undefined"==typeof e[i])throw new TypeError('No method named "'+i+'"');e[i]()}})},s(a,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return dt}}]),a}();g(document).on(_t.CLICK_DATA_API,St,function(t){"A"===t.currentTarget.tagName&&t.preventDefault();var n=g(this),e=_.getSelectorFromElement(this),i=[].slice.call(document.querySelectorAll(e));g(i).each(function(){var t=g(this),e=t.data(ht)?"toggle":n.data();bt._jQueryInterface.call(t,e)})}),g.fn[ct]=bt._jQueryInterface,g.fn[ct].Constructor=bt,g.fn[ct].noConflict=function(){return g.fn[ct]=ft,bt._jQueryInterface};var It="dropdown",Dt="bs.dropdown",wt="."+Dt,At=".data-api",Nt=g.fn[It],Ot=new RegExp("38|40|27"),kt={HIDE:"hide"+wt,HIDDEN:"hidden"+wt,SHOW:"show"+wt,SHOWN:"shown"+wt,CLICK:"click"+wt,CLICK_DATA_API:"click"+wt+At,KEYDOWN_DATA_API:"keydown"+wt+At,KEYUP_DATA_API:"keyup"+wt+At},Pt="disabled",Lt="show",jt="dropup",Ht="dropright",Rt="dropleft",xt="dropdown-menu-right",Ft="position-static",Ut='[data-toggle="dropdown"]',Wt=".dropdown form",qt=".dropdown-menu",Mt=".navbar-nav",Kt=".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",Qt="top-start",Bt="top-end",Vt="bottom-start",Yt="bottom-end",zt="right-start",Xt="left-start",$t={offset:0,flip:!0,boundary:"scrollParent",reference:"toggle",display:"dynamic"},Gt={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)",reference:"(string|element)",display:"string"},Jt=function(){function c(t,e){this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners()}var t=c.prototype;return t.toggle=function(){if(!this._element.disabled&&!g(this._element).hasClass(Pt)){var t=c._getParentFromElement(this._element),e=g(this._menu).hasClass(Lt);if(c._clearMenus(),!e){var n={relatedTarget:this._element},i=g.Event(kt.SHOW,n);if(g(t).trigger(i),!i.isDefaultPrevented()){if(!this._inNavbar){if("undefined"==typeof u)throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");var o=this._element;"parent"===this._config.reference?o=t:_.isElement(this._config.reference)&&(o=this._config.reference,"undefined"!=typeof this._config.reference.jquery&&(o=this._config.reference[0])),"scrollParent"!==this._config.boundary&&g(t).addClass(Ft),this._popper=new u(o,this._menu,this._getPopperConfig())}"ontouchstart"in document.documentElement&&0===g(t).closest(Mt).length&&g(document.body).children().on("mouseover",null,g.noop),this._element.focus(),this._element.setAttribute("aria-expanded",!0),g(this._menu).toggleClass(Lt),g(t).toggleClass(Lt).trigger(g.Event(kt.SHOWN,n))}}}},t.show=function(){if(!(this._element.disabled||g(this._element).hasClass(Pt)||g(this._menu).hasClass(Lt))){var t={relatedTarget:this._element},e=g.Event(kt.SHOW,t),n=c._getParentFromElement(this._element);g(n).trigger(e),e.isDefaultPrevented()||(g(this._menu).toggleClass(Lt),g(n).toggleClass(Lt).trigger(g.Event(kt.SHOWN,t)))}},t.hide=function(){if(!this._element.disabled&&!g(this._element).hasClass(Pt)&&g(this._menu).hasClass(Lt)){var t={relatedTarget:this._element},e=g.Event(kt.HIDE,t),n=c._getParentFromElement(this._element);g(n).trigger(e),e.isDefaultPrevented()||(g(this._menu).toggleClass(Lt),g(n).toggleClass(Lt).trigger(g.Event(kt.HIDDEN,t)))}},t.dispose=function(){g.removeData(this._element,Dt),g(this._element).off(wt),this._element=null,(this._menu=null)!==this._popper&&(this._popper.destroy(),this._popper=null)},t.update=function(){this._inNavbar=this._detectNavbar(),null!==this._popper&&this._popper.scheduleUpdate()},t._addEventListeners=function(){var e=this;g(this._element).on(kt.CLICK,function(t){t.preventDefault(),t.stopPropagation(),e.toggle()})},t._getConfig=function(t){return t=l({},this.constructor.Default,g(this._element).data(),t),_.typeCheckConfig(It,t,this.constructor.DefaultType),t},t._getMenuElement=function(){if(!this._menu){var t=c._getParentFromElement(this._element);t&&(this._menu=t.querySelector(qt))}return this._menu},t._getPlacement=function(){var t=g(this._element.parentNode),e=Vt;return t.hasClass(jt)?(e=Qt,g(this._menu).hasClass(xt)&&(e=Bt)):t.hasClass(Ht)?e=zt:t.hasClass(Rt)?e=Xt:g(this._menu).hasClass(xt)&&(e=Yt),e},t._detectNavbar=function(){return 0<g(this._element).closest(".navbar").length},t._getOffset=function(){var e=this,t={};return"function"==typeof this._config.offset?t.fn=function(t){return t.offsets=l({},t.offsets,e._config.offset(t.offsets,e._element)||{}),t}:t.offset=this._config.offset,t},t._getPopperConfig=function(){var t={placement:this._getPlacement(),modifiers:{offset:this._getOffset(),flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}};return"static"===this._config.display&&(t.modifiers.applyStyle={enabled:!1}),t},c._jQueryInterface=function(e){return this.each(function(){var t=g(this).data(Dt);if(t||(t=new c(this,"object"==typeof e?e:null),g(this).data(Dt,t)),"string"==typeof e){if("undefined"==typeof t[e])throw new TypeError('No method named "'+e+'"');t[e]()}})},c._clearMenus=function(t){if(!t||3!==t.which&&("keyup"!==t.type||9===t.which))for(var e=[].slice.call(document.querySelectorAll(Ut)),n=0,i=e.length;n<i;n++){var o=c._getParentFromElement(e[n]),r=g(e[n]).data(Dt),s={relatedTarget:e[n]};if(t&&"click"===t.type&&(s.clickEvent=t),r){var a=r._menu;if(g(o).hasClass(Lt)&&!(t&&("click"===t.type&&/input|textarea/i.test(t.target.tagName)||"keyup"===t.type&&9===t.which)&&g.contains(o,t.target))){var l=g.Event(kt.HIDE,s);g(o).trigger(l),l.isDefaultPrevented()||("ontouchstart"in document.documentElement&&g(document.body).children().off("mouseover",null,g.noop),e[n].setAttribute("aria-expanded","false"),g(a).removeClass(Lt),g(o).removeClass(Lt).trigger(g.Event(kt.HIDDEN,s)))}}}},c._getParentFromElement=function(t){var e,n=_.getSelectorFromElement(t);return n&&(e=document.querySelector(n)),e||t.parentNode},c._dataApiKeydownHandler=function(t){if((/input|textarea/i.test(t.target.tagName)?!(32===t.which||27!==t.which&&(40!==t.which&&38!==t.which||g(t.target).closest(qt).length)):Ot.test(t.which))&&(t.preventDefault(),t.stopPropagation(),!this.disabled&&!g(this).hasClass(Pt))){var e=c._getParentFromElement(this),n=g(e).hasClass(Lt);if(n&&(!n||27!==t.which&&32!==t.which)){var i=[].slice.call(e.querySelectorAll(Kt));if(0!==i.length){var o=i.indexOf(t.target);38===t.which&&0<o&&o--,40===t.which&&o<i.length-1&&o++,o<0&&(o=0),i[o].focus()}}else{if(27===t.which){var r=e.querySelector(Ut);g(r).trigger("focus")}g(this).trigger("click")}}},s(c,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return $t}},{key:"DefaultType",get:function(){return Gt}}]),c}();g(document).on(kt.KEYDOWN_DATA_API,Ut,Jt._dataApiKeydownHandler).on(kt.KEYDOWN_DATA_API,qt,Jt._dataApiKeydownHandler).on(kt.CLICK_DATA_API+" "+kt.KEYUP_DATA_API,Jt._clearMenus).on(kt.CLICK_DATA_API,Ut,function(t){t.preventDefault(),t.stopPropagation(),Jt._jQueryInterface.call(g(this),"toggle")}).on(kt.CLICK_DATA_API,Wt,function(t){t.stopPropagation()}),g.fn[It]=Jt._jQueryInterface,g.fn[It].Constructor=Jt,g.fn[It].noConflict=function(){return g.fn[It]=Nt,Jt._jQueryInterface};var Zt="modal",te="bs.modal",ee="."+te,ne=g.fn[Zt],ie={backdrop:!0,keyboard:!0,focus:!0,show:!0},oe={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean",show:"boolean"},re={HIDE:"hide"+ee,HIDDEN:"hidden"+ee,SHOW:"show"+ee,SHOWN:"shown"+ee,FOCUSIN:"focusin"+ee,RESIZE:"resize"+ee,CLICK_DISMISS:"click.dismiss"+ee,KEYDOWN_DISMISS:"keydown.dismiss"+ee,MOUSEUP_DISMISS:"mouseup.dismiss"+ee,MOUSEDOWN_DISMISS:"mousedown.dismiss"+ee,CLICK_DATA_API:"click"+ee+".data-api"},se="modal-dialog-scrollable",ae="modal-scrollbar-measure",le="modal-backdrop",ce="modal-open",he="fade",ue="show",fe=".modal-dialog",de=".modal-body",ge='[data-toggle="modal"]',_e='[data-dismiss="modal"]',me=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",pe=".sticky-top",ve=function(){function o(t,e){this._config=this._getConfig(e),this._element=t,this._dialog=t.querySelector(fe),this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._isTransitioning=!1,this._scrollbarWidth=0}var t=o.prototype;return t.toggle=function(t){return this._isShown?this.hide():this.show(t)},t.show=function(t){var e=this;if(!this._isShown&&!this._isTransitioning){g(this._element).hasClass(he)&&(this._isTransitioning=!0);var n=g.Event(re.SHOW,{relatedTarget:t});g(this._element).trigger(n),this._isShown||n.isDefaultPrevented()||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),g(this._element).on(re.CLICK_DISMISS,_e,function(t){return e.hide(t)}),g(this._dialog).on(re.MOUSEDOWN_DISMISS,function(){g(e._element).one(re.MOUSEUP_DISMISS,function(t){g(t.target).is(e._element)&&(e._ignoreBackdropClick=!0)})}),this._showBackdrop(function(){return e._showElement(t)}))}},t.hide=function(t){var e=this;if(t&&t.preventDefault(),this._isShown&&!this._isTransitioning){var n=g.Event(re.HIDE);if(g(this._element).trigger(n),this._isShown&&!n.isDefaultPrevented()){this._isShown=!1;var i=g(this._element).hasClass(he);if(i&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),g(document).off(re.FOCUSIN),g(this._element).removeClass(ue),g(this._element).off(re.CLICK_DISMISS),g(this._dialog).off(re.MOUSEDOWN_DISMISS),i){var o=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,function(t){return e._hideModal(t)}).emulateTransitionEnd(o)}else this._hideModal()}}},t.dispose=function(){[window,this._element,this._dialog].forEach(function(t){return g(t).off(ee)}),g(document).off(re.FOCUSIN),g.removeData(this._element,te),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._isTransitioning=null,this._scrollbarWidth=null},t.handleUpdate=function(){this._adjustDialog()},t._getConfig=function(t){return t=l({},ie,t),_.typeCheckConfig(Zt,t,oe),t},t._showElement=function(t){var e=this,n=g(this._element).hasClass(he);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),g(this._dialog).hasClass(se)?this._dialog.querySelector(de).scrollTop=0:this._element.scrollTop=0,n&&_.reflow(this._element),g(this._element).addClass(ue),this._config.focus&&this._enforceFocus();var i=g.Event(re.SHOWN,{relatedTarget:t}),o=function(){e._config.focus&&e._element.focus(),e._isTransitioning=!1,g(e._element).trigger(i)};if(n){var r=_.getTransitionDurationFromElement(this._dialog);g(this._dialog).one(_.TRANSITION_END,o).emulateTransitionEnd(r)}else o()},t._enforceFocus=function(){var e=this;g(document).off(re.FOCUSIN).on(re.FOCUSIN,function(t){document!==t.target&&e._element!==t.target&&0===g(e._element).has(t.target).length&&e._element.focus()})},t._setEscapeEvent=function(){var e=this;this._isShown&&this._config.keyboard?g(this._element).on(re.KEYDOWN_DISMISS,function(t){27===t.which&&(t.preventDefault(),e.hide())}):this._isShown||g(this._element).off(re.KEYDOWN_DISMISS)},t._setResizeEvent=function(){var e=this;this._isShown?g(window).on(re.RESIZE,function(t){return e.handleUpdate(t)}):g(window).off(re.RESIZE)},t._hideModal=function(){var t=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._isTransitioning=!1,this._showBackdrop(function(){g(document.body).removeClass(ce),t._resetAdjustments(),t._resetScrollbar(),g(t._element).trigger(re.HIDDEN)})},t._removeBackdrop=function(){this._backdrop&&(g(this._backdrop).remove(),this._backdrop=null)},t._showBackdrop=function(t){var e=this,n=g(this._element).hasClass(he)?he:"";if(this._isShown&&this._config.backdrop){if(this._backdrop=document.createElement("div"),this._backdrop.className=le,n&&this._backdrop.classList.add(n),g(this._backdrop).appendTo(document.body),g(this._element).on(re.CLICK_DISMISS,function(t){e._ignoreBackdropClick?e._ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"===e._config.backdrop?e._element.focus():e.hide())}),n&&_.reflow(this._backdrop),g(this._backdrop).addClass(ue),!t)return;if(!n)return void t();var i=_.getTransitionDurationFromElement(this._backdrop);g(this._backdrop).one(_.TRANSITION_END,t).emulateTransitionEnd(i)}else if(!this._isShown&&this._backdrop){g(this._backdrop).removeClass(ue);var o=function(){e._removeBackdrop(),t&&t()};if(g(this._element).hasClass(he)){var r=_.getTransitionDurationFromElement(this._backdrop);g(this._backdrop).one(_.TRANSITION_END,o).emulateTransitionEnd(r)}else o()}else t&&t()},t._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&t&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),this._isBodyOverflowing&&!t&&(this._element.style.paddingRight=this._scrollbarWidth+"px")},t._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight=""},t._checkScrollbar=function(){var t=document.body.getBoundingClientRect();this._isBodyOverflowing=t.left+t.right<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth()},t._setScrollbar=function(){var o=this;if(this._isBodyOverflowing){var t=[].slice.call(document.querySelectorAll(me)),e=[].slice.call(document.querySelectorAll(pe));g(t).each(function(t,e){var n=e.style.paddingRight,i=g(e).css("padding-right");g(e).data("padding-right",n).css("padding-right",parseFloat(i)+o._scrollbarWidth+"px")}),g(e).each(function(t,e){var n=e.style.marginRight,i=g(e).css("margin-right");g(e).data("margin-right",n).css("margin-right",parseFloat(i)-o._scrollbarWidth+"px")});var n=document.body.style.paddingRight,i=g(document.body).css("padding-right");g(document.body).data("padding-right",n).css("padding-right",parseFloat(i)+this._scrollbarWidth+"px")}g(document.body).addClass(ce)},t._resetScrollbar=function(){var t=[].slice.call(document.querySelectorAll(me));g(t).each(function(t,e){var n=g(e).data("padding-right");g(e).removeData("padding-right"),e.style.paddingRight=n||""});var e=[].slice.call(document.querySelectorAll(""+pe));g(e).each(function(t,e){var n=g(e).data("margin-right");"undefined"!=typeof n&&g(e).css("margin-right",n).removeData("margin-right")});var n=g(document.body).data("padding-right");g(document.body).removeData("padding-right"),document.body.style.paddingRight=n||""},t._getScrollbarWidth=function(){var t=document.createElement("div");t.className=ae,document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},o._jQueryInterface=function(n,i){return this.each(function(){var t=g(this).data(te),e=l({},ie,g(this).data(),"object"==typeof n&&n?n:{});if(t||(t=new o(this,e),g(this).data(te,t)),"string"==typeof n){if("undefined"==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n](i)}else e.show&&t.show(i)})},s(o,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return ie}}]),o}();g(document).on(re.CLICK_DATA_API,ge,function(t){var e,n=this,i=_.getSelectorFromElement(this);i&&(e=document.querySelector(i));var o=g(e).data(te)?"toggle":l({},g(e).data(),g(this).data());"A"!==this.tagName&&"AREA"!==this.tagName||t.preventDefault();var r=g(e).one(re.SHOW,function(t){t.isDefaultPrevented()||r.one(re.HIDDEN,function(){g(n).is(":visible")&&n.focus()})});ve._jQueryInterface.call(g(e),o,this)}),g.fn[Zt]=ve._jQueryInterface,g.fn[Zt].Constructor=ve,g.fn[Zt].noConflict=function(){return g.fn[Zt]=ne,ve._jQueryInterface};var ye=["background","cite","href","itemtype","longdesc","poster","src","xlink:href"],Ee={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},Ce=/^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,Te=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;function Se(t,s,e){if(0===t.length)return t;if(e&&"function"==typeof e)return e(t);for(var n=(new window.DOMParser).parseFromString(t,"text/html"),a=Object.keys(s),l=[].slice.call(n.body.querySelectorAll("*")),i=function(t,e){var n=l[t],i=n.nodeName.toLowerCase();if(-1===a.indexOf(n.nodeName.toLowerCase()))return n.parentNode.removeChild(n),"continue";var o=[].slice.call(n.attributes),r=[].concat(s["*"]||[],s[i]||[]);o.forEach(function(t){(function(t,e){var n=t.nodeName.toLowerCase();if(-1!==e.indexOf(n))return-1===ye.indexOf(n)||Boolean(t.nodeValue.match(Ce)||t.nodeValue.match(Te));for(var i=e.filter(function(t){return t instanceof RegExp}),o=0,r=i.length;o<r;o++)if(n.match(i[o]))return!0;return!1})(t,r)||n.removeAttribute(t.nodeName)})},o=0,r=l.length;o<r;o++)i(o);return n.body.innerHTML}var be="tooltip",Ie="bs.tooltip",De="."+Ie,we=g.fn[be],Ae="bs-tooltip",Ne=new RegExp("(^|\\s)"+Ae+"\\S+","g"),Oe=["sanitize","whiteList","sanitizeFn"],ke={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string|function)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)",boundary:"(string|element)",sanitize:"boolean",sanitizeFn:"(null|function)",whiteList:"object"},Pe={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},Le={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",boundary:"scrollParent",sanitize:!0,sanitizeFn:null,whiteList:Ee},je="show",He="out",Re={HIDE:"hide"+De,HIDDEN:"hidden"+De,SHOW:"show"+De,SHOWN:"shown"+De,INSERTED:"inserted"+De,CLICK:"click"+De,FOCUSIN:"focusin"+De,FOCUSOUT:"focusout"+De,MOUSEENTER:"mouseenter"+De,MOUSELEAVE:"mouseleave"+De},xe="fade",Fe="show",Ue=".tooltip-inner",We=".arrow",qe="hover",Me="focus",Ke="click",Qe="manual",Be=function(){function i(t,e){if("undefined"==typeof u)throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners()}var t=i.prototype;return t.enable=function(){this._isEnabled=!0},t.disable=function(){this._isEnabled=!1},t.toggleEnabled=function(){this._isEnabled=!this._isEnabled},t.toggle=function(t){if(this._isEnabled)if(t){var e=this.constructor.DATA_KEY,n=g(t.currentTarget).data(e);n||(n=new this.constructor(t.currentTarget,this._getDelegateConfig()),g(t.currentTarget).data(e,n)),n._activeTrigger.click=!n._activeTrigger.click,n._isWithActiveTrigger()?n._enter(null,n):n._leave(null,n)}else{if(g(this.getTipElement()).hasClass(Fe))return void this._leave(null,this);this._enter(null,this)}},t.dispose=function(){clearTimeout(this._timeout),g.removeData(this.element,this.constructor.DATA_KEY),g(this.element).off(this.constructor.EVENT_KEY),g(this.element).closest(".modal").off("hide.bs.modal"),this.tip&&g(this.tip).remove(),this._isEnabled=null,this._timeout=null,this._hoverState=null,(this._activeTrigger=null)!==this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null},t.show=function(){var e=this;if("none"===g(this.element).css("display"))throw new Error("Please use show on visible elements");var t=g.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){g(this.element).trigger(t);var n=_.findShadowRoot(this.element),i=g.contains(null!==n?n:this.element.ownerDocument.documentElement,this.element);if(t.isDefaultPrevented()||!i)return;var o=this.getTipElement(),r=_.getUID(this.constructor.NAME);o.setAttribute("id",r),this.element.setAttribute("aria-describedby",r),this.setContent(),this.config.animation&&g(o).addClass(xe);var s="function"==typeof this.config.placement?this.config.placement.call(this,o,this.element):this.config.placement,a=this._getAttachment(s);this.addAttachmentClass(a);var l=this._getContainer();g(o).data(this.constructor.DATA_KEY,this),g.contains(this.element.ownerDocument.documentElement,this.tip)||g(o).appendTo(l),g(this.element).trigger(this.constructor.Event.INSERTED),this._popper=new u(this.element,o,{placement:a,modifiers:{offset:this._getOffset(),flip:{behavior:this.config.fallbackPlacement},arrow:{element:We},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t)},onUpdate:function(t){return e._handlePopperPlacementChange(t)}}),g(o).addClass(Fe),"ontouchstart"in document.documentElement&&g(document.body).children().on("mouseover",null,g.noop);var c=function(){e.config.animation&&e._fixTransition();var t=e._hoverState;e._hoverState=null,g(e.element).trigger(e.constructor.Event.SHOWN),t===He&&e._leave(null,e)};if(g(this.tip).hasClass(xe)){var h=_.getTransitionDurationFromElement(this.tip);g(this.tip).one(_.TRANSITION_END,c).emulateTransitionEnd(h)}else c()}},t.hide=function(t){var e=this,n=this.getTipElement(),i=g.Event(this.constructor.Event.HIDE),o=function(){e._hoverState!==je&&n.parentNode&&n.parentNode.removeChild(n),e._cleanTipClass(),e.element.removeAttribute("aria-describedby"),g(e.element).trigger(e.constructor.Event.HIDDEN),null!==e._popper&&e._popper.destroy(),t&&t()};if(g(this.element).trigger(i),!i.isDefaultPrevented()){if(g(n).removeClass(Fe),"ontouchstart"in document.documentElement&&g(document.body).children().off("mouseover",null,g.noop),this._activeTrigger[Ke]=!1,this._activeTrigger[Me]=!1,this._activeTrigger[qe]=!1,g(this.tip).hasClass(xe)){var r=_.getTransitionDurationFromElement(n);g(n).one(_.TRANSITION_END,o).emulateTransitionEnd(r)}else o();this._hoverState=""}},t.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},t.isWithContent=function(){return Boolean(this.getTitle())},t.addAttachmentClass=function(t){g(this.getTipElement()).addClass(Ae+"-"+t)},t.getTipElement=function(){return this.tip=this.tip||g(this.config.template)[0],this.tip},t.setContent=function(){var t=this.getTipElement();this.setElementContent(g(t.querySelectorAll(Ue)),this.getTitle()),g(t).removeClass(xe+" "+Fe)},t.setElementContent=function(t,e){"object"!=typeof e||!e.nodeType&&!e.jquery?this.config.html?(this.config.sanitize&&(e=Se(e,this.config.whiteList,this.config.sanitizeFn)),t.html(e)):t.text(e):this.config.html?g(e).parent().is(t)||t.empty().append(e):t.text(g(e).text())},t.getTitle=function(){var t=this.element.getAttribute("data-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},t._getOffset=function(){var e=this,t={};return"function"==typeof this.config.offset?t.fn=function(t){return t.offsets=l({},t.offsets,e.config.offset(t.offsets,e.element)||{}),t}:t.offset=this.config.offset,t},t._getContainer=function(){return!1===this.config.container?document.body:_.isElement(this.config.container)?g(this.config.container):g(document).find(this.config.container)},t._getAttachment=function(t){return Pe[t.toUpperCase()]},t._setListeners=function(){var i=this;this.config.trigger.split(" ").forEach(function(t){if("click"===t)g(i.element).on(i.constructor.Event.CLICK,i.config.selector,function(t){return i.toggle(t)});else if(t!==Qe){var e=t===qe?i.constructor.Event.MOUSEENTER:i.constructor.Event.FOCUSIN,n=t===qe?i.constructor.Event.MOUSELEAVE:i.constructor.Event.FOCUSOUT;g(i.element).on(e,i.config.selector,function(t){return i._enter(t)}).on(n,i.config.selector,function(t){return i._leave(t)})}}),g(this.element).closest(".modal").on("hide.bs.modal",function(){i.element&&i.hide()}),this.config.selector?this.config=l({},this.config,{trigger:"manual",selector:""}):this._fixTitle()},t._fixTitle=function(){var t=typeof this.element.getAttribute("data-original-title");(this.element.getAttribute("title")||"string"!==t)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""))},t._enter=function(t,e){var n=this.constructor.DATA_KEY;(e=e||g(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),g(t.currentTarget).data(n,e)),t&&(e._activeTrigger["focusin"===t.type?Me:qe]=!0),g(e.getTipElement()).hasClass(Fe)||e._hoverState===je?e._hoverState=je:(clearTimeout(e._timeout),e._hoverState=je,e.config.delay&&e.config.delay.show?e._timeout=setTimeout(function(){e._hoverState===je&&e.show()},e.config.delay.show):e.show())},t._leave=function(t,e){var n=this.constructor.DATA_KEY;(e=e||g(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),g(t.currentTarget).data(n,e)),t&&(e._activeTrigger["focusout"===t.type?Me:qe]=!1),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState=He,e.config.delay&&e.config.delay.hide?e._timeout=setTimeout(function(){e._hoverState===He&&e.hide()},e.config.delay.hide):e.hide())},t._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1},t._getConfig=function(t){var e=g(this.element).data();return Object.keys(e).forEach(function(t){-1!==Oe.indexOf(t)&&delete e[t]}),"number"==typeof(t=l({},this.constructor.Default,e,"object"==typeof t&&t?t:{})).delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),_.typeCheckConfig(be,t,this.constructor.DefaultType),t.sanitize&&(t.template=Se(t.template,t.whiteList,t.sanitizeFn)),t},t._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},t._cleanTipClass=function(){var t=g(this.getTipElement()),e=t.attr("class").match(Ne);null!==e&&e.length&&t.removeClass(e.join(""))},t._handlePopperPlacementChange=function(t){var e=t.instance;this.tip=e.popper,this._cleanTipClass(),this.addAttachmentClass(this._getAttachment(t.placement))},t._fixTransition=function(){var t=this.getTipElement(),e=this.config.animation;null===t.getAttribute("x-placement")&&(g(t).removeClass(xe),this.config.animation=!1,this.hide(),this.show(),this.config.animation=e)},i._jQueryInterface=function(n){return this.each(function(){var t=g(this).data(Ie),e="object"==typeof n&&n;if((t||!/dispose|hide/.test(n))&&(t||(t=new i(this,e),g(this).data(Ie,t)),"string"==typeof n)){if("undefined"==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n]()}})},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return Le}},{key:"NAME",get:function(){return be}},{key:"DATA_KEY",get:function(){return Ie}},{key:"Event",get:function(){return Re}},{key:"EVENT_KEY",get:function(){return De}},{key:"DefaultType",get:function(){return ke}}]),i}();g.fn[be]=Be._jQueryInterface,g.fn[be].Constructor=Be,g.fn[be].noConflict=function(){return g.fn[be]=we,Be._jQueryInterface};var Ve="popover",Ye="bs.popover",ze="."+Ye,Xe=g.fn[Ve],$e="bs-popover",Ge=new RegExp("(^|\\s)"+$e+"\\S+","g"),Je=l({},Be.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),Ze=l({},Be.DefaultType,{content:"(string|element|function)"}),tn="fade",en="show",nn=".popover-header",on=".popover-body",rn={HIDE:"hide"+ze,HIDDEN:"hidden"+ze,SHOW:"show"+ze,SHOWN:"shown"+ze,INSERTED:"inserted"+ze,CLICK:"click"+ze,FOCUSIN:"focusin"+ze,FOCUSOUT:"focusout"+ze,MOUSEENTER:"mouseenter"+ze,MOUSELEAVE:"mouseleave"+ze},sn=function(t){var e,n;function i(){return t.apply(this,arguments)||this}n=t,(e=i).prototype=Object.create(n.prototype),(e.prototype.constructor=e).__proto__=n;var o=i.prototype;return o.isWithContent=function(){return this.getTitle()||this._getContent()},o.addAttachmentClass=function(t){g(this.getTipElement()).addClass($e+"-"+t)},o.getTipElement=function(){return this.tip=this.tip||g(this.config.template)[0],this.tip},o.setContent=function(){var t=g(this.getTipElement());this.setElementContent(t.find(nn),this.getTitle());var e=this._getContent();"function"==typeof e&&(e=e.call(this.element)),this.setElementContent(t.find(on),e),t.removeClass(tn+" "+en)},o._getContent=function(){return this.element.getAttribute("data-content")||this.config.content},o._cleanTipClass=function(){var t=g(this.getTipElement()),e=t.attr("class").match(Ge);null!==e&&0<e.length&&t.removeClass(e.join(""))},i._jQueryInterface=function(n){return this.each(function(){var t=g(this).data(Ye),e="object"==typeof n?n:null;if((t||!/dispose|hide/.test(n))&&(t||(t=new i(this,e),g(this).data(Ye,t)),"string"==typeof n)){if("undefined"==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n]()}})},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return Je}},{key:"NAME",get:function(){return Ve}},{key:"DATA_KEY",get:function(){return Ye}},{key:"Event",get:function(){return rn}},{key:"EVENT_KEY",get:function(){return ze}},{key:"DefaultType",get:function(){return Ze}}]),i}(Be);g.fn[Ve]=sn._jQueryInterface,g.fn[Ve].Constructor=sn,g.fn[Ve].noConflict=function(){return g.fn[Ve]=Xe,sn._jQueryInterface};var an="scrollspy",ln="bs.scrollspy",cn="."+ln,hn=g.fn[an],un={offset:10,method:"auto",target:""},fn={offset:"number",method:"string",target:"(string|element)"},dn={ACTIVATE:"activate"+cn,SCROLL:"scroll"+cn,LOAD_DATA_API:"load"+cn+".data-api"},gn="dropdown-item",_n="active",mn='[data-spy="scroll"]',pn=".nav, .list-group",vn=".nav-link",yn=".nav-item",En=".list-group-item",Cn=".dropdown",Tn=".dropdown-item",Sn=".dropdown-toggle",bn="offset",In="position",Dn=function(){function n(t,e){var n=this;this._element=t,this._scrollElement="BODY"===t.tagName?window:t,this._config=this._getConfig(e),this._selector=this._config.target+" "+vn+","+this._config.target+" "+En+","+this._config.target+" "+Tn,this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,g(this._scrollElement).on(dn.SCROLL,function(t){return n._process(t)}),this.refresh(),this._process()}var t=n.prototype;return t.refresh=function(){var e=this,t=this._scrollElement===this._scrollElement.window?bn:In,o="auto"===this._config.method?t:this._config.method,r=o===In?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),[].slice.call(document.querySelectorAll(this._selector)).map(function(t){var e,n=_.getSelectorFromElement(t);if(n&&(e=document.querySelector(n)),e){var i=e.getBoundingClientRect();if(i.width||i.height)return[g(e)[o]().top+r,n]}return null}).filter(function(t){return t}).sort(function(t,e){return t[0]-e[0]}).forEach(function(t){e._offsets.push(t[0]),e._targets.push(t[1])})},t.dispose=function(){g.removeData(this._element,ln),g(this._scrollElement).off(cn),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},t._getConfig=function(t){if("string"!=typeof(t=l({},un,"object"==typeof t&&t?t:{})).target){var e=g(t.target).attr("id");e||(e=_.getUID(an),g(t.target).attr("id",e)),t.target="#"+e}return _.typeCheckConfig(an,t,fn),t},t._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},t._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},t._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},t._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),n<=t){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&t<this._offsets[0]&&0<this._offsets[0])return this._activeTarget=null,void this._clear();for(var o=this._offsets.length;o--;){this._activeTarget!==this._targets[o]&&t>=this._offsets[o]&&("undefined"==typeof this._offsets[o+1]||t<this._offsets[o+1])&&this._activate(this._targets[o])}}},t._activate=function(e){this._activeTarget=e,this._clear();var t=this._selector.split(",").map(function(t){return t+'[data-target="'+e+'"],'+t+'[href="'+e+'"]'}),n=g([].slice.call(document.querySelectorAll(t.join(","))));n.hasClass(gn)?(n.closest(Cn).find(Sn).addClass(_n),n.addClass(_n)):(n.addClass(_n),n.parents(pn).prev(vn+", "+En).addClass(_n),n.parents(pn).prev(yn).children(vn).addClass(_n)),g(this._scrollElement).trigger(dn.ACTIVATE,{relatedTarget:e})},t._clear=function(){[].slice.call(document.querySelectorAll(this._selector)).filter(function(t){return t.classList.contains(_n)}).forEach(function(t){return t.classList.remove(_n)})},n._jQueryInterface=function(e){return this.each(function(){var t=g(this).data(ln);if(t||(t=new n(this,"object"==typeof e&&e),g(this).data(ln,t)),"string"==typeof e){if("undefined"==typeof t[e])throw new TypeError('No method named "'+e+'"');t[e]()}})},s(n,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"Default",get:function(){return un}}]),n}();g(window).on(dn.LOAD_DATA_API,function(){for(var t=[].slice.call(document.querySelectorAll(mn)),e=t.length;e--;){var n=g(t[e]);Dn._jQueryInterface.call(n,n.data())}}),g.fn[an]=Dn._jQueryInterface,g.fn[an].Constructor=Dn,g.fn[an].noConflict=function(){return g.fn[an]=hn,Dn._jQueryInterface};var wn="bs.tab",An="."+wn,Nn=g.fn.tab,On={HIDE:"hide"+An,HIDDEN:"hidden"+An,SHOW:"show"+An,SHOWN:"shown"+An,CLICK_DATA_API:"click"+An+".data-api"},kn="dropdown-menu",Pn="active",Ln="disabled",jn="fade",Hn="show",Rn=".dropdown",xn=".nav, .list-group",Fn=".active",Un="> li > .active",Wn='[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',qn=".dropdown-toggle",Mn="> .dropdown-menu .active",Kn=function(){function i(t){this._element=t}var t=i.prototype;return t.show=function(){var n=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&g(this._element).hasClass(Pn)||g(this._element).hasClass(Ln))){var t,i,e=g(this._element).closest(xn)[0],o=_.getSelectorFromElement(this._element);if(e){var r="UL"===e.nodeName||"OL"===e.nodeName?Un:Fn;i=(i=g.makeArray(g(e).find(r)))[i.length-1]}var s=g.Event(On.HIDE,{relatedTarget:this._element}),a=g.Event(On.SHOW,{relatedTarget:i});if(i&&g(i).trigger(s),g(this._element).trigger(a),!a.isDefaultPrevented()&&!s.isDefaultPrevented()){o&&(t=document.querySelector(o)),this._activate(this._element,e);var l=function(){var t=g.Event(On.HIDDEN,{relatedTarget:n._element}),e=g.Event(On.SHOWN,{relatedTarget:i});g(i).trigger(t),g(n._element).trigger(e)};t?this._activate(t,t.parentNode,l):l()}}},t.dispose=function(){g.removeData(this._element,wn),this._element=null},t._activate=function(t,e,n){var i=this,o=(!e||"UL"!==e.nodeName&&"OL"!==e.nodeName?g(e).children(Fn):g(e).find(Un))[0],r=n&&o&&g(o).hasClass(jn),s=function(){return i._transitionComplete(t,o,n)};if(o&&r){var a=_.getTransitionDurationFromElement(o);g(o).removeClass(Hn).one(_.TRANSITION_END,s).emulateTransitionEnd(a)}else s()},t._transitionComplete=function(t,e,n){if(e){g(e).removeClass(Pn);var i=g(e.parentNode).find(Mn)[0];i&&g(i).removeClass(Pn),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!1)}if(g(t).addClass(Pn),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!0),_.reflow(t),t.classList.contains(jn)&&t.classList.add(Hn),t.parentNode&&g(t.parentNode).hasClass(kn)){var o=g(t).closest(Rn)[0];if(o){var r=[].slice.call(o.querySelectorAll(qn));g(r).addClass(Pn)}t.setAttribute("aria-expanded",!0)}n&&n()},i._jQueryInterface=function(n){return this.each(function(){var t=g(this),e=t.data(wn);if(e||(e=new i(this),t.data(wn,e)),"string"==typeof n){if("undefined"==typeof e[n])throw new TypeError('No method named "'+n+'"');e[n]()}})},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}}]),i}();g(document).on(On.CLICK_DATA_API,Wn,function(t){t.preventDefault(),Kn._jQueryInterface.call(g(this),"show")}),g.fn.tab=Kn._jQueryInterface,g.fn.tab.Constructor=Kn,g.fn.tab.noConflict=function(){return g.fn.tab=Nn,Kn._jQueryInterface};var Qn="toast",Bn="bs.toast",Vn="."+Bn,Yn=g.fn[Qn],zn={CLICK_DISMISS:"click.dismiss"+Vn,HIDE:"hide"+Vn,HIDDEN:"hidden"+Vn,SHOW:"show"+Vn,SHOWN:"shown"+Vn},Xn="fade",$n="hide",Gn="show",Jn="showing",Zn={animation:"boolean",autohide:"boolean",delay:"number"},ti={animation:!0,autohide:!0,delay:500},ei='[data-dismiss="toast"]',ni=function(){function i(t,e){this._element=t,this._config=this._getConfig(e),this._timeout=null,this._setListeners()}var t=i.prototype;return t.show=function(){var t=this;g(this._element).trigger(zn.SHOW),this._config.animation&&this._element.classList.add(Xn);var e=function(){t._element.classList.remove(Jn),t._element.classList.add(Gn),g(t._element).trigger(zn.SHOWN),t._config.autohide&&t.hide()};if(this._element.classList.remove($n),this._element.classList.add(Jn),this._config.animation){var n=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,e).emulateTransitionEnd(n)}else e()},t.hide=function(t){var e=this;this._element.classList.contains(Gn)&&(g(this._element).trigger(zn.HIDE),t?this._close():this._timeout=setTimeout(function(){e._close()},this._config.delay))},t.dispose=function(){clearTimeout(this._timeout),this._timeout=null,this._element.classList.contains(Gn)&&this._element.classList.remove(Gn),g(this._element).off(zn.CLICK_DISMISS),g.removeData(this._element,Bn),this._element=null,this._config=null},t._getConfig=function(t){return t=l({},ti,g(this._element).data(),"object"==typeof t&&t?t:{}),_.typeCheckConfig(Qn,t,this.constructor.DefaultType),t},t._setListeners=function(){var t=this;g(this._element).on(zn.CLICK_DISMISS,ei,function(){return t.hide(!0)})},t._close=function(){var t=this,e=function(){t._element.classList.add($n),g(t._element).trigger(zn.HIDDEN)};if(this._element.classList.remove(Gn),this._config.animation){var n=_.getTransitionDurationFromElement(this._element);g(this._element).one(_.TRANSITION_END,e).emulateTransitionEnd(n)}else e()},i._jQueryInterface=function(n){return this.each(function(){var t=g(this),e=t.data(Bn);if(e||(e=new i(this,"object"==typeof n&&n),t.data(Bn,e)),"string"==typeof n){if("undefined"==typeof e[n])throw new TypeError('No method named "'+n+'"');e[n](this)}})},s(i,null,[{key:"VERSION",get:function(){return"4.3.1"}},{key:"DefaultType",get:function(){return Zn}},{key:"Default",get:function(){return ti}}]),i}();g.fn[Qn]=ni._jQueryInterface,g.fn[Qn].Constructor=ni,g.fn[Qn].noConflict=function(){return g.fn[Qn]=Yn,ni._jQueryInterface},function(){if("undefined"==typeof g)throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");var t=g.fn.jquery.split(" ")[0].split(".");if(t[0]<2&&t[1]<9||1===t[0]&&9===t[1]&&t[2]<1||4<=t[0])throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")}(),t.Util=_,t.Alert=p,t.Button=P,t.Carousel=lt,t.Collapse=bt,t.Dropdown=Jt,t.Modal=ve,t.Popover=sn,t.Scrollspy=Dn,t.Tab=Kn,t.Toast=ni,t.Tooltip=Be,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=bootstrap.min.js.map
/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

//Dashboard --------------------------------------------------------------------------------------------------------
var dashboardUI = {

    dashboardModeListners: [],
    dashboardViewMode: true,

    addDashboardModeListner: function (_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
        //check event listner and setup current network status 
        try {
            _event(_sender, this);
        } catch (exception) {
            console.error(exception);
            return; // don't add bad listner
        }
        dashboardUI.dashboardModeListners.push(event = { event: _event, sender: _sender });
    },

    onConfigLoad: function (configProperties) {


        var saveButtonPanel = document.getElementById("saveButtonPanel");

        var saveWidgetsButton = saveButtonPanel.appendChild(document.createElement('input'));
        saveWidgetsButton.className = "btn btn-warning btn-sm";
        saveWidgetsButton.type = "button";
        saveWidgetsButton.value = getLang("saveaddedwidget");
        saveWidgetsButton.hidden = true;
        saveWidgetsButton.id = "saveWidgetsButton";
        saveWidgetsButton.onclick = dashboardUI.saveAddedWidget;  
        config.onChange = dashboardUI.onConfigChange;


        var dashboardButtonsPanel = document.getElementById("dashboardButtonsPanel");
        var headerModeButton = dashboardButtonsPanel.appendChild(document.createElement('input'));
        headerModeButton.className = "btn btn-secondary btn-sm";
        headerModeButton.type = "button";
        headerModeButton.value = getLang("dashboardedit");
        headerModeButton.onclick = dashboardUI.changeDashboadMode;        

        var addWidgetButton = dashboardButtonsPanel.appendChild(document.createElement('input'));
        addWidgetButton.className = "btn btn-success btn-sm";
        addWidgetButton.type = "button";
        addWidgetButton.value = getLang("dashboardaddwidget");
        addWidgetButton.onclick = dashboardUI.addWidgetMode;

        var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");
        
        for (var i = 0; i < configProperties.dashboards[0].widgets.length; i++) {
            try {
                var widgetProp = configProperties.dashboards[0].widgets[i];
                var widgetLayer = WidgetsLayer.getWidgetById(widgetProp.widgetWrapperId);
                if (widgetLayer != undefined) {
                    var widgetWrapper = new widgetLayer.widget(driversWidgetsPanel, undefined, undefined, configProperties.dashboards[0].widgets[i], widgetProp.widgetProperties);
                                                          

                    widgetWrapper.offlineStarter(driversWidgetsPanel, widgetProp.driverId, widgetProp.driverProperty);                    
                    widgetWrapper.widget.onchange = config.onWidgetChange;
                    widgetWrapper.widget.ondelete = config.onWidgetDelete;
                    widgetWrapper.widget.properties = widgetProp.widgetProperties;
                }
            }
            catch (exception) {
                console.error(exception);
                addToLogNL("ERROR starting exception: " + exception, 2);
                addToLogNL("ERROR at widget: " + widgetProp, 2);
            }
        }

    },

    changeDashboadMode: function (event) {
        var headerModeButton = event.currentTarget;
        dashboardUI.dashboardViewMode = !dashboardUI.dashboardViewMode;

        if (dashboardUI.dashboardViewMode) {
            headerModeButton.value = getLang("dashboardedit");
            headerModeButton.className = "btn btn-secondary btn-sm";
        }
        else {
            headerModeButton.value = getLang("dashboardview");
            headerModeButton.className = "btn btn-info btn-sm";
        }


        for (var k = 0; k < dashboardUI.dashboardModeListners.length; k++) {
            dashboardUI.dashboardModeListners[k].event(dashboardUI.dashboardModeListners[k].sender, dashboardUI.dashboardViewMode);
        }

        return false;
    },

    addWidgetMode: function () {

        makeModalDialog("resetPanel", "widget", getLang("dashboardaddwidget"), getLang("areYouSure"));
        var modalBody = document.getElementById("widgetModalBody");
        modalBody.innerHTML = "";
        var modalFooter = document.getElementById("widgetModalFooter");
        //Body form -----------------
        var formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";

        //driver select 
        var driverLabel = formGroup.appendChild(document.createElement("label"));
        driverLabel.setAttribute("for", "driverSelect");
        driverLabel.innerText = getLang("nodeslist");
        var driverSelect = formGroup.appendChild(document.createElement('select'));
        driverSelect.className = "form-control form-control-sm";
        driverSelect.id = "typeSelect";

        for (var node in configProperties.nodes) {

            for (var i = 0; i < configProperties.nodes[node].drivers.length; i++) {
                var valueSelectOption = driverSelect.appendChild(document.createElement('option'));
                valueSelectOption.innerText = getLang(configProperties.nodes[node].drivers[i]._nodenickname + "/" + configProperties.nodes[node].drivers[i]._id);
                valueSelectOption.driver = configProperties.nodes[node].drivers[i];
            }
        }

        driverSelect.onchange = dashboardUI.onDriverSelect;
        //driver property select 

        var driverPropLabel = formGroup.appendChild(document.createElement("label"));
        driverPropLabel.setAttribute("for", "driverPropSelect");
        driverPropLabel.innerText = getLang("driversporplist");
        var driverPropSelect = formGroup.appendChild(document.createElement('select'));
        driverPropSelect.className = "form-control form-control-sm";
        driverPropSelect.id = "typeSelect";

        driverPropSelect.onchange = dashboardUI.onDriverPropSelect;

        //widgets 
        //driver select 
        var widgetLabel = formGroup.appendChild(document.createElement("label"));
        widgetLabel.setAttribute("for", "widgetSelect");
        widgetLabel.innerText = getLang("widgetslist");
        var widgetSelect = formGroup.appendChild(document.createElement('select'));
        widgetSelect.className = "form-control form-control-sm";
        widgetSelect.id = "typeSelect";



        driverSelect.driverPropSelect = driverPropSelect;
        driverPropSelect.driverSelect = driverSelect;
        driverSelect.widgetSelect = widgetSelect;

        var event = { currentTarget: driverSelect };
        dashboardUI.onDriverSelect(event);


        //end of Body form ----------
        var widgetButton = modalFooter.appendChild(document.createElement("button"));
        widgetButton.type = "button";
        widgetButton.className = "btn btn-sm btn-success";
        widgetButton.id = "widgetModalButton";
        widgetButton.driverSelect = driverSelect;
        widgetButton.onclick = dashboardUI.addWidgetClick;
        widgetButton.innerText = getLang("dashboardaddwidgetbutton");

        $("#widgetModal").modal('show');


    },

    onDriverSelect: function (event) {
        var driverSelect = event.currentTarget;
        var driverPropSelect = driverSelect.driverPropSelect;
        var widgetSelect = driverSelect.widgetSelect;
        var valueSelectOption = driverSelect.options[driverSelect.selectedIndex];


        var driver = valueSelectOption.driver;

        driverPropSelect.options.length = 0;
        for (var driverProp in driver) {
            if ((driver[driverProp].name == undefined) || (driver[driverProp].type == undefined)) continue;
            var propSelectOption = driverPropSelect.appendChild(document.createElement('option'));
            propSelectOption.innerText = driver[driverProp].name;
            propSelectOption.driverProp = driver[driverProp];
        }

        var driverPropSelectOption = driverPropSelect.options[driverPropSelect.selectedIndex];
        var driverProp = driverPropSelectOption.driverProp;
        dashboardUI.refreshWidgetsSelect(widgetSelect, driver, driverProp);
    },

    onDriverPropSelect: function (event) {
        var driverPropSelect = event.currentTarget;
        var driverSelect = driverPropSelect.driverSelect;
        var widgetSelect = driverSelect.widgetSelect;

        var driverSelectOption = driverSelect.options[driverSelect.selectedIndex];
        var driver = driverSelectOption.driver;
        var driverPropSelectOption = driverPropSelect.options[driverPropSelect.selectedIndex];
        var driverProp = driverPropSelectOption.driverProp;
        dashboardUI.refreshWidgetsSelect(widgetSelect, driver, driverProp);
    },

    refreshWidgetsSelect: function (widgetSelect, driver, driverProp) {
        widgetSelect.options.length = 0;
        for (var widget in WidgetsLayer) {
            if (WidgetsLayer[widget].widget == undefined) continue;
            if ((WidgetsLayer[widget].driversTypes.indexOf(";" + driver.type.value + ";") != -1) || (WidgetsLayer[widget].driversTypes == "any")) {
                if ((WidgetsLayer[widget].driversProperties.indexOf(";" + driverProp.name + ";") != -1) || (WidgetsLayer[widget].driversProperties == "any")) {
                    var widgetSelectOption = widgetSelect.appendChild(document.createElement('option'));
                    widgetSelectOption.innerText = WidgetsLayer[widget].name;
                    widgetSelectOption.widgetLayer = WidgetsLayer[widget];
                }
            }
        }

    },

    addWidgetClick: function (event) {
        var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");
        var button = event.currentTarget;
        var driverSelect = button.driverSelect;
        var driverPropSelect = driverSelect.driverPropSelect;
        var widgetSelect = driverSelect.widgetSelect;

        var valueSelectOption = driverSelect.options[driverSelect.selectedIndex];
        var driver = valueSelectOption.driver;
        var driverProp = driverPropSelect.options[driverPropSelect.selectedIndex].driverProp;
        var widgetLayer = widgetSelect.options[widgetSelect.selectedIndex].widgetLayer;

        new widgetLayer.widget(driversWidgetsPanel, driver, driverProp).onload = function (widgetWrapper) {

            var configPropertiesWidget = config.addWidget("main", driver._id, driverProp.name, widgetLayer.id, widgetWrapper.widget.id, widgetWrapper.widget.properties);

            widgetWrapper.widget.onchange = config.onWidgetChange;
            widgetWrapper.widget.ondelete = config.onWidgetDelete;


            $("#widgetModal").modal('hide');
        };

        /*
            var driversWidgetsPanel = document.getElementById("widgetsPanelDataDiv");
            var driver = drivers.getDriverById("temperature");    
            new TemperatureWidgetWrapper(driversWidgetsPanel, driver, driver.temperature);
            new TemperatureWidgetWrapper(driversWidgetsPanel, driver, driver.temperature, 1);
        
            var driver = drivers.getDriverById("humidiry");
            new HumidityDriver(driversWidgetsPanel, driver, driver.humidity);
            new HumidityDriver(driversWidgetsPanel, driver, driver.humidity, 1);
    
        */

    },

    saveAddedWidget: function (event) {
        var buttonSave = event.currentTarget;
        config.cancel = false;
        // buttonSave.hidden = true;

        var modalBody = document.getElementById("saveConfigModalBody");

        if (modalBody == null || modalBody == undefined) {

            makeModalDialog("resetPanel", "saveConfig", getLang("saveaddedwidget"), getLang("areYouSure"));
            modalBody = document.getElementById("saveConfigModalBody");
            modalBody.innerHTML = "";

            //Body saving status text and progress bar

            var divSavingStatus = modalBody.appendChild(document.createElement("div"));
            var textStatus = divSavingStatus.appendChild(document.createElement("p"));
            textStatus.className = "text-center";
            textStatus.id = "savingTextStatus";

            var divProgressClass = modalBody.appendChild(document.createElement("div"));
            divProgressClass.className = "progress";
            divProgressClass.id = "divProgressClass";

            var progressBar = divProgressClass.appendChild(document.createElement("div"));
            progressBar.className = "progress-bar progress-bar-striped bg-info";
            progressBar.id = "saveProgressBar";
            progressBar.setAttribute("role", "progressbar");
            progressBar.setAttribute("aria-valuenow", "0");
            progressBar.setAttribute("aria-valuemin", "0");
            progressBar.setAttribute("aria-valuemax", "100");
            progressBar.setAttribute("style", "width: 0%");
            progressBar.innerHTML = "0%";

            // Footer addition button "Close"
            var modalFooter = document.getElementById("saveConfigModalFooter");
            var saveCloseButton = modalFooter.appendChild(document.createElement("button"));
            saveCloseButton.type = "button";
            saveCloseButton.className = "btn btn-sm btn-success";
            saveCloseButton.setAttribute("data-dismiss", "modal");
            saveCloseButton.setAttribute("aria-label", "Close");
            saveCloseButton.innerText = getLang("closebutton");
            saveCloseButton.id = "saveConfigsaveCloseButton";
            saveCloseButton.hidden = true;
      

            //Button cancel interrapt function
            var savingCloseButton = document.getElementById("saveConfigcloseButton");
            savingCloseButton.onclick = dashboardUI.addWidgetCancel;
        }


        $('#saveConfigModal').on('hide.bs.modal', function (event) {

            if (config.cancel === true) {
                config.cancel = false;
                return true;
            }
            else {
  
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
            }
            
        });


        $("#saveConfigModal").modal('show');

        config.save();
    },

    addWidgetCancel: function (event) {

        var buttonCancel = event.currentTarget;
        var saveButtonAtPanel = document.getElementById("saveWidgetsButton");

        if (saveButtonAtPanel !== null && saveButtonAtPanel !== undefined) {
            saveButtonAtPanel.hidden = true;
        }

        config.cancel = true;
    },

    onConfigChange: function (configProperties) {
        var saveButton = document.getElementById("saveWidgetsButton");
        saveButton.hidden = false;
    }

}











﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

const nodes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']; 

var FilesList =
    
    function () {
        "use strict";

        function FilesList(filesAnchors, node) {
            this.filesAnchors = filesAnchors;
            this.node = node;
            this.parsedFilesList = "";
            this.filesAnchors.innerHTML = "";
            this.requestFilesList();
        }

        var _proto = FilesList.prototype;

        _proto.requestFilesList = function requestFilesList() {
            this.parsedFilesList = "";
            httpGetAsyncWithReciever(this.node.host + "getfilelist?path=", this.requestFilesListResult, this);
        };

        _proto.requestFilesListResult = function requestFilesListResult(HTTPResult, sender) {
            if (HTTPResult != "%error") {
                sender.parsedFilesList = HTTPResult.split("\n");
            } else {
                sender.parsedFilesList = "";
            }

            sender.drawFilesList();
        };

        _proto.drawFilesList = function drawFilesList() {
            if (this.uploadSpan == undefined) {
                this.uploadSpan = this.filesAnchors.appendChild(document.createElement('button'));
                this.uploadSpan.type = "button";
                this.uploadSpan.href = boardhost + "upload";
                this.uploadSpan.onclick = this.uploadClick;
                this.uploadSpan.setAttribute("data-toggle", "modal");
                this.uploadSpan.setAttribute("data-target", "#uploadModal");
                this.uploadSpan.innerText = getLang("upload");
                this.uploadSpan.filesList = this;
            }

            if (this.tableDiv == undefined) {
                this.tableDiv = this.filesAnchors.appendChild(document.createElement('div'));
            }

            this.tableDiv.innerHTML = "";

            if (this.parsedFilesList !== "") {
                this.uploadSpan.className = "btn btn-success btn-sm";
                var table = this.tableDiv.appendChild(document.createElement('table'));
                table.className = "table table-striped table-sm";
                table.id = this.node.nodenickname + "filestable";
                table.cellspacing = "0";
                var thead = table.appendChild(document.createElement('thead'));
                var tr = thead.appendChild(document.createElement('tr'));
                var th = tr.appendChild(document.createElement('th'));
                th.className = "w-2";
                th.innerText = "#";
                th.scope = "col";
                th = tr.appendChild(document.createElement('th'));
                th.className = "w-10";
                th.innerText = "name";
                th.scope = "col";
                th = tr.appendChild(document.createElement('th'));
                th.className = "w-5";
                th.innerText = "size";
                th.scope = "col";
                th = tr.appendChild(document.createElement('th')); //th.className = "w-50";

                th.innerText = "";
                th.scope = "col";
                var tbody = table.appendChild(document.createElement('tbody'));
                var filesCount = 1;

                for (var i = 0; i < this.parsedFilesList.length; i++) {
                    if (this.parsedFilesList[i] === "") continue;
                    var parsedFile = this.parsedFilesList[i].split(" ");
                    var tr = tbody.appendChild(document.createElement('tr'));
                    var th = tr.appendChild(document.createElement('th'));
                    th.scope = "row";
                    th.innerHTML = filesCount;
                    filesCount++;
                    var nameTd = tr.appendChild(document.createElement('td'));
                    var downloadHref = nameTd.appendChild(document.createElement('a'));
                    downloadHref.href = boardhost + "downloadfile?name=" + parsedFile[0];
                    downloadHref.target = "_blank";
                    downloadHref.title = "Download '" + parsedFile[0] + "' file";
                    downloadHref.innerText = parsedFile[0];
                    var valueTd = tr.appendChild(document.createElement('td'));
                    var valueSpan = valueTd.appendChild(document.createElement('span'));
                    valueSpan.className = "align-middle";
                    valueSpan.innerText = parsedFile[1];
                    var deleteTd = tr.appendChild(document.createElement('td'));
                    var deleteSpan = deleteTd.appendChild(document.createElement('a'));
                    deleteSpan.className = "badge badge-danger";
                    deleteSpan.href = "#";
                    deleteSpan.style.margin = "4px 0px 0px 0px";
                    deleteSpan.id = "_" + parsedFile[0];
                    deleteSpan.filename = parsedFile[0];
                    deleteSpan.onclick = this.deleteClick;
                    deleteSpan.innerText = "del";
                    deleteSpan.filesList = this;
                }

                $("#" + this.node.nodenickname + "filestable").DataTable({
                    "pageLength": 100,
                    "language": {
                        "lengthMenu": getLang("dt_display") + " _MENU_ " + getLang("dt_recordsperpage"),
                        "info": getLang("dt_showing") + " _START_ " + getLang("dt_to") + " _END_ " + getLang("dt_of") + " _TOTAL_ " + getLang("dt_entries"),
                        "search": getLang("dt_search"),
                        "paginate": {
                            "first": getLang("dt_first"),
                            "last": getLang("dt_last"),
                            "next": getLang("dt_next"),
                            "previous": getLang("dt_previous")
                        }
                    }
                });
            } else {
                this.uploadSpan.className = "btn btn-secondary btn-sm";
            }
        };

        _proto.deleteClick = function deleteClick(event) {
            event.stopPropagation();
            var deleteButton = event.currentTarget;
            deleteButton.className = "badge badge-warning";
            deleteButton.value = 'do...';
            deleteButton.disable = true;
            var httpResult = deleteFile(deleteButton.filesList.node.host, deleteButton.filename);

            if (httpResult == 1) {
                deleteButton.filesList.requestFilesList();
            } else {
                deleteButton.className = "badge badge-danger";
                deleteButton.value = 'bad';
            }

            deleteButton.disable = false;
            return false;
        };

        _proto.uploadClick = function uploadClick(event) {
            var filesListObject = event.currentTarget.filesList; //event.stopPropagation();

            document.getElementById("addDriverPanel").innerHTML = "";
            document.getElementById("resetPanel").innerHTML = "";
            var uploadPanel = document.getElementById("uploadPanel");
            uploadPanel.innerHTML = "";
            var modalFade = uploadPanel.appendChild(document.createElement("div"));
            modalFade.className = "modal fade";
            modalFade.id = "uploadModal";
            modalFade.tabindex = "-1";
            modalFade.setAttribute("role", "dialog");
            modalFade.setAttribute("aria-labelledby", "uploadModalLabel");
            modalFade.setAttribute("aria-hidden", "true");
            var modalDialog = modalFade.appendChild(document.createElement("div"));
            modalDialog.className = "modal-dialog";
            modalDialog.role = "document";
            var modalContent = modalDialog.appendChild(document.createElement("div"));
            modalContent.className = "modal-content";
            var modalHeader = modalContent.appendChild(document.createElement("div"));
            modalHeader.className = "modal-header";
            var modalTitle = modalHeader.appendChild(document.createElement("h5"));
            modalTitle.className = "modal-title";
            modalTitle.id = "uploadModalLabel";
            modalTitle.innerText = getLang("uploadfiles");
            var closeHeaderButton = modalHeader.appendChild(document.createElement("button"));
            closeHeaderButton.type = "button";
            closeHeaderButton.className = "close";
            closeHeaderButton.setAttribute("data-dismiss", "modal");
            closeHeaderButton.setAttribute("aria-label", "Close");
            var closeSpan = closeHeaderButton.appendChild(document.createElement("span"));
            closeSpan.setAttribute("aria-hidden", "true");
            closeSpan.innerText = "x";
            var modalBody = modalContent.appendChild(document.createElement("div"));
            modalBody.className = "modal-body";
            var inputGroup = modalBody.appendChild(document.createElement("form"));
            inputGroup.className = "form-group";
            inputGroup.id = "inputGroup";
            inputGroup.addEventListener('submit', filesListObject.inputGroupSubmit);
            inputGroup.filesListObject = filesListObject;
            var inputgroupprepend = inputGroup.appendChild(document.createElement("div"));
            inputgroupprepend.className = "input-group-prepend";
            var customFile = inputGroup.appendChild(document.createElement("div"));
            customFile.className = "custom-file  form-control-sm";
            var label = customFile.appendChild(document.createElement("label"));
            label.className = "custom-file-label";
            label.setAttribute("for", "inputGroupFile01");
            label.innerText = getLang("selectfiles");
            var fileInput = customFile.appendChild(document.createElement("input"));
            fileInput.className = "custom-file-input";
            fileInput.id = "inputGroupFile01";
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("aria-describedby", "inputGroupFileAddon01");
            fileInput.multiple = true;
            fileInput.onchange = filesListObject.inputGroupChange;
            fileInput.filesListObject = filesListObject;
            var filesList = customFile.appendChild(document.createElement("div"));
            filesList.id = "filesList";
            fileInput.filesList = filesList;
            fileInput.label = label;
            fileInput.customFile = customFile;
            var modalFooter = modalContent.appendChild(document.createElement("div"));
            modalFooter.className = "modal-footer";
            var closeButton = modalFooter.appendChild(document.createElement("button"));
            closeButton.type = "button";
            closeButton.className = "btn btn-info btn-sm";
            closeButton.setAttribute("data-dismiss", "modal");
            closeButton.setAttribute("aria-label", "Close");
            closeButton.innerText = getLang("cancel");
            $("#uploadtModal").modal('show');
            return false;
        };

        _proto.formatBytes = function formatBytes(x) {
            var l = 0,
                n = parseInt(x, 10) || 0;

            while (n >= 1024 && ++l) {
                n = n / 1024;
            }

            return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + nodes[l];
        };

        _proto.inputGroupChange = function inputGroupChange(event) {
            var fileInput = event.currentTarget;
            var filesListObject = fileInput.filesListObject;
            var filesList = fileInput.filesList;
            var label = fileInput.label;
            filesList.innerHTML = "";
            var files = fileInput.files;
            var totalSize = 0;

            for (var i = 0; i < files.length; i++) {
                var fileItem = filesList.appendChild(document.createElement("div"));
                fileItem.id = files[i].name + "fileItem";
                fileItem.innerHTML += "<b>" + files[i].name + "</b> " + filesListObject.formatBytes(files[i].size + " ");
                totalSize += files[i].size;
            }

            filesList.appendChild(document.createElement("div")).innerHTML += "<br>";
            filesListObject.uploadFileButton = filesList.appendChild(document.createElement("button"));
            filesListObject.uploadFileButton.className = "btn btn-success btn-sm";
            filesListObject.uploadFileButton.id = "doUploadButton";
            filesListObject.uploadFileButton.setAttribute("type", "submit");
            filesListObject.uploadFileButton.innerText = "upload";
            filesListObject.uploadFileButton.used = false;
            label.innerText = files.length + " file(s) selected, size " + filesListObject.formatBytes(totalSize);
        };

        _proto.uploadFileByIndex = function uploadFileByIndex(index) {
            var endPoint = this.node.host + "uploadfile"; //war mode

            var inputGroup = document.getElementById("inputGroup");
            var inputFile = document.getElementById("inputGroupFile01");
            var filesList = document.getElementById("filesList");
            var files = inputFile.files;

            if (index >= files.length) {
                this.uploadFileButton = document.getElementById("doUploadButton");
                this.uploadFileButton.innerText = "complete";
                return;
            }

            var fileItem = document.getElementById(files[index].name + "fileItem");
            if (fileItem == null) return;
            var formData = new FormData(inputGroup);
            formData.append(files[index].name, files[index], files[index].name);
            var request = new XMLHttpRequest();
            request.fileItem = fileItem;
            request.filesListObject = this;

            request.onloadend = function (oEvent) {
                if (this.readyState == 4) fileItem.innerHTML += " done"; else if (this.status != 0) {
                    fileItem.innerHTML += this.status + " " + this.responseText;
                }
                this.filesListObject.uploadFileByIndex(++index);
            };

            request.onprogress = function (oEvent) {
                if (this.status == 0) return;
                fileItem.innerHTML += ".";
            };

            request.onloadstart = function (oEvent) {
                if (this.readyState == 1) {
                    fileItem.innerHTML += ".";
                }
            };

            request.onabort = function (oEvent) {
                if (this.status == 0) return;
                fileItem.innerHTML += " abort";
            };

            request.onerror = function (oEvent) {
                if (this.status == 0) return;
                fileItem.innerHTML += " error";
            };

            request.ontimeout = function (oEvent) {
                if (this.status == 0) return;
                fileItem.innerHTML += " timeout";
            };

            request.onreadystatechange = function (oEvent) {
                fileItem.innerHTML += ".";
            };

            request.onload = function (oEvent) {
                if (request.status == 200) {
                    fileItem.innerHTML += "OK";
                } else if (request.status == 503) {
                    fileItem.innerHTML += "can't create file";
                } else if (request.status == 503) {
                    fileItem.innerHTML += "aborted";
                } else {
                    fileItem.innerHTML += request.status + " error";
                }
            };

            request.open("POST", endPoint, true);
            request.send(formData);
        };

        _proto.inputGroupSubmit = function inputGroupSubmit(event) {
            var filesListObject = event.currentTarget.filesListObject;

            if (!filesListObject.uploadFileButton.used) {
                filesListObject.uploadFileButton.used = true;
                filesListObject.uploadFileButton.className = "btn btn-default btn-sm";
                filesListObject.uploadFileButton.setAttribute("type", "");
                filesListObject.uploadFileButton.innerText = "in progress...";
                filesListObject.uploadFileButton.disable = true;
                filesListObject.uploadFileByIndex(0);
            }

            event.preventDefault();
        };

        return FilesList;
    }();/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

/*
 
Виджет (Widget) - https://ru.wikipedia.org/wiki/%D0%AD%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82_%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%D0%B0
 
Реализация базового(родительского) виджета.Все виджеты наследники объекта BaseWidget описанного в этом файле. 
-------------------------------------------------------------------------------------------------------------

Особенности реализации, примечания:
-----------------------------------
- Виджеты в этом проекте реализуются как можно более независимо от остальных модулей, идея заключается в том, что виджеты можно использовать для других проектов, особо не модифицируя код. 

- Для визуализации был выбран SVG - векторная графика, относительно быстрый рендеринг, отсутствие "пиксилиризации".Изначально, в первых версиях использовался классический HTML Canvas, что 
вызвало ряд проблем, в том числе - "пиксилиризация" шрифтов, сложности масштабирования.

- Так как виджеты "отвязаны" от основного проекта, существует ряд объектов "оберток"(Wrappers), их реализацию можно увидеть в файле WidgetsWrappers.js.

- Для совместимости с Internet Explorer пришлось отказаться от классов и "правильного" наследования https://babeljs.io/docs/en/learn/

Архитектура и свойства виджетов:
--------------------------------
- виджет формирует изображение(рисует векторную картинку, рендерит контент) в корневом HTML DIV элементе - WidgetHolder, WidgetHolder родительский элемент для всех используемых
  SVG элементов виджета. Так же, в данной реализации WidgetHolder осуществляет сопряжение виджетов с сеткой Bootstrap, сопрягая расположение элементов внутри страницы. 

- для большинства SVG элементов реализованы классы обертки, регламентирующие прямое использование свойств DOM SVG элементов, все классы расположены в файле DrawCore.js.
  DrawCore.js самодостаточный файл, вы можете использовать его отдельно для свои SVG проектов. 

- как правило на верхний уровень WidgetHolder помещается только один SVG ViewBox элемент SVGViewBox - на этом уровне SVGViewBox отвечает за скалинг остальных элементов. Таким образом 
  WidgetHolder позволяет масштабировать и позиционировать виджет используя Bootstrap, а в SVGViewBox отвечает за масштаб элементов внутри виджета. 

- для правильного внутреннего масштабирования, SVG элементы должны "знать" исходный размер области экрана для от рисовки (изначально), по этой причине инициализация виджета происходит в 
  два этапа - "конструктор" (классы не поддерживаются - поэтому метод function BaseWidget(...) формально играет роль конструктора) 
    1) инкапсулирует WidgetHolder элемент, назначает ему Bootstrap HTML ClassName - например "col-sm-1" (одна ячайка в 12 разрядной сетке).

    2) создает функция с потоком ожидания готовности WidgetHolder waitForElement(), этой функции передается адрес метода onWidgetHolderLoad() который будет вызван как только ожидающий поток 
    "обнаружит" возможность работать со свойствами WidgetHolder в рамках DOM.

    3) В момент вызова onWidgetHolderLoad() WidgetHolder находится на экране и получил все необходимые DOM свойства, в частности размер. onWidgetHolderLoad() инкапсулирует SVGViewBox и все необходимые 
    SVG элементы - привязываясь к текущему размеру WidgetHolder.
    3.1) виджет предоставляет событие .onload - реализовав обработчик этого события, внешняя программа может "узнать" о том когда виджет загружен и готов к использованию. 

    4) "конструктор" function BaseWidget(...) назначает обработчик события document..body.onresize - таким образом все привязанные к первоначальному размеру WidgetHolder элементы могут "узнают" об 
    изменениях масштаба экрана. А так как все они помещены в SVGViewBox - достаточно изменять его размер симметрично изменениям размера экрана и сетки bootstrap.

 - методы refresh(), drawText(), drawWidget():
 -- все виджеты обязаны наследовать и перекрывать эти методы для внесения изменений в визуализацию виджита. 
 -- refresh() создан для передачи отображаемых данных в виджет (в данном случае данных микроконтроллера)
 -- drawText() управляет SVG текстовыми элементами виджета. 
 -- drawWidget() управляет SVG графическими элементами виджета. 
 -- drawText() и DrawWidget() реализованы отдельно, по той причине что многие изменяемые данные, представляют собой текст - для экономии ресурсов и повышения производительности, были решено 
    "перерисовывать" текст отдельно. 

Использование:
 - вызвать baseWidget(), в параметрах назначить родительский HTML элемент. 
 - по необходимости реализовать baseWidget.onload обработчик, и настроить виджет в этом обработчике. 
 - по мере необходимости вызывать метод refresh() передавая новые данные для отображения виджетом (данные зависят от конкретного типа виджета)

*/

// флажки режимов виджета
var WORK_MODE = 0; // в этом режиме виджет отображает данные
var MOVE_MODE = 1; // в этом режиме виджет отображает элементы управления собой - переместить, изменить свойства, удалить

// флажки состояний виджета
var EVENT_NO = 0; // ничего нет 
var EVENT_DELETE = 1; // виджет удаляется 

//------------------------------------------------------------------------------------------------------------------------------------------
// Объект базового виджета, общее описание находится в начале этого файла
var BaseWidget =

    function () {
        "use strict"; //https://www.w3schools.com/js/js_strict.asp
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // "конструктор" виджета, все "наследники" обязаны вызывать этот метод первым
        // parentPanel - HTML элемент в который будет помещен виджет
        // id - уникальный идентификатор этого виджета (не путать с DOM HTML element.id)
        function BaseWidget(parentPanel, id) {

            this.parentPanel = parentPanel; // сохраняем родительскую панель в свойство виджета 
            this.id = id; // сохраняем id виджита
            this._networkStatus = NET_OFFLINE; // по умолчанию виджет "считает" что не подключен к сети
            this._event = EVENT_NO; // никаких состояний нет 
            this.mouseEnter = false; // сбрасываем индикатор нахождения мыши над виджетом
            

            // подготовка основной (родительский) панели виджета (все остальные элементы будут дочерний к этой панели)
            this.widgetHolder = this.parentPanel.appendChild(document.createElement("div"));
            this.widgetHolder.id = id + "BaseWidget"; // назначаем DOM HTML element.id панели (он должен быть уникален для всего DOM)
            this.widgetHolder.widget = this; // в дальнейшем эта панель будет использована в других потоках, сохраним ссылку на текущий виджет в ее свойстве
            //see: http://shoelace.io/
            //see: https://getbootstrap.com/docs/4.0/layout/grid/
            //container width  None (auto)  540px     720px    960px    1140px
            //Class prefix        col-     col-sm-  col-md-   col-lg-   col-xl- (1..12)
            //по умолчанию (когда длина меньше чем 540 - под два виджета на панель, когда больше 6 виджетов, более 960 - двенадцать виджетов 
            this.widgetHolder.className = "col-3 col-sm-2 col-lg-1"; // назначаем Bootstrap класс для панели (одна ячейка из двенадцати по умолчанию) (в случае использования с Bootstrap)
            this.widgetHolder.style.cursor = "pointer"; // переопределяем тип курсора
            this.widgetHolder.onmouseover = this.mouseOver; // когда пользователь наведет мышью на виджет сработает этот обработчик события 
            this.widgetHolder.onmouseout = this.mouseOut; // когда пользователь уберет мышь этот обработчик 
            this.widgetHolder.style.display = "block";

            // вызываем функцию с отдельным потоком ожидания появления панели widgetHolder в текущем DOM
            // когда панель будет готова к использованию waitForElement() вызовет метод onWidgetHolderLoad() в этом объекте
            waitForElement(this.widgetHolder, this.onWidgetHolderLoad);

            // назначаем обработчик события body.onresize в этом объекте виджета, когда окно браузера изменит размер - виджет узнает об этом
            var body = document.getElementsByTagName("BODY")[0];
            // первый созданный виджет назначает обработчик для события body.onresize
            // если первый виджет будет удален - он переназначит обработчик другому (первому найденному) виджету 
            if (body.onresize == null) {
                body.onresize = this.onPanelResize;
            }
            // добавляем в body свойство body.widgets - массив всех созданных виджетов - если виджет первый он создаст это свойство
            if (body.widgets == undefined) {
                body.widgets = [];
            }
            // помещаем вновь созданный виджет в body.widgets[] массив
            body.widgets.push(this);
            // NOTЕ: "конструктор" завершается, далее waitForElement() вызовет onWidgetHolderLoad() для того что бы продолжить создание виджета            
        }
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // вызывается из потока ожидания когда WrapperHolder готов к пользованию (DOM properties ready)
        BaseWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            // так как метод будет вызван из другого потока, невозможно использовать this или прямую ссылку на объект
            // waitForElement поместит ссылку на widget в event.currentTarget
            var widgetHolder = event.currentTarget;
            // WrapperHolder содержит ссылку на "свой" виджет, изымаем ее, теперь widget ссылка на текущий виджет (смотрите метод "конструктор" выше)
            var widget = widgetHolder.widget;
            // onWidgetHolderLoad вызывается тогда когда widgetHolder получил DOM свойства - используем текущий DOM размер widgetHolder для масштабирования всех SVG элементов
            widget.size = widget.widgetHolder.clientWidth;

            // получив текущий масштаб готовим константы для расстановки SVG элементов внутри виджета
            widget.panding = widget.size / 25; // отступ от края виджета 1/25 его размера
            widget.halfPanding = widget.panding / 2;
            widget.radius = widget.size / 7; // для встроенных радиальных элементов
            widget.width = widget.size - widget.halfPanding; // внутренние размеры области прорисовки
            widget.height = widget.size - widget.halfPanding;
            widget.topMargin = widget.height / 20; // отступ от верхней границы
            widget.centreX = widget.width / 2 + widget.panding / 2; // центр по горизонтали
            widget.centreY = widget.height / 2; // центр по вертикали

            // инкапсулируем SVG ViewBox - все остальные SVG элементы будут помещены в него. Обратите внимание на масштаб. 
            widget.SVGViewBox = document.createElementNS(xmlns, "svg");
            widget.SVGViewBox.setAttributeNS(null, "viewBox", "0 " + "0 " + widget.size + " " + widget.size);
            widget.SVGViewBox.style.display = "block"; // HTML DOM -> https://www.w3schools.com/cssref/pr_class_display.asp

            // фоновая панель (подложка) виджета (фон и бордюр)
            widget.SVGBackgroundPanel = new SVGArc(widget.SVGViewBox, widget.id + "backgroundpanel", 0, 0, widget.width, 1);
            widget.SVGBackgroundPanel.drawRoundedRect(widget.width, widget.height, 5, 10, true, true, true, true);            
            // панель для заголовка (верхняя часть виджета с его названием)
            widget.SVGHeaderPanel = new SVGArc(widget.SVGViewBox, widget.id + "headerpanel", 0, 0, widget.width, 1);
            widget.SVGHeaderPanel.drawRoundedRect(widget.width, 25, 5, 0, true, true, false, false);
            // нижняя панель виджета, отображает сетевое состояние
            widget.SVGBackdownpanel = new SVGArc(widget.SVGViewBox, widget.id + "backdownpanel", 0, widget.height - 10, widget.width, 1);
            widget.SVGBackdownpanel.drawRoundedRect(widget.width, 10, 5, 0, false, false, true, true);
            widget.SVGBackdownpanel.opacity = 0.9;
            widget.SVGBackdownpanel.fill = theme.secondary;
            // основной текст виджета - обычно расположен в центре. Используется многими виджетами для отображения данных 
            // widget.size / 80 - размер шрифта текст относительно текущего масштаба widgetHolder
            widget.SVGWidgetText = new SVGText(widget.SVGViewBox, widget.id + "widgettext", widget.size / 80);
            widget.SVGWidgetText.opacity = 0.7;
            widget.SVGWidgetText.color = theme.secondary;
            // текст для заголовка виджета, находится над SVGHeaderPanel панелью
            widget.SVGHeaderText = new SVGText(widget.SVGViewBox, widget.id + "headertext", widget.size / 150);
            widget.SVGHeaderText.color = theme.secondary;
            // подпись внизу виджета, обычно информация о сетевом состоянии виджета (находится над SVGBackdownpanel)
            widget.SVGHint = new SVGText(widget.SVGViewBox, widget.id + "hint", widget.size / 150);
            widget.SVGHint.color = theme.secondary;

            // подготавливаем градиент для спиннера (спиннер будет отображаться когда виджет уходит в состояния ожидания)
            var stop1 = document.createElementNS(xmlns, 'stop'); // первый фрагмент градиента 
            stop1.setAttribute('stop-color', theme.info);
            stop1.setAttribute('stop-opacity', "0.7");
            stop1.setAttribute('offset', "0%");
            var stop2 = document.createElementNS(xmlns, 'stop'); // второй фрагмент градиента 
            stop2.setAttribute('class', 'stop2');
            stop2.setAttribute('stop-color', theme.info);
            stop2.setAttribute('stop-opacity', "0.4");
            stop2.setAttribute('offset', "20%");
            var stop3 = document.createElementNS(xmlns, 'stop'); // третий фрагмент градиента 
            stop3.setAttribute('class', 'stop3');
            stop3.setAttribute('stop-color', theme.info);
            stop3.setAttribute('stop-opacity', "0.0");
            stop3.setAttribute('offset', "60%");
            var gradient = document.createElementNS(xmlns, 'linearGradient'); // создаем градиент 
            gradient.id = widget.id + 'widgetspinnergradient'; //глобальное ID для этого градиента
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            gradient.appendChild(stop3);
            widget.SVGViewBox.appendChild(gradient); // SVGViewBox будет удерживать градиент в DOM                        
            // создаем спиннер
            widget.SVGArcSpinner = new SVGArc(widget.SVGViewBox, widget.id + "arcwidget", widget.centreX, widget.centreY + widget.topMargin, widget.size / 4, widget.size / 24);
            widget.SVGArcSpinner.color = 'url(#' + widget.id + 'widgetspinnergradient)'; // цвет спиннера - градиент 
            widget.SVGArcSpinner.opacity = 0.4; //полупрозрачный 

            // создаем эквалайзер 
            // состоит из множества элементов, каждый элемент находится в своем массиве (столбце), каждый такой массив в массиве столбцов
            // 30 столбцов по 5 элементов в каждом (150 элементов в эквалайзере)
            widget.eCount = 30; // эквалайзер из 30 секций
            widget.eWidth = widget.size / (widget.eCount + 50); // ширина эквалайзера
            widget.eRWidth = widget.width / 40; // ширина одного элемента
            widget.eHeight = widget.eWidth; // высота элемента
            widget.eX = widget.width / 2 - widget.eWidth * 2 * widget.eCount / 2 + widget.halfPanding / 2 + 2; // сдвиг слева 
            widget.eY = widget.height - widget.eHeight * 2 * 5 - 2; // сдвиг сверху
            widget.equalizerX = []; // массив для хранения элементов эквалайзера (столбцов с элементами)
            // инкапсулируем элементы эквалайзера
            for (var x = 0; x < widget.eCount; x++) { // движемся по колонкам слева направо 
                var equalizerY = []; // элементы одного столбца 
                for (var y = 0; y < 5; y++) { // 5 элементов в одном столбце 
                    // инкапсулируем каждый элемент и помещаем на свое место 
                    var SVGEqualizerpanel = new SVGRect(widget.SVGViewBox, widget.id + "equalizerpanel" + parseInt(x) + "_" + parseInt(y), widget.eX + x * widget.eWidth * 2, widget.eY + y * widget.eHeight * 2, widget.eRWidth, widget.eRWidth);
                    SVGEqualizerpanel.opacity = 0.0; // по умолчанию элемент не виден
                    SVGEqualizerpanel.fill = theme.secondary;
                    // помещаем элемент в столбец
                    equalizerY.push(SVGEqualizerpanel);
                }
                // помещаем столбец с элементами в массив столбцов эквалайзера 
                widget.equalizerX.push(equalizerY);
            }
            // кнопки управления виджетом - отображаются в режиме "Редактирования виджета" (сдвиг влево, сдвиг вправо, удаление, настройка свойств виджета)
            // кнопки реализованы на основе SVGImage (Icons)
            widget.rowSize = widget.size / 6; // относительный размер одной кнопки 
            // кнопка сдвига влево
            // данные для прорисовки иконки кнопки "leftIcon" находится в DrawCore.js 
            widget.SVGLeftIcon = new SVGIcon(widget.SVGViewBox, leftIcon, widget.panding, widget.height - widget.rowSize, widget.rowSize, widget.rowSize);
            widget.SVGLeftIcon.fill = theme.light;
            widget.SVGLeftIcon.SVGIcon.widget = widget;
            widget.SVGLeftIcon.SVGIcon.onclick = widget.moveLeft; // назначаем обработчик события по клику на эту кнопку (смотрите метод moveLeft())
            widget.SVGLeftIcon.hide(); // по умолчанию кнопка скрыта 
            // кнопка сдвига вправо
            widget.SVGRightIcon = new SVGIcon(widget.SVGViewBox, rightIcon, widget.width - widget.rowSize, widget.height - widget.rowSize, widget.rowSize, widget.rowSize);
            widget.SVGRightIcon.fill = theme.light;
            widget.SVGRightIcon.SVGIcon.widget = widget;
            widget.SVGRightIcon.SVGIcon.onclick = widget.moveRight;
            widget.SVGRightIcon.hide();
            // кнопка удаления виджета 
            widget.SVGDeleteIcon = new SVGIcon(widget.SVGViewBox, deleteIcon, widget.width - widget.rowSize + widget.size / 28, 0, widget.rowSize, widget.rowSize);
            widget.SVGDeleteIcon.fill = theme.light;
            widget.SVGDeleteIcon.SVGIcon.widget = widget;
            widget.SVGDeleteIcon.SVGIcon.onclick = widget.deleteWidgetClick;
            widget.SVGDeleteIcon.hide();
            // кнопка отображения диалога редактирования свойств виджета 
            widget.SVGPropertiesIcon = new SVGIcon(widget.SVGViewBox, buildIcon, widget.width / 2 - widget.rowSize / 2, widget.height - widget.rowSize, widget.rowSize, widget.rowSize);
            widget.SVGPropertiesIcon.fill = theme.light;
            widget.SVGPropertiesIcon.SVGIcon.widget = widget;
            widget.SVGPropertiesIcon.SVGIcon.onclick = widget.propertiesClick;
            widget.SVGPropertiesIcon.hide();

            // помещаем созданные SVG элементы в панель widgetHolder 
            widget.widgetHolder.appendChild(widget.SVGViewBox);

            // применяем свойства отображения виджета по умолчанию (пользователь может изменять свойства виджета runtime, смотрите диалог редактирования свойств виджета)
            // NOTE:
            // вызов widget._properties не приводит к вызову setter "properties" (смотрите в этом объекте setter properties)
            // в свою очередь вызов widget.properties вызовет setter, который вызовет методы drawText() и drawWidget() - таким образом, изменив свойства отображения виджета и 
            // вызвав widget.properties = someNewProperties или даже widget.properties = widget.properties вы "заставите" виджет перерисовать SVG элементы и визуально изменить стиль.
            //      -> родительский объекты baseWidget намерено использует вызов widget._properties, не производит перерисовку SVG элементов
            //      -> все дочерние объекты baseWidget обязаны явно вызвать setter widget.properties в своих перезагруженных методах onWidgetHolderLoad и применить свои стили для SVG
            //      элементов виджета
            widget._properties = widget.defaultWidgetProperties();

            // применяем текущий размер widgetHolder к SVGViewBox
            widget.resize(widget.widgetHolder.clientWidth);
            // переводим виджет в режим WORK_MODE
            widget.mode = WORK_MODE;

            // NOTE:
            // BaseWidget не вызывает событие .onload - это обязаны сделать наследники этого объекта, для того что бы оповестить внешний код о завершении загрузки
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // отрисовка текстовых SVG элементов виджета
        BaseWidget.prototype.drawText = function drawText() {
            if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет в состоянии удаления, не рисуем ничего

            if (this.SVGWidgetText == undefined) return; // если SVG элементы не готовы (не был вызван onWidgetHolderLoad()) и кто то обратился к этому методу 

            // центральный текст виджета, обычно отображает данные, помещаем в него текст  
            if (this.widgetText != undefined) { // если свойство уже определено внешним кодом
                this.SVGWidgetText.text = this.widgetText;
            }
            else { // иначе сбрасываем текст (что бы не печатать "undefined")
                this.SVGWidgetText.text = "";
            }
            // размер текста и размера шрифта могли изменится - пере центрируем текст внутри виджета 
            // также может изменится размер самого виджета и текст нуждается в новой центровке
            if (this.SVGWidgetText.width != 0) { // если текст не пуст (назначения не пустой строки в качестве текста виджета должно было изменить его ширину)
                this.SVGWidgetText.x = this.centreX - this.SVGWidgetText.width / 2; // центрируем по горизонтали 
                this.SVGWidgetText.y = this.centreY + this.SVGWidgetText.height / 2; // центрируем по вертикали 
            }

            // текст заголовка виджета 
            if (this._properties.headertext.value != undefined) {
                if (this.SVGHeaderText.text !== this._properties.headertext.value) { // если текст изменился 
                    this.SVGHeaderText.text = this._properties.headertext.value; // переносим текст в SVG элемент 
                    if (this.SVGHeaderText.width > this.size) { // если ширина текста более ширины виджета 
                        // вычисляем допустимое количество символов для заголовка (что бы умещались в ширину виджета)
                        var coef = this.SVGHeaderText.width / (this._properties.headertext.value.length + 3);
                        var charCount = (this.size - this.size / 3) / coef;
                        // отрезаем допустимое количество символов, дополняем строку "..."
                        this.SVGHeaderText.text = this._properties.headertext.value.slice(0, parseInt(charCount)) + "...";
                    }
                }
            }
            else {
                this.SVGHeaderText.text = "";
            }
            // центрируем текст заголовка 
            if (this.SVGHeaderText.width > 0) {
                this.SVGHeaderText.x = this.centreX - this.SVGHeaderText.width / 2;
                this.SVGHeaderText.y = this.SVGHeaderText.height;
            }

            // цвета текстовых SVG элементов, зависят от сетевого статуса виджета 
            switch (this._networkStatus) {
                case NET_ONLINE: // когда виджет онлайн 
                    // toColor() - метод реализующий плавную смену градиентов цвета (анимация)
                    // this._properties.valuetextcolor.value свойства виджета определяющее цвет главного текста в онлайн режиме (пользователь может назначить свой цвет)
                    this.toColor(this.SVGWidgetText, this._properties.valuetextcolor.value);
                    this.toColor(this.SVGHeaderText, theme.light);
                    this.SVGHint.text = getLang("rid_online"); // назначаем текст для нижней подписи виджета (сетевой статус) в этом кейсе
                    this.toColor(this.SVGHint, theme.success);
                    break;
                case NET_ERROR: // ошибка сети
                    this.toColor(this.SVGWidgetText, theme.danger);
                    this.toColor(this.SVGHeaderText, theme.danger);
                    this.SVGHint.text = getLang("rid_error");
                    this.toColor(this.SVGHint, theme.danger);
                    break;
                case NET_RECONNECT: // пере подключение (при таком статусе виджет ожидает соединения с сетью)
                    this.toColor(this.SVGWidgetText, theme.info);
                    this.toColor(this.SVGHeaderText, theme.info);
                    this.SVGHint.text = getLang("rid_connect");
                    this.toColor(this.SVGHint, theme.info);
                    break;
                default:
                    //по умолчанию виджет оффлайн, не подключен к сети 
                    this.toColor(this.SVGWidgetText, theme.secondary);
                    this.toColor(this.SVGHeaderText, theme.secondary);
                    this.SVGHint.text = getLang("rid_offline");
                    this.toColor(this.SVGHint, theme.secondary);
                    break;
            }

            // центрируем нижний текст виджета, сетевой статус
            if (this.SVGHint != 0) {
                this.SVGHint.x = this.centreX - this.SVGHint.width / 2;
                this.SVGHint.y = this.height - this.SVGHint.height / 2;
            }
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // отрисовка векторных-графических SVG элементов виджета
        BaseWidget.prototype.drawWidget = function drawWidget() {
            if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
            if (this.SVGBackgroundPanel == undefined) return; // если SVG элементы виджета не готовы ничего не делаем (не был вызван onWidgetHolderLoad())

            // назначаем цвет фона и бордюра фоновой панели
            // this._properties.bordercolor.value свойство виджета хранящая цвет (может быть изменено пользователем - по этой причине переопределяем цвет)
            this.SVGBackgroundPanel.color = this._properties.bordercolor.value;
            this.SVGBackgroundPanel.fill = this._properties.backgroundcolor.value;
            this.SVGBackgroundPanel.opacity = this._properties.backgroundopacity.value; // прозрачность фона виджета так же может меняться
            // назначаем цвет панели заголовка 
            this.SVGHeaderPanel.opacity = this._properties.headeropacity.value;
            this.SVGHeaderPanel.fill = this._properties.headercolor.value;

            // в зависимости от состояния сети, цвет нижней панели виджета меняется 
            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.SVGBackdownpanel.fill = theme.success;
                    break;
                case NET_ERROR:
                    this.SVGBackdownpanel.fill = theme.danger;
                    break;
                case NET_RECONNECT:
                    this.SVGBackdownpanel.fill = theme.info;
                    break;
                default:
                    this.SVGBackdownpanel.fill = theme.light;
                    break;
            }

            // рисуем эквалайзер если соответствующий флажок установлен в true
            if (this._properties.showequalizer.value === 'true') {
                for (var x = 0; x < this.eCount; x++) { // обходим все столбцы 
                    var equalizerY = this.equalizerX[x];
                    for (var y = 0; y < 5; y++) { // обходим все элементы в столбцах 
                        if (this._networkStatus == NET_ONLINE) { // если виджет онлайн делаем элемент видимым
                            equalizerY[y].fill = theme.secondary; // цвет каждого элемента по умолчанию "неактивен" 
                            equalizerY[y].opacity = (y + 1) * 0.08;
                        } else { // если виджет оффлайн скрываем все элементы эквалайзера 
                            equalizerY[y].opacity = 0.0;
                        }
                    }
                }
                // отмечаем активные элементы эквалайзера 
                if (this._networkStatus == NET_ONLINE) { // если он онлайн 
                    if (this.historyData != undefined) { // если виджету назначили historyData
                        // historyData - CSV строка в специальном формате, при помощи которой внешний код передает виджету данные для отображения в эквалайзере
                        // формат historyData:
                        // количество_элементов;значение_float_первого_элемента;значение_float_второго_элемента;...значение_float_последнего_элемента;
                        // номер последнего_элемента = количество_элементов

                        var splitHistory = this.historyData.split(";"); // парсим содержимое CSV в массив строк
                        var count = splitHistory[0]; // вынимаем количество_элементов
                        var prop = count / this.eCount; // сопоставляем количество присланных элементов с количеством столбцов эквалайзера 
                        var bigValue; // переменная для поиска самого большого значения элемента, изначально undefined
                        // ищем элемент с самым большим значением и помещаем это значение в bigValue
                        for (var x = 0; x < count; x++) {
                            var equalizerY = this.equalizerX[parseInt(x / prop)];
                            var value = splitHistory[x + 1];
                            if (bigValue == undefined || value > bigValue) {
                                bigValue = value;
                            }
                        }
                        // в высоту эквалайзер состоит из 5 элементов, вычисляем шаг возрастания значения элементов исходя из значения самого большого
                        // например если самое большое значение 100, а значение для текущего столбца 30 то:
                        // 100 / 5 = 20 (20 шаг для элементов снизу вверх)
                        // первый элемент с низу 20, выше 40, еще выше 60 и так далее до 100
                        // 20 < 30 - отображаем первый элемент снизу
                        // 40 > 30 - второй и все элементы выше не отображаются 
                        var propValue = parseFloat(bigValue / 5);

                        //обходим все элементы эквалайзера и определяем их цвет для текущих значений historyData
                        for (var x = 0; x < count; x++) { // столбцы 
                            if (count < this.eCount) { // количество данных в historyData может не соответствовать количеству столбцов
                                var equalizerY = this.equalizerX[x]; // если данных меньше 
                            } else { // если данных больше "уплотняем" эквалайзер 
                                var equalizerY = this.equalizerX[parseInt(x / prop)];
                            }
                            // вынимаем значение для текущего столбца, учитывая выравнивание всех столбцов относительно столбца с самым большим значением
                            var value = parseInt(splitHistory[x + 1] / propValue);
                            // value значение данных для текущего столбца, превращенное в количество видимых (окрашенных) элементов снизу-вверх
                            for (var y = 0; y < value; y++) { // изменяем цвет только для элементов согласно текущему значению historyData - относительно значения самого большого элемента из нее
                                equalizerY[4 - y].opacity = (1.0 - parseFloat(y / 4.0)) / 2.0; // прозрачность элемента зависит от его позиции относительно по высоте (самые нижние ярче)
                                equalizerY[4 - y].fill = theme.success;
                            }
                        }
                    }
                }
            }
            else { // если эквалайзер отключен, прячем его элементы 
                for (var x = 0; x < this.eCount; x++) {
                    var equalizerY = this.equalizerX[x];
                    for (var y = 0; y < 5; y++) { equalizerY[y].opacity = 0.0; }
                }
            }

            // когда сетевое состояние виджета находится в режиме - пере подключение, отображаем спиннер (анимация)           
            if (this._networkStatus == NET_RECONNECT) {
                this.spinnerAngle += 1.5; // приращение угла вращения спиннера (влияет на скорость вращения, чем больше угол тем быстрее и на оборот)

                if (this.SVGArcSpinner.opacity < 0.8) { // постепенно наращиваем непрозрачность спиннера  
                    this.SVGArcSpinner.opacity += 0.01;
                }
                // рисуем спиннер с вращением на новый угол
                this.SVGArcSpinner.draw(this.spinnerAngle, 240 + this.spinnerAngle);
                var _this = this;
                // готовим поток для анимации, браузер вызовет метод drawWidget() когда очередной анимационный фрейм будет возможен 
                // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
                // TODO: привязку ко времени 
                requestAnimationFrame(function () {
                    return _this.drawWidget();
                });
            } else { // если сетевой статус не NET_RECONNECT, прячем спиннер, не вызываем анимацию
                this.SVGArcSpinner.opacity = 0.0;
                this.SVGArcSpinner.hide();
            }
        };

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // вызывается в тот момент когда widgetHolder панель получила свой размер в DOM и виджет должен корректировать свой масштаб согласно новым размерам widgetHolder панели
        BaseWidget.prototype.resize = function resize(size) {
            this.size = size; // сохраняем текущий размер в свойстве виджета            
            if (this.SVGWidgetText == undefined) return; // если виджет "не готов" (не инкапсулированы SVG элементы) выходим
            // все SVG элементы расположенный в SVGViewBox - изменение его размеров повлияет не размеры остальных элементов
            this.SVGViewBox.setAttributeNS(null, "width", size);
            this.SVGViewBox.setAttributeNS(null, "height", size );
        }

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик события document...body.onresize(), вызывается когда браузер меняет свой размер 
        // NOTE: только один виджет назначает body этот обработчик
        BaseWidget.prototype.onPanelResize = function onPanelResize() {
            //see: https://ryanve.com/lab/dimensions/
            //see: https://coderwall.com/p/wpjw4w/change-the-bootstrap-navbar-breakpoint
            var switchToMobile = 768;
            var body = document.getElementsByTagName("BODY")[0]; // ранее, в "конструкторе" мы добавили body свойство widget[] - массив всех созданных виджетов (каждый новый виджет добавляет себя в этот массив)
            for (var widgetKey in body.widgets) { //перечисляем все виджеты и изменяем их размер
                var widget = body.widgets[widgetKey]; // изымаем очередной виджет

                if (window.innerWidth < switchToMobile) {
                   // widget.widgetHolder.className = "col-sm-2";
                }
                else {
                    //widget.widgetHolder.className = "col-sm-1";
                }

                widget.resize(widget.widgetHolder.clientWidth); // меняем размер
            }
        }

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // создает и отображает модальный диалог со свойствами виджета - пользователь может редактировать эти свойства
        // так как вызывается по клику из другого потока, связывается со своим объектом через параметр widget
        BaseWidget.prototype.showProperties = function showProperties(widget) {
            // будет использована для сохранения значений текущих свойств виджета
            widget.storedProperties = {};
            // находим индекс widgetHolder в панеле виджетов widget.parentPanel
            widget.inParentIndex = Array.prototype.slice.call(widget.parentPanel.childNodes).indexOf(widget.widgetHolder);
            // так как используется bootstrap и виджет будет перенесен в другую панель, запоминаем его текущий bootstrap класс
            widget.inParentClass = widget.widgetHolder.className;
            // удаляем widgetHolder из панели виджетов
            widget.parentPanel.removeChild(widget.widgetHolder);
            // меняем bootstrap класс (обычно с одной ячейки на четыре)
            widget.widgetHolder.className = "col-sm-4";
            // переключаем виджет в режим "работа" - мы будем отображать виджет в диалоге свойств в этом режиме (без кнопок)
            widget.mode = WORK_MODE;

            // подготавливаем  модальный диалог (смотрите функцию makeModalDialog() - она создает универсальные модальные диалоги, где "showProperties" префикс для ID)
            makeModalDialog("resetPanel", "showProperties", getLang("showproperties"), "");
            // после того как функция создала диaлог и все его элементы, изымаем modalBody элемент и modalFooter по их ID
            var modalBody = document.getElementById("showPropertiesModalBody");
            var modalFooter = document.getElementById("showPropertiesModalFooter");

            // заполняем modalBody и modalFooter элементами отображающими свойства данного виджета
            // создаем панель в верхней части диалога в которой будем отображать виджет - пользователь сможет видеть результаты изменения свойств виджета
            var widgetDiv = modalBody.appendChild(document.createElement("div"));
            widgetDiv.className = "driversWidgetsPanel d-flex justify-content-center";
            widgetDiv.appendChild(widget.widgetHolder);

            // свойств очень много - модальный диалог может получится слишком длииным и не влазить в окно браузера, что не очень удобно для пользователя
            // по этому свойства виджета будут размещены в закладках внутри диалога 
            // создаем панель закладок 
            var propUl = modalBody.appendChild(document.createElement("ul"));
            propUl.className = "nav nav-tabs";

            var tabContent = modalBody.appendChild(document.createElement("div"));
            tabContent.className = "tab-content";

            // размещаем редакторы свойств виджета в закладках диалога 
            var isFirstTab = true; // простой способ определить первое свойство при использование for в режиме энумератора 
            for (var key in widget.properties) { // перебираем все свойства виджета 
                // сохраняем значения текущего свойства (если позже пользователь откажется от изменений (кнопка отмена или закрытие диалога без подтверждения сохранения))
                widget.storedProperties[key] = {
                    tab: widget.properties[key].tab,
                    value: widget.properties[key].value,
                    type: widget.properties[key].type
                }
                // узнаем закладку текущего свойства (смотрите метод defaultWidgetProperties() что бы понять как устроен объект свойств)
                var tabName = widget.properties[key].tab; // можно указать свое название закладки, если не использовать 'G', 'C', 'O'
                if (tabName === 'G') { tabName = "General"; } // дешифруем имя закладки 
                else
                    if (tabName === 'C') { tabName = "Color"; }
                    else
                        if (tabName === 'O') { tabName = "Opacity"; }

                // используем название закладки как часть ее DOM.element.id и узнаем создана ли эта закладка ранее 
                var tabPane = document.getElementById(tabName + "PropTab");
                var formGroup = document.getElementById(tabName + "PropForm");
                if (formGroup == null) { // если закладка еще не создана - создадим ее 
                    // создаем новую кнопку (TAG "li" - не кнопку конечно, но bootstrap представит ее в виде кнопки) с ссылкой в панеле закладок 
                    var propLi = propUl.appendChild(document.createElement("li"));
                    propLi.className = "nav-item";
                    var aHref = propLi.appendChild(document.createElement("a")); // ссылка для закладки
                    aHref.setAttribute("data-toggle", "tab");
                    aHref.href = "#" + tabName + "PropTab"; // id панели для закладки связываем с ссылкой из самой закладки 
                    aHref.innerText = tabName; // название закладки 
                    // создаем панель связанную с закладкой 
                    tabPane = tabContent.appendChild(document.createElement("div"));
                    tabPane.id = tabName + "PropTab";
                    formGroup = tabPane.appendChild(document.createElement("div"));
                    formGroup.className = "form-group";
                    formGroup.id = tabName + "PropForm"; // связываем панель с ссылкой 
                    // если мы создаем первую закладку в панеле 
                    if (isFirstTab) { // сделаем ее активной по умолчанию 
                        aHref.className = "nav-link active";
                        tabPane.className = "tab-pane fade show active";
                        isFirstTab = false; // все остальные закладки не первые 
                    }
                    else { // не первые закладки не активны 
                        aHref.className = "nav-link";
                        tabPane.className = "tab-pane fade";
                    }
                }
                // редакторы свойств реализованы с использованием bootstrap input-group - для более "удобного" внешнего вида
                // создаем редактор очередного свойства виджета 
                var inputGroup = formGroup.appendChild(document.createElement("div"));
                inputGroup.className = "input-group input-group-sm mb-3";

                var prependDiv = inputGroup.appendChild(document.createElement("div"));
                prependDiv.className = "input-group-prepend";
                // название свойства 
                var label = prependDiv.appendChild(document.createElement("label"));
                label.className = "input-group-text";
                label.setAttribute("for", "hostEdit");
                label.innerText = key;
                // редактор свойства
                // свойство виджета представлено классом, свойство type которого определяет тип свойства - целое число, число со знаком, цвет и так далее 
                // функция createValueEdit реагирует на type и создает соответствующий редактор (например comboBox с палитрой цветов если type = 'c' [color])
                var propEdit = createValueEdit(inputGroup, widget.properties[key].name, widget.properties[key].value, widget.properties[key].type);
                propEdit.className = "form-control form-control-sm";
                propEdit.placeholder = "type value here";
                propEdit.id = "widgetproperty" + key;
                // связываем редактор со свойством виджета - когда пользователь будет изменять в редакторе значения свойств - виджет будет тут же отображать полученный результат
                propEdit.widgetProperty = widget.properties[key];
                // связываем редактор с виджетом
                propEdit.widget = widget;
                // события редактора propEdit.onchange может быть использовано createValueEdit() и другими, ниже мы переопределим этот обработчик - сейчас сохраним в propEdit адрес старого обработчика
                propEdit.originalOnChange = propEdit.onchange;
                // виджет привязывается к событиям редактора и если пользователь что то изменит, виджет среагирует на это
                propEdit.onchange = widget.onPropertyChange;
                propEdit.onkeyup = widget.onPropertyChange;
            } // очередное свойство добавлено, возвращаемся и добавляем следующее в соответствующею закладку

            // в низу диалога будет элемент отображающий особым цветом ошибки, например если пользователь выбрал неверное значение свойства виджета 
            var setPropError = formGroup.appendChild(document.createElement("label"));
            setPropError.className = "text-danger";
            // кнопки "Закрыть" и "Отмена" созданы функцией makeModalDialog(), находим их по ID и назначаем свои обработчики
            // кнопка "Закрыть" в шапке диалога (справа, крестик)
            var closeHeaderButton = document.getElementById("showPropertiescloseHeaderButton");
            closeHeaderButton.widget = widget; // запомним к какому виджету привязана кнопка 
            closeHeaderButton.onclick = widget.discardProperties; // обработчик в виджете, вернет сохраненные значения свойств и закроет диалог 
            // кнопка "Отмена" внизу диалога (так же как и кнопка "Закрыть")
            var closeButton = document.getElementById("showPropertiescloseButton");
            closeButton.widget = widget;
            closeButton.onclick = widget.discardProperties;

            // кнопка "Применить ко всем", ее придется создать с нуля и добавить в modalFooter элемент  
            // нажатие на эту кнопку приведет к тому, что значения свойств текущего виджета, будут применены ко всем виджетам 
            // это очень удобно если необходимо глобально изменить стиль всех виджетов
            // но так же это опасно, потому как все виджеты изменят свои свойства по эталонну из этого виджета
            var setAllWidgetsPropButton = modalFooter.appendChild(document.createElement("button"));
            setAllWidgetsPropButton.type = "button";
            setAllWidgetsPropButton.className = "btn btn-sm btn-warning";
            setAllWidgetsPropButton.id = "allwidgetsModalButton";
            setAllWidgetsPropButton.widget = widget; // привязываемся к текущему виджет 
            setAllWidgetsPropButton.onclick = widget.setAllWidgetsProperties; // назначаем обработчик клика (сохраним свойства)
            setAllWidgetsPropButton.innerText = getLang("setallwidgetspropbutton"); // надпись для кнопки из словаря (languagescore.js)            
            setAllWidgetsPropButton.setPropError = setPropError; // элемент (надпись) для отображения пользователю сообщений об ошибках
            // кнопка "Применить", так же как и setAllWidgetsPropButton, но будут изменены свойства текущего виджета 
            var setPropButton = modalFooter.appendChild(document.createElement("button"));
            setPropButton.type = "button";
            setPropButton.className = "btn btn-sm btn-success";
            setPropButton.id = "addnodeModalButton";
            setPropButton.widget = widget;
            setPropButton.onclick = widget.setProperties;
            setPropButton.innerText = getLang("setpropbutton");
            setPropButton.setPropError = setPropError;

            // пользователь может закрыть модальный диалог не используя кнопки "Закрыть", "Применить" или клавиши, а например просто кликнув вне этого диалога
            // нам необходимо контролировать это событие закрытие диалога для того что бы вернуть значения свойств виджета и сам виджет в панель виджетов
            // да - это событие равносильно нажатию кнопки "Закрыть" в диалоге 
            // проблема - в том, что нажатие кнопок приводит к закрытию диалога, а закрытие диалога к вызову этого события. По этой причине обработчик сильно 
            // усложняется - например пользователь нажал "Применить", обработчик клика кнопки закрыл диалог, а сам диалог в момент закрытия вызвал этот 
            // обработчик и вернул все свойство к сохраненным.             
            $('#showPropertiesModal').on('hidden.bs.modal', function (event) { // назначаем обработчик события закрытия диалога 
                // идем на хитрость - все "легальные" кнопки закрытия диалога (те кнопки обработчики которых мы создали сами и нажатие которых приводит к закрытию диалога)
                // будут создавать в объекте диалога свойство "setProp", в данном случае значение свойства не имеет значение, оно должно быть создано и не undefined 
                if (document.getElementById("showPropertiesModal").setProp != undefined) { // если пользователь нажал "легальную" кнопку
                    return; // просто выходим, ничего не делаем 
                }
                // диалог закрывается и это не контролируемое действие - вызываем наш обработчик widget.discardProperties() - вернем значения свойств виджета
                // NOTE:
                // такой подход может вызвать рекурсия, потом как widget.discardProperties() вызовет $("#showPropertiesModal").modal('hide');  тот в свою очередь 
                // может повторно вызвать этот обработчик. Благо этого не происходит - ибо диалог уже закрывается. 
                // мы "имитируем" параметры обработчика события onclick - event, через свойство currentTarget должна содержать ссылку на элемент вызвавший событие
                var event = {
                    currentTarget: closeHeaderButton
                }
                // вызываем наш обработчик клика на closeHeaderButton
                widget.discardProperties(event);                
            })

            // отображаем созданный диалог 
            $("#showPropertiesModal").modal('show');
        };

        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик клика на кнопку "Применить" для диалога редактирования свойств виджета 
        BaseWidget.prototype.setProperties = function setProperties(event) {
            // запрещаем все последующие обработчики
            event.stopPropagation();
            // получаем ссылку на нажатую кнопку из события
            var button = event.currentTarget;
            // получаем ссылку на виджет из свойства кнопки (свойство добавлено при создании кнопки)
            var widget = button.widget;
            // изымаем виджет из диалога
            widget.widgetHolder.parentElement.removeChild(widget.widgetHolder);
            // возвращаем виджет в панель виджетов
            widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[widget.inParentIndex]);
            // возвращаем bootstrap класс виджета 
            widget.widgetHolder.className = widget.inParentClass;
            // возвращаем режим виджета (отображаем кнопки управления виджета)
            widget.mode = MOVE_MODE;
            // сохраняем измененные свойства виджета в памяти микроконтроллера
            widget.doOnChange();
            // смотрите showProperties()-$('#showPropertiesModal').on('hidden.bs.modal', function (event) 
            // сообщаем обработчику закрытия диалога о том что мы обработали закрытие
            document.getElementById("showPropertiesModal").setProp = true;
            // закрываем диалог
            $("#showPropertiesModal").modal('hide');

            return false;
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик клика на кнопку "Применить ко всем" для диалога редактирования свойств виджета 
        BaseWidget.prototype.setAllWidgetsProperties = function setProperties(event) {
            // так же как для setProperties() - получаем ссылку на виджет, переносим его в панель виджетов
            event.stopPropagation();
            var button = event.currentTarget;
            var widget = button.widget;
            widget.widgetHolder.parentElement.removeChild(widget.widgetHolder);
            widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[widget.inParentIndex]);
            widget.widgetHolder.className = widget.inParentClass;
            widget.mode = MOVE_MODE;

            // находим все виджеты в системе, применяем измененные свойства текущего виджета ко всем 
            var body = document.getElementsByTagName("BODY")[0];
            for (var widgetKey in body.widgets) {
                var someWidget = body.widgets[widgetKey];
                // перечисляем все свойства очередного виджета
                for (var key in someWidget.properties) {
                    if (key === 'headertext') continue; // игнорируем свойства содержащее текст для заголовка виджета - они у всех виджетов разные
                    // диалог редактирования свойств виджета еще не закрыт, и мы знаем название текущего свойства 
                    // пробуем найти редактор свойства для свойства с текущем именем (key)
                    // NOTE:
                    // все виджеты наследники BaseWidget и многие свойства у них одинаковы, но у разных виджетов будут уникальные свойства
                    // если у "эталонного" виджета (значение свойств которого сейчас применяем ко всем виджетам) не существует свойства как у текущего виджета - не найдем и не изменим его
                    // таким образом если у вас на панели виджетов - три виджета температуры, один влажности и один график, и вы редактировали виджет температура -
                    // свойства "цвет дона" и "тип температуры Цельсий - Фаренгейт" --> фон изменится у всех виджетов, а тип температуры только у виджетов температуры. 
                    var propEdit = document.getElementById("widgetproperty" + key);
                    if (propEdit != null) { //редактор свойства найден  
                        someWidget.properties[key].value = propEdit.value; //используем его значение в качестве нового значения свойства очередного виджета
                    }
                }

                // все свойства очередного виджета перечислены и им назначены новые значения - обратимся к setter .properties для того что бы виджет перерисовал свои SVG элементы
                someWidget.properties = someWidget.properties;
            }
            // сохраняем изменения
            
            widget.doOnChange();
            // так же как для setProperties(), взводим setProp, закрываем диалог
            document.getElementById("showPropertiesModal").setProp = true;
            $("#showPropertiesModal").modal('hide');            
            return false;
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик клика на кнопки "Закрыть", "Отменить" для диалога редактирования свойств виджета 
        // так же вызывается самим модальным диалогом в момент его закрытия (если не нажаты "наши" кнопки, но диалог все равно закрывается)
        BaseWidget.prototype.discardProperties = function discardtProperties(event) {
            //event может быть создан не событием и только содержать event.currentTarget, смотрите $('#showPropertiesModal').on('hidden.bs.modal', function (event) в showProperties()
            if (event.stopPropagation != undefined) {
                event.stopPropagation();
            }
            // так же как для setProperties() - получаем ссылку на виджет, переносим его в панель виджетов
            var button = event.currentTarget;
            var widget = button.widget;
            widget.widgetHolder.parentElement.removeChild(widget.widgetHolder);
            widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[widget.inParentIndex]);
            widget.widgetHolder.className = widget.inParentClass;
            widget.mode = MOVE_MODE;
            // возвращаем ранее сохраненные значения свойств виджета смотрите showProperties()
            // используем setter properties - виджет применит сохранные свойства ко всем своим SVG элементам 
            widget.properties = widget.storedProperties;
            // так же как для setProperties(), взводим setProp, закрываем диалог
            document.getElementById("showPropertiesModal").setProp = true;
            $("#showPropertiesModal").modal('hide');
            // NOTE:
            // диалог закроется без вызова $("#showPropertiesModal").modal('hide');
            // потому что кнопкам был задан атрибуты button.setAttribute("data-dismiss", "modal") и button.setAttribute("aria-label", "Close")
            // смотрите функцию makeModalDialog
            return false;
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // обработчик события вызывается всеми редакторами свойств виджета, когда пользователь меняет им значение 
        BaseWidget.prototype.onPropertyChange = function onPropertyChange(event) {

            var propEdit = event.currentTarget;
            var widget = propEdit.widget;

            for (var key in widget.properties) {
                var _propEdit = document.getElementById("widgetproperty" + key);
                widget.properties[key].value = _propEdit.value;
            }

            widget.properties = widget.properties;

            if (propEdit.originalOnChange != undefined) {
                propEdit.originalOnChange(event);
            }

            return true;

        };

        BaseWidget.prototype.moveLeft = function moveLeft(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == MOVE_MODE) {
                var index = Array.prototype.slice.call(widget.parentPanel.childNodes).indexOf(widget.widgetHolder);
                widget.parentPanel.removeChild(widget.widgetHolder);
                widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[index - 1]);
            }

            return true;
        };

        BaseWidget.prototype.moveRight = function moveRight(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == MOVE_MODE) {
                var index = Array.prototype.slice.call(widget.parentPanel.childNodes).indexOf(widget.widgetHolder);
                widget.parentPanel.removeChild(widget.widgetHolder);
                widget.parentPanel.insertBefore(widget.widgetHolder, widget.parentPanel.childNodes[index + 1]);
            }

            return true;
        };

        BaseWidget.prototype.propertiesClick = function movepropertiesClick(event) {
            event.stopPropagation();
            var widget = event.currentTarget.widget;
            if (widget.mode == MOVE_MODE) {
                widget.showProperties(widget);
            }

            return true;
        };


        BaseWidget.prototype.plusSize = function plusSize(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == MOVE_MODE) {
                widget.SVGViewBox.setAttributeNS(null, "width", widget.width += 25);
                widget.SVGViewBox.setAttributeNS(null, "height", widget.height += 25);
            }

            return true;
        };


        BaseWidget.prototype.deleteWidget = function deleteWidget() {
            //this.event это setter, такое обращение приведет к оповещению всех подписантов на события виджета о текущем событии в виджете
            this.event = EVENT_DELETE;

            this.doOnDelete();

            var body = document.getElementsByTagName("BODY")[0];
            if (body.onresize == this.onPanelResize) {
                body.onresize = null;
                for (var widgetKey in body.widgets) {
                    var someWidget = body.widgets[widgetKey];
                    if (someWidget != this) {
                        body.onresize = someWidget.onPanelResize;
                        break;
                    }
                }
            }

            body.widgets.splice(body.widgets.indexOf(this), 1);


            while (this.SVGViewBox.childNodes.length != 0) {
                this.SVGViewBox.removeChild(this.SVGViewBox.childNodes[0]);
            }

            this.widgetHolder.removeChild(this.SVGViewBox);
            this.parentPanel.removeChild(this.widgetHolder);
            this.widgetHolder.innerHTML = "";

            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    delete this[key];
                }
            }

        };

        BaseWidget.prototype.deleteWidgetClick = function deleteWidgetClick(event) {
            var widget = event.currentTarget.widget;
            if (widget.mode == MOVE_MODE) {
                widget.deleteWidget();
                widget = null;
            }
            return true;
        };

        BaseWidget.prototype.modeChangeClick = function modeChangeClick(event) {
            var widget = event.currentTarget.widget;

            if (widget.mode == WORK_MODE) {
                widget.mode = MOVE_MODE;
            } else {
                widget.mode = WORK_MODE;
            }

            return true;
        };

        BaseWidget.prototype.clickableToTop = function clickableToTop() {
            this.SVGViewBox.insertBefore(this.SVGWidgetText.SVGText, this.SVGViewBox.childNodes.lastChild);
            this.SVGViewBox.insertBefore(this.SVGLeftIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild);
            this.SVGViewBox.insertBefore(this.SVGRightIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild); // this.SVGViewBox.insertBefore(this.SVGPlusIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild);
            this.SVGViewBox.insertBefore(this.SVGDeleteIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild);
            this.SVGViewBox.insertBefore(this.SVGPropertiesIcon.SVGIcon, this.SVGViewBox.childNodes.lastChild);
        };


        BaseWidget.prototype.mouseOver = function mouseOver(event) {
            var widget = event.currentTarget.widget;
            widget.mouseEnter = true;
            widget.drawMouseEnter();
            return true;
        };

        BaseWidget.prototype.mouseOut = function mouseOut(event) {
            var widget = event.currentTarget.widget;
            widget.mouseEnter = false;
            widget.drawMouseEnter();
            return true;
        };

        BaseWidget.prototype.refresh = function refresh(data, widgetText, label, historyData) {
            if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; }

            if (this._data == data && this.widgetText == widgetText && this._properties.headertext == label) return;

            if (this._properties.headertext.value === '---') {
                this._properties.headertext.value = label;
            }


            if (this.widgetText != widgetText) {
                speak(this._properties.headertext + " " + widgetText);
            }


            this.historyData = historyData;
            this._data = data;
            this.widgetText = widgetText;

            this.spinnerAngle = 0;
            this.redrawAll();
        };

        //---------------------------------------------------------------------------------------
        BaseWidget.prototype.redrawAll = function redrawAll() {
            if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; }

            var _this = this;
            this.starttime = 0;
            requestAnimationFrame(function () {
                return _this.drawWidget();
            });
            this.drawText();
        };


        BaseWidget.prototype.toColor = function toColor(element, color, method) {


            if (method == undefined) method = true;
            if (element == null) return;

            if (element.animantion == null) {
                element.animantion = false;
            }

            if (element.animantion) {
                element.animantion = false;
                window.cancelAnimationFrame(element.animantionFrame);
                this.animateColor(element, color, method);
            }

            element.animantion = true;
            this.animateColor(element, color, method);
        };

        BaseWidget.prototype.animateColor = function animateColor(element, color, method) {
            var _this2 = this;

            if (!element.animantion) return;
            var rgbSrc = element.colorRGB;
            var rgbDst = colorToRGB(color);

            if (rgbSrc[0] == rgbDst[0] && rgbSrc[1] == rgbDst[1] && rgbSrc[2] == rgbDst[2]) {
                window.cancelAnimationFrame(element.animantionFrame);
                element.animantion = false;
                return;
            }

            if (rgbSrc[0] != rgbDst[0]) if (rgbSrc[0] < rgbDst[0]) rgbSrc[0]++; else rgbSrc[0]--;
            if (rgbSrc[1] != rgbDst[1]) if (rgbSrc[1] < rgbDst[1]) rgbSrc[1]++; else rgbSrc[1]--;
            if (rgbSrc[2] != rgbDst[2]) if (rgbSrc[2] < rgbDst[2]) rgbSrc[2]++; else rgbSrc[2]--;
            element.colorRGB = rgbSrc;

            if (!method) {
                element.fillRGB = rgbSrc;
            }

            if (element.animantion) {
                element.animantionFrame = window.requestAnimationFrame(function () {
                    return _this2.animateColor(element, color, method);
                });
            }
        };


        BaseWidget.prototype.drawMouseEnter = function drawMouseEnter() {
            if (this._mode != WORK_MODE) return;
            var _this = this;

            if (this.mouseEnter) {
                if (this.SVGBackgroundPanel.opacity > this._properties.backgroundselectopacity.value) {
                    this.SVGBackgroundPanel.opacity -= 0.05;
                    requestAnimationFrame(function () {
                        return _this.drawMouseEnter();
                    });
                }
            } else {
                if (this.SVGBackgroundPanel.opacity < this._properties.backgroundopacity.value) {
                    this.SVGBackgroundPanel.opacity += 0.005;
                    requestAnimationFrame(function () {
                        return _this.drawMouseEnter();
                    });
                }
            }
        };

        // возвращает объект свойств виджета по умолчанию - цвета, прозрачность, основные размеры элементов, все дочерний виджеты наследуют и дополняют эти свойства
        // виджет вызывает эту функцию что бы настроить свой стиль отображения по умолчанию. Программа или пользователь могут менять эти свойства, создавая новые стили виджета
        // ConfigCore.js сохраняет новые и измененные свойства виджетов в память микроконтроллера.
        BaseWidget.prototype.defaultWidgetProperties = function defaultWidgetProperties() {
            /*
            каждое свойство виджета представлено отдельным объектом с тремя собственными свойствами(у всех свойств эти объекты одинаковы)
        
            название_свойства: {
                tab: -> код или имя закладки для диалога управления свойствами виджета, допустимы коды:
                "G" - закладка General
                "C" - закладка Color
                "O" - закладка Opacity
                если значение поля не G C O, то допустимо любое значение, соответствующая закладка появится в диалоге свойств
                эелемнт управления свойством объекта будет помещен в указанную закладку
                value: -> значение свойства
                type: -> тип свойства(флажок):
                "i" - integer
                "f" - float
                "b" - boolean
                "c" - color
                "p" - password(*** значение свойства будет замаскировано)
                "s" - selected - редактор значения свойства будет выделен отдельным цветом
            }
            */
            return { // вернем созданный объект как результат этой функции
                headertext: { // свойство виджета - текст заголовка (верхний текст в виджете, по умолчанию "---")
                    tab: "G", // закладка General
                    value: "---",
                    type: "s" // редактор выделен
                },

                headercolor: { // цвет панели заголовка           
                    tab: "C", // закладка Colors
                    value: theme.secondary,
                    type: "c" // тип редактора - редактор цветов
                },

                headeropacity: { // прозрачность панели заголовка            
                    tab: "O",
                    value: 0.1,
                    type: "f"
                },

                backgroundcolor: { // цвет фона виджета           
                    tab: "C",
                    value: theme.dark,
                    type: "c"
                },

                backgroundopacity: { // прозрачность фона          
                    tab: "O",
                    value: 1.0,
                    type: "f"
                },

                bordercolor: { // цвет бордюра           
                    tab: "C",
                    value: theme.secondary,
                    type: "c"
                },

                backgroundselectopacity: { // прозрачность фона виджета когда пользователь указал на него мышью           
                    tab: "O",
                    value: 0.2,
                    type: "f"
                },

                valuetextcolor: { // цвет основного текста виджета (обычно этот текст отображает данные переданные через метод refresh())            
                    tab: "C",
                    value: theme.light,
                    type: "c"
                },

                showequalizer: { // отображать эквалайзер          
                    tab: "G",
                    value: 'false',
                    type: "b"
                }
            }
        };

        BaseWidget.prototype.doOnLoad = function doOnLoad() {
            if (this._onload != undefined) {
                for (var key in this._onload) {
                    this._onload[key](this);

                }
            }
        };

        BaseWidget.prototype.doOnChange = function doOnChange() {
            if (this._onchange != undefined) {
                for (var key in this._onchange) {
                    this._onchange[key](this);
                }
            }
        };

        BaseWidget.prototype.doOnDelete = function doOnDelete() {
            if (this._ondelete != undefined) {
                for (var key in this._ondelete) {
                    this._ondelete[key](this);
                }
            }
        };

        _createClass(BaseWidget, [
            {         
            key: "mode",
            set: function set(mode) {
                if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
                this._mode = mode;

                if (mode == WORK_MODE) {
                    this.SVGBackgroundPanel.opacity = this._properties.backgroundopacity.value;
                    this.SVGLeftIcon.hide();
                    this.SVGRightIcon.hide(); //  this.SVGPlusIcon.hide();

                    this.SVGDeleteIcon.hide();
                    this.SVGPropertiesIcon.hide();

                } else if (mode == MOVE_MODE) {
                    this.SVGBackgroundPanel.opacity = this._properties.backgroundopacity.value / 3;
                    this.SVGLeftIcon.draw();
                    this.SVGRightIcon.draw(); //   this.SVGPlusIcon.draw();

                    this.SVGDeleteIcon.draw();
                    this.SVGPropertiesIcon.draw();
                }
            },
            get: function get() {
                return this._mode;
            }
        }, {
            key: "networkStatus",
            get: function get() {
                return this._networkStatus;
            },
            set: function set(networkStatus) {
                if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
                if (networkStatus >= NET_OFFLINE && networkStatus <= NET_RECONNECT) {
                    this._networkStatus = networkStatus;
                    this.redrawAll();
                }
            }
        },

        {
            key: "properties",
            get: function get() {
                return this._properties;
            },
            set: function set(properties) {
                if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
                if (properties == undefined) return;
                this._properties = properties;
                this.drawText();
                this.drawWidget();
            }
        },
        {
            key: "data",
            get: function get() {
                return this._data;
            },
            set: function set(data) {
                if ((this._event == EVENT_DELETE) || (this._event == undefined)) { return; } // если виджет удаляется ничего не делаем
                this._data = data;
                this.redrawAll();
            }
        },
        {
            key: "onload",
            set: function set(onload) {
                if (this._onload == undefined) {
                    this._onload = [];
                }
                this._onload.push(onload);
            }
            },
            {
                key: "onchange",
                set: function set(onchange) {
                    if (this._onchange == undefined) {
                        this._onchange = [];
                    }
                    this._onchange.push(onchange);
                }
            },

        {
            key: "ondelete",
            set: function set(ondelete) {
                if (this._ondelete == undefined) {
                    this._ondelete = [];
                }
                this._ondelete.push(ondelete);
            }
        }


        ]);

        return BaseWidget;
    }();﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var LCDWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(LCDWidget, _BaseWidget);

        function LCDWidget(parentPanel, id, size) {            
            return _BaseWidget.call(this, parentPanel, id, size) || this;         
        }

        LCDWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.widgetHolder.className = "col-6 col-sm-4 col-lg-2";

            widget.topMargin = widget.size / 20; //this.panding = 5;
            widget.width = widget.size * 2;
            widget.height = widget.size;
            widget.centreX = widget.width / 2; //  this.centreY = this.height / 2;
            widget.widgetTextSize = widget.size / 110;

            widget.SVGViewBox.setAttributeNS(null, "viewBox", "0 0 " + widget.width + " " + widget.height);

            //widget.SVGViewBox.setAttributeNS(null, "width", widget.width);

            widget.SVGBackgroundPanel.drawRoundedRect(widget.width, widget.height, 5, 10, true, true, true, true);
            widget.SVGHeaderPanel.drawRoundedRect(widget.width, 26, 5, 0, true, true, false, false);
            widget.SVGBackdownpanel.y += 3;
            widget.SVGBackdownpanel.drawRoundedRect(widget.width, 10, 5, 0, false, false, true, true);
            widget.SVGWidgetText1 = new SVGText(widget.SVGViewBox, widget.id + "widgettext1", widget.widgetTextSize);
            widget.SVGWidgetText1.fontFamily = "monospace";
            widget.SVGWidgetText2 = new SVGText(widget.SVGViewBox, widget.id + "widgettext2", widget.widgetTextSize);
            widget.SVGWidgetText2.fontFamily = "monospace";
            widget.SVGWidgetText3 = new SVGText(widget.SVGViewBox, widget.id + "widgettext3", widget.widgetTextSize);
            widget.SVGWidgetText3.fontFamily = "monospace";
            widget.SVGWidgetText4 = new SVGText(widget.SVGViewBox, widget.id + "widgettext4", widget.widgetTextSize);
            widget.SVGWidgetText4.fontFamily = "monospace";
            widget.SVGWidgetText1.text = "1234567890ABCSDEFGHL"; //20 chars 

            widget.SVGHeaderText.text = "LCD";
            widget.textWidth = widget.SVGWidgetText1.width;
            widget.textHeight = widget.SVGWidgetText1.height;
            widget.widgetLeft = widget.centreX - widget.textWidth / 2;
            widget.widgetTop = widget.centreY + widget.SVGHeaderText.height - widget.textHeight * 4 / 2;
            widget.SVGWidgetBack = new SVGRect(widget.SVGViewBox, widget.id + "widgetback", widget.widgetLeft - widget.panding, widget.widgetTop - parseFloat(widget.textHeight - widget.panding), widget.textWidth + widget.panding * 2, widget.textHeight * 4 + widget.panding);
            widget.SVGWidgetBack.opacity = 0.2;
            widget.SVGWidgetBack.color = theme.secondary;
            widget.SVGWidgetText1.text = "";
            widget.SVGHeaderText.text = "";

            widget.SVGWidgetText.hide();

            widget.SVGArcSpinner.x = widget.centreX;
            widget.widgetHolder.onclick = widget.showEditor; //Popup editor 

            widget.pre = widget.widgetHolder.appendChild(document.createElement('pre'));
            widget.pre.className = "LCDTextArea";
            widget.pre.style.display = 'none';
            widget.textarea = widget.pre.appendChild(document.createElement('textarea'));
            widget.textarea.className = "form-control text-white bg-primary";
            widget.textarea.id = "textarea" + widget.id;
            widget.textarea.rows = "4";
            widget.textarea.cols = "25";

            var elementHeight = widget.pre.getBoundingClientRect().height;

            widget.pre.style.marginTop = -(elementHeight / 2.0 + widget.size / 1.8) + "px";
            widget.btnGroup = widget.widgetHolder.appendChild(document.createElement("p"));
            widget.btnGroup.style.display = 'none';
            widget.btnGroup.className = "LCDButtons";
            widget.btnGroup.role = "group";
            widget.textElement = widget.btnGroup.appendChild(document.createElement('div'));
            widget.textElement.className = "text-white";
            widget.lcdButton = widget.btnGroup.appendChild(document.createElement('input'));
            widget.lcdButton.className = "btn btn-success text-white LCDButton";
            widget.lcdButton.id = widget.id + "lcdbutton";
            widget.lcdButton.type = "button";
            widget.lcdButton.edit = widget.textarea;
            widget.lcdButton.lcdid = widget.id;
            widget.lcdButton.widget = _assertThisInitialized(widget); // this.lcdButton.onclick = lcdButtonClick;

            widget.lcdButton.value = getLang("send");
            widget.lightButton = widget.btnGroup.appendChild(document.createElement('input'));
            widget.lightButton.className = "btn btn-info text-white LCDButton";
            widget.lightButton.id = widget.id + "clearbutton";
            widget.lightButton.type = "button";
            widget.lightButton.edit = widget.textarea;
            widget.lightButton.lcdid = widget.id;
            widget.lightButton.widget = _assertThisInitialized(widget); //  this.lightButton.onclick = lightButtonClick;

            widget.lightButton.value = getLang("shortlight");
            widget.ShowEqualizer = false;

            widget.proprties = widget._properties;
            widget.resize(widget.width);
            widget.doOnLoad();
        };

        LCDWidget.prototype.resize = function resize(size) {
            this.size = size;
            this.SVGViewBox.setAttributeNS(null, "width", size);
            this.SVGViewBox.setAttributeNS(null, "height", size / 2);

        };
        

        LCDWidget.prototype.refresh = function refresh(widgetText, label, light) {
            label = getLang(label);
            this.widgetText = widgetText;
            this.label = label;
            this.spinnerAngle = 0;

            if (light != undefined) {
                this.light = light;
            } else {
                this.light = 0;
            }

            this.redrawAll();
        };

        LCDWidget.prototype.showEditor = function showEditor(event) {
            event.stopPropagation();
            var rPanel = event.currentTarget;
            var lcdWidget = rPanel.widget;

            if (!lcdWidget.pre.style.display.indexOf("block")!=-1) {
                lcdWidget.textarea.value = lcdWidget.widgetText;
                lcdWidget.pre.style.display = 'block';
                lcdWidget.btnGroup.style.display = 'block';
            } else {//TODO: direct click     
                //  lcdWidget.hideEditor(); 
            }

            return true;
        };

        LCDWidget.prototype.hideEditor = function hideEditor() {
            this.pre.style.display = 'none';
            this.btnGroup.style.display = 'none';
        }
            /*
                get _newtorkStatus() {
                    return this.networkStatus;
                }
            
                set _networkStatus(networkStatus) {
                    if ((networkStatus >= NET_OFFLINE) && (networkStatus <= NET_RECONNECT)) {
                        this.networkStatus = networkStatus;
                        this.redrawAll();
                    }
                }
            
                get _percent() {
                    return this.percent;
                }
            
                set _percent(percent) {
                    if ((percent >= 0) && (percent <= 100)) {
                        this.percent = percent;
                        this.redrawAll();
                    }
                }
            
                //---------------------------------------------------------------------------------------
                redrawAll() {
                    this.drawText();
                    this.starttime = 0;
                    requestAnimationFrame(() => this.drawWidget());
            
            
                }
                */
            //---------------------------------------------------------------------------------------
            //draw element text labels - percent value and text 
            ;

        LCDWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);

            if (this.SVGWidgetText1 == undefined) return;

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.SVGWidgetText1.color = theme.light;
                    this.SVGWidgetText2.color = theme.light;
                    this.SVGWidgetText3.color = theme.light;
                    this.SVGWidgetText4.color = theme.light;
                    break;

                case NET_RECONNECT:
                    this.SVGWidgetText1.color = theme.info;
                    this.SVGWidgetText2.color = theme.info;
                    this.SVGWidgetText3.color = theme.info;
                    this.SVGWidgetText4.color = theme.info;
                    break;

                default:
                    //offline
                    this.SVGWidgetText1.color = theme.secondary;
                    this.SVGWidgetText2.color = theme.secondary;
                    this.SVGWidgetText3.color = theme.secondary;
                    this.SVGWidgetText4.color = theme.secondary;
                    break;
            }

            if (this.widgetText == undefined) {
                this.widgetText = "";
            }

            this.SVGWidgetText1.text = this.widgetText.substring(0, 20);
            this.SVGWidgetText2.text = this.widgetText.substring(20, 40);
            this.SVGWidgetText3.text = this.widgetText.substring(40, 60);
            this.SVGWidgetText4.text = this.widgetText.substring(60);
            this.SVGWidgetText1.x = this.widgetLeft;
            this.SVGWidgetText1.y = this.widgetTop;
            this.SVGWidgetText2.x = this.widgetLeft;
            this.SVGWidgetText2.y = this.SVGWidgetText1.y + this.SVGWidgetText1.height;
            this.SVGWidgetText3.x = this.widgetLeft;
            this.SVGWidgetText3.y = this.SVGWidgetText2.y + this.SVGWidgetText2.height;
            this.SVGWidgetText4.x = this.widgetLeft;
            this.SVGWidgetText4.y = this.SVGWidgetText3.y + this.SVGWidgetText4.height;
            
            this.SVGHeaderText.text = this.label;
            this.SVGHeaderText.x = this.width / 2 - this.SVGHeaderText.width / 2;
            this.SVGHeaderText.y = this.SVGHeaderText.height - this.panding;
           /*  switch (this.networkStatus) {
                case NET_ONLINE: this.SVGHeaderText.color = theme.light; break;
                case NET_ERROR: this.SVGHeaderText.color = theme.danger; break;
                case NET_RECONNECT: this.SVGHeaderText.color = theme.info; break;
                default: //offline
                    this.SVGHeaderText.color = theme.secondary; break;
            }
               this.SVGWidgetText1.color = theme.light;
            this.SVGWidgetText2.color = theme.light;
            this.SVGWidgetText3.color = theme.light;
            this.SVGWidgetText4.color = theme.light;
             this.SVGWidgetText1.text = this.widgetText.substring(0, 20);
            this.SVGWidgetText2.text = this.widgetText.substring(20, 40);
            this.SVGWidgetText3.text = this.widgetText.substring(40, 60);
            this.SVGWidgetText4.text = this.widgetText.substring(60);
             this.SVGWidgetText1.x = this.widgetLeft;
            this.SVGWidgetText1.y = this.widgetTop;
             this.SVGWidgetText2.x = this.widgetLeft;
            this.SVGWidgetText2.y = this.SVGWidgetText1.y + this.SVGWidgetText1.height;
             this.SVGWidgetText3.x = this.widgetLeft;
            this.SVGWidgetText3.y = this.SVGWidgetText2.y + this.SVGWidgetText2.height;
             this.SVGWidgetText4.x = this.widgetLeft;
            this.SVGWidgetText4.y = this.SVGWidgetText3.y + this.SVGWidgetText4.height;
              */

            /*        
            //var newValue = getParsedDriverProperty(this.id, "text");
            if (this.percent !== this.textarea.storedValue) {
                this.textarea.value = this.percent;
                this.textarea.storedValue = this.percent;
            }
             this.textElement.innerHTML = this.text;
            
            switch (this.networkStatus) {
                case NET_ONLINE:
                     this.textElement.className = "text-white text-center";
                    this.hintElement.innerHTML = getLang("rid_online");
                    this.hintElement.className = "LCDWidgetHint text-secondary text-center";
                    break;
                case NET_ERROR:
                    this.textElement.className = "text-danger text-center";
                    this.hintElement.innerHTML = getLang("rid_error");
                    this.hintElement.className = "LCDWidgetHint text-danger text-center";
                    break;
                case NET_RECONNECT:
                    this.textElement.className = "text-info text-center";
                    this.hintElement.innerHTML = getLang("rid_connect");
                    this.hintElement.className = "LCDWidgetHint text-info text-center";
                    break;
                default: //offline
                    this.textElement.className = "text-secondary text-center";
                    this.hintElement.innerHTML = getLang("rid_offline");
                    this.hintElement.className = "LCDWidgetHint text-secondary text-center";
                    break;
            }
            */
        };

        LCDWidget.prototype.drawWidget = function drawWidget() {
            if (this.SVGWidgetBack == undefined) return;
            if (this.light == 1) {
                this.SVGWidgetBack.color = theme.info;
            } else {
                this.SVGWidgetBack.color = theme.secondary;
            }

            _BaseWidget.prototype.drawWidget.call(this);
            /*
                    if (this.light == 1) {
                        this.SVGWidgetBack.color = theme.info;
                    }
                    else {
                        this.SVGWidgetBack.color = theme.secondary;
                    }
            
                    //spinner 
                    if (this.networkStatus == NET_RECONNECT) {
                        this.spinnerAngle += 1.5;
                        this.SVGArcSpinner.draw(this.spinnerAngle, 240 + this.spinnerAngle);
                        requestAnimationFrame(() => this.drawWidget());
                    }
                    else {
                        this.SVGArcSpinner.hide();
                    }
                    
                    */

        };

        return LCDWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var LightWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(LightWidget, _BaseWidget);

        function LightWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        LightWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 10;
            widget.topMargin = widget.height - widget.size / 6;
            widget.animated = false;
            widget.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(widget.SVGViewBox, widget.id + "arcback1" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 14);
                SVGlevelArc.index = i;
                SVGlevelArc.opacity = i * 0.2;

                widget.levelArc.push(SVGlevelArc);
            }

            widget.SVGArcSpinner.y = widget.topMargin;
            widget.SVGArcSpinner.radius = widget.radius * 4.5;

            widget.clickableToTop();

            widget._properties.lightcolor =
                {
                    tab: "C",
                    value: theme.warning,
                    type: "c"
                };

            widget.properties = widget._properties;

            widget.doOnLoad();
        }

        LightWidget.prototype.refresh = function refresh(data, widgetText, label) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label);
        };

        LightWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
            if (this.SVGWidgetText == undefined) return;
            this.SVGWidgetText.y = this.size / 5 + this.SVGWidgetText.height / 2;

        };

        LightWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);
            if (this.levelArc == undefined) return;
            for (var i = 0; i < 4; i++) {
                this.levelArc[i].hide();


                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.toColor(this.levelArc[i], this.properties.lightcolor.value);
                        //  this.levelArc[i].opacity = 0.7;
                        break;

                    case NET_ERROR:
                        this.toColor(this.levelArc[i], theme.danger);
                        // this.levelArc[i].opacity = 0.4;
                        break;

                    case NET_RECONNECT:
                        this.toColor(this.levelArc[i], theme.info);
                        // this.levelArc[i].opacity = 0.4;
                        break;

                    default:
                        //offline
                        this.toColor(this.levelArc[i], theme.secondary);
                        // this.levelArc[i].opacity = 0.4;
                        break;
                }
            }

            if (this._data > 30) {
                this.levelArc[0].draw(270, 360 + 90);
            }

            if (this._data > 50) {
                this.levelArc[1].draw(270, 360 + 90);
            }

            if (this._data > 70) {
                this.levelArc[2].draw(270, 360 + 90);
            }

            if (this._data > 90) {
                this.levelArc[3].draw(270, 360 + 90);
            }
        };

        return LightWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var LCDWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(LCDWidget, _BaseWidget);

        function LCDWidget(parentPanel, id, size) {            
            return _BaseWidget.call(this, parentPanel, id, size) || this;         
        }

        LCDWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.widgetHolder.className = "col-6 col-sm-4 col-lg-2";

            widget.topMargin = widget.size / 20; //this.panding = 5;
            widget.width = widget.size * 2;
            widget.height = widget.size;
            widget.centreX = widget.width / 2; //  this.centreY = this.height / 2;
            widget.widgetTextSize = widget.size / 110;

            widget.SVGViewBox.setAttributeNS(null, "viewBox", "0 0 " + widget.width + " " + widget.height);

            //widget.SVGViewBox.setAttributeNS(null, "width", widget.width);

            widget.SVGBackgroundPanel.drawRoundedRect(widget.width, widget.height, 5, 10, true, true, true, true);
            widget.SVGHeaderPanel.drawRoundedRect(widget.width, 26, 5, 0, true, true, false, false);
            widget.SVGBackdownpanel.y += 3;
            widget.SVGBackdownpanel.drawRoundedRect(widget.width, 10, 5, 0, false, false, true, true);
            widget.SVGWidgetText1 = new SVGText(widget.SVGViewBox, widget.id + "widgettext1", widget.widgetTextSize);
            widget.SVGWidgetText1.fontFamily = "monospace";
            widget.SVGWidgetText2 = new SVGText(widget.SVGViewBox, widget.id + "widgettext2", widget.widgetTextSize);
            widget.SVGWidgetText2.fontFamily = "monospace";
            widget.SVGWidgetText3 = new SVGText(widget.SVGViewBox, widget.id + "widgettext3", widget.widgetTextSize);
            widget.SVGWidgetText3.fontFamily = "monospace";
            widget.SVGWidgetText4 = new SVGText(widget.SVGViewBox, widget.id + "widgettext4", widget.widgetTextSize);
            widget.SVGWidgetText4.fontFamily = "monospace";
            widget.SVGWidgetText1.text = "1234567890ABCSDEFGHL"; //20 chars 

            widget.SVGHeaderText.text = "LCD";
            widget.textWidth = widget.SVGWidgetText1.width;
            widget.textHeight = widget.SVGWidgetText1.height;
            widget.widgetLeft = widget.centreX - widget.textWidth / 2;
            widget.widgetTop = widget.centreY + widget.SVGHeaderText.height - widget.textHeight * 4 / 2;
            widget.SVGWidgetBack = new SVGRect(widget.SVGViewBox, widget.id + "widgetback", widget.widgetLeft - widget.panding, widget.widgetTop - parseFloat(widget.textHeight - widget.panding), widget.textWidth + widget.panding * 2, widget.textHeight * 4 + widget.panding);
            widget.SVGWidgetBack.opacity = 0.2;
            widget.SVGWidgetBack.color = theme.secondary;
            widget.SVGWidgetText1.text = "";
            widget.SVGHeaderText.text = "";

            widget.SVGWidgetText.hide();

            widget.SVGArcSpinner.x = widget.centreX;
            widget.widgetHolder.onclick = widget.showEditor; //Popup editor 

            widget.pre = widget.widgetHolder.appendChild(document.createElement('pre'));
            widget.pre.className = "LCDTextArea";
            widget.pre.style.display = 'none';
            widget.textarea = widget.pre.appendChild(document.createElement('textarea'));
            widget.textarea.className = "form-control text-white bg-primary";
            widget.textarea.id = "textarea" + widget.id;
            widget.textarea.rows = "4";
            widget.textarea.cols = "25";

            var elementHeight = widget.pre.getBoundingClientRect().height;

            widget.pre.style.marginTop = -(elementHeight / 2.0 + widget.size / 1.8) + "px";
            widget.btnGroup = widget.widgetHolder.appendChild(document.createElement("p"));
            widget.btnGroup.style.display = 'none';
            widget.btnGroup.className = "LCDButtons";
            widget.btnGroup.role = "group";
            widget.textElement = widget.btnGroup.appendChild(document.createElement('div'));
            widget.textElement.className = "text-white";
            widget.lcdButton = widget.btnGroup.appendChild(document.createElement('input'));
            widget.lcdButton.className = "btn btn-success text-white LCDButton";
            widget.lcdButton.id = widget.id + "lcdbutton";
            widget.lcdButton.type = "button";
            widget.lcdButton.edit = widget.textarea;
            widget.lcdButton.lcdid = widget.id;
            widget.lcdButton.widget = _assertThisInitialized(widget); // this.lcdButton.onclick = lcdButtonClick;

            widget.lcdButton.value = getLang("send");
            widget.lightButton = widget.btnGroup.appendChild(document.createElement('input'));
            widget.lightButton.className = "btn btn-info text-white LCDButton";
            widget.lightButton.id = widget.id + "clearbutton";
            widget.lightButton.type = "button";
            widget.lightButton.edit = widget.textarea;
            widget.lightButton.lcdid = widget.id;
            widget.lightButton.widget = _assertThisInitialized(widget); //  this.lightButton.onclick = lightButtonClick;

            widget.lightButton.value = getLang("shortlight");
            widget.ShowEqualizer = false;

            widget.proprties = widget._properties;
            widget.resize(widget.width);
            widget.doOnLoad();
        };

        LCDWidget.prototype.resize = function resize(size) {
            this.size = size;
            this.SVGViewBox.setAttributeNS(null, "width", size);
            this.SVGViewBox.setAttributeNS(null, "height", size / 2);

        };
        

        LCDWidget.prototype.refresh = function refresh(widgetText, label, light) {
            label = getLang(label);
            this.widgetText = widgetText;
            this.label = label;
            this.spinnerAngle = 0;

            if (light != undefined) {
                this.light = light;
            } else {
                this.light = 0;
            }

            this.redrawAll();
        };

        LCDWidget.prototype.showEditor = function showEditor(event) {
            event.stopPropagation();
            var rPanel = event.currentTarget;
            var lcdWidget = rPanel.widget;

            if (!lcdWidget.pre.style.display.indexOf("block")!=-1) {
                lcdWidget.textarea.value = lcdWidget.widgetText;
                lcdWidget.pre.style.display = 'block';
                lcdWidget.btnGroup.style.display = 'block';
            } else {//TODO: direct click     
                //  lcdWidget.hideEditor(); 
            }

            return true;
        };

        LCDWidget.prototype.hideEditor = function hideEditor() {
            this.pre.style.display = 'none';
            this.btnGroup.style.display = 'none';
        }
            /*
                get _newtorkStatus() {
                    return this.networkStatus;
                }
            
                set _networkStatus(networkStatus) {
                    if ((networkStatus >= NET_OFFLINE) && (networkStatus <= NET_RECONNECT)) {
                        this.networkStatus = networkStatus;
                        this.redrawAll();
                    }
                }
            
                get _percent() {
                    return this.percent;
                }
            
                set _percent(percent) {
                    if ((percent >= 0) && (percent <= 100)) {
                        this.percent = percent;
                        this.redrawAll();
                    }
                }
            
                //---------------------------------------------------------------------------------------
                redrawAll() {
                    this.drawText();
                    this.starttime = 0;
                    requestAnimationFrame(() => this.drawWidget());
            
            
                }
                */
            //---------------------------------------------------------------------------------------
            //draw element text labels - percent value and text 
            ;

        LCDWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);

            if (this.SVGWidgetText1 == undefined) return;

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.SVGWidgetText1.color = theme.light;
                    this.SVGWidgetText2.color = theme.light;
                    this.SVGWidgetText3.color = theme.light;
                    this.SVGWidgetText4.color = theme.light;
                    break;

                case NET_RECONNECT:
                    this.SVGWidgetText1.color = theme.info;
                    this.SVGWidgetText2.color = theme.info;
                    this.SVGWidgetText3.color = theme.info;
                    this.SVGWidgetText4.color = theme.info;
                    break;

                default:
                    //offline
                    this.SVGWidgetText1.color = theme.secondary;
                    this.SVGWidgetText2.color = theme.secondary;
                    this.SVGWidgetText3.color = theme.secondary;
                    this.SVGWidgetText4.color = theme.secondary;
                    break;
            }

            if (this.widgetText == undefined) {
                this.widgetText = "";
            }

            this.SVGWidgetText1.text = this.widgetText.substring(0, 20);
            this.SVGWidgetText2.text = this.widgetText.substring(20, 40);
            this.SVGWidgetText3.text = this.widgetText.substring(40, 60);
            this.SVGWidgetText4.text = this.widgetText.substring(60);
            this.SVGWidgetText1.x = this.widgetLeft;
            this.SVGWidgetText1.y = this.widgetTop;
            this.SVGWidgetText2.x = this.widgetLeft;
            this.SVGWidgetText2.y = this.SVGWidgetText1.y + this.SVGWidgetText1.height;
            this.SVGWidgetText3.x = this.widgetLeft;
            this.SVGWidgetText3.y = this.SVGWidgetText2.y + this.SVGWidgetText2.height;
            this.SVGWidgetText4.x = this.widgetLeft;
            this.SVGWidgetText4.y = this.SVGWidgetText3.y + this.SVGWidgetText4.height;
            
            this.SVGHeaderText.text = this.label;
            this.SVGHeaderText.x = this.width / 2 - this.SVGHeaderText.width / 2;
            this.SVGHeaderText.y = this.SVGHeaderText.height - this.panding;
           /*  switch (this.networkStatus) {
                case NET_ONLINE: this.SVGHeaderText.color = theme.light; break;
                case NET_ERROR: this.SVGHeaderText.color = theme.danger; break;
                case NET_RECONNECT: this.SVGHeaderText.color = theme.info; break;
                default: //offline
                    this.SVGHeaderText.color = theme.secondary; break;
            }
               this.SVGWidgetText1.color = theme.light;
            this.SVGWidgetText2.color = theme.light;
            this.SVGWidgetText3.color = theme.light;
            this.SVGWidgetText4.color = theme.light;
             this.SVGWidgetText1.text = this.widgetText.substring(0, 20);
            this.SVGWidgetText2.text = this.widgetText.substring(20, 40);
            this.SVGWidgetText3.text = this.widgetText.substring(40, 60);
            this.SVGWidgetText4.text = this.widgetText.substring(60);
             this.SVGWidgetText1.x = this.widgetLeft;
            this.SVGWidgetText1.y = this.widgetTop;
             this.SVGWidgetText2.x = this.widgetLeft;
            this.SVGWidgetText2.y = this.SVGWidgetText1.y + this.SVGWidgetText1.height;
             this.SVGWidgetText3.x = this.widgetLeft;
            this.SVGWidgetText3.y = this.SVGWidgetText2.y + this.SVGWidgetText2.height;
             this.SVGWidgetText4.x = this.widgetLeft;
            this.SVGWidgetText4.y = this.SVGWidgetText3.y + this.SVGWidgetText4.height;
              */

            /*        
            //var newValue = getParsedDriverProperty(this.id, "text");
            if (this.percent !== this.textarea.storedValue) {
                this.textarea.value = this.percent;
                this.textarea.storedValue = this.percent;
            }
             this.textElement.innerHTML = this.text;
            
            switch (this.networkStatus) {
                case NET_ONLINE:
                     this.textElement.className = "text-white text-center";
                    this.hintElement.innerHTML = getLang("rid_online");
                    this.hintElement.className = "LCDWidgetHint text-secondary text-center";
                    break;
                case NET_ERROR:
                    this.textElement.className = "text-danger text-center";
                    this.hintElement.innerHTML = getLang("rid_error");
                    this.hintElement.className = "LCDWidgetHint text-danger text-center";
                    break;
                case NET_RECONNECT:
                    this.textElement.className = "text-info text-center";
                    this.hintElement.innerHTML = getLang("rid_connect");
                    this.hintElement.className = "LCDWidgetHint text-info text-center";
                    break;
                default: //offline
                    this.textElement.className = "text-secondary text-center";
                    this.hintElement.innerHTML = getLang("rid_offline");
                    this.hintElement.className = "LCDWidgetHint text-secondary text-center";
                    break;
            }
            */
        };

        LCDWidget.prototype.drawWidget = function drawWidget() {
            if (this.SVGWidgetBack == undefined) return;
            if (this.light == 1) {
                this.SVGWidgetBack.color = theme.info;
            } else {
                this.SVGWidgetBack.color = theme.secondary;
            }

            _BaseWidget.prototype.drawWidget.call(this);
            /*
                    if (this.light == 1) {
                        this.SVGWidgetBack.color = theme.info;
                    }
                    else {
                        this.SVGWidgetBack.color = theme.secondary;
                    }
            
                    //spinner 
                    if (this.networkStatus == NET_RECONNECT) {
                        this.spinnerAngle += 1.5;
                        this.SVGArcSpinner.draw(this.spinnerAngle, 240 + this.spinnerAngle);
                        requestAnimationFrame(() => this.drawWidget());
                    }
                    else {
                        this.SVGArcSpinner.hide();
                    }
                    
                    */

        };

        return LCDWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var LightWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(LightWidget, _BaseWidget);

        function LightWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        LightWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 10;
            widget.topMargin = widget.height - widget.size / 6;
            widget.animated = false;
            widget.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(widget.SVGViewBox, widget.id + "arcback1" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 14);
                SVGlevelArc.index = i;
                SVGlevelArc.opacity = i * 0.2;

                widget.levelArc.push(SVGlevelArc);
            }

            widget.SVGArcSpinner.y = widget.topMargin;
            widget.SVGArcSpinner.radius = widget.radius * 4.5;

            widget.clickableToTop();

            widget._properties.lightcolor =
                {
                    tab: "C",
                    value: theme.warning,
                    type: "c"
                };

            widget.properties = widget._properties;

            widget.doOnLoad();
        }

        LightWidget.prototype.refresh = function refresh(data, widgetText, label) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label);
        };

        LightWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
            if (this.SVGWidgetText == undefined) return;
            this.SVGWidgetText.y = this.size / 5 + this.SVGWidgetText.height / 2;

        };

        LightWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);
            if (this.levelArc == undefined) return;
            for (var i = 0; i < 4; i++) {
                this.levelArc[i].hide();


                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.toColor(this.levelArc[i], this.properties.lightcolor.value);
                        //  this.levelArc[i].opacity = 0.7;
                        break;

                    case NET_ERROR:
                        this.toColor(this.levelArc[i], theme.danger);
                        // this.levelArc[i].opacity = 0.4;
                        break;

                    case NET_RECONNECT:
                        this.toColor(this.levelArc[i], theme.info);
                        // this.levelArc[i].opacity = 0.4;
                        break;

                    default:
                        //offline
                        this.toColor(this.levelArc[i], theme.secondary);
                        // this.levelArc[i].opacity = 0.4;
                        break;
                }
            }

            if (this._data > 30) {
                this.levelArc[0].draw(270, 360 + 90);
            }

            if (this._data > 50) {
                this.levelArc[1].draw(270, 360 + 90);
            }

            if (this._data > 70) {
                this.levelArc[2].draw(270, 360 + 90);
            }

            if (this._data > 90) {
                this.levelArc[3].draw(270, 360 + 90);
            }
        };

        return LightWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var MotionWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(MotionWidget, _BaseWidget);

        function MotionWidget(parentPanel, id, size) {

            return _BaseWidget.call(this, parentPanel, id, size) || this;
            
        }

        MotionWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 30;
            widget.topMargin = widget.centreY + widget.size / 20;
            widget.animated = false;
            widget.radar1 = [];
            widget.radar2 = [];
            widget.radar3 = [];
            widget.radar4 = [];

            for (var i = 1; i < 5; i++) {
                var SVGRadarArc1 = new SVGArc(widget.SVGViewBox, widget.id + "arcback1" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 34);
                var SVGRadarArc2 = new SVGArc(widget.SVGViewBox, widget.id + "arcback2" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 34);
                var SVGRadarArc3 = new SVGArc(widget.SVGViewBox, widget.id + "arcback3" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 34);
                var SVGRadarArc4 = new SVGArc(widget.SVGViewBox, widget.id + "arcback4" + i, widget.centreX, widget.topMargin, i * widget.radius, widget.size / 34);
                SVGRadarArc1.index = SVGRadarArc2.index = SVGRadarArc3.index = SVGRadarArc4.index = i;
                SVGRadarArc1.color = SVGRadarArc2.color = SVGRadarArc3.color = SVGRadarArc4.color = theme.success;

                widget.radar1.push(SVGRadarArc1);

                widget.radar2.push(SVGRadarArc2);

                widget.radar3.push(SVGRadarArc3);

                widget.radar4.push(SVGRadarArc4);
            }

            widget.SVGArcSpinner.y = widget.topMargin;

            widget.clickableToTop();

            widget.proprties = widget._properties;

            widget.doOnLoad();
        };

        MotionWidget.prototype.refresh = function refresh(data, widgetText, label, historyData) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label, historyData);
        };

        MotionWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
        };

        MotionWidget.prototype.animate = function animate() {
            var baseWidget2 = this;
            if (this.radar1 == undefined) return;
            if (this.animated) {
                for (var i = 0; i < 4; i++) {
                    this.radar1[i].radius += 0.5;
                    this.radar1[i].opacity -= 0.01;

                    if (this.radar1[i].radius > this.radius * 8) {
                        this.radar1[i].radius = this.radius;
                        this.radar1[i].opacity = 0.9;
                    }

                    this.radar1[i].draw(270 + 15, 350 - 15);
                    this.radar2[i].radius = this.radar3[i].radius = this.radar4[i].radius = this.radar1[i].radius;
                    this.radar2[i].opacity = this.radar3[i].opacity = this.radar4[i].opacity = this.radar1[i].opacity;
                    this.radar2[i].draw(15, 90 - 15);
                    this.radar3[i].draw(90 + 16, 180 - 15);
                    this.radar4[i].draw(180 + 15, 270 - 15);
                }

                requestAnimationFrame(function () {
                    return baseWidget2.animate();
                });
            }
        };

        MotionWidget.prototype.drawWidget = function drawWidget() {
            var baseWidget3 = this;

            _BaseWidget.prototype.drawWidget.call(this);
            if (this.radar1 == undefined) return;

            if (this._networkStatus == NET_ONLINE && this._data == 1) {
                if (!this.animated) {
                    this.animated = true;
                    requestAnimationFrame(function () {
                        return baseWidget3.animate();
                    });
                }
            } else {
                this.animated = false;

                for (var i = 0; i < 4; i++) {
                    this.radar1[i].hide();
                    this.radar2[i].hide();
                    this.radar3[i].hide();
                    this.radar4[i].hide();
                }
            }
        };

        return MotionWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/


var settingsUI = {

    onConfigLoad: function (configProperties) {

        if (configProperties.nodes.length == 0) return;

        var nodesSideBar = document.getElementById("settingsSideBarUl");
        //  nodesSideBar.style.background = theme.primary;

        //add addNodeNavItem first --------------------------------------------------
        if (document.getElementById("addNodeNavItem") == undefined) {

            var nodeNavItem = nodesSideBar.appendChild(document.createElement("li"));
            nodeNavItem.className = "nav-item";
            nodeNavItem.id = "addNodeNavItem";
            var nodeHRef = nodeNavItem.appendChild(document.createElement("a"));
            nodeHRef.className = "nav-link";
            nodeHRef.style.color = theme.warning;
            nodeHRef.parentLi = nodeLi;
            //nodeHRef.style.color = theme.success;
            nodeHRef.setAttribute("data-toggle", "tab");
            nodeHRef.onclick = settingsUI.addNodeClick;
            nodeHRef.innerHTML = getLang("addnode");
            nodeHRef.href = "#home";

            //панель не видна, она существует для организии SideBar, сами панели со свойствами драйвер сделаны на основе navBar - так сложилось исторически, SideBar только переключает их
            var nodePropAnchors = document.getElementById("nodePropAnchors");
            //NavTabs панель для панелей со свойствами нод
            var nodePropNavBar = nodePropAnchors.appendChild(document.createElement("ul"));
            nodePropNavBar.style.height = "0px";
            nodePropNavBar.id = "nodePropNavBar";
            nodePropNavBar.className = "nav nav-tabs";
        }

        for (var nodeKey in configProperties.nodes) {
            var node = configProperties.nodes[nodeKey];
            if (document.getElementById("nodeNavItem" + node.nodenickname) == undefined) {
                var nodeLi = nodesSideBar.appendChild(document.createElement("li"));
                nodeLi.id = "nodeNavItem" + node.nodenickname;
                nodeLi.node = node;

                var nodeAhref = nodeLi.appendChild(document.createElement("a"));
                nodeAhref.href = "#" + node.nodenickname + "submenu";
                nodeAhref.setAttribute("data-toggle", "collapse");
                nodeAhref.setAttribute("aria-expanded", "false");
                nodeAhref.innerHTML = node.nodenickname;
                nodeAhref.id = node.nodenickname + "ahref";


                //nodeAhref.onclick = settingsUI.driverAnchorClick;
                nodeAhref.parentLi = nodeLi;
                nodeAhref.node = node;
                node.addNetworkStatusListner(settingsUI.onNetworkChange, nodeAhref);
                var nodeSubmenuUl = nodeLi.appendChild(document.createElement("ul"));

                nodeLi.nodeSubmenuUl = nodeSubmenuUl;
                nodeSubmenuUl.className = "collapse list-unstyled";
                nodeSubmenuUl.id = node.nodenickname + "submenu";



                //Node Tab panel ----------------------
                var nodePanelNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                nodePanelNavItem.className = "nav-item";
                var nodePanelHRef = nodePanelNavItem.appendChild(document.createElement("a"));
                nodePanelHRef.id = node.nodenickname + "nodePropsHref";
                nodePanelHRef.className = "nav-link";
                nodePanelHRef.parentLi = nodeLi;
                //nodePanelHRef.style.color = theme.warning;
                nodePanelHRef.setAttribute("data-toggle", "tab");
                nodePanelHRef.onclick = settingsUI.driverAnchorClick;
                nodePanelHRef.innerText = getLang("nodeproperties");
                nodePanelHRef.href = "#" + node.nodenickname + "nodePropsPanel";
                nodePanelHRef.node = node;
                var nodesPropsPanel = document.getElementById("nodesPropsPanel");

                //--- nodePropsPanel ---------------------------------------------------------------------------
                //панель для панелей с быстрым доступам к основным свойствам ноды
                var nodePropsPanel = nodesPropsPanel.appendChild(document.createElement('div'));
                nodePropsPanel.className = "tab-pane fade";
                nodePropsPanel.id = node.nodenickname + "nodePropsPanel";
                nodeAhref.nodefadepanel = nodePropsPanel;

                var nodePropHolderPanel = nodePropsPanel.appendChild(document.createElement('div'));
                nodePropHolderPanel.id = node.nodenickname + "bodePropHoder";
                nodePropHolderPanel.className = "row";

                //подготавливаем панели со свойствами ноды (для каждой ноды своя панель id = node.nodenickname + "nodePropPanel")
                //смотрите обработчик события onDriverLoaded() - он запоняет эту панель
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "NetworkNodeProp", getLang("networknodeprop"), 12);
                var networkNodePropBody = document.getElementById(node.nodenickname + "NetworkNodePropBody");
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody1", 4);
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody2", 4);
                settingsUI.addDiv(networkNodePropBody, node.nodenickname + "NetworkNodePropBody3", 4);

                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "WifiNodeProp", getLang("wifinodeprop"), 4); //WifiNodePropPanel - свойства WiFi                
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "SystemNodeProp", getLang("systemnodeprop"), 4);
                settingsUI.addCard(nodePropHolderPanel, node.nodenickname + "UpdateNodeProp", getLang("updatenodeprop"), 4);


                //--- EndOf nodePropsPanel ---------------------------------------------------------------------------



                //restful items main menu ----------------------
                var RESTfulNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                RESTfulNavItem.className = "nav-item";
                RESTfulNavItem.id = node.nodenickname + "restfulsubmenu2";

                var RESTfulAhref = RESTfulNavItem.appendChild(document.createElement("a"));
                RESTfulAhref.setAttribute("data-toggle", "collapse");
                RESTfulAhref.parentLi = RESTfulNavItem;
                RESTfulAhref.href = "#" + node.nodenickname + "restfulsubmenu";
                RESTfulAhref.node = node;

                RESTfulAhref.appendChild(document.createElement("i")).className = "fa fa-cog";
                var RESTfulAhrefSpan = RESTfulAhref.appendChild(document.createElement("span"));
                RESTfulAhrefSpan.className = "menu-text";
                RESTfulAhrefSpan.innerHTML = "<b>" + getLang("RESTful") + "</b>";

                RESTfulAhrefSpan = RESTfulAhref.appendChild(document.createElement("span"));
                RESTfulAhrefSpan.className = "badge badge-pill badge-warning";
                RESTfulAhrefSpan.id = node.nodenickname + "RESTfulAhrefDriverCountSpan";
                RESTfulAhrefSpan.innerHTML = "0";
                RESTfulAhrefSpan.driversCount = 0;


                var RESTfulSubmenuUl = RESTfulNavItem.appendChild(document.createElement("ul"));
                RESTfulSubmenuUl.className = "collapse list-unstyled";
                RESTfulSubmenuUl.id = node.nodenickname + "restfulsubmenu";

                //Add driver submenuitem ----------------
                var driverNavItem = RESTfulSubmenuUl.appendChild(document.createElement("li"));
                driverNavItem.className = "nav-item";
                var driverHRef = driverNavItem.appendChild(document.createElement("a"));
                driverHRef.className = "nav-link";
                driverHRef.style.color = theme.warning;
                driverHRef.parentLi = nodeLi;
                //driverHRef.style.color = theme.success;
                driverHRef.setAttribute("data-toggle", "tab");
                driverHRef.onclick = settingsUI.addDriverClick;
                driverHRef.innerHTML = getLang("adddriver");
                driverHRef.href = "#home";
                driverHRef.node = node;


                //аdd script submenuitem ------------------
                var scriptsNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                scriptsNavItem.className = "nav-item";
                var scriptsAhref = scriptsNavItem.appendChild(document.createElement("a"));
                scriptsAhref.className = "nav-link";
                scriptsAhref.parentLi = nodeLi;
                //filesHRef.style.color = theme.warning;
                scriptsAhref.setAttribute("data-toggle", "collapse");
                scriptsAhref.onclick = settingsUI.driverAnchorClick;
                scriptsAhref.href = "#" + node.nodenickname + "scriptssubmenu";
                scriptsAhref.node = node;

                scriptsAhref.appendChild(document.createElement("i")).className = "fa fa-bolt";

                var scriptsAhrefSpan = scriptsAhref.appendChild(document.createElement("span"));
                scriptsAhrefSpan.className = "menu-text";
                scriptsAhrefSpan.innerHTML = "<b>" + getLang("scripts") + "</b>";

                scriptsAhrefSpan = scriptsAhref.appendChild(document.createElement("span"));
                scriptsAhrefSpan.className = "badge badge-pill badge-warning";
                scriptsAhrefSpan.id = node.nodenickname + "scriptsAhrefDriverCountSpan";
                scriptsAhrefSpan.innerHTML = "0";
                scriptsAhrefSpan.driversCount = 0;


                var scriptsSubmenuUl = scriptsNavItem.appendChild(document.createElement("ul"));
                scriptsSubmenuUl.className = "collapse list-unstyled";
                scriptsSubmenuUl.id = node.nodenickname + "scriptssubmenu";

                //+add script submenu item 
                var scriptsAddLi = scriptsSubmenuUl.appendChild(document.createElement("li"));
                scriptsAddLi.className = "nav-item";

                var scriptsAddAhref = scriptsAddLi.appendChild(document.createElement("a"));
                scriptsAddAhref.id = node.nodenickname + "scriptaddahref";
                scriptsAddAhref.className = "nav-link";
                scriptsAddAhref.style.color = theme.warning;
                scriptsAddAhref.setAttribute("data-toggle", "tab");
                scriptsAddAhref.href = "#";
                scriptsAddAhref.node = node; //привязываем пункт меню к ноде 
                scriptsAddAhref.innerHTML = getLang("createscript");
                scriptsAddAhref.onclick = settingsUI.createScriptClick;
                scriptsAddAhref.parentLi = scriptsAddLi; //сохраняем родительский driverId

                scriptsManager.onNew = settingsUI.onScriptNew;
                scriptsManager.onChange = settingsUI.onScriptChange;
                scriptsManager.onDelete = settingsUI.onScriptDelete;



                //Add files submenuitem ------------------
                var filesNavItem = nodeSubmenuUl.appendChild(document.createElement("li"));
                filesNavItem.className = "nav-item";
                var filesHRef = filesNavItem.appendChild(document.createElement("a"));
                filesHRef.className = "nav-link";
                filesHRef.parentLi = nodeLi;
                //filesHRef.style.color = theme.warning;
                filesHRef.setAttribute("data-toggle", "tab");
                filesHRef.onclick = settingsUI.driverAnchorClick;
                filesHRef.innerText = getLang("files");
                filesHRef.href = "#" + node.nodenickname + "filesfadepanel";
                filesHRef.node = node;

                //new files tab ----------------
                var nodesPropsPanel = document.getElementById("nodesPropsPanel");
                var filesDiv = nodesPropsPanel.appendChild(document.createElement('div'));
                filesDiv.className = "tab-pane fade";
                filesDiv.id = node.nodenickname + "filesfadepanel";
                filesHRef.filesList = new FilesList(filesDiv, node);



                // add Node Status Panel ---------------------------------------------
                var nodeStatusPanel = document.createElement("div");
                nodeStatusPanel.id = node.nodenickname + "nodestatuspanel";
                nodeAhref.nodeStatusPanel = nodeStatusPanel;

                nodeAhref.onlinePanel = settingsUI.getStatusWidget(node.nodenickname + "onlineStatus", "Online", nodeStatusPanel);

                node.addNetworkStatusListner(settingsUI.onOnlineStatusChange, nodeAhref.onlinePanel);
                nodeAhref.WiFiAPPanel = settingsUI.getStatusWidget(node.nodenickname + "wifiapStatus", "WiFi AP", nodeStatusPanel);

                nodeAhref.WiFiSTPanel = settingsUI.getStatusWidget(node.nodenickname + "wifistStatus", "WiFi ST", nodeStatusPanel);
                nodeAhref.RESTfulPanel = settingsUI.getStatusWidget(node.nodenickname + "restfulStatus", "RESTful", nodeStatusPanel);
                nodeAhref.MQTTPanel = settingsUI.getStatusWidget(node.nodenickname + "mqttStatus", "MQTT", nodeStatusPanel);
                nodeAhref.OTAPanel = settingsUI.getStatusWidget(node.nodenickname + "otaStatus", "OTA", nodeStatusPanel);

                document.getElementById("nodeStatusPanel").appendChild(nodeStatusPanel);

                var nodeStatusPanelText = document.createElement("div");
                nodeStatusPanelText.innerHTML = " <strong>" + node.nodenickname + "</strong> at <a href='" + node.host + "' target='_blank'>" + node.host + "</a>";
                document.getElementById("nodeStatusPanelText").appendChild(nodeStatusPanelText);

                nodeStatusPanel.nodeStatusPanelText = nodeStatusPanelText;
                nodeStatusPanel.style.display = "none";
                nodeStatusPanelText.style.display = "none";
            }
        }
    },

    onScriptNew: function (script) {
        var scriptsSubmenuUl = document.getElementById(script.node.nodenickname + "scriptssubmenu");
        if (scriptsSubmenuUl == undefined) return;

        var scriptsLi = scriptsSubmenuUl.appendChild(document.createElement("li"));
        scriptsLi.id = script.node.nodenickname + "_" + script.name + "li";
        scriptsLi.className = "nav-item";

        var scriptsAhref = scriptsLi.appendChild(document.createElement("a"));
        scriptsAhref.id = script.node.nodenickname + "_" + script.name + "scriptahref";
        scriptsAhref.className = "nav-link";
        scriptsAhref.setAttribute("data-toggle", "tab");
        scriptsAhref.href = "#" + script.node.nodenickname + "_" + script.name + "panel"; //якорь на панель 
        scriptsAhref.node = script.node; //привязываем пункт меню к ноде 
        scriptsAhref.innerText = script.name;
        scriptsAhref.onclick = settingsUI.driverAnchorClick; //обработчик клика на пунк меню (переключение панелей)
        scriptsAhref.parentLi = scriptsLi; //сохраняем родительский driverId
        scriptsLi.scriptsAhref = scriptsAhref;

        switch (parseInt(script.status)) {
            case stopScriptStatus: scriptsAhref.style.color = ""; break;
            case runScriptStatus: scriptsAhref.style.color = theme.success; break;
            case compilerScriptErrorStatus: scriptsAhref.style.color = theme.warning; break;
            default:
                scriptsAhref.style.color = theme.danger; break;
        }


        //Script panel 
        var nodesPropsPanel = document.getElementById("nodesPropsPanel");
        var scriptTab = nodesPropsPanel.appendChild(document.createElement('div'));
        scriptTab.id = script.node.nodenickname + "_" + script.name + "panel";
        scriptTab.className = "tab-pane fade md-form";
        scriptsLi.panel = scriptTab;

        var scriptHolder = scriptTab.appendChild(document.createElement('div'));
        scriptHolder.className = "row";

        var byteCodeCardDiv = scriptHolder.appendChild(document.createElement('div'));
        byteCodeCardDiv.className = "col-md-8";
        var byteCodeCard = byteCodeCardDiv.appendChild(document.createElement('div'));
        byteCodeCard.className = "card text-white bg-primary mb-3";
        var byteCodeCardHeader = byteCodeCard.appendChild(document.createElement('div'));
        byteCodeCardHeader.className = "card-header";
        byteCodeCardHeader.innerText = script.name + " script bytecode";
        var byteCodeCardBody = byteCodeCard.appendChild(document.createElement('div'));
        byteCodeCardBody.className = "card-body";
        var pre = byteCodeCardBody.appendChild(document.createElement('pre'));
        var textArea = pre.appendChild(document.createElement('textarea'));
        textArea.id = script.node.nodenickname + "_" + script.name + "textarea";
        textArea.className = "md-textarea form-control";
        textArea.placeholder = getLang("inputcodehere");
        textArea.cols = 80;
        textArea.rows = 20;
        textArea.value = script.bytecode;
        textArea.onkeydown = settingsUI.textAreaOnKeyDown;

        var scriptExecuteButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptExecuteButton.type = "button";
        scriptExecuteButton.id = script.node.nodenickname + "_" + script.name + "executionButton";
        scriptExecuteButton.className = "btn btn-sm btn-success";
        scriptExecuteButton.script = script;
        scriptExecuteButton.textArea = textArea;
        scriptExecuteButton.labels = label;
        scriptExecuteButton.onclick = settingsUI.scriptExecuteClick;
        scriptExecuteButton.appendChild(document.createElement("i")).className = "fa fa-bolt";
        var scriptExecuteButtonSpan = scriptExecuteButton.appendChild(document.createElement("span"));
        scriptExecuteButtonSpan.innerHTML = " " + getLang("scriptexecute");

        textArea.scriptExecuteButton = scriptExecuteButton;

        var scriptPauseButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptPauseButton.type = "button";
        scriptPauseButton.id = script.node.nodenickname + "_" + script.name + "pauseButton";
        scriptPauseButton.className = "btn btn-sm btn-warning";
        scriptPauseButton.script = script;
        scriptPauseButton.node = script.node; //когда ноду удалят и прийдет ActiveReciever - Script может уже не быть
        scriptPauseButton.scriptExecuteButton = scriptExecuteButton;
        scriptPauseButton.textArea = textArea;
        scriptPauseButton.labels = label;
        scriptPauseButton.onclick = settingsUI.scriptPauseClick;
        scriptPauseButton.appendChild(document.createElement("i")).className = "fa fa-pause";
        var scriptPauseButtonSpan = scriptPauseButton.appendChild(document.createElement("span"));
        scriptPauseButtonSpan.innerHTML = " " + getLang("scriptpause");

        scriptExecuteButton.scriptPauseButton = scriptPauseButton;

        var scriptDebugButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptDebugButton.type = "button";
        scriptDebugButton.id = script.node.nodenickname + "_" + script.name + "pauseButton";
        scriptDebugButton.className = "btn btn-sm btn-warning";
        scriptDebugButton.script = script;
        scriptDebugButton.node = script.node;
        scriptDebugButton.scriptExecuteButton = scriptExecuteButton;
        scriptDebugButton.textArea = textArea;
        scriptDebugButton.labels = label;
        scriptDebugButton.onclick = settingsUI.scriptDebugClick;
        scriptDebugButton.appendChild(document.createElement("i")).className = "fa fa-bug";
        scriptDebugButton.debugNext = false;
        var scriptDebugButtonSpan = scriptDebugButton.appendChild(document.createElement("span"));
        scriptDebugButtonSpan.innerHTML = " " + getLang("scriptstartdebug");

        var scriptDeleteButton = byteCodeCardDiv.appendChild(document.createElement('button'));
        scriptDeleteButton.type = "button";
        scriptDeleteButton.id = script.node.nodenickname + "_" + script.name + "deleteButton";
        scriptDeleteButton.className = "btn btn-sm btn-danger";
        scriptDeleteButton.script = script;
        scriptDeleteButton.node = script.node; //когда ноду удалят и прийдет ActiveReciever - Script может уже не быть
        scriptDeleteButton.scriptExecuteButton = scriptExecuteButton;
        scriptDeleteButton.scriptPauseButton = scriptPauseButton;
        scriptDeleteButton.textArea = textArea;
        scriptDeleteButton.labels = label;
        scriptDeleteButton.onclick = settingsUI.scriptDeleteClick;
        scriptDeleteButton.appendChild(document.createElement("i")).className = "fa fa-trash";
        var scriptDeleteButtonSpan = scriptDeleteButton.appendChild(document.createElement("span"));
        scriptDeleteButtonSpan.innerHTML = " " + getLang("scriptdelete");


        scriptExecuteButton.scriptDeleteButton = scriptDeleteButton;

        var label = byteCodeCardDiv.appendChild(document.createElement('label'));
        label.id = script.node.nodenickname + "_" + script.name + "label";
        label.for = script.node.nodenickname + "_" + script.name + "textarea";
        scriptExecuteButton.label = label;

        var scriptStatusCardDiv = scriptHolder.appendChild(document.createElement('div'));
        scriptStatusCardDiv.className = "col-md-4";
        var scriptStatusCard = scriptStatusCardDiv.appendChild(document.createElement('div'));
        scriptStatusCard.className = "card text-white bg-primary mb-3";
        var scriptStatusCardHeader = scriptStatusCard.appendChild(document.createElement('div'));
        scriptStatusCardHeader.className = "card-header";
        scriptStatusCardHeader.innerText = script.name + " status";
        var scriptStatusCardBody = scriptStatusCard.appendChild(document.createElement('div'));
        scriptStatusCardBody.className = "card-body";
        var scriptStatusPre = scriptStatusCardBody.appendChild(document.createElement('pre'));
        var statusLabel = scriptStatusPre.appendChild(document.createElement('label'));
        statusLabel.id = script.node.nodenickname + "_" + script.name + "statuslabel";
        settingsUI.buildScriptStatus(script);

    },

    onScriptChange: function (script) {
        var scriptsAhref = document.getElementById(script.node.nodenickname + "_" + script.name + "scriptahref");
        if (scriptsAhref == undefined) return;
        scriptsAhref.innerText = script.name;

        switch (parseInt(script.status)) {
            case stopScriptStatus: scriptsAhref.style.color = ""; break;
            case runScriptStatus: scriptsAhref.style.color = theme.success; break;
            case compilerScriptErrorStatus: scriptsAhref.style.color = theme.warning; break;
            default:
                scriptsAhref.style.color = theme.danger; break;
        }


        var textArea = document.getElementById(script.node.nodenickname + "_" + script.name + "textarea");
        var label = document.getElementById(script.node.nodenickname + "_" + script.name + "label");
        if (textArea.value !== script.bytecode) {
            if (textArea === document.activeElement) {
                label.style.color = theme.danger;
                label.innerHTML = "script: " + script.name + " Warning: changed outside or not save";
            }
            else {
                label.innerHTML = "script: " + script.name;
                label.style.color = "";
                textArea.value = script.bytecode;
            }
        }
        settingsUI.buildScriptStatus(script);
        if (script.status == debugScriptStatus) {
            settingsUI.selectCodeLine(textArea, script.debuglinenumber);
        }
    },

    //https://stackoverflow.com/questions/13650534/how-to-select-line-of-text-in-textarea
    selectCodeLine: function selectTextareaLine(tarea, lineNum) {
        lineNum--; // array starts at 0
        var lines = tarea.value.split("\n");

        // calculate start/end
        var startPos = 0, endPos = tarea.value.length;
        for (var x = 0; x < lines.length; x++) {
            if (x == lineNum) {
                break;
            }
            startPos += (lines[x].length + 1);

        }

        var endPos = lines[lineNum].length + startPos;

        // do selection
        // Chrome / Firefox

        if (typeof (tarea.selectionStart) != "undefined") {
            tarea.focus();
            tarea.selectionStart = startPos;
            tarea.selectionEnd = endPos;
            return true;
        }

        // IE
        if (document.selection && document.selection.createRange) {
            tarea.focus();
            tarea.select();
            var range = document.selection.createRange();
            range.collapse(true);
            range.moveEnd("character", endPos);
            range.moveStart("character", startPos);
            range.select();
            return true;
        }

        return false;
    },

    scriptDebugClick: function (event) {
        var scriptDebugButton = event.currentTarget;
        if (scriptDebugButton.debugNext == false) {
            scriptDebugButton.debugNext = true;
            scriptsManager.startDebug(scriptDebugButton.script);
        }
        else {
            scriptsManager.debugNext(scriptDebugButton.script);
            
        }
    },

    buildScriptStatus: function (script) {
        var statusLabel = document.getElementById(script.node.nodenickname + "_" + script.name + "statuslabel");
        statusLabel.innerHTML = "<b>Status: </b>" + script.status + "\n" +
            "<b>debuglinenumber: </b>" + script.debuglinenumber + "\n" +
            "<b>codecount: </b>" + script.codecount + "\n" +
            "<b>datacount: </b>" + script.datacount + "\n" +
            "<b>timequant: </b>" + script.timequant + "\n" +
            "<b>ip: </b>" + script.ip + "\n" +
            "<b>variables: </b>" + script.variables;
    },

    onScriptDelete: function (script) {
        var scriptsLi = document.getElementById(script.node.nodenickname + "_" + script.name + "li");
        scriptsLi.parentElement.removeChild(scriptsLi);
        scriptsLi.innerHTML = "";

        var scriptsPanel = document.getElementById(script.node.nodenickname + "_" + script.name + "panel");
        scriptsPanel.parentElement.removeChild(scriptsPanel);
        scriptsPanel.innerHTML = "";

        var scriptsSubmenuUl = document.getElementById(script.node.nodenickname + "scriptssubmenu");
        for (childKey in scriptsSubmenuUl.childNodes) {
            var scriptsLi = scriptsSubmenuUl.childNodes[childKey];
            if (scriptsLi.scriptsAhref != undefined) {
                var event = {
                    currentTarget: scriptsLi.scriptsAhref
                }
                settingsUI.driverAnchorClick(event);
                $(scriptsLi.scriptsAhref).toggleClass("active");
                $(scriptsLi.panel).toggleClass("active show");
                return;
            }
        }

        var nodePanelHRef = document.getElementById(script.node.nodenickname + "nodePropsHref");
        var nodePropsPanel = document.getElementById(script.node.nodenickname + "nodePropsPanel");
        var event = {
            currentTarget: nodePanelHRef
        }
        settingsUI.driverAnchorClick(event);
        $(nodePanelHRef).toggleClass("active");
        $(nodePropsPanel).toggleClass("active show");
    },
    //https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
    textAreaOnKeyDown: function (event) {
        var keyCode = event.keyCode || event.which;
        var textArea = event.currentTarget;

        if (keyCode == 0x09) { //tab key code
            event.preventDefault();
            var start = textArea.selectionStart;
            var end = textArea.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            $(textArea).val($(textArea).val().substring(0, start)
                + "\t"
                + $(textArea).val().substring(end));

            // put caret at right position again
            textArea.selectionStart =
                textArea.selectionEnd = start + 1;
        }
        else
            if (keyCode == 0x77) { //F8
                event = {
                    currentTarget: textArea.scriptExecuteButton
                }
                settingsUI.scriptExecuteClick(event);
            }

    },

    scriptExecuteClick: function (event) {
        var scriptExecuteButton = event.currentTarget;
        scriptExecuteButton.className = "btn btn-sm btn-secondary";
        var textArea = scriptExecuteButton.textArea;
        var script = scriptExecuteButton.script;
        script.bytecode = textArea.value;

        var scriptPauseButton = scriptExecuteButton.scriptPauseButton;
        scriptPauseButton.className = "btn btn-sm btn-secondary";
        var scriptDeleteButton = scriptExecuteButton.scriptDeleteButton;
        scriptDeleteButton.className = "btn btn-sm btn-secondary";
        var textArea = scriptExecuteButton.textArea;
        textArea.style.backgroundColor = theme.secondary;
        textArea.disabled = true;


        scriptsManager.createOrReplace(script, settingsUI.executeScriptAsyncReciever, scriptExecuteButton);
        return false;
    },

    executeScriptAsyncReciever: function (HTTPResult, sender) {
        var scriptExecuteButton = sender;
        var label = scriptExecuteButton.label;
        var script = scriptExecuteButton.script;

        var scriptPauseButton = scriptExecuteButton.scriptPauseButton;
        scriptPauseButton.className = "btn btn-sm btn-warning";
        var scriptDeleteButton = scriptExecuteButton.scriptDeleteButton;
        scriptDeleteButton.className = "btn btn-sm btn-danger";
        var textArea = scriptExecuteButton.textArea;
        textArea.style.backgroundColor = "";
        textArea.disabled = false;


        if (!HTTPResult.indexOf("%error") == 0) {
            scriptExecuteButton.className = "btn btn-sm btn-success";
            script.node.networkStatus = NET_ONLINE;
            scriptsManager.refresh(script.node);
            label.style.color = theme.success;
            label.innerText = "execute-OK";

        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (HTTPResult.indexOf("reponse") != -1) {
                script.node.networkStatus = NET_ERROR;
            }
            else {
                script.node.networkStatus = NET_OFFLINE;
            }
            scriptExecuteButton.className = "btn btn-sm btn-danger";
            label.style.color = theme.danger;
            label.innerText = HTTPResult;
        }
    },

    scriptDeleteClick: function (event) {
        var scriptDeleteButton = event.currentTarget;

        makeModalDialog("resetPanel", "deletescript", getLang("deletescript"), "");
        var modalBody = document.getElementById("deletescriptModalBody");
        modalBody.appendChild(document.createElement('label')).innerHTML = getLang("areyousuredeletescript");

        var modalFooter = document.getElementById("deletescriptModalFooter");

        var scriptModalDeleteButton = modalFooter.appendChild(document.createElement('button'));
        scriptModalDeleteButton.type = "button";
        scriptModalDeleteButton.id = event.currentTarget.id + "modal";
        scriptModalDeleteButton.className = "btn btn-sm btn-danger";
        scriptModalDeleteButton.scriptDeleteButton = event.currentTarget;
        scriptModalDeleteButton.onclick = settingsUI.scriptModalDeleteClick;
        scriptModalDeleteButton.appendChild(document.createElement("i")).className = "fa fa-trash";
        var scriptModalDeleteButtonSpan = scriptModalDeleteButton.appendChild(document.createElement("span"));
        scriptModalDeleteButtonSpan.innerHTML = " " + getLang("scriptdelete");

        $("#deletescriptModal").modal('show');
        return false;
    },

    scriptModalDeleteClick: function (event) {
        var scriptModalDeleteButton = event.currentTarget;
        var scriptDeleteButton = scriptModalDeleteButton.scriptDeleteButton;
        $("#deletescriptModal").modal('hide');

        scriptDeleteButton.className = "btn btn-sm btn-secondary";
        var script = scriptDeleteButton.script;

        var scriptExecuteButton = scriptDeleteButton.scriptExecuteButton;
        scriptExecuteButton.className = "btn btn-sm btn-secondary";

        var scriptPauseButton = scriptDeleteButton.scriptPauseButton;
        scriptPauseButton.className = "btn btn-sm btn-secondary";

        var textArea = scriptDeleteButton.textArea;
        textArea.style.backgroundColor = theme.secondary;
        textArea.disabled = true;

        scriptsManager.delete(script, settingsUI.scriptDeleteAsyncReciever, scriptDeleteButton);
        return false;
    },

    scriptDeleteAsyncReciever: function (HTTPResult, sender) {

        var scriptExecuteButton = sender;
        var label = scriptExecuteButton.label;
        var node = scriptExecuteButton.node;

        if (!HTTPResult.indexOf("%error") == 0) {
            node.networkStatus = NET_ONLINE; //UI редактора скрипта удалит onScriptDelete
            scriptsManager.refresh(node);
        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат


            if (HTTPResult.indexOf("reponse") != -1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            scriptExecuteButton.className = "btn btn-sm btn-danger";
            label.style.color = theme.danger;
            label.innerText = HTTPResult;
        }
    },


    createScriptClick: function (event) {
        var scriptsAddAhref = event.currentTarget;
        event.stopPropagation();

        makeModalDialog("resetPanel", "addscript", getLang("addscriptheader"), "");
        var modalFooter = document.getElementById("addscriptModalFooter");
        var modalBody = document.getElementById("addscriptModalBody");

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "hostEdit");
        label.innerText = getLang("addscriptname");
        var addScriptEdit = formGroup.appendChild(document.createElement('input'));
        addScriptEdit.className = "form-control form-control-sm";
        addScriptEdit.placeholder = "";
        addScriptEdit.id = "addscriptInput";

        var addScriptButton = modalFooter.appendChild(document.createElement("button"));
        addScriptButton.type = "button";
        addScriptButton.id = "addscriptModalButton";
        addScriptButton.className = "btn btn-sm btn-success";
        addScriptButton.node = scriptsAddAhref.node;
        addScriptButton.onclick = settingsUI.createScriptUIClick;
        addScriptButton.innerText = getLang("addscriptbutton");

        var addScriptError = formGroup.appendChild(document.createElement("label"));
        addScriptError.className = "text-danger";

        addScriptButton.addScriptEdit = addScriptEdit;
        addScriptButton.addScriptError = addScriptError;

        $("#addscriptModal").modal('show');

        return false;
    },

    createScriptUIClick: function (event) {
        var addScriptButton = event.currentTarget;
        var addScriptEdit = addScriptButton.addScriptEdit;
        var node = addScriptButton.node;
        if (addScriptButton.script == undefined) {
            addScriptButton.script = createScript(node);
        }
        addScriptButton.script.name = addScriptEdit.value;
        scriptsManager.createOrReplace(addScriptButton.script, settingsUI.createScriptAsynReciever, addScriptButton);
        return false;
    },

    createScriptAsynReciever: function (HTTPResult, sender) {
        var addScriptButton = sender;
        var addScriptError = addScriptButton.addScriptError;
        var node = addScriptButton.node;

        if (!HTTPResult.indexOf("%error") == 0) {
            node.networkStatus = NET_ONLINE;
            $("#addscriptModal").modal('hide');
            scriptsManager.refresh(node);
        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (HTTPResult.indexOf("reponse") != -1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            addScriptError.innerText = HTTPResult;
        }
    },

    //---------------------------------------------------------------------------------------------------------------------------------------------------
    //когда очередная нода загружает очередное драйвер - строим индикаторы в верхней панели "Настройки" - Online, WiFi AP, WiFi ST, RESTful, MQTT, OTA
    //и подготавлием панель управления нодой (с кнопками Update, Reset и основными свойствами ноды) - смотрите onConfigChange такая панель создается для каждой
    //ноды id = node.nodenickname + "nodePropPanel"    
    onDriverLoaded: function (sender, driver) {
        if (driver._new) { //если это драйвер загружено впервые (вновь созданные драйвера так же вызовут этот метод)

            var nodeSubmenuUl = document.getElementById(driver._nodenickname + "restfulsubmenu"); //ищем пункт sideBar соответствующий ноде которой принадлежит драйвер
            if (nodeSubmenuUl == undefined) return; //если такого пункта нет - выходим

            var node = config.getNodeByHost(driver._host); //узнаем какой ноде принадлежит драйвер
            if (node == undefined) return; //выходим если нода не найдена

            var driverLi = nodeSubmenuUl.appendChild(document.createElement("li")); //добавляем дочерний пукт в меню ноды в sideBar
            driverLi.className = "nav-item";

            //submenu drivers count 

            var RESTfulAhrefSpan = document.getElementById(driver._nodenickname + "RESTfulAhrefDriverCountSpan");
            RESTfulAhrefSpan.driversCount++;
            RESTfulAhrefSpan.innerHTML = parseInt(RESTfulAhrefSpan.driversCount);

            var driverAhref = driverLi.appendChild(document.createElement("a")); //отображаемая часть меню - гиперссылка
            driverAhref.className = "nav-link";
            driverAhref.setAttribute("data-toggle", "tab");
            driverAhref.href = "#" + driver._nodenickname + "_" + driver._id; //якорь на панель с таблицей со свойствами выбранного драйвера (создается один раз)
            driverAhref.node = config.getNodeByHost(driver._host); //привязываем пункт меню к ноде которой принадлежит драйвера (используется для быстрого поска ноды в будущем)
            driverAhref.innerText = driver._id; //пункт меню отображает ID нового драйвера
            driverAhref.onclick = settingsUI.driverAnchorClick; //обработчик клика на пунк меню (переключение панелей)
            driverAhref.parentLi = driverLi; //сохраняем родительский driverId

            var nodePropAnchors = document.getElementById("nodePropNavBar"); //старая навигационная панель для отображения панелей свойств
            var nodesPropsPanel = document.getElementById("nodesPropsPanel");
            var wifiPropPanel = document.getElementById(node.nodenickname + "WifiNodePropBody"); //панель для cвойств            
            var systemPropPanel = document.getElementById(node.nodenickname + "SystemNodePropBody");
            var updatePropPanel = document.getElementById(node.nodenickname + "UpdateNodePropBody");
            var networkPropPanel1 = document.getElementById(node.nodenickname + "NetworkNodePropBody1");
            var networkPropPanel2 = document.getElementById(node.nodenickname + "NetworkNodePropBody2");
            var networkPropPanel3 = document.getElementById(node.nodenickname + "NetworkNodePropBody3");
            //добавляем панель с таблицей со свойствами нового "driver" драйвера в панель nodesPropsPanel, якорим навигацию на nodePropAnchors, bootstrap cell size -> 12             
            new TableWidget(nodePropAnchors, nodesPropsPanel, driver, 12);

            //если очередное загруженое драйвер WiFi
            if (driver.type.value == WiFiDriverType) {
                //индикатор(widget) в верхней панеле для WiFi AP и Wifi ST - подключаем их к событиям WiFi текущей node.WifiDriver - теперь WifiDriver будет отправлять событие 
                //о своем состоянии непосредственно индикаторам 
                //сколько будет node столько будет индикаторов для их WiFi driver - мы отображаем только индикаторы выбранной в SideBar (текущей) node и ее драйвер
                //смотрите getStatusWidget() метод - если индикатора нет его создадут и подпишут id как node.nodenickname + "wifiapStatus"
                var WiFiAPPanel = settingsUI.getStatusWidget(node.nodenickname + "wifiapStatus", "WiFi AP", undefined);
                //подписываем свойство драйвера WiFi.wifiaccesspointavailable на обработчик settingsUI.onWiFiAPStatusChange
                //если WiFi.wifiaccesspointavailable изменит значение, будет вызван settingsUI.onWiFiAPStatusChange
                driver.wifiaccesspointavailable.addValueListner(settingsUI.onWiFiAPStatusChange, WiFiAPPanel);

                //так же как и WiFi AP
                var WiFiSTPanel = settingsUI.getStatusWidget(node.nodenickname + "wifistStatus", "WiFi ST", undefined); //
                driver.wifistatus.addValueListner(settingsUI.onWiFiSTStatusChange, WiFiSTPanel);

                //панель со свойствами node - добавляем отображени уровня WiFi сигнала (так же подписываем на событие изменения значения WiFi.wifirssi)


                var wifiAPCheckbox = settingsUI.addPropertyCheckbox(wifiPropPanel, driver.wifiaccesspointavailable, getLang("wifiaccesspointavailable"), "");

                wifiAPCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifiaccesspointssid, getLang("wifiaccesspointssid"), ""));
                wifiAPCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifiappassword, getLang("wifiappassword"), ""));

                settingsUI.onPropertyCheckboxValueChange(wifiAPCheckbox, wifiAPCheckbox.driverProperty);

                settingsUI.addSpaceView(wifiPropPanel, "1");

                var wifiSTCheckbox = settingsUI.addPropertyCheckbox(wifiPropPanel, driver.wifiavailable, getLang("wifiavailable"), "");
                wifiSTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifissid, getLang("wifissid"), ""));
                wifiSTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifipassword, getLang("wifipassword"), ""));
                wifiSTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(wifiPropPanel, driver.wifiip, getLang("wifiip"), ""));

                settingsUI.onPropertyCheckboxValueChange(wifiSTCheckbox, wifiSTCheckbox.driverProperty);

                settingsUI.addPropertyView(wifiPropPanel, driver.wifirssi, getLang("wifirssi"), "dBm");


            }
            else
                if (driver.type.value == ESPDriverType) {

                    if (node.host == boardhost) { //the local node 


                        var driverProperty = {
                            parentid: boardhost,
                            name: "language",
                            type: "",
                            value: configProperties["language"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, driverProperty, getLang(driverProperty.name), "");

                        var driverProperty = {
                            parentid: boardhost,
                            name: "widgetssize",
                            type: "i",
                            value: configProperties["widgetssize"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, driverProperty, getLang(driverProperty.name), "");

                        var driverProperty = {
                            parentid: boardhost,
                            name: "speak",
                            type: "b",
                            value: configProperties["speak"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, driverProperty, getLang(driverProperty.name), "");

                        var driverProperty = {
                            parentid: boardhost,
                            name: "voice",
                            type: "i",
                            value: configProperties["voice"]
                        }
                        settingsUI.addPropertyEdit(systemPropPanel, driverProperty, getLang(driverProperty.name), "");

                    }

                    settingsUI.addPropertyView(systemPropPanel, driver.espfreesketchspace, getLang("espfreesketchspace"), "byte");
                    settingsUI.addPropertyView(systemPropPanel, driver.espfreeheap, getLang("espfreeheap"), "byte");
                    settingsUI.addPropertyView(systemPropPanel, driver.espcpufreqmhz, getLang("espcpufreqmhz"), "mHz");
                    settingsUI.addPropertyView(systemPropPanel, driver.espresetreason, getLang("espresetreason"));

                    settingsUI.addSpaceView(systemPropPanel, "4");
                    var resetButton = systemPropPanel.appendChild(document.createElement('input'));
                    resetButton.className = "btn btn-danger btn-sm";
                    resetButton.type = "button";
                    resetButton.setAttribute("data-toggle", "modal");
                    resetButton.setAttribute("data-target", "#resetModal");
                    resetButton.value = getLang("reset");
                    resetButton.driverHost = driver._host;
                    resetButton.onclick = settingsUI.modalResetClick;

                    // settingsUI.addPropertyView(updatePropPanel, driver.firmwareversion, getLang("firmwareversion"));
                    //  settingsUI.addPropertyView(updatePropPanel, driver.firmwarebuildnumber, getLang("firmwarebuildnumber"));


                }
                else
                    if (driver.type.value == NetworkDriverType) {
                        // document.title = driver.nodeid.value + " :: OWLOS"; //ToDo detect "local" node

                        var RESTfulPanel = settingsUI.getStatusWidget(node.nodenickname + "restfulStatus", "RESTful");
                        driver.restfulavailable.addValueListner(settingsUI.onRESTfulStatusChange, RESTfulPanel);
                        var node = config.getNodeByHost(driver._host);
                        node.addNetworkStatusListner(settingsUI.onRESTfulOnlineStatusChange, RESTfulPanel);

                        var MQTTPanel = settingsUI.getStatusWidget(node.nodenickname + "mqttStatus", "MQTT");
                        driver.mqttclientstate.addValueListner(settingsUI.onMQTTStatusChange, MQTTPanel);

                        var OTAPanel = settingsUI.getStatusWidget(node.nodenickname + "otaStatus", "OTA");
                        driver.otaavailable.addValueListner(settingsUI.onOTAStatusChange, OTAPanel);

                        var RESTfulCheckbox = settingsUI.addPropertyCheckbox(networkPropPanel1, driver.restfulavailable, getLang("restfulavailable"), "");
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.webserverlogin, getLang("webserverlogin"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.webserverpwd, getLang("webserverpwd"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.restfulserverport, getLang("restfulserverport"), ""));
                        settingsUI.addSpaceView(networkPropPanel1, "2");
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.restfulclienturl, getLang("restfulclienturl"), ""));
                        RESTfulCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel1, driver.restfulclientport, getLang("restfulclientport"), ""));
                        settingsUI.onPropertyCheckboxValueChange(RESTfulCheckbox, RESTfulCheckbox.driverProperty);

                        var MQTTCheckbox = settingsUI.addPropertyCheckbox(networkPropPanel2, driver.mqttavailable, getLang("mqttavailable"), "");
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqtturl, getLang("mqtturl"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttport, getLang("mqttport"), ""));
                        settingsUI.addSpaceView(networkPropPanel2, "3");
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttid, getLang("mqttid"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttlogin, getLang("mqttlogin"), ""));
                        MQTTCheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel2, driver.mqttpassword, getLang("mqttpassword"), ""));
                        settingsUI.onPropertyCheckboxValueChange(MQTTCheckbox, MQTTCheckbox.driverProperty);

                        var OTACheckbox = settingsUI.addPropertyCheckbox(networkPropPanel3, driver.otaavailable, getLang("otaavailable"), "");
                        OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, driver.otaid, getLang("otaid"), ""));
                        OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, driver.otaport, getLang("otaport"), ""));
                        OTACheckbox.dependetPanels.push(settingsUI.addPropertyEdit(networkPropPanel3, driver.otapassword, getLang("otapassword"), ""));
                        settingsUI.onPropertyCheckboxValueChange(OTACheckbox, OTACheckbox.driverProperty);

                        settingsUI.addPropertyView(updatePropPanel, driver.firmwareversion, getLang("firmwareversion"));
                        settingsUI.addPropertyView(updatePropPanel, driver.firmwarebuildnumber, getLang("firmwarebuildnumber"));

                        settingsUI.addSpaceView(updatePropPanel, "5");
                        settingsUI.addPropertyEdit(updatePropPanel, driver.updatehost, getLang("updatehost"), "");

                        //Update watcher panel 
                        //Панель обновлений
                        var updateWatcherId = node.nodenickname + "updateWatcher";
                        var updateWatcherDiv = document.getElementById(updateWatcherId);
                        if (updateWatcherDiv == null) {
                            updateWatcherDiv = updatePropPanel.appendChild(document.createElement('div'));
                            updateWatcherDiv.id = updateWatcherId;
                            updateWatcherDiv.className = "text-primary";
                            //one listner to two properties

                            var updateButtonHolder = updatePropPanel.appendChild(document.createElement('div'));
                            updateButtonHolder.className = "row";
                            var updateuiButton = updateButtonHolder.appendChild(document.createElement('input'));
                            updateuiButton.id = node.nodenickname + "updateuibutton";
                            updateuiButton.className = "btn btn-success btn-sm float-right";
                            updateuiButton.type = "button";
                            updateuiButton.setAttribute("data-toggle", "modal");
                            updateuiButton.setAttribute("data-target", "#resetModal");
                            updateuiButton.value = getLang("updateuibutton");
                            updateuiButton.node = node;
                            updateuiButton.onclick = settingsUI.modalUpdateUIClick;

                            var updatefirmwareButton = updateButtonHolder.appendChild(document.createElement('input'));
                            updatefirmwareButton.id = node.nodenickname + "updatefirmwarebutton";
                            updatefirmwareButton.className = "btn btn-success btn-sm float-right";
                            updatefirmwareButton.type = "button";
                            updatefirmwareButton.setAttribute("data-toggle", "modal");
                            updatefirmwareButton.setAttribute("data-target", "#resetModal");
                            updatefirmwareButton.value = getLang("updatefirmwarebutton");
                            updatefirmwareButton.node = node;
                            updatefirmwareButton.onclick = settingsUI.modalUpdateFirmwareClick;

                            updateuiButton.style.display = "none";
                            updatefirmwareButton.style.display = "none";

                            updateWatcherDiv.updateuiButton = updateuiButton; // document.getElementById("updateuibutton");
                            updateWatcherDiv.updatefirmwareButton = updatefirmwareButton;

                            driver.updateinfo.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                            driver.updatepossible.addValueListner(settingsUI.onUpdateInfoValueChange, updateWatcherDiv);
                        }
                        //}
                    }
        }
    },

    driverAnchorClick: function (event) {

        var aHref = event.currentTarget;


        $(aHref).removeClass('active');

        document.getElementById("sidebarText").style.display = "none";
        document.getElementById("sidebarText").innerText = "";
        document.getElementById("dashboardButtonsPanel").style.display = "none";

        //$(aHref).toggleClass("active");

        document.location = aHref.href;



        var node = aHref.node;
        if (node != undefined) {

            if (aHref.nodeStatusPanel == undefined) {
                aHref = document.getElementById(node.nodenickname + "ahref");
            }
            if (aHref.nodeStatusPanel != undefined) {
                var nodeStatusPanel = document.getElementById("nodeStatusPanel");
                if (nodeStatusPanel.currentStatusPanel != undefined) {
                    nodeStatusPanel.currentStatusPanel.style.display = "none";
                    nodeStatusPanel.currentStatusPanel.nodeStatusPanelText.style.display = "none";
                }
                nodeStatusPanel.currentStatusPanel = aHref.nodeStatusPanel;
                nodeStatusPanel.currentStatusPanel.style.display = "block";
                nodeStatusPanel.currentStatusPanel.nodeStatusPanelText.style.display = "block";
            }

        }

        //     if (aHref.getAttribute("aria-expanded") == "true") {
        //         document.documentElement.scrollTop = document.documentElement.scrollTop - event.clientY - event.currentTarget.offsetHeight;
        //     }


        return false;
    },


    addNodeClick: function (event) {

        event.stopPropagation();

        makeModalDialog("resetPanel", "addnode", getLang("addnodeheader"), "");
        var modalFooter = document.getElementById("addnodeModalFooter");
        var modalBody = document.getElementById("addnodeModalBody");

        formGroup = modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "hostEdit");
        label.innerText = getLang("addnodehost");
        var hostEdit = formGroup.appendChild(document.createElement('input'));
        hostEdit.className = "form-control form-control-sm";
        hostEdit.placeholder = "http://host:port/ or https://host:port/";
        hostEdit.id = "hostInput";

        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "nodenicknameEdit");
        label.innerText = getLang("addnodenickname");
        var nodenicknameEdit = formGroup.appendChild(document.createElement('input'));
        nodenicknameEdit.className = "form-control form-control-sm";
        nodenicknameEdit.id = "nodenicknameInput";
        nodenicknameEdit.placeholder = "room, kitchen, bathroom... ";

        var addNodeButton = modalFooter.appendChild(document.createElement("button"));
        addNodeButton.type = "button";
        addNodeButton.className = "btn btn-sm btn-success";
        addNodeButton.id = "addnodeModalButton";
        addNodeButton.onclick = settingsUI.addNodeUIClick;
        addNodeButton.innerText = getLang("addnodebutton");

        var addNodeError = formGroup.appendChild(document.createElement("label"));
        addNodeError.className = "text-danger";

        addNodeButton.hostEdit = hostEdit;
        addNodeButton.nodenicknameEdit = nodenicknameEdit;
        addNodeButton.addNodeError = addNodeError;

        $("#addnodeModal").modal('show');

        return false;
    },

    addNodeUIClick: function (event) {
        event.stopPropagation();

        var addNodeButton = event.currentTarget;
        var hostEdit = addNodeButton.hostEdit;
        var nodenicknameEdit = addNodeButton.nodenicknameEdit
        var addNodeError = addNodeButton.addNodeError;

        if (hostEdit.value.length == 0) {
            addNodeError.innerText = getLang("addnodeerror_hostempty");
            return false;
        }

        var regexp = RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})");

        if (!hostEdit.value.match(regexp)) {
            addNodeError.innerText = getLang("addnodeerror_hostnoturl");
            return false;
        }

        if (nodenicknameEdit.value.length == 0) {
            addNodeError.innerText = getLang("addnodeerror_nicknameempty");
            return false;
        }

        if (hostEdit.value.slice(-1) !== '/') {
            hostEdit.value += '/';
        }

        if (config.addNode(hostEdit.value, nodenicknameEdit.value)) {
            $("#addnodeModal").modal('hide');
        }
        else {
            addNodeError.innerText = getLang("addnodeerror_cantsaveconfig");
        }
        //else todo ERROR
        return false;
    },

    onNetworkChange: function (sender, node) {
        if (node.networkStatus == NET_ONLINE) {
            sender.className = "text-success";
        }
        else
            if ((node.networkStatus == NET_RECONNECT) || (node.networkStatus == NET_REFRESH)) {
                sender.className = "text-info";
            }
            else
                if (node.networkStatus == NET_OFFLINE) {
                    sender.className = "text-secondary";
                }
                else  //error
                    if (node.networkStatus == NET_ERROR) {
                        sender.className = "text-danger";
                    }
    },

    modalResetClick: function (event) {

        var driverHost = event.currentTarget.driverHost;

        makeModalDialog("resetPanel", "reset", getLang("resetnode"), getLang("areYouSure"));
        var modalFooter = document.getElementById("resetModalFooter");

        var resetButton = modalFooter.appendChild(document.createElement("button"));
        resetButton.type = "button";
        resetButton.className = "btn btn-sm btn-danger";
        resetButton.id = "resetModalButton";
        resetButton.nodeHost = driverHost;
        resetButton.onclick = settingsUI.resetClick;
        resetButton.innerText = getLang("reset");

        $("#resetModal").modal('show');

        return false;
    },

    modalUpdateUIClick: function (event) {

        var updateuiButton = event.currentTarget;
        var node = updateuiButton.node;

        makeModalDialog("resetPanel", "update", getLang("updatenode"), getLang("areYouSure"));
        var modalFooter = document.getElementById("updateModalFooter");

        var updateButton = modalFooter.appendChild(document.createElement("button"));
        updateButton.type = "button";
        updateButton.className = "btn btn-sm btn-success";
        updateButton.id = "updateModalButton";
        updateButton.onclick = settingsUI.updateUIClick;
        updateButton.node = node;
        updateButton.innerText = getLang("updateuibutton");

        $("#updateModal").modal('show');

        return false;
    },

    updateUIClick: function (event) {

        var updateButton = event.currentTarget;
        var node = updateButton.node;
        var modalFooter = document.getElementById("updateModalFooter");
        modalFooter.removeChild(event.currentTarget);

        var modalBody = document.getElementById("updateModalBody");
        modalBody.innerHTML = "";
        var updateLog = modalBody.appendChild(document.createElement("pre"));
        updateLog.innerHTML = "Update UI started, please wait...<br>";
        updateUIAsync(node.host);


        settingsUI.updateUILogTimer(node, updateLog);
        return false;
    },

    updateUILogTimer: function (node, updateLog) {
        "use strict";
        sleep(1000).then(function () {
            getUpdateLogAsyncWithReciever(node.host, settingsUI.updateUILogReciever, node, updateLog, undefined);
            return false;
        });

    },
    updateUILogReciever: function (HTTPResult, node, sender, upperSender) {
        if (!HTTPResult.indexOf("%error") == 0) {
            sender.innerHTML = "Update log:<br>" + HTTPResult;

            if (HTTPResult.indexOf("complete") == -1) {
                settingsUI.updateUILogTimer(node, sender);
            }
            else {
                var modalFooter = document.getElementById("updateModalFooter");
                var resetButton = modalFooter.appendChild(document.createElement("button"));
                resetButton.type = "button";
                resetButton.className = "btn btn-sm btn-danger";
                resetButton.id = "resetModalButton";
                resetButton.nodeHost = nodeHost;
                resetButton.onclick = SettingsIU.resetClick;
                resetButton.innerText = getLang("reset");
            }

        }
        else {
            sender.innerHTML += "HTTP client - " + HTTPResult;
        }
    },
    resetClick: function (event) {
        var resetButton = event.currentTarget;
        reset(resetButton.nodeHost);

        sleep(5000).then(function () {
            location.reload();
            return false;
        });

    },
    //--------------------------------------------------------------------------------------------------------------------
    modalUpdateFirmwareClick: function (event) {
        var updateButton = event.currentTarget;
        var node = updateButton.node;

        makeModalDialog("resetPanel", "firmware", getLang("firmware"), getLang("areYouSure"));
        var modalFooter = document.getElementById("firmwareModalFooter");

        var updateButton = modalFooter.appendChild(document.createElement("button"));
        updateButton.type = "button";
        updateButton.className = "btn btn-sm btn-success";
        updateButton.id = "firmwareModalButton";
        updateButton.onclick = settingsUI.updateFirmwareClick;
        updateButton.node = node;
        updateButton.innerText = getLang("firmwarebutton");

        $("#firmwareModal").modal('show');

        return false;
    },

    updateFirmwareClick: function (event) {
        var updateButton = event.currentTarget;
        var node = updateButton.node;

        var modalFooter = document.getElementById("firmwareModalFooter");
        modalFooter.removeChild(event.currentTarget);

        var modalBody = document.getElementById("firmwareModalBody");
        modalBody.innerHTML = "";
        var updateLog = modalBody.appendChild(document.createElement("div"));
        updateLog.innerHTML = getLang("updatefirmware");
        updateFirmwareAsync(node.host);
        getUpdateLogAsyncWithReciever(node.host, settingsUI.updateLogReciever, undefined, updateLog, undefined);

        "use strict";

        sleep(30000).then(function () {
            location.reload();
            return false;
        });

        /*
        sleep(30000).then(() => {
            location.reload();
            return false;
        });
        */
        return false;
    },

    updateLogReciever: function (HTTPResult, upperReciever, sender, upperSender) {
        if (!HTTPResult.indexOf("%error") == 0) {
            sender.innerHTML = "Update log:<br>" + HTTPResult;
        }
        else {
            sender.innerHTML += "HTTP client - " + HTTPResult;
        }
    },

    addCard: function (parentDiv, id, text, cellSize) {
        var cardPanel = parentDiv.appendChild(document.createElement('div'));
        cardPanel.id = id + "Panel";
        cardPanel.className = "col-md-" + cellSize;
        var card = cardPanel.appendChild(document.createElement('div'));
        card.className = "card text-white bg-primary mb-3";
        var header = card.appendChild(document.createElement('div'));
        header.className = "card-header";
        var headerText = header.appendChild(document.createElement('div'));
        headerText.innerHTML = text;
        var body = card.appendChild(document.createElement('div'));
        body.id = id + "Body"
        body.className = "card-body";
        return cardPanel;
    },

    addDiv: function (parentDiv, id, cellSize) {
        parentDiv.className = "card-body row";
        var divPanel = parentDiv.appendChild(document.createElement('div'));
        divPanel.id = id;
        divPanel.className = "col-md-" + cellSize;
        return divPanel;
    },


    //добавляет строку со названием и значением свойства на panelDiv, driverProperty - отображаемое свойство (подписывается на изменения свойства)
    //обычно используется для отображения свойств ноды Node/Properties в SideBar разделе Settings
    addPropertyView: function (panelDiv, driverProperty, text, sufix) {
        if (driverProperty == undefined) return;
        var propElementId = panelDiv.id + driverProperty.parentid + driverProperty.name; //дормируем уникальный ID элемента
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.id = propElementId;
            propTextDiv.className = "text-light";
            propTextDiv.propertyText = text;
            if (sufix == undefined) sufix = "";
            propTextDiv.propertySufix = sufix;
            //settingsUI.onPropertyViewedValueChange опрашивает значение указанного свойства и формирует HTML для propTextDiv 
            //смотрите onPropertyViewedValueChange - он работает в паре с этим методом
            driverProperty.addValueListner(settingsUI.onPropertyViewedValueChange, propTextDiv);
        }
        return propTextDiv;
    },
    //работает в паре с addPropertyView, "следит" за значением свойства
    onPropertyViewedValueChange: function (sender, driverProperty) {
        sender.innerHTML = "<strong>" + sender.propertyText + ":</strong> " + driverProperty.value + " " + sender.propertySufix + "<br>";
    },

    //добавляет редактор указаного свойства driverProperty на указанную панель panelDiv
    //работает так же как addPropertyView, но позволяет изменять значение свойства 
    addPropertyEdit: function (panelDiv, driverProperty, text, sufix) {
        if (driverProperty == undefined) return;
        var propElementId = panelDiv.id + driverProperty.parentid + driverProperty.name;
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.id = propElementId;
            propTextDiv.className = "text-light";
            propTextDiv.driverProperty = driverProperty;
            propTextDiv.propertyText = text;
            if (sufix == undefined) sufix = "";
            propTextDiv.propertySufix = sufix;

            inputGroup = propTextDiv.appendChild(document.createElement("div"));
            inputGroup.className = "input-group input-group-sm mb-3";

            var prependDiv = inputGroup.appendChild(document.createElement("div"));
            prependDiv.className = "input-group-prepend";

            propText = prependDiv.appendChild(document.createElement("label"));
            propText.className = "input-group-text";
            propText.setAttribute("for", propElementId + "edit");
            propTextDiv.propText = propText;

            var propEdit = createValueEdit(inputGroup, driverProperty.name, driverProperty.value, driverProperty.type)
            //var propEdit = inputGroup.appendChild(document.createElement('input'));
            propEdit.className = "form-control";
            propEdit.id = propElementId + "edit";

            propTextDiv.propEdit = propEdit;

            var appendDiv = inputGroup.appendChild(document.createElement("div"));
            appendDiv.className = "input-group-append";

            var propSetButton = appendDiv.appendChild(document.createElement("Button"));
            propSetButton.type = "button";
            propSetButton.className = "btn btn-outline-success btn-sm";
            propSetButton.innerText = getLang("set");
            propSetButton.onclick = settingsUI.propSetButtonClick;
            propSetButton.propTextDiv = propTextDiv;
            propTextDiv.propSetButton = propSetButton;

            if (driverProperty.addValueListner != undefined) {
                driverProperty.addValueListner(settingsUI.onPropertyEditedValueChange, propTextDiv);
                driverProperty.addNetworkStatusListner(settingsUI.onPropertyEditNetworkChange, propTextDiv);
            }
            else {
                propText.innerText = text;
                propEdit.value = driverProperty.value;
            }
        }
        return propTextDiv;
    },
    //работает в паре с addPropertyEdit
    onPropertyEditedValueChange: function (sender, driverProperty) {
        sender.propText.innerText = sender.propertyText;
        sender.propEdit.value = driverProperty.value;
        //+ driverProperty.value + " " + sender.propertySufix + "<br>";
    },

    onPropertyEditNetworkChange: function (sender, driverProperty) {

        if (driverProperty.networkStatus == NET_ONLINE) {
            sender.propEdit.disabled = false;

            sender.propSetButton.className = "btn btn-outline-success btn-sm";
        } else if (driverProperty.networkStatus == NET_RECONNECT) {
            sender.propEdit.disabled = true;
            sender.propSetButton.className = "btn btn-outline-info btn-sm";
        } else if (driverProperty.networkStatus == NET_OFFLINE) {
            sender.propEdit.disabled = true;
            sender.propSetButton.className = "btn btn-outline-secondary btn-sm";
        } else //error
            if (driverProperty.networkStatus == NET_ERROR) {
                sender.propEdit.disabled = true;
                sender.propSetButton.className = "btn btn-outline-danger btn-sm";
            }

    },

    propSetButtonClick: function (event) {
        event.stopPropagation();
        var propSetButton = event.currentTarget; //вытаскиваем "кликнутую" кнопку из event 
        var propTextDiv = propSetButton.propTextDiv; //вытаскиваем панель со свойством
        var driverProperty = propTextDiv.driverProperty; //вытастиваем свойство драйвера

        if (driverProperty.addValueListner != undefined) {

            if (driverProperty.networkStatus != NET_RECONNECT) {
                //если свойство драйвера не в статуре "в реботе" - асинхронность это хорошо, но переполнять очередь это преступление

                var value = propTextDiv.propEdit.value; //получаем значение свойства драйвера введенное пользователем

                if (driverProperty.type.indexOf("b") != -1) // boolean - представлен в виде combobox а не редактора 
                {
                    if (propTextDiv.propEdit.selectedIndex == 0) value = "1"; //для драйвера 1 - true, 0 - false
                    else value = "0";
                } //вызываем метод свойства драйвера для начала процедуры изменения этого свойства с новым значением value
                //не назначаем вторичных получателей undefined, undefined - все получатели уже подписаны ранее

                driverProperty.setValue(value, undefined, undefined);
            }
        }
        else {
            var result = false;

            propTextDiv.propEdit.disabled = true;
            propTextDiv.propSetButton.className = "btn btn-outline-info btn-sm";

            try {
                configProperties[driverProperty.name] = propTextDiv.propEdit.value;
                config.save();

                propTextDiv.propEdit.disabled = false;
                propTextDiv.propSetButton.className = "btn btn-outline-success btn-sm";

                result = true;

            } catch (exception) {
                console.error(exception);
                addToLogNL("ERROR save value: " + exception, 2);
            }

            if (!result) {
                propTextDiv.propEdit.disabled = true;
                propTextDiv.propSetButton.className = "btn btn-outline-danger btn-sm";
            }
        }

        return false;
    },

    //добавляет флажек связанный с указаным свойствам (свойство обезательно Boolean)
    //работает так же как addPropertyEdit
    addPropertyCheckbox: function (panelDiv, driverProperty, text, sufix) {
        if (driverProperty == undefined) return;
        var propElementId = panelDiv.id + driverProperty.parentid + driverProperty.name;
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.className = "input-group input-group-sm mb-3";
            propTextDiv.id = propElementId;
            propTextDiv.driverProperty = driverProperty;
            propTextDiv.propertyText = text;
            propTextDiv.dependetPanels = [];
            if (sufix == undefined) sufix = "";
            propTextDiv.propertySufix = sufix;

            // var propFormCheck = propTextDiv.appendChild(document.createElement("form-check"));
            // propFormCheck.className = "form-check";


            var propCheckbox = propTextDiv.appendChild(document.createElement('input'));
            propCheckbox.id = propElementId + "checkbox";
            propCheckbox.className = "checkbox";
            propCheckbox.type = "checkbox";
            propCheckbox.value = "";
            propCheckbox.checked = "";
            propCheckbox.onchange = settingsUI.onPropertyCheckboxChange;

            propText = propTextDiv.appendChild(document.createElement("label"));
            propText.className = "form-check-label";
            propText.setAttribute("for", propElementId + "checkbox");
            propTextDiv.propText = propText;

            propCheckbox.propTextDiv = propTextDiv;
            propTextDiv.propCheckbox = propCheckbox;

            driverProperty.addValueListner(settingsUI.onPropertyCheckboxValueChange, propTextDiv);
            driverProperty.addNetworkStatusListner(settingsUI.onPropertyCheckboxNetworkChange, propTextDiv);


        }
        return propTextDiv;
    },
    //работает в паре с addPropertyCheckbox
    onPropertyCheckboxValueChange: function (sender, driverProperty) {
        sender.propText.innerHTML = "&nbsp;" + sender.propertyText;
        if (driverProperty.value === '1') {
            sender.propCheckbox.checked = true;
        }
        else {
            sender.propCheckbox.checked = false;
        }

        if (sender.dependetPanels != undefined) {
            for (var i = 0; i < sender.dependetPanels.length; i++) {
                if (driverProperty.value === '1') {
                    sender.dependetPanels[i].propText.disabled =
                        sender.dependetPanels[i].propEdit.disabled =
                        sender.dependetPanels[i].propSetButton.disabled = false;
                }
                else {
                    sender.dependetPanels[i].propText.disabled =
                        sender.dependetPanels[i].propEdit.disabled =
                        sender.dependetPanels[i].propSetButton.disabled = true;
                }
            }
        }
    },

    onPropertyCheckboxNetworkChange: function (sender, driverProperty) {

        if (driverProperty.networkStatus == NET_ONLINE) {
            sender.propCheckbox.disabled = false;
            sender.propText.disabled = false;
        } else if (driverProperty.networkStatus == NET_RECONNECT) {
            sender.propCheckbox.disabled = true;
            sender.propText.disabled = true;
        } else if (driverProperty.networkStatus == NET_OFFLINE) {
            sender.propCheckbox.disabled = true;
            sender.propText.disabled = true;
        } else //error
            if (driverProperty.networkStatus == NET_ERROR) {
                sender.propCheckbox.disabled = true;
                sender.propText.disabled = true;
            }


    },


    onPropertyCheckboxChange: function (event) {
        event.stopPropagation();
        var propCheckbox = event.currentTarget;

        makeModalDialog("resetPanel", "checkboxchange", getLang("checkchangedialog"), getLang("areYouSure"));


        var closeHeaderButton = document.getElementById("checkboxchangecloseHeaderButton");
        var closeButton = document.getElementById("checkboxchangecloseButton");
        closeHeaderButton.propCheckbox = closeButton.propCheckbox = propCheckbox;
        closeHeaderButton.onclick = closeButton.onclick = settingsUI.checkboxRollBack;

        var modalFooter = document.getElementById("checkboxchangeModalFooter");
        var checkChengButton = modalFooter.appendChild(document.createElement("button"));
        checkChengButton.type = "button";
        checkChengButton.className = "btn btn-sm btn-danger";
        checkChengButton.id = "changecheckboxModalButton";
        checkChengButton.propCheckbox = propCheckbox;
        checkChengButton.onclick = settingsUI.applyCheckboxChangeClick;
        checkChengButton.innerText = getLang("applycheck");

        $("#checkboxchangeModal").modal('show');

        return false;

    },

    applyCheckboxChangeClick: function (event) {
        event.stopPropagation();
        var checkChengButton = event.currentTarget;
        var propCheckbox = checkChengButton.propCheckbox;
        var propTextDiv = propCheckbox.propTextDiv;
        var driverProperty = propTextDiv.driverProperty;
        var propTextDiv = propCheckbox.propTextDiv;
        var driverProperty = propTextDiv.driverProperty;

        if (driverProperty.networkStatus != NET_RECONNECT) {
            if (propCheckbox.checked) {
                driverProperty.setValue("1", undefined, undefined);
            }
            else {
                driverProperty.setValue("0", undefined, undefined);
            }
        }
        $("#checkboxchangeModal").modal('hide');
        return false;
    },

    checkboxRollBack: function (event) {
        //non ecent.stopPropagation();
        var closeButton = event.currentTarget;
        var propCheckbox = closeButton.propCheckbox;
        propCheckbox.checked = !propCheckbox.checked;
        return false;
    },


    //добавляет разделитель (пустое пространства) между свойствами для панели свойств
    addSpaceView: function (panelDiv, number) {
        var propElementId = panelDiv.id + number;
        var propTextDiv = document.getElementById(propElementId);
        if (propTextDiv == null) {
            propTextDiv = panelDiv.appendChild(document.createElement('div'));
            propTextDiv.id = propElementId;
            propTextDiv.className = "text-primary";
            propTextDiv.innerHTML = "<br>";

        }
    },

    getStatusWidget: function (id, text, nodeStatusPanel) {
        var selectedStatus = document.getElementById(id);
        if (selectedStatus == null) {
            if (nodeStatusPanel == undefined) return undefined;
            selectedStatus = nodeStatusPanel.appendChild(document.createElement('span'));
            selectedStatus.style.cursor = "pointer";
            selectedStatus.className = "badge badge-secondary";
            selectedStatus.setAttribute("data-toggle", "popover");
            selectedStatus.setAttribute("data-container", "body");
            selectedStatus.setAttribute("data-placement", "bottom");
            selectedStatus.id = id;
            selectedStatus.innerText = text;

        }
        return selectedStatus;
    },


    onUpdateInfoValueChange: function (sender, driverProperty) { //means esp.updateinfo property

        var networkDriver = drivers.getDriverById("network", driverProperty.parenthost);
        //var espDriver = drivers.getDriverById("esp", driverProperty.parenthost);

        var updateInfo = networkDriver.updateinfo.value.split(";");
        if (updateInfo.length < 3) {
            sender.innerHTML = "<strong class='text-light'>" + getLang("updateinfo") + ":</strong> " + getLang("noupdateinfo") + "<br>";
        }
        else {
            var firmware = updateInfo[0].split(":")[1];
            var updateBuildVersion = parseInt(updateInfo[1].split(":")[1]);
            var innerHTML = "<div class='text-light'><strong class='text-light'>" + getLang("updateinfo") + ":</strong> " + firmware + " [<b class='text-warning'>" + getLang("firmwarebuildnumber") + ": </b>" + updateBuildVersion + "]</div><br>";
            var buildVersion = parseInt(networkDriver.firmwarebuildnumber.value);
            if (buildVersion < updateBuildVersion) {
                innerHTML += "<strong class='text-success'>" + getLang("updateexists") + "</strong> - ";
            }
            else {
                innerHTML += "<strong class='text-light'>" + getLang("updatenosense") + "</strong> - ";
            }

            updateuibutton = sender.updateuiButton; // document.getElementById("updateuibutton");
            updatefirmwarebutton = sender.updatefirmwareButton; // document.getElementById("updatefirmwarebutton");

            if (parseInt(networkDriver.updatepossible.value) < 1) {
                //hide buttons
                if (updateuibutton != undefined) {
                    updateuibutton.style.display = "none";
                    updatefirmwarebutton.style.display = "none";
                }
                innerHTML += "<strong class='text-warning'>" + getLang("updateunpossible") + "</strong>";
            }
            else {
                //Show update buttons
                if (parseInt(networkDriver.updatepossible.value) < 2) {
                    if (updateuibutton != undefined) {
                        updateuibutton.style.display = "block";
                        if (buildVersion < updateBuildVersion) {
                            updateuibutton.className = "btn btn-success btn-sm float-sm-right";
                            innerHTML += "<strong class='text-success'>" + getLang("updateuipossible") + "</strong>";
                        }
                        else {
                            updateuibutton.className = "btn btn-default btn-sm float-sm-right";
                            innerHTML += "<strong class='text-secondary'>" + getLang("downdateuipossible") + "</strong>";
                        }

                    }

                }
                else {
                    if (updateuibutton != undefined) {
                        updateuibutton.style.display = "block";
                        updatefirmwarebutton.style.display = "block";

                        if (buildVersion < updateBuildVersion) {
                            updateuibutton.className = "btn btn-success btn-sm float-sm-right";
                            updatefirmwarebutton.className = "btn btn-success btn-sm float-sm-right";
                            innerHTML += "<strong class='text-success'>" + getLang("updatepossible") + "</strong>";
                        }
                        else {
                            updateuibutton.className = "btn btn-default btn-sm float-sm-right";
                            updatefirmwarebutton.className = "btn btn-default btn-sm float-sm-right";
                            innerHTML += "<strong class='text-secondary'>" + getLang("downdateuipossible") + "</strong>";
                        }

                    }

                }
            }
            sender.innerHTML = innerHTML;
        }
    },

    onOnlineStatusChange: function (sender, drivers) {
        var onlineStatus = getLang("netonline");
        if (drivers.networkStatus == NET_ONLINE) {
            sender.className = "badge badge-success";

        }
        else
            if (drivers.networkStatus == NET_REFRESH) {
                sender.className = "badge badge-info";
                onlineStatus = getLang("netrefresh");
            }
            else { //Error or Offline is danger
                sender.className = "badge badge-danger";
                onlineStatus = getLang("netoffline");
            }

        sender.setAttribute("data-original-title", getLang("network"));
        sender.setAttribute("data-content", getLang("connectionstatus") + onlineStatus);
        $('[data-toggle="popover"]').popover();
    },


    onWiFiAPStatusChange: function (sender, driverProperty) {
        if (driverProperty.value == 1) {
            sender.className = "badge badge-success";

        }
        else {
            sender.className = "badge badge-secondary";
        }
    },

    onWiFiSTStatusChange: function (sender, driverProperty) {
        var wifiSTconection = getLang("nostate");
        sender.className = "badge badge-secondary";

        switch (parseInt(driverProperty.value)) {
            case 0:
                wifiSTconection = getLang("idlestatus");
                sender.className = "badge badge-warning";
                break;
            case 1:
                wifiSTconection = getLang("nossidavailable");
                sender.className = "badge badge-danger";
                break;
            case 2:
                wifiSTconection = getLang("scancompleted");
                sender.className = "badge badge-warning";
                break;
            case 3:
                wifiSTconection = getLang("connected");
                sender.className = "badge badge-success";
                break;
            case 4:
                wifiSTconection = getLang("connectfailed");
                sender.className = "badge badge-danger";
                break;
            case 5:
                wifiSTconection = getLang("connectionlost");
                sender.className = "badge badge-danger";
                break;
            case 6:
                wifiSTconection = getLang("disconnected");
                sender.className = "badge badge-secondary";
                break;
            default:
                break;
        }

        sender.setAttribute("data-original-title", "WiFi Station");
        sender.setAttribute("data-content", getLang("connectionstatus") + wifiSTconection);
        $('[data-toggle="popover"]').popover();
    },

    onRESTfulStatusChange: function (sender, driverProperty) {
        if (driverProperty.value == 1) {
            sender.className = "badge badge-success";

        }
        else {
            sender.className = "badge badge-secondary";
        }
    },

    onRESTfulOnlineStatusChange: function (sender, drivers) {
        var onlineStatus = getLang("netonline");
        if (drivers.networkStatus == NET_ONLINE) {
            sender.className = "badge badge-success";
        }
        else
            if (drivers.networkStatus == NET_ERROR) {
                sender.className = "badge badge-danger";
            }
            else
                if (drivers.networkStatus == NET_OFFLINE) {

                    sender.className = "badge badge-secondary";
                }
    },

    onMQTTStatusChange: function (sender, driverProperty) {

        sender.className = "badge badge-secondary";
        mqttState = getLang("nostate");

        switch (parseInt(driverProperty.value)) {
            case -5:
                sender.className = "badge badge-warning";
                mqttState = getLang("debugmode");
                break;

            case -4:
                sender.className = "badge badge-danger";
                mqttState = getLang("connectiontimeout");
                break;

            case -3:
                sender.className = "badge badge-danger";
                mqttState = getLang("connectionlost");
                break;

            case -2:
                sender.className = "badge badge-danger";
                mqttState = getLang("connectfailed");
                break;

            case -1:
                sender.className = "badge badge-secondary";
                mqttState = getLang("disconnected");
                break;

            case 0:
                sender.className = "badge badge-success";
                mqttState = getLang("connected");
                break;

            case 1:
                sender.className = "badge badge-danger";
                mqttState = getLang("badprotocol");
                break;

            case 2:
                sender.className = "badge badge-danger";
                mqttState = getLang("badclientid");
                break;

            case 3:
                sender.className = "badge badge-secondary";
                mqttState = getLang("unavailable");
                break;

            case 4:
                sender.className = "badge badge-danger";
                mqttState = getLang("badcredentials");
                break;

            case 5:
                sender.className = "badge badge-danger";
                mqttState = getLang("unauthorized");
                break;

            default:
                break;

        }
        sender.setAttribute("data-original-title", "MQTT");
        sender.setAttribute("data-content", getLang("connectionstatus") + mqttState);
        $('[data-toggle="popover"]').popover();
    },

    onOTAStatusChange: function (sender, driverProperty) {
        if (driverProperty.value == 1) {
            sender.className = "badge badge-success";
        }
        else {
            sender.className = "badge badge-secondary";
        }
    },

    addDriverClick: function (event) {        
            event.stopPropagation();
            settingsUI.driverAnchorClick(event);
            var addDriverAhref = event.currentTarget;
            driversUI.addDriver(addDriverAhref.node);
    }

}
﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var RadialWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(RadialWidget, _BaseWidget);

        function RadialWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        RadialWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget._properties.linewidth =
                {
                    tab: "G",
                    value: 10,
                    type: "i"
                };

            widget._properties.rangetype =
                {
                    tab: "G",
                    value: 'true',
                    type: "b"
                };

            widget._properties.min =
                {
                    tab: "G",
                    value: 0,
                    type: "f"
                };

            widget._properties.max =
                {
                    tab: "G",
                    value: 100,
                    type: "f"
                };

            widget._properties.percentbackgroundcolor =
                {
                    tab: "C",
                    value: theme.secondary,
                    type: "c"
                };

            widget._properties.percentbackgroundopacity =
                {
                    tab: "O",
                    value: 0.5,
                    type: "f"
                };

            widget._properties.percentcolor =
                {
                    tab: "C",
                    value: theme.success,
                    type: "c"
                };

            widget.radius = widget.size / 3;
            widget.topMargin = widget.centreY + widget.size / 10;
            widget.SVGArcBack = new SVGArc(widget.SVGViewBox, widget.id + "arcback", widget.centreX, widget.topMargin, widget.radius, widget._properties.linewidth);
            widget.SVGArcWidget = new SVGArc(widget.SVGViewBox, widget.id + "arcwidget", widget.centreX, widget.topMargin, widget.radius, widget._properties.linewidth);
            widget.SVGArcSpinner.y = widget.topMargin;

            widget.clickableToTop();

            widget.proprties = widget._properties;

            widget.doOnLoad();
        }



        RadialWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

            if (this.SVGArcBack == undefined) return;

            var _data = this.data;
            if (this._properties.rangetype.value !== 'true') { //когда randge
                var range = this._properties.max.value - this._properties.min.value;
                _data = this.data / (range / 100);
            }
            else {
                //TODO Error Write Ситуация когда проценты
                if ((_data > 100) || (_data < 0)) {
                    this.toColor(this.SVGArcWidget, theme.warning);
                }
            }

            var oneHangPercent = 360 + 90 + 30 - 240;
            var drawPercent = _data * (oneHangPercent / 100); //back radial widget

            this.SVGArcBack.linewidth = this._properties.linewidth.value;
            this.SVGArcWidget.linewidth = this._properties.linewidth.value;

            this.SVGArcBack.color = this._properties.percentbackgroundcolor.value;
            this.SVGArcBack.opacity = this._properties.percentbackgroundopacity.value;

            this.SVGArcBack.draw(240, 240 + oneHangPercent); //radial widget

            this.SVGArcWidget.draw(240, 240 + drawPercent);

            switch (this._networkStatus) {
                case NET_ONLINE:
                    this.toColor(this.SVGArcWidget, this._properties.percentcolor.value);
                    break;

                case NET_ERROR:
                    this.toColor(this.SVGArcWidget, theme.danger);
                    break;

                case NET_RECONNECT:
                    this.toColor(this.SVGArcWidget, theme.info);
                    break;

                default:
                    //offline
                    this.toColor(this.SVGArcWidget, theme.light);
                    break;
            }
        };

        return RadialWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var SmokeWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(SmokeWidget, _BaseWidget);

        function SmokeWidget(parentPanel, id, size) {

            return _BaseWidget.call(this, parentPanel, id, size) || this;          
        }

        SmokeWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 30;
            widget.topMargin = widget.centreY + widget.size / 15;
            widget.animated = false;
            widget.levelRectWidth = widget.size / 15;
            widget.levelRectHeight = widget.size / 100;
            widget.levelLeft = widget.width - widget.levelRectWidth + widget.halfPanding;
            widget.levelTop = (widget.height - widget.levelRectHeight * 60 / 2) / 3;
            widget.level1 = [];
            widget.level2 = [];

            for (var i = 0; i < 10; i++) {
                widget.SVGLevelRect1 = new SVGRect(widget.SVGViewBox, widget.id + "levelrect1" + i, widget.levelLeft, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect2 = new SVGRect(widget.SVGViewBox, widget.id + "levelrect2" + i, widget.panding, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect1.opacity = widget.SVGLevelRect2.opacity = i / 30;
                widget.SVGLevelRect1.fill = widget.SVGLevelRect2.fill = theme.danger;

                widget.level1.push(widget.SVGLevelRect1);

                widget.level2.push(widget.SVGLevelRect2);
            }

            for (var i = 10; i < 20; i++) {
                widget.SVGLevelRect1 = new SVGRect(widget.SVGViewBox, widget.id + "levelrect" + i, widget.levelLeft, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect2 = new SVGRect(widget.SVGViewBox, widget.id + "levelrect2" + i, widget.panding, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect1.opacity = widget.SVGLevelRect2.opacity = i / 30;
                widget.SVGLevelRect1.fill = widget.SVGLevelRect2.fill = theme.warning;

                widget.level1.push(widget.SVGLevelRect1);

                widget.level2.push(widget.SVGLevelRect2);
            }

            for (var i = 20; i < 30; i++) {
                widget.SVGLevelRect1 = new SVGRect(widget.SVGViewBox, widget.id + "levelrect" + i, widget.levelLeft, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect2 = new SVGRect(widget.SVGViewBox, widget.id + "levelrect2" + i, widget.panding, widget.levelTop + i * (widget.levelRectHeight * 2), widget.levelRectWidth, widget.levelRectHeight);
                widget.SVGLevelRect1.opacity = widget.SVGLevelRect2.opacity = i / 30;
                widget.SVGLevelRect1.fill = widget.SVGLevelRect2.fill = theme.success;

                widget.level1.push(widget.SVGLevelRect1);

                widget.level2.push(widget.SVGLevelRect2);
            }

            widget.levelArc = [];

            for (var i = 1; i < 5; i++) {
                var SVGlevelArc = new SVGArc(widget.SVGViewBox, widget.id + "arcback1" + i, widget.centreX, widget.levelTop, i * widget.radius, widget.size / 34);
                SVGlevelArc.index = i;
                SVGlevelArc.fill = theme.danger;

                widget.levelArc.push(SVGlevelArc);
            }

            widget.SVGArcSpinner.y = widget.topMargin;

            widget.clickableToTop();

            widget.proprties = widget._properties;

            widget.doOnLoad();
        };
        
        SmokeWidget.prototype.refresh = function refresh(data, widgetText, label) {
            widgetText = getLang(widgetText);

            _BaseWidget.prototype.refresh.call(this, data, widgetText, label);
        };

        SmokeWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
        };

        SmokeWidget.prototype.animate = function animate() {
            var baseWidget2 = this;

            if (this.animated) {
                for (var i = 0; i < 4; i++) {
                    this.levelArc[i].radius += 1.5;
                    this.levelArc[i].opacity -= 0.01;

                    if (this.levelArc[i].radius > this.radius * 15) {
                        this.levelArc[i].radius = this.radius;
                        this.levelArc[i].opacity = 0.9;
                    }

                    this.levelArc[i].draw(90 + 60, 270 - 60);
                }

                requestAnimationFrame(function () {
                    return baseWidget2.animate();
                });
            }
        };

        SmokeWidget.prototype.drawWidget = function drawWidget() {
            var baseWidget3 = this;
            if (this.level1 == undefined) return;
            _BaseWidget.prototype.drawWidget.call(this);

            for (var i = 0; i < 30; i++) {
                this.level1[i].opacity = this.level2[i].opacity = 0.0;
            }

            var position = 30 / 100 * this._data;

            if (position > 30) {
                position = 30;
            }

            for (var i = 29; i > 30 - position; i--) {
                this.level1[i].opacity = this.level2[i].opacity = 1.2 - i / 30;
            }

            if (this._networkStatus == NET_ONLINE && this._data > 60) {
                if (!this.animated) {
                    this.animated = true;
                    requestAnimationFrame(function () {
                        return baseWidget3.animate();
                    });
                }
            } else {
                this.animated = false;

                for (var i = 0; i < 4; i++) {
                    this.levelArc[i].hide();
                }
            }
        };

        return SmokeWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StepperWidget =
    
    function () {
        "use strict";

        function StepperWidget(parentPanel, id, size) {
            this.parentPanel = parentPanel;
            this.id = id;
            this.size = size;
            this.networkStatus = NET_ONLINE;
            this.widgetWidht = this.size / 10;
            this.radius = this.size / 2 - this.widgetWidht;
            this.alphaValue = "80";
            this.widgetHolder = this.parentPanel.appendChild(document.createElement("div"));
            this.widgetHolder.id = id + "StepperWidget";
            this.widgetHolder.stepperWidget = this;
            this.widgetHolder.className = "ActuatorWidget";
            this.widgetHolder.style.cursor = "pointer";
            this.sPandingTop = this.size / 4;
            this.sPandingLeft = this.size / 7;
            this.sWidth = this.size - this.sPandingLeft * 2;
            this.sHeight = this.size - this.size / 10 - this.sPandingTop;
            this.userMovePosition = false;
            this.atProcess = false;
            this.positionChangeReciever = null;
            this.rCanvas = $("<canvas></canvas>").attr({
                width: size,
                height: size
            }).get(0), this.rContext = this.rCanvas.getContext("2d");

            var _rCanvas = $(this.widgetHolder).children("canvas");

            if (_rCanvas.length !== 0) {
                _rCanvas.replaceWith(this.rCanvas);
            } else {
                $(this.rCanvas).appendTo($(this.widgetHolder));
            }

            this.rCanvas.onmousemove = this.mousemove;
            this.rCanvas.stepperWidget = this;
        }

        var _proto = StepperWidget.prototype;

        _proto.mousemove = function mousemove(event) {
            event.stopPropagation();
            var stepperWidget = event.currentTarget.stepperWidget;

            if (stepperWidget.atProcess) {
                stepperWidget.atProcess = false;
                return true; //OR cancel operation todo 
            }

            if (event.buttons == 1) {
                if (event.offsetY > stepperWidget.sPandingTop && event.offsetY < stepperWidget.sPandingTop + stepperWidget.sHeight) {
                    var lenght = event.offsetY - stepperWidget.sPandingTop;
                    var toPercent = lenght / (stepperWidget.sHeight / 100);
                    stepperWidget.userMovePosition = true;
                    stepperWidget.refresh(stepperWidget.percent, toPercent, stepperWidget.widgetText, stepperWidget.text);
                    return true;
                }
            }

            if (stepperWidget.userMovePosition) {
                if (stepperWidget.positionChangeReciever != null) {
                    stepperWidget.userMovePosition = false;
                    stepperWidget.positionChangeReciever(stepperWidget.toPercent);
                }
            }

            stepperWidget.userMovePosition = false;
            stepperWidget.refresh(stepperWidget.percent, stepperWidget.toPercent, stepperWidget.widgetText, stepperWidget.text);
            return false;
        };

        _proto.refresh = function refresh(percent, toPercent, widgetText, text) {
            text = getLang(text); //if ((this.percent == percent) && (this.toPercent == toPercent) && (this.widgetText == widgetText) && (this.text == text)) return;

            this.percent = Math.round(percent);
            this.toPercent = Math.round(toPercent);
            this.widgetText = widgetText;
            this.text = text;
            this.spinnerAngle = 0;
            this.redrawAll();
        };

        //---------------------------------------------------------------------------------------
        _proto.redrawAll = function redrawAll() {
            var _this = this;

            this.starttime = 0;
            requestAnimationFrame(function () {
                return _this.drawWidget();
            });
            this.drawText();
        } //---------------------------------------------------------------------------------------
            //draw element text labels - percent value and text 
            ;

        _proto.drawText = function drawText() {
            //draw pervent text ----------
            var elementWidth = 0;
            var elementHeight = 0;
            /*
            if (this.widgetElement == null) {
                this.widgetElement = this.widgetHolder.appendChild(document.createElement("h4"));            
                this.widgetElement.firstTime = true;
            }
            
            switch (this.networkStatus) {
                case NET_ONLINE: this.widgetElement.className = "ActuatorWidgetPercent text-success"; break;
                case NET_ERROR: this.widgetElement.className = "ActuatorWidgetPercent text-danger"; break;
                case NET_RECONNECT: this.widgetElement.className = "ActuatorWidgetPercent text-info"; break;
                default: //offline
                    this.widgetElement.className = "ActuatorWidgetPercent text-secondary"; break;
            }
             this.widgetElement.innerHTML = this.widgetText;
            // this.widgetElement.innerHTML = "";
             if (this.widgetElement.firstTime) {
                var elementWidth = this.widgetElement.getBoundingClientRect().width;
                 if (elementWidth < this.size) {
                    this.widgetElement.style.fontSize = (this.size / 2) / elementWidth + "rem";
                }
                 elementWidth = this.widgetElement.getBoundingClientRect().width;
                this.widgetElement.style.marginLeft = this.size / 2 - elementWidth / 2 + "px";
                 var elementHeight = this.widgetElement.getBoundingClientRect().height;
                this.widgetElement.style.marginTop = - (elementHeight / 2.0 + this.size / 2.0) + "px";
                 this.widgetElement.firstTime = false;
            }
            */
            //draw text label --------------

            if (this.textElement == null) {
                this.textElement = this.widgetHolder.appendChild(document.createElement("div"));
                this.textElement.firstTime = true;
            }

            switch (this.networkStatus) {
                case NET_ONLINE:
                    this.textElement.className = "ActuatorWidgetText text-white text-center";
                    break;

                case NET_ERROR:
                    this.textElement.className = "ActuatorWidgetText text-danger text-center";
                    break;

                case NET_RECONNECT:
                    this.textElement.className = "ActuatorWidgetText text-info text-center";
                    break;

                default:
                    //offline
                    this.textElement.className = "ActuatorWidgetText text-secondary text-center";
                    break;
            }

            if (this.textElement.firstTime) {
                this.textElement.innerHTML = "WWWWWW"; //8 chars

                elementWidth = this.textElement.getBoundingClientRect().width;

                if (elementWidth < this.size) {
                    this.textElement.style.fontSize = this.size / 2 / elementWidth + "rem";
                }
            }

            this.textElement.innerHTML = this.text;

            if (this.textElement.firstTime) {
                elementWidth = this.textElement.getBoundingClientRect().width;
                this.textElement.style.marginLeft = this.size / 2 - elementWidth / 2 + "px";
                this.textElement.firstTime = false;
            } //draw hint --------------


            if (this.hintElement == null) {
                this.hintElement = this.widgetHolder.appendChild(document.createElement("div"));
                this.hintElement.firstTime = true;
            }

            switch (this.networkStatus) {
                case NET_ONLINE:
                    this.hintElement.className = "ActuatorWidgetHint text-secondary text-center";
                    break;

                case NET_ERROR:
                    this.hintElement.className = "ActuatorWidgetHint text-danger text-center";
                    break;

                case NET_RECONNECT:
                    this.hintElement.className = "ActuatorWidgetHint text-info text-center";
                    break;

                default:
                    //offline
                    this.hintElement.className = "ActuatorWidgetHint text-secondary text-center";
                    break;
            }

            if (this.hintElement.firstTime) {
                this.hintElement.innerHTML = "WWWWW"; //4 chars

                elementWidth = this.hintElement.getBoundingClientRect().width;

                if (elementWidth < this.size) {
                    this.hintElement.style.fontSize = this.size / 2 / elementWidth + "rem";
                }
            }

            switch (this.networkStatus) {
                case NET_ONLINE:
                    this.hintElement.innerHTML = getLang("rid_online");
                    break;

                case NET_ERROR:
                    this.hintElement.innerHTML = getLang("rid_error");
                    break;

                case NET_RECONNECT:
                    this.hintElement.innerHTML = getLang("rid_connect");
                    break;

                default:
                    //offline
                    this.hintElement.innerHTML = this.hintElement.innerHTML = getLang("rid_offline");
                    break;
            } //  if (this.hintElement.firstTime) {


            elementWidth = this.hintElement.getBoundingClientRect().width;
            this.hintElement.style.marginLeft = this.size / 2 - elementWidth / 2 + "px";
            this.hintElement.firstTime = false; //   }
        };

        _proto.drawWidget = function drawWidget() {
            var _this2 = this;

            this.rContext.save();
            this.rContext.clearRect(0, 0, this.rCanvas.width, this.rCanvas.height);
            this.rContext.imageSmoothingEnabled = false; //    

            var radius = 25;
            var panding = 5;
            var width = this.size - panding;
            var height = this.size - panding; //background --------------------------------------------------------------------------------

            this.rContext.beginPath();
            this.rContext.rect(panding, height, width, height + panding);
            this.rContext.fillStyle = theme.danger;

            switch (this.networkStatus) {
                case NET_ONLINE:
                    this.rContext.fillStyle = theme.success;
                    break;

                case NET_ERROR:
                    this.rContext.fillStyle = theme.danger;
                    break;

                case NET_RECONNECT:
                    this.rContext.fillStyle = theme.info + this.alphaValue;
                    break;

                default:
                    //offline
                    this.rContext.fillStyle = theme.secondary;
                    break;
            }

            this.rContext.closePath();
            this.rContext.fill();
            this.rContext.beginPath();
            this.rContext.rect(panding, panding, width, height);
            this.rContext.fillStyle = theme.secondary + "10";
            this.rContext.closePath();
            this.rContext.fill(); //end off background -----------------------------------------------------------------------

            this.rContext.lineCap = "";
            this.rContext.lineWidth = 1;
            var pixPercent = this.sHeight / 100 * this.percent;
            var pixToPercent = this.sHeight / 100 * this.toPercent; //inside fill (window)

            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop, this.sWidth, this.sHeight);
            this.rContext.fillStyle = theme.info + this.alphaValue;
            this.rContext.closePath();
            this.rContext.fill(); //current position - percent

            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop, this.sWidth, pixPercent);
            this.rContext.fillStyle = theme.secondary;
            this.rContext.closePath();
            this.rContext.fill(); //end of 
            //draw stepper possition line ----------------------------------------------------

            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop + pixPercent, this.sWidth, 2);
            this.rContext.fillStyle = theme.info;
            this.rContext.closePath();
            this.rContext.fill(); //draw stepper TO possition line ----------------------------------------------------

            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop + pixToPercent, this.sWidth, 2);

            if (this.userMovePosition) {
                this.rContext.fillStyle = theme.danger;
            } else {
                this.rContext.fillStyle = theme.success;
            }

            this.rContext.closePath();
            this.rContext.fill(); //--------------------------------------------------------------------
            //draw stepper to Position pointers

            this.rContext.beginPath();
            var triagleSize = this.size / 25; //left

            this.rContext.moveTo(this.sPandingLeft, this.sPandingTop + pixToPercent);
            this.rContext.lineTo(this.sPandingLeft - triagleSize, this.sPandingTop + pixToPercent + triagleSize);
            this.rContext.lineTo(this.sPandingLeft - triagleSize, this.sPandingTop + pixToPercent - triagleSize); //right

            this.rContext.moveTo(this.sPandingLeft + this.sWidth, this.sPandingTop + pixToPercent);
            this.rContext.lineTo(this.sPandingLeft + this.sWidth + triagleSize, this.sPandingTop + pixToPercent + triagleSize);
            this.rContext.lineTo(this.sPandingLeft + this.sWidth + triagleSize, this.sPandingTop + pixToPercent - triagleSize);

            if (this.userMovePosition) {
                this.rContext.fillStyle = theme.danger;
            } else {
                this.rContext.fillStyle = theme.success;
            }

            this.rContext.closePath();
            this.rContext.fill(); //draw rows        

            var tenPercent = this.sHeight / 100 * 10;

            for (var i = tenPercent; i < this.sHeight; i += tenPercent) {
                this.rContext.beginPath();
                this.rContext.moveTo(this.sPandingLeft, this.sPandingTop + i);
                this.rContext.lineTo(this.sPandingLeft + 5, this.sPandingTop + i);
                this.rContext.moveTo(this.sPandingLeft + this.sWidth, this.sPandingTop + i);
                this.rContext.lineTo(this.sPandingLeft + this.sWidth - 5, this.sPandingTop + i);
                this.rContext.strokeStyle = theme.light + this.alphaValue;
                this.rContext.stroke();
                this.rContext.closePath();
            } //border 


            this.rContext.beginPath();
            this.rContext.rect(this.sPandingLeft, this.sPandingTop, this.sWidth, this.sHeight);
            this.rContext.strokeStyle = theme.light + this.alphaValue;
            this.rContext.stroke();
            this.rContext.closePath();
            this.rContext.restore(); //text -----------------------------------------------------------

            this.rContext.save();
            this.rContext.beginPath();
            this.rContext.font = "400 50px " + theme.fontFamily.toString();
            this.rContext.textAlign = 'center';
            this.rContext.fillStyle = theme.success;
            this.rContext.shadowBlur = 1;
            this.rContext.shadowColor = this.rContext.fillStyle;
            this.rContext.shadowOffsetX = 0;
            this.rContext.shadowOffsetY = 0;
            this.rContext.fillText("90%", this.size / 2, this.size / 2, 100);
            this.rContext.closePath();
            this.rContext.restore(); //spinner   ---------------

            if (this.networkStatus == NET_RECONNECT) {
                var x = this.rCanvas.width / 2;
                var y = this.rCanvas.height / 2 + this.size / 22;
                this.spinnerAngle += 0.05;
                var counterClockwise = false;
                this.rContext.beginPath();
                this.rContext.lineWidth = this.widgetWidht / 3;
                this.rContext.arc(x, y, this.radius - this.widgetWidht - this.size / 15, this.spinnerAngle, this.spinnerAngle + Math.PI, counterClockwise);
                this.rContext.strokeStyle = theme.info + 40;
                this.rContext.stroke();
                this.rContext.closePath();
                requestAnimationFrame(function () {
                    return _this2.drawWidget();
                });
            }
        };

        _createClass(StepperWidget, [{
            key: "_newtorkStatus",
            get: function get() {
                return this.networkStatus;
            }
        }, {
            key: "_networkStatus",
            set: function set(networkStatus) {
                if (networkStatus >= NET_OFFLINE && networkStatus <= NET_RECONNECT) {
                    this.networkStatus = networkStatus;
                    this.redrawAll();
                }
            }
        }, {
            key: "_percent",
            get: function get() {
                return this.percent;
            },
            set: function set(percent) {
                if (percent >= 0 && percent <= 100) {
                    this.percent = percent;
                    this.redrawAll();
                }
            }
        }]);

        return StepperWidget;
    }();﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var TemperatureWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(TemperatureWidget, _BaseWidget);

        function TemperatureWidget(parentPanel, id, size) {
            
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        TemperatureWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.tempWidth = (widget.width - widget.panding * 2) / 20;
            widget.tempHeight = widget.height / 15;
            widget.tempTop = widget.height / 4.5 - widget.tempHeight / 2;
            widget.tempItem = [];

            widget.SVGWidgetExtText = new SVGText(widget.SVGViewBox, widget.id + "widgetexttext", widget.size / 160);
            widget.SVGWidgetExtText.color = theme.secondary;


            for (var i = 0; i < 20; i++) {
                var svgRect = new SVGRect(widget.SVGViewBox, widget.id + "tempItem" + i, widget.panding + widget.tempWidth * i, widget.tempTop, widget.tempWidth - 2, widget.tempHeight);
                if (i < 7) {
                    svgRect.fill = theme.info;

                }
                else {
                    if (i < 14) {
                        svgRect.fill = theme.warning;
                    }
                    else {
                        svgRect.fill = theme.danger;
                    }
                }

                svgRect.opacity = 0.0;

                widget.tempItem.push(svgRect);
            }

            widget.tempIndexWidth = (widget.width - widget.panding * 3) / 80;
            widget.tempIndexHeight = widget.height / 7;
            widget.tempIndexTop = widget.height / 3.5 - widget.tempIndexHeight / 2;


            widget.clickableToTop();

            widget.proprties = widget._properties;

            widget.doOnLoad();

        }


        TemperatureWidget.prototype.drawText = function drawText() {
            var baseWidget = _BaseWidget.prototype;
            if (this.SVGWidgetExtText == undefined) return;

            var tempwidgetText = this.widgetText;
            this.widgetText = " C"; //two space width
            baseWidget.drawText.call(this, 0);
            var charW = this.SVGWidgetText.width;
            this.widgetText = tempwidgetText;

            this.SVGWidgetText.text = tempwidgetText + " C"; //ToDo F

            if (this.SVGWidgetText.width != 0) {
                this.SVGWidgetExtText.text = "o";
                this.SVGWidgetText.x = this.centreX - this.SVGWidgetText.width / 2;
                this.SVGWidgetText.y = this.centreY + this.SVGWidgetText.height / 2;
                this.SVGWidgetExtText.x = this.SVGWidgetText.x + this.SVGWidgetText.width - charW - this.SVGWidgetExtText.width / 2;
                this.SVGWidgetExtText.y = this.centreY + this.SVGWidgetExtText.height / 5;

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.toColor(this.SVGWidgetExtText, theme.light);
                        break;
                    case NET_ERROR:
                        this.toColor(this.SVGWidgetExtText, theme.danger);
                        break;
                    case NET_RECONNECT:
                        this.toColor(this.SVGWidgetExtText, theme.info);
                        break;
                    default:                        
                        this.toColor(this.SVGWidgetExtText, theme.secondary);
                        break;
                }
            }
                else {
                this.SVGWidgetExtText.text = "";
            }
          
        };

        TemperatureWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);
            if (this.tempItem == undefined) return;
            var percent = parseFloat(this._data) + 50;
            var tempSize = 20 / 100 * percent;

            for (var i = 0; i < 20; i++) {
                this.tempItem[i].opacity = 0.1;
            }

            for (var i = 0; i < tempSize; i++) {
                this.tempItem[i].opacity = 1.0 - (1.0 - i / 20);
            }

           // this.svgTempIndex.x = this.panding + tempSize * this.tempWidth * 2;
        };

        return TemperatureWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/


var GraphWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(GraphWidget, _BaseWidget);

        function GraphWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        }

        GraphWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.widgetHolder.className = "col-6 col-sm-4 col-lg-2";
            // widget.widgetHolder.removeChild(widget.SVGViewBox);


            widget.topMargin = widget.size / 20; //this.panding = 5;

            widget.width = widget.size * 2;
            widget.height = widget.size;
            widget.centreX = widget.width / 2; //  this.centreY = this.height / 2;

            
            widget.widgetTextSize = widget.size / 110;
            widget.graphWidth = widget.width - widget.panding;
            widget.graphHeight = widget.height - widget.size / 3.4;
            widget.graphTop = widget.size / 3.7;

            widget.SVGViewBox.setAttributeNS(null, "viewBox", "0 0 " + widget.width + " " + widget.height);

            //  widget.SVGViewBox.setAttributeNS(null, "width", widget.width);
            //  widget.SVGViewBox.setAttributeNS(null, "height", widget.height);

            widget.SVGBackgroundPanel.drawRoundedRect(widget.width - 5, widget.height - 6, 5, 10, true, true, true, true);
            widget.SVGBackdownpanel.drawRoundedRect(widget.width - 5, 10, 5, 0, false, false, true, true);
            widget.SVGHeaderPanel.drawRoundedRect(widget.width, 26, 5, 0, true, true, false, false);

            //   widget.SVGBackdownpanel.y += 3;


            widget._properties.lineColor = { tab: "Graph", value: theme.success, type: "c" };
            widget._properties.lineOpacity = { tab: "Graph", value: 0.5, type: "f" };

            widget._properties.backOpacity = { tab: "Graph", value: 0.4, type: "f" };

            widget._properties.gradient1Color = { tab: "Graph", value: theme.success, type: "c" };
            widget._properties.gradient1Opacity = { tab: "Graph", value: 0.7, type: "f" };
            widget._properties.gradient1Offset = { tab: "Graph", value: 0, type: "i" };

            widget._properties.gradient2Color = { tab: "Graph", value: theme.success, type: "c" };
            widget._properties.gradient2Opacity = { tab: "Graph", value: 0.4, type: "f" };
            widget._properties.gradient2Offset = { tab: "Graph", value: 60, type: "i" };

            widget._properties.gradient3Color = { tab: "Graph", value: theme.success, type: "c" };
            widget._properties.gradient3Opacity = { tab: "Graph", value: 0.2, type: "f" };
            widget._properties.gradient3Offset = { tab: "Graph", value: 80, type: "i" };
            
            widget.SVGBackdownpanel.width = widget.width;            
            widget.stop1 = document.createElementNS(xmlns, 'stop');
            widget.stop2 = document.createElementNS(xmlns, 'stop');
            widget.stop2.setAttribute('class', 'stop2');
            widget.stop3 = document.createElementNS(xmlns, 'stop');
            widget.stop3.setAttribute('class', 'stop3');

            widget.gradient = document.createElementNS(xmlns, 'linearGradient');
            widget.gradient.id = widget.id + 'GraphGradient';
            widget.gradient.setAttribute('x1', '0');
            widget.gradient.setAttribute('x2', '0');
            widget.gradient.setAttribute('y1', '0');
            widget.gradient.setAttribute('y2', '1');
            widget.gradient.appendChild(widget.stop1);
            widget.gradient.appendChild(widget.stop2);
            widget.gradient.appendChild(widget.stop3);


            widget.SVGViewBox.appendChild(widget.gradient);

            widget.SVGPath1 = new SVGArc(widget.SVGViewBox, widget.id + "path1", widget.graphTop + " " + widget.halfPanding + " " + widget.graphWidth + " " + widget.graphHeight);
            widget.SVGPath1.fill = 'url(#' + widget.id + 'GraphGradient)';
            
            widget.SVGPath2 = new SVGArc(widget.SVGViewBox, widget.id + "path2", widget.graphTop + " " + widget.halfPanding + " " + widget.graphWidth + " " + widget.graphHeight);
            widget.SVGHeaderText.text = "Graph";
            widget.widgetLeft = widget.centreX - widget.textWidth / 2;
            widget.widgetTop = widget.centreY + widget.SVGHeaderText.height - widget.textHeight * 4 / 2;
            var labelTextSize = widget.size / 210;
            widget.SVGTopLabel = new SVGText(widget.SVGViewBox, widget.id + "toplabel", labelTextSize);
            widget.SVGTopLabel.color = theme.secondary;
            widget.SVGMiddleLabel = new SVGText(widget.SVGViewBox, widget.id + "toplabel", labelTextSize);
            widget.SVGMiddleLabel.color = theme.secondary;
            widget.SVGDownLabel = new SVGText(widget.SVGViewBox, widget.id + "toplabel", labelTextSize);
            widget.SVGDownLabel.color = theme.secondary;
            widget.SVGTopLabel.x = widget.SVGMiddleLabel.x = widget.SVGDownLabel.x = widget.width / 40;
            widget.SVGTopLine = new SVGRect(widget.SVGViewBox, widget.id + "topline", widget.width / 48, 0, widget.graphWidth, 1);
            widget.SVGTopLine.opacity = 0.1;
            widget.SVGTopLine.color = theme.secondary;
            widget.SVGMiddleLine = new SVGRect(widget.SVGViewBox, widget.id + "middlieline", widget.width / 48, 0, widget.graphWidth, 1);
            widget.SVGMiddleLine.opacity = 0.1;
            widget.SVGMiddleLine.color = theme.secondary;
            widget.SVGDownLine = new SVGRect(widget.SVGViewBox, widget.id + "downline", widget.width / 48, 0, widget.graphWidth, 1);
            widget.SVGDownLine.opacity = 0.1;
            widget.SVGDownLine.color = theme.secondary;


            /*
            if (icon != undefined) {
                widget.SVGIcon = new SVGIcon(widget.SVGViewBox, icon, widget.width - widget.size / 6, widget.size / 24, widget.size / 8, widget.size / 8);
            } else {
                widget.SVGIcon = new SVGIcon(widget.SVGViewBox, addIcon, widget.width - widget.size / 6, widget.size / 24, widget.size / 8, widget.size / 8);
            }
            */
            widget.SVGIcon = new SVGIcon(widget.SVGViewBox, addIcon, widget.width - widget.size / 6, widget.size / 24, widget.size / 8, widget.size / 8);

            widget.SVGIcon.fill = theme.secondary;

            widget.SVGWidgetText.hide();

            widget.SVGArcSpinner.x = widget.centreX;
            widget.ShowEqualizer = false;
            widget.SVGRightIcon.x = widget.width - widget.rowSize; //  this.SVGPlusIcon.x = this.width / 2 - this.rowSize / 2;
            widget.SVGPropertiesIcon.x = widget.width / 2 - widget.rowSize / 2;
            widget.SVGDeleteIcon.x = widget.width - widget.rowSize + widget.size / 55;


            //   widget.widgetHolder.appendChild(widget.SVGViewBox);

            widget.clickableToTop();
            widget.proprties = widget._properties;
            widget.resize(widget.width);

            widget.doOnLoad();
        };

        GraphWidget.prototype.resize = function resize(size) {
            this.size = size;
            this.SVGViewBox.setAttributeNS(null, "width", size);
            this.SVGViewBox.setAttributeNS(null, "height", size / 2);

        };

        //  var GraphWidget.prototype = GraphWidget.prototype;

        GraphWidget.prototype.refresh = function refresh(widgetText, label, historyData) {
            label = getLang(label);
            this.widgetText = widgetText;
            this.label = label;
            this.historyData = historyData;
            this.spinnerAngle = 0;
            this.redrawAll();
        };

        GraphWidget.prototype.drawText = function drawText() {
            _BaseWidget.prototype.drawText.call(this);
        };

        GraphWidget.prototype.drawWidget = function drawWidget() {
            if (this.graphWidth == undefined) {
                return;
            }
            if (this.historyData != undefined) {

                
                this.stop1.setAttribute('stop-color', this.properties.gradient1Color.value);
                this.stop1.setAttribute('stop-opacity', this.properties.gradient1Opacity.value);
                this.stop1.setAttribute('offset', this.properties.gradient1Offset.value + '%');

                this.stop2.setAttribute('stop-color', this.properties.gradient2Color.value);
                this.stop2.setAttribute('stop-opacity', this.properties.gradient2Opacity.value);
                this.stop2.setAttribute('offset', this.properties.gradient2Offset.value + '%');

                this.stop3.setAttribute('stop-color', ' ' + this.properties.gradient3Color.value);
                this.stop3.setAttribute('stop-opacity', this.properties.gradient3Opacity.value);
                this.stop3.setAttribute('offset', this.properties.gradient3Offset.value + '%');                

                //reset 
                var updatedFilteredData = this.historyDataFilter(this.graphWidth, this.historyData, 1, 1); //It is important to draw Y lalues at first and curve after!!!

                this.grawYValuesPoints(this.SVGTopLabel, this.SVGMiddleLabel, this.SVGDownLabel, updatedFilteredData);
                var d = this.curveForDrawing(updatedFilteredData, this.graphHeight, this.graphTop, this.panding);

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.SVGPath1.opacity = this._properties.backOpacity.value;
                        this.SVGPath2.opacity = this._properties.lineOpacity.value;
                        this.toColor(this.SVGPath2, this._properties.lineColor.value);
                        this.toColor(this.SVGTopLabel, theme.secondary);
                        this.toColor(this.SVGMiddleLabel, theme.secondary);
                        this.toColor(this.SVGDownLabel, theme.secondary);
                        this.SVGIcon.fill = this._properties.backOpacity.value;
                        break;

                    case NET_ERROR:
                        this.SVGPath1.opacity = 0.0;
                        this.toColor(this.SVGPath2, theme.danger);
                        this.toColor(this.SVGTopLabel, theme.danger);
                        this.toColor(this.SVGMiddleLabel, theme.danger);
                        this.toColor(this.SVGDownLabel, theme.danger);
                        this.SVGIcon.fill = theme.danger;
                        break;

                    case NET_RECONNECT:
                        this.SVGPath1.opacity = 0.0;
                        this.toColor(this.SVGPath2, theme.info);
                        this.toColor(this.SVGTopLabel, theme.info);
                        this.toColor(this.SVGMiddleLabel, theme.info);
                        this.toColor(this.SVGDownLabel, theme.info);
                        this.SVGIcon.fill = theme.info;
                        break;

                    default:
                        //offline
                        this.SVGPath1.opacity = 0.0;
                        this.toColor(this.SVGPath2, theme.secondary);
                        this.toColor(this.SVGTopLabel, theme.secondary);
                        this.toColor(this.SVGMiddleLabel, theme.secondary);
                        this.toColor(this.SVGDownLabel, theme.secondary);
                        this.SVGIcon.fill = theme.secondary;
                        break;
                }

                this.SVGTopLabel.y = this.SVGTopLine.y = this.graphTop;
                this.SVGTopLine.x = this.SVGTopLabel.x + this.SVGTopLabel.width;
                this.SVGMiddleLabel.y = this.SVGMiddleLine.y = this.graphTop + this.graphHeight / 2;
                this.SVGMiddleLine.x = this.SVGMiddleLabel.x + this.SVGMiddleLabel.width;
                this.SVGDownLabel.y = this.SVGDownLine.y = this.graphTop + this.graphHeight - this.size / 100;
                this.SVGDownLine.x = this.SVGDownLabel.x + this.SVGDownLabel.width;
                this.SVGPath1.drawPath(d);
                this.SVGPath2.drawPath(d);

                _BaseWidget.prototype.drawWidget.call(this);
            }
        };

        GraphWidget.prototype.isIntegerNumber = function isIntegerNumber(num) {
            return (num ^ 0) === num;
        }

        GraphWidget.prototype.grawYValuesPoints = function grawYValuesPoints(topLable, middleLable, downLable, filteredArrayForDrawY) {
            var maxValueY;
            var minValueY;

            for (var gLocal = 0; gLocal < filteredArrayForDrawY.length; gLocal++) {
                var valueYLocal = parseFloat(filteredArrayForDrawY[gLocal]);

                if (maxValueY == undefined || valueYLocal > maxValueY) {
                    maxValueY = valueYLocal;
                }

                if (minValueY == undefined || valueYLocal < minValueY) {
                    minValueY = valueYLocal;
                }
            }

            var middleValueY;

            if (minValueY == maxValueY) {
                minValueY -= minValueY * 0.1;
                maxValueY += maxValueY * 0.1;
                middleValueY = minValueY + (maxValueY - minValueY) / 2;
            } else {
                middleValueY = (maxValueY - minValueY) / 2;
                maxValueY += middleValueY;
                minValueY -= middleValueY;
                middleValueY = minValueY + (maxValueY - minValueY) / 2;
            }

            if (!this.isIntegerNumber(maxValueY) || !this.isIntegerNumber(middleValueY) || !this.isIntegerNumber(minValueY)) {
                maxValueY = maxValueY.toFixed(2);
                minValueY = minValueY.toFixed(2);
                middleValueY = middleValueY.toFixed(2);
            }

            topLable.text = maxValueY;
            middleLable.text = middleValueY;
            downLable.text = minValueY;
        }

        GraphWidget.prototype._trunc = function _trunc(x) {
            if (isNaN(x)) {
                return NaN;
            }
            if (x > 0) {
                return Math.floor(x);
            }
            return Math.ceil(x);
        }

        GraphWidget.prototype.grawXValues = function grawXValues(parentPanel, id, graphPlotWidth, graphPlotHight, graphTopY, startXpoint, historyDataArr, lastPointTimeMiliseconds, timeUnitInMinutes, zoomInOut, shiftLeftRight) {
            var maxPointsX = 3 * (this._trunc((graphPlotWidth - 20) / 30) + 1);
            var splitHistoryDataXArray = historyDataArr.split(";");
            var historyDataXCount = splitHistoryDataXArray.length - 1;
            var xPointsArray;

            if (maxPointsX >= historyDataXCount) {
                xPointsArray = new Array(historyDataXCount);

                for (var ix = 0; ix < xPointsArray.length; ix++) {
                    xPointsArray[ix] = lastPointTimeMiliseconds - timeUnitInMinutes * 1000 * 60 * (xPointsArray.length - 1 - ix);
                }
            } else {
                xPointsArray = new Array(maxPointsX);
                var historyDataXZeroPosition = 0; //checking if history data has more then 1440 elements

                if (historyDataXCount > 1440) {
                    historyDataXZeroPosition = historyDataXCount - 1440;
                }

                var dayHistoryXLength = historyDataXCount - historyDataXZeroPosition;
                var historyDataXFilterStep = _trunc(dayHistoryXLength / xPointsArray.length);
                var deltaTime = dayHistoryXLength - historyDataXFilterStep * xPointsArray.length;

                if (deltaTime <= 0) {
                    for (var ixp = 0; ixp < xPointsArray.length; ixp++) {
                        xPointsArray[ixp] = lastPointTimeMiliseconds - 1000 * 60 * timeUnitInMinutes * historyDataXFilterStep * (xPointsArray.length - (ixp + 1));
                    }
                } else {
                    for (var ixpd = 0; ixpd < xPointsArray.length; ixpd++) {
                        xPointsArray[ixpd] = lastPointTimeMiliseconds - 1000 * 60 * timeUnitInMinutes * (deltaTime + historyDataXFilterStep * (xPointsArray.length - (ixpd + 1)));
                    }
                }
            }

            var startXValue = new Date(xPointsArray[0]);
            var SVGTTextXValue = new SVGText(parentPanel, id + "startXValue", graphPlotHight / 255);
            SVGTTextXValue.x = startXpoint;
            SVGTTextXValue.y = graphTopY + graphPlotHight + 10;
            SVGTTextXValue.text = startXValue.getHours() + ":" + startXValue.getMinutes();
            var nextXTestPosition = startXpoint + SVGTTextXValue.getTextWidth();
            var finishXValue = new Date(xPointsArray[xPointsArray.length - 1]);
            var SVGTTextXFinishValue = new SVGText(parentPanel, id + "finishXValue", graphPlotHight / 255);
            SVGTTextXFinishValue.x = startXpoint + _trunc(graphPlotWidth / xPointsArray.length) * (xPointsArray.length - 1) - 20;
            SVGTTextXFinishValue.y = graphTopY + graphPlotHight + 10;
            SVGTTextXFinishValue.text = finishXValue.getHours() + ":" + finishXValue.getMinutes();
        }

        GraphWidget.prototype.curveForDrawing = function curveForDrawing(filteredDataArray, graphPlotHight, graphTopY, graphStartX) {
            var maxLocalValue;
            var minLocalValue; //Find max and min value

            for (var mLocal = 0; mLocal < filteredDataArray.length; mLocal++) {
                var valueLocal = parseFloat(filteredDataArray[mLocal]);

                if (maxLocalValue == undefined || valueLocal > maxLocalValue) {
                    maxLocalValue = valueLocal;
                }

                if (minLocalValue == undefined || valueLocal < minLocalValue) {
                    minLocalValue = valueLocal;
                }
            }

            var stepLocal = 10;
            var halfStepLocal = stepLocal / 3; //If min == max then we decrease small value and increase big value by 10%

            if (maxLocalValue == minLocalValue) {
                maxLocalValue += maxLocalValue * 0.1;
                minLocalValue -= minLocalValue * 0.1;
            } else {
                var middleLocalValue = (maxLocalValue - minLocalValue) / 2;
                maxLocalValue += middleLocalValue;
                minLocalValue -= middleLocalValue;
            }

            var proportionLocal = graphPlotHight / (maxLocalValue - minLocalValue); //normalize Y

            for (var lLocal = 0; lLocal < filteredDataArray.length; lLocal++) {
                filteredDataArray[lLocal] = parseFloat(graphTopY + (graphPlotHight - (filteredDataArray[lLocal] - minLocalValue) * proportionLocal));
            }

            var topOffsetLocal = parseFloat(graphPlotHight + graphTopY);
            var dLocal = "M " + graphStartX + ", " + topOffsetLocal;

            for (var nLocal = 0; nLocal < filteredDataArray.length; nLocal++) {
                if (nLocal == 0) {
                    dLocal += " C " + graphStartX + ", " + filteredDataArray[nLocal] + " " + graphStartX + ", " + topOffsetLocal + " " + graphStartX + ", " + filteredDataArray[nLocal] + " ";
                } else {
                    var s1 = parseFloat(graphStartX + nLocal * stepLocal - halfStepLocal * 2);
                    var s2 = parseFloat(graphStartX + nLocal * stepLocal - halfStepLocal);
                    var s3 = parseFloat(graphStartX + nLocal * stepLocal);
                    dLocal += " C " + s1 + ", " + filteredDataArray[nLocal - 1] + " " + s2 + ", " + filteredDataArray[nLocal] + " " + s3 + ", " + filteredDataArray[nLocal] + " ";
                }
            }

            dLocal += " C " + parseFloat(graphStartX + stepLocal * (filteredDataArray.length - 1)) + "," + topOffsetLocal + " " + parseFloat(graphStartX + stepLocal * (filteredDataArray.length - 1)) + "," + topOffsetLocal + " " + parseFloat(graphStartX + stepLocal * (filteredDataArray.length - 1)) + "," + topOffsetLocal + " ";
            return dLocal;
        }

        GraphWidget.prototype.historyDataFilter = function historyDataFilter(historyDataGraphPlotWidth, historyDataAsString, zoomInOut, shiftLeftRight) {
            var maxPossiblePlotPoints = 3 * (this._trunc((historyDataGraphPlotWidth - 20) / 30) + 1);
            var splitHistoryDataFromString = historyDataAsString.split(";");
            var historyDataLength = splitHistoryDataFromString.length - 1;
            var filteredHistoryDataArray;

            if (maxPossiblePlotPoints >= historyDataLength) {
                filteredHistoryDataArray = new Array(historyDataLength);

                for (var hdi = 0; hdi < filteredHistoryDataArray.length; hdi++) {
                    filteredHistoryDataArray[hdi] = splitHistoryDataFromString[hdi];
                }
            } else {
                var filteredHistoryDataArrayLength = 3 * this._trunc(maxPossiblePlotPoints / 3);
                filteredHistoryDataArray = new Array(filteredHistoryDataArrayLength);
                var filterStep = this._trunc(3 * historyDataLength / filteredHistoryDataArray.length);
                var historyDataStartPosition = historyDataLength - filteredHistoryDataArray.length * filterStep / 3; //fill the filltered array from last element to first.It is nessary to save last (more fresh) history datas

                for (var hdj = 0; hdj < filteredHistoryDataArray.length / 3; hdj++) {
                    var localBigValue;
                    var localSmallValue;
                    var localMiddleValue;
                    var localBigValueIndex;
                    var localSmallValueIndex;
                    var localMiddleValueIndex;
                    var localDeltaValue;

                    for (var hdjj = 0; hdjj < filterStep; hdjj++) {
                        var currentValue = parseFloat(splitHistoryDataFromString[historyDataStartPosition + filterStep * hdj + hdjj]);

                        if (localBigValue == null || localBigValue == undefined || currentValue > localBigValue) {
                            localBigValue = currentValue;
                            localBigValueIndex = historyDataStartPosition + filterStep * hdj + hdjj;
                        }

                        if (localSmallValue == null || localSmallValue == undefined || currentValue < localSmallValue) {
                            localSmallValue = currentValue;
                            localSmallValueIndex = historyDataStartPosition + filterStep * hdj + hdjj;
                        }

                        if (hdjj == 0) {
                            localMiddleValue = currentValue;
                        } else {
                            localMiddleValue += currentValue;
                        }
                    } // if small value = max value => middle = (small+max)/2;


                    if (localSmallValue == localBigValue) {
                        localMiddleValue = (localSmallValue + localBigValue) / 2;
                        filteredHistoryDataArray[3 * hdj] = localSmallValue;
                        filteredHistoryDataArray[3 * hdj + 1] = localMiddleValue;
                        filteredHistoryDataArray[3 * hdj + 2] = localBigValue;
                    } else {
                        //Calculate the local middle value as arithmetical mean
                        localMiddleValue = localMiddleValue / filterStep; //find the local MiddleValue index

                        for (var jt = 0; jt < filterStep; jt++) {
                            var currentValueForFindIndex = parseFloat(splitHistoryDataFromString[historyDataStartPosition + filterStep * hdj + jt]);

                            if (localDeltaValue == null || localDeltaValue == undefined || Math.abs(localMiddleValue - currentValueForFindIndex) < localDeltaValue) {
                                localDeltaValue = Math.abs(localMiddleValue - currentValueForFindIndex);
                                localMiddleValueIndex = historyDataStartPosition + filterStep * hdj + jt;
                            }
                        } //Odering local max, min and middle value by their indexes


                        if (localSmallValueIndex < localBigValueIndex) {
                            if (localSmallValueIndex < localMiddleValueIndex) {
                                filteredHistoryDataArray[3 * hdj] = localSmallValue;

                                if (localMiddleValueIndex < localBigValueIndex) {
                                    filteredHistoryDataArray[3 * hdj + 1] = localMiddleValue;
                                    filteredHistoryDataArray[3 * hdj + 2] = localBigValue;
                                } else {
                                    filteredHistoryDataArray[3 * hdj + 1] = localBigValue;
                                    filteredHistoryDataArray[3 * hdj + 2] = localMiddleValue;
                                }
                            } else {
                                filteredHistoryDataArray[3 * hdj] = localMiddleValue;
                                filteredHistoryDataArray[3 * hdj + 1] = localSmallValue;
                                filteredHistoryDataArray[3 * hdj + 2] = localBigValue;
                            }
                        } else {
                            if (localBigValueIndex > localMiddleValueIndex) {
                                filteredHistoryDataArray[3 * hdj] = localMiddleValue;
                                filteredHistoryDataArray[3 * hdj + 1] = localBigValue;
                                filteredHistoryDataArray[3 * hdj + 2] = localSmallValue;
                            } else {
                                filteredHistoryDataArray[3 * hdj] = localBigValue;

                                if (localMiddleValueIndex < localSmallValueIndex) {
                                    filteredHistoryDataArray[3 * hdj + 1] = localMiddleValue;
                                    filteredHistoryDataArray[3 * hdj + 2] = localSmallValue;
                                } else {
                                    filteredHistoryDataArray[3 * hdj + 1] = localSmallValue;
                                    filteredHistoryDataArray[3 * hdj + 2] = localMiddleValue;
                                }
                            }
                        }
                    } //Clear the local values for next filtered set


                    localBigValue = null;
                    localSmallValue = null;
                    localMiddleValue = null;
                    localBigValueIndex = null;
                    localSmallValueIndex = null;
                    localMiddleValueIndex = null;
                    localDeltaValue = null;
                }
            }

            return filteredHistoryDataArray;
        }

        return GraphWidget;
    }(BaseWidget);

﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var TableWidget =
    
    function () {
        "use strict";

        function TableWidget(nodePropAnchors, nodesPropsPanel, driver, size) {
            //панели в UI для рендеринга таблиц
            this.nodePropAnchors = nodePropAnchors; //document.getElementById("nodePropAnchors");

            this.nodesPropsPanel = nodesPropsPanel; // document.getElementById("nodesPropsPanel");

            this.driver = driver;
            this.size = size; //drivers.addNewDriverListner(this.newTable, this); //подписываемся на событие drivers о создании нового драйвера
            //drivers.addDriverLoadedListner(this.driverLoaded, this); //подписываемся на событие drivers о создании нового драйвера
            //if (document.getElementById(this.driver._nodenickname + "_" + this.driver._id) != undefined) return; 

            this.newTable(); //this.nodePropAnchors.innerHTML = "";
            
            //this.nodesPropsPanel.innerHTML = "";
        } //слушатель (получатель) событие создания нового драйвер (драйвер не содержит свойств на данном этапе)


        var _proto = TableWidget.prototype;

        _proto.newTable = function newTable() {
            //добавляет кнопку в панель быстрого выбора драйвер
            if (this.nodePropAnchors != undefined) { }
            /*
            var driverNavItem = this.nodePropAnchors.appendChild(document.createElement("li"));
            driverNavItem.className = "nav-item";
            var driverHRef = driverNavItem.appendChild(document.createElement("a"));
            driverHRef.className = "nav-link";
            if (firstDriver) {
                driverHRef.className += " active";
            }
            driverHRef.setAttribute("data-toggle", "tab");
            driverHRef.innerText = getLang(this.driver._nodenickname + "/" + this.driver._id);
            driverHRef.href = "#" + this.driver._nodenickname + "_" + this.driver._id;
            */

            /*
            var anchorHref = this.nodePropAnchors.appendChild(document.createElement('button'));
            anchorHref.type = "button";
            anchorHref.href = "#" + this.driver._id;
            anchorHref.onclick = this.driverAnchorClick;
            anchorHref.innerText = this.driver._id;
            anchorHref.className = "btn btn-default";
            */
            //добавлет таблицу для свойств нового драйвера


            var div = this.nodesPropsPanel.appendChild(document.createElement('div'));

            if (this.nodePropAnchors != undefined) {
                // div.className = "col-md-" + this.size + " driverdiv tab-pane fade";
                div.className = "driverdiv tab-pane fade"; //if (firstDriver) {
                //div.className += " active show";
                //firstDriver = false;
                //}
            } else {
                div.className = "col-md-" + this.size + " driverdiv TableWidget";
            }

            div.id = this.driver._nodenickname + "_" + this.driver._id;
            /*
            var driverDiv = div.appendChild(document.createElement('div'));
            driverDiv.className = "col-md-12 border-0 drivercard";
            var driverDivHeader = driverDiv.appendChild(document.createElement('div'));
            driverDivHeader.className = "card-header text-light";
            driverDivHeader.innerText = this.driver._id;
            var tableDiv = driverDiv.appendChild(document.createElement('div'));
            tableDiv.className = "card-body"; 
            */
            //таблица

            this.table = div.appendChild(document.createElement('table'));
            this.table.className = "table table-striped table-sm";
            this.table.id = "drivertable" + this.driver._nodenickname + "_" + this.driver._id;
            this.table.cellspacing = "0"; //колонки

            var thead = this.table.appendChild(document.createElement('thead'));
            var tr = thead.appendChild(document.createElement('tr'));
            var th = tr.appendChild(document.createElement('th'));
            th.className = "w-2";
            th.innerText = "#";
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-10";
            th.innerText = getLang("property");
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-25";
            th.innerText = getLang("value");
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-25";
            th.innerText = getLang("newvalue");
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-5";
            th.scope = "col";
            th = tr.appendChild(document.createElement('th'));
            th.className = "w-5";
            th.scope = "col"; //ссылка в последней колонки для перехода вверх таблицы

            var anchorTopHref = th.appendChild(document.createElement('a'));
            anchorTopHref.href = "#top";
            anchorTopHref.innerText = getLang("top"); //создает tbody

            this.tbody = this.table.appendChild(document.createElement('tbody')); //назначает счетчик свойств драйвера (строк таблицы)

            this.tbody.propertyCount = 0;
            /*---------------------------------------------
            //подписывается на событие вызываемое при создании нового свойства драйвера 
            //передает текущий tbody в качестве сендера
            driver.addNewPropertyListner(driverTable.newProperty, tbody);
            */

            for (var _i = 0, _Object$keys = Object.keys(this.driver); _i < _Object$keys.length; _i++) {
                var driverPropertyKey = _Object$keys[_i];

                if (this.driver[driverPropertyKey].parentid != undefined) {
                    this.addProperty(this.driver[driverPropertyKey]);
                }
            }

            if (this.driver._new) {
                // $("#drivertable" + this.driver._id).DataTable({ searching: false, paging: false, info: false });
                $("#drivertable" + this.driver._nodenickname + "_" + this.driver._id).DataTable({
                    "language": {
                        "lengthMenu": getLang("dt_display") + " _MENU_ " + getLang("dt_recordsperpage"),
                        "info": getLang("dt_showing") + " _START_ " + getLang("dt_to") + " _END_ " + getLang("dt_of") + " _TOTAL_ " + getLang("dt_entries"),
                        "search": getLang("dt_search"),
                        "paginate": {
                            "first": getLang("dt_first"),
                            "last": getLang("dt_last"),
                            "next": getLang("dt_next"),
                            "previous": getLang("dt_previous")
                        }
                    },
                    "pageLength": 50
                });
                $('.dataTables_length').addClass('bs-select');
                $('[data-toggle="tooltip"]').tooltip();
            }
        } //слушатель события создания нового свойства драйвера - добавляет соответствующею строку в последнею созданую таблицу
            //tbody последней таблицы 
            //driverProperty объек с новым свойством драйвера, смотрите drivers.newDriverProperty() в конце метода
            ;

        _proto.addProperty = function addProperty(driverProperty) {
            var node = config.getNodeByHost(driverProperty.parenthost);
            if (node == undefined) return;
            this.tbody.propertyCount++; //инкрементируем счетчик свойств

            var tr = this.tbody.appendChild(document.createElement('tr'));
            var th = tr.appendChild(document.createElement('th'));
            th.scope = "row";
            th.innerHTML = this.tbody.propertyCount; //первая колонка номер свойства 
            //вторая колонка, название свойства, а так же ссылка на вызов RESTful API для получения значения этого свойства (для Справки)

            var nameTd = tr.appendChild(document.createElement('td'));
            var getPropHref = nameTd.appendChild(document.createElement('a')); //сиздаем ссылку

            getPropHref.target = "_blank";
            getPropHref.setAttribute("data-toggle", "tooltip");
            getPropHref.setAttribute("data-placement", "top"); //назначаем слушатель события изменения значения свойства, использующий созданную ссылку в качестве Sender 
            //тут надо рассмотреть driverProperty.addValueListner(..) метод - посмотрите на него - при назначении 
            //слушателя, для его проверки он вызовет матод слушателя (для проверки, секция try{}catch)
            //сейчас этот метод driverTable.onDriverPropValueChangeGetaHref() из текущего объекта
            //а sender для этого метода текущая ссылка getPropHref
            //при вызове driverTable.onDriverPropValueChangeGetaHref() в качестве параметра передадут DriverPorperty объект который 
            //связан с этой строкой таблицы ибо он "driverProperty" ниже
            //Посмотрите сейчас на метод driverTable.onDriverPropValueChangeGetaHref - он настраивает ссылку getPropHref согласно 
            //свойствам driverProperty - таким образом мы "убиваем двух зайцев" - и настраиваем внешний вид элемента (ссылки) и готовим 
            //метод слушатель события изменения значения свойства - теперь как бы не менялось свойста, у нас есть код который будет "перерисовать" связанный
            //                                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
            //элемент и нам не надо более не о чем заботиться.
            //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

            driverProperty.addValueListner(this.onDriverPropValueChangeGetaHref, getPropHref); //третъя колонка, текущее значение свойства драйвера 

            var valueTd = tr.appendChild(document.createElement('td'));
            var valueSpan = valueTd.appendChild(document.createElement('span'));
            valueSpan.className = "align-middle"; //ссылка вызывающая API для назначения свойства драйвера, так же как для воторой колонки 

            var setPropHref = valueSpan.appendChild(document.createElement('a'));
            setPropHref.target = "_blank";
            setPropHref.setAttribute("data-toggle", "tooltip");
            setPropHref.setAttribute("data-placement", "top"); //так же как и для второй колонки - назначаем метод слушатель изменения объекта, он же "рисует" setPropHref элемент в 
            //зависимости от текущего значения свойства

            driverProperty.addValueListner(this.onDriverPropValueChangeSetaHref, setPropHref); //четвертая колонка - редактор значения свойства, реализован так же как элементы для второй и третей колонки, со своим слушателем события
            //учитывает тип свойства драйвера - создает соответствующие типы редакторов createValueEdit() <-- TODO: метод старый, нуждается в рефакторинге 

            var edit = createValueEdit(tr.appendChild(document.createElement('td')), driverProperty.name, driverProperty.value, driverProperty.type);
            driverProperty.addValueListner(this.onDriverPropValueChangeEdit, edit); //пятая и шестая колонка, кнопки Set value и Get Value 

            var setButtonTd = tr.appendChild(document.createElement('td'));
            var getButtonTd = tr.appendChild(document.createElement('td')); //кнопка Get value 

            var getSpan = getButtonTd.appendChild(document.createElement('a'));
            getSpan.className = "badge badge-secondary";
            getSpan.href = "#";
            getSpan.style.margin = "1px 0px 1px 0px";
            getSpan.style.height = "25px";
            getSpan.style.width = "50px";
            getSpan.innerText = "get";
            getSpan.driverProperty = driverProperty; //кнопка запоминает свойство драйвера 

            getSpan.onclick = this.getDriverClick; //обработчик клика - должне бызвать в объекте со свойством драйвер асинхронный вызов API и обработать результа

            driverProperty.addNetworkStatusListner(this.onDriverPropNetworkStatusChange, getSpan); //кнопка так же является получателем изменения статуса свойства драйвера

            node.addNetworkStatusListner(this.onDriverPropNetworkStatusChange, getSpan); //подписка на глобальный сетевой статус
            //кнопка Set value не создается если свойство ReadOnly

            if (!driverProperty.type.indexOf("r")!=-1) {
                //так же как и Set value кнопка - асинхронно меняет значение свойства и ожидает результат
                var span = setButtonTd.appendChild(document.createElement('a'));
                span.className = "badge badge-secondary";
                span.href = "#";
                span.style.margin = "1px 0px 1px 0px";
                span.style.height = "25px";
                span.style.width = "50px";
                span.setAttribute("data-toggle", "tooltip");
                span.setAttribute("data-placement", "top");
                span.driverProperty = driverProperty;
                span.edit = edit;
                span.onclick = this.setDriverClick;
                span.innerText = "set";
                driverProperty.addNetworkStatusListner(this.onDriverPropNetworkStatusChange, span);
                node.addNetworkStatusListner(this.onDriverPropNetworkStatusChange, span);
            }

            return tr; //FFR: возвращет созданую строку таблицы, пока не используется
        };

        _proto.driverLoaded = function driverLoaded(sender, driver) { } //кноки подписываются на изменение сетевого статуса свойства драйвера, этот метод слушатель соответствующего события в свойстве драйвера
            //и будет вызвать если сетевой статус изменится (обе кнопки Get и Set подписаны этом методом и будут представлены как sender)
            ;

        _proto.onDriverPropNetworkStatusChange = function onDriverPropNetworkStatusChange(sender, driverProperty) {
            if (driverProperty.networkStatus == NET_ONLINE) {
                sender.className = "badge badge-success";
            } else if (driverProperty.networkStatus == NET_RECONNECT) {
                sender.className = "badge badge-warning";
            } else if (driverProperty.networkStatus == NET_OFFLINE) {
                sender.className = "badge badge-secondary";
            } else //error
                if (driverProperty.networkStatus == NET_ERROR) {
                    sender.className = "badge badge-danger";
                }
        } //обработчик слушатель события изменения свойста для ссылки из второй колонки таблицы (смотрите метод создания строки таблицы)
            ;

        _proto.onDriverPropValueChangeGetaHref = function onDriverPropValueChangeGetaHref(sender, driverProperty) {
            //ссылка представлена тут как sender 
            sender.title = "Get '" + driverProperty.name + "' driver property value [RESTful API execute]"; //настройка подсказки

            sender.innerText = driverProperty.name;

            if (driverProperty.type.indexOf("s") != -1) {
                sender.className = "text-warning";
            }

            sender.href = driverProperty.parenthost + "getdriverproperty?id=" + driverProperty.parentid + "&property=" + driverProperty.name; //настройка вызова RESTful API по клику на ссылку
        } //обработчик слушатель события изменения свойста для ссылки из третей (так же как и для второй, только вызов RESTful API Set )
            ;

        _proto.onDriverPropValueChangeSetaHref = function onDriverPropValueChangeSetaHref(sender, driverProperty) {
            sender.title = "Set '" + driverProperty.name + "' driver property value [RESTful API execute][return '1' if success]";
            sender.href = driverProperty.parenthost + "setdriverproperty?id=" + driverProperty.parentid + "&property=" + driverProperty.name + "&value=" + driverProperty.value;

            if (driverProperty.type.indexOf("b") != -1) {
                //если тип свойства драйвера boolean 
                if (driverProperty.value === "1") sender.innerText = "true"; else sender.innerText = "false";
            } else {
                //иначе текстовое представление - текст может быть очень длинным, ограничиваем в 20 символов
                var cutValue = driverProperty.value;

                if (cutValue.length > 20) {
                    cutValue = cutValue.slice(0, 20) + "...";
                }

                if (driverProperty.type.indexOf("p") != -1) {
                    var temp = "";
                    for (var i = 0; i < cutValue.length; i++) {
                        temp += "*";
                    }
                    cutValue = temp;
                }

                sender.innerText = cutValue;
            }
        } //обработчик слушатель события изменения свойста для редактора свойствае, если свойство изменит значение - редактор предложит пользователю новое измененое значение
            //это интересно работает когда несколько пользователей независимо редактируют разные свойства драйвер независимо друг от другда
            ;

        _proto.onDriverPropValueChangeEdit = function onDriverPropValueChangeEdit(sender, driverProperty) {
            if (driverProperty.type.indexOf("b") != -1) {
                //boolean
                if (driverProperty.value == "1") {
                    sender.selectedIndex = 0;
                } else {
                    sender.selectedIndex = 1;
                }
            } else {
                sender.value = driverProperty.value;
            }
        } //когда пользоватеь кликнет кнопку Set в одной из строк таблицы (изменение значения свойства драйвера)
            //для понимания этого метода необходимо учитывать, что все остальные элементы строки, связаные с текущем свойством, 
            //были подписаны на его изменениея - смотрите newProperty() метод этого объекта
            //По этой причине, все кнопке остается только "попросить" объект свойства драйвера изменить его значения и не заботится о результате
            //все что произойдет далее с RESTful API, Unit, свойством - будет выслано самим объектом DriverProperty соответствующим подписчикам
            ;

        _proto.setDriverClick = function setDriverClick(event) {
            event.stopPropagation();
            var button = event.currentTarget; //вытаскиваем "кликнутую" кнопку из event 

            var driverProperty = button.driverProperty; //вытаскиваем из кнопки - связанное с ней свойство драйвера  

            if (driverProperty.networkStatus != NET_RECONNECT) {
                //если свойство драйвера не в статуре "в реботе" - асинхронность это хорошо, но переполнять очередь это преступление
                var edit = button.edit; //вытаскиваем редактор свойства (он в строке таблицы вместе с кнопкой)

                var value = edit.value; //получаем значение свойства драйвера введенное пользователем

                if (edit.proptype.indexOf("b") != -1) // boolean - представлен в виде combobox а не редактора 
                {
                    if (edit.selectedIndex == 0) value = "1"; //для драйвера 1 - true, 0 - false
                    else value = "0";
                } //вызываем метод свойства драйвера для начала процедуры изменения этого свойства с новым значением value
                //не назначаем вторичных получателей undefined, undefined - все получатели уже подписаны ранее


                driverProperty.setValue(value, undefined, undefined);
            }

            return false;
        } //клик на кнопку получить значение свойства драйвера - так же как и setDriverClick, с той разницей что никакое value не передается, а полученое value будет 
            //передано всем подписчикам DriverProperty.value 
            ;

        _proto.getDriverClick = function getDriverClick(event) {
            event.stopPropagation();
            var button = event.currentTarget;
            var driverProperty = button.driverProperty;

            if (driverProperty.networkStatus != NET_RECONNECT) {
                driverProperty.getValue(undefined, undefined);
            }

            return false;
        };

        return TableWidget;
    }(); //ENDOF driverTable
﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var ValueWidget =
    
    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(ValueWidget, _BaseWidget);

        function ValueWidget(parentPanel, id, size) {
            return _BaseWidget.call(this, parentPanel, id, size) || this;
        };

        ValueWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            widget.radius = widget.size / 3;
            widget.topMargin = widget.centreY + widget.size / 10;
            
            widget._properties.textfontsize =
                {
                    name: "Value text size",
                    value: 1.0,
                    type: "f"
                };

            widget.clickableToTop();
            widget.properties = widget._properties;
            widget.doOnLoad();

        };


        ValueWidget.prototype.drawText = function drawText() {
            if (this.SVGWidgetText == undefined) return;
            if (this.properties.textfontsize !== undefined) {
                this.SVGWidgetText.size = this.properties.textfontsize.value;
            }
            _BaseWidget.prototype.drawText.call(this);
            this.SVGWidgetText.color = theme.danger;
            
        };


        ValueWidget.prototype.drawWidget = function drawWidget() {
        
            _BaseWidget.prototype.drawWidget.call(this);
        };

        return ValueWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/


var DEFAULT_MASK = 0;
var ICONS_MASK = 1;

var ActuatorWidget =

    function (_BaseWidget) {
        "use strict";

        _inheritsLoose(ActuatorWidget, _BaseWidget);

        function ActuatorWidget(parentPanel, id, size, iconOn, iconOff) {
            var _baseWidget = _BaseWidget.call(this, parentPanel, id, size) || this;
            _baseWidget.iconOn = iconOn;
            _baseWidget.iconOff = iconOff;
            return _baseWidget;
        }

        ActuatorWidget.prototype.onWidgetHolderLoad = function onWidgetHolderLoad(event) {
            _BaseWidget.prototype.onWidgetHolderLoad.call(this, event);
            var rPanel = event.currentTarget;
            var widget = rPanel.widget;

            if (widget.iconOn == undefined && widget.iconOff == undefined) {
                widget.widgetType = DEFAULT_MASK;
                widget.SVGArcBack = new SVGArc(widget.SVGViewBox, widget.id + "arcback", widget.centreX, widget.centreY + widget.topMargin, widget.radius + widget.size / 20, widget.size / 100);
                widget.SVGArcBack.color = theme.secondary;
                widget.SVGArcWidget = new SVGArc(widget.SVGViewBox, widget.id + "arcwidget", widget.centreX, widget.centreY + widget.topMargin, widget.radius, widget.size / 14);
                widget.SVGArcWidget.color = theme.secondary;
                widget.SVGArcWidget.fill = theme.secondary;
            } else {
                widget.widgetType = ICONS_MASK;
                widget.rowSize = widget.size / 2.5;
                widget.SVGIconOn = new SVGIcon(widget.SVGViewBox, widget.iconOn, widget.width / 2 - widget.rowSize / 2, widget.height / 2 - widget.rowSize / 2, widget.rowSize, widget.rowSize);
                widget.SVGIconOn.fill = theme.success;
                widget.SVGIconOn.SVGIcon.widget = _assertThisInitialized(widget);
                widget.SVGIconOn.hide();


                widget.SVGIconOff = new SVGIcon(widget.SVGViewBox, widget.iconOff, widget.width / 2 - widget.rowSize / 2, widget.height / 2 - widget.rowSize / 2, widget.rowSize, widget.rowSize);
                widget.SVGIconOff.fill = theme.success;
                widget.SVGIconOff.SVGIcon.widget = _assertThisInitialized(widget);

                widget.SVGIconOff.hide();

                widget.SVGArcSpinner.y = widget.centreY;
            }

            widget.SVGWidgetText.hide();

            widget.ShowEqualizer = false;

            widget.clickableToTop();

            widget.proprties = widget._properties;

            widget.doOnLoad();

        }



        ActuatorWidget.prototype.drawWidget = function drawWidget() {
            _BaseWidget.prototype.drawWidget.call(this);

            if (this.SVGArcBack == undefined) return;

            if (this.widgetType == DEFAULT_MASK) {
                //back radial widget
                this.SVGArcBack.draw(0, 359.99); //radial widget

                if (this.data != 0) {
                    this.SVGArcWidget.draw(0, 359.99);
                } else {
                    this.SVGArcWidget.hide();
                }

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.toColor(this.SVGArcBack, theme.success);
                        this.toColor(this.SVGArcWidget, theme.success, false);
                        break;

                    case NET_ERROR:
                        this.toColor(this.SVGArcBack, theme.danger);
                        this.toColor(this.SVGArcWidget, theme.danger, false);
                        break;

                    case NET_RECONNECT:
                        this.toColor(this.SVGArcBack, theme.info);
                        this.toColor(this.SVGArcWidget, theme.info, false);
                        break;

                    default:
                        //offline
                        this.toColor(this.SVGArcBack, theme.secondary);
                        this.toColor(this.SVGArcWidget, theme.secondary, false);
                        break;
                }
            } else {
                if (this.data != 0) {
                    this.SVGIconOn.draw();
                    this.SVGIconOff.hide();
                } else {
                    this.SVGIconOn.hide();
                    this.SVGIconOff.draw();
                }

                switch (this._networkStatus) {
                    case NET_ONLINE:
                        this.SVGIconOn.fill = theme.success;
                        this.SVGIconOff.fill = theme.success;
                        break;

                    case NET_ERROR:
                        this.SVGIconOn.fill = theme.danger;
                        this.SVGIconOff.fill = theme.danger;
                        break;

                    case NET_RECONNECT:
                        this.SVGIconOn.fill = theme.info;
                        this.SVGIconOff.fill = theme.info;
                        break;

                    default:
                        //offline
                        this.SVGIconOn.fill = theme.secondary;
                        this.SVGIconOff.fill = theme.secondary;
                        break;
                }
            }
        };

        return ActuatorWidget;
    }(BaseWidget);﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var boardhost = "http://81.95.178.177:8084/"; //DEBUG
//var boardhost = "http://192.168.1.9:8084/"; //DEBUG as WiFi Access Point
//var boardhost = ""; //UI loading from ESPxxxx


function getUnitProperty(host, property) {
    return httpGetWithErrorReson(host + "getnodeproperty?property=" + escape(property));
}

function setUnitProperty(host, property, value) {
    return httpGetWithErrorReson(host + "setnodeproperty?property=" + escape(property) + "&value=" + escape(value));
}

function setDriverProperty(host, id, property, value) {
    return httpGetWithErrorReson(host + "setdriverproperty?id=" + id + "&property=" + escape(property) + "&value=" + escape(value));
}

function setDriverPropertyAsync(host, id, property, value) {
    return httpGetAsync(host + "setdriverproperty?id=" + id + "&property=" + escape(property) + "&value=" + escape(value));
}

function setDriverPropertyAsyncWithReciever(host, id, property, value, asyncReciever, upperAsyncReciever, sender, upperSender) {
    return httpGetAsyncWithReciever(host + "setdriverproperty?id=" + id + "&property=" + escape(property) + "&value=" + escape(value), asyncReciever, upperAsyncReciever, sender, upperSender);
}

function getDriverProperty(host, id, property) {
    return httpGetWithErrorReson(host + "getdriverproperty?id=" + id + "&property=" + escape(property));
}

function getDriverPropertyAsyncWithReciever(host, id, property, asyncReciever, upperAsyncReciever, sender, upperSender) {
    return httpGetAsyncWithReciever(host + "getdriverproperty?id=" + id + "&property=" + escape(property), asyncReciever, upperAsyncReciever, sender, upperSender);
}


function deleteFile(host, name) {
    return httpGet(host + "deletefile?name=" + name);
}

function deleteScriptAsync(host, name, asyncReciever, sender) {
    return httpGetAsyncWithReciever(host + "deletescript?name=" + name, asyncReciever, sender);
}


function reset(host) {
    return httpGetAsync(host + "reset");
}

function addDriver(host, apiParams) {

    
    return httpGetWithErrorReson(host + "adddriver?" + apiParams);
}

function updateUIAsync(host) {
    return httpGetAsync(host + "updateui");
}

function updateFirmwareAsync(host) {
    return httpGetAsync(host + "updatefirmware");
}


function getUpdateLogAsyncWithReciever(host, asyncReciever, upperAsyncReciever, sender, upperSender) {
    return httpGetAsyncWithReciever(host + "updatelog", asyncReciever, upperAsyncReciever, sender, upperSender);
}


function httpGet(_url) {
    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        headers:
        {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
        },
        async: false,
        type: "GET",
        contentType: "text/plain charset=utf-8",
        dataType: "text",

        success: function (data) {
            addToLogNL("call RESTful: " + _url + " result OK", 1);
            _data = data;
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful sync: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }            
        }
    });

    return _data;
}

function httpGetWithErrorReson(_url) {
    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        headers:
        {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
        },
        async: false,
        type: "GET",
        contentType: "text/plain charset=utf-8",
        dataType: "text",

        success: function (data) {
            addToLogNL("call RESTful: " + _url + " result OK", 1);
            _data = data;
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful sync: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
        }
    });

    return _data;
}

function httpPostWithErrorReson(_url, _postdata) {

    var formData = new FormData();
    var postdata = [];
    postdata.push(_postdata);
    formData.append('postdata', postdata);

    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        type: "POST",


        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        async: false,

        success: function (data) {
            addToLogNL("call RESTful: " + _url + " result OK", 1);
            _data = data;
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call POST sync: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }            
        }
    });

    return _data;
}

//POST Async
function httpPostAsyncWithErrorReson(_url, arg, _postdata, asyncReciever, counter, dataString, length) {

    var formData = new FormData();
    var postdata = [];
    postdata.push(_postdata);
    formData.append('postdata', postdata);

    var _data = null;
    $.ajax({
        url: encodeURI(_url + arg),
        type: "POST",


        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        async: true,

        success: function (data) {
             addToLogNL("call RESTful: " + _url + " result OK", 1);
            _data = data;
            if (asyncReciever != undefined) {
                asyncReciever(_data, counter, dataString, length, _url);
            }
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
             addToLogNL("call POST async: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
            if (asyncReciever != undefined) {
                asyncReciever(_data, counter, dataString, length, _url);
            }
        }
    });

    return _data;
}


function httpGetAsync(_url, asyncReciever, upperAsyncReciever, sender, upperSender) {
    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        headers:
        {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
        },
        async: true,
        type: "GET",
        contentType: "text/plain charset=utf-8",
        dataType: "text",

        success: function (_data) {
            addToLogNL("call RESTful async: " + _url + " result OK", 1);
            if (asyncReciever != undefined) {
                asyncReciever(_data, upperAsyncReciever, sender, upperSender);
            }

        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful async: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
            if (asyncReciever != undefined) {
                asyncReciever(_data, upperAsyncReciever, sender, upperSender);
            }
        }
    });

    return _data;
}

function httpGetAsyncWithReciever(_url, asyncReciever, upperAsyncReciever, sender, upperSender) {
    var _data = null;
    $.ajax({
        url: encodeURI(_url),
        headers:
        {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
        },
        async: true,
        type: "GET",
        contentType: "text/plain charset=utf-8",
        dataType: "text",

        success: function (data) {
            addToLogNL("call RESTful async: " + _url + " result OK", 1);
            _data = data;
            if (asyncReciever != undefined) {
                asyncReciever(_data, upperAsyncReciever, sender, upperSender);
            }
        },
        
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //addToLogNL("call RESTful async: " + _url + " result ERORR [" + XMLHttpRequest.status + "]", 2);
            _data = "%error[" + XMLHttpRequest.status + "]";
            if ((XMLHttpRequest.responseText !== undefined) && (XMLHttpRequest.responseText !== null)) {
                _data += " response: " + XMLHttpRequest.responseText;
            }
            if (asyncReciever != undefined) {
                asyncReciever(_data, upperAsyncReciever, sender, upperSender);
            }

            //XMLHttpRequest.host;
        }

    });

    return _data;
}
﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var stopScriptStatus = 0;  //скрипт остановлен не выполняется
var runScriptStatus = 1;   //скрипт выполняется
var debugScriptStatus = 4;
var compilerScriptErrorStatus = 2; //ошибка компиляции скрипта
var runtimeScriptErrorStatus = 3; //ошибка выполнения скрипта (возможно был фатальный сбой, не возобновляейте выполнение такого скрипта, без проверки). 


function createScript(_node) {
    return {
        node: _node,
        name: "",
        status: "",
        debuglinenumber: "",
        bytecode: "",
        codecount: 0,
        datacount: 0,
        timequant: 0,
        ip: 0,
        variables: "",
        deleted: false
    };
}

var scriptsManager = {
    scripts: [],
    
    //подписчики (функции) на onNew событие скрипта 
    _onnew: [],

    //вызов события onNew скриптом
    doOnNew: function (script) {
        for (var key in scriptsManager._onnew) {
            scriptsManager._onnew[key](script);
        }
    },

    //Добавление обработчиков события onNew
    set onNew(onnew) {
        scriptsManager._onnew.push(onnew);
    },


    _onchange: [],
    doOnChange: function (script) {
        for (var key in scriptsManager._onchange) {
            scriptsManager._onchange[key](script);
        }
    },

    set onChange(onchange) {
        scriptsManager._onchange.push(onchange);
    },

    _ondelete: [],
    doOnDelete: function (script) {
        for (var key in scriptsManager._ondelete) {
            scriptsManager._ondelete[key](script);
        }
    },

    set onDelete(ondelete) {
        scriptsManager._ondelete.push(ondelete);
    },


    refresh: function (node) {
        node.networkStatus = NET_REFRESH;
        // асинхронный HTTP запрос
        // this.refreshResult - метод который будет вызван HTTPClient-ом по окончанию асинхронного запроса
        // this - ссылка на экземпляр этого объекта        
        httpGetAsyncWithReciever(node.host + "getallscripts", scriptsManager.refreshResult, node);
    },

    //вызывается асинхронным HTTPClient по окончанию запроса, указан как параметр в httpGetAsyncWithReciever, смотрите this.refresh()
    //httpResult - результат запроса
    //asyncReciever - ссылка на объект сделавший запрос (этот метод будет вызван в контексте другого потока, для него this. это другой объект - занимательный мир JS)
    //мы не можем использовать this, для обращения к методам этого объекта, поэтому заведомо передали себе ссылку на себя "asyncReciever"
    refreshResult: function (httpResult, node) {
        //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произошел TimeOut
        if (!httpResult.indexOf("%error") == 0) {
            node.networkStatus = NET_ONLINE;
            scriptsManager.parseScripts(httpResult, node);
        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (httpResult.indexOf("reponse") != -1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            
        }
    },

    createOrReplace: function (script, asyncReciever, sender) {
        //JavaScript escape function not code "+" char as %2B - we need this char for Script 
        var byteCodeEscape = escape(script.bytecode).replace("+", "%2B").replace(">", "%3E").replace("<", "%3C");
        // %3E >
        // %3C <
        httpPostAsyncWithErrorReson(script.node.host + "createscript", "?name=" + escape(script.name), byteCodeEscape, asyncReciever, sender);
    },

    startDebug: function (script) {
        httpGet(script.node.host + "startdebugscript?name=" + escape(script.name));
    },

    debugNext: function (script) {
        var httpResult = httpGet(script.node.host + "debugnextscript?name=" + escape(script.name));
        if (!httpResult.indexOf("%error") == 0) {
            script.node.networkStatus = NET_ONLINE;
            scriptsManager.parseScripts(httpResult, script.node);
            return true;
        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (httpResult.indexOf("reponse") != -1) {
                script.node.networkStatus = NET_ERROR;
            }
            else {
                script.node.networkStatus = NET_OFFLINE;
            }
        }
        return false;
    },

    delete: function (script, asyncReciever, sender) {
        deleteScriptAsync(script.node.host, escape(script.name), asyncReciever, sender);
    },

    getScript: function (node, name) {
        for (var scriptKey in scriptsManager.scripts) {
            if ((scriptsManager.scripts[scriptKey].node === node) && (scriptsManager.scripts[scriptKey].name === name)) {
                return scriptsManager.scripts[scriptKey];
            }
        }
        return undefined;
    },

    pushScript: function (script) {
        for (var scriptKey in scriptsManager.scripts) {
            if ((scriptsManager.scripts[scriptKey].node === script.node) && (scriptsManager.scripts[scriptKey].name === script.name)) {
                scriptsManager.scripts[scriptKey] = script;
                scriptsManager.doOnChange(scriptsManager.scripts[scriptKey]);
                return;
            }
        }
        
         scriptsManager.scripts.push(script); //TODO onNew event 
         this.doOnNew(script);            
        
    },

    parseScripts: function (httpResult, node) {

        for (var scriptKey in scriptsManager.scripts) {
            if ((scriptsManager.scripts[scriptKey].node === node)) {
                scriptsManager.scripts[scriptKey].deleted = true; //все удалены перед началом парсинга
            }
        }

        var recievedScripts = httpResult.split("\r");


        if (recievedScripts !== "") {//если первичный парсинг удался

            var script = undefined;

            for (var i = 0; i < recievedScripts.length; i++) {//перечисляем все строки в HTTPResult 
                if (recievedScripts[i] === "") continue; //если строка пуста, берем следующею

                if (recievedScripts[i].indexOf("script:") == 0) { //если заголовок драйвера найден                    
                    //add previos 
                    if (script != undefined) {
                        scriptsManager.pushScript(script);
                    }

                    script = createScript(node);
                    script.name = recievedScripts[i].split(":")[1];
                }
                else {
                    if (script == undefined) continue;

                    var splitterPos = recievedScripts[i].indexOf("=");
                    if (splitterPos != -1) {
                        var key = recievedScripts[i].slice(0, splitterPos);
                        var value = recievedScripts[i].slice(splitterPos + 1, recievedScripts[i].lenght);
                        if (script[key] != undefined) {
                            script[key] = value;
                        }
                    }
                }
            }
            if (script != undefined) {
                scriptsManager.pushScript(script);
            }
        }

        var deleted = false;
        while (!deleted) {
            deleted = true;
            for (var scriptKey in scriptsManager.scripts) { //удаляем удаленные на стороне ноды 
                if ((scriptsManager.scripts[scriptKey].node === node)) {
                    if (scriptsManager.scripts[scriptKey].deleted === true) {
                        this.doOnDelete(scriptsManager.scripts[scriptKey]);
                        scriptsManager.scripts.splice(scriptKey, 1);
                        deleted = false;
                        break;
                    }
                }
            }
        }


    }

}﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/


function defaultWebProp() {
    return {
        language: "ua",
        speak: false,
        voice: 0,
        widgetssize: 150,
        dashboards: [],
        nodes: []
    };

}



var configProperties = defaultWebProp();

//var configPropertiesDriver;

var config = {

    cancel: false,
    _onchange: [],
    doOnChange: function () {
        for (var key in config._onchange) {
            config._onchange[key](configProperties);
        }
    },

    set onChange(onchange) {
        config._onchange.push(onchange);
    },

    _onload: [],
    doOnLoad: function () {
        for (var key in config._onload) {
            config._onload[key](configProperties);
        }
    },

    set onLoad(onload) {
        config._onload.push(onload);
    },


    addDashboard: function (_id) {
        var dashboard = {
            id: _id,
            widgets: []
        }
        configProperties.dashboards.push(dashboard);
        return dashboard;
    },

    getDashboardById: function (_id) {
        for (var i = 0; i < configProperties.dashboards.length; i++) {
            if (configProperties.dashboards[i].id == _id) {
                return configProperties.dashboards[i];
            }
        }
        return undefined;
    },

    addWidget: function (_dashboardId, _daviceId, _driverProperty, _widgetWrapperId,  _widgetId, _widgetProperties) {
        var dashboard = this.getDashboardById(_dashboardId);
        if (dashboard != undefined) {
            var widget = {
                dashboardId: _dashboardId,
                driverId: _daviceId,
                driverProperty: _driverProperty,
                widgetWrapperId: _widgetWrapperId,
                widgetId: _widgetId,
                widgetProperties: _widgetProperties
            };
            dashboard.widgets.push(widget);
            config.doOnChange();            
            return widget;
        }
        return undefined;
    },

    getWidgetConfigPropById: function (id) {
        for (var i = 0; i < configProperties.dashboards[0].widgets.length; i++) {
            if (configProperties.dashboards[0].widgets[i].widgetId === id) {
                return configProperties.dashboards[0].widgets[i];
            }
        }
        return undefined;
    },

    onWidgetChange: function (widget) {
        var widgetConfigProp = config.getWidgetConfigPropById(widget.id);
        if (widgetConfigProp == undefined) {
            return;
        }
        widgetConfigProp.widgetProperties = widget.properties;
        config.doOnChange();
    },

    onWidgetDelete: function (widget) {
        var widgetConfigProp = config.getWidgetConfigPropById(widget.id);
        if (widgetConfigProp == undefined) return;

        //TODO: поправить удаление из массива
        configProperties.dashboards[0].widgets.splice(configProperties.dashboards[0].widgets.indexOf(widgetConfigProp), 1);
        config.doOnChange();
    },

    addNode: function (_host, _nodenickname) {
        if (this.getNodeByHost(_host) != undefined) return false;

        var node = {
            host: _host,
            nodenickname: _nodenickname,
            //-------------------------------------------------------------------------------------------------------------
            //сетевое состояние модуля - онлайн, офлайн, переподсоединение ("в работе"), ошибка --> по умолчанию онлайн
            //NOTE: у каждого свойства есть свое сетевое состояние и связанные события - это глобальный флаг для всех драйвер и элементов UI
            _networkStatus: NET_OFFLINE, //offline по умолчанию
            set networkStatus(networkStatus) { //для контроля изменения _networkStatus, для оповещения подписчиков
                this._networkStatus = networkStatus; //сохранить новое сетевое состояние
                for (var k = 0; k < this.networkStatusListners.length; k++) { //оповестить всех подписчиков
                    this.networkStatusListners[k].event(this.networkStatusListners[k].sender, this);
                }
            },
            get networkStatus() {//получить текущее сетевое состояние
                return this._networkStatus;
            },
            networkStatusListners: [], //подписчики на изменение сетевого состояния 
            addNetworkStatusListner: function (_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                //check event listner and setup current network status 
                try {
                    _event(_sender, this);
                } catch (exception) {
                    console.error(exception);
                    return; // don't add bad listner
                }
                this.networkStatusListners.push(event = { event: _event, sender: _sender });
            },

            drivers: [],
            pins: [],
            driversPins: [],
            accessableDrivers: [],
     
        }

        configProperties.nodes.push(node);
        config.doOnChange();
        return true;
    },

    getNodeByHost: function (_host) {
        for (var node in configProperties.nodes) {
            if (configProperties.nodes[node].host == _host) {
                return configProperties.nodes[node];
            }
        }
        return undefined;
    },



    load: function () {
        var result = false;


        var stringifyConfig = httpGetWithErrorReson(boardhost + "getwebproperty?property=config"); //boardhost host контроллера с которого идет первичная загрузка
        if (!stringifyConfig.indexOf("%error") == 0) {
            try {
                configProperties = JSON.parse(unescape(stringifyConfig));
                //check 
                if (this.getDashboardById("main") != undefined) {

                    var tempNodes = [];
                    for (var nodeKey in configProperties.nodes) {

                        var tempNode = {
                            id: configProperties.nodes[nodeKey].id,
                            host: configProperties.nodes[nodeKey].host,
                            nodenickname: configProperties.nodes[nodeKey].nodenickname,
                            _networkStatus: NET_OFFLINE,
                            drivers: [],
                            pins: [],
                            driversPins: [],
                            accessableDrivers: [],
                            networkStatusListners: [], //подписчики на изменение сетевого состояния                         
                            set networkStatus(networkStatus) { //для контроля изменения _networkStatus, для оповещения подписчиков
                                this._networkStatus = networkStatus; //сохранить новое сетевое состояние
                                for (var k = 0; k < this.networkStatusListners.length; k++) { //оповестить всех подписчиков
                                    this.networkStatusListners[k].event(this.networkStatusListners[k].sender, this);
                                }
                            },

                            get networkStatus() {//получить текущее сетевое состояние
                                return this._networkStatus;
                            },

                            addNetworkStatusListner: function(_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                                //check event listner and setup current network status 
                                try {
                                    _event(_sender, this);
                                }
                                catch (exception) {
                                    console.error(exception);
                                    return; // don't add bad listner
                                }
                                this.networkStatusListners.push(event = { event: _event, sender: _sender });
                            }
                        }
                        tempNodes.push(tempNode);
                    }
                    configProperties.nodes = tempNodes;

                    //First node all time is boardhost 
                    configProperties.nodes[0].host = boardhost;
                    result = true;

                    this.doOnLoad();
                    
                }
                else {
                    configProperties = "";
                }
            }
            catch (exception) {
                console.error(exception);
                addToLogNL(getLang("getconfigfailsparse") + exception, 2);
            }
        }


        if (!result) { //пробуем создать свойства по умолчанию, если их еще нет
            //parse problem, reset properties
            configProperties = defaultWebProp();


            addToLogNL(getLang("restoredefault"), 1);
            this.addDashboard("main");
            this.addNode(boardhost, "local");
            /*
            this.addNode("http://176.100.2.105:8085/", "solomon_1");
            this.addNode("http://176.100.2.105:8086/", "solomon_2");
            this.addNode("http://81.95.178.177:8084/", "home_1");
            this.addNode("http://192.168.1.11:8084/", "home_2");
            */

            result = this.save();

        }


        return result;
    },

    // асинхронный метод сохранения внесенных изменений в настройки (передача строки разбитой на небольшие части в ноду) 
    save: function () {

        //формирование строки из текущих настроек подключенных нод
        var tempProp = defaultWebProp();
        //кнопка сохранения виджета
        var saveButton = document.getElementById("saveWidgetsButton");
        if (saveButton !== undefined && saveButton !== null) { 
            saveButton.hidden = true;
        } 


        for (var key in configProperties) {
            if (key != "nodes") {
                tempProp[key] = configProperties[key];
            }
        }

        for (var node in configProperties.nodes) {
            var jsonNode = {
                id: configProperties.nodes[node].id,
                host: configProperties.nodes[node].host,
                nodenickname: configProperties.nodes[node].nodenickname,
                _networkStatus: NET_OFFLINE,
                drivers: [],
                pins: [],
                driversPins: [],
                accessableDrivers: []

            }

            tempProp.nodes.push(jsonNode);
        }

        //конвертирование в формат JSON
        var stringifyConfig = JSON.stringify(tempProp);

        //установка размера подстроки
        var subStringLength = 1024;

        // вызов функции сохранения
        this.configSendAsync("Start", 0, stringifyConfig, subStringLength, boardhost);

        return true;

    },

    //функция асинхронной передачи строки через RESTfull POST запрос с/без отображением(я) состояния передачи строки в модельном окне
    //эта функция является одновременно и функцией обратного вызова для выполняемого RESTfull POST запроса 
    //аргументы функции: httpResult - результат выполнения RESTfull POST запроса, counter - счетчик, dataString - вся передаваемая строка, lengthDataSubString - длина подстроки, url - адрес для отправки RESTfull POST запроса
    configSendAsync: function (httpResult, counter, dataString, lengthDataSubString, url) {
        // передаваемая подстрока
        var subString = "";
        // информация о передаваемой части строки для сохранения в файл web.config (для временного хранения передаваемых данных файл web.temp)
        var filePartName = "";
        // расчет количества подстрок (строка разбирая на подстроки) для передачи
        var countedSections = Math.floor(dataString.length / lengthDataSubString);
        // часть переданной строки в %
        var sendingAmount = "0";

        // текущий статус передачи строки отображающийся в модельном окне
        var savingCurrentStatus = getLang("savingchanges"); 

        // элементы модального окна отобрающего процесс передачи строки
        var saveProgressBar = document.getElementById("saveProgressBar");
        var saveTextStatus = document.getElementById("savingTextStatus");
        var savingCloseButton = document.getElementById("saveConfigcloseButton");
        var saveButton = document.getElementById("saveWidgetsButton");
        var closeButton = document.getElementById("saveConfigsaveCloseButton");

        //Проверка была ли отменена передача строки
        if (config.cancel == false) {

            //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произашел TimeOut
            if (!httpResult.indexOf("%error") == 0) {

                if (counter < countedSections) {

                    subString = dataString.slice(counter * lengthDataSubString, (counter + 1) * lengthDataSubString);


                    if (counter == 0) {

                        filePartName = "setwebproperty?property=head";

                    }
                    else {

                        filePartName = "setwebproperty?property=body";

                    }

                    sendingAmount = Math.floor((lengthDataSubString * counter / dataString.length) * 100).toString();


                }
                else {

                    if (counter == countedSections) {

                        subString = dataString.slice(counter * lengthDataSubString);


                        if (counter == 0) {

                            filePartName = "setwebproperty?property=head";

                        }

                        else {

                            filePartName = "setwebproperty?property=tail";
                            sendingAmount = "100";

                            if (savingCloseButton !== undefined && savingCloseButton !== null) {
                                savingCloseButton.disabled = true;
                            }

                        }

                    }

                    else {



                        if (countedSections !== 0) {


                            sendingAmount = "100";
                            if (saveProgressBar !== undefined && saveProgressBar !== null) {
                                saveProgressBar.setAttribute("aria-valuenow", sendingAmount);
                                saveProgressBar.setAttribute("style", "width:" + sendingAmount + "%");
                                saveProgressBar.innerHTML = sendingAmount + "%";

                               // saveButton.hidden = true;
                                saveTextStatus.innerHTML = getLang("сhangessaved");
                                savingCloseButton.hidden = true;
                                closeButton.hidden = false;
                                config.cancel = true;
                            } 
                           

                            addToLogNL("Sending long config string. FINISHED. Result = OK!");
                            
                            return true;


                        }
                        else {

                            if (counter == 1) {

                                filePartName = "setwebproperty?property=tail";
                                subString = "";
                                sendingAmount = "100";

                                if (savingCloseButton !== undefined && savingCloseButton !== null) {
                                    savingCloseButton.disabled = true;
                                }


                            }
                            else {


                                sendingAmount = "100";
                                if (saveProgressBar !== undefined && saveProgressBar !== null) {
                                    saveProgressBar.setAttribute("aria-valuenow", sendingAmount);
                                    saveProgressBar.setAttribute("style", "width:" + sendingAmount + "%");
                                    saveProgressBar.innerHTML = sendingAmount + "%";

                                 //   saveButton.hidden = true;
                                    saveTextStatus.innerHTML = getLang("сhangessaved");
                                    savingCloseButton.hidden = true;
                                    closeButton.hidden = false;
                                    config.cancel = true;
                                }
                             
                                addToLogNL("Sending short config string. FINISHED. Result = OK!");
                                
                                return true;

                            }
                        }
                    }

                }

                counter++;


                if (saveProgressBar !== undefined && saveProgressBar !== null) {
                    saveProgressBar.setAttribute("aria-valuenow", sendingAmount);
                    saveProgressBar.setAttribute("style", "width:" + sendingAmount + "%");
                    saveProgressBar.innerHTML = sendingAmount + "%";
                    saveTextStatus.innerHTML = savingCurrentStatus;
                }
                

                addToLogNL("Sending config string. Still sending! " + filePartName);
                //вызов функции асинхронного выполнения RESTfull POST запроса 
                httpPostAsyncWithErrorReson(url, filePartName, subString, config.configSendAsync, counter, dataString, lengthDataSubString);

            }
            else { 

                //если HTTPClient вернул ошибку, сообщаем об ошибке в модальном окне если оно открыто, возвращаем false
                if (saveTextStatus !== undefined && saveTextStatus !== null) {
                    saveTextStatus.innerHTML = getLang("savechangeserror");
                    savingCloseButton.hidden = true;
                    closeButton.hidden = false;
                    config.cancel = true;
                }
                //возвращаем кнопку сохранить изменения
                if (saveButton !== undefined && saveButton !== null) {
                    saveButton.hidden = false;
                } 

               addToLogNL("Sending config string ERROR!" + httpResult);
                return false;

            }
        }
        else {
            // если была отменена передача строки (нажатие кнопки "отменить" в модельном окне), закрываем модельное окно и возвращаем false

            var modalWindowBody = document.getElementById("saveConfigModalBody");
            if (modalWindowBody !== null && modalWindowBody !== undefined) {
                $('#saveConfigModal').on('shown.bs.modal', function (e) {
                    $("#saveConfigModal").modal('hide');
                });
            }
 
            return false;
        }


    }

    /*
    configPropertiesToDriver: function () {
        var configPropertiesDriver = drivers.addDriver("config");
        drivers.newDriverProperty(configPropertiesDriver, "type", 14, "ri"); //14 is config driver type
        drivers.newDriverProperty(configPropertiesDriver, "language", configProperties.language, "");
        drivers.newDriverProperty(configPropertiesDriver, "speak", configProperties.speack, "b");
        drivers.newDriverProperty(configPropertiesDriver, "voice", configProperties.voice, "i");
        drivers.onDriverLoaded(configPropertiesDriver);
    }
    */
}

﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

function speak(text) {
    if (configProperties.speak === 'true') {
        try {
            var msg = new SpeechSynthesisUtterance(text);
            var voices = window.speechSynthesis.getVoices();
            msg.voice = voices[configProperties.voice];
            window.speechSynthesis.speak(msg);
        }
        catch (exception) {
            console.error(exception);
        }
    }
}﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Этот класс реализует объектную модель драйвер подключенных к микроконтроллеру.
// 
// Перед началом изучения этого класса - вызовите API getalldriversproperties и изучите формат передачи
// свойств драйвер: http://yournodeurl:yournodeport/getalldriversproperties (например http://192.168.1.10:8084/getalldriversproperties)

// Примечания:
// "парсинг" - синтаксический анализ https://ru.wikipedia.org/wiki/%D0%A1%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7
// "распарсить" - подвергнуть синтаксическому анализу
// "актуатор" - исполнительное драйвер https://ru.wikipedia.org/wiki/%D0%98%D1%81%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5_%D1%83%D1%81%D1%82%D1%80%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%BE
// "сенсор" - датчик https://ru.wikipedia.org/wiki/%D0%94%D0%B0%D1%82%D1%87%D0%B8%D0%BA
// "event" - событие
// "driver" - драйвер, в данном контексте любой сенсор или актуатор подключенный к микроконтроллеру

/*
 *  The structure:
 *  drivers.drivers[*] (events: newDriver, driverLoaded)
 *                  |--->driver1[*] (events: newProperty)
 *                  |            |--->property1[*] (events: networkStatus, value)
 *                  |            |              |-->parentId
 *                  |            |              |-->networkStatus  
 *                  |            |              |-->value
 *                  |            |              |--> ...
 *                  |            |
 *                  |            |--->property2[*] (events: networkStatus, value)
 *                  |            |              |-->parentId
 *                  |            |              |-->networkStatus
 *                  |            |              |-->value
 *                  |            |              |--> ...
 *                  |            |
 *                  |            |--->property...[*]
 *                  |            |
 *                  |--->driver2[*] (events: newProperty)
 *                  |            |--->property1[*] (events: networkStatus, value)
 *                  |            |              |-->parentId
 *                  |            |              |-->networkStatus
 *                  |            |              |-->value
 *                  |            |              |--> ...
 *                  |            |
 *                  |            |--->property2[*] (...)
 *                  |            |              |-->parentId
 *                  |            |              |-->networkStatus
 *                  |            |              |-->value
 *                  |            |              |--> ...
 *                  |            |
 *                  |            |--->property...[*]
 *                  |--->driver...[*]
 *                  |            |--->property...[*]
 *                  |            |              |-->... 
 * ----------------------------------------------------------------------------------------------------------
 * События (events):
 * Уровня объекта drivers:
 * - networkStatus сетевое состояние всего модуля
 * - newDriver новое драйвер найдено при парсинге
 * - driverLoaded парсинг свойств очередного драйвера завершен (обратите внимание на свойство driver._new - true если это новое драйвер)
 * Уровня объекта driver:
 * - newProperty когда при парсинге найдено новое свойство драйвера
 * Уровня объекта driverProperty:
 * - networkStatus когда состояние сети изменилось - Online, Offline, Error или Reconnect
 * - value когда значение свойства драйвер изменилось (либо при парсинге, либо программно - например актуатор поменял состояние с OFF на ON)
 */

//Drivers type codes:
const TestDriverType = 0;
const DHTDriverType = 1;
const LightDriverType = 2;
const SmokeDriverType = 3;
const MotionDriverType = 4;
const SensorDriverType = 5;
const StepperDriverType = 6;
const LCDDriverType = 7;
const ActuatorDriverType = 8;
const OptoDriverType = 9;
const ValveDriverType = 10;
const WiFiDriverType = 11;
const NetworkDriverType = 12;
const ESPDriverType = 13;
const ConfigDriverType = 14;

var drivers = {
    // результат getalldriversproperties либо пустая строка
    
    //массив объектов с драйверами
    //drivers: [],

    //запросить свойства драйвер, если удачно - распарсить результат, обновить свойства объектов с драйверами (drivers[])
    //асинхронный
    //вызывается внешним кодом, обычно с интервалом 10-15 секунд (смотрите index.js)
    refresh: function (node) {
        node.networkStatus = NET_REFRESH;
        // асинхронный HTTP запрос
        // this.refreshResult - метод который будет вызван HTTPClient-ом по окончанию асинхронного запроса
        // this - ссылка на экземпляр этого объекта        
        httpGetAsyncWithReciever(node.host + "getalldriversproperties", this.refreshResult, node);
    },

    //вызывается асинхронным HTTPClient по окончанию запроса, указан как параметр в httpGetAsyncWithReciever, смотрите this.refresh()
    //httpResult - результат запроса
    //asyncReciever - ссылка на объект сделавший запрос (этот метод будет вызван в контексте другого потока, для него this. это другой объект - занимательный мир JS)
    //мы не можем использовать this, для обращения к методам этого объекта, поэтому заведомо передали себе ссылку на себя "asyncReciever"
    refreshResult: function (httpResult, node) {
        //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произошел TimeOut
        if (!httpResult.indexOf("%error")==0) {
            node.networkStatus = NET_ONLINE;
            //если запрос был выполнен удачно, парсим новые данные об драйверах, изменяем свойства drivers[] и добавляем новые driver если они появились
            //перед изучением парсинга, посмотрите результат API getalldriversproperties как текст
            //!-> asyncReciever это этот же класс drivers!
            drivers.parseDrivers(httpResult, node);

        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (httpResult.indexOf("reponse")!=-1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            node.parsedDrivers = "";
        }
    },
    //-------------------------------------------------------------------------------------------------------------
    //реализация механизма событий по принципу Listners 
    //в этом случае сторонние объекты подписываются на события этого объекта, который в свою очередь обязуется их вызвать 
    //подписанные методы, если соответствующие события произойдут
    //массив "подписантов", содержит ссылки на объекты типа {метод, объект} - где метод который надо вызвать, объект - ссылка на объект 
    //делавший подписку    
    newDriverListners: [],
    //подписка для внешних объектов - _event - метод в классе подписчике для вызова, _sender класс подписчик
    //--> данная подписка для события которое вызовется в случае добавления нового драйвера в список
    addNewDriverListner: function (_event, _sender) {
        this.newDriverListners.push(event = {
            event: _event,
            sender: _sender
        });
    },

    driverLoadedListners: [],
    addDriverLoadedListner: function (_event, _sender) {
        this.driverLoadedListners.push(event = {
            event: _event,
            sender: _sender
        });
    },
    onDriverLoaded: function (driver) {
        for (var k = 0; k < this.driverLoadedListners.length; k++) {
            this.driverLoadedListners[k].event(this.driverLoadedListners[k].sender, driver);
        }
    },
    //получить объект драйвера по его ID
    getDriverById: function (driverId, host) {
        var node = config.getNodeByHost(host);
        if (node == undefined) return undefined;
        for (var i = 0; i < node.drivers.length; i++) {
            if (node.drivers[i]._id === driverId) {
               return node.drivers[i];
            }                
        }
        return undefined;
    },
    //-------------------------------------------------------------------------------------------------------------
    //парсинг (синтаксический разбор) свойств драйвер прошедших от микроконтроллер - смотрите refresh()
    //этот метод будет вызываться множество раз, по этой причине он не только создает драйвера и их свойства
    //а так же проверяет было ли драйвер создано и как изменились его свойства после предыдущего парсинга
    parseDrivers: function (httpResult, node) {
        //первичный парсинг, помещаем строку пришедшую от HTTPClient в массив строк, разделяя по "\n"
        node.recievedDriversProperties = httpResult.split("\n");
        
        if (node.recievedDriversProperties !== "") {//если первичный парсинг удался
            
            var driver = undefined; //сбрасываем будущий объект со свойствами драйвера 
            
            for (var i = 0; i < node.recievedDriversProperties.length; i++) {//перечисляем все строки в HTTPResult 
                if (node.recievedDriversProperties[i] === "") continue; //если строка пуста, берем следующею
                //--> разбор драйвер
                if (node.recievedDriversProperties[i].indexOf("properties for:")==0) { //если заголовок драйвера найден                    

                    if (driver != undefined) {
                        this.onDriverLoaded(driver);
                    }
                    driver = undefined;
                    //извлекаем ID очередного драйвера
                    currentId = node.recievedDriversProperties[i].split(":")[1];
                    //пробуем отыскать драйвер с таким ID среди уже существующих 
                    for (var j = 0; j < node.drivers.length; j++) {
                        if (node.drivers[j]._id === currentId) { //драйвер с таким ID существует
                            driver = node.drivers[j]; //указываем существующее драйвер как обрабатываемое в текущей итерации 
                            driver._new = false;
                            newDriver = false; //указываем для текущее драйвер уже существует
                            break; //прекращаем поиск, драйвер найдено
                        }
                    }

                    if (driver == undefined) {//если драйвер с текущем ID еще не существуем 
                        driver = this.addDriver(currentId, node);
                    }
                }
                //--> разбор свойств драйвер
                else {//если текущая строка не является объявлением очередного драйвера, значит эта строка со свойством и значением свойства от последнего найденного драйвера
                    //свойства драйвер должны быть в формате [PropertyName]=[PropertyValue]<[//]PropertyType>
                    //где:
                    //PropertyName - название свойства(уникальное в рамках одного драйвера)
                    //PropertyValue - значение этого свойства
                    //если после значения свойства указаны "//" то после них должны идти флаги с PropertyType типом свойства
                    //PropertyType флаги: один символ-один флаг, регистр имеет значение                    
                    //r - read only
                    //s - selected
                    //p - password
                    //
                    //b - boolean
                    //f - float
                    //i - integer
                    //if no type = string <!-------- ЕСЛИ типы b,f,i не указаны то свойства считается string (строка)
                    //if not read only - write accessable

                    //вторичный парсинг, помещаем строку в массив, разделяя по "=", первый элемент название, второй значение и тип
                    var parsedProp = node.recievedDriversProperties[i].split("=");
                    if (parsedProp.length < 2) continue; //не удалось распарсить свойство
                    //забираем название свойства
                    var propertyName = parsedProp[0];
                    //третичный парсинг, разделяем по "//", первый элемент значение, второй либо тип либо (если тип не указан) массив будет состоять из одного элемента
                    //NOTE: не указание "//" на стороне сборщика свойств - является ошибкой, хотя бы пустые скобки
                    var splitterPos = parsedProp[1].lastIndexOf("//");
                    if (splitterPos != -1) {
                        var propertyValue = parsedProp[1].slice(0, splitterPos);
                        var propertyType = parsedProp[1].slice(splitterPos + 2, parsedProp[1].lenght);
                    }
                    else {
                        var propertyValue = parsedProp[1];
                        var propertyType = "";
                    } 

                    if (driver[propertyName] != undefined) {//если такое свойство уже существует
                        if (driver[propertyName].value != propertyValue) {//и если предыдущее значение не равно текущему                            
                            driver[propertyName].value = propertyValue;//меняем значение свойства на новое
                        }
                    }
                    else { //если такого свойства еще нет у объекта, создаем его, смотрите метод "newDriverProperty"
                        this.newDriverProperty(driver, propertyName, propertyValue, propertyType);
                    }
                }
            } //ENDOF for
            if (driver != undefined) {
                this.onDriverLoaded(driver);
            }
        }
    }, //ENDOF parse drivers

    addDriver: function (currentId, node) {
        driver = { //создаем новый объект представляющий драйвер
            _id: currentId, //навастриваем уникальный ID драйвера, для идентификации объекта с драйверм в будущем
            _new: true,
            _nodenickname: node.nodenickname,
            _host: node.host,
            //создаем внутри объекта драйвера, свойства и методы для обслуживания сторонних объектов желающих подписаться на
            //событие - создания нового свойства у драйвера, смотрите newDriverListners[] в классе drivers для большей информации
            //массив подписчиков на newProperty event
            newPropertyListners: [],
            //метод для организации подписки
            addNewPropertyListner: function (_event, _sender) {
                this.newPropertyListners.push(event = {
                    event: _event,
                    sender: _sender
                });
            },
        }; //новый объект для драйвера сформирован
        //добавляем объект драйвер в список драйвер для объекта drivers
        node.drivers.push(driver);
        //произошло событие newDriver -> вызываем всех его подписчиков(точнее вызываем методы которые подписчики предоставили ранее, смотрите: addNewDriverListner )
        for (var k = 0; k < this.newDriverListners.length; k++) {
            this.newDriverListners[k].event(this.newDriverListners[k].sender, driver);
        }
        return driver;
    },

    //добавляет новое свойство в существующее драйвер
    //ну вот казалось бы - того свойства - название, значение, тип...но на практике, в целостной системе есть множество зависимых объектов
    //взаимодействующих со свойствами драйвер - изменяют их, зависят от их значения и так далее.
    //Например, индикатор температуры "следит" за значением свойства tepmerature в драйвере termometr
    //За этим же свойством следит и график температуры и таблица отображающая свойства  termometr
    //есть два пути как решать такую задачу
    //1) все "заинтересованные" объекты, по мере надобности опрашивают соответствующие свойства драйвера
    //2) все "заинтересованные" объекты подписываются на событие которое будет вызвано объектом драйвера, только в том случае если значение свойства изменится.
    //мы идем по второму пути - следящих объектов может быть сколько угодно, они ничего не делают пока свойство драйвера не изменится.
    //по этой причине, хоть это может и показаться странным - в классе drivers больше кода обслуживает не само драйвера, а его свойства. 
    newDriverProperty: function (driver, propertyName, propertyValue, propertyType) {
        //создаем новое свойство
        driver[propertyName] = {
            parenthost: driver._host,
            parentid: driver._id, //запоминаем какому драйверу оно принадлежит
            name: propertyName, //назначаем имя свойства            
            _value: propertyValue, //истинное прямое значение свойства
            set value(value) { //метод для изменения значения свойства (для внешнего вызова)
                this._value = value; //запоминаем предложение новое значение свойства
                //перечисляем всех подписчиков события изменения свойства драйвера
                for (var k = 0; k < this.valueListners.length; k++) {
                    this.valueListners[k].event(this.valueListners[k].sender, this); //вызываем всех кто подписался
                }
            },
            get value() { //для тех объектов которые хотят получить значение свойства 
                return this._value;
            },
            valueListners: [], //массив подписчиков на событие изменения свойства(смотрите this.newDriverListners для большей информации о механизме событий)
            addValueListner: function (_event, _sender) { //регистрация подписки на изменения свойства                
                try { //проверяем готов ли метод слушателя для обработчики этого события
                    _event(_sender, this);
                } catch(exception)
                {
                    console.error(exception);
                    return; //неправильный метод либо не существует, либо вызовет исключение, не включаем его в число подписчиков
                }
                //добавляем нового подписчика в valueListners: [], добавляется как объект-элемент массива, где _event метод обработчик из другого объекта, _sender подписанный объект
                this.valueListners.push(event = {
                    event: _event,
                    sender: _sender
                });
            },
            //endof driver property value ---------------------------------
            type: propertyType, //тип свойства -> "si" - выделенный integer, "p" - пароль, "br" - boolean readonly, "" - string которую можно изменять

            //далее идут свойсва и методы необходимые для организации асинхронного RESTful взаимодействия свойства объекта с драйверм
            sendedValue: undefined, //временно хранилища, для желаемого нового значения свойства, которое будет назначено если HTTPCient не вернет ошибки            
            //сетевое состояние свойства - онлайн, оффлайн, пере подсоединение ("в работе"), ошибка --> по умолчанию онлайн
            _networkStatus: NET_ONLINE,
            set networkStatus(networkStatus) { //для контроля изменения _networkStatus, для оповещения подписчиков
                this._networkStatus = networkStatus; //сохранить новое сетевое состояние
                for (var k = 0; k < this.networkStatusListners.length; k++) { //оповестить всех подписчиков
                    this.networkStatusListners[k].event(this.networkStatusListners[k].sender, this);
                }
            },
            get networkStatus() {//получить текущее сетевое состояние
                return this._networkStatus;
            },
            networkStatusListners: [], //подписчики на изменение сетевого состояния свойства
            addNetworkStatusListner: function (_event, _sender) { //для добавления нового подписчика(так же как и addValueListner)                                
                //check event listner and setup current network status 
                try {
                    _event(_sender, this);
                } catch (exception) {
                    console.error(exception);
                    return; // don't add bad listner
                }
                this.networkStatusListners.push(event = { event: _event, sender: _sender });
            },
            //endof network status property, event and listners       
            //сетевое ("физическое") изменение свойства драйвера 
            //вызов этого метода приведет к асинхронному вызову RESTful API изменяющей свойства драйвера на стороне Unit
            setValue: function (_value, upperReciever, upperSender) {
                if (this.networkStatus == NET_RECONNECT) {//если текущее сетевое состояния свойства - в работе (пере подключение), ничего не делаем выходим
                    return;
                }
                else {
                    if (this.networkStatus == NET_ONLINE) {//если текущее состояние "в сети" можем вызывать API
                        this.networkStatus = NET_RECONNECT; //переключаем сетевое состояние в режим "в работе"
                        this.sendedValue = _value; //сохраняем новое значение(которое пытаемся установить) во временное свойство
                        //мы не проверяем тип свойства - перекладывая это на сторону микроконтроллера - мог ошибится автор UI или автор прошивки.
                        //например если автор UI не учел реакцию на флаг "r"-eadonly --> API вернет ошибку
                        //делаем асинхронный вызов API                        
                        //передаем метод в этом объекте который надо вызвать по окончанию ссылку на этот объект свойства this.setValueReciever и this
                        //обратите внимание - передаем не value а this.sendedValue - значение на которое хотим изменить это свойство
                        setDriverPropertyAsyncWithReciever(this.parenthost, this.parentid, this.name, this.sendedValue, this.setValueReciever, upperReciever, this, upperSender);
                    }
                    else { //если сетевое состояние "не в сети" или "пере подключение", заменяем вызов для установки значения, на вызов для пере подключения и получения текущего значения
                        //идея в том, что на верхнем уровне, если пользователь попытается изменить значение свойство, в тот момент когда драйвер было не в сети или содержало ошибку
                        //то вместо назначения свойства, будет проведено пере подключение и попытка получить текущее значение с драйвера.
                        //например, реле и лампочкой управляет 5 пользователей, произошел сетевой сбой, и все ушли в офлайн.За какое то время сеть восстановилась, но некоторые
                        //пользователя запомнили состояние реле как включено, некоторые как выключено - и те и другие пробуют изменить это значения, не зная о его текущем состоянии.
                        //По этой причине, мы перекрываем такие действия, переводя их в направлении получения значения, перед тем как оно будет изменено.
                        //НО - не запрещаем "обновить" статус свойства и получить новое значение - изменить его можно будет после возвращения в онлайн и получения последнего актуального значения. 
                        this.getValue(upperReciever, upperSender);
                    }
                }
            },
            //асинхронный получатель будет вызван из HTTPClient после попытки изменить свойство драйвера
            //как было сказано выше - это будет другой поток и мы не имеем право использовать this
            setValueReciever: function (HTTPResult, upperReciever, sender, upperSender) {
                if (!HTTPResult.indexOf("%error")==0) {//если не было сетевой ошибки
                    if (HTTPResult === "1") { //микроконтроллер  вернет "1" в качестве результата, если удалось изменить значения свойства драйвера
                        sender.networkStatus = NET_ONLINE; //разрешаем сетевой статус как "в сети" - до этого мы переходили в статус "в работе"
                        sender.value = sender.sendedValue; //ранее мы сохранили желаемое значение свойства, назначаем его в качестве нового значения свойства драйвера
                        //^^смотрите реализацию setter-a свойства value - все подписчики узнают о том что свойство было изменено                        
                    }
                    else {
                        sender.networkStatus = NET_ERROR; //если HTTPClient сказал OK-200 но Unit не вернул "1" нам не удалось изменить свойство, переходим в статус "ошибка"
                    }
                }
                else {
                    if (!HTTPResult.indexOf("response")!=-1) {//если HTTPClient вернул "%error" и в этой строке не было слова "response" - соединение не было установлено, статус "не в сети"
                        sender.networkStatus = NET_OFFLINE;
                    }
                    else { //если ответ был, но он не HTTPResult 200 OK - ошибка либо драйвера либо Unit 
                        sender.networkStatus = NET_ERROR;
                    }
                }
                if (upperReciever != undefined) { //если были назначены вторичные получатели асинхронного вызова - их вызовут здесь
                    upperReciever(upperSender, sender); //(!НЕ ПУТАТЬ С ПОДПИСЧИКАМИ!)
                }
            },
            //получение значения свойства драйвера, асинхронно через RESTful API - реализовано так же как и setValueReciever
            //с той разницей что будет вызвано при всех статусах кроме "в работе"
            getValue: function (upperReciever, upperSender) {
                if (this.networkStatus == NET_RECONNECT) {
                    return;
                }
                this.networkStatus = NET_RECONNECT;
                getDriverPropertyAsyncWithReciever(this.parenthost, this.parentid, this.name, this.getValueReciever, upperReciever, this, upperSender);
            },
            //асинхронный получатель значения свойства, отличается от "Set", там что примет от HTTPClient новое значение свойства, если не было ошибки сети
            getValueReciever: function (HTTPResult, upperReciever, sender, upperSender) {
                if (!HTTPResult.indexOf("%error")==0) {
                    sender.networkStatus = NET_ONLINE; //возвращаемся в онлайн, были "в работе"
                    sender.value = HTTPResult; //новое значение свойства, все подписчики узнают об его изменении                    
                }
                else {
                    if (!HTTPResult.indexOf("response")!=-1) { //уходим в оффлайн если ошибки
                        sender.networkStatus = NET_OFFLINE;
                    }
                    else { //driver error
                        sender.networkStatus = NET_ERROR;
                    }
                }
                if (upperReciever != undefined) { //вызов вторичных получателей (НЕ ПУТАТЬ С ПОДПИСЧИКАМИ)
                    upperReciever(upperSender, sender);
                }
            }
        }//ENDOF creation new driver property object
        //после того как новое свойство драйвера создано, вызовем всех подписчиков соответствующего события
        for (var k = 0; k < driver.newPropertyListners.length; k++) {
            driver.newPropertyListners[k].event(driver.newPropertyListners[k].sender, driver[propertyName]);
        }

    }//ENDOF newDriverProperty method 
} //ENDOF drivers object 


﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var driversUI = {

    node: undefined,
    modalBody: undefined,



    formGroupDriverProperties: undefined,


    addDriver(node) {
        driversUI.node = node;

        makeModalDialog("resetPanel", "addDriver", getLang("adddriverdigalog") + " " + node.nodenickname, "");

        var modalFooter = document.getElementById("addDriverModalFooter");
        driversUI.modalBody = document.getElementById("addDriverModalBody");

        //var titleDriverText = driversUI.modalBody.appendChild(document.createElement("p"));
        //titleDriverText.innerHTML = getLang("driver");
        //titleDriverText.className = "text-center";

        driversUI.createDriverSelect();

        alertDiv = modalFooter.appendChild(document.createElement('div'));
        alertDiv.id = "alertDiv;"

        var addButton = modalFooter.appendChild(document.createElement("button"));
        addButton.type = "button";
        addButton.className = "btn btn-success btn-sm";
        addButton.id = "addDriverModalButton";
        addButton.innerText = getLang("adddriverbutton");
        addButton.alertDiv = alertDiv;
        addButton.onclick = driversUI.doAddDriverClick;



        $('#addDriverModal').on('hidden.bs.modal', function (event) { // назначаем обработчик события закрытия диалога 
            driversUI.modalBody.innerHTML = "";
        });

        $("#addDriverModal").modal('show');

        return false;

        /*
        driversUI.formGroup = modalBody.appendChild(document.createElement("div"));
        driversUI.formGroup.className = "form-group";
        label = driversUI.formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "idEdit");
        label.innerText = getLang("driverid");
        var idEdit = driversUI.formGroup.appendChild(document.createElement('input'));
        idEdit.className = "form-control form-control-sm";
        idEdit.id = "idInput";
        idEdit.placeholder = getLang("driveridplaceholder");


        driversUI.formGroup = modalBody.appendChild(document.createElement("div"));
        driversUI.formGroup.className = "form-group";
        driversUI.formGroup.id = "pin1Div";
        driversUI.formGroup.style.display = "none";
        label = driversUI.formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin1Select");
        label.innerText = getLang("pin") + " 1";
        var pin1Select = driversUI.formGroup.appendChild(document.createElement('select'));
        pin1Select.className = "form-control form-control-sm";
        pin1Select.id = "pin1Select";
        driversUI.appendDriverNotUsedPins(pin1Select);

        driversUI.formGroup = modalBody.appendChild(document.createElement("div"));
        driversUI.formGroup.className = "form-group";
        driversUI.formGroup.id = "pin2Div";
        driversUI.formGroup.style.display = 'none';
        label = driversUI.formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin2Select");
        label.innerText = getLang("pin") + " 2";
        var pin2Select = driversUI.formGroup.appendChild(document.createElement('select'));
        pin2Select.className = "form-control form-control-sm";
        pin2Select.id = "pin2Select";
        driversUI.appendDriverNotUsedPins(pin2Select);

        driversUI.formGroup = modalBody.appendChild(document.createElement("div"));
        driversUI.formGroup.className = "form-group";
        driversUI.formGroup.id = "pin3Div";
        driversUI.formGroup.style.display = 'none';
        label = driversUI.formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin3Select");
        label.innerText = getLang("pin") + " 3";
        var pin3Select = driversUI.formGroup.appendChild(document.createElement('select'));
        pin3Select.className = "form-control form-control-sm";
        pin3Select.id = "pin3Select";
        driversUI.appendDriverNotUsedPins(pin3Select);

        driversUI.formGroup = modalBody.appendChild(document.createElement("div"));
        driversUI.formGroup.className = "form-group";
        driversUI.formGroup.id = "pin4Div";
        driversUI.formGroup.style.display = 'none';
        label = driversUI.formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "pin4Select");
        label.innerText = getLang("pin") + " 4";
        var pin4Select = driversUI.formGroup.appendChild(document.createElement('select'));
        pin4Select.className = "form-control form-control-sm";
        pin4Select.id = "pin4Select";
        driversUI.appendDriverNotUsedPins(pin4Select);

        //Checkbox for auto widget adding
        var checkBoxDiv = modalBody.appendChild(document.createElement("div"));
        checkBoxDiv.className = "custom-control custom-checkbox";


        var checkBoxInput = checkBoxDiv.appendChild(document.createElement("input"));
        checkBoxInput.type = "checkbox";
        checkBoxInput.className = "custom-control-input";
        checkBoxInput.id = "autoAddWidget";
        checkBoxInput.checked = true;
        checkBoxInput.onchange = driversUI.checkBoxClick;

        var checkBoxLabel = checkBoxDiv.appendChild(document.createElement("label"));
        checkBoxLabel.className = "custom-control-label";
        checkBoxLabel.setAttribute("for", "autoAddWidget");
        checkBoxLabel.innerHTML = getLang("autoaddwidget");

        var addWidgetGroup = modalBody.appendChild(document.createElement("div"));
        addWidgetGroup.style.display = "none"; //"block"
        addWidgetGroup.id = "addWidgetGroup";

        var titleWidgetText = addWidgetGroup.appendChild(document.createElement("p"));
        titleWidgetText.innerHTML = getLang("widget");
        titleWidgetText.className = "text-center";

        //driver properties select
        driversUI.formGroupDriverProperties = addWidgetGroup.appendChild(document.createElement("div"));
        var driverPropLabel = driversUI.formGroupDriverProperties.appendChild(document.createElement("label"));
        driverPropLabel.setAttribute("for", "driverPropSelect");
        driverPropLabel.innerText = getLang("driversporplist");
        var driverPropSelect = driversUI.formGroupDriverProperties.appendChild(document.createElement('select'));
        driverPropSelect.className = "form-control form-control-sm";
        driverPropSelect.id = "driverPropertySelected";

        //widgets select 
        var driversUI.formGroupWidgetSelect = addWidgetGroup.appendChild(document.createElement("div"));
        var widgetLabel = driversUI.formGroupWidgetSelect.appendChild(document.createElement("label"));
        widgetLabel.setAttribute("for", "widgetSelect");
        widgetLabel.innerText = getLang("widgetslist");
        var widgetSelect = driversUI.formGroupWidgetSelect.appendChild(document.createElement('select'));
        widgetSelect.className = "form-control form-control-sm";
        widgetSelect.id = "widgetTypeSelected";



        var alertDiv = modalBody.appendChild(document.createElement('div'));

        // var modalFooter = modalContent.appendChild(document.createElement("div"));
        // modalFooter.className = "modal-footer";

        event = { currentTarget: typeSelect };
        driversUI.pinsAndWidget(event);

        var addButton = modalFooter.appendChild(document.createElement("button"));
        addButton.type = "button";
        addButton.className = "btn btn-success btn-sm";
        addButton.id = "addDriverModalButton";
        addButton.node = node;
        //   addButton.setAttribute("data-dismiss", "modal");
        addButton.typeSelect = typeSelect;
        addButton.idEdit = idEdit;
        addButton.pin1Select = pin1Select;
        addButton.pin2Select = pin2Select;
        addButton.pin3Select = pin3Select;
        addButton.pin4Select = pin4Select;
        addButton.alertDiv = alertDiv;
        addButton.onclick = driversUI.doAddDriverClick;
        addButton.innerText = getLang("adddriverbutton");
        */



    },


    createDriverSelect: function () {

        var formGroup = driversUI.modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        formGroup.id = "driverSelectFormGroup";

        var label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "driverTypeSelect");
        label.innerText = getLang("drivertype");
        //var inputDiv = driversUI.formGroup.appendChild(document.createElement("div"));

        //new

        driverSelect = document.createElement('select');
        driverSelect.className = "form-control form-control-sm";
        driverSelect.id = "driverTypeSelect";

        formGroup.appendChild(driverSelect);
        driverSelect.onchange = driversUI.onDriverSelectChange;


        for (var i = 0; i < driversUI.node.accessableDrivers.length; i++) {
            var driverSelectOption = driverSelect.appendChild(document.createElement('option'));
            driverSelectOption.innerText = driversUI.node.accessableDrivers[i].name;
            driverSelectOption.driver = driversUI.node.accessableDrivers[i];
        }

    },

    onDriverSelectChange: function (event) {
        var driverSelect = event.currentTarget;
        var driverSelectOption = driverSelect.options[driverSelect.selectedIndex];
        var driver = driverSelectOption.driver;
        while (driversUI.modalBody.childNodes.length > 1) {

            for (var i = 0; i < driversUI.modalBody.childNodes.length; i++) {
                {
                    var element = driversUI.modalBody.childNodes[i];
                    if (element.id == undefined) continue;
                    if (element.id.indexOf("driverSelectFormGroup") == -1) {

                        driversUI.modalBody.removeChild(element);
                        element.innerHTML = "";
                        break;
                    }
                }
            }
        }

        //ID Input          
        formGroup = driversUI.modalBody.appendChild(document.createElement("div"));
        formGroup.className = "form-group";
        label = formGroup.appendChild(document.createElement("label"));
        label.setAttribute("for", "idEdit");
        label.innerText = getLang("driverid");
        var idEdit = formGroup.appendChild(document.createElement('input'));
        idEdit.className = "form-control form-control-sm";
        idEdit.id = "idInput";
        idEdit.value = driver.name;
        idEdit.placeholder = getLang("driveridplaceholder");

        //Pin selects
        for (var i = 0; i < driver.pinscount; i++) {


            if ((driver["pintype" + i] & I2CADDR_MASK) == 0) { //not I2C ADDR

                var formGroup = driversUI.modalBody.appendChild(document.createElement("div"));
                formGroup.className = "form-group";
                formGroup.id = "driverPinForm" + i;

                var label = formGroup.appendChild(document.createElement("label"));
                label.setAttribute("for", "driverPinSelect" + i);
                label.innerText = "pin " + String(i + 1) + driver["pintypedecoded" + i];

                pinSelect = document.createElement('select');
                pinSelect.className = "form-control form-control-sm";
                pinSelect.id = "driverPinSelect" + i;

                formGroup.appendChild(pinSelect);
                //driverSelect.onchange = driversUI.onDriverSelectChange;

                var pins = getFreePins(driversUI.node, driver["pintype" + i]);
                if (pins.length > 0) {
                    var pinSelectOption = pinSelect.appendChild(document.createElement('option'));
                    pinSelectOption.innerText = getLang("PleaseSelectPin");
                    for (var j = 0; j < pins.length; j++) {
                        var pinSelectOption = pinSelect.appendChild(document.createElement('option'));
                        pinSelectOption.innerText = pins[j].name;
                        pinSelectOption.pin = pins[j];
                        pinSelectOption.driverPinNumber = i;
                    }
                }
                else {
                    pinSelect.enable = false;
                    var pinSelectOption = pinSelect.appendChild(document.createElement('option'));
                    pinSelectOption.innerText = getLang("NoFreePinsOfThisType");
                }
            }
            else { //I2C Addr 
                formGroup = driversUI.modalBody.appendChild(document.createElement("div"));
                formGroup.className = "form-group";
                label = formGroup.appendChild(document.createElement("label"));
                label.setAttribute("for", "idEdit");
                label.innerText = "I2C Address at 'ADDR0xNN' format";
                var I2CAdddrEdit = formGroup.appendChild(document.createElement('input'));
                I2CAdddrEdit.className = "form-control form-control-sm";
                I2CAdddrEdit.id = "driverPort" + i;
                I2CAdddrEdit.value = "ADDR0x..";
                I2CAdddrEdit.placeholder = getLang("driveridplaceholder");
                I2CAdddrEdit.driverPinNumber = i;
            }

        }
    },

    doAddDriverClick: function (event) {
        event.stopPropagation();
        var addButton = event.currentTarget;
        var driverSelect = document.getElementById("driverTypeSelect");
        var driverSelectOption = driverSelect.options[driverSelect.selectedIndex];
        var driver = driverSelectOption.driver;
        var pinsString = "";
        for (var i = 0; i < driver.pinscount; i++) {
            var pinSelect = document.getElementById("driverPinSelect" + i);
            if (pinSelect != undefined) {
                pinsString += pinSelect.options[pinSelect.selectedIndex].innerText + ",";
            }
            else {
                var I2CAdddrEdit = document.getElementById("driverPort" + i);
                if (I2CAdddrEdit != undefined) {
                    pinsString += I2CAdddrEdit.value + ",";
                }
            }
        }
        //http://192.168.1.9:8084/adddriver?type=7&id=lcd1&pins=D21,D22,ADDR0x3F,VCC5,GND
        pinsString = "type=" + driver.type + "&id=" + document.getElementById("idInput").value + "&pins=" + pinsString;

        addButton.className = "btn btn-warning btn-sm";
        addButton.value = 'do...';
        addButton.disable = true;

        //TODO: decode Type from name 
        var httpResult = addDriver(driversUI.node.host, pinsString);

        if (httpResult == 1) {

            var autoAddWidgetCheckBox = document.getElementById("autoAddWidget");
            if (autoAddWidgetCheckBox !== null) {

                if (autoAddWidgetCheckBox.checked == true) {

                    var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");

                    var defaultWidgets = [];
                    var widgetLayer = "";
                    var widgetWrapper = "";
                }
            }




            $("#addDriverModal").modal('hide');
            // renderDriversProperties(); TODO model refresh
        }
        else {
            addButton.alertDiv.innerHTML = "";
            var addDriverAlert = addButton.alertDiv.appendChild(document.createElement('div'));
            addDriverAlert.className = "alert alert-danger";
            addDriverAlert.role = "alert";
            addDriverAlert.innerText = httpResult;

            addButton.className = "btn btn-success btn-sm";
            addButton.value = 'add';
        }
        addButton.disable = false;
        return false;

    },


    //Фильтры:
    //- на вход маска типа пина
    //- выход:
    //-проверяет какие пины свободны и соответстуют маски.
    //  - пункт селект по умолчанию не назначен
    //                - если не вернуло свободных пинов - селект блокируется и пишет - нет доступных свободных пинов данного типа(нет БОЛЬШЕ - проверте драйвера)
    //              - в фильтр скармливается массив пинов выбранный из остальных селектов - они не к чему не привязаны но влияют на выбор.

    //
    //        var pinSelectOption = pinSelect.appendChild(document.createElement('option'));
    //pinSelectOption.innerText = "- pin not selecter"
    //a потом цикл


    /*
    appendDriverPins: function (valueSelect) {
        var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("notused");
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D0";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D1";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D2";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D3";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D4";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D5";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D6";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D7";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D8";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D9";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "A0";

    },

    appendDriverDigitalOnlyPins: function (valueSelect) {
        var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D0";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D1";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D2";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D3";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D4";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D5";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D6";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D7";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D8";
        valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "D9";
    },

    appendDriverAnalogOnlyPins: function (valueSelect) {
        var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = "A0";
    },


    appendDriverNotUsedPins: function (valueSelect) {
        var valueSelectOption = valueSelect.appendChild(document.createElement('option'));
        valueSelectOption.innerText = getLang("notused");
    },


    pinsAndWidget: function (event) {
        var driverSelected = event.currentTarget;
        var maxPinsAmount = 4;
        var currentDiv = "";
        var currentOptions = "";
        var pinsInfo = [];

        switch (driverSelected.selectedIndex + 1) {
            case 1:
                pinsInfo.push("digital");
                console.log("dht");
                break;
            case 2:
                pinsInfo.push("analog");
                console.log("light sensor");
                break;
            case 3:
                pinsInfo.push("analog");
                console.log("smoke detector");
                break;
            case 4:
                pinsInfo.push("digital");
                console.log("motion detector");
                break;
            case 5:
                pinsInfo.push("digital");
                console.log("sensor driver");
                break;
            case 6:
                pinsInfo.push("digital", "digital", "digital", "digital");
                console.log("stepper driver");
                break;
            case 7:
                pinsInfo.push("digital", "digital");
                console.log("LCD");
                break;
            case 8:
                pinsInfo.push("digital");
                console.log("Actuator");
                break;
            case 9:
                pinsInfo.push("digital", "digital");
                console.log("Opto driver");
                break;
            case 10:
                pinsInfo.push("digital", "digital", "analog");
                console.log("valve driver");
                break;


            default:
                pinsInfo.push("notused");
                console.log('default');
        }

        for (var pinsIndex = 0; pinsIndex < maxPinsAmount; pinsIndex++) {

            var divId = pinsIndex + 1;

            currentDiv = document.getElementById("pin" + divId + "Div");

            if (currentDiv !== null) {

                if (pinsIndex < pinsInfo.length) {
                    currentDiv.style.display = 'block';
                }
                else {
                    currentDiv.style.display = 'none';
                }
            }

            currentOptions = document.getElementById("pin" + divId + "Select");

            if (currentOptions !== null) {

                currentOptions.options.length = 0;

                if (pinsIndex < pinsInfo.length) {
                    switch (pinsInfo[pinsIndex]) {
                        case "digital":
                            driversUI.appendDriverDigitalOnlyPins(currentOptions);
                            console.log("digital");
                            break;
                        case "analog":
                            driversUI.appendDriverAnalogOnlyPins(currentOptions);
                            console.log("analog");
                            break;
                        case "universal":
                            driversUI.appendDriverPins(currentOptions);
                            console.log("universal");
                            break;
                        default:
                            driversUI.appendDriverNotUsedPins(currentOptions);
                            console.log('notused');
                    }
                }
                else {
                    driversUI.appendDriverNotUsedPins(currentOptions);
                }
            }



        }

        pinsInfo.length = 0;
    },

    doAddDriverClick: function (event) {
        event.stopPropagation();
        var addButton = event.currentTarget;
        var node = addButton.node;

        addButton.className = "btn btn-warning btn-sm";
        addButton.value = 'do...';
        addButton.disable = true;

        //TODO: decode Type from name 
        var httpResult = addDriver(node.host, addButton.typeSelect.selectedIndex + 1, addButton.idEdit.value, addButton.pin1Select.value, addButton.pin2Select.value, addButton.pin3Select.value, addButton.pin4Select.value);

        if (httpResult == 1) {

            var autoAddWidgetCheckBox = document.getElementById("autoAddWidget");
            if (autoAddWidgetCheckBox !== null) {

                if (autoAddWidgetCheckBox.checked == true) {

                    var driversWidgetsPanel = document.getElementById("driversWidgetsPanel");

                    var defaultWidgets = [];
                    var widgetLayer = "";
                    var widgetWrapper = "";

                    switch (addButton.typeSelect.selectedIndex + 1) {

                        case 1:

                            defaultWidgets.push({
                                widgetType: "temperature",
                                driverPropertyName: "temperature"
                            }, {
                                widgetType: "humidity",
                                driverPropertyName: "humidity"
                            }, {
                                widgetType: "historydatagraph",
                                driverPropertyName: "humidityhistorydata"
                            }, {
                                widgetType: "historydatagraph",
                                driverPropertyName: "temperaturehistorydata"
                            });


                            console.log("dht widgets");
                            break;
                        case 2:

                            defaultWidgets.push({
                                widgetType: "light",
                                driverPropertyName: "light"
                            });


                            console.log("light sensor widgets");
                            break;
                        case 3:

                            defaultWidgets.push({
                                widgetType: "smoke",
                                driverPropertyName: "smoke"
                            }, {
                                widgetType: "historydatagraph",
                                driverPropertyName: "historydata"
                            });


                            console.log("smoke detector widgets");
                            break;
                        case 4:

                            defaultWidgets.push({
                                widgetType: "motion",
                                driverPropertyName: "motion"
                            }, {
                                widgetType: "historydatagraph",
                                driverPropertyName: "historydata"
                            });

                            console.log("motion detector");
                            break;
                        case 5:

                            defaultWidgets.push({
                                widgetType: "sensor",
                                driverPropertyName: "sensor"
                            }, {
                                widgetType: "historydatagraph",
                                driverPropertyName: "historydata"
                            });

                            console.log("sensor driver");
                            break;
                        case 6:

                            defaultWidgets.push({
                                widgetType: "value",
                                driverPropertyName: "position"
                            }, {
                                widgetType: "historydatagraph",
                                driverPropertyName: "historydata"
                            });

                            console.log("stepper driver");
                            break;
                        case 7:
                            defaultWidgets.push({
                                widgetType: "lcd",
                                driverPropertyName: "text"
                            });

                            console.log("LCD");
                            break;
                        case 8:

                            defaultWidgets.push({
                                widgetType: "actuator",
                                driverPropertyName: "data"
                            }, {
                                widgetType: "historydatagraph",
                                driverPropertyName: "historydata"
                            });

                            console.log("Actuator");
                            break;
                        case 9:

                            defaultWidgets.push({
                                widgetType: "value",
                                driverPropertyName: "data"
                            }, {
                                widgetType: "historydatagraph",
                                driverPropertyName: "historydata"
                            });


                            console.log("Opto driver");
                            break;
                        case 10:

                            defaultWidgets.push({
                                widgetType: "value",
                                driverPropertyName: "position"
                            }, {
                                widgetType: "historydatagraph",
                                driverPropertyName: "historydata"
                            });

                            console.log("valve driver");
                            break;

                        default:
                            alert("Íåò òàêèõ çíà÷åíèé");
                    }

                    if (defaultWidgets.length !== 0) {
                        for (var defaultWidgetIndex = 0; defaultWidgetIndex < defaultWidgets.length; defaultWidgetIndex++) {
                            widgetLayer = WidgetsLayer.getWidgetById(defaultWidgets[defaultWidgetIndex].widgetType); ///òèï âèäæåòà (widget id)
                            if (widgetLayer !== undefined) {

                                widgetWrapper = new widgetLayer.widget(driversWidgetsPanel, undefined, undefined, configProperties.dashboards[0].widgets[0], undefined);
                                widgetWrapper.offlineStarter(driversWidgetsPanel, addButton.idEdit.value, defaultWidgets[defaultWidgetIndex].driverPropertyName);
                                widgetWrapper.widget.onchange = config.onWidgetChange;
                                widgetWrapper.widget.ondelete = config.onWidgetDelete;
                                config.addWidget("main", addButton.idEdit.value, defaultWidgets[defaultWidgetIndex].driverPropertyName, defaultWidgets[defaultWidgetIndex].widgetType, widgetWrapper.widget.id, widgetWrapper.widget.properties);

                            }
                        }
                    }

                    defaultWidgets.length = 0;

                }
            }


            $("#addDriverModal").modal('hide');
            // renderDriversProperties(); TODO model refresh
        }
        else {
            addButton.alertDiv.innerHTML = "";
            var addDriverAlert = addButton.alertDiv.appendChild(document.createElement('div'));
            addDriverAlert.className = "alert alert-danger";
            addDriverAlert.role = "alert";
            addDriverAlert.innerText = httpResult;

            addButton.className = "btn btn-success btn-sm";
            addButton.value = 'add';
        }
        addButton.disable = false;
        return false;

    },


    driverClick: function (event) {
        var button = event.currentTarget;
        document.location = button.href;
        return false;
    },

    checkBoxClick: function (event) {
        var checkBox = event.currentTarget;
        var divGroup = document.getElementById("addWidgetGroup");

        if (checkBox.checked == true) {
            //TODO ñìåíèòü íà "block" äàâàÿ âîçìîæíîñòü âûáðàòü ñâîéñòâî è âèäæåò 
            divGroup.style.display = "none";
        }
        else {

            divGroup.style.display = "none";
        }

        return true;
    }
    */
}
﻿var xmlns = "http://www.w3.org/2000/svg";

/*
 * Material design icons is the official [icon set](https://www.google.com/design/spec/style/icons.html#icons-system-icons) from Google.  The icons are designed under the [material design guidelines](https://material.io/guidelines/).
 */
var addIcon = "M42 6H6c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h10v4h16v-4h10c2.21 0 3.98-1.79 3.98-4L46 10c0-2.21-1.79-4-4-4zm0 28H6V10h36v24zM32 20v4h-6v6h-4v-6h-6v-4h6v-6h4v6h6z";
var cloudIcon = "M38.71 20.07C37.35 13.19 31.28 8 24 8c-5.78 0-10.79 3.28-13.3 8.07C4.69 16.72 0 21.81 0 28c0 6.63 5.37 12 12 12h26c5.52 0 10-4.48 10-10 0-5.28-4.11-9.56-9.29-9.93zM38 36H12c-4.42 0-8-3.58-8-8s3.58-8 8-8h1.42c1.31-4.61 5.54-8 10.58-8 6.08 0 11 4.92 11 11v1h3c3.31 0 6 2.69 6 6s-2.69 6-6 6z";
var motionIcon = "M24 22c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm12 4c0-6.63-5.37-12-12-12s-12 5.37-12 12c0 4.44 2.41 8.3 5.99 10.38l2.02-3.48C17.62 31.51 16 28.96 16 26c0-4.42 3.58-8 8-8s8 3.58 8 8c0 2.96-1.62 5.51-4.01 6.89l2.02 3.48C33.59 34.3 36 30.44 36 26zM24 6C12.95 6 4 14.95 4 26c0 7.39 4.02 13.83 9.99 17.29l2-3.46C11.22 37.07 8 31.91 8 26c0-8.84 7.16-16 16-16s16 7.16 16 16c0 5.91-3.22 11.07-7.99 13.84l2 3.46C39.98 39.83 44 33.39 44 26c0-11.05-8.96-20-20-20z";
var temperatureIcon = "M24 4C12.97 4 4 12.97 4 24s8.97 20 20 20 20-8.97 20-20S35.03 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16zm6-16c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6 6 2.69 6 6z";
var leftIcon = "M30.83 14.83L28 12 16 24l12 12 2.83-2.83L21.66 24z";
var rightIcon = "M20 12l-2.83 2.83L26.34 24l-9.17 9.17L20 36l12-12z";
var plusIcon = "M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm10 22h-8v8h-4v-8h-8v-4h8v-8h4v8h8v4z";
var minusIcon = "M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm10 22H14v-4h20v4z";
var menuIcon = "M44 18v-4h-4v-4c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4v28c0 2.2 1.8 4 4 4h28c2.2 0 4-1.8 4-4v-4h4v-4h-4v-4h4v-4h-4v-4h4zm-8 20H8V10h28v28zM12 26h10v8H12zm12-12h8v6h-8zm-12 0h10v10H12zm12 8h8v12h-8z";
var lampIcon = "M7.1 37.07l2.83 2.83 3.59-3.59-2.83-2.83-3.59 3.59zM22 44.9h4V39h-4v5.9zM8 21H2v4h6v-4zm22-8.38V3H18v9.62c-3.58 2.08-6 5.94-6 10.38 0 6.63 5.37 12 12 12s12-5.37 12-12c0-4.44-2.42-8.31-6-10.38zM40 21v4h6v-4h-6zm-5.51 15.31l3.59 3.59 2.83-2.83-3.59-3.59-2.83 2.83z";
var wifiIcon = "M7.07 21.91l16.92 21.07.01.02.02-.02 16.92-21.07C40.08 21.25 33.62 16 24 16c-9.63 0-16.08 5.25-16.93 5.91z";
var buildIcon = "M45.4 37.9L27.1 19.6c1.8-4.6.8-10.1-2.9-13.8-4-4-10-4.8-14.8-2.5l8.7 8.7-6.1 6.1-8.7-8.7C1 14.2 1.8 20.2 5.8 24.2c3.7 3.7 9.2 4.7 13.8 2.9l18.3 18.3c.8.8 2.1.8 2.8 0l4.7-4.7c.8-.7.8-2 0-2.8z";
var deleteIcon = "M29.17 16L24 21.17 18.83 16 16 18.83 21.17 24 16 29.17 18.83 32 24 26.83 29.17 32 32 29.17 26.83 24 32 18.83 29.17 16zM24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z";



/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

/*
// convert 0..255 R,G,B values to binary string
RGBToBin = function (r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return (function (h) {
        return new Array(25 - h.length).join("0") + h
    })(bin.toString(2))
}



// convert a hexidecimal color string to 0..255 R,G,B
hexToRGB = function (hex) {
    var r = hex >> 16;
    var g = hex >> 8 & 0xFF;
    var b = hex & 0xFF;
    return [r, g, b];
}
*/

// convert 0..255 R,G,B values to a hexidecimal color string
RGBToHex = function (r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return (function (h) {
        return new Array(7 - h.length).join("0") + h
    })(bin.toString(16).toUpperCase())
}

// convert a 24 bit binary color to 0..255 R,G,B
binToRGB = function (bin) {
    var pbin = parseInt(bin);
    var r = pbin >> 16;
    var g = pbin >> 8 & 0xFF;
    var b = pbin & 0xFF;
    return [r, g, b];
}

colorToRGB = function (color) {
    if (color == null) {
        return [0, 0, 0];
    }
    color = color.substring(color.indexOf("#") + 1);
    color = "0x" + color;
    return binToRGB(color);
}
//-------------------------------------------------------------------------------------------------------------------

var SVGText =
    function () {
        "use strict";

        function SVGText(svgElement, id, size) {
            this.id = id;
            this.SVGText = document.createElementNS(xmlns, "text");
            this.SVGText.id = this.id;
            this.SVGText.setAttributeNS(null, "height", "auto");
            this.SVGText.setAttributeNS(null, "font-family", theme.fontFamily);
           // this.SVGText.setAttributeNS(null, "font-size", this.size + "em");
            svgElement.appendChild(this.SVGText);
            this.size = size;
        }

        var _proto = SVGText.prototype;

        _proto.getTextWidth = function getTextWidth(text) {
            var element = document.body.appendChild(document.createElement("div"));
            element.className = "WidgetText";
            element.innerHTML = text;
            var width = element.getBoundingClientRect().width;
            //element.remove();
            document.body.removeChild(element);
            return width;
        };

        _proto.getTextHeight = function getTextWidth(text) {
            var element = document.body.appendChild(document.createElement("div"));
            element.className = "WidgetText";
            element.innerHTML = text;
            var width = element.getBoundingClientRect().height;
            //element.remove();
            document.body.removeChild(element);
            return width;
        };

        _proto.visible = function visible() {
            this.SVGText.style.display = "block";
        };

        _proto.hide = function hide() {
            this.SVGText.style.display = "none";
        };

        _createClass(SVGText, [{
            key: "fontFamily",
            set: function set(fontFamily) {
                this.SVGText.setAttributeNS(null, "font-family", fontFamily);
            }
        }, {
            key: "text",
            set: function set(text) {
                if (this.SVGText.textContent != text) {
                    this.SVGText.textContent = text;
                    var textSize = this.size * this.getTextWidth(text);
                    this.SVGText.setAttributeNS(null, "textLength", textSize);
                }
                },
                get: function get() {
                    return this.SVGText.textContent;
                }
        }, {
                key: "size",
                set: function set(size) {
                    this._size = size;
                    this.SVGText.setAttributeNS(null, "font-size", size + "em");
                },
                get: function get() {
                    return this._size; 
                }
        }, {
            key: "x",
            set: function set(x) {
                this.SVGText.setAttributeNS(null, "x", x);
            },
            get: function get() {
                return parseFloat(this.SVGText.getAttributeNS(null, "x"));
            }
        }, {
            key: "y",
            set: function set(y) {
                this.SVGText.setAttributeNS(null, "y", y);
            },
            get: function get() {
                return parseFloat(this.SVGText.getAttributeNS(null, "y"));
            }
        }, {
            key: "width",
                get: function get() {
                    return parseFloat(this.size * this.getTextWidth(this.text));
                //return parseFloat(this.SVGText.getBoundingClientRect().width);
            }
        }, {
            key: "height",
                get: function get() {                    
                    return parseFloat(this.size * this.getTextHeight(this.text));
                //return parseFloat(this.SVGText.getBoundingClientRect().height);
            }
        }, {
            key: "color",
            set: function set(color) {
                this.SVGText.setAttributeNS(null, "fill", color);
            },
            get: function get() {
                return this.SVGText.getAttributeNS(null, "fill");
            }
        }, {
            key: "colorRGB",
            set: function set(rgb) {
                this.SVGText.setAttributeNS(null, 'fill', ' #' + RGBToHex(rgb[0], rgb[1], rgb[2]));
            },
            get: function get() {
                return colorToRGB(this.SVGText.getAttributeNS(null, "fill"));
            }
        }]);

        return SVGText;
    }();

//-----------------------------------------------------------------------------------------------------
var SVGRect =
    
    function () {
        "use strict";

        function SVGRect(svgElement, id, x, y, width, height) {
            this.id = id;
            /*
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            */

            this.SVGRect = document.createElementNS(xmlns, "rect");
            this.SVGRect.setAttributeNS(null, 'x', x);
            this.SVGRect.setAttributeNS(null, 'y', y);
            this.SVGRect.setAttributeNS(null, 'width', width);
            this.SVGRect.setAttributeNS(null, 'height', height);
            svgElement.appendChild(this.SVGRect);
        }

        _createClass(SVGRect, [{
            key: "x",
            set: function set(x) {
                this.SVGRect.setAttributeNS(null, "x", x);
            },
            get: function get() {
                return parseFloat(this.SVGRect.getAttributeNS(null, "x"));
            }
        }, {
            key: "y",
            set: function set(y) {
                this.SVGRect.setAttributeNS(null, "y", y);
            },
            get: function get() {
                return parseFloat(this.SVGRect.getAttributeNS(null, "y"));
            }
        }, {
            key: "width",
            set: function set(width) {
                this.SVGRect.setAttributeNS(null, "width", width);
            },
            get: function get() {
                return parseFloat(this.SVGRect.getBoundingClientRect().width);
            }
        }, {
            key: "height",
            set: function set(height) {
                this.SVGRect.setAttributeNS(null, "height", height);
            },
            get: function get() {
                return parseFloat(this.SVGRect.getBoundingClientRect().height);
            }
        }, {
            key: "fill",
            set: function set(fill) {
                this.SVGRect.setAttributeNS(null, 'fill', fill);
            },
            get: function get() {
                return this.SVGRect.getAttributeNS(null, "fill");
            }
        },
        {
            key: "color",
            set: function set(color) {
                this.SVGRect.setAttributeNS(null, 'stroke-width', 0.5);
                this.SVGRect.setAttributeNS(null, 'stroke', color);
            },
            get: function get() {
                return this.SVGRect.getAttributeNS(null, "stroke");
            }
        },
        {
            key: "colorRGB",
            set: function set(rgb) {
                this.SVGRect.setAttributeNS(null, 'fill', ' #' + RGBToHex(rgb[0], rgb[1], rgb[2]));
            },
            get: function get() {
                return colorToRGB(this.SVGRect.getAttributeNS(null, "fill"));
            }
        }, {
            key: "opacity",
            set: function set(opacity) {
                this.SVGRect.setAttributeNS(null, 'opacity', parseFloat(opacity));
            },
            get: function get() {
                return parseFloat(this.SVGRect.getAttributeNS(null, 'opacity'));
            }
        }]);

        return SVGRect;
    }();
//SVGArc ------------------------------------------------------------------------------------

var SVGArc =
    
    function () {
        "use strict";

        function SVGArc(svgElement, id, x, y, radius, lineWidth) {
            this.id = id;
            this.x = x;
            this.y = y;
            this._radius = radius;            
            this.SVGArc = document.createElementNS(xmlns, "path");
            this.SVGArc.setAttributeNS(null, 'x', x);
            this.SVGArc.setAttributeNS(null, 'y', y);
            this.SVGArc.setAttributeNS(null, 'stroke-width', lineWidth);
            this.SVGArc.setAttributeNS(null, 'stroke-linejoin', "round");
            this.SVGArc.setAttributeNS(null, 'fill', 'none');
            svgElement.appendChild(this.SVGArc);
        }

        var _proto = SVGArc.prototype;

        _proto.draw = function draw(from, to) {
            this.SVGArc.setAttributeNS(null, "d", describeArc(this.x, this.y, this._radius, from, to));
        };

        _proto.drawPath = function drawPath(path, width, height) {
            this.SVGArc.setAttributeNS(null, 'width', width);
            this.SVGArc.setAttributeNS(null, 'height', height);
            this.SVGArc.setAttributeNS(null, "d", path);
        };

        _proto.drawRoundedRect = function (width, height, curve, leftOffset, leftTop, rightTop, leftBottom, rightBottom) {

            this.SVGArc.setAttributeNS(null, 'width', width);
            this.SVGArc.setAttributeNS(null, 'height', height);

            var backH = width;
            if (leftOffset == 0) {
                backH = width - curve * 0.5;
            }
            else {
                backH = width - curve * (leftOffset / 4);
            }


            var backV = height - curve * 2.5;

            var ltCurve = 0;
            if (leftTop) ltCurve = curve;

            var rtCurve = 0;
            if (rightTop) rtCurve = curve;

            var lbCurve = 0;
            if (leftBottom) lbCurve = curve;

            var rbCurve = 0;
            if (rightBottom) rbCurve = curve;

            if (this.y == 0) {
                this.SVGArc.setAttributeNS(null, "d", "M" + leftOffset +
                    ", " + curve + " h " + backH + " a" + rtCurve + "," + rtCurve + " 0 0 1  " + rtCurve +
                    ", " + curve + " v " + backV + " a" + rbCurve + "," + rbCurve + " 0 0 1 -" + rbCurve +
                    ", " + curve + " h-" + backH + " a" + lbCurve + "," + lbCurve + " 0 0 1 -" + lbCurve +
                    ",-" + curve + " v-" + backV + " a" + ltCurve + "," + ltCurve + " 0 0 1  " + ltCurve +
                    ",-" + curve + " z");
            }
            else {
                var backH = width - curve * 2.5;
                this.SVGArc.setAttributeNS(null, "d", "M" + curve * 3.0 +
                    ", " + parseFloat(this.y - backV*3) + " h " + backH + " a" + rtCurve + "," + rtCurve + " 0 0 1  " + rtCurve +
                    ", " + curve + " v " + backV * 2 + " a" + rbCurve + "," + rbCurve + " 0 0 1 -" + rbCurve +
                    ", " + curve + " h-" + backH + " a" + lbCurve + "," + lbCurve + " 0 0 1 -" + lbCurve +
                    ",-" + curve + " v-" + backV + " a" + ltCurve + "," + ltCurve + " 0 0 1  " + ltCurve +                    
                    ",-" + curve + " z");

            }


        };
        _proto.hide = function hide() {
            this.SVGArc.setAttributeNS(null, "d", "");
        };

        _createClass(SVGArc, [{
            key: "color",
            set: function set(color) {
                this.SVGArc.setAttributeNS(null, 'stroke', color);
            },
            get: function get() {
                return this.SVGArc.getAttributeNS(null, "stroke");
            }
        }, {
            key: "colorRGB",
            set: function set(rgb) {
                this.SVGArc.setAttributeNS(null, 'stroke', ' #' + RGBToHex(rgb[0], rgb[1], rgb[2]));
            },
            get: function get() {
                return colorToRGB(this.SVGArc.getAttributeNS(null, "stroke"));
            }
        }, {
            key: "fill",
            set: function set(color) {
                this.SVGArc.setAttributeNS(null, 'fill', color);
            },
            get: function get() {
                return this.SVGArc.getAttributeNS(null, "fill");
            }
        }, {
            key: "fillRGB",
            set: function set(rgb) {
                this.SVGArc.setAttributeNS(null, 'fill', ' #' + RGBToHex(rgb[0], rgb[1], rgb[2]));
            },
            get: function get() {
                return colorToRGB(this.SVGArc.getAttributeNS(null, "fill"));
            }
        }, {
            key: "opacity",
            set: function set(opacity) {
                this.SVGArc.setAttributeNS(null, 'opacity', parseFloat(opacity));
            },
            get: function get() {
                return parseFloat(this.SVGArc.getAttributeNS(null, 'opacity'));
            }
            },
            {
                key: "linewidth",
                set: function set(linewidth) {
                    
                    this.SVGArc.setAttributeNS(null, 'stroke-width', parseFloat(linewidth));
                },
                get: function get() {
                    return parseFloat(this.SVGArc.getAttributeNS(null, 'stroke-width'));
                }
            }, 
            {
            key: "radius",
            set: function set(radius) {
                this._radius = parseFloat(radius);
            },
            get: function get() {
                return parseFloat(this._radius);
            }
        }]);

        return SVGArc;
    }();
//----------------------------------------------------------------------------------------------------------------------------------------------------------

var SVGIcon =
    
    function () {
        "use strict";

        function SVGIcon(svgElement, icon, x, y, width, height) {
            this.icon = icon;
            this.SVGIcon = document.createElementNS(xmlns, "svg");
            this.SVGIcon.setAttributeNS(null, "viewBox", "0 0 " + width + " " + height);
            this.SVGIcon.setAttributeNS(null, "x", x);
            this.SVGIcon.setAttributeNS(null, "y", y);
            this.SVGIcon.setAttributeNS(null, "width", width);
            this.SVGIcon.setAttributeNS(null, "height", height);
            this.SVGIcon.style.display = "block";
            this.SVGPath = document.createElementNS(xmlns, "path");
            this.SVGPath.setAttributeNS(null, "transform", "scale(" + parseFloat(width / 48) + ")");
            this.SVGIcon.appendChild(this.SVGPath);
            this.SVGFillPath = document.createElementNS(xmlns, "path");
            this.SVGFillPath.setAttributeNS(null, "d", "M0 0h48v48H0z");
            this.SVGFillPath.setAttributeNS(null, "fill", "#0F0F0F");
            this.SVGFillPath.setAttributeNS(null, "opacity", "0.01");
            this.SVGFillPath.setAttributeNS(null, "transform", "scale(" + parseFloat(width / 48) + ")");
            this.SVGIcon.appendChild(this.SVGFillPath);
            svgElement.appendChild(this.SVGIcon);
            this.draw();
        }

        var _proto = SVGIcon.prototype;

        _proto.draw = function draw() {
            this.SVGPath.setAttributeNS(null, "d", this.icon);
        };

        _proto.hide = function hide() {
            this.SVGPath.setAttributeNS(null, "d", "");
        };

        _createClass(SVGIcon, [{
            key: "x",
            set: function set(x) {
                this.SVGIcon.setAttributeNS(null, "x", x);
            },
            get: function get() {
                return parseFloat(this.SVGIcon.getAttributeNS(null, "x"));
            }
        }, {
            key: "y",
            set: function set(y) {
                this.SVGIcon.setAttributeNS(null, "y", y);
            },
            get: function get() {
                return parseFloat(this.SVGIcon.getAttributeNS(null, "y"));
            }
        }, {
            key: "color",
            set: function set(color) {
                this.SVGPath.setAttributeNS(null, 'stroke', color);
            },
            get: function get() {
                return this.SVGPath.getAttributeNS(null, "stroke");
            }
        }, {
            key: "colorRGB",
            set: function set(rgb) {
                this.SVGPath.setAttributeNS(null, 'stroke', ' #' + RGBToHex(rgb[0], rgb[1], rgb[2]));
            },
            get: function get() {
                return colorToRGB(this.SVGPath.getAttributeNS(null, "stroke"));
            }
        }, {
            key: "fill",
            set: function set(color) {
                this.SVGPath.setAttributeNS(null, 'fill', color);
            },
            get: function get() {
                return this.SVGPath.getAttributeNS(null, "fill");
            }
        }, {
            key: "fillRGB",
            set: function set(rgb) {
                this.SVGPath.setAttributeNS(null, 'fill', ' #' + RGBToHex(rgb[0], rgb[1], rgb[2]));
            },
            get: function get() {
                return colorToRGB(this.SVGPath.getAttributeNS(null, "fill"));
            }
        }, {
            key: "opacity",
            set: function set(opacity) {
                this.SVGPath.setAttributeNS(null, 'opacity', parseFloat(opacity));
            },
            get: function get() {
                return parseFloat(this.SVGPath.getAttributeNS(null, 'opacity'));
            }
        }]);

        return SVGIcon;
    }();﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var langua = "prepareUnit=Підготовка інтерфейсу користувача\n" +
    "dashboardTab=Панель пристроїв\n" +
    "nodeTab=Модуль\n" +
    "settingsTab=Вузли\n" +
    "filesTab=Файли\n" +
    "consoleTab=Консоль\n" +
    "network=Мережа\n" +
    "node=Модуль\n" +
    "esp=Esp\n" +
    "reset=Скидання\n"+
    "cancel=Скасувати\n"+
    "areYouSure=Ви впевнені?\n"+
    "resetnode=Перезавантажити модуль\n"+
    "autorefreshoff=Автооновлення: вимкн.\n"+
    "autorefreshon=Автообновление: вкл.\n"+
    "name=Ім'я\n"+
    "value=Значення\n"+
    "newvalue=Нове значення\n"+
    "property=Властивість\n"+
    "top=Вгору\n"+
    "dt_display=Відображати\n"+
    "dt_recordsperpage=записів на сторінці\n"+
    "dt_showing=Відображається c\n"+
    "dt_to=по\n"+
    "dt_of=всього\n"+
    "dt_entries=записів\n"+
    "dt_search=Пошук:\n"+
    "dt_first=Перша\n"+
    "dt_last=Остання\n"+
    "dt_next=Наступна\n"+
    "dt_previous=Попередня\n"+
    "adddriver=Додати драйвер\n" +
    "addnode=Додати вузол\n" +
    "addnodeheader=Додати вузол\n" +
    "addnodehost=Адреса вузла в мережі\n" +
    "addnodenickname=Ім'я вузла\n" +
    "addnodebutton=Додати\n" +
    "addnodeerror_hostempty=Адреса вузла не може бути порожньою\n" +
    "addnodeerror_hostnoturl=Адреса вузла не відповідає формату HTTP(S) URL\n" +
    "addnodeerror_nicknameempty=Iм'я не може бути порожнім\n" +
    "addnodeerror_cantsaveconfig=Неможливо зберегти налаштування в вузлі\n" +
    "addnodeerror_cantaddnode=Неможливо додати вузол\n" +
    "upload=Завантажити\n"+
    "files=Файли\n"+
    "uploadfiles=Завантажити файли до вузла\n"+
    "selectfiles=Будь ласка, виберіть файли\n" +
    "temperature=Температура\n" +
    "humidity=Вологість\n" +
    "dht=Датчик температури і вологості (DHT)\n" +
    "sensor=Датчик \n" +
    "actuator=Цифровий привід\n" +
    "opto=Оптична пара\n" +
    "valve=Вентиль\n" +
    "light=Детектор світла\n" +
    "shortlight=Освітленість\n" +
    "smoke=Детерктор задимлення\n" +
    "stepper=Кроковий двигун\n" +
    "lcd=Рідко-кристалічний екран\n" +
    "led=Світлодіод\n" +
    "beep=Зумер\n" +
    "relay=Реле\n" +
    "motion=Детектор руху\n" +
    "dark=Темно\n" +
    "norm=Середня\n" +
    "high=Висока\n" +
    "low=Низька\n" +
    "smokelow=Низька\n" +
    "smokenorm=Середня\n" +
    "smokehigh=Висока\n" +    
    "yesmotion=Рух\n" +
    "nomotion=Немає\n" +
    "rid_online=В мережі\n" +
    "rid_error=Помилка\n" +
    "rid_connect=З'єднання.../n" +
    "rid_offline=Не в мережі\n" +
    "lcd=Екран\n" +
    "send=Відпр.\n" +
    "clear=Підсв.\n" +
	//connection statuses
	"connected=З'єднано\n"+
	"disconnected=Роз'єднано\n" +
	"idlestatus=Зміна статусу\n"+
    "nossidavailable=Обрана мережа недоступна\n"+ 
	"scancompleted=Сканування виконано\n"+
	"connectfailed=Не вдається підключитися\n"+
    "connectionlost=Підключення втрачено\n"+
    "nostate=Не визначено\n"+
    "debugmode=Режим налагодження\n"+
    "connectiontimeout=Тайм-аут з'єднання\n"+
	"badprotocol=Невірний протокол\n"+
    "badclientid=Невірний ідентифікатор клієнта\n"+
    "unavailable=Недоступно\n"+
    "badcredentials=Невірні облікові дані\n"+
    "unauthorized=Не дозволено\n"+
    "connectionstatus=Статус підключення: \n" +
    "detect=Є рух\n" +
    "notdetect=Немає\n" +
    "getconfig=Завантаження налаштувань UI\n" +
    "getconfigfailsparse=Помилка завантаження налаштувань UI\n" +
    "espfreesketchspace=Вільне місце прошивки\n" +
    "espfreeheap=Вільна динамічна пам'ять\n" +
    "wifirssi=Рівень WiFi сигналу\n" +
    "espcpufreqmhz=Частота CPU\n" +
    "espresetreason=Тип останнього скидання\n" +
    "update=Оновлення\n" +
    "updateinfo=Інформація про оновлення\n" +
    "noupdateinfo=Немає інформації про оновлення\n" +
    "updateexists=Оновлення доступні\n" +
    "updatenosense=Ви використовуєте останню версію\n" +
    "updateunpossible=Оновлення неможливо\n" +
    "updateuipossible=Можливо оновити тільки UI (потрібен апаратнэ скидання)\n" +
    "updatepossible=Оновлення можливі\n" +
    "downdateuipossible=Остарення можливі\n" +
    "firmware=Прошивка\n" +
    "firmwareversion=Версія прошивки\n" +
    "firmwarebuildnumber=Збірка\n" +
    "updateuibutton=Оновити UI\n" +
    "updatefirmwarebutton=Оновити прошивку\n" +
    "updatenode=Оновлення\n" +
    "updateuibutton=Почати оновлення UI\n" +
    "firmwarebutton=Почати оновлення прошивки\n" +
    "updatefirmware=Після закінчення оновлення прошивки, модуль перезавантажиться автоматично. UI перезавантажиться через 30 секунд. Використовуйте монітор порту для більшої інформації\n" +
    "dashboard=Панель пристроїв\n" +
    "dashboardview=Режим перегляду\n" +
    "dashboardedit=Режим редагування\n" +
    "dashboardaddwidget=Додати віджет\n" +
    "dashboardaddwidgetbutton=Додати\n" +
    "nodeslist=Список вузлів/драйверів\n" +
    "driversporplist=Властивості драйвера\n" +
    "widgetslist=Список виджетів для обраної властивості\n" +
    "networknodeprop=Мережеві налаштування ноди\n" +
    "restfulavailable=Включити підтримку Web (RESTful)\n" +
    "webserverlogin=Логін для Web сервера\n" +
    "webserverpwd=Пароль для Web сервера\n" +
    "restfulserverport=Порт Web сервера\n" +
    "restfulclienturl=URL RESTful сервера для клієнта\n" +
    "restfulclientport=Порт RESTful сервера для клієнта\n" +
    "mqttavailable=Включити підтримку MQTT\n" +
    "mqtturl=URL MQTT сервера\n" +
    "mqttport=Порт MQTT сервера\n" +
    "mqttid=ID клієнта для MQTT\n" +
    "mqttlogin=Логін\n" +
    "mqttpassword=Пароль\n" +
    "otaavailable=Включити підтримку OTA\n" +
    "otaid=OTA ID\n" +
    "otaport=OTA порт\n" +
    "otapassword=Клієнтський пароль\n" +
    "wifinodeprop=Налаштування WiFi модуля\n" +
    "wifiaccesspointavailable=Включити режим WiFi точки доступу\n" +
    "wifiaccesspointssid=SSID для точки доступу\n" +
    "wifiappassword=Пароль для точки доступу\n" +
    "wifiavailable=Включити режим WiFi станції (клієнта)\n" +
    "wifissid=SSID WiFi роутера\n" +
    "wifipassword=Пароль WiFi роутера\n" +
    "wifiip=Клієнтський IP\n" +
    "systemnodeprop=Властивості системи\n" +
    "updatehost=URL сервера оновлень\n" +
    "updatenodeprop=Панель оновлень прошивки\n" +
    "nodeproperties=Властивості вузла\n" +
    "RESTful=Драйвери\n" +  
    "adddriverdigalog=Додати драйвер до вузлу\n" +
    "drivertype=Тип драйвера\n" +
    "driverid=ID драйвера\n" +
    "driveridplaceholder=Маленькими латинськими буквами без пробілів\n" +
    "pin=Контактний роз'єм\n" +
    "adddriverbutton=Додати\n" +
    "notused=Не використовується\n" +
    "checkchangedialog=Застосувати зміни\n" +
    "applycheck=Застосувати\n" +    
    "showproperties=Властивості віджета\n" +
    "setallwidgetspropbutton=Застосувати до всіх\n" +
    "setpropbutton=Застосувати\n" +
    "saveaddedwidget=Збереження\n" +
    "closebutton=Закрити\n" +
    "createscript=Додати скріпт\n" +
    "scripts=Скріпти\n" +
    "scriptexecute=Виконати (F8)\n" +
    "scriptpause=Пауза\n" +
    "scriptdelete=Вилучити\n" +  
    "scriptstartdebug=Відлагоджувати\n" + 
    "addscriptheader=Додати скріпт\n" +
    "addscriptbutton=Додати\n" +
    "addscriptname=Iм'я скріпта\n" +
    "inputcodehere=Сюди введіть код скріпту\n" +
    "autoaddwidget=Додати віджет\n" +
    "сhangessaved=Зміни збережені \n" +
    "savechangeserror=Помилка. Зміни не збережені. Спробуйте ще раз \n" +
    "savingchanges=Збереження змін\n" +
    "language=ukraine\n";

var langen = "prepareUnit=prepare UI, please wait.../n" +
    "nodeTab=Node\n" +
    "settingsTab=Nodes\n" +
    "filesTab=Files\n" +
    "consoleTab=Console\n" +
    "network=Network\n" +
    "node=Node\n" +
    "esp=ESP\n" +
    "reset=Reset\n" +
    "cancel=Сancel\n" +
    "areYouSure=Are you sure?\n" +
    "resetnode=Reset node\n" +
    "autorefreshoff=Auto refresh: OFF\n" +
    "autorefreshon=Auto refresh: ON\n" +
    "name=Name\n" +
    "value=Value\n" +
    "newvalue=New value\n" +
    "property=Property\n" +
    "top=Top\n" +
    "dt_display=Display\n" +
    "dt_recordsperpage=Records per page\n" +
    "dt_showing=Showing\n" +
    "dt_to=to\n" +
    "dt_of=of\n" +
    "dt_entries=Enteries\n" +
    "dt_search=Search:\n" +
    "dt_first=First\n" +
    "dt_last=Laset\n" +
    "dt_next=Next\n" +
    "dt_previous=Previous\n" +
    "adddriver=Add driver\n" +
    "upload=Upload\n" +
    "files=Files\n" +
    "uploadfiles=Upload files\n" +
    "selectfiles=Select files\n" +
    "rid_online=Online \n" +
    "rid_error=Error \n" +
    "rid_connect=Connecting.../n" +
    "rid_offline=Offline\n" +
    "connected=Connected\n" +
    "disconnected=Disconnected\n" +
    "idlestatus=Idle status\n" +
    "nossidavailable=No SSID available\n" +
    "scancompleted=Scan is completed\n" +
    "connectfailed=Connection is failed\n" +
    "connectionlost=Connection is lost\n" +
    "nostate=No state\n" +
    "debugmode=Debug mode\n" +
    "connectiontimeout=Connection time-out\n" +
    "badprotocol=Bad protocol\n" +
    "badclientid=Bad client ID\n" +
    "unavailable=Unavailable\n" +
    "badcredentials=Bad credentials\n" +
    "unauthorized=Unauthorized\n" +
    "connectionstatus=Connection status: \n" +
    "shortlight=Light\n" +
    "getconfig=Loading UI configuration\n" +
    "getconfigfailsparse=Fail loading of UI configuration\n" +
    "espfreesketchspace=Free firmware space\n" +
    "espfreeheap=Free dynamic memory\n" +
    "wifirssi=WiFi signal strength\n" +
    "espcpufreqmhz=CPU frequency\n" +
    "espresetreason=Type of last reset\n" +
    "update=Update\n" +
    "updateinfo=Update information\n" +
    "noupdateinfo=No information about update\n" +
    "updateexists=Update exists\n" +
    "updatenosense=You use lase version\n" +
    "updateunpossible=Update unpossible\n" +
    "updateuipossible=Posible update only UI (need hard reset)\n" +
    "updatepossible=Update possible\n" +
    "firmware=Firmware\n" +
    "firmwareversion=Firmware version\n" +
    "firmwarebuildnumber=Build\n" +
    "updateuibutton=Update UI\n" +
    "updatefirmwarebutton=Update Firmware\n" +
    "updatenode=Update\n" +
    "updateuibutton=Starting update UI\n" +
    "firmwarebutton=Starting update Firmware\n" +
    "updatefirmware=After firmware is updating, the node self restarting. Please wait 30 sec, before the page after reloading. See Serial Monitor for more information.\n" +
    "networknodeprop=Node network properties\n" +
    "restfulavailable=Enable Web(RESTful) supporting\n" +
    "webserverlogin=Web server login\n" +
    "webserverpwd=Web server password\n" +
    "restfulserverport=Web server port\n" +
    "restfulclienturl=RESTful client URL\n" +
    "restfulclientport=RESTful client port\n" +
    "mqttavailable=Enable MQTT supporting\n" +
    "mqtturl=MQTT server URL\n" +
    "mqttport=MQTT server port\n" +
    "mqttid=MQTT client ID\n" +
    "mqttlogin=Login\n" +
    "mqttpassword=Password\n" +
    "otaavailable=Enable OTA supporting\n" +
    "otaid=OTA ID\n" +
    "otaport=OTA port\n" +
    "otapassword=OTA client password\n" +
    "wifinodeprop=Node WiFi properties\n" +
    "wifiaccesspointavailable=Enable WiFi Access Point mode \n" +
    "wifiaccesspointssid=WiFi Access Point SSID\n" +
    "wifiappassword=WiFi Access Point password\n" +
    "wifiavailable=Enable WiFi Station mode\n" +
    "wifissid=WiFi router SSID\n" +
    "wifipassword=WiFi router password\n" +
    "wifiip=Client IP\n" +
    "systemnodeprop=Node system properties\n" +
    "updatehost=Update server URL\n" +
    "updatenodeprop=Node update panel\n" +
    "nodeproperties=Node properties\n" +
    "addnodeerror_hostempty=Host can't be empty\n" +
    "addnodeerror_hostnoturl=Host is not HTTP(S) URL\n" +
    "addnodeerror_nicknameempty=Name can't be empty\n" +
    "addnodeerror_cantsaveconfig=Can't save configuration to node\n" +
    "addnodeerror_cantaddnode=Can't add node\n" +
    "drivertype=Driver type\n" +
    "driverid=Driver ID\n" +
    "driveridplaceholder=In small latin letters without spaces\n" +
    "pin=Pin connector \n" +
    "adddriverbutton=Add\n" +
    "notused=Not used\n" +
    "checkchangedialog=Apply this changes\n" +
    "applycheck=Apply\n" +
    "dashboardTab=Dashboard\n" +
    "addnode=Add node\n" +
    "addnodeheader=Adding node\n" +
    "addnodehost=Node network address\n" +
    "addnodenickname=Node name\n" +
    "addnodebutton=Add\n" +
    "temperature=Temperature\n" +
    "humidity=Humidity\n" +
    "dht=Temperature & Humidity Sensor(DHT)\n" +
    "sensor=Sensor\n" +
    "actuator=Actuator\n" +
    "opto=Optocoupler\n" +
    "valve=Valve\n" +
    "light=Light detector\n" +
    "smoke=Smoke detector\n" +
    "stepper=Stepper motor\n" +
    "lcd=Liquid crystal display\n" +
    "led=Luminodiode\n" +
    "beep=Beep\n" +
    "relay=Relay\n" +
    "motion=Motion detector\n" +
    "dark=Dark\n" +
    "norm=Avarage\n" +
    "high=High\n" +
    "low=Low\n" +
    "smokelow=Low smoke\n" +
    "smokenorm=Average smoke\n" +
    "smokehigh=High smoke\n" +
    "yesmotion=Motion\n" +
    "nomotion=No motion\n" +
    "lcd=Liquid crystal display\n" +
    "send=Send\n" +
    "clear=Clear\n" +
    "detect=Detected\n" +
    "notdetect=No motion\n" +
    "downdateuipossible=Old data\n" +
    "dashboard=Drivers panel\n" +
    "dashboardview=View mode\n" +
    "dashboardedit=Edit mode\n" +
    "dashboardaddwidget=Add widget\n" +
    "dashboardaddwidgetbutton=Add\n" +
    "nodeslist=List of nodes/drivers \n" +
    "driversporplist=Drivers properties\n" +
    "widgetslist=List of compatible widgets\n" +
    "autoaddwidget=Add widget\n" +
    "RESTful=Drivers\n" +
    "adddriverdigalog=Adding driver to node\n" +
    "showproperties=Widget properties\n" +
    "setallwidgetspropbutton=Apply to all\n" +
    "setpropbutton=Apply\n" +
    "saveaddedwidget=Save\n" +
    "closebutton=Close\n" +
    "createscript=Add script\n" +
    "scripts=Scripts\n" +
    "scriptexecute=Run (F8)\n" +
    "scriptpause=Pause\n" +
    "scriptdelete=Delete\n" +
    "scriptstartdebug=Debug\n" + 
    "addscriptheader=Adding script\n" +
    "addscriptbutton=Add\n" +
    "addscriptname=Script name\n" +
    "inputcodehere=Input script code here\n" +
    "сhangessaved=Changes saved\n" +
    "savechangeserror=Saving changes error. Close this window and try again later! \n" +
    "savingchanges=Saving changes\n" +
    "language=english\n";

var langru = "prepareUnit=Подготовка интерфейса пользователя\n" +
    "nodeTab=Нода\n" +
    "settingsTab=Узлы\n" +
    "filesTab=Файлы\n" +
    "consoleTab=Консоль\n" +
    "network=Сетъ\n" +
    "node=Нода\n" +
    "esp=ESP\n" +
    "reset=Сброс\n" +
    "cancel=Отмена\n" +
    "areYouSure=Вы уверены?\n" +
    "resetnode=Перезагрузить ноду\n" +
    "autorefreshoff=Автообновление: выкл.\n" +
    "autorefreshon=Автообновление: вкл\n" +
    "name=Имя\n" +
    "value=Значение\n" +
    "newvalue=Новое значение\n" +
    "property=Свойство\n" +
    "top=вверх\n" +
    "dt_display=Отображать\n" +
    "dt_recordsperpage=записей на странице\n" +
    "dt_showing=Отображается c\n" +
    "dt_to=по\n" +
    "dt_of=всего\n" +
    "dt_entries=записей\n" +
    "dt_search=Поиск:\n" +
    "dt_first=Первая\n" +
    "dt_last=Последняя\n" +
    "dt_next=Следующая\n" +
    "dt_previous=Предыдущая\n" +
    "adddriver=Добавить драйвер\n" +
    "upload=Загрузить\n" +
    "files=Файлы\n" +
    "uploadfiles=Загрузить файлы в ноду\n" +
    "selectfiles=Выбирите файлы\n" +
    "temperature=Температура\n" +
    "humidity=Влажность\n" +
    "light=Датчик освещённости\n" +
    "shortlight=Освещенность\n" +
    "smoke=Датчик задымления\n" +
    "led=Светодиод\n" +
    "beep=Зумер\n" +
    "relay=Реле\n" +
    "motion=Датчик движения\n" +
    "dark=Темно\n" +
    "norm=Среднее\n" +
    "high=Высокое\n" +
    "low=Низкое\n" +
    "smokelow=Низкое\n" +
    "smokenorm=Среднее\n" +
    "smokehigh=Высокое\n" +
    "yesmotion=Движение\n" +
    "nomotion=Нет\n" +
    "rid_online=В сети\n" +
    "rid_error=Ошибка\n" +
    "rid_connect=Соединение.../n" +
    "rid_offline=Не в сети\n" +
    "lcd=Жидкокристаллический экран\n" +
    "send=Отпр.\n" +
    "clear=Очис.\n" +
    "connected=Подключено\n" +
    "disconnected=Разъединено\n" +
    "idlestatus=Смена статуса\n" +
    "nossidavailable=Выбранная сеть не доступна\n" +
    "scancompleted=Сканирование завершено\n" +
    "connectfailed=Не удается подключиться\n" +
    "connectionlost=Подключение утрачено\n" +
    "nostate=Не определен\n" +
    "debugmode=Режим отладки\n" +
    "connectiontimeout=Время соединения вышло\n" +
    "badprotocol=Неверный протокол\n" +
    "badclientid=Неверный идентификатор клиента\n" +
    "unavailable=Не доступно\n" +
    "badcredentials=Неверные учетные данные\n" +
    "unauthorized=Не разрешено\n" +
    "connectionstatus=Статус подключения: \n" +
    "detect=Движение\n" +
    "notdetect=Нет\n" +
    "getconfig=Загрузка настроек UI\n" +
    "getconfigfailsparse=Ошибка загрузки настроек UI\n" +
    "espfreesketchspace=Свободное место прошивки\n" +
    "espfreeheap=Свободная динамическая память\n" +
    "wifirssi=Уровень WiFi сигнала\n" +
    "espcpufreqmhz=Частота CPU\n" +
    "espresetreason=Тип последнего сброса\n" +
    "update=Обнобления\n" +
    "updateinfo=Информация об обновлениях\n" +
    "noupdateinfo=Нет информации об обновлениях\n" +
    "updateexists=Обновления доступны\n" +
    "updatenosense=Вы используете последнею версию\n" +
    "updateunpossible=Обновление невозможно\n" +
    "updateuipossible=Возможно обновить только UI (нужен аппаратный сброс)\n" +
    "updatepossible=Обновления возможны\n" +
    "firmware=Прошивка\n" +
    "firmwareversion=Версия прошивки\n" +
    "firmwarebuildnumber=Сборка\n" +
    "updateuibutton=Обновить UI\n" +
    "updatefirmwarebutton=Обновить прошивку\n" +
    "updatenode=Обновление\n" +
    "updateuibutton=Начать обновление UI\n" +
    "firmwarebutton=Начать обновление прошивки\n" +
    "updatefirmware=После окончания обновления прошивки, модуть перезапустится автоматически. UI перезагрузится через 30 секунд. Используйте монитор порта для большей информации\n" +
    "restfulavailable=Включить поддержку Web(RESTful)\n" +
    "webserverlogin=Логин для Web сервера\n" +
    "webserverpwd=Пароль для Web сервера\n" +
    "restfulserverport=Порт Web сервера\n" +
    "restfulclienturl=URL RESTful сервера для клиента\n" +
    "restfulclientport=Порт RESTful сервера для клиента\n" +
    "mqttavailable=Включить поддержку MQTT\n" +
    "mqtturl=URL MQTT сервера\n" +
    "mqttport=Порт MQTT сервера\n" +
    "mqttid=ID клиента для MQTT\n" +
    "mqttlogin=Логин\n" +
    "mqttpassword=Пароль\n" +
    "otaavailable=Включить поддержку OTA\n" +
    "otaid=OTA ID\n" +
    "otaport=OTA порт\n" +
    "otapassword=Клиентский пароль\n" +
    "wifinodeprop=Настройки WiFi модуля\n" +
    "wifiaccesspointavailable=Включить режим WiFi точки доступа\n" +
    "wifiaccesspointssid=SSID для точки доступа\n" +
    "wifiappassword=Пароль для точки доступа\n" +
    "wifiavailable=Включить режим WiFi станции (клиента)\n" +
    "wifissid=SSID WiFi роутера\n" +
    "wifipassword=Пароль WiFi роутера\n" +
    "wifiip=Клиентский IP\n" +
    "systemnodeprop=Свойства системы\n" +
    "updatehost=URL сервера обновлений\n" +
    "updatenodeprop=Панель обновлений прошивки\n" +
    "addnodeerror_hostempty=Хост не может быть пуст\n" +
    "addnodeerror_hostnoturl=хост не соответствует HTTP(S) URL\n" +
    "addnodeerror_nicknameempty=Имя не может быть пустым\n" +
    "addnodeerror_cantsaveconfig=Невозможно сохранить настройки в узле\n" +
    "addnodeerror_cantaddnode=Невозможно добавить ноду\n" +
    "drivertype=Тип драйвера\n" +
    "driverid=ID драйвера\n" +
    "driveridplaceholder=Маленькими латинскими буквами без пробелов\n" +
    "pin=Контактный разьем \n" +
    "adddriverbutton=Добавить\n" +
    "dashboardTab=Панель устройств\n" +
    "addnode=Добавить узел\n" +
    "addnodeheader=Добавить узел\n" +
    "addnodehost=Адрес узла в сети\n" +
    "addnodenickname=Имя узла\n" +
    "addnodebutton=Добавить\n" +
    "dht=Датчик температуры и влажности (DHT)\n" +
    "sensor=Датчик \n" +
    "actuator=Цифровое устройство \n" +
    "opto=Оптопара\n" +
    "valve=Вентиль\n" +
    "stepper=Шаговый двигатель\n" +
    "downdateuipossible=Старые данные\n" +
    "dashboard=Панель устройств\n" +
    "dashboardview=Режим просмотра\n" +
    "dashboardedit=Режим редактирования\n" +
    "dashboardaddwidget=Добавить виджет\n" +
    "dashboardaddwidgetbutton=Добавить \n" +
    "nodeslist=Список узлов/драйверов \n" +
    "driver=Драйвер\n" +
    "driversporplist=Свойства драйвера\n" +
    "widgetslist=Список виджетов для выбранного свойства\n" +
    "networknodeprop=Сетевые настройки узла\n" +
    "nodeproperties=Свойства узла\n" +
    "RESTful=Драйвера\n" +
    "adddriverdigalog=Добавить драйвер к узлу\n" +
    "notused=Не используется\n" +
    "checkchangedialog=Принять изменения\n" +
    "applycheck=Принять\n" +
    "showproperties=Свойства виджета\n" +
    "setallwidgetspropbutton=Применить ко всем\n" +
    "setpropbutton=Применить\n" +
    "saveaddedwidget=Сохранение\n" +
    "closebutton=Закрыть\n" +
    "createscript=Добавить скрипт\n" +
    "scripts=Скрипты\n" +
    "scriptexecute=Выполнить (F8)\n" +
    "scriptpause=Пауза\n" +
    "scriptdelete=Удалить\n" +
    "scriptstartdebug=Отладка\n" + 
    "addscriptheader=Добавить скрипт\n" +
    "addscriptbutton=Добавить\n" +
    "addscriptname=Имя скрипта\n" +
    "inputcodehere=Здесь введите код скрипта\n" +
    "autoaddwidget=Добавить виджет\n" +
    "сhangessaved=Изменения внесены\n" +
    "savechangeserror=Ошибка сохранения изменений. Поробуйте еще раз\n" +
    "savingchanges=Сохранение изменений\n" +
    "language=russian\n";


var currentLang = "";
var lastLang = "";

function getLang(key) {
    try {
        if (configProperties != undefined) {
            if (configProperties.language !== lastLang) {
                lastLang = configProperties.language;
                currentLang = "";
            }
        }
        else {
            currentLang = "en"; 
        }

        if (currentLang == "") {
            if (configProperties.language.indexOf("ua") == 0) { //ua
                currentLang = langua.split("\n");
            }
            else
                if (configProperties.language.indexOf("ru") == 0) {
                    currentLang = langru.split("\n");
                }
                else {
                    currentLang = langen.split("\n");
                }
        }

        for (var i = 0; i < currentLang.length; i++) {
            if (currentLang[i] === "") continue;
            if (currentLang[i].indexOf(key + "=") == 0) {
                return currentLang[i].split("=")[1];
            }
        }
        
    } catch (exception) {
        //return "key" if exception or not found
    }
    return key;
}

function langCompare(source, dest, panel) {
    var sourceLang = source.split("\n");
    var destLang = dest.split("\n");

    dest += "------------=---------\n"

    for (var i = 0; i < sourceLang.length; i++) {
        if (sourceLang[i] === "") continue;
        var sourceKey = sourceLang[i].split("=")[0];    
        var found = false;
        for (var j = 0; j < destLang.length; j++) {
            if (destLang[j].indexOf(sourceKey + "=") == 0) {
                found = true;
                break;
            }
        }
        if (!found) {
            dest += sourceLang[i] + "\n"
        }
    }

    var destLang = dest.split("\n");
    dest = "";

    for (var i = 0; i < destLang.length; i++) {
        if (destLang[i] === "") continue;
        var destKey = destLang[i].split("=")[0];
        var found = false;
        for (var j = 0; j < sourceLang.length; j++) {
            if (sourceLang[j].indexOf(destKey + "=") == 0) {
                dest += '"' + destLang[i] + '\\n" +\n';
                break;
            }
        }
    }

    panel.innerHTML = dest;

}﻿
/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

//-----------------------------------------------------------------------------------
//Drivers classes -------------------------------------------------------------------
//Base radial class 
//-----------------------------------------------------------------------------------
var BaseWidgetWrapper =
    
    function () {
        "use strict";

        function BaseWidgetWrapper(parentPanel, driver, driverProperty, noWidget, configPropertiesWidget, widgetProperties) {
            this.configPropertiesWidget = configPropertiesWidget;
            this.widgetProperties = widgetProperties;

            if (driver == undefined) {
                drivers.addDriverLoadedListner(this.onDriverLoaded, this);
            } else {
                this.driver = driver;
                this.driverProperty = driverProperty;
                this.offlineStarter(parentPanel, driver._id, driverProperty.name, noWidget);
                
            }
        }

        var _proto = BaseWidgetWrapper.prototype;

        _proto.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName, noWidget) {
            this.driverId = driverId;
            this.driverPropertyName = driverPropertyName;
            dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);

            if (noWidget == undefined || !noWidget) {
                this.widget = new RadialWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
                this.widget.driverClass = this;
                this.widget.onload = this.onWidgetLoad;                
            }
        };

        _proto.makeUniqueId = function (id) {
            var count = 1;
            var _id = id;
            while (document.getElementById(_id + "BaseWidget") != undefined) {
                _id = id + count;
                count++;
            }
            return _id;
        }

        _proto.onWidgetLoad = function onWidgetLoad(widget) {
            widget.widgetHolder.onclick = widget.driverClass.widgetClick;
            
            //widget.driverClass.draw();
            //widget.properties = widget.driverClass.configPropertiesWidget;
            if (widget.driverClass.widgetProperties != undefined) {
                widget.properties = widget.driverClass.widgetProperties;
            }

            if (widget.driverClass.driver != undefined) {
                widget.driverClass.joinDriver(widget.driverClass.driver, widget.driverClass.driverProperty);
            }

            if (widget.driverClass._onload != undefined) {
                widget.driverClass._onload(widget.driverClass);
            }
        };


        _proto.getWidgetProperties = function () {
            if (this.widget != undefined) {
                return this.widget.properties;
            }
            return undefined;
        };

        _proto.joinDriver = function joinDriver(driver, driverProperty) {
            this.driver = driver;
            this.driverProperty = driverProperty;
            if (this.widget != undefined) {
                if (this.widget.driverClass != undefined) {
                    this.widget.driverClass.driverProperty = driverProperty;
                }
            }
            this.node = config.getNodeByHost(driver._host); //drivers.addNetworkStatusListner(this.onNetworkStatusChange, this);

            this.node.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addValueListner(this.onValueChange, this);
        };

        _proto.onDriverLoaded = function onDriverLoaded(sender, driver) {
            if (sender.driver != undefined) return;

            if (sender.driverId == driver._id) {
                /*
                sender.driver = driver;
                sender.driverProperty = driver[sender.driverPropertyName];
                sender.widget.driverClass.driverProperty = sender.driverProperty;
                drivers.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
                sender.driverProperty.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
                sender.driverProperty.addValueListner(sender.onValueChange, sender);
                */
                sender.joinDriver(driver, driver[sender.driverPropertyName]);
            }
        };

        _proto.onValueChange = function onValueChange(sender, driverProperty) {
            sender.draw();
        };

        _proto.onNetworkStatusChange = function onNetworkStatusChange(sender, driverProperty) {
            if (sender.widget != undefined) {
                sender.widget.networkStatus = driverProperty.networkStatus;
            }
        };

        _proto.onDashboardModeChange = function onDashboardModeChange(sender, mode) {
            if (sender.widget != undefined) {
                if (mode) {
                    sender.widget.mode = WORK_MODE;
                } else {
                    sender.widget.mode = MOVE_MODE;
                }
            }
        };

        _proto.widgetClick = function widgetClick(event) {
            event.stopPropagation();
            var widgetPanel = event.currentTarget;
            var widget = widgetPanel.widget;

            if (widget.mode == WORK_MODE) {
                widget.driverClass.driverProperty.getValue();
            }

            return true;
        };

        _proto.refresh = function refresh() { };

        _proto.draw = function draw() {};

        _createClass(BaseWidgetWrapper, [{
            key: "onload",
            get: function get() {
                return this._onload;
            },
            set: function set(onload) {
                this._onload = onload;
            }
        }]);

        return BaseWidgetWrapper;
    }();


var RadialWidgetWrapper =

    function (_BaseWidgetWrapper) {
        "use strict";

        _inheritsLoose(RadialWidgetWrapper, _BaseWidgetWrapper);

        var _proto2 = RadialWidgetWrapper.prototype;

        _proto2.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new RadialWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function RadialWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this;

            _this = _BaseWidgetWrapper.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this);
            return _this;
        }

        _proto2.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, this.driverProperty.value, this.driver._id);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return RadialWidgetWrapper;
    }(BaseWidgetWrapper);

//-----------------------------------------------------------------------------------------------------------------------


var TemperatureWidgetWrapper =
    
    function (_BaseWidgetWrapper) {
        "use strict";

        _inheritsLoose(TemperatureWidgetWrapper, _BaseWidgetWrapper);

        var _proto2 = TemperatureWidgetWrapper.prototype;

        _proto2.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new TemperatureWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function TemperatureWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this;

            _this = _BaseWidgetWrapper.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this);
            return _this;
        }

        _proto2.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, Math.round(this.driverProperty.value), this.driver._id + "-" + getLang("temperature"), this.driver.temperaturehistorydata.value);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return TemperatureWidgetWrapper;
    }(BaseWidgetWrapper); //-----------------------------------------------------------------------------------------------------------------------

var ValueWidgetWrapper =

    function (_BaseWidgetWrapper) {
        "use strict";

        _inheritsLoose(ValueWidgetWrapper, _BaseWidgetWrapper);

        var _proto2 = ValueWidgetWrapper.prototype;

        _proto2.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new ValueWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function ValueWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this;

            _this = _BaseWidgetWrapper.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this);
            return _this;
        }

        _proto2.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, this.driverProperty.value, this.driver._id + "-" + getLang("value"));
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return ValueWidgetWrapper;
    }(BaseWidgetWrapper); //-----------------------------------------------------------------------------------------------------------------------


var HumidityWidgetWrapper =
    
    function (_BaseWidgetWrapper2) {
        "use strict";

        _inheritsLoose(HumidityWidgetWrapper, _BaseWidgetWrapper2);

        function HumidityWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this2;

            _this2 = _BaseWidgetWrapper2.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this2);
            return _this2;
        }


        var _proto3 = HumidityWidgetWrapper.prototype;

        _proto3.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper2.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new RadialWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        _proto3.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, Math.round(this.driverProperty.value) + "%", this.driver._id + "-"+ getLang("humidity"), this.driver.humidityhistorydata.value);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return HumidityWidgetWrapper;
    }(BaseWidgetWrapper); //HistoryData Graph ------------------------------------------------------------------------------------------------------


var HistoryDataGraphWidgetWrapper =
    
    function (_BaseWidgetWrapper3) {
        "use strict";

        _inheritsLoose(HistoryDataGraphWidgetWrapper, _BaseWidgetWrapper3);

        function HistoryDataGraphWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this3;

            _this3 = _BaseWidgetWrapper3.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this3);
            return _this3;
        }

        var _proto4 = HistoryDataGraphWidgetWrapper.prototype;

        _proto4.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper3.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new GraphWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize, temperatureIcon);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;                

           // this.widget.driverClass = this;
            //this.widget.widgetHolder.onclick = this.widgetClick;
            //this.draw();

        };

        _proto4.onWidgetLoad = function onWidgetLoad(widget) {
            widget.widgetHolder.onclick = widget.driverClass.widgetClick;

            //widget.driverClass.draw();
            //widget.properties = widget.driverClass.configPropertiesWidget;
            if (widget.driverClass.widgetProperties != undefined) {
                widget.properties = widget.driverClass.widgetProperties;
            }

            if (widget.driverClass.driver != undefined) {
                widget.driverClass.joinDriver(widget.driverClass.driver, widget.driverClass.driverProperty);
            }

            if (widget.driverClass._onload != undefined) {
                widget.driverClass._onload(widget.driverClass);
            }
        };


        _proto4.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                this.widget.refresh(this.driverProperty.value, this.driver._id, this.driverProperty.value);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return HistoryDataGraphWidgetWrapper;
    }(BaseWidgetWrapper);

var LightWidgetWrapper =
    
    function (_BaseWidgetWrapper4) {
        "use strict";

        _inheritsLoose(LightWidgetWrapper, _BaseWidgetWrapper4);

        var _proto5 = LightWidgetWrapper.prototype;

        _proto5.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper4.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new LightWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;            
            this.widget.onload = this.onWidgetLoad;
        };


        function LightWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this4;

            _this4 = _BaseWidgetWrapper4.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this4);
            return _this4;
        }

        _proto5.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var percent = Math.round(this.driverProperty.value / (1024.0 / 100.0));

                if (percent < 35) {
                    this.widget.refresh(percent, getLang("low"), this.driver._id, this.driver.historydata.value);
                } else if (percent < 70) {
                    this.widget.refresh(percent, getLang("norm"), this.driver._id, this.driver.historydata.value);
                } else {
                    this.widget.refresh(percent, getLang("high"), this.driver._id, this.driver.historydata.value);
                }

            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return LightWidgetWrapper;
    }(BaseWidgetWrapper);

var SmokeWidgetWrapper =
    
    function (_BaseWidgetWrapper5) {
        "use strict";

        _inheritsLoose(SmokeWidgetWrapper, _BaseWidgetWrapper5);

        var _proto6 = SmokeWidgetWrapper.prototype;

        _proto6.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper5.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new SmokeWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function SmokeWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this5;

            _this5 = _BaseWidgetWrapper5.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this5);
            return _this5;
        }

        _proto6.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var percent = Math.round(this.driverProperty.value / (1024.0 / 100.0));

                if (this.driverProperty.value < 50) {
                    this.widget.refresh(percent, getLang("smokelow"), this.driver._id, this.driver.historydata.value);
                } else if (this.driverProperty.value < configProperties.widgetssize) {
                    this.widget.refresh(percent, getLang("smokenorm"), this.driver._id, this.driver.historydata.value);
                } else {
                    this.widget.refresh(percent, getLang("smokehigh"), this.driver._id, this.driver.historydata.value);
                }
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return SmokeWidgetWrapper;
    }(BaseWidgetWrapper);

var MotionWidgetWrapper =
    
    function (_BaseWidgetWrapper6) {
        "use strict";

        _inheritsLoose(MotionWidgetWrapper, _BaseWidgetWrapper6);

        var _proto7 = MotionWidgetWrapper.prototype;

        _proto7.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName) {
            _BaseWidgetWrapper6.prototype.offlineStarter.call(this, parentPanel, driverId, driverPropertyName, true);

            this.widget = new MotionWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
            this.widget.driverClass = this;
            this.widget.onload = this.onWidgetLoad;
        };

        function MotionWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            var _this6;

            _this6 = _BaseWidgetWrapper6.call(this, parentPanel, driver, driverProperty, true, configPropertiesWidget, widgetProperties) || this;
            if (driver == undefined) return _assertThisInitialized(_this6);
            return _this6;
        }

        _proto7.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var data = this.driverProperty.value;

                if (this.driver.historydata.value != undefined) {
                    var splitHistory = this.driver.historydata.value.split(";");
                    var count = parseInt(splitHistory[0]);
                    var lastMotion = 0;

                    if (count > 6) {
                        //last minute 
                        for (var i = count - 6; i < count + 1; i++) {
                            lastMotion += parseFloat(splitHistory[i]);
                        }
                    } else {
                        for (var i = 1; i < count + 1; i++) {
                            lastMotion += parseFloat(splitHistory[i]);
                        }
                    }

                    if (lastMotion != 0) {
                        data = 1;
                    }
                }

                var text = "notdetect";

                if (data == 1) {
                    text = "detect";
                }

                this.widget.refresh(data, text, this.driver._id, this.driver.historydata.value);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return MotionWidgetWrapper;
    }(BaseWidgetWrapper);

var SensorWidgetWrapper =
    
    function (_BaseWidgetWrapper7) {
        "use strict";

        _inheritsLoose(SensorWidgetWrapper, _BaseWidgetWrapper7);

        function SensorWidgetWrapper() {
            return _BaseWidgetWrapper7.apply(this, arguments) || this;
        }

        var _proto8 = SensorWidgetWrapper.prototype;

        _proto8.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var percent = 0;
                var text = getLang("non");

                if (this.driverProperty.value == 1) {
                    percent = 100;
                    text = getLang("yes");
                }

                this.widget.refresh(percent, text, this.driver._id);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        return SensorWidgetWrapper;
    }(BaseWidgetWrapper); //Acturator ----------------------------------------------------------------------------------


var ActuatorWidgetWrapper =
    
    function () {
        "use strict";

        function ActuatorWidgetWrapper(parentPanel, driver, driverProperty, configPropertiesWidget, widgetProperties) {
            this.configPropertiesWidget = configPropertiesWidget;
            this.widgetProperties = widgetProperties;

            if (driver == undefined) {
                drivers.addDriverLoadedListner(this.onDriverLoaded, this);
            } else {
                this.driver = driver;
                this.driverProperty = driverProperty;
                this.offlineStarter(parentPanel, driver._id, driverProperty.name, false);
            }
        }

        var _proto9 = ActuatorWidgetWrapper.prototype;

        _proto9.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName, noWidget) {
            this.driverId = driverId;
            this.driverPropertyName = driverPropertyName;
            dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);

            if (noWidget == undefined || !noWidget) {
                this.widget = new ActuatorWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
                this.widget.driverClass = this;
                this.widget.onload = this.onWidgetLoad;
            }
        };

        _proto9.makeUniqueId = function (id) {
            var count = 1;
            var _id = id;
            while (document.getElementById(_id + "BaseWidget") != undefined) {
                _id = id + count;
                count++;
            }
            return _id;
        }


        _proto9.onWidgetLoad = function onWidgetLoad(widget) {
            widget.widgetHolder.onclick = widget.driverClass.widgetClick;

            if (widget.driverClass.widgetProperties != undefined) {
                widget.properties = widget.driverClass.widgetProperties;
            }

            if (widget.driverClass.driver != undefined) {
                widget.driverClass.joinDriver(widget.driverClass.driver, widget.driverClass.driverProperty);
            }

            if (widget.driverClass._onload != undefined) {
                widget.driverClass._onload(widget.driverClass);
            }

        };


        _proto9.joinDriver = function joinDriver(driver, driverProperty) {
            this.driver = driver;
            this.driverProperty = driverProperty;
            if (this.widget != undefined) {
                this.widget.driverClass.driverProperty = driverProperty;
            }
            this.node = config.getNodeByHost(driver._host); //drivers.addNetworkStatusListner(this.onNetworkStatusChange, this);

            this.node.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addValueListner(this.onValueChange, this);
        };

        _proto9.onDriverLoaded = function onDriverLoaded(sender, driver) {
            if (sender.driver != undefined) return;

            if (sender.driverId == driver._id) {
                sender.joinDriver(driver, driver[sender.driverPropertyName]);
            }
        };
            
        _proto9.onValueChange = function onValueChange(sender, driverProperty) {
            sender.draw();
        };

        _proto9.onNetworkStatusChange = function onNetworkStatusChange(sender, driverProperty) {
            if (sender.widget != undefined) {
                sender.widget.networkStatus = driverProperty.networkStatus;
            }
        };

        _proto9.onDashboardModeChange = function onDashboardModeChange(sender, mode) {
            if (sender.widget != undefined) {
                if (mode) {
                    sender.widget.mode = WORK_MODE;
                } else {
                    sender.widget.mode = MOVE_MODE;
                }
            }
        };

        _proto9.widgetClick = function widgetClick(event) {
            event.stopPropagation();
            var actuatorWidgetPanel = event.currentTarget;
            var widget = actuatorWidgetPanel.widget;

            if (widget.mode == WORK_MODE) {
                var driverProperty = widget.driverClass.driverProperty;

                if (parseInt(driverProperty.value) == 1) {
                    driverProperty.setValue(0);
                } else {
                    driverProperty.setValue(1);
                }
            } //return actuatorWidget;


            return true;
        };

        _proto9.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driverProperty == undefined) return;

            if (this.driverProperty.networkStatus == NET_ONLINE) {
                var text = "off";

                if (parseInt(this.driverProperty.value) == 1) {
                    text = "on";
                }

                this.widget.refresh(this.driverProperty.value, text, this.driver._id);
            } else {
                this.widget.refresh(0, "--", this.driver._id);
            }

            this.widget.networkStatus = this.driverProperty.networkStatus;
            return true;
        };

        _createClass(ActuatorWidgetWrapper, [{
            key: "onload",
            get: function get() {
                return this._onload;
            },
            set: function set(onload) {
                this._onload = onload;
            }
        }]);


        return ActuatorWidgetWrapper;
    }(); //LCD ----------------------------------------------------------------------------------


var LCDWidgetWrapper =
    
    function () {
        "use strict";

        function LCDWidgetWrapper(parentPanel, driver, driverProperty, noWidget, configPropertiesWidget, widgetProperties) {
            this.configPropertiesWidget = configPropertiesWidget;

            if (driver == undefined) {
                drivers.addDriverLoadedListner(this.onDriverLoaded, this);
            } else {
                this.offlineStarter(parentPanel, driver._id, driverProperty.name, noWidget);
                this.joinDriver(driver, driverProperty);
            }
        }

        var _proto10 = LCDWidgetWrapper.prototype;

        _proto10.offlineStarter = function offlineStarter(parentPanel, driverId, driverPropertyName, noWidget) {
            this.driverId = driverId;
            this.driverPropertyName = driverPropertyName;
            dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);

            if (noWidget == undefined || !noWidget) {
                this.widget = new LCDWidget(parentPanel, this.makeUniqueId(driverId), configProperties.widgetssize);
                this.widget.driverClass = this; // this.widget.widgetHolder.onclick = this.widgetClick;
                this.widget.onload = this.onWidgetLoad;
            }
        };

        _proto10.makeUniqueId = function (id) {
            var count = 1;
            var _id = id;
            while (document.getElementById(_id + "BaseWidget") != undefined) {
                _id = id + count;
                count++;
            }
            return _id;
        }


        _proto10.onWidgetLoad = function onWidgetLoad(widget) {
            this.widget.lcdButton.onclick = this.lcdTextClick;
            this.widget.lightButton.onclick = this.lcdLightClick;
            this.draw();
        };


        _proto10.joinDriver = function joinDriver(driver, driverProperty) {
            this.driver = driver;
            this.driver["text"].addNetworkStatusListner(this.onTextChange, this);
            this.driver["text"].addValueListner(this.onTextChange, this);
            this.driver["backlight"].addValueListner(this.onLightChange, this);
            this.driverProperty = driverProperty;
            this.widget.driverClass.driverProperty = driverProperty;
            this.node = config.getNodeByHost(driver._host);
            this.node.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
            this.driverProperty.addValueListner(this.onValueChange, this);
        };

        _proto10.onDriverLoaded = function onDriverLoaded(sender, driver) {
            if (sender.driver != undefined) return;

            if (sender.driverId == driver._id) {
                sender.joinDriver(driver, driver[sender.driverPropertyName]);
            }
        } //---------------------------------------

            /*
            offlineStarter(parentPanel, driverId, driverPropertyName, noWidget) {
                this.driverId = driverId;
                this.driverPropertyName = driverPropertyName;
                drivers.addNetworkStatusListner(this.onNetworkStatusChange, this);
                 dashboardUI.addDashboardModeListner(this.onDashboardModeChange, this);
                 this.widget = new LCDWidget(parentPanel, driverId, configProperties.widgetssize);
                this.widget.driverClass = this;
                this.widget.lcdButton.onclick = this.lcdTextClick;
                this.widget.lightButton.onclick = this.lcdLightClick;
                this.draw();
             }
             constructor(parentPanel, driver, driverProperty, configPropertiesWidget) {
                this.configPropertiesWidget = configPropertiesWidget;
                if (driver == undefined) {
                    drivers.addDriverLoadedListner(this.onDriverLoaded, this);
                }
                else {
                    this.offlineStarter(parentPanel, driver._id, driverProperty.name);
                    this.driver = driver;
                    this.driver["text"].addNetworkStatusListner(this.onTextChange, this);
                    this.driver["text"].addValueListner(this.onTextChange, this);
                    this.driver["backlight"].addValueListner(this.onLightChange, this);
                   //  this.driverProperty = driverProperty;
                 //   this.driverProperty.addNetworkStatusListner(this.onNetworkStatusChange, this);
                 //  this.driverProperty.addValueListner(this.onValueChange, this);
                 }
            }
              onDriverLoaded(sender, driver) {
                if (sender.driver != undefined) return;
                if (sender.driverId == driver._id) {
                    sender.driver = driver;
                     sender.driver["text"].addNetworkStatusListner(sender.onTextChange, sender);
                    sender.driver["text"].addValueListner(sender.onTextChange, sender);
                    sender.driver["backlight"].addValueListner(sender.onLightChange, sender);
                     drivers.addNetworkStatusListner(sender.onNetworkStatusChange, sender);
                 }
            }
            */
            ;

        _proto10.onDashboardModeChange = function onDashboardModeChange(sender, mode) {
            if (sender.widget != undefined) {
                if (mode) {
                    sender.widget.mode = WORK_MODE;
                } else {
                    sender.widget.mode = MOVE_MODE;
                }
            }
        };

        _proto10.onNetworkStatusChange = function onNetworkStatusChange(sender, driverProperty) {
            if (sender.widget != undefined) {
                sender.widget.networkStatus = driverProperty.networkStatus;
            }
        };

        _proto10.onTextChange = function onTextChange(sender, driverProperty) {
            sender.draw();
        };

        _proto10.onLightChange = function onLightChange(sender, driverProperty) {
            sender.draw();
        };

        _proto10.lcdTextClick = function lcdTextClick(event) {
            event.stopPropagation();
            var lcdWidgetPanel = event.currentTarget;
            var widget = lcdWidgetPanel.widget;

            if (widget.mode == WORK_MODE) {
                widget.hideEditor();
                var driverProperty = widget.driverClass.driver["text"];
                driverProperty.setValue(widget.textarea.value);
            }
        };

        _proto10.lcdLightClick = function lcdLightClick(event) {
            event.stopPropagation();
            var lcdWidgetPanel = event.currentTarget;
            var widget = lcdWidgetPanel.widget;

            if (widget.mode == WORK_MODE) {
                widget.hideEditor();
                var driverProperty = widget.driverClass.driver["backlight"];

                if (parseInt(driverProperty.value) == 1) {
                    driverProperty.setValue(0);
                } else {
                    driverProperty.setValue(1);
                }
            }
        };

        _proto10.draw = function draw() {
            if (this.widget == undefined) return;
            if (this.driver == undefined) return;

            if (this.driver["text"].networkStatus == NET_ONLINE) {
                if (this.driver["text"].value != undefined) {
                    this.widget.refresh(this.driver["text"].value, this.driver._id, this.driver["backlight"].value);
                } else {
                    this.widget.refresh("", this.driver._id, this.driver["backlight"].value);
                }
            } else {
                this.widget.refresh("", this.driver._id, 0);
            }

            this.widget.networkStatus = this.driver["text"].networkStatus;
            return true;
        } //set _networkStatus(networkStatus) {
            //this.lcdWidget.networkStatus = networkStatus;
            //}
            ;

        return LCDWidgetWrapper;
    }(); //Stepper ----------------------------------------------------------------------------------


var StepperWidgetWrapper =
    
    function () {
        "use strict";

        function StepperWidgetWrapper(parentPanel, id, propertyName) {
            this.id = id;
            this.propertyName = propertyName;
            this.stepperWidget = new StepperWidget(parentPanel, id, configProperties.widgetssize);
            this.stepperWidget.driverClass = this;
            this.stepperWidget.positionChangeReciever = this.positionChange;
        }

        var _proto11 = StepperWidgetWrapper.prototype;

        _proto11.positionChange = function positionChange(toPercent) {
            //this is caller (stepperWidget)
            if (this.atProcess) {
                //todo cancel
                this.atProcess = false;
                return;
            }

            this.atProcess = true;
            var driverClass = this.driverClass;
            var newToPosition = toPercent * (driverClass.range / 100);
            setDriverPropertyAsyncWithReciever(driverClass.id, "toposition", newToPosition, driverClass.clientCallback, driverClass);
        };

        _proto11.clientCallback = function clientCallback(data, driverClass) {
            if (!data.indexOf("%error") == 0) {
                driverClass.stepperWidget.networkStatus = NET_RECONNECT;
            } else {
                if (!data.indexOf("response")!=-1) {//offline 
                    //  driverClass.stepperWidget.networkStatus = NET_OFFLINE;
                } else {
                    //driver error
                    driverClass.draw(data);
                }
            }
        };

        _proto11.refresh = function refresh() {
            if (status_online == NET_ONLINE) {
                this.position = getParsedDriverProperty(this.id, "position");
                this.toposition = getParsedDriverProperty(this.id, "toposition");
                this.range = getParsedDriverProperty(this.id, "range");
                this.draw(this.position, this.toposition, this.range);
            } else {
                this.stepperWidget.networkStatus = status_online;
            }
        };

        _proto11.draw = function draw(position, toposition, range) {
            if (this.driverProperty == undefined) return;

            if (!isNaN(position)) {
                var percent = position / (range / 100);
                var toPercent = toposition / (range / 100);
                this.stepperWidget.refresh(percent, toPercent, Math.round(percent) + "%", this.id);
                this.stepperWidget.networkStatus = NET_ONLINE;
            } else {//TODO
                // this.stepperWidget.refresh(0, 0, "--", this.id);
                // this.stepperWidget.networkStatus = NET_ERROR;
            }
        };

        _createClass(StepperWidgetWrapper, [{
            key: "_networkStatus",
            set: function set(networkStatus) {
                this.stepperWidget.networkStatus = networkStatus;
            }
        }]);

        return StepperWidgetWrapper;
    }(); //Widget layer -------------------------------------------------


var WidgetsLayer = {
    
    RadialWidget: {
        id: "radialwidget",
        name: getLang("radial"),
        widget: RadialWidgetWrapper,
        driversTypes: "any",
        driversProperties: "any"
    },    
    TemperatureWidget: {
        id: "temperature",
        name: getLang("temperature"),
        widget: TemperatureWidgetWrapper,
        driversTypes: ";" + DHTDriverType + ";",
        driversProperties: ";temperature;"
    },
    HumidityWidget: {
        id: "humidity",
        name: getLang("humidity"),
        widget: HumidityWidgetWrapper,
        driversTypes: ";" + DHTDriverType + ";",
        driversProperties: ";humidity;"
    },
    HistoryDataGraphWidget: {
        id: "historydatagraph",
        name: getLang("historydatagraph"),
        widget: HistoryDataGraphWidgetWrapper,
        driversTypes: "any",
        driversProperties: ";historydata;historyfile;temperaturehistorydata;humidityhistorydata;"
    },
    LightWidget: {
        id: "light",
        name: getLang("light"),
        widget: LightWidgetWrapper,
        driversTypes: ";" + LightDriverType + ";",
        driversProperties: ";light;"
    },
    SmokeWidget: {
        id: "smoke",
        name: getLang("smoke"),
        widget: SmokeWidgetWrapper,
        driversTypes: ";" + SmokeDriverType + ";",
        driversProperties: ";smoke;"
    },
    MotionWidget: {
        id: "motion",
        name: getLang("motion"),
        widget: MotionWidgetWrapper,
        driversTypes: ";" + MotionDriverType + ";",
        driversProperties: ";motion;"
    },
    SensorWidget: {
        id: "sensor",
        name: getLang("sensor"),
        widget: SensorWidgetWrapper,
        driversTypes: ";" + SensorDriverType + ";",
        driversProperties: ";data;"
    },
    LCDWidget: {
        id: "lcd",
        name: getLang("lcd"),
        widget: LCDWidgetWrapper,
        driversTypes: ";" + LCDDriverType + ";",
        driversProperties: "any"
    },
    ActuatorWidget: {
        id: "actuator",
        name: getLang("actuator"),
        widget: ActuatorWidgetWrapper,
        driversTypes: ";" + ActuatorDriverType + ";",
        driversProperties: ";data;"
    },

    ValueWidget: {
        id: "value",
        name: getLang("value"),
        widget: ValueWidgetWrapper,
        driversTypes: "any",
        driversProperties: "any"
    },


    /*
    StepperWidget: {
        id: "stepper",
        name: getLang("stepper"),
        widget: StepperWidgetWrapper,
        driversTypes: ";" + StepperDriverType + ";",
        driversProperties: "any",
     },
    */
    getWidgetById: function getWidgetById(id) {
        if (id == undefined) return undefined;

        for (var widgetProp in WidgetsLayer) {
            if (WidgetsLayer[widgetProp].id == undefined) continue;

            if (WidgetsLayer[widgetProp].id == id) {
                return WidgetsLayer[widgetProp];
            }
        }

        return undefined;
    }
};﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

//--------------------------------------------------------------------------------------------------------------------------------------------------
//Загрузчик OWLOS front части.
//Загружает JavaScript и CSS модули необходимые для работы OWLOS.
//Проверяет возможность подключения к Internet - если нет - меняет путь загрузки некоторых модулей, подгружая их из Модуля (что медлено, но дает возможность автономной работы)
//при начальной загрузкой браузером, подгружается только index.html и bootcore.js -> которая в свою очередь в фоновом режиме грузит весь остальной контент. 
//index.html в начале загрузки отображает консоль вывода, что позволяет bootcore.js информировать пользователя о процессе загрузки и возможных проблемах. (смотрите index.html)

//Существует 3 способа загрузки UI OWLOS:
// 1) Браузер грузит UI подключивший к модулю как к WiFi станции в локальной сети или через Интернет forwarding (проброшен порт и модуль выставлен в мир)
// - index.html и bootcore.js загружаются из flash памяти модуля, через встроенный web сервер, после чего bootcore.js - определяет доступен ли интернет,
// -- если ДА - "стандартный" контент (jQury, bootstrap, dataTable...) грузятся из интернет, в свою очередь OWLOS модули из flash модуля.
// -- если НЕТ - все грузится из flash  
// 2) Браузер грузит UI подключившись к модулю в режиме WiFi точки доступа (режим "чистое поле" интернета нет)
//    компьютер или телефон должен быть подключен к модулю как станция, IP модуля по умолчанию 192.168.4.1
// - также как и в первом случае БЕЗ интернета
// 3) [отладка] Файлы входящие в OWLOS UI должны быть на вашем локальном диске. Откройте restclientcore.js и укажите host=[текущий адрес модуля в сети http://адрес:port], 
//    откройте index.html браузером как файл. Это самый быстрый способ загрузки UI и хороший способ для отладки. 

//NOTE: функции работы с консолью реализованы в этом же модули ниже, по завершению загрузки консоль переместится в соответствующий раздел главного меню 
//OWLOS UI - там можно детально изучить процесс загрузки
//^^^---------------------------------------------------------------------------------------------------------------------------------------------------

//Global flags 
const NET_OFFLINE = 0; 
const NET_ONLINE = 1;
const NET_ERROR = 2;
const NET_RECONNECT = 3;
const NET_REFRESH = 4; //используется объектом drivers только (устанавливается в момент начала цикла перезагрузки данных драйвер)

//var UIWatch = 'light';
var UIWatch = '';


function boot() {
    try { //first jQuery and chech internet access (if not internet - loading library from local)                
        addToLogNL("[BOOT]", 1);
        addToLogNL("Welcome to Free [O]bjects[W]rapper[L]ayer OS"); //приветствие, пишем в консоль
        addToLogNL("--------------------------------------------");
        addToLogNL("loading scripts...");
        //первым пробуем загрузить из Интернет jQuery если это получится - пойдем по пути подгрузки "стандартных" модулей из Интернет (jQuery, bootstrup, dataTables)
        var jQueryScript = document.createElement('script');
        //NOTE: что бы лучше понять этот код сверните jQueryScript.onerror обработчик до строки с кодом 
        //jQueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"; 
        //^^^сначала назначаем обработчики событий onload onerror - потом приступаем к загрузке, по результатам выберим режим загрузки - с интернетом или без
        jQueryScript.onload = function () { //событие будет вызвано если jQuery удалось загрузить из Интернет
            addToLogEnd("...OK", 1);
            addToLogNL("Internet accessable mode", 1);
            loadingScripts(true); //грузим контент рассчитывая на то что у нас есть интернет
        };
        jQueryScript.onerror = function () { //если не удалось загрузить jQuery из сети
            addToLogEnd("...ERROR", 2);
            addToLogNL("Internet unaccessable mode", 2);
            addToLog("loading jQuery from local");
            var jQueryScriptLocal = document.createElement('script'); //"переигрываем" грузим jQuery через web server модуля (без интернет)
            jQueryScriptLocal.onload = function () {
                addToLogEnd("...OK", 1);
                loadingScripts(false); //загрузка из flash памяти модуля, через наш web server
            };
            jQueryScriptLocal.onerror = function () {//если все совсем, совсем плохо - не интернета, не нужных файлов во flash памяти модуля
                addToLogEnd("...ERROR", 2);
                addToLogNL("Error booting node, check local node's files..."); //NOTE: мы оборвем процесс загрузки (((
            };

            jQueryScriptLocal.src = "jquery.min.js";
            document.getElementsByTagName('head')[0].appendChild(jQueryScriptLocal);
        };
        //начинаем попытку загрузить jQuery из интернет, смотрите onload и onerror
        jQueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js";
        addToLog("loading jQuery from " + jQueryScript.src);
        document.getElementsByTagName('head')[0].appendChild(jQueryScript);
    } catch (error) { //если что то пошло совсем не так
        console.error(exception);
        addToLogNL("loading scripts exception: " + error, 2);
    }
}
//Загрузка контента с интернет или без него, с учетом зависимости модулей (загрузка некоторых модулей, требует предварительной загрузки других,
//так как мы используем асинхронный метод загрузки - некоторые модули должне "дождатъся" загрузки тех от кого они зависят)
//...и да - нет никакого списка загрузки, как не странно здесь удобен хардкод
function loadingScripts(withInternet) {
    //bottstrap css
    new Promise(function (resolve, reject) {//первым грузим bootstrap.css и ожидаем окончание
        var link = document.createElement('link');
        link.rel = 'stylesheet';

        if (UIWatch === 'light') {
            if (withInternet) link.href = "https://bootswatch.com/4/flatly/bootstrap.min.css"; 
            else link.href = "bootstrap.spacelab.min.css"; //если мы без интернет
        }
        else {//default 
            if (withInternet) link.href = "https://bootswatch.com/4/slate/bootstrap.min.css"; //если мы с интернет //link.href = "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
            else link.href = "bootstrap.min.css"; //если мы без интернет

        }
        

        addToLog("loading bootstrap.css from " + link.href); //намерения загрузить в консоль

        document.getElementsByTagName("head")[0].appendChild(link);
        link.onload = function () {//если получится загрузить bootstap.css
            addToLogEnd("..OK", 1);//отметим в консоле об успехе 
            resolve();//говорим наверх что все хорошо -> https://learn.javascript.ru/promise
            if (withInternet) loadCSS("https://cdn.datatables.net/v/dt/dt-1.10.18/datatables.min.css"); //следующий CSS с интернет
            else loadCSS("dataTables.min.css");//без 
            loadCSS("ui.css"); //это OWLOS UI CSS - его грузим из модуля
            //first jQuery Tables
            var jQueryTablesScript = document.createElement('script'); //многие зависят от jQueryTables, например datatables.js - по этому будем ожидать его загрузки что бы продолжить
            jQueryTablesScript.onload = function () {//jQueryTables.js загрузились
                //грузим зависимый datatables.js
                if (withInternet) loadingScript("https://cdn.datatables.net/v/dt/dt-1.10.18/datatables.min.js");
                else loadingScript("dataTables.min.js");
                //от poperScript тоже много кто зависит, будем ждать
                var poperScript = document.createElement('script');
                poperScript.onload = function () {//poperScript.js загрузились

                    var bootstrapScript = document.createElement('script'); //и ОН САМЫЙ, без него никак, грузим - ждем
                    bootstrapScript.onload = function () {//готово
                        loadingScript("configcore.js");
                        loadingScript("languagescore.js"); //все модулю без URL принадлежать OWS OS и всегда грузятся с flash
                        loadingScript("speechcore.js");
                        loadingScript("drawcore.js");
                        loadingScript("restclientcore.js");
                        loadingScript("driverscore.js");
                        loadingScript("scriptscore.js");
                        loadingScript("pinscore.js");

                        var baseWidgetScript = document.createElement('script');
                        baseWidgetScript.onload = function () {
                            //  loadingScript("basewidget.js");
                            loadingScript("radialwidget.js");
                            loadingScript("actuatorwidget.js");
                            loadingScript("lcdwidget.js");
                            loadingScript("stepperwidget.js");
                            loadingScript("motionwidget.js");
                            loadingScript("smokewidget.js");
                            loadingScript("lightwidget.js");
                            loadingScript("temperaturewidget.js");
                            loadingScript("graphwidget.js");
                            loadingScript("tablewidget.js");
                            loadingScript("valuewidget.js");
                            loadingScript("widgetswrappers.js");
                            loadingScript("filespanelui.js");
                            loadingScript("driversui.js");
                            loadingScript("dashboardui.js");
                            loadingScript("settingsui.js");

                            //var nodePropertiesScript = document.createElement('script'); //с ожиданием
                            //nodePropertiesScript.onload = function () { //when node properties is loading we can start index script

                            loadingScript("index.js"); //ядро OWLOS UI, грузится последним, стартует систему
                            //}
                            //--> NOTE: код ниже - обратное сворачивание загрузчкив контента (стек загрузки)
                            //nodePropertiesScript.src = "nodeproperties.js";
                            //addToLogNL("loading nodeproperties from " + nodePropertiesScript.src);
                            //document.getElementsByTagName('head')[0].appendChild(nodePropertiesScript);
                        }
                        //--> NOTE: код ниже - обратное сворачивание загрузчкив контента (стек загрузки)
                        baseWidgetScript.src = "basewidget.js";
                        addToLogNL("loading basewidget from " + baseWidgetScript.src);
                        document.getElementsByTagName('head')[0].appendChild(baseWidgetScript);
                    }
                    //--> NOTE: код ниже - обратное сворачивание загрузчкив контента (стек загрузки)
                    if (withInternet) bootstrapScript.src = "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js";
                    else bootstrapScript.src = "bootstrap.min.js";
                    addToLogNL("loading bootstrap from " + bootstrapScript.src);
                    document.getElementsByTagName('head')[0].appendChild(bootstrapScript);
                }
                if (withInternet) poperScript.src = "https://unpkg.com/popper.js@1.15.0/dist/umd/popper.min.js";
                else poperScript.src = "popper.min.js";
                addToLogNL("loading poper from " + poperScript.src);
                document.getElementsByTagName('head')[0].appendChild(poperScript);

            };
            if (withInternet) jQueryTablesScript.src = "https://cdn.datatables.net/1.10.18/js/jquery.dataTables.min.js";
            else jQueryTablesScript.src = "jquery.dataTables.min.js";
            addToLogNL("loading jQueryTables from " + jQueryTablesScript.src);
            document.getElementsByTagName('head')[0].appendChild(jQueryTablesScript);
        };
    });

}
//для очистки кода loadingScripts часто используемый участок вынесен в отдельную фунцию
function loadingScript(scriptURL) {
    addToLogNL("loading script from " + scriptURL);
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", scriptURL);
    document.getElementsByTagName("head")[0].appendChild(script);
}
//для очистки кода loadingScripts часто используемый участок вынесен в отдельную фунцию
function loadCSS(cssURL) {
    addToLogNL("loading css from " + cssURL);
    return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssURL;
        document.getElementsByTagName("head")[0].appendChild(link);
        link.onload = function () {
            resolve();
        };

        link.onerror = function () {
        };
    });
}
//CLASS to Object supporting 
function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true;
        }
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps);
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps); return Constructor;
    }
}

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    } return self;
}

//see: https://learn.javascript.ru/prototype
function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype); 
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
}

function waitForElement(element, callBack) {
    window.setTimeout(function () {
        if ($("#" + element.id).length) {
            var event = {
                currentTarget: element
            }
            callBack(event);
        } else {
            waitForElement(element, callBack);
        }
    }, 500)
}



//--------------------------------------------------------------------------------------------------------------------------------------------------
//работа с консолью реализована в bootcore.js - здесь этот код используется и не надо грузить лишние модули из index.html
//даже если что то совсем пойдет не так - у нас есть возможность информировать пользователя, так как мы загрузили Log скрипты при помощи браузера

//добавить строку обычным цветом
function addToLog(text) {
    addToLog(text, 0);
}
//добавить строку с кодом цвета (кодом события)
//NOTE: для указания цвета используется bootstrap - одна в начале загрузки его не будет, консоль "окрасится" если получится загрузить bootstrap
function addToLog(text, code) {
    var bootLog = document.getElementById("bootLog");
    if (code == 1) { //success
        bootLog.innerHTML += "<text class='text-warning'>" + new Date().toLocaleString() + "</text><text class='text-success'> " + text + "</text>";
    }
    else
        if (code == 2) { //error    
            bootLog.innerHTML += "<text class='text-warning'>" + new Date().toLocaleString() + "</text><text class='text-danger'> " + text + "</text>";
        }
        else {
            bootLog.innerHTML += "<text class='text-warning'>" + new Date().toLocaleString() + "</text> " + text;
        }
}
//добавить строку обычным цветом и перевести карретку
function addToLogNL(text) {
    addToLog(text + "\n", 0);
}
//добавить строку с кодом цвета и перевести карретку
function addToLogNL(text, code) {

    addToLog(text + "\n", code);
}
//добавить строку в конец текущей
function addToLogEnd(text) {
    addToLogEnd(text, 0);

}
//добавить строку в конец текущей с цветом
//очень удобно, печатаем серым "loading poper.js..." и если удалось добавляем в конец строки зеленым "ок" или красным "error"
function addToLogEnd(text, code) {
    var bootLog = document.getElementById("bootLog");
    if (code == 1) { //success
        bootLog.innerHTML += "<text class='text-success'> " + text + "\n</text>";
    }
    else
        if (code == 2) { //error    
            bootLog.innerHTML += "<text class='text-danger'> " + text + "\n</text>";
        }
        else {
            bootLog.innerHTML += text + "\n";
        }
}
﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var nodeId;
var nodesRefreshHandle;
var autorefreshbutton;
var refreshbutton;

var status_online = NET_OFFLINE;
var status_wifiap = NET_OFFLINE;
var status_wifist = NET_OFFLINE;
var status_restful = NET_OFFLINE;
var status_mqtt = NET_OFFLINE;
var status_ota = NET_OFFLINE;

var theme = {};

var wifiap = 0;

//Connection state for WiFiST and MQTTClient
var mqttState = getLang("disconnected");
var wifiSTconection = getLang("disconnected");

var firstTime = true;
var runOnce = true;

$(document).ready(function () {

    if (!runOnce) return; 
    runOnce = false;

    addToLogNL("OK loading scripts");
    addToLogNL("[START]", 1);

    //Check languages DEBUG
    //langCompare(langua, langru, document.getElementById("bootLog"));

    jQuery.readyException = function (error) {
        addToLogNL("jQuery error: " + error, 2);
    };

    $(document).ajaxError(function (event, request, settings) {
        addToLogNL("Ajax error: " + settings.url, 2);
    });

    var style = window.getComputedStyle(document.body, null);
    theme.primary = style.getPropertyValue('--primary');
    theme.secondary = style.getPropertyValue('--secondary');
    theme.success = style.getPropertyValue('--success');
    theme.info = style.getPropertyValue('--info');
    theme.warning = style.getPropertyValue('--warning');
    theme.danger = style.getPropertyValue('--danger');
    theme.light = style.getPropertyValue('--light');
    theme.dark = style.getPropertyValue('--dark');
    theme.fontFamily = style.fontFamily;

    if (theme.primary === '') { //default dark
        theme.primary = '#3A3F44';
        theme.secondary = '#7A8288';
        theme.success = '#62c462';
        theme.info = '#5bc0de';
        theme.warning = '#f89406';
        theme.danger = '#ee5f5b';
        theme.light = '#e9ecef';
        theme.dark = '#272B30';
    }

    addToLogNL("get UI configuration...");
   try {

 
    config.onLoad = onConfigLoad;
    config.onLoad = settingsUI.onConfigLoad;
    config.onLoad = dashboardUI.onConfigLoad;
    if (config.load()) {
        
        status_online = NET_ONLINE;
        speak("OWLOS is started");

        addToLogNL(getLang("prepareUnit"));

        drivers.addDriverLoadedListner(settingsUI.onDriverLoaded, settingsUI);
        nodesRefresh();

        var boot = document.getElementById("boot");
        boot.parentElement.removeChild(boot);
        document.getElementById("consolePanel").appendChild(boot);

        nodesRefreshHandle = setInterval(nodesRefresh, 60000);
        

        /*
        $("#createScript").click(function (event) {
            var textArea = document.getElementById("scriptText");
            httpPostAsyncWithErrorReson(boardhost + "createscript", "?name=main1", escape(textArea.value));
        });
        */
        
        speak("OWLOS is ready");
       
    }
    else {
        status_online = NET_OFFLINE;
        speak("ERROR with host: " + boardhost);
        addToLogNL("ERROR with host: " + boardhost, 2);
    }
    }


        catch (exception) {
          status_online = NET_OFFLINE;
    addToLogNL("ERROR starting exception: " + exception, 2);
    addToLogNL("ERROR delete configurations files can help fix it: [your host]/deletefile?name=web.config", 2);
    }
   }
);


function onConfigLoad(configProperties) {
    createProSidebar();
    $(".page-wrapper").toggleClass("toggled");

    document.getElementById("toggle-sidebar").style.display = "block";
    document.getElementById("pin-sidebar").style.display = "block";
    document.getElementById("nodeStatusPanelText").style.display = "block";
    document.getElementById("sidebarText").style.display = "block";

}

function proSideBarMenuClick(event) {
    var nodeStatusPanel = document.getElementById("nodeStatusPanel");
    if (nodeStatusPanel != undefined) {
        if (nodeStatusPanel.currentStatusPanel != undefined) {
            nodeStatusPanel.currentStatusPanel.style.display = "none";
            nodeStatusPanel.currentStatusPanel.nodeStatusPanelText.style.display = "none";                
        } 
    }
    return false;
}

function proSideBarDashboardMenuClick(event) {
    $(this).removeClass('active'); 
    document.getElementById("sidebarText").style.display = "block";
    document.getElementById("sidebarText").innerText = event.currentTarget.addressText;
    document.getElementById("dashboardButtonsPanel").style.display = "block";
    return proSideBarMenuClick(event);
}

function proSideBarConsoleMenuClick(event) {
    $(this).removeClass('active'); 
    document.getElementById("sidebarText").style.display = "none";
    document.getElementById("sidebarText").innerText = "";
    document.getElementById("dashboardButtonsPanel").style.display = "none";
    return proSideBarMenuClick(event);
}


function createProSidebar() {
    

    var pageWrapper = document.getElementById("pagewrapper");
    var sideBar = pageWrapper.appendChild(document.createElement("nav"));
    sideBar.id = "sidebar";
    sideBar.className = "sidebar-wrapper";
    var sideBarContent = sideBar.appendChild(document.createElement("div"));
    sideBarContent.className = "sidebar-content";
    var mainSideBar = sideBarContent.appendChild(document.createElement("div"));
    mainSideBar.id = "mainSideBar";
    mainSideBar.className = "sidebar-item sidebar-menu";

//    var mainSideBar = document.getElementById("mainSideBar");
    var sideBarOWLOS = mainSideBar.appendChild(document.createElement("div"));
    sideBarOWLOS.className = "sidebar-item sidebar-brand";
    var hRef = sideBarOWLOS.appendChild(document.createElement("a"));
    hRef.href = "https://github.com/KirinDenis/owlos";
    hRef.innerText = "OWLOS";

    var sideBarHeader = mainSideBar.appendChild(document.createElement("div"));
    sideBarHeader.className = "sidebar-item sidebar-header d-flex flex-nowrap";
    var sideBarHeaderInfo = sideBarHeader.appendChild(document.createElement("div"));
    sideBarHeaderInfo.className = "user-info";
    var sideBarHeaderInfoVersion = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoVersion.className = "user-name";
    sideBarHeaderInfoVersion.innerHTML = "version<strong> 1.7</strong>";
    var sideBarHeaderInfoRole = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoRole.className = "user-role";
    sideBarHeaderInfoRole.innerHTML = "Administrator";
    var sideBarHeaderInfoStatus = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoStatus.className = "user-status";
    sideBarHeaderInfoStatus.appendChild(document.createElement("i")).className = "fa fa-circle";
    
    var sideBarHeaderInfoRoleSpan = sideBarHeaderInfoStatus.appendChild(document.createElement("span"));
    sideBarHeaderInfoRoleSpan.innerHTML = "Online";

    var sideBarUl = mainSideBar.appendChild(document.createElement("ul"));

    //Панель управления 
    var sideBarDashboardLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarDashboardLi.id = "sideBarDashboardLi";
    sideBarDashboardLi.className = "nav-item";
    var sideBarDashboardAhref = sideBarDashboardLi.appendChild(document.createElement("a"));
    sideBarDashboardAhref.id = "sideBarDashboardAhref";
    sideBarDashboardAhref.className = "nav-link";
    
    sideBarDashboardAhref.href = "#dashboard";
    sideBarDashboardAhref.setAttribute("data-toggle", "tab");
    sideBarDashboardAhref.onclick = proSideBarDashboardMenuClick; 
    sideBarDashboardAhref.addressText = getLang("dashboardTab");


    sideBarDashboardAhref.appendChild(document.createElement("i")).className = "fa fa-tachometer-alt";
    var sideBarDashboardAhrefSpan = sideBarDashboardAhref.appendChild(document.createElement("span"));
    sideBarDashboardAhrefSpan.className = "menu-text";    
    sideBarDashboardAhrefSpan.innerText = sideBarDashboardAhref.addressText;
    document.getElementById("sidebarText").innerText = sideBarDashboardAhref.addressText;

    sideBarDashboardAhrefSpan = sideBarDashboardAhref.appendChild(document.createElement("span"));
    sideBarDashboardAhrefSpan.className = "badge badge-pill badge-success";
    sideBarDashboardAhrefSpan.id = "sideBarDashboardAhrefSpan";
    

    config.onLoad = function (configProperties) {
        sideBarDashboardAhrefSpan.innerHTML = configProperties.dashboards[0].widgets.length;
    }

    config.onChange = function (configProperties) {
        sideBarDashboardAhrefSpan.innerHTML = configProperties.dashboards[0].widgets.length;
    }


    //настройки  
    var sideBarSettingsLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarSettingsLi.className = "sidebar-dropdown";
    var sideBarSettingsAhref = sideBarSettingsLi.appendChild(document.createElement("a"));
    sideBarSettingsAhref.className = "nav-link";
    sideBarSettingsAhref.href = "#settings";
    sideBarSettingsAhref.setAttribute("data-toggle", "tab");
    sideBarSettingsAhref.onclick = function (event) { $(this).removeClass('active'); };

    sideBarSettingsAhref.appendChild(document.createElement("i")).className = "fa fa-cogs";
    var sideBarSettingsAhrefSpan = sideBarSettingsAhref.appendChild(document.createElement("span"));
    sideBarSettingsAhrefSpan.className = "menu-text";
    sideBarSettingsAhrefSpan.id = "settings-tab";
    sideBarSettingsAhrefSpan.innerText = getLang("settingsTab");

    var sideBarSettingsLiSubmenu = sideBarSettingsLi.appendChild(document.createElement("div"));
    sideBarSettingsLiSubmenu.className = "sidebar-submenu";
    sideBarSettingsLiSubmenu.style.display = "block";
    var sideBarSettingsLiSubmenuUl = sideBarSettingsLiSubmenu.appendChild(document.createElement("ul"));
    sideBarSettingsLiSubmenuUl.id = "settingsSideBarUl";

    var sideBarConsoleLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarConsoleLi.className = "nav-item";
    var sideBarConsoleAhref = sideBarConsoleLi.appendChild(document.createElement("a"));
    sideBarConsoleAhref.className = "nav-link";
    sideBarConsoleAhref.href = "#console";
    sideBarConsoleAhref.setAttribute("data-toggle", "tab");
    sideBarConsoleAhref.addressText = getLang("consoleTab");
    sideBarConsoleAhref.onclick = proSideBarConsoleMenuClick;

    sideBarConsoleAhref.appendChild(document.createElement("i")).className = "fa fa-file-code";
    var sideBarConsoleAhrefSpan = sideBarConsoleAhref.appendChild(document.createElement("span"));
    sideBarConsoleAhrefSpan.className = "menu-text";
    sideBarConsoleAhrefSpan.innerText = sideBarConsoleAhref.addressText;


    jQuery(function ($) {

        // Dropdown menu
        $(".sidebar-dropdown > a").click(function () {
            $(".sidebar-submenu").slideUp(200);
            if ($(this).parent().hasClass("active")) {
                $(".sidebar-dropdown").removeClass("active");
                $(this).parent().removeClass("active");
            } else {
                $(".sidebar-dropdown").removeClass("active");
                $(this).next(".sidebar-submenu").slideDown(200);
                $(this).parent().addClass("active");
            }

        });

        //toggle sidebar
        $("#toggle-sidebar").click(function () {
            $(".page-wrapper").toggleClass("toggled");
        });
        //Pin sidebar
        $("#pin-sidebar").click(function () {
            if ($(".page-wrapper").hasClass("pinned")) {
                // unpin sidebar when hovered
                $(".page-wrapper").removeClass("pinned");
                $("#sidebar").unbind("hover");
            } else {
                $(".page-wrapper").addClass("pinned");
                $("#sidebar").hover(
                    function () {
                        console.log("mouseenter");
                        $(".page-wrapper").addClass("sidebar-hovered");
                    },
                    function () {
                        console.log("mouseout");
                        $(".page-wrapper").removeClass("sidebar-hovered");
                    }
                )

            }
        });


        //toggle sidebar overlay
        $("#overlay").click(function () {
            $(".page-wrapper").toggleClass("toggled");
        });

        //switch between themes 
        var themes = "default-theme legacy-theme chiller-theme ice-theme cool-theme light-theme";
        $('[data-theme]').click(function () {
            $('[data-theme]').removeClass("selected");
            $(this).addClass("selected");
            $('.page-wrapper').removeClass(themes);
            $('.page-wrapper').addClass($(this).attr('data-theme'));
        });

        // switch between background images
        var bgs = "bg1 bg2 bg3 bg4";
        $('[data-bg]').click(function () {
            $('[data-bg]').removeClass("selected");
            $(this).addClass("selected");
            $('.page-wrapper').removeClass(bgs);
            $('.page-wrapper').addClass($(this).attr('data-bg'));
        });

        // toggle background image
        $("#toggle-bg").change(function (e) {
            e.preventDefault();
            $('.page-wrapper').toggleClass("sidebar-bg");
        });

        // toggle border radius
        $("#toggle-border-radius").change(function (e) {
            e.preventDefault();
            $('.page-wrapper').toggleClass("border-radius-on");
        });

        //custom scroll bar is only used on desktop
        /*
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $(".sidebar-content").mCustomScrollbar({
                axis: "y",
                autoHideScrollbar: true,
                scrollInertia: 300
            });
            $(".sidebar-content").addClass("desktop");

        }
        */
    });
}

function nodesRefresh() {
    for (var node in configProperties.nodes) {
        drivers.refresh(configProperties.nodes[node]);
     
        pins.refresh(configProperties.nodes[node]);
        driverPins.refresh(configProperties.nodes[node]);
        accessableDrivers.refresh(configProperties.nodes[node]);
        scriptsManager.refresh(configProperties.nodes[node]);
    }
}

function sleep(time) {

    return new Promise(function (resolve) {
        return setTimeout(resolve, time);
    });
    /*
    return new Promise((resolve) => setTimeout(resolve, time));
    */
}





//--------------------------------------------------------------------------------------------------------------------
function makeModalDialog(parentId, id, titleText, bodyText) {
    document.getElementById("addDriverPanel").innerHTML = ""; //TODO: remake this modal to

    var parentPanel = document.getElementById(parentId);
    parentPanel.innerHTML = "";
    var modalFade = parentPanel.appendChild(document.createElement("div"));

    modalFade.className = "modal fade";
    modalFade.id = id + "Modal";
    modalFade.tabindex = "-1";
    modalFade.setAttribute("role", "dialog");
    modalFade.setAttribute("aria-labelledby", id + "ModalLabel");
    modalFade.setAttribute("aria-hidden", "true");

    var modalDialog = modalFade.appendChild(document.createElement("div"));
    modalDialog.className = "modal-dialog";
    modalDialog.role = "document";

    var modalContent = modalDialog.appendChild(document.createElement("div"));
    modalContent.className = "modal-content";

    var modalHeader = modalContent.appendChild(document.createElement("div"));
    modalHeader.className = "modal-header";

    var modalTitle = modalHeader.appendChild(document.createElement("h5"));

    modalTitle.className = "modal-title";
    modalTitle.id = id + "ModalLabel";
    modalTitle.innerText = titleText;

    var closeHeaderButton = modalHeader.appendChild(document.createElement("button"));

    closeHeaderButton.type = "button"
    closeHeaderButton.className = "close"
    closeHeaderButton.id = id + "closeHeaderButton";
    closeHeaderButton.setAttribute("data-dismiss", "modal");
    closeHeaderButton.setAttribute("aria-label", "Close");

    var closeSpan = closeHeaderButton.appendChild(document.createElement("span"));
    closeSpan.setAttribute("aria-hidden", "true");
    closeSpan.innerText = "x"

    var modalBody = modalContent.appendChild(document.createElement("div"));
    modalBody.id = id + "ModalBody"
    modalBody.className = "modal-body";
    modalBody.innerText = bodyText;

    var modalFooter = modalContent.appendChild(document.createElement("div"));
    modalFooter.id = id + "ModalFooter";
    modalFooter.className = "modal-footer";

    var closeButton = modalFooter.appendChild(document.createElement("button"));
    closeButton.type = "button";
    closeButton.className = "btn btn-sm btn-info";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.innerText = getLang("cancel");
    closeButton.id = id + "closeButton";
}


function createValueEdit(parentElement, propertyName, propertyValue, propertyType) {
    var edit = "";

    if (!propertyType.indexOf("r") != -1) {
        if (propertyType.indexOf("b") != -1) //boolean
        {
            edit = parentElement.appendChild(document.createElement('select'));
            edit.className = "form-control form-control-sm";
            edit.style.width = "100%";
            var valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "true";
            valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "false";
            if ((propertyValue === "1") || (propertyValue === 'true')) edit.selectedIndex = 0; else edit.selectedIndex = 1;
        }
        else
            if (propertyType.indexOf("c") != -1) {
                edit = parentElement.appendChild(document.createElement('select'));
                edit.className = "form-control form-control-sm";
                edit.style.width = "100%";
                edit.style.backgroundColor = propertyValue;
                edit.onchange = colorSelectOnChange;
                var valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = propertyValue;
                valueSelectOption.style.backgroundColor = propertyValue;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.primary;
                valueSelectOption.style.backgroundColor = theme.primary;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.secondary;
                valueSelectOption.style.backgroundColor = theme.secondary;


                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.success;
                valueSelectOption.style.backgroundColor = theme.success;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.info;
                valueSelectOption.style.backgroundColor = theme.info;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.warning;
                valueSelectOption.style.backgroundColor = theme.warning;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.danger;
                valueSelectOption.style.backgroundColor = theme.danger;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.light;
                valueSelectOption.style.backgroundColor = theme.light;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.dark;
                valueSelectOption.style.backgroundColor = theme.dark;

                edit.selectedIndex = 0;
            }
            else {
                edit = parentElement.appendChild(document.createElement('input'));
                edit.className = "form-control form-control-sm";

                if (propertyType.indexOf("p") != -1) //password
                {
                    edit.type = "password";
                    edit.placeholder = "Password";
                }

                if (propertyType.indexOf("i") != -1) //integer
                {
                    edit.type = "number";
                }

                if (propertyType.indexOf("f") != -1) //float
                {
                    edit.type = "number";
                    edit.step = "0.01";
                }

                edit.style.width = "100%";
                edit.value = propertyValue;
            }

        if (propertyType.indexOf("s") != -1) //selected
        {
            edit.style.backgroundColor = "#FAFAF0";
        }

        edit.id = "propValueInput_" + propertyName;
        edit.propname = propertyName;
        edit.propvalue = propertyValue; //default

        edit.proptype = propertyType;
    }

    return edit;
}

function colorSelectOnChange(event) {
    var select = event.currentTarget;
    select.style.backgroundColor = select.options[select.selectedIndex].style.backgroundColor;
    return false;
}


﻿/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

var nodeId;
var nodesRefreshHandle;
var autorefreshbutton;
var refreshbutton;

var status_online = NET_OFFLINE;
var status_wifiap = NET_OFFLINE;
var status_wifist = NET_OFFLINE;
var status_restful = NET_OFFLINE;
var status_mqtt = NET_OFFLINE;
var status_ota = NET_OFFLINE;

var theme = {};

var wifiap = 0;

//Connection state for WiFiST and MQTTClient
var mqttState = getLang("disconnected");
var wifiSTconection = getLang("disconnected");

var firstTime = true;
var runOnce = true;

$(document).ready(function () {

    if (!runOnce) return; 
    runOnce = false;

    addToLogNL("OK loading scripts");
    addToLogNL("[START]", 1);

    //Check languages DEBUG
    //langCompare(langua, langru, document.getElementById("bootLog"));

    jQuery.readyException = function (error) {
        addToLogNL("jQuery error: " + error, 2);
    };

    $(document).ajaxError(function (event, request, settings) {
        addToLogNL("Ajax error: " + settings.url, 2);
    });

    var style = window.getComputedStyle(document.body, null);
    theme.primary = style.getPropertyValue('--primary');
    theme.secondary = style.getPropertyValue('--secondary');
    theme.success = style.getPropertyValue('--success');
    theme.info = style.getPropertyValue('--info');
    theme.warning = style.getPropertyValue('--warning');
    theme.danger = style.getPropertyValue('--danger');
    theme.light = style.getPropertyValue('--light');
    theme.dark = style.getPropertyValue('--dark');
    theme.fontFamily = style.fontFamily;

    if (theme.primary === '') { //default dark
        theme.primary = '#3A3F44';
        theme.secondary = '#7A8288';
        theme.success = '#62c462';
        theme.info = '#5bc0de';
        theme.warning = '#f89406';
        theme.danger = '#ee5f5b';
        theme.light = '#e9ecef';
        theme.dark = '#272B30';
    }

    addToLogNL("get UI configuration...");
   try {

 
    config.onLoad = onConfigLoad;
    config.onLoad = settingsUI.onConfigLoad;
    config.onLoad = dashboardUI.onConfigLoad;
    if (config.load()) {
        
        status_online = NET_ONLINE;
        speak("OWLOS is started");

        addToLogNL(getLang("prepareUnit"));

        drivers.addDriverLoadedListner(settingsUI.onDriverLoaded, settingsUI);
        nodesRefresh();

        var boot = document.getElementById("boot");
        boot.parentElement.removeChild(boot);
        document.getElementById("consolePanel").appendChild(boot);

        nodesRefreshHandle = setInterval(nodesRefresh, 60000);
        

        /*
        $("#createScript").click(function (event) {
            var textArea = document.getElementById("scriptText");
            httpPostAsyncWithErrorReson(boardhost + "createscript", "?name=main1", escape(textArea.value));
        });
        */
        
        speak("OWLOS is ready");
       
    }
    else {
        status_online = NET_OFFLINE;
        speak("ERROR with host: " + boardhost);
        addToLogNL("ERROR with host: " + boardhost, 2);
    }
    }


        catch (exception) {
          status_online = NET_OFFLINE;
    addToLogNL("ERROR starting exception: " + exception, 2);
    addToLogNL("ERROR delete configurations files can help fix it: [your host]/deletefile?name=web.config", 2);
    }
   }
);


function onConfigLoad(configProperties) {
    createProSidebar();
    $(".page-wrapper").toggleClass("toggled");

    document.getElementById("toggle-sidebar").style.display = "block";
    document.getElementById("pin-sidebar").style.display = "block";
    document.getElementById("nodeStatusPanelText").style.display = "block";
    document.getElementById("sidebarText").style.display = "block";

}

function proSideBarMenuClick(event) {
    var nodeStatusPanel = document.getElementById("nodeStatusPanel");
    if (nodeStatusPanel != undefined) {
        if (nodeStatusPanel.currentStatusPanel != undefined) {
            nodeStatusPanel.currentStatusPanel.style.display = "none";
            nodeStatusPanel.currentStatusPanel.nodeStatusPanelText.style.display = "none";                
        } 
    }
    return false;
}

function proSideBarDashboardMenuClick(event) {
    $(this).removeClass('active'); 
    document.getElementById("sidebarText").style.display = "block";
    document.getElementById("sidebarText").innerText = event.currentTarget.addressText;
    document.getElementById("dashboardButtonsPanel").style.display = "block";
    return proSideBarMenuClick(event);
}

function proSideBarConsoleMenuClick(event) {
    $(this).removeClass('active'); 
    document.getElementById("sidebarText").style.display = "none";
    document.getElementById("sidebarText").innerText = "";
    document.getElementById("dashboardButtonsPanel").style.display = "none";
    return proSideBarMenuClick(event);
}


function createProSidebar() {
    

    var pageWrapper = document.getElementById("pagewrapper");
    var sideBar = pageWrapper.appendChild(document.createElement("nav"));
    sideBar.id = "sidebar";
    sideBar.className = "sidebar-wrapper";
    var sideBarContent = sideBar.appendChild(document.createElement("div"));
    sideBarContent.className = "sidebar-content";
    var mainSideBar = sideBarContent.appendChild(document.createElement("div"));
    mainSideBar.id = "mainSideBar";
    mainSideBar.className = "sidebar-item sidebar-menu";

//    var mainSideBar = document.getElementById("mainSideBar");
    var sideBarOWLOS = mainSideBar.appendChild(document.createElement("div"));
    sideBarOWLOS.className = "sidebar-item sidebar-brand";
    var hRef = sideBarOWLOS.appendChild(document.createElement("a"));
    hRef.href = "https://github.com/KirinDenis/owlos";
    hRef.innerText = "OWLOS";

    var sideBarHeader = mainSideBar.appendChild(document.createElement("div"));
    sideBarHeader.className = "sidebar-item sidebar-header d-flex flex-nowrap";
    var sideBarHeaderInfo = sideBarHeader.appendChild(document.createElement("div"));
    sideBarHeaderInfo.className = "user-info";
    var sideBarHeaderInfoVersion = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoVersion.className = "user-name";
    sideBarHeaderInfoVersion.innerHTML = "version<strong> 1.7</strong>";
    var sideBarHeaderInfoRole = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoRole.className = "user-role";
    sideBarHeaderInfoRole.innerHTML = "Administrator";
    var sideBarHeaderInfoStatus = sideBarHeaderInfo.appendChild(document.createElement("span"));
    sideBarHeaderInfoStatus.className = "user-status";
    sideBarHeaderInfoStatus.appendChild(document.createElement("i")).className = "fa fa-circle";
    
    var sideBarHeaderInfoRoleSpan = sideBarHeaderInfoStatus.appendChild(document.createElement("span"));
    sideBarHeaderInfoRoleSpan.innerHTML = "Online";

    var sideBarUl = mainSideBar.appendChild(document.createElement("ul"));

    //Панель управления 
    var sideBarDashboardLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarDashboardLi.id = "sideBarDashboardLi";
    sideBarDashboardLi.className = "nav-item";
    var sideBarDashboardAhref = sideBarDashboardLi.appendChild(document.createElement("a"));
    sideBarDashboardAhref.id = "sideBarDashboardAhref";
    sideBarDashboardAhref.className = "nav-link";
    
    sideBarDashboardAhref.href = "#dashboard";
    sideBarDashboardAhref.setAttribute("data-toggle", "tab");
    sideBarDashboardAhref.onclick = proSideBarDashboardMenuClick; 
    sideBarDashboardAhref.addressText = getLang("dashboardTab");


    sideBarDashboardAhref.appendChild(document.createElement("i")).className = "fa fa-tachometer-alt";
    var sideBarDashboardAhrefSpan = sideBarDashboardAhref.appendChild(document.createElement("span"));
    sideBarDashboardAhrefSpan.className = "menu-text";    
    sideBarDashboardAhrefSpan.innerText = sideBarDashboardAhref.addressText;
    document.getElementById("sidebarText").innerText = sideBarDashboardAhref.addressText;

    sideBarDashboardAhrefSpan = sideBarDashboardAhref.appendChild(document.createElement("span"));
    sideBarDashboardAhrefSpan.className = "badge badge-pill badge-success";
    sideBarDashboardAhrefSpan.id = "sideBarDashboardAhrefSpan";
    

    config.onLoad = function (configProperties) {
        sideBarDashboardAhrefSpan.innerHTML = configProperties.dashboards[0].widgets.length;
    }

    config.onChange = function (configProperties) {
        sideBarDashboardAhrefSpan.innerHTML = configProperties.dashboards[0].widgets.length;
    }


    //настройки  
    var sideBarSettingsLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarSettingsLi.className = "sidebar-dropdown";
    var sideBarSettingsAhref = sideBarSettingsLi.appendChild(document.createElement("a"));
    sideBarSettingsAhref.className = "nav-link";
    sideBarSettingsAhref.href = "#settings";
    sideBarSettingsAhref.setAttribute("data-toggle", "tab");
    sideBarSettingsAhref.onclick = function (event) { $(this).removeClass('active'); };

    sideBarSettingsAhref.appendChild(document.createElement("i")).className = "fa fa-cogs";
    var sideBarSettingsAhrefSpan = sideBarSettingsAhref.appendChild(document.createElement("span"));
    sideBarSettingsAhrefSpan.className = "menu-text";
    sideBarSettingsAhrefSpan.id = "settings-tab";
    sideBarSettingsAhrefSpan.innerText = getLang("settingsTab");

    var sideBarSettingsLiSubmenu = sideBarSettingsLi.appendChild(document.createElement("div"));
    sideBarSettingsLiSubmenu.className = "sidebar-submenu";
    sideBarSettingsLiSubmenu.style.display = "block";
    var sideBarSettingsLiSubmenuUl = sideBarSettingsLiSubmenu.appendChild(document.createElement("ul"));
    sideBarSettingsLiSubmenuUl.id = "settingsSideBarUl";

    var sideBarConsoleLi = sideBarUl.appendChild(document.createElement("li"));
    sideBarConsoleLi.className = "nav-item";
    var sideBarConsoleAhref = sideBarConsoleLi.appendChild(document.createElement("a"));
    sideBarConsoleAhref.className = "nav-link";
    sideBarConsoleAhref.href = "#console";
    sideBarConsoleAhref.setAttribute("data-toggle", "tab");
    sideBarConsoleAhref.addressText = getLang("consoleTab");
    sideBarConsoleAhref.onclick = proSideBarConsoleMenuClick;

    sideBarConsoleAhref.appendChild(document.createElement("i")).className = "fa fa-file-code";
    var sideBarConsoleAhrefSpan = sideBarConsoleAhref.appendChild(document.createElement("span"));
    sideBarConsoleAhrefSpan.className = "menu-text";
    sideBarConsoleAhrefSpan.innerText = sideBarConsoleAhref.addressText;


    jQuery(function ($) {

        // Dropdown menu
        $(".sidebar-dropdown > a").click(function () {
            $(".sidebar-submenu").slideUp(200);
            if ($(this).parent().hasClass("active")) {
                $(".sidebar-dropdown").removeClass("active");
                $(this).parent().removeClass("active");
            } else {
                $(".sidebar-dropdown").removeClass("active");
                $(this).next(".sidebar-submenu").slideDown(200);
                $(this).parent().addClass("active");
            }

        });

        //toggle sidebar
        $("#toggle-sidebar").click(function () {
            $(".page-wrapper").toggleClass("toggled");
        });
        //Pin sidebar
        $("#pin-sidebar").click(function () {
            if ($(".page-wrapper").hasClass("pinned")) {
                // unpin sidebar when hovered
                $(".page-wrapper").removeClass("pinned");
                $("#sidebar").unbind("hover");
            } else {
                $(".page-wrapper").addClass("pinned");
                $("#sidebar").hover(
                    function () {
                        console.log("mouseenter");
                        $(".page-wrapper").addClass("sidebar-hovered");
                    },
                    function () {
                        console.log("mouseout");
                        $(".page-wrapper").removeClass("sidebar-hovered");
                    }
                )

            }
        });


        //toggle sidebar overlay
        $("#overlay").click(function () {
            $(".page-wrapper").toggleClass("toggled");
        });

        //switch between themes 
        var themes = "default-theme legacy-theme chiller-theme ice-theme cool-theme light-theme";
        $('[data-theme]').click(function () {
            $('[data-theme]').removeClass("selected");
            $(this).addClass("selected");
            $('.page-wrapper').removeClass(themes);
            $('.page-wrapper').addClass($(this).attr('data-theme'));
        });

        // switch between background images
        var bgs = "bg1 bg2 bg3 bg4";
        $('[data-bg]').click(function () {
            $('[data-bg]').removeClass("selected");
            $(this).addClass("selected");
            $('.page-wrapper').removeClass(bgs);
            $('.page-wrapper').addClass($(this).attr('data-bg'));
        });

        // toggle background image
        $("#toggle-bg").change(function (e) {
            e.preventDefault();
            $('.page-wrapper').toggleClass("sidebar-bg");
        });

        // toggle border radius
        $("#toggle-border-radius").change(function (e) {
            e.preventDefault();
            $('.page-wrapper').toggleClass("border-radius-on");
        });

        //custom scroll bar is only used on desktop
        /*
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $(".sidebar-content").mCustomScrollbar({
                axis: "y",
                autoHideScrollbar: true,
                scrollInertia: 300
            });
            $(".sidebar-content").addClass("desktop");

        }
        */
    });
}

function nodesRefresh() {
    for (var node in configProperties.nodes) {
        drivers.refresh(configProperties.nodes[node]);
     
        pins.refresh(configProperties.nodes[node]);
        driverPins.refresh(configProperties.nodes[node]);
        accessableDrivers.refresh(configProperties.nodes[node]);
        scriptsManager.refresh(configProperties.nodes[node]);
    }
}

function sleep(time) {

    return new Promise(function (resolve) {
        return setTimeout(resolve, time);
    });
    /*
    return new Promise((resolve) => setTimeout(resolve, time));
    */
}





//--------------------------------------------------------------------------------------------------------------------
function makeModalDialog(parentId, id, titleText, bodyText) {
    document.getElementById("addDriverPanel").innerHTML = ""; //TODO: remake this modal to

    var parentPanel = document.getElementById(parentId);
    parentPanel.innerHTML = "";
    var modalFade = parentPanel.appendChild(document.createElement("div"));

    modalFade.className = "modal fade";
    modalFade.id = id + "Modal";
    modalFade.tabindex = "-1";
    modalFade.setAttribute("role", "dialog");
    modalFade.setAttribute("aria-labelledby", id + "ModalLabel");
    modalFade.setAttribute("aria-hidden", "true");

    var modalDialog = modalFade.appendChild(document.createElement("div"));
    modalDialog.className = "modal-dialog";
    modalDialog.role = "document";

    var modalContent = modalDialog.appendChild(document.createElement("div"));
    modalContent.className = "modal-content";

    var modalHeader = modalContent.appendChild(document.createElement("div"));
    modalHeader.className = "modal-header";

    var modalTitle = modalHeader.appendChild(document.createElement("h5"));

    modalTitle.className = "modal-title";
    modalTitle.id = id + "ModalLabel";
    modalTitle.innerText = titleText;

    var closeHeaderButton = modalHeader.appendChild(document.createElement("button"));

    closeHeaderButton.type = "button"
    closeHeaderButton.className = "close"
    closeHeaderButton.id = id + "closeHeaderButton";
    closeHeaderButton.setAttribute("data-dismiss", "modal");
    closeHeaderButton.setAttribute("aria-label", "Close");

    var closeSpan = closeHeaderButton.appendChild(document.createElement("span"));
    closeSpan.setAttribute("aria-hidden", "true");
    closeSpan.innerText = "x"

    var modalBody = modalContent.appendChild(document.createElement("div"));
    modalBody.id = id + "ModalBody"
    modalBody.className = "modal-body";
    modalBody.innerText = bodyText;

    var modalFooter = modalContent.appendChild(document.createElement("div"));
    modalFooter.id = id + "ModalFooter";
    modalFooter.className = "modal-footer";

    var closeButton = modalFooter.appendChild(document.createElement("button"));
    closeButton.type = "button";
    closeButton.className = "btn btn-sm btn-info";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.innerText = getLang("cancel");
    closeButton.id = id + "closeButton";
}


function createValueEdit(parentElement, propertyName, propertyValue, propertyType) {
    var edit = "";

    if (!propertyType.indexOf("r") != -1) {
        if (propertyType.indexOf("b") != -1) //boolean
        {
            edit = parentElement.appendChild(document.createElement('select'));
            edit.className = "form-control form-control-sm";
            edit.style.width = "100%";
            var valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "true";
            valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "false";
            if ((propertyValue === "1") || (propertyValue === 'true')) edit.selectedIndex = 0; else edit.selectedIndex = 1;
        }
        else
            if (propertyType.indexOf("c") != -1) {
                edit = parentElement.appendChild(document.createElement('select'));
                edit.className = "form-control form-control-sm";
                edit.style.width = "100%";
                edit.style.backgroundColor = propertyValue;
                edit.onchange = colorSelectOnChange;
                var valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = propertyValue;
                valueSelectOption.style.backgroundColor = propertyValue;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.primary;
                valueSelectOption.style.backgroundColor = theme.primary;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.secondary;
                valueSelectOption.style.backgroundColor = theme.secondary;


                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.success;
                valueSelectOption.style.backgroundColor = theme.success;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.info;
                valueSelectOption.style.backgroundColor = theme.info;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.warning;
                valueSelectOption.style.backgroundColor = theme.warning;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.danger;
                valueSelectOption.style.backgroundColor = theme.danger;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.light;
                valueSelectOption.style.backgroundColor = theme.light;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.dark;
                valueSelectOption.style.backgroundColor = theme.dark;

                edit.selectedIndex = 0;
            }
            else {
                edit = parentElement.appendChild(document.createElement('input'));
                edit.className = "form-control form-control-sm";

                if (propertyType.indexOf("p") != -1) //password
                {
                    edit.type = "password";
                    edit.placeholder = "Password";
                }

                if (propertyType.indexOf("i") != -1) //integer
                {
                    edit.type = "number";
                }

                if (propertyType.indexOf("f") != -1) //float
                {
                    edit.type = "number";
                    edit.step = "0.01";
                }

                edit.style.width = "100%";
                edit.value = propertyValue;
            }

        if (propertyType.indexOf("s") != -1) //selected
        {
            edit.style.backgroundColor = "#FAFAF0";
        }

        edit.id = "propValueInput_" + propertyName;
        edit.propname = propertyName;
        edit.propvalue = propertyValue; //default

        edit.proptype = propertyType;
    }

    return edit;
}

function colorSelectOnChange(event) {
    var select = event.currentTarget;
    select.style.backgroundColor = select.options[select.selectedIndex].style.backgroundColor;
    return false;
}


