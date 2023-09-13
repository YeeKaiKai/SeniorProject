const text = "已為您取消6碗白飯泛、5碗白飯，還需要什麼呢？";

// 匹配餐點名稱的正則表達式，捕獲組 1 是數量和單位，捕獲組 2 是餐點名稱
const foodPattern = /\d+[\u4e00-\u9fa5]{1}([\u4e00-\u9fa5]+)/g;

// 使用 exec 方法進行全局搜索，並提取餐點名稱
const foods = [];
let match;
while ((match = foodPattern.exec(text)) !== null) {
  foods.push(match[1]); // 只提取第一個捕獲組，即餐點名稱
}

console.log("餐點名稱：", foods);
