/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import * as React from "react";

export class InvestmentPerformance extends React.Component {
  render() {
    let services = Array.from(this.props.db.services.values).sort();
    return (
      <>
        <h2>{this.props.ix}. Investment Performance</h2>
        <p>You have been investing into the following Model Portfolio Service(s):</p>
        <p>
          <ol>
            {services.map((mps, ix) => (
              <li key={ix}>
                {mps}
              </li>
            ))}
          </ol>
        </p>
        <p>
          {services.length == 1
            ? <>Here is the most recent factsheet for the portfolio:</>
            : <>Here are the most recent factsheets for the portfolios:</>}
        </p>
        <p>
          Please get in touch if you would like to discuss the performance of your portfolio in more detail.
        </p>
      </>
    );
  }
}
