/* istanbul ignore file */
import renderer from 'react-test-renderer'

export function matchesSnapshot (component) {
  const renderedComponent = renderer.create(component)
  const componentJSON = renderedComponent.toJSON()
  expect(componentJSON).toMatchSnapshot()
  renderedComponent.unmount()
}
