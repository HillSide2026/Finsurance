export const productFunnelEventTypeValues = [
  "str_started",
  "str_completed",
  "export_initiated",
  "payment_completed",
] as const;

export type ProductFunnelEventType = (typeof productFunnelEventTypeValues)[number];

export type RecordProductFunnelEventRequest = {
  eventType: ProductFunnelEventType;
  flowId: string;
  draftId?: string | null;
  sourcePath?: string;
};

export type RecordProductFunnelEventResponse = {
  ok: true;
  recorded: true;
  duplicate: boolean;
};

export type ProductFunnelSummary = {
  counts: {
    strStarted: number;
    strCompleted: number;
    exportInitiated: number;
    paymentCompleted: number;
  };
  rates: {
    completionFromStarted: number | null;
    reachExportFromStarted: number | null;
    paymentFromExportInitiated: number | null;
    paymentFromStarted: number | null;
  };
  dropOffs: {
    startedWithoutCompletion: number;
    completedWithoutExportInitiated: number;
    exportInitiatedWithoutPayment: number;
  };
  lastEventAt: string | null;
};

export type ProductFunnelSummaryResponse = {
  ok: true;
  summary: ProductFunnelSummary;
};
