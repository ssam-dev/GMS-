import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { format, isAfter, isBefore } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const conditionColors = {
  new: "bg-green-100 text-green-700 border-green-200",
  good: "bg-blue-100 text-blue-700 border-blue-200",
  needs_repair: "bg-yellow-100 text-yellow-700 border-yellow-200",
  broken: "bg-red-100 text-red-700 border-red-200",
};

const statusColors = {
  operational: "bg-green-100 text-green-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  broken: "bg-red-100 text-red-700",
  retired: "bg-gray-100 text-gray-700",
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
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Construct full URL for backend images
    const baseUrl = 'http://localhost:5000';
    return `${baseUrl}${imagePath}`;
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${
        highlightIssues && needsAttention ? 'ring-2 ring-red-200' : ''
      }`}>
        <CardContent className="p-6">
          {/* Header with actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = categoryIcons[category] || "📦";
                    }}
                  />
                ) : (
                  <span>{categoryIcons[category] || "📦"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">
                  {name}
                </h3>
                {subtitle && (
                  <p className="text-sm text-slate-500 truncate">
                    {subtitle}
                  </p>
                )}
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
                <DropdownMenuItem onClick={() => onViewDetails(equipment)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(equipment)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(equipment.id)} 
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Equipment Info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Package className="w-4 h-4" />
              <span className="capitalize">{category.replace('_', ' ')}</span>
              {quantity > 1 && (
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                  Qty: {quantity}
                </span>
              )}
            </div>
            {location && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>

          {/* Status and Condition */}
          <div className="flex items-center justify-between mb-4">
            <Badge className={conditionColors[condition] || conditionColors.good} variant="secondary">
              {condition.replace('_', ' ')}
            </Badge>
            <Badge className={statusColors[status] || statusColors.operational} variant="secondary">
              {status}
            </Badge>
          </div>

          {/* Alerts */}
          {needsAttention && (
            <div className="mb-4 space-y-2">
              {isMaintenanceDue && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-yellow-700">
                    Maintenance due {format(new Date(nextMaintenanceDate), 'MMM d')}
                  </span>
                </div>
              )}
              {hasIssues && (
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700">
                    Needs attention
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Purchase Info */}
          {purchaseDate && (
            <div className="text-xs text-slate-500 mb-4">
              Purchased: {format(new Date(purchaseDate), 'MMM yyyy')}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onViewDetails(equipment)}
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onEdit(equipment)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
