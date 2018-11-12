import React, { Component} from 'react';
import classes from './Viewed.css'
import axios from "axios";

class Viewed extends Component {
  state = {
    films: []
  };

  componentDidMount = async () => {
    await axios
      .get("https://react-quiz-4129b.firebaseio.com/viewed.json")
      .then(response => {
        let films = [];

        for (const i in response.data) {
          if (response.data.hasOwnProperty(i)) {
            films.push(response.data[i]);
          }
        }
        this.setState({ films });
      })
      .catch(e => {
        console.log(e);
      });
  };

  getViewed = () => {
    if (this.state.films.length !== 0) {
      let resultArr = [];
      for (const iterator of this.state.films) {
        resultArr.push(iterator.film);
      }

      return resultArr.map((film, index) => {
        return <li key={index}>{film}</li>;
      });
    }
  }

  render() {
    return <div className={classes.Viewed}>
        <div>
          <h1>Просмотренные</h1>
          <ul>{this.getViewed()}</ul>
        </div>
      </div>;
  }
}


export default Viewed;