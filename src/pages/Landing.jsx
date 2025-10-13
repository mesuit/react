// src/pages/Landing.jsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaLanguage, FaFileAlt, FaLaptopCode, FaMoneyBillWave } from "react-icons/fa";

export default function Landing() {
  const navigate = useNavigate();
  const whyRef = useRef(null);
  const journeyRef = useRef(null);
  const earnRef = useRef(null);
  const communityRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [visibleSections, setVisibleSections] = useState({
    why: false,
    journey: false,
    earn: false,
    community: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.3 }
    );

    [whyRef, journeyRef, earnRef, communityRef].forEach((ref, idx) => {
      if (ref.current) {
        ref.current.setAttribute(
          "data-id",
          ["why", "journey", "earn", "community"][idx]
        );
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const backgroundImage =
    "https://i.pinimg.com/736x/05/d7/84/05d784805e083785e14d8555d9428c1b.jpg";

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-70 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <h1 className="text-3xl font-bold">Learn & Earn</h1>
          <nav className="space-x-4">
            <button onClick={() => scrollTo(whyRef)} className="hover:text-green-400 transition">Why</button>
            <button onClick={() => scrollTo(journeyRef)} className="hover:text-green-400 transition">Journey</button>
            <button onClick={() => navigate("/earn")} className="hover:text-green-400 transition">Earn</button>
            <button onClick={() => navigate("/learn")} className="hover:text-green-400 transition">Learn</button>
            <button onClick={() => navigate("/signup")} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition">Sign Up</button>
            <button onClick={() => navigate("/login")} className="bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition">Login</button>
          </nav>
        </header>

        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center flex-1 px-6 py-20">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fadeIn">Unlock Your Potential</h2>
          <p className="max-w-3xl text-lg md:text-xl mb-8 leading-relaxed animate-fadeIn delay-100">
            Learn smarter, earn faster. Access unlimited AI tools, Kamusi for English, premium humaniser, assignments submission, and services like WhatsApp bots & web development.
          </p>
          <div className="space-x-4">
            <button onClick={() => navigate("/signup")} className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-lg font-semibold transition animate-fadeIn delay-200">Get Started</button>
            <button onClick={() => navigate("/learn")} className="bg-transparent border border-white px-6 py-3 rounded text-lg font-semibold hover:bg-white hover:text-black transition animate-fadeIn delay-200">Learn</button>
            <button onClick={() => navigate("/earn")} className="bg-transparent border border-white px-6 py-3 rounded text-lg font-semibold hover:bg-white hover:text-black transition animate-fadeIn delay-300">Earn</button>
          </div>
        </section>

        {/* Features Section */}
        <main className="px-6 py-12 space-y-20 max-w-6xl mx-auto text-white">
          <section
            ref={whyRef}
            className={`transition-opacity duration-1000 ${visibleSections.why ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h3 className="text-4xl font-bold mb-8 text-center">Our Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl text-center hover:bg-green-700 transition">
                <FaRobot size={40} className="mx-auto mb-4 text-green-400" />
                <h4 className="text-xl font-semibold mb-2">Unlimited AI Tools</h4>
                <p>Access AI with no response limits to assist in learning, research, and projects.</p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl text-center hover:bg-green-700 transition">
                <FaLanguage size={40} className="mx-auto mb-4 text-green-400" />
                <h4 className="text-xl font-semibold mb-2">Kamusi</h4>
                <p>Search English words, check pronunciation, and improve your language skills.</p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl text-center hover:bg-green-700 transition">
                <FaFileAlt size={40} className="mx-auto mb-4 text-green-400" />
                <h4 className="text-xl font-semibold mb-2">Assignment Submission</h4>
                <p>Submit tasks daily posted on the Earn page and get feedback from our team.</p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl text-center hover:bg-green-700 transition">
                <FaLaptopCode size={40} className="mx-auto mb-4 text-green-400" />
                <h4 className="text-xl font-semibold mb-2">Services</h4>
                <p>We offer WhatsApp bots, web design, and development services to help you grow.</p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl text-center hover:bg-green-700 transition">
                <FaMoneyBillWave size={40} className="mx-auto mb-4 text-green-400" />
                <h4 className="text-xl font-semibold mb-2">Earn Daily</h4>
                <p>Complete tasks posted by our partners on the Earn page, then submit on the Submit page to get rewarded.</p>
              </div>
            </div>
          </section>

          {/* Other Sections like Journey, Community remain same */}
          <section
            ref={journeyRef}
            className={`transition-opacity duration-1000 ${visibleSections.journey ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h3 className="text-4xl font-bold mb-4">Your Learning Journey</h3>
            <p className="text-lg leading-relaxed">
              Learn at your own pace, track progress, unlock badges, and use our premium tools to maximize results.
            </p>
          </section>

          <section
            ref={earnRef}
            className={`transition-opacity duration-1000 ${visibleSections.earn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h3 className="text-4xl font-bold mb-4">Earn While You Learn</h3>
            <p className="text-lg leading-relaxed">
              Daily tasks are posted on the Earn page. Complete them, submit via the Submit page, and earn real rewards.
            </p>
          </section>

          <section
            ref={communityRef}
            className={`transition-opacity duration-1000 ${visibleSections.community ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h3 className="text-4xl font-bold mb-4">Community of Achievers</h3>
            <p className="text-lg leading-relaxed">
              Collaborate with learners, mentors, and partners. Exchange ideas, join projects, and grow together.
            </p>
          </section>

          {/* CTA Section */}
          <section className="text-center py-20">
            <h3 className="text-5xl font-bold mb-6">Ready to Transform Your Life?</h3>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Start accessing unlimited AI, Kamusi, premium tools, submit assignments, and earn from daily tasks today.
            </p>
            <div className="space-x-4">
              <button onClick={() => navigate("/signup")} className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded text-xl font-bold transition">Get Started</button>
              <button onClick={() => navigate("/learn")} className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded text-xl font-bold transition">Learn</button>
              <button onClick={() => navigate("/earn")} className="bg-transparent border border-white px-8 py-4 rounded text-xl font-bold hover:bg-white hover:text-black transition">Earn</button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-black bg-opacity-90 text-center p-6 mt-auto">
          <p>© 2025 Learn & Earn. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
