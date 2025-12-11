import "dotenv/config";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatCerebras } from "@langchain/cerebras";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import z from "zod";




// // free 1M
const llm = new ChatFireworks({
    model: "accounts/fireworks/models/deepseek-v3p1",
    temperature: 0.7,
    apiKey: process.env.FIRE_WORKS_API_KEY,
})


const jsonOutput2 = z.object({
  benIsKnown:z.boolean().describe('true of false')
}).describe('return true of false');

const jsonOutput = z.object({
  topics: z.array(z.string()).describe("array of topics"),
 
}).describe('array of topics');

const structuredLlm = llm.withStructuredOutput(jsonOutput2);
const result = await structuredLlm.invoke([
   
    new SystemMessage(`Your are helpful ai assistant respond the user only in English.
        RULES
        - if the user provide or input a message which is not in English language,
           say eg: sorry I dont understand this language
        `),

        new HumanMessage('do you know Ben00003 in Marvel Movie')
   
]);


console.log('result :: ',result)
