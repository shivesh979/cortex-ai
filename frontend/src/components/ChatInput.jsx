import { useState } from "react";
import { Send, Paperclip,  Square, Zap, MessageSquare, Code2, Presentation, Image as ImageIcon, Globe, FileText,X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts, setIsLoading } from "../redux/message.slice";
import { sendPrompt } from "../features/agent.api";
import { Mic, MicOff } from "lucide-react";
import { useEffect } from "react";
import { createConversation, updateConversations } from "../features/conversation.api";
import { addConversation, setConvTitle, setSelectedConversation } from "../redux/conversation.slice";
import { useRef } from "react";

export default function ChatInput({
  setBanner
}) {
  const [selectedAgent, setSelectedAgent] =useState("auto");
  const [value, setValue] = useState("");
const [isListening, setIsListening] = useState(false);

const recognitionRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector(state => state.conversation);
   const { isLoading } = useSelector(state => state.message);
const fileRef = useRef(null);

const [

selectedFile,

setSelectedFile

]=useState(null);

   const placeholders={

auto:"Ask CortexAI...",

chat:"Chat with CortexAI...",

coding:"Describe the software you want...",

pdf:"Generate a PDF about...",

ppt:"Create a presentation about...",

image:"Describe the image...",

search:"Search the web..."

};

   const agents = [

  {
    id:"auto",
    icon:Zap,
    label:"Auto"
  },

  {
    id:"chat",
    icon:MessageSquare,
    label:"Chat"
  },

  {
    id:"coding",
    icon:Code2,
    label:"Coding"
  },

  {
    id:"pdf",
    icon:FileText,
    label:"PDF"
  },

  {
    id:"ppt",
    icon:Presentation,
    label:"PPT"
  },

  {
    id:"image",
    icon:ImageIcon,
    label:"Image"
  },

  {
    id:"search",
    icon:Globe,
    label:"Search"
  }

];

useEffect(() => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";

  recognition.interimResults = true;

  recognition.continuous = true;

  recognition.onresult = (event) => {

    let transcript = "";

    for (

      let i = event.resultIndex;

      i < event.results.length;

      i++

    ) {

      transcript += event.results[i][0].transcript;

    }

    setValue(transcript);

  };

  recognition.onend = () => {

    setIsListening(false);

  };

  recognitionRef.current = recognition;

}, []);

const toggleMic = () => {

  if (!recognitionRef.current) {

    alert("Speech Recognition not supported");

    return;

  }

  if (isListening) {

    recognitionRef.current.stop();

    setIsListening(false);

  } else {

    recognitionRef.current.start();

    setIsListening(true);

  }

};


  const handleSend = async () => {
    const prompt = value.trim();
    if (!prompt) return;

    dispatch(setIsLoading(true));

    try {


      let conversation = selectedConversation;

      if (!conversation) {
        const newConversation = await createConversation();
        dispatch(addConversation(newConversation));
        dispatch(setSelectedConversation(newConversation));
        conversation = newConversation;
      }

      if (conversation.title === "New Chat") {
        await updateConversations(conversation._id, prompt.slice(0, 40));
        dispatch(setConvTitle({ conversationId: conversation._id, title: prompt.slice(0, 40) }));
      }

      dispatch(addMessage({ role: "user", content: prompt }));
      setValue("");

      const formData = new FormData();

formData.append(
    "conversationId",
    conversation._id
);

formData.append(
    "prompt",
    prompt
);

formData.append(
    "agent",
    selectedAgent
);

if(selectedFile){

    formData.append(
        "file",
        selectedFile
    );

}

setSelectedFile(null)

      const data = await sendPrompt(formData);
    console.log(data)
     dispatch(
  addMessage({
    role: "assistant",
    content: data.answer,
    images:data.images
  })
);

console.log(data)

if(data.artifacts){
  dispatch(
    setArtifacts(
      data.artifacts
    )
  );
}}
catch(error){

  setBanner({

    open:true,

    title:
      error.response?.data?.title ||
      "Something went wrong",

    message:
      error.response?.data?.message ||
      "Please try again."

  });

}
  finally {
       dispatch(setIsLoading(false));
    }
  };

  return (
   <div className="w-full overflow-hidden px-3 md:px-5 pt-3 md:pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-[#262626] bg-[#0A0A0A]">
      <div className="flex flex-col gap-2 bg-[#111111] border border-[#404040] rounded-2xl px-4 pt-3.5 pb-3 transition-colors duration-200 focus-within:border-white overflow-hidden">


    <div className="flex w-full gap-2 pr-2 overflow-x-auto flex-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">

    {agents.map((agent) => {

      const Icon = agent.icon;
      const isActive = selectedAgent === agent.id;

      return (

        <button
          key={agent.id}
          onClick={() => setSelectedAgent(agent.id)}
          className={`
            flex-shrink-0
            
            inline-flex
            items-center
            gap-1.5
            px-3
            py-2
            rounded-full
            text-xs
            font-medium
            border
            whitespace-nowrap
            transition-all

            ${
              isActive
                ? "bg-white text-black border-white"
                : "bg-[#111111] text-neutral-200 border-[#404040] hover:bg-[#1F1F1F] hover:text-white"
            }
          `}
        >

          <Icon
            size={14}
            className={
              isActive
                ? "text-black"
                : "text-neutral-500"
            }
          />

          {agent.label}

        </button>

      );

    })}


</div>

{

selectedFile && (

<div className="my-3">

<div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 max-w-full overflow-hidden">

{

selectedFile.type==="application/pdf"

?

<FileText

size={16}

className="text-neutral-200"

/>

:



selectedFile?.type.startsWith("image/")

&&

<img

src={URL.createObjectURL(selectedFile)}

className="h-10 w-10 rounded-xl object-cover mt-3"

/>



}

<div>

<p className="text-xs text-white truncate min-w-0 max-w-[55vw] sm:max-w-[200px]">

{

selectedFile.name

}

</p>

<p className="text-[10px] text-neutral-500">

{

Math.ceil(

selectedFile.size/

1024

)

}

KB

</p>

</div>

<button

onClick={()=>{

setSelectedFile(null);

fileRef.current.value="";

}}

className="ml-2"

>

<X

size={14}

className="text-neutral-500 hover:text-white"

/>

</button>

</div>

</div>

)
}


        {/* Textarea */}
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={
placeholders[selectedAgent]
}
          rows={3}
          disabled={isLoading}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-white placeholder:text-neutral-500 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between">

          {/* Left — attach + mic */}
          <div className="flex items-center gap-1">
  <input

ref={fileRef}

type="file"

hidden

accept=".pdf,image/*"

onChange={(e)=>{

const file =
e.target.files[0];

if(file){

setSelectedFile(file);

}

}}

/>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer"
            onClick={()=>
fileRef.current.click()
}
            >
              <Paperclip size={14} />
            </button>
           <button

onClick={toggleMic}

className={`

flex

items-center

justify-center

w-8

h-8

rounded-lg

transition-all

cursor-pointer

${

isListening

?

"bg-white text-black"

:

"text-neutral-500 hover:bg-white/[0.05]"

}

`}

>

{

isListening

?

<MicOff size={14}/>

:

<Mic size={14}/>

}

</button>
          </div>

          {/* Right — send / stop */}
          <button
            onClick={handleSend}
            disabled={!isLoading && !value.trim()}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150
              ${isLoading
                ? "bg-white text-[#0A0A0A] hover:bg-neutral-200"
                : value.trim()
                ? "bg-white text-[#0A0A0A] hover:bg-neutral-200"
                : "bg-white/[0.05] text-neutral-500 cursor-not-allowed"
              }`}
          >
            {isLoading ? <Square size={12} fill="currentColor" /> : <Send size={14} />}
          </button>

        </div>
      </div>

      <p className="text-center text-[10.5px] text-neutral-700 mt-2.5">
        CortexAI can make mistakes. Verify important info.
      </p>
    </div>
  );
}