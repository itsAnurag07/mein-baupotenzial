import fs from 'fs';
import path from 'path';

export interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export const storageService = {
  async uploadFile(fileBuffer: Buffer, originalName: string, category: string, leadId: string): Promise<UploadResult> {
    const ext = path.extname(originalName);
    const sanitizedCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const safeName = `${leadId}_${sanitizedCategory}_${Date.now()}${ext}`;
    const fileSize = fileBuffer.length;

    const provider = process.env.STORAGE_PROVIDER || 'local';

    if (provider === 'local') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure folder exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, fileBuffer);

      // Return client-accessible url
      const fileUrl = `/uploads/${safeName}`;
      return { fileUrl, fileName: originalName, fileSize };
    }

    if (provider === 'supabase') {
      // Supabase upload simulation / implementation using REST API or client
      // Typically, you would call: supabase.storage.from('bucket').upload(path, file)
      console.log(`☁️ Supabase Upload Simulation: ${safeName} (${fileSize} bytes)`);
      
      // Mocking successful upload to Supabase bucket
      const bucket = process.env.SUPABASE_BUCKET || 'documents';
      const url = process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co';
      const fileUrl = `${url}/storage/v1/object/public/${bucket}/${safeName}`;
      
      return { fileUrl, fileName: originalName, fileSize };
    }

    if (provider === 's3') {
      // AWS S3 upload simulation / implementation using S3 client
      console.log(`☁️ AWS S3 Upload Simulation: ${safeName} (${fileSize} bytes)`);
      
      const bucket = process.env.S3_BUCKET_NAME || 'mein-baupotenzial-docs';
      const region = process.env.S3_REGION || 'eu-central-1';
      const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${safeName}`;
      
      return { fileUrl, fileName: originalName, fileSize };
    }

    throw new Error(`Unsupported storage provider: ${provider}`);
  }
};
