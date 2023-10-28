const createDialogue = require("../../model/customer/createDialogue.js");
const createCart = require("../../model/customer/createCart.js");
const requireCategory = require("../../model/requireCategory.js");
const requireDialogue = require("../../model/customer/requireDialogue.js");
const requireCart = require("../../model/customer/requireCart.js");
const requireMenu = require("../../model/requireMenu.js");
const deleteCart = require("../../model/customer/deleteCart.js");
const updateCart = require("../../model/customer/updateCart.js");

const cartToOrder = require("../../model/customer/cartToOrder.js");

const config = require("../../config/config.js");

const fs = require("fs");
const path = require("path");

/**
 * 利用 ChatGPT 的回覆判斷是否為點餐
 * @param {*} text 
 * @returns 
 */
function isOrdering(text) {

    const pattern = /已為您(.+)，還需要什麼呢？$/;
    return pattern.test(text);    

}

function isConfirming(text) {

    const pattern = /(.+)謝謝您的光臨！$/;
    return pattern.test(text);
}

function toChinese(text) {

    text = JSON.stringify(text);
    text = text.replace(/Food/g, "食物");
    text = text.replace(/Description/g, "描述");
    text = text.replace(/Quantity/g, '庫存');
    text = text.replace(/Category/g, '類別');
    text = text.replace(/Ingredient/g, '原料');
    text = text.replace(/Price/g, '價格');
    text = text.replace(/Amount/g, '訂購數量');
    text = text.replace('/Note/g', '備註');

    return text;
}

function extractFoods(str) {

    const foodPattern = /(\d+)[\u4e00-\u9fa5]{1}([\u4e00-\u9fa5]+)/g;
    let match;
    const amounts = [];
    const foods = [];
    while ((match = foodPattern.exec(str)) !== null) {
        amounts.push(parseInt(match[1], 10));
        foods.push(match[2]);
    }
    return [amounts, foods];
}

/**
 * 顧客發送對話給 ChatGPT
 * @param {{text: string}} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.postDiagolue = async function(req, res, next) {

    let customerID = 1;
    let restaurantID = "001";
    let text = req.body.text;
    let restaurantName = "webSocket";

    // 引入 ChatGPT
    const importDynamic = new Function( 'modulePath', 'return import(modulePath)', );
    const { ChatGPTAPI } = await importDynamic("chatgpt");
    const api = new ChatGPTAPI({
        apiKey: config.OPENAI_API_KEY,
        completionParams: {
            model: 'gpt-4',
        }
    });
    
    let command; // 給予 ChatGPT 的指令
    fs.readFile(path.join(__dirname, '../command.txt'), (error, data) => {
        if (error) {
            console.log(error);
        } else {
            command = data;
        }
    })

    let dialogue = await requireDialogue(customerID, restaurantName); // 先前該顧客與 ChatGPT 的對話
    let menu = await requireMenu(restaurantID, restaurantName); // 店家菜單
    let cart = await requireCart(restaurantID, restaurantName, customerID);
    cart = toChinese(cart);
    menu = toChinese(menu);

    let prompt; // 欲發送給 ChatGPT 的 prompt
    if (dialogue) {
        prompt = command + "\n\n菜單內容：" + menu + "\n\n顧客目前訂單內容：" + cart + "\n\n先前對話內容：" + dialogue + text;
    } else {
        prompt = command + menu + text;
    }
    const chatgptResponse = await api.sendMessage(prompt);    
    const chatting = "顧客：" + text + "\n" + "服務生：" + chatgptResponse.text;

    try {
        createDialogue(customerID, chatting, restaurantName);
    } catch(err) {
        console.log(err);
    }

    let chatgptText = chatgptResponse.text;
    if (isOrdering(chatgptText)) {
        // 匹配數量和餐點名稱的正則表達式

        const cancelPart = (chatgptText.match(/取消(.*?)(?=點了|改為|還需要|$)/) || [])[1];
        const orderPart = (chatgptText.match(/點了(.*?)(?=取消|改為|還需要|$)/) || [])[1];
        const changePart = (chatgptText.match(/改為(.*?)(?=取消|點了|還需要|$)/) || [])[1];

        const [orderAmounts, orderFoods] = extractFoods(orderPart || "");
        const [cancelAmounts, cancelFoods] = extractFoods(cancelPart || "");
        const [changeAmounts, changeFoods] = extractFoods(changePart || "");

        if (orderAmounts.length > 0) {
            createCart(customerID, orderAmounts, orderFoods, restaurantID, restaurantName);
        }

        if (cancelAmounts.length > 0) {
            deleteCart(customerID, cancelFoods, restaurantID, restaurantName);
        }

        if (changeAmounts.length > 0) {
            updateCart(customerID, changeAmounts, changeFoods, restaurantID, restaurantName);
        }
    } else if (isConfirming(chatgptText)) {

        const [finalAmount, finalFoods] = extractFoods(chatgptText);
        cartToOrder(customerID, finalAmount, finalFoods, restaurantID, restaurantName);

    }
    
    res.json({
        text: chatgptResponse.text
    }).status(200).end();
}

exports.getDialogue = async function (req, res, next) {

    let customerID = req.params.customerID;
    let restaurantName = "webSocket";

    let dialogue = await requireDialogue(customerID, restaurantName);

    res.json({
        text: dialogue
    });

}