import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Loader, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FileUpload({
  label = "Upload File",
  accept = ".jpg,.jpeg,.png,.webp",
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFileSelect,
  currentFile = null,
  onRemove = null,
  showProgress = true,
  enableCamera = true // New prop to enable/disable camera
}) {
  const [selectedFile, setSelectedFile] = useState(currentFile);
  const [preview, setPreview] = useState(currentFile?.preview || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(''); // 'uploading', 'success', 'error'
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      setError(`File size must be less than ${sizeMB}MB`);
      return false;
    }

    const allowedTypes = accept
      .split(",")
      .map(ext => {
        const mimeMap = {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".webp": "image/webp",
          ".pdf": "application/pdf"
        };
        return mimeMap[ext.toLowerCase()] || ext;
      });

    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed: ${accept}`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
      setUploadStatus('');
      setProgress(0);

    if (!validateFile(file)) {
      return;
    }

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;

      const event = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
    onRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-3">
                {preview && (
                  <div className="flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-48 max-h-48 rounded-lg object-cover border-2 border-blue-300"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                    {uploadStatus === 'uploading' && (
                      <div className="flex-1 ml-3">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{progress}% uploaded</p>
                      </div>
                    )}
                    {uploadStatus === 'success' && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        ✓ Uploaded
                      </Badge>
                    )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    className="hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors cursor-pointer bg-slate-50 hover:bg-blue-50"
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Drag and drop your file here or click to browse
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
                  </p>
                </div>
                {enableCamera && accept.includes('image') && (
                  <div className="flex gap-2 justify-center mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        cameraInputRef.current?.click();
                      }}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {enableCamera && accept.includes('image') && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </div>
  );
}
