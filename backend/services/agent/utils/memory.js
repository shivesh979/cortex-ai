import redis from "../../../shared/redis/redis.js";
import { getConversationHistory } from "./getConv.js";


export const getMemory =
async(conversationId)=>{

 const key =
 `conversation:${conversationId}`;

 const cached =
 await redis.get(key);

 if(cached){

  return JSON.parse(
   cached
  );

 }

 const messages =
 await getConversationHistory(
  conversationId
 );

 await redis.set(

  key,

  JSON.stringify(
   messages
  ),

  "EX",

  86400

 );

 return messages;

};


export const addMessage =
async(
 conversationId,
 role,
 content
)=>{

 const key =
 `conversation:${conversationId}`;

 const existing =
 await redis.get(key);

 let messages = [];

 if (existing) {
  messages = JSON.parse(existing);
 } else {
  // Cache miss (fresh conversation or expired TTL) — rebuild the full
  // history from the chat service so earlier turns are not lost.
  try {
   const history = await getConversationHistory(conversationId);
   if (Array.isArray(history)) {
    messages = history.map((m) => ({
     role: m.role || "assistant",
     content: typeof m.content === "string" ? m.content : JSON.stringify(m.content ?? "")
    }));
   }
  } catch (err) {
   // History is unavailable — start with an empty list.
  }
 }

 messages.push({
  role,
  content
 });

 if(messages.length > 20){

  messages.shift();

 }

 await redis.set(

  key,

  JSON.stringify(
   messages
  ),

  "EX",

  86400

 );

}