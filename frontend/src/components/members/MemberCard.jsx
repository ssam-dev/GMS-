import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Mail, Phone, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors = {
  active: "text-green-500",
  expired: "text-red-500",
  suspended: "text-yellow-500",
  cancelled: "text-gray-500",
};

export default function MemberCard({ member, onEdit, onDelete, onViewDetails }) {
  // Safety checks to ensure we have valid data
  if (!member) return null;

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

  // Safe access to member properties with fallbacks
  const firstName = member.first_name || '';
  const lastName = member.last_name || '';
  const email = member.email || '';
  const phone = member.phone || '';
  const status = member.status ? member.status.toLowerCase() : 'active';
  const membershipType = member.membership_type || 'Basic';
  const membershipEndDate = member.membership_end_date;

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
            {onViewDetails && (
              <DropdownMenuItem onClick={() => onViewDetails(member)} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onEdit(member)} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(member.id || member._id)} className="text-red-500 hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center shrink-0">
              <span className="text-blue-500 font-semibold text-sm">
                {firstName[0] || 'M'}{lastName[0] || 'M'}
              </span>
            </div>
            
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-medium text-white text-sm truncate">
                  {firstName} {lastName}
                </h3>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${statusColors[status] || statusColors.active}`}>
                  {status}
                </span>
              </div>
              
              <p className="text-xs text-slate-400 capitalize mb-2">
                {membershipType} Member
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
              
              <div className="mt-3 inline-block">
                <div className="px-2 py-0.5 bg-[#1A233A] border border-slate-800 text-xs text-slate-400 rounded-md">
                   {membershipType} 
                   {membershipEndDate ? ` (Expires ${format(new Date(membershipEndDate), 'MMM yyyy')})` : ''}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-800/50">
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
