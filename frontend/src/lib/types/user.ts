// Kullanıcı rolü
export type UserRole = "admin" | "user";

// Kullanıcı bilgisi
export interface User {
  id: number;
  email: string;
  role: UserRole;
  approved: boolean;
}

// Admin panelinde görüntülenen kullanıcı listesi
export interface UserListItem {
  id: number;
  email: string;
  role: UserRole;
  approved: boolean;
  created_at: string;
  entryCount: number;
}

