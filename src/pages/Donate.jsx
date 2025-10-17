import React, { useState } from "react";
import axios from "axios";

export default function Donate() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔗 Your working MPESA endpoint (✅ fixed typo)
  const MPESA_ENDPOINT = "https://mpesa-stk.giftedtech.co.ke/api/payMaka.php"; 

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!amount || !phone) {
      setMessage("⚠️ Please enter both phone number and amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      console.log("📡 Sending STK push request to:", MPESA_ENDPOINT);

      const res = await axios.post(MPESA_ENDPOINT, {
        phone,
        amount,
      });

      console.log("✅ Response:", res.data);

      if (res.status === 200) {
        setMessage("✅ STK Push sent successfully! Please complete payment on your phone.");
      } else {
        setMessage("⚠️ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("❌ Donation error:", error);
      setMessage("❌ Unable to initiate payment. Check your phone number or try later.");
    } finally {
      setLoading(false);
    }
  };

  const backgroundImage =
    "https://files.catbox.moe/sigghy.jpg";

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
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/learn" className="hover:underline">
              Learn
            </a>
            <a href="/earn" className="hover:underline">
              Earn
            </a>
            <a href="/donate" className="text-green-400 underline font-semibold">
              Donate
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center flex-1 px-6 py-20">
          <h2 className="text-5xl font-extrabold mb-6">
            Support the Future of Free Learning 🌍
          </h2>
          <p className="max-w-3xl text-lg md:text-xl mb-10 leading-relaxed">
            <strong>Learn & Earn</strong> is 100% free and powered by passion — not profit.
            Every project we launch, every tool we build, and every feature we improve is
            meant to empower learners globally.  
            If you believe in this mission, your donation helps us manage hosting, scale
            innovation, and inspire more creators.  
            Together, we’re building a movement that makes quality education accessible to
            all.
          </p>
        </section>

        {/* Donation Form */}
        <section className="flex justify-center pb-20">
          <form
            onSubmit={handleDonate}
            className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Make a Donation 💚</h3>
            <p className="text-gray-300 text-sm mb-6">
              Help us keep Learn & Earn free for everyone. Enter your Safaricom number and amount to support our growth.
            </p>

            <div className="mb-4 text-left">
              <label className="block text-sm mb-2">Phone Number (Safaricom)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="2547XXXXXXXX"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-6 text-left">
              <label className="block text-sm mb-2">Amount (KES)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 100"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded text-lg font-semibold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Processing..." : "Donate Now"}
            </button>

            {message && (
              <p className="mt-4 text-sm text-gray-200">{message}</p>
            )}
          </form>
        </section>

        {/* Gratitude Section */}
        <section className="text-center px-6 pb-16 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Where Your Support Goes</h3>
          <p className="text-lg leading-relaxed">
