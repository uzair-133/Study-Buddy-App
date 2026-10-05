import React, { useContext, useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../../../Context/UserContext"
import api from "../../../api/axios"
import { Search, X, BookOpen, Folder, FileText, ArrowRight, Loader2 } from "lucide-react"
import { openFileViewer } from "../../../utils/fileViewer"

const Welcome = () => {
  const { user } = useContext(UserContext) || {}
  const navigate = useNavigate()
  const location = useLocation()
  const basePath = location.pathname.startsWith("/teacher") ? "/teacher" : "/student"

  const [query, setQuery] = useState("")
  const [results, setResults] = useState({ subject: [], chapter: [], material: [] })
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef(null)

  // 1. Live debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ subject: [], chapter: [], material: [] })
      setIsOpen(false)
      setLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await api.get(
          `/api/search/?category=all&keyword=${encodeURIComponent(query.trim())}`,
          { withCredentials: true }
        )
        const data = res.data?.allData || {}
        setResults({
          subject: data.subject || [],
          chapter: data.chapter || [],
          material: data.material || data.files || [],
        })
        setIsOpen(true)
      } catch (err) {
        console.error("Search error in Welcome bar:", err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  // 2. Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 3. Handle submit to dedicated search page
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      navigate(`${basePath}/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  // 4. Quick navigation
  const handleItemClick = (type, item) => {
    setIsOpen(false)
    if (type === "subject") {
      navigate(`${basePath}/subjects/${item._id}`)
    } else if (type === "chapter") {
      const subjectId = item.subjectId?._id || item.subjectId
      navigate(`${basePath}/subjects/${subjectId}/chapters/${item._id}`)
    } else if (type === "material") {
      if (item.fileUrl) {
        openFileViewer(item.fileUrl, item.fileName)
      }
    }
  }

  const subjectsList = results.subject || []
  const chaptersList = results.chapter || []
  const materialsList = results.material || []
  const totalCount = subjectsList.length + chaptersList.length + materialsList.length

  return (
    <section className="flex flex-col-reverse gap-4 md:flex-row md:justify-between md:items-center">
      {/* Welcome Title */}
      <div>
        <h1 className="font-semibold md:text-2xl font-display capitalize text-ink">
          {user?.role || "Student"} Dashboard
        </h1>
        <p className="font-semibold text-lg pt-1 text-violet font-sans">
          Welcome back, {user?.name || "Student"}!
        </p>
        <p className="text-xs md:text-sm text-ink-soft">
          Here's what's happening across your subjects and classes.
        </p>
      </div>

      {/* Functional Search Bar */}
      <div ref={dropdownRef} className="relative w-full md:w-80">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim()) setIsOpen(true)
            }}
            placeholder="Search subjects, notes, files..."
            className="w-full border border-gray-300 rounded-full pl-9 pr-8 py-2 text-sm bg-white focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition-all shadow-2xs text-ink placeholder:text-gray-400"
          />

          {loading ? (
            <Loader2
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-violet animate-spin"
            />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setIsOpen(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
            >
              <X size={15} />
            </button>
          ) : null}
        </form>

        {/* Live Search Results Dropdown */}
        {isOpen && query.trim() && (
          <div className="absolute right-0 top-11 w-full md:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2 overflow-hidden max-h-[420px] overflow-y-auto">
            {totalCount === 0 && !loading && (
              <div className="p-4 text-center text-xs text-ink-soft">
                No matching results found for "<strong className="text-ink">{query}</strong>"
              </div>
            )}

            {/* Subjects Group */}
            {subjectsList.length > 0 && (
              <div className="mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft px-3 py-1 block">
                  Subjects ({subjectsList.length})
                </span>
                {subjectsList.slice(0, 3).map((sub) => (
                  <div
                    key={sub._id}
                    onClick={() => handleItemClick("subject", sub)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-violet/10 hover:text-violet transition-colors cursor-pointer text-xs"
                  >
                    <BookOpen size={15} className="text-violet shrink-0" />
                    <span className="font-semibold truncate text-ink hover:text-violet">{sub.title}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Chapters Group */}
            {chaptersList.length > 0 && (
              <div className="mb-2 border-t border-gray-100 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft px-3 py-1 block">
                  Chapters ({chaptersList.length})
                </span>
                {chaptersList.slice(0, 3).map((chap) => (
                  <div
                    key={chap._id}
                    onClick={() => handleItemClick("chapter", chap)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-violet/10 transition-colors cursor-pointer text-xs"
                  >
                    <Folder size={15} className="text-amber-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate text-ink">{chap.title}</p>
                      {chap.subjectId?.title && (
                        <p className="text-[10px] text-ink-soft truncate">{chap.subjectId.title}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Files / Materials Group */}
            {materialsList.length > 0 && (
              <div className="mb-2 border-t border-gray-100 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft px-3 py-1 block">
                  Files & Notes ({materialsList.length})
                </span>
                {materialsList.slice(0, 3).map((mat) => (
                  <div
                    key={mat._id}
                    onClick={() => handleItemClick("material", mat)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-violet/10 transition-colors cursor-pointer text-xs"
                  >
                    <FileText size={15} className="text-mint shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate text-ink">{mat.fileName}</p>
                      <p className="text-[10px] text-ink-soft truncate capitalize">{mat.category || "Note"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View All Button at Bottom */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full text-center py-2 px-3 rounded-xl bg-violet/10 text-violet hover:bg-violet hover:text-white transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>See all results for "{query}"</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Welcome