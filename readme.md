# utauwav

飴屋／菖蒲氏によって公開されている、Windows 向けに作成された歌声合成ソフトウェア「UTAU」における音声データ(wav)を取り扱うための TypeScript ライブラリです。

UTAU 公式サイト(http://utau2008.web.fc2.com/)

# 導入方法

`npm install utauwav`

# 使用方法

```html
<input type="file" id="input-file" accept="Wav,.wav" />
```

```TS
import { Wave } from "utauwav";

//HTMLのチェック
const inputFile = document.getElementById("input-file");
if (!inputFile) return;

// ファイル読込
inputFile.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  const fr = new FileReader();
  if (!target.files) return;
  Array.from(target.files).forEach((f) => {
    fr.addEventListener("load", () => {
      if (fr.result !== null && typeof fr.result !== "string") {
        const wav = new Wave(fr.result);

        // wavの各パラメータはプロパティになっており、それぞれの値に代入すればデータ部もそれに合わせて変換
        wav.channels = 1;
        wav.sampleRate = 44100;
        wav.bitDepth = 16;

        // wav.Output()でArrayBufferを書き出す
        const convertedWav = new File([wav.Output()], f.name, { type: "audio/wav" })
      }
    });
    fr.readAsArrayBuffer(f);
  });
});
```

# 完全な使用例
https://github.com/delta-kimigatame/ExampleUtauWav

# API リファレンス

https://delta-kimigatame.github.io/UtauWav/
