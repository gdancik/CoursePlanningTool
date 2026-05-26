import React from "react";
import { useLocation } from "react-router-dom";
import "./ScrollToTop.css";


const ScrollToTop: React.FC = () => {

    const [showScroll, setShowScroll] = React.useState(false);

    React.useEffect(() => {
        const onScroll = () => setShowScroll(window.scrollY > 200);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div>
            {showScroll && (
                <a href="#top" id="scrollToTop" aria-label="Scroll to top">
                    ↑ Scroll to Top
                </a>
            )}    
        </div>
          
    );
};

export function AutoScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 50);
  }, [pathname]);

  return null;
}


export default ScrollToTop