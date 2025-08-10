import { supabase } from '../supabase'
import { adminService } from './database'

export interface AdminUser {
  id: string
  email: string
  role: string
  name: string
}

export const authService = {
  // Check if user is admin by email
  async checkAdminAccess(email: string): Promise<AdminUser | null> {
    try {
      const admin = await adminService.getByEmail(email)
      return admin
    } catch (error) {
      console.error('Admin check failed:', error)
      return null
    }
  },

  // Simple password-based admin check (for backward compatibility)
  async checkPasswordAccess(password: string): Promise<boolean> {
    // Keep the old password system for now
    const validPasswords = ["magrino2025", "admin2025"]
    return validPasswords.includes(password)
  },

  // Get current admin user from localStorage
  getCurrentAdmin(): AdminUser | null {
    const adminData = localStorage.getItem('magrin_admin_user')
    if (adminData) {
      try {
        return JSON.parse(adminData)
      } catch {
        return null
      }
    }
    return null
  },

  // Set current admin user
  setCurrentAdmin(admin: AdminUser | null) {
    if (admin) {
      localStorage.setItem('magrin_admin_user', JSON.stringify(admin))
    } else {
      localStorage.removeItem('magrin_admin_user')
    }
  },

  // Check if user has permission for specific action
  hasPermission(admin: AdminUser | null, action: string): boolean {
    if (!admin) return false
    
    // Super admin can do everything
    if (admin.role === 'super_admin') return true
    
    // Role-based permissions
    switch (action) {
      case 'edit_tennis':
        return admin.role === 'tennis_admin' || admin.role === 'super_admin'
      case 'edit_running':
        return admin.role === 'running_admin' || admin.role === 'super_admin'
      case 'edit_chess':
        return admin.role === 'chess_admin' || admin.role === 'super_admin'
      case 'edit_teams':
        return admin.role === 'super_admin'
      case 'edit_people':
        return admin.role === 'super_admin'
      case 'edit_settings':
        return admin.role === 'super_admin'
      default:
        return false
    }
  },

  // Get role display name
  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'tennis_admin':
        return 'Tennis Admin'
      case 'running_admin':
        return 'Running Admin'
      case 'chess_admin':
        return 'Chess Admin'
      default:
        return role
    }
  }
}
