// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  salesData: number[];
}

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderId: string;
  items: OrderItem[];
  clientName: string;
  deliveryAddress: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  deliveryStatus: 'pending' | 'shipped' | 'delivered' | 'canceled';
  expectedDeliveryDate: string;
  totalAmount: number;
  createdAt: string;
  customerFeedback: 'happy' | 'neutral' | 'unhappy' | null;
  deliveryProgress: number;
}

// Categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Toys',
  'Sports',
  'Home & Kitchen',
  'Beauty',
  'Automotive'
];

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    price: 129.99,
    stockQuantity: 45,
    description: 'High-quality wireless headphones with noise cancellation.',
    imageUrl: '/products/headphones.jpg',
    isActive: true,
    createdAt: '2025-09-15T10:30:00Z',
    salesData: [5, 8, 12, 10, 15, 18, 20]
  },
  {
    id: '2',
    name: 'Office Chair',
    sku: 'OC-002',
    category: 'Furniture',
    price: 249.99,
    stockQuantity: 18,
    description: 'Ergonomic office chair with lumbar support.',
    imageUrl: '/products/chair.jpg',
    isActive: true,
    createdAt: '2025-09-10T14:20:00Z',
    salesData: [3, 5, 4, 7, 8, 10, 9]
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    sku: 'CT-003',
    category: 'Clothing',
    price: 24.99,
    stockQuantity: 120,
    description: 'Comfortable 100% cotton t-shirt.',
    imageUrl: '/products/tshirt.jpg',
    isActive: true,
    createdAt: '2025-09-05T09:15:00Z',
    salesData: [15, 20, 18, 25, 30, 28, 35]
  },
  {
    id: '4',
    name: 'Smartphone',
    sku: 'SP-004',
    category: 'Electronics',
    price: 899.99,
    stockQuantity: 8,
    description: 'Latest model smartphone with high-resolution camera.',
    imageUrl: '/products/smartphone.jpg',
    isActive: true,
    createdAt: '2025-08-28T11:45:00Z',
    salesData: [10, 8, 12, 15, 14, 18, 20]
  },
  {
    id: '5',
    name: 'Coffee Table',
    sku: 'CT-005',
    category: 'Furniture',
    price: 149.99,
    stockQuantity: 12,
    description: 'Modern coffee table with storage.',
    imageUrl: '/products/coffee-table.jpg',
    isActive: false,
    createdAt: '2025-08-20T16:30:00Z',
    salesData: [2, 3, 5, 4, 6, 5, 7]
  }
];

// Mock Orders
export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderId: 'ORD-001',
    items: [
      { productId: '1', productName: 'Wireless Headphones', quantity: 1, price: 129.99 },
      { productId: '3', productName: 'Cotton T-Shirt', quantity: 2, price: 24.99 }
    ],
    clientName: 'John Smith',
    deliveryAddress: '123 Main St, Anytown, USA',
    paymentStatus: 'paid',
    deliveryStatus: 'delivered',
    expectedDeliveryDate: '2025-09-20T00:00:00Z',
    totalAmount: 179.97,
    createdAt: '2025-09-15T14:30:00Z',
    customerFeedback: 'happy',
    deliveryProgress: 100
  },
  {
    id: '2',
    orderId: 'ORD-002',
    items: [
      { productId: '2', productName: 'Office Chair', quantity: 1, price: 249.99 }
    ],
    clientName: 'Jane Doe',
    deliveryAddress: '456 Oak Ave, Somewhere, USA',
    paymentStatus: 'pending',
    deliveryStatus: 'shipped',
    expectedDeliveryDate: '2025-09-25T00:00:00Z',
    totalAmount: 249.99,
    createdAt: '2025-09-18T10:15:00Z',
    customerFeedback: null,
    deliveryProgress: 65
  },
  {
    id: '3',
    orderId: 'ORD-003',
    items: [
      { productId: '4', productName: 'Smartphone', quantity: 1, price: 899.99 }
    ],
    clientName: 'Robert Johnson',
    deliveryAddress: '789 Pine Rd, Elsewhere, USA',
    paymentStatus: 'paid',
    deliveryStatus: 'pending',
    expectedDeliveryDate: '2025-09-28T00:00:00Z',
    totalAmount: 899.99,
    createdAt: '2025-09-20T09:45:00Z',
    customerFeedback: null,
    deliveryProgress: 20
  },
  {
    id: '4',
    orderId: 'ORD-004',
    items: [
      { productId: '3', productName: 'Cotton T-Shirt', quantity: 3, price: 24.99 },
      { productId: '5', productName: 'Coffee Table', quantity: 1, price: 149.99 }
    ],
    clientName: 'Sarah Williams',
    deliveryAddress: '101 Maple St, Nowhere, USA',
    paymentStatus: 'refunded',
    deliveryStatus: 'canceled',
    expectedDeliveryDate: '2025-09-22T00:00:00Z',
    totalAmount: 224.96,
    createdAt: '2025-09-16T15:20:00Z',
    customerFeedback: 'unhappy',
    deliveryProgress: 0
  },
  {
    id: '5',
    orderId: 'ORD-005',
    items: [
      { productId: '1', productName: 'Wireless Headphones', quantity: 2, price: 129.99 }
    ],
    clientName: 'Michael Brown',
    deliveryAddress: '202 Cedar Ln, Anyplace, USA',
    paymentStatus: 'paid',
    deliveryStatus: 'shipped',
    expectedDeliveryDate: '2025-09-26T00:00:00Z',
    totalAmount: 259.98,
    createdAt: '2025-09-19T11:30:00Z',
    customerFeedback: 'neutral',
    deliveryProgress: 75
  }
];