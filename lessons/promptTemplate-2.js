import "dotenv/config";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatCerebras } from "@langchain/cerebras";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import z from "zod";
import { tool } from "@langchain/core/tools";
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts'



// // free 1M


// // free 200K
const llm = new ChatCerebras({
    model: "llama-3.3-70b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.CEREBRAS_API_KEY
});

const generate_question_prompt= PromptTemplate.fromTemplate(`
You are an AI search assistant. 
	The user asked: {question}

	Step back and consider this question more broadly:
	1. Reframe it in general terms.  
	2. Identify the main themes or dimensions involved.  
	3. Generate 5 diverse search queries that cover these dimensions, 
	   ensuring each query explores a different perspective or phrasing. 
      `)

const jsonOutputSchema = z.object({
  questions: z.array(z.string()).describe("array of questions "),

}).describe('return an array of questions');

const structuredLlm = llm.withStructuredOutput(jsonOutputSchema);

const chain = generate_question_prompt.pipe(structuredLlm);

const chainResult = await chain.invoke({question:"What is RAG and How it works"})


console.log(chainResult);


