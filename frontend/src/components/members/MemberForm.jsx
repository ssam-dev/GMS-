import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function MemberForm({ member, onSubmit, onCancel }) {
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

  const [formData, setFormData] = useState(member ? {
    ...member,
    date_of_birth: formatDateForInput(member.date_of_birth),
    membership_start_date: formatDateForInput(member.membership_start_date),
    membership_end_date: formatDateForInput(member.membership_end_date)
  } : {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    membership_type: "basic",
    membership_start_date: "",
    membership_end_date: "",
    status: "active",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    medical_conditions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Membership type configurations
  const membershipConfig = {
    basic: { label: "Basic", duration: "1 month", color: "text-slate-600" },
    premium: { label: "Premium", duration: "6 months", color: "text-blue-600" },
    vip: { label: "VIP", duration: "1 year", color: "text-purple-600" },
    student: { label: "Student", duration: "3 months", color: "text-green-600" }
  };

  const getCurrentMembershipConfig = () => {
    return membershipConfig[formData.membership_type] || membershipConfig.basic;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.membership_type) {
      newErrors.membership_type = "Membership type is required";
    }
    if (formData.membership_start_date && formData.membership_end_date) {
      const startDate = new Date(formData.membership_start_date);
      const endDate = new Date(formData.membership_end_date);
      if (endDate <= startDate) {
        newErrors.membership_end_date = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate end date based on membership type and start date
  const calculateEndDate = (startDate, membershipType) => {
    if (!startDate) return "";
    
    const start = new Date(startDate);
    let end = new Date(start);
    
    switch (membershipType) {
      case "basic":
        end.setMonth(end.getMonth() + 1);
        break;
      case "premium":
        end.setMonth(end.getMonth() + 6);
        break;
      case "vip":
        end.setFullYear(end.getFullYear() + 1);
        break;
      case "student":
        end.setMonth(end.getMonth() + 3);
        break;
      default:
        end.setMonth(end.getMonth() + 1);
    }
    
    return end.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(member ? "Member updated successfully!" : "Member added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate end date when start date or membership type changes
      if (field === "membership_start_date" || field === "membership_type") {
        const startDate = field === "membership_start_date" ? value : prev.membership_start_date;
        const membershipType = field === "membership_type" ? value : prev.membership_type;
        
        if (startDate) {
          updated.membership_end_date = calculateEndDate(startDate, membershipType);
        }
      }
      
      return updated;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">
              {member ? "Edit Member" : "Add New Member"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel} disabled={isSubmitting}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    className={errors.first_name ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    className={errors.last_name ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Membership Type Section with Visual Separator */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Membership Information
                </h3>
                
                <div>
                  <Label htmlFor="membership_type">Membership Type *</Label>
                  <Select
                    value={formData.membership_type}
                    onValueChange={(value) => handleChange("membership_type", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={errors.membership_type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select membership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic - 1 month</SelectItem>
                      <SelectItem value="premium">Premium - 6 months</SelectItem>
                      <SelectItem value="vip">VIP - 1 year</SelectItem>
                      <SelectItem value="student">Student - 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.membership_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.membership_type}</p>
                  )}
                  {/* Display selected membership info */}
                  <div className={`mt-2 p-2 rounded-md bg-slate-50 border border-slate-200 ${getCurrentMembershipConfig().color}`}>
                    <p className="text-sm font-medium">
                      Selected: {getCurrentMembershipConfig().label} 
                      <span className="text-slate-600 ml-1">
                        (Duration: {getCurrentMembershipConfig().duration})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Membership Dates Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="membership_start_date">Membership Start Date</Label>
                  <Input
                    id="membership_start_date"
                    type="date"
                    value={formData.membership_start_date}
                    onChange={(e) => handleChange("membership_start_date", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="membership_end_date">
                    {getCurrentMembershipConfig().label} Membership End Date
                  </Label>
                  <Input
                    id="membership_end_date"
                    type="date"
                    value={formData.membership_end_date}
                    onChange={(e) => handleChange("membership_end_date", e.target.value)}
                    disabled={isSubmitting}
                    placeholder=""
                  />
                  {errors.membership_end_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.membership_end_date}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Recommended duration: {getCurrentMembershipConfig().duration}
                  </p>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Emergency Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleChange("emergency_contact_phone", e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="medical_conditions">Medical Conditions</Label>
                  <Textarea
                    id="medical_conditions"
                    value={formData.medical_conditions}
                    onChange={(e) => handleChange("medical_conditions", e.target.value)}
                    placeholder="Any medical conditions or notes..."
                    className="h-24"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : member ? "Update Member" : "Add Member"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
