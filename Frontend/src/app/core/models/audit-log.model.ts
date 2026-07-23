export interface AuditLog {
  id: string;
  userId: string;
  userEmail?: string; // mapped helper
  action: string;
  entityName: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}
