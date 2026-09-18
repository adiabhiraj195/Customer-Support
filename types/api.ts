export type UserRole = "Admin" | "Customer" | "Support Agent";
export type UserStatus = "ACTIVE" | "PENDING_APPROVAL" | "REJECTED";

export interface Organisation {
  id: string;
  name: string;
  type?: string;
  config?: Record<string, unknown>;
  createdAt?: string;
  _count?: {
    users?: number;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role?: UserRole | string;
  status?: UserStatus | string;
  isVerified?: boolean;
  organisationId?: string;
  organisation?: Organisation;
  createdAt: string;
  updatedAt?: string;
}

export interface OrganisationsResponse {
  success: boolean;
  data: {
    organisations: Organisation[];
  };
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
    organisation?: Organisation;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  role?: UserRole | string;
  organisationName?: string;
  organisationType?: string;
  organisationConfig?: Record<string, unknown>;
  organisationId?: string;
}

export interface RegisterAdminRequest {
  email: string;
  password: string;
  name?: string;
  organisationName: string;
  organisationType?: string;
  organisationConfig?: Record<string, unknown>;
}

export interface RegisterCustomerRequest {
  email: string;
  password: string;
  name?: string;
  organisationId?: string;
  organisationName?: string;
}

export interface RegisterSupportAgentRequest {
  email: string;
  password: string;
  name?: string;
  organisationId?: string;
  organisationName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface SupportAgentResponse {
  success: boolean;
  message?: string;
  data?: {
    agents?: User[];
    agent?: User;
  };
}

export interface MessageSource {
  index: number;
  chunkId: string;
  filename: string;
  content: string;
  relevanceScore: number;
}

export interface PipelineStats {
  semanticRetrieved?: number;
  lexicalRetrieved?: number;
  rrfCandidates?: number;
  rerankedChunks?: number;
  passedThresholdChunks?: number;
  scoreThreshold?: number;
  durationMs?: number;
}

export interface MessageMetadata {
  sources?: MessageSource[];
  pipelineStats?: PipelineStats;
  originalQuery?: string;
  rewrittenQuery?: string;
  queryRewriteStatus?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: MessageMetadata | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
  messages?: Message[];
}

export interface ConversationsListResponse {
  success: boolean;
  data: {
    conversations: Conversation[];
  };
}

export interface ConversationDetailResponse {
  success: boolean;
  data: {
    conversation: Conversation;
  };
}

export interface CreateConversationRequest {
  title?: string;
}

export interface CreateConversationResponse {
  success: boolean;
  message?: string;
  data: {
    conversation: Conversation;
  };
}

export interface SendMessageRequest {
  message: string;
  content?: string;
  query?: string;
  topK?: number;
  rrfK?: number;
}

export interface SendMessageResponse {
  success: boolean;
  status?: string;
  message?: string;
  data: {
    conversationId?: string;
    userMessage?: Partial<Message>;
    assistantMessage?: Partial<Message>;
    answer?: string;
    sources?: MessageSource[];
    pipelineStats?: PipelineStats;
    rewrittenQuery?: string;
    status?: string;
    clarification?: string;
  };
}

export interface UploadUrlRequest {
  filename: string;
  mimeType?: string;
  userId?: string;
  expiresIn?: number;
}

export interface UploadUrlResponse {
  success: boolean;
  message?: string;
  data: {
    uploadUrl?: string;
    presignedUrl?: string;
    key?: string;
    s3Key?: string;
    bucket?: string;
    filename?: string;
    mimeType?: string;
    expiresIn: number;
    method?: string;
    contentType?: string;
    requiredHeaders?: Record<string, string>;
  };
}

export interface IngestRequest {
  s3Key: string;
  filename?: string;
  mimeType?: string;
  documentId?: string;
  userId?: string;
  version?: number;
  chunkSize?: number;
  chunkOverlap?: number;
  metadata?: Record<string, unknown>;
}

export interface IngestResponse {
  success: boolean;
  message?: string;
  data: {
    jobId: string;
    documentId: string;
    filename: string;
    status: string;
    queuedAt?: string;
    queueName?: string;
    s3Key?: string;
    mimeType?: string;
    chunkSize?: number;
    chunkOverlap?: number;
  };
}

export interface JobStatusResponse {
  success: boolean;
  data: {
    jobId: string;
    state: "pending" | "active" | "completed" | "failed" | string;
    progress: number;
    result?: {
      success: boolean;
      documentId?: string;
      userId?: string;
      version?: number;
      totalChunks?: number;
      processedAt?: string;
      source?: string;
    };
    failedReason?: string;
    timestamp?: number;
    processedOn?: number;
    finishedOn?: number;
  };
}

export interface StatelessChatRequest {
  query: string;
  topK?: number;
  rrfK?: number;
  userId?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface StatelessChatResponse {
  success: boolean;
  status?: string;
  message?: string;
  data: {
    query?: string;
    answer?: string;
    clarification?: string;
    status?: string;
    sources?: MessageSource[];
    context?: string;
    pipelineStats?: PipelineStats;
    originalQuery?: string;
    rewrittenQuery?: string;
    queryRewriteStatus?: string;
  };
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

