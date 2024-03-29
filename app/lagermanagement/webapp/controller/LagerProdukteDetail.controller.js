sap.ui.define(
  [
    "at/clouddna/lagermanagement/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, History, JSONModel, Fragment) {
    "use strict";

    return BaseController.extend(
      "at.clouddna.lagermanagement.controller.LagerProdukteDetail",
      {
        _fragmentList: {},
        _bCreate: false,

        onInit: function () {
          let oRouter = this.getRouter();
          oRouter
            .getRoute("LagerProdukteBearbeiten")
            .attachPatternMatched(this._onPatternMatchedDetail, this);

          oRouter
            .getRoute("LagerProdukteErstellen")
            .attachPatternMatched(this._onPatternMatchedCreate, this);
        },

        _onPatternMatchedDetail: function (oEvent) {
          this._bCreate = false;
          let id = oEvent.getParameter("arguments").ID;
          if (id) {
            let sPath = "/Lagerbestand(" + id + ")";
            this.getView().bindObject(sPath);
          }

          this._setFragement("LagerProdukteBearbeiten");
        },

        _onPatternMatchedCreate: function (oEvent) {
          this._bCreate = true;
          let lagerID = oEvent.getParameter("arguments").lagerID;
          this.getModel()
            .bindContext("/Lager(" + lagerID + ")")
            .requestObject()
            .then((Data) => {
              this.getView().setModel(new JSONModel(Data), "lagerModel");
            });
          this.getView().unbindElement();

          let oContext = this.getModel()
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
