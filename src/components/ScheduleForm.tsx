import { useState } from 'react';
import type { ScheduleInputs } from '../types/api';

interface ScheduleFormProps {
  onSubmit: (inputs: ScheduleInputs) => void;
  disabled?: boolean;
}

export default function ScheduleForm({ onSubmit, disabled = false }: ScheduleFormProps) {
  const [formData, setFormData] = useState<ScheduleInputs>({
    msToken: '',
    userId: 'alexandru.cocinda@everworker.ai',
    inputFolder: '/Demo/Schedules',
    outputFile: '/Demo/Combined Schedules.xlsx',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.inputFolder || !formData.outputFile) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <div className="form-group">
        <label htmlFor="msToken" className="form-label">
          MS Token (Optional)
        </label>
        <input
          type="text"
          id="msToken"
          name="msToken"
          value={formData.msToken}
          onChange={handleInputChange}
          disabled={disabled}
          className="form-input"
          placeholder="Enter MS Token if required"
        />
      </div>

      <div className="form-group">
        <label htmlFor="userId" className="form-label required">
          User ID
        </label>
        <input
          type="text"
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleInputChange}
          disabled={disabled}
          className="form-input"
          placeholder="Enter User ID"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="inputFolder" className="form-label required">
          Input Folder
        </label>
        <input
          type="text"
          id="inputFolder"
          name="inputFolder"
          value={formData.inputFolder}
          onChange={handleInputChange}
          disabled={disabled}
          className="form-input"
          placeholder="Enter input folder path"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="outputFile" className="form-label required">
          Output File
        </label>
        <input
          type="text"
          id="outputFile"
          name="outputFile"
          value={formData.outputFile}
          onChange={handleInputChange}
          disabled={disabled}
          className="form-input"
          placeholder="Enter output file path"
          required
        />
      </div>

      <button
        type="submit"
        disabled={disabled || !formData.userId || !formData.inputFolder || !formData.outputFile}
        className="submit-button"
      >
        {disabled ? 'Processing...' : 'Start Validation'}
      </button>
    </form>
  );
}