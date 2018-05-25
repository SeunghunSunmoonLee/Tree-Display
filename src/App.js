import * as React from 'react';
import nodes from './nodes';
import Tree from 'antd/lib/tree';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import './App.css';

const logo = require('./logo.svg');
const TreeNode = Tree.TreeNode;

const convert = async (array) => {
  return array.map(item => {
    return {
      title: item.name,
      children: [],
      key: String(item.id),
      id: String(item.id),
      parent: item.parent,
    }
  })
}

const unflatten = (array, parent, tree) => {
  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : undefined;

  const children = typeof parent !== 'undefined' ? array.filter(item => item.parent == parent.id) : array
  if(children.length >=1) {
    if(typeof parent == 'undefined') {
      tree = children.filter(item => typeof item.parent == 'undefined')
    } else {
      parent['children'] = children
    }
    children.map(child => {
      unflatten(array, child)
    })
  }
  return tree
}

class App extends React.Component {
  constructor(props) {
    super()
    this.state = {
      expandedKeys: ['0', '3'],
      autoExpandParent: true,
      checkedKeys: ['0'],
      selectedKeys: [],
      treeData: [],
    }
  }
  componentDidMount() {
    convert(nodes).then(result => {
      const treeData = unflatten([...result])
      // console.log("treeData", treeData)
      this.setState({treeData})
    })
  }
  onDragEnter = (info) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  }
  onDrop = (info) => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // const dragNodesKeys = info.dragNodesKeys;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };

    const data = [...this.state.treeData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    } else {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    }
    this.setState({
      treeData: data,
    });
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  render() {
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.key} title={item.title} />;
    });
    return (
      <div className="App">
        <div className="App-header" >
          <img src={logo} className="App-logo" alt="logo" />
          <h2 style={{color: 'white !important'}}>Tree-Selector with Unflattener for flat hierarchical data</h2>
        </div>
        <Row type="flex" justify="center" >
          <Col>
            {this.state.treeData.length != 0 &&
              <Tree
                draggable
                onDragEnter={this.onDragEnter}
                onDrop={this.onDrop}
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
              >
                {loop(this.state.treeData)}
              </Tree>
            }
          </Col>
        </Row>
        <Row type="flex" justify="center" style={{ maxWidth: '600px', margin: '0 auto'}} >
          <Col>
            <h1>Node Picker Assignment</h1>
            <h2>Requirements</h2>
            <ul>
              <li>A list of Nodes, each with a reference to their parent, should be displayed hierarchically</li>
              <li>The user should be able to select one or many nodes arbitrarily</li>
              <li>Selected nodes should be visually highlighted somehow</li>
            </ul>
            <h3>Bonus tasks</h3>
            <ul>
              <li>
                The user should be able to select groups (a node and its <u>immediate</u> children, no recursion required) without selecting every node
                individually).
              </li>
              <li>
                Add some tests where you think the code could benefit from having tests.
              </li>
            </ul>
            <p>
              The solution does not need to be visually styled in any special way.
              The hierarchy and the selection should be visible of course.
            </p>

            <h2>Get Started</h2>
            <p>
              You can find the required list of nodes in the nodes.ts file:
            </p>
            {JSON.stringify(nodes, null, 4)}
            {JSON.stringify(convert(nodes), null, 4)}
            <p>
              Good luck and please don't hesitate to as if anything is unclear.
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
