export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password?: string; // فقط للتجربة، لا تستخدم في الإنتاج
}
