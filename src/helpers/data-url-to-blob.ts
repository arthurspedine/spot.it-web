export function dataURLToBlob(dataUrl: string): Blob {
  const byteString = atob(dataUrl.split(',')[1]) // Remove a parte do prefixo "data:image/png;base64,"
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0] // Extrai o mime type

  const byteNumbers = new Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeString })
}
