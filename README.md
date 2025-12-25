# Gabor Vision - 瑞士風格視覺訓練系統

這是一個基於 **Nuxt 4** 與 **p5.js** 開發的高性能視覺訓練單頁應用程式 (SPA)。本專案旨在透過科學的「蓋博符號 (Gabor Patch)」訓練，提升使用者的視覺對比敏感度 (Contrast Sensitivity)，並在設計上嚴格遵循經典的「瑞士設計風格 (Swiss Style)」。

## 核心特色

- **科學化渲染引擎**: 使用 `p5.js` 實作像素級蓋博符號渲染，支援動態調整頻率 (Frequency)、對比度 (Contrast) 與相位 (Phase)。
- **自適應難度演算法 (Adaptive Difficulty)**: 系統會根據玩家的反應時間 (Response Time) 自動調節難度：
    - 連續快速答對時，自動降低對比度並擴展網格 (從 2x2 提升至 3x3)。
    - 反應遲緩時，自動加粗條紋並提高對比度以協助辨識。
- **瑞士設計美學 (Swiss Aesthetic)**:
    - **極簡佈局**: 嚴格的網格系統、0.5px 精細邊框。
    - **高品質排版**: 使用 Inter 與 Monospace 字體，強調可讀性與專業質感。
    - **視覺質感**: 疊加 SVG 噪點濾鏡，模擬實驗室精密儀器的顯示效果。
- **動態眼球掃描**: Level 10 以上觸發位移模式，強迫眼球進行搜尋運動。
- **PWA 支援**: 支援離線存取與「加入主畫面」，提供全螢幕的 App 體驗。

## 技術棧

- **框架**: [Nuxt 4](https://nuxt.com/) (Vue 3 Composition API)
- **繪圖**: [p5.js](https://p5js.org/)
- **樣式**: [Tailwind CSS](https://tailwindcss.com/)
- **動畫**: [@vueuse/motion](https://motion.vueuse.org/)
- **離線**: [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/)
- **圖示**: Lucide Vue Next

## 專案結構

```bash
app/
├── components/
│   ├── GaborPatch.client.vue  # 核心 p5.js 渲染組件
│   ├── TrainingGrid.vue       # 遊戲邏輯與難度控制
│   └── ResultsOverlay.vue     # 結算與分析報告
├── pages/
│   └── index.vue              # 主遊戲頁面與狀態管理
└── composables/
    └── useAudio.ts            # 音效處理邏輯
```

## 開發設定

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

啟動開發伺服器於 `http://localhost:3000`:

```bash
npm run dev
```

### 生產環境構建

編譯生產版本：

```bash
npm run build
```

本地預覽生產版本：

```bash
npm run preview
```

## 訓練建議

1. **環境**: 建議在光線充足且穩定的環境下進行。
2. **距離**: 保持與螢幕約 40-50 公分的距離。
3. **頻率**: 每天進行 10-15 分鐘的訓練，持續兩週可感受到對比敏感度的提升。

---
*本專案僅供視覺訓練參考，若有眼科相關疾病請諮詢專業醫師。*