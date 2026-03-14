import { supabase } from './supabase';

export async function createNotification(
  userName: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  link?: string
) {
  try {
    await supabase.from('notifications').insert({
      user_name: userName,
      title,
      message,
      type,
      link,
      read: false,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
