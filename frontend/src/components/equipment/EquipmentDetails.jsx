import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFileUrl, getApiBaseUrl } from "@/config/api";
import { 
  X, 
  Edit, 
  Trash2, 
  Package, 
  MapPin, 
  Calendar,
  DollarSign,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Camera,
  Hash,
  FileText,
  Download,
  Eye,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ImageModal from "./ImageModal";

const conditionColors = {
  new: "bg-green-500/10 text-green-500 border-green-500/20",
  good: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  needs_repair: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  broken: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusColors = {
  operational: "bg-green-500/10 text-green-500",
  maintenance: "bg-yellow-500/10 text-yellow-500",
  broken: "bg-red-500/10 text-red-500",
  retired: "bg-slate-500/10 text-slate-500",
};

const categoryIcons = {
  cardio: "🏃",
  strength: "💪",
  free_weights: "🏋️",
  functional: "🤸",
  accessories: "📦",
};

export default function EquipmentDetails({ equipment, onEdit, onDelete, onRefresh, onClose }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const isMaintenanceDue = equipment.next_maintenance_date && 
    new Date(equipment.next_maintenance_date) <= new Date();
  
  const hasIssues = equipment.condition === 'needs_repair' || 
    equipment.condition === 'broken' || 
    equipment.status === 'broken';

  // Construct proper image URL
  const getImageUrl = () => {
    return getFileUrl(equipment.image_path);
  };

  const imageUrl = getImageUrl();

  // Build subtitle filtering out "undefined" strings
  const subtitle = [equipment.brand, equipment.model]
    .filter(val => val && val !== 'undefined' && val !== undefined)
    .join(' • ');

  // Helper to check if value is valid (not undefined, not string "undefined")
  const isValidValue = (val) => {
    return val && val !== 'undefined' && val !== undefined && val !== '';
  };

  // Handle removing the image
  const handleRemoveImage = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/equipment/${equipment.id}/remove-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedEquipment = data.equipment || { ...equipment, image_path: null };
        
        // Close the image modal
        setIsImageModalOpen(false);
        
        // Refresh the parent component with the updated equipment data
        if (onRefresh) {
          onRefresh(updatedEquipment);
        }
      } else {
        console.error('Failed to remove image');
        alert('Failed to remove image. Please try again.');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Error removing image: ' + error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-[#1A233A] border-slate-800 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50 pb-4">
            <CardTitle className="text-xl font-bold text-white">
              Equipment Details
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Image and Basic Info */}
              <div className="space-y-6">
                {/* Equipment Image */}
                <div className="text-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={equipment.name}
                      className="w-full h-56 object-cover rounded-xl border border-slate-800 shadow-md cursor-pointer hover:shadow-lg transition-shadow bg-[#121A2F]"
                      onClick={() => setIsImageModalOpen(true)}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-56 bg-[#121A2F] rounded-xl flex items-center justify-center text-6xl border border-slate-800">
                      {categoryIcons[equipment.category] || "📦"}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-white mt-4">
                    {equipment.name}
                  </h2>
                  {subtitle && (
                    <p className="text-slate-400 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Status Badges */}
                <div className="space-y-3">
                  <div className="flex justify-center gap-2">
                    <Badge className={conditionColors[equipment.condition]} variant="secondary">
                      {equipment.condition.replace('_', ' ')}
                    </Badge>
                    <Badge className={statusColors[equipment.status]} variant="secondary">
                      {equipment.status}
                    </Badge>
                  </div>
                  {equipment.quantity && equipment.quantity > 1 && (
                    <div className="flex justify-center">
                      <Badge variant="outline" className="bg-[#121A2F] text-slate-300 border-slate-700">
                        Qty: {equipment.quantity}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Alerts */}
                {(isMaintenanceDue || hasIssues) && (
                  <div className="space-y-2">
                    {isMaintenanceDue && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-3 bg-yellow-900/10 rounded-lg border border-yellow-900/50 text-yellow-500"
                      >
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          Maintenance overdue
                        </span>
                      </motion.div>
                    )}
                    {hasIssues && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-3 bg-red-900/10 rounded-lg border border-red-900/50 text-red-500"
                      >
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          Needs attention
                        </span>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-slate-700 bg-[#121A2F] text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => onEdit(equipment)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => onDelete(equipment.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                      <Package className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white text-sm">Category</p>
                        <p className="text-xs text-slate-400 capitalize">
                          {equipment.category.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    {equipment.location && (
                      <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-medium text-white text-sm">Location</p>
                          <p className="text-xs text-slate-400">{equipment.location}</p>
                        </div>
                      </div>
                    )}
                    {isValidValue(equipment.serial_number) && (
                      <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                        <Hash className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium text-white text-sm">Serial Number</p>
                          <p className="text-xs text-slate-400">{equipment.serial_number}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                      <Package className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="font-medium text-white text-sm">Quantity</p>
                        <p className="text-xs text-slate-400">{equipment.quantity || 1}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Information */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2 border-t border-slate-800/50 pt-4">
                    <DollarSign className="w-4 h-4" />
                    Purchase Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {equipment.purchase_date && (
                      <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-white text-sm">Purchase Date</p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(equipment.purchase_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                    {equipment.purchase_price && (
                      <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-medium text-white text-sm">Purchase Price</p>
                          <p className="text-xs text-slate-400">
                            ${equipment.purchase_price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {equipment.warranty_end_date && (
                      <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium text-white text-sm">Warranty Expires</p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(equipment.warranty_end_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Maintenance Information */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2 border-t border-slate-800/50 pt-4">
                    <Wrench className="w-4 h-4" />
                    Maintenance Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {equipment.last_maintenance_date && (
                      <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-white text-sm">Last Maintenance</p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(equipment.last_maintenance_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                    {equipment.next_maintenance_date && (
                      <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                        <Calendar className={`w-5 h-5 ${isMaintenanceDue ? 'text-red-500' : 'text-green-400'}`} />
                        <div>
                          <p className="font-medium text-white text-sm">Next Maintenance</p>
                          <p className={`text-xs ${isMaintenanceDue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                            {format(new Date(equipment.next_maintenance_date), 'MMM dd, yyyy')}
                            {isMaintenanceDue && " (Overdue)"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {equipment.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4 border-t border-slate-800/50 pt-4">
                      Description
                    </h3>
                    <div className="p-4 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                      <p className="text-slate-300 text-sm leading-relaxed">{equipment.description}</p>
                    </div>
                  </div>
                )}

                {/* Maintenance Notes */}
                {equipment.maintenance_notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4 border-t border-slate-800/50 pt-4">
                      Maintenance Notes
                    </h3>
                    <div className="p-4 bg-[#121A2F] border border-slate-800/50 rounded-lg">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {equipment.maintenance_notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={imageUrl}
        imageName={equipment.name}
        onClose={() => setIsImageModalOpen(false)}
        onRemove={handleRemoveImage}
      />
    </motion.div>
  );
}
