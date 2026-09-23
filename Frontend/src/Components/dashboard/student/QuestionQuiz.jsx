import React from "react";
import { FileText, Lightbulb, MessageSquare, Loader2, Send } from "lucide-react";

const QuestionQuiz = ({
  currentQuiz,
  chatMessages,
  chatInput,
  setChatInput,
  sendingChat,
  handleAskAssistant,
  handleSendChatForm
}) => {
  if (!currentQuiz) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left 2 Cols: Question Cards */}
      <div className="lg:col-span-2 space-y-3">
        <div className="bg-paper p-5 rounded-2xl border border-line shadow-sm">
          <h3 className="font-display font-bold text-sm text-ink mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet" />
            Study Questions ({currentQuiz.questions.length})
          </h3>

          <div className="space-y-3">
            {currentQuiz.questions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-xl border border-line text-xs sm:text-sm font-sans"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-violet/10 text-violet font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="font-medium text-ink leading-relaxed">{q.question}</p>
                  </div>

                  {/* Quick Get Answer Button */}
                  <button
                    type="button"
                    onClick={() =>
                      handleAskAssistant(
                        `Give step-by-step answer for Question ${idx + 1}: ${q.question}`
                      )
                    }
                    className="px-3 py-1.5 bg-violet/10 hover:bg-violet/20 text-violet font-sans font-bold text-xs rounded-lg flex items-center gap-1 flex-shrink-0 cursor-pointer transition-all"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Get Answer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Col: AI Assistant Chat */}
      <div className="lg:col-span-1 bg-paper p-4 rounded-2xl border border-line shadow-sm flex flex-col h-[520px]">
        <div className="pb-3 border-b border-line mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-violet" />
          <div>
            <h4 className="font-display font-bold text-xs text-ink">AI Assistant</h4>
            <p className="font-sans text-[10px] text-ink-soft">Click "Get Answer" or ask below</p>
          </div>
        </div>

        {/* Chat Messages Timeline */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs font-sans">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-violet text-white rounded-br-none shadow-sm"
                    : "bg-white text-ink rounded-bl-none border border-line"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {sendingChat && (
            <div className="flex justify-start">
              <div className="bg-white p-2.5 rounded-2xl text-xs text-ink-soft border border-line flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-violet" />
                <span>AI is answering...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input form */}
        <form onSubmit={handleSendChatForm} className="mt-3 pt-3 border-t border-line flex gap-2">
          <input
            type="text"
            placeholder="Type your question..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-line bg-white text-ink text-xs font-sans focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
          />
          <button
            type="submit"
            disabled={sendingChat || !chatInput.trim()}
            className="px-3.5 py-2 bg-violet hover:bg-violet/90 text-white rounded-xl disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionQuiz;
