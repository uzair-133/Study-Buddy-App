import React, { useState, useEffect } from 'react'
import api from '../../../api/axios'
import { Plus, LogOut, BookOpen, GraduationCap, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const StudentJoinedClass = () => {
  const [joinedClasses, setJoinedClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState('')

  const navigate = useNavigate()

  // 1. Fetch joined classes
  const fetchJoinedClasses = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/api/class/getJoinedClass', { withCredentials: true })
      if (res.data.success) {
        setJoinedClasses(res.data.data || [])
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch joined classes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJoinedClasses()
  }, [])

  // 2. Join a new class using code
  const handleJoinClass = async (e) => {
    e.preventDefault()
    if (!joinCode.trim()) {
      setModalError('Please enter a join code')
      return
    }

    try {
      setModalLoading(true)
      setModalError('')
      const res = await api.post(
        '/api/class/classJoin',
        { joinCode: joinCode.trim() },
        { withCredentials: true }
      )

      if (res.data.success) {
        setJoinCode('')
        setIsModalOpen(false)
        // Refresh list
        fetchJoinedClasses()
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to join class. Please check code.')
    } finally {
      setModalLoading(false)
    }
  }

  // 3. Leave a class
  const handleLeaveClass = async (classId, className, e) => {
    e.stopPropagation()
    const confirmLeave = window.confirm(`Are you sure you want to leave ${className || 'this class'}?`)
    if (!confirmLeave) return

    try {
      await api.delete(`/api/class/leaveClass/${classId}`, { withCredentials: true })
      setJoinedClasses((prev) => prev.filter((item) => (item.classId?._id || item.classId) !== classId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to leave class')
    }
  }

  return (
    <section className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="font-semibold font-display text-xl md:text-2xl text-ink">Joined Classes</h1>
          <p className="font-sans text-sm text-ink-soft">
            Classes you have joined using a teacher's code. Access course subjects, notes, and study files.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('')
            setIsModalOpen(true)
          }}
          className="px-4 py-2 text-sm w-fit rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={16} /> Join Class
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <p className="mt-6 text-sm text-ink-soft">Loading your classes...</p>}
      {error && <p className="mt-6 text-sm text-coral">{error}</p>}

      {/* Classes Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-6">
          {joinedClasses.map((item) => {
            const cls = item.classId
            if (!cls) return null

            return (
              <div
                key={item._id}
                onClick={() => navigate(`/student/classes/${cls._id}`)}
                className="bg-white rounded-xl border border-line p-5 relative cursor-pointer hover:shadow-md transition-all hover:border-violet/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-violet bg-violet/10 px-2 py-0.5 rounded-md">
                      Enrolled
                    </span>

                    <button
                      onClick={(e) => handleLeaveClass(cls._id, cls.className, e)}
                      title="Leave Class"
                      className="text-gray-400 hover:text-coral p-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>

                  <h3 className="font-display font-semibold text-lg text-ink hover:text-violet transition-colors mt-3">
                    {cls.className}
                  </h3>

                  {cls.teacherId?.name && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-ink-soft">
                      <GraduationCap size={15} className="text-violet" />
                      <span>Instructor: <strong className="text-ink font-medium">{cls.teacherId.name}</strong></span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between">
                  <span className="text-xs text-ink-soft">
                    Joined: {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet hover:underline">
                    View Subjects <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && joinedClasses.length === 0 && (
        <div className="bg-white border border-line rounded-2xl p-10 text-center mt-6">
          <BookOpen size={40} className="text-violet/60 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-base text-ink">You haven't joined any classes yet</h3>
          <p className="text-xs text-ink-soft mt-1 max-w-sm mx-auto">
            Ask your teacher for the 6-character class Join Code and click below to join.
          </p>
          <button
            onClick={() => {
              setModalError('')
              setIsModalOpen(true)
            }}
            className="mt-4 px-4 py-2 text-xs rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Join a Class
          </button>
        </div>
      )}

      {/* Join Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !modalLoading && setIsModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl z-10">
            <h2 className="font-display text-lg font-semibold text-ink mb-1">Join a Class</h2>
            <p className="text-xs text-ink-soft mb-4">
              Enter the unique join code provided by your teacher.
            </p>

            <form onSubmit={handleJoinClass} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1.5">Class Join Code</label>
                <input
                  type="text"
                  autoFocus
                  maxLength={10}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 7A4B2C"
                  className="w-full border border-line rounded-xl px-3.5 py-2.5 text-center font-mono font-bold tracking-widest text-base uppercase focus:outline-none focus:border-violet"
                />
              </div>

              {modalError && <p className="text-coral text-xs mt-1">{modalError}</p>}

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  disabled={modalLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-line rounded-xl py-2 text-sm font-semibold text-ink-soft hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 bg-violet text-white rounded-xl py-2 text-sm font-semibold hover:bg-violet/90 transition-colors disabled:opacity-50"
                >
                  {modalLoading ? 'Joining...' : 'Join Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default StudentJoinedClass