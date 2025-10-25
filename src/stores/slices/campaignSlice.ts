import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiClient, type Campaign, type CreateCampaignPayload } from "@/lib/api"

interface CampaignState {
  campaigns: Campaign[]
  isLoading: boolean
  error: string | null
  isCreating: boolean
  hasLoaded: boolean
}

const initialState: CampaignState = {
  campaigns: [],
  isLoading: false,
  error: null,
  isCreating: false,
  hasLoaded: false,
}

export const fetchCampaigns = createAsyncThunk(
  "campaign/fetchCampaigns",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const campaigns = await apiClient.getCampaignList(accessToken)
      return campaigns
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch campaigns")
    }
  },
)

export const createCampaign = createAsyncThunk(
  "campaign/createCampaign",
  async ({ payload, accessToken }: { payload: CreateCampaignPayload; accessToken: string }, { rejectWithValue }) => {
    try {
      const campaign = await apiClient.createCampaign(payload, accessToken)
      return campaign
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create campaign")
    }
  },
)

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch campaigns
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false
        state.campaigns = action.payload
        state.error = null
        state.hasLoaded = true
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.hasLoaded = true
      })
      // Create campaign
      .addCase(createCampaign.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isCreating = false
        state.campaigns.unshift(action.payload)
        state.error = null
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = campaignSlice.actions

export default campaignSlice.reducer
