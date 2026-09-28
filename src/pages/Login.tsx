import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, Users, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { OriginButton } from '../components/OriginButton';
import logoImg from '../images/Untitled design.png';
import { API_BASE_URL } from '../config/api';

export const Login = () => {
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isStudent = role === 'student';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const userEmail = email.trim();
    if (!userEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      let firebaseUid = '';

      // Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
        firebaseUid = userCredential.user.uid;
      } catch (fbErr: any) {
        console.error("Firebase auth failed:", fbErr);
        let msg = 'Invalid email or password. Please try again.';
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
          msg = 'Invalid password. Please check your password and try again.';
        } else if (fbErr.code === 'auth/user-not-found') {
          msg = 'No account found with this email address.';
        } else if (fbErr.code === 'auth/invalid-email') {
          msg = 'Invalid email address format.';
        } else if (fbErr.message) {
          msg = fbErr.message;
        }
        throw new Error(msg);
      }

      // Authenticate with backend API
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          role: role,
          firebaseUid: firebaseUid,
          fullName: userEmail.split('@')[0]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Login failed. Please verify your email and password.');
      }

      const data = await res.json();
      const userRole = data.user.role || role;

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userFullName', data.user.fullName || userEmail.split('@')[0]);

      navigate(`/dashboard/${userRole}`, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Login failed. Please check your credentials or contact administrator.');
    }
  };

  const handleBack = () => {
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50/40 to-slate-200 flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-x-hidden relative">
      
      {/* Back to Previous Page Text Link */}
      <button
        onClick={handleBack}
        className="fixed top-5 left-5 sm:top-7 sm:left-8 z-50 flex items-center gap-2 text-slate-700 hover:text-[var(--color-primary)] font-bold text-sm sm:text-base transition-colors hover:-translate-x-0.5 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
        aria-label="Go Back"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
      {/* 21st.dev AuthSwitch Centered Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-[36px] shadow-2xl border border-gray-100 overflow-hidden min-h-0 md:min-h-[580px] relative flex flex-col md:flex-row"
      >

        {/* --- STUDENT FORM CONTAINER (LEFT SIDE) --- */}
        <div 
          className={`w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex-col justify-between bg-white transition-opacity duration-300 ${
            isStudent ? 'flex opacity-100 pointer-events-auto z-10' : 'hidden md:flex opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto z-0'
          }`}
        >
          <div>
            {/* Header / Mobile Switch Button */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#D3010A] to-[#B50108] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md shadow-red-200 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-white" />
                <span>Student Portal</span>
              </div>

              {/* Mobile Role Badge */}
              <button 
                type="button"
                onClick={() => setRole(isStudent ? 'parent' : 'student')}
                className="md:hidden text-xs font-bold text-[var(--color-primary)] bg-red-50 px-3 py-1.5 rounded-full border border-red-100"
              >
                Switch to {isStudent ? 'Parent' : 'Student'}
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-black text-gray-900 mb-1">Sign In</h2>
              <p className="text-sm text-gray-500">Access your courses, assignments & online practice tests.</p>
            </div>

            {error && role === 'student' && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-xs font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Student Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com" 
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-100/70 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-11 py-3 rounded-2xl bg-gray-100/70 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <OriginButton 
                  type="submit" 
                  className="w-full bg-[var(--color-primary)] !text-white border-none rounded-2xl h-12 font-bold text-sm shadow-md shadow-red-200"
                  fillClassName="bg-[#01274C]"
                >
                  SIGN IN <ArrowRight className="w-4 h-4" />
                </OriginButton>
              </div>
            </form>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            © YashEdu Academy • Student Portal
          </div>
        </div>


        {/* --- PARENT FORM CONTAINER (RIGHT SIDE) --- */}
        <div 
          className={`w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex-col justify-between bg-white transition-opacity duration-300 ${
            !isStudent ? 'flex opacity-100 pointer-events-auto z-10' : 'hidden md:flex opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto z-0'
          }`}
        >
          <div>
            {/* Header / Mobile Switch Button */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md shadow-blue-200 uppercase tracking-wider">
                <Users className="w-4 h-4 text-white" />
                <span>Parent Portal</span>
              </div>

              {/* Mobile Role Badge */}
              <button 
                type="button"
                onClick={() => setRole(isStudent ? 'parent' : 'student')}
                className="md:hidden text-xs font-bold text-[var(--color-primary)] bg-red-50 px-3 py-1.5 rounded-full border border-red-100"
              >
                Switch to {isStudent ? 'Parent' : 'Student'}
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-black text-gray-900 mb-1">Sign In</h2>
              <p className="text-sm text-gray-500">Monitor child performance, attendance & fee history.</p>
            </div>

            {error && !isStudent && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-xs font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Parent Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com" 
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-100/70 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-11 py-3 rounded-2xl bg-gray-100/70 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <OriginButton 
                  type="submit" 
                  className="w-full bg-[var(--color-primary)] !text-white border-none rounded-2xl h-12 font-bold text-sm shadow-md shadow-red-200"
                  fillClassName="bg-[#01274C]"
                >
                  SIGN IN <ArrowRight className="w-4 h-4" />
                </OriginButton>
              </div>
            </form>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            © YashEdu Academy • Parent Portal
          </div>
        </div>


        {/* --- DYNAMIC SLIDING CURVED COLORED OVERLAY PANEL (DESKTOP) --- */}
        <motion.div
          initial={false}
          animate={{
            x: isStudent ? '100%' : '0%',
            borderTopLeftRadius: isStudent ? '110px' : '0px',
            borderBottomLeftRadius: isStudent ? '110px' : '0px',
            borderTopRightRadius: isStudent ? '0px' : '110px',
            borderBottomRightRadius: isStudent ? '0px' : '110px',
          }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          className="hidden md:flex absolute top-0 bottom-0 left-0 w-1/2 h-full z-30 bg-gradient-to-br from-[#D3010A] via-[#B50108] to-[#01274C] p-10 flex-col justify-between text-white shadow-2xl overflow-hidden pointer-events-auto"
        >
          {/* Background Decorative Blur Accents */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 pt-4">
            <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-8 border border-white/30">
              YashEdu Academy
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-start"
              >
                <h3 className="text-3xl font-black leading-tight mb-4">
                  {isStudent ? 'Parent Portal' : 'Student Portal'}
                </h3>
                <p className="text-white/85 text-sm leading-relaxed mb-8 max-w-xs">
                  {isStudent
                    ? 'Track your child’s weekly progress, report cards, test scores, and attendance in real time.'
                    : 'Access interactive video lessons, homework assignments, and practice mock tests.'}
                </p>

                <button
                  type="button"
                  onClick={() => setRole(isStudent ? 'parent' : 'student')}
                  className="px-7 py-3 bg-white/15 hover:bg-white/30 border-2 border-white text-white font-extrabold rounded-full transition-all backdrop-blur-md text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
                >
                  {isStudent ? 'LOGIN AS PARENT' : 'LOGIN AS STUDENT'}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 border-t border-white/20 pt-5">
            <p className="text-[11px] text-white/70 leading-normal">
              Learn Without Limits • Empowering students and parents through real-time academic insights.
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};
