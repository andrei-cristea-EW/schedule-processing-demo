import { useState } from 'react';
import { startExecution, pollExecutionStatus } from '../services/api';
import ScheduleForm from './ScheduleForm';
import ValidationResults from './ValidationResults';
import Header from './Header';
import type { ScheduleInputs, ValidationResults as ValidationResultsType } from '../types/api';

export default function ScheduleInterface() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('idle');
  const [validationResults, setValidationResults] = useState<ValidationResultsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (inputs: ScheduleInputs) => {
    setIsLoading(true);
    setError(null);
    setValidationResults(null);
    setStatus('starting');

    try {
      const startResponse = await startExecution(inputs);
      
      if (startResponse.executionId) {
        setStatus('running');
        
        const finalResults = await pollExecutionStatus(
          startResponse.executionId,
          (newStatus, results) => {
            setStatus(newStatus);
            if (results) {
              setValidationResults(results);
            }
          }
        );
        
        if (finalResults) {
          setValidationResults(finalResults);
        }
        setStatus('finished');
      } else {
        throw new Error('Failed to start execution');
      }
    } catch (err) {
      console.error('Error processing validation:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during validation');
      setStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="schedule-interface">
      <Header />
      
      <div className="interface-content">
        <div className="form-section">
          <h2>Schedule Validation Parameters</h2>
          <ScheduleForm onSubmit={handleSubmit} disabled={isLoading} />
        </div>

        {status !== 'idle' && (
          <div className="status-section">
            <div className="status-indicator">
              Status: <span className={`status-${status}`}>{status}</span>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {validationResults && (
              <ValidationResults results={validationResults} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}