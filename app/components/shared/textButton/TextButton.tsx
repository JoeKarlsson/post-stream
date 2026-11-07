import React from "react";
import styles from "./TextButton.module.scss";

interface TextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

// PostStream's one control style: "[ label ]"
const TextButton = ({ children, onClick, type = "button", disabled }: TextButtonProps) => (
  <span className={styles.wrapper}>
    [{" "}
    <button type={type} className={styles.textButton} onClick={onClick} disabled={disabled}>
      {children}
    </button>{" "}
    ]
  </span>
);

export default TextButton;
