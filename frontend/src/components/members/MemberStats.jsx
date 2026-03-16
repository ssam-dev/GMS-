import React, { useState, useEffect } from "react";
import { Member } from "@/entities/Member";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserX, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function MemberStats({ isLoading: parentLoading }) {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    newThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Fetch all members once and calculate stats client-side
      const allMembers = await Member.list("-created_date", 200);
      const members = Array.isArray(allMembers) ? allMembers : [];
      
      console.log('MemberStats - Raw data:', allMembers);
      console.log('MemberStats - Members array:', members);
      
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      const active = members.filter(m => m && m.status === 'active').length;
      const expired = members.filter(m => m && m.status === 'expired').length;
      const newThisMonth = members.filter(member => {
        if (!member || !member.created_date) return false;
        const memberMonth = new Date(member.created_date).toISOString().slice(0, 7);
        return memberMonth === currentMonth;
      }).length;

      setStats({
        total: members.length,
        active,
        expired,
        newThisMonth
      });
    } catch (error) {
      console.error("Error loading member stats:", error);
      setStats({ total: 0, active: 0, expired: 0, newThisMonth: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { 
      title: "Total Members", 
      value: stats.total, 
      icon: Users, 
      color: "blue",
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      title: "Active Members", 
      value: stats.active, 
      icon: UserPlus, 
      color: "green",
      gradient: "from-green-500 to-green-600"
    },
    { 
      title: "Expired Members", 
      value: stats.expired, 
      icon: UserX, 
      color: "red",
      gradient: "from-red-500 to-red-600"
    },
    { 
      title: "New This Month", 
      value: stats.newThisMonth, 
      icon: Clock, 
      color: "purple",
      gradient: "from-purple-500 to-purple-600"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-[#121A2F] border-slate-800 shadow-none hover:bg-[#1A233A] transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">{stat.title}</p>
                  {isLoading || parentLoading ? (
                    <Skeleton className="h-8 w-16 bg-slate-800" />
                  ) : (
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-none`}>
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
