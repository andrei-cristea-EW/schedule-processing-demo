import axios from 'axios';
import type { ExecutionStartResponse, ExecutionStatusResponse, ScheduleInputs, ValidationResults } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const ACCOUNT_ID = import.meta.env.VITE_ACCOUNT_ID;
const AGENT_ID = import.meta.env.VITE_AGENT_ID;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout per request
});

export const startExecution = async (inputs: ScheduleInputs): Promise<ExecutionStartResponse> => {
  // Filter out empty msToken if not provided
  const cleanInputs = { ...inputs };
  if (!cleanInputs.msToken || cleanInputs.msToken.trim() === '') {
    delete cleanInputs.msToken;
  }
  
  const response = await apiClient.post(`/${ACCOUNT_ID}/agent/${AGENT_ID}/execute`, {
    inputs: cleanInputs,
  });
  return response.data;
};

export const getExecutionStatus = async (executionId: string): Promise<ExecutionStatusResponse> => {
  const response = await apiClient.get(`/${ACCOUNT_ID}/agent/${executionId}/status`);
  return response.data;
};

// Helper function to check if error is network-related
const isNetworkError = (error: any): boolean => {
  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'NETWORK_ERROR' ||
    error.code === 'ERR_INTERNET_DISCONNECTED' ||
    error.code === 'ERR_NETWORK_CHANGED' ||
    error.message === 'Network Error' ||
    (error.response && error.response.status >= 500)
  );
};

// Helper function for exponential backoff delay
const getRetryDelay = (attempt: number): number => {
  return Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10 seconds
};

export const pollExecutionStatus = async (
  executionId: string,
  onUpdate?: (status: string, data?: ValidationResults, connectionStatus?: 'connected' | 'retrying' | 'failed') => void
): Promise<ValidationResults | null> => {
  const maxTotalTime = 10 * 60 * 1000; // 10 minutes total
  const maxRetryAttempts = 5;
  const startTime = Date.now();
  
  let consecutiveErrors = 0;
  
  while (Date.now() - startTime < maxTotalTime) {
    try {
      const statusResponse = await getExecutionStatus(executionId);
      const { execution } = statusResponse;
      
      // Reset error counter on successful request
      consecutiveErrors = 0;
      
      // Only extract results when finished
      let validationResults: ValidationResults | null = null;
      if (execution.status === 'finished' && execution.outputs?.warnings && execution.outputs?.summary) {
        validationResults = {
          warnings: execution.outputs.warnings.warnings,
          validationSummary: execution.outputs.warnings.validationSummary,
          summary: execution.outputs.summary,
        };
      }
      
      onUpdate?.(execution.status, validationResults || undefined, 'connected');
      
      if (execution.status === 'finished') {
        return validationResults;
      }
      
      if (execution.status === 'failed') {
        throw new Error('AI processing failed. Please try again.');
      }
      
      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error: any) {
      console.error('Error polling execution status:', error);
      consecutiveErrors++;
      
      // Handle network errors with retry logic (silent retries)
      if (isNetworkError(error) && consecutiveErrors <= maxRetryAttempts) {
        const retryDelay = getRetryDelay(consecutiveErrors - 1);
        
        // Keep status as 'running' - don't inform user about retries
        console.log(`Network error, retrying in ${retryDelay}ms (attempt ${consecutiveErrors}/${maxRetryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // If too many consecutive errors or non-network error, fail
      if (consecutiveErrors > maxRetryAttempts) {
        onUpdate?.('failed', undefined, 'failed');
        throw new Error('Connection lost. Please check your internet connection and try again.');
      }
      
      // For non-network errors, throw immediately
      onUpdate?.('failed', undefined, 'failed');
      throw new Error(error.response?.data?.message || error.message || 'An unexpected error occurred.');
    }
  }
  
  // Timeout reached
  throw new Error('Processing timeout reached (10 minutes). The validation may still be running. Please try checking again later.');
};