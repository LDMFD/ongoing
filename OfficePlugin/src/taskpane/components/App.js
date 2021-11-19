/* eslint-disable prettier/prettier */

import * as React from "react";
import PropTypes from "prop-types";
// import { Button, ButtonType } from "office-ui-fabric-react";
// import Header from "./Header";
// import HeroList from "./HeroList";
import Progress from "./Progress";
/* global Word */

import ReactDOMServer from "react-dom/server";

import { ZohoRequest } from "../../zoho/zoho";
import OngoingReport from "./Report/Report";

// import './App.css';

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._handleSelect = this._handleSelect.bind(this);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      progress: "",
    });
  }

  _load = async () => {
    try {
      this.setState({
        progress: "loading",
      });

      let clients = await ZohoRequest("report", "All_Clients");

      this.setState({
        progress: "loaded",
      });

      let db = {
        clients,
      };

      this.setState({
        db: db,
      });
    } catch (e) {
      console.log(`Exception: ${e}`);
      alert("Unable to load data from cloud");
    }
  };

  _generate = async () => {
    return Word.run(async (context) => {
      try {
        await this._calculate(this.state.client);

        let report = <OngoingReport db={this.state} />;
        let html = ReactDOMServer.renderToStaticMarkup(report);
        console.log(html);

        context.document.body.clear();
        const paragraph = context.document.body.insertParagraph("", Word.InsertLocation.end);
        paragraph.insertHtml(html, "End");
      } catch (e) {
        console.log(`Exception: ${e.stack}`);
        alert("Unable to load data from cloud");
      }
      await context.sync();
    });
  };

  _calculate = async (client) => {
    let t = await ZohoRequest("report", `All_Providers/3341259000000415039`);
    console.log("t", t);

    if (!client.Policies) {
      return;
    }

    let services = new Map();
    let providerIDs = new Set();
    let portfolios = [];

    await Promise.all(
      client.Policies.map(async (p, ix) => {
        let policyDetail = await ZohoRequest("report", `All_Policies/${p.ID}`);
        policyDetail.MPS_Providers.map(async mps => {
          let mpsDetail = await ZohoRequest("report", `MPS_Providers_Report/${mps.ID}`);
          services.set(mps.ID, mpsDetail);
        });
        policyDetail.Portfolios.map(async p => {
          let portfolioDetail = await ZohoRequest("report", `All_Portfolios/${p.ID}`);
          if (!portfolios.some(p => p.ID == portfolioDetail.ID)) {
            portfolios.push(portfolioDetail);
          }
        });
        policyDetail.Policy_type.Detail = await ZohoRequest("report", `All_Policy_Types/${policyDetail.Policy_type.ID}`);
        providerIDs.add(policyDetail.Providers.ID);
        client.Policies[ix].Detail = policyDetail;
      })
    );

    // TODO sort portfolios

    let providers = [];

    await Promise.all(
      Array.from(providerIDs).map(async (providerID) => {
        let providerDetail = await ZohoRequest("report", `All_Providers/${providerID}`);
        providers.push(providerDetail);
      })
    );

    this.setState({
      client,
      providers,
      services,
      portfolios,
    });
  };

  _handleSelect(event) {
    let clientId = event.target.value;
    let client = this.state.db.clients.find((c) => c.ID == clientId);
    this.setState({
      clientId,
      client,
    });
  }

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    if (!this.state.db || !this.state.db.clients) {
      return (
        <>
          <button onClick={this._load}>{this.state.progress == "loading" ? "Loading" : "Load"}</button>
        </>
      );
    }

    let clients = this.state.db.clients;
    clients.sort((c1, c2) =>
      c1.Name.display_value > c2.Name.display_value ? 1 : c1.Name.display_value < c2.Name.display_value ? -1 : 0
    );

    return (
      <div className="app">
        <select onChange={this._handleSelect}>
          {clients.map((c) => {
            let id = c.ID;
            return c.Name.display_value ? (
              <option value={id} key={id}>
                {c.Name.last_name}, {c.Name.first_name}
              </option>
            ) : null;
          })}
        </select>

        <button onClick={this._generate}>Generate</button>
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
