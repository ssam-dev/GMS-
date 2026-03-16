import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import ImageUpload from "./ImageUpload";
import { getFileUrl } from "@/config/api";

export default function EquipmentForm({ equipment, onSubmit, onCancel }) {
  // Helper function to convert ISO date to yyyy-MM-dd format
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  const [formData, setFormData] = useState(() => {
    // Helper to convert null/undefined to empty string
    const safeString = (value) => (value == null ? "" : String(value));
    
    if (equipment) {
      return {
        name: safeString(equipment.name),
        category: safeString(equipment.category) || "cardio",
        brand: safeString(equipment.brand),
        model: safeString(equipment.model),
        serial_number: safeString(equipment.serial_number),
        purchase_date: formatDateForInput(equipment.purchase_date),
        purchase_price: equipment.purchase_price != null ? String(equipment.purchase_price) : "",
        warranty_end_date: formatDateForInput(equipment.warranty_end_date),
        location: safeString(equipment.location),
        condition: safeString(equipment.condition) || "good",
        status: safeString(equipment.status) || "operational",
        last_maintenance_date: formatDateForInput(equipment.last_maintenance_date),
        next_maintenance_date: formatDateForInput(equipment.next_maintenance_date),
        maintenance_notes: safeString(equipment.maintenance_notes),
        description: safeString(equipment.description),
        quantity: equipment.quantity != null ? String(equipment.quantity) : "1",
        image_path: safeString(equipment.image_path)
      };
    }
    
    return {
      name: "",
      category: "cardio",
      brand: "",
      model: "",
      serial_number: "",
      purchase_date: "",
      purchase_price: "",
      warranty_end_date: "",
      location: "",
      condition: "good",
      status: "operational",
      last_maintenance_date: "",
      next_maintenance_date: "",
      maintenance_notes: "",
      description: "",
      quantity: "1",
      image_path: ""
    };
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = "Equipment name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.purchase_price && isNaN(formData.purchase_price)) {
      newErrors.purchase_price = "Purchase price must be a number";
    }
    if (formData.quantity && (isNaN(formData.quantity) || formData.quantity < 1)) {
      newErrors.quantity = "Quantity must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitFormData = new FormData();
    
    // Helper to append only non-empty values
    const appendIfValid = (field, value) => {
      if (value !== null && value !== undefined && value !== "" && value !== "undefined") {
        submitFormData.append(field, value);
      }
    };
    
    // Add all form fields
    appendIfValid("name", formData.name);
    appendIfValid("category", formData.category);
    appendIfValid("brand", formData.brand);
    appendIfValid("model", formData.model);
    appendIfValid("serial_number", formData.serial_number);
    appendIfValid("purchase_date", formData.purchase_date);
    if (formData.purchase_price && !isNaN(formData.purchase_price)) {
      submitFormData.append("purchase_price", parseFloat(formData.purchase_price));
    }
    appendIfValid("warranty_end_date", formData.warranty_end_date);
    appendIfValid("location", formData.location);
    appendIfValid("condition", formData.condition);
    appendIfValid("status", formData.status);
    appendIfValid("last_maintenance_date", formData.last_maintenance_date);
    appendIfValid("next_maintenance_date", formData.next_maintenance_date);
    appendIfValid("maintenance_notes", formData.maintenance_notes);
    appendIfValid("description", formData.description);
    if (formData.quantity && !isNaN(formData.quantity)) {
      submitFormData.append("quantity", parseInt(formData.quantity));
    }
    
    // Add image file if selected
    if (imageFile) {
      submitFormData.append("image", imageFile);
    }
    
    onSubmit(submitFormData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
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
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <Card className="bg-[#1A233A] border-slate-800 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50 pb-4">
            <CardTitle className="text-xl font-bold text-white">
              {equipment ? "Edit Equipment" : "Add New Equipment"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-800/50 pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">Equipment Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500 ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-slate-300">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger className={`bg-[#121A2F] border-slate-700 text-white ${errors.category ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A233A] border-slate-700 text-white">
                        <SelectItem value="cardio" className="hover:bg-slate-800">Cardio</SelectItem>
                        <SelectItem value="strength" className="hover:bg-slate-800">Strength</SelectItem>
                        <SelectItem value="free_weights" className="hover:bg-slate-800">Free Weights</SelectItem>
                        <SelectItem value="functional" className="hover:bg-slate-800">Functional</SelectItem>
                        <SelectItem value="accessories" className="hover:bg-slate-800">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand" className="text-slate-300">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleChange("brand", e.target.value)}
                      className="bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model" className="text-slate-300">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleChange("model", e.target.value)}
                      className="bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Serial Number and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serial_number" className="text-slate-300">Serial Number</Label>
                    <Input
                      id="serial_number"
                      value={formData.serial_number}
                      onChange={(e) => handleChange("serial_number", e.target.value)}
                      className="bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-slate-300">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="e.g., Main Floor, Cardio Zone"
                      className="bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Purchase & Warranty Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                  Purchase & Warranty Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="purchase_date" className="text-slate-300">Purchase Date</Label>
                    <Input
                      id="purchase_date"
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => handleChange("purchase_date", e.target.value)}
                      className="bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500 w-full hover:cursor-text"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchase_price" className="text-slate-300">Purchase Price ($)</Label>
                    <Input
                      id="purchase_price"
                      type="number"
                      step="0.01"
                      value={formData.purchase_price}
                      onChange={(e) => handleChange("purchase_price", e.target.value)}
                      className={`bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500 ${errors.purchase_price ? "border-red-500" : ""}`}
                    />
                    {errors.purchase_price && <p className="text-red-500 text-sm mt-1">{errors.purchase_price}</p>}
                  </div>
                  <div>
                    <Label htmlFor="warranty_end_date" className="text-slate-300">Warranty End Date</Label>
                    <Input
                      id="warranty_end_date"
                      type="date"
                      value={formData.warranty_end_date}
                      onChange={(e) => handleChange("warranty_end_date", e.target.value)}
                      className="bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500 w-full hover:cursor-text"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              </div>

              {/* Status & Availability Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                  Status & Availability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="condition" className="text-slate-300">Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => handleChange("condition", value)}
                    >
                      <SelectTrigger className="bg-[#121A2F] border-slate-700 text-white">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A233A] border-slate-700 text-white">
                        <SelectItem value="new" className="hover:bg-slate-800">🆕 New</SelectItem>
                        <SelectItem value="good" className="hover:bg-slate-800">✅ Good</SelectItem>
                        <SelectItem value="needs_repair" className="hover:bg-slate-800">⚠️ Needs Repair</SelectItem>
                        <SelectItem value="broken" className="hover:bg-slate-800">❌ Broken</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-slate-300">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger className="bg-[#121A2F] border-slate-700 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A233A] border-slate-700 text-white">
                        <SelectItem value="operational" className="hover:bg-slate-800">🟢 Operational</SelectItem>
                        <SelectItem value="maintenance" className="hover:bg-slate-800">🔧 Maintenance</SelectItem>
                        <SelectItem value="broken" className="hover:bg-slate-800">🔴 Broken</SelectItem>
                        <SelectItem value="retired" className="hover:bg-slate-800">⚫ Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-slate-300">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                      className={`bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500 ${errors.quantity ? "border-red-500" : ""}`}
                    />
                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                  </div>
                </div>
              </div>

              {/* Maintenance Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                  Maintenance Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="last_maintenance_date" className="text-slate-300">Last Maintenance Date</Label>
                    <Input
                      id="last_maintenance_date"
                      type="date"
                      value={formData.last_maintenance_date}
                      onChange={(e) => handleChange("last_maintenance_date", e.target.value)}
                      className="bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500 w-full hover:cursor-text"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="next_maintenance_date" className="text-slate-300">Next Maintenance Date</Label>
                    <Input
                      id="next_maintenance_date"
                      type="date"
                      value={formData.next_maintenance_date}
                      onChange={(e) => handleChange("next_maintenance_date", e.target.value)}
                      className="bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-500 w-full hover:cursor-text"
                      style={{ colorScheme: 'dark' }}
                    />
                    <p className="text-xs text-slate-500 mt-1">Recommended: Schedule next maintenance</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="maintenance_notes" className="text-slate-300">Maintenance Notes</Label>
                  <Textarea
                    id="maintenance_notes"
                    value={formData.maintenance_notes}
                    onChange={(e) => handleChange("maintenance_notes", e.target.value)}
                    placeholder="Maintenance history, issues, repairs, parts replaced..."
                    className="h-24 bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                  Additional Information
                </h3>

                <ImageUpload 
                  onImageSelect={setImageFile}
                  currentImage={equipment?.image_path ? getFileUrl(equipment.image_path) : null}
                />

                <div>
                  <Label htmlFor="description" className="text-slate-300">Equipment Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Detailed description, features, specifications, usage instructions..."
                    className="h-32 bg-[#121A2F] border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50 mt-6">
                <Button type="button" variant="outline" onClick={onCancel} className="border-slate-700 bg-[#121A2F] text-slate-300 hover:bg-slate-800 hover:text-white">
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  {equipment ? "Update Equipment" : "Add Equipment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
