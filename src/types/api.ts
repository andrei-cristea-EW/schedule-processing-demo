export interface ScheduleInputs {
  msToken?: string;
  userId: string;
  inputFolder: string;
  outputFile: string;
}

export interface ValidationWarning {
  row: number;
  field: string;
  index: number;
  message: string;
  severity: "warning" | "error";
}

export interface ValidationSummary {
  totalRows: number;
  warningsCount: number;
  errorsCount: number;
}

export interface ValidationResults {
  warnings: ValidationWarning[];
  validationSummary: ValidationSummary;
  summary: string;
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
      warnings?: {
        warnings: ValidationWarning[];
        validationSummary: ValidationSummary;
      };
      summary?: string;
    };
    updatedAt: string;
    queuedAt: string;
    startedAt?: string;
    finishedAt?: string;
  };
}