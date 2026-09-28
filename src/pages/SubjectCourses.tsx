import { motion } from 'framer-motion';
import { Star, MapPin, Users } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RequestQueryModal } from '../components/RequestQueryModal';
import { WatchVideoModal } from '../components/WatchVideoModal';
import { CourseDetailsModal } from '../components/CourseDetailsModal';
import { API_BASE_URL } from '../config/api';

const CourseCard = ({ image, title, instructor, rating, location, duration, students, price, subject, videoUrl, delay, onViewDetails }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col"
  >
    <div className="relative h-48 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      
      {/* Subject Badge */}
      <div className="absolute top-4 left-4 bg-purple-100/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-purple-700">
        {subject || 'Uncategorized'}
      </div>

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        {rating}
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">{title}</h3>
      
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 font-medium">
        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {location || duration || 'Location N/A'}</span>
        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {students}</span>
      </div>
      
      <div className="pt-4 border-t border-gray-100 mt-auto">
        <button 
          onClick={() => onViewDetails({ image, title, instructor, rating, location, duration, students, price, subject, videoUrl })} 
          className="w-full py-2.5 bg-[var(--color-primary)] hover:bg-red-700 text-white font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-sm"
        >
          View Details
        </button>
      </div>
    </div>
  </motion.div>
);

export const SubjectCourses = () => {
  const navigate = useNavigate();
  const { subject } = useParams(); // gets 'mathematics', 'science-&-tech', etc.
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<any | null>(null);
  const [selectedCourseForQuery, setSelectedCourseForQuery] = useState<string | null>(null);
  const [selectedWatchVideo, setSelectedWatchVideo] = useState<{ title: string; image?: string; videoUrl?: string } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/courses`)

      .then(res => res.json())
      .then(data => {
        const sourceData = Array.isArray(data) ? data : [];
        const filtered = sourceData.filter((course: any) => {
          if (!course.subject) return false;
          const courseSlug = course.subject.toLowerCase().replace(/\s+/g, '-');
          return courseSlug === subject || subject?.includes(course.subject.toLowerCase());
        });
        setCourses(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Error fetching subject courses:", err);
        setCourses([]);
        setLoading(false);
      });
  }, [subject]);

  const displaySubject = subject ? subject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* Header */}
      <section className="bg-white py-20 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50 to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/courses" className="text-[var(--color-primary)] hover:underline mb-4 inline-block font-medium">
            &larr; Back to all courses
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{displaySubject} Courses</h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Explore our comprehensive collection of courses in {displaySubject}. Master new skills with expert instructors.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course, index) => (
              <CourseCard 
                key={course._id || index}
                image={course.image}
                title={course.title}
                instructor={course.instructor}
                rating={course.rating}
                location={course.location}
                duration={course.duration}
                students={course.students}
                price={course.price}
                subject={course.subject}
                videoUrl={course.videoUrl}
                delay={0.1 * (index % 4 + 1)}
                onViewDetails={(cDetails: any) => navigate('/course-details', { state: { course: cDetails } })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">We couldn't find any courses for {displaySubject} right now.</p>
          </div>
        )}
      </section>

      {/* Course Details Modal */}
      {selectedCourseForDetails && (
        <CourseDetailsModal
          course={selectedCourseForDetails}
          onClose={() => setSelectedCourseForDetails(null)}
          onRequestQuery={(title: string) => setSelectedCourseForQuery(title)}
          onWatchVideo={(title: string, image?: string, videoUrl?: string) => {
            setSelectedCourseForDetails(null);
            navigate('/course-details', { state: { course: { title, image, videoUrl } } });
          }}
        />
      )}
      
      {/* Request Query Modal */}
      {selectedCourseForQuery && (
        <RequestQueryModal 
          courseTitle={selectedCourseForQuery} 
          onClose={() => setSelectedCourseForQuery(null)} 
        />
      )}

      {/* Watch Video Modal */}
      {selectedWatchVideo && (
        <WatchVideoModal 
          courseTitle={selectedWatchVideo.title}
          courseImage={selectedWatchVideo.image}
          videoUrl={selectedWatchVideo.videoUrl}
          onClose={() => setSelectedWatchVideo(null)} 
        />
      )}
    </div>
  );
};
