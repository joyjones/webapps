(function(){ovi.provide("nokia.maps.util.ColorHelper");
(function(e){function k(a){var b;if(a.charAt(0)==="#")b=f[a.length]?a:null;else if(a.substr(0,3)==="rgb"){b=a.match(/\d+(\.\d+)?/g);var c=b.length;b=c>2&&c<5?["#",d(+b[0]),d(+b[1]),d(+b[2]),c>3?d(+b[3]*255):"ff"].join(""):null}b||e.d("Invalid color definition: "+a);return b}function h(a){return!/^(#|rgb).*/.test(a)}function d(a){return a<16?"0"+g(a).toString(16):g(a).toString(16)}function c(a){a=b(a,16);return(a<<4)+a}var g=Math.round,b=parseInt,f={4:function(a){return["#",a.charAt(1),a.charAt(1),
a.charAt(2),a.charAt(2),a.charAt(3),a.charAt(3),"ff"].join("")},5:function(a){return["#",a.charAt(1),a.charAt(1),a.charAt(2),a.charAt(2),a.charAt(3),a.charAt(3),a.charAt(4),a.charAt(4)].join("")},7:function(a){return a+"ff"},9:function(a){return a}},q={4:function(a){return[c(a.charAt(1)),c(a.charAt(2)),c(a.charAt(3)),255]},5:function(a){return[c(a.charAt(1)),c(a.charAt(2)),c(a.charAt(3)),c(a.charAt(4))]},7:function(a){a=b(a.substring(1),16);return[a>>16&255,a>>8&255,a&255,255]},9:function(a){a=b(a.substring(1),
16);return[a>>24&255,a>>16&255,a>>8&255,a&255]}};e.ColorHelper={toInternal:function(a){return h(a)?a:(a=k(a),f[a.length]?f[a.length](a):a)},toRGBA:function(a,b){return h(a)?[0,0,0,255]:(b||(a=k(a)),q[a.length](a))},getHex3:function(a,b){return h(a)?a:(b||(a=k(a),a=f[a.length]?f[a.length](a):a),a.substr(0,7))},getAlpha:function(a,c){return h(a)?1:(c||(a=k(a),a=f[a.length]?f[a.length](a):a),b(a.substr(7,2),16)/255)},toRandomRGBA:function(a,b){if(h(a))return"000000ff";else{for(var a=this.toRGBA(a,b),
c=0;c<4;c++)a[c]=""+d(c<3?Math.floor(Math.random()*(a[c]-0+1))+0:a[c]);return a.join("")}}}})(nokia.maps.util);ovi.provide("nokia.maps.util.proto");(function(){var e={}.toString,k=nokia.maps.util.proto=function(h,d,c,g){var b=Function(),f,q;b.prototype=d;b=new b;for(f in h)h.hasOwnProperty(f)&&(b[f]=c&&f in d&&e.call(q=h[f])==="[object Object]"?k(q,d[f],c):h[f]);if(c&&!g)for(f in d)if(d.hasOwnProperty(f)&&(q=d[f])===b[f]&&e.call(q)==="[object Object]")b[f]=k(0,q,c);return b}})();ovi.provide("nokia.maps.util.Cache");
(function(e){function k(a,b,c,f){this.c=a;this.H=b;if(this.f!==f)this.f=f;if(c)(c.Y=this).W=c}function h(a,c){b.H=a;b.f=c===void 0?1:c;return b}function d(a){return a===void 0?1:isNaN(a=+a)||a<0||a===q?e.d():a}var c={},g={},b={},f={},q=1/0;e.Cache=new ovi.Class({initialize:function(a,b,c,f){this.Tb=d(a);if(b)this.Pd=b;if(c)this.we=c;if(f)this.X=f;this.q={}},Statics:{DONT:c,NEXT:g,NOT_ENOUGH_SPACE:f,change:h},f:0,change:h,add:function(a,e,l){var h=this.Pd,p=this.X,q=this.q,s=q[a],v;if(h){if((h=h(e))===
g)return s&&this.remove(a,1),p?p.add(a,e,l):g;if(h===c)return s&&this.remove(a),c;h===b?(e=h.H,l=h.f):e=h}if((l=d(l))>this.Tb)return p?p.add(a,e,l):f;if(s)this.f+=l-s.f,s.H=e,s.f=l,this.Ub(s);else{s=q[a]=this.V=new k(a,e,this.V,l);if(!this.fa)this.fa=s;this.f+=l}for(;this.f>this.Tb;)this.R((v=this.fa).c,v),p&&p.add(v.c,v.H,v.f)},get:function(a,b){var c=this.q[a],f;c&&(b||this.Ub(c));return c?c.H:(f=this.X)?f.get(a,b):void 0},remove:function(a,b){var c=this.q[a],f,d;c&&this.R(a,c);if(!b&&(f=this.X))d=
f.remove(a,b);return c?c.H:d},removeAll:function(a){var b=this.q,c,f;for(c in b)b.hasOwnProperty(c)&&!c.indexOf(a)&&this.R(c,b[c]);(f=this.X)&&f.removeAll(a)},destroy:function(){var a=this.q,b,c;for(c in a)(b=a[c]).W=0,b.Y=0;this.fa=this.V=0;this.X&&this.X.destroy()},R:function(a,b,c){var f=b.Y,d=b.W,e;f?d?(f.W=d).Y=f:(this.fa=f).W=void 0:(this.V=d)?d.Y=void 0:this.fa=void 0;if(!c)delete this.q[a],this.f-=b.f,(e=this.we)&&e(b.H);return b.H},Ub:function(a){var b=this.V;if((b=this.V)!==a){this.R(a.c,
a,1);if(b)(b.Y=a).W=b;(this.V=a).Y=void 0}}});k.prototype.f=1})(nokia.maps.util);ovi.provide("nokia.maps.map.provider.IData");ovi.provide("nokia.maps.map.provider.IObjectProvider");ovi.provide("nokia.maps.kml.ObservableNode");
(function(e){var k=e.util.Coroutine,h=e.kml.ObservableNode=new ovi.Class({Extends:e.util.OObject,initialize:function(d){this.node=d;this.set("state",h.State.INITIAL)},Statics:{State:{INITIAL:"initial",READY:"ready"},Mq:0,getParsedNodesCount:function(){return h.Mq}},nj:function(){},ij:function(d){return new h(d)},vj:function(d){return d&&d.nodeType==1},lm:function(d){return(d&&d.childNodes||[]).length===0},Bl:!1,Eu:function(){var d=this.parent;d&&(d.readyCount++,d.Bl&&d.validCount==d.readyCount&&d.set("state",
h.State.READY))},Gs:function(){delete this.readyCount;delete this.validCount;delete this.Bl;delete this.node},load:function(d,c){var e=this,b=e.node;if(!b||e.state==h.State.READY)e.set("state",h.State.READY);else{if(c)e.parent=c;e.addObserver("state",function(){e.state=="ready"&&(e.Gs(),(d||e.Eu).apply(e))});e.nj();h.Mq++;e.lm(b)?e.set("state",h.State.READY):(e.readyCount=0,e.validCount=0,k.create("nokia.maps.kml.ObservableNode#load",function(b){var c;if(!b.has("index"))b.index=0;if(!b.has("childNodes"))b.childNodes=
e.node.childNodes||[];if(!b.has("length"))b.length=b.childNodes.length;for(;b.index<b.length;)if(c=b.childNodes[b.index],e.vj(c)&&(e.validCount++,c=e.ij(c,e.validCount-1),c.load(null,e)),b.index++,k.shallYield())return k.yield();e.Bl=!0;e.validCount==e.readyCount&&e.set("state",h.State.READY)})())}}})})(nokia.maps);ovi.provide("nokia.maps.map.HitArea");
(function(){var e=Math,k=e.PI/180,h=e.ceil,d=e.min,c=e.sin,g=e.cos,b=nokia.maps.util,f=b.Point,q=nokia.maps.map.HitArea=new ovi.Class({initialize:function(a,f){var e=(f=[].concat(f)).length,m=e,p,q,s,v,u;this.values=f;for(this.type=a;m--;)isNaN(f[m]=f[m])&&b.d("Given argument is not the array of numbers");a==="rect"&&e>3&&(f=[+f[0],+f[1],+f[2],+f[1],+f[2],+f[3],+f[0],+f[3]],a="poly");if(a==="circle"&&e>2&&(s=+f[2])>0){p=+f[0];q=+f[1];m=d(h(s)*2,40);v=360/m;for(f=[];m--;)u=v*m*k,f.push(p+c(u)*s,q+
g(u)*s);a="poly"}if(a==="poly"&&e&&!(f.length%2))this.Zb=f;!this.Zb&&b.d("bad polygon")},Statics:{from:function(a){return a instanceof q?a:new q(a.type,a.values?a.values:a.coords)}},hitTest:function(a,b,c){return f.isCoveredBy(a,b,this.Zb,c,!0)}})})();ovi.provide("nokia.maps.map.provider.NullObjectProvider");
(function(e){e.map.provider.NullObjectProvider=new ovi.Class({cg:function(){},Wh:function(){},rc:function(){},requestBBox:function(){return[]},cancelBBoxRequest:function(){},adopt:function(e){if(e.e)return!1;e.e=this;return e},orphan:function(e){if(e.e!==this)return!1;e.e=null;return e}})})(nokia.maps);ovi.provide("nokia.maps.kml.DOM");
(function(e){var k=e.geo.Coordinate,h=e.util,d=e.kml.DOM=new ovi.Class({Statics:{getString:function(c){try{for(var d="",b=0,f=c.childNodes,e=f.length;b<e;b+=1)d+=f[b].nodeValue.replace(/^\s+|\s+$/g,"")}catch(a){}return d||""},getAltitudeMode:function(c){c=d.getString(c);return/^clampToGround$|^relativeToGround$|^absolute$/.test(c)?c:"clampToGround"},getBoolean:function(c){return/^1$|^true$/.test(d.getString(c))},getFloat:function(c){return parseFloat(d.getString(c))||0},getInteger:function(c){return parseInt(d.getString(c))||
0},getColor:function(c){c=d.getString(c);return/^[0-9a-fA-F]{8}$/.test(c)?"#"+c.substr(6,2)+c.substr(4,2)+c.substr(2,2)+c.substr(0,2):"#000000ff"},getNodeId:function(c){return d.getNodeAttribute(c,"id")},getNodeAttribute:function(c,d){var b;c[d]?b=c[d]:"getAttribute"in c&&(b=c.getAttribute(d));return b},parseCoords:function(c){var e=c.split(/\s+/),b=e.length,f=!(e&&b==1),h=f?1:3,a=[],k;if(!f)e=c.split(","),b=e.length;for(k=0;k<b;k+=h)if(c=d.parseCoord(f?e[k]:k+3>e.length?null:e.slice(k,k+3)))a.push(c);
else return[];return a},parseCoord:function(c){if(!c)return null;var d=c instanceof Array&&c.length>0&&c.length<4?c:c.split(","),c=parseFloat(d[0]),b=parseFloat(d[1]),d=parseFloat(d[2]);return isNaN(b)||isNaN(c)?null:new k(b,c,isNaN(d)?void 0:d)},parseFromString:function(c){return h.Af(c)},isValidNode:function(c,d){return!!c&&!!d&&function(b,c){if(Array.prototype.indexOf)return b.indexOf(d);else{for(var e=0,a=b.length;e<a;e++)if(b[e].toLowerCase()===c.toLowerCase())return e;return-1}}(c,d)!=-1}}})})(nokia.maps);
ovi.provide("nokia.maps.kml.Vector2");(function(e){var k=e.DOM;e.Vector2=new ovi.Class({initialize:function(e){this.x=k.getNodeAttribute(e,"x");this.y=k.getNodeAttribute(e,"y");this.xunits=k.getNodeAttribute(e,"xunits");this.yunits=k.getNodeAttribute(e,"yunits")}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Object");(function(e){var k=e.DOM;e.Object=new ovi.Class({initialize:function(e){this.id=e&&k.getNodeId(e);this.node=e}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.StyleSelector");
(function(e){e.StyleSelector=new ovi.Class({Extends:e.Object,initialize:function(e){this._super(e)}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.ColorStyle");
(function(e){var k=e.kml,h=k.DOM,d=e.util.ColorHelper;k.ColorStyle=new ovi.Class({Extends:k.Object,initialize:function(c){var e=c.childNodes,b;this._super(c);for(c=e.length;c--;)switch(b=e[c],b.nodeName){case "color":this.color=h.getColor(b);break;case "colorMode":this.colorMode=h.getString(b)}if(this.color&&this.colorMode=="random")this.color="#"+d.toRandomRGBA(this.color)}})})(nokia.maps);ovi.provide("nokia.maps.kml.Link");
(function(e){var k=e.DOM;e.Link=new ovi.Class({Extends:e.Object,initialize:function(e){var d=e.childNodes,c=d.length;for(this._super(e);c--;)if(e=d[c],e.nodeName=="href"){this.href=k.getString(e);break}},href:""})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.LabelStyle");(function(e){var k=e.DOM;e.LabelStyle=new ovi.Class({Extends:e.ColorStyle,initialize:function(e){var d=e.childNodes,c;this._super(e);for(e=d.length;e--;)switch(c=d[e],c.nodeName){case "scale":this.scale=k.getFloat(c)}}})})(nokia.maps.kml);
ovi.provide("nokia.maps.kml.LineStyle");(function(e){var k=nokia.maps.kml.DOM;e.LineStyle=new ovi.Class({Extends:e.ColorStyle,initialize:function(e){var d=e.childNodes,c;this._super(e);for(e=d.length;e--;)switch(c=d[e],c.nodeName){case "width":this.width=k.getFloat(c)}},Statics:{DEFAULT_STROKE_COLOR:"#000000ff",DEFAULT_STROKE_WIDTH:1}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.PolyStyle");
(function(e){var k=e.DOM;e.PolyStyle=new ovi.Class({Extends:e.ColorStyle,initialize:function(e){var d=e.childNodes,c;this._super(e);this.outline=this.fill=!0;for(e=d.length;e--;)switch(c=d[e],c.nodeName){case "fill":this.fill=k.getBoolean(c);break;case "outline":this.outline=k.getBoolean(c)}}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.BalloonStyle");
(function(e){var k=e.DOM;e.BalloonStyle=new ovi.Class({Extends:e.Object,initialize:function(e){var d,c;if(e){d=e.childNodes;this._super(e);for(e=d.length;e--;)switch(c=d[e],c.nodeName){case "bgColor":this.bgColor=k.getColor(c);break;case "textColor":this.textColor=k.getColor(c);break;case "text":this.text=k.getString(c);break;case "displayMode":this.displayMode=k.getString(c)}}},text:"",displayMode:"default"})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Geometry");
(function(e){var k=e.kml,h=e.util;k.Geometry=new ovi.Class({Mixins:[k.ObservableNode],Extends:k.Object,initialize:function(d){this._super(d)},weight:0,lm:function(){return!0},getCenterCoordinate:function(){h.co("Can't calculate center coordinate on abstract object")},getStyle:function(){h.co("Can't get style of an abstract object")}})})(nokia.maps);ovi.provide("nokia.maps.kml.LineString");
(function(e){var k=e.kml,h=k.DOM,d=e.geo.Coordinate;k.LineString=new ovi.Class({Extends:k.Geometry,initialize:function(c,d,b){var f=c.childNodes;this._super(c);this.lineStyle=d;this.balloonStyle=b;for(c=f.length;c--;)switch(d=f[c],d.nodeName){case "extrude":this.extrude=h.getBoolean(d);break;case "altitudeMode":this.altitudeMode=h.getAltitudeMode(d);break;case "tessellate":this.tessellate=h.getBoolean(d);break;case "coordinates":this.coordinates=this.Zm(h.getString(d))}this.weight=this.coordinates.length},
coordinates:[],Zm:function(c){var d=[];try{d=h.parseCoords(c)}catch(b){d=[]}if(d.length<2)return[];return d},getCenterCoordinate:function(){var c=this.coordinates,e=c.length-1,b=0,f=0;if(c){for(;e--;)b+=c[e].latitude,f+=c[e].longitude;return new d(b/c.length,f/c.length)}},getStyle:function(){var c,d={};d.color=this.color=k.LineStyle.DEFAULT_STROKE_COLOR;d.width=this.width=k.LineStyle.DEFAULT_STROKE_WIDTH;if(this.lineStyle){if(this.lineStyle.color)d.color=this.color=this.lineStyle.color;if(this.lineStyle.width)d.width=
this.width=this.lineStyle.width}if(c=this.balloonStyle){if(c.bgColor)d.bgColor=this.bgColor=c.bgColor;if(c.textColor)d.textColor=this.textColor=c.textColor;if(c.text)d.text=this.text=c.text;if(c.displayMode)d.displayMode=this.displayMode=c.displayMode}return d}})})(nokia.maps);ovi.provide("nokia.maps.kml.LinearRing");
(function(e){var k=e.kml,h=k.DOM,d=e.geo.Coordinate;k.LinearRing=new ovi.Class({Extends:k.Geometry,initialize:function(c,d,b){var f=c.childNodes;this._super(c);this.lineStyle=d;this.balloonStyle=b;for(c=f.length;c--;)switch(d=f[c],d.nodeName){case "extrude":this.extrude=h.getBoolean(d);break;case "altitudeMode":this.altitudeMode=h.getAltitudeMode(d);break;case "tessellate":this.tessellate=h.getBoolean(d);break;case "coordinates":this.coordinates=this.Zm(h.getString(d))}this.weight=this.coordinates.length},
coordinates:[],Zm:function(c){var d=[];try{d=h.parseCoords(c)}catch(b){d=[]}if((c=d.length)<2)return[];d[0].equals(d[c-1])||d.push(d[0]);return d},getCenterCoordinate:function(){var c=this.coordinates,e=c.length-1,b=0,f=0;if(c){for(;e--;)b+=c[e].latitude,f+=c[e].longitude;return new d(b/(c.length-1),f/(c.length-1))}return null},getStyle:function(){var c,d={};d.color=this.color=k.LineStyle.DEFAULT_STROKE_COLOR;d.width=this.width=k.LineStyle.DEFAULT_STROKE_WIDTH;if(this.lineStyle){if(this.lineStyle.color)d.color=
this.color=this.lineStyle.color;if(this.lineStyle.width)d.width=this.width=this.lineStyle.width}if(c=this.balloonStyle){if(c.bgColor)d.bgColor=this.bgColor=c.bgColor;if(c.textColor)d.textColor=this.textColor=c.textColor;if(c.text)d.text=this.text=c.text;if(c.displayMode)d.displayMode=this.displayMode=c.displayMode}return d}})})(nokia.maps);ovi.provide("nokia.maps.kml.Icon");
(function(e){var k=e.DOM;e.Icon=new ovi.Class({Extends:e.Link,initialize:function(e){var d=e.childNodes,c;this._super(e);this.offsetX=this.offsetY=0;for(e=d.length;e--;)switch(c=d[e],c.nodeName){case "gx:x":this.offsetX=k.getInteger(c);break;case "gx:y":this.offsetY=k.getInteger(c)}}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Point");
(function(e){var e=e.kml,k=e.DOM;e.Point=new ovi.Class({Extends:e.Geometry,initialize:function(e,d,c,g){var b=e.childNodes,f;this._super(e);this.iconStyle=d;this.iconStyleHighlighted=c;this.balloonStyle=g;for(e=b.length;e--;)switch(d=b[e],d.nodeName){case "extrude":this.extrude=k.getBoolean(d);break;case "altitudeMode":this.altitudeMode=k.getAltitudeMode(d);break;case "coordinates":f=k.getString(d)}if(f)this.coordinate=k.parseCoord(f)||void 0},weight:1,coordinate:void 0,getCenterCoordinate:function(){return this.coordinate},
getStyle:function(){var e,d={};if(this.iconStyle){if(this.iconStyle.color)d.brush=this.brush=this.iconStyle.color;if(this.iconStyle.scale)d.scale=this.scale=this.iconStyle.scale;if(this.iconStyle.hotSpot)d.offsetX=this.offsetX=this.iconStyle.hotSpot.x,d.offsetY=this.offsetY=this.iconStyle.hotSpot.y,d.offsetXUnits=this.offsetXUnits=this.iconStyle.hotSpot.xunits,d.offsetYUnits=this.offsetYUnits=this.iconStyle.hotSpot.yunits;if(this.iconStyle.icon&&this.iconStyle.icon.href)d.icon=this.icon=this.iconStyle.icon.href}if(this.iconStyleHighlighted){if(this.iconStyleHighlighted.color)d.brushHighlighted=
this.brushHighlighted=this.iconStyleHighlighted.color;if(this.iconStyleHighlighted.scale)d.scaleHighlighted=this.scaleHighlighted=this.iconStyleHighlighted.scale;if(this.iconStyleHighlighted.hotSpot)d.offsetXHighlighted=this.offsetXHighlighted=this.iconStyleHighlighted.hotSpot.x,d.offsetYHighlighted=this.offsetYHighlighted=this.iconStyleHighlighted.hotSpot.y,d.offsetXHighlightedUnits=this.offsetXHighlightedUnits=this.iconStyleHighlighted.hotSpot.xunits,d.offsetYHighlightedUnits=this.offsetYHighlightedUnits=
this.iconStyleHighlighted.hotSpot.yunits;if(this.iconStyleHighlighted.icon&&this.iconStyleHighlighted.icon.href)d.iconHighlighted=this.iconHighlighted=this.iconStyleHighlighted.icon.href}if(e=this.balloonStyle){if(e.bgColor)d.bgColor=this.bgColor=e.bgColor;if(e.textColor)d.textColor=this.textColor=e.textColor;if(e.text)d.text=this.text=e.text;if(e.displayMode)d.displayMode=this.displayMode=e.displayMode}return d}})})(nokia.maps);ovi.provide("nokia.maps.map.Object");
(function(e){if(!e.util.getConstructor(e.map.Object)){var k=0,h=0,d=function(c,b){var f=c.Oa(),d=b.Oa(),a,e,l,m=0,p;if(!f||!d)return 0;a=f.length;e=d.length;for(l=a<e?a:e;m<l;m++)if(p=d[m]-f[m])return h?-p:p;return h?a-e:e-a},c={rev:0,sort:function(c,b,f){var e=[],a,k,l=c.length;for(k=0;k<l;k++)((a=c[k]).getIconForRendering||a.drawToTile)&&(b||a.isVisible())&&e.push(a);h=f;e.sort(d);return e},create:function(c){var b=c.t,f;f=null;b&&(f=(f=b.Oa())?f.slice():[],f.push(c.zIndex,b.objects.indexOf(c)));
return f}};nokia.maps.map.Object=new ovi.Class({Extends:e.util.OObject,Mixins:e.dom.EventTarget,Statics:{sortByZInfo:c.sort,CHANGE_SPATIAL:1,CHANGE_VISUAL:2,CHANGE_ZINDEX:4},dispatch:function(c){c.display=this.getDisplay();return e.dom.EventTarget.prototype.dispatch.call(this,c)},initialize:function(c){this.e=new e.map.provider.NullObjectProvider;this.id=k++;c&&"draggable"in c?(c.isDraggable=c.draggable,delete c.draggable,this._super(c),c.draggable=c.isDraggable,delete c.isDraggable):this._super(c);
this.addObserver("*",this.ac,this)},t:null,CHANGE_SPATIAL:1,CHANGE_VISUAL:2,CHANGE_ZINDEX:4,isEventTarget:!0,zIndex:0,visibility:!0,u:"object",Nc:function(){return this.Ob||(this.Ob={})},destroy:function(){var c=this.t;c&&c.objects.remove(this);this.removeAllListeners();this.e=null;this.removeObserver("*",this.ac,this)},getInvalidations:function(c){var b=this.Ob;return b?(b[1]>c)*1|(b[2]>c)*2|(b[4]>c)*4:0},ac:function(c,b){this.ia(b,0)},getProvider:function(){return this.e},getParent:function(){return this.t},
getRoot:function(){for(var c=this,b;b=c.t;)c=b;return c},getDisplay:function(){var c=this.getRoot();return c.u==="display"?c:null},isVisible:function(){var c=this,b=!1;do b=c.visibility;while(b&&(c=c.t));return b},ia:function(c,b){var f;f=this.e;var d;b|=c==="zIndex"?4:c==="visibility"?2:0;d=f.rc(this,b);f=this.Nc();b&1&&(f[1]=d);b&2&&(f[2]=d);b&4&&(f[4]=d)},zIndexSetter:function(c){this.Pb();return c},eventListenerSetter:function(c){var b=0,f,d;if(c)for(d in this.removeAllListeners(),c)if((b=ovi.type(f=
c[d]))==="array")for(b=0;b<f.length;b+=3)this.addListenerNS(f[b+2],d,f[b],f[b+1]);else b==="function"&&this.addListenerNS(null,d,f,!1)},Oa:function(){var d;if(!(d=this.pc))d=this.pc=c.create(this);return d},Pb:function(){this.pc=void 0},adopt:function(c){return c.adopt(this)},orphan:function(){return this.e.orphan(this)}})}})(nokia.maps);ovi.provide("nokia.maps.kml.IconStyle");
(function(e){var k=e.DOM,h=e.Icon,d=e.Vector2;e.IconStyle=new ovi.Class({Extends:e.ColorStyle,initialize:function(c){if(c){var e=c.childNodes,b;this._super(c);for(c=e.length;c--;)switch(b=e[c],b.nodeName){case "scale":this.scale=k.getFloat(b);break;case "heading":this.heading=k.getFloat(b);break;case "Icon":if(b=new h(b))this.icon=b;break;case "hotSpot":this.hotSpot=new d(b)}}}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Style");
(function(e){var k=e.IconStyle,h=e.LabelStyle,d=e.LineStyle,c=e.PolyStyle,g=e.BalloonStyle;e.Style=new ovi.Class({Extends:e.StyleSelector,initialize:function(b){var f=b.childNodes,e;this._super(b);for(b=f.length;b--;)switch(e=f[b],e.nodeName){case "IconStyle":if(e=new k(e))this.iconStyle=e;break;case "LabelStyle":if(e=new h(e))this.labelStyle=e;break;case "LineStyle":if(e=new d(e))this.lineStyle=e;break;case "PolyStyle":if(e=new c(e))this.polyStyle=e;break;case "BalloonStyle":if(e=new g(e))this.balloonStyle=
e}},getStyle:function(){return this}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Pair");
(function(e){var k=e.DOM,h=e.Style;e.Pair=new ovi.Class({Extends:e.Object,initialize:function(d,c){var e=d.childNodes,b,f;this._super(d);this.styleContainer=c;for(f=e.length;f--;)switch(b=e[f],b.nodeName){case "key":this.key=k.getString(b);break;case "styleUrl":this.styleUrl=k.getString(b);break;case "Style":if(b=new h(b))this.style=b}},getStyle:function(){if(this.style)return this.style;if(this.styleUrl)return this.styleContainer.getStyleById(this.styleUrl.substr(1));return null}})})(nokia.maps.kml);
ovi.provide("nokia.maps.kml.FeatureStyle");
(function(e){function k(d,b,f){return f?c(d,b,!1):c(b,d,!1)}var h=e.kml,d=h.Style,c=e.util.proto;h.FeatureStyle=new ovi.Class({initialize:function(c,b){this.mergeStyle(c,b)},mergeStyle:function(c,b,f){var e,a;if(c){e=c.iconStyle;a=c.iconStyleHighlighted;if(b&&c instanceof d){if(e)this.iconStyleHighlighted=k(this.iconStyle,e,f)}else if(this.iconStyle=k(this.iconStyle,e,f),a)this.iconStyleHighlighted=k(this.iconStyleHighlighted,a,f);if(c.balloonStyle)this.balloonStyle=k(this.balloonStyle,c.balloonStyle,
f);if(c.labelStyle)this.labelStyle=k(this.labelStyle,c.labelStyle,f);if(c.lineStyle)this.lineStyle=k(this.lineStyle,c.lineStyle,f);if(c.polyStyle)this.polyStyle=k(this.polyStyle,c.polyStyle,f)}}})})(nokia.maps);ovi.provide("nokia.maps.kml.StyleContainer");
(function(e){var k=e.Style;e.StyleContainer=new ovi.Class({initialize:function(e){this.styles={};e&&e.id&&(this.styles[e.id]=e)},push:function(e){e&&e.id&&(this.styles[e.id]=e);return this.styles},getStyleById:function(e,d){var c=this.styles[e];if(!c)return null;if(c instanceof k&&d)return null;return c.getStyle(d)},getStyles:function(){return this.styles}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Polygon");
(function(e){var k=e.kml,h=k.DOM,d=k.LinearRing,c=k.LineStyle,g=k.FeatureStyle,b=e.geo.Coordinate;k.Polygon=new ovi.Class({Extends:k.Geometry,initialize:function(b,c,a,e){var l=b.childNodes,k,p=0,z=l.length;k=0;this._super(b);if(c&&e)e.polyStyle=c;if(a&&e)e.balloonStyle=a;this.featureStyle=e||new g;for(this.innerBoundaryIs=[];p<z;){k=l[p];switch(k.nodeName){case "extrude":this.extrude=h.getBoolean(k);break;case "altitudeMode":this.altitudeMode=h.getAltitudeMode(k);break;case "tessellate":this.tessellate=
h.getBoolean(k);break;case "outerBoundaryIs":c=k.childNodes;b=0;for(k=c.length;b<k;){if(c[b].nodeName=="LinearRing")this.outerBoundaryIs=new d(c[b]),this.weight+=this.outerBoundaryIs.weight;b++}break;case "innerBoundaryIs":c=k.childNodes;b=0;for(k=c.length;b<k;)a=c[b],a.nodeName=="LinearRing"&&(this.innerBoundaryIs.push(a=new d(a)),this.weight+=a.weight),b++}p++}},getPathOuter:function(){if(this.pathOuter===void 0&&(this.pathOuter=null,this.outerBoundaryIs&&this.outerBoundaryIs.constructor===d))this.pathOuter=
this.outerBoundaryIs.coordinates;return this.pathOuter},getCenterCoordinate:function(){var c=this.getPathOuter(),d=c.length-1,a=d,e=0,g=0;if(c){for(;d--;)e+=c[d].latitude,g+=c[d].longitude;return new b(e/a,g/a)}return null},getStyle:function(){var b=this.featureStyle.balloonStyle,d=this.featureStyle.polyStyle,a=this.featureStyle.lineStyle,e={};e.color=this.color="#ff00007d";e.fillColor=this.fillColor="#0000ff7d";e.width=this.width=c.DEFAULT_STROKE_WIDTH;e.strokeColor=c.DEFAULT_STROKE_COLOR;if(d){if(d.color)e.fillColor=
this.fillColor=d.color;if(!d.fill)e.fillColor=this.fillColor="#00000000";if(!d.outline)e.width=this.width=0}if(a&&(e.strokeColor=a.color||c.DEFAULT_STROKE_COLOR,d&&d.outline))e.width=a.width||c.DEFAULT_STROKE_WIDTH;if(b){if(b.bgColor)e.bgColor=this.bgColor=b.bgColor;if(b.textColor)e.textColor=this.textColor=b.textColor;if(b.text)e.text=this.text=b.text;if(b.displayMode)e.displayMode=this.displayMode=b.displayMode}return e}})})(nokia.maps);ovi.provide("nokia.maps.kml.MultiGeometry");
(function(e){var e=e.kml,k=e.DOM,h=e.Point,d=e.LineString,c=e.LinearRing,g=e.Polygon,b=e.MultiGeometry=new ovi.Class({Extends:e.Geometry,initialize:function(b,c,a,d){this.featureStyle=c;this.placemark=d;this._super(b)},nj:function(){this.geometries=[]},vj:function(b){return k.isValidNode(["Point","LineString","LinearRing","Polygon","MultiGeometry"],b.nodeName)},lm:function(){return!1},ij:function(f){var e=this.featureStyle,a=this.placemark,k;switch(f.nodeName){case "Point":k=new h(f,e.iconStyle,e.iconStyleHighlighted,
e.balloonStyle);break;case "LineString":k=new d(f,e.lineStyle,e.balloonStyle);break;case "LinearRing":k=new c(f,e.lineStyle,e.balloonStyle);break;case "Polygon":k=new g(f,null,null,e);break;case "MultiGeometry":k=new b(f,e,e.balloonStyle,a)}k&&(this.weight+=k.weight,this.geometries.push(this.Tt(k,a)));return k},Tt:function(b,c){if(b&&c)b.visibility=c.visibility,b.name=c.name,b.description=c.description;return b}})})(nokia.maps);ovi.provide("nokia.maps.map._MarkerIcon");
(function(){function e(c){return new b(typeof c==="object"?c.strokeColor?{strokeColor:a(c.strokeColor)}:void 0:{strokeColor:c})}var k=nokia.maps,h=k.map.HitArea,d=k.util,c=d.proto,g=d.Point,b=d.Pen,f=new b({strokeColor:"#FFF"}),q=d.Brush,a=d.ColorHelper.getHex3,r=k.gfx,l=r.GraphicsImage,m=r.IDL,p=r.Color.parseCss,z=[4207599104,4207599105,4207599106,"$Text$"],s=new k.gfx.SvgParser,v=d.$c("shape text textPen pen brush effect"),u=d.flatMerge(d.$c("anchor hitArea"),v),x=new d.Cache(50),w=nokia.maps.map.Hb=
new ovi.Class({Extends:nokia.maps.util.OObject,initialize:function(a){var b;a&&a.shape&&a.shape!==this.shape?(this.shape=this.shapeSetter(b=a.shape),delete a.shape,this._super(a),a.shape=b):(this.shapeSetter(this.shape),this._super(a));this.addObserver("*",this.ee)},Statics:{kn:u,Ta:function(a){return a in u},te:function(a){return!(a in v)},fc:{balloon:['<path style="opacity:0.4;fill:#353535" d="m 19,31 c 0,1.67 -2.69,3 -6,3 c -3.31,0 -6,-1.33 -6,-3 c 0,-1.67 2.69,-3 6,-3 c 3.31,0 6,1.33 6,3 z" /><path style="fill:#Facade01" d="m 13,0 c -3.47,0 -6.73,1.32 -9.19,3.75 C 1.36,7.82 0,9.41 0,12.84 c 0,3.43 1.36,6.64 3.81,9.06 L 13,31 l 9.19,-9.094 c 2.46,-2.43 3.81,-5.63 3.81,-9.06 c 0,-3.43 -1.36,-6.67 -3.81,-9.09 C 19.73,1.32 16.47,0 13,0 z"/><path style="fill:#ffffff" d="m 13,1 c -3.21,0 -6.23,1.23 -8.5,3.47 c -2.26,2.24 -3.5,5.22 -3.5,8.38 c 0,3.16 1.24,6.14 3.5,8.38 l 8.5,8.38 l 8.5,-8.38 c 2.26,-2.24 3.5,-5.22 3.5,-8.38 c 0,-3.16 -1.24,-6.14 -3.5,-8.38 C 19.23,2.23 16.2,1 13,1 z"/><path style="fill:#Facade00;fill-opacity:1" d="m 13,2.19 c -7,0 -10.74,4.96 -10.81,10.65 c 0,3.27 0.95,5.61 3.03,7.66 l 7.79,7.69 l 7.79,-7.69 c 2.07,-2.05 3.02,-4.27 3.03,-7.66 C 23.58,7.07 19.98,2.19 13,2.19 z"/><text x="13" y="18" font-size="10pt" font-family="arial" font-weight="bold" text-anchor="middle" fill="#Facade02">$Text$</text>',
28,36,13,31,"poly",[0,16,0,7,8,0,18,0,26,7,26,16,18,34,8,34]]}},text:"",pen:c({},f),textPen:c({},f),brush:c({},new q({color:"#1080DD"})),shape:"balloon",effect:"none",ee:function(a,b){if(b in v)a.c="",a.Pa=0},shapeSetter:function(a){var b=w.fc[a]||d.d("shape");this.f=new g(b[1],b[2]);this.anchor=new g(b[3],b[4]);this.hitArea=b[5]?new h(b[5],b[6]):void 0;return a},brushSetter:function(b){return new q(typeof b==="object"?b.color?{color:a(b.color)}:void 0:{color:b})},penSetter:e,textPenSetter:e,textSetter:function(a){return d.sanitizeText(a)},
be:function(){var a=w.fc[this.shape],b,c,f,d;if(a&&typeof a[0]==="string"){b=z.length;for(c=a[0]=ovi.Array(s.parseSvg('<svg version="1.1" width="'+(f=a[1])+'" height="'+(d=a[2])+'" viewBox="0 0 '+f+" "+d+'">'+a[0]+"</svg>").data);b--;){d=[];for(f=-1;(f=c.indexOf(z[b],f+1))!==-1;)d.push(f);d.length&&(a[7+b]=d)}}return a},Je:function(a){for(var b=[p(this.brush.color,1),p(this.pen.strokeColor,1),p(this.textPen.strokeColor,1),this.text],c=b.length,f=a[0].slice(),d,e;c--;)if(d=a[7+c])for(e=d.length;e--;)f[d[e]]=
b[c];return f},getIcon:function(){var a,b;if(!this.Pa){if(!(b=x.get(a=this.ea())))x.add(a,b=new l(new m(this.Je(this.be()))));this.Pa=b}return this.Pa},ea:function(){return this.c||(this.c=(this.hasOwnProperty("shape")?this.shape:"").concat(this.text,this.textPen.ea(),"P",this.pen.ea(),"B",this.brush.ea()))}})})();ovi.provide("nokia.maps.kml.StyleMap");
(function(e){var k=nokia.maps.kml.Pair;e.StyleMap=new ovi.Class({Extends:e.StyleSelector,initialize:function(e,d){var c=e.childNodes,g,b;this._super(e);this.styleContainer=d;this.pairs=[];for(b=c.length;b--;)switch(g=c[b],g.nodeName){case "Pair":(g=new k(g,this.styleContainer))&&this.pairs.push(g)}},getStyle:function(e){var d=null,c="normal";e&&(c="highlight");for(e=0;e<this.pairs.length;e++)if(this.pairs[e].key==c){d=this.pairs[e].getStyle();break}return d}})})(nokia.maps.kml);ovi.provide("nokia.maps.map.Marker");
(function(){var e=nokia.maps,k=e.util,h=e.dom,d=e.map,c=e.gfx,g=k.Point,b=k.Strip,f=new g(0,0),q=k.Rectangle,a=d.Hb,r=e.geo,l=d.HitArea,m=r.Coordinate,e=new ovi.Class({Extends:d.Object,initialize:function(b,c){var f;if(this.u==="marker"&&(!c||!("icon"in c)))f=new a,this.set("icon",f.getIcon()),this.set("anchor",f.anchor),this.set("hitArea",f.hitArea);this.Qa={};this._super(c);this.set("coordinate",b,1)},u:"marker",anchor:f,f:f,coordinateSetter:function(a){(a=m.fromObject(a))||k.d("coord");this.Qa=
{};return a},hitAreaSetter:function(a){return!a?a:l.from(a)},anchorSetter:function(a){(a=g.fromObject(a))||k.d("you have to set util.Point");return a},draggableSetter:function(a){return this.isDraggable=a},Ka:function(a){this.f=new g(a.width,a.height);this.gc=1},iconSetter:function(a){ovi.type(a);a instanceof c.Image||(a=c.Image.fromObject(a));a instanceof c.Image||k.d("icon");this.icon=a.C===document?a:a.clone(document);a.state===1?this.Ka(a):this.gc=0;return this.icon},getBoundingBox:function(){return r.BoundingBox.coverAll([this.coordinate])},
getDisplayBoundingBox:function(a){a=a.geoToPixel(this.coordinate).sub(this.anchor);return new q([a,a.add(this.f)])},hitTest:function(a,b,c,f){var a=this.getDisplayBoundingBox(a),d=new g(b,c),e=this.hitArea;return a.contains(d)&&(!e||e.hitTest(b-a.topLeft.x,c-a.topLeft.y,f))},getDisplayOffset:function(a,b,c){return(new g(b,c)).sub(a.geoToPixel(this.coordinate))},ia:function(a,b){a!=="zIndex"&&(b|=a==="coordinate"?1:2);this._super(a,b)},fe:function(a){var b="error";a.state===1&&(this.Ka(a),this.ia("icon",
2),b="load");this.dispatch(new h.Event({type:b,target:this,relatedTarget:a}))},getIconForRendering:function(a){var b=this.icon;a!==document&&(b=b.clone(a));b.state?this.gc||b.state===1&&this.Ka(b):b.prepare(this.fe,this);return b},project:function(a){return this.Qa[a.id]||(this.Qa[a.id]=a.geoToMapPoints(b.stencil(b.LAT_LNG,[this.coordinate.latitude,this.coordinate.longitude])))}});if(d.Marker.isNs)d.Marker=e})();ovi.provide("nokia.maps.map.StandardMarker");
(function(){function e(c,d,b){c.U.set(d,b);if(d==="shape")c.f=c.U.f,c.set("anchor",c.U.anchor),c.set("hitArea",c.U.hitArea);return c.U[d]}var k=nokia.maps,h=k.util,d=k.map.Hb,k=nokia.maps.map.StandardMarker=new ovi.Class({Extends:nokia.maps.map.Marker,initialize:function(c,e){var b=this.U=new d(h.flatMerge({},e,1,d.Ta));h.flatMerge(this,b,1,d.Ta);this.f=b.f;this._super(c,h.flatMerge({},e,1,d.te))},u:"standardmarker",shapeSetter:function(c){return e(this,"shape",c)},textSetter:function(c){return e(this,
"text",c)},textPenSetter:function(c){return e(this,"textPen",c)},penSetter:function(c){return e(this,"pen",c)},brushSetter:function(c){return e(this,"brush",c)},getIconForRendering:function(c){this.set("icon",this.U.getIcon());return this._super(c)}});h.flatMerge(k.prototype,d.prototype,!0,d.Ta)})();ovi.provide("nokia.maps.kml.Feature");
(function(e){var k=e.DOM,h=e.Style,d=e.FeatureStyle,c=e.StyleContainer;e.Feature=new ovi.Class({Mixins:[e.ObservableNode],Extends:e.Object,initialize:function(e,b,f){this._super(e);this.featureStyle=new d(f);this.styleContainer=b||new c},nj:function(){var c=this.node!=void 0&&this.node.childNodes||[],b,f=this.node!=void 0&&this.node.nodeName,d;this.visibility=!0;for(d=c.length;d--;)switch(b=c[d],b.nodeName){case "name":this.name=k.getString(b);break;case "description":this.description=k.getString(b);
break;case "visibility":this.visibility=k.getBoolean(b);break;case "open":this.open=k.getBoolean(b);break;case "styleUrl":if(this.styleUrl=k.getString(b))b=this.styleUrl.substr(1),this.featureStyle.mergeStyle(this.styleContainer.getStyleById(b),!1,!0),this.featureStyle.mergeStyle(this.styleContainer.getStyleById(b,!0),!0,!0);break;case "Style":(b=new h(b))&&(k.isValidNode(["kml","Folder","Document"],f)||this.featureStyle.mergeStyle(b))}}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Placemark");
(function(e){var k=e.Point,h=e.DOM,d=e.LineString,c=e.LinearRing,g=e.Polygon,b=e.MultiGeometry;e.Placemark=new ovi.Class({Extends:e.Feature,initialize:function(b,c,a){this._super(b,c,a)},ij:function(f){var e=this.featureStyle;switch(f.nodeName){case "Point":this.geometry=new k(f,e.iconStyle,e.iconStyleHighlighted,e.balloonStyle);break;case "LineString":this.geometry=new d(f,e.lineStyle,e.balloonStyle);break;case "LinearRing":this.geometry=new c(f,e.lineStyle,e.balloonStyle);break;case "Polygon":this.geometry=
new g(f,null,null,e);break;case "MultiGeometry":this.geometry=new b(f,e,e.balloonStyle,this)}if(this.geometry)this.geometry.visibility=this.visibility,this.geometry.name=this.name,this.geometry.description=this.description,this.geometry.index=this.index,this.geometry.open=this.open;return this.geometry},vj:function(b){return h.isValidNode(["Point","LineString","LinearRing","Polygon","MultiGeometry"],b.nodeName)}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.component.KMLResultSet");
(function(e){var k=e.util,h=e.kml,d=e.util.Coroutine,c=e.map,g=c.Marker,b=c.StandardMarker,f=/^(?:https?)|(?:file):\/\//,q=e.dom.Page.browser.touch?"tap":"click",a=h.component.KMLResultSet=new ovi.Class({Extends:e.util.OObject,initialize:function(b,f){var d=this,e=b.path||"",h=e.lastIndexOf("/");d.Bf=e.slice(0,h!==-1?h:0)+"/";d.set("state",a.State.INITIAL);d.infoBubble=f&&f.getComponentById("InfoBubbles");d.Vp=b.kmlDocument||b;d.container=new c.Container;d.addObserver("state",function(){d.state==
a.State.FINISHED&&(d.container.addListener("mouseenter",function(a){if(a.target&&a.target instanceof g)a=a.target,a.iconNormal&&a.iconHighlighted&&a.set("icon",a.iconHighlighted)}),d.container.addListener("mouseleave",function(a){var b;(b=a.target)&&b instanceof g&&b.iconNormal&&b.iconHighlighted&&b.set("icon",b.iconNormal)}))})},Statics:{State:{INITIAL:"initial",STARTED:"started",FINISHED:"finished"}},container:null,create:function(){var b=this;if(b.state==a.State.STARTED||b.state==a.State.FINISHED)return b.container;
b.set("state",a.State.STARTED);d.create("nokia.maps.kml.KMLResultSet#create_BFS",function(a){var f,e,g,k,q;k=g=!1;if(!a.has("index"))a.index=0;if(!a.has("weight"))a.weight=0;for(;a.queue.length>0;){f=a.has("queueNode")?a.queueNode:a.queueNode=a.queue.shift();e=f.node;f=f.parent;f=f.objects;g=e instanceof h.Document||e instanceof h.Folder;k=e.geometry&&e.geometry instanceof h.MultiGeometry;if(g||k){e=g?e:e.geometry;q=g?e.features:e.geometries;k=q.length;g=a.has("mapObject")?a.mapObject:new c.Container([],
{visibility:e.visibility});for(a.index===0&&f.add(g);a.index<k;)if(a.queue.push({node:q[a.index],parent:g}),a.index++,d.shallYield())return a.mapObject=g,d.yield();else if(a.index%100===0)return a.mapObject=g,d.sleep(1);a.index=0;delete a.mapObject}else e=e.geometry||e,g=null,e instanceof h.Point?g=b.getPointObject(e):e instanceof h.LinearRing?g=b.getLineObject(e):e instanceof h.LineString?g=b.getLineObject(e):e instanceof h.Polygon&&(g=b.getPolygonObject(e)),g&&(f.add(g),b.Kt(g,e)),a.weight+=e.weight;
delete a.queueNode;if(d.shallYield())return d.yield();else if(a.weight>=600)return a.weight=0,d.sleep(1)}},"queue")([{node:b.Vp,parent:b.container}]).onTerminated=function(){delete b.Vp;b.set("state",a.State.FINISHED)};return b.container},Kt:function(a,b){var c=this,f=b.getStyle(),d=b.balloonStyle||!!b.featureStyle&&b.featureStyle.balloonStyle;b.displayMode&&b.displayMode=="hide"||a.addListener(q,function(){var e=d&&d.text||"",g=b.name||"",h=b.description||"";if(e)e=e.replace(/\$\[name\]/g,g).replace(/\$\[description\]/g,
h).replace(/\$\[[\w]+\]/g,"");else if(g||h)e+=g?g+"<br / >":"",e+=h;else if(f.text)e=f.text;if(e&&c.infoBubble&&c.infoBubble.openBubble)a.infoBubbleHandler=c.infoBubble.openBubble(e,b.getCenterCoordinate())})},yv:function(a,b){var c=a.icon,f,d,e,g,h;if(c)e=a.geometry,g=c.width,h=c.height,b?(c=e.offsetXHighlighted,f=e.offsetYHighlighted,d=e.offsetXHighlightedUnits,e=e.offsetYHighlightedUnits):(c=e.offsetX,f=e.offsetY,d=e.offsetXUnits,e=e.offsetYUnits),a.set("anchor",new k.Point((d=="pixels"?c:d=="insetPixels"?
g-c:d=="fraction"?g*c:g*0.5)||0,(e=="pixels"?h-f:e=="insetPixels"?f:e=="fraction"?h-h*f:h*0.5)||0))},getPointObject:function(a){var c=this,d,e=a.getStyle(),h,k={visibility:a.visibility};if(a.coordinate){if(h=e.icon)e=e.iconHighlighted,d=new g(a.coordinate,{icon:f.test(h)?h:c.Bf+h,iconNormal:f.test(h)?h:c.Bf+h,iconHighlighted:f.test(e)?e:e?c.Bf+e:void 0,visibility:a.visibility,geometry:a}),d.addListener("load",function(){c.yv(d)});else{if(e.brush)k.brush={color:e.brush};d=new b(a.coordinate,k)}return d}},
getLineObject:function(a){if(!(a.coordinates.length<2)){var b=a.getStyle();return new e.map.Polyline(a.coordinates,{pen:{strokeColor:b.color,lineWidth:b.width},visibility:a.visibility})}},getPolygonObject:function(a){var b=a.getStyle(),c=a.getPathOuter();if(!(c.length<2))return new e.map.Polygon(c,{pen:{strokeColor:b.strokeColor,lineWidth:b.width},brush:{color:b.fillColor},visibility:a.visibility})}})})(nokia.maps);ovi.provide("nokia.maps.kml.Container");
(function(e){var k=e.DOM,h=e.Placemark;e.Container=new ovi.Class({Extends:e.Feature,initialize:function(d,c,e){this._super(d,c,e)},nj:function(){this.placemarks=[];this.documents=[];this.folders=[];this.features=[];this._super()},vj:function(d){return k.isValidNode(["Folder","Document","Placemark"],d.nodeName)},ij:function(d,c){var g=e.Document,b=e.Folder,f;switch(d.nodeName){case "Placemark":(f=new h(d,this.styleContainer,this.featureStyle))&&this.placemarks.push(f);break;case "Document":(f=new g(d,
this.styleContainer,this.featureStyle))&&this.documents.push(f);break;case "Folder":(f=new b(d,this.styleContainer,this.featureStyle))&&this.folders.push(f)}f&&this.features.push(f);f.index=c;return f}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Folder");(function(e){e.Folder=new ovi.Class({Extends:e.Container,initialize:function(e,h,d){this._super(e,h,d)}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Document");
(function(e){e.Document=new ovi.Class({Extends:e.Container,initialize:function(e,h,d){this._super(e,h,d)}})})(nokia.maps.kml);ovi.provide("nokia.maps.kml.Manager");
(function(e){var k=e.kml,h=k.StyleContainer,d=k.Style,c=k.StyleMap,g=k.Document,b=k.DOM,f=e.net.Request,q=k.Manager=new ovi.Class({Extends:e.util.OObject,initialize:function(){this.set("state",q.State.INITIAL);this.bv=new f(f.XHR);this.kmlDocument=null},Statics:{State:{INITIAL:"initial",STARTED:"started",LOADED:"loaded",FINISHED:"finished",FAILED:"failed"}},parse:function(a){var b=this,f,e,k;b.styles=new h;k=a.getElementsByTagName("Style");for(e=k.length;e--;)(f=new d(k[e]))&&f.id&&b.styles.push(f);
k=a.getElementsByTagName("StyleMap");for(e=k.length;e--;)(f=new c(k[e],b.styles))&&f.id&&b.styles.push(f);b.kmlDocument=new g(a,b.styles);b.kmlDocument.load(function(){b.set("state",q.State.FINISHED)});b.kmlDocument.Bf=b.Bf},parseKML:function(a){this.set("state",q.State.STARTED);typeof a=="undefined"?this.set("state",q.State.FAILED):(this.path=a,this.bv.send(a,ovi.bind(this,this.Cu)))},Cu:function(a){this.Bf=a.url;!a.error&&!a.timeout?(this.set("state",q.State.LOADED),a=b.parseFromString(a.response).documentElement,
this.parse(a)):this.set("state",q.State.FAILED)}})})(nokia.maps);ovi.provide("nokia.maps.kml._packaging.package-kml");})();
