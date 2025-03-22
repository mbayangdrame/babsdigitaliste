import { motion } from "framer-motion";
import React, { useState,useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (count === end) return;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}+</span>;
};

const AboutComponent = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-white py-16 px-6 md:px-20"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="text-4xl md:text-5xl font-bold leading-tight tracking-wide uppercase text-black">
            Les Moments<br /> Spéciaux<br /> D'aujourd'hui.
          </h3>
          <h3 className="text-3xl md:text-5xl font-bold mt-6 text-[#009EAA] uppercase">
            Les Trésors<br /> Inestimables De<br /> Demain.
          </h3>
          <div className="w-16 h-[3px] bg-white mt-8"></div>
        </div>

        {/* Right Side - Statistics */}
        <div className="grid grid-cols-2 gap-6 text-center">
          {[{ value: 1520, label: "followers" },
            { value: 120, label: "Clients satisfaits" },
            { value: 6, label: "Ans d'experiances" },
            { value: 80, label: "couvertures evennements" }
          ].map((item, index) => (
            <div key={index}>
              <p className="text-5xl md:text-6xl font-bold text-[#009EAA]">
                {inView ? <Counter value={item.value} /> : "0+"}
              </p>
              <p className="text-sm mt-2 text-black">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default AboutComponent;
