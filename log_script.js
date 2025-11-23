// 頁面載入完成後，執行 loadLogData 函數
document.addEventListener('DOMContentLoaded', () => {
    loadLogData();
});

function loadLogData() {
    const tableBody = document.getElementById('log-table-body');
    
    // 1. 從 localStorage 讀取日誌
    const log = JSON.parse(localStorage.getItem('marketingLog')) || [];

    // 2. 檢查是否有資料
    if (log.length === 0) {
        // ▼▼▼ 【修改點 1：更新 Colspan 為 9】 ▼▼▼
        tableBody.innerHTML = '<tr><td colspan="9" class="placeholder-text">目前沒有已引用的行銷活動...</td></tr>';
        // ▲▲▲ 【修改結束】 ▲▲▲
        return;
    }

    // 3. 如果有資料，清空表格
    tableBody.innerHTML = '';

    // 4. 遍歷資料並建立表格列 (tr)
    log.forEach((item, index) => {
        
        // ---------- 【變更點 A：建立主要資料列】 ----------
        const row = document.createElement('tr');
        row.classList.add('data-row'); // 加上 class 方便 CSS 選取
        
        row.innerHTML = `
            <td class="expand-cell">
                <span class="expand-btn" onclick="toggleStrategy(event, ${index})">+</span>
            </td>
            <td>${item.date}</td>
            <td>${item.type}</td>
            <td>${item.name}</td>
            <td>${item.preBHI}</td>
            <td contenteditable="true" 
                data-index="${index}" 
                onblur="updatePeriodAndFetchBHI(this)">
                ${item.period}
            </td>
            <td id="post-bhi-${index}">${item.postBHI}</td>
            
            <td contenteditable="true"
                data-index="${index}"
                data-field="cost"
                onblur="saveCellEdit(this)">
                ${item.cost || ''}
            </td>
            
            <td contenteditable="true"
                data-index="${index}"
                data-field="revenue"
                onblur="saveCellEdit(this)">
                ${item.revenue || ''}
            </td>
        `;
        tableBody.appendChild(row);

        // ---------- 【變更點 B：建立 AI 策略的展開列】 ----------
        const expandedRow = document.createElement('tr');
        expandedRow.classList.add('expanded-row'); // 預設 display: none
        expandedRow.id = `strategy-row-${index}`;  // 給定 ID 方便 JS 選取
        
        // 讓展開的內容橫跨所有欄位
        // (這裡的範例內容是靜態的，您可以未來改成動態生成)
        expandedRow.innerHTML = `
            <td colspan="9">
                <div class="strategy-container">
                    <h4>AI 策略中心： ${item.name}</h4>
                    
                    <div class="strategy-tabs">
                        <button class="tab-link active" onclick="showTab(event, ${index}, 'pr')">公關稿</button>
                        <button class="tab-link" onclick="showTab(event, ${index}, 'social')">社群貼文</button>
                        <button class="tab-link" onclick="showTab(event, ${index}, 'ad')">廣告文案</button>
                    </div>
                    
                    <div id="pr-${index}" class="tab-content" style="display: block;">
                        <h5>公關稿 (AI 模擬)</h5>
                        <p><strong>標題：</strong>Owala推出革命性功能，震撼市場！</p>
                        <p><strong>內文：</strong>在現代快節奏的生活中，Owala品牌今日宣布一項重大革新...\n此舉將徹底改變使用者對水壺的想像。</p>
                    </div>
                    <div id="social-${index}" class="tab-content">
                        <h5>社群貼文 (AI 模擬)</h5>
                        <p>🔥 史上最酷！ ${item.name} 實測！<br>
                        你是不是也常常忘記...？ Ｏwala聽到了！<br>
                        #密封性極佳 #Owala #新品上市</p>
                    </div>
                    <div id="ad-${index}" class="tab-content">
                        <h5>廣告文案 (AI 模擬)</h5>
                        <p><strong>標語：</strong>不只是水壺，更是生活態度。<br>
                        <strong>CTA：</strong>立即體驗owala帶來的改變。</p>
                    </div>
                    
                    <div class="strategy-actions">
                       <button class="action-btn">複製內容</button>
                       <button class="action-btn">重新生成</button>
                    </div>
                </div>
            </td>
        `;
        tableBody.appendChild(expandedRow);
        
    }); // ForEach 迴圈結束
}

// ==========================================================
// ▼▼▼ 【新增：切換 AI 策略列展開/收合 的函數】 ▼▼▼
// ==========================================================
function toggleStrategy(event, index) {
    const row = document.getElementById(`strategy-row-${index}`);
    const btn = event.currentTarget; // 獲取被點擊的 <span>
    
    // 切換 .active class
    row.classList.toggle('active');
    
    // 根據 class 狀態更新按鈕文字
    if (row.classList.contains('active')) {
        btn.innerText = "−"; // 減號
    } else {
        btn.innerText = "+";
    }
}

// ==========================================================
// ▼▼▼ 【新增：切換頁籤 (Tab) 的函數】 ▼▼▼
// ==========================================================
function showTab(event, index, tabName) {
    // 1. 找到這個策略列 (row)
    const row = document.getElementById(`strategy-row-${index}`);
    
    // 2. 隱藏這個 row 裡面所有的 tab-content
    const tabContents = row.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // 3. 移除這個 row 裡面所有 tab-link 的 'active' class
    const tabLinks = row.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    // 4. 顯示指定的 tab-content，並將點擊的 tab-link 設為 'active'
    document.getElementById(`${tabName}-${index}`).style.display = "block";
    event.currentTarget.classList.add("active");
}


// ==========================================================
// 以下是您原有的函數 (儲存格、BHI、清空、匯出)
// ==========================================================

// 【儲存 "成本" 或 "營業額" 的通用函數】
function saveCellEdit(element) {
    // 1. 獲取資料
    const index = element.dataset.index;
    const field = element.dataset.field; // "cost" 或 "revenue"
    const newValue = element.innerText.trim();

    // 2. 更新 localStorage
    const log = JSON.parse(localStorage.getItem('marketingLog')) || [];
    if (log[index]) {
        log[index][field] = newValue;
        localStorage.setItem('marketingLog', JSON.stringify(log));
        console.log(`Log [${index}] '${field}' updated to: ${newValue}`);
    }
}

// ★ 抓取 BHI 的函數 ★
function updatePeriodAndFetchBHI(element) {
    // 1. 獲取資料
    const index = element.dataset.index; // 第幾筆資料 (例如: 0)
    const newPeriodText = element.innerText; // 使用者輸入的新內容

    const log = JSON.parse(localStorage.getItem('marketingLog')) || [];
    if (!log[index]) return;

    // 2. 立即儲存使用者輸入的「活動區間」
    log[index].period = newPeriodText;
    localStorage.setItem('marketingLog', JSON.stringify(log));
    console.log(`Log [${index}] 'period' updated to: ${newPeriodText}`);

    // 3. 檢查是否需要抓取 BHI
    const postBhiCell = document.getElementById(`post-bhi-${index}`);
    if (newPeriodText.trim() === 'N/A' || newPeriodText.trim() === '') {
        if (postBhiCell) postBhiCell.innerText = 'N/A';
        log[index].postBHI = 'N/A';
        localStorage.setItem('marketingLog', JSON.stringify(log));
        return;
    }

    // 4. 模擬 API 呼叫 (抓取 BHI)
    if (postBhiCell) {
        // (a) 顯示 "抓取中..."
        postBhiCell.innerText = "抓取中...";
        
        // (b) 模擬 1 秒的網路延遲
        setTimeout(() => {
            // (c) 產生一個 60% 到 90% 之間的隨機 BHI 作為模擬結果
            const simulatedBHI = `${(Math.random() * 30 + 60).toFixed(0)}%`;
            
            // (d) 更新 BHI 欄位
            postBhiCell.innerText = simulatedBHI;
            
            // (e) 將這個新 BHI 儲存回 localStorage
            const log = JSON.parse(localStorage.getItem('marketingLog')) || []; // 重新獲取
            if(log[index]) {
                log[index].postBHI = simulatedBHI;
                localStorage.setItem('marketingLog', JSON.stringify(log));
                console.log(`Log [${index}] 'postBHI' auto-updated to: ${simulatedBHI}`);
            }

        }, 1000); // 1 秒延遲
    }
}


// 清空所有日誌的函數
function clearLog() {
    if (confirm('您確定要清空所有行銷日誌嗎？此操作無法復原。')) {
        localStorage.removeItem('marketingLog'); // 刪除資料
        loadLogData(); // 重新載入表格 (會顯示為空)
        alert('日誌已清空！');
    }
}

// 【輸出報表 (CSV) 的函數】
function exportReport() {
    console.log('Exporting report...');
    const log = JSON.parse(localStorage.getItem('marketingLog')) || [];

    if (log.length === 0) {
        alert('日誌中沒有資料可匯出！');
        return;
    }

    // 1. 建立 CSV 標頭
    const headers = [
        "日期", 
        "行銷活動種類", 
        "名稱", 
        "活動前 BHI", 
        "活動區間", 
        "活動後 BHI", 
        "成本", 
        "營業額"
    ];
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // \uFEFF 是BOM
    csvContent += headers.join(",") + "\r\n";

    // 2. 遍歷資料並加入
    log.forEach(item => {
        // 處理 "N/A" 或空值
        const period = item.period || 'N/A';
        const postBHI = item.postBHI || 'N/A';
        const cost = item.cost || '0';
        const revenue = item.revenue || '0';

        // 處理名稱中可能包含逗號 (,) 的問題，用雙引號包起來
        const name = `"${item.name}"`; 
        
        const row = [
            item.date,
            item.type,
            name,
            item.preBHI,
            `"${period}"`, // 區間也可能包含特殊字元
            postBHI,
            cost,
            revenue
        ];
        csvContent += row.join(",") + "\r\n";
    });

    // 3. 建立並觸發下載連結
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marketing_log_report.csv");
    document.body.appendChild(link); 

    link.click(); // 觸發下載

    document.body.removeChild(link); // 清理
    console.log('Report exported.');
}