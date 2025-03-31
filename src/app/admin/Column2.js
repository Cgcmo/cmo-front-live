import { useEffect, useRef } from "react";

const Column2 = ({ images, syncAnimation }) => {
  const columnRef = useRef(null);

  useEffect(() => {
    if (!columnRef.current) return;

    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scrollUp {
        from { transform: translateY(100%); }
        to { transform: translateY(-100%); }
      }
      .scroll-column-up {
        will-change: transform;
        animation: scrollUp 50s linear infinite;
      }
    `;
    document.head.appendChild(style);

    // Force a reflow to sync animations
    requestAnimationFrame(() => {
      syncAnimation(columnRef.current);
    });

    return () => {
      document.head.removeChild(style);
    };
  }, [syncAnimation]);

  return (
    <div ref={columnRef} className="relative space-y-2 scroll-column-up">
      {images.map((src, index) => (
        <img key={`col2-${index}`} src={src} alt={`Image ${index}`} className="w-[30vh] rounded-lg" />
      ))}
    </div>
  );
};

export default Column2;
