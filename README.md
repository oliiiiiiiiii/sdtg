# 📐 Infix Expression Conversion

#### **中序表達式轉換視覺化工具（Infix to Prefix / Postfix Visualizer）**

###### This is a web-based visualization tool that helps users convert **infix expressions** to **prefix** and **postfix** notation step by step.  
###### 這是一個基於網頁的視覺化工具，可逐步將 **中序表達式 (Infix)** 轉換為 **前序 (Prefix)** 或 **後序 (Postfix)** 表達式，並顯示堆疊與輸出變化。

## Demo 

##### 👉 [Click to Try 線上試用](https://oliiiiiiiiii.github.io/sdtg/)

## 🌟 Features 功能特色

##### ✅ Convert infix to **prefix** and **postfix**  
##### ✅ Step-by-step visualization with explanation  
##### ✅ Auto-play or manual control of steps  
##### ✅ Evaluate postfix expression result  
##### ✅ Responsive UI with animation

## 🧪 Example 範例輸入

##### **Infix 中序輸入：**

    3 + 4 * 2 / (1 - 5)

##### **Prefix 前序輸出：**

    3 / * 4 2 - 1 5

##### **Postfix 後序輸出：**
 
    3 4 2 * 1 5 - / +

##### **Result 計算結果：**

    1


## 🖱️ How to Use 使用方式

##### 1. 輸入中序表達式（如 `3+4*2/(1-5)`）  
##### 2. 點選「Convert to Prefix」或「Convert to Postfix」  
##### 3. 使用「Next Step / Previous Step」逐步查看過程  
##### 4. 或點選「Auto Play」自動播放所有步驟  
##### 5. 使用「Reset」可重新輸入新的表達式  

##### 📌 點選畫面左上角 `Usage` 按鈕查看完整教學！

## 🛠️ Built With 使用技術

##### - HTML / CSS (Memphis Design style)  
##### - JavaScript（無框架）  
##### - Stack-based 演算法（改編自 Shunting Yard）


## 📂 Project Structure 專案結構
```
.
├── index.html         # 主網頁
├── script.js          # JavaScript 程式邏輯與動畫
├── style.css          # 視覺樣式設計
├── perform_code.c     # C 語言版本演算法（非必要）
└── README.md          # 說明文件
```


## 📄 License 授權

##### This project is licensed under the **MIT License**.  
##### 本專案使用 **MIT 授權條款**。

