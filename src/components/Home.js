import React from 'react'
import { Switch, Route } from 'react-router-dom'
import $ from 'jquery'


export class Home extends React.Component {

	componentWillMount(){
		// this.getPlants(function(data){
		// 	alert(JSON.stringify(data));
		// });
	}

	getPlants(stepLoadedFunction){
		var self = this;
		$.ajax({
		type: 'POST',
		dataType: 'JSON',
		url: 'http://data.canadensys.net/vascan/api/0.1/search.json',
		data: {
			q:'Crataegus dodgei'
		},
		success: function(data,status){
		  stepLoadedFunction(data);
		}
		});
	}


  render() {
    return (
    <div className="card">
	  <div className="card-header">
	    Plant Name Updates
	  </div>
	  <div className="card-body">
	    <h4 className="card-title">Special title treatment</h4>
	    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
	    <a href="#" className="btn btn-primary">Go somewhere</a>
	  </div>
	</div>
    );
  }
}

export default Home;
