'use strict';

const expect = require('expect');

const util = require('../lib/util');

describe('util', function() {
  this.timeout(80000);

  it('isUrl', function() {
      expect(util.isUrl('http://somewhere.com/over/here')).toEqual(true)
      expect(util.isUrl('https://somewhere.com/over/here')).toEqual(true)
      expect(util.isUrl('file://hostname/over/here')).toEqual(true)
      expect(util.isUrl('file://localhost/over/here')).toEqual(true)
      expect(util.isUrl('file:///over/here')).toEqual(true)
      expect(util.isUrl({})).toEqual(false)
      expect(util.isUrl(' ///over/here')).toEqual(false)
      expect(util.isUrl('/over/here')).toEqual(false)
      expect(util.isUrl('//over/here')).toEqual(false)
  }) //end it
  it('hashString', function() {
    expect(util.hashString('Hello World')).toEqual('557db03de997c86a4a028e1ebd3a1ceb225be238')
    expect(util.hashString({message:'Hello World'})).toEqual('6c0c73c8fdef129c899271509441773cea232ef6')
  }) //end it
  it('execSync', function() {
    expect(util.execSync('git', ['version'], {cwd:'/tmp', encoding:'utf-8'}).status).toEqual(0)
  })
}) //end describe