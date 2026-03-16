import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, Wrench, Eye, Edit } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";

export default function MaintenanceDue({ equipment, onEdit, onViewDetails, isLoading }) {
  const today = new Date();
  
  const maintenanceItems = equipment
    .filter(item => item.next_maintenance_date)
    .map(item => ({
      ...item,
      daysOverdue: differenceInDays(today, new Date(item.next_maintenance_date))
    }))
    .filter(item => item.daysOverdue >= 0)
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  const upcomingMaintenance = equipment
    .filter(item => item.next_maintenance_date)
    .map(item => ({
      ...item,
      daysUntil: differenceInDays(new Date(item.next_maintenance_date), today)
    }))
    .filter(item => item.daysUntil > 0 && item.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-[#121A2F] border border-slate-800 rounded-xl p-6 shadow-none animate-pulse">
              <div className="h-4 bg-slate-800 rounded mb-2"></div>
              <div className="h-3 bg-slate-800 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-slate-800 rounded flex-1"></div>
                <div className="h-6 bg-slate-800 rounded flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overdue Maintenance */}
      {maintenanceItems.length > 0 && (
        <Card className="bg-[#121A2F] border-slate-800 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500 text-lg">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              Overdue Maintenance ({maintenanceItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {maintenanceItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col p-4 bg-red-900/10 border border-red-900/50 rounded-lg hover:bg-red-900/20 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-white truncate pr-2">{item.name}</h4>
                      <div className="shrink-0 bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.daysOverdue} days overdue
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-red-400" />
                        Due: {format(new Date(item.next_maintenance_date), 'MMM d, yyyy')}
                      </span>
                      {item.location && (
                        <span className="truncate">📍 {item.location}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-700 bg-[#1A233A] text-slate-300 hover:bg-slate-700 hover:text-white h-8 text-xs"
                      onClick={() => onViewDetails(item)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-900/50 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 h-8 text-xs"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="w-3.5 h-3.5 mr-1.5" />
                      Update
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Maintenance */}
      {upcomingMaintenance.length > 0 && (
        <Card className="bg-[#121A2F] border-slate-800 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-500 text-lg">
              <Wrench className="w-5 h-5 flex-shrink-0" />
              Upcoming Maintenance ({upcomingMaintenance.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMaintenance.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col p-4 bg-yellow-900/10 border border-yellow-900/30 rounded-lg hover:bg-yellow-900/20 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-white truncate pr-2">{item.name}</h4>
                      <div className="shrink-0 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        in {item.daysUntil} days
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                        Due: {format(new Date(item.next_maintenance_date), 'MMM d, yyyy')}
                      </span>
                      {item.location && (
                        <span className="truncate">📍 {item.location}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-700 bg-[#1A233A] text-slate-300 hover:bg-slate-700 hover:text-white h-8 text-xs"
                      onClick={() => onViewDetails(item)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-yellow-900/30 bg-yellow-900/10 text-yellow-500 hover:bg-yellow-900/20 hover:text-yellow-400 h-8 text-xs"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="w-3.5 h-3.5 mr-1.5" />
                      Update
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Maintenance Due */}
      {maintenanceItems.length === 0 && upcomingMaintenance.length === 0 && (
        <Card className="bg-[#121A2F] border-slate-800 shadow-none">
          <CardContent className="text-center py-12">
            <Wrench className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              All Equipment Up to Date
            </h3>
            <p className="text-slate-400 text-sm">
              No maintenance is currently due or overdue
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
