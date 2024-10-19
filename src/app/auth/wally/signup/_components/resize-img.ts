export function resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      image.src = e.target?.result as string;
    };

    reader.onerror = (error) => reject(error);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      let width = image.width;
      let height = image.height;

      // Mantém a proporção da imagem original ao redimensionar
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(image, 0, 0, width, height);

        // Converte a imagem do canvas em blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', quality); // 'quality' varia de 0 a 1 (ex: 0.8)
      } else {
        reject(new Error('Não foi possível obter o contexto 2D do canvas.'));
      }
    };

    reader.readAsDataURL(file);
  });
}

