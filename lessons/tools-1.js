import "dotenv/config";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatCerebras } from "@langchain/cerebras";
import { AIMessage, HumanMessage, ToolMessage, SystemMessage } from "@langchain/core/messages";
import z from "zod";
import { tool } from "@langchain/core/tools";
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableLambda } from "@langchain/core/runnables";




const multiply = tool(
  ({ a, b,c }) => {
    /**
     * Multiply two numbers.
     */
    return a * b* c;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
        c: z.number(),
    }),
  }
);

const fetchUserInfoTool = tool(
  ({ userId }) => {
    if(!userId) return {}
   return{
    name:"Ben",
    email:"ben@gmail.com",
    address:{},
    skills:['js','python']
   }
  },
  {
    name: "user_info",
    description: "fetch user details in userSchema",
    schema: z.object({
      userId: z.string(),
    }),
  }
);

// const multiplyResultTool=await multiply.invoke({a:1,b:4,c:4})
// console.log(multiplyResultTool)
// const users=await fetchUserInfoTool.invoke({userId:"dkdk"})
// console.log(users)


// // free 1M
const llm= new ChatFireworks({
        model: "accounts/fireworks/models/deepseek-v3p1",
        temperature: 0.7,
        apiKey: process.env.FIRE_WORKS_API_KEY,
      }).bindTools([multiply,fetchUserInfoTool])
const aiResult=await llm.invoke("what is 2 times 9, times 8 ,call multiply tool")

 const result = await multiply.invoke(aiResult?.tool_calls[0]?.args);
 
      const toolMessage= new ToolMessage({
        content: String(result), // Content must be a string
        tool_call_id: aiResult?.tool_calls[0]?.id
      });
      console.log("toolmesage :: ",toolMessage)