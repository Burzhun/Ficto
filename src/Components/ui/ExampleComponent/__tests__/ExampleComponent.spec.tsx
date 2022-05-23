import React from 'react';
import ReactDOM from 'react-dom';
import { ExampleComponent } from '../ExampleComponent';
import { testHelper } from '../helpers';
import { render, screen, fireEvent } from '@testing-library/react';

const setupInput = () => {
  const utils = render(<ExampleComponent />);
  const input = utils.getByLabelText('example-input') as HTMLInputElement;
  return {
    input,
    ...utils,
  };
};

test('render component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ExampleComponent />, div);
});
test('test helpers - testHelper', () => {
  const userName = 'Obama';
  expect(testHelper(userName)).toEqual(userName);
});
test('it render ButtonText', () => {
  render(<ExampleComponent />);
  expect(screen.getByText('ButtonText')).toBeInTheDocument();
});
test('it render customProp', () => {
  const customProp = 'customProp';
  render(<ExampleComponent customProp={customProp} />);
  expect(screen.getByText(customProp)).toBeInTheDocument();
});
test('it input set value to trim()', () => {
  const { input } = setupInput();
  fireEvent.change(input, { target: { value: ' 2 3 ' } });
  expect(input.value).toBe('2 3');
});
