import React, { useState } from "react";

interface GiftSongCardProps {
  audioUrl: string | null;
  lyrics: string;
  recipientName?: string;
  title?: string;
}

export const GiftSongCard: React.FC<GiftSongCardProps> = ({ 
  audioUrl, 
  lyrics, 
  recipientName = "Someone Special",
  title = "Custom Gift Song"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!audioUrl) return null;

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-xl border border-amber-200 p-6 text-slate-800 my-6">
      <div className="text-center mb-4">
        <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Custom Gift Song
        </span>
        <h3 className="text-2xl font-bold mt-2 font-serif text-amber-900">For {recipientName}</h3>
        <p className="text-xs text-amber-700">Created by Haddi the Street Minstrel</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-inner mb-4">
        <audio 
          controls 
          src={audioUrl} 
          className="w-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      <div className="bg-white/70 rounded-lg p-3 max-h-32 overflow-y-auto text-sm italic text-slate-600 mb-4 border border-amber-100">
        <p className="whitespace-pre-line">{lyrics}</p>
      </div>

      <button 
        onClick={() => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(audioUrl);
            alert("Gift song link copied to clipboard ready to send!");
          }
        }}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition duration-200 flex items-center justify-center space-x-2"
      >
        <span>🎁 Copy & Send as Gift Card</span>
      </button>
    </div>
  );
};