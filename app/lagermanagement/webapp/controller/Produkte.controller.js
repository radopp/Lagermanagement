sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
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
          this.getOwnerComponent()
            .getRouter()
            .navTo("ProdukteBearbeiten", {
              ID: sPath.split("(")[1].split(")")[0],
            });
        },

        onCreatePressed: function () {
          this.getOwnerComponent().getRouter().navTo("ProdukteErstellen");
        },

        onDeleteButtonPressed: function (oEvent) {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();

          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(oResourceBundle.getText("delete.Produkt"), {
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
            label: oResourceBundle.getText("produkte.Produkt"),
            property: "name",
          });
          aColumns.push({
            label: oResourceBundle.getText("produkte.Produktbeschreibung"),
            property: "beschreibung",
          });
          aColumns.push({
            label: oResourceBundle.getText("produkte.Preis"),
            property: "preis",
          });
          aColumns.push({
            label: oResourceBundle.getText("produkte.Mindestbestand"),
            property: "mindestbestand",
          });
          aColumns.push({
            label: oResourceBundle.getText("produkte.Mengeok"),
            property: "mengeok",
          });
          aColumns.push({
            label: oResourceBundle.getText("produkte.Mengewarnung"),
            property: "mengewarnung",
          });
          aColumns.push({
            label: oResourceBundle.getText("produkte.Lieferanten"),
            property: "lieferant/name",
          });

          let mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: oResourceBundle.getText("menu.Produkte"),
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagermanagement/Produkte?$expand=lieferant`,
              serviceUrl: "",
            },
            fileName: oResourceBundle.getText("menu.Produkte") + ".xlsx",
          };
          let oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
