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
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-slate-200 rounded flex-1"></div>
                <div className="h-6 bg-slate-200 rounded flex-1"></div>
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
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Overdue Maintenance ({maintenanceItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      <Badge className="bg-red-100 text-red-700">
                        {item.daysOverdue} days overdue
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {format(new Date(item.next_maintenance_date), 'MMM d, yyyy')}
                      </span>
                      {item.location && (
                        <span>📍 {item.location}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(item)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
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
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Wrench className="w-5 h-5" />
              Upcoming Maintenance ({upcomingMaintenance.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMaintenance.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        in {item.daysUntil} days
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {format(new Date(item.next_maintenance_date), 'MMM d, yyyy')}
                      </span>
                      {item.location && (
                        <span>📍 {item.location}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(item)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
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
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Wrench className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              All Equipment Up to Date
            </h3>
            <p className="text-slate-500">
              No maintenance is currently due or overdue
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
