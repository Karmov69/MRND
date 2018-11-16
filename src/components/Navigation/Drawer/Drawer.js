import React, { Component } from "react";
import classes from "./Drawer.css";
import Backdrop from "../../UI/Backdrop/Backdrop";
import { NavLink } from "react-router-dom";

class Drawer extends Component {
  clickHandler = () => {
    this.props.onClose();
  };

  renderLinks(links) {
    return links.map((link, index) => {
      return (
        <li key={index}>
          <NavLink
            to={link.to}
            exact={link.exact}
            activeClassName={classes.active}
            onClick={this.clickHandler}
          >
            {link.label}
          </NavLink>
        </li>
      );
    });
  }

  render() {
    const cls = [classes.Drawer];
    let user = localStorage.getItem("login");

    if (!this.props.isOpen) {
      cls.push(classes.close);
    }

    const links = [];
    if (user === "Karmov@gmail.com") {
      links.push({ to: "/admin", label: "Админка", exact: false });
    }
    if (this.props.isAuthenticated) {
      links.push({
        to: "/add-film",
        label: "Добавить фильм",
        exact: false
      });
      links.push({
        to: "/random-film",
        label: "Выборка фильма",
        exact: false
      });
      links.push({
        to: "/viewed",
        label: "Просмотренные",
        exact: false
      });

      links.push({ to: "/bag", label: "Баги", exact: false });
      links.push({
        to: "/logout",
        label: "Выйти",
        exact: false
      });
    } else {
      links.push({ to: "/auth", label: "Авторизация", exact: false });
    }

    return (
      <React.Fragment>
        <nav className={cls.join(" ")}>
          <ul>{this.renderLinks(links)}</ul>
        </nav>
        {this.props.isOpen ? <Backdrop onClick={this.props.onClose} /> : null}
      </React.Fragment>
    );
  }
}

export default Drawer;
