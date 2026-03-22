(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,9361,e=>{"use strict";let t=BigInt(0x100000000-1),r=BigInt(32);function o(e,n=!1){let a=e.length,s=new Uint32Array(a),i=new Uint32Array(a);for(let o=0;o<a;o++){let{h:a,l:c}=function(e,o=!1){return o?{h:Number(e&t),l:Number(e>>r&t)}:{h:0|Number(e>>r&t),l:0|Number(e&t)}}(e[o],n);[s[o],i[o]]=[a,c]}return[s,i]}let n=(e,t,r)=>e>>>r,a=(e,t,r)=>e<<32-r|t>>>r,s=(e,t,r)=>e>>>r|t<<32-r,i=(e,t,r)=>e<<32-r|t>>>r,c=(e,t,r)=>e<<64-r|t>>>r-32,l=(e,t,r)=>e>>>r-32|t<<64-r,p=(e,t,r)=>e<<r|t>>>32-r,u=(e,t,r)=>t<<r|e>>>32-r,d=(e,t,r)=>t<<r-32|e>>>64-r,h=(e,t,r)=>e<<r-32|t>>>64-r;function y(e,t,r,o){let n=(t>>>0)+(o>>>0);return{h:e+r+(n/0x100000000|0)|0,l:0|n}}let w=(e,t,r)=>(e>>>0)+(t>>>0)+(r>>>0),m=(e,t,r,o)=>t+r+o+(e/0x100000000|0)|0,f=(e,t,r,o)=>(e>>>0)+(t>>>0)+(r>>>0)+(o>>>0),b=(e,t,r,o,n)=>t+r+o+n+(e/0x100000000|0)|0,g=(e,t,r,o,n)=>(e>>>0)+(t>>>0)+(r>>>0)+(o>>>0)+(n>>>0),k=(e,t,r,o,n,a)=>t+r+o+n+a+(e/0x100000000|0)|0;e.s(["add",()=>y,"add3H",()=>m,"add3L",()=>w,"add4H",()=>b,"add4L",()=>f,"add5H",()=>k,"add5L",()=>g,"rotlBH",()=>d,"rotlBL",()=>h,"rotlSH",()=>p,"rotlSL",()=>u,"rotrBH",()=>c,"rotrBL",()=>l,"rotrSH",()=>s,"rotrSL",()=>i,"shrSH",()=>n,"shrSL",()=>a,"split",()=>o])},70525,e=>{"use strict";let t="object"==typeof globalThis&&"crypto"in globalThis?globalThis.crypto:void 0;function r(e){if(!Number.isSafeInteger(e)||e<0)throw Error("positive integer expected, got "+e)}function o(e,...t){if(!(e instanceof Uint8Array||ArrayBuffer.isView(e)&&"Uint8Array"===e.constructor.name))throw Error("Uint8Array expected");if(t.length>0&&!t.includes(e.length))throw Error("Uint8Array expected of length "+t+", got length="+e.length)}function n(e){if("function"!=typeof e||"function"!=typeof e.create)throw Error("Hash should be wrapped by utils.createHasher");r(e.outputLen),r(e.blockLen)}function a(e,t=!0){if(e.destroyed)throw Error("Hash instance has been destroyed");if(t&&e.finished)throw Error("Hash#digest() has already been called")}function s(e,t){o(e);let r=t.outputLen;if(e.length<r)throw Error("digestInto() expects output buffer of length at least "+r)}function i(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}function c(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function l(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function p(e,t){return e<<32-t|e>>>t}let u=68===new Uint8Array(new Uint32Array([0x11223344]).buffer)[0]?e=>e:function(e){for(let r=0;r<e.length;r++){var t;e[r]=(t=e[r])<<24&0xff000000|t<<8&0xff0000|t>>>8&65280|t>>>24&255}return e};function d(e){return"string"==typeof e&&(e=function(e){if("string"!=typeof e)throw Error("string expected");return new Uint8Array(new TextEncoder().encode(e))}(e)),o(e),e}function h(...e){let t=0;for(let r=0;r<e.length;r++){let n=e[r];o(n),t+=n.length}let r=new Uint8Array(t);for(let t=0,o=0;t<e.length;t++){let n=e[t];r.set(n,o),o+=n.length}return r}class y{}function w(e){let t=t=>e().update(d(t)).digest(),r=e();return t.outputLen=r.outputLen,t.blockLen=r.blockLen,t.create=()=>e(),t}function m(e){let t=(t,r)=>e(r).update(d(t)).digest(),r=e({});return t.outputLen=r.outputLen,t.blockLen=r.blockLen,t.create=t=>e(t),t}function f(e=32){if(t&&"function"==typeof t.getRandomValues)return t.getRandomValues(new Uint8Array(e));if(t&&"function"==typeof t.randomBytes)return Uint8Array.from(t.randomBytes(e));throw Error("crypto.getRandomValues must be defined")}e.s(["Hash",()=>y,"abytes",()=>o,"aexists",()=>a,"ahash",()=>n,"anumber",()=>r,"aoutput",()=>s,"clean",()=>c,"concatBytes",()=>h,"createHasher",()=>w,"createView",()=>l,"createXOFer",()=>m,"randomBytes",()=>f,"rotr",()=>p,"swap32IfBE",0,u,"toBytes",()=>d,"u32",()=>i],70525)},61147,e=>{"use strict";var t=e.i(29163),r=e.i(27343),o=e.i(70204),n=e.i(90063),a=e.i(79617),s=e.i(49311),i=e.i(32881),c=e.i(47526),l=e.i(4434),p=e.i(27173);let u="/docs/contract/encodeErrorResult";function d(e){let{abi:t,errorName:r,args:n}=e,s=t[0];if(r){let e=(0,p.getAbiItem)({abi:t,args:n,name:r});if(!e)throw new o.AbiErrorNotFoundError(r,{docsPath:u});s=e}if("error"!==s.type)throw new o.AbiErrorNotFoundError(void 0,{docsPath:u});let d=(0,i.formatAbiItem)(s),h=(0,a.toFunctionSelector)(d),y="0x";if(n&&n.length>0){if(!s.inputs)throw new o.AbiErrorInputsNotFoundError(s.name,{docsPath:u});y=(0,l.encodeAbiParameters)(s.inputs,n)}return(0,c.concatHex)([h,y])}let h="/docs/contract/encodeFunctionResult",y="x-batch-gateway:true";async function w(e){let{data:c,ccipRequest:u}=e,{args:[m]}=function(e){let{abi:t,data:r}=e,c=(0,n.slice)(r,0,4),l=t.find(e=>"function"===e.type&&c===(0,a.toFunctionSelector)((0,i.formatAbiItem)(e)));if(!l)throw new o.AbiFunctionSignatureNotFoundError(c,{docsPath:"/docs/contract/decodeFunctionData"});return{functionName:l.name,args:"inputs"in l&&l.inputs&&l.inputs.length>0?(0,s.decodeAbiParameters)(l.inputs,(0,n.slice)(r,4)):void 0}}({abi:t.batchGatewayAbi,data:c}),f=[],b=[];return await Promise.all(m.map(async(e,o)=>{try{b[o]=e.urls.includes(y)?await w({data:e.data,ccipRequest:u}):await u(e),f[o]=!1}catch(e){var n;f[o]=!0,b[o]="HttpRequestError"===(n=e).name&&n.status?d({abi:t.batchGatewayAbi,errorName:"HttpError",args:[n.status,n.shortMessage]}):d({abi:[r.solidityError],errorName:"Error",args:["shortMessage"in n?n.shortMessage:n.message]})}})),function(e){let{abi:t,functionName:r,result:n}=e,a=t[0];if(r){let e=(0,p.getAbiItem)({abi:t,name:r});if(!e)throw new o.AbiFunctionNotFoundError(r,{docsPath:h});a=e}if("function"!==a.type)throw new o.AbiFunctionNotFoundError(void 0,{docsPath:h});if(!a.outputs)throw new o.AbiFunctionOutputsNotFoundError(a.name,{docsPath:h});let s=(()=>{if(0===a.outputs.length)return[];if(1===a.outputs.length)return[n];if(Array.isArray(n))return n;throw new o.InvalidArrayError(n)})();return(0,l.encodeAbiParameters)(a.outputs,s)}({abi:t.batchGatewayAbi,functionName:"query",result:[f,b]})}e.s(["localBatchGatewayRequest",()=>w,"localBatchGatewayUrl",0,y],61147)},6685,e=>{"use strict";var t=e.i(8861),r=e.i(96516);function o(e,o){if(!(0,r.isAddress)(e,{strict:!1}))throw new t.InvalidAddressError({address:e});if(!(0,r.isAddress)(o,{strict:!1}))throw new t.InvalidAddressError({address:o});return e.toLowerCase()===o.toLowerCase()}e.s(["isAddressEqual",()=>o])},10920,74983,96247,91346,e=>{"use strict";var t,r,o=e.i(71645);let n=!1;async function a(e,t={}){let r;if(n)return[];n=!0,e.setState(e=>({...e,status:e.current?"reconnecting":"connecting"}));let o=[];if(t.connectors?.length)for(let r of t.connectors){let t;t="function"==typeof r?e._internal.connectors.setup(r):r,o.push(t)}else o.push(...e.connectors);try{r=await e.storage?.getItem("recentConnectorId")}catch{}let s={};for(let[,t]of e.state.connections)s[t.connector.id]=1;r&&(s[r]=0);let i=Object.keys(s).length>0?[...o].sort((e,t)=>(s[e.id]??10)-(s[t.id]??10)):o,c=!1,l=[],p=[];for(let t of i){let r=await t.getProvider().catch(()=>void 0);if(!r||p.some(e=>e===r)||!await t.isAuthorized())continue;let o=await t.connect({isReconnecting:!0}).catch(()=>null);o&&(t.emitter.off("connect",e._internal.events.connect),t.emitter.on("change",e._internal.events.change),t.emitter.on("disconnect",e._internal.events.disconnect),e.setState(e=>{let r=new Map(c?e.connections:new Map).set(t.uid,{accounts:o.accounts,chainId:o.chainId,connector:t});return{...e,current:c?e.current:t.uid,connections:r}}),l.push({accounts:o.accounts,chainId:o.chainId,connector:t}),p.push(r),c=!0)}return("reconnecting"===e.state.status||"connecting"===e.state.status)&&(c?e.setState(e=>({...e,status:"connected"})):e.setState(e=>({...e,connections:new Map,current:null,status:"disconnected"}))),n=!1,l}function s(e){let{children:t,config:r,initialState:n,reconnectOnMount:s=!0}=e,{onMount:i}=function(e,t){let{initialState:r,reconnectOnMount:o}=t;return r&&!e._internal.store.persist.hasHydrated()&&e.setState({...r,chainId:e.chains.some(e=>e.id===r.chainId)?r.chainId:e.chains[0].id,connections:o?r.connections:new Map,status:o?"reconnecting":"disconnected"}),{async onMount(){e._internal.ssr&&(await e._internal.store.persist.rehydrate(),e._internal.mipd&&e._internal.connectors.setState(t=>{let r=new Set;for(let e of t??[])if(e.rdns)for(let t of Array.isArray(e.rdns)?e.rdns:[e.rdns])r.add(t);let o=[];for(let t of e._internal.mipd?.getProviders()??[]){if(r.has(t.info.rdns))continue;let n=e._internal.connectors.providerDetailToConnector(t),a=e._internal.connectors.setup(n);o.push(a)}return[...t,...o]})),o?a(e):e.storage&&e.setState(e=>({...e,connections:new Map}))}}}(r,{initialState:n,reconnectOnMount:s});r._internal.ssr||i();let c=(0,o.useRef)(!0);return(0,o.useEffect)(()=>{if(c.current&&r._internal.ssr)return i(),()=>{c.current=!1}},[]),t}let i=(0,o.createContext)(void 0);function c(e){let{children:t,config:r}=e;return(0,o.createElement)(s,e,(0,o.createElement)(i.Provider,{value:r},t))}e.s(["WagmiContext",0,i,"WagmiProvider",()=>c],74983);let l="3.4.0";e.s(["version",0,l],96247);var p=function(e,t,r,o){if("a"===r&&!o)throw TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!o:!t.has(e))throw TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?o:"a"===r?o.call(e):o?o.value:t.get(e)};class u extends Error{get docsBaseUrl(){return"https://wagmi.sh/core"}get version(){return`@wagmi/core@${l}`}constructor(e,r={}){super(),t.add(this),Object.defineProperty(this,"details",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"docsPath",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"metaMessages",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"shortMessage",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"WagmiCoreError"});const o=r.cause instanceof u?r.cause.details:r.cause?.message?r.cause.message:r.details,n=r.cause instanceof u&&r.cause.docsPath||r.docsPath;this.message=[e||"An error occurred.","",...r.metaMessages?[...r.metaMessages,""]:[],...n?[`Docs: ${this.docsBaseUrl}${n}.html${r.docsSlug?`#${r.docsSlug}`:""}`]:[],...o?[`Details: ${o}`]:[],`Version: ${this.version}`].join("\n"),r.cause&&(this.cause=r.cause),this.details=o,this.docsPath=n,this.metaMessages=r.metaMessages,this.shortMessage=e}walk(e){return p(this,t,"m",r).call(this,this,e)}}t=new WeakSet,r=function e(r,o){return o?.(r)?r:r.cause?p(this,t,"m",e).call(this,r.cause,o):r},e.s(["BaseError",()=>u],91346);class d extends u{constructor(){super(...arguments),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"WagmiError"})}get docsBaseUrl(){return"https://wagmi.sh/react"}get version(){return"wagmi@3.5.0"}}class h extends d{constructor(){super("`useConfig` must be used within `WagmiProvider`.",{docsPath:"/api/WagmiProvider"}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"WagmiProviderNotFoundError"})}}function y(e={}){let t=e.config??(0,o.useContext)(i);if(!t)throw new h;return t}e.s(["useConfig",()=>y],10920)},77379,(e,t,r)=>{"use strict";var o=e.r(71645),n="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=o.useState,s=o.useEffect,i=o.useLayoutEffect,c=o.useDebugValue;function l(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!n(e,r)}catch(e){return!0}}var p="u"<typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var r=t(),o=a({inst:{value:r,getSnapshot:t}}),n=o[0].inst,p=o[1];return i(function(){n.value=r,n.getSnapshot=t,l(n)&&p({inst:n})},[e,r,t]),s(function(){return l(n)&&p({inst:n}),e(function(){l(n)&&p({inst:n})})},[e]),c(r),r};r.useSyncExternalStore=void 0!==o.useSyncExternalStore?o.useSyncExternalStore:p},93490,(e,t,r)=>{"use strict";t.exports=e.r(77379)},31097,(e,t,r)=>{"use strict";var o=e.r(71645),n=e.r(93490),a="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},s=n.useSyncExternalStore,i=o.useRef,c=o.useEffect,l=o.useMemo,p=o.useDebugValue;r.useSyncExternalStoreWithSelector=function(e,t,r,o,n){var u=i(null);if(null===u.current){var d={hasValue:!1,value:null};u.current=d}else d=u.current;var h=s(e,(u=l(function(){function e(e){if(!c){if(c=!0,s=e,e=o(e),void 0!==n&&d.hasValue){var t=d.value;if(n(t,e))return i=t}return i=e}if(t=i,a(s,e))return t;var r=o(e);return void 0!==n&&n(t,r)?(s=e,t):(s=e,i=r)}var s,i,c=!1,l=void 0===r?null:r;return[function(){return e(t())},null===l?void 0:function(){return e(l())}]},[t,r,o,n]))[0],u[1]);return c(function(){d.hasValue=!0,d.value=h},[h]),p(h),h}},51797,(e,t,r)=>{"use strict";t.exports=e.r(31097)},67125,e=>{"use strict";function t(e,t,r){let o=e[t.name];if("function"==typeof o)return o;let n=e[r];return"function"==typeof n?n:r=>t(e,r)}e.s(["getAction",()=>t])},7749,83856,e=>{"use strict";var t=e.i(70204),r=e.i(69934),o=e.i(78023),n=e.i(95767),a=r;class s extends a.BaseError{constructor(e,{code:t,docsPath:r,metaMessages:o,name:a,shortMessage:s}){super(s,{cause:e,docsPath:r,metaMessages:o||e?.metaMessages,name:a||"RpcError"}),Object.defineProperty(this,"code",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.name=a||e.name,this.code=e instanceof n.RpcRequestError?e.code:t??-1}}class i extends s{constructor(e,t){super(e,t),Object.defineProperty(this,"data",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.data=t.data}}class c extends s{constructor(e){super(e,{code:c.code,name:"ParseRpcError",shortMessage:"Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."})}}Object.defineProperty(c,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32700});class l extends s{constructor(e){super(e,{code:l.code,name:"InvalidRequestRpcError",shortMessage:"JSON is not a valid request object."})}}Object.defineProperty(l,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32600});class p extends s{constructor(e,{method:t}={}){super(e,{code:p.code,name:"MethodNotFoundRpcError",shortMessage:`The method${t?` "${t}"`:""} does not exist / is not available.`})}}Object.defineProperty(p,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32601});class u extends s{constructor(e){super(e,{code:u.code,name:"InvalidParamsRpcError",shortMessage:"Invalid parameters were provided to the RPC method.\nDouble check you have provided the correct parameters."})}}Object.defineProperty(u,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32602});class d extends s{constructor(e){super(e,{code:d.code,name:"InternalRpcError",shortMessage:"An internal error was received."})}}Object.defineProperty(d,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32603});class h extends s{constructor(e){super(e,{code:h.code,name:"InvalidInputRpcError",shortMessage:"Missing or invalid parameters.\nDouble check you have provided the correct parameters."})}}Object.defineProperty(h,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32e3});class y extends s{constructor(e){super(e,{code:y.code,name:"ResourceNotFoundRpcError",shortMessage:"Requested resource not found."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ResourceNotFoundRpcError"})}}Object.defineProperty(y,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32001});class w extends s{constructor(e){super(e,{code:w.code,name:"ResourceUnavailableRpcError",shortMessage:"Requested resource not available."})}}Object.defineProperty(w,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32002});class m extends s{constructor(e){super(e,{code:m.code,name:"TransactionRejectedRpcError",shortMessage:"Transaction creation failed."})}}Object.defineProperty(m,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32003});class f extends s{constructor(e,{method:t}={}){super(e,{code:f.code,name:"MethodNotSupportedRpcError",shortMessage:`Method${t?` "${t}"`:""} is not supported.`})}}Object.defineProperty(f,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32004});class b extends s{constructor(e){super(e,{code:b.code,name:"LimitExceededRpcError",shortMessage:"Request exceeds defined limit."})}}Object.defineProperty(b,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32005});class g extends s{constructor(e){super(e,{code:g.code,name:"JsonRpcVersionUnsupportedError",shortMessage:"Version of JSON-RPC protocol is not supported."})}}Object.defineProperty(g,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32006});class k extends i{constructor(e){super(e,{code:k.code,name:"UserRejectedRequestError",shortMessage:"User rejected the request."})}}Object.defineProperty(k,"code",{enumerable:!0,configurable:!0,writable:!0,value:4001});class W extends i{constructor(e){super(e,{code:W.code,name:"UnauthorizedProviderError",shortMessage:"The requested method and/or account has not been authorized by the user."})}}Object.defineProperty(W,"code",{enumerable:!0,configurable:!0,writable:!0,value:4100});class x extends i{constructor(e,{method:t}={}){super(e,{code:x.code,name:"UnsupportedProviderMethodError",shortMessage:`The Provider does not support the requested method${t?` " ${t}"`:""}.`})}}Object.defineProperty(x,"code",{enumerable:!0,configurable:!0,writable:!0,value:4200});class v extends i{constructor(e){super(e,{code:v.code,name:"ProviderDisconnectedError",shortMessage:"The Provider is disconnected from all chains."})}}Object.defineProperty(v,"code",{enumerable:!0,configurable:!0,writable:!0,value:4900});class C extends i{constructor(e){super(e,{code:C.code,name:"ChainDisconnectedError",shortMessage:"The Provider is not connected to the requested chain."})}}Object.defineProperty(C,"code",{enumerable:!0,configurable:!0,writable:!0,value:4901});class I extends i{constructor(e){super(e,{code:I.code,name:"SwitchChainError",shortMessage:"An error occurred when attempting to switch chain."})}}Object.defineProperty(I,"code",{enumerable:!0,configurable:!0,writable:!0,value:4902});class E extends i{constructor(e){super(e,{code:E.code,name:"UnsupportedNonOptionalCapabilityError",shortMessage:"This Wallet does not support a capability that was not marked as optional."})}}Object.defineProperty(E,"code",{enumerable:!0,configurable:!0,writable:!0,value:5700});class R extends i{constructor(e){super(e,{code:R.code,name:"UnsupportedChainIdError",shortMessage:"This Wallet does not support the requested chain ID."})}}Object.defineProperty(R,"code",{enumerable:!0,configurable:!0,writable:!0,value:5710});class O extends i{constructor(e){super(e,{code:O.code,name:"DuplicateIdError",shortMessage:"There is already a bundle submitted with this ID."})}}Object.defineProperty(O,"code",{enumerable:!0,configurable:!0,writable:!0,value:5720});class A extends i{constructor(e){super(e,{code:A.code,name:"UnknownBundleIdError",shortMessage:"This bundle id is unknown / has not been submitted"})}}Object.defineProperty(A,"code",{enumerable:!0,configurable:!0,writable:!0,value:5730});class B extends i{constructor(e){super(e,{code:B.code,name:"BundleTooLargeError",shortMessage:"The call bundle is too large for the Wallet to process."})}}Object.defineProperty(B,"code",{enumerable:!0,configurable:!0,writable:!0,value:5740});class q extends i{constructor(e){super(e,{code:q.code,name:"AtomicReadyWalletRejectedUpgradeError",shortMessage:"The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."})}}Object.defineProperty(q,"code",{enumerable:!0,configurable:!0,writable:!0,value:5750});class P extends i{constructor(e){super(e,{code:P.code,name:"AtomicityNotSupportedError",shortMessage:"The wallet does not support atomic execution but the request requires it."})}}Object.defineProperty(P,"code",{enumerable:!0,configurable:!0,writable:!0,value:5760});class T extends i{constructor(e){super(e,{code:T.code,name:"WalletConnectSessionSettlementError",shortMessage:"WalletConnect session settlement failed."})}}Object.defineProperty(T,"code",{enumerable:!0,configurable:!0,writable:!0,value:7e3});class _ extends s{constructor(e){super(e,{name:"UnknownRpcError",shortMessage:"An unknown RPC error occurred."})}}function N(e,{abi:a,address:s,args:i,docsPath:c,functionName:l,sender:p}){let u=e instanceof o.RawContractError?e:e instanceof r.BaseError?e.walk(e=>"data"in e)||e.walk():{},{code:y,data:w,details:m,message:f,shortMessage:b}=u,g=e instanceof t.AbiDecodingZeroDataError?new o.ContractFunctionZeroDataError({functionName:l}):[3,d.code].includes(y)&&(w||m||f||b)||y===h.code&&"execution reverted"===m&&w?new o.ContractFunctionRevertedError({abi:a,data:"object"==typeof w?w.data:w,functionName:l,message:u instanceof n.RpcRequestError?m:b??f}):e;return new o.ContractFunctionExecutionError(g,{abi:a,args:i,contractAddress:s,docsPath:c,functionName:l,sender:p})}e.s(["AtomicReadyWalletRejectedUpgradeError",()=>q,"AtomicityNotSupportedError",()=>P,"BundleTooLargeError",()=>B,"ChainDisconnectedError",()=>C,"DuplicateIdError",()=>O,"InternalRpcError",()=>d,"InvalidInputRpcError",()=>h,"InvalidParamsRpcError",()=>u,"InvalidRequestRpcError",()=>l,"JsonRpcVersionUnsupportedError",()=>g,"LimitExceededRpcError",()=>b,"MethodNotFoundRpcError",()=>p,"MethodNotSupportedRpcError",()=>f,"ParseRpcError",()=>c,"ProviderDisconnectedError",()=>v,"ResourceNotFoundRpcError",()=>y,"ResourceUnavailableRpcError",()=>w,"SwitchChainError",()=>I,"TransactionRejectedRpcError",()=>m,"UnauthorizedProviderError",()=>W,"UnknownBundleIdError",()=>A,"UnknownRpcError",()=>_,"UnsupportedChainIdError",()=>R,"UnsupportedNonOptionalCapabilityError",()=>E,"UnsupportedProviderMethodError",()=>x,"UserRejectedRequestError",()=>k,"WalletConnectSessionSettlementError",()=>T],83856),e.s(["getContractError",()=>N],7749)},88750,e=>{"use strict";var t=e.i(547),r=e.i(56679),o=e.i(7749),n=e.i(67125),a=e.i(89509);async function s(e,s){let{abi:i,address:c,args:l,functionName:p,...u}=s,d=(0,r.encodeFunctionData)({abi:i,args:l,functionName:p});try{let{data:r}=await (0,n.getAction)(e,a.call,"call")({...u,data:d,to:c});return(0,t.decodeFunctionResult)({abi:i,args:l,functionName:p,data:r||"0x"})}catch(e){throw(0,o.getContractError)(e,{abi:i,address:c,args:l,docsPath:"/docs/contract/readContract",functionName:p})}}e.s(["readContract",()=>s])},11786,e=>{"use strict";e.s(["CONTRACTS",0,{router:"0xBdB2ED591Da3ceb2280EDcAcADbA2B9B78025464",oracle:"0x497a02257E804518A27F1b47ce7603bE7b6A8377",fundingEngine:"0xbFEcdEB418d39b05Bd40F929d111d353C4cE968E",positionEngine:"0xAaf9f52F39986EDE1D79a52e2022da378bA40745",lpVault:"0x69bCF8694E52B81a698707aEB626aE43A25FF5D4",liquidationEngine:"0xc719479FDE4d5F80186aD7de128b5e410c3551B0",usdc:"0xB55ce2841be1acD5F2D613E882715E10e3431faB",insuranceFund:"0xB143b6cf58024E00C39aB02A0921f25d540C48D4",anchorVault:"0xB694517F86311052f97F66B022F85D518aae2baa",surgeVault:"0x876c95ac69E280788B81A815e03b9CFB3e2c6a24",volOracle:"0xbad0c8c6C56eBc54Cc9005AA2805548A482C7c34"},"EXPECTED_CHAIN_ID",0,998])},55263,e=>{"use strict";var t=`{
  "connect_wallet": {
    "label": "Connect Wallet",
    "wrong_network": {
      "label": "Wrong network"
    }
  },

  "intro": {
    "title": "What is a Wallet?",
    "description": "A wallet is used to send, receive, store, and display digital assets. It's also a new way to log in, without needing to create new accounts and passwords on every website.",
    "digital_asset": {
      "title": "A Home for your Digital Assets",
      "description": "Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs."
    },
    "login": {
      "title": "A New Way to Log In",
      "description": "Instead of creating new accounts and passwords on every website, just connect your wallet."
    },
    "get": {
      "label": "Get a Wallet"
    },
    "learn_more": {
      "label": "Learn More"
    }
  },

  "sign_in": {
    "label": "Verify your account",
    "description": "To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account.",
    "message": {
      "send": "Sign message",
      "preparing": "Preparing message...",
      "cancel": "Cancel",
      "preparing_error": "Error preparing message, please retry!"
    },
    "signature": {
      "waiting": "Waiting for signature...",
      "verifying": "Verifying signature...",
      "signing_error": "Error signing message, please retry!",
      "verifying_error": "Error verifying signature, please retry!",
      "oops_error": "Oops, something went wrong!"
    }
  },

  "connect": {
    "label": "Connect",
    "title": "Connect a Wallet",
    "new_to_ethereum": {
      "description": "New to Ethereum wallets?",
      "learn_more": {
        "label": "Learn More"
      }
    },
    "learn_more": {
      "label": "Learn more"
    },
    "recent": "Recent",
    "status": {
      "opening": "Opening %{wallet}...",
      "connecting": "Connecting",
      "connect_mobile": "Continue in %{wallet}",
      "not_installed": "%{wallet} is not installed",
      "not_available": "%{wallet} is not available",
      "confirm": "Confirm connection in the extension",
      "confirm_mobile": "Accept connection request in the wallet"
    },
    "secondary_action": {
      "get": {
        "description": "Don't have %{wallet}?",
        "label": "GET"
      },
      "install": {
        "label": "INSTALL"
      },
      "retry": {
        "label": "RETRY"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Need the official WalletConnect modal?",
        "compact": "Need the WalletConnect modal?"
      },
      "open": {
        "label": "OPEN"
      }
    }
  },

  "connect_scan": {
    "title": "Scan with %{wallet}",
    "fallback_title": "Scan with your phone"
  },

  "connector_group": {
    "installed": "Installed",
    "recommended": "Recommended",
    "other": "Other",
    "popular": "Popular",
    "more": "More",
    "others": "Others"
  },

  "get": {
    "title": "Get a Wallet",
    "action": {
      "label": "GET"
    },
    "mobile": {
      "description": "Mobile Wallet"
    },
    "extension": {
      "description": "Browser Extension"
    },
    "mobile_and_extension": {
      "description": "Mobile Wallet and Extension"
    },
    "mobile_and_desktop": {
      "description": "Mobile and Desktop Wallet"
    },
    "looking_for": {
      "title": "Not what you're looking for?",
      "mobile": {
        "description": "Select a wallet on the main screen to get started with a different wallet provider."
      },
      "desktop": {
        "compact_description": "Select a wallet on the main screen to get started with a different wallet provider.",
        "wide_description": "Select a wallet on the left to get started with a different wallet provider."
      }
    }
  },

  "get_options": {
    "title": "Get started with %{wallet}",
    "short_title": "Get %{wallet}",
    "mobile": {
      "title": "%{wallet} for Mobile",
      "description": "Use the mobile wallet to explore the world of Ethereum.",
      "download": {
        "label": "Get the app"
      }
    },
    "extension": {
      "title": "%{wallet} for %{browser}",
      "description": "Access your wallet right from your favorite web browser.",
      "download": {
        "label": "Add to %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} for %{platform}",
      "description": "Access your wallet natively from your powerful desktop.",
      "download": {
        "label": "Add to %{platform}"
      }
    }
  },

  "get_mobile": {
    "title": "Install %{wallet}",
    "description": "Scan with your phone to download on iOS or Android",
    "continue": {
      "label": "Continue"
    }
  },

  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "extension": {
      "refresh": {
        "label": "Refresh"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "desktop": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    }
  },

  "chains": {
    "title": "Switch Networks",
    "wrong_network": "Wrong network detected, switch or disconnect to continue.",
    "confirm": "Confirm in Wallet",
    "switching_not_supported": "Your wallet does not support switching networks from %{appName}. Try switching networks from within your wallet instead.",
    "switching_not_supported_fallback": "Your wallet does not support switching networks from this app. Try switching networks from within your wallet instead.",
    "disconnect": "Disconnect",
    "connected": "Connected"
  },

  "profile": {
    "disconnect": {
      "label": "Disconnect"
    },
    "copy_address": {
      "label": "Copy Address",
      "copied": "Copied!"
    },
    "explorer": {
      "label": "View more on explorer"
    },
    "transactions": {
      "description": "%{appName} transactions will appear here...",
      "description_fallback": "Your transactions will appear here...",
      "recent": {
        "title": "Recent Transactions"
      },
      "clear": {
        "label": "Clear All"
      }
    }
  },

  "wallet_connectors": {
    "ready": {
      "qr_code": {
        "step1": {
          "description": "Add Ready to your home screen for faster access to your wallet.",
          "title": "Open the Ready app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "berasig": {
      "extension": {
        "step1": {
          "title": "Install the BeraSig extension",
          "description": "We recommend pinning BeraSig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "best": {
      "qr_code": {
        "step1": {
          "title": "Open the Best Wallet app",
          "description": "Add Best Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bifrost Wallet on your home screen for quicker access.",
          "title": "Open the Bifrost Wallet app"
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "bitget": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bitget Wallet on your home screen for quicker access.",
          "title": "Open the Bitget Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Bitget Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitget Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitski": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Bitski to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitski extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitverse": {
      "qr_code": {
        "step1": {
          "title": "Open the Bitverse Wallet app",
          "description": "Add Bitverse Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bloom": {
      "desktop": {
        "step1": {
          "title": "Open the Bloom Wallet app",
          "description": "We recommend putting Bloom Wallet on your home screen for quicker access."
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you have a wallet, click on Connect to connect via Bloom. A connection prompt in the app will appear for you to confirm the connection.",
          "title": "Click on Connect"
        }
      }
    },

    "bybit": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bybit on your home screen for faster access to your wallet.",
          "title": "Open the Bybit app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Bybit Wallet for easy access.",
          "title": "Install the Bybit Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Bybit Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "binance": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Binance on your home screen for faster access to your wallet.",
          "title": "Open the Binance app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Binance Wallet extension",
          "description": "We recommend pinning Binance Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "coin98": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coin98 Wallet on your home screen for faster access to your wallet.",
          "title": "Open the Coin98 Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Coin98 Wallet for easy access.",
          "title": "Install the Coin98 Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Coin98 Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coinbase Wallet on your home screen for quicker access.",
          "title": "Open the Coinbase Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Coinbase Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Coinbase Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "compass": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Compass Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Compass Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "core": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Core on your home screen for faster access to your wallet.",
          "title": "Open the Core app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Core to your taskbar for quicker access to your wallet.",
          "title": "Install the Core extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "fox": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting FoxWallet on your home screen for quicker access.",
          "title": "Open the FoxWallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "frontier": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Frontier Wallet on your home screen for quicker access.",
          "title": "Open the Frontier Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Frontier Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Frontier Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Open the imToken app",
          "description": "Put imToken app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "iopay": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting ioPay on your home screen for faster access to your wallet.",
          "title": "Open the ioPay app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      }
    },

    "kaikas": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaikas to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaikas extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaikas app",
          "description": "Put Kaikas app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kaia": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaia to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaia extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaia app",
          "description": "Put Kaia app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kraken": {
      "qr_code": {
        "step1": {
          "title": "Open the Kraken Wallet app",
          "description": "Add Kraken Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "kresus": {
      "qr_code": {
        "step1": {
          "title": "Open the Kresus Wallet app",
          "description": "Add Kresus Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "magicEden": {
      "extension": {
        "step1": {
          "title": "Install the Magic Eden extension",
          "description": "We recommend pinning Magic Eden to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Open the MetaMask app",
          "description": "We recommend putting MetaMask on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the MetaMask extension",
          "description": "We recommend pinning MetaMask to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "nestwallet": {
      "extension": {
        "step1": {
          "title": "Install the NestWallet extension",
          "description": "We recommend pinning NestWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "okx": {
      "qr_code": {
        "step1": {
          "title": "Open the OKX Wallet app",
          "description": "We recommend putting OKX Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the OKX Wallet extension",
          "description": "We recommend pinning OKX Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "omni": {
      "qr_code": {
        "step1": {
          "title": "Open the Omni app",
          "description": "Add Omni to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your home screen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "1inch": {
      "qr_code": {
        "step1": {
          "description": "Put 1inch Wallet on your home screen for faster access to your wallet.",
          "title": "Open the 1inch Wallet app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Open the TokenPocket app",
          "description": "We recommend putting TokenPocket on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the TokenPocket extension",
          "description": "We recommend pinning TokenPocket to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "trust": {
      "qr_code": {
        "step1": {
          "title": "Open the Trust Wallet app",
          "description": "Put Trust Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Trust Wallet extension",
          "description": "Click at the top right of your browser and pin Trust Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up Trust Wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Open the Uniswap app",
          "description": "Add Uniswap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Open the Zerion app",
          "description": "We recommend putting Zerion on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Zerion extension",
          "description": "We recommend pinning Zerion to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Open the Rainbow app",
          "description": "We recommend putting Rainbow on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "You can easily backup your wallet using our backup feature on your phone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "enkrypt": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Enkrypt Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Enkrypt Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "frame": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Frame to your taskbar for quicker access to your wallet.",
          "title": "Install Frame & the companion extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "one_key": {
      "extension": {
        "step1": {
          "title": "Install the OneKey Wallet extension",
          "description": "We recommend pinning OneKey Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "paraswap": {
      "qr_code": {
        "step1": {
          "title": "Open the ParaSwap app",
          "description": "Add ParaSwap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "phantom": {
      "extension": {
        "step1": {
          "title": "Install the Phantom extension",
          "description": "We recommend pinning Phantom to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rabby": {
      "extension": {
        "step1": {
          "title": "Install the Rabby extension",
          "description": "We recommend pinning Rabby to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "ronin": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Ronin Wallet on your home screen for quicker access.",
          "title": "Open the Ronin Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Ronin Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Ronin Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "ramper": {
      "extension": {
        "step1": {
          "title": "Install the Ramper extension",
          "description": "We recommend pinning Ramper to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safeheron": {
      "extension": {
        "step1": {
          "title": "Install the Core extension",
          "description": "We recommend pinning Safeheron to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "taho": {
      "extension": {
        "step1": {
          "title": "Install the Taho extension",
          "description": "We recommend pinning Taho to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "wigwam": {
      "extension": {
        "step1": {
          "title": "Install the Wigwam extension",
          "description": "We recommend pinning Wigwam to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "talisman": {
      "extension": {
        "step1": {
          "title": "Install the Talisman extension",
          "description": "We recommend pinning Talisman to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import an Ethereum Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "ctrl": {
      "extension": {
        "step1": {
          "title": "Install the CTRL Wallet extension",
          "description": "We recommend pinning CTRL Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "zeal": {
      "qr_code": {
        "step1": {
          "title": "Open the Zeal app",
          "description": "Add Zeal Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Zeal extension",
          "description": "We recommend pinning Zeal to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safepal": {
      "extension": {
        "step1": {
          "title": "Install the SafePal Wallet extension",
          "description": "Click at the top right of your browser and pin SafePal Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up SafePal Wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SafePal Wallet app",
          "description": "Put SafePal Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "desig": {
      "extension": {
        "step1": {
          "title": "Install the Desig extension",
          "description": "We recommend pinning Desig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "subwallet": {
      "extension": {
        "step1": {
          "title": "Install the SubWallet extension",
          "description": "We recommend pinning SubWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SubWallet app",
          "description": "We recommend putting SubWallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "clv": {
      "extension": {
        "step1": {
          "title": "Install the CLV Wallet extension",
          "description": "We recommend pinning CLV Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the CLV Wallet app",
          "description": "We recommend putting CLV Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "okto": {
      "qr_code": {
        "step1": {
          "title": "Open the Okto app",
          "description": "Add Okto to your home screen for quick access"
        },
        "step2": {
          "title": "Create an MPC Wallet",
          "description": "Create an account and generate a wallet"
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Tap the Scan QR icon at the top right and confirm the prompt to connect."
        }
      }
    },

    "ledger": {
      "desktop": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "Set up a new Ledger or connect to an existing one."
        },
        "step3": {
          "title": "Connect",
          "description": "A connection prompt will appear for you to connect your wallet."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "You can either sync with the desktop app or connect your Ledger."
        },
        "step3": {
          "title": "Scan the code",
          "description": "Tap WalletConnect then Switch to Scanner. After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "valora": {
      "qr_code": {
        "step1": {
          "title": "Open the Valora app",
          "description": "We recommend putting Valora on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "gate": {
      "qr_code": {
        "step1": {
          "title": "Open the Gate app",
          "description": "We recommend putting Gate on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Gate extension",
          "description": "We recommend pinning Gate to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "gemini": {
      "qr_code": {
        "step1": {
          "title": "Open keys.gemini.com",
          "description": "Visit keys.gemini.com on your mobile browser - no app download required."
        },
        "step2": {
          "title": "Create Your Wallet Instantly",
          "description": "Set up your smart wallet in seconds using your device's built-in authentication."
        },
        "step3": {
          "title": "Scan to Connect",
          "description": "Scan the QR code to instantly connect your wallet - it just works."
        }
      },
      "extension": {
        "step1": {
          "title": "Go to keys.gemini.com",
          "description": "No extensions or downloads needed - your wallet lives securely in the browser."
        },
        "step2": {
          "title": "One-Click Setup",
          "description": "Create your smart wallet instantly with passkey authentication - easier than any wallet out there."
        },
        "step3": {
          "title": "Connect and Go",
          "description": "Approve the connection and you're ready - the unopinionated wallet that just works."
        }
      }
    },

    "xportal": {
      "qr_code": {
        "step1": {
          "description": "Put xPortal on your home screen for faster access to your wallet.",
          "title": "Open the xPortal app"
        },
        "step2": {
          "description": "Create a wallet or import an existing one.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "mew": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting MEW Wallet on your home screen for quicker access.",
          "title": "Open the MEW Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "zilpay": {
      "qr_code": {
        "step1": {
          "title": "Open the ZilPay app",
          "description": "Add ZilPay to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "nova": {
      "qr_code": {
        "step1": {
          "title": "Open the Nova Wallet app",
          "description": "Add Nova Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    }
  }
}
`;e.s(["en_US_default",()=>t])}]);