export const BASE_URL = (process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'https://neurovector-backend.forge-lang.org').replace(/\/$/, '');

export type Item = { id: string; sku: string; name: string; description: string | null; unit_price: number; currency: string; stock_quantity: number; active: boolean };
export type OrderItem = { item_id: string; quantity: number; unit_price: number; line_total: number };
export type Order = { id: string; order_number: string; customer_name: string; customer_phone: string; status: string; total_amount: number; delivery_address: string; delivery_detail: string | null; notes: string | null; created_at: string; items?: OrderItem[]; payment?: Payment | null };
export type Payment = { id: string; order_id: string; status: string; amount: number; method: string; failure_reason: string | null };
export type Review = { id: string; order_id: string; rating: number; content: string; tags: string[]; has_photo: boolean; created_at: string };
export type ReviewList = { items: Review[]; total: number; average_rating: number | null };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...init?.headers } });
  const body = await response.text();
  let data: unknown;
  try { data = body ? JSON.parse(body) : null; } catch { data = body; }
  if (!response.ok) {
    const detail = typeof data === 'object' && data !== null ? ('detail' in data ? String((data as { detail: unknown }).detail) : 'message' in data ? String((data as { message: unknown }).message) : `서버 오류 (${response.status})`) : `서버 오류 (${response.status})`;
    throw new Error(detail);
  }
  return data as T;
}

export const api = {
  items: () => request<Item[]>('/api/v1/inventory?active=true&limit=100'),
  orders: (phone: string) => request<Order[]>(`/api/v1/orders?phone=${encodeURIComponent(phone)}&limit=100`),
  order: (id: string) => request<Order>(`/api/v1/orders/${encodeURIComponent(id)}`),
  createOrder: (payload: { customer_name: string; customer_phone: string; items: { item_id: string; quantity: number }[]; delivery_address: string; delivery_detail?: string; notes?: string }) => request<Order>('/api/v1/orders', { method: 'POST', body: JSON.stringify(payload) }),
  pay: (id: string, method: string) => request<Payment>(`/api/v1/orders/${encodeURIComponent(id)}/payments`, { method: 'POST', body: JSON.stringify({ method }) }),
  updateOrderStatus: (id: string, status: string) => request<Order>(`/api/v1/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  cancelOrder: (id: string) => request<Order>(`/api/v1/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'cancelled' }) }),
  refund: (paymentId: string) => request<Payment>(`/api/v1/payments/${encodeURIComponent(paymentId)}/refund`, { method: 'POST' }),
  review: (orderId: string) => request<Review>(`/api/v1/orders/${encodeURIComponent(orderId)}/review`),
  reviews: (phone?: string) => request<ReviewList>(`/api/v1/reviews?limit=100${phone ? `&phone=${encodeURIComponent(phone)}` : ''}`),
  createReview: (orderId: string, review: { rating: number; content: string; tags: string[]; photo_data_url?: string }) => request<Review>(`/api/v1/orders/${encodeURIComponent(orderId)}/review`, { method: 'POST', body: JSON.stringify(review) }),
  reviewPhotoUrl: (reviewId: string) => `${BASE_URL}/api/v1/reviews/${encodeURIComponent(reviewId)}/photo`,
};
