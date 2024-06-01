!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.UtauWav=e():t.UtauWav=e()}(self,(()=>(()=>{"use strict";var t={95:function(t,e,a){var i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const h=i(a(230)),s=i(a(876));e.default=class{constructor(t){var e,a,i;if(this.header=new h.default(t),t.byteLength<=this.header.dataIndex)return console.warn("このwavはヘッダ部分しかありません。"),this.data_=null,void(this.rData_=null);if(t.slice(this.header.dataIndex).byteLength%this.blockSize!=0)return console.warn("このwavのデータ部分に欠損があるため読み込まれませんでした。"),this.data_=null,void(this.rData_=null);const s=t.slice(this.header.dataIndex).byteLength/this.blockSize,r=new DataView(t.slice(this.header.dataIndex));this.data_=new Array,2===this.channels?this.rData_=new Array:this.rData_=null;for(let t=0;t<s;t++)8===this.bitDepth?(this.data_.push(r.getInt8(t*this.blockSize)),2===this.channels&&(null===(e=this.rData_)||void 0===e||e.push(r.getInt8(t*this.blockSize+1)))):16===this.bitDepth?(this.data_.push(r.getInt16(t*this.blockSize,!0)),2===this.channels&&(null===(a=this.rData_)||void 0===a||a.push(r.getInt16(t*this.blockSize+2,!0)))):24===this.bitDepth&&(this.data_.push(this.GetInt24(r,t*this.blockSize)),2===this.channels&&(null===(i=this.rData_)||void 0===i||i.push(this.GetInt24(r,t*this.blockSize+3))))}Output(){const t=new ArrayBuffer(this.header.dataChunkSize),e=new DataView(t),a=this.header.dataChunkSize/this.blockSize;for(let t=0;t<a;t++)null===this.data||(8===this.bitDepth?(e.setInt8(t*this.blockSize,this.data[t]),2===this.channels&&null!==this.rData&&e.setInt8(t*this.blockSize+1,this.rData[t])):16===this.bitDepth?(e.setInt16(t*this.blockSize,this.data[t],!0),2===this.channels&&null!==this.rData&&e.setInt16(t*this.blockSize+2,this.rData[t],!0)):24===this.bitDepth&&(this.SetInt24(e,t*this.blockSize,this.data[t]),2===this.channels&&null!==this.rData&&this.SetInt24(e,t*this.blockSize+3,this.rData[t])));const i=this.header.Output(),h=new Uint8Array(i.byteLength+t.byteLength);return h.set(new Uint8Array(i),0),h.set(new Uint8Array(t),44),h.buffer}GetInt24(t,e){let a=t.getUint16(e,!0)+65536*t.getUint8(e+2);return a>=2**23&&(a-=2**24),a}SetInt24(t,e,a){a<0&&(a+=2**24),t.setUint16(e,65535&a,!0),t.setUint8(e+2,16711680&a)}RemoveDCOffset(){const t=new s.default;null!==this.data&&(this.data_=t.RemoveDCOffset(this.data)),null!==this.rData&&(this.rData_=t.RemoveDCOffset(this.rData))}VolumeNormalize(){const t=new s.default;null!==this.data&&(this.data_=t.VolumeNormalize(this.data,this.bitDepth)),null!==this.rData&&(this.rData_=t.VolumeNormalize(this.rData,this.bitDepth))}LogicalNormalize(t){const e=new s.default;return null===this.data||1!==this.channels&&1!==t?null!==this.rData&&2===t?e.LogicalNormalize(this.rData,this.bitDepth):null:e.LogicalNormalize(this.data,this.bitDepth)}InverseLogicalNormalize(t,e){const a=new s.default;1===this.channels||1===e?this.data_=a.InverseLogicalNormalize(t,this.bitDepth):2===e&&(this.rData_=a.InverseLogicalNormalize(t,this.bitDepth))}get chunksize(){return this.header.chunksize}get channels(){return this.header.channels}set channels(t){this.channels!==t&&(1===t?(this.header.channels=t,this.rData_=null,this.header.blockSize=t*this.bitDepth/8,this.header.bytePerSec=this.blockSize*this.sampleRate):2===t&&null!==this.data_&&(this.header.channels=t,this.rData_=[...this.data_],this.header.blockSize=t*this.bitDepth/8,this.header.bytePerSec=this.blockSize*this.sampleRate))}get sampleRate(){return this.header.sampleRate}set sampleRate(t){if(null!==this.data){const e=this.data.length/this.sampleRate,a=1/this.sampleRate,i=1/t,h=e*t,s=new Array;let r=null;2===this.channels&&(r=new Array);for(let t=0;t<h;t++){const e=i*t/a;if(e===Math.floor(e))s.push(this.data[e]),null!==r&&null!==this.rData&&r.push(this.rData[e]);else{const t=e-Math.floor(e);s.push(this.data[Math.floor(e)]+Math.round((this.data[Math.ceil(e)]-this.data[Math.floor(e)])*t)),null!==r&&null!==this.rData&&r.push(this.rData[Math.floor(e)]+Math.round((this.rData[Math.ceil(e)]-this.rData[Math.floor(e)])*t))}}this.data_=s,this.rData_=r,this.header.sampleRate=t,this.header.bytePerSec=this.blockSize*this.sampleRate;const n=this.blockSize*h;this.header.chunksize=this.header.chunksize-this.header.dataChunkSize+n,this.header.dataChunkSize=this.blockSize*h}}get bytePerSec(){return this.header.bytePerSec}get blockSize(){return this.header.blockSize}get bitDepth(){return this.header.bitDepth}set bitDepth(t){var e,a;if(t%8!=0||t>32)return;const i=new Array;if(null===(e=this.data_)||void 0===e||e.forEach((e=>{i.push(e/2**this.bitDepth*2**t)})),this.data_=i,null!==this.rData){const e=new Array;null===(a=this.rData_)||void 0===a||a.forEach((a=>{e.push(a/2**(this.bitDepth-1)*2**(t-1))})),this.rData_=e}this.header.bitDepth=t,this.header.blockSize=this.channels*this.bitDepth/8,this.header.bytePerSec=this.blockSize*this.sampleRate}get data(){return this.data_}get rData(){return this.rData_}}},230:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.default=class{constructor(t){const e=new TextDecoder,a=new DataView(t);let i=12,h=36;if(t.byteLength<44)throw new RangeError("waveヘッダに欠損があるか、waveファイルではありません。");if("RIFF"!==e.decode(t.slice(0,4)))throw new Error("このデータはwaveファイルではありません。RIFF識別子がありません。");if(this.chunksize_=a.getUint32(4,!0),"WAVE"!==e.decode(t.slice(8,12)))throw new Error("このデータはwaveファイルではありません。WAVE識別子がありません。");for(;"fmt "!==e.decode(t.slice(i,i+4));)if(i++,i+4>t.byteLength)throw new Error("このデータはwaveファイルではありません。fmt 識別子がありません。");if(i+32>t.byteLength)throw new RangeError("waveヘッダに欠損があります。");if(this.fmtChunkSize_=a.getUint32(i+4,!0),this.format_=a.getUint16(i+8,!0),3===this.format_)throw new Error("このwavファイルは32bit floatで記録されており、読み込みできません。");if(6===this.format_)throw new Error("このwavファイルはA-lawコーデックで圧縮されており、読み込みできません。");if(7===this.format_)throw new Error("このwavファイルはu-lawコーデックで圧縮されており、読み込みできません。");if(1!==this.format_)throw new Error("このwavファイルは未知のコーデックで圧縮されており、読み込みできません。");for(this.channels_=a.getUint16(i+10,!0),this.sampleRate_=a.getUint32(i+12,!0),this.bytePerSec_=a.getUint32(i+16,!0),this.blockSize_=a.getUint16(i+20,!0),this.bitDepth_=a.getUint16(i+22,!0);"data"!==e.decode(t.slice(h,h+4));)if(h++,h+4>t.byteLength)throw new Error("このデータはwaveファイルではありません。data識別子がありません。");if(h+8>t.byteLength)throw new RangeError("waveヘッダに欠損があります。");this.dataChunkSize_=a.getUint32(h+4,!0),this.dataIndex_=h+8}Output(){const t=new ArrayBuffer(44),e=new DataView(t);return e.setUint8(0,"R".charCodeAt(0)),e.setUint8(1,"I".charCodeAt(0)),e.setUint8(2,"F".charCodeAt(0)),e.setUint8(3,"F".charCodeAt(0)),e.setUint32(4,this.chunksize,!0),e.setUint8(8,"W".charCodeAt(0)),e.setUint8(9,"A".charCodeAt(0)),e.setUint8(10,"V".charCodeAt(0)),e.setUint8(11,"E".charCodeAt(0)),e.setUint8(12,"f".charCodeAt(0)),e.setUint8(13,"m".charCodeAt(0)),e.setUint8(14,"t".charCodeAt(0)),e.setUint8(15," ".charCodeAt(0)),e.setUint32(16,this.fmtChunkSize,!0),e.setUint16(20,this.format,!0),e.setUint16(22,this.channels,!0),e.setUint32(24,this.sampleRate,!0),e.setUint32(28,this.bytePerSec,!0),e.setUint16(32,this.blockSize,!0),e.setUint16(34,this.bitDepth,!0),e.setUint8(36,"d".charCodeAt(0)),e.setUint8(37,"a".charCodeAt(0)),e.setUint8(38,"t".charCodeAt(0)),e.setUint8(39,"a".charCodeAt(0)),e.setUint32(40,this.dataChunkSize,!0),t}get chunksize(){return this.chunksize_}set chunksize(t){this.chunksize_=t}get fmtChunkSize(){return this.fmtChunkSize_}get format(){return this.format_}get channels(){return this.channels_}set channels(t){this.channels_=t}get sampleRate(){return this.sampleRate_}set sampleRate(t){this.sampleRate_=t}get bytePerSec(){return this.bytePerSec_}set bytePerSec(t){this.bytePerSec_=t}get blockSize(){return this.blockSize_}set blockSize(t){this.blockSize_=t}get bitDepth(){return this.bitDepth_}set bitDepth(t){this.bitDepth_=t}get dataChunkSize(){return this.dataChunkSize_}set dataChunkSize(t){this.dataChunkSize_=t}get dataIndex(){return this.dataIndex_}}},876:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.default=class{constructor(){}RemoveDCOffset(t){const e=t.length;let a=0;t.forEach((t=>{a+=t}));const i=a/e,h=new Array;return t.forEach((t=>{h.push(Math.round(t-i))})),h}VolumeNormalize(t,e){const a=new Array;let i=0;return t.forEach((t=>{Math.abs(t)>i&&(i=Math.abs(t))})),t.forEach((t=>{a.push(Math.round(t/i*(2**(e-1)-1)))})),a}LogicalNormalize(t,e){const a=new Array;return t.forEach((t=>{a.push(t/2**(e-1))})),a}InverseLogicalNormalize(t,e){const a=new Array;return t.forEach((t=>{a.push(Math.round(t*2**(e-1)))})),a}}},156:function(t,e,a){var i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.WaveProcessing=e.Wave=void 0;var h=a(95);Object.defineProperty(e,"Wave",{enumerable:!0,get:function(){return i(h).default}});const s=i(a(876));e.WaveProcessing=s.default}},e={};return function a(i){var h=e[i];if(void 0!==h)return h.exports;var s=e[i]={exports:{}};return t[i].call(s.exports,s,s.exports,a),s.exports}(156)})()));