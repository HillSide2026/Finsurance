import type { StrIntake, StrReadinessStatus, SuspicionLevel } from "./str";

export const userRoleValues = ["owner", "member", "reviewer"] as const;
export type UserRole = (typeof userRoleValues)[number];

export const draftStatusValues = [
  "draft",
  "in_review",
  "ready_for_filing",
  "archived",
] as const;
export type DraftStatus = (typeof draftStatusValues)[number];

export const workflowStepViewValues = [
  "intake",
  "review",
  "narrative",
  "output",
] as const;
export type WorkflowStepView = (typeof workflowStepViewValues)[number];

export type WorkspaceSessionMeta = {
  id: string;
  timestamp: string;
};

export type TeamSummary = {
  id: string;
  name: string;
  slug: string;
};

export type UserSummary = {
  id: string;
  teamId: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthSessionSummary = {
  user: UserSummary;
  team: TeamSummary;
};

export type AuthSessionResponse = {
  ok: true;
  session: AuthSessionSummary | null;
};

export type RegisterRequest = {
  teamName: string;
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type DraftSummary = {
  id: string;
  title: string;
  status: DraftStatus;
  suspicionLevel: SuspicionLevel;
  readinessStatus: StrReadinessStatus;
  createdAt: string;
  updatedAt: string;
  createdByName: string;
  assignedReviewerName: string | null;
};

export type DraftRecord = {
  id: string;
  teamId: string;
  createdByUserId: string;
  updatedByUserId: string;
  assignedReviewerUserId: string | null;
  title: string;
  status: DraftStatus;
  lastWorkflowView: WorkflowStepView;
  sessionMeta: WorkspaceSessionMeta;
  intake: StrIntake;
  narrativeText: string;
  suspicionLevel: SuspicionLevel;
  readinessStatus: StrReadinessStatus;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string | null;
  lastExportedAt: string | null;
};

export type DraftDetailResponse = {
  ok: true;
  draft: DraftRecord;
};

export type DraftListResponse = {
  ok: true;
  drafts: DraftSummary[];
  reviewers: UserSummary[];
};

export type SaveDraftRequest = {
  draftId?: string;
  expectedUpdatedAt?: string;
  title: string;
  status: DraftStatus;
  assignedReviewerUserId: string | null;
  lastWorkflowView: WorkflowStepView;
  sessionMeta: WorkspaceSessionMeta;
  intake: StrIntake;
  narrativeText: string;
};

export type SaveDraftResponse = {
  ok: true;
  draft: DraftRecord;
};

export type RecordDraftExportRequest = {
  format: "narrative" | "package";
};

export type ProductEnquiryRequest = {
  name: string;
  email: string;
  company: string;
  sourcePath: string;
};

export type ProductEnquiryResponse = {
  ok: true;
  enquiryId: string;
};
