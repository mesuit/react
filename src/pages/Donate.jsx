import React, { useState } from "react";
import axios from "axios";

export default function Donate() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [polling, setPolling] = useState(false);

  // ✅ Correct endpoints
  const MPESA_ENDPOINT = "https://mpesa-stk.giftedtech.co.ke/api/payMaka.php";
  const VERIFY_ENDPOINT = "https://mpesa-stk.giftedtech.co.ke/api/verify-transaction.php";

  // Format phone number to 254 format
  const formatPhoneNumber = (phone) => {
    // Remove any non-digit characters
    phone = phone.replace(/\D/g, '');
    
    // Convert to 254 format
    if (phone.startsWith('0')) {
      return '254' + phone.substring(1);
    } else if (phone.startsWith('7') && phone.length === 9) {
      return '254' + phone;
    } else if (phone.startsWith('1') && phone.length === 9) {
      return '254' + phone;
    }
    
    // If already in 254 format, return as is
    return phone;
  };

  // Poll transaction status (every second) - stops once we get ResultDesc
  const pollTransactionStatus = async (checkoutRequestId) => {
    let attempts = 0;
    const maxAttempts = 300; // Try for 5 minutes (300 attempts * 1 second)
    
    const pollInterval = setInterval(async () => {
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setPolling(false);
        setTransactionStatus("Transaction status polling timed out. Please check your M-Pesa messages for confirmation.");
        return;
      }
      
      attempts++;
      
      try {
        console.log(`📡 Polling transaction status (attempt ${attempts})...`);
        
        const response = await axios.post(VERIFY_ENDPOINT, {
          checkoutRequestId: checkoutRequestId
        });
        
        const data = response.data;
        
        // Check if we have a ResultDesc (this means we have a final status)
        if (data.data && data.data.ResultDesc) {
          clearInterval(pollInterval);
          setPolling(false);
          
          if (data.status === 'completed') {
            setTransactionStatus(`✅ Payment Completed!!\n${data.data.ResultDesc}\nM-Pesa Code: ${data.data?.MpesaReceiptNumber || 'N/A'}`);
            setMessage("🎉 Thank you for your donation! Your payment was successful.");
          } else {
            setTransactionStatus(`❌ Payment Failed!\n${data.data.ResultDesc}`);
            setMessage("⚠️ Payment failed. Please try again.");
          }
        } else if (data.status === 'completed') {
          clearInterval(pollInterval);
          setPolling(false);
          setTransactionStatus(`✅ Payment Completed!!\n${data.data?.ResultDesc || 'Transaction successful'}\nM-Pesa Code: ${data.data?.MpesaReceiptNumber || 'N/A'}`);
          setMessage("🎉 Thank you for your donation! Your payment was successful.");
        } else if (data.status === 'failed') {
          clearInterval(pollInterval);
          setPolling(false);
          setTransactionStatus(`❌ Payment Failed!\n${data.data?.ResultDesc || 'Transaction failed'}`);
          setMessage("⚠️ Payment failed. Please try again.");
        } else {
          // Still processing, update status
          setTransactionStatus(`⏳ Processing... (${attempts}/${maxAttempts})`);
        }
      } catch (error) {
        console.error('❌ Error polling transaction status:', error);
        setTransactionStatus(`⚠️ Error checking status: ${error.message}`);
      }
    }, 1000); // Poll every 1 second
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!amount || !phone) {
      setMessage("⚠️ Please enter both phone number and amount.");
      return;
    }

    // Validate amount
    if (parseFloat(amount) < 10) {
      setMessage("⚠️ Minimum donation amount is KES 10.");
      return;
    }

    setLoading(true);
    setMessage("");
    setTransactionStatus("");
    setPolling(false);

    try {
      // Format phone number
      const formattedPhone = formatPhoneNumber(phone);
      
      // Validate phone format
      if (!formattedPhone.startsWith('254') || formattedPhone.length !== 12) {
        setMessage("❌ Please enter a valid phone number (e.g., 0712345678 or 254712345678)");
        setLoading(false);
        return;
      }

      console.log("📡 Sending STK push request to:", MPESA_ENDPOINT);
      console.log("📱 Phone:", formattedPhone);
      console.log("💰 Amount:", amount);

      const res = await axios.post(MPESA_ENDPOINT, {
        phoneNumber: formattedPhone,
        amount: amount
      });

      console.log("✅ Response:", res.data);

      if (res.data.success && res.data.CheckoutRequestID) {
        setMessage("✅ STK Push sent successfully! Please complete payment on your phone.");
        setCheckoutRequestId(res.data.CheckoutRequestID);
        setPolling(true);
        setTransactionStatus("⏳ Waiting for payment confirmation...");
        
        // Start polling for transaction status
        pollTransactionStatus(res.data.CheckoutRequestID);
      } else {
        setMessage("⚠️ Failed to send STK Push. Please try again.");
        console.error("STK Push failed:", res.data);
      }
    } catch (error) {
      console.error("❌ Error while initiating payment:", error);
      if (error.response) {
        console.log("💬 Server response:", error.response.data);
        setMessage(`❌ ${error.response.data.message || error.response.data.error || "Bad Request. Check your phone number or amount."}`);
      } else if (error.request) {
        setMessage("❌ Unable to reach the payment server. Please check your connection.");
      } else {
        setMessage(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setPhone("");
    setMessage("");
    setTransactionStatus("");
    setPolling(false);
  };

  const backgroundImage = "https://files.catbox.moe/sigghy.jpg";

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
            <a href="/" className="hover:underline">Home</a>
            <a href="/learn" className="hover:underline">Learn</a>
            <a href="/earn" className="hover:underline">Earn</a>
            <a href="/donate" className="text-green-400 underline font-semibold">Donate</a>
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
            Together, we're building a movement that makes quality education accessible to
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
                placeholder="0712345678 or 254712345678"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-green-500"
                disabled={loading || polling}
              />
            </div>

            <div className="mb-6 text-left">
              <label className="block text-sm mb-2">Amount (KES)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 100"
                min="10"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-green-500"
                disabled={loading || polling}
              />
            </div>

            <button
              type="submit"
              disabled={loading || polling}
              className={`w-full py-3 rounded text-lg font-semibold transition ${
                loading || polling
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Sending..." : polling ? "Processing Payment..." : "Donate Now"}
            </button>

            {/* Transaction Status */}
            {transactionStatus && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {polling && (
                    <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  )}
                  <h4 className="font-semibold">Transaction Status</h4>
                </div>
                <p className="text-sm whitespace-pre-line">{transactionStatus}</p>
              </div>
            )}

            {/* Message */}
            {message && (
              <p className={`mt-4 text-sm ${
                message.includes('✅') || message.includes('🎉') 
                  ? 'text-green-400' 
                  : 'text-yellow-400'
              }`}>
                {message}
              </p>
            )}

            {/* Reset button when transaction is complete */}
            {!polling && (transactionStatus.includes('Completed') || transactionStatus.includes('Failed')) && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-lg font-semibold transition"
              >
                Make Another Donation
              </button>
            )}
          </form>
        </section>

        {/* Footer */}
        <footer className="bg-black bg-opacity-90 text-center p-6 mt-auto">
          <p>© 2025 Learn & Earn. All Rights Reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Powered by Makamesco Digital solutions
          </p>
        </footer>
      </div>
    </div>
  );
}
