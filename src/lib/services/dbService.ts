import prisma from '../prisma';

export interface LeadData {
  id: string;
  currentStep: number;
  status: string;
  packageSelected?: string | null;
  referralCodeUsed?: string | null;
  pricePaid?: number | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Step 1: Ziel der Prüfung
  analysisGoal?: string | null;
  importantQuestion?: string | null;
  
  // Step 2: Kontaktdaten
  contactFirstName?: string | null;
  contactLastName?: string | null;
  contactName?: string | null; // legacy fallback
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactRole?: string | null;
  
  // Step 3: Grundstück finden
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressZip?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  cadastralDistrict?: string | null;
  geoportalLink?: string | null;
  
  // Step 4: Grundstücksdaten
  plotArea?: number | null;
  plotShape?: string | null;
  slope?: string | null;
  developmentStatus?: string | null;
  accessRoad?: string | null;
  
  // Step 5: Bestand
  plotIsBuilt?: boolean | null;
  buildingType?: string | null;
  constructionYear?: string | null;
  floorsCount?: string | null;
  buildingUsage?: string | null;
  demolitionPossible?: string | null;
  
  // Step 6: Planungsrecht
  zoningPlanExists?: string | null;
  hasPlanningDocuments?: boolean | null;
  neighborhoodZoning?: string | null;
  planningSpecialNotes?: string | null;
  planningInfoDetails?: string | null;
  
  // Step 7: Vorhaben konkretisieren
  targetType?: string | null;
  targetArea?: string | null;
  targetUnits?: string | null;
  targetDensityType?: string | null;
  targetDensityUnits?: string | null;
  targetFloors?: string | null;
  knowsStructure?: boolean | null;
  targetDivisions?: string | null;
  isSalePlanned?: boolean | null;
  projectDetails?: string | null;
  
  // Step 8: Rahmenbedingungen
  timelineUrgency?: string | null;
  projectGoal?: string | null;
  budgetRange?: string | null;
  timeline?: string | null; // legacy fallback
  budget?: string | null; // legacy fallback
  
  documents?: DocumentData[];
}

export interface DocumentData {
  id: string;
  leadId: string;
  category: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  createdAt: Date;
}

export interface ReferralCodeData {
  code: string;
  isValid: boolean;
  currentUses: number;
  maxUses?: number | null;
  createdAt: Date;
}

// In-Memory mock storage for local testing fallback when DB is not connected
class MockStorage {
  private leads: Map<string, LeadData> = new Map();
  private documents: Map<string, DocumentData> = new Map();
  private referralCodes: Map<string, ReferralCodeData> = new Map();

  constructor() {
    // Seed some mock referral codes
    this.referralCodes.set('WALDBUND', { code: 'WALDBUND', isValid: true, currentUses: 0, maxUses: null, createdAt: new Date() });
  }

  async getLead(id: string): Promise<LeadData | null> {
    const lead = this.leads.get(id);
    if (!lead) return null;
    const docs = Array.from(this.documents.values()).filter(d => d.leadId === id);
    return { ...lead, documents: docs };
  }

  async createLead(): Promise<LeadData> {
    const newLead: LeadData = {
      id: crypto.randomUUID(),
      currentStep: 1,
      status: 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.leads.set(newLead.id, newLead);
    return newLead;
  }

  async updateLead(id: string, data: Partial<LeadData>): Promise<LeadData> {
    const existing = this.leads.get(id) || await this.createLead();
    if (existing.id !== id) {
      existing.id = id;
    }
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    this.leads.set(id, updated);
    return updated;
  }

  async addDocument(doc: Omit<DocumentData, 'id' | 'createdAt'>): Promise<DocumentData> {
    const newDoc: DocumentData = {
      ...doc,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    this.documents.set(newDoc.id, newDoc);
    return newDoc;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  async getDocuments(leadId: string): Promise<DocumentData[]> {
    return Array.from(this.documents.values()).filter(d => d.leadId === leadId);
  }

  async getAllLeads(): Promise<LeadData[]> {
    return Array.from(this.leads.values()).map(lead => {
      const docs = Array.from(this.documents.values()).filter(d => d.leadId === lead.id);
      return { ...lead, documents: docs };
    });
  }

  async getReferralCode(code: string): Promise<ReferralCodeData | null> {
    return this.referralCodes.get(code.toUpperCase()) || null;
  }

  async incrementReferralCode(code: string): Promise<void> {
    const ref = this.referralCodes.get(code.toUpperCase());
    if (ref) {
      ref.currentUses += 1;
      this.referralCodes.set(ref.code, ref);
    }
  }
}

const mockDb = new MockStorage();

// Detect if we can connect to Prisma database
const globalForDbCheck = globalThis as unknown as {
  isDbConnected?: boolean | null;
  dbCheckPromise?: Promise<void> | null;
};

if (globalForDbCheck.isDbConnected === undefined) {
  globalForDbCheck.isDbConnected = null;
}

async function checkDbConnection() {
  if (globalForDbCheck.isDbConnected !== null) return;
  
  if (!globalForDbCheck.dbCheckPromise) {
    globalForDbCheck.dbCheckPromise = (async () => {
      try {
        // Simple query to test connection
        await prisma.$queryRaw`SELECT 1`;
        globalForDbCheck.isDbConnected = true;
      } catch (error) {
        console.warn('⚠️ PostgreSQL database connection failed. Falling back to In-Memory storage.');
        globalForDbCheck.isDbConnected = false;
      }
    })();
  }
  
  await globalForDbCheck.dbCheckPromise;
}

// Check database connection once at startup
checkDbConnection();

async function handleDbError(error: any) {
  console.error('Database operation failed:', error.message || error);
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (dbError) {
    console.warn('⚠️ Database connection lost. Falling back to In-Memory storage.');
    globalForDbCheck.isDbConnected = false;
  }
}

function sanitizeLeadData(data: any): any {
  const sanitized: any = {};
  
  const stringFields = [
    'status', 'packageSelected', 'referralCodeUsed', 'paymentMethod', 'paymentStatus',
    'analysisGoal', 'importantQuestion', 'contactFirstName', 'contactLastName',
    'contactEmail', 'contactPhone', 'contactRole', 'addressStreet', 'addressNumber',
    'addressZip', 'addressCity', 'addressState', 'cadastralDistrict', 'geoportalLink',
    'plotShape', 'slope', 'developmentStatus', 'accessRoad', 'buildingType',
    'constructionYear', 'floorsCount', 'buildingUsage', 'demolitionPossible',
    'zoningPlanExists', 'neighborhoodZoning', 'planningSpecialNotes', 'planningInfoDetails',
    'targetType', 'targetArea', 'targetUnits', 'targetDensityType', 'targetDensityUnits',
    'targetFloors', 'targetDivisions', 'projectDetails', 'timelineUrgency',
    'projectGoal', 'budgetRange', 'budget'
  ];
  
  for (const field of stringFields) {
    if (field in data) {
      const val = data[field];
      if (val === undefined || val === null || val === '') {
        sanitized[field] = null;
      } else {
        sanitized[field] = String(val);
      }
    }
  }
  
  if ('currentStep' in data) {
    const val = data.currentStep;
    if (val === undefined || val === null || val === '') {
      sanitized.currentStep = 1;
    } else {
      const parsed = parseInt(String(val), 10);
      sanitized.currentStep = isNaN(parsed) ? 1 : parsed;
    }
  }
  
  if ('pricePaid' in data) {
    const val = data.pricePaid;
    if (val === undefined || val === null || val === '') {
      sanitized.pricePaid = null;
    } else {
      const parsed = parseFloat(String(val));
      sanitized.pricePaid = isNaN(parsed) ? null : parsed;
    }
  }
  
  if ('plotArea' in data) {
    const val = data.plotArea;
    if (val === undefined || val === null || val === '') {
      sanitized.plotArea = null;
    } else {
      const parsed = parseFloat(String(val));
      sanitized.plotArea = isNaN(parsed) ? null : parsed;
    }
  }
  
  const booleanFields = [
    'plotIsBuilt', 'hasPlanningDocuments', 'knowsStructure', 'isSalePlanned'
  ];
  
  for (const field of booleanFields) {
    if (field in data) {
      const val = data[field];
      if (val === undefined || val === null || val === '') {
        sanitized[field] = null;
      } else {
        sanitized[field] = val === true || val === 'true' || val === 1 || val === '1';
      }
    }
  }
  
  return sanitized;
}

export const dbService = {
  async getLead(id: string): Promise<LeadData | null> {
    if (globalForDbCheck.isDbConnected === null) await checkDbConnection();
    if (globalForDbCheck.isDbConnected === false) {
      return mockDb.getLead(id);
    }
    try {
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: { documents: true }
      });
      return lead as LeadData | null;
    } catch (e: any) {
      await handleDbError(e);
      return mockDb.getLead(id);
    }
  },

  async createLead(): Promise<LeadData> {
    if (globalForDbCheck.isDbConnected === null) await checkDbConnection();
    if (globalForDbCheck.isDbConnected === false) {
      return mockDb.createLead();
    }
    try {
      const lead = await prisma.lead.create({
        data: {
          currentStep: 1,
          status: 'DRAFT'
        }
      });
      return lead as LeadData;
    } catch (e: any) {
      await handleDbError(e);
      return mockDb.createLead();
    }
  },

  async updateLead(id: string, data: Partial<LeadData>): Promise<LeadData> {
    if (globalForDbCheck.isDbConnected === null) await checkDbConnection();
    // Strip relations and complex properties that Prisma shouldn't update directly
    const { documents, createdAt, updatedAt, ...cleanData } = data;
    const sanitized = sanitizeLeadData(cleanData);
    
    if (globalForDbCheck.isDbConnected === false) {
      return mockDb.updateLead(id, sanitized);
    }
    try {
      const lead = await prisma.lead.update({
        where: { id },
        data: {
          ...sanitized,
          updatedAt: new Date()
        }
      });
      return lead as LeadData;
    } catch (e: any) {
      await handleDbError(e);
      return mockDb.updateLead(id, sanitized);
    }
  },

  async addDocument(leadId: string, doc: Omit<DocumentData, 'id' | 'createdAt' | 'leadId'>): Promise<DocumentData> {
    if (globalForDbCheck.isDbConnected === null) await checkDbConnection();
    if (globalForDbCheck.isDbConnected === false) {
      return mockDb.addDocument({ ...doc, leadId });
    }
    try {
      const created = await prisma.document.create({
        data: {
          leadId,
          category: doc.category,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          fileSize: doc.fileSize
        }
      });
      return created as DocumentData;
    } catch (e) {
      await handleDbError(e);
      return mockDb.addDocument({ ...doc, leadId });
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    if (globalForDbCheck.isDbConnected === null) await checkDbConnection();
    if (globalForDbCheck.isDbConnected === false) {
      return mockDb.deleteDocument(id);
    }
    try {
      await prisma.document.delete({
        where: { id }
      });
      return true;
    } catch (e) {
      await handleDbError(e);
      return mockDb.deleteDocument(id);
    }
  },

  async getDocuments(leadId: string): Promise<DocumentData[]> {
    if (globalForDbCheck.isDbConnected === null) await checkDbConnection();
    if (globalForDbCheck.isDbConnected === false) {
      return mockDb.getDocuments(leadId);
    }
    try {
      const docs = await prisma.document.findMany({
        where: { leadId }
      });
      return docs as DocumentData[];
    } catch (e) {
      await handleDbError(e);
      return mockDb.getDocuments(leadId);
    }
  },

  async getAllLeads(): Promise<LeadData[]> {
    if (globalForDbCheck.isDbConnected === null) await checkDbConnection();
    if (globalForDbCheck.isDbConnected === false) {
      return mockDb.getAllLeads();
    }
    try {
      const leads = await prisma.lead.findMany({
        include: { documents: true },
        orderBy: { createdAt: 'desc' }
      });
      return leads as LeadData[];
    } catch (e) {
      await handleDbError(e);
      return mockDb.getAllLeads();
    }
  },

  async getReferralCode(code: string): Promise<ReferralCodeData | null> {
    if (globalForDbCheck.isDbConnected === null) await checkDbConnection();
    if (globalForDbCheck.isDbConnected === false) {
      return mockDb.getReferralCode(code);
    }
    try {
      const ref = await prisma.referralCode.findUnique({
        where: { code: code.toUpperCase() }
      });
      return ref as ReferralCodeData | null;
    } catch (e) {
      await handleDbError(e);
      return mockDb.getReferralCode(code);
    }
  },

  async incrementReferralCode(code: string): Promise<void> {
    if (globalForDbCheck.isDbConnected === null) await checkDbConnection();
    if (globalForDbCheck.isDbConnected === false) {
      return mockDb.incrementReferralCode(code);
    }
    try {
      const ref = await prisma.referralCode.findUnique({
        where: { code: code.toUpperCase() }
      });
      if (ref) {
        await prisma.referralCode.update({
          where: { code: ref.code },
          data: { currentUses: { increment: 1 } }
        });
      }
    } catch (e) {
      await handleDbError(e);
      return mockDb.incrementReferralCode(code);
    }
  }
};
