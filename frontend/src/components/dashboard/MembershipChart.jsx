import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp } from "lucide-react";

const membershipColors = {
  basic: "bg-blue-100 text-blue-700",
  premium: "bg-purple-100 text-purple-700",
  vip: "bg-gold-100 text-gold-700",
  student: "bg-green-100 text-green-700",
};

export default function MembershipChart({ members, isLoading }) {
  // Safety check
  if (!Array.isArray(members)) {
    members = [];
  }

  const getMembershipStats = () => {
    const stats = {
      basic: 0,
      premium: 0,
      vip: 0,
      student: 0,
      total: members.length
    };

    members.forEach(member => {
      if (member && member.status === 'active' && member.membership_type) {
        const membershipType = member.membership_type;
        if (stats.hasOwnProperty(membershipType)) {
          stats[membershipType] = (stats[membershipType] || 0) + 1;
        }
      }
    });

    return stats;
  };

  const stats = getMembershipStats();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Users className="w-5 h-5" />
          Membership Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(stats).filter(([key]) => key !== 'total').map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    type === 'basic' ? 'bg-blue-100' :
                    type === 'premium' ? 'bg-purple-100' :
                    type === 'vip' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}>
                    <Users className={`w-6 h-6 ${
                      type === 'basic' ? 'text-blue-600' :
                      type === 'premium' ? 'text-purple-600' :
                      type === 'vip' ? 'text-yellow-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 capitalize">{type} Members</p>
                    <p className="text-sm text-slate-500">{count} active</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{count}</p>
                  <p className="text-xs text-slate-500">
                    {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
