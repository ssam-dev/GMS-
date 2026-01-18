import React, { useState, useEffect } from "react";
import { Member } from "@/entities/Member";
import { Trainer } from "@/entities/Trainer";
import { Equipment } from "@/entities/Equipment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Dumbbell, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/StatsCard";
import MembershipChart from "../components/dashboard/MembershipChart";

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [membersData, trainersData, equipmentData] = await Promise.all([
        Member.list(),
        Trainer.list(),
        Equipment.list()
      ]);

      setMembers(Array.isArray(membersData) ? membersData : []);
      setTrainers(Array.isArray(trainersData) ? trainersData : []);
      setEquipment(Array.isArray(equipmentData) ? equipmentData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      // Set empty arrays on error
      setMembers([]);
      setTrainers([]);
      setEquipment([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    const activeMembers = members.filter(m => m && m.status === 'active').length;
    const totalTrainers = trainers.filter(t => t && t.status === 'active').length;
    const equipmentIssues = equipment.filter(e => e && (e.status === 'maintenance' || e.status === 'broken')).length;
    const totalEquipment = equipment.length;

    return {
      activeMembers,
      totalTrainers,
      equipmentIssues,
      totalEquipment
    };
  };

  const stats = getStats();
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Welcome to GMS
          </h1>
          <p className="text-slate-600 text-lg">
            Your complete gym management dashboard
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatsCard
            title="Active Members"
            value={stats.activeMembers}
            icon={Users}
            color="blue"
            isLoading={isLoading}
          />
          <StatsCard
            title="Active Trainers"
            value={stats.totalTrainers}
            icon={UserCheck}
            color="green"
            isLoading={isLoading}
          />
          <StatsCard
            title="Total Equipment"
            value={stats.totalEquipment}
            icon={Dumbbell}
            color="purple"
            isLoading={isLoading}
          />
          <StatsCard
            title="Equipment Issues"
            value={stats.equipmentIssues}
            icon={Dumbbell}
            color="red"
            isLoading={isLoading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <MembershipChart members={members} isLoading={isLoading} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">New Members Today</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      {members.filter(m => m && m.created_date === today).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Active Trainers</span>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      {stats.totalTrainers}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-amber-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Maintenance Due</span>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700">
                      {equipment.filter(e => e && e.next_maintenance_date && e.next_maintenance_date <= today).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">New member registered</p>
                      <p className="text-xs text-slate-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Equipment maintenance completed</p>
                      <p className="text-xs text-slate-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">New trainer added</p>
                      <p className="text-xs text-slate-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
