/**
 * Client-Side Smart Image Compressor
 * Otomatis mengompresi gambar (JPEG, PNG, WebP) ke target ~100KB WebP
 * Mempertahankan rasio aspek dan ketajaman visual untuk web modern.
 */

export interface CompressResult {
  base64: string;
  blob: Blob;
  originalSizeKB: number;
  compressedSizeKB: number;
  width: number;
  height: number;
  reductionPercentage: number;
}

export interface CompressOptions {
  maxDimension?: number; // Maksimal lebar / tinggi dalam px (default: 1200)
  targetSizeKB?: number; // Target ukuran file dalam KB (default: 100)
  initialQuality?: number; // Kualitas awal (default: 0.82)
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const {
    maxDimension = 1200,
    targetSizeKB = 100,
    initialQuality = 0.82,
  } = options;

  const originalSizeKB = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung skala resize jika melebihi maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal menginisialisasi canvas context"));
          return;
        }

        // Gambar ulang di canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Kompresi bertahap untuk mendekati target ~100KB
        let currentQuality = initialQuality;
        let compressedDataUrl = canvas.toDataURL("image/webp", currentQuality);
        let currentSizeKB = Math.round((compressedDataUrl.length * 0.75) / 1024);

        // Jika masih jauh lebih besar dari target (misal > 140KB), turunkan kualitas secara bertahap
        let iterations = 0;
        while (currentSizeKB > targetSizeKB * 1.3 && currentQuality > 0.45 && iterations < 5) {
          currentQuality -= 0.1;
          compressedDataUrl = canvas.toDataURL("image/webp", currentQuality);
          currentSizeKB = Math.round((compressedDataUrl.length * 0.75) / 1024);
          iterations++;
        }

        // Konversi Data URL ke Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Gagal membuat blob gambar"));
              return;
            }

            const finalSizeKB = Math.round(blob.size / 1024);
            const reduction = Math.max(
              0,
              Math.round(((originalSizeKB - finalSizeKB) / originalSizeKB) * 100)
            );

            resolve({
              base64: compressedDataUrl,
              blob,
              originalSizeKB,
              compressedSizeKB: finalSizeKB,
              width,
              height,
              reductionPercentage: reduction,
            });
          },
          "image/webp",
          currentQuality
        );
      };

      img.onerror = () => {
        reject(new Error("File gambar rusak atau format tidak didukung"));
      };

      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      } else {
        reject(new Error("Gagal membaca file gambar"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Gagal membaca data file"));
    };

    reader.readAsDataURL(file);
  });
}
