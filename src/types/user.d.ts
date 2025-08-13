// =============================
// MAIN INTERFACE
// =============================
export interface DefaultAuthResponse {
  accessToken: string;
  userSession: UserSessionResponse;
}

export interface UserSessionResponse {
  email: string;
  name: string;
  avatarUrl: string;
  updatedAt: string;
}

export interface UserDetailResponse {
  email: string;
  name: string;
  avatarUrl: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  dob?: string;
}

export interface LocalRegisterRequest {
  email: string;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  password: string;
  address?: string;
  dob?: string;
}

export interface LocalLoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeProfileRequest {
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  dob?: string;
}
