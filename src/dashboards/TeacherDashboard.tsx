import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Users, Video, FileText, CheckSquare, 
  BarChart, MessageSquare, Settings, LogOut, Plus,
  MoreVertical, Calendar, DollarSign
} from 'lucide-react';
import logoImg from '../images/Untitled design.png';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-[var(--color-primary)] text-white shadow-md' 
        : 'text-gray-600 hover:bg-red-50 hover:text-[var(--color-primary)]'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

export const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto pb-4">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Link to="/dashboard/teacher" onClick={() => setActiveTab('Overview')}>
              <img src={logoImg} alt="YashEdu Logo" className="h-12 w-auto object-contain bg-white/10 p-1 rounded-lg" />
            </Link>
            <span className="text-xs text-gray-400 font-normal border border-gray-700 px-1.5 py-0.5 rounded">Teacher</span>
          </div>
          
          <nav className="flex flex-col gap-2">
            <SidebarItem icon={BarChart} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
            <SidebarItem icon={Video} label="Live Classes" active={activeTab === 'Live Classes'} onClick={() => setActiveTab('Live Classes')} />
            <SidebarItem icon={BookOpen} label="My Courses" active={activeTab === 'My Courses'} onClick={() => setActiveTab('My Courses')} />
            <SidebarItem icon={Users} label="Students" active={activeTab === 'Students'} onClick={() => setActiveTab('Students')} />
            <SidebarItem icon={FileText} label="Assignments" active={activeTab === 'Assignments'} onClick={() => setActiveTab('Assignments')} />
            <SidebarItem icon={CheckSquare} label="Exams & Grading" active={activeTab === 'Exams'} onClick={() => setActiveTab('Exams')} />
            <SidebarItem icon={MessageSquare} label="Messages" active={activeTab === 'Messages'} onClick={() => setActiveTab('Messages')} />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-800">
          <nav className="flex flex-col gap-2">

            <Link to="/" onClick={() => localStorage.clear()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-white/5 transition-all font-medium mt-2">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Create Class
            </button>
            <img src="https://i.pravatar.cc/150?img=33" alt="Teacher Profile" className="w-10 h-10 rounded-full border border-gray-200 ml-4 cursor-pointer" />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Students</h3>
                  <p className="text-3xl font-bold text-gray-900">1,248</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-50 text-[var(--color-primary)] rounded-xl flex items-center justify-center"><Video className="w-6 h-6" /></div>
                    <span className="text-sm font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">Today</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Live Classes Today</h3>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><CheckSquare className="w-6 h-6" /></div>
                    <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">15 Pending</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Assignments to Grade</h3>
                  <p className="text-3xl font-bold text-gray-900">45</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+8%</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Monthly Revenue</h3>
                  <p className="text-3xl font-bold text-gray-900">$4,250</p>
                </div>
              </div>

              {/* Main Widgets */}
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Schedule & Live Classes */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Upcoming Live Classes</h3>
                    <button className="text-[var(--color-primary)] font-medium text-sm">View Calendar</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50/30">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm text-center min-w-[70px]">
                          <p className="text-xs font-bold text-red-500 uppercase">Live Now</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">React State Management Deep Dive</h4>
                          <p className="text-sm text-gray-500">Batch A • 45 Students Waiting</p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors shadow-sm shadow-red-200 flex items-center gap-2">
                        <Video className="w-4 h-4" /> Join 
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center min-w-[70px]">
                          <p className="text-xs text-gray-500 uppercase">02:00 PM</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Next.js App Router Basics</h4>
                          <p className="text-sm text-gray-500">Batch B • 32 Students Enrolled</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Start Class
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="space-y-8">
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-[var(--color-primary)] transition-colors border border-transparent hover:border-red-100 gap-2 text-gray-700">
                        <FileText className="w-6 h-6" />
                        <span className="text-xs font-bold text-center">Add Notes</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-[var(--color-primary)] transition-colors border border-transparent hover:border-red-100 gap-2 text-gray-700">
                        <CheckSquare className="w-6 h-6" />
                        <span className="text-xs font-bold text-center">Create Quiz</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-[var(--color-primary)] transition-colors border border-transparent hover:border-red-100 gap-2 text-gray-700">
                        <Users className="w-6 h-6" />
                        <span className="text-xs font-bold text-center">Attendance</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-[var(--color-primary)] transition-colors border border-transparent hover:border-red-100 gap-2 text-gray-700">
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-xs font-bold text-center">Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'Overview' && (
             <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTab} Module</h2>
                <p className="text-gray-500">Full functionality coming in Phase 2.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
