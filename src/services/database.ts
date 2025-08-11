import { supabase } from '../supabase'
import type { DataModel } from '../App'

// Teams
export const teamsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async create(team: { name: string; color: string }) {
    const { data, error } = await supabase
      .from('teams')
      .insert(team)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: { name?: string; color?: string }) {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Events
export const eventsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async create(event: { name: string; emoji: string; weight: number }) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: { name?: string; emoji?: string; weight?: number }) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// People
export const peopleService = {
  async getAll() {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async create(person: { name: string; team_id?: string; emoji?: string; bio?: string; ratings: any }) {
    const { data, error } = await supabase
      .from('people')
      .insert(person)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: { name?: string; team_id?: string; emoji?: string; bio?: string; ratings?: any }) {
    const { data, error } = await supabase
      .from('people')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('people')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Scores
export const scoresService = {
  async getAll() {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
    
    if (error) throw error
    return data
  },

  async setScore(teamId: string, eventId: string, points: number) {
    const { data, error } = await supabase
      .from('scores')
      .upsert({ team_id: teamId, event_id: eventId, points, updated_at: new Date().toISOString() })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteScore(teamId: string, eventId: string) {
    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('team_id', teamId)
      .eq('event_id', eventId)
    
    if (error) throw error
  }
}

// Map Markers
export const markersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('map_markers')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async create(marker: { name: string; emoji?: string; type?: string; description?: string; x: number; y: number }) {
    const { data, error } = await supabase
      .from('map_markers')
      .insert(marker)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: { name?: string; emoji?: string; type?: string; description?: string; x?: number; y?: number }) {
    const { data, error } = await supabase
      .from('map_markers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('map_markers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Chat Messages
export const chatService = {
  async getAll() {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async sendMessage(message: { name: string; text: string }) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}



// App Settings
export const settingsService = {
  async get(key: string) {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data?.value
  },

  async set(key: string, value: any) {
    const { data, error } = await supabase
      .from('app_settings')
      .upsert({ key, value })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Admin Users
export const adminService = {
  async getAll() {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async create(admin: { email: string; role: string; name: string }) {
    const { data, error } = await supabase
      .from('admin_users')
      .insert(admin)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}

// Real-time subscriptions
export const subscribeToChanges = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('magrin-changes')
    .on('postgres_changes', { event: '*', schema: 'public' }, callback)
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}
