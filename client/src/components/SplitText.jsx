import { useRef, useEffect } from "react";
import { gsap } from "gsap";

function SplitText({ text, className = "" }) {
  const textRef = useRef(null);

  useEffect(() => {
    const chars = textRef.current.querySelectorAll("span");
    gsap.from(chars, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.5,
      delay: 0.3,
      ease: "power2.out",
    });
  }, [text]);

  return (
    <div ref={textRef} className={`split-text ${className}`}>
      {text.split("").map((char, i) => (
        <span key={i}>{char === " " ? "\u00A0" : char}</span>
      ))}
    </div>
  );
}

export default SplitText;