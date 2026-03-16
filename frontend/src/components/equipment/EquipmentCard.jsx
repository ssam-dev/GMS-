import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/config/api";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  AlertTriangle,
  MapPin,
  Package
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isBefore } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const conditionColors = {
  new: "text-green-500",
  good: "text-blue-500",
  needs_repair: "text-yellow-500",
  broken: "text-red-500",
};

const statusColors = {
  operational: "text-green-500",
  maintenance: "text-yellow-500",
  broken: "text-red-500",
  retired: "text-slate-500",
};

const categoryIcons = {
  cardio: "🏃",
  strength: "💪",
  free_weights: "🏋️",
  functional: "🤸",
  accessories: "📦",
};

export default function EquipmentCard({ equipment, onEdit, onDelete, onViewDetails, highlightIssues = false }) {
  // Safety checks
  if (!equipment) return null;

  // Safe access to equipment properties with fallbacks
  const name = equipment.name || 'Unknown Equipment';
  const brand = equipment.brand;
  const model = equipment.model;
  const category = equipment.category || 'accessories';
  const condition = equipment.condition || 'good';
  const status = equipment.status || 'operational';
  const location = equipment.location;
  const quantity = equipment.quantity || 1;
  const imagePath = equipment.image_path;
  
  // Construct image URL - handle both full paths and relative paths
  const getImageUrl = () => {
    return getFileUrl(imagePath);
  };
  
  const imageUrl = getImageUrl();
  
  const nextMaintenanceDate = equipment.next_maintenance_date;
  const purchaseDate = equipment.purchase_date;

  const isMaintenanceDue = nextMaintenanceDate && 
    isBefore(new Date(nextMaintenanceDate), new Date());
  
  const hasIssues = condition === 'needs_repair' || 
    condition === 'broken' || 
    status === 'broken';

  const needsAttention = isMaintenanceDue || hasIssues;

  // Build subtitle only if brand or model exists
  const subtitle = [brand, model].filter(Boolean).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-[#121A2F] border-slate-800 shadow-none overflow-hidden hover:bg-[#1A233A] transition-colors relative group ${
        highlightIssues && needsAttention ? 'ring-1 ring-red-900/50' : ''
      }`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-500 hover:text-white hover:bg-slate-800 h-8 w-8 z-10">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1A233A] border-slate-800 text-white">
            <DropdownMenuItem onClick={() => onViewDetails(equipment)} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(equipment)} className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(equipment.id)} 
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
              <div className="w-12 h-12 bg-[#1A233A] border border-slate-800 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = categoryIcons[category] || "📦";
                    }}
                  />
                ) : (
                  <span>{categoryIcons[category] || "📦"}</span>
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-medium text-white text-sm truncate">
                  {name}
                </h3>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${statusColors[status] || statusColors.operational}`}>
                  {status}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider ml-1 ${conditionColors[condition] || conditionColors.good}`}>
                  ({condition.replace('_', ' ')})
                </span>
              </div>
              
              <p className="text-xs text-slate-400 truncate mb-2">
                {subtitle || "No brand/model info"}
              </p>
              
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Package className="w-3.5 h-3.5" />
                  <span className="capitalize">{category.replace('_', ' ')}</span>
                  {quantity > 1 && (
                    <span className="bg-[#1A233A] border border-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                      Qty: {quantity}
                    </span>
                  )}
                </div>
                {location && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </div>
              
              {/* Alerts */}
              {needsAttention && (
                <div className="mt-3 space-y-1">
                  {isMaintenanceDue && (
                    <div className="flex items-center gap-2 p-1.5 bg-yellow-900/20 border border-yellow-900/50 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="text-[10px] text-yellow-500 font-medium">
                        Maintenance due {format(new Date(nextMaintenanceDate), 'MMM d')}
                      </span>
                    </div>
                  )}
                  {hasIssues && (
                    <div className="flex items-center gap-2 p-1.5 bg-red-900/20 border border-red-900/50 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-[10px] text-red-500 font-medium">
                        Needs attention
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-800/50">
            <div className="text-[10px] text-slate-500 flex-1">
              {purchaseDate && `Purchased: ${format(new Date(purchaseDate), 'MMM yyyy')}`}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-slate-700 bg-[#1A233A] text-slate-300 hover:bg-slate-700 hover:text-white px-2 py-0"
                onClick={() => onViewDetails(equipment)}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-slate-700 bg-[#1A233A] text-slate-300 hover:bg-slate-700 hover:text-white px-2 py-0"
                onClick={() => onEdit(equipment)}
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
