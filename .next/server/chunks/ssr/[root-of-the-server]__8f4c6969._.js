module.exports=[56704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},20635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},32319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},9270,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.AppRouterContext},36313,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.HooksClientContext},18341,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.ServerInsertedHtml},35112,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].ReactDOM},50944,(a,b,c)=>{b.exports=a.r(74137)},21372,a=>{a.v("/_next/static/media/Icon (2).e2210c62.svg")},93527,a=>{a.v("/_next/static/media/Icon (4).70f16bc0.svg")},76622,a=>{a.v("/_next/static/media/Icon (8).6ddd27f4.svg")},75159,a=>{a.v("/_next/static/media/Icon (1).ff69c762.svg")},45531,a=>{a.v("/_next/static/media/Icon (3).8a7ded90.svg")},65160,a=>{a.v("/_next/static/media/Icon (5).d66a828b.svg")},80747,a=>{a.v("/_next/static/media/Icon (6).03606019.svg")},12463,a=>{a.v("/_next/static/media/Icon (7).e8cef57a.svg")},18476,a=>{a.v("/_next/static/media/Frame.c2d78110.svg")},84504,a=>{"use strict";a.s(["default",()=>b]);let b={src:a.i(21372).default,width:20,height:20,blurWidth:0,blurHeight:0}},27701,46969,a=>{"use strict";a.s(["default",()=>b],27701);let b={src:a.i(93527).default,width:20,height:20,blurWidth:0,blurHeight:0};a.s(["default",()=>c],46969);let c={src:a.i(76622).default,width:20,height:20,blurWidth:0,blurHeight:0}},6704,a=>{"use strict";a.s(["Toaster",()=>Y,"default",()=>Z],6704);var b,c=a.i(72131);let d={data:""},e=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,f=/\/\*[^]*?\*\/|  +/g,g=/\n+/g,h=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?h(g,f):f+"{"+h(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=h(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=h.p?h.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},i={},j=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+j(a[c]);return b}return a};function k(a){let b,c,k=this||{},l=a.call?a(k.p):a;return((a,b,c,d,k)=>{var l,m,n,o;let p=j(a),q=i[p]||(i[p]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(p));if(!i[q]){let b=p!==a?a:(a=>{let b,c,d=[{}];for(;b=e.exec(a.replace(f,""));)b[4]?d.shift():b[3]?(c=b[3].replace(g," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(g," ").trim();return d[0]})(a);i[q]=h(k?{["@keyframes "+q]:b}:b,c?"":"."+q)}let r=c&&i.g?i.g:null;return c&&(i.g=i[q]),l=i[q],m=b,n=d,(o=r)?m.data=m.data.replace(o,l):-1===m.data.indexOf(l)&&(m.data=n?l+m.data:m.data+l),q})(l.unshift?l.raw?(b=[].slice.call(arguments,1),c=k.p,l.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":h(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):l.reduce((a,b)=>Object.assign(a,b&&b.call?b(k.p):b),{}):l,k.target||d,k.g,k.o,k.k)}k.bind({g:1});let l,m,n,o=k.bind({k:1});function p(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:m&&m()},h),c.o=/ *go\d+/.test(i),h.className=k.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),n&&j[0]&&n(h),l(j,h)}return b?b(e):e}}var q=(a,b)=>"function"==typeof a?a(b):a,r=(()=>{let a=0;return()=>(++a).toString()})(),s=(()=>{let a;return()=>a})(),t="default",u=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return u(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},v=[],w={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},x={},y=(a,b=t)=>{x[b]=u(x[b]||w,a),v.forEach(([a,c])=>{a===b&&c(x[b])})},z=a=>Object.keys(x).forEach(b=>y(a,b)),A=(a=t)=>b=>{y(b,a)},B={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},C=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||r()}))(b,a,c);return A(e.toasterId||(d=e.id,Object.keys(x).find(a=>x[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},D=(a,b)=>C("blank")(a,b);D.error=C("error"),D.success=C("success"),D.loading=C("loading"),D.custom=C("custom"),D.dismiss=(a,b)=>{let c={type:3,toastId:a};b?A(b)(c):z(c)},D.dismissAll=a=>D.dismiss(void 0,a),D.remove=(a,b)=>{let c={type:4,toastId:a};b?A(b)(c):z(c)},D.removeAll=a=>D.remove(void 0,a),D.promise=(a,b,c)=>{let d=D.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?q(b.success,a):void 0;return e?D.success(e,{id:d,...c,...null==c?void 0:c.success}):D.dismiss(d),a}).catch(a=>{let e=b.error?q(b.error,a):void 0;e?D.error(e,{id:d,...c,...null==c?void 0:c.error}):D.dismiss(d)}),a};var E=1e3,F=o`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,G=o`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=o`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,I=p("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${G} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,J=o`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,K=p("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${J} 1s linear infinite;
`,L=o`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,M=o`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,N=p("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${M} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,O=p("div")`
  position: absolute;
`,P=p("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Q=o`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,R=p("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Q} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,S=({toast:a})=>{let{icon:b,type:d,iconTheme:e}=a;return void 0!==b?"string"==typeof b?c.createElement(R,null,b):b:"blank"===d?null:c.createElement(P,null,c.createElement(K,{...e}),"loading"!==d&&c.createElement(O,null,"error"===d?c.createElement(I,{...e}):c.createElement(N,{...e})))},T=p("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,U=p("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,V=c.memo(({toast:a,position:b,style:d,children:e})=>{let f=a.height?((a,b)=>{let c=a.includes("top")?1:-1,[d,e]=s()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*c}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*c}%,-1px) scale(.6); opacity:0;}
`];return{animation:b?`${o(d)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${o(e)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(a.position||b||"top-center",a.visible):{opacity:0},g=c.createElement(S,{toast:a}),h=c.createElement(U,{...a.ariaProps},q(a.message,a));return c.createElement(T,{className:a.className,style:{...f,...d,...a.style}},"function"==typeof e?e({icon:g,message:h}):c.createElement(c.Fragment,null,g,h))});b=c.createElement,h.p=void 0,l=b,m=void 0,n=void 0;var W=({id:a,className:b,style:d,onHeightUpdate:e,children:f})=>{let g=c.useCallback(b=>{if(b){let c=()=>{e(a,b.getBoundingClientRect().height)};c(),new MutationObserver(c).observe(b,{subtree:!0,childList:!0,characterData:!0})}},[a,e]);return c.createElement("div",{ref:g,className:b,style:d},f)},X=k`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Y=({reverseOrder:a,position:b="top-center",toastOptions:d,gutter:e,children:f,toasterId:g,containerStyle:h,containerClassName:i})=>{let{toasts:j,handlers:k}=((a,b="default")=>{let{toasts:d,pausedAt:e}=((a={},b=t)=>{let[d,e]=(0,c.useState)(x[b]||w),f=(0,c.useRef)(x[b]);(0,c.useEffect)(()=>(f.current!==x[b]&&e(x[b]),v.push([b,e]),()=>{let a=v.findIndex(([a])=>a===b);a>-1&&v.splice(a,1)}),[b]);let g=d.toasts.map(b=>{var c,d,e;return{...a,...a[b.type],...b,removeDelay:b.removeDelay||(null==(c=a[b.type])?void 0:c.removeDelay)||(null==a?void 0:a.removeDelay),duration:b.duration||(null==(d=a[b.type])?void 0:d.duration)||(null==a?void 0:a.duration)||B[b.type],style:{...a.style,...null==(e=a[b.type])?void 0:e.style,...b.style}}});return{...d,toasts:g}})(a,b),f=(0,c.useRef)(new Map).current,g=(0,c.useCallback)((a,b=E)=>{if(f.has(a))return;let c=setTimeout(()=>{f.delete(a),h({type:4,toastId:a})},b);f.set(a,c)},[]);(0,c.useEffect)(()=>{if(e)return;let a=Date.now(),c=d.map(c=>{if(c.duration===1/0)return;let d=(c.duration||0)+c.pauseDuration-(a-c.createdAt);if(d<0){c.visible&&D.dismiss(c.id);return}return setTimeout(()=>D.dismiss(c.id,b),d)});return()=>{c.forEach(a=>a&&clearTimeout(a))}},[d,e,b]);let h=(0,c.useCallback)(A(b),[b]),i=(0,c.useCallback)(()=>{h({type:5,time:Date.now()})},[h]),j=(0,c.useCallback)((a,b)=>{h({type:1,toast:{id:a,height:b}})},[h]),k=(0,c.useCallback)(()=>{e&&h({type:6,time:Date.now()})},[e,h]),l=(0,c.useCallback)((a,b)=>{let{reverseOrder:c=!1,gutter:e=8,defaultPosition:f}=b||{},g=d.filter(b=>(b.position||f)===(a.position||f)&&b.height),h=g.findIndex(b=>b.id===a.id),i=g.filter((a,b)=>b<h&&a.visible).length;return g.filter(a=>a.visible).slice(...c?[i+1]:[0,i]).reduce((a,b)=>a+(b.height||0)+e,0)},[d]);return(0,c.useEffect)(()=>{d.forEach(a=>{if(a.dismissed)g(a.id,a.removeDelay);else{let b=f.get(a.id);b&&(clearTimeout(b),f.delete(a.id))}})},[d,g]),{toasts:d,handlers:{updateHeight:j,startPause:i,endPause:k,calculateOffset:l}}})(d,g);return c.createElement("div",{"data-rht-toaster":g||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...h},className:i,onMouseEnter:k.startPause,onMouseLeave:k.endPause},j.map(d=>{let g=d.position||b,h=((a,b)=>{let c=a.includes("top"),d=a.includes("center")?{justifyContent:"center"}:a.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:s()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${b*(c?1:-1)}px)`,...c?{top:0}:{bottom:0},...d}})(g,k.calculateOffset(d,{reverseOrder:a,gutter:e,defaultPosition:b}));return c.createElement(W,{id:d.id,key:d.id,onHeightUpdate:k.updateHeight,className:d.visible?X:"",style:h},"custom"===d.type?q(d.message,d):f?f(d):c.createElement(V,{toast:d,position:g}))}))},Z=D},33608,a=>{"use strict";a.s(["default",()=>q],33608);var b=a.i(87924),c=a.i(72131),d=a.i(71987),e=a.i(50944),f=a.i(6704);let g={src:a.i(75159).default,width:16,height:16,blurWidth:0,blurHeight:0};var h=a.i(84504);let i={src:a.i(45531).default,width:20,height:20,blurWidth:0,blurHeight:0};var j=a.i(27701);let k={src:a.i(65160).default,width:16,height:16,blurWidth:0,blurHeight:0},l={src:a.i(80747).default,width:16,height:16,blurWidth:0,blurHeight:0},m={src:a.i(12463).default,width:16,height:16,blurWidth:0,blurHeight:0};var n=a.i(46969);let o={src:a.i(18476).default,width:12,height:12,blurWidth:0,blurHeight:0};var p=a.i(71682);function q(){let[a,q]=(0,c.useState)(!1),[r,s]=(0,c.useState)(!1),[t,u]=(0,c.useState)(!1),[v,w]=(0,c.useState)(!1),[x,y]=(0,c.useState)(!1),z=(0,e.useRouter)(),A=a=>{w(!1),y(!1),"Google"===a&&w(!0),"Facebook"===a&&y(!0),setTimeout(()=>{w(!1),y(!1),f.default.success(`Welcome to Thundra via ${a}!`,{duration:4e3,style:{background:"#28a745",color:"#fff"}}),setTimeout(()=>z.push("/"),1e3)},1500)};return(0,b.jsxs)("div",{className:"flex items-center justify-center min-h-screen bg-gray-50",children:[(0,b.jsx)(f.Toaster,{}),(0,b.jsxs)("div",{className:"bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200",children:[(0,b.jsx)("h2",{className:"font-['Cormorant_Garamond'] text-[#1A1410] text-[36px] leading-[24px] font-semibold text-center mb-7",children:"Create New Account"}),(0,b.jsx)("p",{className:"text-center text-gray-500 tracking-[1] text-sm mb-6",style:{fontFamily:"'Jost', sans-serif"},children:"Join thousands of customers who trust Thundra for personalized, high-quality products with AI-powered design."}),(0,b.jsxs)("form",{className:"space-y-4",onSubmit:a=>{a.preventDefault(),u(!0),setTimeout(()=>{u(!1),f.default.success("Account created successfully! Redirecting to login...",{duration:4e3,style:{background:"#333",color:"#fff"}}),setTimeout(()=>z.push("/pages/login"),1e3)},2e3)},children:[(0,b.jsxs)("div",{className:"flex gap-3",children:[(0,b.jsxs)("div",{className:"w-1/2",children:[(0,b.jsx)("label",{className:"block text-sm font-medium mb-2 text-gray-700",children:"First Name *"}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(d.default,{src:g,alt:"User Icon",width:16,height:16,className:"absolute left-3 top-3"}),(0,b.jsx)("input",{type:"text",placeholder:"John",className:"w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"})]})]}),(0,b.jsxs)("div",{className:"w-1/2",children:[(0,b.jsx)("label",{className:"block text-sm font-medium mb-2 text-gray-700",children:"Last Name *"}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(d.default,{src:g,alt:"User Icon",width:16,height:16,className:"absolute left-3 top-3"}),(0,b.jsx)("input",{type:"text",placeholder:"Doe",className:"w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"})]})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium mb-2 text-gray-700",children:"Email Address *"}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(d.default,{src:h.default,alt:"Email Icon",width:16,height:16,className:"absolute left-3 top-3"}),(0,b.jsx)("input",{type:"email",placeholder:"your@email.com",className:"w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium mb-2 text-gray-700",children:"Phone Number"}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(d.default,{src:i,alt:"Phone Icon",width:16,height:16,className:"absolute left-3 top-3"}),(0,b.jsx)("input",{type:"tel",placeholder:"+49 123 456 7890",className:"w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium mb-2 text-gray-700",children:"Password *"}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(d.default,{src:j.default,alt:"Lock Icon",width:16,height:16,className:"absolute left-3 top-3"}),(0,b.jsx)("input",{type:a?"text":"password",placeholder:"Create a password",className:"w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"}),(0,b.jsx)("button",{type:"button",onClick:()=>q(!a),className:"absolute right-3 top-2.5",children:a?(0,b.jsx)(p.FaEyeSlash,{}):(0,b.jsx)(d.default,{src:n.default,alt:"Eye Icon",width:16,height:16})})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium mb-2 text-gray-700",children:"Confirm Password *"}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(d.default,{src:j.default,alt:"Lock Icon",width:16,height:16,className:"absolute left-3 top-3"}),(0,b.jsx)("input",{type:r?"text":"password",placeholder:"Confirm your password",className:"w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"}),(0,b.jsx)("button",{type:"button",onClick:()=>s(!r),className:"absolute right-3 top-2.5",children:r?(0,b.jsx)(p.FaEyeSlash,{}):(0,b.jsx)(d.default,{src:n.default,alt:"Eye Icon",width:16,height:16})})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)("label",{className:"flex items-center text-sm text-gray-600",children:[(0,b.jsx)("input",{type:"checkbox",className:"mr-2"}),"I agree to the ",(0,b.jsx)("a",{href:"#",className:"text-yellow-800 underline ml-1",children:"Terms & Conditions"})," and ",(0,b.jsx)("a",{href:"#",className:"text-yellow-800 underline ml-1",children:"Privacy Policy"})]}),(0,b.jsxs)("label",{className:"flex items-center text-sm text-gray-600",children:[(0,b.jsx)("input",{type:"checkbox",className:"mr-2"}),"I want to receive marketing emails about new products and special offers"]})]}),(0,b.jsx)("div",{className:"flex justify-end mt-4",children:(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(d.default,{src:o,alt:"Search Icon",width:16,height:16,className:"absolute left-3 top-3"}),(0,b.jsxs)("select",{className:"border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-600 pl-10",children:[(0,b.jsx)("option",{children:"English"}),(0,b.jsx)("option",{children:"Deutsch"}),(0,b.jsx)("option",{children:"Español"})]})]})}),(0,b.jsx)("button",{type:"submit",className:`w-full h-[48px] text-white py-2 rounded-lg mt-4 transition-all ${t?"bg-gray-500 cursor-not-allowed":"bg-gradient-to-b from-[#8b6f47] to-[#7a5f3a] hover:bg-[#7a5e3e]"}`,disabled:t,children:(0,b.jsxs)("span",{className:"inline-flex items-center gap-2",children:[t?(0,b.jsxs)("svg",{className:"animate-spin h-5 w-5",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,b.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,b.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373  0 0 5.373 0 12h4zm2 5.291A7.962  7.962 0 014 12H0c0  3.042 1.135 5.824 3 7.938l3-2.647z"})]}):(0,b.jsx)(d.default,{src:m,alt:"User Icon",width:16,height:16}),t?"Processing...":"Create Account"]})}),(0,b.jsxs)("div",{className:"text-center flex items-center gap-1 text-gray-500 text-sm my-3",children:[(0,b.jsx)("hr",{className:"flex-1 border-t-[1px] border-[#0000001A]"}),(0,b.jsx)("span",{className:"px-2",children:"Or sign up with"}),(0,b.jsx)("hr",{className:"flex-1 border-t-[1px] border-[#0000001A]"})]}),(0,b.jsxs)("div",{className:"flex justify-center gap-4",children:[(0,b.jsxs)("button",{type:"button",onClick:()=>A("Google"),className:`flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/2 transition-all 
                                ${v?"opacity-60 cursor-not-allowed":"hover:bg-gray-100"}`,disabled:v||x,children:[v?(0,b.jsxs)("svg",{className:"animate-spin h-5 w-5",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,b.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,b.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373  0 0 5.373 0 12h4zm2 5.291A7.962  7.962 0 014 12H0c0  3.042 1.135 5.824 3 7.938l3-2.647z"})]}):(0,b.jsx)(d.default,{src:k,alt:"Google Icon",width:16,height:16}),v?"Processing...":"Google"]}),(0,b.jsxs)("button",{type:"button",onClick:()=>A("Facebook"),className:`flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/2 transition-all 
                                ${x?"opacity-60 cursor-not-allowed":"hover:bg-gray-100"}`,disabled:v||x,children:[x?(0,b.jsxs)("svg",{className:"animate-spin h-5 w-5",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,b.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,b.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373  0 0 5.373 0 12h4zm2 5.291A7.962  7.962 0 014 12H0c0  3.042 1.135 5.824 3 7.938l3-2.647z"})]}):(0,b.jsx)(d.default,{src:l,alt:"Facebook Icon",width:16,height:16}),x?"Processing...":"Facebook"]})]})]})]})]})}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__8f4c6969._.js.map