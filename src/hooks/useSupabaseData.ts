import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { subscribeToChanges } from '../services/database'
import type { DataModel } from '../App'

export function useSupabaseData() {
  const [data, setData] = useState<DataModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  // Subscribe to real-time changes
  useEffect(() => {
    const unsubscribe = subscribeToChanges((payload) => {
      console.log('Real-time change:', payload)
      // Reload data when changes occur
      loadData()
    })

    return unsubscribe
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all data from Supabase
      const [
        teams,
        events,
        people,
        scores,
        markers,
        chatMessages,

        mapImageUrl,
        announcement
      ] = await Promise.all([
        supabase.from('teams').select('*').order('name'),
        supabase.from('events').select('*').order('name'),
        supabase.from('people').select('*').order('name'),
        supabase.from('scores').select('*'),
        supabase.from('map_markers').select('*').order('name'),
        supabase.from('chat_messages').select('*').order('created_at', { ascending: true }),

        supabase.from('app_settings').select('value').eq('key', 'map_image_url').single(),
        supabase.from('app_settings').select('value').eq('key', 'announcement').single()
      ])

      // Transform data to match DataModel structure
      const transformedData: DataModel = {
        teams: teams.data || [],
        events: events.data || [],
        people: (people.data || []).map(p => ({
          ...p,
          teamId: p.team_id,
          team_id: undefined
        })),
        scores: {
          byTeamEvent: (scores.data || []).reduce((acc, score) => {
            if (!acc[score.team_id]) acc[score.team_id] = {}
            acc[score.team_id][score.event_id] = score.points
            return acc
          }, {} as Record<string, Record<string, number>>)
        },
        map: {
          imageUrl: mapImageUrl.data?.value || '/magrin-app-enlarged.png',
          markers: (markers.data || []).map(m => ({
            ...m,
            id: m.id,
            name: m.name,
            emoji: m.emoji,
            type: m.type,
            description: m.description,
            x: m.x,
            y: m.y
          }))
        },

        chat: {
          messages: (chatMessages.data || []).map(msg => ({
            id: msg.id,
            name: msg.name,
            text: msg.text,
            ts: new Date(msg.created_at).getTime()
          }))
        },
        announcement: announcement.data?.value || ""
      }

      setData(transformedData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const updateData = async (updates: Partial<DataModel>) => {
    if (!data) return

    try {
      // Update local state immediately for optimistic updates
      setData(prev => prev ? { ...prev, ...updates } : null)

      // Apply updates to database
      if (updates.teams) {
        // Handle team updates
        for (const team of updates.teams) {
          if (team.id) {
            await supabase.from('teams').upsert(team)
          }
        }
      }

      if (updates.events) {
        // Handle event updates
        for (const event of updates.events) {
          if (event.id) {
            await supabase.from('events').upsert(event)
          }
        }
      }

      if (updates.people) {
        // Handle people updates
        for (const person of updates.people) {
          if (person.id) {
            const { team_id, ...personData } = person
            await supabase.from('people').upsert({
              ...personData,
              team_id: team_id
            })
          }
        }
      }

      if (updates.scores) {
        // Handle score updates
        for (const [teamId, events] of Object.entries(updates.scores.byTeamEvent)) {
          for (const [eventId, points] of Object.entries(events)) {
            await supabase.from('scores').upsert({
              team_id: teamId,
              event_id: eventId,
              points
            })
          }
        }
      }

      if (updates.map) {
        // Handle map updates
        if (updates.map.imageUrl) {
          await supabase.from('app_settings').upsert({
            key: 'map_image_url',
            value: updates.map.imageUrl
          })
        }

        if (updates.map.markers) {
          for (const marker of updates.map.markers) {
            if (marker.id) {
              await supabase.from('map_markers').upsert(marker)
            }
          }
        }
      }

      if (updates.chat) {
        // Handle chat updates
        for (const message of updates.chat.messages) {
          if (message.id && !message.ts) {
            await supabase.from('chat_messages').insert({
              name: message.name,
              text: message.text
            })
          }
        }
      }

      if (updates.announcement !== undefined) {
        await supabase.from('app_settings').upsert({
          key: 'announcement',
          value: updates.announcement
        })
      }

    } catch (err) {
      console.error('Error updating data:', err)
      // Reload data on error to ensure consistency
      loadData()
    }
  }

  return {
    data,
    loading,
    error,
    updateData,
    refresh: loadData
  }
}
