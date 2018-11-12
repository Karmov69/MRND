import React, { Component } from "react";
import classes from "./Bag.css";
import axios from "../../axios/axios-quiz";

class Bag extends Component {
  state = {
    user: localStorage.getItem("login"),
    comment: "",
    comments: []
  };

  componentDidMount = async () => {
    await axios
      .get("https://react-quiz-4129b.firebaseio.com/comments.json")
      .then(response => {
        let comments = [];

        for (const key in response.data) {
          if (response.data.hasOwnProperty(key)) {
            const element = response.data[key];
            comments.push({
              author: element.author,
              comment: element.comment,
              date: element.date
            });
          }
        }

        this.setState({ comments });
      })
      .catch(e => {
        console.log(e);
      });
  };

  handleChange = event => {
    this.setState({ comment: event.target.value });
  };

  sendCommentHandler = async () => {
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    date = mm + "/" + dd + "/" + yyyy;

    await axios.post("https://react-quiz-4129b.firebaseio.com/comments.json", {
      comment: this.state.comment,
      author: this.state.user,
      date
    });
    this.setState({
      comment: ""
    });
    await axios
      .get("https://react-quiz-4129b.firebaseio.com/comments.json")
      .then(response => {
        let comments = [];

        for (const key in response.data) {
          if (response.data.hasOwnProperty(key)) {
            const element = response.data[key];
            comments.push({
              author: element.author,
              comment: element.comment,
              date: element.date
            });
          }
        }

        this.setState({ comments });
      })
      .catch(e => {
        console.log(e);
      });
  };

  getCommentsHandler() {
    if (this.state.comments.length !== 0) {
      let resultArr = [];
      for (const iterator of this.state.comments) {
        resultArr.push(iterator);
      }

      return resultArr.map((comment, index) => {
        console.log(comment);
        return (
          <div key={index}>
            <h3>
              {comment.author} {comment.date}
            </h3>
            <p>{comment.comment}</p>
          </div>
        );
      });
    }
  }

  render() {
    return (
      <div className={classes.Bag}>
        <div>
          <h1>Отзывы</h1>
          {this.getCommentsHandler()}
          <textarea value={this.state.comment} onChange={this.handleChange} />
          <button type="submit" onClick={this.sendCommentHandler}>
            Отправить
          </button>
        </div>
      </div>
    );
  }
}

export default Bag;
