import React from "react";
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

export default ScrollToTop
