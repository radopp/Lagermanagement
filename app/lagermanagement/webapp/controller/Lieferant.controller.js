sap.ui.define(
  [
    "at/clouddna/lagermanagement/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    MessageBox,
    Filter,
    FilterOperator,
    FilterType,
    JSONModel,
    Spreadsheet
  ) {
    "use strict";

    return BaseController.extend(
      "at.clouddna.lagermanagement.controller.Lieferant",
      {
        onInit: function () {
          this.getView().setModel(
            new JSONModel({ productname: "" }),
            "filterModel"
          );
        },

        onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath();
          this.getRouter().navTo("LieferantBearbeiten", {
            ID: sPath.split("(")[1].split(")")[0],
          });
        },

        onCreatePressed: function () {
          this.getRouter().navTo("LieferantErstellen");
        },

        onDeleteButtonPressed: function (oEvent) {
          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(this.geti18nText("delete.Lieferant"), {
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
            label: this.geti18nText("lieferant.Lieferant"),
            property: "name",
          });

          let mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: this.geti18nText("menu.Lieferant"),
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagermanagement/Lieferanten`,
              serviceUrl: "",
            },
            fileName: this.geti18nText("menu.Lieferant") + ".xlsx",
          };
          let oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
