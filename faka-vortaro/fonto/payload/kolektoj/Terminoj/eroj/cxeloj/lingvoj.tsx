import React from "react";

import { Termino } from "../../../../../tipoj/payload-asertitaj-tipoj";

const LingvojCxelo = ({ cellData = {} }: { cellData: Termino["lingvoj"] }) => {
  const cxeleroj = Object.entries(cellData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([lingvo, tradukoj]) => {
      const estasTradukoj = tradukoj && tradukoj.length > 0;
      return (
        <span
          key={lingvo}
          className={`mx-1 ${
            estasTradukoj ? "font-semibold" : "text-neutral-400 dark:text-neutral-600"
          }`}
        >
          {lingvo.toUpperCase()}
        </span>
      );
    });
  return <div style={{ display: "flex", flexWrap: "wrap" }}>{cxeleroj}</div>;
};

export default LingvojCxelo;
