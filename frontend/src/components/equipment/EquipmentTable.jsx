import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

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

export default function EquipmentTable({ equipment, onEdit, onDelete, onViewDetails, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-[#121A2F] border-slate-800 shadow-none">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-slate-800 rounded flex-1"></div>
                <div className="h-4 bg-slate-800 rounded w-20"></div>
                <div className="h-4 bg-slate-800 rounded w-20"></div>
                <div className="h-4 bg-slate-800 rounded w-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#121A2F] border-slate-800 shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1A233A] border-b border-slate-800">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Equipment</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Condition</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Next Maint.</th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {equipment.map((item, index) => {
                const isMaintenanceDue = item.next_maintenance_date && 
                  new Date(item.next_maintenance_date) <= new Date();
                const hasIssues = item.condition === 'needs_repair' || 
                  item.condition === 'broken' || item.status === 'broken';

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`hover:bg-[#1A233A] transition-colors ${
                      (isMaintenanceDue || hasIssues) ? 'bg-red-900/10' : ''
                    }`}
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-sm text-white">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            {item.brand} {item.model}
                          </p>
                        </div>
                        {(isMaintenanceDue || hasIssues) && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 ml-1" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm text-slate-300">
                      <span className="capitalize">
                        {item.category.replaceAll('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-slate-300">
                      <span>
                        {item.location || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`text-xs font-medium ${conditionColors[item.condition]}`}>
                        {item.condition.replaceAll('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`text-xs font-medium uppercase tracking-wider ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm">
                      {item.next_maintenance_date ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className={`w-3.5 h-3.5 ${isMaintenanceDue ? 'text-red-500' : 'text-slate-500'}`} />
                          <span className={`${
                            isMaintenanceDue ? 'text-red-500 font-medium' : 'text-slate-300'
                          }`}>
                            {format(new Date(item.next_maintenance_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-6 space-x-1 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => onViewDetails(item)}
                        aria-label={`View details for ${item.name || item.id}`}
                        title={`View details for ${item.name || item.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => onEdit(item)}
                        aria-label={`Edit ${item.name || item.id}`}
                        title={`Edit ${item.name || item.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-800"
                        onClick={() => onDelete(item.id)}
                        aria-label={`Delete ${item.name || item.id}`}
                        title={`Delete ${item.name || item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {equipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No equipment found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
