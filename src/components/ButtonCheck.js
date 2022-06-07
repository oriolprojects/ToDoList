import React from 'react'
import "../css/awesome-buttons.css";
import "../css/ListItems.css";



export default class ButtonCheck extends React.Component{


  render(){
    return (
      <div className="item-text" onClick={
        () => {
          this.props.onClick();
        }
      }>
        <div className={this.props.done}>
          {this.props.textButton}
        </div>
      </div>
    )
  }
}