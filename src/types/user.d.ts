// =============================
// MAIN INTERFACE
// =============================
export interface DefaultAuthResponseDto {
  accessToken: string;
  userSession: UserSessionResponseDto;
}

export interface UserSessionResponseDto {
  email: string;
  name: string;
  avatarUrl: string;
  updatedAt: string;
}

export interface UserRegisterLocalRequestDto {
  email: string;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  password: string;
  address?: string;
  dob?: string;
}

export interface UserLoginLocalRequestDto {
  email: string;
  password: string;
}
