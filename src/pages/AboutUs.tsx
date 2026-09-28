import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  GraduationCap, 
  CheckCircle2, 
  Target, 
  Eye, 
  Award, 
  HeartHandshake, 
  Heart, 
  ArrowRight,
  Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const defaultIcons = [Users, BookOpen, Trophy, Star, ShieldCheck, TrendingUp, Sparkles, Award];

export const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState({

    // Hero Section
    heroTitle: 'About Yash Educational Institute',
    heroDescription: 'At Yash Educational Institute, we believe every student has the potential to achieve greatness. We are committed to providing quality education, expert guidance, and a nurturing environment that inspires confidence, curiosity, and character.',
    heroImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    heroCtaText: 'Explore Our Programs',
    heroCtaLink: '/courses',

    // Story Section
    storyTitle: 'Our Story',
    storyP1: 'Founded with the vision of making quality education accessible and effective for all, Yash Educational Institute has grown into a trusted learning partner for thousands of students.',
    storyP2: 'From a small beginning, we have built a strong academic community driven by passion, dedication, and a student-first approach.',
    storyCtaText: 'Know More About Us',
    storyCtaLink: '/courses',
    storyImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    storyBadgeTitle: 'Trusted by',
    storyBadgeText: 'Thousands of Students & Parents',

    // Mission & Vision Section
    missionVisionTitle: 'Our Mission & Vision',
    missionTitle: 'Our Mission',
    ourMission: 'Yash Educational Institute empowers every student to realize their potential by providing quality education, strong values, and the right guidance. We are committed to nurturing confident, skilled, and responsible individuals who contribute positively to society.',
    visionTitle: 'Our Vision',
    ourVision: 'To be a leading institute recognized for academic excellence, innovative teaching, and holistic development, preparing students to excel in a dynamic global world.',

    // Why Choose Us Section
    whyChooseUsTitle: 'Why Choose Us?',
    whyChooseUs: [
      { title: 'Expert Faculty', description: 'Experienced and dedicated teachers committed to student success.' },
      { title: 'Comprehensive Programs', description: 'Curriculum designed for every academic milestone.' },
      { title: 'Proven Results', description: 'High success rate with countless achievers and top performers.' },
      { title: 'Student-Centered Approach', description: 'Personal attention and mentorship for overall growth.' },
      { title: 'Safe & Supportive Environment', description: 'A positive atmosphere that encourages learning and confidence.' },
      { title: 'Future-Ready Learning', description: 'Building skills, critical thinking, and leadership for tomorrow.' }
    ],

    // Statistics Banner Section
    stats: {
      studentsEnrolled: '5,000+',
      studentsEnrolledLabel: 'Students Enrolled',
      expertFaculty: '50+',
      expertFacultyLabel: 'Expert Faculty',
      successRate: '98%',
      successRateLabel: 'Success Rate',
      coursesOffered: '120+',
      coursesOfferedLabel: 'Courses Offered'
    },

    // Values Section
    valuesTitle: 'Our Values',
    coreValues: [
      { title: 'Excellence', description: 'We strive for the highest standards in teaching and learning.' },
      { title: 'Integrity', description: 'Honesty, transparency, and strong moral values guide us.' },
      { title: 'Respect', description: 'We respect every individual and celebrate diversity.' },
      { title: 'Growth', description: 'We believe in continuous improvement and lifelong learning.' },
      { title: 'Commitment', description: 'We are dedicated to shaping bright futures with care and passion.' }
    ]
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/about`)

      .then(res => res.json())
      .then(data => {
        if (data) {
          setAboutData(prev => ({
            ...prev,
            heroTitle: data.heroTitle || data.title || prev.heroTitle,
            heroDescription: data.heroDescription || data.subtitle || prev.heroDescription,
            heroImage: data.heroImage || prev.heroImage,
            heroCtaText: data.heroCtaText || prev.heroCtaText,
            heroCtaLink: data.heroCtaLink || prev.heroCtaLink,

            storyTitle: data.storyTitle || prev.storyTitle,
            storyP1: data.storyP1 || prev.storyP1,
            storyP2: data.storyP2 || prev.storyP2,
            storyCtaText: data.storyCtaText || prev.storyCtaText,
            storyCtaLink: data.storyCtaLink || prev.storyCtaLink,
            storyImage: data.storyImage || prev.storyImage,
            storyBadgeTitle: data.storyBadgeTitle || prev.storyBadgeTitle,
            storyBadgeText: data.storyBadgeText || prev.storyBadgeText,

            missionVisionTitle: data.missionVisionTitle || prev.missionVisionTitle,
            missionTitle: data.missionTitle || prev.missionTitle,
            ourMission: data.ourMission || prev.ourMission,
            visionTitle: data.visionTitle || prev.visionTitle,
            ourVision: data.ourVision || prev.ourVision,

            whyChooseUsTitle: data.whyChooseUsTitle || prev.whyChooseUsTitle,
            whyChooseUs: Array.isArray(data.whyChooseUs) && data.whyChooseUs.length > 0 ? data.whyChooseUs : prev.whyChooseUs,

            stats: {
              studentsEnrolled: data.stats?.studentsEnrolled || prev.stats.studentsEnrolled,
              studentsEnrolledLabel: data.stats?.studentsEnrolledLabel || prev.stats.studentsEnrolledLabel,
              expertFaculty: data.stats?.expertFaculty || prev.stats.expertFaculty,
              expertFacultyLabel: data.stats?.expertFacultyLabel || prev.stats.expertFacultyLabel,
              successRate: data.stats?.successRate || prev.stats.successRate,
              successRateLabel: data.stats?.successRateLabel || prev.stats.successRateLabel,
              coursesOffered: data.stats?.coursesOffered || prev.stats.coursesOffered,
              coursesOfferedLabel: data.stats?.coursesOfferedLabel || prev.stats.coursesOfferedLabel
            },

            valuesTitle: data.valuesTitle || prev.valuesTitle,
            coreValues: Array.isArray(data.coreValues) && data.coreValues.length > 0 ? data.coreValues : prev.coreValues
          }));
        }
      })
      .catch(err => console.error('Error loading About Us page data:', err))
      .finally(() => setLoading(false));
  }, []);

  const renderHeroTitle = (titleStr: string) => {
    if (titleStr.includes('Yash')) {
      const parts = titleStr.split('Yash');
      return (
        <>
          {parts[0]}
          <span className="text-red-600">Yash</span>
          {parts[1]}
        </>
      );
    }
    const parts = titleStr.trim().split(' ');
    if (parts.length > 2) {
      const firstWord = parts[0];
      const rest = parts.slice(1).join(' ');
      return (
        <>
          {firstWord} <br />
          <span className="text-red-600">{rest}</span>
        </>
      );
    }
    return <span className="text-red-600">{titleStr}</span>;
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      
      {/* 1. HERO SECTION */}
      <section className="w-full px-6 sm:px-10 lg:px-20 py-12 lg:py-16 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              {renderHeroTitle(aboutData.heroTitle)}
            </h1>
            {/* Red Accent Underline */}
            <div className="w-16 h-1 bg-red-500 rounded-full mt-3"></div>
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            {aboutData.heroDescription}
          </p>

        </motion.div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="bg-[#eef5fc] py-16 lg:py-24 px-6 sm:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-left flex flex-col items-start"
          >
            <div className="text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-left">{aboutData.storyTitle}</h2>
              <div className="w-12 h-1 bg-red-500 rounded-full mt-2 ml-0"></div>
            </div>

            {aboutData.storyP1 && (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-left">
                {aboutData.storyP1}
              </p>
            )}

            {aboutData.storyP2 && (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-left">
                {aboutData.storyP2}
              </p>
            )}
          </motion.div>

          {/* Right Column: Building Image & Floating Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200/60">
              <img 
                src={aboutData.storyImage} 
                alt="Story Building" 
                className="w-full h-80 sm:h-96 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80';
                }}
              />
              
              {/* Floating Badge Overlay */}
              {(aboutData.storyBadgeTitle || aboutData.storyBadgeText) && (
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 max-w-xs flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{aboutData.storyBadgeTitle}</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-tight">
                      <strong className="text-gray-800">{aboutData.storyBadgeText}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. OUR MISSION & VISION */}
      <section className="py-16 lg:py-24 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{aboutData.missionVisionTitle}</h2>
          <div className="w-12 h-1 bg-red-500 rounded-full mx-auto mt-2"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all space-y-4 flex items-start gap-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <Target className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{aboutData.missionTitle}</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {aboutData.ourMission}
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all space-y-4 flex items-start gap-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Eye className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{aboutData.visionTitle}</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {aboutData.ourVision}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US? */}
      {aboutData.whyChooseUs && aboutData.whyChooseUs.length > 0 && (
        <section className="py-12 lg:py-20 px-6 sm:px-10 lg:px-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{aboutData.whyChooseUsTitle}</h2>
              <div className="w-12 h-1 bg-red-500 rounded-full mx-auto mt-2"></div>
            </div>

            <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 text-center max-w-6xl mx-auto">
              {aboutData.whyChooseUs.map((item, idx) => {
                const IconComponent = defaultIcons[idx % defaultIcons.length];
                const colorAccents = [
                  'bg-[#FAF6EE] text-[#D3010A] border-[#F3EAD8]',
                  'bg-[#FAF6EE] text-[#01274C] border-[#F3EAD8]',
                  'bg-[#FAF6EE] text-[#D3010A] border-[#F3EAD8]',
                  'bg-[#FAF6EE] text-[#01274C] border-[#F3EAD8]',
                  'bg-[#FAF6EE] text-[#D3010A] border-[#F3EAD8]',
                  'bg-[#FAF6EE] text-[#01274C] border-[#F3EAD8]'
                ];
                const colorClass = colorAccents[idx % colorAccents.length];

                return (
                  <div key={idx} className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] max-w-xs space-y-3 p-5 rounded-2xl bg-white border border-gray-100/80 shadow-2xs hover:shadow-md transition-all">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${colorClass}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. STATISTICS BANNER */}
      <section className="py-10 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0f172a] text-white p-8 sm:p-12 rounded-3xl shadow-2xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
            
            {/* Stat 1 */}
            <div className="space-y-2 pt-4 lg:pt-0">
              <GraduationCap className="w-7 h-7 text-gray-400 mx-auto" />
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500">{aboutData.stats.studentsEnrolled}</p>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">{aboutData.stats.studentsEnrolledLabel || 'Students Enrolled'}</p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-2 pt-4 lg:pt-0">
              <Users className="w-7 h-7 text-gray-400 mx-auto" />
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500">{aboutData.stats.expertFaculty}</p>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">{aboutData.stats.expertFacultyLabel || 'Expert Faculty'}</p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-2 pt-4 lg:pt-0">
              <CheckCircle2 className="w-7 h-7 text-gray-400 mx-auto" />
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500">{aboutData.stats.successRate}</p>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">{aboutData.stats.successRateLabel || 'Success Rate'}</p>
            </div>

            {/* Stat 4 */}
            <div className="space-y-2 pt-4 lg:pt-0">
              <BookOpen className="w-7 h-7 text-gray-400 mx-auto" />
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500">{aboutData.stats.coursesOffered}</p>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">{aboutData.stats.coursesOfferedLabel || 'Courses Offered'}</p>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 6. OUR VALUES SECTION */}
      {aboutData.coreValues && aboutData.coreValues.length > 0 && (
        <section className="py-16 lg:py-24 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto mb-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{aboutData.valuesTitle}</h2>
            <div className="w-12 h-1 bg-red-500 rounded-full mx-auto mt-2"></div>
          </div>

          <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 text-center max-w-6xl mx-auto">
            {aboutData.coreValues.map((val, idx) => {
              const valueIcons = [Award, HeartHandshake, Users, TrendingUp, Heart, Sparkles];
              const ValueIcon = valueIcons[idx % valueIcons.length];
              const valueColors = [
                'bg-[#FAF6EE] text-[#D3010A] border border-[#F3EAD8]',
                'bg-[#FAF6EE] text-[#01274C] border border-[#F3EAD8]',
                'bg-[#FAF6EE] text-[#D3010A] border border-[#F3EAD8]',
                'bg-[#FAF6EE] text-[#01274C] border border-[#F3EAD8]',
                'bg-[#FAF6EE] text-[#D3010A] border border-[#F3EAD8]'
              ];
              const colorClass = valueColors[idx % valueColors.length];

              return (
                <div key={idx} className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] max-w-xs space-y-3 p-5 rounded-2xl bg-white border border-gray-100/80 shadow-2xs hover:shadow-md transition-all">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${colorClass}`}>
                    <ValueIcon className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-gray-900">{val.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{val.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
};
