"use client";
import { useState } from "react";

export default function INZGamingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleTikTokLogin = () => {
    // In production, this redirects to TikTok OAuth
    setTimeout(() => setIsConnected(true), 1500);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploaded(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg">
            INZ
          </div>
          <div>
            <h1 className="text-xl font-bold">INZ Gaming</h1>
            <p className="text-xs text-gray-400">Auto Post Gaming Clips</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isConnected && (
            <span className="text-sm text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              TikTok Connected
            </span>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Step 1: Connect TikTok */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isConnected ? "bg-green-500" : "bg-gray-700"}`}>
              {isConnected ? "✓" : "1"}
            </span>
            Connect TikTok Account
          </h2>
          {!isConnected ? (
            <button
              onClick={handleTikTokLogin}
              className="bg-black border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-lg flex items-center gap-3 transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.03a8.35 8.35 0 004.76 1.49v-3.4a4.85 4.85 0 01-1-.43z" fill="white"/>
              </svg>
              Sign in with TikTok
            </button>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">👤</div>
              <div>
                <p className="font-medium">@inzgaming</p>
                <p className="text-sm text-gray-400">TikTok account connected</p>
              </div>
              <span className="ml-auto text-green-400 text-sm">Connected</span>
            </div>
          )}
        </div>

        {/* Step 2: Video Queue */}
        {isConnected && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${uploaded ? "bg-green-500" : "bg-gray-700"}`}>
                {uploaded ? "✓" : "2"}
              </span>
              Gaming Clips Ready to Post
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "1v4 Clutch - Free Fire", duration: "0:24", status: uploaded ? "Posted" : "Ready" },
                { title: "Headshot Montage", duration: "0:18", status: "Queued" },
                { title: "Squad Wipe - Phonk Edit", duration: "0:31", status: "Queued" },
              ].map((video, i) => (
                <div
                  key={i}
                  onClick={() => !uploaded && setSelectedVideo(video.title)}
                  className={`bg-gray-900 border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedVideo === video.title ? "border-blue-500" : "border-gray-800 hover:border-gray-600"
                  }`}
                >
                  <div className="aspect-[9/16] bg-gray-800 rounded-lg mb-3 flex items-center justify-center text-4xl">
                    🎮
                  </div>
                  <p className="font-medium text-sm">{video.title}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>{video.duration}</span>
                    <span className={
                      video.status === "Posted" ? "text-green-400" :
                      video.status === "Ready" ? "text-blue-400" : "text-gray-500"
                    }>
                      {video.status === "Posted" ? "✓ Posted to TikTok" : video.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Upload */}
        {isConnected && selectedVideo && !uploaded && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">3</span>
              Post to TikTok
            </h2>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <p className="text-sm text-gray-400 mb-2">Selected: <span className="text-white">{selectedVideo}</span></p>
              <p className="text-sm text-gray-400 mb-4">Caption: 🔥 Built different. No cap. #FreeFire #Gaming #INZGaming #Shorts</p>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  isUploading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Uploading to TikTok...
                  </span>
                ) : (
                  "Post to TikTok"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {uploaded && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
            <p className="text-3xl mb-2">✅</p>
            <h3 className="text-xl font-bold text-green-400">Video Posted to TikTok!</h3>
            <p className="text-gray-400 mt-2">Your Free Fire clip has been published successfully.</p>
            <p className="text-sm text-gray-500 mt-1">Next auto-post in 58 minutes...</p>
          </div>
        )}

        {/* Auto Schedule Info */}
        {isConnected && (
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Auto-Post Schedule</h3>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-2xl font-bold text-blue-400">24</p>
                <p className="text-gray-400">Videos/Day</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">1hr</p>
                <p className="text-gray-400">Interval</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">3</p>
                <p className="text-gray-400">Platforms</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">Facebook</span>
              <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full">YouTube Shorts</span>
              <span className="text-xs bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full">TikTok</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
