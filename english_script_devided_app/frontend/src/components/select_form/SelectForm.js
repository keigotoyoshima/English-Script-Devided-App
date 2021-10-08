import React from 'react'
import { Grid, Button, Typography, Divider } from "@material-ui/core";
import Table from './Table';
import Moment from 'moment';
import ProduceContent from '../helper/ProduceContent';
import Selection from './Selection';


export default class SelectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      title: '',
      category: '',
      duration: '',
      created: '',
      updated: '',
    };
    this.id = this.props.id;
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  async componentDidMount() {
    const response_movie = await fetch(`/api/get-movie?id=${this.id}`)
    const data_movie = await response_movie.json()
     
    // for category
    const response_category = await fetch(`/api/get-category?id=${data_movie.category}`)
    const data_category = await response_category.json()

    // setState
    this.setState({
      title:data_movie.title, 
      created:Moment(data_movie.created).format('MMMM Do YYYY, h:mm:ss a'), 
      updated:Moment(data_movie.updated).format('MMMM Do YYYY, h:mm:ss a'),
      duration:data_movie.duration+" minites",
      category:data_category.category,
    });
    
  }

  onSubmit(e){
    e.preventDefault();
    if (!this.state.value) {
      alert('Please add a task')
      return
    }
    this.handleSubmit()
  }

  // for script content
  async handleSubmit(){
    const response = await fetch(`/api/get-movie?id=${this.id}`)
    const data = await response.json()
    var capture = ProduceContent(this.state.value)
    var script_contnet = data[capture]
    if(script_contnet == '') script_contnet = "No script for that minutes"
    this.props.callback(script_contnet)
  }

  handleChange(value) {
    this.setState({
      value: value,
    });
  }

  render(){
    Moment.locale('en');

    return (
      <div className="l-wrapper card-radius">
        <article className="card">
        <div className="formSelect">
          <div>
            <h3 className="card__title">Select</h3>
          </div>
          <div>
            <form  onSubmit={this.onSubmit}>
              <Selection callback={this.handleChange}></Selection>
              <input type="submit" value="Confirm" />
            </form>
          </div>
        </div>

        <div className='thick__divider'></div>

        <div className="card__body">
          {/* reactcomponentのclassNameにcss適応できない可能性 */}
          <div className="card__list">
          <Table type="Title" content={this.state.title}></Table>
          </div>

          <div className='thin__divider'></div>

          <div className="card__list">
          <Table type="Category" content={this.state.category}></Table>
          </div>

          <div className='thin__divider'></div>

          <div className="card__list">
          <Table type="Duration" content={this.state.duration}></Table>
          </div>

          <div className='thin__divider'></div>

          <div className="card__list">
          <Table type="Created" content={this.state.created}></Table>
          </div>

          <div className='thin__divider'></div>

          <div className="card__list">
          <Table type="Updated" content={this.state.updated}></Table>
          </div>
        </div>    
      </article>
    </div>
    );
  } 
}

