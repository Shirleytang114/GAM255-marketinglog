# 📝 Marketing Campaign Log (行銷活動日誌)

這是一個專為行銷團隊設計的**活動成效追蹤與管理後台**。

作為 [互動式行銷儀表板](https://shirleytang114.github.io/GAM255-marketingdashboard/) 的延伸模組，本頁面負責接收決策後的執行項目，並提供數據回填、成效追蹤以及報表匯出功能，幫助團隊量化每一次行銷活動的 ROI。

## ✨ 核心功能 (Key Features)

### 1. 數據連動與同步 (Data Sync)
- **自動接收方案**：當使用者在儀表板點擊「引用此方案」後，該活動的資訊（日期、類型、名稱、活動前BHI）會自動同步至此頁面。
- **LocalStorage 儲存**：所有數據皆暫存於瀏覽器端，重新整理頁面後資料依然存在，無需架設資料庫即可體驗完整流程。

### 2. 互動式數據管理 (Interactive Management)
- **即時編輯 (Editable Cells)**：表格中的「活動區間」、「成本」、「營業額」欄位皆可直接點擊編輯。
- **自動抓取成效 (Simulated API)**：
    - 當使用者填寫完「活動區間」並離開欄位 (Blur) 時，系統會觸發模擬 API。
    - 系統將模擬網路延遲，並自動生成一個隨機的 **活動後 BHI** 數值，實現成效回饋的自動化體驗。

### 3. AI 策略中心 (AI Strategy Hub)
- **展開式細節 (Expandable Rows)**：點擊每一列左側的 `+` 號，可展開該活動的詳細策略內容。
- **多樣化文案生成**：內建分頁籤 (Tabs) 切換不同渠道的文案：
    - **公關稿 (PR)**：針對媒體發布的正式新聞稿。
    - **社群貼文 (Social)**：適合 Instagram/Facebook 的活潑貼文。
    - **廣告文案 (Ad)**：針對轉換率優化的短文案。

### 4. 報表匯出 (Export & Reporting)
- **CSV 匯出功能**：點擊「輸出成報表」按鈕，系統會將當前表格內的所有數據打包成 `.csv` 檔案供下載，方便匯入 Excel 進行深度分析。

## 🛠️ 技術棧 (Tech Stack)

- **Frontend**: HTML5, CSS3 (Flexbox Layout)
- **Scripting**: Vanilla JavaScript (DOM Manipulation, LocalStorage API)
- **Interaction**: ContentEditable API (實現類似 Excel 的編輯體驗)

## 📂 檔案結構

```text
.
├── index.html          # 日誌頁面主結構
├── style.css           # 表格樣式、按鈕風格與 RWD 設定
├── log_script.js       # 資料讀取、模擬 API 邏輯、CSV 匯出功能
└── README.md           # 專案說明文件