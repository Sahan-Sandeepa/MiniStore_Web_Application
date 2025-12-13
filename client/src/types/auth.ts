export type LoginDto = {
  userName: string;
  password: string;
};

export type RegisterDto = {
  userName: string;
  fullName: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
};
