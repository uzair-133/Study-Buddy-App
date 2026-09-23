import React from "react";
import { History, RotateCcw, Loader2, Trash2 } from "lucide-react";

const HistoryQuiz = ({
  quizHistory,
  loadingHistory,
  fetchQuizHistory,
  handleViewSavedQuiz,
  handleDeleteQuiz
}) => {
  return (
    <div className="bg-paper p-6 rounded-2xl border border-line shadow-sm max-w-3xl mx-auto font-sans">
      <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
        <h2 className="font-display font-bold text-base text-ink flex items-center gap-2">
          <History className="w-4 h-4 text-violet" />
          Quiz History
        </h2>
        <button
          onClick={fetchQuizHistory}
          className="p-1.5 text-violet hover:bg-white rounded-lg transition-all cursor-pointer"
          title="Refresh"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {loadingHistory ? (
        <div className="py-8 text-center text-xs text-ink-soft flex flex-col items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-violet" />
          <span>Loading quiz history...</span>
        </div>
      ) : quizHistory.length === 0 ? (
        <div className="py-8 text-center text-xs text-ink-soft">
          <p className="font-semibold">No quizzes found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quizHistory.map((q) => (
            <div
              key={q._id}
              onClick={() => handleViewSavedQuiz(q)}
              className="p-3.5 rounded-xl border border-line bg-white hover:bg-violet/5 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-violet/10 text-violet font-bold rounded uppercase text-[10px]">
                    {q.mode === "mcq" ? "MCQ" : "Questions"}
                  </span>
                  <span className="px-2 py-0.5 bg-mint/10 text-mint font-bold rounded uppercase text-[10px]">
                    {q.difficulty}
                  </span>
                  {q.mode === "mcq" && q.status === "completed" && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 font-bold rounded text-[10px]">
                      Score: {q.score}/{q.totalQuestions}
                    </span>
                  )}
                </div>
                <div className="font-display font-bold text-ink text-sm">
                  {q.chapterName || q.subjectName || "Quiz"}
                </div>
                <div className="text-ink-soft text-[11px] mt-0.5">
                  {new Date(q.createdAt).toLocaleDateString()} • {q.questionCount || q.questions?.length} Questions
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewSavedQuiz(q);
                  }}
                  className="px-3.5 py-1.5 bg-violet text-white font-bold rounded-xl text-xs hover:bg-violet/90 cursor-pointer"
                >
                  View
                </button>
                <button
                  onClick={(e) => handleDeleteQuiz(q._id, e)}
                  className="p-1.5 text-coral hover:bg-coral/10 rounded-xl cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryQuiz;