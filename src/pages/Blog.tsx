import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const BlogPost = ({ image, category, title, excerpt, author, date, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col"
  >
    <div className="relative h-28 sm:h-56 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-red-600 shadow-sm">
        {category}
      </div>
    </div>
    <div className="p-3 sm:p-6 flex flex-col flex-grow justify-between">
      <div>
        <h3 className="font-bold text-xs sm:text-xl text-gray-900 mb-1.5 sm:mb-3 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">{title}</h3>
        <p className="text-gray-500 mb-3 sm:mb-6 flex-grow line-clamp-2 sm:line-clamp-3 leading-relaxed text-[11px] sm:text-sm">{excerpt}</p>
      </div>
      
      <div className="flex flex-wrap items-center justify-between pt-2 sm:pt-4 border-t border-gray-100 mt-auto text-[10px] sm:text-xs text-gray-500 font-medium gap-1 sm:gap-4">
        <span className="flex items-center gap-1 sm:gap-1.5 truncate max-w-[110px]"><User className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 shrink-0" /> {author}</span>
        <span className="flex items-center gap-1 sm:gap-1.5 shrink-0"><Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" /> {date}</span>
      </div>
    </div>
  </motion.div>
);

const defaultFallbackBlogs = [
  {
    _id: "b1",
    title: "Effective Study Techniques for Competitive Exams",
    category: "Study Tips",
    author: "Academic Team",
    date: "Sep 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    excerpt: "Discover proven strategies to organize your study schedule, improve retention, and tackle tough exam questions with confidence."
  },
  {
    _id: "b2",
    title: "Mastering Mathematics: Tips from Olympiad Top Rankers",
    category: "Study Tips",
    author: "Prof. Rajesh Sharma",
    date: "Aug 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    excerpt: "Learn how top scoring students develop problem-solving speed and conceptual clarity in high-level competitive math."
  },
  {
    _id: "b3",
    title: "The Future of Hybrid Learning & Digital Classrooms",
    category: "Technology",
    author: "Tech Team",
    date: "Aug 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    excerpt: "How modern interactive whiteboards, recorded lectures, and AI progress tracking are transforming education."
  }
];

export const Blog = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Articles');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
        } else {
          setBlogs(defaultFallbackBlogs);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Error fetching blogs from database, loading default blogs:", err);
        setBlogs(defaultFallbackBlogs);
        setLoading(false);
      });
  }, []);

  const categories = ['All Articles', 'Study Tips', 'Technology', 'Career Advice', 'News', 'Success Stories'];

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All Articles' || (blog.category && blog.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = !searchTerm.trim() || 
      (blog.title && blog.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      


      {/* Categories */}
      <section className="py-4 sm:py-8 border-b border-gray-100 bg-white sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="w-full px-4 sm:px-10 lg:px-16 flex items-center sm:justify-center gap-2 sm:gap-3 overflow-x-auto py-1 sm:flex-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(6);
              }}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all shadow-sm whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-red-600 text-white shadow-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-8 sm:py-16 w-full px-4 sm:px-10 lg:px-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : visibleBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {visibleBlogs.map((blog, index) => (
                <BlogPost 
                  key={blog._id || index}
                  image={blog.image}
                  category={blog.category}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  author={blog.author}
                  date={blog.date}
                  delay={0.1 * (index % 3 + 1)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-16 flex flex-col items-center gap-3">
                <button 
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-lg shadow-red-900/20 active:scale-95"
                >
                  Load More Articles ({filteredBlogs.length - visibleCount} remaining) <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-1">No articles found</h3>
            <p className="text-xs text-gray-500 mb-6">Try adjusting your search terms or selecting a different category.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Articles');
                setVisibleCount(6);
              }}
              className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs rounded-full hover:bg-red-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
