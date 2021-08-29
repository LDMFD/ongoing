import * as React from "react";
import PropTypes from "prop-types";
import { Button, ButtonType } from "office-ui-fabric-react";
import Header from "./Header";
import HeroList from "./HeroList";
import Progress from "./Progress";
/* global Word */

import { getReport } from "../../zoho/zoho";

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  componentDidMount() {
    this.setState({});
  }

  click = async () => {
    return Word.run(async (context) => {
      let names = [];

      try {
        let clients = await getReport("All_Clients");
        console.log(clients);
        clients.forEach((c) => {
          names.push(c.Name.display_value);
        });
      } catch (e) {
        //e.printStackTrace();
      }

      let namesStr = names.join(" - ");

      const paragraph = context.document.body.insertParagraph(namesStr, Word.InsertLocation.end);
      paragraph.font.color = "blue";

      await context.sync();
    });
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div className="ms-welcome">
        <Button
          className="ms-welcome__action"
          buttonType={ButtonType.hero}
          iconProps={{ iconName: "ChevronRight" }}
          onClick={this.click}
        >
          Insert all client names
        </Button>
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
