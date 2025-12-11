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
import { queryVectorDB } from "./retrieving-pipeline.js";

const model = new ChatCerebras({
    model: "llama-3.3-70b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.CEREBRAS_API_KEY
});




const retrieverTool = tool(
  async ({ query }) => {
    const retrievedDocs = await queryVectorDB(query)
    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      )
      .join("\n");
    return serialized
  },
  {
    name: "retrieve",
    description: "Retrieve information related to a query.",
    schema:  z.object({ query: z.string() }),
  }
);





const agent = createAgent({
     model,
     tools:[retrieverTool], 
     systemPrompt:`
     You have access to a tool that retrieves context from a blog post.
     Use the tool to help answer user queries.
     ` 
});



const agentOutput= await agent.invoke({ 
    messages: [{ role: "user", content: `Different types of Prompt Engineering.` }] }, {
  streamMode: "values",
});

const aiResponse = agentOutput.messages[agentOutput.messages.length - 1].content

console.log(aiResponse)




