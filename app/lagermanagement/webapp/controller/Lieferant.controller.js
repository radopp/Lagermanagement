sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
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
    Controller,
    MessageBox,
    Filter,
    FilterOperator,
    FilterType,
    JSONModel,
    Spreadsheet
  ) {
    "use strict";

    return Controller.extend(
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
          this.getOwnerComponent()
            .getRouter()
            .navTo("LieferantBearbeiten", {
              ID: sPath.split("(")[1].split(")")[0],
            });
        },

        onCreatePressed: function () {
          this.getOwnerComponent().getRouter().navTo("LieferantErstellen");
        },

        onDeleteButtonPressed: function (oEvent) {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();

          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(oResourceBundle.getText("delete.Lieferant"), {
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
            label: oResourceBundle.getText("lieferant.Lieferant"),
            property: "name",
          });

          let mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: oResourceBundle.getText("menu.Lieferant"),
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagermanagement/Lieferanten`,
              serviceUrl: "",
            },
            fileName: oResourceBundle.getText("menu.Lieferant") + ".xlsx",
          };
          let oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
