import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../../api/axios'
import SubjectCard from '../../../Components/dashboard/shared/SubjectCard'
import AddSubjectModal from '../../../Components/dashboard/shared/AddSubjectModal'
import { Copy, Check, Plus, ArrowLeft } from 'lucide-react'

const TeacherClassDetail = () => {
  const { classId } = useParams()
  const [classInfo, setClassInfo] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fetch Class details & Class Subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        // 1. Get Class info
        const classRes = await api.get(`/api/class/${classId}`, { withCredentials: true })
        if (classRes.data.success) {
          setClassInfo(classRes.data.data)
        }

        // 2. Get Class Subjects
        const subjectRes = await api.get(`/api/subject/getSubject?classId=${classId}`, {
          withCredentials: true,
        })
        setSubjects(subjectRes.data.subject || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load class details')
      } finally {
        setLoading(false)
      }
    }

    if (classId) {
      fetchData()
    }
  }, [classId])

  const handleNewSubject = (newSubject) => {
    setSubjects((prev) => [newSubject, ...prev])
    setIsModalOpen(false)
  }

  const handleSubjectDelete = (deletedId) => {
    setSubjects((prev) => prev.filter((sub) => sub._id !== deletedId))
  }

  const handleCopyCode = () => {
    if (!classInfo?.joinCode) return
    navigator.clipboard.writeText(classInfo.joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="p-8 lg:p-12">
      {/* Back to Classes link */}
      <Link
        to="/teacher/create-classes"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet hover:underline mb-5"
      >
        <ArrowLeft size={16} /> Back to My Classes
      </Link>

      {/* Class Header Banner */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-xs flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet bg-violet/10 px-2.5 py-1 rounded-full">
            Classroom
          </span>
          <h1 className="font-display font-semibold text-2xl md:text-3xl text-ink mt-2">
            {classInfo ? classInfo.className : 'Loading class...'}
          </h1>
          <p className="text-xs text-ink-soft mt-1">
            Created on {classInfo ? new Date(classInfo.createdAt).toLocaleDateString() : ''}
          </p>
        </div>

        {/* Join Code Badge & Add Subject Button */}
        <div className="flex flex-wrap items-center gap-3">
          {classInfo?.joinCode && (
            <div className="flex items-center gap-2 bg-paper border border-line px-3.5 py-2 rounded-xl">
              <span className="text-xs text-ink-soft font-medium">Code:</span>
              <span className="font-mono font-bold text-violet tracking-widest text-sm">
                {classInfo.joinCode}
              </span>
              <button
                onClick={handleCopyCode}
                title="Copy Join Code"
                className="text-ink-soft hover:text-violet transition-colors cursor-pointer p-1"
              >
                {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
              </button>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus size={16} /> Add Subject
          </button>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && <p className="mt-8 text-sm text-ink-soft">Loading class subjects...</p>}
      {error && <p className="mt-8 text-sm text-coral">{error}</p>}

      {/* Subjects Grid */}
      {!loading && !error && (
        <>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-ink">
              Class Subjects ({subjects.length})
            </h2>
          </div>

          {subjects.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mt-4">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject._id}
                  subject={subject}
                  onDelete={handleSubjectDelete}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-line p-8 text-center mt-4">
              <p className="text-sm text-ink-soft">
                No subjects created in this class yet.
              </p>
            </div>
          )}

          {/* Add another subject box */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="outline-dashed outline-2 outline-gray-300 rounded-xl p-6 mt-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-violet/10 text-violet flex items-center justify-center font-bold text-base">
              +
            </div>
            <p className="font-semibold font-sans text-sm text-gray-500">
              Add a new Subject to this Class
            </p>
          </div>
        </>
      )}

      {/* Add Subject Modal */}
      {isModalOpen && (
        <AddSubjectModal
          classId={classId}
          onClose={() => setIsModalOpen(false)}
          onSubjectAdded={handleNewSubject}
        />
      )}
    </section>
  )
}

export default TeacherClassDetail
