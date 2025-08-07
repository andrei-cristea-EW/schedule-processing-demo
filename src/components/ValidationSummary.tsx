import type { ValidationSummary as ValidationSummaryType } from '../types/api';

interface ValidationSummaryProps {
  summary: ValidationSummaryType;
}

export default function ValidationSummary({ summary }: ValidationSummaryProps) {
  return (
    <div className="validation-summary">
      <div className="summary-badges">
        <div className="badge badge-rows">
          <div className="badge-count">{summary.totalRows}</div>
          <div className="badge-label">Total Rows</div>
        </div>
        
        <div className="badge badge-warnings">
          <div className="badge-count">{summary.warningsCount}</div>
          <div className="badge-label">Warnings</div>
        </div>
        
        <div className="badge badge-errors">
          <div className="badge-count">{summary.errorsCount}</div>
          <div className="badge-label">Errors</div>
        </div>
      </div>
    </div>
  );
}