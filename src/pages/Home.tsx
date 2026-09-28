import { motion } from 'framer-motion';
import { Play, ArrowRight, Users, BookOpen, Monitor, Award, CheckCircle2, Sparkles, Brain, Target, Zap, Compass, Video, GraduationCap, Trophy, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RequestQueryModal } from '../components/RequestQueryModal';
import { WatchVideoModal } from '../components/WatchVideoModal';
import { CourseDetailsModal } from '../components/CourseDetailsModal';
import { EducationalJourney } from '../components/EducationalJourney';
import { TeachingMethod } from '../components/TeachingMethod';
import heroCtaImg from '../images/hero-cta.jpg';
import { API_BASE_URL } from '../config/api';

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-xl flex items-center justify-center text-[var(--color-primary)] mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">{title}</h3>
    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

export const Home = () => {
  const navigate = useNavigate();
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<any | null>(null);
  const [selectedCourseForQuery, setSelectedCourseForQuery] = useState<string | null>(null);
  const [selectedWatchVideo, setSelectedWatchVideo] = useState<{ title: string; image?: string; videoUrl?: string } | null>(null);
  const [homeConfig, setHomeConfig] = useState<any>(null);

  const [aboutData, setAboutData] = useState<any>({
    heroTitle: 'About Yash Educational Institute',
    heroDescription: 'At Yash Educational Institute, we believe every student has the potential to achieve greatness. We are committed to providing quality education, expert guidance, and a nurturing environment that inspires confidence, curiosity, and character.'
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/home-learning`)
      .then(res => res.json())
      .then(data => {
        if (data) setHomeConfig(data);
      })
      .catch(err => console.warn('Using default home config:', err));

    fetch(`${API_BASE_URL}/api/about`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setAboutData((prev: any) => ({
            ...prev,
            heroTitle: data.heroTitle || data.title || prev.heroTitle,
            heroDescription: data.heroDescription || data.subtitle || prev.heroDescription
          }));
        }
      })
      .catch(err => console.warn('Using default about data in home:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="relative pt-4 sm:pt-6 md:pt-10 pb-8 sm:pb-12 overflow-hidden bg-[#FFFDF8]">
        {/* Background Decorative Gradient Wave */}
        <div className="hidden lg:block absolute bottom-0 right-0 w-[55%] h-[85%] bg-gradient-to-tl from-red-600 via-red-500 to-transparent rounded-tl-[140px] opacity-90 pointer-events-none"></div>

        <div className="w-full px-4 sm:px-10 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-start pt-2 order-1"
            >
              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4 sm:mb-6">
                {homeConfig?.heroTitleLine1 || 'Learn Without'}<br />
                <span className="text-[var(--color-primary)] relative inline-block">
                  {homeConfig?.heroTitleLine2 || 'Limits.'}
                  <span className="absolute -bottom-2 left-0 w-16 h-1.5 bg-[var(--color-primary)] rounded-full"></span>
                </span>
              </h1>

              {/* Subtitle / Paragraphs */}
              <div className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-xl leading-relaxed space-y-3 font-normal">
                {homeConfig?.heroDescription1 && (
                  <p>{homeConfig.heroDescription1}</p>
                )}
                {homeConfig?.heroDescription2 && (
                  <p>{homeConfig.heroDescription2}</p>
                )}
                {!homeConfig?.heroDescription1 && !homeConfig?.heroDescription2 && (
                  <>
                    <p>Give your child the right guidance, personal attention, and strong academic foundation they need to succeed.</p>
                    <p>Our tuition program provides a supportive and engaging learning environment for every student. We focus on helping students understand concepts clearly rather than simply memorizing answers.</p>
                  </>
                )}
              </div>
              
              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-4 sm:mb-8">
                <Link 
                  to={homeConfig?.heroButtonLink || '/courses'} 
                  className="px-7 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-200 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {homeConfig?.heroButtonText || 'Start Learning'} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

            </motion.div>

            {/* Right Hero Image with Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full h-[320px] sm:h-[480px] lg:h-[520px] flex items-center justify-center order-2 mt-2 lg:mt-0"
            >
              {/* Flight Path SVG Line */}
              <svg className="absolute -top-10 -left-10 w-full h-full pointer-events-none opacity-40 hidden sm:block" viewBox="0 0 400 400" fill="none">
                <path d="M 50 350 Q 150 50 350 100" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="8 8" />
              </svg>

              {/* Main Image Container */}
              <div className="relative w-full h-full rounded-[24px] sm:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src={homeConfig?.heroImage || heroCtaImg} 
                  alt="Students learning in classroom" 
                  className="w-full h-full object-cover object-center"
                />
              </div>



            </motion.div>
          </div>

        </div>
      </section>

      {/* About Us Home Section */}
      <section className="pt-10 md:pt-14 pb-0 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="w-full pl-0 pr-6 sm:pr-10 lg:pr-16 max-w-[1536px] ml-0">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-end">
            
            {/* Left Column: Seamless Video (Larger size & flush to bottom-left screen edge) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 flex justify-start items-end self-end -mb-1 pl-0 ml-0"
            >
              <video 
                src="/videos/untitled_design.mp4" 
                autoPlay 
                muted 
                playsInline 
                style={{ mixBlendMode: 'multiply' }}
                className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl h-auto max-h-[580px] lg:max-h-[720px] xl:max-h-[820px] object-contain block align-bottom origin-bottom-left mix-blend-multiply pl-0 ml-0 scale-105 sm:scale-110 lg:scale-115"
              />
            </motion.div>

            {/* Right Column: Heading & Description */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-6 space-y-6 text-left pb-10 md:pb-16 pl-2 sm:pl-0"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                  About <span className="text-[var(--color-primary)]">Yash</span> Educational Institute
                </h2>
                <div className="w-20 h-1 bg-[var(--color-primary)] rounded-full mt-3"></div>
              </div>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal">
                {aboutData.heroDescription}
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>Read More About Us</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4 sm:whitespace-nowrap">Everything you need to succeed</h2>
            <p className="text-gray-500 text-lg">Our platform provides a comprehensive suite of tools designed to enhance learning and teaching experiences.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <FeatureCard icon={Monitor} title="Live Classes" desc="Real-time interactive sessions with top educators." delay={0.1} />
            <FeatureCard icon={Play} title="Recorded Courses" desc="Learn at your own pace with high-quality video content." delay={0.2} />
            <FeatureCard icon={CheckCircle2} title="Mock Tests" desc="Prepare effectively with full-length timed practice tests." delay={0.3} />
            <FeatureCard icon={BookOpen} title="Regular Tests" desc="Weekly evaluations and practice tests for mastery." delay={0.4} />
            <FeatureCard icon={BookOpen} title="Assignments" desc="Regular homework and practice tasks for mastery." delay={0.1} />
            <FeatureCard icon={Award} title="Report Cards" desc="Detailed performance analysis and progress reports." delay={0.2} />
            <FeatureCard icon={Users} title="Parent Dashboard" desc="Keep track of your child's progress and attendance." delay={0.3} />
            <FeatureCard icon={Monitor} title="Student Dashboard" desc="Comprehensive analytics and personalized learning paths." delay={0.4} />
          </div>
        </div>
      </section>

      {/* Classes We Teach Section */}
      <section className="py-10 md:py-12 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="w-full px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              {homeConfig?.classesWeTeachSectionTitle || 'Classes We Teach'}
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              {homeConfig?.classesWeTeachSectionSubtitle || 'Tailored curriculum and expert coaching designed for every milestone of your academic journey.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {(
              (homeConfig?.classesWeTeachCards?.length > 0)
                ? homeConfig.classesWeTeachCards
                : [
                    { title: 'Classes 1 – 5', tag: 'Primary', description: 'Building strong fundamentals in Math, Science & Language with activity-based learning.', highlights: ['Activity-Based Learning', 'Core Math & Science', 'Interactive Live Quizzes'], themeColor: 'red' },
                    { title: 'Classes 6 – 8', tag: 'Middle School', description: 'Conceptual clarity, analytical problem solving, and early Olympiad foundation.', highlights: ['Conceptual Deep Dives', 'Olympiad Preparation', 'Dedicated Doubt Clearing'], themeColor: 'blue' },
                    { title: 'Classes 9 – 10', tag: 'Boards Prep', description: 'Board Exam mastery, mock test series, and strong competitive foundation.', highlights: ['Board Exam Preparation', 'Timed Mock Test Series', '1-on-1 Academic Mentorship'], themeColor: 'amber' },
                    { title: 'Classes 11 – 12', tag: 'Senior & Entrance', description: 'Advanced Science & Commerce streams, JEE/NEET prep & board strategies.', highlights: ['JEE / NEET Focused Tracks', 'Science & Commerce Specialization', 'Live Problem Solving'], themeColor: 'purple' }
                  ]
            ).map((card: any, idx: number) => {
              const theme = card.themeColor || (idx === 0 ? 'red' : idx === 1 ? 'blue' : idx === 2 ? 'amber' : 'purple');
              
              const colorClasses = {
                red: { bg: 'from-rose-50/60 via-white to-white', border: 'border-rose-100/80 hover:border-red-200', iconBg: 'from-red-500 to-rose-400 shadow-red-200', badge: 'bg-rose-50 border-rose-200 text-rose-600', check: 'text-red-500', btn: 'bg-red-50 group-hover:bg-[var(--color-primary)] text-[var(--color-primary)] group-hover:text-white', icon: Sparkles },
                blue: { bg: 'from-blue-50/60 via-white to-white', border: 'border-blue-100/80 hover:border-blue-200', iconBg: 'from-blue-500 to-indigo-500 shadow-blue-200', badge: 'bg-blue-50 border-blue-200 text-blue-600', check: 'text-blue-500', btn: 'bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white', icon: Brain },
                amber: { bg: 'from-amber-50/60 via-white to-white', border: 'border-amber-100/80 hover:border-amber-200', iconBg: 'from-amber-500 to-orange-400 shadow-amber-200', badge: 'bg-amber-50 border-amber-200 text-amber-600', check: 'text-amber-500', btn: 'bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white', icon: Target },
                purple: { bg: 'from-purple-50/60 via-white to-white', border: 'border-purple-100/80 hover:border-purple-200', iconBg: 'from-purple-600 to-indigo-600 shadow-purple-200', badge: 'bg-purple-50 border-purple-200 text-purple-600', check: 'text-purple-500', btn: 'bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white', icon: Zap }
              }[theme as 'red' | 'blue' | 'amber' | 'purple'] || { bg: 'from-rose-50/60 via-white to-white', border: 'border-rose-100/80 hover:border-red-200', iconBg: 'from-red-500 to-rose-400 shadow-red-200', badge: 'bg-rose-50 border-rose-200 text-rose-600', check: 'text-red-500', btn: 'bg-red-50 group-hover:bg-[var(--color-primary)] text-[var(--color-primary)] group-hover:text-white', icon: Sparkles };

              const CardIcon = colorClasses.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx + 1) * 0.1, duration: 0.5 }}
                  className={`group bg-gradient-to-b ${colorClasses.bg} p-4 sm:p-7 rounded-2xl sm:rounded-3xl border ${colorClasses.border} shadow-md hover:shadow-2xl transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${colorClasses.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <CardIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wide ${colorClasses.badge}`}>
                        {card.tag || 'Academic'}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-2xl font-black text-gray-900 mb-1 sm:mb-2">{card.title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-6">
                      {card.description}
                    </p>

                    <ul className="space-y-1.5 sm:space-y-2.5 mb-2">
                      {(card.highlights || []).map((highlight: string, hIdx: number) => (
                        <li key={hIdx} className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-700">
                          <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClasses.check} shrink-0`} /> {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teaching Method Section */}
      <TeachingMethod />

      {/* Educational Journey Section */}
      <EducationalJourney />

      {/* Course Details Modal */}
      {selectedCourseForDetails && (
        <CourseDetailsModal
          course={selectedCourseForDetails}
          onClose={() => setSelectedCourseForDetails(null)}
          onRequestQuery={(title: string) => setSelectedCourseForQuery(title)}
          onWatchVideo={(title: string, image?: string, videoUrl?: string) => {
            setSelectedCourseForDetails(null);
            navigate('/course-details', { state: { course: { title, image, videoUrl } } });
          }}
        />
      )}

      {/* Request Query Modal */}
      {selectedCourseForQuery && (
        <RequestQueryModal 
          courseTitle={selectedCourseForQuery} 
          onClose={() => setSelectedCourseForQuery(null)} 
        />
      )}

      {/* Watch Video Modal */}
      {selectedWatchVideo && (
        <WatchVideoModal 
          courseTitle={selectedWatchVideo.title}
          courseImage={selectedWatchVideo.image}
          videoUrl={selectedWatchVideo.videoUrl}
          onClose={() => setSelectedWatchVideo(null)} 
        />
      )}

    </div>
  );
};
