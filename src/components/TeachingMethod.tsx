import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BookOpen, Pencil, ClipboardCheck, TrendingUp, ArrowRight, ChevronRight, Users } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const defaultSteps = [
  {
    step: '01',
    title: 'Learn',
    description: 'Understand concepts clearly with simple explanations and real-life examples.',
    icon: BookOpen,
    badge: 'Phase 1 of 4',
    themeColor: 'red',
  },
  {
    step: '02',
    title: 'Practice',
    description: 'Strengthen knowledge through worksheets, assignments, and regular practice.',
    icon: Pencil,
    badge: 'Phase 2 of 4',
    themeColor: 'blue',
  },
  {
    step: '03',
    title: 'Test',
    description: 'Regular assessments and quizzes to evaluate understanding and track progress.',
    icon: ClipboardCheck,
    badge: 'Phase 3 of 4',
    themeColor: 'amber',
  },
  {
    step: '04',
    title: 'Improve',
    description: 'Personalized feedback and doubt clearing to help students improve continuously.',
    icon: TrendingUp,
    badge: 'Phase 4 of 4',
    themeColor: 'emerald',
  },
];

const colorStyles: Record<string, any> = {
  red: {
    numberColor: 'text-red-400',
    titleColor: 'text-red-500',
    iconBg: 'bg-red-100/80 text-red-500',
    dotBg: 'bg-red-300',
    btnBg: 'bg-red-500',
    phaseColor: 'text-red-500',
    borderColor: 'border-red-100',
    icon: BookOpen,
  },
  blue: {
    numberColor: 'text-blue-400',
    titleColor: 'text-blue-600',
    iconBg: 'bg-blue-100/80 text-blue-600',
    dotBg: 'bg-blue-300',
    btnBg: 'bg-blue-600',
    phaseColor: 'text-blue-600',
    borderColor: 'border-blue-100',
    icon: Pencil,
  },
  amber: {
    numberColor: 'text-amber-400',
    titleColor: 'text-amber-500',
    iconBg: 'bg-amber-100/80 text-amber-500',
    dotBg: 'bg-amber-300',
    btnBg: 'bg-amber-500',
    phaseColor: 'text-amber-500',
    borderColor: 'border-amber-100',
    icon: ClipboardCheck,
  },
  emerald: {
    numberColor: 'text-emerald-400',
    titleColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100/80 text-emerald-600',
    dotBg: 'bg-emerald-300',
    btnBg: 'bg-emerald-600',
    phaseColor: 'text-emerald-600',
    borderColor: 'border-emerald-100',
    icon: TrendingUp,
  },
};

export const TeachingMethod = () => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/home-learning`)
      .then((res) => res.json())
      .then((data) => {
        if (data) setConfig(data);
      })
      .catch((err) => console.error('Error fetching teaching method config:', err));
  }, []);

  if (config && config.teachingMethodVisible === false) return null;

  const rawSteps = config?.teachingMethodSteps?.length > 0 ? config.teachingMethodSteps : defaultSteps;
  const stepsList = rawSteps.filter((s: any) => s.active !== false);

  const sectionTitle = config?.teachingMethodTitle || 'Our 4-Step Learning Journey';
  const sectionDesc =
    config?.teachingMethodDescription ||
    'A proven methodology that helps students learn better, practice smarter, and achieve more.';
  const assuranceTitle = config?.teachingMethodAssuranceTitle || 'Why Parents Trust Our Methodology';
  const assuranceDesc =
    config?.teachingMethodAssuranceDesc ||
    'Every student gets personalized attention with weekly updates delivered directly to parents.';

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden border-t border-gray-100">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-red-50/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10 max-w-[1550px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3"
          >
            {sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal"
          >
            {sectionDesc}
          </motion.p>
        </div>

        {/* 4-Step Journey Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 relative items-stretch">
          {stepsList.map((item: any, idx: number) => {
            const themeKey = item.themeColor || (idx === 0 ? 'red' : idx === 1 ? 'blue' : idx === 2 ? 'amber' : 'emerald');
            const style = colorStyles[themeKey] || colorStyles.red;
            const Icon = item.icon || style.icon || BookOpen;
            const stepNum = item.step || `0${idx + 1}`;
            const phaseText = item.badge || `Phase ${idx + 1} of ${stepsList.length}`;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className={`relative h-full group bg-white p-6 sm:p-7 rounded-[28px] border ${style.borderColor} shadow-md shadow-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Row: Icon & Step Number */}
                  <div className="flex items-start justify-between mb-5">
                    {/* Icon container with soft circular background and decorative dot */}
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full ${style.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className={`w-2 h-2 rounded-full ${style.dotBg} absolute -top-0.5 -right-0.5`}></span>
                    </div>

                    {/* Step Number */}
                    <span className={`text-2xl font-black ${style.numberColor} tracking-tight`}>
                      {stepNum}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className={`text-xl font-bold ${style.titleColor} mb-2`}>
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Flow indicator chevron arrow between cards (desktop) */}
                {idx < stepsList.length - 1 && (
                  <div className="hidden lg:flex absolute left-[calc(100%+0.75rem)] -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                    <ChevronRight className="w-7 h-7 text-[var(--color-primary)] stroke-[3] drop-shadow-sm" />
                  </div>
                )}

                {/* Bottom Bar: Action Arrow & Phase Text */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full ${style.btnBg} flex items-center justify-center text-white shrink-0 shadow-2xs`}>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className={`text-xs font-semibold ${style.phaseColor}`}>
                    {phaseText}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
