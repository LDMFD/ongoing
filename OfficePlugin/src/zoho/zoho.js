import axios from "axios";

const ACCOUNT = "";
const APP = "";
const URL = "";
const SECRET = "";

export function getReport(report) {
  const options = {
    headers: {
      "X-Ongoing-Account": ACCOUNT,
      "X-Ongoing-App": APP,
      "X-Ongoing-Secret": SECRET,
    },
  };

  let query = new FormData();
  query.append("report", report);

  return axios
    .post(`http://${URL}:8080`, query, options)
    .then(function (response) {
      console.log("response", response.statusText);

      if (response.data.data) {
        return response.data.data;
        // console.log(JSON.stringify(response.data.data));
      } else {
        console.log("no data returned");
      }
    })
    .catch(function (error) {
      console.log("error", error);
    });
}
