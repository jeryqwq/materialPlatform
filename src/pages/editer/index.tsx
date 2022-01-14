import React, { useState } from 'react';
import { history } from 'umi';
import Editor from '@/components/editor'
import { inject, observer } from 'mobx-react';

@inject('counterStore')
@observer
class Editer extends React.Component{
  inputVal = ''
  setVal(val: string) {
    this.setState({
      inputVal: val
    })
  }
  render(): React.ReactNode {
    const store = this.props as any
    const {counterStore} = store
    // const [inputVal, setVal] = useState('')
    return (
      <div>
        Editer-content
        <input type="text" onChange={(e) => this.setVal(e.target.value)} />
        <button onClick={() => {
          history.push(`/index?val=${this.inputVal}`);
        }}> click me to other with input value params</button>
        <h1>mobx count Store val { counterStore.count } index</h1>
        <button onClick={() => {
          history.push(`/manage?val=${this.inputVal}`);
        }}> click me to manage with input value params</button>
        <button onClick={counterStore.handleDec}>handleDec</button>
        <Editor />
      </div>
    );
  }
}

export default Editer;
