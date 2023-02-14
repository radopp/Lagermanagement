sap.ui.define(
  ["sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend(
      "at.clouddna.lagermanagement.controller.KaufProdukt",
      {
        onInit: function () {
        let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("LagerortErstellen")
            .attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched: function (oEvent) {
          this.bCreate = true;
          this.getView().unbindElement();
          let oContext = this.getView()
            .getModel()
            .bindList("/Bestellposition")
            .create(undefined, undefined, undefined, true);
          this.getView().setBindingContext(oContext);
        },

        onNavBack: function () {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("BestellungErstellen");
        },
        onEditPressed: function () {
          this._toggleEdit(true);
        },

        onSavePressed: function () {
          this.onNavBack();
          this.getView().getModel().refresh();
        },
      }
    );
  }
);
