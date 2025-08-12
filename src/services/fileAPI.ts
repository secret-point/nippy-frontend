// File Upload API Service
import api from '../config/api'

export interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  type: string;
  description?: string;
  createdAt: string;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    files: UploadedFile[];
    count: number;
  };
}

export const fileAPI = {
  // Upload multiple attachment files
  async uploadAttachments(files: File[], descriptions?: string[]): Promise<UploadedFile[]> {
    try {
      const formData = new FormData()
      
      // Add files to FormData
      files.forEach((file) => {
        formData.append('attachments', file)
      })
      
      // Add descriptions if provided
      if (descriptions && descriptions.length > 0) {
        descriptions.forEach((description) => {
          formData.append('descriptions', description)
        })
      }

      const response = await api.post<FileUploadResponse>('/files/attachments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data.data.files
    } catch (error) {
      console.error('Failed to upload files:', error)
      throw error
    }
  },

  // Get user's files
  async getUserFiles(): Promise<UploadedFile[]> {
    try {
      const response = await api.get<{
        success: boolean;
        data: { files: UploadedFile[] };
      }>('/files/my-files')
      return response.data.data.files
    } catch (error) {
      console.error('Failed to fetch user files:', error)
      throw error
    }
  },

  // Get files by type (for job attachments)
  async getFilesByType(type: string = 'attachment'): Promise<UploadedFile[]> {
    try {
      const response = await api.get<{
        success: boolean;
        data: { files: UploadedFile[] };
      }>(`/files/my-files?type=${type}`)
      return response.data.data.files
    } catch (error) {
      console.error('Failed to fetch files by type:', error)
      throw error
    }
  },

  // Delete a file
  async deleteFile(fileId: string): Promise<void> {
    try {
      await api.delete(`/files/${fileId}`)
    } catch (error) {
      console.error('Failed to delete file:', error)
      throw error
    }
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await api.post<{
        success: boolean;
        message: string;
        data: { url: string };
      }>('/files/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Convert relative URL to absolute URL
      const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'
      const fullAvatarUrl = response.data.data.url.startsWith('http') 
        ? response.data.data.url 
        : `${baseURL}${response.data.data.url}`

      return { avatarUrl: fullAvatarUrl }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      throw error
    }
  },

  // Update file metadata
  async updateFileMetadata(fileId: string, description: string): Promise<void> {
    try {
      await api.patch(`/files/${fileId}`, { description })
    } catch (error) {
      console.error('Failed to update file metadata:', error)
      throw error
    }
  }
}
