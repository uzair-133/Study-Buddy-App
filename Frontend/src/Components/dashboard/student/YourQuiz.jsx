import { useState, useEffect } from "react";
import {
  Sparkles,
  Target,
  MessageSquare,
  History,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const YourQuiz = () => {
  const navigate = useNavigate();

  // State
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [difficulty, setDifficulty] = useState("medium"); // 'easy' | 'medium' | 'difficult'
  const [mode, setMode] = useState("mcq"); // 'mcq' | 'question'
  const [questionCount, setQuestionCount] = useState(10);
  const [recentQuizzes, setRecentQuizzes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);

  // 1. Fetch Subjects & Recent Quizzes on Mount
  useEffect(() => {
    fetchSubjects();
    fetchRecentQuizzes();
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
      console.error("Failed to fetch subjects in YourQuiz:", err);
    }
  };

  const fetchChapters = async (subId) => {
    try {
      setLoadingChapters(true);
      const res = await api.get(`/api/chapter/getchapter/${subId}`);
      const list = res.data?.chapter || res.data?.chapters || res.data || [];
      setChapters(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch chapters in YourQuiz:", err);
    } finally {
      setLoadingChapters(false);
    }
  };

  const fetchRecentQuizzes = async () => {
    try {
      const res = await api.get("/api/quiz/history");
      setRecentQuizzes(res.data?.quizzes?.slice(0, 3) || []);
    } catch (err) {
      console.error("Failed to fetch quiz history in YourQuiz:", err);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/quiz/generate", {
        subjectId: selectedSubject || undefined,
        chapterId: selectedChapter || undefined,
        difficulty,
        mode,
        questionCount: Number(questionCount) || 10,
      });

      if (res.data?.success) {
        navigate("/student/quiz-generator");
      }
    } catch (err) {
      console.error("Error generating quiz from dashboard widget:", err);
      // Navigate to generator page if error or for full setup
      navigate("/student/quiz-generator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white border border-line p-5 sm:p-6 rounded-2xl font-sans text-ink">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-semibold font-display text-lg text-ink flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet" />
          AI Quiz Generator
        </h1>
        <button
          onClick={() => navigate("/student/quiz-generator")}
          className="text-violet text-xs font-semibold font-display hover:underline flex items-center gap-1 cursor-pointer"
        >
          Open Generator <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-ink-soft text-xs sm:text-sm mb-4">
        Pick a subject and chapter — StudyBuddy will generate an instant quiz to
        test your knowledge.
      </p>

      {/* Selectors Row */}
      <div className="flex flex-wrap gap-2.5 mb-4">
        {/* Subject Select */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-paper border font-sans border-line rounded-xl px-3.5 py-2 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-violet/40"
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.title}
            </option>
          ))}
        </select>

        {/* Chapter Select */}
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          disabled={!selectedSubject || loadingChapters}
          className="bg-paper border border-line rounded-xl px-3.5 py-2 text-xs font-semibold font-sans text-ink focus:outline-none focus:ring-2 focus:ring-violet/40 disabled:opacity-50"
        >
          <option value="">
            {loadingChapters ? "Loading..." : "Select Chapter"}
          </option>
          {chapters.map((ch) => (
            <option key={ch._id} value={ch._id}>
              {ch.title}
            </option>
          ))}
        </select>

        {/* Difficulty Selector */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-paper border border-line rounded-xl px-3.5 py-2 text-xs font-semibold font-sans text-ink focus:outline-none focus:ring-2 focus:ring-violet/40"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>

        {/* Mode Selector */}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="bg-paper border border-line rounded-xl px-3.5 py-2 text-xs font-semibold font-sans text-ink focus:outline-none focus:ring-2 focus:ring-violet/40"
        >
          <option value="mcq">MCQs Mode</option>
          <option value="question">Questions Only</option>
        </select>

        {/* Question Count Select */}
        <select
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          className="bg-white border border-line rounded-xl px-3.5 py-2 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-violet/40"
        >
          <option value={5}>5 Qs</option>
          <option value={10}>10 Qs</option>
          <option value={15}>15 Qs</option>
        </select>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateQuiz}
        disabled={loading}
        className="bg-violet hover:bg-violet/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-60 cursor-pointer shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Quiz Now</span>
          </>
        )}
      </button>

      {/* Recent Quizzes List */}
      <div className="mt-5 pt-4 border-t border-line">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-ink-soft flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-violet" />
            Recent Quizzes
          </span>
        </div>

        {recentQuizzes.length === 0 ? (
          <p className="text-xs text-ink-soft italic">No quizzes taken yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                onClick={() => navigate("/student/quiz-generator")}
                className="flex justify-between items-center bg-white border border-line rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ink hover:border-violet/40 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="px-2 py-0.5 bg-violet/10 text-violet text-[10px] font-bold rounded uppercase">
                    {quiz.mode === "mcq" ? "MCQ" : "Questions"}
                  </span>
                  <span className="truncate">
                    {quiz.chapterName || quiz.subjectName || "Custom Quiz"}
                  </span>
                </div>
                <span className="text-violet font-bold text-xs flex-shrink-0">
                  {quiz.mode === "mcq" && quiz.status === "completed"
                    ? `${quiz.score}/${quiz.totalQuestions}`
                    : quiz.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default YourQuiz;
