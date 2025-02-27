export function getFileIcon(fileName) {
  const fileExtension = fileName.split(".").pop().toLowerCase();
  let iconClass = "ri-file-line"; // Default file icon

  switch (fileExtension) {
    case "pdf":
      iconClass = "ri-file-pdf-line"; // PDF file icon
      break;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      iconClass = "ri-image-line"; // Image file icon
      break;
    case "doc":
    case "docx":
      iconClass = "ri-file-word-line"; // Word file icon
      break;
    case "xls":
    case "xlsx":
      iconClass = "ri-file-excel-line"; // Excel file icon
      break;
    case "ppt":
    case "pptx":
      iconClass = "ri-file-ppt-line"; // PowerPoint file icon
      break;
    case "zip":
    case "rar":
      iconClass = "ri-file-zip-line"; // Zip/Archive file icon
      break;
    case "txt":
      iconClass = "ri-file-text-line"; // Text file icon
      break;
    default:
      iconClass = "ri-file-line"; // Default file icon
      break;
  }

  return iconClass; // Return the icon class to be used in JSX
}
