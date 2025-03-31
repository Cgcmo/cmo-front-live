import { useEffect, useRef } from "react";

const Column1 = ({ images, syncAnimation }) => {
  const columnRef = useRef(null);

  useEffect(() => {
    if (!columnRef.current) return;

    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scrollDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(100%); }
      }
      .scroll-column-down {
        will-change: transform;
        animation: scrollDown 50s linear infinite;
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
    <div ref={columnRef} className="relative space-y-2 scroll-column-down">
      {images.map((src, index) => (
        <img key={`col1-${index}`} src={src} alt={`Image ${index}`} className="w-[30vh] rounded-lg" />
      ))}
    </div>
  );
};

export default Column1;
