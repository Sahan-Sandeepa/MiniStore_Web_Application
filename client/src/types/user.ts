export type AdminUserDto = {
  id: string;
  userName: string;
  fullName: string;
  role: "Admin" | "Customer";
  status: "Active" | "Disabled" | "Deleted";
  createdAt: string;
};
