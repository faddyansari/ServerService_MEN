!function(e){var t={};function o(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="https://app.beelinks.solutions/cbam/js/",o(o.s=28)}({28:function(e,t,o){"use strict";o.r(t),o.d(t,"popupFrameListener",function(){return s});var n=function(e,t,o,n){return new(o||(o=Promise))(function(i,s){function a(e){try{r(n.next(e))}catch(e){s(e)}}function d(e){try{r(n.throw(e))}catch(e){s(e)}}function r(e){e.done?i(e.value):new o(function(t){t(e.value)}).then(a,d)}r((n=n.apply(e,t||[])).next())})},i=function(e,t){var o,n,i,s,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return s={next:d(0),throw:d(1),return:d(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function d(s){return function(d){return function(s){if(o)throw new TypeError("Generator is already executing.");for(;a;)try{if(o=1,n&&(i=2&s[0]?n.return:s[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,s[1])).done)return i;switch(n=0,i&&(s=[2&s[0],i.value]),s[0]){case 0:case 1:i=s;break;case 4:return a.label++,{value:s[1],done:!1};case 5:a.label++,n=s[1],s=[0];continue;case 7:s=a.ops.pop(),a.trys.pop();continue;default:if(!(i=(i=a.trys).length>0&&i[i.length-1])&&(6===s[0]||2===s[0])){a=0;continue}if(3===s[0]&&(!i||s[1]>i[0]&&s[1]<i[3])){a.label=s[1];break}if(6===s[0]&&a.label<i[1]){a.label=i[1],i=s;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(s);break}i[2]&&a.ops.pop(),a.trys.pop();continue}s=t.call(e,a)}catch(e){s=[6,e],n=0}finally{o=i=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,d])}}},s=function(){function e(){this.Load()}return e.CreateInstance=function(){return e.popupFrameListener?e.popupFrameListener:new e},e.prototype.Load=function(){var e=this;window.addEventListener("DOMContentLoaded",function(t){e.BindMessageEvents(t)},!1)},e.prototype.BindMessageEvents=function(e){var t=this;window.addEventListener("message",function(e){t.MessageEvent(e)},!1)},e.prototype.NegotiateLoad=function(e){var t=this;try{var o="Popup Blocked. Please Follow the Link : 'https://support.google.com/chrome/answer/95472?co=GENIE.Platform%3DDesktop&hl=en' to Enable Popup Window";if(this.windowNegotiate=window.open(e+"/cw/chat-window.html","Negotiate","height=600,width=400,menubar=0,location=0,titlebar=0,toolbar=0,directories=0,fullscreen=0,resizable=0,alwaysOnTop=yes,scrollbars=0,top=0,right=0"),void 0===this.windowNegotiate)window.alert(o),window.parent.postMessage({msg:"popUpBlocked"},"*");else if(!this.windowNegotiate||this.windowNegotiate.closed||void 0===this.windowNegotiate.closed||0==this.windowNegotiate.outerHeight||0==this.windowNegotiate.outerWidth)window.alert("Popup Window is in its closing state.Please try after few moments"),window.parent.postMessage({msg:"popUpBlocked"},"*");else try{this.windowNegotiate.focus()}catch(e){window.alert(o),window.parent.postMessage({msg:"popUpBlocked"},"*")}this.windowNegotiate&&this.windowNegotiate.addEventListener("beforeunload",function(e){setTimeout(function(){t.windowNegotiate.closed||t.windowNegotiate.opener.postMessage({msg:"NegotiateIsLoaded"},"*")},3e3),t.NegotiateCloseEvent()})}catch(e){window.alert("Error in loading Negotiate Window")}},e.prototype.HelpWindowLoad=function(e){var t=this;try{if(this.HelpWindow=window.open(e+"/cw/chat-window.html","Help & Support","height=600,width=400,top=no,right=no,location=no,locationbar=no"),void 0===this.HelpWindow)window.parent.postMessage({msg:"popUpBlocked"},"*");else if(!this.HelpWindow||this.HelpWindow.closed||void 0===this.HelpWindow.closed||0==this.HelpWindow.outerHeight||0==this.HelpWindow.outerWidth)window.parent.postMessage({msg:"popUpBlocked"},"*");else try{this.HelpWindow.focus()}catch(e){window.parent.postMessage({msg:"popUpBlocked"},"*")}this.HelpWindow&&this.HelpWindow.addEventListener("beforeunload",function(e){t.HelpWindow.focus(),setTimeout(function(){t.HelpWindow.closed||t.HelpWindow.opener.postMessage({msg:"FrameReadyToShowLoader"},"*")},3e3),t.HelpCloseEvent()}),this.HelpWindow&&(this.HelpWindow.onfocus=function(){t.SetNotifCount(0),t.HelpWindow.document.title=t.HelpWindow.document.title.substring(t.HelpWindow.document.title.indexOf(")",0)+1),window.parent.postMessage({msg:"HideNotification"},"*")})}catch(e){window.alert("Error in loading Negotiate Window")}},e.prototype.NegotiateCloseOnEndChat=function(){this.windowNegotiate&&this.windowNegotiate.close(),this.NegotiateCloseEvent()},e.prototype.NegotiateCloseEvent=function(){window.parent.postMessage({msg:"negotiateClose"},"*")},e.prototype.HelpCloseEvent=function(){window.parent.postMessage({msg:"helpClose"},"*")},e.prototype.FocusNegotiate=function(){this.windowNegotiate&&this.windowNegotiate.focus()},e.prototype.SetNotifCount=function(e){localStorage.setItem("__helpNotifCount",e)},e.prototype.GetNotifCount=function(){return localStorage.getItem("__helpNotifCount")||""},e.prototype.MessageEvent=function(e){return n(this,void 0,void 0,function(){var t,o,n,s=this;return i(this,function(i){switch(e.data.msg){case"giveSession":window.parent.postMessage({msg:"giveSession"},"*");break;case"negotiateClose":window.parent.postMessage({msg:"negotiateClose"},"*");break;case"NegotiateIsLoaded":window.parent.postMessage({msg:"NegotiateIsLoaded"},"*");break;case"NegotiateReady":this.windowNegotiate&&this.windowNegotiate.location&&-1==this.windowNegotiate.location.href.indexOf("blank")&&(this.windowNegotiate.postMessage({msg:"load",payload:e.data.payload},this.windowNegotiate.location.href),this.windowNegotiate.focus());break;case"helpLoadingInitiated":window.parent.postMessage({msg:"helpLoadingInitiated"},"*");break;case"FrameReadyToShowLoader":this.HelpWindow&&this.HelpWindow.location&&-1==this.HelpWindow.location.href.indexOf("blank")&&this.HelpWindow.postMessage({msg:"showLoadingScreen",helpWindow:!0},this.HelpWindow.location.href);break;case"FrameReadyToLoad":window.parent.postMessage({msg:"FrameReadyToLoad"},"*");break;case"HelpWindowReady":this.HelpWindow&&this.HelpWindow.location&&-1==this.HelpWindow.location.href.indexOf("blank")&&this.HelpWindow.postMessage({msg:"load",payload:e.data.payload},this.HelpWindow.location.href);break;case"allHelpSupportWindowsClose":this.HelpWindow&&this.HelpWindow.close();break;case"gotSession":this.NegotiateLoad(e.data.cdnAddress),this.windowNegotiate.onload=function(e){s.windowNegotiate.opener.postMessage({msg:"NegotiateIsLoaded"},"*"),s.windowNegotiate.focus()};break;case"getHelpSession":this.HelpWindowLoad(e.data.cdnAddress),this.HelpWindow&&(this.HelpWindow.onload=function(e){s.HelpWindow.opener.postMessage({msg:"FrameReadyToShowLoader"},"*"),s.HelpWindow.focus()});break;case"HelpIsLoaded":window.parent.postMessage({msg:"HelpIsLoaded"},"*");break;case"HelpFrameReady":this.HelpWindow&&this.HelpWindow.location&&-1==this.HelpWindow.location.href.indexOf("blank")&&this.HelpWindow.postMessage({msg:"FrameReadyToGo"},this.HelpWindow.location.href);break;case"NegotiatePopUpClose":this.NegotiateCloseOnEndChat();break;case"focusNegotiate":this.FocusNegotiate();break;case"SupportNotifications":this.HelpWindow&&(t=this.HelpWindow.document.title,o=this.GetNotifCount(),(o=parseInt(o))||(o=0),this.HelpWindow.document.title?this.HelpWindow.document.hasFocus()||(o+=1,this.SetNotifCount(o),"("==t[0]?this.HelpWindow.document.title="(You Have "+o+" Unread Message)"+t.substring(t.indexOf(")",0)+1):this.HelpWindow.document.title="(You Have "+o+" Unread Messages)"+this.HelpWindow.document.title,window.parent.postMessage({msg:"MessageNotification",payload:o},"*")):"("==t[0]&&(this.HelpWindow.document.title=t.substring(t.indexOf(")",0)+1)),(n=this.HelpWindow.document.getElementById("cd-notification"))&&(n.style.display="none"))}return[2]})})},e}().CreateInstance();window.popupFrameListener=s}});