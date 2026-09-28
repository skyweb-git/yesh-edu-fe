import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import {
  BookOpen, Calendar, Clock, Trophy, Target, PlayCircle,
  FileText, CheckCircle, Bell, Settings, LogOut, ChevronRight,
  TrendingUp, Award, User, MessageSquare, Menu, X, Download, Send, Camera, Upload, RefreshCw
} from 'lucide-react';
import logoImg from '../images/Untitled design.png';
import { ProgressiveFluxLoader } from '../components/ProgressiveFluxLoader';
import { API_BASE_URL } from '../config/api';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
        ? 'bg-[var(--color-primary)] text-white shadow-md'
        : 'text-stone-700 hover:bg-amber-100/50 hover:text-[var(--color-primary)]'
      }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ icon: Icon, label, value, trend, trendUp }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-[var(--color-primary)]'}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
    </div>
    <div className={`ml-auto text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
      {trend}
    </div>
  </div>
);

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Assignments');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: localStorage.getItem('userFullName') || 'Alex Johnson',
    age: localStorage.getItem('userAge') ? `${localStorage.getItem('userAge')} Years` : '17 Years',
    dob: localStorage.getItem('userDob') || '2009-03-15',
    gender: localStorage.getItem('userGender') || 'Male',
    email: localStorage.getItem('userEmail') || 'alex.j@example.com',
    phone: localStorage.getItem('userPhone') || '+1 (555) 123-4567'
  });
  const [editData, setEditData] = useState(profileData);
  const [studentId, setStudentId] = useState(localStorage.getItem('userStudentId') || 'Pending ID');
  const [studentMessageInput, setStudentMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [practiceTests, setPracticeTests] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [activeTest, setActiveTest] = useState<any | null>(null);
  const [testAnswers, setTestAnswers] = useState<{ [qIndex: number]: number }>({});
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [testResultModal, setTestResultModal] = useState<any | null>(null);
  const [performanceScores, setPerformanceScores] = useState<any>({
    Mathematics: 0,
    Physics: 0,
    Chemistry: 0,
    Biology: 0,
    English: 0
  });
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeUserId = localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'student_guest';
  const adminTeacherId = "60c72b2f9b1d8b001c8e4a99"; // Default Admin/Teacher ID

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      fetch(`${API_BASE_URL}/api/users?email=${encodeURIComponent(email)}&role=student`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const user = data[0];
            if (user.studentId) setStudentId(user.studentId);
            if (user._id) localStorage.setItem('userId', user._id);

            if (user.performanceScores) {
              setPerformanceScores(user.performanceScores);
            }

            const updatedProfile = {
              fullName: user.fullName || profileData.fullName,
              age: user.age ? `${user.age} Years` : profileData.age,
              dob: user.dob || profileData.dob,
              gender: user.gender || profileData.gender,
              email: user.email || profileData.email,
              phone: user.phone || profileData.phone
            };
            setProfileData(updatedProfile);
            setEditData(updatedProfile);
          }
        })
        .catch(err => console.error("Error fetching student profile:", err));
    }

    // Fetch assignments
    fetch(`${API_BASE_URL}/api/assignments`)
      .then(res => res.json())
      .then(data => {
        setAssignments(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching assignments:", err));

    // Fetch practice tests
    fetch(`${API_BASE_URL}/api/tests/student`)
      .then(res => res.json())
      .then(data => {
        setPracticeTests(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching practice tests:", err));

    // Fetch existing student submissions & test attempts
    const currentStudentId = localStorage.getItem('userId');
    if (currentStudentId) {
      fetch(`${API_BASE_URL}/api/assignments/submissions/student/${currentStudentId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSubmissions(data);
        })
        .catch(err => console.error("Error fetching submissions:", err));

      fetch(`${API_BASE_URL}/api/tests/results/student/${currentStudentId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTestResults(data);
        })
        .catch(err => console.error("Error fetching test results:", err));
    }

    // Connect Socket
    const newSocket = io(API_BASE_URL, {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 3,
      timeout: 5000
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', activeUserId);
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connection unavailable or delayed:', err.message);
    });

    newSocket.on('receiveMessage', (msg) => {
      setChatMessages(prev => {
        // Prevent duplicate addition if already added optimistically
        if (prev.some(m => m.content === msg.content && (m._id === msg._id || Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 2000))) {
          return prev;
        }
        return [...prev, msg];
      });
      scrollToBottom();
    });

    // Fetch chat history
    fetch(`${API_BASE_URL}/api/chat/between/${activeUserId}/${adminTeacherId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setChatMessages(data);
        scrollToBottom();
      })
      .catch(err => console.error("Error fetching chat:", err));

    return () => {
      newSocket.off('connect');
      newSocket.off('connect_error');
      newSocket.off('receiveMessage');
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEditClick = () => {
    setEditData(profileData);
    setIsEditingProfile(true);
  };

  const handleSaveClick = () => {
    setProfileData(editData);
    setIsEditingProfile(false);
    // Optionally save edits back to localStorage
    localStorage.setItem('userFullName', editData.fullName);
    localStorage.setItem('userAge', editData.age.replace(' Years', ''));
    localStorage.setItem('userDob', editData.dob);
    localStorage.setItem('userGender', editData.gender);
    localStorage.setItem('userEmail', editData.email);
    localStorage.setItem('userPhone', editData.phone);
  };

  const handleSendMessage = async () => {
    const text = studentMessageInput.trim();
    if (!text) return;

    const senderId = localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'student_guest';
    const newMsg = {
      senderId,
      receiverId: adminTeacherId,
      content: text,
      createdAt: new Date().toISOString()
    };

    // Immediate optimistic UI update
    setChatMessages(prev => [...prev, newMsg]);
    setStudentMessageInput('');
    scrollToBottom();

    if (socket) {
      socket.emit('sendPrivateMessage', {
        senderId,
        receiverId: adminTeacherId,
        content: text
      });
    }

    try {
      await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId,
          receiverId: adminTeacherId,
          content: text
        })
      });
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  };

  const handleAssignmentPhotoUpload = async (assignmentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const existingSubmission = submissions.find(s => {
      const aId = (s.assignmentId && typeof s.assignmentId === 'object') ? (s.assignmentId._id || s.assignmentId.id) : s.assignmentId;
      return aId?.toString() === assignmentId?.toString();
    });

    let rawExisting: any[] = [];
    if (existingSubmission) {
      if (Array.isArray(existingSubmission.photos) && existingSubmission.photos.length > 0) {
        rawExisting = existingSubmission.photos;
      } else if (existingSubmission.fileUrl) {
        rawExisting = [{ fileUrl: existingSubmission.fileUrl, fileName: existingSubmission.fileName }];
      }
    }
    const existingPhotos = rawExisting.map(p => ({ fileUrl: p.fileUrl, fileName: p.fileName }));

    const existingCount = existingPhotos.length;
    if (existingCount >= 6) {
      alert('You have reached the maximum limit of 6 uploaded photos for this assignment.');
      event.target.value = '';
      return;
    }

    const availableSlots = 6 - existingCount;
    const filesToUpload = selectedFiles.slice(0, availableSlots);

    if (selectedFiles.length > availableSlots) {
      alert(`Maximum 6 photos allowed per assignment. Only the first ${availableSlots} photo(s) will be uploaded.`);
    }

    setUploadingAssignmentId(assignmentId);
    setUploadProgress(10);
    const userEmail = localStorage.getItem('userEmail') || '';

    try {
      setUploadProgress(25);
      let completedCount = 0;
      const uploadPromises = filesToUpload.map(file => new Promise<{ fileUrl: string; fileName: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (e) => {
          try {
            const dataUrl = e.target?.result as string;
            setUploadProgress(prev => Math.min(75, prev + 15));
            const uploadRes = await fetch(`${API_BASE_URL}/api/upload-pdf`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'user-email': userEmail },
              body: JSON.stringify({ fileData: dataUrl, fileName: file.name })
            });
            if (!uploadRes.ok) throw new Error('Upload failed');
            const data = await uploadRes.json();
            completedCount++;
            setUploadProgress(75 + Math.round((completedCount / filesToUpload.length) * 15));
            resolve({ fileUrl: data.fileUrl, fileName: data.fileName });
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
      }));

      const uploadedResults = await Promise.all(uploadPromises);
      const finalPhotosList = [...existingPhotos, ...uploadedResults].slice(0, 6);

      setUploadProgress(90);
      const sId = localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'guest_student';
      const submitRes = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'user-email': userEmail },
        body: JSON.stringify({
          studentId: sId,
          photos: finalPhotosList,
          fileUrl: finalPhotosList[0]?.fileUrl,
          fileName: finalPhotosList[0]?.fileName
        })
      });

      if (!submitRes.ok) {
        const errData = await submitRes.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to save submission record');
      }

      const newSubmission = await submitRes.json();

      setSubmissions(prev => {
        const filtered = prev.filter(sub => {
          const aId = (sub.assignmentId && typeof sub.assignmentId === 'object') ? (sub.assignmentId._id || sub.assignmentId.id) : sub.assignmentId;
          return aId?.toString() !== assignmentId?.toString();
        });
        return [...filtered, newSubmission];
      });

      setUploadProgress(100);
      alert(`Successfully uploaded ${uploadedResults.length} photo(s)! Total photos: ${finalPhotosList.length}/6.`);
    } catch (err: any) {
      console.error('Error uploading assignment photos:', err);
      alert(`Upload error: ${err.message || 'Failed to upload photo'}`);
    } finally {
      setUploadingAssignmentId(null);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  const handleDeleteAssignmentPhoto = async (assignmentId: string, photoUrl: string) => {
    if (!confirm('Are you sure you want to remove this photo?')) return;
    try {
      const sId = localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'guest_student';
      const res = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/delete-photo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: sId, photoUrl })
      });
      if (res.ok) {
        const updatedSubmission = await res.json();
        setSubmissions(prev => prev.map(s => (s.assignmentId?._id || s.assignmentId) === assignmentId ? updatedSubmission : s));
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  const handleStartTest = (test: any) => {
    setActiveTest(test);
    setTestAnswers({});
  };

  const handleSelectTestOption = (qIndex: number, optIndex: number) => {
    setTestAnswers(prev => ({
      ...prev,
      [qIndex]: optIndex
    }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setIsSubmittingTest(true);

    const formattedAnswers = Object.entries(testAnswers).map(([qIndex, optionIndex]) => ({
      questionIndex: Number(qIndex),
      selectedOptionIndex: Number(optionIndex)
    }));

    const sId = localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'guest_student';

    try {
      const res = await fetch(`${API_BASE_URL}/api/tests/${activeTest._id || activeTest.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: sId,
          answers: formattedAnswers
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to submit test');
      }

      const attemptResult = await res.json();
      setTestResults(prev => [...prev, attemptResult]);
      setTestResultModal({
        ...attemptResult,
        testTitle: activeTest.title
      });
      setActiveTest(null);
      setTestAnswers({});
    } catch (err: any) {
      alert(`Submission error: ${err.message || 'Failed to submit test'}`);
    } finally {
      setIsSubmittingTest(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-72 bg-[#FAF6F0] flex flex-col h-screen relative z-50 overflow-y-auto shadow-2xl pb-4"
          >
            <div className="p-6 flex items-center justify-between border-b border-[#EBE3D5]">
              <Link to="/dashboard/student" onClick={() => setActiveTab('Assignments')}>
                <img src={logoImg} alt="YashEdu Logo" className="h-12 w-auto object-contain" />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-amber-100/50 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <nav className="flex flex-col gap-2">
                <SidebarItem icon={FileText} label="Assignments" active={activeTab === 'Assignments'} onClick={() => { setActiveTab('Assignments'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={CheckCircle} label="Practice Tests" active={activeTab === 'Practice Tests'} onClick={() => { setActiveTab('Practice Tests'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={MessageSquare} label="Message Teacher" active={activeTab === 'Message Teacher'} onClick={() => { setActiveTab('Message Teacher'); setIsMobileMenuOpen(false); }} />
              </nav>
            </div>

            <div className="mt-auto p-4 border-t border-[#EBE3D5] bg-[#F3ECE0]/40">
              <nav className="flex flex-col gap-2">
                <SidebarItem icon={User} label="Profile" active={activeTab === 'Profile'} onClick={() => { setActiveTab('Profile'); setIsMobileMenuOpen(false); }} />
                <Link to="/" onClick={() => localStorage.clear()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-100/50 transition-all font-medium mt-2">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Link>
              </nav>
            </div>
          </motion.aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#FAF6F0] border-r border-[#EBE3D5] hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto pb-4">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Link to="/dashboard/student" onClick={() => setActiveTab('Assignments')}>
              <img src={logoImg} alt="YashEdu Logo" className="h-12 w-auto object-contain" />
            </Link>
            <span className="text-xs text-stone-500 font-normal border border-stone-300/60 bg-[#F3ECE0] px-1.5 py-0.5 rounded">Student</span>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem icon={FileText} label="Assignments" active={activeTab === 'Assignments'} onClick={() => setActiveTab('Assignments')} />
            <SidebarItem icon={CheckCircle} label="Practice Tests" active={activeTab === 'Practice Tests'} onClick={() => setActiveTab('Practice Tests')} />
            <SidebarItem icon={MessageSquare} label="Message Teacher" active={activeTab === 'Message Teacher'} onClick={() => setActiveTab('Message Teacher')} />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-[#EBE3D5]">
          <nav className="flex flex-col gap-2">
            <SidebarItem icon={User} label="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
            <Link to="/" onClick={() => localStorage.clear()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-100/50 transition-all font-medium mt-2">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{profileData.fullName}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">


          {activeTab === 'Profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-red-100 to-red-50"></div>
                <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-12 sm:pt-0">
                  <div className="flex-1 text-center sm:text-left mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">{profileData.fullName}</h2>
                    <p className="text-gray-500 font-medium">Student • {studentId}</p>
                  </div>
                  {!isEditingProfile ? (
                    <button onClick={handleEditClick} className="px-6 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors">
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => setIsEditingProfile(false)} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSaveClick} className="px-6 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors">
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                {isEditingProfile ? (
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                          <input type="text" value={editData.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)]" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Age</label>
                          <input type="text" value={editData.age} onChange={(e) => setEditData({ ...editData, age: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)]" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
                          <input type="date" value={editData.dob} onChange={(e) => setEditData({ ...editData, dob: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)]" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Gender</label>
                          <select value={editData.gender} onChange={(e) => setEditData({ ...editData, gender: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Contact & Academic</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                          <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)]" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                          <input type="tel" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-primary)]" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Enrollment ID</label>
                          <input type="text" value={studentId} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Joined Date</label>
                          <input type="text" defaultValue="12 August 2023" disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between pb-4 border-b border-gray-50">
                          <span className="text-gray-500">Full Name</span>
                          <span className="font-medium text-gray-900">{profileData.fullName}</span>
                        </div>
                        <div className="flex justify-between pb-4 border-b border-gray-50">
                          <span className="text-gray-500">Age</span>
                          <span className="font-medium text-gray-900">{profileData.age}</span>
                        </div>
                        <div className="flex justify-between pb-4 border-b border-gray-50">
                          <span className="text-gray-500">Date of Birth</span>
                          <span className="font-medium text-gray-900">{profileData.dob}</span>
                        </div>
                        <div className="flex justify-between pb-4 border-b border-gray-50">
                          <span className="text-gray-500">Gender</span>
                          <span className="font-medium text-gray-900">{profileData.gender}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Contact & Academic</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between pb-4 border-b border-gray-50">
                          <span className="text-gray-500">Email Address</span>
                          <span className="font-medium text-gray-900">{profileData.email}</span>
                        </div>
                        <div className="flex justify-between pb-4 border-b border-gray-50">
                          <span className="text-gray-500">Phone Number</span>
                          <span className="font-medium text-gray-900">{profileData.phone}</span>
                        </div>
                        <div className="flex justify-between pb-4 border-b border-gray-50">
                          <span className="text-gray-500">Enrollment ID</span>
                          <span className="font-medium text-gray-900">{studentId}</span>
                        </div>
                        <div className="flex justify-between pb-4 border-b border-gray-50">
                          <span className="text-gray-500">Joined Date</span>
                          <span className="font-medium text-gray-900">12 August 2023</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Message Teacher' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-red-100 to-red-50"></div>
                <div className="relative flex flex-col items-center pt-8">
                  <div className="w-16 h-16 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold mb-4 shadow-md">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Message a Teacher</h2>
                  <p className="text-gray-500 font-medium text-center max-w-lg">
                    Have a question about an assignment or need extra help? Send a direct message to your instructors here.
                  </p>
                </div>

                <div className="mt-8 space-y-6">

                  <div className="bg-gray-50 rounded-2xl p-4 h-[400px] overflow-y-auto flex flex-col gap-4 border border-gray-100">
                    {chatMessages.length === 0 ? (
                      <div className="m-auto text-gray-400 text-sm text-center">No messages yet.<br />Send a message to start the conversation!</div>
                    ) : (
                      chatMessages.map((msg, i) => {
                        const isMe = msg.senderId === activeUserId || msg.senderId === localStorage.getItem('userEmail') || msg.senderId === localStorage.getItem('userId');
                        return (
                          <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${isMe ? 'bg-[var(--color-primary)] text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                              {msg.content}
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex items-end gap-2 mt-4">
                    <textarea
                      rows={2}
                      value={studentMessageInput}
                      onChange={(e) => setStudentMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message here..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white text-gray-900 font-medium resize-none"
                    ></textarea>
                    <button
                      onClick={handleSendMessage}
                      disabled={!studentMessageInput.trim()}
                      className="px-6 py-3 h-[60px] bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Assignments' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Assignments</h2>
                  <p className="text-sm text-gray-500">Download and complete your assigned tasks</p>
                </div>
              </div>

              {assignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignments.map((assignment) => {
                    const assignId = assignment._id || assignment.id;
                    const submission = submissions.find(s => {
                      const aId = (s.assignmentId && typeof s.assignmentId === 'object') ? (s.assignmentId._id || s.assignmentId.id) : s.assignmentId;
                      return aId?.toString() === assignId?.toString();
                    });
                    const isUploading = uploadingAssignmentId === assignId;

                    const photosList: any[] = submission?.photos && submission.photos.length > 0
                      ? submission.photos
                      : (submission?.fileUrl ? [{ fileUrl: submission.fileUrl, fileName: submission.fileName }] : []);
                    const photoCount = photosList.length;

                    return (
                      <div key={assignId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col transition-all hover:shadow-md hover:border-red-200 group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-red-50 text-[var(--color-primary)] rounded-xl flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          {photoCount > 0 ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Submitted ({photoCount}/6)
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">New</span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{assignment.title}</h3>
                        {assignment.description && (
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{assignment.description}</p>
                        )}

                        {/* List of uploaded photos (Max 6) */}
                        {photoCount > 0 && (
                          <div className="mb-4 space-y-2">
                            <p className="text-xs font-bold text-gray-700 flex justify-between items-center">
                              <span>Uploaded Photos ({photoCount}/6):</span>
                              <span className="text-[10px] text-gray-400 font-normal">Max 6 photos</span>
                            </p>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                              {photosList.map((photo: any, pIdx: number) => (
                                <div key={pIdx} className="p-2 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between text-xs text-green-800">
                                  <span className="font-semibold truncate max-w-[130px]" title={photo.fileName || `Photo ${pIdx + 1}`}>
                                    Photo {pIdx + 1}: {photo.fileName || 'Solution.jpg'}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={photo.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-bold underline text-green-700 hover:text-green-900 flex items-center gap-1 text-[11px]"
                                    >
                                      <Camera className="w-3 h-3" /> View
                                    </a>
                                    <button
                                      onClick={() => handleDeleteAssignmentPhoto(assignId, photo.fileUrl)}
                                      className="w-4 h-4 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center font-bold text-[10px]"
                                      title="Remove photo"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {isUploading && (
                          <div className="mt-4 p-4 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-800 shadow-inner">
                            <ProgressiveFluxLoader
                              value={uploadProgress}
                              showLabel={true}
                              textClassName="text-sm font-bold text-white mb-2"
                              barClassName="h-3 bg-slate-800"
                              phases={[
                                { at: 0, label: "Preparing upload..." },
                                { at: 30, label: "Uploading assignment..." },
                                { at: 75, label: "Processing solution..." },
                                { at: 95, label: "Finalizing submission..." },
                                { at: 100, label: "Upload complete!" },
                              ]}
                            />
                          </div>
                        )}

                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Upload Photo Button (Disabled if 6 photos reached) */}
                            {photoCount >= 6 ? (
                              <span className="px-3 py-1.5 bg-gray-100 text-gray-400 font-bold rounded-xl text-xs flex items-center gap-1 cursor-not-allowed">
                                <Camera className="w-3.5 h-3.5" /> 6/6 Max Limit
                              </span>
                            ) : (
                              <label className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer flex items-center gap-1.5">
                                {isUploading ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                                ) : (
                                  <Camera className="w-3.5 h-3.5" />
                                )}
                                <span>{isUploading ? 'Uploading...' : photoCount > 0 ? `+ Add Photo (${photoCount}/6)` : 'Upload Photo'}</span>
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  multiple
                                  onChange={(e) => handleAssignmentPhotoUpload(assignId, e)}
                                  className="hidden"
                                  disabled={isUploading}
                                />
                              </label>
                            )}

                            {/* Download Original Assignment PDF */}
                            {assignment.fileUrl && (
                              <a
                                href={assignment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Download Assignment PDF"
                                className="w-8 h-8 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-gray-500 bg-white rounded-3xl border border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No active assignments</h3>
                  <p className="text-gray-500 max-w-md text-center">You're all caught up! Check back later for new assignments from your teachers.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Practice Tests' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Practice Tests & Mock Exams</h2>
                  <p className="text-sm text-gray-500">Sharpen your knowledge with timed tests and auto-graded MCQs</p>
                </div>
                <button
                  onClick={() => {
                    fetch(`${API_BASE_URL}/api/tests/student`)
                      .then(res => res.json())
                      .then(data => setPracticeTests(Array.isArray(data) ? data : []));
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Tests
                </button>
              </div>

              {practiceTests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {practiceTests.map((test) => {
                    const testId = test._id || test.id;
                    const attempt = testResults.find(r => (r.testId?._id || r.testId) === testId);
                    const qCount = (test.questions && Array.isArray(test.questions)) ? test.questions.length : 0;

                    return (
                      <div key={testId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col transition-all hover:shadow-md hover:border-red-200 group">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-red-50 text-[var(--color-primary)] font-extrabold text-xs rounded-full uppercase tracking-wider">
                            {test.subject || 'General'}
                          </span>
                          {attempt ? (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Completed
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Available</span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{test.title}</h3>
                        {test.description && (
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{test.description}</p>
                        )}

                        <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 font-medium">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{test.durationMinutes || 30} Mins</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3.5 h-3.5 text-gray-400" />
                            <span>{qCount} Questions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5 text-gray-400" />
                            <span>Pass: {test.passingScore || 50}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-gray-400" />
                            <span>Marks/Q: {test.marksPerQuestion || 1}</span>
                          </div>
                        </div>

                        {/* If student attempted test, show score badge */}
                        {attempt && (
                          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex justify-between items-center font-bold">
                            <span>Score: {attempt.score} / {qCount * (test.marksPerQuestion || 1)} ({attempt.percentage}%)</span>
                            <span className={attempt.percentage >= (test.passingScore || 50) ? 'text-emerald-700' : 'text-red-600'}>
                              {attempt.percentage >= (test.passingScore || 50) ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                            </span>
                          </div>
                        )}

                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                          {attempt ? (
                            <button
                              onClick={() => setTestResultModal({ ...attempt, testTitle: test.title })}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                            >
                              View Result
                            </button>
                          ) : qCount > 0 ? (
                            <button
                              onClick={() => handleStartTest(test)}
                              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
                            >
                              <PlayCircle className="w-4 h-4" /> Start Test
                            </button>
                          ) : (
                            <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 font-bold rounded-xl text-xs cursor-not-allowed">
                              No Questions
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-gray-500 bg-white rounded-3xl border border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No practice tests available</h3>
                  <p className="text-gray-500 max-w-md text-center">New practice tests uploaded by teachers will appear here automatically.</p>
                </div>
              )}

              {/* Active Practice Test Exam Modal */}
              {activeTest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                  <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                      <div>
                        <span className="px-3 py-1 bg-red-50 text-[var(--color-primary)] rounded-full text-xs font-bold uppercase tracking-wider">
                          {activeTest.subject || 'Practice Test'}
                        </span>
                        <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{activeTest.title}</h3>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Cancel test execution? Progress will be lost.')) setActiveTest(null);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {activeTest.questions && activeTest.questions.map((q: any, qIdx: number) => (
                        <div key={qIdx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                          <p className="font-bold text-gray-900 text-base mb-4">
                            Q{qIdx + 1}. {q.questionText}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options && q.options.map((opt: string, oIdx: number) => {
                              const isSelected = testAnswers[qIdx] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleSelectTestOption(qIdx, oIdx)}
                                  className={`p-3 rounded-xl border text-left font-medium transition-all text-sm flex items-center justify-between ${isSelected
                                      ? 'bg-red-50 border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-gray-300'}`}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500">
                        Answered: {Object.keys(testAnswers).length} / {activeTest.questions?.length || 0}
                      </span>
                      <button
                        onClick={handleSubmitTest}
                        disabled={isSubmittingTest}
                        className="px-6 py-3 bg-[var(--color-primary)] hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
                      >
                        {isSubmittingTest ? 'Submitting...' : 'Submit Answers'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Test Result Summary Modal */}
              {testResultModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center border border-gray-100">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{testResultModal.testTitle || 'Test Completed!'}</h3>
                    <p className="text-sm text-gray-500 mb-6">Your answers have been evaluated and recorded.</p>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 mb-6">
                      <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                        <span>Total Score:</span>
                        <span className="text-gray-900">{testResultModal.score} Marks</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                        <span>Percentage:</span>
                        <span className="text-emerald-600">{testResultModal.percentage}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Correct: {testResultModal.correctCount}</span>
                        <span>Incorrect: {testResultModal.wrongCount}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setTestResultModal(null)}
                      className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md"
                    >
                      Close Result
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab !== 'Profile' && activeTab !== 'Message Teacher' && activeTab !== 'Assignments' && activeTab !== 'Practice Tests' && (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTab}</h2>
                <p className="text-gray-500">This module is under development.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
