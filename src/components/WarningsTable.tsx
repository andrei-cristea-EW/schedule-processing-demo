import type { ValidationWarning } from '../types/api';

interface WarningsTableProps {
  warnings: ValidationWarning[];
}

export default function WarningsTable({ warnings }: WarningsTableProps) {
  if (warnings.length === 0) {
    return (
      <div className="no-warnings">
        No warnings or errors found.
      </div>
    );
  }

  return (
    <div className="warnings-table-container">
      <table className="warnings-table">
        <thead>
          <tr>
            <th>Row</th>
            <th>Field</th>
            <th>Index</th>
            <th>Message</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {warnings.map((warning, index) => (
            <tr key={index} className={`warning-row ${warning.severity}`}>
              <td className="row-number">{warning.row}</td>
              <td className="field-name">{warning.field}</td>
              <td className="field-index">{warning.index}</td>
              <td className="warning-message">{warning.message}</td>
              <td className={`severity ${warning.severity}`}>
                <span className="severity-badge">
                  {warning.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}