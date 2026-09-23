import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import {
  Sparkles,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Award,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Trash2,
  History,
  MessageSquare,
  Send,
  Plus,
  File,
  X,
  Target,
  Lightbulb
} from "lucide-react";

const StudentQuiz = () => {
  // Navigation & View states: 'setup' | 'quiz' | 'history'
  const [activeTab, setActiveTab] = useState("setup");

  // Setup form states
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [customFile, setCustomFile] = useState(null);
  const [difficulty, setDifficulty] = useState("medium"); // 'easy' | 'medium' | 'difficult'
  const [mode, setMode] = useState("mcq"); // 'mcq' | 'question'
  const [questionCount, setQuestionCount] = useState(10);
  const [customText, setCustomText] = useState("");

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [error, setError] = useState("");

  // Current active generated quiz
  const [currentQuiz, setCurrentQuiz] = useState(null);

  // MCQ state: student selected answers map { [questionIndex]: selectedOption }
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Chat state for 'question' mode assistant
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  // Quiz history state
  const [quizHistory, setQuizHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 1. Fetch Subjects on Mount
  useEffect(() => {
    fetchSubjects();
    fetchQuizHistory();
  }, []);

  // 2. Fetch Chapters when Subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchChapters(selectedSubject);
    } else {
      setChapters([]);
      setSelectedChapter("");
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/api/subject/getSubject");
      const list = res.data?.subject || res.data?.subjects || res.data || [];
      setSubjects(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
    }
  };

  const fetchChapters = async (subId) => {
    try {
      setLoadingChapters(true);
      const res = await api.get(`/api/chapter/getchapter/${subId}`);
      const list = res.data?.chapter || res.data?.chapters || res.data || [];
      setChapters(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load chapters:", err);
    } finally {
      setLoadingChapters(false);
    }
  };

  const fetchQuizHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get("/api/quiz/history");
      setQuizHistory(res.data?.quizzes || []);
    } catch (err) {
      console.error("Failed to load quiz history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Handle File Upload Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setError("File size exceeds 25MB limit.");
        return;
      }
      setCustomFile(file);
      setError("");
    }
  };

  // Generate Quiz Handler
  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (selectedSubject) formData.append("subjectId", selectedSubject);
      if (selectedChapter) formData.append("chapterId", selectedChapter);
      formData.append("difficulty", difficulty);
      formData.append("mode", mode);
      formData.append("questionCount", questionCount);
      if (customText) formData.append("content", customText);
      if (customFile) formData.append("file", customFile);

      const res = await api.post("/api/quiz/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data?.success && res.data?.quiz) {
        const generatedQuiz = res.data.quiz;
        setCurrentQuiz(generatedQuiz);
        setUserAnswers({});
        setCurrentQuestionIdx(0);
        setSubmittedResult(null);

        // Initialize Chat assistant greeting if in question mode
        if (generatedQuiz.mode === "question") {
          setChatMessages([
            {
              sender: "ai",
              text: `Hello! I am your AI Study Assistant. Here are your ${generatedQuiz.questions.length} generated questions. Click "💡 Get Answer" on any question or ask me anything in the chat below!`
            }
          ]);
        }

        setActiveTab("quiz");
        fetchQuizHistory();
      } else {
        setError("Failed to generate quiz. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to generate quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Select Option for MCQ
  const handleSelectOption = (qIdx, optionText) => {
    if (submittedResult) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optionText
    }));
  };

  // Submit MCQ Quiz
  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;
    setSubmittingQuiz(true);
    setError("");

    try {
      const formattedAnswers = currentQuiz.questions.map((q, idx) => ({
        questionId: q._id,
        index: idx,
        selectedAnswer: userAnswers[idx] || ""
      }));

      const res = await api.post(`/api/quiz/submit/${currentQuiz._id}`, {
        answers: formattedAnswers
      });

      if (res.data?.success) {
        setSubmittedResult(res.data);
        setCurrentQuiz(res.data.quiz);
        fetchQuizHistory();
      }
    } catch (err) {
      setError("Failed to submit quiz results.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Ask AI Assistant for specific question solution or user query
  const handleAskAssistant = async (queryText) => {
    if (!queryText || sendingChat) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: queryText }]);
    setSendingChat(true);

    try {
      const questionsText = currentQuiz?.questions
        ?.map((q, i) => `${i + 1}. ${q.question}`)
        .join("\n");

      const res = await api.post("/api/quiz/ask-assistant", {
        questionsText,
        userQuery: queryText
      });

      if (res.data?.success && res.data?.answer) {
        setChatMessages((prev) => [...prev, { sender: "ai", text: res.data.answer }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Sorry, I couldn't fetch an answer right now. Please try again." }
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "I'm having trouble answering right now. Please check your connection or try again." }
      ]);
    } finally {
      setSendingChat(false);
    }
  };

  // Handle manual chat input submit
  const handleSendChatForm = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const txt = chatInput.trim();
    setChatInput("");
    handleAskAssistant(txt);
  };

  // Delete Quiz from History
  const handleDeleteQuiz = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/quiz/${id}`);
      setQuizHistory((prev) => prev.filter((q) => q._id !== id));
      if (currentQuiz?._id === id) {
        setCurrentQuiz(null);
        setActiveTab("setup");
      }
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    }
  };

  // View Saved Quiz from History
  const handleViewSavedQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIdx(0);
    setUserAnswers({});

    if (quiz.mode === "mcq" && quiz.status === "completed") {
      setSubmittedResult({
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        quiz
      });
      const preFilled = {};
      quiz.questions.forEach((q, idx) => {
        if (q.userAnswer) preFilled[idx] = q.userAnswer;
      });
      setUserAnswers(preFilled);
    } else {
      setSubmittedResult(null);
    }

    if (quiz.mode === "question") {
      setChatMessages([
        {
          sender: "ai",
          text: `Loaded saved quiz. Click "💡 Get Answer" on any question or ask any question in chat!`
        }
      ]);
    }

    setActiveTab("quiz");
  };

  return (
    <section className="p-6 lg:p-10 font-sans text-ink bg-white min-h-screen">
      {/* Top Header matching StudyBuddy theme */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-paper p-6 rounded-2xl border border-line">
          <div>
            <h1 className="font-display font-semibold text-xl md:text-2xl text-ink flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-violet" />
              AI Quiz Generator
            </h1>
            <p className="font-sans text-sm text-ink-soft mt-1">
              Create instant practice MCQs or study questions from your subjects or PDF notes.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-line self-start md:self-auto">
            <button
              onClick={() => setActiveTab("setup")}
              className={`px-4 py-2 rounded-xl font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "setup"
                  ? "bg-violet text-white shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              + Create Quiz
            </button>

            {currentQuiz && (
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-4 py-2 rounded-xl font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === "quiz"
                    ? "bg-violet text-white shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                Active Quiz
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab("history");
                fetchQuizHistory();
              }}
              className={`px-4 py-2 rounded-xl font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-violet text-white shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              History ({quizHistory.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-coral/10 border border-coral/30 rounded-xl text-coral flex items-center justify-between text-xs sm:text-sm font-sans">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError("")} className="text-coral hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ----------------- TAB 1: SETUP FORM ----------------- */}
        {activeTab === "setup" && (
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
                        className="text-coral hover:opacity-80 p-1"
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
        )}

        {/* ----------------- TAB 2: ACTIVE QUIZ VIEW ----------------- */}
        {activeTab === "quiz" && currentQuiz && (
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
                        className="px-4 py-2 border border-line bg-white text-ink text-xs font-sans font-semibold rounded-xl hover:bg-paper"
                      >
                        Retake Quiz
                      </button>
                      <button
                        onClick={() => setActiveTab("setup")}
                        className="px-5 py-2 bg-violet text-white text-xs font-sans font-bold rounded-xl hover:bg-violet/90"
                      >
                        Create New Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* QUESTIONS MODE VIEW WITH AI ASSISTANT */}
            {currentQuiz.mode === "question" && (
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
                              onClick={() => handleAskAssistant(`Give step-by-step answer for Question ${idx + 1}: ${q.question}`)}
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
            )}
          </div>
        )}

        {/* ----------------- TAB 3: HISTORY VIEW ----------------- */}
        {activeTab === "history" && (
          <div className="bg-paper p-6 rounded-2xl border border-line shadow-sm max-w-3xl mx-auto font-sans">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <h2 className="font-display font-bold text-base text-ink flex items-center gap-2">
                <History className="w-4 h-4 text-violet" />
                Quiz History
              </h2>
              <button
                onClick={fetchQuizHistory}
                className="p-1.5 text-violet hover:bg-white rounded-lg transition-all"
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
                        className="px-3.5 py-1.5 bg-violet text-white font-bold rounded-xl text-xs hover:bg-violet/90"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => handleDeleteQuiz(q._id, e)}
                        className="p-1.5 text-coral hover:bg-coral/10 rounded-xl"
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
        )}
      </div>
    </section>
  );
};

export default StudentQuiz;
