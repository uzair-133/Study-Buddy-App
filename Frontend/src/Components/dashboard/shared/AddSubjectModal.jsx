// import React from 'react'

// const AddSubjectModal = () => {
//   return (
//     <div>AddSubjectModal</div>
//   )
// }

// export default AddSubjectModal


import { useState } from 'react'
import api from '../../../api/axios'

const AddSubjectModal = ({ onClose, onSubjectAdded }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title) {
      setError('Subject name is required')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/api/subject/create', { title }, { withCredentials: true })
      onSubjectAdded(res.data.subject)   // Parent ko naya Subject bhej diya
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
        <h2 className="font-display text-lg font-semibold mb-4">Add New Subject</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mathematics"
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

export default AddSubjectModal