import React, { Component } from "react";
import classes from "./Viewed.css";
import axios from "axios";
import Loader from "../../components/UI/Loader/Loader";
import Rating from "../../components/UI/Rating/Rating";
import * as firebase from "firebase";
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
      .get(`${process.env.REACT_APP_FIRWBASE_URL}/viewed.json`)
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
    thisFilm[0].test = [];

    let thisFilmRatingCount = 0;
    let thisFilmRatingSumm = 0;
    if (!thisFilm[0].rating) {
      thisFilm[0].rating = [];
    }
    if (!thisFilm[0].avg) {
      thisFilm[0].avg = 0;
    }

    thisFilmRatingCount = thisFilm[0].rating.length;

    for (let i = 0; i < thisFilmRatingCount; i++) {
      const point = thisFilm[0].rating[i];
      thisFilmRatingSumm += point;
    }

    for (const key in films) {
      if (films.hasOwnProperty(key)) {
        const element = films[key];
        if (element.film === thisFilm[0].film) {
          element.rating.push(index);
          if (thisFilmRatingCount === 0) {
            element.avg = index;
          } else {
            element.avg = thisFilmRatingSumm / thisFilmRatingCount;
          }
        }
      }
    }
    this.setState({ films });

    firebase
      .database()
      .ref()
      .update({ viewed: films });
  }

  getViewed = () => {
    if (this.state.films.length !== 0) {
      let resultArr = [];
      for (const iterator of this.state.films) {
        resultArr.push({ film: iterator.film, avg: iterator.avg });
      }
      console.log(this.state.films);
      console.log(resultArr);

      for (const iterator of resultArr) {
        return (
          <li key={iterator}>
            {iterator.film}
            <Rating
              film={iterator.film}
              count="5"
              avg={iterator.avg}
              doRating={this.doRating.bind(this, iterator.film)}
            />
          </li>
        )
      }


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
