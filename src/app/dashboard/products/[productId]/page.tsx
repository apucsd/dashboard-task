import ProductDetailsPage from "./product-details"

export default async function DetailsPage({params}: {
    params: Promise<{
        productId: string
    }>
}) {
const {productId} = await params

return (
    <div>
       <ProductDetailsPage productId={productId} />
    </div>
)
}