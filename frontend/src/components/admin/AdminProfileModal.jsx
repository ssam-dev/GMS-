import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/entities/User";
import { X, User as UserIcon, Mail, Phone, MapPin, Upload, Camera, Link as LinkIcon, Trash2, Save, Award } from "lucide-react";
import { motion } from "framer-motion";
import MultiFileUpload from "@/components/ui/MultiFileUpload";
import { getApiServerUrl } from "@/config/api";

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
    profile_picture: user?.profile_picture || "",
    certificates: user?.certificates || []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profile_picture || "");
  const [imageFile, setImageFile] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [certificateFiles, setCertificateFiles] = useState(() => 
    Array.isArray(user?.certificates) ? user.certificates : []
  );
  const [uploadingCertificates, setUploadingCertificates] = useState(false);
  
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

  const uploadProfilePhoto = async (file) => {
    if (!file) return null;
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      
      const response = await fetch(`${getApiServerUrl()}/api/upload/profile-photo`, {
        method: 'POST',
        body: formDataUpload
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload profile photo');
      }
      
      const data = await response.json();
      return data.url; // Returns the file URL
    } catch (error) {
      console.error('Profile photo upload error:', error);
      throw error;
    }
  };

  const uploadCertificates = async (files) => {
    if (!files || files.length === 0) return [];
    
    try {
      setUploadingCertificates(true);
      const formDataUpload = new FormData();
      files.forEach(file => {
        formDataUpload.append('files', file);
      });
      
      const response = await fetch(`${getApiServerUrl()}/api/upload/certificates`, {
        method: 'POST',
        body: formDataUpload
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload certificates');
      }
      
      const data = await response.json();
      return data.files || []; // Returns array of file objects with URLs
    } catch (error) {
      console.error('Certificates upload error:', error);
      throw error;
    } finally {
      setUploadingCertificates(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let profilePhotoUrl = formData.profile_picture;
      
      // Upload profile photo if a new file was selected
      if (imageFile) {
        try {
          profilePhotoUrl = await uploadProfilePhoto(imageFile);
        } catch (uploadError) {
          setErrors({ submit: "Failed to upload profile photo. Please try again." });
          setIsLoading(false);
          return;
        }
      }

      // Upload certificates if new files were selected
      let certificateUrls = Array.isArray(certificateFiles)
        ? certificateFiles.filter(file => typeof file === 'string')
        : [];
      const newFiles = Array.isArray(certificateFiles)
        ? certificateFiles.filter(file => typeof file !== 'string')
        : [];

      if (newFiles.length > 0) {
        try {
          const uploadedCerts = await uploadCertificates(newFiles);
          certificateUrls = [...certificateUrls, ...uploadedCerts.map(cert => cert.url)];
        } catch (uploadError) {
          setErrors({ submit: "Failed to upload certificates. Please try again." });
          setIsLoading(false);
          return;
        }
      }
      
      const submitData = {
        ...formData,
        profile_picture: profilePhotoUrl,
        certificates: certificateUrls
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
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Admin Profile Settings
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
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
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-2xl"
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
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-700">
                      <span className="text-white font-bold text-3xl">
                        {getInitials(formData.full_name)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-slate-400">Upload your profile picture</p>
                  
                  {/* Image Upload Buttons */}
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2 border-slate-700 bg-[#121A2F] text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Upload className="w-4 h-4" />
                      Upload File
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => cameraInputRef.current?.click()}
                      className="gap-2 border-slate-700 bg-[#121A2F] text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="gap-2 border-slate-700 bg-[#121A2F] text-slate-300 hover:bg-slate-800 hover:text-white"
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
                        className="flex-1 bg-[#121A2F] border-slate-700 text-white placeholder-slate-600"
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-800/50 pb-2">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name" className="flex items-center gap-1 text-slate-300">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                      placeholder="John Doe"
                      className={`bg-[#121A2F] border-slate-700 text-white placeholder-slate-600 ${errors.full_name ? "border-red-500" : ""}`}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        {errors.full_name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1 text-slate-300">
                      <Mail className="w-4 h-4" />
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john.doe@example.com"
                      className={`bg-[#121A2F] border-slate-700 text-white placeholder-slate-600 ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        {errors.email}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">We'll never share your email</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-1 text-slate-300">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`bg-[#121A2F] border-slate-700 text-white placeholder-slate-600 ${errors.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">Include country code for international numbers</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="123 Main St, Apt 4B"
                      className="bg-[#121A2F] border-slate-700 text-white placeholder-slate-600"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="bio" className="text-slate-300">Bio / About Me</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Tell us about yourself, your fitness journey, or your role at the gym..."
                    className="h-24 resize-none bg-[#121A2F] border-slate-700 text-white placeholder-slate-600"
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-500 mt-1 text-right">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Certificates Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  Certificates & Qualifications
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">
                    Upload your professional certificates, qualifications, or licenses (PDF or images)
                  </p>
                  <MultiFileUpload
                    label="Upload Certificates"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    maxFiles={10}
                    maxSize={5 * 1024 * 1024}
                    onFilesSelect={setCertificateFiles}
                    currentFiles={certificateFiles}
                    enableCamera={false}
                  />
                  {uploadingCertificates && (
                    <div className="text-sm text-blue-600 flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      Uploading certificates...
                    </div>
                  )}
                </div>
              </div>

              {/* Gym Information */}
              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Gym Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gym_name" className="text-slate-300">Gym Name</Label>
                    <Input
                      id="gym_name"
                      value={formData.gym_name}
                      onChange={(e) => handleChange("gym_name", e.target.value)}
                      placeholder="e.g., Elite Fitness Center"
                      className="bg-[#121A2F] border-slate-700 text-white placeholder-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gym_phone" className="text-slate-300">Gym Phone</Label>
                    <Input
                      id="gym_phone"
                      type="tel"
                      value={formData.gym_phone}
                      onChange={(e) => handleChange("gym_phone", e.target.value)}
                      placeholder="+1 (555) 987-6543"
                      className="bg-[#121A2F] border-slate-700 text-white placeholder-slate-600"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="gym_address" className="text-slate-300">Gym Address</Label>
                  <Textarea
                    id="gym_address"
                    value={formData.gym_address}
                    onChange={(e) => handleChange("gym_address", e.target.value)}
                    placeholder="456 Gym Street, Suite 100&#10;City, State, ZIP Code"
                    className="h-20 resize-none bg-[#121A2F] border-slate-700 text-white placeholder-slate-600"
                  />
                  <p className="text-xs text-slate-500 mt-1">Full address including street, city, state, and ZIP</p>
                </div>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg">
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 bg-[#121A2F] text-slate-300 hover:bg-slate-800 hover:text-white">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
