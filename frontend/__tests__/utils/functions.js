import { arrayMove, validateFiles } from '../../src/utils/functions';

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
