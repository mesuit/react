// src/components/Landing.jsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const whyRef = useRef(null);
  const journeyRef = useRef(null);
  const earnRef = useRef(null);
  const communityRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Intersection Observer state
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
        ref.current.setAttribute("data-id", ["why", "journey", "earn", "community"][idx]);
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
            <button onClick={() => scrollTo(whyRef)} className="hover:text-green-400 transition">
              Why
            </button>
            <button onClick={() => scrollTo(journeyRef)} className="hover:text-green-400 transition">
              Journey
            </button>
            <button onClick={() => scrollTo(earnRef)} className="hover:text-green-400 transition">
              Earn
            </button>
            <button onClick={() => scrollTo(communityRef)} className="hover:text-green-400 transition">
              Community
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Login
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center flex-1 px-6 py-20">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fadeIn">Unlock Your Potential</h2>
          <p className="max-w-3xl text-lg md:text-xl mb-8 leading-relaxed animate-fadeIn delay-100">
            Transform learning into real earnings. Gain knowledge, skills, and opportunities that empower your growth.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-lg font-semibold transition animate-fadeIn delay-200"
            >
              Get Started
            </button>
            <button
              onClick={() => scrollTo(whyRef)}
              className="bg-transparent border border-white px-6 py-3 rounded text-lg font-semibold hover:bg-white hover:text-black transition animate-fadeIn delay-200"
            >
              Learn
            </button>
            <button
              onClick={() => scrollTo(earnRef)}
              className="bg-transparent border border-white px-6 py-3 rounded text-lg font-semibold hover:bg-white hover:text-black transition animate-fadeIn delay-300"
            >
              Earn
            </button>
          </div>
        </section>

        {/* Main Content */}
        <main className="px-6 py-12 space-y-20 max-w-6xl mx-auto text-white">
          {/* Section 1: Why Learn & Earn */}
          <section
            ref={whyRef}
            className={`transition-opacity duration-1000 ${
              visibleSections.why ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-4xl font-bold mb-4">Why Learn & Earn?</h3>
            <p className="text-lg leading-relaxed">
              Knowledge alone isn’t enough. At Learn & Earn, we merge education with action. Every course, every tutorial, every skill you acquire can convert directly into tangible opportunities.
            </p>
          </section>

          {/* Section 2: Learning Journey */}
          <section
            ref={journeyRef}
            className={`transition-opacity duration-1000 ${
              visibleSections.journey ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-4xl font-bold mb-4">Your Learning Journey</h3>
            <p className="text-lg leading-relaxed">
              Learn at your own pace, track progress, and unlock badges reflecting your expertise. Knowledge is power — in Learn & Earn, knowledge is also profit.
            </p>
          </section>

          {/* Section 3: Earn While You Learn */}
          <section
            ref={earnRef}
            className={`transition-opacity duration-1000 ${
              visibleSections.earn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-4xl font-bold mb-4">Earn While You Learn</h3>
            <p className="text-lg leading-relaxed">
              Complete challenges, participate in projects, and showcase your skills. Every milestone has a monetary or career-advancing reward.
            </p>
          </section>

          {/* Section 4: Community */}
          <section
            ref={communityRef}
            className={`transition-opacity duration-1000 ${
              visibleSections.community ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-4xl font-bold mb-4">Community of Achievers</h3>
            <p className="text-lg leading-relaxed">
              Join a global network of learners, professionals, and mentors. Collaborate on projects, exchange ideas, and build lasting relationships.
            </p>
          </section>

          {/* CTA Section */}
          <section className="text-center py-20">
            <h3 className="text-5xl font-bold mb-6">Ready to Transform Your Life?</h3>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Join thousands of ambitious learners and start earning today.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/signup")}
                className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded text-xl font-bold transition"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded text-xl font-bold transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-transparent border border-white px-8 py-4 rounded text-xl font-bold hover:bg-white hover:text-black transition"
              >
                Login
              </button>
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
