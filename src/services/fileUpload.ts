export interface FileUploadResult {
  url: string;
  fileName: string;
}

export class FileUploadService {
  private fileUploadToken: string | null = null;

  constructor() {
    this.fileUploadToken = import.meta.env.VITE_FILE_UPLOAD_TOKEN || null;
  }

  async uploadFile(file: File): Promise<FileUploadResult> {
    if (!this.fileUploadToken) {
      throw new Error('File upload token not configured');
    }

    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
      const response = await fetch('https://staging-storage-service.integrail.ai/api/upload?ttl_minutes=3000', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${this.fileUploadToken}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file. Server responded with ${response.status}`);
      }

      const data = await response.json();
      return {
        url: data.link,
        fileName: data.fileName
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error('Something went wrong while uploading the file');
    }
  }
}

export const fileUploadService = new FileUploadService();