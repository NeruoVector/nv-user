export const BASE_URL = (process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'https://neurovector-backend.forge-lang.org').replace(/\/$/, '');

export type Item = { id: string; sku: string; name: string; description: string | null; unit_price: number; currency: string; stock_quantity: number; active: boolean };
export type OrderItem = { item_id: string; quantity: number; unit_price: number; line_total: number };
export type Order = { id: string; order_number: string; customer_name: string; customer_phone: string; status: string; total_amount: number; delivery_address: string; delivery_detail: string | null; notes: string | null; created_at: string; items?: OrderItem[]; payment?: Payment | null };
export type Payment = { id: string; order_id: string; status: string; amount: number; method: string; failure_reason: string | null };
export type Review = { id: string; order_id: string; rating: number; content: string; tags: string[]; has_photo: boolean; created_at: string };
export type ReviewList = { items: Review[]; total: number; average_rating: number | null };
export type StreamInfo = { drone_id: string; publish_url: string; read_url: string; webrtc_whep_path: string; active: boolean };
export type Recording = { drone_id: string; name: string; size_bytes: number; download_url: string; modified_at: string | null };

export function absoluteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

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

function listedStreams(data: unknown) {
  const items = data && typeof data === 'object' && 'items' in data ? (data as { items?: unknown }).items : data;
  if (!Array.isArray(items)) return [];
  return items.flatMap(item => {
    if (!item || typeof item !== 'object' || !('name' in item)) return [];
    const row = item as { name?: unknown; online?: unknown; ready?: unknown };
    if (typeof row.name !== 'string' || !row.name) return [];
    return [{ drone_id: row.name, active: row.online === true || row.ready === true }];
  });
}

export async function postSdp(path: string, sdp: string) {
  const response = await fetch(absoluteUrl(path), { method: 'POST', headers: { Accept: 'application/sdp', 'Content-Type': 'application/sdp' }, body: sdp });
  const answer = await response.text();
  if (!response.ok) throw new Error(answer.trim() || `영상 연결 실패 (${response.status})`);
  const location = response.headers.get('location');
  return { answer, sessionPath: location ? location.replace(BASE_URL, '') : null };
}

export function endStream(sessionPath: string) {
  return fetch(absoluteUrl(sessionPath), { method: 'DELETE' }).catch(() => undefined);
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
  streams: async () => listedStreams(await request<unknown>('/api/v1/streams')),
  stream: (droneId: string) => request<StreamInfo>(`/api/v1/streams/${encodeURIComponent(droneId)}`),
  recordings: (droneId?: string) => request<Recording[]>(`/api/v1/recordings${droneId ? `?drone_id=${encodeURIComponent(droneId)}` : ''}`),
};
