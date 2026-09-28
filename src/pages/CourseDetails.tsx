import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { 
  Play, Star, Clock, Users, BookOpen, CheckCircle2, 
  ChevronDown, FileText, Award, Shield, ArrowLeft, MessageSquare, Video, MapPin, Sparkles, Target
} from 'lucide-react';
import { RequestQueryModal } from '../components/RequestQueryModal';

function getYouTubeEmbedUrl(url?: string) {
  if (!url || typeof url !== 'string') return null;
  const str = url.trim();
  let videoId = '';
  const vParamMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vParamMatch) {
    videoId = vParamMatch[1];
  } else {
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
  if (str.includes('instagram.com') && str.includes('/embed')) {
    return str;
  }
  return null;
}

export const CourseDetails = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Overview');
  const [openModule, setOpenModule] = useState(0);
  const [showQueryModal, setShowQueryModal] = useState(false);

  const courseData = location.state?.course || {
    title: 'Advanced React & Next.js Masterclass',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    subject: 'WEBSTACK',
    rating: '4.9',
    students: '12.5k Enrolled',
    duration: 'Full Term / Flexible',
    location: 'uppal',
    instructor: 'Senior Academic Educator @ YashEdu',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  };

  const cleanVideoUrl = courseData.videoUrl && typeof courseData.videoUrl === 'string' ? courseData.videoUrl.trim() : '';
  const youtubeEmbedUrl = getYouTubeEmbedUrl(cleanVideoUrl);
  const instagramEmbedUrl = getInstagramEmbedUrl(cleanVideoUrl);

  const curriculum = [
    { title: 'Module 1: Fundamental Concepts & Core Foundation', duration: '2h 15m', lectures: 5 },
    { title: 'Module 2: In-Depth Conceptual Masterclass', duration: '3h 45m', lectures: 8 },
    { title: 'Module 3: Practical Applications & Doubt Solving', duration: '4h 20m', lectures: 10 },
    { title: 'Module 4: Exam Strategies & Practice Series', duration: '2h 50m', lectures: 6 },
    { title: 'Module 5: Final Comprehensive Evaluation', duration: '5h 10m', lectures: 12 },
  ];

  const overviewContent = courseData.overview || `Join ${courseData.title} at Yash Educational Institute. Our program provides a supportive, concept-oriented learning environment designed to help every student build a rock-solid foundation, clear doubts 1-on-1, and excel in exams.`;

  const whatYouWillLearnList = courseData.whatYouWillLearn
    ? courseData.whatYouWillLearn.split(/\n|,/).map((s: string) => s.trim()).filter(Boolean)
    : [
        "Complete conceptual clarity & topic mastery",
        "Personalized 1-on-1 doubt solving support",
        "Regular tests, assignments & evaluations",
        "Timed mock test series with detailed reports",
        "Interactive learning with structured notes",
        "Continuous educator guidance for top results"
      ];

  const targetContent = courseData.target || `Our primary target is to empower students with comprehensive conceptual clarity, strong academic confidence, and top-ranking exam performance through structured learning and continuous mentor evaluation.`;

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen pb-20 font-sans">
      
      {/* Main Container with no extra gap above */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        
        {/* Merged Breadcrumbs & Subject Badge (e.g. WEBSTACK) */}
        <div className="flex items-center gap-2.5 text-xs font-bold mb-4">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-[var(--color-primary)] hover:underline transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to All Courses
          </Link>
          <span className="text-gray-300">•</span>
          <span className="bg-red-50 text-[var(--color-primary)] px-3 py-0.5 rounded-full border border-red-100 uppercase tracking-wider font-extrabold text-[11px]">
            {courseData.subject || 'WEBSTACK'}
          </span>
        </div>

        {/* Course Header Info */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600">
            <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" /> {courseData.rating || '4.9'} Rating
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-700"><Users className="w-3.5 h-3.5 text-blue-600" /> {courseData.students || '12.5k Enrolled'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-700"><MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {courseData.location || 'uppal'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            {courseData.title}
          </h1>
        </div>

        {/* Video Player Container */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-lg mb-10">
          
          {/* Action Header bar with Request Query Button ONLY */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-900 via-gray-900 to-slate-900 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="flex items-center gap-1.5 text-red-400">
                <Video className="w-4 h-4" /> Demo Video Preview
              </span>
            </div>

            <div>
              <button
                onClick={() => setShowQueryModal(true)}
                className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl border border-red-500 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" /> Request Query
              </button>
            </div>
          </div>

          {/* Video Display Area */}
          <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={courseData.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : instagramEmbedUrl ? (
              <iframe
                src={instagramEmbedUrl}
                title={courseData.title}
                allowFullScreen
                className="w-full h-full border-0 bg-white"
              />
            ) : cleanVideoUrl ? (
              <video
                src={cleanVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={courseData.image}
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-900 p-6 text-center">
                <img
                  src={courseData.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                  alt={courseData.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center mx-auto shadow-2xl ring-4 ring-white/20">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Watch Course Demo</h3>
                  <p className="text-xs text-gray-300 max-w-md mx-auto">
                    Video preview for <strong>{courseData.title}</strong>. Custom video links can be added via the Admin Panel.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Below Video: Course Detailed Info & Specs */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Overview, What You Learn, Target */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-2xl p-1.5 flex gap-2 shadow-xs">
              {['Overview', 'Target', 'Instructor'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-[var(--color-primary)] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Box */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              
              {activeTab === 'Overview' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[var(--color-primary)]" /> Course Overview
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {overviewContent}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" /> What You Will Learn
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3.5">
                      {whatYouWillLearnList.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Target' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[var(--color-primary)]" /> Target & Learning Goals
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {targetContent}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <h4 className="text-base font-bold text-gray-900">Key Target Objectives</h4>
                    <div className="space-y-3">
                      {[
                        { title: 'Foundational Mastery', desc: 'Building robust fundamentals in core subjects to ensure long-term academic excellence.' },
                        { title: 'Analytical Problem Solving', desc: 'Developing speed, accuracy, and critical thinking skills for board and competitive exams.' },
                        { title: 'Personalized Mentor Support', desc: '1-on-1 doubt resolution sessions ensuring no student is left behind.' },
                        { title: 'Exam Preparedness', desc: 'Regular timed mock test series, detailed performance analytics, and personalized guidance.' }
                      ].map((obj, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-gray-900">{obj.title}:</strong> <span className="text-gray-600">{obj.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Instructor' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4 p-2">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    YE
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-gray-900">{courseData.instructor || 'Senior Faculty @ YashEdu'}</h4>
                    <p className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-wider">Lead Educator</p>
                    <p className="text-xs text-gray-600 leading-relaxed pt-1">
                      Experienced academic educator with years of teaching excellence, committed to student progress, individual attention, and top academic scores.
                    </p>
                  </div>
                </motion.div>
              )}

            </div>
          </div>

          {/* Right Column: Course Features Box & Guarantee */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-5 shadow-sm">
              <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                Course Summary
              </h3>

              <ul className="space-y-3.5 text-xs text-gray-700 font-medium">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500"><Clock className="w-4 h-4 text-red-500" /> Duration</span>
                  <span className="font-bold text-gray-900">{courseData.duration || '32 Hours'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500"><Users className="w-4 h-4 text-blue-600" /> Students</span>
                  <span className="font-bold text-gray-900">{courseData.students || '12.5k Enrolled'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500"><FileText className="w-4 h-4 text-purple-600" /> Materials</span>
                  <span className="font-bold text-gray-900">{courseData.materials || 'Notes & Practice Sets'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500"><Award className="w-4 h-4 text-amber-500" /> Certificate</span>
                  <span className="font-bold text-gray-900">{courseData.certificate || 'Certified Track'}</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowQueryModal(true)}
                  className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" /> Request Query
                </button>
              </div>

              <div className="pt-2 text-center">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <Shield className="w-4 h-4" /> Top Quality Academic Support
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Query Request Modal Popup */}
      {showQueryModal && (
        <RequestQueryModal
          courseTitle={courseData.title}
          onClose={() => setShowQueryModal(false)}
        />
      )}

    </div>
  );
};
