import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../Button';

describe('<Button />', () => {
  it('renders correctly with title', () => {
    const tree = renderer.create(<Button title="Test Button" />).toJSON();
    expect(tree.children.length).toBe(1);
    // Find the text content
    const textNode = tree.children[0].children[0];
    expect(textNode.children[0]).toBe('Test Button');
  });

  it('shows loading indicator when loading prop is true', () => {
    const tree = renderer.create(<Button title="Test Button" loading={true} />).toJSON();
    // ActivityIndicator is rendered instead of the text
    expect(tree.children[0].type).not.toBe('Text');
  });

  it('applies danger style when type is danger', () => {
    const tree = renderer.create(<Button title="Danger" type="danger" />).toJSON();
    // Verify style object contains the danger background color
    const style = tree.props.style;
    const hasDangerColor = style.some(s => s && s.backgroundColor === '#EF4444');
    expect(hasDangerColor).toBe(true);
  });
});
