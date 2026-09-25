import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../api/axios';
import MaterialFile from '../../../Components/dashboard/shared/MaterialFile';
import UploadMaterialModal from '../../../Components/dashboard/shared/UploadMaterialModal';
import { BookOpen, Plus, FileText, PenTool, Presentation, Star, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'lecture',
    title: 'Lectures & Notes',
    icon: FileText,
    description: 'Official lecture notes, handouts, and study guides',
    color: 'text-violet',
    bgColor: 'bg-violet/10',
    borderColor: 'border-violet/20',
  },
  {
    id: 'handwritten',
    title: 'Handwritten Notes',
    icon: PenTool,
    description: 'Class notes and handwritten practice summaries',
    color: 'text-coral',
    bgColor: 'bg-coral/10',
    borderColor: 'border-coral/20',
  },
  {
    id: 'slide',
    title: 'Slides & Presentations',
    icon: Presentation,
    description: 'Presentation slides and visual learning charts',
    color: 'text-mint',
    bgColor: 'bg-mint/10',
    borderColor: 'border-mint/20',
  },
  {
    id: 'important_question',
    title: 'Important Questions',
    icon: Star,
    description: 'Key exam questions, past papers, and solutions',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
];

const TeacherChapterDetail = () => {
  const { subjectId, chapterId } = useParams();
  const [chapterTitle, setChapterTitle] = useState('Chapter Details');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('lecture');

  useEffect(() => {
    fetchChapterAndMaterials();
  }, [subjectId, chapterId]);

  const fetchChapterAndMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch chapter details to get title
      if (subjectId) {
        const chapRes = await api.get(`/api/chapter/getchapter/${subjectId}`, { withCredentials: true });
        const allChapters = chapRes.data.chapter || [];
        const currentChap = allChapters.find((c) => c._id === chapterId);
        if (currentChap) {
          setChapterTitle(currentChap.title);
        }
      }

      // 2. Fetch materials for this chapter
      const matRes = await api.get('/api/material/materials', {
        params: { chapterId },
        withCredentials: true,
      });
      setMaterials(matRes.data || []);
    } catch (err) {
      console.error('Error fetching chapter details:', err);
      setError(err.response?.data?.message || 'Failed to load chapter materials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUploadModal = (category = 'lecture') => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleMaterialUploaded = (newMaterial) => {
    setMaterials((prev) => [newMaterial, ...prev]);
  };

  const handleMaterialDeleted = (deletedId) => {
    setMaterials((prev) => prev.filter((m) => m._id !== deletedId));
  };

  return (
    <section className="p-6 md:p-10 max-w-7xl mx-auto font-sans">
      
      {/* Navigation & Header */}
      <div className="mb-6">
        <Link
          to={`/teacher/subjects/${subjectId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet hover:underline mb-3"
        >
          <ArrowLeft size={14} /> Back to Chapters
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-violet/10 text-violet">
                <BookOpen size={20} />
              </span>
              <h1 className="font-display text-2xl md:text-2xl text-ink">
                {chapterTitle}
              </h1>
            </div>
            <p className="text-xs text-ink-soft mt-1">
              Organized study materials, notes, slides, and exam preparation files.
            </p>
          </div>

          <button
            onClick={() => handleOpenUploadModal('lecture')}
            className="px-4 py-2.5 rounded-xl bg-violet text-white font-sans font-semibold text-xs hover:bg-violet/90 transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <Plus size={16} /> Upload Material
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink-soft">
          <Loader2 size={32} className="animate-spin text-violet" />
          <p className="text-sm font-semibold">Loading chapter study materials...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm flex items-center justify-between my-4">
          <span>{error}</span>
          <button
            onClick={fetchChapterAndMaterials}
            className="flex items-center gap-1 text-xs font-bold underline hover:opacity-80 cursor-pointer"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Categories Sections Grid */}
      {!loading && !error && (
        <div className="space-y-8 mt-6">
          {CATEGORIES.map((cat) => {
            const catMaterials = materials.filter((m) => m.category === cat.id);
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                className="bg-paper/40 border border-line rounded-2xl p-5 md:p-6 transition-all"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-line/60">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${cat.bgColor} ${cat.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base md:text-lg text-ink flex items-center gap-2">
                        {cat.title}
                        <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded-full bg-paper border border-line text-ink-soft">
                          {catMaterials.length}
                        </span>
                      </h3>
                      <p className="text-xs text-ink-soft hidden sm:block">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenUploadModal(cat.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-line text-ink hover:border-violet hover:text-violet transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Plus size={14} />
                    <span>Upload</span>
                  </button>
                </div>

                {/* Category Material Files Grid */}
                {catMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {catMaterials.map((mat) => (
                      <MaterialFile
                        key={mat._id}
                        material={mat}
                        onDelete={handleMaterialDeleted}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty Category Placeholder */
                  <div className="border border-dashed border-line rounded-xl p-6 text-center bg-white/60 flex flex-col items-center justify-center gap-2">
                    <p className="text-xs text-ink-soft">
                      No files uploaded in <span className="font-semibold text-ink">{cat.title}</span> yet.
                    </p>
                    <button
                      onClick={() => handleOpenUploadModal(cat.id)}
                      className="mt-1 px-3 py-1 text-xs font-semibold rounded-lg bg-violet/10 text-violet hover:bg-violet hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> Add First File
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal Component */}
      {isModalOpen && (
        <UploadMaterialModal
          chapterId={chapterId}
          subjectId={subjectId}
          initialCategory={selectedCategory}
          onClose={() => setIsModalOpen(false)}
          onMaterialUploaded={handleMaterialUploaded}
        />
      )}

    </section>
  );
};

export default TeacherChapterDetail;