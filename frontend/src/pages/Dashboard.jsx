import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Member } from "@/entities/Member";
import { Trainer } from "@/entities/Trainer";
import { Equipment } from "@/entities/Equipment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Dumbbell, TrendingUp, Clock, AlertTriangle, Plus } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/StatsCard";
import MembershipChart from "../components/dashboard/MembershipChart";

export default function Dashboard() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 text-white pb-20">
        <div className="animate-pulse space-y-3">
          <div className="h-7 w-52 bg-[#121A2F] rounded" />
          <div className="h-4 w-72 bg-[#121A2F] rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="h-24 bg-[#121A2F] border border-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-white pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1">
          Welcome to GMS
        </h1>
        <p className="text-sm text-slate-400">
          System status is operational
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121A2F] border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Active Members</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.activeMembers ?? 0}</div>
        </div>
        
        <div className="bg-[#121A2F] border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-24 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Active Trainers</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalTrainers ?? 0}</div>
        </div>

        <div className="bg-[#121A2F] border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-24 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Equipment</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalEquipment ?? 0}</div>
        </div>

        <div className="bg-[#121A2F] border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-24 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Issues</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.equipmentIssues ?? 0}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#121A2F] border-slate-800 text-white shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex justify-between">
                <span>Membership Overview</span>
                <span className="text-slate-400 font-normal">Total: 400</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4 mt-2 text-sm">
                  {/* Mock progress bars replicating design */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Basic</span>
                      <span className="text-slate-400">120 members</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A233A] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Premium</span>
                      <span className="text-slate-400">180 members</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A233A] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">VIP</span>
                      <span className="text-slate-400">60 members</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A233A] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Student</span>
                      <span className="text-slate-400">40 members</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A233A] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#121A2F] border-slate-800 text-white shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-800">
                  <div className="relative flex items-center justify-center w-3 h-3 bg-blue-500 rounded-full ring-4 ring-[#121A2F] z-10 mt-1"></div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-white mb-0.5"><span className="text-blue-400">Sarah Jenkins</span> registered as VIP</p>
                    <p className="text-xs text-slate-500">Today, 10:45 AM</p>
                  </div>
                </div>
                <div className="flex gap-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-800">
                  <div className="relative flex items-center justify-center w-3 h-3 bg-green-500 rounded-full ring-4 ring-[#121A2F] z-10 mt-1"></div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-white mb-0.5"><span className="text-green-400">Trainer Mark</span> checked in</p>
                    <p className="text-xs text-slate-500">Today, 09:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-transparent">
                  <div className="relative flex items-center justify-center w-3 h-3 bg-red-500 rounded-full ring-4 ring-[#121A2F] z-10 mt-1"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-0.5"><span className="text-red-400">Treadmill #04</span> reported faulty</p>
                    <p className="text-xs text-slate-500">Yesterday, 03:15 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-[#121A2F] border-slate-800 text-white shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              <button
                type="button"
                onClick={() => navigate('/members')}
                className="w-full flex items-center justify-between p-3 bg-[#1A233A] hover:bg-[#1E2943] transition-colors rounded-xl text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">New Members Today</h4>
                    <p className="text-[11px] text-slate-500">Add or manage new joiners</p>
                  </div>
                </div>
                <span className="text-slate-600 group-hover:text-blue-400 transition-colors">&rsaquo;</span>
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/trainers')}
                className="w-full flex items-center justify-between p-3 bg-[#1A233A] hover:bg-[#1E2943] transition-colors rounded-xl text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Active Trainers</h4>
                    <p className="text-[11px] text-slate-500">Check schedule and attendance</p>
                  </div>
                </div>
                <span className="text-slate-600 group-hover:text-blue-400 transition-colors">&rsaquo;</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/equipment')}
                className="w-full flex items-center justify-between p-3 bg-[#1A233A] hover:bg-[#1E2943] transition-colors rounded-xl text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Maintenance Due</h4>
                    <p className="text-[11px] text-slate-500">{`${stats.equipmentIssues ?? 0} machines requiring attention`}</p>
                  </div>
                </div>
                <span className="text-slate-600 group-hover:text-red-400 transition-colors">&rsaquo;</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
