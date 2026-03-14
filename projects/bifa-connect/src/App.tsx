import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TimezoneProvider } from "@/context/TimezoneContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Governance from "./pages/Governance";
import Competitions from "./pages/Competitions";
import RefereeRegistry from "./pages/RefereeRegistry";
import RefereeSuspensions from "./pages/RefereeSuspensions";
import RefereeAssignments from "./pages/RefereeAssignments";
import RefereeDashboard from "./pages/RefereeDashboard";
import RefereeDebug from "./pages/RefereeDebug";
import AssignReferees from "./pages/AssignReferees";
import MatchReports from "./pages/MatchReports";
import Disciplinary from "./pages/Disciplinary";
import Players from "./pages/Players";
import Teams from "./pages/Teams";
import Stats from "./pages/Stats";
import Secretariat from "./pages/Secretariat";
import Architecture from "./pages/Architecture";
import UserManagement from "./pages/UserManagement";
import AuditLogs from "./pages/AuditLogs";
import MatchScheduling from "./pages/MatchScheduling";
import MatchResults from "./pages/MatchResults";
import IssueSanction from "./pages/IssueSanction";
import PlayerTransfer from "./pages/PlayerTransfer";
import SquadManagement from "./pages/SquadManagement";
import DocumentUpload from "./pages/DocumentUpload";
import FederationManagement from "./pages/FederationManagement";
import CompetitionEntries from "./pages/CompetitionEntries";
import CompetitionEntriesManagement from "./pages/CompetitionEntriesManagement";
import CreateCompetition from "./pages/CreateCompetition";
import TeamManagerDashboard from "./pages/TeamManagerDashboard";
import SquadManagementTeam from "./pages/SquadManagementTeam";
import PlayerTransferTeam from "./pages/PlayerTransferTeam";
import PlayerSuspension from "./pages/PlayerSuspension";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TimezoneProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/architecture" element={<Architecture />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard/team-manager" element={<ProtectedRoute><TeamManagerDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/squad-management-team" element={<ProtectedRoute><SquadManagementTeam /></ProtectedRoute>} />
                <Route path="/dashboard/player-transfer-team" element={<ProtectedRoute><PlayerTransferTeam /></ProtectedRoute>} />
                <Route path="/dashboard/governance" element={<ProtectedRoute><Governance /></ProtectedRoute>} />
                <Route path="/dashboard/competitions" element={<ProtectedRoute><Competitions /></ProtectedRoute>} />
                <Route path="/dashboard/referees" element={<ProtectedRoute><RefereeRegistry /></ProtectedRoute>} />
                <Route path="/dashboard/assign-referees" element={<ProtectedRoute><AssignReferees /></ProtectedRoute>} />
                <Route path="/dashboard/match-reports" element={<ProtectedRoute><MatchReports /></ProtectedRoute>} />
                <Route path="/dashboard/referee-suspensions" element={<ProtectedRoute><RefereeSuspensions /></ProtectedRoute>} />
                <Route path="/dashboard/referee-assignments" element={<ProtectedRoute><RefereeAssignments /></ProtectedRoute>} />
                <Route path="/dashboard/referee-dashboard" element={<ProtectedRoute><RefereeDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/referee-debug" element={<ProtectedRoute><RefereeDebug /></ProtectedRoute>} />
                <Route path="/dashboard/disciplinary" element={<ProtectedRoute><Disciplinary /></ProtectedRoute>} />
                <Route path="/dashboard/players" element={<ProtectedRoute><Players /></ProtectedRoute>} />
                <Route path="/dashboard/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
                <Route path="/dashboard/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
                <Route path="/dashboard/secretariat" element={<ProtectedRoute><Secretariat /></ProtectedRoute>} />
                <Route path="/dashboard/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/dashboard/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
                <Route path="/dashboard/match-scheduling" element={<ProtectedRoute><MatchScheduling /></ProtectedRoute>} />
                <Route path="/dashboard/match-results" element={<ProtectedRoute><MatchResults /></ProtectedRoute>} />
                <Route path="/dashboard/issue-sanction" element={<ProtectedRoute><IssueSanction /></ProtectedRoute>} />
                <Route path="/dashboard/player-transfer" element={<ProtectedRoute><PlayerTransfer /></ProtectedRoute>} />
                <Route path="/dashboard/squad-management" element={<ProtectedRoute><SquadManagement /></ProtectedRoute>} />
                <Route path="/dashboard/document-upload" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />
                <Route path="/dashboard/federation-management" element={<ProtectedRoute><FederationManagement /></ProtectedRoute>} />
                <Route path="/dashboard/competition-entries" element={<ProtectedRoute><CompetitionEntries /></ProtectedRoute>} />
                <Route path="/dashboard/competition-entries/:id" element={<ProtectedRoute><CompetitionEntriesManagement /></ProtectedRoute>} />
                <Route path="/dashboard/create-competition" element={<ProtectedRoute><CreateCompetition /></ProtectedRoute>} />
                <Route path="/dashboard/player-suspension" element={<ProtectedRoute><PlayerSuspension /></ProtectedRoute>} />
                <Route path="/dashboard/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </TimezoneProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
