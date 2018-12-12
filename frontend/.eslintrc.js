module.exports = {
  "extends": ["airbnb-standard"],
  "plugins": ["jest"],
  "rules": {
    "jsx-a11y/anchor-is-valid": [ "error", {
      "components": [ "Link" ],
      "specialLink": [ "to" ]
    }],
    "jsx-a11y/label-has-for": [ 2, {
      "required": {
        "every": [ "id" ]
      }
    }],
    "no-underscore-dangle": ["error", {
      "allowAfterThis": true
    }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jdx"] }],
    "react/no-unused-prop-types": [0],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
  },
  "env": {
    "browser": true,
    "jest/globals": true
  }
};
