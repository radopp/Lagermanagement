sap.ui.define(
  [
    "at/clouddna/lagermanagement/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/base/Log",
    "sap/m/MessageBox",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, History, JSONModel, Fragment, Log, MessageBox) {
    "use strict";

    return BaseController.extend(
      "at.clouddna.lagermanagement.controller.LagerortDetail",
      {
        _fragmentList: {},
        _bCreate: false,

        onInit: function () {
          let oRouter = this.getRouter();
          oRouter
            .getRoute("LagerortBearbeiten")
            .attachPatternMatched(this._onPatternMatchedDetail, this);

          oRouter
            .getRoute("LagerortErstellen")
            .attachPatternMatched(this._onPatternMatchedCreate, this);
        },

        _onPatternMatchedDetail: function (oEvent) {
          this._bCreate = false;
          let id = oEvent.getParameter("arguments").ID;
          if (id) {
            let sPath = "/Lager(" + id + ")";
            this.getView().bindObject(sPath);
          }

          this._setFragement("LagerortBearbeiten");
        },

        _onPatternMatchedCreate: function (oEvent) {
          this._bCreate = true;
          this.getView().unbindElement();
          let oContext = this.getModel()
            .bindList("/Lager")
            .create(undefined, undefined, undefined, true);
          this._setFragement("LagerortErstellen");
          this.getView().setBindingContext(oContext);
        },

        _setFragement: function (sFragmentName) {
          let oPage = this.getView().byId("lagerort_page");
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
            bEditMode ? "LagerBearbeiten" : "LagerDetails"
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
