import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import {
    // BaseMessage,
    SystemMessage,
    HumanMessage,
} from "@langchain/core/messages";
import { createAgent } from "langchain";
import { ChatCerebras } from "@langchain/cerebras";
import { ExaSearchResults } from "@langchain/exa";
import Exa from "exa-js";

import "dotenv/config";

const model = new ChatCerebras({
    model: "llama-3.3-70b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.CEREBRAS_API_KEY
});



const client = new Exa(process.env.EXA_SEARCH_API_KEY);
const searchTool = tool(
  async ({ query }) => {

    const exaTool = new ExaSearchResults({
      client,
      searchArgs: {
        numResults: 1,
        type: 'keyword',
      },
    })


    const result = await exaTool.invoke(query);
    return result

  },
  {
    name: "search_web",
    description: "Search the web  to find real-time information.",
    schema: z.object({
      query: z.string(),
    }),
  }
);


const agent = createAgent({
    model,
    tools:[searchTool],
    systemPrompt: 'Your are a helpfull AI assistant that chat with User in English'
});



const agentOutput = await agent.invoke({
    messages: [new HumanMessage('hello'),new HumanMessage('What the current weather in New york')],
}, {
    recursionLimit: 30,
});
const aiResponse = agentOutput.messages[agentOutput.messages.length - 1].content

console.log(agentOutput)

