import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Hash, Camera, Briefcase, Video } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export const Contact = () => {
  const [searchParams] = useSearchParams();
  const userFullName = localStorage.getItem('userFullName') || '';
  const names = userFullName.split(' ');
  const fName = names[0] || '';
  const lName = names.slice(1).join(' ') || '';

  const [formData, setFormData] = useState({
    firstName: fName,
    lastName: lName,
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    subject: searchParams.get('subject') || 'General Inquiry',
    message: ''
  });
  
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email && (!formData.firstName || !formData.phone)) {
      fetch(`${API_BASE_URL}/api/users?email=${email}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const user = data[0];
            const names = (user.fullName || '').split(' ');
            setFormData(prev => ({
              ...prev,
              firstName: prev.firstName || names[0] || '',
              lastName: prev.lastName || names.slice(1).join(' ') || '',
              phone: prev.phone || user.phone || ''
            }));
          }
        })
        .catch(err => console.error(err));
    }
  }, []);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent opacity-50"></div>
        <div className="w-full px-6 sm:px-10 lg:px-16 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Get in Touch</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Have questions about our courses, pricing, or need technical support? Our team is here to help you.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 w-full px-6 sm:px-10 lg:px-16 relative -mt-16 z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6 text-gray-600">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-50 text-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Office Address</h4>
                      <p className="text-sm leading-relaxed">CF8R+JQ, Secunderabad,<br/>Telangana, India</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-50 text-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Phone Number / WhatsApp</h4>
                      <a 
                        href="https://wa.me/918686456117" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm leading-relaxed text-emerald-600 hover:text-emerald-700 font-bold underline flex items-center gap-1"
                        title="Chat on WhatsApp"
                      >
                        +91 86864 56117 ↗
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-50 text-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Email Address</h4>
                      <p className="text-sm leading-relaxed">support@yashedu.com<br/>admissions@yashedu.com</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-50 text-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
                      <p className="text-sm leading-relaxed">Monday - Friday: 9AM - 6PM<br/>Saturday: 10AM - 2PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Connect & Follow Us</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/yasheduacademy?igsi=cjA5eTM2dTEycnlk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl hover:scale-110 transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-center"
                    title="Instagram - Yash Edu Academy"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C9.284 2 8.944 2.012 7.877 2.06 6.812 2.109 6.085 2.278 5.448 2.525A5.025 5.025 0 003.625 3.625 5.025 5.025 0 002.525 5.448C2.278 6.085 2.109 6.812 2.06 7.877 2.012 8.944 2 9.284 2 12s.012 3.056.06 4.123c.049 1.065.218 1.792.465 2.429a5.025 5.025 0 001.1 1.823 5.025 5.025 0 001.823 1.1c.637.247 1.364.416 2.429.465C8.944 21.988 9.284 22 12 22s3.056-.012 4.123-.06c1.065-.049 1.792-.218 2.429-.465a5.025 5.025 0 001.823-1.1 5.025 5.025 0 001.1-1.823c.247-.637.416-1.364.465-2.429C21.988 15.056 22 14.716 22 12s-.012-3.056-.06-4.123c-.049-1.065-.218-1.792-.465-2.429a5.025 5.025 0 00-1.1-1.823 5.025 5.025 0 00-1.823-1.1c-.637-.247-1.364-.416-2.429-.465C15.056 2.012 14.716 2 12 2zm0 1.802c2.67 0 2.987.01 4.042.058.976.045 1.505.208 1.858.345.467.182.8.398 1.15.748.35.35.566.683.748 1.15.137.353.3.882.345 1.858.048 1.055.058 1.372.058 4.042s-.01 2.987-.058 4.042c-.045.976-.208 1.505-.345 1.858a3.223 3.223 0 01-.748 1.15c-.35.35-.683.566-1.15.748-.353.137-.882.3-1.858.345-1.055.048-1.372.058-4.042.058s-2.987-.01-4.042-.058c-.976-.045-1.505-.208-1.858-.345a3.223 3.223 0 01-1.15-.748 3.223 3.223 0 01-.748-1.15c-.137-.353-.3-.882-.345-1.858-.048-1.055-.058-1.372-.058-4.042s.01-2.987.058-4.042c.045-.976.208-1.505.345-1.858a3.223 3.223 0 01.748-1.15c.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.858-.345 1.055-.048 1.372-.058 4.042-.058zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" fill="url(#instagram-gradient)" />
                      <defs>
                        <radialGradient id="instagram-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(3 21) rotate(-45) scale(25)">
                          <stop offset="0%" stopColor="#FFDD55" />
                          <stop offset="30%" stopColor="#FF543E" />
                          <stop offset="70%" stopColor="#C837AB" />
                          <stop offset="100%" stopColor="#3771C8" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </a>
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/918686456117"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl hover:scale-110 transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-center text-emerald-600"
                    title="WhatsApp"
                  >
                    <svg className="h-5 w-5 fill-current text-emerald-600" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com/@yasheduacademy/videos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl hover:scale-110 transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-center text-red-600"
                    title="YouTube - Yash Edu Academy"
                  >
                    <svg className="h-5 w-5 fill-current text-red-600" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/yasheduacademy?mibextid=rS40aB7S9Ucbxw6v"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl hover:scale-110 transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-center text-blue-600"
                    title="Facebook - Yash Edu Academy"
                  >
                    <svg className="h-5 w-5 fill-current text-blue-600" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'success' && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                    Message sent successfully! We will get back to you soon.
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                    Failed to send message. Please try again.
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">First Name</label>
                    <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors" placeholder="Doe" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors" placeholder="+91 86864 56117" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Subject</label>
                  <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors text-gray-700" placeholder="General Inquiry" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Message</label>
                  <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <button type="submit" disabled={status === 'sending'} className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50">
                  {status === 'sending' ? 'Sending...' : 'Send Message'} <Send className="w-5 h-5" />
                </button>
              </form>
            </motion.div>

            {/* Embedded Google Map */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" /> Our Location
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">CF8R+JQ, Secunderabad, Telangana</p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=CF8R%2BJQ+Secunderabad,+Telangana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-50 text-[var(--color-primary)] hover:bg-red-100 rounded-xl text-xs font-bold transition-all border border-red-100 flex items-center gap-1.5"
                >
                  Open in Google Maps ↗
                </a>
              </div>

              <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                <iframe
                  title="Secunderabad Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/maps?q=CF8R%2BJQ+Secunderabad,+Telangana&t=&z=15&ie=UTF8&iwloc=&output=embed"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};
