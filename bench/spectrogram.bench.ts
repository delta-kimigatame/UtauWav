import { describe,bench } from "vitest";
import WaveAnalyse from "../src/WaveAnalyse";
import { calc_spectrogram_with_rfft } from "@delta_kimigatame/fft-wasm-lib";

describe("spectrogramBench",()=>{
    const wa = new WaveAnalyse();
    
    const data = new Array(44100 * 5).fill(1);
    const floatData = new Float32Array(44100 * 5).fill(1)
    const window = new Float32Array(128).fill(1)
    const fftSize = 512;
    
    bench("TS 5秒データ", () => {
        wa.SpectrogramTS(data,fftSize);
      });
      
    bench("Wasm Rfft 5秒データ", () => {
      wa.Spectrogram(data,fftSize);
    });
    bench("Wasm内の処理のみRfft 5秒データ", () => {
        calc_spectrogram_with_rfft(512,floatData,window)
    });

})