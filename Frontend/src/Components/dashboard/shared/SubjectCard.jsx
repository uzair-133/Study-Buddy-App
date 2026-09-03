import { useState, useEffect } from 'react'
import api from '../../../api/axios'
import { EllipsisVertical, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SubjectCard = ({ subject, onDelete }) => {
  const [chapterCount, setChapterCount] = useState(0)
  const [fileCount, setFileCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const chapterRes = await api.get(`/api/chapter/getchapter/${subject._id}`, { withCredentials: true })
        setChapterCount(chapterRes.data.chapter?.length || 0)
      } catch (err) {
        console.log(err)
      }
    }
    if (subject?._id) {
      fetchCounts()
    }
  }, [subject?._id])

  const handleDelete = async (e) => {
    e.stopPropagation()
    try {
      await api.delete(`/api/subject/delete/${subject._id}`, { withCredentials: true })
      onDelete(subject._id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleCardClick = () => {
    if (subject?._id) {
      navigate(`/student/subjects/${subject._id}`)
    }
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-line p-5 relative cursor-pointer hover:shadow-md transition-all hover:border-violet/40"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-display font-semibold text-base text-ink hover:text-violet transition-colors flex-1 pr-2">
          {subject.title}
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

      <p className="text-sm text-ink-soft mt-1">
        {chapterCount} chapters · {fileCount} files
      </p>
      <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full bg-violet/10 text-violet">
        My Subject
      </span>
    </div>
  )
}

export default SubjectCard