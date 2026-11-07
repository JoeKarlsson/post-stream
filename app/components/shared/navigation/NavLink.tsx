import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import styles from "./NavLink.module.scss";

// Router NavLink that marks the current page; keeps any className passed in
const NavLink = ({ className, ...props }: NavLinkProps & { className?: string }) => (
  <RouterNavLink
    {...props}
    className={({ isActive }) => [className, isActive && styles.active].filter(Boolean).join(" ")}
  />
);

export default NavLink;
