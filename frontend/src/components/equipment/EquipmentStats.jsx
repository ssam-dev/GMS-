import React, { useState, useEffect } from "react";
import { Equipment } from "@/entities/Equipment";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package, 
  AlertTriangle, 
  Wrench, 
  CheckCircle, 
  DollarSign,
  Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function EquipmentStats({ isLoading: parentLoading }) {
  const [stats, setStats] = useState({
    total: 0,
    operational: 0,
    needsRepair: 0,
    inMaintenance: 0,
    totalValue: 0,
    maintenanceDue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get equipment data efficiently - fetch a reasonable amount for stats
      const equipmentData = await Equipment.list("-created_date", 200);
      
      if (!Array.isArray(equipmentData)) {
        setStats({
          total: 0,
          operational: 0,
          needsRepair: 0,
          inMaintenance: 0,
          totalValue: 0,
          maintenanceDue: 0
        });
        return;
      }

      const operational = equipmentData.filter(e => e && e.status === 'operational').length;
      const inMaintenance = equipmentData.filter(e => e && e.status === 'maintenance').length;
      const needsRepair = equipmentData.filter(e => 
        e && (e.condition === 'needs_repair' || e.condition === 'broken' || e.status === 'broken')
      ).length;
      
      const totalValue = equipmentData.reduce((sum, e) => sum + (e && e.purchase_price ? Number(e.purchase_price) : 0), 0);
      
      const today = new Date().toISOString().split('T')[0];
      const maintenanceDue = equipmentData.filter(e => {
        if (!e || !e.next_maintenance_date) return false;
        return e.next_maintenance_date <= today;
      }).length;

      setStats({
        total: equipmentData.length,
        operational,
        needsRepair,
        inMaintenance,
        totalValue,
        maintenanceDue
      });
    } catch (error) {
      console.error("Error loading equipment stats:", error);
      setStats({
        total: 0,
        operational: 0,
        needsRepair: 0,
        inMaintenance: 0,
        totalValue: 0,
        maintenanceDue: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { 
      title: "Total Equipment", 
      value: String(stats.total), 
      icon: Package, 
      color: "blue",
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      title: "Operational", 
      value: String(stats.operational), 
      icon: CheckCircle, 
      color: "green",
      gradient: "from-green-500 to-green-600"
    },
    { 
      title: "Needs Attention", 
      value: String(stats.needsRepair), 
      icon: AlertTriangle, 
      color: "red",
      gradient: "from-red-500 to-red-600"
    },
    { 
      title: "In Maintenance", 
      value: String(stats.inMaintenance), 
      icon: Wrench, 
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600"
    },
    { 
      title: "Total Value", 
      value: stats.totalValue > 0 ? `$${stats.totalValue.toLocaleString()}` : 'N/A', 
      icon: DollarSign, 
      color: "purple",
      gradient: "from-purple-500 to-purple-600"
    },
    { 
      title: "Maintenance Due", 
      value: String(stats.maintenanceDue), 
      icon: Calendar, 
      color: "orange",
      gradient: "from-orange-500 to-orange-600"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500 mb-1">{stat.title}</p>
                  {isLoading || parentLoading ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                    <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                  )}
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-md`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
