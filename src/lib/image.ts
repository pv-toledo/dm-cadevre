export async function convertToWebp(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      const maxSize = 512;

      const scale = Math.min(
        maxSize / image.naturalWidth,
        maxSize / image.naturalHeight,
        1
      );

      const width = Math.round(image.naturalWidth * scale);
      const height = Math.round(image.naturalHeight * scale);

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Conversion failed"));
            return;
          }

          // const originalName = file.name.replace(/\.[^/.]+$/, "");

          resolve(
            new File([blob], "profile.webp", {
              type: "image/webp",
            })
          );
        },
        "image/webp",
        0.8
      );
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    image.src = URL.createObjectURL(file);
  });
}