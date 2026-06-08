import { NextResponse } from 'next/server';
import { storageService } from '@/lib/services/storageService';
import { dbService } from '@/lib/services/dbService';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;
    const leadId = formData.get('leadId') as string | null;

    if (!file || !category || !leadId) {
      return NextResponse.json({ error: 'Missing required fields (file, category, leadId)' }, { status: 400 });
    }

    // Validate size: max 25MB
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Datei überschreitet die maximale Größe von 25MB.' }, { status: 400 });
    }

    // Validate type: PDF, JPG, PNG
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const lowerName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => lowerName.endsWith(ext));
    if (!isAllowed) {
      return NextResponse.json({ error: 'Ungültiges Dateiformat. Nur PDF, JPG und PNG sind erlaubt.' }, { status: 400 });
    }

    // Read file as Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to storage provider (local, s3, supabase)
    const uploadResult = await storageService.uploadFile(buffer, file.name, category, leadId);

    // Write record to database
    const document = await dbService.addDocument(leadId, {
      category,
      fileName: uploadResult.fileName,
      fileUrl: uploadResult.fileUrl,
      fileSize: uploadResult.fileSize
    });

    return NextResponse.json(document);
  } catch (error: any) {
    console.error('File upload api error:', error);
    return NextResponse.json({ error: 'Fehler beim Hochladen der Datei.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
    }

    const success = await dbService.deleteDocument(id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Datei konnte nicht gelöscht werden.' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('File delete api error:', error);
    return NextResponse.json({ error: 'Fehler beim Löschen der Datei.' }, { status: 500 });
  }
}

