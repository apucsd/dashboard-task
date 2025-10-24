"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { CalendarIcon, Loader2, MinusCircle, PlusCircle } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { orderSchema, type OrderFormValues } from "@/lib/schemas"
import { orderApi, productApi } from "@/lib/api"
import { Product } from "@/lib/mock-data"

export default function CreateOrderPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getProducts({ isActive: true })
        console.log(data)
        setProducts(data)
      } catch (error) {
        toast.error("Failed to fetch products")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Order summary state
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 10,
    total: 0,
  })

  // React Hook Form setup
  const form = useForm<any>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      products: [{ productId: "", quantity: 1 }],
      clientName: "",
      deliveryAddress: "",
      paymentStatus: "pending",
      deliveryStatus: "pending",
      expectedDeliveryDate: new Date(),
    },
  })

  // Dynamic product list
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  })

  const watchProducts = useWatch({ control: form.control, name: "products" })

  // Calculate totals dynamically
  useEffect(() => {
    if (!products.length || !watchProducts) return

    const subtotal = watchProducts.reduce((sum: number, item: any) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? sum + product.price * (item.quantity || 0) : sum
    }, 0)

    const tax = subtotal * 0.08
    const total = subtotal + tax + orderSummary.shipping

    setOrderSummary({ subtotal, tax, shipping: orderSummary.shipping, total })
  }, [watchProducts, products])


  // Form submit handler
  async function onSubmit(data: OrderFormValues) {
    try {
      setIsSubmitting(true)
      const orderData = {
        ...data,
        totalAmount: orderSummary.total,
        tax: orderSummary.tax,
        shippingCost: orderSummary.shipping,
        paymentMethod: "credit_card",
      }

      await orderApi.createOrder(orderData)
      toast.success("Order created successfully")
      router.push("/dashboard/orders")
    } catch (error) {
      toast.error("Failed to create order")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading UI
  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  // Render page
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>
                Enter details for the new order. Fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id="order-form" className="space-y-6">
                  {/* Products */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Products</h3>

                    {fields.map((field, index) => (
                      <div key={field.id} className="flex flex-col space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                          {/* Product Select */}
                          <div className="md:col-span-6">
                            <FormField
                              control={form.control}
                              name={`products.${index}.productId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Product *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a product" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                          {product.name} (${product.price.toFixed(2)})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Quantity */}
                          <div className="md:col-span-3">
                            <FormField
                              control={form.control}
                              name={`products.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantity *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={1}
                                      value={field.value}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Add/Remove Buttons */}
                          <div className="md:col-span-3 flex items-end">
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => remove(index)}
                                className="ml-auto"
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            )}

                            {index === fields.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => append({ productId: "", quantity: 1 })}
                                className={cn("ml-2", index === 0 && "ml-auto")}
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Price summary */}
                        {form.watch(`products.${index}.productId`) && (
                          <div className="text-sm text-muted-foreground ml-auto">
                            {(() => {
                              const productId = form.watch(`products.${index}.productId`)
                              const quantity = form.watch(`products.${index}.quantity`) || 0
                              const product = products.find((p) => p.id === productId)
                              if (product) {
                                return `${quantity} × $${product.price.toFixed(2)} = $${(
                                  product.price * quantity
                                ).toFixed(2)}`
                              }
                              return null
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter client name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter delivery address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Order Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Payment Status */}
                      <FormField
                        control={form.control}
                        name="paymentStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Status *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Delivery Status */}
                      <FormField
                        control={form.control}
                        name="deliveryStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Status *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="canceled">Canceled</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Expected Delivery Date */}
                      <FormField
                        control={form.control}
                        name="expectedDeliveryDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Expected Delivery *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() ||
                                    date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Select a delivery date (within 30 days)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review before submitting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between"><span>Subtotal:</span><span>${orderSummary.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (8%):</span><span>${orderSummary.tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span><span>${orderSummary.shipping.toFixed(2)}</span></div>
                <div className="border-t pt-2 flex justify-between font-bold"><span>Total:</span><span>${orderSummary.total.toFixed(2)}</span></div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" form="order-form" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Order"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/orders")}
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
