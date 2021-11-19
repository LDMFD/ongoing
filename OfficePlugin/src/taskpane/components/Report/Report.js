/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */

import * as React from "react";

import { ActionPoints } from "./Sections/ActionPoints";
import { Advice } from "./Sections/Advice";
import { DueDiligence } from "./Sections/DueDiligence";
import { Fees } from "./Sections/Fees";
import { InvestmentPerformance } from "./Sections/InvestmentPerformance";
import { OngoingSuitability } from "./Sections/OngoingSuitability";

export default class OngoingReport extends React.Component {
  render() {
    let { db } = this.props,
        { client } = db,
        ix = 1;

    return (
      <>
        <p><i>{client.Name.display_value} - {client.ID}</i></p>

        <h1>Ongoing Suitability</h1>

        <InvestmentPerformance ix={ix++} db={db} />
        <Fees                  ix={ix++} db={db} />
        <Advice                ix={ix++} />
        <DueDiligence          ix={ix++} db={db} />
        <OngoingSuitability    ix={ix++} db={db} />
        <ActionPoints          ix={ix++} db={db} />
      </>
    );
  }
}
