
import React, { useState } from 'react';

interface AnalysisReportProps {
  report: string;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mt-8">
      <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <i className="fas fa-file-contract"></i>
          Analysis Report
        </h2>
        <button
          onClick={handleCopy}
          className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition-colors flex items-center gap-2"
        >
          <i className={`fas ${copied ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
          {copied ? 'Copied!' : 'Copy Markdown'}
        </button>
      </div>
      <div className="p-6 prose max-w-none overflow-x-auto text-slate-700">
        <div className="markdown-body">
          {/* We render the raw text in a pre block for simplicity as it contains complex table structures, 
              but in a real-world scenario, we'd use a markdown parser. 
              Given the constraints, we'll display it cleanly. */}
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded">
            {report}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
