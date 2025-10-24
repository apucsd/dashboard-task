import { z } from 'zod';
import { PRODUCT_CATEGORIES } from './mock-data';

// Product form schema
export const productSchema = z.object({
   name: z.string().min(2, 'Product name must be at least 2 characters').max(100),
   sku: z.string().min(3, 'SKU must be at least 3 characters').max(20).toUpperCase(),
   category: z.enum(PRODUCT_CATEGORIES as [string, ...string[]]),
   price: z.coerce.number().positive('Price must be positive'),
   stockQuantity: z.coerce.number().int().min(0, 'Stock quantity cannot be negative'),
   description: z.string().optional(),
   imageUrl: z.string().optional(),
   isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// Order form schema
export const orderSchema = z.object({
   products: z
      .array(
         z.object({
            productId: z.string(),
            quantity: z.coerce.number().int().positive('Quantity must be positive'),
         })
      )
      .min(1, 'At least one product must be selected'),
   clientName: z.string().min(2, 'Client name must be at least 2 characters'),
   deliveryAddress: z.string().min(5, 'Please provide a valid delivery address'),
   paymentStatus: z.enum(['paid', 'pending', 'refunded']),
   deliveryStatus: z.enum(['pending', 'shipped', 'delivered', 'canceled']),
   expectedDeliveryDate: z.date({
      error: 'Expected delivery date is required',
   }),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
