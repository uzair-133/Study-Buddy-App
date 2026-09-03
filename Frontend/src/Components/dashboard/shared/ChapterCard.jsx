import React, { useState } from 'react'
import api from '../../../api/axios'
import { EllipsisVertical, Trash2, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ChapterCard = ({ chapter, subjectId, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    e.stopPropagation()
    try {
      await api.delete(`/api/chapter/delete/${chapter._id}`, { withCredentials: true })
      if (onDelete) onDelete(chapter._id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleCardClick = () => {
    const sId = subjectId || chapter.subjectId
    if (chapter?._id && sId) {
      navigate(`/student/subjects/${sId}/chapters/${chapter._id}`)
    }
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl border border-line p-5 relative cursor-pointer hover:shadow-md transition-all hover:border-violet/40"
      >
        <div className="flex justify-between items-start">
          <h3 className="font-display font-semibold text-base text-ink hover:text-violet transition-colors flex-1 pr-2">
            {chapter.title}
          </h3>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <EllipsisVertical
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              size={20}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100"
            />

            {isMenuOpen && (
              <div className="absolute right-0 top-7 bg-white border border-line rounded-lg shadow-lg z-10 w-32 py-1">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-coral hover:bg-paper rounded-lg"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-ink-soft mt-3">
          <BookOpen size={16} className="text-violet" />
          <span>Chapter</span>
        </div>
        <span className="inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full bg-violet/10 text-violet">
          My Chapter
        </span>
      </div>
    </>
  )
}

export default ChapterCard