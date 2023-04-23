import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { OFFLINE_AUTH } from "App";

function SendSignInLink(email) {
    if (OFFLINE_AUTH) {
        alert("Auth: would send email to", email);
        return;
    }
    const actionCodeSettings = {
        url: window.Config.DashboardHost,
        handleCodeInApp: true
    };
    const auth = getAuth();

    sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
        alert("Email sent");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(`${errorCode}, ${errorMessage}`);
    });
}

export default SendSignInLink;
