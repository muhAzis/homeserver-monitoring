const bytesTemplate = (bytes: number): { value: string, unit: string } => {
  if (bytes < 1024)
    return { value: bytes.toFixed(2), unit: "Bytes" };
  if (bytes < 1024 * 1024)
    return { value: (bytes / 1024).toFixed(2), unit: "KB" };
  if (bytes < 1024 * 1024 * 1024)
    return { value: (bytes / (1024 * 1024)).toFixed(2), unit: "MB" };
  if (bytes < 1024 * 1024 * 1024 * 1024)
    return { value: (bytes / (1024 * 1024 * 1024)).toFixed(2), unit: "GB" };
  return { value: (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2), unit: "TB" };
}

export default bytesTemplate;