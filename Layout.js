import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="w-screen h-screen bg-blue-900 text-white overflow-hidden">
      {children}
    </div>
  );
}
