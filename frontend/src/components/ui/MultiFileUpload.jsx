import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileText, Image as ImageIcon, Loader, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MultiFileUpload({
  label = "Upload Certificates",
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 10,
  onFilesSelect,
  currentFiles = [],
  onRemove = null,
  enableCamera = true // New prop to enable/disable camera
}) {
  const [uploadedFiles, setUploadedFiles] = useState(currentFiles);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      throw new Error(`${file.name}: File size must be less than ${sizeMB}MB`);
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
      throw new Error(`${file.name}: Invalid file type`);
    }

    return true;
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setError(null);

    if (uploadedFiles.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = [];
    const errors = [];

    newFiles.forEach(file => {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (err) {
        errors.push(err.message);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    const updated = [...uploadedFiles, ...validFiles];
    setUploadedFiles(updated);
    onFilesSelect?.(updated);

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    if (droppedFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      droppedFiles.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;

      const event = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const handleRemoveFile = (index) => {
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
    onFilesSelect?.(updated);
    onRemove?.(index);
  };

  const handleClick = () => {
    if (uploadedFiles.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  const getFileIcon = (file) => {
    const name = typeof file === 'string' ? file : file.name;
    if (name.toLowerCase().endsWith('.pdf')) {
      return <FileText className="w-4 h-4 text-red-600" />;
    }
    return <ImageIcon className="w-4 h-4 text-blue-600" />;
  };

  const getFileName = (file) => {
    return typeof file === 'string' ? file : file.name;
  };

  return (
    <div className="space-y-3">
      {/* File List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={`${getFileName(file)}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <Card className="p-3 bg-slate-50 border border-slate-200 hover:border-slate-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {getFileName(file)}
                        </p>
                        {typeof file !== 'string' && (
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(index)}
                      className="hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      {uploadedFiles.length < maxFiles && (
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
            <div className="p-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{label}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {maxFiles - uploadedFiles.length} of {maxFiles} files remaining
                </p>
              </div>
              {enableCamera && accept.includes('image') && (
                <div className="flex gap-2 justify-center mt-3">
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
                    Choose Files
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

      {/* Error Message */}
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
        multiple
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
