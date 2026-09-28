import { motion } from 'framer-motion';
import { Play, Volume2, ShieldCheck, ExternalLink, VideoOff } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C9.284 2 8.944 2.012 7.877 2.06 6.812 2.109 6.085 2.278 5.448 2.525A5.025 5.025 0 003.625 3.625 5.025 5.025 0 002.525 5.448C2.278 6.085 2.109 6.812 2.06 7.877 2.012 8.944 2 9.284 2 12s.012 3.056.06 4.123c.049 1.065.218 1.792.465 2.429a5.025 5.025 0 001.1 1.823 5.025 5.025 0 001.823 1.1c.637.247 1.364.416 2.429.465C8.944 21.988 9.284 22 12 22s3.056-.012 4.123-.06c1.065-.049 1.792-.218 2.429-.465a5.025 5.025 0 001.823-1.1 5.025 5.025 0 001.1-1.823c.247-.637.416-1.364.465-2.429C21.988 15.056 22 14.716 22 12s-.012-3.056-.06-4.123c-.049-1.065-.218-1.792-.465-2.429a5.025 5.025 0 00-1.1-1.823 5.025 5.025 0 00-1.823-1.1c-.637-.247-1.364-.416-2.429-.465C15.056 2.012 14.716 2 12 2zm0 1.802c2.67 0 2.987.01 4.042.058.976.045 1.505.208 1.858.345.467.182.8.398 1.15.748.35.35.566.683.748 1.15.137.353.3.882.345 1.858.048 1.055.058 1.372.058 4.042s-.01 2.987-.058 4.042c-.045.976-.208 1.505-.345 1.858a3.223 3.223 0 01-.748 1.15c-.35.35-.683.566-1.15.748-.353.137-.882.3-1.858.345-1.055.048-1.372.058-4.042.058s-2.987-.01-4.042-.058c-.976-.045-1.505-.208-1.858-.345a3.223 3.223 0 01-1.15-.748 3.223 3.223 0 01-.748-1.15c-.137-.353-.3-.882-.345-1.858-.048-1.055-.058-1.372-.058-4.042s.01-2.987.058-4.042c.045-.976.208-1.505.345-1.858a3.223 3.223 0 01.748-1.15c.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.858-.345 1.055-.048 1.372-.058 4.042-.058zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
  </svg>
);

interface WatchVideoModalProps {
  courseTitle: string;
  courseImage?: string;
  videoUrl?: string;
  onClose: () => void;
}

// Helper to convert YouTube link into clean embed URL
function getYouTubeEmbedUrl(url?: string) {
  if (!url || typeof url !== 'string') return null;
  const str = url.trim();

  let videoId = '';
  
  // Pattern 1: watch?v=ID or &v=ID
  const vParamMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vParamMatch) {
    videoId = vParamMatch[1];
  } else {
    // Pattern 2: youtu.be/ID or embed/ID or shorts/ID or v/ID
    const pathMatch = str.match(/(?:youtu\.be\/|embed\/|shorts\/|v\/)([a-zA-Z0-9_-]{11})/);
    if (pathMatch) {
      videoId = pathMatch[1];
    }
  }

  if (videoId && videoId.length === 11) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;
  }

  if (str.includes('youtube.com/embed/')) {
    return str;
  }

  return null;
}

function getInstagramEmbedUrl(url?: string) {
  if (!url || typeof url !== 'string') return null;
  const str = url.trim();
  
  const match = str.match(/(?:instagram\.com|instagr\.am)\/(?:reel|reels|p|tv|share\/reel)\/([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return `https://www.instagram.com/p/${match[1]}/embed`;
  }

  const genericMatch = str.match(/(?:instagram\.com|instagr\.am)\/[^/]+\/([a-zA-Z0-9_-]{10,})/i);
  if (genericMatch && genericMatch[1]) {
    return `https://www.instagram.com/p/${genericMatch[1]}/embed`;
  }

  if (str.includes('instagram.com') && str.includes('/embed')) {
    return str;
  }

  return null;
}

export const WatchVideoModal = ({ courseTitle, courseImage, videoUrl, onClose }: WatchVideoModalProps) => {
  const cleanVideoUrl = videoUrl && typeof videoUrl === 'string' ? videoUrl.trim() : '';
  const youtubeEmbedUrl = getYouTubeEmbedUrl(cleanVideoUrl);
  const instagramEmbedUrl = getInstagramEmbedUrl(cleanVideoUrl);

  const isInstagram = Boolean(instagramEmbedUrl || cleanVideoUrl.includes('instagram.com'));
  const isYouTube = Boolean(youtubeEmbedUrl || cleanVideoUrl.includes('youtube') || cleanVideoUrl.includes('youtu.be'));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-800 text-white flex flex-col"
      >
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div>
            <span className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit mb-1">
              {isInstagram ? (
                <>
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" /> Instagram Reel / Video
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-red-400" /> YouTube Course Demo
                </>
              )}
            </span>
            <h3 className="text-xl font-extrabold text-white">{courseTitle}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 flex items-center justify-center font-bold text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {youtubeEmbedUrl ? (
            <iframe 
              src={youtubeEmbedUrl} 
              title={courseTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen 
              className="w-full h-full border-0"
            />
          ) : instagramEmbedUrl ? (
            <iframe 
              src={instagramEmbedUrl} 
              title={courseTitle}
              allowFullScreen 
              className="w-full h-full border-0 bg-white"
            />
          ) : cleanVideoUrl ? (
            <video 
              src={cleanVideoUrl} 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
              poster={courseImage}
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center bg-gray-950 text-gray-400 space-y-3 w-full h-full">
              <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-red-500 mb-2">
                <VideoOff className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">No Video Link Pasted Yet</h4>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                No YouTube or Instagram video link has been pasted in the Admin Panel for <strong>{courseTitle}</strong> yet. Paste a link in Admin &gt; Courses to display it here!
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-900/90 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-emerald-400 font-bold"><ShieldCheck className="w-4 h-4" /> HD Quality</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Volume2 className="w-4 h-4" /> Clear Audio</span>
            <span>•</span>
            <span>YashEdu Academy</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isInstagram && cleanVideoUrl && (
              <a
                href={cleanVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow"
              >
                <InstagramIcon className="w-3.5 h-3.5" /> Open on Instagram
              </a>
            )}

            {isYouTube && cleanVideoUrl && (
              <a
                href={cleanVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open on YouTube
              </a>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-900/30 flex-1 sm:flex-none"
            >
              Close Video
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
