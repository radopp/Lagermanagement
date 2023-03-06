sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, JSONModel, Spreadsheet) {
    "use strict";

    return Controller.extend(
      "at.clouddna.lagermanagement.controller.Bestellung",
      {
        onInit: function () {
          let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("Bestellung")
            .attachPatternMatched(this._onPatternMatched, this);
        },
        _onPatternMatched: function () {
          this.getView()
            .getModel()
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
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("BestellungErstellen");
        },

        onDeleteButtonPressed: function (oEvent) {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();

          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(oResourceBundle.getText("delete.Bestellung"), {
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

        // toExcel: function () {
        //   let oResourceBundle = this.getView()
        //     .getModel("i18n")
        //     .getResourceBundle();

        //   let aColumns = [];
        //   aColumns.push({
        //     label: oResourceBundle.getText("bestellung.Produkt"),
        //     property: "positionen/name",
        //   });
        //   aColumns.push({
        //     label: oResourceBundle.getText("bestellung.Anzahl"),
        //     property: "positionen/anzahl",
        //   });
        //   aColumns.push({
        //     label: oResourceBundle.getText("bestellung.Bestelldatum"),
        //     property: "bestelldatum",
        //   });
        //   aColumns.push({
        //     label: oResourceBundle.getText("bestellung.Lieferdatum"),
        //     property: "lieferdatum",
        //   });

        //   let mSettings = {
        //     workbook: {
        //       columns: aColumns,
        //       context: {
        //         application: "Debug Test Application",
        //         version: "1.105.0",
        //         title: oResourceBundle.getText("menu.Bestellungen"),
        //       },
        //       hierarchyLevel: "level",
        //     },
        //     dataSource: {
        //       type: "odata",
        //       dataUrl: `/Lagermanagement/Bestellungen?$expand=positionen`,
        //       serviceUrl: "",
        //     },
        //     fileName: oResourceBundle.getText("menu.Bestellungen") + ".xlsx",
        //   };
        //   let oSpreadsheet = new Spreadsheet(mSettings);
        //   oSpreadsheet.build();
        // },

        toExcel: function () {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();

          let aColumns = [];
          aColumns.push({
            label: oResourceBundle.getText("bestellung.Produkt"),
            property: "produkt/name",
          });
          aColumns.push({
            label: oResourceBundle.getText("bestellung.Anzahl"),
            property: "anzahl",
          });
          aColumns.push({
            label: oResourceBundle.getText("bestellung.Bestelldatum"),
            property: "bestellung/bestelldatum",
          });
          aColumns.push({
            label: oResourceBundle.getText("bestellung.Lieferdatum"),
            property: "bestellung/lieferdatum",
          });

          let mSettings = {
            workbook: {
              columns: aColumns,
              context: {
                application: "Debug Test Application",
                version: "1.105.0",
                title: oResourceBundle.getText("menu.Bestellungen"),
              },
              hierarchyLevel: "level",
            },
            dataSource: {
              type: "odata",
              dataUrl: `/Lagermanagement/Bestellposition?$expand=bestellung,produkt`,
              serviceUrl: "",
            },
            fileName: oResourceBundle.getText("menu.Bestellungen") + ".xlsx",
          };
          let oSpreadsheet = new Spreadsheet(mSettings);
          oSpreadsheet.build();
        },
      }
    );
  }
);
