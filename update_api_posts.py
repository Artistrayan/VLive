import sys

with open('src/services/api.js', 'r') as f:
    lines = f.read().split('\n')

social_api = '''export const apiSocial = {
  async getPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username, avatar)')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(p => ({
      id: p.id,
      userId: p.user_id,
      username: p.profiles?.username || 'Unknown',
      userAvatar: p.profiles?.avatar || '',
      caption: p.caption,
      videoUrl: p.media_url,
      imageUrl: p.media_url,
      likes: p.likes_count,
      comments: p.comments_count,
      time: new Date(p.created_at).toLocaleDateString()
    }));
  },
  async createPost(mediaUrl, caption) {
    const uid = getUserId();
    if (!uid) return { success: false };
    const { data, error } = await supabase.from('posts').insert([{ user_id: uid, media_url: mediaUrl, caption }]).select();
    return { success: !error, data: data?.[0] };
  },
  async getStories() {
    const { data, error } = await supabase
      .from('stories')
      .select('*, profiles(username, avatar)')
      .gt('expires_at', new Date().toISOString());
    if (error) return [];
    return data.map(s => ({
      id: s.id,
      username: s.profiles?.username || 'Unknown',
      userAvatar: s.profiles?.avatar || '',
      imageUrl: s.media_url,
      videoUrl: s.media_url,
      hasRing: true
    }));
  },
  async createStory(mediaUrl) {
    const uid = getUserId();
    if (!uid) return { success: false };
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase.from('stories').insert([{ user_id: uid, media_url: mediaUrl, expires_at: expiresAt }]).select();
    return { success: !error, data: data?.[0] };
  }
};'''

lines.append(social_api)

with open('src/services/api.js', 'w') as f:
    f.write('\n'.join(lines))
