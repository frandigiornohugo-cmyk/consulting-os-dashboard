export function fileToDataUrl(file, maxSide = 2048) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagen no soportado'));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const keepAlpha = file.type === 'image/png';
        resolve(canvas.toDataURL(keepAlpha ? 'image/png' : 'image/jpeg', 0.92));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
