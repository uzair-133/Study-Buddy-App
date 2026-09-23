import React from "react";
import { Plus, File, X, Target, MessageSquare, Loader2, Sparkles } from "lucide-react";

const QuizSetup = ({
  subjects,
  chapters,
  selectedSubject,
  setSelectedSubject,
  selectedChapter,
  setSelectedChapter,
  customFile,
  setCustomFile,
  customText,
  setCustomText,
  difficulty,
  setDifficulty,
  mode,
  setMode,
  questionCount,
  setQuestionCount,
  loading,
  loadingChapters,
  handleGenerateQuiz,
  handleFileChange
}) => {
  return (
    <div className="bg-paper p-6 sm:p-8 rounded-2xl border border-line shadow-sm max-w-3xl mx-auto">
      <form onSubmit={handleGenerateQuiz} className="space-y-6">
        {/* Step 1: Subject / Chapter / File Upload */}
        <div>
          <label className="block font-display font-semibold text-base text-ink mb-2">
            1. Select Subject & Chapter OR Upload PDF
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* Subject Dropdown */}
            <div>
              <label className="block text-xs font-sans text-ink-soft mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-line bg-white text-ink text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
              >
                <option value="">-- Choose Subject (Optional) --</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Dropdown */}
            <div>
              <label className="block text-xs font-sans text-ink-soft mb-1">Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                disabled={!selectedSubject || loadingChapters}
                className="w-full px-4 py-3 rounded-xl border border-line bg-white text-ink text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet disabled:opacity-50"
              >
                <option value="">
                  {loadingChapters ? "Loading chapters..." : "-- Choose Chapter (Optional) --"}
                </option>
                {chapters.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Direct File Upload */}
          <div>
            {!customFile ? (
              <label className="flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-line hover:border-violet rounded-xl cursor-pointer bg-white hover:bg-violet/5 transition-all text-xs font-sans font-semibold text-violet">
                <Plus className="w-4 h-4" />
                <span>Upload PDF / Study Notes File Directly</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-mint/10 border border-mint/30 rounded-xl text-ink text-xs font-sans font-semibold">
                <div className="flex items-center gap-2 truncate">
                  <File className="w-4 h-4 text-mint flex-shrink-0" />
                  <span className="truncate">{customFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomFile(null)}
                  className="text-coral hover:opacity-80 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Custom Topic Input */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Or type custom topic (e.g. Organic Chemistry, Newton's Laws)..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-line bg-white text-ink text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
            />
          </div>
        </div>

        {/* Step 2: Difficulty Chips */}
        <div>
          <label className="block font-display font-semibold text-base text-ink mb-2">
            2. Select Difficulty
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "easy", label: "Easy", activeClass: "bg-mint text-white border-mint" },
              { id: "medium", label: "Medium", activeClass: "bg-violet text-white border-violet" },
              { id: "difficult", label: "Difficult", activeClass: "bg-coral text-white border-coral" }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDifficulty(item.id)}
                className={`py-3 px-4 rounded-xl font-sans font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                  difficulty === item.id
                    ? `${item.activeClass} shadow-sm`
                    : "bg-white text-ink-soft border-line hover:border-violet/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Quiz Mode Chips */}
        <div>
          <label className="block font-display font-semibold text-base text-ink mb-2">
            3. Select Quiz Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "mcq", label: "MCQs Mode", icon: Target, desc: "Multiple choice with score test" },
              { id: "question", label: "Questions Only", icon: MessageSquare, desc: "Study questions + AI Assistant" }
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    mode === item.id
                      ? "bg-violet text-white border-violet shadow-sm"
                      : "bg-white text-ink border-line hover:border-violet/40"
                  }`}
                >
                  <IconComp className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-sans font-bold text-xs sm:text-sm">{item.label}</div>
                    <div className="font-sans text-[11px] opacity-80">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Questions Count */}
        <div>
          <label className="block font-display font-semibold text-base text-ink mb-2">
            4. Number of Questions
          </label>
          <div className="flex items-center gap-2">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionCount(num)}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-bold border transition-all cursor-pointer ${
                  questionCount === num
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-ink-soft border-line hover:border-ink"
                }`}
              >
                {num} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-violet hover:bg-violet/90 text-white font-sans font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Quiz via Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Quiz Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizSetup;
