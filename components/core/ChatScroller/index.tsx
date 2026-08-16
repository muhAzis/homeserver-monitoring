import ToolCallCard from "@/components/pages/ChatbotHistoryView/ToolCallCard";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { UIDataTypes, UIMessage, UITools } from "ai";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Icon from "../Icon";
import { cn } from "@/lib/utils";

const REMARK_PLUGINS = [remarkGfm];

export type T_Message = {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  tool_metadata: any;
  created_at: string;
}

type T_ChatScroller = {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  isGenerating: boolean;
}

const ChatScroller = ({messages, isGenerating}: T_ChatScroller) => {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport className="scrollbar-none">
          <MessageScrollerContent>
            {messages.map((msg) => <Chat key={`message-${msg.id}`} msg={msg} />)}
            {isGenerating && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-text-muted">TIARA (Agent)</p>
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-dark-200 flex items-center justify-center">
                    <Icon icon="LuBot" size={16} className="text-dark-500" />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-dark-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-300 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-300 animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-300 animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

const Chat = ({msg}: {msg: UIMessage<unknown, UIDataTypes, UITools>}) => {
  const msgArranged = useMemo(() => {
    const partsList: any[] = [];
    let pendingText: any = null;

    msg.parts?.forEach((part) => {
      if (part.type === "text") {
        if (pendingText) {
          partsList.push(pendingText);
        }
        pendingText = part;
      } else if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
        partsList.push({
          ...part,
          contextText: pendingText ? pendingText.text : undefined
        });
        pendingText = null;
      } else {
        if (pendingText) {
          partsList.push(pendingText);
          pendingText = null;
        }
        partsList.push(part);
      }
    });
    if (pendingText) partsList.push(pendingText);
    return partsList;
  }, [msg.parts]);

  const renderMsg = (data: any, idx: number, isUser: boolean = false) => {
    if (data.type === "text") {
      return (
        <div key={idx} className={cn("overflow-x-auto text-sm [&_p]:mb-3 [&_p]:leading-relaxed [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1.5 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:my-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-2 [&_h3]:font-bold [&_h3]:my-2 [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_table]:text-xs [&_th]:border [&_th]:border-dark-300 [&_th]:bg-dark-100 dark:[&_th]:border-dark-700 dark:[&_th]:bg-dark-800 [&_th]:p-2 [&_th]:font-semibold [&_th]:text-left [&_td]:border [&_td]:border-dark-200 dark:[&_td]:border-dark-800 [&_td]:p-2", isUser ? "text-white" : "text-dark-700 dark:text-dark-100")}>
          <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>{data.text as string}</ReactMarkdown>
        </div>
      );
    }

    if (data.type === "reasoning") {
      return (
        <div key={idx} className="italic bg-dark-100/50 dark:bg-dark-800/50 border-l-2 border-dark-300 dark:border-dark-600 text-dark-700 dark:text-dark-200 pl-3 py-1 my-1 rounded">
          {data.text}
        </div>
      );
    }
    
    const isTool = data.type.startsWith("tool-") || data.type === "dynamic-tool";
    if (isTool) {
      const toolName = data.type === "dynamic-tool" 
        ? data.toolName 
        : data.type.replace("tool-", "");
      
      return (
        <ToolCallCard
          key={data.toolCallId || idx}
          name={toolName}
          arguments={data.input}
          result={data.state === "output-available" ? data.output : data.errorText}
          isStreaming={data.state === "input-streaming"}
          title={data.contextText}
          appendedResultText={data.appendedResultText}
          isError={data.state === "output-error"}
        />
      );
    }

    return null;
  }
  
  return (
    <MessageScrollerItem
      key={msg.id}
      messageId={msg.id}
      scrollAnchor={msg.role === "user"}
    >
      <Message align={msg.role === "user" ? "end" : "start"}>
        <MessageContent>
          {msg.role === "user"
          ? <Bubble>
              <BubbleContent className={cn("rounded-2xl rounded-tr-md")}>
                {msgArranged.map((part, idx) => renderMsg(part, idx, true))}
              </BubbleContent>
            </Bubble>
          : <div className="flex flex-col gap-2">
              <p className="text-xs text-text-muted">TIARA (Agent)</p>
              {msgArranged.map((part, idx) => renderMsg(part, idx, false))}
            </div>}
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  );
}

export const dbMsgToUi = (msg: any): UIMessage => {
  if (!msg) return {} as UIMessage;
  
  const parts: any[] = [];

  let meta: any = {};
  if (msg.tool_metadata) {
    try {
      meta = typeof msg.tool_metadata === "string" 
        ? JSON.parse(msg.tool_metadata) 
        : msg.tool_metadata;
    } catch (err) {
      console.error("[UI] Failed parsing JSON tool_metadata", err);
    }
  }

  if (meta.parts && Array.isArray(meta.parts)) {
    meta.parts.forEach((p: any) => {
      if (p.type === "text") {
        parts.push({ type: "text", text: p.text });
      } else if (p.type === "step-start") {
        parts.push({ type: "step-start" });
      } else if (p.type === "tool") {
        let outputVal = undefined;
        if (p.result) {
          if (typeof p.result === "object") {
            outputVal = p.result.output ?? p.result.result ?? JSON.stringify(p.result);
          } else {
            outputVal = p.result;
          }
        } else if (p.output) {
          if (typeof p.output === "object") {
            outputVal = p.output.output ?? p.output.result ?? JSON.stringify(p.output);
          } else {
            outputVal = p.output;
          }
        }

        parts.push({
          type: `tool-${p.name || "unknown"}`,
          state: (p.error || p.state === "output-error") ? "output-error" : "output-available",
          toolCallId: p.toolCallId || `call_${Math.random().toString(36).slice(2, 8)}`,
          input: p.args || p.input || {},
          output: outputVal,
          errorText: p.error || undefined,
          providerExecuted: true,
        });
      }
    });
  } else {
    if (msg.content) {
      parts.push({ type: "text", text: msg.content });
    }

    if (meta.toolCalls && Array.isArray(meta.toolCalls)) {
      meta.toolCalls.forEach((tc: any) => {
        let outputVal = undefined;
        if (tc.result) {
          if (typeof tc.result === "object") {
            outputVal = tc.result.output ?? tc.result.result ?? JSON.stringify(tc.result);
          } else {
            outputVal = tc.result;
          }
        } else if (tc.output) {
          if (typeof tc.output === "object") {
            outputVal = tc.output.output ?? tc.output.result ?? JSON.stringify(tc.output);
          } else {
            outputVal = tc.output;
          }
        }

        parts.push({
          type: `tool-${tc.name || tc.toolName || "unknown"}`,
          state: tc.error ? "output-error" : "output-available",
          toolCallId: tc.toolCallId || `call_${Math.random().toString(36).slice(2, 8)}`,
          input: tc.args || tc.arguments || tc.input || {},
          output: outputVal,
          errorText: tc.error || undefined,
          providerExecuted: true,
        });
      });
    }
  }

  return {
    id: msg.id || Math.random().toString(36).slice(2),
    role: (msg.role === "tool" ? "assistant" : msg.role) as "user" | "assistant" | "system",
    parts: parts,
  };
}

export default ChatScroller;