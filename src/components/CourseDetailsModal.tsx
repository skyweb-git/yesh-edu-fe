import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Users, Play, MessageSquare, X, BookOpen, ShieldCheck } from 'lucide-react';

interface CourseDetailsModalProps {
  course: {
    title: string;
    image?: string;
    instructor?: string;
    rating?: string | number;
    location?: string;
    duration?: string;
    students?: string | number;
    price?: string | number;
    subject?: string;
    videoUrl?: string;
  };
  onClose: () => void;
  onRequestQuery: (title: string) => void;
  onWatchVideo?: (title: string, image?: string, videoUrl?: string) => void;
}

export const CourseDetailsModal = ({ course, onClose, onRequestQuery }: CourseDetailsModalProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
      >
        {/* Course Banner Header */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gray-900">
          <img
            src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
            alt={course.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center font-bold text-base backdrop-blur-md transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Subject Badge */}
          <div className="absolute top-4 left-4 bg-red-600/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md">
            {course.subject || 'Academic Course'}
          </div>

          {/* Title & Rating on Image */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-yellow-400/90 text-gray-900 px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-gray-900" /> {course.rating || '4.9'}
              </span>
              <span className="text-xs text-gray-300 font-semibold">• Certified Course</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-md">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <div>
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Location / Duration</span>
                <span>{course.location || course.duration || 'Main Campus'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Enrolled</span>
                <span>{course.students || '500+ Students'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Guarantee</span>
                <span>Top Educator Support</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--color-primary)]" /> Course Overview
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Join this course for in-depth conceptual clarity, personalized 1-on-1 doubt solving, continuous evaluations, and structured learning resources designed to help you achieve top academic results.
            </p>
          </div>

          {/* Action Buttons Inside Details Modal */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            {/* Watch Video Button Inside Modal */}
            <button
              onClick={() => {
                onClose();
                navigate('/course-details', { state: { course } });
              }}
              className="flex-1 py-3.5 px-5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <Play className="w-4 h-4 fill-red-500 text-red-500" /> Watch Demo Video
            </button>

            {/* Request Query Button Inside Modal */}
            <button
              onClick={() => {
                onClose();
                onRequestQuery(course.title);
              }}
              className="flex-1 py-3.5 px-5 bg-[var(--color-primary)] hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <MessageSquare className="w-4 h-4" /> Request Query
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
