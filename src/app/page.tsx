"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import DropZone from "./components/DropZone"
import ImageViewer from "./components/ImageViewer"
import Download from "./components/Download"

type ViewState = "upload" | "preview" | "download"

export default function Page() {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [viewState, setViewState] = useState<ViewState>("upload")
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [pdfFileName, setPdfFileName] = useState<string>("")
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScreenSize("mobile")
      } else if (width < 1024) {
        setScreenSize("tablet")
      } else {
        setScreenSize("desktop")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const backgroundImage = screenSize === "mobile" ? "/d.webp" : screenSize === "tablet" ? "/t.jfif" : "/t.webp"

  const altText =
    screenSize === "mobile" ? "Mobile background" : screenSize === "tablet" ? "Tablet background" : "Desktop background"

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files)
    setSelectedFiles(fileArray)
    setViewState("preview")
  }

  const handleBack = () => {
    setViewState("upload")
    setSelectedFiles([])
    setPdfUrl("")
    setPdfFileName("")
  }

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      alert("No files selected")
      return
    }

    setIsConverting(true)

    try {
      // Create FormData and append all files
      const formData = new FormData()
      selectedFiles.forEach((file) => {
        formData.append("files", file)
      })

      // Debug: log files and formData keys
      console.debug("Converting files:", selectedFiles.map((f) => ({ name: f.name, size: f.size, type: f.type })))
      for (const key of formData.keys()) {
        console.debug("FormData key:", key)
      }

      // Call our API route
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setPdfUrl(result.pdfUrl)
        setPdfFileName(result.fileName)
        setViewState("download")
      } else {
        const errorMessage = result.error || "Unknown error"
        alert(`Conversion failed: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Conversion error:", error)
      alert("Failed to convert images. Please try again or check your internet connection.")
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            opacity: 1,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <Image
            src={backgroundImage || "/placeholder.svg"}
            alt={altText}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="100vw"
          />
        </div>

        {/* Overlay content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {viewState === "upload" && <DropZone onFileSelect={handleFileSelect} />}

          {viewState === "preview" && (
            <ImageViewer files={selectedFiles} onBack={handleBack} onConvert={handleConvert} />
          )}

          {viewState === "download" && <Download pdfUrl={pdfUrl} fileName={pdfFileName} onBack={handleBack} />}
        </div>

        {/* Loading Overlay */}
        {isConverting && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="text-center">
              <div className="mb-4">
                <svg className="animate-spin h-16 w-16 text-blue-500 mx-auto" viewBox="0 0 24 24">
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
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Converting to PDF...</h3>
              <p className="text-blue-200">Please wait while we process your images</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
