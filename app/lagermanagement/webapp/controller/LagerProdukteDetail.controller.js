sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/base/Log",
    "sap/m/MessageBox",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, History, JSONModel, Fragment, Log, MessageBox) {
    "use strict";

    return Controller.extend(
      "at.clouddna.lagermanagement.controller.LagerProdukteDetail",
      {
        _fragmentList: {},
        bCreate: false,

        onInit: function () {
          let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("LagerProdukteBearbeiten")
            .attachPatternMatched(this._onPatternMatchedDetail, this);

          oRouter
            .getRoute("LagerProdukteErstellen")
            .attachPatternMatched(this._onPatternMatchedCreate, this);
        },

        _onPatternMatchedDetail: function (oEvent) {
          this.bCreate = false;
          let id = oEvent.getParameter("arguments").ID;
          if (id) {
            let sPath = "/Lagerbestand(" + id + ")";
            this.getView().bindObject(sPath);
          }

          this._setFragement("LagerProdukteBearbeiten");
        },

        _onPatternMatchedCreate: function (oEvent) {
          this.bCreate = true;
          let lagerID = oEvent.getParameter("arguments").lagerID;
          this.getView()
            .getModel()
            .bindContext("/Lager(" + lagerID + ")")
            .requestObject()
            .then((Data) => {
              this.getView().setModel(new JSONModel(Data), "lagerModel");
            });
          this.getView().unbindElement();

          let oContext = this.getView()
            .getModel()
            .bindList("/Lagerbestand")
            .create({ lager_ID: lagerID }, undefined, undefined, true);
          this._setFragement("LagerProdukteErstellen");
          this.getView().setBindingContext(oContext);
        },

        _setFragement: function (sFragmentName) {
          let oPage = this.getView().byId("lagerProdukte_page");
          oPage.removeAllContent();
          if (this._fragmentList[sFragmentName]) {
            oPage.insertContent(this._fragmentList[sFragmentName]);
          } else {
            Fragment.load({
              id: this.getView().createId(sFragmentName),
              name:
                "at.clouddna.lagermanagement.view.fragment." + sFragmentName,
              controller: this,
            }).then(
              function (oFragment) {
                this._fragmentList[sFragmentName] = oFragment;
                oPage.insertContent(this._fragmentList[sFragmentName]);
              }.bind(this)
            );
          }
        },

        onNavBack: function () {
          let oHistory = History.getInstance();
          let sPreviousHash = oHistory.getPreviousHash();

          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("LagerProdukte");
          }
        },
        onEditPressed: function () {
          this._toggleEdit(true);
        },

        _toggleEdit: function (bEditMode) {
          let oEditModel = this.getView().getModel("editModel");

          oEditModel.setProperty("/editmode", bEditMode);

          this._showCustomerFragment(
            bEditMode ? "LagerProdukteBearbeiten" : "LagerProdukteDetails"
          );
        },

        onSavePressed: function () {
          this.onNavBack();
          this.getView().getModel().refresh();
        },
      }
    );
  }
);
