/**
 * Compress an image file using the Canvas API.
 *
 * @param {File} file - The image file to compress
 * @param {Object} options
 * @param {number} options.quality - Quality 0–1
 * @param {number} options.maxWidth - Max output width in px
 * @param {number} options.maxHeight - Max output height in px
 * @param {string} options.format - Output MIME type: 'image/jpeg' | 'image/webp' | 'image/png'
 * @returns {Promise<{blob: Blob, width: number, height: number, originalWidth: number, originalHeight: number}>}
 */
export function compressImage(file, options = {}) {
  const {
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1920,
    format = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Calculate new dimensions preserving aspect ratio
        let { width, height } = calculateDimensions(
          originalWidth,
          originalHeight,
          maxWidth,
          maxHeight
        );

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        // Use better quality interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            resolve({
              blob,
              width,
              height,
              originalWidth,
              originalHeight,
            });
          },
          format,
          format === 'image/png' ? undefined : quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Calculate new dimensions preserving aspect ratio, fitting within max bounds.
 */
function calculateDimensions(origWidth, origHeight, maxWidth, maxHeight) {
  let width = origWidth;
  let height = origHeight;

  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  return { width, height };
}

/**
 * Format bytes to a human-readable string.
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Get the file extension for a MIME type.
 */
export function getExtension(mimeType) {
  const map = {
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/png': 'png',
  };
  return map[mimeType] || 'jpg';
}
