import "dotenv/config";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatCerebras } from "@langchain/cerebras";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import z from "zod";
import { tool } from "@langchain/core/tools";
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts'



// // free 200K
const llm = new ChatCerebras({
    model: "llama-3.3-70b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.CEREBRAS_API_KEY
});

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        ` You are a professional Math Expert, your job is to solve user questions.
        Think step by step through your reasonning and explain your thoughts.

        Instruction :
        - return only  the value of x 
        `,
    ],
    ["user", "here's the user question {input}"],
]);


const jsonOutputSchema = z.object({
  value_of_x: z.number().describe("value of x "),

}).describe('return the value of x');

const structuredLlm = llm.withStructuredOutput(jsonOutputSchema);

const chain = prompt.pipe(structuredLlm);

const chainResult = await chain.invoke({input:"Find the value of x if x+y=12"})


console.log(chainResult);


