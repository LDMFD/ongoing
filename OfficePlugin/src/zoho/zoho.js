import axios from "axios";

const ACCOUNT = "zoho_paul1886";
const APP = "ongoing-suitability";
const URL = "https://ndsvlr9sv4.execute-api.us-east-1.amazonaws.com/ongoing-prod/ongoing-gateway";
const SECRET = "4502a7a2fbcb11eb9d54df6f79480ef2";

export function ZohoRequest(objectType, objectName) {
  const options = {
    headers: {
      "X-Ongoing-Account": ACCOUNT,
      "X-Ongoing-App": APP,
      "X-Ongoing-Secret": SECRET,
    },
  };

  let query = new FormData();
  query.append(objectType, objectName);

  console.log(`Fetching ${query}`);

  return axios
    .post(URL, query, options)
    .then(function (response) {
      console.log("response", response);

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
