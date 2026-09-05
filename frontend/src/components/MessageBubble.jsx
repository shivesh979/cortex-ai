import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiExternalLink, FiX } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Copy, Check } from "lucide-react";

/* Restrained monochrome syntax theme (no colorful highlighting) */
const monoPrism = {
  'code[class*="language-"]': {
    color: "#E5E5E5",
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
    fontSize: "13px",
    textShadow: "none",
  },
  'pre[class*="language-"]': {
    color: "#E5E5E5",
    background: "transparent",
    textShadow: "none",
  },
  comment: { color: "#737373", fontStyle: "italic" },
  prolog: { color: "#737373" },
  cdata: { color: "#737373" },
  doctype: { color: "#737373" },
  punctuation: { color: "#A3A3A3" },
  property: { color: "#FFFFFF" },
  tag: { color: "#D4D4D4" },
  boolean: { color: "#FFFFFF" },
  number: { color: "#D4D4D4" },
  constant: { color: "#FFFFFF" },
  symbol: { color: "#A3A3A3" },
  selector: { color: "#A3A3A3" },
  "attr-name": { color: "#D4D4D4" },
  string: { color: "#E5E5E5" },
  char: { color: "#E5E5E5" },
  builtin: { color: "#FFFFFF" },
  inserted: { color: "#FFFFFF" },
  function: { color: "#FFFFFF", fontWeight: 500 },
  "class-name": { color: "#FFFFFF", fontWeight: 500 },
  keyword: { color: "#FFFFFF", fontWeight: 500 },
  operator: { color: "#A3A3A3" },
  entity: { color: "#E5E5E5" },
  url: { color: "#E5E5E5" },
  "attr-value": { color: "#E5E5E5" },
  regex: { color: "#E5E5E5" },
  atrule: { color: "#FFFFFF" },
  important: { color: "#FFFFFF", fontWeight: 500 },
};

function MessageBubble({ role, content ,images}) {
  const isUser = role === "user";
  const [lightboxSrc, setLightboxSrc] = useState(null);
const [copiedCode, setCopiedCode] = useState("");
const copyCode = async (code) => {
  await navigator.clipboard.writeText(code);

  setCopiedCode(code);

  setTimeout(() => {
    setCopiedCode("");
  }, 2000);
};

const markdown = (content || "")
  .replace(/```review/gi, "```")
  .replace(/```text/gi, "```")
  .replace(/```[a-zA-Z0-9_-]+\s+id="[^"]*"/g, "```");
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[85vw] min-w-0 sm:max-w-[80%] md:max-w-[72%]
  px-4 py-2.5 rounded-2xl
  break-words overflow-hidden
  leading-relaxed
        ${
          isUser
            ? "bg-[#1F1F1F] border border-[#262626] text-white rounded-tr-sm"
            : " text-neutral-200 rounded-tl-sm"
        }`}
      >
        {images.length > 0 && (
    <div className="flex flex-wrap gap-3 mt-4">
        {images.map((img, i) => (
            <img
                key={i}
                src={img}
                loading="lazy"
                onClick={() => setLightboxSrc(img)}
                onError={(e)=>e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
            />
        ))}
    </div>
)}<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mt-5 mb-3 text-white">{children}</h1>
    ),

    h2: ({ children }) => (
      <h2 className="text-xl font-semibold mt-4 mb-2 text-white">{children}</h2>
    ),

    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mt-3 mb-2 text-white">{children}</h3>
    ),

    p: ({ children }) => (
      <p className="mb-3 whitespace-pre-wrap break-words">
        {children}
      </p>
    ),

    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1 my-2">
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-1 my-2">
        {children}
      </ol>
    ),

    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-white/10">
          {children}
        </table>
      </div>
    ),

    th: ({ children }) => (
      <th className="border border-white/10 bg-white/5 px-3 py-2 text-left">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="border border-white/10 px-3 py-2">
        {children}
      </td>
    ),

    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-white underline hover:text-neutral-200 inline-flex items-center gap-1"
      >
        {children}
        <FiExternalLink size={11} />
      </a>
    ),

    img: ({ src }) => {
      if (!src) return null;

      return (
        <img
          src={src}
          loading="lazy"
          onClick={() => setLightboxSrc(src)}
          onError={(e) => e.currentTarget.remove()}
          className="w-40 h-28 rounded-xl object-cover cursor-pointer"
        />
      );
    },

    code({ className, children }) {
      console.log(children)
      const value = String(children)
  .replace(/^\s*```[^\n]*\n/, "")
  .replace(/\n```\s*$/, "")
  .trim();

      if (!className) {
        return (
          <code className="px-1.5 py-0.5 rounded bg-white/10 text-white">
            {value}
          </code>
        );
      }

      const language = className.replace("language-", "");

      return (
        <div className="my-4 overflow-hidden rounded-xl border border-[#262626] bg-[#111111]">

          <div className="flex items-center justify-between bg-[#171717] border-b border-white/10 px-4 py-2">

            <span className="uppercase text-xs text-neutral-500">
              {language}
            </span>

            <button
              onClick={() => copyCode(value)}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors duration-150 cursor-pointer"
            >
              {copiedCode === value ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>

          </div>

          <SyntaxHighlighter
            language={language}
            style={monoPrism}
            wrapLongLines
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: "16px",
              background: "#111111",
              fontSize: "13px",
            }}
          >
            {value}
          </SyntaxHighlighter>

        </div>
      );
    },
  }}
>
  {markdown}
</ReactMarkdown>
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
          >
            <FiX size={20} />
          </button>
          <img
            src={lightboxSrc}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;