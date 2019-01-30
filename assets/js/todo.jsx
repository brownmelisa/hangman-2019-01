import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';

export default function todo_init(root) {
  ReactDOM.render(<Todo />, root);
}

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { name: "Do homework", done: false },
        { name: "Eat Dinner", done: false },
      ],
      add_text: "",
    }
  }

  toggle_item(ii) {
    let ys = _.map(this.state.items, (item, jj) => {
      if (ii == jj) {
        //return { name: item.name, done: !item.done };
        return _.assign({}, item, {done: !item.done});
      }
      else {
        return item;
      }
    });

    this.setState(_.assign({}, this.state, {items: ys}));
  }

  update_text(ev) {
    this.setState(_.assign({}, this.state, {add_text: ev.target.value}));
  }

  add_item(ev) {
    let xs = this.state.items.slice();
    xs.push({
      name: this.state.add_text,
      done: false
    });
    this.setState(_.assign({}, this.state, {
      items: xs,
      add_text: "",
    }));
  }

  render() {
    let items = _.map(this.state.items, (item, ii) => {
      return <TodoItem key={ii} ii={ii} root={this} item={item} />;
    });

    return (
      <div>
        <h2>Tasks</h2>
        <ul>
          { items }
        </ul>
        <h2>Add Item</h2>
        <AddForm root={this} add_text={this.state.add_text} />
      </div>
    );
  }
}

function TodoItem(props) {
  let {item, root, ii} = props;

  function box_checked(ev) {
    root.toggle_item(ii);
  }

  return <li>
    {item.name}
    <input type="checkbox" checked={item.done}
           onChange={box_checked} />
  </li>;
}

function AddForm(props) {
  let {root} = props;
  return (
    <div>
      <input type="text" name="name" value={props.add_text}
             onChange={root.update_text.bind(root)} />
      <button onClick={root.add_item.bind(root)}>Add Item</button>
    </div>
  );
}
