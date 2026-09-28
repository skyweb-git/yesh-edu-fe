import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "Blogs", path: "/blog" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" }
];

export const SlideTabs = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Find which tab matches current path
  const currentTabIndex = TABS.findIndex(tab => 
    tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path)
  );
  
  const initialIndex = currentTabIndex >= 0 ? currentTabIndex : 0;
  const [selected, setSelected] = useState(initialIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(initialIndex);
  
  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Update selected if route changes externally
  useEffect(() => {
    if (currentTabIndex >= 0 && currentTabIndex !== selected) {
      setSelected(currentTabIndex);
      setHoveredIndex(currentTabIndex);
    }
  }, [location.pathname, currentTabIndex, selected]);

  // Update cursor position on mount, route change, or resize
  useEffect(() => {
    const updatePosition = () => {
      const activeIdx = hoveredIndex !== null ? hoveredIndex : selected;
      const currentTab = tabsRef.current[activeIdx];
      if (currentTab) {
        setPosition({
          left: currentTab.offsetLeft,
          width: currentTab.offsetWidth,
          opacity: 1,
        });
      }
    };

    updatePosition();
    // Run after a frame to ensure layout ref has rendered dimensions
    const timer = setTimeout(updatePosition, 50);
    window.addEventListener("resize", updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
    };
  }, [selected, hoveredIndex]);

  return (
    <ul
      onMouseLeave={() => {
        setHoveredIndex(selected);
        const selectedTab = tabsRef.current[selected];
        if (selectedTab) {
          setPosition({
            left: selectedTab.offsetLeft,
            width: selectedTab.offsetWidth,
            opacity: 1,
          });
        }
      }}
      className={`relative mx-auto flex w-full max-w-xl md:max-w-2xl rounded-full bg-[#FAF6EE] p-2 md:p-2.5 border border-[#EAE0D0] shadow-sm items-center justify-between`}
    >
      {TABS.map((tab, i) => (
        <Tab
          key={tab.name}
          ref={(el) => { tabsRef.current[i] = el; }}
          setPosition={setPosition}
          onClick={() => {
            setSelected(i);
            setHoveredIndex(i);
            navigate(tab.path);
          }}
          onHover={() => setHoveredIndex(i)}
          isActive={(hoveredIndex !== null ? hoveredIndex : selected) === i}
        >
          {tab.name}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
};

interface TabProps {
  children: React.ReactNode;
  setPosition: (position: { left: number; width: number; opacity: number }) => void;
  onClick: () => void;
  onHover: () => void;
  isActive: boolean;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(({ children, setPosition, onClick, onHover, isActive }, ref) => {
  return (
    <li
      ref={ref}
      onClick={onClick}
      onMouseEnter={(e) => {
        onHover();
        const node = e.currentTarget;
        if (!node) return;
        setPosition({
          left: node.offsetLeft,
          width: node.offsetWidth,
          opacity: 1,
        });
      }}
      className={`relative z-10 flex-1 flex items-center justify-center cursor-pointer py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-extrabold transition-colors duration-200 px-3 md:px-5 whitespace-nowrap tracking-wide select-none ${
        isActive ? "!text-white" : "!text-[#01274C] hover:!text-[#D3010A]"
      }`}
    >
      <span className={`transition-colors duration-200 ${isActive ? "!text-white font-extrabold" : "!text-[#01274C] hover:!text-[#D3010A]"}`}>
        {children}
      </span>
    </li>
  );
});

const Cursor = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.li
      animate={{
        left: position.left,
        width: position.width,
        opacity: position.opacity
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute z-0 top-2 bottom-2 md:top-2.5 md:bottom-2.5 rounded-full bg-[#D3010A] shadow-sm pointer-events-none"
    />
  );
};
