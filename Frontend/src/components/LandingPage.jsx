import React from "react";
import { motion } from "framer-motion";
import { MdAttachMoney } from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";
import {
  FiPlus,
  FiHeart,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";

import heroBackground from "../assets/img/hero/hero-bg_new.jpg";
import hero1 from "../assets/img/hero/hero-img-1.png";
import hero2 from "../assets/img/hero/hero-img-2.png";
import hero3 from "../assets/img/hero/hero-img-3.png";
import faqImg from "../assets/img/faq/faq-img.svg";

import client1 from "../assets/img/client-logo/client-logo-1.png";
import client2 from "../assets/img/client-logo/client-logo-2.png";
import client3 from "../assets/img/client-logo/client-logo-3.png";
import client4 from "../assets/img/client-logo/client-logo-4.png";
import client5 from "../assets/img/client-logo/client-logo-5.png";

import footerImg from "../assets/img/footer/footer-bg.jpg";
import SimpleNavbar from "./layout/SimpleNavbar";
import Footer from "./layout/Footer";
import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";

export default function LandingPage() {

  const navigate = useNavigate();

  const buttonOnClick = ()=>{
      navigate('/login',{replace:true});
  }
  return (
    <>
    {/* <SimpleNavbar/> */}
    <Navbar showSearchBar={false} showSideNav={false} showUser={true}/>
    <div className="w-full overflow-x-hidden h-[100%]">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-white overflow-hidden w-[100%] h-[100%]"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom left",
        }}
      >
        {/* floating background icons */}
        <FloatingIcons />

        <div className="absolute inset-0"/>

        <div className="relative max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Complete Health-Care <br /> Solution App For Everyone
            </h1>
            <p className="text-purple-100 mb-8 max-w-lg">
              Manage appointments, connect with doctors, and track your health anytime, anywhere.
            </p>
            <button className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold shadow hover:scale-105 transition" onClick={buttonOnClick}>
              Get Started
            </button>
          </div>

          <div className="relative flex justify-center">
            <motion.img
              src={hero1}
              className="w-72 md:w-80 z-20"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
            <motion.img
              src={hero2}
              className="absolute -right-12 top-12 w-64 hidden md:block"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
            <motion.img
              src={hero3}
              className="absolute -left-12 bottom-0 w-64 hidden md:block"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            />
          </div>
        </div>
      </motion.section>



      {/* FEATURES */}
      <motion.section
        id="feature"
        className="py-28"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Awesome Feature
            </motion.h2>
            <motion.p
              className="text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Lorem ipsum dolor samet consetetur sadipscing elitr, serewd diam nonumy eirmod tempor invidunt ut labore.
            </motion.p>
          </div>

          {/* Feature Cards */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10 justify-center">
            <FeatureCard
              title="Easy To Use"
              icon={FiTrendingUp}
              color="bg-purple-100 text-purple-600"
            />
            <FeatureCard
              title="Save Your Money"
              icon={MdAttachMoney}
              color="bg-purple-100 text-purple-600"
            />
            <FeatureCard
              title="24 Online Treatment"
              icon={FaStethoscope}
              color="bg-purple-100 text-purple-600"
            />
          </div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        className="py-28 bg-gray-50"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <FAQItem q="Can I book appointments online?" />
            <FAQItem q="How do I choose a doctor?" />
            <FAQItem q="Is my data secure?" />
          </div>
          <img src={faqImg} className="max-w-md mx-auto" />
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer
        className="relative text-white"
        style={{ backgroundImage: `url(${footerImg})`, backgroundSize: "cover", backgroundPosition : "top right"}}
      >
        <div className="bg-purple-600/90">
          <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-10 text-sm">
            <FooterCol title="Company" items={["Home", "Features", "Pricing", "Contact"]} />
            <FooterCol title="Product" items={["Mobile App", "Security", "Support", "Updates"]} />
            <FooterCol title="Legal" items={["Privacy Policy", "Terms", "Accessibility"]} />
            <div>
              <h4 className="font-semibold mb-4">Get the App</h4>
              <div className="space-y-3">
                <button className="bg-white font-semibold text-black px-4 py-2 rounded mr-3 hover:cursor-pointer hover:bg-gray-300 flex justify-center items-center text-center">
                  <i className="fa-brands fa-apple mr-1"></i>
                  App Store</button>
                <button className="bg-white font-semibold text-black px-4 py-2 rounded hover:cursor-pointer hover:bg-gray-300">
                  <i className="fa-brands fa-google-play mr-1"></i>
                  Play Store</button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs pb-6 opacity-70">© 2026 All rights reserved</p>
        </div>
      </footer>
      
    </div>
    </>
  );
}


const ICONS = [FiPlus, FiHeart, FiActivity, FiTrendingUp];

function FloatingIcons({ count = 10 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

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


function FeatureCard({ title, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 text-center"
    >
      <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-xl mb-6 ${color}`}>
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-500 text-sm">
        Lorem ipsum dolor samet consetet sadip scing elitr serewd diam nonumy eirmod tempor invidunt ut labore.
      </p>
    </motion.div>
  );
}

function Feature({ title }) {
  return (
    <div className="p-8 rounded-2xl shadow hover:shadow-xl transition">
      <div className="h-12 w-12 bg-purple-100 text-purple-600 mx-auto rounded-xl mb-6" />
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <p className="text-gray-500 text-sm">Simple, fast, and designed for everyone.</p>
    </div>
  );
}

function FAQItem({ q }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-5">
      <h4 className="font-semibold">{q}</h4>
      <p className="text-gray-500 text-sm mt-2">
        Yes — everything can be managed directly from the app in just a few clicks.
      </p>
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="font-semibold mb-4">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="opacity-80 hover:opacity-100 cursor-pointer">{item}</li>
        ))}
      </ul>
    </div>
  );
}
