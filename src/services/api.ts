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

export const pollExecutionStatus = async (
  executionId: string,
  onUpdate?: (status: string, data?: ValidationResults) => void
): Promise<ValidationResults | null> => {
  // Poll indefinitely until finished or failed - no timeout
  while (true) {
    try {
      const statusResponse = await getExecutionStatus(executionId);
      const { execution } = statusResponse;
      
      // Only extract results when finished
      let validationResults: ValidationResults | null = null;
      if (execution.status === 'finished' && execution.outputs?.warnings && execution.outputs?.summary) {
        validationResults = {
          warnings: execution.outputs.warnings.warnings,
          validationSummary: execution.outputs.warnings.validationSummary,
          summary: execution.outputs.summary,
        };
      }
      
      onUpdate?.(execution.status, validationResults || undefined);
      
      if (execution.status === 'finished') {
        return validationResults;
      }
      
      if (execution.status === 'failed') {
        throw new Error('Execution failed');
      }
      
      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error('Error polling execution status:', error);
      throw error;
    }
  }
};