import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { motion } from "framer-motion";
import FileUpload from "@/components/ui/FileUpload";
import MultiFileUpload from "@/components/ui/MultiFileUpload";
import { getApiServerUrl } from "@/config/api";

const commonSpecializations = [
  "Personal Training",
  "Weight Training",
  "Cardio",
  "Yoga",
  "Pilates",
  "Crossfit",
  "Functional Training",
  "Nutrition",
  "Rehabilitation",
  "Sports Training",
  "HIIT",
  "Strength Training",
  "Boxing",
  "Dance Fitness",
  "Aqua Fitness"
];

const commonCertifications = [
  "NASM-CPT",
  "ACSM-CPT",
  "ACE-CPT",
  "NSCA-CPT",
  "ISSA-CPT",
  "RYT-200",
  "RYT-500",
  "CrossFit Level 1",
  "First Aid/CPR",
  "Nutrition Certification"
];

export default function TrainerForm({ trainer, onSubmit, onCancel }) {
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
    
    if (trainer) {
      // Convert certifications string to array for editing
      const certArray = typeof trainer.certifications === 'string' && trainer.certifications 
        ? trainer.certifications.split(',').map(c => c.trim()).filter(Boolean)
        : Array.isArray(trainer.certifications) ? trainer.certifications : [];
      
      // Convert specializations to array if needed
      const specArray = typeof trainer.specialization === 'string' && trainer.specialization
        ? [trainer.specialization]
        : Array.isArray(trainer.specializations) ? trainer.specializations : [];
      
      return {
        first_name: safeString(trainer.first_name),
        last_name: safeString(trainer.last_name),
        email: safeString(trainer.email),
        phone: safeString(trainer.phone),
        specializations: specArray,
        certifications: certArray,
        hire_date: formatDateForInput(trainer.hire_date),
        hourly_rate: trainer.hourly_rate != null ? String(trainer.hourly_rate) : "",
        bio: safeString(trainer.bio),
        status: safeString(trainer.status) || "active",
        availability: safeString(trainer.availability) || "Full Day",
        profile_photo: safeString(trainer.profile_photo),
        specialization: safeString(trainer.specialization)
      };
    }
    
    return {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specializations: [],
      certifications: [],
      hire_date: "",
      hourly_rate: "",
      bio: "",
      status: "active",
      availability: "Full Day",
      profile_photo: "",
      specialization: ""
    };
  });

  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [certificateFiles, setCertificateFiles] = useState(() => {
    // Initialize with existing certificate files from trainer
    const existingFiles = Array.isArray(trainer?.certificate_files) ? trainer.certificate_files : [];
    console.log('📋 Initializing certificate files from trainer:', existingFiles);
    return existingFiles;
  });
  const [uploading, setUploading] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [errors, setErrors] = useState({});

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
      console.log('Profile photo uploaded:', data);
      console.log('Returned URL:', data.url);
      return data.url; // Returns the file URL
    } catch (error) {
      console.error('Profile photo upload error:', error);
      return null;
    }
  };

  const uploadCertificates = async (files) => {
    if (!files || files.length === 0) return [];
    
    try {
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
      return [];
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.hourly_rate && isNaN(formData.hourly_rate)) {
      newErrors.hourly_rate = "Hourly rate must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);

    try {
      // Upload profile photo if selected
      let profilePhotoUrl = formData.profile_photo || '';
      if (profilePhotoFile) {
        profilePhotoUrl = await uploadProfilePhoto(profilePhotoFile) || '';
      }

      // Upload certificates if selected; preserve existing URLs when editing
      let certificateUrls = Array.isArray(certificateFiles)
        ? certificateFiles.filter(file => typeof file === 'string' && file.trim() !== '')
        : [];
      const newFiles = Array.isArray(certificateFiles)
        ? certificateFiles.filter(file => typeof file !== 'string' && file instanceof File)
        : [];

      console.log('📋 Certificate files state:', certificateFiles);
      console.log('📋 Existing certificate URLs:', certificateUrls);
      console.log('📋 New files to upload:', newFiles.length);

      if (newFiles.length > 0) {
        try {
          const uploadedCerts = await uploadCertificates(newFiles);
          console.log('✅ Uploaded certificates:', uploadedCerts);
          certificateUrls = [...certificateUrls, ...uploadedCerts.map(cert => cert.url)];
        } catch (uploadError) {
          console.error('❌ Certificate upload error:', uploadError);
          throw new Error(`Failed to upload certificates: ${uploadError.message}`);
        }
      }

      console.log('📋 Final certificate URLs to save:', certificateUrls);

      const submitData = {
        ...formData,
        profile_photo: profilePhotoUrl,
        certificate_files: certificateUrls,
        // Convert certifications array to comma-separated string for backend
        certifications: Array.isArray(formData.certifications) 
          ? formData.certifications.join(', ') 
          : formData.certifications,
        // Pick first specialization for backend single field
        specialization: Array.isArray(formData.specializations) && formData.specializations.length > 0
          ? formData.specializations[0]
          : (formData.specialization || (formData.specializations && formData.specializations[0]) || 'General Training'),
        // Also send specializations array for backend
        specializations: Array.isArray(formData.specializations) ? formData.specializations : [],
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null
      };
      
      console.log('📤 Submitting trainer data:', submitData);
      console.log('📤 Certificate files being saved:', submitData.certificate_files);
      console.log('📤 Profile photo URL being saved:', profilePhotoUrl);
      
      onSubmit(submitData);
    } catch (error) {
      console.error('❌ Submit error:', error);
      setErrors({ submit: error.message || 'Failed to save trainer. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addSpecialization = (spec) => {
    if (spec && !formData.specializations.includes(spec)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, spec]
      }));
    }
    setNewSpecialization("");
  };

  const removeSpecialization = (spec) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec)
    }));
  };

  const addCertification = (cert) => {
    if (cert && !formData.certifications.includes(cert)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert]
      }));
    }
    setNewCertification("");
  };

  const removeCertification = (cert) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
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
              {trainer ? "Edit Trainer" : "Add New Trainer"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide border-b border-slate-200 pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    className={errors.first_name ? "border-red-500" : ""}
                  />
                  {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    className={errors.last_name ? "border-red-500" : ""}
                  />
                  {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                </div>
              </div>

              {/* Employment Details Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hire_date">Hire Date</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => handleChange("hire_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate}
                    onChange={(e) => handleChange("hourly_rate", e.target.value)}
                    className={errors.hourly_rate ? "border-red-500" : ""}
                  />
                  {errors.hourly_rate && <p className="text-red-500 text-sm mt-1">{errors.hourly_rate}</p>}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={formData.availability}
                    onValueChange={(value) => handleChange("availability", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Day">Full Day</SelectItem>
                      <SelectItem value="Morning">Morning (6 AM - 12 PM)</SelectItem>
                      <SelectItem value="Afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                      <SelectItem value="Evening">Evening (6 PM - 10 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Profile & Credentials Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Profile & Credentials
                </h3>

              <div>
                <Label className="mb-3 block">Profile Photo</Label>
                <FileUpload
                  label="Upload Profile Photo"
                  accept=".jpg,.jpeg,.png,.webp"
                  maxSize={5 * 1024 * 1024}
                  onFileSelect={setProfilePhotoFile}
                  currentFile={formData.profile_photo ? { name: "Current Photo" } : null}
                  onRemove={() => setProfilePhotoFile(null)}
                />
              </div>

              <div>
                <Label>Specializations</Label>
                <p className="text-xs text-slate-500 mb-2">Add trainer's areas of expertise (click badge to remove)</p>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 min-h-[32px]">
                    {formData.specializations.map((spec) => (
                      <Badge
                        key={spec}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeSpecialization(spec)}
                      >
                        {spec}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={newSpecialization}
                      onValueChange={setNewSpecialization}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonSpecializations
                          .filter(spec => !formData.specializations.includes(spec))
                          .map(spec => (
                            <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addSpecialization(newSpecialization)}
                      disabled={!newSpecialization}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Or add custom specialization"
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization(newSpecialization))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addSpecialization(newSpecialization)}
                      disabled={!newSpecialization}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Certifications</Label>
                <p className="text-xs text-slate-500 mb-2">Add professional certifications (click badge to remove)</p>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 min-h-[32px]">
                    {formData.certifications.map((cert) => (
                      <Badge
                        key={cert}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeCertification(cert)}
                      >
                        {cert}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={newCertification}
                      onValueChange={setNewCertification}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select certification" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonCertifications
                          .filter(cert => !formData.certifications.includes(cert))
                          .map(cert => (
                            <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addCertification(newCertification)}
                      disabled={!newCertification}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Or add custom certification"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification(newCertification))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addCertification(newCertification)}
                      disabled={!newCertification}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Certificate Files Upload */}
              <div>
                <Label className="mb-3 block">Certificate Files</Label>
                <MultiFileUpload
                  label="Upload Certificate Files"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  maxSize={5 * 1024 * 1024}
                  maxFiles={10}
                  onFilesSelect={setCertificateFiles}
                  currentFiles={certificateFiles}
                />
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Brief professional biography highlighting experience and approach..."
                  className="h-32"
                />
              </div>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : (trainer ? "Update Trainer" : "Add Trainer")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
