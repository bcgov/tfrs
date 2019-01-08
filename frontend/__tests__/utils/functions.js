import { arrayMove, getFileSize, getIcon, validateFiles } from '../../src/utils/functions';

test('Array Move to actually function as expected', () => {
  const arr = [1, 2, 3, 4, 5];

  // (array to manipulate, current index to move, index to move to)
  arrayMove(arr, 2, 1);

  expect(arr).toEqual([1, 3, 2, 4, 5]);
});

test('Validate Files should only return allowed file types', () => {
  const files = [{
    name: 'FILE_000.jpg',
    type: 'image/jpg'
  }, {
    name: 'FILE_000.jpeg',
    type: 'image/jpeg'
  }, {
    name: 'FILE_000.ppt',
    type: ''
  }, {
    name: 'FILE_000.xls',
    type: ''
  }, {
    name: 'FILE_000.pdf',
    type: 'application/pdf'
  }, {
    name: 'FILE_000.exe',
    type: 'application/octet-stream'
  }, {
    name: 'FILE_000.zip',
    type: 'application/x-rar-compressed'
  }];

  const allowedFiles = validateFiles(files);

  expect(allowedFiles).toEqual([{
    name: 'FILE_000.jpg',
    type: 'image/jpg'
  }, {
    name: 'FILE_000.jpeg',
    type: 'image/jpeg'
  }, {
    name: 'FILE_000.ppt',
    type: ''
  }, {
    name: 'FILE_000.xls',
    type: ''
  }, {
    name: 'FILE_000.pdf',
    type: 'application/pdf'
  }]);
});

test('Get File size should convert bytes to MB', () => {
  expect(getFileSize(0)).toEqual('0 bytes');
  expect(getFileSize(1000)).toEqual('1 KB');
  expect(getFileSize(1000000)).toEqual('1 MB');
  expect(getFileSize(1000000000)).toEqual('1 GB');
  expect(getFileSize(1000000000000)).toEqual('1 TB');
});

test('Get Mime Type should return a font-awesome icon to be used', () => {
  expect(getIcon('application/pdf')).toEqual('file-pdf');

  expect(getIcon('application/vnd.ms-excel')).toEqual('file-excel');
  expect(getIcon('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')).toEqual('file-excel');
  expect(getIcon('text/csv')).toEqual('file-excel');

  expect(getIcon('application/vnd.ms-powerpoint')).toEqual('file-powerpoint');
  expect(getIcon('application/vnd.openxmlformats-officedocument.presentationml.presentation')).toEqual('file-powerpoint');

  expect(getIcon('application/msword')).toEqual('file-word');
  expect(getIcon('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toEqual('file-word');

  expect(getIcon('image/gif')).toEqual('file-image');
  expect(getIcon('image/jpg')).toEqual('file-image');
  expect(getIcon('image/jpeg')).toEqual('file-image');
  expect(getIcon('image/png')).toEqual('file-image');

  expect(getIcon('text/plain')).toEqual('file-alt');

  expect(getIcon('application/octet-stream')).toEqual('file-download');
});
