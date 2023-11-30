const createDialogue = require("../../model/customer/chatgpt/createDialogue.js");
const createCart = require("../../model/customer/chatgpt/createCart.js");
const requireDialogue = require("../../model/customer/chatgpt/requireDialogue.js");
const deleteCart = require("../../model/customer/chatgpt/deleteCart.js");
const updateCart = require("../../model/customer/chatgpt/updateCart.js");

const cartToOrder = require("../../model/customer/cartToOrder.js");

const promptGenerate = require("../../model/customer/chatgpt/promptGenerate.js");

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

    let customerID = req.body.customerID;
    let customerText = "顧客：" + req.body.text;
    let note = "From Digi-Waiter"
    let restaurantName = req.params.restaurantName;

    // 引入 ChatGPT
    const importDynamic = new Function( 'modulePath', 'return import(modulePath)', );
    const { ChatGPTAPI } = await importDynamic("chatgpt");
    const api = new ChatGPTAPI({
        apiKey: config.OPENAI_API_KEY,
        completionParams: {
            model: 'gpt-4',
            temperature: 0.7
        }
    });
    const prompt = await promptGenerate(customerText, customerID, restaurantName);
    const chatgptResponse = await api.sendMessage(prompt);    
    let chatgptText = chatgptResponse.text;
    
    createDialogue(customerID, customerText, chatgptText, restaurantName);
    if (isOrdering(chatgptText)) {
        // 匹配數量和餐點名稱的正則表達式

        const cancelPart = (chatgptText.match(/取消(.*?)(?=點了|改為|還需要|$)/) || [])[1];
        const orderPart = (chatgptText.match(/點了(.*?)(?=取消|改為|還需要|$)/) || [])[1];
        const changePart = (chatgptText.match(/改為(.*?)(?=取消|點了|還需要|$)/) || [])[1];

        const [orderAmounts, orderFoods] = extractFoods(orderPart || "");
        const [cancelAmounts, cancelFoods] = extractFoods(cancelPart || "");
        const [changeAmounts, changeFoods] = extractFoods(changePart || "");

        if (orderAmounts.length > 0) {
            createCart(orderAmounts, note, orderFoods, customerID, restaurantName);
        }

        if (cancelAmounts.length > 0) {
            deleteCart(customerID, cancelFoods, restaurantName);
        }

        if (changeAmounts.length > 0) {
            updateCart(customerID, changeAmounts, changeFoods, restaurantName);
        }
    } else if (isConfirming(chatgptText)) {

        const [finalAmount, finalFoods] = extractFoods(chatgptText);
        cartToOrder(customerID, finalAmount, finalFoods, restaurantName);

    }
    
    res.status(200).send({text: chatgptText});
}

exports.getDialogue = async function (req, res, next) {

    let customerID = req.query.customerID;
    let restaurantName = req.params.restaurantName;

    try {
        let dialogue = await requireDialogue(customerID, restaurantName);
        res.send(dialogue);
    } catch(error) {
        res.send(error);
    }

    res.send(dialogue);

}