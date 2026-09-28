import React from "react";
import { useLocation } from "react-router-dom";
import { Phone, Mail, Clock, ArrowRight, GraduationCap } from "lucide-react";
import logoImg from "../images/Untitled design.png";

// Inline SVG components
const FaInstagram = ({ className = "size-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FaFacebook = ({ className = "size-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const FaYoutube = ({ className = "size-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const FaWhatsapp = ({ className = "size-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp };

export interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Quick Navigation",
    links: [
      { name: "Home", href: "/" },
      { name: "About YashEdu", href: "/about" },
      { name: "All Courses & Batches", href: "/courses" },
      { name: "Educational Blog", href: "/blog" },
      { name: "Contact & Admissions", href: "/contact" },
    ],
  },
  {
    title: "Academic Programs",
    links: [
      { name: "Primary School (Classes 1-5)", href: "/courses" },
      { name: "Middle School (Classes 6-8)", href: "/courses" },
      { name: "Board Prep (Classes 9-10)", href: "/courses" },
      { name: "Senior & Competitive (11-12)", href: "/courses" },
      { name: "JEE / NEET Foundation Tracks", href: "/courses" },
    ],
  },
  {
    title: "Student & Parent Portals",
    links: [
      { name: "Student Portal Sign In", href: "/login" },
      { name: "Parent Portal Sign In", href: "/login" },
      { name: "Live Grade & Attendance Reports", href: "/login" },
      { name: "Online Mock Test Series", href: "/login" },
      { name: "Assignment & Homework Submissions", href: "/login" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "https://www.instagram.com/yasheduacademy?igsi=cjA5eTM2dTEycnlk", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "https://www.facebook.com/yasheduacademy?mibextid=rS40aB7S9Ucbxw6v", label: "Facebook" },
  { icon: <FaYoutube className="size-5" />, href: "https://www.youtube.com/@yasheduacademy/videos", label: "YouTube" },
  { icon: <FaWhatsapp className="size-5" />, href: "https://wa.me/918686456117", label: "WhatsApp" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "/terms-and-conditions" },
  { name: "Privacy Policy", href: "/terms-and-conditions" },
  { name: "Academic Disclaimer", href: "/terms-and-conditions" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    src: logoImg,
    alt: "YashEdu Logo",
    title: "YashEdu Academy",
  },
  sections = defaultSections,
  description = "Learn without limits. YashEdu Academy provides conceptual learning, interactive live classes, certified courses, online mock tests, and real-time parent progress tracking for academic excellence.",
  socialLinks = defaultSocialLinks,
  copyright = `© ${new Date().getFullYear()} YashEdu Academy. Empowering Minds, Shaping Futures. All rights reserved.`,
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <footer className="bg-[#0B1329] text-slate-300 pt-12 md:pt-16 pb-8 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Callout Banner inside Footer */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-blue-950/60 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-900/40">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white">Have Questions About Admissions or Batches?</h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-normal">
                Speak directly with our academic counselors or request a quick callback.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:+918686456117"
              className="w-full md:w-auto px-6 py-3 bg-[var(--color-primary)] hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 86864 56117</span>
            </a>
            <a
              href="/contact"
              className="w-full md:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand, Description, Contact Info Badges */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <a href={logo.url} className="flex items-center gap-3 group">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                />
                <div>
                  <span className="text-2xl font-black tracking-tight text-white block leading-tight">{logo.title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">Learn Without Limits</span>
                </div>
              </a>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md font-normal">
              {description}
            </p>

            {/* Direct Contact Details Badges */}
            <div className="space-y-2.5 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 text-[var(--color-primary)] flex items-center justify-center shrink-0 border border-slate-700/60">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">+91 86864 56117</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 text-blue-400 flex items-center justify-center shrink-0 border border-slate-700/60">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">yasheduacademy@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 text-emerald-400 flex items-center justify-center shrink-0 border border-slate-700/60">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Monday – Saturday: 8:00 AM – 8:00 PM</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">Connect With Us</span>
              <ul className="flex items-center gap-3">
                {socialLinks.map((social, idx) => (
                  <li key={idx}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[var(--color-primary)] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 hover:scale-110 shadow-sm"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2-4: Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
                  {section.title}
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a href={link.href} className="hover:text-white hover:translate-x-0.5 inline-block transition-all">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-8 flex flex-col justify-between gap-4 text-xs text-slate-400 md:flex-row md:items-center">
          <p className="font-normal">{copyright}</p>
          <ul className="flex flex-wrap gap-4 text-xs font-medium">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-white transition-colors">
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export const Footer = (props: Footer7Props) => {
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <Footer7
      logo={{
        url: "/",
        src: logoImg,
        alt: "YashEdu Logo",
        title: "YashEdu Academy",
        ...props.logo,
      }}
      {...props}
    />
  );
};

export default Footer;
