const createDialogue = require("../model/createDialogue.js");
const createAndUpdateOrder = require("../model/createAndUpdateOrder.js");
const requireDialogue = require("../model/requireDialogue.js");
const requireMenu = require("../model/requireMenu.js");
const deleteOrder = require("../model/deleteOrder.js");

const config = require("../config/config.js");

const fs = require("fs");
const path = require("path");

/**
 * 利用 ChatGPT 的回覆判斷是否為點餐
 * @param {*} text 
 * @returns 
 */
function isOrdering(text) {

    const pattern = /已為您點了(.+)，還需要什麼呢？$/;
    return pattern.test(text);    

}

function isCancelling(text) {

    const pattern = /已為您取消(.+)，還需要什麼呢？$/;
    const match = pattern.exec(text);

    return pattern.test(text);

    
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
    let restaurantID = req.body.restaurantID;
    let text = req.body.text;
    let restaurantName = req.body.restaurantName;

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
    let prompt; // 欲發送給 ChatGPT 的 prompt
    if (dialogue) {
        prompt = command + "菜單內容：\n" + menu + "先前對話內容：\n" + dialogue + text;
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
        const quantityPattern = /\d+/g;
        const foodPattern = /(\d+[\u4e00-\u9fa5]{1})([\u4e00-\u9fa5]+)/g;

        // 使用 match 方法來找出所有匹配的部分
        const quantities = chatgptText.match(quantityPattern);
        const foods = [];

        // 使用 exec 方法進行全局搜索，並提取餐點名稱
        let match;
        while ((match = foodPattern.exec(chatgptText)) !== null) {
            foods.push(match[2]); // 只提取第二個捕獲組，即餐點名稱
        }
        createAndUpdateOrder(customerID, quantities, foods, restaurantID, restaurantName);
    } else if (isCancelling(chatgptText)) {
        const foodPattern = /\d+[\u4e00-\u9fa5]{1}([\u4e00-\u9fa5]+)/g;

        // 使用 exec 方法進行全局搜索，並提取餐點名稱
        const foods = [];
        let match;
        while ((match = foodPattern.exec(chatgptText)) !== null) {
            foods.push(match[1]); // 只提取第一個捕獲組，即餐點名稱
        }
        deleteOrder(customerID, foods, restaurantID, restaurantName);
    }
    
    res.json({
        text: chatgptResponse.text
    }).status(200).end();
}

exports.getDialogue = async function (req, res, next) {

    let customerID = req.params.customerID;

    let dialogue = await requireDialogue(customerID, restaurantName);

    res.json({
        text: dialogue
    });

}