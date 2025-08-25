'use client'
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";


function NewsLetter() {
  const [email, setEmail] = useState("");

  const { axios } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `/api/mail/send`,
        { email }
      );

      if (res.data.success) {
        toast.success("🎉 Subscription successful! Check your inbox.");
        setEmail("");
      } else {
        toast.error("❌ Failed to subscribe. Try again.");
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 max-md:px-4 my-10 mb-10 md:mb-30">
      <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>
      <p className="md:text-lg text-gray-500/70 pb-8">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          placeholder="Enter your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

export default NewsLetter;
