sap.ui.define(
  [
    "at/clouddna/lagermanagement/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, Spreadsheet) {
    "use strict";

    return Controller.extend(
      "at.clouddna.lagermanagement.controller.Produkte",
      {
        onInit: function () {},

        onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath();
          this.getRouter().navTo("ProdukteBearbeiten", {
            ID: sPath.split("(")[1].split(")")[0],
          });
        },

        onCreatePressed: function () {
          this.getRouter().navTo("ProdukteErstellen");
        },

        onDeleteButtonPressed: function (oEvent) {
          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(this.geti18nText("delete.Produkt"), {
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
            label: this.geti18nText("produkte.Produkt"),
            property: "name",
          });
          aColumns.push({
            label: this.geti18nText("produkte.Produktbeschreibung"),
            property: "beschreibung",
          });
          aColumns.push({
            label: this.geti18nText("produkte.Preis"),
            property: "preis",
          });
          aColumns.push({
            label: this.geti18nText("produkte.Mindestbestand"),
            property: "mindestbestand",
          });
          aColumns.push({
            label: this.geti18nText("produkte.Mengeok"),
            property: "mengeok",
          });
          aColumns.push({
            label: this.geti18nText("produkte.Mengewarnung"),
            property: "mengewarnung",
          });
          aColumns.push({
            label: this.geti18nText("produkte.Lieferanten"),
            property: "lieferant/name",
          });

          let mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: this.geti18nText("menu.Produkte"),
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagermanagement/Produkte?$expand=lieferant`,
              serviceUrl: "",
            },
            fileName: this.geti18nText("menu.Produkte") + ".xlsx",
          };
          let oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
