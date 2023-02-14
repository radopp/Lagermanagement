sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/m/MessageBox",
      "sap/ui/model/Sorter",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/model/FilterType",
      "sap/ui/model/json/JSONModel",
      "sap/ui/unified/DateRange",
      "sap/ui/core/format/DateFormat",
      "sap/ui/core/library",
      "sap/ui/export/Spreadsheet"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
      Controller,
      MessageBox,
      Sorter,
      Filter,
      FilterOperator,
      FilterType,
      JSONModel,
      DateRange,
      DateFormat,
      coreLibrary,
      Spreadsheet,
    ) {
      "use strict";
  
      return Controller.extend("at.clouddna.lagermanagement.controller.Lagerort", {
        onInit: function () {
        },
  
        onListItemPressed: function (oEvent) {
          let sPath = oEvent.getSource().getBindingContext().getPath();
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("LagerortBearbeiten", {
            ID: sPath.split("(")[1].split(")")[0],
          });
        },

        onCreatePressed: function () {
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("LagerortErstellen");
        },

        onProduktePressed: function () {
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("LagerProdukte");
        },
  
        onDeleteButtonPressed: function (oEvent) {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
  
          let oSource = oEvent.getSource();
          let sPath = oSource.getBindingContext().getPath();
          this.selectedBindngContext = oSource.getBindingContext();
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
                  this.selectedBindngContext.delete().then(
                    function () {
                      this.getView().getModel().refresh();
                    }.bind(this)
                  );
                }
              }.bind(this),
            }
          );
        },
        toExcel: function () {
          var aColumns = [];
          aColumns.push({
              label: "Produktname",
              property: "produkt/name"
          });
          aColumns.push({
              label: "Lager Anzahl",
              property: "lagerAnz"
          });
          aColumns.push({
              label: "Lagerort",
              property: "ort"
          });
        
          var mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: 'Debug Test Application',
                version: '1.105.0',
                title: 'Lagerort',
              },
              hierarchyLevel: 'level'
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagerverwaltung/Lagerort?$expand=produkt`,
              serviceUrl: ""
            },
            fileName: "Lagerort.xlsx"
          };
          var oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      });
    }
  );