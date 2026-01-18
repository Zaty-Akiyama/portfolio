import { TransformMarkDown } from "@/utils/TransformMarkDown"
import React from "react";
import styles from "./MdContent.module.css";

export function MdContent(
  { markdown }:
  { markdown: string }
) {
  const html = TransformMarkDown({ markdown });

  return (
    <div className={styles.mdContent}>
      {
        html.map((node, index) => (
          <React.Fragment key={index}>
            {node}
          </React.Fragment>
        ))
      }
    </div>
  )
}