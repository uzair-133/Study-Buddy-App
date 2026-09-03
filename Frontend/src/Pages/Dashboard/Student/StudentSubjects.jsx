import { useState, useEffect } from "react"
import api from "../../../api/axios"
import SubjectCard from "../../../Components/dashboard/shared/SubjectCard"
import AddSubjectModal from "../../../Components/dashboard/shared/AddSubjectModal"
import { Link } from "react-router-dom"
const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/api/subject/getSubject', { withCredentials: true })
        setSubjects(res.data.subject)   // yeh ARRAY hai, isi ko state mein daala
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch subjects')
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
  }, [])

    const handleNewSubject = (newSubject) => {
    setSubjects(prev => [newSubject, ...prev])   // list mein turant add kar do
    setIsModalOpen(false)                          // Modal band kar do
  }

  const handleSubjectDelete = (deletedId) => {
  setSubjects(prevSubjects => prevSubjects.filter(subject => subject._id !== deletedId))
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
        <Link onClick={() => setIsModalOpen(true)} className=" px-2 py-1 text-sm w-fit  md:px-3 md:py-2  rounded-xl bg-violet text-white font-sans font-semibold  ">
          + Add Subject
        </Link>
      </div>

      {loading && <p className="mt-6">Loading...</p>}
      {error && <p className="mt-6 text-coral">{error}</p>}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2 mt-6">
        {subjects.map((subject) => (
          <SubjectCard key={subject._id} subject={subject} onDelete={handleSubjectDelete} />
        ))}
      </div>

      <div className="outline-dashed outline-2 outline-gray-300 rounded-xl p-6 mt-6 flex flex-col items-center justify-center gap-2">
        <Link onClick={() => setIsModalOpen(true)} className="px-2 py-1 text-sm w-fit  md:px-3 md:py-2  rounded-xl bg-violet text-white font-sans font-semibold" to="">
        +
        </Link>
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

export default StudentSubjects