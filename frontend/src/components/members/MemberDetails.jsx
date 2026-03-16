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
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  expired: "bg-red-500/10 text-red-500 border-red-500/20",
  suspended: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const membershipColors = {
  basic: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  premium: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  vip: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  student: "bg-green-500/10 text-green-500 border-green-500/20",
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
              Member Details
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
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
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 mx-auto shadow-2xl"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-slate-700">
                        <span className="text-white font-bold text-4xl">
                          {member.first_name[0]}{member.last_name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-4">
                    {member.first_name} {member.last_name}
                  </h2>
                  {member.date_of_birth && (
                    <p className="text-slate-400 mt-1">
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
                    className="flex-1 border-slate-700 bg-[#121A2F] text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => onEdit(member)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800/50"
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
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-800/50 pb-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-xl">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-300 text-sm">Email</p>
                        <button 
                          onClick={() => handleEmailClick(member.email)}
                          className="text-white hover:text-blue-400 transition-colors truncate block w-full text-left"
                        >
                          {member.email}
                        </button>
                      </div>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-xl">
                        <Phone className="w-5 h-5 text-green-400" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-300 text-sm">Phone</p>
                          <button 
                            onClick={() => handlePhoneCall(member.phone)}
                            className="text-white hover:text-green-400 transition-colors flex items-center gap-1"
                            title="Click to call"
                          >
                            {member.phone}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Membership Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-800/50 pb-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Membership Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-xl">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium text-slate-300 text-sm">Start Date</p>
                        <p className="text-white">
                          {member.membership_start_date 
                            ? format(new Date(member.membership_start_date), 'MMMM dd, yyyy')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-xl">
                      <Calendar className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="font-medium text-slate-300 text-sm">End Date</p>
                        <p className="text-white">
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
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-800/50 pb-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {member.emergency_contact_name && (
                        <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-xl">
                          <User className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="font-medium text-slate-300 text-sm">Contact Name</p>
                            <p className="text-white">{member.emergency_contact_name}</p>
                          </div>
                        </div>
                      )}
                      {member.emergency_contact_phone && (
                        <div className="flex items-center gap-3 p-3 bg-[#121A2F] border border-slate-800/50 rounded-xl">
                          <Phone className="w-5 h-5 text-red-400" />
                          <div>
                            <p className="font-medium text-slate-300 text-sm">Contact Phone</p>
                            <button 
                              onClick={() => handlePhoneCall(member.emergency_contact_phone)}
                              className="text-white hover:text-red-400 transition-colors flex items-center gap-1"
                              title="Click to call emergency contact"
                            >
                              {member.emergency_contact_phone}
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
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-800/50 pb-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Medical Information
                    </h3>
                    <div className="p-4 bg-[#121A2F] border border-slate-800/50 rounded-xl">
                      <p className="text-slate-300 leading-relaxed text-sm">{member.medical_conditions}</p>
                    </div>
                  </div>
                )}

                {/* Quick Contact Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800/50">
                  {member.phone && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-none"
                      onClick={() => handlePhoneCall(member.phone)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Member
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700 bg-[#121A2F] text-slate-300 hover:bg-slate-800 hover:text-white"
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
