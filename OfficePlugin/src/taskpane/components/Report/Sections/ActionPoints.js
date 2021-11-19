/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import * as React from "react";

export class ActionPoints extends React.Component {
  render() {
    return (
      <>
        <h2>{this.props.ix}. Action Points</h2>
        <p>
            Your advice requirements are currently up to date, and there is nothing to action at this stage.
            Please get in touch if there is anything you are concerned about or if you have any questions
            on the contents of this report.
        </p>
      </>
    );
  }
}
