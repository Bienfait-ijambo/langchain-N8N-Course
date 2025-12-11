import "dotenv/config";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatCerebras } from "@langchain/cerebras";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";





// // free 1M
const llm= new ChatFireworks({
        model: "accounts/fireworks/models/deepseek-v3p1",
        temperature: 0.7,
        apiKey: process.env.FIRE_WORKS_API_KEY,
      });

  

// 200K
// const llm = new ChatCerebras({
//     model: "llama-3.3-70b",
//     temperature: 0,
//     maxTokens: undefined,
//     maxRetries: 2,
//     apiKey: process.env.CEREBRAS_API_KEY
// });

// system message
// humanMessage
// aiMessage

function getChatHistory(){
    return [
 new HumanMessage('hello'),
    new AIMessage('How can I assist you to day '),
new HumanMessage('Do you know what was my previous message'),
new AIMessage('Your previous message was hello'),
new HumanMessage('I m Ben'),
new HumanMessage('Do you know me'),
new AIMessage("You told me your name is Ben, but I don't have any personal knowledge about you beyond this conversation. I'm a text-based AI assistant, and our conversation just started, so I don't have any prior information about you."),

new HumanMessage('what was my previous message and yours'),

    ]
}
const aiMsg = await llm.invoke([
   
    new SystemMessage(`Your are helpful ai assistant respond the user only in English.
        RULES
        - if the user provide or input a message which is not in English language,
           say eg: sorry I dont understand this language
        `),

        ...getChatHistory(),

        new HumanMessage('return an array')
        // array is 20K tokens
   
]);

function storeAIMessage(){

}
console.log(aiMsg?.content)


// ADD SIMple Chat History : CHAT HISTORY 