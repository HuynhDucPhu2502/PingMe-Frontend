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

export interface UserInfoResponse {
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
  sessionMetaRequest?: SessionMetaRequest;
}

export interface SessionMetaRequest {
  deviceType?: string;
  browser?: string;
  os?: string;
}

export interface SessionMetaResponse {
  sessionId: string;
  deviceType: string;
  browser: string;
  os: string;
  lastActiveAt: string;
  current: boolean;
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
