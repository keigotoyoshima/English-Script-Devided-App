import React from 'react'

export default class Selection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
    console.log('handle Change');
    this.props.callback(this.state.value);
  }

  
  render(){
    return (
      <select value={this.props.value} onChange={this.handleChange}>
      <option value=""></option>
      <option value="1">0-10 minites</option>
      <option value="2">10-20 minites</option>
      <option value="3">20-30 minites</option>
      <option value="4">30-40 minites</option>
      <option value="5">40-50 minites</option>
      <option value="6">50-60 minites</option>
      <option value="7">60-70 minites</option>
      <option value="8">70-80 minites</option>
      <option value="9">80-90 minites</option>
      <option value="10">90-100 minites</option>
      <option value="11">100-110 minites</option>
      <option value="12">110-120 minites</option>
      <option value="13">120-130 minites</option>
      <option value="14">130-140 minites</option>
      <option value="15">140-150 minites</option>
      <option value="16">150-160 minites</option>
    </select>
      
    );
  } 
}

