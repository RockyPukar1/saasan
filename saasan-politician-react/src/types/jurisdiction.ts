// Jurisdiction types matching backend entities
export interface JurisdictionHierarchy {
  provinceId?: string;
  districtId?: string;
  constituencyId?: string;
  municipalityId?: string;
  wardId?: string;
}

export interface LocationDto {
  _id: string;
  name: string;
  type: 'province' | 'district' | 'constituency' | 'municipality' | 'ward';
  provinceId?: string;
  districtId?: string;
  constituencyId?: string;
  municipalityId?: string;
  wardNumber?: number;
  constituencyNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PoliticianJurisdiction {
  politicianId: string;
  jurisdiction: JurisdictionHierarchy;
  accessibleAreas: LocationDto[];
  jurisdictionLevel: 'federal' | 'province' | 'constituency' | 'district' | 'municipality' | 'ward';
}

// Jurisdiction-based filtering for different content types
export interface JurisdictionFilter {
  jurisdiction: JurisdictionHierarchy;
  includeNested?: boolean; // Include smaller administrative units
}

// Threaded communication types
export interface MessageThread {
  id: string;
  subject: string;
  category: 'complaint' | 'suggestion' | 'question' | 'request';
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  jurisdiction: JurisdictionHierarchy;
  participants: {
    citizen: {
      id: string;
      name: string;
      email: string;
      location: JurisdictionHierarchy;
    };
    politician: {
      id: string;
      name: string;
    };
    assignedStaff?: {
      id: string;
      name: string;
      role: string;
    }[];
  };
  messages: MessageEntry[];
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageEntry {
  id: string;
  senderId: string;
  senderType: 'citizen' | 'politician' | 'staff';
  content: string;
  attachments?: MessageAttachment[];
  isInternal?: boolean; // Internal notes between politician and staff
  createdAt: string;
  readAt?: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Jurisdiction-based announcements
export interface JurisdictionAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'update' | 'achievement' | 'meeting';
  priority: 'low' | 'medium' | 'high';
  targetJurisdiction: JurisdictionHierarchy;
  isPublic: boolean;
  scheduledAt?: string;
  publishedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  visibility: {
    provinces?: string[];
    districts?: string[];
    constituencies?: string[];
    municipalities?: string[];
    wards?: string[];
  };
}

// Jurisdiction-based reports
export interface JurisdictionReport {
  id: string;
  title: string;
  description: string;
  jurisdiction: JurisdictionHierarchy;
  reporterId: string;
  reporterLocation: JurisdictionHierarchy;
  typeId: string;
  priorityId: string;
  statusId: string;
  visibilityId: string;
  referenceNumber: string;
  tags: string[];
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  // ... other report fields from ReportDto
}
