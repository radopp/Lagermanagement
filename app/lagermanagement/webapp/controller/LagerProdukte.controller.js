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
    "sap/ui/export/Spreadsheet",
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
    Spreadsheet
  ) {
    "use strict";

    return Controller.extend(
      "at.clouddna.lagermanagement.controller.LagerProdukte",
      {
        onInit: function () {},

        onCreatePressed: function () {
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("LagerProdukteErstellen");
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
          MessageBox.warning(
            oResourceBundle.getText(
              "Wollen Sie den Lager Eintrag wirklich löschen?"
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

        //   onFilter : function(){
        //     let oModel =this.getView().getModel("filterModel");
        //     let oFilterData = oModel.getData();
        //     let aFilters = [];
        //     if(oFilterData.productname != null && oFilterData.productname != ""){
        //       aFilters.push(
        //         new Filter("produkt/name", FilterOperator.EQ, oFilterData.productname)
        //       );
        //     }

        //     this.getView().byId("lieferungen_table").getBinding("items").filter(aFilters, FilterType.Application);
        //   },
      }
    );
  }
);
