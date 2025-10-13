import { User, DateIdea, Match, Message, DateCategory, MatchData } from '../types';
import { supabase } from './supabaseClient';

export const apiService = {
  // --- AUTH ---
  async login(email: string, pass: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    // Fetch or create profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user!.id)
      .single();
    if (profileError && profileError.code === 'PGRST116') { // No rows
      // Create profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user!.id,
          name: data.user!.user_metadata?.name || 'User',
          email: data.user!.email!,
          age: 18,
          bio: '',
          images: [`https://picsum.photos/seed/${data.user!.id}/800/1200`],
          interests: [],
          is_premium: false,
        })
        .select()
        .single();
      if (insertError) throw insertError;
      profile = newProfile;
    } else if (profileError) throw profileError;
    return profile as User;
  },

  async signup(name: string, email: string, pass: string): Promise<void> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name,
        },
      },
    });
    if (error) throw error;
    // Profile will be created on first login after email confirmation
  },

  async updateUser(updatedUser: User): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: updatedUser.name,
        age: updatedUser.age,
        bio: updatedUser.bio,
        images: updatedUser.images,
        interests: updatedUser.interests,
        is_premium: updatedUser.isPremium,
        phone: updatedUser.phone,
      })
      .eq('id', updatedUser.id)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },

  // --- SWIPING ---
  async getUsersToSwipe(currentUserId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId);
    if (error) throw error;
    return data as User[];
  },
  
  // --- MATCHES & CHAT ---
  async getMatches(currentUserId: string): Promise<Match[]> {
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .contains('participants', [currentUserId]);
    if (error) throw error;

    const matchPromises = matches.map(async (matchData) => {
      const otherUserId = matchData.participants.find((pId: string) => pId !== currentUserId)!;
      const { data: otherUser, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single();
      if (userError) throw userError;

      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchData.id)
        .order('timestamp', { ascending: true });
      if (msgError) throw msgError;

      return {
        id: matchData.id,
        user: otherUser as User,
        messages: messages as Message[],
        interestType: matchData.interest_type,
        interestExpiresAt: matchData.interest_expires_at,
        dateIdeaId: matchData.date_idea_id,
        dateAuthorId: matchData.date_author_id,
      };
    });

    const results = await Promise.all(matchPromises);
    return results.sort((a, b) => b.id.localeCompare(a.id)); // Sort by most recent
  },

  async addMatch(currentUserId: string, targetUserId: string): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .insert({
        participants: [currentUserId, targetUserId],
        messages: [],
        interest_type: 'swipe',
        interest_expires_at: null,
      });
    if (error) throw error;
  },

  async createDateInterestMatch(currentUserId: string, dateIdea: DateIdea): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .insert({
        participants: [currentUserId, dateIdea.authorId],
        messages: [],
        interest_type: 'date',
        interest_expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        date_idea_id: dateIdea.id,
        date_author_id: dateIdea.authorId,
      });
    if (error) throw error;
  },

  async removeMatch(matchId: string): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);
    if (error) throw error;
  },
  
  async sendMessage(matchId: string, senderId: string, text: string): Promise<Message> {
    // First, check if match is expired and sender is not author
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();
    if (matchError) throw matchError;

    const isExpired = match.interest_expires_at && new Date(match.interest_expires_at) < new Date();
    if (match.interest_type === 'date' && isExpired && senderId !== match.date_author_id) {
      // Make it permanent
      await supabase
        .from('matches')
        .update({ interest_expires_at: null })
        .eq('id', matchId);
    }

    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: senderId,
        text,
      })
      .select()
      .single();
    if (msgError) throw msgError;
    return message as Message;
  },

  // --- DATES ---
  async getDateIdeas(): Promise<DateIdea[]> {
    const { data, error } = await supabase
      .from('date_ideas')
      .select(`
        *,
        profiles!date_ideas_author_id_fkey (
          name,
          images
        )
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      authorId: item.author_id,
      authorName: item.profiles.name,
      authorImage: item.profiles.images[0] || '',
      location: item.location,
      date: item.date,
      budget: item.budget,
      dressCode: item.dress_code,
    })) as DateIdea[];
  },
  
  async createDateIdea(newDate: Omit<DateIdea, 'id'>): Promise<DateIdea> {
    const { data, error } = await supabase
      .from('date_ideas')
      .insert({
        title: newDate.title,
        description: newDate.description,
        category: newDate.category,
        author_id: newDate.authorId,
        location: newDate.location,
        date: newDate.date,
        budget: newDate.budget,
        dress_code: newDate.dressCode,
      })
      .select(`
        *,
        profiles!date_ideas_author_id_fkey (
          name,
          images
        )
      `)
      .single();
    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      authorId: data.author_id,
      authorName: data.profiles.name,
      authorImage: data.profiles.images[0] || '',
      location: data.location,
      date: data.date,
      budget: data.budget,
      dressCode: data.dress_code,
    } as DateIdea;
  },
};

// Additional helper functions
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return profile as User;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};