import "dotenv/config";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatCerebras } from "@langchain/cerebras";
import { AIMessage, HumanMessage, ToolMessage, SystemMessage } from "@langchain/core/messages";
import z from "zod";
import { tool } from "@langchain/core/tools";
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableLambda } from "@langchain/core/runnables";
import { ExaSearchResults } from "@langchain/exa";
import Exa from "exa-js";

// // free 200K
const llm = new ChatCerebras({
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



const multiply = tool(
  ({ a, b }) => {

    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const chain = await llm.bindTools([multiply, searchTool])


const toolChain = RunnableLambda.from(async (userInput) => {

  const aiMsg = await chain.invoke([
    {
      role: "user",
      content: userInput
    }
  ]);


  // If no tools were called, we are done
  if (!aiMsg.tool_calls || aiMsg.tool_calls.length === 0) {
    return aiMsg;
  }



  const toolExecutionPromises = aiMsg.tool_calls.map(async (toolCall) => {


    if (toolCall.name === 'search_web') {
      const result = await searchTool.invoke(toolCall.args);
      return new ToolMessage({
        content: String(result), // Content must be a string
        tool_call_id: toolCall.id,
      });

    }

    if (toolCall.name === 'multiply') {
      const result = await multiply.invoke(toolCall.args);
      return new ToolMessage({
        content: String(result), // Content must be a string
        tool_call_id: toolCall.id,
      });

    }
    // Handle other tools similarly if needed
    return null;
  }).filter(msg => msg !== null); // Filter out any nulls

  const toolMessages = await Promise.all(toolExecutionPromises);


  const chainResult=await chain.invoke([
    {
      role:"user",
      content:userInput
    },
    aiMsg,
    ...toolMessages
  ])
  return chainResult



})


const result = await toolChain.invoke('what is the current weather in New york ?')
// const result = await toolChain.invoke('what is 2 * 3, use multiply tool')



console.log('final result:::', result)