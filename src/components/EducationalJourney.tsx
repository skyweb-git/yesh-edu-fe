import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, Award, CalendarCheck, Activity, FileText } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

// Default images as fallback if gallery is empty

const defaultStudyImages = [
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=500&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80'
];

export const EducationalJourney = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/home-learning`)

      .then(res => res.json())
      .then(data => {
        if (data) {
          setConfig(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching home learning section config:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return null; // Or a subtle skeleton loader if preferred
  
  // If explicitly hidden, or failed to fetch and we want to hide it
  if (!config || config.isVisible === false) return null;

  // Prepare images
  let activeImages = (config.galleryImages || [])
    .filter((img: any) => img.active !== false && img.image)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    .map((img: any) => img.image);

  if (activeImages.length === 0) {
    activeImages = defaultStudyImages;
  } else {
    // Fill up to at least 6 images so diagonal rows are completely populated
    const baseList = [...activeImages];
    while (activeImages.length < 6) {
      activeImages = [...activeImages, ...baseList];
    }
  }

  // Duplicate images for infinite loop, chunking into rows
  const halfLen = Math.ceil(activeImages.length / 2) || 1;
  const row1 = activeImages;
  const row2 = [...activeImages.slice(halfLen), ...activeImages.slice(0, halfLen)];
  const row3 = activeImages.length > 2 ? [...activeImages.slice(1), ...activeImages.slice(0, 1)] : activeImages;

  const scrollingRows = [
    [...row1, ...row1, ...row1, ...row1],
    [...row2, ...row2, ...row2, ...row2],
    [...row3, ...row3, ...row3, ...row3]
  ];

  return (
    <section className="relative pt-10 md:pt-12 pb-0 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-10 right-20 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-60"></div>

      <div className="w-full px-6 sm:px-10 lg:px-16 relative z-10 pb-0">
        
        {/* Optional Title Section above the manga layout (if the admin entered one) */}
        {(config.sectionTitle || config.sectionDescription) && (
          <div className="text-center mb-8">
            {config.sectionTitle && <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">{config.sectionTitle}</h2>}
            {config.sectionDescription && <p className="text-gray-500 text-lg">{config.sectionDescription}</p>}
          </div>
        )}

        {/* Parent Progress Card (Full Width Banner - Controlled from Admin) */}
        {config?.showParentProgress !== false && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-5xl mx-auto mb-8 sm:mb-12 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[#0F172A] border border-slate-800 text-white shadow-2xl relative z-30"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-slate-800 pb-3 sm:pb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-900/30 shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight">
                    {config?.parentProgressTitle || 'Parent Progress Live Tracking'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                    {config?.parentProgressSubtitle || 'Real-time student growth, regular tests & report updates'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-extrabold border border-emerald-500/30 shadow-xs shrink-0 self-start sm:self-auto">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                {config?.parentProgressStatusText || 'Active Live'}
              </div>
            </div>

            {/* Progress Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 text-center">
              <div className="p-3 sm:p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xs hover:border-slate-700 hover:shadow-md transition-all group">
                <div className="flex items-center justify-center text-red-400 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight">
                  {config?.parentProgressQuizScore || '96%'}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Quiz Score</div>
              </div>

              <div className="p-3 sm:p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xs hover:border-slate-700 hover:shadow-md transition-all group">
                <div className="flex items-center justify-center text-blue-400 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
                  <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight">
                  {config?.parentProgressAttendance || '98%'}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Attendance</div>
              </div>

              <div className="p-3 sm:p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xs hover:border-slate-700 hover:shadow-md transition-all group">
                <div className="flex items-center justify-center text-purple-400 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight">
                  {config?.parentProgressRegularTests || 'Weekly'}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Regular Tests</div>
              </div>

              <div className="p-3 sm:p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xs hover:border-slate-700 hover:shadow-md transition-all group">
                <div className="flex items-center justify-center text-amber-400 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight">
                  {config?.parentProgressBatchRank || 'Top 5%'}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Batch Rank</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
