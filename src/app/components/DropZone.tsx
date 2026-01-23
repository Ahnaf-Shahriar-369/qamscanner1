// DropZone.tsx
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface DropZoneProps {
  onFileSelect: (files: FileList) => void
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isClicked])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files)
    }
  }

  const handleClick = () => {
    setIsClicked(true)
    fileInputRef.current?.click()
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${isDragging
          ? "border-blue-400 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          : isHovered
            ? "border-blue-300 bg-gradient-to-br from-blue-400/10 to-purple-400/10"
            : "border-blue-200 bg-gradient-to-br from-blue-400/5 to-purple-400/5"
        } ${isClicked ? "scale-95" : ""}`}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "linear-gradient(135deg, rgba(17, 25, 40, 0.4), rgba(30, 41, 59, 0.4))",
        border: `2px dashed ${isDragging ? '#60a5fa' : isHovered ? '#93c5fd' : '#cbd5e1'}`,
        boxShadow: `0 0 30px rgba(96, 165, 250, ${isDragging ? 0.6 : 0.2}), inset 0 0 20px rgba(96, 165, 250, 0.1)`,
        color: "white",
        transform: isClicked ? "scale(0.95)" : "scale(1)",
        transition: "all 0.3s ease-in-out",
        minHeight: "250px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 20px rgba(96, 165, 250, 0.2), inset 0 0 20px rgba(96, 165, 250, 0.1); }
          50% { box-shadow: 0 0 40px rgba(96, 165, 250, 0.4), inset 0 0 30px rgba(96, 165, 250, 0.2); }
          100% { box-shadow: 0 0 20px rgba(96, 165, 250, 0.2), inset 0 0 20px rgba(96, 165, 250, 0.1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .drop-zone:hover {
          transform: scale(1.02);
          box-shadow: 0 0 40px rgba(96, 165, 250, 0.3), inset 0 0 30px rgba(96, 165, 250, 0.15);
        }
        
        .drop-zone:active {
          transform: scale(0.98);
        }
        
        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        @media (max-width: 640px) {
          .drop-zone {
            padding: 1.5rem;
            min-height: 180px;
          }
          
          .drop-zone svg {
            width: 70px;
            height: 70px;
          }
          
          .drop-zone h3 {
            font-size: 1.25rem;
          }
          
          .drop-zone p {
            font-size: 0.875rem;
          }
        }
      `}</style>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="mb-6 transition-transform duration-300 ease-in-out floating-icon">
          <svg
            className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto transition-all duration-300 ${isDragging ? "text-blue-400 animate-bounce scale-110" : "text-blue-300"
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h3
          className={`text-xl sm:text-2xl font-bold mb-3 transition-all duration-300 ${isDragging ? "text-blue-300 scale-105" : "text-white"
            }`}
          style={{ textShadow: isDragging ? '0 0 10px rgba(96, 165, 250, 0.7)' : 'none' }}
        >
          {isDragging ? "Drop files here!" : "Drop your images here"}
        </h3>
        <p className={`mb-6 text-lg transition-colors duration-300 ${isDragging ? "text-blue-200" : "text-blue-200"}`}>
          {isDragging ? "Releasing will upload..." : "or click to browse files"}
        </p>

        <div className="text-base opacity-80 transition-opacity duration-300">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Multiple files
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Max 50MB per file
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              JPG, PNG, WebP
            </span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default DropZone