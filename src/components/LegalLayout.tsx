import React from 'react';

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-8 border-b border-slate-100 pb-6">
          {title}
        </h1>
        <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600">
          {children}
        </div>
      </div>
    </div>
  );
}
