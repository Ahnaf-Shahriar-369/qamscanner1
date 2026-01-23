"use client"

import type React from "react"
import { useState } from "react"

interface DownloadProps {
  pdfUrl: string
  fileName: string
  onBack: () => void
}

const Download: React.FC<DownloadProps> = ({ pdfUrl, fileName, onBack }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  // Manual download: hidden anchor tag
  const handleDownload = () => {
    if (!pdfUrl) return

    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = fileName || "converted.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-r from-green-500/30 via-blue-500/30 to-green-500/30 [mask:padding-box_border-box] [border:2px_solid_transparent] animate-pulse shadow-[0_0_20px_rgba(100,255,100,0.2)]"></div>

        {/* Header */}
        <div className="p-6 text-center relative z-10">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-green-500/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Conversion Successful!
          </h2>
          <p className="text-blue-200 text-lg mb-8">Your PDF is ready to download</p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 hover:from-gray-600/50 hover:to-gray-700/50 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-gray-500/30 hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <span className="group-hover:animate-pulse">← Convert Another</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-green-500/40 hover:scale-105 active:scale-95 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="group-hover:animate-pulse flex items-center justify-center gap-2">
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </>
              )}
            </span>
          </button>
        </div>

        {/* File Info */}
        <div className="p-6 text-center text-sm text-blue-200/70 relative z-10">
          <p>File: {fileName}</p>
        </div>
      </div>
    </div>
  )
}

export default Download