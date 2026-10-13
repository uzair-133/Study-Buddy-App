import { useState, useEffect } from "react"
import api from "../../../api/axios"
import SubjectCard from "../../../Components/dashboard/shared/SubjectCard"
import AddSubjectModal from "../../../Components/dashboard/shared/AddSubjectModal"

const TeacherSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1. Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 3

  // 2. Fetch Subjects function
  const fetchSubjects = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get(`/api/subject/getSubject?page=${currentPage}&limit=${limit}`, { 
        withCredentials: true 
      })
      
      setSubjects(res.data.subject || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subjects')
    } finally {
      setLoading(false)
    }
  }

  // 3. Jab bhi currentPage badle, data fetch karo
  useEffect(() => {
    fetchSubjects()
  }, [currentPage])

  // Naya subject banne par refresh karo
  const handleNewSubject = () => {
    setIsModalOpen(false)
    if (currentPage === 1) {
      fetchSubjects()
    } else {
      setCurrentPage(1)
    }
  }

  // Subject delete hone par list refresh karo
  const handleSubjectDelete = (deletedId) => {
    if (subjects.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    } else {
      fetchSubjects()
    }
  }

  return (
    <section className="p-8 lg:p-12">
      <div className="flex flex-col space-y-4 md:flex md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="font-semibold font-display text-xl md:text-2xl">My Subjects</h1>
          <p className="font-sans text-sm text-ink-soft">
            Subjects you've created and organized yourself — no class code needed.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="px-2 py-1 text-sm w-fit md:px-3 md:py-2 rounded-xl bg-violet text-white font-sans font-semibold cursor-pointer hover:opacity-90 transition"
        >
          + Add Subject
        </button>
      </div>

      {loading && <p className="mt-6 text-gray-500">Loading subjects...</p>}
      {error && <p className="mt-6 text-coral">{error}</p>}

      {/* Subjects Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mt-6">
        {subjects.map((subject) => (
          <SubjectCard key={subject._id} subject={subject} onDelete={handleSubjectDelete} />
        ))}
      </div>

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

      {/* Add New Subject Card Box */}
      <div className="outline-dashed outline-2 outline-gray-300 rounded-xl p-6 mt-6 flex flex-col items-center justify-center gap-2">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="px-3 py-1 text-sm w-fit md:px-4 md:py-2 rounded-xl bg-violet text-white font-sans font-semibold cursor-pointer hover:opacity-90 transition"
        >
          +
        </button>
        <p className="font-semibold font-sans text-gray-500">Add a new Subject</p>
      </div>

      {isModalOpen && (
        <AddSubjectModal
          onClose={() => setIsModalOpen(false)}
          onSubjectAdded={handleNewSubject}
        />
      )}
    </section>
  )
}

export default TeacherSubjects