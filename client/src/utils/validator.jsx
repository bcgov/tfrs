const validator = {
  contactName: {
    rules: [
      {
        test: (value) => {
          return value.length > 0;
        },
        message: 'Name is required.',
      },
    ],
    errors: [],
    valid: false,
    state: '',
  },
  contactEmail: {
    rules: [
      {
        test: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
        message: 'Must be a valid email.',
      },
      {
        test: (value) => {
          return value.length > 0;
        },
        message: 'Email is required.',
      },
    ],
    errors: [],
    valid: false,
    state: ''
  },
  contactWorkPhone: {
    rules: [
      {
        test: (value) => {
          if (!value.match(/\d+/g)) {
            return false
          } else {
            return value.match(/\d+/g).reduce((p, c) => p + c).length === 11;
          }
        },
        message: 'Please enter a valid phone number.',
      },
    ],
    errors: [],
    valid: false,
    state: ''
  },
  contactCellPhone: {
    rules: [
      {
        test: (value) => {
          if (!value.match(/\d+/g)) {
            return false
          } else {
            return value.match(/\d+/g).reduce((p, c) => p + c).length === 11;
          }
        },
        message: 'Please enter a valid phone number.',
      },
    ],
    errors: [],
    valid: false,
    state: ''
  },
};

export default validator;