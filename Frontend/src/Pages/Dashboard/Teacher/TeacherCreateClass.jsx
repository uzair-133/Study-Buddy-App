import React, { useState, useEffect } from 'react'
import api from '../../../api/axios'
import { Copy, Check, Trash2, Users, Plus, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TeacherCreateClass = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState('')

  // Join code copy state
  const [copiedId, setCopiedId] = useState(null)

  const navigate = useNavigate()

  // 1. Fetch teacher classes
  const fetchClasses = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/class/getMyClass', { withCredentials: true })
      setClasses(res.data.allclass || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch classes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  // 2. Create new class
  const handleCreateClass = async (e) => {
    e.preventDefault()
    if (!newClassName.trim()) {
      setModalError('Class name is required')
      return
    }

    try {
      setModalLoading(true)
      setModalError('')
      const res = await api.post(
        '/api/class/createClass',
        { className: newClassName.trim() },
        { withCredentials: true }
      )

      if (res.data.success && res.data.data) {
        // Nayi class list ke top par add kardi
        setClasses((prev) => [res.data.data, ...prev])
        setNewClassName('')
        setIsModalOpen(false)
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create class')
    } finally {
      setModalLoading(false)
    }
  }

  // 3. Delete class
  const handleDeleteClass = async (classId, e) => {
    e.stopPropagation()
    const confirmDelete = window.confirm('Are you sure you want to delete this class?')
    if (!confirmDelete) return

    try {
      await api.delete(`/api/class/deleteClass/${classId}`, { withCredentials: true })
      setClasses((prev) => prev.filter((cls) => cls._id !== classId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete class')
    }
  }

  // 4. Copy Join Code
  const handleCopyCode = (code, id, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  return (
    <section className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="font-semibold font-display text-xl md:text-2xl text-ink">My Classes</h1>
          <p className="font-sans text-sm text-ink-soft">
            Create classes and share join codes with your students so they can access subjects & notes.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('')
            setIsModalOpen(true)
          }}
          className="px-4 py-2 text-sm w-fit rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={16} /> Create Class
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && <p className="mt-6 text-sm text-ink-soft">Loading classes...</p>}
      {error && <p className="mt-6 text-sm text-coral">{error}</p>}

      {/* Classes Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-6">
          {classes.map((cls) => (
            <div
              key={cls._id}
              onClick={() => navigate(`/teacher/classes/${cls._id}`)}
              className="bg-white rounded-xl border border-line p-5 relative cursor-pointer hover:shadow-md transition-all hover:border-violet/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-display font-semibold text-lg text-ink hover:text-violet transition-colors">
                    {cls.className}
                  </h3>

                  <button
                    onClick={(e) => handleDeleteClass(cls._id, e)}
                    title="Delete Class"
                    className="text-gray-400 hover:text-coral p-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-xs text-ink-soft mt-1">
                  Created: {new Date(cls.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Join Code Box */}
              <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-ink-soft uppercase tracking-wider block">
                    Join Code
                  </span>
                  <span className="font-mono font-bold text-base text-violet tracking-widest">
                    {cls.joinCode}
                  </span>
                </div>

                <button
                  onClick={(e) => handleCopyCode(cls.joinCode, cls._id, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet/10 text-violet hover:bg-violet/20 transition-colors cursor-pointer"
                >
                  {copiedId === cls._id ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Class Dashed Box */}
      {!loading && !error && (
        <div
          onClick={() => {
            setModalError('')
            setIsModalOpen(true)
          }}
          className="outline-dashed outline-2 outline-gray-300 rounded-xl p-6 mt-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-violet/10 text-violet flex items-center justify-center font-bold text-lg">
            +
          </div>
          <p className="font-semibold font-sans text-sm text-gray-500">Create another Class</p>
        </div>
      )}

      {/* Create Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !modalLoading && setIsModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl z-10">
            <h2 className="font-display text-lg font-semibold text-ink mb-1">Create New Class</h2>
            <p className="text-xs text-ink-soft mb-4">
              Enter class name. A unique join code will be generated automatically.
            </p>

            <form onSubmit={handleCreateClass} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1.5">Class Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. BSCS 4th Semester"
                  className="w-full border border-line rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-violet"
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
                  {modalLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default TeacherCreateClass