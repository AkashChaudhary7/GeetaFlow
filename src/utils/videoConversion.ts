/**
 * Utility for converting recorded WebM reels to Instagram & YouTube certified MP4s,
 * and handling direct native social media sharing.
 */

export async function convertWebmToMp4(
  recordedBlob: Blob,
  targetFilename: string = 'GeetaFlow_Reel.mp4'
): Promise<Blob> {
  const cleanFilename = targetFilename.endsWith('.mp4') ? targetFilename : `${targetFilename}.mp4`;

  const response = await fetch('/api/convert-to-mp4', {
    method: 'POST',
    headers: {
      'Content-Type': recordedBlob.type || 'video/webm',
      'x-filename': cleanFilename,
    },
    body: recordedBlob,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MP4 Conversion failed (${response.status}): ${errorText}`);
  }

  const mp4Blob = await response.blob();
  return mp4Blob;
}

/**
 * Checks if the browser natively supports Web Share API with video files
 * (supported on Android Chrome, iOS Safari, etc.)
 */
export function canDirectShareVideo(blob: Blob): boolean {
  if (typeof navigator === 'undefined' || !navigator.canShare || !navigator.share) {
    return false;
  }
  try {
    const testFile = new File([blob], 'reel.mp4', { type: 'video/mp4' });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}

/**
 * Directly shares the MP4 reel to Instagram Reels, YouTube Shorts, WhatsApp, or Photos
 */
export async function shareVideoReel(
  blob: Blob,
  filename: string,
  title: string,
  text: string
): Promise<boolean> {
  if (!canDirectShareVideo(blob)) return false;

  try {
    const file = new File([blob], filename, { type: 'video/mp4' });
    await navigator.share({
      files: [file],
      title,
      text,
    });
    return true;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // User canceled share sheet, not an error
      return false;
    }
    console.warn('Direct video share error:', err);
    return false;
  }
}

/**
 * Triggers standard file download in the browser
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
