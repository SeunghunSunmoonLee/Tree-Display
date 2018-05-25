import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import nodes from './nodes';
import { shallow, mount } from "enzyme";
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import Tree from 'antd/lib/tree';

describe("Node Tree App", () => {
  let props;
  let mountedApp;
  const loadApp = () => {
    if (!mountedApp) {
      mountedApp = mount(
        <App {...props} />
      );
    }
    return mountedApp;
  }

  beforeEach(() => {
    props = {
    };
    mountedApp = undefined;
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('creates a correct shape of treeData', async () => {
    const wrapper = shallow(<App />)
    await wrapper.instance().componentDidMount()
    expect(wrapper.state().treeData.length).toBe(4);
  });
  it('renders correct Node Tree', async () => {
    const wrapper = mount(<App />)
    await wrapper.instance().componentDidMount()
    await wrapper.update();
    const tree = wrapper.find(Tree)
    expect(tree.length).toBe(1);
    expect(toJson(wrapper)).toMatchSnapshot();
  })
});
