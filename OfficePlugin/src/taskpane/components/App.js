import * as React from "react";
import PropTypes from "prop-types";
// import { Button, ButtonType } from "office-ui-fabric-react";
// import Header from "./Header";
// import HeroList from "./HeroList";
import Progress from "./Progress";
/* global Word */

import ReactDOMServer from "react-dom/server";

import { getReport } from "../../zoho/zoho";
import OngoingReport from "./Report/Report";

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

      let providers = await getReport("All_Providers");
      let clients = await getReport("All_Clients");
      let policies = await getReport("All_Policies");

      this.setState({
        progress: "loaded",
      });

      let db = {
        providers,
        clients,
        policies,
      };
      console.log(db);

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
        let report = <OngoingReport db={this.state.db} clientId={this.state.clientId} client={this.state.client} />;
        let html = ReactDOMServer.renderToStaticMarkup(report);
        context.document.body.clear();
        const paragraph = context.document.body.insertParagraph("", Word.InsertLocation.end);
        paragraph.insertHtml(html, "End");
      } catch (e) {
        console.log(`Exception: ${e}`);
        alert("Unable to load data from cloud");
      }
      await context.sync();
    });
  };

  _handleSelect(event) {
    let clientId = event.target.value;
    this.setState({
      clientId,
      client: this.state.db.clients.find((c) => c.ID == clientId),
    });
  }

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return this.state.db ? (
      <div>
        <select onChange={this._handleSelect}>
          {this.state.db.clients.map((c) => {
            let id = c.ID;
            let name = c.Name.display_value;
            return (
              <option value={id} key={id}>
                {name}
              </option>
            );
          })}
        </select>

        <button onClick={this._generate}>Generate</button>
      </div>
    ) : (
      <>
        <button onClick={this._load}>Load</button>
        {this.state.progress}
      </>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
