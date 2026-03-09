import React, { useState, useEffect, useRef } from 'react';
import { 
  AppView, 
  ModelType, 
  GeneratedImage, 
  AspectRatio,
  UniverseStyle,
  ImageResolution
} from './types';
import { 
  DEFINITIVE_PROMPT, 
  ASPECT_RATIOS, 
  UNIVERSE_STYLES,
  RESOLUTIONS,
  GENESIS_MANIFESTATIONS
} from './constants';
import { 
  generateUniverseImage, 
  editUniverseImage, 
  analyzeCoverImage,
  enhancePromptWithThinking,
  openAuthDialog,
  checkProAuth 
} from './geminiService';

// --- Sub-components ---

const Header: React.FC<{ 
  currentView: AppView; 
  setView: (v: AppView) => void;
  isProConnected: boolean;
  onConnectPro: () => void;
}> = ({ currentView, setView, isProConnected, onConnectPro }) => {
  return (
    <header className="border-b border-purple-900/50 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(AppView.GENERATOR)}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
          <h1 className="font-orbitron text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-cyan-400">
            VISIONARY STUDIO
          </h1>
        </div>
        <nav className="flex items-center space-x-6">
          {(Object.values(AppView)).map((view) => (
            <button
              key={view}
              onClick={() => setView(view)}
              className={`text-[10px] uppercase tracking-widest transition-all duration-300 ${
                currentView === view 
                ? 'text-cyan-400 font-bold scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                : 'text-gray-400 hover:text-white hover:scale-105'
              }`}
            >
              {view === AppView.ANALYZER ? 'Replicator' : view}
            </button>
          ))}
          <button 
            onClick={async () => {
              try {
                await onConnectPro();
              } catch (e) {
                console.error("Failed to connect Pro:", e);
              }
            }}
            className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${
              isProConnected 
              ? 'border-green-500/50 text-green-400 bg-green-500/5' 
              : 'border-cyan-500/50 text-cyan-400 bg-cyan-500/5 animate-pulse'
            }`}
          >
            {isProConnected ? 'Neural Core: Active' : 'Connect Core'}
          </button>
        </nav>
      </div>
    </header>
  );
};

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-[100] backdrop-blur-xl p-8">
    <div className="relative mb-12">
      <div className="w-32 h-32 border-2 border-purple-500/20 rounded-full"></div>
      <div className="absolute inset-0 w-32 h-32 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-full blur-2xl animate-pulse opacity-50"></div>
      </div>
    </div>
    <p className="font-orbitron text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 animate-pulse tracking-[0.2em] text-center uppercase max-w-xl">
      {message}
    </p>
    <div className="mt-6 flex gap-2">
      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
    </div>
  </div>
);

const ImageCard: React.FC<{ 
  image: GeneratedImage; 
  onEdit: (img: GeneratedImage) => void;
  onAddToBlueprint: (img: GeneratedImage) => void;
  isInBlueprint: boolean;
}> = ({ image, onEdit, onAddToBlueprint, isInBlueprint }) => (
  <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/50 hover:border-purple-500/50 transition-all duration-500 shadow-xl hover:shadow-purple-500/10">
    <div className="aspect-square overflow-hidden relative">
      <img src={image.url} alt={image.prompt} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute top-3 right-3 flex gap-2">
         <div className="px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[8px] font-bold tracking-tighter text-zinc-400 border border-white/5 uppercase">
          {image.model === ModelType.FLASH ? 'Nano Banana 2' : image.model === ModelType.PRO ? 'Pro' : 'ML Source'}
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
      <p className="text-[10px] text-zinc-300 line-clamp-2 mb-4 font-light leading-relaxed tracking-wide italic">"{image.prompt}"</p>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(image)}
            className="flex-1 py-2 bg-white text-black hover:bg-cyan-400 hover:text-black rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
          >
            Transmute
          </button>
          <a 
            href={image.url} 
            download={`universe-${image.id}.png`}
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors border border-white/5"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          </a>
        </div>
        <button 
          onClick={() => onAddToBlueprint(image)}
          className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
            isInBlueprint 
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
            : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          {isInBlueprint ? 'Blueprint Active' : 'Set as Source (ML)'}
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState<AppView>(AppView.GENERATOR);
  const [prompt, setPrompt] = useState(DEFINITIVE_PROMPT);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [resolution, setResolution] = useState<ImageResolution>(RESOLUTIONS[0]);
  const [model, setModel] = useState<ModelType>(ModelType.FLASH);
  const [selectedStyle, setSelectedStyle] = useState<UniverseStyle>(UNIVERSE_STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [blueprint, setBlueprint] = useState<GeneratedImage[]>([]);
  const [analyzerSource, setAnalyzerSource] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ prompt: string; description: string; replicaUrl: string } | null>(null);
  const [replicateError, setReplicateError] = useState<string | null>(null);
  const [isProConnected, setIsProConnected] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string>("Copy Blueprint Prompt");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzerInputRef = useRef<HTMLInputElement>(null);
  const generatorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const ok = await checkProAuth();
        setIsProConnected(ok);
      } catch (e) {
        console.error("Auth check failed:", e);
      }
    };
    checkAuthStatus();
    
    let saved = null;
    try {
      saved = localStorage.getItem('universe-gallery');
    } catch (e) {
      console.error("Failed to access localStorage:", e);
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setGallery(parsed.sort((a: any, b: any) => b.timestamp - a.timestamp));
        } else {
          setGallery(GENESIS_MANIFESTATIONS);
        }
      } catch (e) {
        console.error("Failed to load gallery", e);
        setGallery(GENESIS_MANIFESTATIONS);
      }
    } else {
      setGallery(GENESIS_MANIFESTATIONS);
    }
  }, []);

  useEffect(() => {
    if (gallery.length > 0) {
      try {
        localStorage.setItem('universe-gallery', JSON.stringify(gallery));
      } catch (e) {
        console.error("Failed to save gallery to localStorage, attempting to save fewer items:", e);
        try {
          // If quota exceeded, try saving only the most recent 2 items
          localStorage.setItem('universe-gallery', JSON.stringify(gallery.slice(0, 2)));
        } catch (e2) {
          console.error("Still failed to save to localStorage:", e2);
        }
      }
    }
  }, [gallery]);

  const handleConnectPro = async () => {
    await openAuthDialog();
    setIsProConnected(true);
  };

  const handleCopyPrompt = async () => {
    if (!analysisResult?.prompt) return;
    try {
      await navigator.clipboard.writeText(analysisResult.prompt);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy Blueprint Prompt"), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    if (!isProConnected) {
      try {
        await handleConnectPro();
      } catch (e) {
        console.error("Failed to connect Pro:", e);
        return;
      }
    }
    setIsGenerating(true);
    setLoadingMsg("Generating Masterpiece...");
    try {
      const fullPrompt = `${prompt}, ${selectedStyle.promptAddition}`;
      const url = await generateUniverseImage(fullPrompt, aspectRatio.value, model, resolution.value);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt: fullPrompt,
        model,
        timestamp: Date.now()
      };
      
      setGallery(prev => [newImage, ...prev]);
    } catch (error: any) {
      console.error("Generation failed:", error);
      alert(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt) return;
    if (!isProConnected) {
      try {
        await handleConnectPro();
      } catch (e) {
        console.error("Failed to connect Pro:", e);
        return;
      }
    }
    setIsGenerating(true);
    setLoadingMsg("Enhancing Prompt via Neural Core...");
    try {
      const enhanced = await enhancePromptWithThinking(prompt);
      setPrompt(enhanced);
    } catch (error: any) {
      console.error("Enhancement failed:", error);
      alert(`Enhancement failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!editingImage || !editPrompt) return;
    if (!isProConnected) {
      try {
        await handleConnectPro();
      } catch (e) {
        console.error("Failed to connect Pro:", e);
        return;
      }
    }
    setIsGenerating(true);
    setLoadingMsg("Transmuting Reality...");
    try {
      const url = await editUniverseImage(editingImage.url, editPrompt, model, resolution.value);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt: `Edited: ${editPrompt} (Original: ${editingImage.prompt})`,
        model,
        timestamp: Date.now()
      };
      
      setGallery(prev => [newImage, ...prev]);
      setEditingImage(null);
      setEditPrompt("");
    } catch (error: any) {
      console.error("Edit failed:", error);
      alert(`Edit failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setEditingImage({
        id: Date.now().toString(),
        url: b64,
        prompt: "Uploaded Image",
        model: ModelType.FLASH,
        timestamp: Date.now()
      });
      setEditPrompt("");
    };
    try {
      reader.readAsDataURL(file);
    } catch (e) {
      console.error("Failed to read file:", e);
    }
  };

  const handleRemoveText = async () => {
    if (!editingImage) return;
    if (!isProConnected) {
      try {
        await handleConnectPro();
      } catch (e) {
        console.error("Failed to connect Pro:", e);
        return;
      }
    }
    setIsGenerating(true);
    setLoadingMsg("Removing Text & Logos...");
    try {
      const removeTextPrompt = "Remove all text, writing, and typography from the image. Fill in the background seamlessly.";
      const url = await editUniverseImage(editingImage.url, removeTextPrompt, model, resolution.value);

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt: `Text Removal: ${removeTextPrompt}`,
        model,
        timestamp: Date.now()
      };

      setGallery(prev => [newImage, ...prev]);
      setEditingImage(null);
      setEditPrompt("");
    } catch (error: any) {
      console.error("Text removal failed:", error);
      alert(`Text removal failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const b64 = event.target?.result as string;
      setAnalyzerSource(b64);
      
      if (!isProConnected) {
        try {
          await handleConnectPro();
        } catch (e) {
          console.error("Failed to connect Pro:", e);
          return;
        }
      }

      setIsGenerating(true);
      setLoadingMsg("Analyzing Source Material...");
      try {
        const analysis = await analyzeCoverImage(b64);
        setAnalysisResult({
          prompt: analysis,
          description: "Analysis complete. Ready for replication.",
          replicaUrl: ""
        });
      } catch (error: any) {
        console.error("Analysis failed:", error);
        setReplicateError(error.message);
      } finally {
        setIsGenerating(false);
      }
    };
    try {
      reader.readAsDataURL(file);
    } catch (e) {
      console.error("Failed to read file:", e);
    }
  };

  const handleReplicate = async () => {
    if (!analysisResult?.prompt) return;
    if (!isProConnected) {
      try {
        await handleConnectPro();
      } catch (e) {
        console.error("Failed to connect Pro:", e);
        return;
      }
    }
    setIsGenerating(true);
    setLoadingMsg("Replicating Masterpiece...");
    try {
      const url = await generateUniverseImage(analysisResult.prompt, "1:1", model, resolution.value);
      setAnalysisResult(prev => prev ? { ...prev, replicaUrl: url } : null);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt: `Replicated from analysis: ${analysisResult.prompt}`,
        model,
        timestamp: Date.now()
      };
      
      setGallery(prev => [newImage, ...prev]);
    } catch (error: any) {
      console.error("Replication failed:", error);
      setReplicateError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleBlueprint = (image: GeneratedImage) => {
    setBlueprint(prev => {
      if (prev.find(i => i.id === image.id)) {
        return prev.filter(i => i.id !== image.id);
      }
      return [...prev, image];
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter selection:bg-purple-500/30">
      <Header 
        currentView={view} 
        setView={setView} 
        isProConnected={isProConnected} 
        onConnectPro={handleConnectPro} 
      />

      {isGenerating && <LoadingOverlay message={loadingMsg} />}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === AppView.GENERATOR && (
          <div className="space-y-12">
            {/* Generator Controls */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Incantation (Prompt)
                    </label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                      placeholder="Describe your vision..."
                    />
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={handleEnhancePrompt}
                        className="text-[10px] uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Enhance with Neural Core
                      </button>
                    </div>
                  </div>

                  {editingImage && (
                    <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl flex gap-4 items-start">
                      <img src={editingImage.url} alt="Editing" className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-300 mb-2">
                          Transmutation Prompt
                        </label>
                        <input 
                          type="text"
                          value={editPrompt}
                          onChange={(e) => setEditPrompt(e.target.value)}
                          className="w-full bg-black/50 border border-purple-500/30 rounded-lg p-2 text-sm focus:outline-none focus:border-purple-400"
                          placeholder="What should change?"
                        />
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            onClick={handleEdit}
                            className="px-4 py-1.5 bg-purple-500 hover:bg-purple-400 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-colors"
                          >
                            Apply
                          </button>
                          <button
                            onClick={handleRemoveText}
                            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Remove Text
                          </button>
                          <button
                            onClick={() => { setEditingImage(null); setEditPrompt(""); }}
                            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Dimensionality (Ratio)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {ASPECT_RATIOS.map(ratio => (
                        <button
                          key={ratio.value}
                          onClick={() => setAspectRatio(ratio)}
                          className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                            aspectRatio.value === ratio.value 
                            ? 'bg-white text-black border-white' 
                            : 'bg-black/50 text-zinc-400 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {ratio.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Resolution
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {RESOLUTIONS.map(res => (
                        <button
                          key={res.value}
                          onClick={() => setResolution(res)}
                          className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                            resolution.value === res.value 
                            ? 'bg-white text-black border-white' 
                            : 'bg-black/50 text-zinc-400 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {res.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Aesthetic Override
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {UNIVERSE_STYLES.map(style => (
                        <button
                          key={style.name}
                          onClick={() => setSelectedStyle(style)}
                          className={`py-2 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border text-left ${
                            selectedStyle.name === style.name 
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' 
                            : 'bg-black/50 text-zinc-400 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Resolution
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {RESOLUTIONS.map(res => (
                        <button
                          key={res.value}
                          onClick={() => setResolution(res)}
                          className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                            resolution.value === res.value 
                            ? 'bg-white text-black border-white' 
                            : 'bg-black/50 text-zinc-400 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {res.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Neural Engine
                    </label>
                    <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                      <button
                        onClick={() => setModel(ModelType.FLASH)}
                        className={`flex-1 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                          model === ModelType.FLASH 
                          ? 'bg-zinc-800 text-white shadow-lg' 
                          : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Nano Banana 2
                      </button>
                      <button
                        onClick={async () => {
                          if (!isProConnected) {
                            try {
                              await handleConnectPro();
                            } catch (e) {
                              console.error("Failed to connect Pro:", e);
                            }
                          } else {
                            setModel(ModelType.PRO);
                          }
                        }}
                        className={`flex-1 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          model === ModelType.PRO 
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg' 
                          : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Pro
                        {!isProConnected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt}
                      className="flex-1 py-4 bg-white text-black hover:bg-cyan-400 hover:text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Generate Image
                    </button>
                    <button
                      onClick={() => generatorInputRef.current?.click()}
                      className="px-6 py-4 bg-zinc-800 text-white hover:bg-zinc-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      Upload
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={generatorInputRef}
                      onChange={handleGeneratorUpload}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-orbitron text-2xl font-bold tracking-widest uppercase">Manifestations</h2>
                <span className="text-xs text-zinc-500 font-mono">{gallery.length} Entities</span>
              </div>
              
              {gallery.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                  <p className="text-zinc-500 uppercase tracking-widest text-sm">The canvas is empty. Generate a masterpiece.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gallery.map(img => (
                    <ImageCard 
                      key={img.id} 
                      image={img} 
                      onEdit={(i) => {
                        setEditingImage(i);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onAddToBlueprint={toggleBlueprint}
                      isInBlueprint={!!blueprint.find(b => b.id === img.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === AppView.ANALYZER && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="font-orbitron text-4xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                Replicator
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Upload a source image. The neural core will analyze its essence and attempt to replicate it.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
              {!analyzerSource ? (
                <div 
                  className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-cyan-500/50 transition-colors cursor-pointer"
                  onClick={() => analyzerInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={analyzerInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAnalyzeUpload}
                  />
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-zinc-300">Select Source Material</p>
                  <p className="text-xs text-zinc-500 mt-2">JPEG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Source</h3>
                    <div className="aspect-square rounded-xl overflow-hidden border border-white/10">
                      <img src={analyzerSource} alt="Source" className="w-full h-full object-cover" />
                    </div>
                    <button 
                      onClick={() => { setAnalyzerSource(null); setAnalysisResult(null); }}
                      className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      Clear Source
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Analysis & Replication</h3>
                    
                    {analysisResult ? (
                      <div className="space-y-4 h-full flex flex-col">
                        <div className="flex-1 bg-black/50 rounded-xl p-4 border border-white/5 overflow-y-auto max-h-64">
                          <p className="text-sm text-zinc-300 leading-relaxed">{analysisResult.prompt}</p>
                        </div>
                        
                        {analysisResult.replicaUrl ? (
                          <div className="aspect-square rounded-xl overflow-hidden border border-cyan-500/50 relative group">
                            <img src={analysisResult.replicaUrl} alt="Replica" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a 
                                href={analysisResult.replicaUrl} 
                                download="replica.png"
                                className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest"
                              >
                                Download Replica
                              </a>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={handleReplicate}
                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                          >
                            Initiate Replication
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-xl">
                        <p className="text-zinc-600 text-sm uppercase tracking-widest">Awaiting Analysis...</p>
                      </div>
                    )}
                    
                    {replicateError && (
                      <p className="text-red-400 text-xs text-center">{replicateError}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === AppView.BLUEPRINT && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-orbitron text-3xl font-bold tracking-widest uppercase mb-2">Blueprint</h2>
                <p className="text-zinc-400 text-sm">Your selected source manifestations.</p>
              </div>
              <button 
                onClick={() => setBlueprint([])}
                className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border border-red-500/20"
              >
                Clear Blueprint
              </button>
            </div>

            {blueprint.length === 0 ? (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl">
                <p className="text-zinc-500 uppercase tracking-widest text-sm">No entities selected for blueprint.</p>
                <button 
                  onClick={() => setView(AppView.GENERATOR)}
                  className="mt-4 text-cyan-400 hover:text-cyan-300 text-xs uppercase tracking-widest underline underline-offset-4"
                >
                  Return to Generator
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="grid grid-cols-2 gap-4">
                  {blueprint.map(img => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/10">
                      <img src={img.url} alt="Blueprint item" className="w-full aspect-square object-cover" />
                      <button 
                        onClick={() => toggleBlueprint(img)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-6 h-fit sticky top-24">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-4">Combined Essence</h3>
                  <div className="bg-black/50 rounded-xl p-4 border border-white/5 mb-6">
                    <p className="text-xs text-zinc-400 leading-relaxed h-48 overflow-y-auto">
                      {blueprint.map(b => b.prompt).join(' | ')}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setPrompt(blueprint.map(b => b.prompt).join(' | '));
                      setView(AppView.GENERATOR);
                    }}
                    className="w-full py-3 bg-white text-black hover:bg-cyan-400 hover:text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 mb-3"
                  >
                    Use as New Prompt
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
