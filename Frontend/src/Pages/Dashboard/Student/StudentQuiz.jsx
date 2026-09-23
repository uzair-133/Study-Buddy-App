import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Sparkles, XCircle, X } from "lucide-react";
import QuizSetup from "../../../Components/dashboard/student/QuizSetup";
import ActiveQuiz from "../../../Components/dashboard/student/ActiveQuiz";
import HistoryQuiz from "../../../Components/dashboard/student/HistoryQuiz";

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
            <button onClick={() => setError("")} className="text-coral hover:opacity-80 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: SETUP FORM */}
        {activeTab === "setup" && (
          <QuizSetup
            subjects={subjects}
            chapters={chapters}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
            customFile={customFile}
            setCustomFile={setCustomFile}
            customText={customText}
            setCustomText={setCustomText}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            mode={mode}
            setMode={setMode}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            loading={loading}
            loadingChapters={loadingChapters}
            handleGenerateQuiz={handleGenerateQuiz}
            handleFileChange={handleFileChange}
          />
        )}

        {/* TAB 2: ACTIVE QUIZ VIEW */}
        {activeTab === "quiz" && currentQuiz && (
          <ActiveQuiz
            currentQuiz={currentQuiz}
            setActiveTab={setActiveTab}
            userAnswers={userAnswers}
            currentQuestionIdx={currentQuestionIdx}
            setCurrentQuestionIdx={setCurrentQuestionIdx}
            submittedResult={submittedResult}
            submittingQuiz={submittingQuiz}
            handleSelectOption={handleSelectOption}
            handleSubmitQuiz={handleSubmitQuiz}
            setSubmittedResult={setSubmittedResult}
            setUserAnswers={setUserAnswers}
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendingChat={sendingChat}
            handleAskAssistant={handleAskAssistant}
            handleSendChatForm={handleSendChatForm}
          />
        )}

        {/* TAB 3: HISTORY VIEW */}
        {activeTab === "history" && (
          <HistoryQuiz
            quizHistory={quizHistory}
            loadingHistory={loadingHistory}
            fetchQuizHistory={fetchQuizHistory}
            handleViewSavedQuiz={handleViewSavedQuiz}
            handleDeleteQuiz={handleDeleteQuiz}
          />
        )}
      </div>
    </section>
  );
};

export default StudentQuiz;
