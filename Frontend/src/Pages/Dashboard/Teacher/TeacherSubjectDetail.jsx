import ChapterCard from "../../../Components/dashboard/shared/ChapterCard"
import AddChapterModal from "../../../Components/dashboard/shared/AddChapterModal"
import { useState, useEffect } from "react"
import api from "../../../api/axios"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const TeacherSubjectDetail = () => {
  const { subjectId } = useParams()
  const [subjectInfo, setSubjectInfo] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1. Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 3

  // 2. Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      // 1. Fetch Subject Info (to know classId and title)
      if (!subjectInfo) {
        try {
          const subRes = await api.get(`/api/subject/${subjectId}`, { withCredentials: true })
          if (subRes.data.subject) {
            setSubjectInfo(subRes.data.subject)
          }
        } catch (e) {
          console.log("Could not fetch subject info:", e)
        }
      }

      // 2. Fetch Chapters for this subject with pagination
      const res = await api.get(`/api/chapter/getchapter/${subjectId}?page=${currentPage}&limit=${limit}`, { 
        withCredentials: true 
      })
      setChapters(res.data.chapter || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch Chapter')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (subjectId) {
      fetchData()
    }
  }, [subjectId, currentPage])

  const handleNewChapter = () => {
    setIsModalOpen(false)
    if (currentPage === 1) {
      fetchData()
    } else {
      setCurrentPage(1)
    }
  }

  const handleChapterDelete = (deletedId) => {
    if (chapters.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    } else {
      fetchData()
    }
  }

  // Explicit back destination
  const backDestination = subjectInfo?.classId
    ? `/teacher/classes/${subjectInfo.classId}`
    : "/teacher/subjects"

  const backLabel = subjectInfo?.classId ? "Back to Class" : "Back to Subjects"

  return (
    <>
      <section className="p-8 lg:p-12">
        <Link
          to={backDestination}
          className="text-sm font-semibold text-violet hover:underline mb-4 inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> {backLabel}
        </Link>

        <div className="flex flex-col space-y-4 md:flex md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h1 className="font-semibold font-display text-xl md:text-2xl text-ink">
              {subjectInfo ? `${subjectInfo.title} - Chapters` : "My Chapters"}
            </h1>
            <p className="font-sans text-sm text-ink-soft">
              Chapters you've created and organized for this subject.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 text-sm w-fit rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-colors cursor-pointer"
          >
            + Add Chapter
          </button>
        </div>

        {loading && <p className="mt-6 text-gray-500">Loading chapters...</p>}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
              }`}
            >
              Prev
            </button>

            {/* Number Buttons */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1
              const isActive = currentPage === pageNumber

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-violet text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {!loading && chapters.length === 0 && !error && (
          <p className="mt-6 text-ink-soft">No chapters found for this subject yet.</p>
        )}

        <div className="outline-dashed outline-2 outline-gray-300 rounded-xl p-6 mt-6 flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 text-sm rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-colors cursor-pointer"
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

export default TeacherSubjectDetail