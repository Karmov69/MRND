import React, { Component } from "react";
import classes from "./RandomFilm.css";
import axios from "axios";
import Loader from "../../components/UI/Loader/Loader";

class RandomFilm extends Component {
  state = {
    films: [],
    randFilm: "",
    users: [],
    randUser: null,
    pending: false,
    selectedUser: [],
    viewed: ""
  };

  componentDidMount = async () => {
    this.setState({
      pending: true
    });
    await axios
      .get(`${process.env.REACT_APP_FIRWBASE_URL}/films.json`)
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
    await axios
      .get(`${process.env.REACT_APP_FIRWBASE_URL}/users.json`)
      .then(response => {
        let users = [];
        let data = response.data;
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            users.push({ login: data[key].login, id: key });
          }
        }
        this.setState({ users });
        this.setState({
          pending: false
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  getFIlms = () => {
    if (this.state.films.length !== 0) {
      let resultArr = [];
      for (const iterator of this.state.films) {
        for (const key in iterator.films) {
          if (iterator.films.hasOwnProperty(key)) {
            const element = iterator.films[key];
            resultArr.push(element.filmName);
          }
        }
      }

      return resultArr.map((film, index) => {
        return <li key={index}>{film}</li>;
      });
    }
  };

  getUsers = () => {
    if (this.state.users.length !== 0) {
      let resultArr = [];
      for (const user of this.state.users) {
        resultArr.push(user.login);
      }

      return resultArr.map((user, index) => {
        return <li key={index}>{user}</li>;
      });
    }
  };

  getRandomUserHandler = () => {
    let max = this.state.users.length;
    let number = Math.floor(Math.random() * max);
    let randUser = this.state.users[number].login;

    this.setState({ randUser });
    let resultArr = [];
    resultArr.push(randUser);

    for (const key in this.state.films) {
      if (this.state.films.hasOwnProperty(key)) {
        const element = this.state.films[key];
        if (randUser.toLowerCase() === element.author.toLowerCase()) {
          for (const iterator of element.films) {
            resultArr.push(iterator.filmName);
          }
        }
      }
    }
    this.setState({ selectedUser: resultArr });
  };

  addViewed = async film => {
    await axios.post(`${process.env.REACT_APP_FIRWBASE_URL}/viewed.json`, {
      film: film,
      rating: [],
      avg: 0
    });
    await axios
      .delete(`${process.env.REACT_APP_FIRWBASE_URL}/films.json`)
      .then(response => { })
      .catch(e => { });
  };

  getRandUserFilms = () => {
    if (this.state.selectedUser.length !== 0) {

      let resultArr = [];
      for (const iterator of this.state.selectedUser) {
        resultArr.push(iterator);
      }

      return resultArr.map((film, index) => {
        if (index === 0) {
          return <li key={index} className={classes.randUser}>{film}</li>;
        } else {
          return (
            <li key={index} className={classes.userData}>
              <div className={classes.filmName}>{film}{" "}</div>
              <button onClick={this.addViewed.bind(this, film)} className={classes.filmBtn}>Выбрать</button>
            </li>
          );
        }
      });
    }
  };

  render() {
    return (
      <div className={classes.RandomFilm}>
        {!this.state.pending ? (
          <div>
            {this.state.randUser ? (
              <div>
                <ul>{this.getRandUserFilms()}</ul>
              </div>
            ) : null}

            {this.state.films.length !== 0 && !this.state.randUser ? (
              <div>
                <h2>Список фильмов</h2>
                <ul>{this.getFIlms()}</ul>
              </div>
            ) : null}

            {!this.state.randUser ? (
              <div>
                <h2>Пользователи</h2>
                <ul>{this.getUsers()}</ul>
              </div>
            ) : null}

            <button onClick={this.getRandomUserHandler} className={classes.btnRnd}>RND</button>
          </div>
        ) : (
            <Loader />
          )}
      </div>
    );
  }
}

export default RandomFilm;
