import React from 'react';

// Styled Link Component
const SidebarLink = ({ children, href, onClick, style = {} }) => {
  const linkStyle = {
    backgroundColor: '#f5f5f5',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2c5aa0',
    display: 'inline-block',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    ...style
  };

  if (href) {
    return (
      <a href={href} style={linkStyle} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <span onClick={onClick} style={linkStyle}>
      {children}
    </span>
  );
};

const SidebarLayout = ({ 
  sidebarTitle = "", 
  sidebarContent = "", 
  children,
  sidebarWidth = "300px",
  backgroundColor = "#f8f9fa",
  borderColor = "#dee2e6",
  accentColor = "#ffc107"
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        minHeight: '200px',
        // border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        overflow: 'hidden',
        margin: '1rem 0',
        backgroundColor: '#fff',
        // boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Left Sidebar */}
      <div 
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
        //   backgroundColor: backgroundColor,
          borderRight: `1px solid ${borderColor}`,
          display: 'flex',
          flexDirection: 'row',
          position: 'relative'
        }}
      >
        {/* Sidebar content */}
        <div 
          style={{
            flex: 1,
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {sidebarTitle && (
            <h3 
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#2c5aa0',
                lineHeight: '1.3'
              }}
            >
              {sidebarTitle}
            </h3>
          )}
          
          <div 
            style={{
              fontSize: '0.95rem',
              lineHeight: '1.6',
              color: '#333333',
              flex: 1
            }}
          >
            {typeof sidebarContent === 'string' ? (
              <p style={{ margin: 0 }}>{sidebarContent}</p>
            ) : (
              sidebarContent
            )}
          </div>
        </div>
        
        {/* Yellow accent bar with square */}
        <div 
          style={{
            width: '4px',
            backgroundColor: accentColor,
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {/* Small square at the top */}
          <div 
            style={{
              position: 'absolute',
              top: '0',
              left: '-4px', // Center the square on the accent bar
              width: '12px',
              height: '12px',
              backgroundColor: accentColor,
              borderRadius: '2px'
              
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        style={{
          flex: 1,
          padding: '1.25rem 1.5rem',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
export { SidebarLink };