import { TransformMarkDown } from "@/utils/TransformMarkDown"
import React from "react";
import styles from "./MdContent.module.css";

type ComponentMap = Record<string, React.ComponentType<Record<string, any>>>;
export function MdContent(
  { markdown, components = {} }:
  { markdown: string, components?: ComponentMap }
) {
  const html = TransformMarkDown({ markdown, components });

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