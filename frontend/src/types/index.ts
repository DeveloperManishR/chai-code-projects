// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// ─── Poll ────────────────────────────────────────────────────────────────────
export interface Option {
  _id: string
  text: string
  votes: number
}

export interface Question {
  _id: string
  question: string
  options: Option[]
}

export interface Poll {
  _id: string
  userId: Pick<User, "_id" | "name" | "email">
  title: string
  description: string
  questions: Question[]
  expiryTime: string
  status: "ACTIVE" | "INACTIVE" | "COMPLETED"
  createdAt: string
  updatedAt: string
}

// ─── API ─────────────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T | null
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

// ─── Form Inputs ─────────────────────────────────────────────────────────────
export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface CreatePollInput {
  title: string
  description: string
  questions: {
    question: string
    options: { text: string }[]
  }[]
  expiryTime: string
}

export interface VoteInput {
  questionIndex: number
  optionIndex: number
}
