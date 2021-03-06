import React from 'react'
import { AwesomeButton } from "react-awesome-button";
import "../css/awesome-buttons.css";
import '../css/Button.css';



export default class Button extends React.Component{

  render(){
    return (
      <div className={this.props.style + ' col-lg-3 col-md-12'} >
        <AwesomeButton type={this.props.type} size={this.props.size} onPress={this.props.onPress}>
          {this.props.textButton}
        </AwesomeButton>
      </div>
      
    )
  }
}