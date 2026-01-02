import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  new: "bg-green-100 text-green-700 border-green-200",
  good: "bg-blue-100 text-blue-700 border-blue-200",
  needs_repair: "bg-yellow-100 text-yellow-700 border-yellow-200",
  broken: "bg-red-100 text-red-700 border-red-200",
};

const statusColors = {
  operational: "bg-green-100 text-green-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  broken: "bg-red-100 text-red-700",
  retired: "bg-gray-100 text-gray-700",
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
    if (!equipment.image_path) return null;
    if (equipment.image_path.startsWith('http')) return equipment.image_path;
    const baseUrl = 'http://localhost:5000';
    return `${baseUrl}${equipment.image_path}`;
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
      const response = await fetch(`http://localhost:5000/api/equipment/${equipment.id}/remove-image`, {
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">
              Equipment Details
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
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
                      className="w-full h-56 object-cover rounded-xl border-4 border-slate-200 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setIsImageModalOpen(true)}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-6xl border-4 border-slate-200">
                      {categoryIcons[equipment.category] || "📦"}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-slate-900 mt-4">
                    {equipment.name}
                  </h2>
                  {subtitle && (
                    <p className="text-slate-600 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Status Badges */}
                <div className="space-y-3">
                  <div className="flex justify-center gap-2">
                    <Badge className={conditionColors[equipment.condition]} variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {equipment.condition.replace('_', ' ')}
                    </Badge>
                    <Badge className={statusColors[equipment.status]} variant="secondary">
                      {equipment.status}
                    </Badge>
                  </div>
                  {equipment.quantity && equipment.quantity > 1 && (
                    <div className="flex justify-center">
                      <Badge variant="outline" className="bg-slate-100 text-slate-700">
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
                        className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700"
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
                        className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200 text-red-700"
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
                    className="flex-1"
                    onClick={() => onEdit(equipment)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
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
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Package className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-slate-900">Category</p>
                        <p className="text-sm text-slate-600 capitalize">
                          {equipment.category.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    {equipment.location && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium text-slate-900">Location</p>
                          <p className="text-sm text-slate-600">{equipment.location}</p>
                        </div>
                      </div>
                    )}
                    {isValidValue(equipment.serial_number) && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Hash className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-slate-900">Serial Number</p>
                          <p className="text-sm text-slate-600">{equipment.serial_number}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Package className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-slate-900">Quantity</p>
                        <p className="text-sm text-slate-600">{equipment.quantity || 1}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Purchase Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {equipment.purchase_date && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-900">Purchase Date</p>
                          <p className="text-sm text-slate-600">
                            {format(new Date(equipment.purchase_date), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                    {equipment.purchase_price && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium text-slate-900">Purchase Price</p>
                          <p className="text-sm text-slate-600">
                            ${equipment.purchase_price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {equipment.warranty_end_date && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-slate-900">Warranty Expires</p>
                          <p className="text-sm text-slate-600">
                            {format(new Date(equipment.warranty_end_date), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Maintenance Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Maintenance Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {equipment.last_maintenance_date && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-900">Last Maintenance</p>
                          <p className="text-sm text-slate-600">
                            {format(new Date(equipment.last_maintenance_date), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                    {equipment.next_maintenance_date && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Calendar className={`w-5 h-5 ${isMaintenanceDue ? 'text-red-500' : 'text-green-500'}`} />
                        <div>
                          <p className="font-medium text-slate-900">Next Maintenance</p>
                          <p className={`text-sm ${isMaintenanceDue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                            {format(new Date(equipment.next_maintenance_date), 'MMMM dd, yyyy')}
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
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Description
                    </h3>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-700 leading-relaxed">{equipment.description}</p>
                    </div>
                  </div>
                )}

                {/* Maintenance Notes */}
                {equipment.maintenance_notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Maintenance Notes
                    </h3>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
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
