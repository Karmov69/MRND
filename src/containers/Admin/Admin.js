import React, { Component } from "react";
import classes from "./Admin.css";
import axios from "../../axios/axios-quiz";
import Loader from "../../components/UI/Loader/Loader";

class Admin extends Component {
  state = {
    pending: false,
    seanceList: []
  };

  componentDidMount = async () => {
    this.setState({ pending: true });

    await axios
      .get(`${process.env.REACT_APP_FIRWBASE_URL}/films.json`)
      .then(response => {
        let seanceList = [];

        for (const i in response.data) {
          if (response.data.hasOwnProperty(i)) {
            seanceList.push(response.data[i]);
          }
        }
        this.setState({ seanceList });
        this.setState({ pending: false });
      })
      .catch(e => {
        console.log(e);
      });

    if (this.state.seanceList.length !== 0) {
      this.setState({ seanceCount: this.state.seanceList[0].films.length });
    }
  };

  render() {
    return (
      <div className={classes.Admin}>
        {!this.state.pending ? (
          <div>
            <h1>Админка</h1>
          </div>
        ) : (
            <Loader />
          )}
      </div>
    );
  }
}

export default Admin;
