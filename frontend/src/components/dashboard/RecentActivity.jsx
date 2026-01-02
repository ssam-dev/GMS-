import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { CreditCard, Clock } from "lucide-react";

const paymentTypeColors = {
  membership: "bg-blue-100 text-blue-700",
  personal_training: "bg-green-100 text-green-700",
  class: "bg-purple-100 text-purple-700",
  merchandise: "bg-orange-100 text-orange-700",
  late_fee: "bg-red-100 text-red-700",
};

export default function RecentActivity({ payments, isLoading }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Clock className="w-5 h-5" />
          Recent Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{payment.member_name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={paymentTypeColors[payment.payment_type]}>
                        {payment.payment_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {format(new Date(payment.payment_date), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">${payment.amount.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">{payment.payment_method}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
