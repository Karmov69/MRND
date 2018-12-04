import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import Quiz from "./containers/Quiz/Quiz";
import QuizList from "./containers/QuizList/QuizList";
import Auth from "./containers/Auth/Auth";
import AddFilm from "./containers/AddFilm/AddFilm";
import RandomFilm from "./containers/RandomFilm/RandomFilm";
import Viewed from "./containers/Viewed/Viewed";
import { connect } from "react-redux";
import Logout from "./components/Logout/Logout";
import Bag from "./containers/Bag/Bag";
import Admin from "./containers/Admin/Admin";
import { autoLogin } from "./store/actions/auth";

class App extends Component {
  componentDidMount() {
    this.props.autoLogin();
  }
  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/quiz/:id" component={Quiz} />
        <Route path="/" exact component={QuizList} />
        <Redirect to="/" />
      </Switch>
    );
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/logout" component={Logout} />
          <Route path="/add-film" component={AddFilm} />
          <Route path="/random-film" component={RandomFilm} />
          <Route path="/viewed" component={Viewed} />
          <Route path="/" exact component={Viewed} />
          <Route path="/bag" exact component={Bag} />
          <Route path="/admin" exact component={Admin} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return <Layout>{routes}</Layout>;
  }
}
function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.auth.token
  };
}

function mapDispatchToProps(dispatch) {
  return { autoLogin: () => dispatch(autoLogin()) };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
