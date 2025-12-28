# NCU RentEase - React Native 版本

一款專為中央大學學生設計的租屋平台應用程式，結合了房源搜尋、地圖導航、社群評價和遊戲化體驗，讓找房變得更簡單、更有趣！
註：房源資訊（圖片除外）來源皆有真實依據，參考資源為國立中央大學校外賃居網。

## 🎬 Demo影片
https://drive.google.com/file/d/1cNNXZYyUSSqiUn7QR1lM5W35DOhsh9It/view?usp=sharing

## 🚀 快速開始

### 📋 環境需求
- **Node.js 18+** (推薦使用 LTS 版本)
- **npm** 或 **yarn**
- **手機** (iOS 或 Android) 或 **模擬器**

### 📱 手機準備 (推薦方式)
1. 在手機上安裝 **Expo Go** 應用程式
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 💻 電腦端安裝步驟

#### 步驟 1: 複製專案
```bash
# 複製專案到本地
git clone https://github.com/yenyu3/ncu-rentease-mobile.git
cd ncu_rentease/react-native
```

#### 步驟 2: 安裝依賴
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

#### 步驟 3: 啟動開發伺服器
```bash
# 啟動 Expo 開發伺服器
npm start

# 如果遇到快取問題，可以清除快取
npm start --clear
```

#### 步驟 4: 在裝置上運行

**方法一：使用 Expo Go (推薦)**
1. 確保手機和電腦連接同一個 WiFi 網路
2. 開啟手機上的 Expo Go 應用程式
3. 掃描終端機中顯示的 QR 碼
4. 等待應用程式載入完成

**方法二：使用模擬器**
```bash
# iOS 模擬器 (僅限 Mac)
npm run ios

# Android 模擬器
npm run android

# 網頁版 (開發測試用)
npm run web
```

### 🔧 常見問題排解

#### 問題 1: 端口被占用
```
› Port 8081 is being used by another process
? Use port 8082 instead? » (Y/n)
```
**解決方案**: 輸入 `Y` 使用其他端口

#### 問題 2: 手機無法連接
**解決方案**:
1. 確認手機和電腦在同一個 WiFi 網路
2. 關閉防火牆或 VPN
3. 重新啟動開發伺服器: `npm start --clear`

#### 問題 3: 應用程式載入失敗
**解決方案**:
1. 在 Expo Go 中搖動手機，選擇 "Reload"
2. 或重新掃描 QR 碼

#### 問題 4: Node.js 版本過舊
**解決方案**:
1. 更新 Node.js 到 18+ 版本
2. 重新安裝依賴: `npm install`

### 📱 使用 Expo Go 的詳細步驟

1. **下載 Expo Go**
   - 在手機應用商店搜尋 "Expo Go" 並安裝

2. **啟動開發伺服器**
   ```bash
   cd ncu_rentease/react-native
   npm start
   ```

3. **連接應用程式**
   - **Android**: 在 Expo Go 中點擊 "Scan QR Code" 掃描
   - **iOS**: 使用相機應用程式掃描 QR 碼，然後點擊通知

4. **等待載入**
   - 首次載入可能需要 1-2 分鐘
   - 載入完成後即可開始使用應用程式

### 🔄 開發工作流程

1. **修改程式碼** - 在編輯器中修改檔案
2. **自動重新載入** - Expo 會自動偵測變更並重新載入
3. **手動重新載入** - 搖動手機選擇 "Reload" 或按 `r` 鍵
4. **開發者選單** - 搖動手機可開啟開發者選單

## 🛠 技術架構

### 主要技術
- **React Native** - 跨平台開發框架
- **Expo** - 開發工具鏈
- **React Navigation** - 導航管理
- **Zustand** - 狀態管理
- **React Native Vector Icons** - 圖標庫
- **Expo Linear Gradient** - 漸層背景

### 專案結構
```
react-native/
├── src/
│   ├── components/          # 可重用元件
│   │   ├── Logo.js
│   │   ├── ListingCard.js
│   │   ├── FilterChips.js
│   │   └── ListingDetailModal.js
│   ├── pages/              # 頁面元件
│   │   ├── Home.js
│   │   ├── Map.js
│   │   ├── Favorites.js
│   │   ├── Community.js
│   │   └── Profile.js
│   ├── store/              # 狀態管理
│   │   └── useStore.js
│   └── data/               # 資料
│       └── mockData.js
├── App.js                  # 主應用程式
├── app.json               # Expo 配置
└── package.json           # 依賴管理
```

## 🎯 五大核心功能

### 🏠 首頁探索
- 房源搜尋和篩選系統
- 50+ 筆真實中大周邊房源
- 精美漸層背景設計
- 即時統計資訊顯示

### 🗺️ 地圖找房
- Google Maps 整合顯示房源位置
- 智能排序（距離、評分、價格）
- 中大位置標記和房源標記
- 互動式地圖操作

### ❤️ 收藏比較
- 房源收藏和管理功能
- 2-3 間房源並排比較
- 個人筆記記錄功能
- 靈活的選擇管理

### 👥 租屋社群
- 房源評價牆和標籤篩選
- 轉租專區資訊發布
- 安全租屋提醒機制
- 學生互助社群平台

### 👤 個人檔案
- 遊戲化點數和等級系統
- 徽章收集和成就展示
- 每日任務和進度追蹤
- 個人統計資訊

## ⭐ 創新功能

### 🎵 歌曲推薦系統
- 將步行距離轉換為「約幾首歌的距離」
- 根據距離推薦不同心情歌曲
- 整合 Spotify 與 Youtube Music 歌單連結
- 讓距離感知更有趣

### 📊 房源比較表格
- 最多 3 間房源並排比較
- 8 個維度全面對比分析
- 橫向滾動查看完整資訊
- 視覺化差異展示

### 🎮 遊戲化成就系統
- 點數、等級、徽章完整機制
- 每日任務引導功能探索
- 進度視覺化和成長追蹤
- 提高用戶參與度

### 📝 個人筆記功能
- 為收藏房源添加私人備註
- 記錄看房心得和注意事項
- 幫助租屋決策制定
- 個人化房源管理

### 🔄 轉租專區平台
- 學生之間直接轉租對接
- 安全租屋提醒和防詐機制
- 解決學期中轉租需求
- 社群互助共享資源


## 📊 與 Web 版本的差異

### 主要調整
1. **HTML → React Native 元件**
   - `div` → `View`
   - `input` → `TextInput`
   - `button` → `TouchableOpacity`
   - `img` → `Image`

2. **CSS → StyleSheet**
   - Tailwind CSS → React Native StyleSheet
   - Flexbox 佈局保持一致
   - 原生陰影和動畫效果

3. **導航系統**
   - React Router → React Navigation
   - 底部標籤導航
   - 原生模態彈窗

4. **圖標系統**
   - Lucide React → React Native Vector Icons
   - Feather 圖標集

---

**NCU RentEase React Native** - 原生體驗的租屋應用程式！ 📱✨
