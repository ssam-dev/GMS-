import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors = {
  active: "text-green-500",
  inactive: "text-red-500",
  on_leave: "text-yellow-500",
};

const availabilityColors = {
  "Full Day": "text-blue-500",
  "Morning": "text-orange-500",
  "Evening": "text-purple-500",
  "Afternoon": "text-green-500",
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
  const experience = getExperienceYears();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-[#121A2F] border-slate-800 shadow-none overflow-hidden hover:bg-[#1A233A] transition-colors relative group">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-500 hover:text-white hover:bg-slate-800 h-8 w-8 z-10">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1A233A] border-slate-800 text-white">
            <DropdownMenuItem onClick={() => onViewDetails(trainer)} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(trainer)} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(trainer.id)} 
              className="text-red-500 hover:bg-slate-800 focus:bg-slate-800 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              {profilePhoto ? (
                <img
                  src={getFileUrl(profilePhoto)}
                  alt={`${firstName} ${lastName}`}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-500 font-semibold text-sm">
                    {firstName.charAt(0) || 'T'}{lastName.charAt(0) || 'R'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-medium text-white text-sm truncate">
                  {firstName} {lastName}
                </h3>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${statusColors[status] || statusColors.active}`}>
                  {status === 'on_leave' ? 'ON LEAVE' : status}
                </span>
              </div>
              
              <p className="text-xs text-slate-400 capitalize mb-2 flex items-center gap-1 flex-wrap">
                {experience} years exp • 
                <span className={`${availabilityColors[availability] || 'text-slate-400'} flex items-center gap-1`}>
                  <Clock className="w-3 h-3" />
                  {availability || 'Not set'}
                </span>
              </p>
              
              <div className="space-y-1 mt-3">
                {email && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{phone}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {specializations.length > 0 ? (
                  specializations.slice(0, 2).map((spec, index) => (
                    <div
                      key={`spec-${index}`}
                      className="px-2 py-0.5 bg-[#1A233A] border border-slate-800 text-[10px] text-slate-400 rounded-md"
                    >
                      {spec}
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-0.5 bg-[#1A233A] border border-slate-800 text-[10px] text-slate-500 rounded-md">
                    No specializations
                  </div>
                )}
                {specializations.length > 2 && (
                  <div className="px-2 py-0.5 bg-[#1A233A] border border-slate-800 text-[10px] text-slate-500 rounded-md">
                    +{specializations.length - 2} more
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-800/50">
            <div className="flex-1 flex gap-2">
              <button 
                onClick={() => handlePhoneCall(phone)}
                className="flex-1 flex items-center justify-center gap-2 py-1.5 text-xs text-blue-500 hover:text-blue-400 transition-colors bg-blue-600/10 hover:bg-blue-600/20 rounded-lg disabled:opacity-50"
                disabled={!phone}
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </button>
              <button 
                onClick={() => handleEmailClick(email)}
                className="flex-1 flex items-center justify-center gap-2 py-1.5 text-xs text-blue-500 hover:text-blue-400 transition-colors bg-blue-600/10 hover:bg-blue-600/20 rounded-lg disabled:opacity-50"
                disabled={!email}
              >
                <span className="text-base leading-none relative -top-0.5">@</span>
                Email
              </button>
            </div>
            {hourlyRate && !isNaN(hourlyRate) && (
              <div className="text-right shrink-0 px-2">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Rate</span>
                <span className="text-sm font-bold text-white">${Number(hourlyRate).toFixed(2)}<span className="text-xs text-slate-500 font-normal">/hr</span></span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
