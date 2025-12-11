import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import {
    // BaseMessage,
    SystemMessage,
    HumanMessage,
} from "@langchain/core/messages";
import { createAgent } from "langchain";
import { ChatCerebras } from "@langchain/cerebras";
import "dotenv/config";

const model = new ChatCerebras({
    model: "llama-3.3-70b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.CEREBRAS_API_KEY
});



const agent = createAgent({
    model,
    systemPrompt: 'Your are a helpfull AI assistant that chat with User in English'
});



const agentOutput = await agent.invoke({
    messages: [new HumanMessage('hello')],
});
const aiResponse = agentOutput.messages[agentOutput.messages.length - 1].content

console.log(aiResponse)


