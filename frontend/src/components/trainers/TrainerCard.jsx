import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/config/api";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Eye, 
  Clock, 
  Award,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function TrainerCard({ trainer, onEdit, onDelete, onViewDetails }) {
  // Safety checks
  if (!trainer || typeof trainer !== 'object') return null;

  const handlePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleEmailClick = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

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

  // Safe access to trainer properties with fallbacks - ensure all are strings
  const firstName = String(trainer.first_name || '');
  const lastName = String(trainer.last_name || '');
  const email = String(trainer.email || '');
  const phone = String(trainer.phone || '');
  const status = String(trainer.status || 'active');
  const availability = String(trainer.availability || '');
  
  // Ensure specializations is an array of strings
  let specializations = [];
  if (Array.isArray(trainer.specializations)) {
    specializations = trainer.specializations.filter(s => s && typeof s === 'string').map(s => String(s));
  }
  
  const hourlyRate = trainer.hourly_rate;
  const profilePhoto = trainer.profile_photo ? String(trainer.profile_photo) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          {/* Header with actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                {profilePhoto ? (
                  <img
                    src={getFileUrl(profilePhoto)}
                    alt={`${firstName} ${lastName}`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {firstName.charAt(0) || 'T'}{lastName.charAt(0) || 'R'}
                    </span>
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  status === 'active' ? 'bg-green-500' : 
                  status === 'on_leave' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">
                  {firstName} {lastName}
                </h3>
                <p className="text-sm text-slate-500">
                  {getExperienceYears()} years experience
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onViewDetails(trainer)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(trainer)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(trainer.id)} 
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4" />
              <button 
                onClick={() => handleEmailClick(email)}
                className="hover:text-blue-600 hover:underline transition-colors truncate"
                title={email}
              >
                {email || 'No email'}
              </button>
            </div>
            {phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" />
                <button 
                  onClick={() => handlePhoneCall(phone)}
                  className="hover:text-green-600 hover:underline transition-colors"
                  title="Click to call"
                >
                  {phone}
                </button>
              </div>
            )}
          </div>

          {/* Specializations */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {specializations.length > 0 ? (
                specializations.slice(0, 2).map((spec, index) => (
                  <Badge
                    key={`spec-${index}`}
                    variant="secondary"
                    className="text-xs bg-slate-100 text-slate-700"
                  >
                    {spec}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-xs text-slate-500">
                  No specializations
                </Badge>
              )}
              {specializations.length > 2 && (
                <Badge variant="outline" className="text-xs text-slate-500">
                  +{specializations.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          {/* Status and Availability */}
          <div className="flex items-center justify-between">
            <Badge className={statusColors[status] || statusColors.active} variant="secondary">
              {status === 'on_leave' ? 'On Leave' : status}
            </Badge>
            {availability && (
              <Badge 
                variant="outline" 
                className={`text-xs ${availabilityColors[availability] || 'bg-slate-100 text-slate-700'}`}
              >
                <Clock className="w-3 h-3 mr-1" />
                {availability}
              </Badge>
            )}
          </div>

          {/* Hourly Rate */}
          {hourlyRate && !isNaN(hourlyRate) && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Hourly Rate</span>
                <span className="text-lg font-bold text-slate-900">${Number(hourlyRate).toFixed(2)}/hr</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            {phone && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                onClick={() => handlePhoneCall(phone)}
              >
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              onClick={() => handleEmailClick(email)}
            >
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
