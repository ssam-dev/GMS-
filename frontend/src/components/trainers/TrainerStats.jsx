import React, { useState, useEffect } from "react";
import { Trainer } from "@/entities/Trainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock, DollarSign, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function TrainerStats({ isLoading: parentLoading }) {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    onLeave: 0,
    avgHourlyRate: 0,
    totalCertifications: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const trainersData = await Trainer.list("-created_date", 200);
      
      if (!Array.isArray(trainersData)) {
        setStats({
          total: 0,
          active: 0,
          inactive: 0,
          onLeave: 0,
          avgHourlyRate: 0,
          totalCertifications: 0
        });
        return;
      }

      const validTrainers = trainersData.filter(t => t && typeof t === 'object');
      
      const active = validTrainers.filter(t => t.status === 'active').length;
      const inactive = validTrainers.filter(t => t.status === 'inactive').length;
      const onLeave = validTrainers.filter(t => t.status === 'on_leave').length;
      
      const trainersWithRates = validTrainers.filter(t => t.hourly_rate && !isNaN(t.hourly_rate));
      const avgHourlyRate = trainersWithRates.length > 0
        ? trainersWithRates.reduce((sum, t) => sum + Number(t.hourly_rate), 0) / trainersWithRates.length
        : 0;
      
      const totalCertifications = validTrainers.reduce((sum, t) => {
        if (Array.isArray(t.certifications)) {
          return sum + t.certifications.length;
        }
        return sum;
      }, 0);

      setStats({
        total: validTrainers.length,
        active,
        inactive,
        onLeave,
        avgHourlyRate: Number(avgHourlyRate.toFixed(2)),
        totalCertifications
      });
    } catch (error) {
      console.error("Error loading trainer stats:", error);
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
        onLeave: 0,
        avgHourlyRate: 0,
        totalCertifications: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { 
      title: "Total Trainers", 
      value: stats.total, 
      icon: Users, 
      color: "blue",
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      title: "Active Trainers", 
      value: stats.active, 
      icon: UserCheck, 
      color: "green",
      gradient: "from-green-500 to-green-600"
    },
    { 
      title: "Inactive/On Leave", 
      value: stats.inactive + stats.onLeave, 
      icon: UserX, 
      color: "red",
      gradient: "from-red-500 to-red-600"
    },
    { 
      title: "Avg Hourly Rate", 
      value: stats.avgHourlyRate > 0 ? `$${stats.avgHourlyRate}` : 'N/A', 
      icon: DollarSign, 
      color: "purple",
      gradient: "from-purple-500 to-purple-600"
    },
    { 
      title: "Total Certifications", 
      value: stats.totalCertifications, 
      icon: Award, 
      color: "orange",
      gradient: "from-orange-500 to-orange-600"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  {isLoading || parentLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
