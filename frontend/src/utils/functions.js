import axios from 'axios';

const arrayMove = (arr, currentIndex, targetIndex) => {
  arr.splice(targetIndex, 0, arr.splice(currentIndex, 1)[0]);
  return arr;
};

const download = (url, params = {}) => (
  axios.get(url, {
    responseType: 'blob',
    params
  }).then((response) => {
    let filename = response.headers['content-disposition'].replace('attachment; filename=', '');
    filename = filename.replace(/"/g, '');

    const objectURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = objectURL;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  })
);

const validateFiles = files => (
  files.filter((file) => {
    switch (file.type) {
      case 'application/msoutlook':
      case 'application/pdf':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'image/gif':
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/png':
      case 'text/csv':
      case 'text/plain':
        return file.type;
      default:
        if (file.name.split('.').pop() === 'xls' || file.name.split('.').pop() === 'ppt') {
          return file;
        }

        return false;
    }
  })
);

export { arrayMove, download, validateFiles };
