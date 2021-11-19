/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import * as React from "react";
import Pluralize from "pluralize";

export class DueDiligence extends React.Component {
  render() {
    let { providers, services } = this.props.db;

    let pNames = providers.map(p => p.Provider_name);
    let sNames = Array.from(services.values()).map(s => s.MPS_name);
    let names = [].concat(pNames, sNames);

    return (
      <>
        <h2>{this.props.ix}. Platform Due Diligence</h2>
        <p>
            Integral Advice conducts periodic due diligence on the platform and model
            service {Pluralize("provider", providers.length)} that you use. On the basis
            of this research, I am happy to continue with
            my {Pluralize("endorsement", providers.length)} of {/*space */}
            
            {names.length == 1
                ? names[0]
                : names.map((p, ix) => (
                    ix < names.length-1
                        ? names.length > 2
                            ? `${p}, `  // Oxford comma is used
                            : `${p} `
                        : `and ${p}.`
            ))} {/* space */}
            Please note that these recommendations may change in the future and will form the subject of our ongoing reviews.
        </p>
      </>
    );
  }
}
