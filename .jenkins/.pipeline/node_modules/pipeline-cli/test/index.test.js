'use strict';

const expect = require('expect');

const {Pipeline, OpenShiftClient, OpenShiftClientX} = require('../index.js')

describe('index', function() {
  this.timeout(80000);

  it('requires', function() {
      expect(Pipeline).toEqual(expect.anything())
      expect(OpenShiftClient).toEqual(expect.anything())
      expect(OpenShiftClientX).toEqual(expect.anything())
  }) //end it
}) //end describe
