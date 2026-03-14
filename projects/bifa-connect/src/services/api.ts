import { supabase } from '@/lib/supabase';

export const teamsApi = {
  async getAll() {
    const { data, error } = await supabase.from('teams').select('*').order('points', { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(team: any) {
    const { data, error } = await supabase.from('teams').insert(team).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, updates: any) {
    const { data, error } = await supabase.from('teams').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

export const playersApi = {
  async getAll() {
    const { data, error } = await supabase.from('players').select('*').order('rating', { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(player: any) {
    const { data, error } = await supabase.from('players').insert(player).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, updates: any) {
    const { data, error } = await supabase.from('players').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

export const matchesApi = {
  async getAll() {
    const { data, error } = await supabase.from('matches').select('*').order('kickoff_utc', { ascending: true });
    if (error) throw error;
    return data;
  },
  async getLive() {
    const { data, error } = await supabase.from('matches').select('*').eq('status', 'live');
    if (error) throw error;
    return data;
  },
  async create(match: any) {
    const { data, error } = await supabase.from('matches').insert(match).select().single();
    if (error) throw error;
    return data;
  },
  async updateScore(id: string, homeScore: number, awayScore: number) {
    const { data, error } = await supabase.from('matches').update({ home_score: homeScore, away_score: awayScore }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) throw error;
  }
};

export const refereesApi = {
  async getAll() {
    const { data, error } = await supabase.from('referees').select('*').order('rating', { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(referee: any) {
    const { data, error } = await supabase.from('referees').insert(referee).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, updates: any) {
    const { data, error } = await supabase.from('referees').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async getSuspensions(refereeId?: string) {
    let query = supabase.from('referee_suspensions').select('*, referees(name, country, flag)');
    if (refereeId) query = query.eq('referee_id', refereeId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async createSuspension(suspension: any) {
    const { data, error } = await supabase.from('referee_suspensions').insert(suspension).select().single();
    if (error) throw error;
    return data;
  },
  async updateSuspensionStatus(id: string, status: string) {
    const { data, error } = await supabase.from('referee_suspensions').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async getAssignments(refereeId?: string) {
    let query = supabase.from('referee_assignments').select('*, matches(*), referees(name, country)');
    if (refereeId) query = query.eq('referee_id', refereeId);
    const { data, error } = await query.order('assigned_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async assignToMatch(matchId: string, refereeId: string) {
    const { data, error } = await supabase.from('referee_assignments').insert({
      match_id: matchId,
      referee_id: refereeId,
      assignment_status: 'pending'
    }).select().single();
    if (error) throw error;
    return data;
  },
  async respondToAssignment(assignmentId: string, status: 'accepted' | 'declined', notes?: string) {
    const { data, error } = await supabase.from('referee_assignments').update({
      assignment_status: status,
      responded_at: new Date().toISOString(),
      notes
    }).eq('id', assignmentId).select().single();
    if (error) throw error;
    return data;
  },
  async getMatchReports(refereeId?: string) {
    let query = supabase.from('match_reports').select('*, matches(*)');
    if (refereeId) query = query.eq('referee_id', refereeId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async createMatchReport(report: any) {
    const { data, error } = await supabase.from('match_reports').insert(report).select().single();
    if (error) throw error;
    return data;
  },
  async updateMatchReport(reportId: string, updates: any) {
    const { data, error } = await supabase.from('match_reports').update(updates).eq('id', reportId).select().single();
    if (error) throw error;
    return data;
  },
  async submitMatchReport(reportId: string) {
    const { data, error } = await supabase.from('match_reports').update({
      report_status: 'submitted',
      submitted_at: new Date().toISOString()
    }).eq('id', reportId).select().single();
    if (error) throw error;
    return data;
  }
};

export const disciplinaryApi = {
  async getAll() {
    const { data, error } = await supabase.from('disciplinary_cases').select('*').order('reported_date', { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(caseData: any) {
    const { data, error } = await supabase.from('disciplinary_cases').insert(caseData).select().single();
    if (error) throw error;
    return data;
  },
  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase.from('disciplinary_cases').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

export const tasksApi = {
  async getAll() {
    const { data, error } = await supabase.from('secretariat_tasks').select('*').order('due_date', { ascending: true });
    if (error) throw error;
    return data;
  },
  async create(task: any) {
    const { data, error } = await supabase.from('secretariat_tasks').insert(task).select().single();
    if (error) throw error;
    return data;
  },
  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase.from('secretariat_tasks').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

export const auditApi = {
  async log(logData: any) {
    const { data, error } = await supabase.from('audit_logs').insert(logData).select().single();
    if (error) throw error;
    return data;
  },
  async getRecent(limit = 50) {
    const { data, error } = await supabase.from('audit_logs').select('*').order('timestamp_utc', { ascending: false }).limit(limit);
    if (error) throw error;
    return data;
  }
};

export const notificationsApi = {
  async getAll(userName?: string) {
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (userName) query = query.eq('user_name', userName);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async create(notification: any) {
    const { data, error } = await supabase.from('notifications').insert(notification).select().single();
    if (error) throw error;
    return data;
  },
  async markAsRead(id: string) {
    const { data, error } = await supabase.from('notifications').update({ read: true }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async markAllAsRead(userName: string) {
    const { data, error } = await supabase.from('notifications').update({ read: true }).eq('user_name', userName).eq('read', false);
    if (error) throw error;
    return data;
  }
};
