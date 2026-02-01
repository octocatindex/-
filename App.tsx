
import React, { useState } from 'react';
import { analyzeContent } from './services/geminiService';
import AnalysisReport from './components/AnalysisReport';

type Mode = 'html' | 'url';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('html');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError(mode === 'html' ? "请先粘贴网页源码。" : "请输入目标 URL。");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    try {
      const result = await analyzeContent(input, mode);
      setReport(result);
    } catch (err: any) {
      setError(err.message || "分析过程中发生意外错误。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 shadow-md">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-inner">
              <i className="fas fa-spider"></i>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Crawler Expert</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            复合型专家系统：逆向工程、网络协议分析与 Apache HttpClient 代码自动生成。
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-5xl -mt-8">
        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => { setMode('html'); setReport(null); }}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                mode === 'html' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className="fas fa-file-code"></i>
              源码粘贴模式
            </button>
            <button
              onClick={() => { setMode('url'); setReport(null); }}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                mode === 'url' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className="fas fa-globe"></i>
              URL 爬取模式
            </button>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                {mode === 'html' ? <><i className="fas fa-terminal"></i> Paste HTML Source</> : <><i className="fas fa-link"></i> Target Web URL</>}
              </label>
              <button 
                onClick={handleClear}
                className="text-slate-400 hover:text-slate-600 text-xs transition-colors"
              >
                清空内容
              </button>
            </div>
            
            {mode === 'html' ? (
              <textarea
                className="w-full h-80 p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="请在此粘贴目标页面的完整 HTML 源码..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            ) : (
              <div className="relative">
                <input
                  type="url"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                  placeholder="https://example.com/target-page"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <i className="fas fa-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !input.trim()}
                className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all transform flex items-center justify-center gap-3 shadow-lg ${
                  isAnalyzing || !input.trim() 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    正在通过 Google Search 爬取并进行协议分析...
                  </>
                ) : (
                  <>
                    <i className={`fas ${mode === 'html' ? 'fa-microchip' : 'fa-search-location'}`}></i>
                    {mode === 'html' ? '开始静态分析源码' : '自动爬取并生成方案'}
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 animate-headshake">
                <i className="fas fa-exclamation-triangle text-xl"></i>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        {isAnalyzing && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span className="text-slate-600 font-medium italic">
                {mode === 'url' ? '正在模拟浏览器行为获取 DOM 结构...' : '正在提取表单、隐藏域及脚本逻辑...'}
              </span>
            </div>
          </div>
        )}

        {/* Results */}
        {report && <AnalysisReport report={report} />}
      </main>

      <footer className="mt-20 py-8 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>© 2024 Crawler Reverse Engineering Studio. 仅供技术交流与合规自动化使用。</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="flex items-center gap-2"><i className="fas fa-shield-alt"></i> 静态深度扫描</span>
            <span className="flex items-center gap-2"><i className="fas fa-code-branch"></i> HttpClient 4.x Compatible</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
