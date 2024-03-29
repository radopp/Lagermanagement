sap.ui.define(
  ["at/clouddna/lagermanagement/controller/BaseController"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController) {
    "use strict";

    return BaseController.extend("at.clouddna.lagermanagement.controller.App", {
      onInit: function () {},
      onListItemPressed: function (oEvent) {
        let oRouter = this.getRouter(),
          sID = oEvent.getParameters().listItem.getId();

        switch (true) {
          case sID.includes("produkte_ID"):
            oRouter.navTo("Produkte");
            break;
          case sID.includes("lieferant_ID"):
            oRouter.navTo("Lieferant");
            break;
          case sID.includes("lagerorte_ID"):
            oRouter.navTo("Lagerort");
            break;
          case sID.includes("bestellungen_ID"):
            oRouter.navTo("Bestellung");
            break;
          default:
            oRouter.navTo("Dashboard");
            break;
        }
      },
    });
  }
);
