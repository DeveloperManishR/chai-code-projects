import type { ApiResponse, LoginInput, LoginResponse, RegisterInput, User } from "@/types"
import apiClient from "./client"

export async function registerUser(data: RegisterInput): Promise<ApiResponse<User>> {
  const res = await apiClient.post<ApiResponse<User>>("/api/auth/register", data)
  return res.data
}

export async function loginUser(data: LoginInput): Promise<ApiResponse<LoginResponse>> {
  const res = await apiClient.post<ApiResponse<LoginResponse>>("/api/auth/login", data)
  return res.data
}
