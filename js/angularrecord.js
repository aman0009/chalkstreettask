!function(){"use strict";window.cancelAnimationFrame=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame,window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,angular.module("angularAudioRecorder",["angularAudioRecorder.config","angularAudioRecorder.services","angularAudioRecorder.controllers","angularAudioRecorder.directives"]),angular.module("angularAudioRecorder.config",[]).constant("recorderScriptUrl",function(){var e=document.getElementsByTagName("script"),t=e[e.length-1].getAttribute("src"),n=t.substr(0,t.lastIndexOf("/")+1),r=document.createElement("a");return r.href=n,r.href}()).constant("recorderPlaybackStatus",{STOPPED:0,PLAYING:1,PAUSED:2}),angular.module("angularAudioRecorder.directives",["angularAudioRecorder.config","angularAudioRecorder.services","angularAudioRecorder.controllers"]),angular.module("angularAudioRecorder.directives").directive("ngAudioRecorderAnalyzer",["recorderService","recorderUtils",function(e,t){var n=function(n,r,o,i){function a(e){if(!u){var t=r.find("canvas")[0];o.width&&!isNaN(o.width)&&(t.width=o.width),o.height&&!isNaN(o.height)&&(t.height=parseInt(o.height)),d=t.width,l=t.height,u=t.getContext("2d")}var n=3,i=1,c=Math.round(d/n),p=new Uint8Array(f.analyserNode.frequencyBinCount);f.analyserNode.getByteFrequencyData(p),u.clearRect(0,0,d,l),u.lineCap="round";for(var v=f.analyserNode.frequencyBinCount/c,g=0;g<c;++g){for(var m=0,h=Math.floor(g*v),w=0;w<v;w++)m+=p[h+w];m/=v;p[g*v];o.waveColor?u.fillStyle=o.waveColor:u.fillStyle="hsl( "+Math.round(360*g/c)+", 100%, 50%)",u.fillRect(g*n,l,i,-m)}s=window.requestAnimationFrame(a)}function c(){window.cancelAnimationFrame(s),s=null}if(!e.isHtml5)return void(n.hide=!0);var d,l,s,u,f=e.$html5AudioProps;r.on("$destroy",function(){c()}),i.onRecordStart=function(e){return function(){e.apply(),a()}}(i.onRecordStart),t.appendActionToCallback(i,"onRecordStart",a,"analyzer"),t.appendActionToCallback(i,"onRecordComplete",c,"analyzer")};return{restrict:"E",require:"^ngAudioRecorder",template:'<div ng-if="!hide" class="audioRecorder-analyzer"><canvas class="analyzer" width="1200" height="400" style="max-width: 100%;"></canvas></div>',link:n}}]),angular.module("angularAudioRecorder.directives").directive("ngAudioRecorderWaveView",["recorderService","recorderUtils","$log",function(e,t,n){return{restrict:"E",require:"^ngAudioRecorder",link:function(e,r,o,i){if(!window.WaveSurfer)return void n.warn("WaveSurfer was found.");var a;r.html('<div class="waveSurfer"></div>');var c=angular.extend({container:r.find("div")[0]},o),d=WaveSurfer.create(c);d.setVolume(0),t.appendActionToCallback(i,"onPlaybackStart|onPlaybackResume",function(){d.play()},"waveView"),t.appendActionToCallback(i,"onPlaybackComplete|onPlaybackPause",function(){d.pause()},"waveView"),t.appendActionToCallback(i,"onRecordComplete",function(){a||(a=i.getAudioPlayer(),a.addEventListener("seeking",function(e){var t=a.currentTime/a.duration;d.seekTo(t)}))},"waveView"),e.$watch(function(){return i.audioModel},function(e){e instanceof Blob&&d.loadBlob(e)})}}}]),angular.module("angularAudioRecorder.directives").directive("ngAudioRecorder",["recorderService","$timeout",function(e,t){return{restrict:"EA",scope:{audioModel:"=",id:"@",onRecordStart:"&",onRecordComplete:"&",onPlaybackComplete:"&",onPlaybackStart:"&",onPlaybackPause:"&",onPlaybackResume:"&",onConversionStart:"&",onConversionComplete:"&",showPlayer:"=?",autoStart:"=?",convertMp3:"=?",timeLimit:"=?"},controllerAs:"recorder",bindToController:!0,template:function(e,t){return'<div class="audioRecorder"><div style="width: 250px; margin: 0 auto;"><div id="audioRecorder-fwrecorder"></div></div>'+e.html()+"</div>"},controller:"recorderController",link:function(n,r,o){t(function(){if(e.isAvailable&&!e.isHtml5&&!e.isCordova){var t={allowscriptaccess:"always"},n={id:"recorder-app",name:"recorder-app"},r={save_text:""};swfobject.embedSWF(e.getSwfUrl(),"audioRecorder-fwrecorder","0","0","11.0.0","",r,t,n)}},100)}}}]),angular.module("angularAudioRecorder.controllers",["angularAudioRecorder.config","angularAudioRecorder.services"]);var e=function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&Object.defineProperty(t,n,{get:function(t){var n=t;return function(){return e[n]}}(n),enumerable:!0,configurable:!0});return t},t=function(e,t){var n=new FileReader;n.onload=function(e){t(e.target.result)},n.readAsDataURL(e)},n=function(n,r,o,i,a,c,d){var l=function(e){var t=i.$root.$$phase;if("$apply"!==t&&"$digest"!==t)return i.$apply(e)},s=this,u={recorder:null,url:null,player:null},f=null,p="recorded-audio-"+s.id,v={isRecording:!1,playback:d.STOPPED,isDenied:null,isSwfLoaded:null,isConverting:!1,get isPlaying(){return v.playback===d.PLAYING},get isStopped(){return v.playback===d.STOPPED},get isPaused(){return v.playback===d.PAUSED}},g=angular.isDefined(s.convertMp3)?!!s.convertMp3:r.shouldConvertToMp3(),m=g?new MP3Converter(r.getMp3Config()):null;s.timeLimit=s.timeLimit||0,s.status=e(v),s.isAvailable=r.isAvailable(),s.elapsedTime=0,s.id||(s.id=o.generateUuid(),n.attr("id",s.id)),r.isHtml5||r.isCordova||(v.isSwfLoaded=r.swfIsLoaded(),i.$watch(function(){return r.swfIsLoaded()},function(e){v.isSwfLoaded=e})),r.setController(s.id,this);var h=function(){v.playback=d.STOPPED,s.onPlaybackComplete(),l()},w=function(){v.playback=d.PAUSED,s.onPlaybackPause()},y=function(){v.playback=d.PLAYING,s.onPlaybackStart()},b=function(){v.playback=d.PLAYING,s.onPlaybackResume()},A=function(e){if(null==document.getElementById(p)){n.append('<audio type="audio/mp3" id="'+p+'"></audio>');var r=document.getElementById(p);s.showPlayer&&r.setAttribute("controls",""),r.addEventListener("ended",h),r.addEventListener("pause",function(e){this.duration!==this.currentTime&&(w(),l())}),r.addEventListener("playing",function(e){v.isPaused?b():y(),l()})}e?t(e,function(e){document.getElementById(p).src=e}):document.getElementById(p).removeAttribute("src")},R=function(e,t){m&&(v.isConverting=!0,m.convert(e,function(e){v.isConverting=!1,t&&t(e),l(s.onConversionComplete)},function(){v.isConverting=!1}),s.onConversionStart())};s.getAudioPlayer=function(){return r.isCordova?u.player:document.getElementById(p)},s.startRecord=function(){if(r.isAvailable()){v.isPlaying&&(s.playbackPause(),v.playback=d.STOPPED),s.audioModel=null;var e=s.id,t=r.getHandler(),n=function(){if(r.isCordova)u.url=o.cordovaAudioUrl(s.id),u.recorder=new Media(u.url,function(){console.log("Media successfully played")},function(e){console.log("Media could not be launched"+e.code,e)}),console.log("CordovaRecording"),u.recorder.startRecord();else if(r.isHtml5){if(!t)return;console.log("HTML5Recording"),t.clear(),t.record()}else{if(!r.isReady)return;console.log("FlashRecording"),t.record(e,"audio.wav")}v.isRecording=!0,s.onRecordStart(),s.elapsedTime=0,f=c(function(){++s.elapsedTime,s.timeLimit&&s.timeLimit>0&&s.elapsedTime>=s.timeLimit&&s.stopRecord()},1e3)};r.isCordova||t?n():v.isDenied||r.showPermission({onDenied:function(){v.isDenied=!0,i.$apply()},onAllowed:function(){v.isDenied=!1,t=r.getHandler(),n(),l()}})}},s.stopRecord=function(){var e=s.id;if(!r.isAvailable()||!v.isRecording)return!1;var t=r.getHandler(),n=function(e){c.cancel(f),v.isRecording=!1;var t=function(e){s.audioModel=e,A(e)};g?R(e,t):t(e),A(null),s.onRecordComplete()};r.isCordova?(u.recorder.stopRecord(),window.resolveLocalFileSystemURL(u.url,function(e){e.file(function(e){n(e)})},function(e){console.log("Could not retrieve file, error code:",e.code)})):r.isHtml5?(t.stop(),t.getBuffer(function(){t.exportWAV(function(e){n(e),l()})})):(t.stopRecording(e),n(t.getBlob(e)))},s.playbackRecording=function(){return!(v.isPlaying||!r.isAvailable()||v.isRecording||!s.audioModel)&&void(r.isCordova?(u.player=new Media(u.url,h,function(){console.log("Playback failed")}),u.player.play(),y()):s.getAudioPlayer().play())},s.playbackPause=function(){return!(!v.isPlaying||!r.isAvailable()||v.isRecording||!s.audioModel)&&(s.getAudioPlayer().pause(),void(r.isCordova&&w()))},s.playbackResume=function(){return!(v.isPlaying||!r.isAvailable()||v.isRecording||!s.audioModel)&&void(v.isPaused?(s.getAudioPlayer().play(),r.isCordova&&b()):s.playbackRecording())},s.save=function(e){if(!r.isAvailable()||v.isRecording||!s.audioModel)return!1;e||(e="audio_recording_"+s.id+(s.audioModel.type.indexOf("mp3")>-1?"mp3":"wav"));var t=window.URL.createObjectURL(s.audioModel),n=document.createElement("a");n.href=t,n.target="_blank",n.download=e;var o=document.createEvent("Event");o.initEvent("click",!0,!0),n.dispatchEvent(o)},s.isHtml5=function(){return r.isHtml5},s.autoStart&&a(function(){s.startRecord()},1e3),n.on("$destroy",function(){c.cancel(f)})};n.$inject=["$element","recorderService","recorderUtils","$scope","$timeout","$interval","recorderPlaybackStatus"],angular.module("angularAudioRecorder.controllers").controller("recorderController",n),angular.module("angularAudioRecorder.services",["angularAudioRecorder.config"]),angular.module("angularAudioRecorder.services").provider("recorderService",["recorderScriptUrl",function(e){var t,n,r=null,o={isHtml5:!1,isReady:!1},i={onDenied:null,onClosed:null,onAllow:null},a=!1,c=e+"../lib/recorder.swf",d=!1,l={bitRate:92,lameJsUrl:e+"../lib/lame.min.js"},s={isAvailable:!1,loaded:!1,configureMic:function(){FWRecorder.isReady&&(FWRecorder.configure(44,100,0,2e3),FWRecorder.setUseEchoSuppression(!1),FWRecorder.setLoopBack(!1))},allowed:!1,externalEvents:function(e){arguments[1];switch(arguments[0]){case"ready":parseInt(arguments[1]),parseInt(arguments[2]);FWRecorder.connect("recorder-app",0),FWRecorder.recorderOriginalWidth=1,FWRecorder.recorderOriginalHeight=1,s.loaded=!0;break;case"microphone_user_request":FWRecorder.showPermissionWindow({permanent:!0});break;case"microphone_connected":console.log("Permission to use MIC granted"),s.allowed=!0;break;case"microphone_not_connected":console.log("Permission to use MIC denied"),s.allowed=!1;break;case"permission_panel_closed":s.allowed?s.setAllowed():s.setDeclined(),FWRecorder.defaultSize(),angular.isFunction(i.onClosed)&&i.onClosed();break;case"recording":FWRecorder.hide();break;case"recording_stopped":FWRecorder.hide();break;case"playing":break;case"playback_started":arguments[2];break;case"save_pressed":FWRecorder.updateForm();break;case"saving":break;case"saved":var t=$.parseJSON(arguments[2]);t.saved;break;case"save_failed":arguments[2];break;case"save_progress":arguments[2],arguments[3];break;case"stopped":case"playing_paused":case"no_microphone_found":case"observing_level":case"microphone_level":case"microphone_activity":case"observing_level_stopped":}},isInstalled:function(){return swfobject.getFlashPlayerVersion().major>0},init:function(){return o.isHtml5=!1,s.isInstalled()?(s.isAvailable=!0,window.fwr_event_handler=s.externalEvents,void(window.configureMicrophone=s.configureMic)):void console.log("Flash is not installed, application cannot be initialized")},setAllowed:function(){o.isReady=!0,r=FWRecorder,angular.isFunction(i.onAllowed)&&i.onAllowed()},setDeclined:function(){o.isReady=!1,r=null,angular.isFunction(i.onDenied)&&i.onDenied()},getPermission:function(){s.isAvailable&&(FWRecorder.isMicrophoneAccessible()?(s.allowed=!0,setTimeout(function(){s.setAllowed()},100)):FWRecorder.showPermissionWindow({permanent:!0}))}},u={audioContext:null,inputPoint:null,audioInput:null,audioRecorder:null,analyserNode:null,audioElement:null},f={gotStream:function(e){var t=u.audioContext;if(n){u.audioElement=$(n).get(0),u.audioInput=t.createMediaElementSource(u.audioElement),u.audioInput.connect(u.inputPoint=t.createGain()),u.audioRecorder=new Recorder(u.audioInput,l);var a=u.audioRecorder.record,c=u.audioRecorder.stop;u.audioRecorder.record=function(){u.audioElement.play(),a()},u.audioRecorder.stop=function(){c(),u.audioElement.pause(),u.audioElement.currentTime=0}}else u.audioInput=t.createMediaStreamSource(e),u.audioInput.connect(u.inputPoint=t.createGain()),u.audioRecorder=new Recorder(u.audioInput,l);u.analyserNode=t.createAnalyser(),u.analyserNode.fftSize=2048,u.inputPoint.connect(u.analyserNode);var d=t.createGain();d.gain.value=n?.5:0,u.inputPoint.connect(d),d.connect(t.destination),o.isReady=!0,r=u.audioRecorder,angular.isFunction(i.onAllowed)&&("https:"==window.location.protocol&&localStorage.setItem("permission","given"),i.onAllowed())},failStream:function(e){angular.isDefined(i.onDenied)&&i.onDenied()},getPermission:function(){navigator.getUserMedia({audio:!0},f.gotStream,f.failStream)},init:function(){o.isHtml5=!0;var e=window.AudioContext||window.webkitAudioContext;e&&!u.audioContext&&(u.audioContext=new e),null!==localStorage.getItem("permission")&&f.getPermission()}};navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia,o.isCordova=!1;var p=function(){"cordova"in window?o.isCordova=!0:!a&&navigator.getUserMedia?f.init():s.init()},v={};o.controller=function(e){return v[e]},o.getSwfUrl=function(){return c},o.setController=function(e,t){v[e]=t},o.isAvailable=function(){if(o.isCordova){if(!("Media"in window))throw new Error('The Media plugin for cordova is required for this library, add plugin using "cordova plugin add cordova-plugin-media"');return!0}return o.isHtml5||s.isInstalled()},o.getHandler=function(){return r},o.showPermission=function(e){return o.isAvailable()?(e&&angular.extend(i,e),void(o.isHtml5?f.getPermission():s.getPermission())):void console.warn("Neither HTML5 nor SWF is supported.")},o.swfIsLoaded=function(){return s.loaded},o.shouldConvertToMp3=function(){return d},o.getMp3Config=function(){return l},o.$html5AudioProps=u;var g={$get:["recorderUtils",function(e){return t=e,p(),o}],forceSwf:function(e){return a=e,g},setSwfUrl:function(e){return c=e,g},withMp3Conversion:function(e,t){return d=!!e,l=angular.extend(l,t||{}),g},withResampling:function(e){l=angular.extend(l,{targetSampleRate:e})},withPrerecorded:function(e){n=e}};return g}]),angular.module("angularAudioRecorder.services").factory("recorderUtils",[function(){var e={generateUuid:function(){function e(e){var t=(Math.random().toString(16)+"000000000").substr(2,8);return e?"-"+t.substr(0,4)+"-"+t.substr(4,4):t}return e()+e(!0)+e(!0)+e()},cordovaAudioUrl:function(e){if(!window.cordova)return"record-audio"+e+".wav";var t=cordova.file.tempDirectory||cordova.file.externalApplicationStorageDirectory||cordova.file.sharedDirectory;switch(t+=Date.now()+"_recordedAudio_"+e.replace("/[^A-Za-z0-9_-]+/gi","-"),window.cordova.platformId){case"ios":t+=".wav";break;case"android":t+=".amr";break;case"wp":t+=".wma";break;default:t+=".mp3"}return t}};return e.appendActionToCallback=function(e,t,n,r){t.split(/\|/).forEach(function(t){if(!(angular.isObject(e)&&angular.isFunction(n)&&t in e&&angular.isFunction(e[t])))throw new Error("One or more parameter supplied is not valid");"$$appendTrackers"in e||(e.$$appendTrackers=[]);var o=t+"|"+r;return e.$$appendTrackers.indexOf(o)>-1?void console.log("Already appended: ",o):(e[t]=function(t){return function(){t.apply(e,arguments),n.apply(e,arguments)}}(e[t]),void e.$$appendTrackers.push(o))})},e}])}(),function(e){"use strict";function t(e,t,n){t=t||"",n=n||512;for(var r=atob(e),o=[],i=0;i<r.length;i+=n){for(var a=r.slice(i,i+n),c=new Array(a.length),d=0;d<a.length;d++)c[d]=a.charCodeAt(d);var l=new Uint8Array(c);o.push(l)}return new Blob(o,{type:t})}var n,r="audio/wav";n={recorder:null,recorderOriginalWidth:0,recorderOriginalHeight:0,uploadFormId:null,uploadFieldName:null,isReady:!1,connect:function(e,t){if(navigator.appName.indexOf("Microsoft")!=-1?n.recorder=window[e]:n.recorder=document[e],!(t>=40))if(n.recorder&&n.recorder.init){if(n.recorderOriginalWidth=n.recorder.width,n.recorderOriginalHeight=n.recorder.height,n.uploadFormId&&$){var r=$(n.uploadFormId);n.recorder.init(r.attr("action").toString(),n.uploadFieldName,r.serializeArray())}}else setTimeout(function(){n.connect(e,t+1)},100)},playBack:function(e){n.recorder.playBack(e)},pausePlayBack:function(e){n.recorder.pausePlayBack(e)},playBackFrom:function(e,t){n.recorder.playBackFrom(e,t)},record:function(e,t){n.recorder.record(e,t)},stopRecording:function(){n.recorder.stopRecording()},stopPlayBack:function(){n.recorder.stopPlayBack()},observeLevel:function(){n.recorder.observeLevel()},stopObservingLevel:function(){n.recorder.stopObservingLevel()},observeSamples:function(){n.recorder.observeSamples()},stopObservingSamples:function(){n.recorder.stopObservingSamples()},resize:function(e,t){n.recorder.width=e+"px",n.recorder.height=t+"px"},defaultSize:function(){n.resize(n.recorderOriginalWidth,n.recorderOriginalHeight)},show:function(){n.recorder.show()},hide:function(){n.recorder.hide()},duration:function(e){return n.recorder.duration(e||n.uploadFieldName)},getBase64:function(e){var t=n.recorder.getBase64(e);return"data:"+r+";base64,"+t},getBlob:function(e){var o=n.getBase64(e).split(",")[1];return t(o,r)},getCurrentTime:function(e){return n.recorder.getCurrentTime(e)},isMicrophoneAccessible:function(){return n.recorder.isMicrophoneAccessible()},updateForm:function(){var e=$(n.uploadFormId);n.recorder.update(e.serializeArray())},showPermissionWindow:function(e){n.resize(240,160);var t=function(){e&&e.permanent?n.recorder.permitPermanently():n.recorder.permit()};setTimeout(t,1)},configure:function(e,t,r,o){switch(e=parseInt(e||22),t=parseInt(t||100),r=parseInt(r||0),o=parseInt(o||4e3),e){case 44:case 22:case 11:case 8:case 5:break;default:throw"invalid rate "+e}if(t<0||t>100)throw"invalid gain "+t;if(r<0||r>100)throw"invalid silenceLevel "+r;if(o<-1)throw"invalid silenceTimeout "+o;n.recorder.configure(e,t,r,o)},setUseEchoSuppression:function(e){if("boolean"!=typeof e)throw"invalid value for setting echo suppression, val: "+e;n.recorder.setUseEchoSuppression(e)},setLoopBack:function(e){if("boolean"!=typeof e)throw"invalid value for setting loop back, val: "+e;n.recorder.setLoopBack(e)}},e.FWRecorder=n}(window),function(){"use strict";var e=function(e,t){if("function"!=typeof e)throw"The specified parameter must be a valid function";var n=e.toString();if(n.match(/\[native\s*code\]/i))throw"You cannot bind a native function to a worker";t=t||{},"object"!=typeof t&&console.warn("Params must be an object that is serializable with JSON.stringify, specified is: "+typeof t);var r=window.URL.createObjectURL(new Blob(["(",n,")(this,",JSON.stringify(t),")"],{type:"application/javascript"}));return r};Function.prototype.toWorker=function(t){var n=e(this,t);return new Worker(n)}}(),function(e){"use strict";var t=function(e){function t(e){f=e.sampleRate,u=e.targetSampleRate||f}function n(e){g.push(e[0]),v+=e[0].length}function r(t){function n(n,r){var o=s(n,r),i=new Blob([o],{type:t});e.postMessage(i)}var r=a(g,v);if(f===u)n(r,f);else{var o=p.createBuffer(1,v,f);o.copyToChannel(r,0),c(o,u,function(e){n(e.getChannelData(0),u)})}}function o(){var t=[];t.push(a(g,v)),t.push(a(m,v)),e.postMessage(t)}function i(){v=0,g=[],m=[]}function a(e,t){for(var n=new Float32Array(t),r=0,o=0;o<e.length;o++)n.set(e[o],r),r+=e[o].length;return n}function c(e,t,n){var r=e.numberOfChannels,o=e.length*t/e.sampleRate,i=new OfflineAudioContext(r,o,t),a=i.createBufferSource();a.buffer=e,i.oncomplete=function(e){var t=e.renderedBuffer;n(t)},console.log("Starting Offline Rendering"),a.connect(i.destination),a.start(0),i.startRendering()}function d(e,t,n){for(var r=0;r<n.length;r++,t+=2){var o=Math.max(-1,Math.min(1,n[r]));e.setInt16(t,o<0?32768*o:32767*o,!0)}}function l(e,t,n){for(var r=0;r<n.length;r++)e.setUint8(t+r,n.charCodeAt(r))}function s(e,t){var n=new ArrayBuffer(44+2*e.length),r=new DataView(n);return l(r,0,"RIFF"),r.setUint32(4,32+2*e.length,!0),l(r,8,"WAVE"),l(r,12,"fmt "),r.setUint32(16,16,!0),r.setUint16(20,1,!0),r.setUint16(22,1,!0),r.setUint32(24,t,!0),r.setUint32(28,2*t,!0),r.setUint16(32,2,!0),r.setUint16(34,16,!0),l(r,36,"data"),r.setUint32(40,2*e.length,!0),d(r,44,e),r}var u,f,p=new AudioContext,v=0,g=[],m=[];e.onmessage=function(e){switch(e.data.command){case"init":t(e.data.config);break;case"record":n(e.data.buffer);break;case"exportWAV":r(e.data.type);break;case"getBuffer":o();break;case"clear":i()}}},n=function(e,n,r){var o=n||{},i=o.bufferLen||16384;this.context=e.context,this.node=(this.context.createScriptProcessor||this.context.createJavaScriptNode).call(this.context,i,2,2);var a,c={postMessage:function(e){a.onmessage({data:angular.copy(e)})}};a=new t(c),a.postMessage=function(e){c.onmessage({data:angular.copy(e)})},a.postMessage({command:"init",config:{sampleRate:this.context.sampleRate,targetSampleRate:o.targetSampleRate,testData:r}});var d,l=!1;this.node.onaudioprocess=function(e){l&&a.postMessage({command:"record",buffer:[e.inputBuffer.getChannelData(0)]})},this.configure=function(e){for(var t in e)e.hasOwnProperty(t)&&(o[t]=e[t])},this.record=function(){l=!0},this.stop=function(){l=!1},this.clear=function(){a.postMessage({command:"clear"})},this.getBuffer=function(e){d=e||o.callback,a.postMessage({command:"getBuffer"})},this.exportWAV=function(e,t){if(d=e||o.callback,t=t||o.type||"audio/wav",!d)throw new Error("Callback not set");a.postMessage({command:"exportWAV",type:t})},a.onmessage=function(e){var t=e.data;d(t)},e.connect(this.node),this.node.connect(this.context.destination)};e.Recorder=n}(window),function(e){"use strict";var t=function(e,t){console.log("MP3 conversion worker started."),"undefined"==typeof lamejs&&importScripts(t.lameJsUrl);var n,r,o,i,a,c,d=1152,l=function(){c=[]},s=function(e){c.push(new Int8Array(e))},u=function(e){a=e||{},i=new lamejs,l()},f=function(e){r=i.WavHeader.readHeader(new DataView(e)),console.log("wave:",r),o=new Int16Array(e,r.dataOffset,r.dataLen/2),n=new i.Mp3Encoder(r.channels,r.sampleRate,a.bitRate||128);for(var t=o.length,c=0;t>=d;c+=d){var l=o.subarray(c,c+d),u=n.encodeBuffer(l);s(u),t-=d}},p=function(){var e=n.flush();s(e),self.postMessage({cmd:"end",buf:c}),console.log("done encoding"),l()};e.onmessage=function(e){switch(e.data.cmd){case"init":u(e.data.config);break;case"encode":f(e.data.rawInput);break;case"finish":p()}}},n=function(){var e=document.getElementsByTagName("script"),t=e[e.length-1].getAttribute("src"),n=t.substr(0,t.lastIndexOf("/")+1);if(n&&!n.match(/:\/\//)){var r=document.createElement("a");return r.href=n,r.href}return n}(),r=function(e){e=e||{},e.lameJsUrl=e.lameJsUrl||n+"/lame.min.js";var r=!1,o=t.toWorker(e);this.isBusy=function(){return r},this.convert=function(t){var n="conversion_"+Date.now(),i=n+":";console.log(i,"Starting conversion");var a,c,d=e?{bitRate:e.bitRate}:{};switch(typeof arguments[1]){case"object":d=arguments[1];break;case"function":a=arguments[1];break;default:throw"parameter 2 is expected to be an object (config) or function (success callback)"}if("function"==typeof arguments[2]&&(a?c=arguments[2]:a=arguments[2]),"function"!=typeof arguments[3]||c||(c=arguments[3]),r)throw"Another conversion is in progress";var l=t.size,s=new FileReader,u=Date.now();s.onload=function(e){console.log(i,"Passed to BG process"),o.postMessage({cmd:"init",config:d}),o.postMessage({cmd:"encode",rawInput:e.target.result}),o.postMessage({cmd:"finish"}),o.onmessage=function(e){if("end"==e.data.cmd){console.log(i,"Done converting to Mp3");var t=new Blob(e.data.buf,{type:"audio/mp3"});console.log(i,"Conversion completed in: "+(Date.now()-u)/1e3+"s");var n=t.size;console.log(i+"Initial size: = "+l+", Final size = "+n+", Reduction: "+Number(100*(l-n)/l).toPrecision(4)+"%"),r=!1,a&&"function"==typeof a&&a(t)}}},r=!0,s.readAsArrayBuffer(t)}};e.MP3Converter=r}(window),function(e){"use strict";e.swfobject=function(){function e(){"complete"==b.readyState&&(b.parentNode.removeChild(b),t())}function t(){if(!U){if($.ie&&$.win){var e=v("span");try{var t=E.getElementsByTagName("body")[0].appendChild(e);t.parentNode.removeChild(t)}catch(n){return}}U=!0,N&&(clearInterval(N),N=null);for(var r=F.length,o=0;o<r;o++)F[o]()}}function n(e){U?e():F[F.length]=e}function r(e){if(typeof M.addEventListener!=A)M.addEventListener("load",e,!1);else if(typeof E.addEventListener!=A)E.addEventListener("load",e,!1);else if(typeof M.attachEvent!=A)g(M,"onload",e);else if("function"==typeof M.onload){var t=M.onload;M.onload=function(){t(),e()}}else M.onload=e}function o(){for(var e=L.length,t=0;t<e;t++){var n=L[t].id;if($.pv[0]>0){var r=p(n);r&&(L[t].width=r.getAttribute("width")?r.getAttribute("width"):"0",L[t].height=r.getAttribute("height")?r.getAttribute("height"):"0",m(L[t].swfVersion)?($.webkit&&$.webkit<312&&i(r),w(n,!0)):L[t].expressInstall&&!j&&m("6.0.65")&&($.win||$.mac)?a(L[t]):c(r))}else w(n,!0)}}function i(e){var t=e.getElementsByTagName(R)[0];if(t){var n=v("embed"),r=t.attributes;if(r)for(var o=r.length,i=0;i<o;i++)"DATA"==r[i].nodeName?n.setAttribute("src",r[i].nodeValue):n.setAttribute(r[i].nodeName,r[i].nodeValue);var a=t.childNodes;if(a)for(var c=a.length,d=0;d<c;d++)1==a[d].nodeType&&"PARAM"==a[d].nodeName&&n.setAttribute(a[d].getAttribute("name"),a[d].getAttribute("value"));e.parentNode.replaceChild(n,e)}}function a(e){j=!0;var t=p(e.id);if(t){if(e.altContentId){var n=p(e.altContentId);n&&(T=n,x=e.altContentId)}else T=d(t);!/%$/.test(e.width)&&parseInt(e.width,10)<310&&(e.width="310"),!/%$/.test(e.height)&&parseInt(e.height,10)<137&&(e.height="137"),E.title=E.title.slice(0,47)+" - Flash Player Installation";var r=$.ie&&$.win?"ActiveX":"PlugIn",o=E.title,i="MMredirectURL="+M.location+"&MMplayerType="+r+"&MMdoctitle="+o,a=e.id;if($.ie&&$.win&&4!=t.readyState){var c=v("div");a+="SWFObjectNew",c.setAttribute("id",a),t.parentNode.insertBefore(c,t),t.style.display="none";var s=function(){t.parentNode.removeChild(t)};g(M,"onload",s)}l({data:e.expressInstall,id:P,width:e.width,height:e.height},{flashvars:i},a)}}function c(e){if($.ie&&$.win&&4!=e.readyState){var t=v("div");e.parentNode.insertBefore(t,e),t.parentNode.replaceChild(d(e),t),e.style.display="none";var n=function(){e.parentNode.removeChild(e)};g(M,"onload",n)}else e.parentNode.replaceChild(d(e),e)}function d(e){var t=v("div");if($.win&&$.ie)t.innerHTML=e.innerHTML;else{var n=e.getElementsByTagName(R)[0];if(n){var r=n.childNodes;if(r)for(var o=r.length,i=0;i<o;i++)1==r[i].nodeType&&"PARAM"==r[i].nodeName||8==r[i].nodeType||t.appendChild(r[i].cloneNode(!0))}}return t}function l(e,t,n){var r,o=p(n);if(o)if(typeof e.id==A&&(e.id=n),$.ie&&$.win){var i="";for(var a in e)e[a]!=Object.prototype[a]&&("data"==a.toLowerCase()?t.movie=e[a]:"styleclass"==a.toLowerCase()?i+=' class="'+e[a]+'"':"classid"!=a.toLowerCase()&&(i+=" "+a+'="'+e[a]+'"'));var c="";for(var d in t)t[d]!=Object.prototype[d]&&(c+='<param name="'+d+'" value="'+t[d]+'" />');o.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+i+">"+c+"</object>",B[B.length]=e.id,r=p(e.id)}else if($.webkit&&$.webkit<312){var l=v("embed");l.setAttribute("type",S);for(var u in e)e[u]!=Object.prototype[u]&&("data"==u.toLowerCase()?l.setAttribute("src",e[u]):"styleclass"==u.toLowerCase()?l.setAttribute("class",e[u]):"classid"!=u.toLowerCase()&&l.setAttribute(u,e[u]));for(var f in t)t[f]!=Object.prototype[f]&&"movie"!=f.toLowerCase()&&l.setAttribute(f,t[f]);o.parentNode.replaceChild(l,o),r=l}else{var g=v(R);g.setAttribute("type",S);for(var m in e)e[m]!=Object.prototype[m]&&("styleclass"==m.toLowerCase()?g.setAttribute("class",e[m]):"classid"!=m.toLowerCase()&&g.setAttribute(m,e[m]));for(var h in t)t[h]!=Object.prototype[h]&&"movie"!=h.toLowerCase()&&s(g,h,t[h]);o.parentNode.replaceChild(g,o),r=g}return r}function s(e,t,n){var r=v("param");r.setAttribute("name",t),r.setAttribute("value",n),e.appendChild(r)}function u(e){var t=p(e);!t||"OBJECT"!=t.nodeName&&"EMBED"!=t.nodeName||($.ie&&$.win?4==t.readyState?f(e):M.attachEvent("onload",function(){f(e)}):t.parentNode.removeChild(t))}function f(e){var t=p(e);if(t){for(var n in t)"function"==typeof t[n]&&(t[n]=null);t.parentNode.removeChild(t)}}function p(e){var t=null;try{t=E.getElementById(e)}catch(n){}return t}function v(e){return E.createElement(e)}function g(e,t,n){e.attachEvent(t,n),O[O.length]=[e,t,n]}function m(e){var t=$.pv,n=e.split(".");return n[0]=parseInt(n[0],10),n[1]=parseInt(n[1],10)||0,n[2]=parseInt(n[2],10)||0,t[0]>n[0]||t[0]==n[0]&&t[1]>n[1]||t[0]==n[0]&&t[1]==n[1]&&t[2]>=n[2]}function h(e,t){if(!$.ie||!$.mac){var n=E.getElementsByTagName("head")[0],r=v("style");if(r.setAttribute("type","text/css"),r.setAttribute("media","screen"),$.ie&&$.win||typeof E.createTextNode==A||r.appendChild(E.createTextNode(e+" {"+t+"}")),n.appendChild(r),$.ie&&$.win&&typeof E.styleSheets!=A&&E.styleSheets.length>0){var o=E.styleSheets[E.styleSheets.length-1];typeof o.addRule==R&&o.addRule(e,t)}}}function w(e,t){var n=t?"visible":"hidden";U&&p(e)?p(e).style.visibility=n:h("#"+e,"visibility:"+n)}function y(e){var t=/[\\\"<>\.;]/,n=null!=t.exec(e);return n?encodeURIComponent(e):e}var b,A="undefined",R="object",C="Shockwave Flash",k="ShockwaveFlash.ShockwaveFlash",S="application/x-shockwave-flash",P="SWFObjectExprInst",M=window,E=document,I=navigator,F=[],L=[],B=[],O=[],N=null,T=null,x=null,U=!1,j=!1,$=function(){var e=typeof E.getElementById!=A&&typeof E.getElementsByTagName!=A&&typeof E.createElement!=A,t=[0,0,0],n=null;if(typeof I.plugins!=A&&typeof I.plugins[C]==R)n=I.plugins[C].description,!n||typeof I.mimeTypes!=A&&I.mimeTypes[S]&&!I.mimeTypes[S].enabledPlugin||(n=n.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),t[0]=parseInt(n.replace(/^(.*)\..*$/,"$1"),10),t[1]=parseInt(n.replace(/^.*\.(.*)\s.*$/,"$1"),10),t[2]=/r/.test(n)?parseInt(n.replace(/^.*r(.*)$/,"$1"),10):0);else if(typeof M.ActiveXObject!=A){var r=null,o=!1;try{r=new ActiveXObject(k+".7")}catch(i){try{r=new ActiveXObject(k+".6"),t=[6,0,21],r.AllowScriptAccess="always"}catch(i){6==t[0]&&(o=!0)}if(!o)try{r=new ActiveXObject(k)}catch(i){}}if(!o&&r)try{n=r.GetVariable("$version"),n&&(n=n.split(" ")[1].split(","),t=[parseInt(n[0],10),parseInt(n[1],10),parseInt(n[2],10)])}catch(i){}}var a=I.userAgent.toLowerCase(),c=I.platform.toLowerCase(),d=!!/webkit/.test(a)&&parseFloat(a.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")),l=!1,s=c?/win/.test(c):/win/.test(a),u=c?/mac/.test(c):/mac/.test(a);return{w3cdom:e,pv:t,webkit:d,ie:l,win:s,mac:u}}();(function(){if($.w3cdom){if(n(o),$.ie&&$.win)try{E.write("<script id=__ie_ondomload defer=true src=//:></script>"),b=p("__ie_ondomload"),b&&g(b,"onreadystatechange",e)}catch(i){}$.webkit&&typeof E.readyState!=A&&(N=setInterval(function(){/loaded|complete/.test(E.readyState)&&t()},10)),typeof E.addEventListener!=A&&E.addEventListener("DOMContentLoaded",t,null),r(t)}})(),function(){$.ie&&$.win&&window.attachEvent("onunload",function(){for(var e=O.length,t=0;t<e;t++)O[t][0].detachEvent(O[t][1],O[t][2]);for(var n=B.length,r=0;r<n;r++)u(B[r]);for(var o in $)$[o]=null;$=null;for(var i in swfobject)swfobject[i]=null;swfobject=null})}();return{registerObject:function(e,t,n){if($.w3cdom&&e&&t){var r={};r.id=e,r.swfVersion=t,r.expressInstall=!!n&&n,L[L.length]=r,w(e,!1)}},getObjectById:function(e){var t=null;if($.w3cdom){var n=p(e);if(n){var r=n.getElementsByTagName(R)[0];!r||r&&typeof n.SetVariable!=A?t=n:typeof r.SetVariable!=A&&(t=r)}}return t},embedSWF:function(e,t,r,o,i,c,d,s,u){if($.w3cdom&&e&&t&&r&&o&&i)if(r+="",o+="",m(i)){w(t,!1);var f={};if(u&&typeof u===R)for(var p in u)u[p]!=Object.prototype[p]&&(f[p]=u[p]);f.data=e,f.width=r,f.height=o;var v={};if(s&&typeof s===R)for(var g in s)s[g]!=Object.prototype[g]&&(v[g]=s[g]);if(d&&typeof d===R)for(var h in d)d[h]!=Object.prototype[h]&&(typeof v.flashvars!=A?v.flashvars+="&"+h+"="+d[h]:v.flashvars=h+"="+d[h]);n(function(){l(f,v,t),f.id==t&&w(t,!0)})}else c&&!j&&m("6.0.65")&&($.win||$.mac)&&(j=!0,w(t,!1),n(function(){var e={};e.id=e.altContentId=t,e.width=r,e.height=o,e.expressInstall=c,a(e)}))},getFlashPlayerVersion:function(){return{major:$.pv[0],minor:$.pv[1],release:$.pv[2]}},hasFlashPlayerVersion:m,createSWF:function(e,t,n){return $.w3cdom?l(e,t,n):void 0},removeSWF:function(e){$.w3cdom&&u(e)},createCSS:function(e,t){$.w3cdom&&h(e,t)},addDomLoadEvent:n,addLoadEvent:r,
getQueryParamValue:function(e){var t=E.location.search||E.location.hash;if(null==e)return y(t);if(t)for(var n=t.substring(1).split("&"),r=0;r<n.length;r++)if(n[r].substring(0,n[r].indexOf("="))==e)return y(n[r].substring(n[r].indexOf("=")+1));return""},expressInstallCallback:function(){if(j&&T){var e=p(P);e&&(e.parentNode.replaceChild(T,e),x&&(w(x,!0),$.ie&&$.win&&(T.style.display="block")),T=null,x=null,j=!1)}}}}()}(window);