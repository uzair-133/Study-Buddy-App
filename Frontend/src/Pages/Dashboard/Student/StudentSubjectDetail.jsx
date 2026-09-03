import ChapterCard from "../../../Components/dashboard/shared/ChapterCard"
import AddChapterModal from "../../../Components/dashboard/shared/AddChapterModal"
import { useState, useEffect } from "react"
import api from "../../../api/axios"
import { useParams, Link } from "react-router-dom"

const StudentSubjectDetail = () => {
  const { subjectId } = useParams()
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await api.get(`/api/chapter/getchapter/${subjectId}`, { withCredentials: true })
        setChapters(res.data.chapter || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch Chapter')
      } finally {
        setLoading(false)
      }
    }
    if (subjectId) {
      fetchChapter()
    }
  }, [subjectId])

  const handleNewChapter = (newChapter) => {
    setChapters(prev => [newChapter, ...prev])
    setIsModalOpen(false)
  }

  const handleChapterDelete = (deletedId) => {
    setChapters(prevChapter => prevChapter.filter(chap => chap._id !== deletedId))
  }

  return (
    <>
      <section className="p-8 lg:p-12">
        <Link to="/student/subjects" className="text-sm font-semibold text-violet hover:underline mb-4 inline-block">
          &larr; Back to Subjects
        </Link>

        <div className="flex flex-col space-y-4 md:flex md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h1 className="font-semibold font-display text-xl md:text-2xl">My Chapters</h1>
            <p className="font-sans text-sm text-ink-soft">
              Chapters you've created and organized for this subject.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 text-sm w-fit rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-colors"
          >
            + Add Chapter
          </button>
        </div>

        {loading && <p className="mt-6">Loading...</p>}
        {error && <p className="mt-6 text-coral">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mt-6">
            {chapters.map((chap) => (
              <ChapterCard
                key={chap._id}
                chapter={chap}
                subjectId={subjectId}
                onDelete={handleChapterDelete}
              />
            ))}
          </div>
        )}

        {!loading && chapters.length === 0 && !error && (
          <p className="mt-6 text-ink-soft">No chapters found for this subject yet.</p>
        )}

        <div className="outline-dashed outline-2 outline-gray-300 rounded-xl p-6 mt-6 flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 text-sm rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-colors"
          >
            +
          </button>
          <p className="font-semibold font-sans text-gray-500">Add a new Chapter</p>
        </div>

        {isModalOpen && (
          <AddChapterModal
            subjectId={subjectId}
            onClose={() => setIsModalOpen(false)}
            onChapterAdded={handleNewChapter}
          />
        )}
      </section>
    </>
  )
}

export default StudentSubjectDetail