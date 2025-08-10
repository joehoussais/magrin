# 🗄️ Supabase Setup Instructions

## 🚀 **Step 1: Create Supabase Project**

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Choose your organization**
5. **Enter project details:**
   - **Name**: `magrin-week`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. **Click "Create new project"**
7. **Wait for setup** (2-3 minutes)

## 🔑 **Step 2: Get API Keys**

1. **Go to Settings → API**
2. **Copy these values:**
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 🌐 **Step 3: Set Environment Variables**

1. **Create `.env.local` file** in your project root:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Replace the values** with your actual Supabase URL and anon key

## 🗃️ **Step 4: Set Up Database**

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the entire content** from `supabase-migration.sql`
3. **Paste it in the SQL Editor**
4. **Click "Run"** to execute the migration

## 👥 **Step 5: Add Admin Users**

1. **Go to Table Editor → admin_users**
2. **Add your admin users:**

| Email | Role | Name |
|-------|------|------|
| `your-email@example.com` | `super_admin` | `Your Name` |
| `tennis-guy@example.com` | `tennis_admin` | `Tennis Admin` |
| `running-guy@example.com` | `running_admin` | `Running Admin` |
| `chess-guy@example.com` | `chess_admin` | `Chess Admin` |

## 🔧 **Step 6: Update App Configuration**

1. **Update `src/supabase.ts`** with your actual URL and key
2. **Test the connection** by running the app

## 🎯 **Admin Roles Explained**

### **Super Admin** (`super_admin`)
- ✅ Can edit everything
- ✅ Can manage teams, people, settings
- ✅ Can edit all scores and data

### **Tennis Admin** (`tennis_admin`)
- ✅ Can edit tennis scores
- ✅ Can edit team powers (for tennis)
- ❌ Cannot edit other events

### **Running Admin** (`running_admin`)
- ✅ Can edit running scores
- ✅ Can edit team powers (for running)
- ❌ Cannot edit other events

### **Chess Admin** (`chess_admin`)
- ✅ Can edit chess scores
- ✅ Can edit team powers (for chess)
- ❌ Cannot edit other events

## 🔄 **Real-time Features**

Once set up, your app will have:
- **Real-time updates** - changes appear instantly for all users
- **Collaborative editing** - multiple admins can work simultaneously
- **Data persistence** - no more localStorage limitations
- **Role-based access** - different admins for different events

## 🚨 **Important Notes**

1. **Keep your API keys secure** - never commit them to public repos
2. **The free tier** includes:
   - 500MB database
   - 50,000 monthly active users
   - Real-time subscriptions
   - Row Level Security

3. **Backup your data** - Supabase provides automatic backups

## 🆘 **Troubleshooting**

### **Connection Issues**
- Check your environment variables
- Verify your Supabase URL and key
- Check the browser console for errors

### **Permission Issues**
- Make sure RLS policies are set up correctly
- Check that admin users exist in the database

### **Real-time Not Working**
- Check that you're subscribed to the correct channel
- Verify your Supabase project is active

## 🎉 **You're Ready!**

Once everything is set up:
1. **Multiple people can be admins**
2. **Changes appear in real-time**
3. **Data is persistent and secure**
4. **Role-based permissions work**

**Your Magrin Week app is now truly collaborative!** 🚀
