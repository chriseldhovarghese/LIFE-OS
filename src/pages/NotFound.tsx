import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-foreground overflow-hidden">
      <div className="aurora-container">
        <div className="aurora-blob w-[500px] h-[500px] bg-red-600/20" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
      </div>

      <div className="relative z-10 glass-panel border-white/5 p-16 text-center shadow-glass animate-fade-in">
        <h1 className="text-8xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
          404
        </h1>
        <div className="h-px w-24 bg-primary/50 mx-auto mb-8 animate-glow" />
        <p className="text-xl font-bold tracking-widest text-white/40 uppercase mb-12">
          Node_Not_Found
        </p>
        <a 
          href="/" 
          className="inline-block px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black tracking-widest text-xs uppercase hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 active:scale-95"
        >
          Return_To_Aura
        </a>
      </div>
    </div>
  );
};

export default NotFound;
