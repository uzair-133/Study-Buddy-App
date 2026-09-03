import { useState } from 'react'
import api from '../../../api/axios'

const AddChapterModal = ({ subjectId, onClose, onChapterAdded }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title) {
      setError('Chapter title is required')
      return
    }

    setLoading(true)
    try {
      const res = await api.post(`/api/chapter/createChapter/${subjectId}`, { title }, { withCredentials: true })
      onChapterAdded(res.data.chapter)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark background overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal box */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm">
        <h2 className="font-display text-lg font-semibold mb-4">Add New Chapter</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Chapter 1: Introduction"
            className="border border-line rounded-xl px-4 py-2 text-sm"
          />

          {error && <p className="text-coral text-sm">{error}</p>}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-line rounded-xl py-2 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-violet text-white rounded-xl py-2 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddChapterModal