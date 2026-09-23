import React from "react";
import { ArrowLeft, ArrowRight, Award } from "lucide-react";

const Mcq = ({
  currentQuiz,
  userAnswers,
  currentQuestionIdx,
  setCurrentQuestionIdx,
  submittedResult,
  submittingQuiz,
  handleSelectOption,
  handleSubmitQuiz,
  setSubmittedResult,
  setUserAnswers,
  setActiveTab
}) => {
  if (!currentQuiz) return null;

  return (
    <div>
      {!submittedResult ? (
        <div className="bg-paper p-6 sm:p-8 rounded-2xl border border-line shadow-sm max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-xs font-sans font-semibold text-ink-soft mb-2">
              <span>Question {currentQuestionIdx + 1} of {currentQuiz.questions.length}</span>
              <span>{Math.round(((currentQuestionIdx + 1) / currentQuiz.questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-line">
              <div
                className="h-full bg-violet transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentQuestionIdx + 1) / currentQuiz.questions.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Question text */}
          <h3 className="font-display font-bold text-base sm:text-lg text-ink mb-6 leading-relaxed">
            {currentQuiz.questions[currentQuestionIdx]?.question}
          </h3>

          {/* 4 Options */}
          <div className="space-y-3 mb-8">
            {currentQuiz.questions[currentQuestionIdx]?.options?.map((opt, oIdx) => {
              const letters = ["A", "B", "C", "D"];
              const isSelected = userAnswers[currentQuestionIdx] === opt;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestionIdx, opt)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-sans font-medium flex items-center gap-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-violet/10 border-violet text-violet font-semibold shadow-sm"
                      : "bg-white hover:bg-violet/5 border-line text-ink"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isSelected ? "bg-violet text-white" : "bg-paper text-ink-soft border border-line"
                    }`}
                  >
                    {letters[oIdx] || oIdx + 1}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between border-t border-line pt-5">
            <button
              type="button"
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
              className="px-4 py-2.5 rounded-xl border border-line bg-white text-xs font-sans font-semibold text-ink-soft hover:text-ink hover:bg-paper disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            {currentQuestionIdx < currentQuiz.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-violet hover:bg-violet/90 text-white text-xs font-sans font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submittingQuiz}
                onClick={handleSubmitQuiz}
                className="px-5 py-2.5 rounded-xl bg-mint hover:bg-mint/90 text-white text-xs font-sans font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {submittingQuiz ? "Submitting..." : "Submit Quiz Result"}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Completed Results View */
        <div className="bg-paper p-6 sm:p-8 rounded-2xl border border-line shadow-sm max-w-2xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl border border-line mb-6">
            <Award className="w-10 h-10 text-violet mx-auto mb-2" />
            <h3 className="font-display text-xl font-bold text-ink">Quiz Completed!</h3>
            <p className="font-sans text-xs text-ink-soft mt-1">
              Score: {submittedResult.score} / {submittedResult.totalQuestions}
            </p>
            <div className="inline-block mt-3 px-5 py-1.5 bg-violet text-white font-sans font-bold text-base rounded-xl shadow-sm">
              {Math.round((submittedResult.score / submittedResult.totalQuestions) * 100)}%
            </div>
          </div>

          <h4 className="font-display font-bold text-sm text-ink mb-3">Answer Breakdown</h4>
          <div className="space-y-3 mb-6">
            {currentQuiz.questions.map((q, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-xs font-sans ${
                  q.isCorrect ? "bg-mint/10 border-mint/30" : "bg-coral/10 border-coral/30"
                }`}
              >
                <div className="font-bold text-ink mb-1">
                  Q{idx + 1}. {q.question}
                </div>
                <div className="text-ink-soft">
                  Your answer: <span className="font-bold text-ink">{q.userAnswer || "None"}</span>
                </div>
                {!q.isCorrect && (
                  <div className="text-mint font-semibold mt-0.5">
                    Correct answer: {q.correctAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t border-line pt-4">
            <button
              onClick={() => {
                setSubmittedResult(null);
                setUserAnswers({});
                setCurrentQuestionIdx(0);
              }}
              className="px-4 py-2 border border-line bg-white text-ink text-xs font-sans font-semibold rounded-xl hover:bg-paper cursor-pointer"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => setActiveTab("setup")}
              className="px-5 py-2 bg-violet text-white text-xs font-sans font-bold rounded-xl hover:bg-violet/90 cursor-pointer"
            >
              Create New Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mcq;