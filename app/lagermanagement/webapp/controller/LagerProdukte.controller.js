sap.ui.define(
  [
    "at/clouddna/lagermanagement/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, MessageBox, Filter, FilterOperator, Spreadsheet) {
    "use strict";

    return BaseController.extend(
      "at.clouddna.lagermanagement.controller.LagerProdukte",
      {
        onInit: function () {
          let oRouter = this.getRouter();
          oRouter
            .getRoute("LagerProdukte")
            .attachPatternMatched(this.onPatternMatched, this);
        },

        onPatternMatched: function (oEvent) {
          this.oLagerID = oEvent.getParameter("arguments").lagerID;
          this.getView()
            .byId("LagerProdukte_table")
            .getBinding("items")
            .filter(new Filter("lager_ID", FilterOperator.EQ, this.oLagerID));
        },

        onCreatePressed: function () {
          let oRouter = this.getRouter();
          oRouter.navTo("LagerProdukteErstellen", { lagerID: this.oLagerID });
        },

        onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath();
          let oRouter = this.getRouter();
          oRouter.navTo("LagerProdukteBearbeiten", {
            ID: sPath.split("(")[1].split(")")[0],
          });
        },

        onDeleteButtonPressed: function (oEvent) {
          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(this.geti18nText("delete.LagerProdukt"), {
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
            label: this.geti18nText("lagerort.LagerName"),
            property: "lager/name",
          });
          aColumns.push({
            label: this.geti18nText("lagerort.Lagerort"),
            property: "lager/ort",
          });
          aColumns.push({
            label: this.geti18nText("lagerort.Produkt"),
            property: "produkt/name",
          });
          aColumns.push({
            label: this.geti18nText("lagerort.Anzahl"),
            property: "menge",
          });

          let mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: this.geti18nText("lagerort.ProdukteImLager"),
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagermanagement/Lagerbestand?$expand=lager,produkt`,
              serviceUrl: "",
            },
            fileName: this.geti18nText("lagerort.ProdukteImLager") + ".xlsx",
          };
          let oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
