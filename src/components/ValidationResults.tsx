import ValidationSummary from './ValidationSummary';
import WarningsTable from './WarningsTable';
import MarkdownSummary from './MarkdownSummary';
import type { ValidationResults as ValidationResultsType } from '../types/api';

interface ValidationResultsProps {
  results: ValidationResultsType;
}

export default function ValidationResults({ results }: ValidationResultsProps) {
  return (
    <div className="validation-results">
      <div className="results-header">
        <h3>Validation Results</h3>
        <a
          href="https://thewaltdisneycompany.sharepoint.com/:x:/s/DSS-BusinessIntelligence-Planning/EZrE_6FGQchAqj1r_wqNxJYBrKl1-7D5f7FhHHBJUvsjSg?e=gDMKgA"
          target="_blank"
          rel="noopener noreferrer"
          className="sharepoint-button"
        >
          📊 View in SharePoint
        </a>
      </div>
      
      <ValidationSummary summary={results.validationSummary} />
      
      {results.summary && (
        <div className="summary-section">
          <h4>Detailed Summary</h4>
          <MarkdownSummary content={results.summary} />
        </div>
      )}
      
      {results.warnings.length > 0 && (
        <div className="warnings-section">
          <h4>Warnings and Errors</h4>
          <WarningsTable warnings={results.warnings} />
        </div>
      )}
    </div>
  );
}