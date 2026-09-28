import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { 
  BookOpen, Calendar, FileText, CheckCircle, 
  CreditCard, MessageSquare, Bell, LogOut,
  TrendingUp, Download, ChevronDown, ArrowLeft,
  User, GraduationCap, Phone, Mail, RefreshCw, Check, AlertCircle, Send,
  Menu, X
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import logoImg from '../images/Untitled design.png';
import { API_BASE_URL } from '../config/api';

interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-[var(--color-primary)] text-white shadow-md' 
        : 'text-stone-700 hover:bg-amber-100/50 hover:text-[var(--color-primary)]'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

interface StudentDetails {
  _id?: string;
  fullName?: string;
  email?: string;
  studentId?: string;
  phone?: string;
  age?: string;
  dob?: string;
  gender?: string;
  status?: string;
  attendance?: string;
  attendanceStatus?: string;
  termFee?: string;
  reportCardUrl?: string;
  reportCardName?: string;
  teacherMessage?: string;
  studentMessage?: string;
  courseName?: string;
  createdAt?: string;
}

export const ParentDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'Overview');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [children, setChildren] = useState<StudentDetails[]>([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [isLoadingStudent, setIsLoadingStudent] = useState(true);
  const [studentError, setStudentError] = useState('');


  const [feeCycles, setFeeCycles] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Parent real-time chat state
  const [parentChatMessages, setParentChatMessages] = useState<any[]>([]);
  const [parentMsgInput, setParentMsgInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const parentMessagesEndRef = useRef<HTMLDivElement>(null);
  const activeParentId = localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'parent_guest';
  const adminTeacherId = "60c72b2f9b1d8b001c8e4a99";

  const scrollToParentBottom = () => {
    setTimeout(() => {
      parentMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const studentDetails = children[selectedChildIndex] || null;
  const linkedStudentId = studentDetails?.studentId || '';

  // Link Student ID State (Removed editable states since Admin manages this)
  const [linkMessage, setLinkMessage] = useState({ type: '', text: '' });

  const fetchStudentAndParentData = async () => {
    setIsLoadingStudent(true);
    setStudentError('');
    
    const email = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userFullName') || 'Parent Account';
    const parentId = localStorage.getItem('userId');
    const token = localStorage.getItem('token') || '';
    
    setParentName(storedName);
    if (email) setParentEmail(email);

    try {
      let loadedChildren: StudentDetails[] = [];

      // 1. Try fetching via parentId or email endpoint
      const targetIdOrEmail = parentId || email;
      if (targetIdOrEmail) {
        const childrenRes = await fetch(`${API_BASE_URL}/api/parents/${encodeURIComponent(targetIdOrEmail)}/children`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (childrenRes.ok) {
          const data = await childrenRes.json();
          if (Array.isArray(data) && data.length > 0) {
            loadedChildren = data;
          }
        }
      }

      // 2. Fallback: Query parent user by email to get linked studentId string directly
      if (loadedChildren.length === 0 && email) {
        const parentRes = await fetch(`${API_BASE_URL}/api/users?email=${encodeURIComponent(email)}&role=parent`);
        if (parentRes.ok) {
          const parentUsers = await parentRes.json();
          if (Array.isArray(parentUsers) && parentUsers.length > 0) {
            if (parentUsers[0]._id) localStorage.setItem('userId', parentUsers[0]._id);
            if (parentUsers[0].studentId) {
              const code = parentUsers[0].studentId.trim();
              const studentRes = await fetch(`${API_BASE_URL}/api/users?studentId=${encodeURIComponent(code)}&role=student`);
              if (studentRes.ok) {
                const studentData = await studentRes.json();
                if (Array.isArray(studentData) && studentData.length > 0) {
                  loadedChildren = studentData;
                }
              }
            }
          }
        }
      }

      if (loadedChildren.length > 0) {
        setChildren(loadedChildren);
        setStudentError('');
        const activeChild = loadedChildren[selectedChildIndex];
        if (activeChild) {
          fetchFinancialData(activeChild._id || activeChild.studentId || '', token);
        }
      } else {
        setChildren([]);
        setStudentError('No Student ID linked to your parent account yet.');
      }
    } catch (err) {
      console.error('Error fetching children:', err);
      setStudentError('Failed to connect to backend server.');
    } finally {
      setIsLoadingStudent(false);
    }
  };

  const fetchFinancialData = async (childId: string, token?: string) => {
    if (!childId || childId === 'undefined' || childId === 'null' || childId === 'invalid') return;
    const authToken = token || localStorage.getItem('token') || '';
    const userEmail = localStorage.getItem('userEmail') || '';
    
    const headers: Record<string, string> = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const queryEmail = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';

    try {
      const [cyclesRes, paymentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/fees/student/${encodeURIComponent(childId)}${queryEmail}`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/api/fees/payments/student/${encodeURIComponent(childId)}${queryEmail}`, { headers }).catch(() => null)
      ]);
      if (cyclesRes && cyclesRes.ok) setFeeCycles(await cyclesRes.json());
      if (paymentsRes && paymentsRes.ok) {
        const payData = await paymentsRes.json();
        setPayments(Array.isArray(payData) ? payData : []);
      }
    } catch (error) {
      console.error('Error fetching financial data', error);
    }
  };

  const handleDownloadReceipt = (payment: any) => {
    try {
      const doc = new jsPDF();
      const sName = studentDetails?.fullName || 'Student';
      const sId = studentDetails?.studentId || linkedStudentId || 'N/A';
      const pName = parentName || 'Parent';
      const amountStr = `Rs. ${payment.amount}`;
      const paidDate = payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : new Date().toLocaleDateString();
      const dueDate = payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A';
      const txnId = payment.transactionId || `TXN-${payment._id ? payment._id.slice(-8) : Date.now()}`;
      const payMethod = payment.paymentMethod || 'ONLINE';

      // Header Banner
      doc.setFillColor(220, 38, 38); // Primary red header
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('YASHEDU ACADEMY', 15, 20);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICIAL FEE PAYMENT RECEIPT', 15, 28);

      // Status Badge
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(150, 12, 45, 14, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('PAID', 167, 21);

      // Receipt Details Header
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Receipt No: ${txnId}`, 15, 48);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date Issued: ${paidDate}`, 145, 48);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, 53, 195, 53);

      // Student & Parent Information Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 58, 180, 42, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('STUDENT & PARENT INFORMATION', 20, 68);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Student Name: ${sName}`, 20, 77);
      doc.text(`Student ID: ${sId}`, 20, 85);
      doc.text(`Course: ${studentDetails?.courseName || 'General Tuition'}`, 20, 93);

      doc.text(`Parent Name: ${pName}`, 110, 77);
      doc.text(`Parent Email: ${parentEmail || 'N/A'}`, 110, 85);
      doc.text(`Payment Method: ${payMethod}`, 110, 93);

      // Payment Breakdown Table
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 110, 180, 10, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.text('DESCRIPTION', 20, 116.5);
      doc.text('DUE DATE', 110, 116.5);
      doc.text('AMOUNT', 165, 116.5);

      // Table Row
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text('Tuition Fee Payment', 20, 130);
      doc.text(dueDate, 110, 130);
      doc.setFont('helvetica', 'bold');
      doc.text(amountStr, 165, 130);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, 137, 195, 137);

      // Total Paid Box
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(110, 145, 85, 22, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(22, 101, 52);
      doc.text('TOTAL PAID:', 115, 158);
      doc.setFontSize(14);
      doc.text(amountStr, 152, 159);

      // Authorized Stamp / Footer Note
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.text('This is a system-generated official receipt issued by YashEdu Academy.', 15, 190);
      doc.text('For any queries, please contact support@yashedu.com or call +91 86864 56117.', 15, 196);

      // Signature line
      doc.setDrawColor(203, 213, 225);
      doc.line(140, 215, 190, 215);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('Authorized Signatory', 148, 221);
      doc.text('YashEdu Academy', 151, 226);

      doc.save(`YashEdu_Receipt_${sId}_${txnId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF receipt:', err);
      alert('Error generating PDF receipt');
    }
  };

  const handleDownloadParentReportCard = async () => {
    // If student has an uploaded reportCardUrl (PDF / Image), download it directly without opening new window tab
    if (studentDetails?.reportCardUrl) {
      try {
        const response = await fetch(studentDetails.reportCardUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        const filename = studentDetails.reportCardName || `ReportCard_${studentDetails.studentId || 'YashEdu'}.pdf`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        return;
      } catch (err) {
        console.error('Direct download failed, generating PDF report card...', err);
      }
    }

    // Generate dynamic Report Card PDF using jsPDF
    try {
      const doc = new jsPDF();
      const sName = studentDetails?.fullName || 'Student';
      const sId = studentDetails?.studentId || linkedStudentId || 'N/A';
      const course = studentDetails?.courseName || 'General Academic';
      const issueDate = new Date().toLocaleDateString();

      // Premium Dark Maroon Header Banner
      doc.setFillColor(112, 0, 0); // #700000 Dark Maroon
      doc.rect(0, 0, 210, 42, 'F');

      // Gold Bottom Accent Border
      doc.setFillColor(212, 175, 55); // Gold accent
      doc.rect(0, 40, 210, 2, 'F');

      // Title & Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('YASHEDU ACADEMY', 20, 18);

      doc.setTextColor(253, 224, 71); // Gold yellow subtitle
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL ACADEMIC PERFORMANCE & EVALUATION REPORT', 20, 27);

      doc.setTextColor(241, 245, 249);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Empowering Excellence in Education & Academic Achievement', 20, 35);

      // Student Info Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 48, 180, 38, 3, 3, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('STUDENT EVALUATION SUMMARY', 20, 58);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Student Name: ${sName}`, 20, 67);
      doc.text(`Student ID: ${sId}`, 20, 76);

      doc.text(`Enrolled Course: ${course}`, 110, 67);
      doc.text(`Issue Date: ${issueDate}`, 110, 76);

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 95, 180, 10, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9);
      doc.text('SUBJECT', 20, 101.5);
      doc.text('MAX MARKS', 80, 101.5);
      doc.text('OBTAINED', 115, 101.5);
      doc.text('PERCENTAGE', 145, 101.5);
      doc.text('GRADE', 178, 101.5);

      const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
      let yPos = 114;
      let totalMax = 0;
      let totalObt = 0;

      subjects.forEach((subj) => {
        const maxM = Number((studentDetails as any)?.maxMarks?.[subj] ?? 100) || 100;
        const obtM = Number((studentDetails as any)?.marksObtained?.[subj] ?? (studentDetails as any)?.performanceScores?.[subj] ?? 0);
        const pct = maxM > 0 ? Math.round((obtM / maxM) * 100) : 0;
        const grade = pct >= 90 ? 'A+' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'F';

        totalMax += maxM;
        totalObt += obtM;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(subj, 20, yPos);
        doc.text(String(maxM), 80, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(String(obtM), 115, yPos);
        doc.text(`${pct}%`, 145, yPos);
        doc.setTextColor(22, 101, 52);
        doc.text(grade, 178, yPos);

        doc.setDrawColor(241, 245, 249);
        doc.line(15, yPos + 4, 195, yPos + 4);
        yPos += 12;
      });

      // Overall Performance Summary Box
      const overallPct = totalMax > 0 ? Math.round((totalObt / totalMax) * 100) : 0;
      const overallGrade = overallPct >= 90 ? 'A+' : overallPct >= 75 ? 'A' : overallPct >= 60 ? 'B' : overallPct >= 40 ? 'C' : 'F';

      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(15, yPos + 10, 180, 24, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(153, 27, 27);
      doc.text(`TOTAL MARKS: ${totalObt} / ${totalMax}`, 22, yPos + 24);
      doc.text(`OVERALL PERCENTAGE: ${overallPct}%`, 105, yPos + 24);
      doc.text(`FINAL GRADE: ${overallGrade}`, 162, yPos + 24);

      // Signatures & Remarks
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.text('This is an official computer-generated Academic Report Card issued by YashEdu Academy.', 15, yPos + 52);

      doc.setDrawColor(203, 213, 225);
      doc.line(140, yPos + 70, 190, yPos + 70);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('Principal / Academic Board', 142, yPos + 76);
      doc.text('YashEdu Academy', 151, yPos + 81);

      doc.save(`YashEdu_ReportCard_${sId}.pdf`);
    } catch (err) {
      console.error('Error generating report card PDF:', err);
      alert('Error generating report card PDF');
    }
  };

  const handlePayOnline = async (paymentId: string) => {
    const token = localStorage.getItem('token') || '';
    const userEmail = localStorage.getItem('userEmail') || '';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userEmail) headers['user-email'] = userEmail;

    try {
      // 1. Create order on Cashfree
      const orderRes = await fetch(`${API_BASE_URL}/api/fees/payments/${paymentId}/create-cashfree-order`, {
        method: 'POST',
        headers
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.paymentSessionId) {
        alert('Could not initiate payment: ' + (orderData.message || 'Server error'));
        return;
      }

      // 2. Open Cashfree Checkout Modal using Cashfree SDK v3
      if ((window as any).Cashfree) {
        const cashfree = (window as any).Cashfree({
          mode: orderData.environment === 'PRODUCTION' ? 'production' : 'sandbox'
        });

        cashfree.checkout({
          paymentSessionId: orderData.paymentSessionId,
          redirectTarget: '_modal'
        }).then(async (result: any) => {
          if (result && result.error) {
            console.warn('Cashfree payment modal dismissed or error:', result.error);
          }

          // Verify payment status after modal closes
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/fees/payments/verify-cashfree-order`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ orderId: orderData.orderId, paymentId })
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              alert('Payment successful and verified!');
              await fetchStudentAndParentData();
              if (studentDetails) {
                await fetchFinancialData(studentDetails._id || studentDetails.studentId || '', token);
              }
            } else if (result && result.error) {
              alert(`Payment not completed: ${result.error.message || 'Cancelled'}`);
            } else {
              alert(`Payment verification status: ${verifyData.message || 'Pending/Failed'}`);
            }
          } catch (vErr) {
            console.error('Error verifying payment:', vErr);
          }
        });
      } else {
        alert('Cashfree SDK is loading, please try again in a moment.');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      alert('Payment processing error');
    }
  };

  useEffect(() => {
    fetchStudentAndParentData();

    const newSocket = io(API_BASE_URL, {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 3,
      timeout: 5000
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', activeParentId);
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connection unavailable or delayed:', err.message);
    });

    newSocket.on('receiveMessage', (msg) => {
      setParentChatMessages((prev) => {
        if (prev.some(m => m.content === msg.content && (m._id === msg._id || Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 2000))) {
          return prev;
        }
        return [...prev, msg];
      });
      scrollToParentBottom();
    });

    fetch(`${API_BASE_URL}/api/chat/between/${activeParentId}/${adminTeacherId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setParentChatMessages(data);
        scrollToParentBottom();
      })
      .catch((err) => console.error('Error fetching parent chat:', err));

    return () => {
      newSocket.off('connect');
      newSocket.off('connect_error');
      newSocket.off('receiveMessage');
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, []);

  const handleSendParentMessage = async () => {
    const text = parentMsgInput.trim();
    if (!text) return;

    const senderId = localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'parent_guest';
    const newMsg = {
      senderId,
      receiverId: adminTeacherId,
      content: text,
      createdAt: new Date().toISOString()
    };

    // Immediate optimistic UI update
    setParentChatMessages((prev) => [...prev, newMsg]);
    setParentMsgInput('');
    scrollToParentBottom();

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
      console.error('Error sending parent message:', err);
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
              <button onClick={() => { setActiveTab('Overview'); navigate('/'); }} className="cursor-pointer">
                <img src={logoImg} alt="YashEdu Logo" className="h-12 w-auto object-contain" />
              </button>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-amber-100/50 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <nav className="flex flex-col gap-2">
                <SidebarItem icon={TrendingUp} label="Child Overview" active={activeTab === 'Overview'} onClick={() => { setActiveTab('Overview'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={GraduationCap} label="Child Profile" active={activeTab === 'Child Profile'} onClick={() => { setActiveTab('Child Profile'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={Calendar} label="Attendance" active={activeTab === 'Attendance'} onClick={() => { setActiveTab('Attendance'); fetchStudentAndParentData(); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={FileText} label="Academics" active={activeTab === 'Academics'} onClick={() => { setActiveTab('Academics'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={CreditCard} label="Fee Payments" active={activeTab === 'Fees'} onClick={() => { setActiveTab('Fees'); if (studentDetails) fetchFinancialData(studentDetails._id || studentDetails.studentId || ''); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={MessageSquare} label="Teacher Messages" active={activeTab === 'Messages'} onClick={() => { setActiveTab('Messages'); setIsMobileMenuOpen(false); }} />
              </nav>
            </div>

            <div className="mt-auto p-4 border-t border-[#EBE3D5] bg-[#F3ECE0]/40">
              <nav className="flex flex-col gap-2">
                <Link to="/" onClick={() => localStorage.clear()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-100/50 transition-all font-medium mt-2">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Link>
              </nav>
            </div>
          </motion.aside>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-[#FAF6F0] border-r border-[#EBE3D5] hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto pb-4">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <button onClick={() => { setActiveTab('Overview'); navigate('/'); }} className="cursor-pointer">
              <img src={logoImg} alt="YashEdu Logo" className="h-12 w-auto object-contain" />
            </button>
            <span className="text-xs text-stone-500 font-normal border border-stone-300/60 bg-[#F3ECE0] px-1.5 py-0.5 rounded">Parent</span>
          </div>
          
          <nav className="flex flex-col gap-2">
            <SidebarItem icon={TrendingUp} label="Child Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
            <SidebarItem icon={GraduationCap} label="Child Profile" active={activeTab === 'Child Profile'} onClick={() => setActiveTab('Child Profile')} />
            <SidebarItem icon={Calendar} label="Attendance" active={activeTab === 'Attendance'} onClick={() => { setActiveTab('Attendance'); fetchStudentAndParentData(); }} />
            <SidebarItem icon={FileText} label="Academics" active={activeTab === 'Academics'} onClick={() => setActiveTab('Academics')} />
            <SidebarItem icon={CreditCard} label="Fee Payments" active={activeTab === 'Fees'} onClick={() => { setActiveTab('Fees'); if (studentDetails) fetchFinancialData(studentDetails._id || studentDetails.studentId || ''); }} />
            <SidebarItem icon={MessageSquare} label="Teacher Messages" active={activeTab === 'Messages'} onClick={() => setActiveTab('Messages')} />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-[#EBE3D5]">
          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => localStorage.clear()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-100/50 transition-all font-medium mt-2">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              title="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                if (activeTab !== 'Overview') {
                  setActiveTab('Overview');
                } else {
                  navigate('/');
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex items-center justify-center cursor-pointer"
              title={activeTab !== 'Overview' ? "Back to Overview" : "Go to Home Page"}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{activeTab}</h1>
            
            {/* Child Selector */}
            <div className="relative group ml-2 md:ml-4">
              <div 
                onClick={() => children.length > 1 && setIsChildDropdownOpen(!isChildDropdownOpen)}
                className="hidden md:flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-1.5 cursor-pointer hover:bg-red-100 transition-colors"
                title="Switch Child"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs">
                  {studentDetails?.fullName ? studentDetails.fullName.charAt(0) : 'S'}
                </div>
                <div className="px-1">
                  <p className="text-xs font-bold text-red-950">
                    {isLoadingStudent ? 'Loading...' : (studentDetails?.fullName || 'No Student Linked')}
                  </p>
                  {linkedStudentId && (
                    <p className="text-[10px] text-[var(--color-primary)] font-mono font-medium">{linkedStudentId}</p>
                  )}
                </div>
                {children.length > 1 && (
                  <ChevronDown className={`w-4 h-4 text-[var(--color-primary)] mr-1 transition-transform ${isChildDropdownOpen ? 'rotate-180' : ''}`} />
                )}
              </div>
              
              {/* Dropdown for multiple children */}
              {children.length > 1 && (
                <div className={`absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-xl transition-all z-50 ${isChildDropdownOpen ? 'block' : 'hidden group-hover:block'}`}>
                  {children.map((child, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedChildIndex(idx);
                        setIsChildDropdownOpen(false);
                        fetchFinancialData(child._id || '', localStorage.getItem('token') || '');
                      }}
                      className={`p-3 cursor-pointer hover:bg-red-50 flex items-center gap-3 ${idx === selectedChildIndex ? 'bg-red-50' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 text-[var(--color-primary)] flex items-center justify-center font-bold">
                        {child.fullName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{child.fullName}</p>
                        <p className="text-xs text-gray-500">{child.studentId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={fetchStudentAndParentData} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Refresh Student Data">
              <RefreshCw className={`w-5 h-5 ${isLoadingStudent ? 'animate-spin' : ''}`} />
            </button>
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm border-2 border-red-200 shadow-sm">
                {parentName.charAt(0) || 'P'}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Global Notification Link Message */}
          {linkMessage.text && (
            <div className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium ${
              linkMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              linkMessage.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span>{linkMessage.text}</span>
              <button onClick={() => setLinkMessage({ type: '', text: '' })} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
          )}

          {/* Connected Student Profile Banner (Show when student details exist or prompt to link) */}
          <div className="bg-gradient-to-r from-[var(--color-primary)] via-red-600 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-red-200">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-3xl font-extrabold shadow-inner">
                  {studentDetails?.fullName ? studentDetails.fullName.charAt(0) : <GraduationCap className="w-10 h-10 text-red-100" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-3 py-1 bg-white/20 text-white border border-white/30 rounded-full text-xs font-semibold tracking-wide uppercase">
                      Linked Student Account
                    </span>
                    {studentDetails?.status && (
                      <span className={`px-2.5 py-0.5 border rounded-full text-xs font-medium flex items-center gap-1 ${
                        studentDetails.status === 'Paid' || studentDetails.status === 'Active'
                          ? 'bg-green-500/20 text-green-200 border-green-400/30'
                          : 'bg-red-900/40 text-red-200 border-red-400/30'
                      }`}>
                        {studentDetails.status === 'Paid' || studentDetails.status === 'Active' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {studentDetails.status}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {studentDetails?.fullName || 'No Student Linked'}
                  </h2>
                  <p className="text-red-100 text-sm mt-1 flex items-center gap-2">
                    <span>Student ID: <strong className="font-mono text-white bg-red-900/60 px-2 py-0.5 rounded">{linkedStudentId || 'Not set'}</strong></span>
                    {studentDetails?.email && (
                      <span className="hidden sm:inline text-red-200">• {studentDetails.email}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

                
                <button 
                  onClick={() => setActiveTab('Child Profile')} 
                  className="px-5 py-2.5 bg-white text-[var(--color-primary)] hover:bg-red-50 font-semibold rounded-xl transition-all shadow-md text-sm"
                >
                  View Full Child Profile
                </button>
              </div>

            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Warning Banner if Student is not found */}
          {studentError && !studentDetails && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-base">Student Connection Pending</h4>
                  <p className="text-amber-700 text-sm mt-0.5">{studentError}</p>
                  <p className="text-amber-600 text-xs mt-1">Please contact the academy administrator to link your child's student account to your parent dashboard.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[var(--color-primary)] to-red-600 text-white border-transparent shadow-md gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <Download className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Official Term Report Card PDF</h3>
                      <p className="text-sm text-red-100">Download official academic performance report card for {studentDetails?.fullName || 'student'}</p>
                    </div>
                  </div>
                  <button onClick={handleDownloadParentReportCard} className="px-5 py-2.5 bg-white text-[var(--color-primary)] hover:bg-red-50 font-bold rounded-xl text-sm transition-all shadow-sm whitespace-nowrap">
                    Download Official PDF
                  </button>
                </div>
              </div>

              {/* Main Detail Widgets */}
              <div className="grid grid-cols-1 gap-8">
                
                {/* Important Notices & Linked Student Details Summary */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Student Information Summary</h3>
                    
                    {studentDetails ? (
                      <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center pb-2.5 border-b border-gray-200/60">
                          <span className="text-sm text-gray-500 flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> Student Name</span>
                          <span className="font-bold text-gray-900 text-sm">{studentDetails.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-gray-200/60">
                          <span className="text-sm text-gray-500 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-gray-400" /> YashEdu ID</span>
                          <span className="font-mono font-bold text-[var(--color-primary)] text-sm bg-red-50 px-2 py-0.5 rounded">{studentDetails.studentId}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-gray-200/60">
                          <span className="text-sm text-gray-500 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> Email</span>
                          <span className="font-medium text-gray-800 text-sm">{studentDetails.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-gray-200/60">
                          <span className="text-sm text-gray-500 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> Phone</span>
                          <span className="font-medium text-gray-800 text-sm">{studentDetails.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-gray-200/60">
                          <span className="text-sm text-gray-500 flex items-center gap-2"><BookOpen className="w-4 h-4 text-gray-400" /> Enrolled Course</span>
                          <span className="font-medium text-gray-800 text-sm">{studentDetails.courseName || 'Not Assigned'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Gender & Age</span>
                          <span className="font-medium text-gray-800 text-sm">{studentDetails.gender || 'N/A'} {studentDetails.age ? `(${studentDetails.age} yrs)` : ''}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">No active student profile linked.</p>
                        <p className="mt-3 text-sm font-medium text-[var(--color-primary)]">
                          Please contact admin to link an account.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Parent Account: <strong>{parentEmail}</strong></span>
                    <button onClick={() => setActiveTab('Child Profile')} className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                      Manage Student Link →
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Child Profile Tab */}
          {activeTab === 'Child Profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Linked Student Account Information</h2>
                    <p className="text-gray-500 text-sm mt-1">Official details retrieved for student ID <strong className="font-mono text-[var(--color-primary)]">{linkedStudentId || 'None'}</strong></p>
                  </div>
                </div>

                {studentDetails ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-[var(--color-primary)]" /> Personal Profile
                      </h3>
                      <div className="flex justify-between pb-3 border-b border-gray-100 text-sm">
                        <span className="text-gray-500">Full Name</span>
                        <span className="font-bold text-gray-900">{studentDetails.fullName}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100 text-sm">
                        <span className="text-gray-500">Age</span>
                        <span className="font-medium text-gray-900">{studentDetails.age || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100 text-sm">
                        <span className="text-gray-500">Date of Birth</span>
                        <span className="font-medium text-gray-900">{studentDetails.dob || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100 text-sm">
                        <span className="text-gray-500">Gender</span>
                        <span className="font-medium text-gray-900">{studentDetails.gender || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" /> Academic & Contact
                      </h3>
                      <div className="flex justify-between pb-3 border-b border-gray-100 text-sm">
                        <span className="text-gray-500">YashEdu Student ID</span>
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{studentDetails.studentId}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100 text-sm">
                        <span className="text-gray-500">Enrolled Course</span>
                        <span className="font-bold text-gray-900">{studentDetails.courseName || 'Not Assigned'}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100 text-sm">
                        <span className="text-gray-500">Email Address</span>
                        <span className="font-medium text-gray-900">{studentDetails.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100 text-sm">
                        <span className="text-gray-500">Phone Number</span>
                        <span className="font-medium text-gray-900">{studentDetails.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100 text-sm">
                        <span className="text-gray-500">Account Status</span>
                        <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                          studentDetails.status === 'Paid' || studentDetails.status === 'Active'
                            ? 'text-green-600 bg-green-50'
                            : 'text-red-600 bg-red-50'
                        }`}>
                          {studentDetails.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">No Student Linked</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                      Please contact the academy administrator to officially link your child's academic profile to your parent account.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'Attendance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Student Attendance Report</h2>
                    <p className="text-gray-500 text-sm mt-1">Daily attendance tracking for <strong>{studentDetails?.fullName || 'Student'}</strong> (ID: {linkedStudentId || 'N/A'})</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    studentDetails?.attendanceStatus === 'Absent' ? 'bg-red-100 text-red-700 border border-red-200' :
                    studentDetails?.attendanceStatus === 'Late' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    studentDetails?.attendanceStatus === 'Present' ? 'bg-green-100 text-green-700 border border-green-200' :
                    'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    Current Status: {studentDetails?.attendanceStatus || 'Not Marked'}
                  </span>
                </div>

                {/* Attendance Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-[var(--color-primary)] flex items-center justify-center mb-3 bg-white shadow-sm">
                      <span className="text-xl font-bold text-[var(--color-primary)]">{studentDetails?.attendance || 'N/A'}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">Attendance</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Updated by Academy Admin</p>
                  </div>

                  <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-3 font-bold text-xl">
                      ✓
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">Classes Attended</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Punctual & regular</p>
                  </div>

                  <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 text-center flex flex-col items-center justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 font-bold text-sm px-2 text-center ${
                      studentDetails?.attendanceStatus === 'Absent' ? 'bg-red-100 text-red-700' :
                      studentDetails?.attendanceStatus === 'Late' ? 'bg-amber-100 text-amber-700' :
                      studentDetails?.attendanceStatus === 'Present' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {studentDetails?.attendanceStatus || 'Not Marked'}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">Latest Daily Status</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Recorded Today</p>
                  </div>
                </div>

                {/* Attendance Log Table */}
                <div className="pt-4">
                  <h3 className="font-bold text-gray-900 text-base mb-4">Recent Daily Attendance Records</h3>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                          <th className="px-6 py-3.5 font-bold">Date</th>
                          <th className="px-6 py-3.5 font-bold">Session / Class</th>
                          <th className="px-6 py-3.5 font-bold">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-6 py-3.5 font-medium text-gray-900">Day 1 (Today)</td>
                          <td className="px-6 py-3.5 text-gray-600">Full Day Academy Session</td>
                          <td className="px-6 py-3.5">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              studentDetails?.attendanceStatus === 'Absent' ? 'bg-red-100 text-red-700 border border-red-200' :
                              studentDetails?.attendanceStatus === 'Late' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              studentDetails?.attendanceStatus === 'Present' ? 'bg-green-100 text-green-700 border border-green-200' :
                              'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}>
                              {studentDetails?.attendanceStatus || 'Not Marked'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Fee Payments Tab */}
          {activeTab === 'Fees' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tuition Fee Statements & Receipts</h2>
                    <p className="text-gray-500 text-sm mt-1">Fee payment overview for <strong>{studentDetails?.fullName || 'Student'}</strong> (ID: {linkedStudentId || 'N/A'})</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    studentDetails?.status === 'Paid'
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    Payment Status: {studentDetails?.status || 'Unpaid'}
                  </span>
                </div>

                {/* Fee Summary Cards */}
                {(() => {
                  const effectiveTermFee = feeCycles.length > 0
                    ? `₹${Number(feeCycles[0].feeAmount).toLocaleString('en-IN')}`
                    : (studentDetails?.termFee && studentDetails.termFee !== '₹12,500'
                        ? studentDetails.termFee
                        : payments.length > 0
                          ? `₹${Number(payments[0].amount).toLocaleString('en-IN')}`
                          : '₹2,000');

                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 text-center flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-100 text-[var(--color-primary)] flex items-center justify-center mb-3 font-bold text-lg">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <span className="text-xs text-gray-500">Current Term Fee</span>
                          <h3 className="font-bold text-gray-900 text-2xl mt-1">
                            {effectiveTermFee}
                          </h3>
                        </div>

                        <div className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center ${
                          studentDetails?.status === 'Paid'
                            ? 'bg-green-50/50 border-green-100'
                            : 'bg-red-50/50 border-red-100'
                        }`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 font-bold text-lg ${
                            studentDetails?.status === 'Paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {studentDetails?.status === 'Paid' ? '✓' : '!'}
                          </div>
                          <span className="text-xs text-gray-500">Account Status</span>
                          <h3 className={`font-bold text-xl mt-1 ${
                            studentDetails?.status === 'Paid'
                              ? 'text-green-700'
                              : 'text-red-700'
                          }`}>
                            {studentDetails?.status || 'Unpaid'}
                          </h3>
                        </div>

                        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 text-center flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-100 text-[var(--color-primary)] flex items-center justify-center mb-3 font-bold text-sm font-mono">
                            ID
                          </div>
                          <span className="text-xs text-gray-500">Student ID</span>
                          <h3 className="font-mono font-bold text-[var(--color-primary)] text-base mt-1">{studentDetails?.studentId || linkedStudentId || 'N/A'}</h3>
                        </div>
                      </div>

                      {/* Active Fee Cycles Info Section */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-[var(--color-primary)]" /> Fee Billing Cycle Schedule
                        </h3>
                        {feeCycles.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {feeCycles.map((cycle: any, idx: number) => (
                              <div key={cycle._id || idx} className="bg-gradient-to-br from-red-50/80 via-white to-amber-50/50 p-5 rounded-2xl border border-red-100/80 shadow-xs flex flex-col justify-between space-y-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="font-bold text-red-700 uppercase tracking-wider text-[10px] bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200 inline-block">
                                      ACTIVE FEE CYCLE #{idx + 1}
                                    </span>
                                    <h4 className="font-bold text-gray-900 text-lg mt-2">{cycle.feeType || 'Tuition Fee'}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Recurring billing every <strong className="text-gray-800">{cycle.cycleDays} days</strong></p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs text-gray-400 font-medium">Cycle Amount</span>
                                    <p className="text-2xl font-extrabold text-[var(--color-primary)]">₹{cycle.feeAmount}</p>
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-red-100/60 flex items-center justify-between text-xs">
                                  <div>
                                    <span className="text-gray-500 text-[11px] block">Frequency:</span>
                                    <span className="font-semibold text-gray-800">
                                      {cycle.cycleDays === 7 ? 'Weekly (7 Days)' :
                                       cycle.cycleDays === 15 ? 'Bi-weekly (15 Days)' :
                                       cycle.cycleDays === 30 ? 'Monthly (30 Days)' :
                                       cycle.cycleDays === 90 ? 'Quarterly (90 Days)' :
                                       `Every ${cycle.cycleDays} Days`}
                                    </span>
                                  </div>
                                  <div className="text-right bg-white/90 px-3 py-1.5 rounded-xl border border-red-100 shadow-2xs">
                                    <span className="text-gray-500 text-[10px] block">Next Due Date:</span>
                                    <span className="font-bold text-red-700">{cycle.nextDueDate ? new Date(cycle.nextDueDate).toLocaleDateString() : 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-red-50/70 via-white to-amber-50/40 p-5 rounded-2xl border border-red-100/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <span className="font-bold text-red-700 uppercase tracking-wider text-[10px] bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200 inline-block">
                                STANDARD ACADEMIC FEE CYCLE
                              </span>
                              <h4 className="font-bold text-gray-900 text-lg mt-1.5">Term Tuition Billing Cycle • {effectiveTermFee}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">Standard Academy Fee Schedule (Contact admin to customize recurring monthly cycles)</p>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-xl border border-red-100 text-right">
                              <span className="text-gray-400 text-[10px] block font-medium">Fee Cycle Status</span>
                              <span className="font-bold text-emerald-600 text-xs">Standard Term Active</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}

                {/* Invoices Table */}
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                    <h3 className="font-bold text-gray-900 text-base">Official Invoices & Payment Receipts</h3>
                    {!payments.some(p => p.status === 'PENDING') && payments.some(p => p.status === 'PAID') && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full flex items-center gap-1 border border-green-200">
                        <Check className="w-3.5 h-3.5 text-green-600" /> Current Term Dues Fully Paid
                      </span>
                    )}
                  </div>

                  {!payments.some(p => p.status === 'PENDING') && payments.some(p => p.status === 'PAID') && (
                    <div className="mb-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 shadow-2xs">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Tuition Fees Cleared Successfully</p>
                        <p className="text-xs text-emerald-700 mt-0.5">Your payment is confirmed and active. You have 0 pending dues for the current academic billing cycle.</p>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                          <th className="px-6 py-3.5 font-bold">Date / Due</th>
                          <th className="px-6 py-3.5 font-bold">Amount</th>
                          <th className="px-6 py-3.5 font-bold">Status</th>
                          <th className="px-6 py-3.5 font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {payments.length === 0 ? (
                          <tr><td colSpan={4} className="p-6 text-center text-gray-500">No payment records found.</td></tr>
                        ) : payments.map(payment => (
                          <tr key={payment._id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-3.5">
                              <p className="font-bold text-gray-900">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                              {payment.paymentDate && <p className="text-xs text-gray-400">Paid: {new Date(payment.paymentDate).toLocaleDateString()}</p>}
                            </td>
                            <td className="px-6 py-3.5 font-bold text-gray-900">
                              ₹{payment.amount}
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {payment.status} {payment.paymentMethod !== 'NONE' ? `(${payment.paymentMethod})` : ''}
                              </span>
                            </td>
                            <td className="px-6 py-3.5">
                              {payment.status === 'PENDING' ? (
                                <button 
                                  onClick={() => handlePayOnline(payment._id)}
                                  className="px-3 py-1.5 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] font-bold rounded-lg text-xs transition-colors"
                                >
                                  Pay Online
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleDownloadReceipt(payment)}
                                  className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 font-bold rounded-lg text-xs transition-colors border border-green-200 flex items-center gap-1.5 shadow-2xs"
                                  title="Download Official PDF Receipt"
                                >
                                  <Download className="w-3.5 h-3.5 text-green-600" /> Receipt
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Teacher Messages Tab */}
          {activeTab === 'Messages' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Direct Chat with Academy Admin & Tutor</h2>
                    <p className="text-gray-500 text-sm mt-1">Real-time messages and progress updates regarding <strong>{studentDetails?.fullName || 'Student'}</strong></p>
                  </div>
                </div>

                {/* Real-time Parent-Admin Chat Box */}
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">Academy Administration</h4>
                      <p className="text-xs text-emerald-600 font-medium">● Online • Direct Chat Channel</p>
                    </div>
                  </div>

                  <div className="h-[380px] overflow-y-auto space-y-3 p-3 bg-[#efeae2]/30 rounded-xl border border-gray-200">
                    {parentChatMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                        No previous messages. Type a message below to reach the academy!
                      </div>
                    ) : (
                      parentChatMessages.map((msg, i) => {
                        const isMe = msg.senderId === activeParentId || msg.senderId === localStorage.getItem('userEmail') || msg.senderId === localStorage.getItem('userId');
                        return (
                          <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                              isMe ? 'bg-[var(--color-primary)] text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                            }`}>
                              <p className="leading-relaxed">{msg.content}</p>
                              <span className={`block text-[10px] text-right mt-1 ${isMe ? 'text-red-100' : 'text-gray-400'}`}>
                                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={parentMessagesEndRef} />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <textarea
                      rows={1}
                      value={parentMsgInput}
                      onChange={(e) => setParentMsgInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendParentMessage();
                        }
                      }}
                      placeholder="Type a message to the academy..."
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white text-gray-900 font-medium resize-none"
                    />
                    <button
                      onClick={handleSendParentMessage}
                      disabled={!parentMsgInput.trim()}
                      className="p-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition-colors disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Academics Tab */}
          {activeTab === 'Academics' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Official Academic Performance & Report Cards</h2>
                    <p className="text-gray-500 text-sm mt-1">Detailed subject scores & official PDF report card for <strong>{studentDetails?.fullName || 'Student'}</strong> (ID: {linkedStudentId || 'N/A'})</p>
                  </div>
                  
                  <button 
                    onClick={handleDownloadParentReportCard}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Official PDF Report Card
                  </button>
                </div>

                {/* PDF Banner */}
                <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
                        OFFICIAL ACADEMIC DOCUMENT
                      </span>
                      <h3 className="font-bold text-lg">Term 1 Academic Evaluation Report</h3>
                      <p className="text-xs text-red-100">Issued by YashEdu Academy Board for {studentDetails?.fullName || 'student'}</p>
                    </div>
                  </div>

                  <button 
                    onClick={handleDownloadParentReportCard}
                    className="px-4 py-2 bg-white text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> {studentDetails?.reportCardUrl ? 'Download PDF' : 'Request Report PDF'}
                  </button>
                </div>

                {/* Subject Scores Table */}
                <div className="pt-2">
                  <h3 className="font-bold text-gray-900 text-base mb-4">Subject Marks & Grades Breakdown</h3>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                          <th className="px-6 py-3.5 font-bold">Subject</th>
                          <th className="px-6 py-3.5 font-bold">Max Marks</th>
                          <th className="px-6 py-3.5 font-bold">Marks Obtained</th>
                          <th className="px-6 py-3.5 font-bold">Percentage</th>
                          <th className="px-6 py-3.5 font-bold">Grade</th>
                          <th className="px-6 py-3.5 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'].map((subject) => {
                          const maxM = Number((studentDetails as any)?.maxMarks?.[subject] ?? 100) || 100;
                          const obtM = Number((studentDetails as any)?.marksObtained?.[subject] ?? (studentDetails as any)?.performanceScores?.[subject] ?? 0);
                          const pct = maxM > 0 ? Math.round((obtM / maxM) * 100) : 0;
                          const grade = pct >= 90 ? 'A+' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'F';
                          const isPassed = pct >= 40;

                          return (
                            <tr key={subject} className="hover:bg-gray-50/50">
                              <td className="px-6 py-3.5 font-bold text-gray-900">{subject}</td>
                              <td className="px-6 py-3.5 text-gray-500 font-medium">{maxM}</td>
                              <td className="px-6 py-3.5 font-extrabold text-gray-900">{obtM}</td>
                              <td className="px-6 py-3.5">
                                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{pct}%</span>
                              </td>
                              <td className="px-6 py-3.5 font-bold text-green-700">{grade}</td>
                              <td className="px-6 py-3.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {isPassed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Summary Aggregate Box */}
                    {(() => {
                      const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
                      let totMax = 0;
                      let totObt = 0;
                      subjects.forEach(s => {
                        totMax += Number((studentDetails as any)?.maxMarks?.[s] ?? 100) || 100;
                        totObt += Number((studentDetails as any)?.marksObtained?.[s] ?? (studentDetails as any)?.performanceScores?.[s] ?? 0);
                      });
                      const overallPct = totMax > 0 ? Math.round((totObt / totMax) * 100) : 0;
                      const overallGrade = overallPct >= 90 ? 'A+' : overallPct >= 75 ? 'A' : overallPct >= 60 ? 'B' : overallPct >= 40 ? 'C' : 'F';

                      return (
                        <div className="p-4 bg-[#FEF3C7] border-t border-[#D4AF37] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm font-bold text-[#6B0000]">
                          <div>
                            TOTAL AGGREGATE: <span className="font-extrabold text-base">{totObt} / {totMax}</span>
                          </div>
                          <div>
                            OVERALL PERCENTAGE: <span className="font-extrabold text-base">{overallPct}%</span>
                          </div>
                          <div className="text-green-800">
                            OVERALL GRADE: <span className="font-extrabold text-base">{overallGrade}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab !== 'Overview' && activeTab !== 'Child Profile' && activeTab !== 'Attendance' && activeTab !== 'Academics' && activeTab !== 'Fees' && activeTab !== 'Messages' && (
             <div className="flex items-center justify-center h-[50vh]">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTab} Module</h2>
                <p className="text-gray-500 max-w-md">Detailed {activeTab.toLowerCase()} records for {studentDetails?.fullName || 'connected student'} will be displayed here.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
