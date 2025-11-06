import React from 'react';
import './Image.css';

/**
 * @function Image
 * @description A flexible image component that can display images from either local files or URLs.
 * Used in the Syllabus Page Builder for displaying course-related images, diagrams, or visual content.
 * Supports both local file paths and external URLs with proper error handling and accessibility features.
 * @param {string} type - The source type of the image. Either 'file' for local files or 'url' for external URLs
 * @param {string} value - The file path (for type='file') or URL (for type='url') of the image
 * @param {string} [alt] - Optional alt text for accessibility. Defaults to descriptive text based on type
 * @param {string} [className] - Optional CSS class name for custom styling
 * @param {Object} [style] - Optional inline styles object
 * @param {number} [maxWidth] - Optional maximum width in pixels (default: 500)
 * @param {number} [maxHeight] - Optional maximum height in pixels (default: 400)
 * @returns {JSX.Element} An image element with proper error handling and responsive design
 * @example
 * // Display image from URL
 * <Image 
 *   type="url"
 *   value="https://example.com/image.jpg"
 *   alt="Course diagram"
 * />
 * 
 * @example
 * // Display local file
 * <Image 
 *   type="file"
 *   value="/assets/course-logo.png"
 *   alt="Course logo"
 *   maxWidth={300}
 * />
 */
function Image({
  type,
  value,
  alt,
  className = '',
  style = {},
  maxWidth = 500,
  maxHeight = 400,
}) {
  const [imageError, setImageError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Generate default alt text if not provided
  const defaultAlt = type === 'file' 
    ? `Image from file: ${value}` 
    : `Image from URL: ${value}`;

  // Handle image load error
  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  // Validate required props
  if (!type || !value) {
    return (
      <div 
        className={`image-error ${className}`}
        style={{
          padding: '20px',
          border: '2px dashed #dc3545',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          maxWidth: `${maxWidth}px`,
          ...style
        }}
      >
        <strong>Image Error:</strong> Both 'type' and 'value' props are required
      </div>
    );
  }

  // Validate type parameter
  if (type !== 'file' && type !== 'url') {
    return (
      <div 
        className={`image-error ${className}`}
        style={{
          padding: '20px',
          border: '2px dashed #dc3545',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          maxWidth: `${maxWidth}px`,
          ...style
        }}
      >
        <strong>Image Error:</strong> Type must be either 'file' or 'url', got: '{type}'
      </div>
    );
  }

  // Show error state if image failed to load
  if (imageError) {
    return (
      <div 
        className={`image-error ${className}`}
        style={{
          padding: '20px',
          border: '2px dashed #dc3545',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          maxWidth: `${maxWidth}px`,
          ...style
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <strong>Failed to load image</strong>
        </div>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          {type === 'file' ? 'File path:' : 'URL:'} {value}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`image-container ${className}`}
      style={{
        display: 'inline-block',
        maxWidth: `${maxWidth}px`,
        position: 'relative',
        ...style
      }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            color: '#28a745',
            fontSize: '14px',
            zIndex: 1
          }}
        >
          Loading image...
        </div>
      )}
      
      <img
        src={value}
        alt={alt || defaultAlt}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          maxWidth: '100%',
          maxHeight: `${maxHeight}px`,
          height: 'auto',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e9ecef',
          display: 'block',
          opacity: isLoading ? 0.5 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* Image info caption */}
      <div
        style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#6c757d',
          textAlign: 'center',
          fontStyle: 'italic'
        }}
      >
        {type === 'file' ? '📁 Local file' : '🌐 External URL'}
      </div>
    </div>
  );
}

export default Image;