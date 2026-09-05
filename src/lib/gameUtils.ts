export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 10);
}

export function getLatencyColor(latency: number): string {
  const map: Record<number, string> = {
    20: 'bg-latency-20',
    50: 'bg-latency-50',
    100: 'bg-latency-100',
    150: 'bg-latency-150',
    200: 'bg-latency-200',
  };
  return map[latency] || 'bg-primary';
}

export function getLatencyTextColor(latency: number): string {
  const map: Record<number, string> = {
    20: 'text-latency-20',
    50: 'text-latency-50',
    100: 'text-latency-100',
    150: 'text-latency-150',
    200: 'text-latency-200',
  };
  return map[latency] || 'text-primary';
}
