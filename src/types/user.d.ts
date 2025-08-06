// =============================
// MAIN INTERFACE
// =============================
export interface DefaultAuthResponseDto {
  accessToken: string;
  userSession: UserSession;
}

export interface UserSession {
  email: string;
  name: string;
  avatarUrl: string;
  updatedAt: string;
}

export interface UserLoginRequestDto {
  email: string;
  password: string;
}
