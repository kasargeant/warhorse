!function n(t,r,e){function o(u,f){if(!r[u]){if(!t[u]){var s="function"==typeof require&&require;if(!f&&s)return s(u,!0);if(i)return i(u,!0);var c=new Error("Cannot find module '"+u+"'");throw c.code="MODULE_NOT_FOUND",c}var h=r[u]={exports:{}};t[u][0].call(h.exports,function(n){return o(t[u][1][n]||n)},h,h.exports,n,t,r,e)}return r[u].exports}for(var i="function"==typeof require&&require,u=0;u<e.length;u++)o(e[u]);return o}({1:[function(n,t,r){class e{constructor(n,t){this.name="Polygon",this.height=n,this.width=t}sayName(){console.log("Hi, I am a",this.name+".")}}t.exports=e},{}],2:[function(n,t,r){const e=n("./Polygon");class o extends e{constructor(n=10){super(n,n),this.name="Square"}get area(){return this.height*this.width}}t.exports=o},{"./Polygon":1}]},{},[2]);