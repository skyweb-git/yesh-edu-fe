import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { CourseDetails } from './pages/CourseDetails';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { AboutUs } from './pages/AboutUs';
import { Courses } from './pages/Courses';
import { SubjectCourses } from './pages/SubjectCourses';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { PaymentStatus } from './pages/PaymentStatus';

// Dashboards
import { StudentDashboard } from './dashboards/StudentDashboard';
import { TeacherDashboard } from './dashboards/TeacherDashboard';
import { ParentDashboard } from './dashboards/ParentDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';

// Placeholder for missing auth pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
    <h1 className="text-3xl font-bold text-gray-400">{title} Content Coming Soon</h1>
  </div>
);

import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ScrollToTop />
      {/* Hide Navbar/Footer on Dashboard routes if we wanted, but for this demo they are fine or we can conditionally hide them */}
      <Routes>
        {/* Dashboards (These usually have their own layout, so we render them outside main layout for full screen) */}
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        {/* Standard Pages */}
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:subject" element={<SubjectCourses />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/course-details" element={<CourseDetails />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/payment-status" element={<PaymentStatus />} />
                
                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
