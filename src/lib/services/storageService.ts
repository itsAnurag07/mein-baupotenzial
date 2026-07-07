import fs from 'fs';
import path from 'path';

export interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

function getContentType(ext: string): string {
  const extension = ext.toLowerCase();
  if (extension === '.pdf') return 'application/pdf';
  if (extension === '.png') return 'image/png';
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  return 'application/octet-stream';
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
      const bucket = process.env.SUPABASE_BUCKET || 'documents';
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!url || !key) {
        throw new Error('Supabase Storage URL or Service Role Key is not configured in environment.');
      }

      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(url, key);

      console.log(`☁️ Uploading to Supabase Storage: bucket=${bucket}, path=${safeName}`);
      const { data, error } = await supabase.storage.from(bucket).upload(safeName, fileBuffer, {
        contentType: getContentType(ext),
        duplex: 'half'
      });

      if (error) {
        console.error('Supabase Storage upload error:', error);
        throw new Error(`Failed to upload to Supabase: ${error.message}`);
      }

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(safeName);
      return { fileUrl: publicUrl, fileName: originalName, fileSize };
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
