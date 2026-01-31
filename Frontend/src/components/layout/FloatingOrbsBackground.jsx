
import { motion } from "framer-motion";
import { MdAttachMoney } from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";
import {
  FiPlus,
  FiHeart,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";


export function FloatingOrbsBackground() {
  return (
    <>

    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[420px] h-[420px] bg-purple-300 rounded-full blur-[120px] opacity-40 animate-floatSlow" />
      <div className="absolute top-[20%] right-[-10%] w-[360px] h-[360px] bg-indigo-300 rounded-full blur-[120px] opacity-40 animate-floatSlow delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-pink-300 rounded-full blur-[120px] opacity-40 animate-floatSlow delay-4000" />
    </div>
  </>
  );
}

const ICONS = [FiPlus, FiHeart, FiActivity, FiTrendingUp];

function FloatingIcons({ count = 10 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-100">

    <FloatingIcon key={0} Icon={<i class="fa-solid fa-user-astronaut fa-beat-fade"></i>} top={`10%`}  left={`40%`} size={'2xl'} delay={2} duration={Math.random() * 6 + 6}/>

    <FloatingIcon key={1} Icon={<i class="fa-solid fa-user-astronaut"></i>} top={`20%`}  left={`90%`} size={'2xl'} delay={2} duration={Math.random() * 6 + 6}/>

    <FloatingIcon key={2} Icon={<i class="fa-solid fa-laptop-code fa-beat-fade"></i>} top={`15%`}  left={`10%`} size={'2xl'} delay={3} duration={Math.random() * 6 + 6}/>

    <FloatingIcon key={3} Icon={<i class="fa-solid fa-user-graduate fa-fade"></i>} top={`25%`}  left={`20%`} size={'2xl'} delay={5} duration={Math.random() * 6 + 6}/>

    
    <FloatingIcon key={4} Icon={<i class="fa-solid fa-person-biking fa-beat"></i>} top={`40%`}  left={`5%`} size={'2xl'} delay={1} duration={Math.random() * 6 + 6}/>

    <FloatingIcon key={5} Icon={<i class="fa-solid fa-users-rectangle fa-beat-fade"></i>} top={`50%`}  left={`35%`} size={'2xl'} delay={2} duration={Math.random() * 6 + 6}/>

    
    <FloatingIcon key={7} Icon={<i class="fa-solid fa-chart-simple fa-beat-fade"></i>} top={`65%`}  left={`27%`} size={'2xl'} delay={4} duration={Math.random() * 6 + 6}/>


    
    <FloatingIcon key={8} Icon={<i class="fa-solid fa-diagram-project fa-fade"></i>} top={`78%`}  left={`8%`} size={'2xl'} delay={2} duration={Math.random() * 6 + 6}/>

    </div>
  );
}

function FloatingIcon({ Icon, top, left, size, delay, duration }) {
  return (
    <motion.div
      className="absolute z-0"
      style={{ top, left }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.6, 0.9, 0.6],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="w-15 h-15 shadow-2xl bg-white/30 backdrop-blur-md rounded-full p-2 flex justify-center items-center text-center text-xl text-white/50">
        {Icon}
      </div>
    </motion.div>
  );
}
