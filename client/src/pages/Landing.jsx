import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ─── floating decoration shapes ─── */
function FloatingShape({ color, size, top, left, delay, shape }) {
  const shapeClass =
    shape === "circle" ? "rounded-full" : shape === "diamond" ? "rotate-45" : "";

  return (
    <div
      className={`absolute border-[3px] border-black ${color} ${shapeClass} pointer-events-none`}
      style={{
        width: size,
        height: shape === "triangle" ? 0 : size,
        top,
        left,
        animation: `float 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        ...(shape === "triangle"
          ? {
              width: 0,
              height: 0,
              background: "transparent",
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid black`,
              borderTop: "none",
            }
          : {}),
        ...(shape === "cross"
          ? {
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
            }
          : {}),
      }}
    >
      {shape === "cross" && (
        <span
          className="font-black text-black select-none"
          style={{ fontSize: size }}
        >
          +
        </span>
      )}
    </div>
  );
}

/* ─── marquee strip ─── */
function MarqueeStrip({ direction = "left", speed = 8, children, className = "" }) {
  return (
    <div
      className={`overflow-hidden whitespace-nowrap border-y-4 border-black bg-black text-white ${className}`}
    >
      <div
        className="inline-flex"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

/* ─── spinning badge ─── */
function SpinBadge({ text, className = "" }) {
  return (
    <div className={`animate-spin-slow ${className}`}>
      <svg viewBox="0 0 200 200" width="120" height="120">
        <defs>
          <path
            id="circlePath"
            d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
          />
        </defs>
        <text fontSize="16" fontWeight="900" fill="black" letterSpacing="6">
          <textPath href="#circlePath">{text}</textPath>
        </text>
      </svg>
    </div>
  );
}

/* ─── counter animation ─── */
function AnimatedCounter({ target, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.ceil(target / 40);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            setCount(current);
          }, 30);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-7xl font-black animate-text-shadow">
        {count}+
      </div>
      <div className="text-lg font-black uppercase mt-2 tracking-wider">
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════════════ MAIN APP ═══════════════════════════ */

const Landing = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clickBursts, setClickBursts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const handleClick = (e) => {
    const id = Date.now();
    setClickBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(
      () => setClickBursts((prev) => prev.filter((b) => b.id !== id)),
      800
    );
  };

  const features = [
    {
      title: "ADD FRIENDS",
      desc: "Find, connect, and grow your circle instantly.",
      color: "bg-[var(--color-crazy-blue)]",
      rotate: "-2deg",
    },
    {
      title: "CREATE GROUPS",
      desc: "Start group chats and bring your crew together.",
      color: "bg-[var(--color-crazy-green)]",
      rotate: "1.5deg",
    },
    {
      title: "REAL-TIME CHAT",
      desc: "Send and receive messages instantly with zero delay.",
      color: "bg-[var(--color-crazy-green)]",
      rotate: "-1deg",
    },
    {
      title: "SHARE MULTIMEDIA",
      desc: "Send images, videos, and files seamlessly.",
      color: "bg-[var(--color-crazy-blue)]",
      rotate: "2deg",
    },
  ];

  const testimonials = [
    {
      name: "Alex P.",
      tag: "@alexvibes",
      text: "YappHere changed the way I chat. It's fast, fun, and just works!",
      color: "bg-[var(--color-crazy-pink)]",
    },
    {
      name: "Jordan K.",
      tag: "@jordantalks",
      text: "The group chat feature is unbeatable. My friends love it!",
      color: "bg-[var(--color-crazy-green)]",
    },
    {
      name: "Taylor M.",
      tag: "@taylorsays",
      text: "Super clean interface, super fast. I'm hooked!",
      color: "bg-[var(--color-crazy-blue)]",
    },
  ];

  return (
    <div
      onClick={handleClick}
      className="relative min-h-screen bg-[var(--color-crazy-yellow)] overflow-x-hidden"
      style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: "50px 50px",
      }}
    >
      {/* ─── Mouse Follower ─── */}
      <div
        className="fixed w-8 h-8 border-4 border-black rounded-full pointer-events-none z-50 transition-transform duration-100"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
        }}
      />
      <div
        className="fixed w-3 h-3 bg-black rounded-full pointer-events-none z-50"
        style={{
          left: mousePos.x - 6,
          top: mousePos.y - 6,
        }}
      />

      {/* ─── Click Burst Effects ─── */}
      {clickBursts.map((burst) => (
        <div
          key={burst.id}
          className="fixed pointer-events-none z-40"
          style={{ left: burst.x - 20, top: burst.y - 20 }}
        >
          <svg width="40" height="40" className="animate-bounce-crazy">
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 360) / 8;
              const x = 20 + Math.cos((angle * Math.PI) / 180) * 15;
              const y = 20 + Math.sin((angle * Math.PI) / 180) * 15;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="black"
                  className="animate-scale-pulse"
                />
              );
            })}
          </svg>
        </div>
      ))}

      {/* ─── Floating Shapes ─── */}
      <FloatingShape
        color="bg-[var(--color-crazy-pink)]"
        size="60px"
        top="10%"
        left="5%"
        delay={0}
        shape="circle"
      />
      <FloatingShape
        color="bg-[var(--color-crazy-blue)]"
        size="80px"
        top="20%"
        left="85%"
        delay={0.5}
        shape="square"
      />
      <FloatingShape
        color="bg-[var(--color-crazy-green)]"
        size="50px"
        top="70%"
        left="10%"
        delay={1}
        shape="diamond"
      />
      <FloatingShape
        color="bg-white"
        size="70px"
        top="60%"
        left="90%"
        delay={1.5}
        shape="cross"
      />
      <FloatingShape
        color="bg-[var(--color-crazy-pink)]"
        size="55px"
        top="40%"
        left="92%"
        delay={2}
        shape="triangle"
      />
      <FloatingShape
        color="bg-[var(--color-crazy-blue)]"
        size="65px"
        top="85%"
        left="50%"
        delay={2.5}
        shape="circle"
      />
      <FloatingShape
        color="bg-[var(--color-crazy-green)]"
        size="45px"
        top="15%"
        left="50%"
        delay={3}
        shape="square"
      />
      <FloatingShape
        color="bg-white"
        size="60px"
        top="50%"
        left="3%"
        delay={3.5}
        shape="diamond"
      />

      {/* ─── Marquee Strips ─── */}
      <MarqueeStrip speed={12} className="py-3 text-2xl font-black">
    <span className="mx-8">WELCOME TO YAPPHERE !!!</span>
<span className="mx-8">WELCOME TO YAPPHERE !!!</span>
<span className="mx-8">WELCOME TO YAPPHERE !!!</span>
<span className="mx-8">WELCOME TO YAPPHERE !!!</span>
<span className="mx-8">WELCOME TO YAPPHERE !!!</span>
      </MarqueeStrip>

      {/* ─── Hero Section ─── */}
      <section className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <div className="relative inline-block">
            <SpinBadge
              text="REQUEST · CONNECT · MESSAGE· "
              className="absolute -top-8 -right-8 md:-right-16"
            />
             <h1
  className="text-7xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight"
  style={{ fontFamily: "'Betania Patmos In', cursive" }}
>
  YappHere
</h1>

             
          </div>

          <div className="h-2 bg-black w-32 mx-auto my-8 animate-expand-line"></div>

          <p className="text-2xl md:text-4xl font-black uppercase tracking-wide mb-8 animate-slide-up">
            Just Yapp It Out!!!
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
            <button
              onClick={() => navigate("/signup")}
              className="relative bg-[var(--color-crazy-pink)] text-black px-10 py-5 border-6 border-black uppercase font-black text-xl transform hover:scale-105 transition-all duration-200 animate-wiggle"
              style={{
                boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
                transform: "rotate(-2deg)",
              }}
            >
              GET STARTED
            </button>
            <button
              onClick={() => navigate("/login")}
              className="relative bg-white text-black px-10 py-5 border-6 border-black uppercase font-black text-xl transform hover:scale-105 transition-all duration-200"
              style={{
                boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
                transform: "rotate(2deg)",
              }}
            >
              LOGIN NOW
            </button>
          </div>

          <div className="mt-16 animate-bounce">
            <span className="text-2xl">↓</span>
          </div>
        </div>
      </section>

      {/* ─── Marquee Strip 2 ─── */}
      <MarqueeStrip
        direction="right"
        speed={10}
        className="py-3 text-xl font-black bg-[var(--color-crazy-pink)] text-black border-black"
      >
        <span className="mx-6">YAPP HERE</span>
<span className="mx-6">REGISTER NOW!!!</span>
<span className="mx-6">REGISTER NOW!!!</span>
<span className="mx-6">REGISTER NOW!!!</span>
<span className="mx-6">REGISTER NOW!!!</span>
<span className="mx-6">REGISTER NOW!!!</span>

      </MarqueeStrip>

      {/* ─── Features Grid ─── */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-4xl md:text-6xl font-black uppercase text-center mb-12 animate-slide-left">
          FEATURES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative ${feat.color} border-6 border-black p-8 transform transition-all duration-300 cursor-pointer ${
                hoveredCard === idx ? "scale-105" : ""
              }`}
              style={{
                boxShadow: "16px 16px 0px 0px rgba(0,0,0,1)",
                transform: `rotate(${feat.rotate}) ${
                  hoveredCard === idx ? "scale(1.05)" : ""
                }`,
              }}
            >
              <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-black"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-black"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-black"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-black"></div>

              <h3 className="text-3xl font-black uppercase mb-4">
                {feat.title}
              </h3>
              <p className="text-lg font-bold">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="bg-black text-white py-16 md:py-24 border-y-6 border-black">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center text-center">
      <AnimatedCounter target={0} label="Yappers" />
      <AnimatedCounter target={0} label="Messages" />
      <AnimatedCounter target={0} label="Groups" />
    </div>
  </div>
</section>


     
      
      {/* ─── Final CTA ─── */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        {/* <SpinBadge
          text="REQUEST · CONNECT · MESSAGE  · "
          className="mx-auto mb-8"
        /> */}
        <h2 className="text-5xl md:text-7xl font-black uppercase mb-8">
          Ready to Yapp?
        </h2>
        <button
          onClick={() => navigate("/signup")}
          className="bg-[var(--color-crazy-blue)] text-black px-12 py-6 border-6 border-black uppercase font-black text-2xl transform hover:scale-110 transition-all duration-200 animate-skew"
          style={{
            boxShadow: "16px 16px 0px 0px rgba(0,0,0,1)",
            transform: "rotate(-3deg)",
          }}
        >
          JOIN NOW
        </button>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-black text-white border-t-6 border-black py-12">
        <div className="container mx-auto px-4">
          
          <div className="text-center border-t-2 border-white pt-6">
            <p className="font-bold">
              © YappHere. Made by - Shivam S,Rakshith D Souza ,Prasad , Sharan Lenwin Correa
              <span className="inline-block w-3 h-3  rounded-full animate-pulse"></span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
    