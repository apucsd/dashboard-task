'use client';

const BASE_URL = 'https://68fa3de7ef8b2e621e7f57ab.mockapi.io';

// Simulate network delay (optional)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// -------------------- PRODUCTS API --------------------
export const productApi = {
   // =========================== GET all products=========================
   getProducts: async (filters?: any) => {
      await delay(300);
      let url = `${BASE_URL}/products`;

      // optional filtering (MockAPI supports ?search, ?page, etc.)
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status !== undefined) params.append('active', filters.status.toString());
      if (filters?.page) params.append('page', filters.page);
      if (filters?.limit) params.append('limit', filters.limit);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
   },

   // =========================== GET single product=========================
   getProductById: async (id: string) => {
      await delay(200);
      const res = await fetch(`${BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
   },

   // =========================== CREATE product=========================
   createProduct: async (product: any) => {
      const res = await fetch(`${BASE_URL}/products`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to create product');
      return res.json();
   },

   // =========================== UPDATE product=========================
   updateProduct: async (id: string, product: any) => {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to update product');
      return res.json();
   },

   // =========================== DELETE product=========================
   deleteProduct: async (id: string) => {
      const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      return true;
   },
};

// -------------------- ORDERS API --------------------
export const orderApi = {
   // =========================== GET all orders=========================
   getOrders: async (filters?: any) => {
      await delay(300);
      let url = `${BASE_URL}/orders`;

      const params = new URLSearchParams();
      if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters?.deliveryStatus) params.append('deliveryStatus', filters.deliveryStatus);
      if (filters?.page) params.append('page', filters.page);
      if (filters?.limit) params.append('limit', filters.limit);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
   },

   // =========================== GET single order=========================
   getOrderById: async (id: string) => {
      const res = await fetch(`${BASE_URL}/orders/${id}`);
      if (!res.ok) throw new Error('Order not found');
      return res.json();
   },

   // =========================== CREATE order=========================
   createOrder: async (order: any) => {
      const res = await fetch(`${BASE_URL}/orders`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error('Failed to create order');
      return res.json();
   },

   // =========================== UPDATE order=========================
   updateOrder: async (id: string, order: any) => {
      const res = await fetch(`${BASE_URL}/orders/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error('Failed to update order');
      return res.json();
   },

   // =========================== DELETE order=========================
   deleteOrder: async (id: string) => {
      const res = await fetch(`${BASE_URL}/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete order');
      return true;
   },
};
