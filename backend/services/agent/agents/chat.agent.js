import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getMemory } from "../utils/memory.js";
import { getModel } from "../utils/model.js";
import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";


export const chatAgent =
async(state)=>{

await checkAgentLimit(
    state.userId,
    "chat"
  );

   await deductCredits(

        state.userId,

        "chat"

    );


 const llm =
 getModel("chat");

 const history =
 await getMemory(
  state.conversationId
 );

 

const formatSearchResults = (data) => {
  if (Array.isArray(data)) {
    if (data.length === 0) return null;
    return data.map((r, i) =>
      `${i + 1}. ${r.title || "Untitled"}\n   URL: ${r.url || ""}\n   ${r.content || ""}`
    ).join("\n\n");
  }

  if (data && typeof data === "object") {
    const results = Array.isArray(data.results) ? data.results : [];
    if (results.length === 0) {
      return data.answer ? `Answer: ${data.answer}` : null;
    }
    return results.map((r, i) =>
      `${i + 1}. ${r.title || "Untitled"}\n   URL: ${r.url || ""}\n   ${r.content || ""}`
    ).join("\n\n");
  }

  return null;
};

const searchText = formatSearchResults(state.searchResults);

const searchContext = searchText
  ? `
Web Search Results:

${searchText}

Answer the user using only the above search results.
`
  : ""




 const messages = [

  new SystemMessage(
`
You are CortexAI, an intelligent AI assistant.

${searchContext}



If searchContext exists:

- Use search results to answer.
- Do not mention internal tools.

Rules:

- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.




`
  )

 ];

 history.forEach((msg)=>{

  if(
   msg.role === "user"
  ){

   messages.push(

    new HumanMessage(
     msg.content
    )

   );

  }

  if(
   msg.role === "assistant"
  ){

   messages.push(

    new AIMessage(
     msg.content
    )

   );

  }

 });

 const last = history[history.length - 1];
 const lastIsCurrent = last && last.role === "user" && last.content === state.prompt;

 if (!lastIsCurrent) {
  messages.push(
   new HumanMessage(
    state.prompt
   )
  );
 }

 const response = await llm.invoke(messages);



const images = state.searchResults?.images || [];



return {
  ...state,

  response:response.content,
  images:images
  
};

};