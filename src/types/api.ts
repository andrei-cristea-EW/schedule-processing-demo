export interface FileData {
  url: string;
  fileName: string;
}

export interface ExecutionStartResponse {
  status: string;
  executionId: string;
}

export interface ExecutionStatusResponse {
  status: string;
  execution: {
    _id: string;
    status: 'queued' | 'running' | 'finished' | 'failed';
    outputs?: {
      aianswer?: string;
    };
    updatedAt: string;
    queuedAt: string;
    startedAt?: string;
    finishedAt?: string;
  };
}

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isLoading?: boolean;
  file?: FileData;
}