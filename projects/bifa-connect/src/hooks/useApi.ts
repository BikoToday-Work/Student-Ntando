import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { competitionsApi } from '@/services/competitionsApi';
import { teamsApi, playersApi, matchesApi, refereesApi, disciplinaryApi, tasksApi, auditApi, notificationsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Competitions
export const useCompetitions = () => {
  return useQuery({
    queryKey: ['competitions'],
    queryFn: competitionsApi.getAll,
  });
};

export const useCreateCompetition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: competitionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      toast({ title: 'Success', description: 'Competition created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create competition', variant: 'destructive' });
    }
  });
};

// Teams
export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamsApi.getAll,
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => teamsApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({ title: 'Success', description: 'Team updated successfully' });
    }
  });
};

// Players
export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: playersApi.getAll,
  });
};

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: playersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast({ title: 'Success', description: 'Player added successfully' });
    }
  });
};

// Matches
export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: matchesApi.getAll,
  });
};

export const useLiveMatches = () => {
  return useQuery({
    queryKey: ['matches', 'live'],
    queryFn: matchesApi.getLive,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: matchesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast({ title: 'Success', description: 'Match created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create match', variant: 'destructive' });
    }
  });
};

export const useUpdateMatchScore = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, homeScore, awayScore }: { id: string; homeScore: number; awayScore: number }) => 
      matchesApi.updateScore(id, homeScore, awayScore),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast({ title: 'Success', description: 'Match score updated' });
    }
  });
};

// Referees
export const useReferees = () => {
  return useQuery({
    queryKey: ['referees'],
    queryFn: refereesApi.getAll,
  });
};

export const useRefereeByEmail = (email?: string) => {
  return useQuery({
    queryKey: ['referee-by-email', email],
    queryFn: async () => {
      if (!email) return null;
      const { data, error } = await supabase
        .from('referees')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (error) {
        console.error('Error fetching referee by email:', error);
        return null;
      }
      return data;
    },
    enabled: !!email,
  });
};

export const useCreateReferee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: refereesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referees'] });
      toast({ title: 'Success', description: 'Referee registered successfully' });
    }
  });
};

// Disciplinary
export const useDisciplinaryCases = () => {
  return useQuery({
    queryKey: ['disciplinary'],
    queryFn: disciplinaryApi.getAll,
  });
};

export const useUpdateCaseStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => disciplinaryApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinary'] });
      toast({ title: 'Success', description: 'Case status updated' });
    }
  });
};

// Tasks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Success', description: 'Task created successfully' });
    }
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => tasksApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Success', description: 'Task status updated' });
    }
  });
};

// Audit logs
export const useAuditLogs = (limit?: number) => {
  return useQuery({
    queryKey: ['audit-logs', limit],
    queryFn: () => auditApi.getRecent(limit),
  });
};

export const useLogAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: auditApi.log,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    }
  });
};

// Referee Suspensions
export const useRefereeSuspensions = (refereeId?: string) => {
  return useQuery({
    queryKey: ['referee-suspensions', refereeId],
    queryFn: () => refereesApi.getSuspensions(refereeId),
  });
};

export const useCreateSuspension = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: refereesApi.createSuspension,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referee-suspensions'] });
      queryClient.invalidateQueries({ queryKey: ['referees'] });
      toast({ title: 'Success', description: 'Suspension report filed successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to file suspension report', variant: 'destructive' });
    }
  });
};

export const useUpdateSuspensionStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => refereesApi.updateSuspensionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referee-suspensions'] });
      toast({ title: 'Success', description: 'Suspension status updated' });
    }
  });
};

// Referee Assignments
export const useRefereeAssignments = (refereeId?: string) => {
  return useQuery({
    queryKey: ['referee-assignments', refereeId],
    queryFn: async () => {
      if (!refereeId) return [];
      const { data, error } = await supabase
        .from('referee_assignments')
        .select('*, matches(*), referees(name, country)')
        .eq('referee_id', refereeId)
        .order('assigned_at', { ascending: false });
      if (error) {
        console.error('Error fetching assignments:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!refereeId,
  });
};

export const useAssignReferee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ matchId, refereeId }: { matchId: string; refereeId: string }) => 
      refereesApi.assignToMatch(matchId, refereeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referee-assignments'] });
      toast({ title: 'Success', description: 'Referee assigned to match' });
    },
    onError: (error: any) => {
      console.error('Assignment error:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to assign referee', 
        variant: 'destructive' 
      });
    }
  });
};

export const useRespondToAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ assignmentId, status, notes }: { assignmentId: string; status: 'accepted' | 'declined'; notes?: string }) => 
      refereesApi.respondToAssignment(assignmentId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referee-assignments'] });
      toast({ title: 'Success', description: 'Response submitted' });
    }
  });
};

// Match Reports
export const useMatchReports = (refereeId?: string) => {
  return useQuery({
    queryKey: ['match-reports', refereeId],
    queryFn: async () => {
      let query = supabase
        .from('match_reports')
        .select('*, matches(*), referees(name, country)')
        .order('created_at', { ascending: false });
      
      if (refereeId) {
        query = query.eq('referee_id', refereeId);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching match reports:', error);
        return [];
      }
      return data || [];
    },
  });
};

export const useCreateMatchReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: refereesApi.createMatchReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-reports'] });
      toast({ title: 'Success', description: 'Report created' });
    }
  });
};

export const useUpdateMatchReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reportId, updates }: { reportId: string; updates: any }) => 
      refereesApi.updateMatchReport(reportId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-reports'] });
    }
  });
};

export const useSubmitMatchReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: refereesApi.submitMatchReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-reports'] });
      toast({ title: 'Success', description: 'Report submitted successfully' });
    }
  });
};

// Notifications
export const useNotifications = (userName?: string) => {
  return useQuery({
    queryKey: ['notifications', userName],
    queryFn: () => notificationsApi.getAll(userName),
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};
