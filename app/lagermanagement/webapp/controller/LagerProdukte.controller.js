sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, Filter, FilterOperator, Spreadsheet) {
    "use strict";

    return Controller.extend(
      "at.clouddna.lagermanagement.controller.LagerProdukte",
      {
        onInit: function () {
          let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("LagerProdukte")
            .attachPatternMatched(this.onPatternMatched, this);
        },

        onPatternMatched: function (oEvent) {
          this.oLagerID = oEvent.getParameter("arguments").lagerID;
          this.getView()
            .byId("produkte_table")
            .getBinding("items")
            .filter(new Filter("lager_ID", FilterOperator.EQ, this.oLagerID));
        },

        onCreatePressed: function () {
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("LagerProdukteErstellen", { lagerID: this.oLagerID });
        },

        onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath();
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("LagerProdukteBearbeiten", {
            ID: sPath.split("(")[1].split(")")[0],
          });
        },

        onDeleteButtonPressed: function (oEvent) {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();

          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(oResourceBundle.getText("delete.LagerProdukt"), {
            title: oResourceBundle.getText("delete.Delete"),
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
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();

          let aColumns = [];
          aColumns.push({
            label: oResourceBundle.getText("lagerort.LagerName"),
            property: "lager/name",
          });
          aColumns.push({
            label: oResourceBundle.getText("lagerort.Lagerort"),
            property: "lager/ort",
          });
          aColumns.push({
            label: oResourceBundle.getText("lagerort.Produkt"),
            property: "produkt/name",
          });
          aColumns.push({
            label: oResourceBundle.getText("lagerort.Anzahl"),
            property: "menge",
          });

          let mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: oResourceBundle.getText("lagerort.ProdukteImLager"),
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagermanagement/Lagerbestand?$expand=lager,produkt`,
              serviceUrl: "",
            },
            fileName:
              oResourceBundle.getText("lagerort.ProdukteImLager") + ".xlsx",
          };
          let oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
