'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
   ColumnDef,
   ColumnFiltersState,
   SortingState,
   VisibilityState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { orderApi } from '@/lib/api';
import { Order } from '@/lib/mock-data';
import { toast } from 'sonner';

export default function OrdersPage() {
   const router = useRouter();
   const [sorting, setSorting] = useState<SortingState>([]);
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
   const [rowSelection, setRowSelection] = useState({});
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);
   const [filterValues, setFilterValues] = useState({
      paymentStatus: '',
      deliveryStatus: '',
   });

   // Fetch orders on component mount
   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const data = await orderApi.getOrders(filterValues);
            setOrders(data);
         } catch (error) {
            toast.error('Failed to fetch orders');
            console.error(error);
         } finally {
            setLoading(false);
         }
      };

      fetchOrders();
   }, [filterValues]);

   // Apply filters
   const handleFilterChange = (key: string, value: string) => {
      setFilterValues(prev => ({
         ...prev,
         [key]: value === 'all' ? '' : value,
      }));
   };

   const columns: ColumnDef<Order>[] = [
      {
         accessorKey: 'id',
         header: ({ column }) => {
            return (
               <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  Order ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
               </Button>
            );
         },
         cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
      },
      {
         accessorKey: 'clientName',
         header: 'Client',
         cell: ({ row }) => <div>{row.getValue('clientName')}</div>,
      },
      {
         accessorKey: 'createdAt',
         header: ({ column }) => {
            return (
               <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
               </Button>
            );
         },
         cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return <div>{format(date, 'MMM dd, yyyy')}</div>;
         },
      },
      {
         accessorKey: 'totalAmount',
         header: ({ column }) => {
            return (
               <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  Total
                  <ArrowUpDown className="ml-2 h-4 w-4" />
               </Button>
            );
         },
         cell: ({ row }) => {
            const amount = parseFloat(row.getValue('totalAmount'));
            const formatted = new Intl.NumberFormat('en-US', {
               style: 'currency',
               currency: 'USD',
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
         },
      },
      {
         accessorKey: 'paymentStatus',
         header: 'Payment',
         cell: ({ row }) => {
            const status = row.getValue('paymentStatus') as string;

            return (
               <Badge variant={status === 'paid' ? 'default' : status === 'refunded' ? 'destructive' : 'outline'}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
               </Badge>
            );
         },
      },
      {
         accessorKey: 'deliveryStatus',
         header: 'Delivery',
         cell: ({ row }) => {
            const status = row.getValue('deliveryStatus') as string;

            return (
               <Badge
                  variant={
                     status === 'delivered'
                        ? 'default'
                        : status === 'shipped'
                        ? 'default'
                        : status === 'canceled'
                        ? 'destructive'
                        : 'outline'
                  }
               >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
               </Badge>
            );
         },
      },
      {
         id: 'actions',
         cell: ({ row }) => {
            const order = row.original;

            return (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
                        View details
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/edit/${order.id}`)}>
                        Edit
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={() => {
                           // Update delivery status
                           toast.success('Order status updated');
                        }}
                     >
                        Update status
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            );
         },
      },
   ];

   const table = useReactTable({
      data: orders,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection,
      },
   });

   if (loading) {
      return (
         <div className="container mx-auto py-10">
            <div className="flex items-center justify-center h-64">
               <p className="text-lg">Loading orders...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto">
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Orders</h1>
            <Button asChild>
               <Link href="/dashboard/orders/create">
                  <Plus className="mr-2 h-4 w-4" /> New Order
               </Link>
            </Button>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>Order Management</CardTitle>
               <CardDescription>Manage customer orders, track delivery status, and process payments.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                  <Input
                     placeholder="Filter by client name..."
                     value={(table.getColumn('clientName')?.getFilterValue() as string) ?? ''}
                     onChange={event => table.getColumn('clientName')?.setFilterValue(event.target.value)}
                     className="max-w-sm"
                  />

                  <div className="flex items-center space-x-2">
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button variant="outline" size="sm" className="h-8 border-dashed">
                              <Filter className="mr-2 h-4 w-4" />
                              Filters
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                           <div className="grid gap-4">
                              <div className="space-y-2">
                                 <h4 className="font-medium leading-none">Filter Orders</h4>
                                 <p className="text-sm text-muted-foreground">
                                    Filter orders by payment and delivery status
                                 </p>
                              </div>
                              <div className="grid gap-2">
                                 <div className="grid grid-cols-3 items-center gap-4">
                                    <label htmlFor="payment" className="text-sm">
                                       Payment
                                    </label>
                                    <select
                                       id="payment"
                                       className="col-span-2 h-8 rounded-md border border-input bg-background px-3"
                                       value={filterValues.paymentStatus}
                                       onChange={e => handleFilterChange('paymentStatus', e.target.value)}
                                    >
                                       <option value="all">All</option>
                                       <option value="paid">Paid</option>
                                       <option value="pending">Pending</option>
                                       <option value="refunded">Refunded</option>
                                    </select>
                                 </div>
                                 <div className="grid grid-cols-3 items-center gap-4">
                                    <label htmlFor="delivery" className="text-sm">
                                       Delivery
                                    </label>
                                    <select
                                       id="delivery"
                                       className="col-span-2 h-8 rounded-md border border-input bg-background px-3"
                                       value={filterValues.deliveryStatus}
                                       onChange={e => handleFilterChange('deliveryStatus', e.target.value)}
                                    >
                                       <option value="all">All</option>
                                       <option value="pending">Pending</option>
                                       <option value="shipped">Shipped</option>
                                       <option value="delivered">Delivered</option>
                                       <option value="canceled">Canceled</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                        </PopoverContent>
                     </Popover>
                  </div>
               </div>
               <div className="rounded-md border">
                  <Table>
                     <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                           <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map(header => {
                                 return (
                                    <TableHead key={header.id}>
                                       {header.isPlaceholder
                                          ? null
                                          : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                 );
                              })}
                           </TableRow>
                        ))}
                     </TableHeader>
                     <TableBody>
                        {table.getRowModel().rows?.length ? (
                           table.getRowModel().rows.map(row => (
                              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                 {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                 ))}
                              </TableRow>
                           ))
                        ) : (
                           <TableRow>
                              <TableCell colSpan={columns.length} className="h-24 text-center">
                                 No orders found.
                              </TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </div>
               <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                     Showing {table.getFilteredRowModel().rows.length} of {orders.length} orders.
                  </div>
                  <div className="space-x-2">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                     >
                        Previous
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                     >
                        Next
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
