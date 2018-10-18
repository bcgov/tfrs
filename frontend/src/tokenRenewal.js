import { processSilentRenew } from 'redux-oidc';

function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  processSilentRenew();
});

