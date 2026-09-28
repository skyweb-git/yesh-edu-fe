import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, User, Users, GraduationCap, Eye, EyeOff, Calendar, Phone, Activity } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

import logoImg from '../images/Untitled design.png';

import { API_BASE_URL } from '../config/api';

export const Register = () => {
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let uid = '';
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-in-use') {
          try {
            const signinRes = await signInWithEmailAndPassword(auth, email, password);
            uid = signinRes.user.uid;
          } catch (loginErr: any) {
            throw new Error('This email address is already registered. Please enter the correct password for this email to link your ' + role + ' account.');
          }
        } else {
          throw authErr;
        }
      }
      
      let finalStudentId = studentId.trim();
      if (role === 'student') {
        finalStudentId = `YEDU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const finalFullName = role === 'parent' ? (fullName.trim() || 'Parent Account') : fullName;

      // Save user to backend database
      try {
        await fetch(`${API_BASE_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: uid,
            fullName: finalFullName,
            email,
            role,
            studentId: finalStudentId,
            age,
            dob,
            gender,
            phone,
            status: 'Unpaid'
          })
        });

        // Call backend to get JWT
        const authRes = await fetch(`${API_BASE_URL}/api/auth/login`, {

          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            role,
            firebaseUid: uid,
            fullName: finalFullName
          })
        });
        
        if (authRes.ok) {
          const authData = await authRes.json();
          localStorage.setItem('token', authData.token);
          localStorage.setItem('userId', authData.user.id);
        }

      } catch(err) {
        console.error('Failed to save user to backend', err);
      }

      // Save role to localStorage to use on login or remember across sessions
      localStorage.setItem('userRole', role);
      localStorage.setItem('userFullName', finalFullName);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userAge', age);
      localStorage.setItem('userDob', dob);
      localStorage.setItem('userGender', gender);
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('userStudentId', finalStudentId);

      navigate(`/dashboard/${role}`, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
    }
  };

  const roleOptions = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'parent', label: 'Parent', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 xl:p-24 bg-white relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2">
          <img src={logoImg} alt="YashEdu Logo" className="h-12 w-auto object-contain" />
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-500 mb-8">Join YashEdu today and start learning.</p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRole(option.id)}
                      className={`flex items-center justify-center gap-2 p-3 border rounded-xl font-medium transition-all ${
                        role === option.id 
                          ? 'border-[var(--color-primary)] bg-red-50 text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {role !== 'parent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {role === 'parent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Child's Student ID</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. YEDU-2026-8902" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-mono"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter your child's YashEdu Student ID to automatically link their academic profile to your parent account.</p>
              </div>
            )}

            {role !== 'parent' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="number" 
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="17" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="date" 
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-gray-600"
                  />
                </div>
              </div>
              </div>
            )}

            <div className={role !== 'parent' ? "grid grid-cols-2 gap-4" : ""}>
              {role !== 'parent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select 
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all appearance-none bg-white text-gray-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors text-lg mt-8 shadow-lg shadow-red-200">
              Create Account <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-bold text-[var(--color-primary)] hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Students learning" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex flex-col justify-end p-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="inline-block px-4 py-1 bg-[var(--color-primary)] text-white rounded-full text-sm font-bold mb-6">
              Join the Community
            </span>
            <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
              Start your learning<br/>journey today.
            </h1>
            <p className="text-xl text-gray-300 max-w-lg">
              Create an account and get access to the best courses and mentors in the industry.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
