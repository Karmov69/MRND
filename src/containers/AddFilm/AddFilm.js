import React, { Component } from "react";
import classes from "./AddFilm.css";
import axios from "../../axios/axios-quiz";
import Loader from "../../components/UI/Loader/Loader";

class AddFilm extends Component {
  state = {
    inputFilmName: "",
    films: [],
    maxFilm: 3,
    currentFilmNumber: 0,
    exist: false,
    authorExist: false,
    message: "",
    myViewed: [],
    seanceList: [],
    visibleViewedList: false,
    visibleThisSeance: false,
    seanceCount: 0,
    pending: false
  };

  componentDidMount = async () => {
    this.setState({ pending: true });
    let currentUser = localStorage.getItem("login");
    await axios
      .get("https://react-quiz-4129b.firebaseio.com/films.json")
      .then(response => {
        let seanceList = [];

        for (const i in response.data) {
          if (response.data.hasOwnProperty(i)) {
            seanceList.push(response.data[i]);
          }
        }
        this.setState({ seanceList });
      })
      .catch(e => {
        console.log(e);
      });

    if (this.state.seanceList.length !== 0) {
      this.setState({ seanceCount: this.state.seanceList[0].films.length });
    }

    await axios
      .get("https://react-quiz-4129b.firebaseio.com/all-films.json")
      .then(response => {
        let myViewed = [];

        for (const key in response.data) {
          if (response.data.hasOwnProperty(key)) {
            const element = response.data[key];

            if (element.author === currentUser) {
              for (const i in element.films) {
                if (element.films.hasOwnProperty(i)) {
                  myViewed.push(element.films[i].filmName);
                }
              }
            }
          }
        }
        this.setState({ myViewed });
        this.setState({
          pending: false
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  handleChange = event => {
    this.setState({ inputFilmName: event.target.value });
  };

  addViewedFilm = name => {
    if (this.state.currentFilmNumber < this.state.maxFilm && name) {
      let existFilms = this.state.films.filter(film => {
        return film.filmName === name;
      });
      if (existFilms.length === 0) {
        this.state.films.push({
          filmName: name,
          exist: false,
          id: this.state.currentFilmNumber
        });
        let countFilm = this.state.currentFilmNumber;
        this.setState({ currentFilmNumber: countFilm + 1 });
        this.setState({
          inputFilmName: ""
        });
        this.setState({ message: "" });
      } else {
        this.setState({ message: "Вы уже добавили данный фильм!" });
      }
    }
  };

  addFilmHandler = () => {
    if (this.state.currentFilmNumber < this.state.maxFilm) {
      let existFilms = this.state.films.filter(film => {
        return film.filmName === this.state.inputFilmName;
      });

      if (existFilms.length === 0) {
        this.state.films.push({
          filmName: this.state.inputFilmName,
          exist: false,
          id: this.state.currentFilmNumber
        });
        let countFilm = this.state.currentFilmNumber;
        this.setState({ currentFilmNumber: countFilm + 1 });
        this.setState({
          inputFilmName: ""
        });
        this.setState({
          message: ""
        });
      } else {
        this.setState({
          message: "Вы уже добавили данный фильм!"
        });
      }
    }
  };

  filmList = () => {
    return this.state.films.map((film, index) => {
      return (
        <li key={index}>
          {film.exist ? (
            <span style={{ color: "red" }}>{film.filmName} </span>
          ) : (
            <span>{film.filmName} </span>
          )}
          <button
            type="button"
            onClick={this.deleteFilmHandler.bind(this, film.filmName)}
          >
            Удалить
          </button>
        </li>
      );
    });
  };

  deleteFilmHandler(name) {
    const films = this.state.films;
    let newFilmsArray = [];

    for (const i in films) {
      if (films.hasOwnProperty(i)) {
        const element = films[i];

        if (element.filmName !== name) {
          newFilmsArray.push(element);
        } else {
          let count = this.state.currentFilmNumber;
          this.setState({
            films: newFilmsArray,
            currentFilmNumber: count - 1
          });
        }
      }
    }
  }

  sendFilms = async () => {
    this.setState({ message: "" });
    let author = localStorage.getItem("login");

    await axios
      .get("https://react-quiz-4129b.firebaseio.com/films.json")
      .then(response => {
        for (const i in response.data) {
          if (response.data.hasOwnProperty(i)) {
            const element = response.data[i];
            if (element.author === author) {
              this.setState({ authorExist: true });
            }
          }
        }
      })
      .catch(e => {});

    this.setState({
      exist: false
    });
    if (!this.state.authorExist) {
      await axios
        .get("https://react-quiz-4129b.firebaseio.com/viewed.json")
        .then(response => {
          if (response.data) {
            let allFilms = response.data;

            if (this.state.films) {
              let filmsState = this.state.films;
              for (const iterator of filmsState) {
                let filmState = iterator.filmName;
                for (const i in allFilms) {
                  if (allFilms.hasOwnProperty(i)) {
                    const film = allFilms[i].film;
                    if (filmState === film) {
                      let films = this.state.films;
                      let itemId = iterator.id;
                      for (const key in films) {
                        if (films.hasOwnProperty(key)) {
                          const element = films[key];
                          if (element.id === itemId) {
                            element.exist = true;
                            this.setState({
                              message: "Данные фильмы уже были просмотрены!"
                            });
                          }
                        }
                      }
                      this.setState({ films, exist: true });
                    }
                  }
                }
              }
            }
          } else {
            axios.post("https://react-quiz-4129b.firebaseio.com/films.json", {
              films: this.state.films,
              author: localStorage.getItem("login")
            });
            axios.post(
              "https://react-quiz-4129b.firebaseio.com/all-films.json",
              {
                films: this.state.films,
                author: localStorage.getItem("login")
              }
            );
            this.setState({
              inputFilmName: "",
              films: [],
              maxFilm: 3,
              currentFilmNumber: 0
            });
          }
        })
        .catch(e => {});

      await axios
        .get("https://react-quiz-4129b.firebaseio.com/all-films.json")
        .then(response => {
          if (!this.state.exist && response.data) {
            axios.post("https://react-quiz-4129b.firebaseio.com/films.json", {
              films: this.state.films,
              author: localStorage.getItem("login")
            });
            axios.post(
              "https://react-quiz-4129b.firebaseio.com/all-films.json",
              {
                films: this.state.films,
                author: localStorage.getItem("login")
              }
            );
            this.setState({
              inputFilmName: "",
              films: [],
              maxFilm: 3,
              currentFilmNumber: 0
            });
          }
        })
        .catch(e => {});
    } else {
      console.log("Пользователь уже существует");
      this.setState({
        message: "Для текущего сеанса, вы уже добавляли фильм!"
      });
    }

    // -----------
  };

  getMyViewed = () => {
    if (this.state.myViewed.length !== 0) {
      let resultArr = [];
      for (const iterator of this.state.myViewed) {
        resultArr.push(iterator);
      }

      return resultArr.map((film, index) => {
        return (
          <li key={index} onClick={this.addViewedFilm.bind(this, film)}>
            {film} <i className="fas fa-plus" />
          </li>
        );
      });
    }
  };

  showViewedHandler = () => {
    this.setState({ visibleViewedList: !this.state.visibleViewedList });
  };

  showThisSeanceHandler = () => {
    this.setState({ visibleThisSeance: !this.state.visibleThisSeance });
  };

  getThisSeance = () => {
    if (this.state.seanceList.length !== 0) {
      let resultArr = [];
      for (const iterator of this.state.seanceList) {
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

  getCountSeance = () => {
    return this.state.seanceCount;
  };

  render() {
    return (
      <div className={classes.AddFilm}>
        {!this.state.pending ? (
          <div>
            <h1>Добавить фильм</h1>
            <p>{this.state.message}</p>
            <form>
              {this.state.currentFilmNumber < this.state.maxFilm ? (
                <div>
                  <input
                    type="text"
                    value={this.state.inputFilmName}
                    onChange={this.handleChange}
                  />
                  <button type="button" onClick={this.addFilmHandler}>
                    Добавить
                  </button>
                </div>
              ) : null}

              <ul className={classes.currentFilms}>{this.filmList()}</ul>
              {this.state.currentFilmNumber === this.state.maxFilm ? (
                <button
                  type="button"
                  onClick={this.sendFilms}
                  className={classes.send}
                >
                  Отправить
                </button>
              ) : null}

              {this.state.myViewed.length !== 0 ? (
                <div>
                  <div
                    className={classes.viewedTitle}
                    onClick={this.showViewedHandler}
                  >
                    <h2 onClick={this.showViewedHandler}>
                      Раннее добавленные{" "}
                    </h2>

                    {this.state.visibleViewedList ? (
                      <i className="fa fa-chevron-up" aria-hidden="true" />
                    ) : (
                      <i className="fa fa-chevron-down" aria-hidden="true" />
                    )}
                  </div>
                  {this.state.visibleViewedList ? (
                    <ul className={classes.viewed}>{this.getMyViewed()}</ul>
                  ) : null}

                  <div
                    className={classes.thisSeance}
                    onClick={this.showThisSeanceHandler}
                  >
                    <h2 onClick={this.showThisSeanceHandler}>
                      Текущий сеанс ( {this.state.seanceCount} )
                    </h2>
                    {this.state.visibleThisSeance ? (
                      <i className="fa fa-chevron-up" aria-hidden="true" />
                    ) : (
                      <i className="fa fa-chevron-down" aria-hidden="true" />
                    )}
                  </div>
                  {this.state.visibleThisSeance ? (
                    <ul className={classes.viewed}>{this.getThisSeance()}</ul>
                  ) : null}
                </div>
              ) : null}
            </form>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

export default AddFilm;
