import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const conditionColors = {
  new: "bg-green-100 text-green-700",
  good: "bg-blue-100 text-blue-700",
  needs_repair: "bg-yellow-100 text-yellow-700",
  broken: "bg-red-100 text-red-700",
};

const statusColors = {
  operational: "bg-green-100 text-green-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  broken: "bg-red-100 text-red-700",
  retired: "bg-gray-100 text-gray-700",
};

export default function EquipmentTable({ equipment, onEdit, onDelete, onViewDetails, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-slate-200 rounded flex-1"></div>
                <div className="h-4 bg-slate-200 rounded w-20"></div>
                <div className="h-4 bg-slate-200 rounded w-20"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Equipment</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Location</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Condition</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Next Maintenance</th>
                <th className="text-right py-4 px-6 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
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
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      (isMaintenanceDue || hasIssues) ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-500">
                            {item.brand} {item.model}
                          </p>
                        </div>
                        {(isMaintenanceDue || hasIssues) && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize text-slate-700">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-700">
                        {item.location || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={conditionColors[item.condition]} variant="secondary">
                        {item.condition.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={statusColors[item.status]} variant="secondary">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      {item.next_maintenance_date ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className={`text-sm ${
                            isMaintenanceDue ? 'text-red-600 font-medium' : 'text-slate-600'
                          }`}>
                            {format(new Date(item.next_maintenance_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {equipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No equipment found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
