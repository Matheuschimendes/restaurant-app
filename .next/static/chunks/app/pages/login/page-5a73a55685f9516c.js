(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[947],{7143:(e,s,r)=>{Promise.resolve().then(r.bind(r,2185))},2185:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>n});var a=r(5155),t=r(2115),l=r(6046);let n=()=>{let[e,s]=(0,t.useState)(""),[r,n]=(0,t.useState)(""),u=(0,l.useRouter)();return(0,a.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gray-100",children:(0,a.jsxs)("div",{className:"bg-white p-8 rounded-lg shadow-lg",children:[(0,a.jsx)("h1",{className:"text-2xl font-bold mb-4",children:"Login do Admin"}),(0,a.jsx)("input",{type:"text",value:e,onChange:e=>s(e.target.value),placeholder:"Username",className:"w-full p-2 mb-4 border border-gray-300 rounded"}),(0,a.jsx)("input",{type:"password",value:r,onChange:e=>n(e.target.value),placeholder:"Password",className:"w-full p-2 mb-4 border border-gray-300 rounded"}),(0,a.jsx)("button",{onClick:()=>{"admin"===e&&"123"===r?(localStorage.setItem("userRole","admin"),u.push("/pages/dashboard")):alert("Credenciais inv\xe1lidas!")},className:"w-full bg-blue-500 text-white py-2 rounded-lg",children:"Login"})]})})}},6046:(e,s,r)=>{"use strict";var a=r(6658);r.o(a,"useRouter")&&r.d(s,{useRouter:function(){return a.useRouter}})}},e=>{var s=s=>e(e.s=s);e.O(0,[441,517,358],()=>s(7143)),_N_E=e.O()}]);