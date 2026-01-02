import React from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ImageModal({ isOpen, imageUrl, imageName, onClose, onRemove }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={imageUrl}
          alt={imageName}
          className="w-full h-full object-contain rounded-lg"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-colors shadow-lg z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-3 justify-center">
          {onRemove && (
            <Button
              variant="destructive"
              size="lg"
              onClick={onRemove}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove Image
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="gap-2"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
