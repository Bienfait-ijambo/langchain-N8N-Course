import { RunnableSequence } from "@langchain/core/runnables";
import { RunnableLambda } from "@langchain/core/runnables";
import { RunnableParallel } from "@langchain/core/runnables";


const runnable1 = RunnableLambda.from((x) => x.toString());

const runnable2 = RunnableLambda.from((x) => x.toLocaleUpperCase());
const runnable3 = RunnableLambda.from((x) => x.slice(0,2));

// const result=await runnable2.batch(['hello','js','python'])
// console.log( result)


const chain= runnable1.pipe(runnable2).pipe(runnable3)
const chainResult=await chain.invoke('hello')
console.log(chainResult)


// Core Methods:
// - invoke(): Executes the runnable with a single input and returns a single output.
// - batch(): Processes a list of inputs efficiently, often in parallel, and returns a list of outputs.

// const result=await runnable2.batch(['hello',"dog","bana"])
// console.log(result)

// const chain = new RunnableSequence({
//   first: runnable1,
//   middle:[runnable2],
//   last: runnable3,
// });

// const chain= runnable1.pipe(runnable2).pipe(runnable3)
// const result=await chain.invoke('hello')
// console.log(result)