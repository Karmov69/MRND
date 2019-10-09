import React, { Component } from "react";
//import classes from "./Rating.css";

class Rating extends Component {
  doRating(index) {
    this.props.doRating(index);
  }

  getStars = () => {

    let starsCount = [];
    for (let i = 1; i <= this.props.count; i++) {
      if (~~this.props.avg === i) {
        starsCount.push(
          <i
            className="fas fa-star-half-alt"
            aria-hidden="true"
            style={{ cursor: "pointer" }}
            key={i}
            onClick={this.doRating.bind(this, i)}
          />
        );
      } else {
        starsCount.push(
          <i
            className="far fa-star"
            style={{ cursor: "pointer" }}
            key={i}
            onClick={this.doRating.bind(this, i)}
          />
        );
      }

    }
    return starsCount;
  };

  render() {
    return <div>{this.getStars()}</div>;
  }
}

export default Rating;
