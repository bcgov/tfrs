import React from 'react';
import renderer from 'react-test-renderer';

import StatusInterceptor from '../../../src/app/components/StatusInterceptor';

test('StatusInterceptor should display the proper message for 401 errors', () => {
  const statusCode = 401;
  const component = renderer.create(<StatusInterceptor statusCode={statusCode} />);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('StatusInterceptor should display the proper message for 403 errors', () => {
  const statusCode = 403;
  const component = renderer.create(<StatusInterceptor statusCode={statusCode} />);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('StatusInterceptor should display the proper message for 500 errors', () => {
  const statusCode = 500;
  const component = renderer.create(<StatusInterceptor statusCode={statusCode} />);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('StatusInterceptor should display the proper message for 502 errors', () => {
  const statusCode = 502;
  const component = renderer.create(<StatusInterceptor statusCode={statusCode} />);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
