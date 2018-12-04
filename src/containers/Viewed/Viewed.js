import React, { Component } from "react";
import classes from "./Viewed.css";
import axios from "axios";
import Loader from "../../components/UI/Loader/Loader";
import Rating from "../../components/UI/Rating/Rating";
class Viewed extends Component {
  state = {
    films: [],
    pending: false
  };

  componentDidMount = async () => {
    this.setState({
      pending: true
    });
    await axios
      .get("https://react-quiz-4129b.firebaseio.com/viewed.json")
      .then(response => {
        let films = [];

        for (const i in response.data) {
          if (response.data.hasOwnProperty(i)) {
            films.push({
              film: response.data[i].film,
              rating: response.data[i].rating || [],
              avg: response.data[i].avg || null
            });
          }
        }
        this.setState({ films });
      })
      .catch(e => {
        console.log(e);
      });
    this.setState({
      pending: false
    });
  };

  doRating(name, index) {
    let films = this.state.films;
    let thisFilm = films.filter(film => {
      return film.film === name;
    });
    console.log(films);

    for (const key in films) {
      if (films.hasOwnProperty(key)) {
        const element = films[key];
        if (element.film === thisFilm[0].film) {
          element.rating.push(index);
        }
      }
    }
    this.setState({ films });
    //axios.post("https://react-quiz-4129b.firebaseio.com/viewed.json", films);
  }

  getViewed = () => {
    if (this.state.films.length !== 0) {
      let resultArr = [];
      for (const iterator of this.state.films) {
        resultArr.push(iterator.film);
      }

      return resultArr.map((film, index) => {
        return (
          <li key={index}>
            {film}
            <Rating
              film={film}
              count="5"
              doRating={this.doRating.bind(this, film)}
            />
          </li>
        );
      });
    }
  };

  render() {
    return (
      <div className={classes.Viewed}>
        {!this.state.pending ? (
          <div>
            <h1>Просмотренные</h1>
            <ul>{this.getViewed()}</ul>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

export default Viewed;
