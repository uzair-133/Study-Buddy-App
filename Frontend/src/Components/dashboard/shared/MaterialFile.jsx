import React, { useState } from 'react';
import api from '../../../api/axios';
import { FileText, Eye, Trash2, Loader2, ExternalLink } from 'lucide-react';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Recently uploaded';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Uploaded just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Uploaded ${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Uploaded ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `Uploaded ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

const MaterialFile = ({ material, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${material.fileName}"?`)) {
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/api/material/materials/${material._id}`, { withCredentials: true });
      if (onDelete) {
        onDelete(material._id);
      }
    } catch (err) {
      console.error('Delete Material Error:', err);
      alert(err.response?.data?.message || 'Failed to delete material');
    } finally {
      setDeleting(false);
    }
  };

  const handleView = () => {
    if (material?.fileUrl) {
      window.open(material.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-line p-4 flex flex-col justify-between hover:shadow-md transition-all hover:border-violet/40 font-sans group">
      
      {/* File Top Info */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <FileText size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-ink truncate group-hover:text-violet transition-colors" title={material.fileName}>
            {material.fileName}
          </h4>
          <p className="text-xs text-ink-soft mt-0.5">
            {formatTimeAgo(material.createdAt)}
          </p>
        </div>
      </div>

      {/* Action Buttons: View & Delete */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-line/60">
        <button
          onClick={handleView}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-paper text-violet hover:bg-violet hover:text-white transition-colors cursor-pointer"
        >
          <Eye size={14} />
          <span>View</span>
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-coral/10 text-coral hover:bg-coral hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          title="Delete Material"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          <span>{deleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </div>

    </div>
  );
};

export default MaterialFile;