import React, { useState } from "react";
import api from "../../../api/axios";
import { X, UploadCloud, FileText, Loader2, AlertCircle } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "lecture", label: " Lectures & Notes" },
  { value: "handwritten", label: " Handwritten Notes" },
  { value: "slide", label: " Slides & Presentations" },
  { value: "important_question", label: "Important Questions" },
];

const UploadMaterialModal = ({
  chapterId,
  subjectId,
  initialCategory = "lecture",
  onClose,
  onMaterialUploaded,
}) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError(
          "File size exceeds the 20MB limit. Please choose a smaller file.",
        );
        setFile(null);
        return;
      }
      setError("");
      setFile(selectedFile);
      if (!fileName) {
        setFileName(selectedFile.name);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!chapterId || !subjectId) {
      setError("Chapter ID and Subject ID are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName || file.name);
      formData.append("category", category);
      formData.append("chapterId", chapterId);
      formData.append("subjectId", subjectId);

      const res = await api.post("/api/material/uploadMaterial", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (onMaterialUploaded && res.data.material) {
        onMaterialUploaded(res.data.material);
      }
      onClose();
    } catch (err) {
      console.error("Upload Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload material. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-line p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-line">
          <h2 className="font-display font-bold text-lg text-ink">
            Upload Study Material
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-ink-soft hover:bg-paper hover:text-ink transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-sans">
          {/* Category Select */}
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1.5">
              Category <span className="text-coral">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full input-field text-sm font-sans bg-white cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Title Input */}
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1.5">
              File Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 1 Algebra Notes"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              disabled={loading}
              className="w-full input-field text-sm font-sans"
            />
          </div>

          {/* File Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1.5">
              Upload Document / PDF <span className="text-coral">*</span>
            </label>
            <div className="relative border-2 border-dashed border-line rounded-xl p-5 text-center hover:border-violet/60 transition-colors bg-paper/50">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-violet/10 flex items-center justify-center text-violet">
                  <UploadCloud size={20} />
                </div>
                {file ? (
                  <div className="flex items-center gap-2 text-violet font-semibold text-xs">
                    <FileText size={16} />
                    <span className="truncate max-w-50">{file.name}</span>
                    <span className="text-ink-soft font-normal">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-ink">
                      Click to upload{" "}
                      <span className="text-ink-soft font-normal">
                        or drag & drop
                      </span>
                    </p>
                    <p className="text-[11px] text-ink-soft">
                      PDF, DOCX, PPT, PNG, JPG (Max 20MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-paper text-ink-soft hover:bg-line transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-violet text-white hover:bg-violet/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Uploading..." : "Upload Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterialModal;
