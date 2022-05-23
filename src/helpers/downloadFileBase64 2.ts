type DownloadFileBase64 = {
  data: string;
  name: string
}

export const downloadFileBase64 = (response: DownloadFileBase64): void => {
  const byteCharacters = atob(response.data)
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray]);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = response.name;
  link.click();
}