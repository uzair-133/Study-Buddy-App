import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import {
  Search,
  X,
  BookOpen,
  Folder,
  FileText,
  PenTool,
  Presentation,
  Star,
  ArrowRight,
  ExternalLink,
  Sparkles,
  SearchX,
  Loader2,
  FolderOpen
} from 'lucide-react';

const StudentSearch = () => {
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchData, setSearchData] = useState({ subject: [], chapter: [], material: [] });
  const [hasSearched, setHasSearched] = useState(false);

  const getResult = async (searchTerm, cat) => {
    if (!searchTerm || !searchTerm.trim()) {
      setSearchData({ subject: [], chapter: [], material: [] });
      setHasSearched(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setHasSearched(true);
      const res = await api.get(`/api/search/?category=${cat}&keyword=${encodeURIComponent(searchTerm.trim())}`, {
        withCredentials: true
      });

      const data = res.data?.allData || {};
      setSearchData({
        subject: data.subject || [],
        chapter: data.chapter || [],
        material: data.material || data.files || []
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getResult(keyword, category);
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [keyword, category]);

  const handleClear = () => {
    setKeyword('');
    setSearchData({ subject: [], chapter: [], material: [] });
    setHasSearched(false);
    setError('');
  };

  const handleSuggestionClick = (term) => {
    setKeyword(term);
  };

  const subjectsList = searchData.subject || [];
  const chaptersList = searchData.chapter || [];
  const materialsList = searchData.material || searchData.files || [];

  const totalResults = subjectsList.length + chaptersList.length + materialsList.length;

  const getCategoryBadge = (catType) => {
    switch (catType) {
      case 'lecture':
        return { label: 'Lecture Notes', icon: FileText, style: 'bg-violet/10 text-violet border-violet/20' };
      case 'handwritten':
        return { label: 'Handwritten', icon: PenTool, style: 'bg-coral/10 text-coral border-coral/20' };
      case 'slide':
        return { label: 'Slides', icon: Presentation, style: 'bg-mint/10 text-mint border-mint/20' };
      case 'important_question':
        return { label: 'Questions', icon: Star, style: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
      default:
        return { label: 'File', icon: FileText, style: 'bg-gray-100 text-ink-soft border-gray-200' };
    }
  };

  return (
    <section className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-ink font-semibold font-display text-2xl sm:text-3xl">
              Search Study Material
            </h1>
            <span className="bg-violet/10 text-violet p-1.5 rounded-xl">
              <Sparkles size={20} />
            </span>
          </div>
          <p className="text-ink-soft font-sans text-xs sm:text-sm mt-1">
            Search notes, chapters, slides, and subjects across your entire workspace.
          </p>
        </div>
      </div>

      {/* Search Input Bar & Category Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-line shadow-xs space-y-4">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-violet pointer-events-none" size={20} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-paper rounded-xl text-ink font-sans placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet transition-all text-sm sm:text-base border border-gray-200"
            placeholder="Type to search subjects, chapters, files or notes..."
          />
          {keyword && (
            <button
              onClick={handleClear}
              className="absolute right-3 p-1 rounded-full text-ink-soft hover:text-ink hover:bg-gray-200 transition-colors"
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider mr-1">Filter:</span>
          
          <button
            onClick={() => setCategory('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer ${
              category === 'all'
                ? 'bg-violet text-white shadow-xs'
                : 'bg-paper text-ink-soft hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <Sparkles size={14} />
            All
            {hasSearched && category === 'all' && (
              <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                {totalResults}
              </span>
            )}
          </button>

          <button
            onClick={() => setCategory('subject')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer ${
              category === 'subject'
                ? 'bg-violet text-white shadow-xs'
                : 'bg-paper text-ink-soft hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <BookOpen size={14} />
            Subjects
            {hasSearched && (
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${category === 'subject' ? 'bg-white/20 text-white' : 'bg-gray-200 text-ink-soft'}`}>
                {subjectsList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCategory('chapter')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer ${
              category === 'chapter'
                ? 'bg-violet text-white shadow-xs'
                : 'bg-paper text-ink-soft hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <Folder size={14} />
            Chapters
            {hasSearched && (
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${category === 'chapter' ? 'bg-white/20 text-white' : 'bg-gray-200 text-ink-soft'}`}>
                {chaptersList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCategory('files')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer ${
              category === 'files'
                ? 'bg-violet text-white shadow-xs'
                : 'bg-paper text-ink-soft hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <FileText size={14} />
            Files & Notes
            {hasSearched && (
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${category === 'files' ? 'bg-white/20 text-white' : 'bg-gray-200 text-ink-soft'}`}>
                {materialsList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-coral/10 border border-coral/20 text-coral p-4 rounded-xl text-sm flex items-center justify-between">
          <p>{error}</p>
          <button onClick={() => getResult(keyword, category)} className="font-semibold underline hover:opacity-80">
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-ink-soft text-sm">
            <Loader2 className="animate-spin text-violet" size={18} />
            <span>Searching your study materials...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-line rounded-2xl p-5 animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Idle / Initial State Suggestions */}
      {!loading && !keyword && (
        <div className="bg-paper/60 border border-line rounded-2xl p-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-violet/10 text-violet rounded-full">
            <Search size={28} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-ink">Ready to Find Anything</h3>
            <p className="text-ink-soft text-sm max-w-md mx-auto mt-1">
              Start typing above to quickly locate subjects, chapters, or files uploaded in your study buddy portal.
            </p>
          </div>
          
          <div className="pt-2">
            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2">Try searching for:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Notes', 'Lecture', 'Assignment', 'Exam', 'Chapter 1'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSuggestionClick(term)}
                  className="px-3 py-1 bg-white hover:bg-violet hover:text-white text-ink-soft border border-line rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results Found State */}
      {!loading && hasSearched && totalResults === 0 && !error && (
        <div className="bg-white border border-line rounded-2xl p-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-coral/10 text-coral rounded-full">
            <SearchX size={32} />
          </div>
          <h3 className="font-display font-semibold text-lg text-ink">No Results Found</h3>
          <p className="text-ink-soft text-sm max-w-md mx-auto">
            We couldn't find anything matching <span className="font-semibold text-ink">"{keyword}"</span>.
          </p>
          <div className="text-xs text-ink-soft space-y-1 pt-2">
            <p>• Make sure all words are spelled correctly.</p>
            <p>• Try using broader or different search terms.</p>
            <p>• Make sure you have selected the <strong className="text-violet cursor-pointer" onClick={() => setCategory('all')}>All</strong> category.</p>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {!loading && hasSearched && totalResults > 0 && (
        <div className="space-y-8">
          {/* Summary Banner */}
          <div className="flex items-center justify-between text-sm text-ink-soft border-b border-line pb-2">
            <span>Found <strong>{totalResults}</strong> result{totalResults === 1 ? '' : 's'} for "<strong>{keyword}</strong>"</span>
          </div>

          {/* Subjects Section */}
          {(category === 'all' || category === 'subject') && subjectsList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-ink-soft">
                <BookOpen size={18} className="text-violet" />
                <h2 className="font-semibold text-sm font-sans uppercase tracking-wider">
                  Subjects ({subjectsList.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectsList.map((s) => (
                  <div
                    key={s._id}
                    className="bg-white rounded-2xl border border-line p-5 hover:border-violet/40 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet/10 text-violet">
                          Subject
                        </span>
                        {s.createdAt && (
                          <span className="text-xs text-ink-soft/70">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-base text-ink group-hover:text-violet transition-colors">
                        {s.title}
                      </h3>
                    </div>

                    <Link
                      to={`/student/subjects/${s._id}`}
                      className="mt-4 flex items-center justify-between text-xs font-semibold text-violet hover:underline pt-3 border-t border-line/60"
                    >
                      <span>Open Subject</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chapters Section */}
          {(category === 'all' || category === 'chapter') && chaptersList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-ink-soft">
                <Folder size={18} className="text-violet" />
                <h2 className="font-semibold text-sm font-sans uppercase tracking-wider">
                  Chapters ({chaptersList.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chaptersList.map((chap) => {
                  const parentSubjectId = chap.subjectId?._id || chap.subjectId;
                  const parentSubjectTitle = chap.subjectId?.title || 'Subject';

                  return (
                    <div
                      key={chap._id}
                      className="bg-white rounded-2xl border border-line p-5 hover:border-violet/40 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-coral/10 text-coral">
                            Chapter
                          </span>
                          <span className="text-xs font-semibold text-ink-soft truncate max-w-[150px]" title={parentSubjectTitle}>
                            {parentSubjectTitle}
                          </span>
                        </div>
                        <h3 className="font-display font-semibold text-base text-ink group-hover:text-violet transition-colors">
                          {chap.title}
                        </h3>
                      </div>

                      {parentSubjectId ? (
                        <Link
                          to={`/student/subjects/${parentSubjectId}/chapters/${chap._id}`}
                          className="mt-4 flex items-center justify-between text-xs font-semibold text-violet hover:underline pt-3 border-t border-line/60"
                        >
                          <span>Open Chapter</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <div className="mt-4 pt-3 border-t border-line/60 text-xs text-ink-soft">
                          Chapter Item
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Materials / Files Section */}
          {(category === 'all' || category === 'files') && materialsList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-ink-soft">
                <FileText size={18} className="text-violet" />
                <h2 className="font-semibold text-sm font-sans uppercase tracking-wider">
                  Files & Notes ({materialsList.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materialsList.map((mat) => {
                  const badge = getCategoryBadge(mat.category);
                  const IconComp = badge.icon;
                  const subjectTitle = mat.subjectId?.title;
                  const chapterTitle = mat.chapterId?.title;

                  return (
                    <div
                      key={mat._id}
                      className="bg-white rounded-2xl border border-line p-5 hover:border-violet/40 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.style}`}>
                            <IconComp size={12} />
                            {badge.label}
                          </span>
                          {mat.createdAt && (
                            <span className="text-xs text-ink-soft/70">
                              {new Date(mat.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <h3 className="font-semibold font-sans text-base text-ink group-hover:text-violet transition-colors line-clamp-1">
                          {mat.fileName}
                        </h3>

                        {(subjectTitle || chapterTitle) && (
                          <div className="flex items-center gap-1 text-xs text-ink-soft">
                            <FolderOpen size={12} className="text-violet/70 shrink-0" />
                            <span className="truncate">
                              {subjectTitle && <strong>{subjectTitle}</strong>}
                              {subjectTitle && chapterTitle && ' > '}
                              {chapterTitle && <span>{chapterTitle}</span>}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-line/60">
                        {mat.fileUrl ? (
                          <a
                            href={mat.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet/10 hover:bg-violet hover:text-white text-violet text-xs font-semibold transition-all"
                          >
                            <ExternalLink size={12} />
                            View / Download
                          </a>
                        ) : (
                          <span className="text-xs text-ink-soft">No preview available</span>
                        )}

                        {mat.subjectId?._id && mat.chapterId?._id && (
                          <Link
                            to={`/student/subjects/${mat.subjectId._id}/chapters/${mat.chapterId._id}`}
                            className="text-xs font-semibold text-ink-soft hover:text-violet hover:underline flex items-center gap-1"
                          >
                            Go to Chapter <ArrowRight size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default StudentSearch;
