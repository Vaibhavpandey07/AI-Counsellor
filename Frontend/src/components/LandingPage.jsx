import React, { useContext, useEffect } from "react";
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

import footerImg from "../assets/img/footer/footer-bg.jpg";

import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Context from "../Context/Context";

export default function LandingPage() {
  const navigate = useNavigate();
  const obj = useContext(Context);

  const buttonOnClick = () => {
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (obj.isLogIn) {
      if (obj.onBoarding === null) return;

      if (obj.onBoarding) {
        navigate("/user/dashboard", { replace: true });
      } else {
        navigate("/user/onBoarding", { replace: true });
      }
    }
  }, [obj]);

  return (
    <>
      <Navbar showSearchBar={false} showSideNav={false} showUser={true} />

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
          <FloatingIcons />
          <div className="absolute inset-0" />

          <div className="relative max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Your Personal AI Study Abroad <br /> Counsellor, Anytime
              </h1>
              <p className="text-purple-100 mb-8 max-w-lg">
                Get expert guidance on universities, courses, exams, budgets,
                and applications — powered by AI and tailored to your profile.
              </p>
              <button
                className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold shadow hover:scale-105 transition"
                onClick={buttonOnClick}
              >
                Start Your Journey
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
            <div className="max-w-2xl mx-auto text-center mb-16">
              <motion.h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful AI Counsellor Features
              </motion.h2>
              <motion.p className="text-gray-500">
                Personalized recommendations, smart insights, and step-by-step
                guidance for your study abroad journey.
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10 justify-center">
              <FeatureCard
                title="Personalized Guidance"
                icon={FiTrendingUp}
                color="bg-purple-100 text-purple-600"
              />
              <FeatureCard
                title="Smart Budget Planning"
                icon={MdAttachMoney}
                color="bg-purple-100 text-purple-600"
              />
              <FeatureCard
                title="24/7 AI Counsellor Support"
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
              <FAQItem q="How does the AI counsellor help me choose universities?" />
              <FAQItem q="Can I get guidance on exams, intake, and budget?" />
              <FAQItem q="Is my academic data secure?" />
            </div>
            <img src={faqImg} className="max-w-md mx-auto" />
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer
          className="relative text-white"
          style={{
            backgroundImage: `url(${footerImg})`,
            backgroundSize: "cover",
            backgroundPosition: "top right",
          }}
        >
          <div className="bg-purple-600/90">
            <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-10 text-sm">
              <FooterCol title="Company" items={["Home", "AI Counsellor", "Universities", "Contact"]} />
              <FooterCol title="Product" items={["Counselling", "Shortlisting", "Applications", "Updates"]} />
              <FooterCol title="Legal" items={["Privacy Policy", "Terms", "Data Security"]} />
            </div>
            <p className="text-center text-xs pb-6 opacity-70">
              © 2026 AI Counsellor. Guiding students worldwide.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ---------- Components ---------- */

function FloatingIcons() {
  return <div className="absolute inset-0 pointer-events-none overflow-hidden" />;
}

function FeatureCard({ title, icon: Icon, color }) {
  return (
    <motion.div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 text-center">
      <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-xl mb-6 ${color}`}>
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-500 text-sm">
        AI-powered recommendations tailored to your academic background,
        preferences, and career goals.
      </p>
    </motion.div>
  );
}

function FAQItem({ q }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-5">
      <h4 className="font-semibold">{q}</h4>
      <p className="text-gray-500 text-sm mt-2">
        Yes — our AI counsellor securely analyzes your profile and provides
        accurate, personalized guidance at every step.
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
          <li key={i} className="opacity-80 hover:opacity-100 cursor-pointer">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}