export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          owner_name: string
          owner_email: string
          work_type: string
          portfolio_size: string | null
          primary_market: string | null
          team_size: string | null
          listing_source: string
          require_approval: boolean
          default_visibility: string
          notification_preferences: Json
          branding: Json | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_name: string
          owner_email: string
          work_type?: string
          portfolio_size?: string | null
          primary_market?: string | null
          team_size?: string | null
          listing_source?: string
          require_approval?: boolean
          default_visibility?: string
          notification_preferences?: Json
          branding?: Json | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_name?: string
          owner_email?: string
          work_type?: string
          portfolio_size?: string | null
          primary_market?: string | null
          team_size?: string | null
          listing_source?: string
          require_approval?: boolean
          default_visibility?: string
          notification_preferences?: Json
          branding?: Json | null
          user_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          id: string
          workspace_id: string
          title: string
          address: string
          type: string
          bedrooms: number
          bathrooms: number
          price: string
          description: string
          status: string
          experience_url: string | null
          cover_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          address: string
          type: string
          bedrooms?: number
          bathrooms?: number
          price: string
          description?: string
          status?: string
          experience_url?: string | null
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          address?: string
          type?: string
          bedrooms?: number
          bathrooms?: number
          price?: string
          description?: string
          status?: string
          experience_url?: string | null
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      spaces: {
        Row: {
          id: string
          property_id: string
          name: string
          captured: boolean
          verified: boolean
          issues: string[]
          capture_request_id: string | null
          thumbnail_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          captured?: boolean
          verified?: boolean
          issues?: string[]
          capture_request_id?: string | null
          thumbnail_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          captured?: boolean
          verified?: boolean
          issues?: string[]
          capture_request_id?: string | null
          thumbnail_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      media_items: {
        Row: {
          id: string
          property_id: string
          url: string
          type: string
          room: string | null
          quality: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          type?: string
          room?: string | null
          quality?: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          type?: string
          room?: string | null
          quality?: string
          uploaded_at?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          id: string
          property_id: string
          timestamp: string
          event: string
          detail: string | null
          type: string
          agent_decision: string | null
          evidence: string | null
          tool_used: string | null
        }
        Insert: {
          id?: string
          property_id: string
          timestamp?: string
          event: string
          detail?: string | null
          type: string
          agent_decision?: string | null
          evidence?: string | null
          tool_used?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          timestamp?: string
          event?: string
          detail?: string | null
          type?: string
          agent_decision?: string | null
          evidence?: string | null
          tool_used?: string | null
        }
        Relationships: []
      }
      capture_requests: {
        Row: {
          id: string
          property_id: string
          property_title: string
          room: string
          reason: string
          instructions: string
          estimated_time: string
          status: string
          recipient_name: string
          recipient_phone: string | null
          recipient_email: string | null
          capture_url: string | null
          uploaded_media: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          property_title: string
          room: string
          reason: string
          instructions: string
          estimated_time?: string
          status?: string
          recipient_name?: string
          recipient_phone?: string | null
          recipient_email?: string | null
          capture_url?: string | null
          uploaded_media?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          property_title?: string
          room?: string
          reason?: string
          instructions?: string
          estimated_time?: string
          status?: string
          recipient_name?: string
          recipient_phone?: string | null
          recipient_email?: string | null
          capture_url?: string | null
          uploaded_media?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          property_id: string
          property_title: string
          renter_name: string
          renter_phone: string
          renter_email: string
          preferred_date: string
          preferred_time: string
          message: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          property_title: string
          renter_name: string
          renter_phone: string
          renter_email: string
          preferred_date: string
          preferred_time: string
          message?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          property_title?: string
          renter_name?: string
          renter_phone?: string
          renter_email?: string
          preferred_date?: string
          preferred_time?: string
          message?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
