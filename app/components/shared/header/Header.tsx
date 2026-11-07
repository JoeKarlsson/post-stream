import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import NavLink from "../navigation/NavLink";
import TextButton from "../textButton/TextButton";
import { logout } from "../../../slices/userSlice";
import { AppDispatch, RootState } from "../../../slices";
import styles from "./Header.module.scss";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, profile } = useSelector((state: RootState) => state.user);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        PostStream
      </Link>
      <nav aria-label="main">
        <ul className={styles.nav}>
          <li>
            [ <NavLink to="/about">about</NavLink> ]
          </li>
          {isAuthenticated && profile ? (
            <>
              <li>
                [ <NavLink to={`/user/${profile.username}`}>profile</NavLink> ]
              </li>
              <li>
                <TextButton onClick={() => dispatch(logout())}>logout</TextButton>
              </li>
            </>
          ) : (
            <li>
              [ <NavLink to="/login">login</NavLink> ]
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
