import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  active: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
  suspended: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const membershipColors = {
  basic: "bg-blue-100 text-blue-700",
  premium: "bg-purple-100 text-purple-700",
  vip: "bg-yellow-100 text-yellow-700",
  student: "bg-green-100 text-green-700",
};

export default function MemberCard({ member, onEdit, onDelete, onViewDetails }) {
  // Safety checks to ensure we have valid data
  if (!member) return null;

  console.log('Rendering MemberCard:', member); // Debug log

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
  const status = member.status || 'active';
  const membershipType = member.membership_type || 'basic';
  const membershipStartDate = member.membership_start_date;
  const membershipEndDate = member.membership_end_date;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {firstName[0] || 'M'}{lastName[0] || 'M'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {firstName} {lastName}
                </h3>
                <p className="text-sm text-slate-500">
                  {membershipStartDate 
                    ? `Member since ${format(new Date(membershipStartDate), 'MMM yyyy')}` 
                    : 'New member'
                  }
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {onViewDetails && (
                  <DropdownMenuItem onClick={() => onViewDetails(member)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onEdit(member)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(member._id)} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3">
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
                  className="hover:text-green-600 hover:underline transition-colors flex items-center gap-1"
                  title="Click to call"
                >
                  {phone}
                  <span className="text-xs text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    📞
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <Badge className={statusColors[status] || statusColors.active}>
              {status}
            </Badge>
            <Badge className={membershipColors[membershipType] || membershipColors.basic}>
              {membershipType}
            </Badge>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            <p>
              {membershipEndDate 
                ? `Expires: ${format(new Date(membershipEndDate), 'MMM d, yyyy')}` 
                : 'No expiry date'
              }
            </p>
          </div>

          {/* Quick Action Buttons */}
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
