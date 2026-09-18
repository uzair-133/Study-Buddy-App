export const openFileViewer = (fileUrl, fileName = '') => {
  if (!fileUrl) return;

  const urlLower = fileUrl.toLowerCase();
  const nameLower = fileName.toLowerCase();

  // Check if file has an explicit image or PDF extension in the URL
  const hasDirectImageExt = /\.(jpg|jpeg|png|webp|svg|gif)($|\?)/i.test(urlLower);
  const hasDirectPdfExt = /\.pdf($|\?)/i.test(urlLower);

  if (hasDirectPdfExt || hasDirectImageExt) {
    // Direct link works for browser native viewing when URL has file extension
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  } else {
    // For Office documents (.docx, .pptx, .xlsx, .doc) or older ImageKit uploads lacking extensions,
    // Google Docs Viewer displays the file inline in the browser tab instead of triggering a download.
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=false`;
    window.open(googleViewerUrl, '_blank', 'noopener,noreferrer');
  }
};
