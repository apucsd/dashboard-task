'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PRODUCT_CATEGORIES } from '@/lib/mock-data';
import { productSchema, type ProductFormValues } from '@/lib/schemas';
import { productApi } from '@/lib/api';

export default function CreateProductPage() {
   const router = useRouter();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const form = useForm({
      resolver: zodResolver(productSchema),
      defaultValues: {
         name: '',
         sku: '',
         category: PRODUCT_CATEGORIES[0],
         price: 0,
         stockQuantity: 0,
         description: '',
         imageUrl: '',
         isActive: true,
      },
   });

   async function onSubmit(data: ProductFormValues) {
      try {
         setIsSubmitting(true);
         await productApi.createProduct(data);
         toast.success('Product created successfully');
         router.push('/dashboard/products');
      } catch (error) {
         toast.error('Failed to create product');
         console.error(error);
      } finally {
         setIsSubmitting(false);
      }
   }

   return (
      <div className="container mx-auto">
         <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

         <Card className="max-w-3xl mx-auto">
            <CardHeader>
               <CardTitle>Product Information</CardTitle>
               <CardDescription>
                  Enter the details for your new product. Fields marked with * are required.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                     <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Product Name *</FormLabel>
                                    <FormControl>
                                       <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name="sku"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>SKU *</FormLabel>
                                    <FormControl>
                                       <Input
                                          placeholder="Enter SKU"
                                          {...field}
                                          onChange={e => field.onChange(e.target.value.toUpperCase())}
                                       />
                                    </FormControl>
                                    <FormDescription>Stock Keeping Unit (automatically uppercase)</FormDescription>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        <FormField
                           control={form.control}
                           name="category"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Category *</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select a category" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {PRODUCT_CATEGORIES.map(category => (
                                          <SelectItem key={category} value={category}>
                                             {category}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-lg font-medium">Inventory Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Price *</FormLabel>
                                    <FormControl>
                                       <div className="relative">
                                          <span className="absolute left-3 top-2.5">$</span>
                                          <Input 
                                             type="number" 
                                             placeholder="0.00" 
                                             className="pl-7" 
                                             {...field}
                                             value={field.value as number} 
                                          />
                                       </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name="stockQuantity"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Stock Quantity *</FormLabel>
                                    <FormControl>
                                       <Input 
                                          type="number" 
                                          placeholder="0" 
                                          {...field} 
                                          value={field.value as number}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-lg font-medium">Additional Information</h3>
                        <FormField
                           control={form.control}
                           name="description"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Description</FormLabel>
                                 <FormControl>
                                    <Textarea
                                       placeholder="Enter product description"
                                       className="min-h-[120px]"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="imageUrl"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Product Image URL</FormLabel>
                                 <FormControl>
                                    <Input placeholder="https://example.com/image.jpg" {...field} />
                                 </FormControl>
                                 <FormDescription>Enter a URL for the product image</FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="isActive"
                           render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                 <div className="space-y-0.5">
                                    <FormLabel className="text-base">Active Status</FormLabel>
                                    <FormDescription>
                                       Set whether this product is active and available for purchase
                                    </FormDescription>
                                 </div>
                                 <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                 </FormControl>
                              </FormItem>
                           )}
                        />
                     </div>

                     <CardFooter className="flex justify-between px-0">
                        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/products')}>
                           Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                           {isSubmitting ? 'Creating...' : 'Create Product'}
                        </Button>
                     </CardFooter>
                  </form>
               </Form>
            </CardContent>
         </Card>
      </div>
   );
}
