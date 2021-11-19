/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import * as React from "react";

export class OngoingSuitability extends React.Component {
  render() {
    let { client } = this.props.db;

    let objectives = client.Policies.flatMap(p => (
        p.Detail.Objectives.map(o => o.display_value)
    ));
    objectives = [...new Set(objectives)];

    let reasons = client.Policies.flatMap(p => (
        p.Detail.Reasons.map(r => r.Reason)
    ));
    reasons = [...new Set(reasons)];

    return (
      <>
        <h2>{this.props.ix}. Ongoing Suitability</h2>
        <p>
            Each of the investment and pension policies on which I have advised are listed below.
            Listed along with each policy is its objective(s), and the reasons why the policy is
            still a suitable choice to achieve those aims.

            <br />
            The policy is designed to meet the following objective(s):
            <div>
                {objectives.map(r => (
                    <>
                        - {r}<br />
                    </>
                ))}
            </div>

            It is suitable for the following reasons:
            <div>
                {reasons.map(r => (
                    <>
                        - {r}<br />
                    </>
                ))}
            </div>
        </p>
      </>
    );
  }
}
