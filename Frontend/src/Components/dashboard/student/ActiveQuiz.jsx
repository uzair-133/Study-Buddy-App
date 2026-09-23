import React from "react";
import Mcq from "./Mcq";
import QuestionQuiz from "./QuestionQuiz";

const ActiveQuiz = ({
  currentQuiz,
  setActiveTab,
  userAnswers,
  currentQuestionIdx,
  setCurrentQuestionIdx,
  submittedResult,
  submittingQuiz,
  handleSelectOption,
  handleSubmitQuiz,
  setSubmittedResult,
  setUserAnswers,
  chatMessages,
  chatInput,
  setChatInput,
  sendingChat,
  handleAskAssistant,
  handleSendChatForm
}) => {
  if (!currentQuiz) return null;

  return (
    <div>
      {/* Header info bar */}
      <div className="bg-paper p-4 rounded-xl border border-line mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-violet/10 text-violet font-sans font-bold text-[11px] rounded-md uppercase">
              {currentQuiz.mode === "mcq" ? "MCQ Mode" : "Questions Mode"}
            </span>
            <span className="px-2.5 py-0.5 bg-mint/10 text-mint font-sans font-bold text-[11px] rounded-md uppercase">
              {currentQuiz.difficulty}
            </span>
          </div>
          <h2 className="font-display font-bold text-base sm:text-lg text-ink mt-1">
            {currentQuiz.chapterName || currentQuiz.subjectName || "Generated Quiz"}
          </h2>
        </div>
        <button
          onClick={() => setActiveTab("setup")}
          className="px-4 py-2 bg-white border border-line text-ink text-xs font-sans font-semibold rounded-xl hover:bg-violet/10 transition-all cursor-pointer"
        >
          + New Quiz
        </button>
      </div>

      {/* MCQ MODE VIEW */}
      {currentQuiz.mode === "mcq" && (
        <Mcq
          currentQuiz={currentQuiz}
          userAnswers={userAnswers}
          currentQuestionIdx={currentQuestionIdx}
          setCurrentQuestionIdx={setCurrentQuestionIdx}
          submittedResult={submittedResult}
          submittingQuiz={submittingQuiz}
          handleSelectOption={handleSelectOption}
          handleSubmitQuiz={handleSubmitQuiz}
          setSubmittedResult={setSubmittedResult}
          setUserAnswers={setUserAnswers}
          setActiveTab={setActiveTab}
        />
      )}

      {/* QUESTIONS MODE VIEW WITH AI ASSISTANT */}
      {currentQuiz.mode === "question" && (
        <QuestionQuiz
          currentQuiz={currentQuiz}
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          sendingChat={sendingChat}
          handleAskAssistant={handleAskAssistant}
          handleSendChatForm={handleSendChatForm}
        />
      )}
    </div>
  );
};

export default ActiveQuiz;