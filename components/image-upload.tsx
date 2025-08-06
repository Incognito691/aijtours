"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        toast({
          title: "Too many images",
          description: `You can only upload up to ${maxImages} images.`,
          variant: "destructive",
        })
        return
      }

      setUploading(true)
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error("Upload failed")
          }

          const data = await response.json()
          return data.url
        } catch (error) {
          console.error("Error uploading file:", error)
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          })
          return null
        }
      })

      try {
        const uploadedUrls = await Promise.all(uploadPromises)
        const validUrls = uploadedUrls.filter((url) => url !== null)

        if (validUrls.length > 0) {
          onImagesChange([...images, ...validUrls])
          toast({
            title: "Images uploaded",
            description: `Successfully uploaded ${validUrls.length} image(s).`,
          })
        }
      } catch (error) {
        console.error("Error processing uploads:", error)
      } finally {
        setUploading(false)
      }
    },
    [images, maxImages, onImagesChange, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading || images.length >= maxImages,
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const clearAllImages = () => {
    onImagesChange([])
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : images.length >= maxImages
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-2">
              {uploading ? (
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
              <div className="text-lg font-medium text-gray-900">
                {uploading
                  ? "Uploading images..."
                  : isDragActive
                    ? "Drop images here"
                    : images.length >= maxImages
                      ? `Maximum ${maxImages} images reached`
                      : "Drag & drop images here"}
              </div>
              <p className="text-sm text-gray-500">
                {images.length >= maxImages
                  ? "Remove some images to upload more"
                  : `or click to browse (max ${maxImages} images, 5MB each)`}
              </p>
              <p className="text-xs text-gray-400">Supports: JPEG, PNG, WebP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Uploaded Images ({images.length}/{maxImages})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllImages}
              className="text-red-600 hover:text-red-700 bg-transparent"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden group relative">
                <div className="relative aspect-square">
                  <Image src={image || "/placeholder.svg"} alt={`Upload ${index + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Main</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            The first image will be used as the main image. Drag images to reorder.
          </p>
        </div>
      )}
    </div>
  )
}
