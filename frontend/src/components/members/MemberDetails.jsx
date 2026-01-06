import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/config/api";
import { 
  X, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  User,
  MapPin,
  AlertCircle,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const statusColors = {
  active: "bg-green-100 text-green-700 border-green-200",
  expired: "bg-red-100 text-red-700 border-red-200",
  suspended: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

const membershipColors = {
  basic: "bg-blue-100 text-blue-700",
  premium: "bg-purple-100 text-purple-700",
  vip: "bg-yellow-100 text-yellow-700",
  student: "bg-green-100 text-green-700",
};

export default function MemberDetails({ member, onEdit, onDelete, onClose }) {
  const handlePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
              Member Details
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile */}
              <div className="space-y-6">
                {/* Profile Picture and Basic Info */}
                <div className="text-center">
                  <div className="relative inline-block">
                    {member.profile_photo ? (
                      <img
                        src={getFileUrl(member.profile_photo)}
                        alt={`${member.first_name} ${member.last_name}`}
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 mx-auto"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-4xl">
                          {member.first_name[0]}{member.last_name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-4">
                    {member.first_name} {member.last_name}
                  </h2>
                  {member.date_of_birth && (
                    <p className="text-slate-600 mt-1">
                      {calculateAge(member.date_of_birth)} years old
                    </p>
                  )}
                </div>

                {/* Status and Membership */}
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Badge className={statusColors[member.status]} variant="secondary">
                      {member.status}
                    </Badge>
                  </div>
                  <div className="flex justify-center">
                    <Badge className={membershipColors[member.membership_type]} variant="secondary">
                      {member.membership_type} membership
                    </Badge>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onEdit(member)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => onDelete(member.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">Email</p>
                        <button 
                          onClick={() => handleEmailClick(member.email)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {member.email}
                        </button>
                      </div>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">Phone</p>
                          <button 
                            onClick={() => handlePhoneCall(member.phone)}
                            className="text-sm text-green-600 hover:underline flex items-center gap-1"
                            title="Click to call"
                          >
                            {member.phone}
                            <span className="text-xs">📞</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Membership Details */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Membership Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-slate-900">Start Date</p>
                        <p className="text-sm text-slate-600">
                          {member.membership_start_date 
                            ? format(new Date(member.membership_start_date), 'MMMM dd, yyyy')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-slate-900">End Date</p>
                        <p className="text-sm text-slate-600">
                          {member.membership_end_date 
                            ? format(new Date(member.membership_end_date), 'MMMM dd, yyyy')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {(member.emergency_contact_name || member.emergency_contact_phone) && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {member.emergency_contact_name && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <User className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="font-medium text-slate-900">Contact Name</p>
                            <p className="text-sm text-slate-600">{member.emergency_contact_name}</p>
                          </div>
                        </div>
                      )}
                      {member.emergency_contact_phone && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Phone className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="font-medium text-slate-900">Contact Phone</p>
                            <button 
                              onClick={() => handlePhoneCall(member.emergency_contact_phone)}
                              className="text-sm text-red-600 hover:underline flex items-center gap-1"
                              title="Click to call emergency contact"
                            >
                              {member.emergency_contact_phone}
                              <span className="text-xs">📞</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Medical Conditions */}
                {member.medical_conditions && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Medical Information
                    </h3>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-700 leading-relaxed">{member.medical_conditions}</p>
                    </div>
                  </div>
                )}

                {/* Quick Contact Actions */}
                <div className="flex gap-4 pt-4 border-t border-slate-200">
                  {member.phone && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handlePhoneCall(member.phone)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Member
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEmailClick(member.email)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
