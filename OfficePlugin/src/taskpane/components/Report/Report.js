import * as React from "react";
import ReactDOMServer from "react-dom/server";

class InvestmentPerformance extends React.Component {
  render() {
    console.log("clientId", this.props.clientId, "client", this.props.client);
    let clientPolicyIds = this.props.client.Policies.map((p) => p.ID);
    return (
      <p>
        <h2>Investment Performance</h2>
        <p>You have been investing into the following Model Portfolio Service(s):</p>
        <ol>
          {clientPolicyIds.map((clientPolicyId) =>
            this.props.db.policies
              .filter((p) => p.ID == clientPolicyId)
              .map((policy) => {
                return policy.MPS_Providers
                  ? policy.MPS_Providers.map((provider) => <li key={provider.ID}>{provider.display_value}</li>)
                  : null;
              })
          )}
        </ol>
      </p>
    );
  }
}

class Dump extends React.Component {
  render() {
    console.log(this.props);
    return <p>{JSON.stringify(this.props.db)}</p>;
  }
}

export default class OngoingReport extends React.Component {
  render() {
    return (
      <>
        <h1>Ongoing Suitability</h1>
        <InvestmentPerformance db={this.props.db} clientId={this.props.clientId} client={this.props.client} />
        {/* <Dump db={this.props.db} /> */}
      </>
    );
  }
}
