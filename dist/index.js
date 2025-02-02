!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.UtauWav=e():t.UtauWav=e()}(self,(()=>(()=>{"use strict";var t={d:(e,i)=>{for(var s in i)t.o(i,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:i[s]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{Complex:()=>n,GenerateWave:()=>h,Wave:()=>a,WaveAnalyse:()=>u,WaveProcessing:()=>s,fft:()=>l,ifft:()=>c});class i{chunksize_;fmtChunkSize_;format_;channels_;sampleRate_;bytePerSec_;blockSize_;bitDepth_;dataChunkSize_;dataIndex_;constructor(t){const e=new TextDecoder,i=new DataView(t);let s=12,a=36;if(t.byteLength<44)throw new RangeError("waveヘッダに欠損があるか、waveファイルではありません。");if("RIFF"!==e.decode(t.slice(0,4)))throw new Error("このデータはwaveファイルではありません。RIFF識別子がありません。");if(this.chunksize_=i.getUint32(4,!0),"WAVE"!==e.decode(t.slice(8,12)))throw new Error("このデータはwaveファイルではありません。WAVE識別子がありません。");for(;"fmt "!==e.decode(t.slice(s,s+4));)if(s++,s+4>t.byteLength)throw new Error("このデータはwaveファイルではありません。fmt 識別子がありません。");if(s+32>t.byteLength)throw new RangeError("waveヘッダに欠損があります。");if(this.fmtChunkSize_=i.getUint32(s+4,!0),this.format_=i.getUint16(s+8,!0),3===this.format_)throw new Error("このwavファイルは32bit floatで記録されており、読み込みできません。");if(6===this.format_)throw new Error("このwavファイルはA-lawコーデックで圧縮されており、読み込みできません。");if(7===this.format_)throw new Error("このwavファイルはu-lawコーデックで圧縮されており、読み込みできません。");if(1!==this.format_)throw new Error("このwavファイルは未知のコーデックで圧縮されており、読み込みできません。");for(this.channels_=i.getUint16(s+10,!0),this.sampleRate_=i.getUint32(s+12,!0),this.bytePerSec_=i.getUint32(s+16,!0),this.blockSize_=i.getUint16(s+20,!0),this.bitDepth_=i.getUint16(s+22,!0);"data"!==e.decode(t.slice(a,a+4));)if(a++,a+4>t.byteLength)throw new Error("このデータはwaveファイルではありません。data識別子がありません。");if(a+8>t.byteLength)throw new RangeError("waveヘッダに欠損があります。");this.dataChunkSize_=i.getUint32(a+4,!0),this.dataIndex_=a+8}Output(){const t=new ArrayBuffer(44),e=new DataView(t);return e.setUint8(0,"R".charCodeAt(0)),e.setUint8(1,"I".charCodeAt(0)),e.setUint8(2,"F".charCodeAt(0)),e.setUint8(3,"F".charCodeAt(0)),e.setUint32(4,this.chunksize,!0),e.setUint8(8,"W".charCodeAt(0)),e.setUint8(9,"A".charCodeAt(0)),e.setUint8(10,"V".charCodeAt(0)),e.setUint8(11,"E".charCodeAt(0)),e.setUint8(12,"f".charCodeAt(0)),e.setUint8(13,"m".charCodeAt(0)),e.setUint8(14,"t".charCodeAt(0)),e.setUint8(15," ".charCodeAt(0)),e.setUint32(16,this.fmtChunkSize,!0),e.setUint16(20,this.format,!0),e.setUint16(22,this.channels,!0),e.setUint32(24,this.sampleRate,!0),e.setUint32(28,this.bytePerSec,!0),e.setUint16(32,this.blockSize,!0),e.setUint16(34,this.bitDepth,!0),e.setUint8(36,"d".charCodeAt(0)),e.setUint8(37,"a".charCodeAt(0)),e.setUint8(38,"t".charCodeAt(0)),e.setUint8(39,"a".charCodeAt(0)),e.setUint32(40,this.dataChunkSize,!0),t}get chunksize(){return this.chunksize_}set chunksize(t){this.chunksize_=t}get fmtChunkSize(){return this.fmtChunkSize_}get format(){return this.format_}get channels(){return this.channels_}set channels(t){this.channels_=t}get sampleRate(){return this.sampleRate_}set sampleRate(t){this.sampleRate_=t}get bytePerSec(){return this.bytePerSec_}set bytePerSec(t){this.bytePerSec_=t}get blockSize(){return this.blockSize_}set blockSize(t){this.blockSize_=t}get bitDepth(){return this.bitDepth_}set bitDepth(t){this.bitDepth_=t}get dataChunkSize(){return this.dataChunkSize_}set dataChunkSize(t){this.dataChunkSize_=t}get dataIndex(){return this.dataIndex_}}class s{constructor(){}RemoveDCOffset(t){const e=t.reduce(((t,e)=>t+e),0)/t.length;return t.map((t=>Math.round(t-e)))}VolumeNormalize(t,e){const i=t.reduce(((t,e)=>Math.max(t,Math.abs(e))),0);return t.map((t=>Math.round(t/i*(2**(e-1)-1))))}LogicalNormalize(t,e){return t.map((t=>t/2**(e-1)))}InverseLogicalNormalize(t,e){return t.map((t=>Math.round(t*2**(e-1))))}}class a{header;data_;rData_;constructor(t){if(this.header=new i(t),t.byteLength<=this.header.dataIndex)return console.warn("このwavはヘッダ部分しかありません。"),this.data_=null,void(this.rData_=null);if(t.slice(this.header.dataIndex).byteLength%this.blockSize!=0)return console.warn("このwavのデータ部分に欠損があるため読み込まれませんでした。"),this.data_=null,void(this.rData_=null);const e=t.slice(this.header.dataIndex).byteLength/this.blockSize,s=new DataView(t.slice(this.header.dataIndex));this.data_=new Array,2===this.channels?this.rData_=new Array:this.rData_=null;for(let t=0;t<e;t++)8===this.bitDepth?(this.data_.push(s.getInt8(t*this.blockSize)),2===this.channels&&this.rData_?.push(s.getInt8(t*this.blockSize+1))):16===this.bitDepth?(this.data_.push(s.getInt16(t*this.blockSize,!0)),2===this.channels&&this.rData_?.push(s.getInt16(t*this.blockSize+2,!0))):24===this.bitDepth&&(this.data_.push(this.GetInt24(s,t*this.blockSize)),2===this.channels&&this.rData_?.push(this.GetInt24(s,t*this.blockSize+3)))}Output(){const t=new ArrayBuffer(this.header.dataChunkSize),e=new DataView(t),i=this.header.dataChunkSize/this.blockSize;for(let t=0;t<i;t++)null===this.data||(8===this.bitDepth?(e.setInt8(t*this.blockSize,this.data[t]),2===this.channels&&null!==this.rData&&e.setInt8(t*this.blockSize+1,this.rData[t])):16===this.bitDepth?(e.setInt16(t*this.blockSize,this.data[t],!0),2===this.channels&&null!==this.rData&&e.setInt16(t*this.blockSize+2,this.rData[t],!0)):24===this.bitDepth&&(this.SetInt24(e,t*this.blockSize,this.data[t]),2===this.channels&&null!==this.rData&&this.SetInt24(e,t*this.blockSize+3,this.rData[t])));const s=this.header.Output(),a=new Uint8Array(s.byteLength+t.byteLength);return a.set(new Uint8Array(s),0),a.set(new Uint8Array(t),44),a.buffer}GetInt24(t,e){let i=t.getUint16(e,!0)+65536*t.getUint8(e+2);return i>=2**23&&(i-=2**24),i}SetInt24(t,e,i){i<0&&(i+=2**24),t.setUint16(e,65535&i,!0),t.setUint8(e+2,16711680&i)}RemoveDCOffset(){const t=new s;null!==this.data&&(this.data_=t.RemoveDCOffset(this.data)),null!==this.rData&&(this.rData_=t.RemoveDCOffset(this.rData))}VolumeNormalize(){const t=new s;null!==this.data&&(this.data_=t.VolumeNormalize(this.data,this.bitDepth)),null!==this.rData&&(this.rData_=t.VolumeNormalize(this.rData,this.bitDepth))}LogicalNormalize(t){const e=new s;return null===this.data||1!==this.channels&&1!==t?null!==this.rData&&2===t?e.LogicalNormalize(this.rData,this.bitDepth):null:e.LogicalNormalize(this.data,this.bitDepth)}InverseLogicalNormalize(t,e){const i=new s;1===this.channels||1===e?this.data_=i.InverseLogicalNormalize(t,this.bitDepth):2===e&&(this.rData_=i.InverseLogicalNormalize(t,this.bitDepth))}get chunksize(){return this.header.chunksize}get channels(){return this.header.channels}set channels(t){this.channels!==t&&(1===t?(this.header.channels=t,this.rData_=null,this.header.blockSize=t*this.bitDepth/8,this.header.bytePerSec=this.blockSize*this.sampleRate):2===t&&null!==this.data_&&(this.header.channels=t,this.rData_=[...this.data_],this.header.blockSize=t*this.bitDepth/8,this.header.bytePerSec=this.blockSize*this.sampleRate))}get sampleRate(){return this.header.sampleRate}set sampleRate(t){if(t!==this.sampleRate&&null!==this.data){const e=this.data.length/this.sampleRate,i=1/this.sampleRate,s=1/t,a=Math.ceil(e*t),h=new Array;let n=null;2===this.channels&&(n=new Array);for(let t=0;t<a;t++){const e=s*t/i;if(e===Math.floor(e))h.push(this.data[e]),null!==n&&null!==this.rData&&n.push(this.rData[e]);else{const t=e-Math.floor(e);h.push(this.data[Math.floor(e)]+Math.round((this.data[Math.min(Math.ceil(e),this.data.length-1)]-this.data[Math.floor(e)])*t)),null!==n&&null!==this.rData&&n.push(this.rData[Math.floor(e)]+Math.round((this.rData[Math.ceil(e)]-this.rData[Math.floor(e)])*t))}}this.data_=h,this.rData_=n,this.header.sampleRate=t,this.header.bytePerSec=this.blockSize*this.sampleRate;const r=this.blockSize*a;this.header.chunksize=this.header.chunksize-this.header.dataChunkSize+r,this.header.dataChunkSize=this.blockSize*a}}get bytePerSec(){return this.header.bytePerSec}get blockSize(){return this.header.blockSize}get bitDepth(){return this.header.bitDepth}set bitDepth(t){if(t===this.bitDepth)return;if(t%8!=0||t>32)return;const e=new Array;if(this.data_?.forEach((i=>{e.push(i/2**this.bitDepth*2**t)})),this.data_=e,null!==this.rData){const e=new Array;this.rData_?.forEach((i=>{e.push(i/2**(this.bitDepth-1)*2**(t-1))})),this.rData_=e}this.header.bitDepth=t,this.header.blockSize=this.channels*this.bitDepth/8,this.header.bytePerSec=this.blockSize*this.sampleRate}get data(){return this.data_}get rData(){return this.rData_}SetDate(t,e=null){this.data_=t,this.rData_=e,this.channels=null!==e?2:1;const i=this.blockSize*t.length;this.header.chunksize=this.header.chunksize-this.header.dataChunkSize+i,this.header.dataChunkSize=i}}const h=(t,e,i,s=null)=>{let h=1;null!==s&&(h=2);const n=h*e/8,r=n*t,o=new ArrayBuffer(44),l=i.length*n,c=new DataView(o);c.setUint8(0,"R".charCodeAt(0)),c.setUint8(1,"I".charCodeAt(0)),c.setUint8(2,"F".charCodeAt(0)),c.setUint8(3,"F".charCodeAt(0)),c.setUint32(4,l+36,!0),c.setUint8(8,"W".charCodeAt(0)),c.setUint8(9,"A".charCodeAt(0)),c.setUint8(10,"V".charCodeAt(0)),c.setUint8(11,"E".charCodeAt(0)),c.setUint8(12,"f".charCodeAt(0)),c.setUint8(13,"m".charCodeAt(0)),c.setUint8(14,"t".charCodeAt(0)),c.setUint8(15," ".charCodeAt(0)),c.setUint32(16,16,!0),c.setUint16(20,1,!0),c.setUint16(22,h,!0),c.setUint32(24,t,!0),c.setUint32(28,r,!0),c.setUint16(32,n,!0),c.setUint16(34,e,!0),c.setUint8(36,"d".charCodeAt(0)),c.setUint8(37,"a".charCodeAt(0)),c.setUint8(38,"t".charCodeAt(0)),c.setUint8(39,"a".charCodeAt(0)),c.setUint32(40,l,!0);const d=new a(o);return d.SetDate(i,s),d};class n{re;sub;constructor(t=0,e=0){this.re=t,this.sub=e}Expi(t){return this.re=Math.cos(t),this.sub=Math.sin(t),this}Add(t){return new n(this.re+t.re,this.sub+t.sub)}Sub(t){return new n(this.re-t.re,this.sub-t.sub)}Mul(t){return new n(this.re*t.re-this.sub*t.sub,this.re*t.sub+this.sub*t.re)}}const r=(t,e)=>{let i=0;for(let s=0;s<t;s++)i=i<<1|e>>>s&1;return i},o=(t,e,i)=>{const s=Math.log2(i),a=t.map(((e,i)=>t[r(s,i)]));for(let t=1;t<i;t*=2){e/=2;for(let s=0;s<i;s+=2*t)for(let i=0;i<t;i++){const h=a[s+i],r=a[s+i+t].Mul((new n).Expi(e*i));[a[s+i],a[s+i+t]]=[h.Add(r),h.Sub(r)]}}return a},l=t=>{const e=t.length,i=-2*Math.PI;return o(t,i,e)},c=t=>{const e=t.length,i=2*Math.PI;return o(t,i,e).map((t=>new n(t.re/e,t.sub/e)))};class d{size;k;twiddle;itwiddle;constructor(t){this.size=t,this.k=Math.log2(this.size);const e=-2*Math.PI/this.size,i=2*Math.PI/this.size;this.twiddle=[...new Array(this.size)].map(((t,i)=>(new n).Expi(e*i))),this.itwiddle=[...new Array(this.size)].map(((t,e)=>(new n).Expi(i*e)))}fftin=(t,e)=>{const i=t.map(((e,i)=>t[r(this.k,i)]));let s=this.size;for(let t=1;t<this.size;t*=2){s/=2;for(let a=0;a<this.size;a+=2*t)for(let h=0;h<t;h++){const n=i[a+h],r=i[a+h+t].Mul(e[s*h]);[i[a+h],i[a+h+t]]=[n.Add(r),n.Sub(r)]}}return i};fft=t=>this.fftin(t,this.twiddle);ifft=t=>this.fftin(t,this.itwiddle).map((t=>new n(t.re/this.size,t.sub/this.size)));fftinReal=(t,e)=>{const i=t.map(((e,i)=>new n(t[r(this.k,i)])));let s=this.size;for(let t=1;t<this.size;t*=2){s/=2;for(let a=0;a<this.size;a+=2*t)for(let h=0;h<t;h++){const n=i[a+h],r=i[a+h+t].Mul(e[s*h]);[i[a+h],i[a+h+t]]=[n.Add(r),n.Sub(r)]}}return i};fftReal=t=>this.fftinReal(t,this.twiddle);ifftReal=t=>this.fftinReal(t,this.itwiddle).map((t=>new n(t.re/this.size,t.sub/this.size)));ifftRealtoReal=t=>this.fftinReal(t,this.itwiddle).map((t=>t.re/this.size))}class u{constructor(){}Power(t,e=44100,i=.02,s="hanning",a=.01,h=.97){const n=new Array,r=this.PreEmphasis(t,h),o=i*e,l=a*e,c=this.MakeWindow(s,l);for(let t=0;t<r.length;t+=l){const e=r.slice(t,t+o),i=e.map(((t,e)=>t*c[e%l])),s=i.reduce(((t,e)=>t+e**2),0);n.push(10*Math.log10(s/e.length))}return n}Spectrogram(t,e=512,i="hamming",s=128,a=.97){const h=new Array,n=this.PreEmphasis(t,a),r=this.MakeWindow(i,s),o=new d(e);for(let t=0;t+e<n.length;t+=s){const i=n.slice(t,t+e).map(((t,e)=>t*r[e%s]));h.push(o.fftReal(i))}return h.map((t=>t.map((t=>10*Math.log10((t.re**2+t.sub**2)**.5)))))}PreEmphasis(t,e=.97){return t.map(((i,s)=>0===s?t[0]:t[s]-e*t[s-1]))}MakeWindow(t,e){const i=new Array;for(let s=0;s<e;s++)"hanning"===t?i.push(.5-.5*Math.cos(2*Math.PI*s/e)):"hamming"===t?i.push(.54-.46*Math.cos(2*Math.PI*s/e)):i.push(1);return i}F0(t,e=44100,i=9048,s=256,a=40,h=800,n=.2){const r=new Array,o=Math.ceil(e/a),l=Math.floor(e/h),c=Math.floor(i/2),u=new Array(c).fill(0),b=new d(i),p=u.concat(t,u);for(let t=c;t<p.length-c;t+=s){const i=p.slice(t-c,t+c),s=b.fftReal(i).map((t=>t.re**2+t.sub**2)),d=b.ifftRealtoReal(s),u=d.slice(0,c).map((t=>t/d[0])),w=u.slice(l,o).reduce(f),m=u.slice(l,o).indexOf(w)+l;if(w>=n){let t=m;for(let e=2;e<Math.floor(c/m)-1;e++){const i=Math.floor(t*e);if(i+10>=c||i-10<0)break;const s=u.slice(i-10,i+10).reduce(f);t=(u.slice(i-10,i+10).indexOf(s)+i-10)/e}const i=e/t;i>=a&&i<=h?r.push(i):r.push(a)}else r.push(a)}return r}}const f=(t,e)=>Math.max(t,e);return e})()));