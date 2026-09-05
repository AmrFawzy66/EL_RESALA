import React, { useRef, useState } from 'react';
import { BookAudio, Play, Pause } from 'lucide-react';

/**
 * QuranPlayer.jsx — Module H offline utility.
 * Plays locally cached surah audio files (placed by the user/admin under
 * the app's userData/quran-audio folder) with no network dependency,
 * matching the fully offline-first design of the rest of the app.
 * Track list is read from a local manifest rather than any remote API.
 */
const LOCAL_MANIFEST = [
  { id: 1, name: 'الفاتحة', file: 'audio/001.mp3' },
  { id: 36, name: 'يس', file: 'audio/036.mp3' },
  { id: 67, name: 'الملك', file: 'audio/067.mp3' },
  { id: 112, name: 'الإخلاص', file: 'audio/112.mp3' },
];

export default function QuranPlayer() {
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  function play(track) {
    setCurrent(track);
    setPlaying(true);
    setTimeout(() => audioRef.current?.play(), 0);
  }

  function togglePlayPause() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
        <BookAudio size={20} className="text-resala-600" /> القرآن الكريم (مشغل صوتي دون اتصال)
      </h2>

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {LOCAL_MANIFEST.map((track) => (
          <button
            key={track.id}
            onClick={() => play(track)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-resala-50 ${
              current?.id === track.id ? 'text-resala-700 font-semibold' : 'text-gray-700'
            }`}
          >
            <span>{track.name}</span>
            {current?.id === track.id && playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
        ))}
      </div>

      {current && (
        <div className="mt-4 bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <button onClick={togglePlayPause} className="w-10 h-10 rounded-full bg-resala-600 text-white flex items-center justify-center">
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <span className="text-sm font-medium">{current.name}</span>
          <audio
            ref={audioRef}
            src={current.file}
            onEnded={() => setPlaying(false)}
            className="hidden"
          />
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3">
        الملفات الصوتية تُحمَّل محلياً من مجلد البيانات الخاص بالتطبيق ولا تتطلب اتصالاً بالإنترنت.
      </p>
    </div>
  );
}
