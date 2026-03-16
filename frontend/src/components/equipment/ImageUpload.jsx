import React, { useState, useRef } from "react";
import { Upload, Camera, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getFileUrl } from "@/config/api";

export default function ImageUpload({ onImageSelect, currentImage }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [imageFile, setImageFile] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImageFile(file);
        setImageLoadError(false);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setImageFile(null);
    setImageLoadError(false);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  // Construct proper image URL
  const getImageUrl = () => {
    if (preview) return preview;
    if (currentImage && currentImage.startsWith('http')) return currentImage;
    return getFileUrl(currentImage);
  };

  const imageUrl = getImageUrl();
  const hasValidImage = imageUrl !== null && !imageLoadError;

  return (
    <div className="space-y-4">
      <Label className="text-slate-300">Equipment Image</Label>

      {/* Preview - Only render when image exists and loads successfully */}
      {hasValidImage && (
        <div className="relative w-full h-48 bg-[#121A2F] rounded-lg overflow-hidden border-2 border-dashed border-slate-700">
          <img
            src={imageUrl}
            alt="Equipment preview"
            className="w-full h-full object-cover"
            onError={() => {
              setImageLoadError(true);
            }}
          />
          {/* Remove button */}
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors shadow-lg z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area - Show when no image or load error */}
      {!hasValidImage && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-900/20"
              : "border-slate-700 bg-[#121A2F] hover:border-slate-500 hover:bg-slate-800/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <ImageIcon className="w-8 h-8 text-slate-500" />
            <div className="text-sm text-slate-400">
              <p className="font-medium text-slate-300">Drag and drop your image here</p>
              <p className="text-xs mt-1">or use the buttons below</p>
            </div>
          </div>
        </div>
      )}

      {/* Buttons - Always visible with dynamic labels */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2 border-slate-700 bg-[#1A233A] text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          {hasValidImage ? "Change Image" : "Upload Image"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2 border-slate-700 bg-[#1A233A] text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="w-4 h-4" />
          {hasValidImage ? "Retake Photo" : "Take Photo"}
        </Button>
      </div>

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraCapture}
      />
    </div>
  );
}
