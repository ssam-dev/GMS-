import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/entities/User";
import { X, User as UserIcon, Mail, Phone, MapPin, Upload, Camera, Link as LinkIcon, Trash2, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminProfileModal({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
    gym_name: user?.gym_name || "",
    gym_address: user?.gym_address || "",
    gym_phone: user?.gym_phone || "",
    profile_picture: user?.profile_picture || ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profile_picture || "");
  const [imageFile, setImageFile] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[\d\s()+\-]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        setImageFile(file);
        setImageLoadError(false);
        setShowUrlInput(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFileSelect(file);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFileSelect(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setProfileImagePreview(urlInput.trim());
      setFormData(prev => ({ ...prev, profile_picture: urlInput.trim() }));
      setImageFile(null);
      setImageLoadError(false);
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = () => {
    setProfileImagePreview("");
    setImageFile(null);
    setFormData(prev => ({ ...prev, profile_picture: "" }));
    setImageLoadError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .filter(n => n)
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // If there's an image file, you might want to upload it to a server first
      // For now, we'll use the preview or URL
      const submitData = {
        ...formData,
        profile_picture: imageFile ? profileImagePreview : formData.profile_picture
      };
      
      const updatedUser = await User.updateMyUserData(submitData);
      onUpdate(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Admin Profile Settings
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Picture Section */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {profileImagePreview && !imageLoadError ? (
                    <div className="relative">
                      <img
                        src={profileImagePreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                        onError={() => setImageLoadError(true)}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200">
                      <span className="text-white font-bold text-3xl">
                        {getInitials(formData.full_name)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Upload your profile picture</p>
                  
                  {/* Image Upload Buttons */}
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload File
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => cameraInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="gap-2"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {showUrlInput ? "Cancel URL" : "Use URL"}
                    </Button>
                  </div>

                  {/* URL Input */}
                  {showUrlInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2 max-w-md mx-auto"
                    >
                      <Input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/profile.jpg"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleUrlSubmit}
                        disabled={!urlInput.trim()}
                      >
                        Apply
                      </Button>
                    </motion.div>
                  )}

                  <p className="text-xs text-slate-500">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>

                {/* Hidden file inputs */}
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
                  capture="user"
                  className="hidden"
                  onChange={handleCameraCapture}
                />
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name" className="flex items-center gap-1">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                      placeholder="John Doe"
                      className={errors.full_name ? "border-red-500" : ""}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        {errors.full_name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john.doe@example.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        {errors.email}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">We'll never share your email</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">Include country code for international numbers</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="bio">Bio / About Me</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Tell us about yourself, your fitness journey, or your role at the gym..."
                    className="h-24 resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-500 mt-1 text-right">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Gym Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Gym Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gym_name">Gym Name</Label>
                    <Input
                      id="gym_name"
                      value={formData.gym_name}
                      onChange={(e) => handleChange("gym_name", e.target.value)}
                      placeholder="e.g., Elite Fitness Center"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gym_phone">Gym Phone</Label>
                    <Input
                      id="gym_phone"
                      type="tel"
                      value={formData.gym_phone}
                      onChange={(e) => handleChange("gym_phone", e.target.value)}
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="gym_address">Gym Address</Label>
                  <Textarea
                    id="gym_address"
                    value={formData.gym_address}
                    onChange={(e) => handleChange("gym_address", e.target.value)}
                    placeholder="456 Gym Street, Suite 100&#10;City, State, ZIP Code"
                    className="h-20 resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Full address including street, city, state, and ZIP</p>
                </div>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
