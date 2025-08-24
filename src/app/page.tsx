"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";

export default function Home() {
  const router = useRouter();

  const handleStartFlowing = () => {
    const chatId = uuid();
    router.push(`/c/${chatId}`);
  };
  return (
    <div className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-semibold text-gray-900 tracking-tight">
            Flow Chat
          </span>
        </div>

        <div className="flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            How it Works
          </a>
          <button className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Conversations
            <br />
            <span className="text-gray-900">Flow Differently</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A non-linear AI chat application that lets you branch conversations
            and explore multiple directions at once. Branch off from main
            conversations, do a side quest. Go deep into that rabbit hole anon.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartFlowing}
              className="bg-black text-white px-8 py-3 rounded-lg text-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
            >
              <span>Start Flowing</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 px-8 py-3 rounded-lg text-lg transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
