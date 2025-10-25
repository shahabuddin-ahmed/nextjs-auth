const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

export interface ApiResponse<T> {
  code: string
  message: string
  response: T
  errors: string[]
}

export interface LoginResponse {
  _id: string
  id: string
  name: string
  email: string
  accessToken: string
}

export interface SignupResponse {
  _id: string
  id: string
  name: string
  email: string
}

export interface Campaign {
  _id: string
  id: string
  name: string
  subject: string
  body: string
  scheduledTime: string
  status: "scheduled" | "sent" | "draft"
}

export interface CreateCampaignPayload {
  name: string
  subject: string
  body: string
  scheduledTime: string
  status: "scheduled" | "sent" | "draft"
}

export const apiClient = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const data: ApiResponse<LoginResponse> = await response.json()

    if (data.code !== "SUCCESS") {
      throw new Error(data.message || "Login failed")
    }

    return data.response
  },

  async signup(name: string, email: string, password: string): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      throw new Error("Signup failed")
    }

    const data: ApiResponse<SignupResponse> = await response.json()

    if (data.code !== "SUCCESS") {
      throw new Error(data.message || "Signup failed")
    }

    return data.response
  },

  async createCampaign(payload: CreateCampaignPayload, accessToken: string): Promise<Campaign> {
    const response = await fetch(`${API_BASE_URL}/campaign/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Failed to create campaign")
    }

    const data: ApiResponse<Campaign> = await response.json()

    if (data.code !== "SUCCESS") {
      throw new Error(data.message || "Failed to create campaign")
    }

    return data.response
  },

  async getCampaignList(accessToken: string): Promise<Campaign[]> {
    const response = await fetch(`${API_BASE_URL}/campaign/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch campaigns")
    }

    const data: ApiResponse<Campaign[]> = await response.json()

    if (data.code !== "SUCCESS") {
      throw new Error(data.message || "Failed to fetch campaigns")
    }

    return data.response
  },
}
