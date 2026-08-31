import { useState } from "react"
import { Sparkles } from 'lucide-react'


const YourQuiz = () => {
  const subjectsData = [
    { id: 1, name: "Physics", chapters: ["Chapter 1 - Motion", "Chapter 2 - Force", "Chapter 3 - Newton's Laws"] },
    { id: 2, name: "Chemistry", chapters: ["Chapter 1 - Atoms", "Chapter 2 - Bonding", "Chapter 3 - Reactions", "Chapter 4 - Acids"] },
  ]
  const recentQuizzes = [
    { title: "Physics — Chapter 2 Quiz", score: "8/10" },
    { title: "Chemistry — Chapter 1 Quiz", score: "7/10" },
  ]

  const [selectedSubject, setSelectedSubject] = useState(subjectsData[0]?.name || '')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [questionCount, setQuestionCount] = useState(10)


  const currentSubjectData = subjectsData.find(s => s.name === selectedSubject)
  const availableChapters = currentSubjectData ? currentSubjectData.chapters : []

  const handleGenerateQuiz = () => {
    console.log({ selectedSubject, selectedChapter, questionCount })
    // Yahan baad mein API call hogi
  }

  return (
    <>
      <main className="bg-white border border-gray-300 pt-4 p-6 rounded-2xl">
        <h1 className="font-semibold font-display">AI Quiz Generator</h1>
        <p className="text-ink-soft text-sm mb-5">Pick a subject and chapter — StudyBuddy will generate a multiple-choice quiz from the uploaded material so you can test yourself instantly.</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <select value={selectedSubject} onChange={(e) => {
            setSelectedSubject(e.target.value)
            setSelectedChapter('')
          }} className="bg-paper border border-line rounded-xl px-4 py-2 text-sm font-semibold" >
            {subjectsData.map((subject) => (
              <option key={subject.id} value={subject.name}>{subject.name}</option>
            ))}

          </select>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="bg-paper border border-line rounded-xl w-45 px-2 py-2 md:px-2 md:py-2 text-sm font-semibold"
          >
            <option value="">Select a chapter</option>
            {availableChapters.map((chapter, index) => (
              <option key={index} value={chapter}>{chapter}</option>
            ))}
          </select>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            className="bg-paper border border-line rounded-xl px-4 py-2 text-sm font-semibold"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>
        </div>
          <button
        onClick={handleGenerateQuiz}
        disabled={!selectedChapter}
        className="bg-violet text-white font-bold px-5 py-2.5 rounded-full flex items-center gap-2 disabled:opacity-50"
      >
        <Sparkles size={16} /> Generate Quiz
      </button>

        <div className="mt-5 flex flex-col gap-2">
          {
            recentQuizzes.map((quiz, index) => (
              <div key={index} className="flex justify-between items-center bg-paper rounded-xl px-4 py-3" >
                <span>{quiz.title}</span>
                <span>{quiz.score}</span>
              </div>

            ))
          }
        </div>
      </main>


    </>
  )
}

export default YourQuiz