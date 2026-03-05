import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clipboard, 
  Trash2, 
  Sparkles, 
  Check, 
  Download, 
  MessageSquare, 
  User, 
  Bot,
  ArrowRight,
  Loader2,
  Copy,
  FileJson,
  FileText,
  FileCode,
  Globe,
  ChevronDown,
  Paperclip,
  File,
  ExternalLink,
  MousePointer2,
  Info
} from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cleanConversation, type CleanedConversation, type ChatMessage } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [rawText, setRawText] = useState('');
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanedData, setCleanedData] = useState<CleanedConversation | null>(null);
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showBookmarkletModal, setShowBookmarkletModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleClean = async () => {
    if (!rawText.trim()) return;
    
    setIsCleaning(true);
    setError(null);
    try {
      const result = await cleanConversation(rawText);
      setCleanedData(result);
      // Scroll to result after a short delay for animation
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsCleaning(false);
    }
  };

  const handleCopyAll = () => {
    if (!cleanedData) return;
    let text = cleanedData.messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');
    
    if (cleanedData.attachments && cleanedData.attachments.length > 0) {
      text += '\n\n---\nAttachments:\n' + cleanedData.attachments.map(a => `- ${a.name}`).join('\n');
    }
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!cleanedData) return;
    let markdown = `# ${cleanedData.title}\n\n` + 
      cleanedData.messages
        .map(m => `### ${m.role === 'user' ? 'User' : 'Assistant'}\n${m.content}`)
        .join('\n\n');
    
    if (cleanedData.attachments && cleanedData.attachments.length > 0) {
      markdown += '\n\n---\n## Attachments\n' + cleanedData.attachments.map(a => `- ${a.name}`).join('\n');
    }
    
    downloadFile(markdown, `${cleanedData.title.toLowerCase().replace(/\s+/g, '-')}.md`, 'text/markdown');
    setShowExportMenu(false);
  };

  const handleDownloadJSON = () => {
    if (!cleanedData) return;
    const json = JSON.stringify(cleanedData, null, 2);
    downloadFile(json, `${cleanedData.title.toLowerCase().replace(/\s+/g, '-')}.json`, 'application/json');
    setShowExportMenu(false);
  };

  const handleDownloadText = () => {
    if (!cleanedData) return;
    let text = cleanedData.messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');
    
    if (cleanedData.attachments && cleanedData.attachments.length > 0) {
      text += '\n\n---\nAttachments:\n' + cleanedData.attachments.map(a => `- ${a.name}`).join('\n');
    }
    
    downloadFile(text, `${cleanedData.title.toLowerCase().replace(/\s+/g, '-')}.txt`, 'text/plain');
    setShowExportMenu(false);
  };

  const handleDownloadHTML = () => {
    if (!cleanedData) return;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cleanedData.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f9fafb; color: #111827; }
        .user-bubble { background-color: white; border: 1px solid #e5e7eb; border-radius: 24px; padding: 24px; margin-bottom: 24px; margin-left: 48px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .assistant-bubble { background-color: #18181b; color: #f4f4f5; border-radius: 24px; padding: 24px; margin-bottom: 24px; margin-right: 48px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .label { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; opacity: 0.5; }
        .markdown-body { font-size: 14px; line-height: 1.6; }
        .markdown-body p { margin-bottom: 16px; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body code { font-family: 'JetBrains Mono', monospace; background-color: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 4px; font-size: 12px; }
        .assistant-bubble .markdown-body code { background-color: rgba(255,255,255,0.1); }
        .markdown-body pre { background-color: #27272a; color: #f4f4f5; padding: 16px; border-radius: 12px; overflow-x: auto; margin: 16px 0; border: 1px solid rgba(255,255,255,0.1); }
        .markdown-body ul, .markdown-body ol { margin-left: 24px; margin-bottom: 16px; }
        .markdown-body ul { list-style-type: disc; }
        .markdown-body ol { list-style-type: decimal; }
        .attachments-section { margin-top: 48px; padding-top: 32px; border-top: 1px solid #e5e7eb; }
        .attachment-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4b5563; margin-bottom: 8px; }
        @media (max-width: 640px) {
            .user-bubble { margin-left: 12px; }
            .assistant-bubble { margin-right: 12px; }
        }
    </style>
</head>
<body class="py-16 px-4 max-w-4xl mx-auto">
    <header class="text-center mb-16">
        <h1 class="text-4xl font-bold tracking-tight text-zinc-900 mb-2">${cleanedData.title}</h1>
        <p class="text-zinc-500 uppercase tracking-widest text-xs font-medium">Purified Chat Export</p>
    </header>
    <main id="content">
        ${cleanedData.messages.map(m => `
            <div class="${m.role === 'user' ? 'user-bubble' : 'assistant-bubble'}">
                <div class="label">${m.role === 'user' ? 'User' : 'Assistant'}</div>
                <div class="markdown-body">${m.content}</div>
            </div>
        `).join('')}
        
        ${cleanedData.attachments && cleanedData.attachments.length > 0 ? `
            <div class="attachments-section">
                <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    Detected Attachments
                </h2>
                <div class="space-y-2">
                    ${cleanedData.attachments.map(a => `
                        <div class="attachment-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                            ${a.name}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    </main>
    <footer class="text-center mt-24 pb-12 text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-medium">
        Generated by Chat Purifier
    </footer>
    <script>
        document.querySelectorAll('.markdown-body').forEach(el => {
            el.innerHTML = marked.parse(el.textContent);
        });
    </script>
</body>
</html>`;

    downloadFile(htmlContent, `${cleanedData.title.toLowerCase().replace(/\s+/g, '-')}.html`, 'text/html');
    setShowExportMenu(false);
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setRawText('');
    setCleanedData(null);
    setError(null);
  };

  const bookmarkletRef = useRef<HTMLAnchorElement>(null);
  const bookmarkletCode = `javascript:(function(){const style=document.createElement('style');style.innerHTML='.cp-overlay{position:fixed;top:20px;right:20px;z-index:999999;background:#18181b;color:white;padding:16px;border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);font-family:sans-serif;width:240px;border:1px solid #3f3f46;text-align:left}.cp-btn{background:#10b981;color:white;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;width:100%;font-weight:bold;margin-top:12px;font-size:14px;transition:all 0.2s}.cp-btn:hover{background:#059669}.cp-status{font-size:12px;margin-top:8px;color:#a1a1aa;line-height:1.4}';document.head.appendChild(style);const overlay=document.createElement('div');overlay.className='cp-overlay';overlay.innerHTML='<div style="font-weight:bold;margin-bottom:4px;font-size:16px;color:#10b981">Chat Purifier</div><div class="cp-status">Ready to capture conversation</div><button class="cp-btn">Start Capture</button>';document.body.appendChild(overlay);const btn=overlay.querySelector('.cp-btn');const status=overlay.querySelector('.cp-status');btn.onclick=async function(){btn.disabled=true;btn.style.opacity='0.5';status.innerText='Detecting chat container...';const findContainer=()=>{const divs=Array.from(document.querySelectorAll('div, main, article'));const scrollable=divs.filter(d=>{const s=window.getComputedStyle(d);const isScrollable=s.overflowY==='auto'||s.overflowY==='scroll';return isScrollable&&d.scrollHeight>d.clientHeight+50});return scrollable.sort((a,b)=>b.scrollHeight-a.scrollHeight)[0]||document.documentElement};const main=findContainer();status.innerText='Scrolling to load all content...';let lastHeight=0;let sameHeightCount=0;const maxWait=20;for(let i=0;i<100;i++){const currentHeight=main.scrollHeight;main.scrollTo({top:main.scrollHeight,behavior:\"smooth\"});status.innerText=\`Scrolling... (\${i+1})\`;await new Promise(r=>setTimeout(r,600));if(currentHeight===lastHeight){sameHeightCount++;if(sameHeightCount>=3)break}else{sameHeightCount=0}lastHeight=currentHeight}status.innerText='Extracting dialogue...';const text=main.innerText.replace(/\\n{3,}/g,'\\n\\n');try{await navigator.clipboard.writeText(text);status.innerHTML='<span style=\"color:#10b981;font-weight:bold\">✓ Success!</span><br>Conversation copied to clipboard.';btn.innerText='Close';btn.disabled=false;btn.style.opacity='1';btn.onclick=()=>{overlay.remove();style.remove()}}catch(e){status.innerText='Error copying to clipboard. Try manual copy.';console.error(e)}}})()`;

  React.useEffect(() => {
    if (bookmarkletRef.current) {
      bookmarkletRef.current.setAttribute('href', bookmarkletCode);
    }
  }, [showBookmarkletModal, bookmarkletCode]);

  const handleCopyBookmarkletCode = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    alert('Bookmarklet code copied! You can manually create a bookmark and paste this as the URL.');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center py-12 px-4 sm:px-6">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 bg-zinc-900 rounded-2xl mb-6 shadow-lg">
          <Sparkles className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl mb-4">
          Chat Purifier
        </h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Paste your messy AI chat logs. Get back a clean, structured conversation ready for sharing or archiving.
        </p>
        
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => setShowBookmarkletModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-colors border border-emerald-100"
          >
            <MousePointer2 className="w-4 h-4" />
            Install One-Click Capture
          </button>
        </div>
      </motion.header>

      <main className="max-w-4xl w-full space-y-8">
        {/* Input Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden"
        >
          <div className="p-6 border-bottom border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2 text-zinc-500 font-medium text-sm">
              <Clipboard className="w-4 h-4" />
              Raw Chat Log
            </div>
            <button 
              onClick={handleClear}
              className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              title="Clear input"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your copied chat here (including all the 'Copy', 'Regenerate', and timestamps noise)..."
              className="w-full h-64 p-4 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-zinc-900 transition-all resize-none font-mono text-sm"
            />
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClean}
                disabled={isCleaning || !rawText.trim()}
                className={cn(
                  "flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg",
                  isCleaning || !rawText.trim() 
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                    : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95"
                )}
              >
                {isCleaning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Purifying...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Clean Conversation
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.section>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-red-500" />
            {error}
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {cleanedData && (
            <motion.section
              ref={resultRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-emerald-500" />
                  {cleanedData.title}
                </h2>
                <div className="flex gap-2 relative">
                  <button
                    onClick={handleCopyAll}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium text-white hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export As
                      <ChevronDown className={cn("w-4 h-4 transition-transform", showExportMenu && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {showExportMenu && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowExportMenu(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl z-20 overflow-hidden"
                          >
                            <div className="p-2 space-y-1">
                              <button
                                onClick={handleDownloadMarkdown}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors"
                              >
                                <FileCode className="w-4 h-4 text-emerald-500" />
                                Markdown (.md)
                              </button>
                              <button
                                onClick={handleDownloadJSON}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors"
                              >
                                <FileJson className="w-4 h-4 text-blue-500" />
                                JSON (.json)
                              </button>
                              <button
                                onClick={handleDownloadText}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors"
                              >
                                <FileText className="w-4 h-4 text-zinc-500" />
                                Plain Text (.txt)
                              </button>
                              <button
                                onClick={handleDownloadHTML}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors"
                              >
                                <Globe className="w-4 h-4 text-orange-500" />
                                Web Page (.html)
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {cleanedData.messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "flex gap-4 p-6 rounded-3xl border shadow-sm",
                      msg.role === 'user' 
                        ? "bg-white border-zinc-200 ml-12" 
                        : "bg-zinc-900 border-zinc-800 mr-12 text-zinc-100"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      msg.role === 'user' ? "bg-zinc-100 text-zinc-600" : "bg-zinc-800 text-emerald-400"
                    )}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className={cn(
                        "text-xs font-bold uppercase tracking-wider mb-2 opacity-50",
                        msg.role === 'user' ? "text-zinc-500" : "text-zinc-400"
                      )}>
                        {msg.role === 'user' ? 'User' : 'Assistant'}
                      </div>
                      <div className="markdown-body">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {cleanedData.attachments && cleanedData.attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 p-8 bg-white border border-zinc-200 rounded-[32px] shadow-sm"
                >
                  <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-emerald-500" />
                    Detected Attachments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cleanedData.attachments.map((attachment, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-emerald-200 transition-colors"
                      >
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-zinc-200 text-zinc-400 group-hover:text-emerald-500 transition-colors">
                          <File className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-zinc-700 truncate">
                            {attachment.name}
                          </div>
                          {attachment.type && (
                            <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                              {attachment.type}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-xs text-zinc-400 italic">
                    Note: These files were detected in the original chat log but are not included in this text-based export.
                  </p>
                </motion.div>
              )}

              <div className="pt-12 pb-24 text-center">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-zinc-400 hover:text-zinc-600 text-sm font-medium transition-colors"
                >
                  Back to top
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-zinc-400 text-xs tracking-widest uppercase">
        Powered by Gemini • Minimalist Design
      </footer>

      {/* Bookmarklet Modal */}
      <AnimatePresence>
        {showBookmarkletModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookmarkletModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl max-w-xl w-full overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
                    <MousePointer2 className="w-6 h-6 text-emerald-500" />
                    One-Click Capture
                  </h3>
                  <button 
                    onClick={() => setShowBookmarkletModal(false)}
                    className="text-zinc-400 hover:text-zinc-600 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-4">
                    <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                    <p className="text-sm text-emerald-800 leading-relaxed">
                      Drag the button below to your bookmarks bar. Click it while on ChatGPT or Claude to automatically scroll, capture, and copy the entire conversation.
                    </p>
                  </div>

                  <div className="flex flex-col items-center py-8 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                    <a 
                      ref={bookmarkletRef}
                      onClick={(e) => e.preventDefault()}
                      className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform cursor-move flex items-center gap-3"
                    >
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      Purify Chat
                    </a>
                    <p className="mt-4 text-xs text-zinc-400 font-medium">
                      Drag this button to your bookmarks bar
                    </p>
                    
                    <div className="mt-6 w-full px-8">
                      <div className="h-px bg-zinc-200 w-full mb-6" />
                      <button 
                        onClick={handleCopyBookmarkletCode}
                        className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 transition-colors font-medium"
                      >
                        <Copy className="w-3 h-3" />
                        Copy code manually if dragging fails
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-zinc-900 text-sm uppercase tracking-wider">How it works:</h4>
                    <ol className="space-y-3">
                      {[
                        "Click the bookmark while on a chat page.",
                        "The script detects the chat container.",
                        "It auto-scrolls to load all lazy content.",
                        "It copies the clean text to your clipboard.",
                        "Paste it here to purify and export!"
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-zinc-600">
                          <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <button 
                  onClick={() => setShowBookmarkletModal(false)}
                  className="mt-8 w-full py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
