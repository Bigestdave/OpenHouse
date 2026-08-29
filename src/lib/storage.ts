import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Uploads a recorded video file or photo to the 'captures' bucket.
 * Returns the public or secure access URL.
 */
export async function uploadCaptureVideo(
  file: Blob | File,
  captureRequestId: string,
  fileName = `recapture_${Date.now()}.webm`
): Promise<string> {
  if (!isSupabaseConfigured) {
    return URL.createObjectURL(file)
  }

  try {
    const filePath = `${captureRequestId}/${fileName}`
    const { error } = await supabase.storage
      .from('captures')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type || 'video/webm',
      })

    if (error) {
      console.warn('Failed to upload capture video to Supabase Storage:', error.message)
      return URL.createObjectURL(file)
    }

    const { data } = supabase.storage.from('captures').getPublicUrl(filePath)
    return data.publicUrl
  } catch (err: any) {
    console.warn('Upload error, falling back to local URL:', err.message)
    return URL.createObjectURL(file)
  }
}

/**
 * Uploads property hero or space media to 'property-media' bucket.
 */
export async function uploadPropertyMedia(
  file: Blob | File,
  propertyId: string,
  fileName = `media_${Date.now()}.jpg`
): Promise<string> {
  if (!isSupabaseConfigured) {
    return URL.createObjectURL(file)
  }

  try {
    const filePath = `${propertyId}/${fileName}`
    const { error } = await supabase.storage
      .from('property-media')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type || 'image/jpeg',
      })

    if (error) {
      console.warn('Failed to upload property media to Supabase Storage:', error.message)
      return URL.createObjectURL(file)
    }

    const { data } = supabase.storage.from('property-media').getPublicUrl(filePath)
    return data.publicUrl
  } catch (err: any) {
    console.warn('Upload error, falling back to local URL:', err.message)
    return URL.createObjectURL(file)
  }
}
