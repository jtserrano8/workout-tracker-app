import React from 'react';

function ScreenHeader({ title, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <h1 className="screen-title" style={{ marginBottom: 0 }}>{title}</h1>
      {children}
    </div>
  );
}

export default ScreenHeader;
