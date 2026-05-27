import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Debug: list formData entries and file info
    const entries: string[] = []
    for (const entry of formData.entries()) {
      const [key, value] = entry as [string, unknown]
      if (value instanceof File) {
        entries.push(`${key}: File(name=${value.name}, size=${value.size}, type=${value.type})`)
      } else {
        entries.push(`${key}: ${String(value)}`)
      }
    }
    console.log("Incoming formData entries:", entries)

    // Also log keys and files count for quick visibility
    console.log("FormData keys:", Array.from(formData.keys()))

    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      console.warn("No files provided in request")
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // ConvertAPI endpoint - 'images/to/pdf' is more generic and supports multiple formats/files
    const apiUrl = "https://v2.convertapi.com/convert/images/to/pdf"
    // Load key from environment variables
    const apiSecret = process.env.CONVERTAPI_SECRET || "lLupjeVik1648RkltaOFncl80QOBPCiZ"

    if (!apiSecret || apiSecret === "lLupjeVik1648RkltaOFncl80QOBPCiZ") {
      console.error("ConvertAPI token missing or using invalid placeholder")
      return NextResponse.json({ 
        error: "Server misconfigured: Invalid or missing ConvertAPI Token. Please configure CONVERTAPI_SECRET in your .env.local file." 
      }, { status: 500 })
    }

    // Create FormData for ConvertAPI
    const convertApiFormData = new FormData()

    // Add all files to the form data using the field name ConvertAPI expects ('Files[0]', 'Files[1]', etc.)
    // and ensuring we preserve the original filenames and types
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const filename = (file as File).name || `upload-${Date.now()}-${i}.jpg`
      try {
        const arrayBuffer = await file.arrayBuffer()
        const forwardedBlob = new Blob([arrayBuffer], { type: (file as File).type || "application/octet-stream" })
        // ConvertAPI 'images/to/pdf' endpoint expects indexed parameter names
        convertApiFormData.append(`Files[${i}]`, forwardedBlob, filename)
        console.log(`Forwarding file to ConvertAPI: Files[${i}] -> ${filename}, type=${file.type}, size=${arrayBuffer.byteLength}`)
      } catch (err) {
        console.warn(`Failed to read file ${filename} arrayBuffer(), falling back to original`, err)
        convertApiFormData.append(`Files[${i}]`, file, filename)
      }
    }

    convertApiFormData.append("StoreFile", "true")

    console.log(`Requesting conversion via: ${apiUrl}`)

    // Make request to ConvertAPI using Authorization header instead of query param
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiSecret}`
      },
      body: convertApiFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      console.error("ConvertAPI error:", response.status, errorData)

      const errorMessage = errorData.Message || errorData.message || "Conversion failed"
      return NextResponse.json({
        error: errorMessage,
        details: errorText,
        status: response.status
      }, { status: response.status })
    }

    // Try to parse JSON, fallback to text for diagnostics
    interface ConvertApiResponse {
      Files?: Array<{ Url?: string; FileName?: string }>;
      Message?: string;
      message?: string;
    }
    let result: ConvertApiResponse;
    try {
      result = await response.json()
    } catch {
      const text = await response.text()
      console.warn("ConvertAPI returned non-json response:", text)
      return NextResponse.json({ error: "Invalid response from ConvertAPI", details: text }, { status: 502 })
    }

    // ConvertAPI returns the file URL in the response
    if (result && result.Files && result.Files.length > 0 && result.Files[0].Url) {
      return NextResponse.json({
        success: true,
        pdfUrl: result.Files[0].Url,
        fileName: result.Files[0].FileName || "converted.pdf",
      })
    } else {
      console.error("No PDF file returned from conversion, response:", result)
      return NextResponse.json({ error: "No PDF file returned from conversion", details: JSON.stringify(result) }, { status: 500 })
    }
  } catch (error) {
    console.error("Conversion error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
