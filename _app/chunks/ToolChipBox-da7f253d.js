import{S,i as q,s as w,e as m,t as C,k as b,l as I,c as g,a as y,h as P,d as r,m as k,b as E,g as d,J as p,Y as T,j as D,Z as J,_ as K,R as L,K as B,v as M,U as N,ad as R}from"./vendor-c88585d4.js";import{d as v,t as V}from"./stores-21eca2f9.js";function O(s,t,e){const a=s.slice();return a[7]=t[e],a}function U(s){let t,e,a,n,h,_,f,u=s[1],o=[];for(let l=0;l<u.length;l+=1)o[l]=j(O(s,u,l));return{c(){t=m("label"),e=m("input"),a=C(`
      All`),n=b();for(let l=0;l<o.length;l+=1)o[l].c();h=I(),this.h()},l(l){t=g(l,"LABEL",{});var i=y(t);e=g(i,"INPUT",{type:!0}),a=P(i,`
      All`),i.forEach(r),n=k(l);for(let c=0;c<o.length;c+=1)o[c].l(l);h=I(),this.h()},h(){E(e,"type","checkbox")},m(l,i){d(l,t,i),p(t,e),e.checked=s[2],p(t,a),d(l,n,i);for(let c=0;c<o.length;c+=1)o[c].m(l,i);d(l,h,i),_||(f=[T(e,"change",s[4]),T(e,"input",s[3])],_=!0)},p(l,i){if(i&4&&(e.checked=l[2]),i&3){u=l[1];let c;for(c=0;c<u.length;c+=1){const A=O(l,u,c);o[c]?o[c].p(A,i):(o[c]=j(A),o[c].c(),o[c].m(h.parentNode,h))}for(;c<o.length;c+=1)o[c].d(1);o.length=u.length}},d(l){l&&r(t),l&&r(n),J(o,l),l&&r(h),_=!1,K(f)}}}function j(s){let t,e,a,n,h=s[7].name+"",_,f,u,o;return{c(){t=m("label"),e=m("input"),n=b(),_=C(h),f=b(),this.h()},l(l){t=g(l,"LABEL",{});var i=y(t);e=g(i,"INPUT",{type:!0}),n=k(i),_=P(i,h),f=k(i),i.forEach(r),this.h()},h(){E(e,"type","checkbox"),e.__value=a=s[7].name,e.value=e.__value,s[6][0].push(e)},m(l,i){d(l,t,i),p(t,e),e.checked=~s[0].indexOf(e.__value),p(t,n),p(t,_),p(t,f),u||(o=T(e,"change",s[5]),u=!0)},p(l,i){i&2&&a!==(a=l[7].name)&&(e.__value=a,e.value=e.__value),i&1&&(e.checked=~l[0].indexOf(e.__value)),i&2&&h!==(h=l[7].name+"")&&D(_,h)},d(l){l&&r(t),s[6][0].splice(s[6][0].indexOf(e),1),u=!1,o()}}}function Y(s){let t,e=s[1].length>0&&U(s);return{c(){t=m("div"),e&&e.c(),this.h()},l(a){t=g(a,"DIV",{class:!0});var n=y(t);e&&e.l(n),n.forEach(r),this.h()},h(){E(t,"class","flex flex-wrap justify-start space-x-2")},m(a,n){d(a,t,n),e&&e.m(t,null)},p(a,[n]){a[1].length>0?e?e.p(a,n):(e=U(a),e.c(),e.m(t,null)):e&&(e.d(1),e=null)},i:L,o:L,d(a){a&&r(t),e&&e.d()}}}function Z(s,t,e){let a,n,h;B(s,v,l=>e(0,n=l)),B(s,V,l=>e(1,h=l));function _(){a?N(v,n=[],n):N(v,n=h.map(l=>l.name),n)}M(()=>{});const f=[[]];function u(){a=this.checked,e(2,a),e(0,n),e(1,h)}function o(){n=R(f[0],this.__value,this.checked),v.set(n)}return s.$$.update=()=>{s.$$.dirty&3&&e(2,a=n.length==h.length)},[n,h,a,_,u,o,f]}class G extends S{constructor(t){super();q(this,t,Z,Y,w,{})}}export{G as T};