const fs = require("fs");
const path = require("path");

const requireRestaurantZhTw = require("./requireRestaurantZhTw.js")
const requireMenu = require("../requireMenu.js");
const requireCart = require("./requireCart.js");
const requireDialogue = require("./requireDialogue.js");

module.exports = async function(text, customerID, restaurantName) {

    let prompt;

    fs.readFile(path.join(__dirname, '../../../command.txt'), (error, data) => {
        if (error) {
            throw error;
        } else {
            prompt = prompt + data;
        }
    })

    let restaurantNameZhTw = await requireRestaurantZhTw(restaurantName);

    let menu = await requireMenu(restaurantName);

    let cart = await requireCart(restaurantName, customerID);

    let dialogue = await requireDialogue(customerID, restaurantName);

    menu = toChinese(menu);

    cart = toChinese(cart);

    if (dialogue) {
        dialogue = toChinese(dialogue);
    } else {
        dialogue = "";
    }
    
    prompt = "\n\n餐廳名稱：" + restaurantNameZhTw + "\n\n菜單內容：" + menu + "\n\n顧客的購物車：" + cart + "\n\n" + prompt + "\n\n先前的對話紀錄：" + dialogue + text;
    
    return prompt;

}

function toChinese(text) {

    text = JSON.stringify(text);
    text = text.replace(/Food/g, "食物");
    text = text.replace(/Description/g, "描述");
    text = text.replace(/DefaultQuantity/g, '預設庫存');
    text = text.replace(/Quantity/g, '庫存');
    text = text.replace(/Ingredient/g, '原料');
    text = text.replace(/Price/g, '價格');
    text = text.replace(/Category/g, '類別');
    text = text.replace(/Amount/g, '訂購數量');
    text = text.replace(/Note/g, '備註');
    text = text.replace(/RestaurantName/g, '餐廳代號');
    text = text.replace(/Content/g, '');

    return text;
}