import{S as pe,i as ye,s as de,ae as ve,w as R,x as Y,y as Z,q as O,o as F,B as G,F as we,K as W,af as se,ag as xe,ah as $e,ai as U,aj as ke,ak as be,al as j,am as B,a as V,d,b as s,g as C,Y as ae,an as ie,_ as Me,t as te,h as le,J as q,j as Ee,$ as ue,a0 as fe,ao as oe,k as X,e as J,l as _e,ab as Se,m as ee,c as K,p as Te,n as Ve,ap as Ae,I as Ce,a1 as Ie,R as Le}from"../chunks/vendor-c1c72708.js";import{A as ze,L as De}from"../chunks/LanguageChipBox-018e6bfd.js";import{T as Ne}from"../chunks/ToolChipBox-53c737fa.js";import{f as qe,t as je,l as Be}from"../chunks/stores-ba889b8d.js";function Oe(){let a=[],e=[],t=1,n=1,f=5,p=.5,_=.2,c=1,h=30,$=30,v=3;function y(o,l,g){let M=l.length,w=0,i=l[o].x-g[o].x,r=g[o].y-l[o].y,m=Math.sqrt(i*i+r*r),T=!0;m>0&&(w+=m*_),i/=m,r/=m,i>0&&r>0?w+=0*v:i<0&&r>0?w+=1*v:i<0&&r<0?w+=2*v:w+=3*v;let A=l[o].x,I=l[o].y-l[o].height+2,z=l[o].x+l[o].width,D=l[o].y+2,N,P,Q,u,L,H,re;for(let E=0;E<M;E++)E!=o&&(T=b(g[o].x,l[o].x,g[E].x,l[E].x,g[o].y,l[o].y,g[E].y,l[E].y),T&&(w+=c),N=l[E].x,Q=l[E].y-l[E].height+2,P=l[E].x+l[E].width,u=l[E].y+2,L=Math.max(0,Math.min(P,z)-Math.max(N,A)),H=Math.max(0,Math.min(u,D)-Math.max(Q,I)),re=L*H,w+=re*h),N=g[E].x-g[E].r,Q=g[E].y-g[E].r,P=g[E].x+g[E].r,u=g[E].y+g[E].r,L=Math.max(0,Math.min(P,z)-Math.max(N,A)),H=Math.max(0,Math.min(u,D)-Math.max(Q,I)),re=L*H,w+=re*$;return w}function S(o){let l=Math.floor(Math.random()*a.length),g=a[l].x,M=a[l].y,w=y(l,a,e);a[l].x+=(Math.random()-.5)*f,a[l].y+=(Math.random()-.5)*f,a[l].x>t&&(a[l].x=g),a[l].x<0&&(a[l].x=g),a[l].y>n&&(a[l].y=M),a[l].y<0&&(a[l].y=M);let r=y(l,a,e)-w;Math.random()<Math.exp(-r/o)||(a[l].x=g,a[l].y=M)}function x(o){let l=Math.floor(Math.random()*a.length),g=a[l].x,M=a[l].y,w=y(l,a,e),i=(Math.random()-.5)*p,r=Math.sin(i),m=Math.cos(i);a[l].x-=e[l].x,a[l].y-=e[l].y;let T=a[l].x*m-a[l].y*r,A=a[l].x*r+a[l].y*m;a[l].x=T+e[l].x,a[l].y=A+e[l].y,a[l].x>t&&(a[l].x=g),a[l].x<0&&(a[l].x=g),a[l].y>n&&(a[l].y=M),a[l].y<0&&(a[l].y=M);let z=y(l,a,e)-w;Math.random()<Math.exp(-z/o)||(a[l].x=g,a[l].y=M)}function b(o,l,g,M,w,i,r,m){let T,A,I,z,D;return I=(m-r)*(l-o)-(M-g)*(i-w),z=(M-g)*(w-r)-(m-r)*(o-g),D=(l-o)*(w-r)-(i-w)*(o-g),T=z/I,A=D/I,!(T<0||T>1||A<0||A>1)}function k(o,l,g){return o-l/g}return{start(o){let l=a.length,g=1,M=1;for(let w=0;w<o;w++){for(let i=0;i<l;i++)Math.random()<.5?S(g):x(g);g=k(g,M,o)}return this},width(o){return arguments.length?(t=o,this):t},height(o){return arguments.length?(n=o,this):n},label(o){return arguments.length?(a=o,this):a},anchor(o){return arguments.length?(e=o,this):e}}}function he(a,e,t){const n=a.slice();return n[29]=e[t],n}function me(a,e,t){const n=a.slice();return n[29]=e[t],n}function ce(a,e){let t,n,f,p,_,c,h,$;return{key:a,first:null,c(){t=j("rect"),this.h()},l(v){t=B(v,"rect",{fill:!0,"stroke-dasharray":!0,"fill-opacity":!0,x:!0,y:!0,width:!0,height:!0,"stroke-width":!0,stroke:!0}),V(t).forEach(d),this.h()},h(){s(t,"fill",n=e[7](e[29])),s(t,"stroke-dasharray","4"),s(t,"fill-opacity","0.25"),s(t,"x",f=e[11](e[29],e[3])),s(t,"y",p=e[12](e[29],e[2])),s(t,"width",_=e[13](e[29],e[3])),s(t,"height",c=e[14](e[29],e[2])),s(t,"stroke-width","1"),s(t,"stroke","black"),this.first=t},m(v,y){C(v,t,y),h||($=[ae(t,"mouseover",function(){ie(e[15](e[29]))&&e[15](e[29]).apply(this,arguments)}),ae(t,"focus",Je),ae(t,"mouseout",function(){ie(e[16](e[29]))&&e[16](e[29]).apply(this,arguments)}),ae(t,"blur",Ke)],h=!0)},p(v,y){e=v,y[0]&144&&n!==(n=e[7](e[29]))&&s(t,"fill",n),y[0]&24&&f!==(f=e[11](e[29],e[3]))&&s(t,"x",f),y[0]&20&&p!==(p=e[12](e[29],e[2]))&&s(t,"y",p),y[0]&24&&_!==(_=e[13](e[29],e[3]))&&s(t,"width",_),y[0]&20&&c!==(c=e[14](e[29],e[2]))&&s(t,"height",c)},d(v){v&&d(t),h=!1,Me($)}}}function ge(a,e){let t,n=e[29].name+"",f,p,_,c,h,$,v,y,S,x,b,k;return{key:a,first:null,c(){t=j("text"),f=te(n),h=j("line"),x=j("circle"),this.h()},l(o){t=B(o,"text",{class:!0,id:!0,x:!0,y:!0});var l=V(t);f=le(l,n),l.forEach(d),h=B(o,"line",{x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0}),V(h).forEach(d),x=B(o,"circle",{cx:!0,cy:!0,r:!0,fill:!0}),V(x).forEach(d),this.h()},h(){s(t,"class","place-label"),s(t,"id",p=ne(e[29])),s(t,"x",_=e[29].x),s(t,"y",c=e[29].y),s(h,"x1",$=e[29].x),s(h,"y1",v=e[29].y),s(h,"x2",y=e[29].org_x),s(h,"y2",S=e[29].org_y),s(h,"stroke","black"),s(x,"cx",b=e[29].org_x),s(x,"cy",k=e[29].org_y),s(x,"r","2"),s(x,"fill","black"),this.first=t},m(o,l){C(o,t,l),q(t,f),C(o,h,l),C(o,x,l)},p(o,l){e=o,l[0]&64&&n!==(n=e[29].name+"")&&Ee(f,n),l[0]&64&&p!==(p=ne(e[29]))&&s(t,"id",p),l[0]&64&&_!==(_=e[29].x)&&s(t,"x",_),l[0]&64&&c!==(c=e[29].y)&&s(t,"y",c),l[0]&64&&$!==($=e[29].x)&&s(h,"x1",$),l[0]&64&&v!==(v=e[29].y)&&s(h,"y1",v),l[0]&64&&y!==(y=e[29].org_x)&&s(h,"x2",y),l[0]&64&&S!==(S=e[29].org_y)&&s(h,"y2",S),l[0]&64&&b!==(b=e[29].org_x)&&s(x,"cx",b),l[0]&64&&k!==(k=e[29].org_y)&&s(x,"cy",k)},d(o){o&&d(t),o&&d(h),o&&d(x)}}}function Fe(a){let e,t,n,f,p,_,c,h,$,v,y=[],S=new Map,x,b=[],k=new Map,o,l=a[4].ftools;const g=i=>i[29].name;for(let i=0;i<l.length;i+=1){let r=me(a,l,i),m=g(r);S.set(m,y[i]=ce(m,r))}let M=a[6];const w=i=>i[29].name;for(let i=0;i<M.length;i+=1){let r=he(a,M,i),m=w(r);k.set(m,b[i]=ge(m,r))}return{c(){e=j("g"),t=j("g"),n=j("text"),f=te(`Temporal Span
      `),_=j("g"),c=j("text"),h=te(`Spatial Span
      `),v=j("g");for(let i=0;i<y.length;i+=1)y[i].c();x=j("g");for(let i=0;i<b.length;i+=1)b[i].c();this.h()},l(i){e=B(i,"g",{class:!0,transform:!0});var r=V(e);t=B(r,"g",{class:!0});var m=V(t);n=B(m,"text",{opacity:!0,fill:!0,y:!0,dy:!0,"font-size":!0,"text-anchor":!0,transform:!0});var T=V(n);f=le(T,`Temporal Span
      `),T.forEach(d),m.forEach(d),_=B(r,"g",{class:!0});var A=V(_);c=B(A,"text",{opacity:!0,fill:!0,y:!0,dy:!0,"font-size":!0,"text-anchor":!0,transform:!0});var I=V(c);h=le(I,`Spatial Span
      `),I.forEach(d),A.forEach(d),v=B(r,"g",{class:!0});var z=V(v);for(let N=0;N<y.length;N+=1)y[N].l(z);z.forEach(d),x=B(r,"g",{class:!0});var D=V(x);for(let N=0;N<b.length;N+=1)b[N].l(D);D.forEach(d),r.forEach(d),this.h()},h(){s(n,"opacity","1"),s(n,"fill","currentColor"),s(n,"y","9"),s(n,"dy","0.71em"),s(n,"font-size","12px"),s(n,"text-anchor","middle"),s(n,"transform",p="translate("+a[3]/2+" -50)"),s(t,"class","xaxis"),s(c,"opacity","1"),s(c,"fill","currentColor"),s(c,"y","9"),s(c,"dy","0.71em"),s(c,"font-size","12px"),s(c,"text-anchor","middle"),s(c,"transform",$="rotate(270) translate("+-a[2]/2+" "+-a[3]/15+")"),s(_,"class","yaxis"),s(v,"class","rects"),s(x,"class","labels"),s(e,"class","main"),s(e,"transform",o="translate("+a[3]/10+" "+a[2]/5+") scale(0.8 1)")},m(i,r){C(i,e,r),q(e,t),q(t,n),q(n,f),a[19](t),q(e,_),q(_,c),q(c,h),a[20](_),q(e,v);for(let m=0;m<y.length;m+=1)y[m].m(v,null);q(e,x);for(let m=0;m<b.length;m+=1)b[m].m(x,null);a[21](x)},p(i,r){r[0]&8&&p!==(p="translate("+i[3]/2+" -50)")&&s(n,"transform",p),r[0]&12&&$!==($="rotate(270) translate("+-i[2]/2+" "+-i[3]/15+")")&&s(c,"transform",$),r[0]&129180&&(l=i[4].ftools,y=ue(y,r,g,1,i,l,S,v,fe,ce,null,me)),r[0]&64&&(M=i[6],b=ue(b,r,w,1,i,M,k,x,fe,ge,null,he)),r[0]&12&&o!==(o="translate("+i[3]/10+" "+i[2]/5+") scale(0.8 1)")&&s(e,"transform",o)},d(i){i&&d(e),a[19](null),a[20](null);for(let r=0;r<y.length;r+=1)y[r].d();for(let r=0;r<b.length;r+=1)b[r].d();a[21](null)}}}function He(a){let e,t;return e=new ve({props:{$$slots:{default:[Fe]},$$scope:{ctx:a}}}),{c(){R(e.$$.fragment)},l(n){Y(e.$$.fragment,n)},m(n,f){Z(e,n,f),t=!0},p(n,f){const p={};f[0]&255|f[1]&8&&(p.$$scope={dirty:f,ctx:n}),e.$set(p)},i(n){t||(O(e.$$.fragment,n),t=!0)},o(n){F(e.$$.fragment,n),t=!1},d(n){G(e,n)}}}function ne(a){return a.name.toLowerCase().replace(/[^A-Za-z0-9]/g,"")}const Je=()=>{},Ke=()=>{};function Re(a,e,t){let n,f,p,_,c,h,$;const{data:v,width:y,height:S}=we("LayerCake");W(a,v,u=>t(4,$=u)),W(a,y,u=>t(3,h=u)),W(a,S,u=>t(2,c=u));function x(u,L){return k(u)+(o(u)-k(u))/2}function b(u,L){return l(u)+(g(u)-l(u))/2}function k(u,L){return n(u.highest_temporal_resolution?u.highest_temporal_resolution:"N/A")-_}function o(u,L){return n(u.largest_temporal_scope?u.largest_temporal_scope:"N/A")+_}function l(u,L){return f(u.highest_spatial_resolution?u.highest_spatial_resolution:"N/A")-_}function g(u,L){return f(u.largest_spatial_scope?u.largest_spatial_scope:"N/A")+_}function M(u,L){return Math.abs(k(u)-o(u))}function w(u,L){return Math.abs(l(u)-g(u))}let i=null,r=null;function m(u){return function(){U(this).attr("stroke-width",3),U("#"+ne(u)).attr("font-weight","bold")}}function T(u){return function(){U(this).attr("stroke-width",1),U("#"+ne(u)).attr("font-weight","normal")}}let A=null,I={label:()=>[]};function z(u,L,H){return I.label()}let D=[];function N(u){oe[u?"unshift":"push"](()=>{i=u,t(0,i)})}function P(u){oe[u?"unshift":"push"](()=>{r=u,t(1,r)})}function Q(u){oe[u?"unshift":"push"](()=>{A=u,t(5,A)})}return a.$$.update=()=>{a.$$.dirty[0]&8&&t(18,n=se().domain(["","instant","milliseconds","seconds","minutes","hours","days","months","years","decades","N/A"]).range([0,h])),a.$$.dirty[0]&4&&t(17,f=se().domain(["","component","device","facility","municipality","county","state","region","country","continent","global","N/A"]).range([0,c])),a.$$.dirty[0]&16&&t(7,p=xe().domain($.tools).range($e)),a.$$.dirty[0]&393219&&(U(i).call(ke(n)),U(r).call(be(f))),a.$$.dirty[0]&28&&(I=Oe().label($.ftools.map(u=>{const L=x(u),H=b(u);return{name:u.name,x:L,y:H,org_x:L,org_y:H,width:18,height:7.2}})).anchor($.ftools.map(u=>({x:x(u),y:b(u),r:10}))).width(h).height(c).start(1500)),a.$$.dirty[0]&28&&t(6,D=z($.ftools))},_=5,[i,r,c,h,$,A,D,p,v,y,S,k,l,M,w,m,T,f,n,N,P,Q]}class Ye extends pe{constructor(e){super();ye(this,e,Re,He,de,{},null,[-1,-1])}}function Ze(a){let e,t,n;return t=new Ae({props:{data:a[0],$$slots:{default:[Pe]},$$scope:{ctx:a}}}),{c(){e=J("div"),R(t.$$.fragment),this.h()},l(f){e=K(f,"DIV",{class:!0});var p=V(e);Y(t.$$.fragment,p),p.forEach(d),this.h()},h(){s(e,"class","grid my-4 w-full h-1/2 place-items-center")},m(f,p){C(f,e,p),Z(t,e,null),n=!0},p(f,p){const _={};p&1&&(_.data=f[0]),p&32&&(_.$$scope={dirty:p,ctx:f}),t.$set(_)},i(f){n||(O(t.$$.fragment,f),n=!0)},o(f){F(t.$$.fragment,f),n=!1},d(f){f&&d(e),G(t)}}}function Ge(a){let e,t,n,f,p;return n=new Ce({props:{class:"w-4 h-4 mr-2 fill-current",data:Ie,spin:!0}}),{c(){e=J("div"),t=J("div"),R(n.$$.fragment),f=te(`
      Loading...`),this.h()},l(_){e=K(_,"DIV",{class:!0});var c=V(e);t=K(c,"DIV",{class:!0,role:!0});var h=V(t);Y(n.$$.fragment,h),f=le(h,`
      Loading...`),h.forEach(d),c.forEach(d),this.h()},h(){s(t,"class","bg-yellow-100 rounded-lg py-5 px-6 mb-3 text-base text-yellow-700 inline-flex items-center w-full"),s(t,"role","alert"),s(e,"class","grid-flow-row mx-20 my-4")},m(_,c){C(_,e,c),q(e,t),Z(n,t,null),q(t,f),p=!0},p:Le,i(_){p||(O(n.$$.fragment,_),p=!0)},o(_){F(n.$$.fragment,_),p=!1},d(_){_&&d(e),G(n)}}}function Pe(a){let e,t;return e=new Ye({}),{c(){R(e.$$.fragment)},l(n){Y(e.$$.fragment,n)},m(n,f){Z(e,n,f),t=!0},i(n){t||(O(e.$$.fragment,n),t=!0)},o(n){F(e.$$.fragment,n),t=!1},d(n){G(e,n)}}}function Qe(a){let e,t,n,f,p,_,c,h,$,v,y,S,x,b,k,o,l,g;c=new ze({}),v=new Ne({}),x=new De({});const M=[Ge,Ze],w=[];function i(r,m){return r[1]?0:1}return k=i(a),o=w[k]=M[k](a),{c(){e=X(),t=J("div"),n=J("h1"),f=te("Spatial Temporal Visualization"),p=X(),_=J("div"),R(c.$$.fragment),h=X(),$=J("div"),R(v.$$.fragment),y=X(),S=J("div"),R(x.$$.fragment),b=X(),o.c(),l=_e(),this.h()},l(r){Se('[data-svelte="svelte-1dpoyov"]',document.head).forEach(d),e=ee(r),t=K(r,"DIV",{class:!0});var T=V(t);n=K(T,"H1",{class:!0});var A=V(n);f=le(A,"Spatial Temporal Visualization"),A.forEach(d),T.forEach(d),p=ee(r),_=K(r,"DIV",{class:!0});var I=V(_);Y(c.$$.fragment,I),I.forEach(d),h=ee(r),$=K(r,"DIV",{class:!0});var z=V($);Y(v.$$.fragment,z),z.forEach(d),y=ee(r),S=K(r,"DIV",{class:!0});var D=V(S);Y(x.$$.fragment,D),D.forEach(d),b=ee(r),o.l(r),l=_e(),this.h()},h(){document.title="Spatial Temporal Visualization",s(n,"class","text-4xl font-medium leading-tight mt-0 mb-2"),s(t,"class","grid mx-20 mt-6"),s(_,"class","grid mx-20 my-4 place-items-center"),s($,"class","grid mx-20 my-4 place-items-center"),s(S,"class","grid mx-20 my-4 place-items-center")},m(r,m){C(r,e,m),C(r,t,m),q(t,n),q(n,f),C(r,p,m),C(r,_,m),Z(c,_,null),C(r,h,m),C(r,$,m),Z(v,$,null),C(r,y,m),C(r,S,m),Z(x,S,null),C(r,b,m),w[k].m(r,m),C(r,l,m),g=!0},p(r,[m]){let T=k;k=i(r),k===T?w[k].p(r,m):(Ve(),F(w[T],1,1,()=>{w[T]=null}),Te(),o=w[k],o?o.p(r,m):(o=w[k]=M[k](r),o.c()),O(o,1),o.m(l.parentNode,l))},i(r){g||(O(c.$$.fragment,r),O(v.$$.fragment,r),O(x.$$.fragment,r),O(o),g=!0)},o(r){F(c.$$.fragment,r),F(v.$$.fragment,r),F(x.$$.fragment,r),F(o),g=!1},d(r){r&&d(e),r&&d(t),r&&d(p),r&&d(_),G(c),r&&d(h),r&&d($),G(v),r&&d(y),r&&d(S),G(x),r&&d(b),w[k].d(r),r&&d(l)}}}function Ue(a,e,t){let n,f,p,_;W(a,qe,h=>t(2,f=h)),W(a,je,h=>t(3,p=h)),W(a,Be,h=>t(1,_=h));function c(h){return{ftools:h,tools:p}}return a.$$.update=()=>{a.$$.dirty&4&&t(0,n=c(f))},[n,_,f]}class lt extends pe{constructor(e){super();ye(this,e,Ue,Qe,de,{})}}export{lt as default};