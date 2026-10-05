import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../../api/axios'
import SubjectCard from '../../../Components/dashboard/shared/SubjectCard'
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react'

const StudentClassDetail = () => {
  const { classId } = useParams()
  const [classInfo, setClassInfo] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        setError(err.response?.data?.message || 'Failed to load class subjects')
      } finally {
        setLoading(false)
      }
    }

    if (classId) {
      fetchData()
    }
  }, [classId])

  return (
    <section className="p-8 lg:p-12">
      {/* Back to Joined Classes link */}
      <Link
        to="/student/joined-classes"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet hover:underline mb-5"
      >
        <ArrowLeft size={16} /> Back to Joined Classes
      </Link>

      {/* Class Banner */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-xs flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet bg-violet/10 px-2.5 py-1 rounded-full">
            Joined Class
          </span>
          <h1 className="font-display font-semibold text-2xl md:text-3xl text-ink mt-2">
            {classInfo ? classInfo.className : 'Loading class...'}
          </h1>
          <p className="text-xs text-ink-soft mt-1">
            Enrolled course content & study materials
          </p>
        </div>

        <div className="bg-paper border border-line px-4 py-2.5 rounded-xl flex items-center gap-2">
          <GraduationCap size={18} className="text-violet" />
          <span className="text-xs font-semibold text-ink">
            Teacher Course Space
          </span>
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
                  /* onDelete not passed so student cannot delete teacher's subject */
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-line p-8 text-center mt-4">
              <BookOpen size={36} className="text-violet/60 mx-auto mb-2" />
              <p className="text-sm font-semibold text-ink">
                No subjects published in this class yet
              </p>
              <p className="text-xs text-ink-soft mt-1">
                Your instructor has not added any subjects to this class yet. Check back soon!
              </p>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default StudentClassDetail
