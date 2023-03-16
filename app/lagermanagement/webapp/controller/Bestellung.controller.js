sap.ui.define(
  [
    "at/clouddna/lagermanagement/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, MessageBox, JSONModel, Spreadsheet) {
    "use strict";

    return BaseController.extend(
      "at.clouddna.lagermanagement.controller.Bestellung",
      {
        onInit: function () {
          let oRouter = this.getRouter();
          oRouter
            .getRoute("Bestellung")
            .attachPatternMatched(this._onPatternMatched, this);
        },
        _onPatternMatched: function () {
          this.getModel()
            .bindContext("/Bestellungen", null, {
              $expand: "positionen($expand=produkt)",
            })
            .requestObject()
            .then((Data) => {
              this.getView().setModel(
                new JSONModel(Data.value),
                "bestellModel"
              );
            });
        },

        onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath(),
            oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("BestellungBearbeiten", {
            ID: sPath.split("(")[1].split(")")[0],
          });
        },

        onCreatePressed: function () {
          let oRouter = this.getRouter();
          oRouter.navTo("BestellungErstellen");
        },

        onDeleteButtonPressed: function (oEvent) {
          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(this.geti18nText("delete.Bestellung"), {
            title: this.geti18nText("delete.Delete"),
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            emphasizedAction: MessageBox.Action.YES,
            onClose: function (oAction) {
              if (MessageBox.Action.YES === oAction) {
                this.selectedBindngContext.delete().then(
                  function () {
                    this.getView().getModel().refresh();
                  }.bind(this)
                );
              }
            }.bind(this),
          });
        },

        toExcel: function () {
          let aColumns = [];
          aColumns.push({
            label: this.geti18nText("bestellung.Produkt"),
            property: "produkt/name",
          });
          aColumns.push({
            label: this.geti18nText("bestellung.Anzahl"),
            property: "anzahl",
          });
          aColumns.push({
            label: this.geti18nText("bestellung.Bestelldatum"),
            property: "bestellung/bestelldatum",
          });
          aColumns.push({
            label: this.geti18nText("bestellung.Lieferdatum"),
            property: "bestellung/lieferdatum",
          });

          let mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: this.geti18nText("menu.Bestellungen"),
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagermanagement/Bestellposition?$expand=bestellung,produkt`,
              serviceUrl: "",
            },
            fileName: this.geti18nText("menu.Bestellungen") + ".xlsx",
          };
          let oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
