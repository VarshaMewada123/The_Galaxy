import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });

        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          mainContent.focus({ preventScroll: true });
        } else {
          document.body.focus({ preventScroll: true });
        }
      } catch (error) {
        window.scrollTo(0, 0);
      }
    };

    requestAnimationFrame(handleScroll);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
