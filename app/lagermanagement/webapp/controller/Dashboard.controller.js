sap.ui.define(
  [
    "at/clouddna/lagermanagement/controller/BaseController",
    "sap/ui/model/json/JSONModel",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend(
      "at.clouddna.lagermanagement.controller.Dashboard",
      {
        onInit: function () {
          let oRouter = this.getRouter();
          oRouter
            .getRoute("Dashboard")
            .attachPatternMatched(this._onPatternMatched, this);

          oRouter
            .getRoute("RouteApp")
            .attachPatternMatched(this._onPatternMatched, this);
        },
        _onPatternMatched: function () {
          let aListOK = [],
            aListWarnung = [],
            aListMindBestU = [],
            Anzahl = 0,
            Mindestbestand = 0,
            Ergebnis = 0;
          $.get({
            url: `${
              this.getView().getModel().sServiceUrl
            }/Lagerbestand?$expand=produkt,lager`,
            success: (aData) => {
              aData.value.forEach((oLagerbestand) => {
                if (
                  oLagerbestand.menge < oLagerbestand.produkt.mindestbestand
                ) {
                  aListMindBestU.push(oLagerbestand);
                } else if (
                  oLagerbestand.menge < oLagerbestand.produkt.mengewarnung
                ) {
                  aListWarnung.push(oLagerbestand);
                } else {
                  aListOK.push(oLagerbestand);
                }
                Anzahl = Anzahl + oLagerbestand.menge;
                Mindestbestand =
                  Mindestbestand + oLagerbestand.produkt.mindestbestand;
              });
              let oValueColor = this.byId("idNumber").mProperties.valueColor;
              if (Anzahl < Mindestbestand) {
                oValueColor = "Error";
              } else if (Anzahl >= Mindestbestand) {
                oValueColor = "Good";
              }
              let oModel = new JSONModel({
                mindbest: aListMindBestU,
                warnung: aListWarnung,
                ok: aListOK,
                anzahl: Anzahl,
                valueColor: oValueColor,
              });
              this.getView().setModel(oModel, "lagerbestandModel");
            },
          });
        },

        onLagerortItemPressed: function (oEvent) {
          let oLagerID = oEvent.getSource();
          if (oLagerID.getBindingContext() != undefined) {
            oLagerID = oLagerID
              .getBindingContext()
              .getPath()
              .split("(")[1]
              .split(")")[0];
          } else {
            oLagerID = oLagerID
              .getBindingContext("lagerbestandModel")
              .getObject().lager_ID;
          }
          this.getOwnerComponent()
            .getRouter()
            .navTo("LagerProdukte", { lagerID: oLagerID });
        },

        onProduktItemPressed: function () {
          let oRouter = this.getRouter();
          oRouter.navTo("Produkte");
        },

        onLieferantItemPressed: function () {
          let oRouter = this.getRouter();
          oRouter.navTo("LieetOwnerComponent().ferant");
        },
        onBestellungItemPressed: function () {
          let oRouter = this.getRouter();
          oRouter.navTo("Bestellung");
        },
      }
    );
  }
);
