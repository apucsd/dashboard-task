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
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { productApi } from '@/lib/api';
import { Product } from '@/lib/mock-data';
import { toast } from 'sonner';

export default function ProductsPage() {
   const router = useRouter();

   //  =====================ALL STATES FOR TABLE=====================
   const [sorting, setSorting] = useState<SortingState>([]);
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
   const [rowSelection, setRowSelection] = useState({});
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);

   // Fetch products on component mount
   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const data = await productApi.getProducts();
            setProducts(data);
         } catch (error) {
            toast.error('Failed to fetch products');
            console.error(error);
         } finally {
            setLoading(false);
         }
      };

      fetchProducts();
   }, []);

   const columns: ColumnDef<Product>[] = [
      {
         id: 'select',
         header: ({ table }) => (
            <Checkbox
               checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
               onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
               aria-label="Select all"
            />
         ),
         cell: ({ row }) => (
            <Checkbox
               checked={row.getIsSelected()}
               onCheckedChange={value => row.toggleSelected(!!value)}
               aria-label="Select row"
            />
         ),
         enableSorting: false,
         enableHiding: false,
      },
      {
         accessorKey: 'name',
         header: ({ column }) => {
            return (
               <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  Product Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
               </Button>
            );
         },
         cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
      },
      {
         accessorKey: 'sku',
         header: 'SKU',
         cell: ({ row }) => <div className="font-mono text-sm">{row.getValue('sku')}</div>,
      },
      {
         accessorKey: 'category',
         header: 'Category',
         cell: ({ row }) => <div className="capitalize">{row.getValue('category')}</div>,
      },
      {
         accessorKey: 'price',
         header: ({ column }) => {
            return (
               <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
               </Button>
            );
         },
         cell: ({ row }) => {
            const price = parseFloat(row.getValue('price'));
            const formatted = new Intl.NumberFormat('en-US', {
               style: 'currency',
               currency: 'USD',
            }).format(price);

            return <div className=" font-medium">{formatted}</div>;
         },
      },
      {
         accessorKey: 'stockQuantity',
         header: 'Stock',
         cell: ({ row }) => <div className="">{row.getValue('stockQuantity')}</div>,
      },
      {
         accessorKey: 'isActive',
         header: 'Status',
         cell: ({ row }) => {
            const isActive = row.getValue('isActive');
            return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
         },
      },
      {
         id: 'actions',
         header: 'Actions',
         cell: ({ row }) => {
            const product = row.original;

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
                     <DropdownMenuItem onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                        View details
                     </DropdownMenuItem>
                     {/* <DropdownMenuItem onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}>
                        Edit
                     </DropdownMenuItem> */}
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={async () => {
                           try {
                              // Toggle product status using API
                              await productApi.updateProduct(product.id, {
                                 ...product,
                                 isActive: !product.isActive
                              });
                              
                              // Update local state
                              setProducts(prevProducts => 
                                 prevProducts.map(p => 
                                    p.id === product.id ? { ...p, isActive: !p.isActive } : p
                                 )
                              );
                              
                              toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'}`);
                           } catch (error) {
                              toast.error('Failed to update product status');
                              console.error(error);
                           }
                        }}
                     >
                        {product.isActive ? 'Deactivate' : 'Activate'}
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            );
         },
      },
   ];

   const table = useReactTable({
      data: products,
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
               <p className="text-lg">Loading products...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto">
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <Button asChild>
               <Link href="/dashboard/products/create">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
               </Link>
            </Button>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>Product Management</CardTitle>
               <CardDescription>
                  Manage your product inventory, track stock levels, and update product information.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center py-4">
                  <Input
                     placeholder="Filter products..."
                     value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                     onChange={event => table.getColumn('name')?.setFilterValue(event.target.value)}
                     className="max-w-sm"
                  />
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
                                 No products found.
                              </TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </div>
               <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                     {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{' '}
                     row(s) selected.
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
