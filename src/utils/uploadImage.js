import { BASE_URL } from '../config';

export async function uploadImage(file, token) {
  const formData = new FormData();
  formData.append('banner', file);
  const res = await fetch(`${BASE_URL}/upload-banner`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || 'Image upload failed');
  }
  return data.url;
}
