import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Users, Video, FileText, CheckSquare, 
  BarChart, MessageSquare, Settings, LogOut, Search,
  TrendingUp, CreditCard, ShieldCheck, Database, RefreshCw,
  CheckCircle, Clock, AlertCircle, DollarSign, Download, Filter
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-purple-600 text-white shadow-md' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-purple-400'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  // Financial & Fee Management state
  const [feeSummary, setFeeSummary] = useState<any>({
    totalRevenue: 0,
    totalCollected: 0,
    totalPending: 0,
    paidCount: 0,
    pendingCount: 0,
    paymentsCount: 0
  });
  const [studentFees, setStudentFees] = useState<any[]>([]);
  const [loadingFees, setLoadingFees] = useState<boolean>(false);
  const [feeSearchQuery, setFeeSearchQuery] = useState<string>('');
  const [feeFilterStatus, setFeeFilterStatus] = useState<string>('ALL');

  const fetchFeeData = async () => {
    setLoadingFees(true);
    const token = localStorage.getItem('token') || '';
    const userEmail = localStorage.getItem('userEmail') || '';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userEmail) headers['user-email'] = userEmail;

    try {
      const [sumRes, statusRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/fees/summary`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/api/fees/all-status`, { headers }).catch(() => null)
      ]);

      if (sumRes && sumRes.ok) {
        const sumData = await sumRes.json();
        setFeeSummary(sumData);
      }

      if (statusRes && statusRes.ok) {
        const statusData = await statusRes.json();
        setStudentFees(Array.isArray(statusData) ? statusData : []);
      }
    } catch (err) {
      console.error('Error fetching fee management data:', err);
    } finally {
      setLoadingFees(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Fees' || activeTab === 'Reports' || activeTab === 'Overview') {
      fetchFeeData();
    }
  }, [activeTab]);

  const handleConfirmCash = async (paymentId: string) => {
    if (!paymentId) return;
    const token = localStorage.getItem('token') || '';
    const userEmail = localStorage.getItem('userEmail') || '';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userEmail) headers['user-email'] = userEmail;

    try {
      const res = await fetch(`${API_BASE_URL}/api/fees/payments/${paymentId}/confirm-cash`, {
        method: 'POST',
        headers
      });
      if (res.ok) {
        alert('Cash payment confirmed successfully!');
        fetchFeeData();
      } else {
        const err = await res.json();
        alert('Failed to confirm cash payment: ' + (err.message || 'Error'));
      }
    } catch (err) {
      alert('Error confirming cash payment');
    }
  };

  const filteredStudentFees = studentFees.filter((item) => {
    const matchesSearch = 
      item.fullName?.toLowerCase().includes(feeSearchQuery.toLowerCase()) ||
      item.studentId?.toLowerCase().includes(feeSearchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(feeSearchQuery.toLowerCase()) ||
      item.parent?.fullName?.toLowerCase().includes(feeSearchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (feeFilterStatus === 'PAID') return item.isPaid || item.latestPayment?.status === 'PAID';
    if (feeFilterStatus === 'PENDING') return !item.isPaid || item.latestPayment?.status === 'PENDING';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 text-white hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto pb-4">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Yash<span className="text-purple-500">Edu</span>
              <span className="text-xs ml-1 text-gray-500 font-normal border border-gray-700 px-1.5 py-0.5 rounded">Admin</span>
            </span>
          </div>
          
          <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            <nav className="flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-4">Dashboard</p>
              <SidebarItem icon={BarChart} label="Analytics Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
              <SidebarItem icon={TrendingUp} label="Financial Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
              
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-4">Management</p>
              <SidebarItem icon={Users} label="Students" active={activeTab === 'Students'} onClick={() => setActiveTab('Students')} />
              <SidebarItem icon={Users} label="Teachers" active={activeTab === 'Teachers'} onClick={() => setActiveTab('Teachers')} />
              <SidebarItem icon={Users} label="Parents" active={activeTab === 'Parents'} onClick={() => setActiveTab('Parents')} />
              <SidebarItem icon={BookOpen} label="Courses & Tracks" active={activeTab === 'Courses'} onClick={() => setActiveTab('Courses')} />
              <SidebarItem icon={Video} label="Live Classes" active={activeTab === 'Live Classes'} onClick={() => setActiveTab('Live Classes')} />
              <SidebarItem icon={CreditCard} label="Fee Management" active={activeTab === 'Fees'} onClick={() => setActiveTab('Fees')} />

              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-4">System</p>
              <SidebarItem icon={Database} label="CMS & Content" active={activeTab === 'CMS'} onClick={() => setActiveTab('CMS')} />
              <SidebarItem icon={MessageSquare} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
            </nav>
          </div>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-800 bg-gray-950">
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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{activeTab}</h1>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Global Search..." className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 w-64 transition-all outline-none" />
            </div>
            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin Profile" className="w-10 h-10 rounded-full border-2 border-purple-200 cursor-pointer" />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              {/* Top KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-600"><Users className="w-16 h-16" /></div>
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Total Active Students</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{studentFees.length || 52}</p>
                  <span className="text-sm font-bold text-green-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Live Enrolled</span>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-600"><BookOpen className="w-16 h-16" /></div>
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Total Collected Revenue</h3>
                  <p className="text-3xl font-bold text-emerald-600 mb-2">₹{feeSummary.totalCollected?.toLocaleString('en-IN') || '0'}</p>
                  <span className="text-sm font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Real-time Payments</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-600"><Clock className="w-16 h-16" /></div>
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Pending Fees</h3>
                  <p className="text-3xl font-bold text-amber-600 mb-2">₹{feeSummary.totalPending?.toLocaleString('en-IN') || '0'}</p>
                  <span className="text-sm font-bold text-amber-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {feeSummary.pendingCount || 0} Invoices Pending</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-green-600"><CreditCard className="w-16 h-16" /></div>
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Total Gross Revenue</h3>
                  <p className="text-3xl font-bold text-purple-900 mb-2">₹{feeSummary.totalRevenue?.toLocaleString('en-IN') || '0'}</p>
                  <span className="text-sm font-bold text-purple-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Cashfree & Offline</span>
                </div>
              </div>

              {/* Charts & Tables */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue Chart Placeholder */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                    <button onClick={fetchFeeData} className="flex items-center gap-1.5 text-xs text-purple-600 font-bold bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-all">
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingFees ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                  </div>
                  <div className="h-64 w-full flex items-end justify-between gap-2 pt-4">
                    {[40, 55, 45, 70, 65, 85].map((h, i) => (
                      <div key={i} className="w-full bg-purple-100 rounded-t-sm relative group">
                        <div className="absolute bottom-0 w-full bg-purple-500 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap z-10">
                          ₹{(h * 2000).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>

                {/* Recent Registrations */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Live Fee Status</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">{feeSummary.paidCount} Paid</span>
                  </div>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {studentFees.slice(0, 6).map((st, i) => (
                      <div key={i} className="flex items-center gap-3 border-b border-gray-50 pb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                          {st.fullName?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{st.fullName}</p>
                          <p className="text-[11px] text-gray-500">{st.studentId || st.email}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {st.isPaid ? 'PAID' : 'PENDING'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'Fees' || activeTab === 'Reports') && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{feeSummary.totalRevenue?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Total Collected</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">₹{feeSummary.totalCollected?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Total Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">₹{feeSummary.totalPending?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Paid / Pending Students</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{feeSummary.paidCount} / {feeSummary.pendingCount}</p>
                </div>
              </div>

              {/* Table Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={feeSearchQuery}
                    onChange={(e) => setFeeSearchQuery(e.target.value)}
                    placeholder="Search by student, ID, or parent..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setFeeFilterStatus('ALL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${feeFilterStatus === 'ALL' ? 'bg-white text-purple-600 shadow-xs' : 'text-gray-500'}`}
                    >
                      All ({studentFees.length})
                    </button>
                    <button
                      onClick={() => setFeeFilterStatus('PAID')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${feeFilterStatus === 'PAID' ? 'bg-white text-emerald-600 shadow-xs' : 'text-gray-500'}`}
                    >
                      Paid ({feeSummary.paidCount})
                    </button>
                    <button
                      onClick={() => setFeeFilterStatus('PENDING')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${feeFilterStatus === 'PENDING' ? 'bg-white text-amber-600 shadow-xs' : 'text-gray-500'}`}
                    >
                      Pending ({feeSummary.pendingCount})
                    </button>
                  </div>

                  <button
                    onClick={fetchFeeData}
                    className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingFees ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Student Fee Records Table */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Student Info</th>
                        <th className="px-6 py-4">Parent Details</th>
                        <th className="px-6 py-4">Fee Amount</th>
                        <th className="px-6 py-4">Payment Status</th>
                        <th className="px-6 py-4">Transaction / Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {loadingFees ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400">Loading student fee records...</td>
                        </tr>
                      ) : filteredStudentFees.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400">No student fee records found matching your filters.</td>
                        </tr>
                      ) : (
                        filteredStudentFees.map((st) => {
                          const latestPay = st.latestPayment || {};
                          const isPaid = st.isPaid || latestPay.status === 'PAID';
                          const payMethod = latestPay.paymentMethod || 'NONE';
                          const txnId = latestPay.transactionId || 'N/A';

                          return (
                            <tr key={st._id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-900 text-sm">{st.fullName}</p>
                                <p className="text-gray-400 text-[11px] font-mono">ID: {st.studentId} | {st.email}</p>
                              </td>
                              <td className="px-6 py-4">
                                {st.parent ? (
                                  <div>
                                    <p className="font-bold text-gray-800">{st.parent.fullName}</p>
                                    <p className="text-gray-400 text-[11px]">{st.parent.phone || st.parent.email}</p>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic">Self / Not Linked</span>
                                )}
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                                {st.termFee || `₹${latestPay.amount || 2000}`}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                                  isPaid 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}>
                                  {isPaid ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                  {isPaid ? `PAID (${payMethod})` : 'PENDING'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {isPaid ? (
                                  <div>
                                    <p className="font-mono text-[11px] text-gray-900 font-bold">Txn: {txnId}</p>
                                    <p className="text-[10px] text-gray-400">
                                      {latestPay.paymentDate ? new Date(latestPay.paymentDate).toLocaleDateString() : 'Paid'}
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-amber-700 font-bold text-[11px]">Due: {latestPay.dueDate ? new Date(latestPay.dueDate).toLocaleDateString() : 'Immediate'}</p>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {!isPaid && (
                                  <button
                                    onClick={() => handleConfirmCash(st.pendingPaymentId || latestPay._id || st._id)}
                                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[11px] transition-colors shadow-2xs"
                                  >
                                    Confirm Cash
                                  </button>
                                )}
                                {isPaid && (
                                  <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                    Verified
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'Overview' && activeTab !== 'Fees' && activeTab !== 'Reports' && (
             <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTab} Management Module</h2>
                <p className="text-gray-500 max-w-md mx-auto">This administrative module is active for systemic management.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
