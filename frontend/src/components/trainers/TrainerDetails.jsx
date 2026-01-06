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
  DollarSign,
  Clock,
  Award,
  User,
  MapPin,
    Star,
    FileText,
    Download,
    Eye
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const statusColors = {
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-red-100 text-red-700 border-red-200",
  on_leave: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const availabilityColors = {
  "Full Day": "bg-blue-100 text-blue-700",
  "Morning": "bg-orange-100 text-orange-700",
  "Evening": "bg-purple-100 text-purple-700",
  "Afternoon": "bg-green-100 text-green-700",
};

export default function TrainerDetails({ trainer, onEdit, onDelete, onClose }) {
  // Safety checks
  if (!trainer || typeof trainer !== 'object') return null;

  const getExperienceYears = () => {
    if (!trainer.hire_date) return 0;
    try {
      const hireDate = new Date(trainer.hire_date);
      const now = new Date();
      return Math.floor((now - hireDate) / (365.25 * 24 * 60 * 60 * 1000));
    } catch (e) {
      return 0;
    }
  };

  // Safe access to trainer properties - convert everything to strings
  const firstName = String(trainer.first_name || '');
  const lastName = String(trainer.last_name || '');
  const email = String(trainer.email || '');
  const phone = String(trainer.phone || '');
  const status = String(trainer.status || 'active');
  const availability = String(trainer.availability || '');
  
  // Ensure arrays are properly handled
  let specializations = [];
  if (Array.isArray(trainer.specializations)) {
    specializations = trainer.specializations.filter(s => s && typeof s === 'string').map(s => String(s));
  }
  
  let certifications = [];
  if (Array.isArray(trainer.certifications)) {
    certifications = trainer.certifications.filter(c => c && typeof c === 'string').map(c => String(c));
  }
  
  const hourlyRate = trainer.hourly_rate;
  const profilePhoto = trainer.profile_photo ? String(trainer.profile_photo) : '';
  const bio = String(trainer.bio || '');
  const hireDate = trainer.hire_date;
  
  // Debug logging
  console.log('TrainerDetails - Profile Photo:', profilePhoto);
  console.log('TrainerDetails - Full URL:', profilePhoto ? getFileUrl(profilePhoto) : 'No photo');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">
              Trainer Details
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
                    {profilePhoto ? (
                      <img
                        src={getFileUrl(profilePhoto)}
                        alt={`${firstName} ${lastName}`}
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 mx-auto"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-4xl">
                          {firstName.charAt(0) || 'T'}{lastName.charAt(0) || 'R'}
                        </span>
                      </div>
                    )}
                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${
                      status === 'active' ? 'bg-green-500' : 
                      status === 'on_leave' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-4">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {getExperienceYears()} years experience
                  </p>
                </div>

                {/* Status and Availability */}
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Badge className={statusColors[status] || statusColors.active} variant="secondary">
                      {status === 'on_leave' ? 'On Leave' : status}
                    </Badge>
                  </div>
                  {availability && (
                    <div className="flex justify-center">
                      <Badge 
                        variant="outline" 
                        className={availabilityColors[availability] || 'bg-slate-100 text-slate-700'}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {availability}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onEdit(trainer)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => onDelete(trainer.id)}
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
                      <div>
                        <p className="font-medium text-slate-900">Email</p>
                        <p className="text-sm text-slate-600">{email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900">Phone</p>
                        <p className="text-sm text-slate-600">{phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Employment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hireDate && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-slate-900">Hire Date</p>
                          <p className="text-sm text-slate-600">
                            {format(new Date(hireDate), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                    {hourlyRate && !isNaN(hourlyRate) && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium text-slate-900">Hourly Rate</p>
                          <p className="text-sm text-slate-600">${Number(hourlyRate).toFixed(2)}/hour</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specializations */}
                {specializations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((spec, index) => (
                        <Badge
                          key={`spec-${index}`}
                          variant="secondary"
                          className="bg-blue-100 text-blue-700"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert, index) => (
                        <Badge
                          key={`cert-${index}`}
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                  {/* Certificate Files */}
                  {trainer.certificate_files && trainer.certificate_files.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Certificate Documents
                      </h3>
                      <div className="space-y-2">
                        {trainer.certificate_files.map((fileUrl, index) => {
                          const fileName = fileUrl.split('/').pop();
                          const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
                          const isPDF = /\.pdf$/i.test(fileName);
                        
                          return (
                            <div key={`cert-file-${index}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {isPDF ? (
                                  <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                                ) : (
                                  <Eye className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-900 truncate">{fileName}</p>
                                  <p className="text-xs text-slate-500">
                                    {isPDF ? 'PDF Document' : 'Image File'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {isImage && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => window.open(getFileUrl(fileUrl), '_blank')}
                                    className="hover:bg-blue-100"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = getFileUrl(fileUrl);
                                    link.download = fileName;
                                    link.click();
                                  }}
                                  className="hover:bg-green-100"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Bio */}
                {bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      About
                    </h3>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-700 leading-relaxed">{bio}</p>
                    </div>
                  </div>
                )}

                {/* Performance Metrics (Placeholder) */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Performance Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">12</div>
                      <div className="text-sm text-blue-600">Active Clients</div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">4.8</div>
                      <div className="text-sm text-green-600">Rating</div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">156</div>
                      <div className="text-sm text-purple-600">Sessions This Month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
