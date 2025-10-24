'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
   return (
      <div className="space-y-6">
         <h1 className="text-3xl font-bold">Dashboard</h1>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                     <span className="text-green-500 font-medium">+10%</span> from last month
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">145</div>
                  <p className="text-xs text-muted-foreground">
                     <span className="text-green-500 font-medium">+12%</span> from last month
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">573</div>
                  <p className="text-xs text-muted-foreground">
                     <span className="text-green-500 font-medium">+12%</span> from last month
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">$12,234</div>
                  <p className="text-xs text-muted-foreground">
                     <span className="text-green-500 font-medium">+18%</span> from last month
                  </p>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
