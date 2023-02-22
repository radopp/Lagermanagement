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
      "at.clouddna.lagermanagement.controller.LagerortDetail",
      {
        _fragmentList: {},
        bCreate: false,

        onInit: function () {
          let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("LagerortBearbeiten")
            .attachPatternMatched(this._onPatternMatchedDetail, this);

          oRouter
            .getRoute("LagerortErstellen")
            .attachPatternMatched(this._onPatternMatchedCreate, this);
        },

        _onPatternMatchedDetail: function (oEvent) {
          this.bCreate = false;
          let id = oEvent.getParameter("arguments").ID;
          if (id) {
            let sPath = "/Lager(" + id + ")";
            this.getView().bindObject(sPath);
          }

          this._setFragement("LagerortBearbeiten");
        },

        _onPatternMatchedCreate: function (oEvent) {
          this.bCreate = true;
          this.getView().unbindElement();
          let oContext = this.getView()
            .getModel()
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

        onNavBack: function () {
          let oHistory = History.getInstance();
          let sPreviousHash = oHistory.getPreviousHash();

          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Lager");
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

        onDeleteButtonPressed: function (oEvent) {
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();

          this.selectedBindngContext = oEvent.getSource().getBindingContext();
          MessageBox.warning(
            oResourceBundle.getText(
              "Wollen SIe den LAgerort wirklich löschen?"
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
      }
    );
  }
);
