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
      "at.clouddna.lagermanagement.controller.Lagerort",
      {
        onInit: function () {},

        onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath();
          this.getOwnerComponent()
            .getRouter()
            .navTo("LagerortBearbeiten", {
              ID: sPath.split("(")[1].split(")")[0],
            });
        },

        onCreatePressed: function () {
          this.getOwnerComponent().getRouter().navTo("LagerortErstellen");
        },

        onProduktePressed: function (oEvent) {
          let oLagerID = oEvent
            .getSource()
            .getBindingContext()
            .getPath()
            .split("(")[1]
            .split(")")[0];
          this.getOwnerComponent()
            .getRouter()
            .navTo("LagerProdukte", { lagerID: oLagerID });
        },

        onDeleteButtonPressed: function (oEvent) {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();

          MessageBox.warning(
            oResourceBundle.getText(
              "Wollen Sie ihren Eintrag wirklich löschen?"
            ),
            {
              title: oResourceBundle.getText("Delete"),
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              emphasizedAction: MessageBox.Action.YES,
              onClose: function (oAction) {
                if (MessageBox.Action.YES === oAction) {
                  oEvent
                    .getSource()
                    .getBindingContext()
                    .delete()
                    .then(
                      function () {
                        this.getView().getModel().refresh();
                      }.bind(this)
                    );
                }
              }.bind(this),
            }
          );
        },

        onDeleteButtonPressed: function (oEvent) {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();

          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(oResourceBundle.getText("delete.Lagerort"), {
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
          var aColumns = [];
          aColumns.push({
            label: "Produktname",
            property: "produkt/name",
          });
          aColumns.push({
            label: "Lager Anzahl",
            property: "lagerAnz",
          });
          aColumns.push({
            label: "Lagerort",
            property: "ort",
          });

          var mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: "Lagerort",
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagerverwaltung/Lagerort?$expand=produkt`,
              serviceUrl: "",
            },
            fileName: "Lagerort.xlsx",
          };
          var oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
