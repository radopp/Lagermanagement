sap.ui.define(
  [
    "at/clouddna/lagermanagement/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, MessageBox, Spreadsheet) {
    "use strict";

    return BaseController.extend(
      "at.clouddna.lagermanagement.controller.Lagerort",
      {
        onInit: function () {},

        onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath();
          this.getRouter().navTo("LagerortBearbeiten", {
            ID: sPath.split("(")[1].split(")")[0],
          });
        },

        onCreatePressed: function () {
          this.getRouter().navTo("LagerortErstellen");
        },

        onProduktePressed: function (oEvent) {
          let oLagerID = oEvent
            .getSource()
            .getBindingContext()
            .getPath()
            .split("(")[1]
            .split(")")[0];
          this.getRouter().navTo("LagerProdukte", { lagerID: oLagerID });
        },

        onDeleteButtonPressed: function (oEvent) {
          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(this.geti18nText("delete.Lagerort"), {
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
            property: "name",
          });
          aColumns.push({
            label: this.geti18nText("lagerort.Lagerort"),
            property: "ort",
          });

          let mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: this.geti18nText("menu.Lagerorte"),
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagermanagement/Lager`,
              serviceUrl: "",
            },
            fileName: this.geti18nText("menu.Lagerorte") + ".xlsx",
          };
          let oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
