import "../css/variables.scss";
import "../css/base.scss";
import "../css/header.scss";
import "../css/sonic.scss";
import SonicApp from "./sonic/app";

window.onload = function () {
    if (document.getElementsByClassName("sonic-app").length) {
        let sonicApp = new SonicApp(document.getElementsByClassName("sonic-app")[0]);
        sonicApp.init();
    }
};
