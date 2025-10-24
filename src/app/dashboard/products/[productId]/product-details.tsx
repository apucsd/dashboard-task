"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"
import { productApi } from "@/lib/api"
import { toast } from "sonner"

type Product = {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stockQuantity: number
  description: string
  image: string
  active: boolean
  clientSatisfaction: number
  deliveryProgress: number
  createdAt: string
  isActive: boolean
}

export default function ProductDetailsPage({ productId }: { productId: string }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getProductById(productId)
        setProduct(data)
      } catch (error) {
        toast.error("Failed to fetch product details")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-red-500">Product not found.</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        ← Back
      </Button>

      <Card className="lg:flex lg:gap-6 shadow-lg">
        {/* Image */}
        <div className="lg:w-1/3 flex justify-center items-center p-4 bg-muted rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg object-contain w-full max-h-[400px]"
          />
        </div>

        {/* Details */}
        <div className="lg:w-2/3 p-4 flex flex-col justify-between">
          <div>
            <CardHeader className="px-0">
              <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
              <CardDescription className="flex flex-wrap gap-2 mt-2">
                <Badge variant={product.isActive ? "default" : "destructive"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">SKU: {product.sku}</Badge>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Quantity</p>
                  <p className="font-semibold text-lg">{product.stockQuantity}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">{product.description}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < product.clientSatisfaction ? "text-yellow-500" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.clientSatisfaction}/5
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Delivery Progress</p>
                <span className="text-sm text-muted-foreground mt-1 block">
                  {product.deliveryProgress}%
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="mt-1">{format(new Date(product.createdAt), "PPP p")}</p>
              </div>
            </CardContent>
          </div>

         
        </div>
      </Card>
    </div>
  )
}
