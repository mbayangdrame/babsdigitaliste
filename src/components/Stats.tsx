import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { animate } from "framer-motion";

function Stats() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
      });
    
      const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };
    return (
        <section className="py-32 relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80"
            alt="Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-black/70" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: 250, text: "Clients satisfaits", suffix: "+" },
              { number: 100, text: "evennements", suffix: "+" },
              { number: 1500, text: "shooting", suffix: "+" },
              { number: 10, text: "followers", suffix: "k" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <CountUp 
                  number={stat.number} 
                  suffix={stat.suffix} 
                  className="text-6xl font-bold about1 mb-4"
                />
                <div className="text-xl text-gray-200">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
}
const CountUp = ({ number, suffix = "", className = "" }: { number: number; suffix?: string; className?: string }) => {
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      const controls = animate(0, number, {
        duration: 2,
        onUpdate(value) {
          setCount(Math.floor(value));
        },
      });
  
      return () => controls.stop();
    }, [number]);
  
    return (
      <div className={className}>
        {count}{suffix}
      </div>
    );
  };
export default Stats;