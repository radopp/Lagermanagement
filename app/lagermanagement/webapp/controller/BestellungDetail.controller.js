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
      "at.clouddna.lagermanagement.controller.BestellungDetail",
      {
        _fragmentList: {},
        bCreate: false,

        onInit: function () {
          let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          oRouter
            .getRoute("BestellungBearbeiten")
            .attachPatternMatched(this._onPatternMatchedDetail, this);

          oRouter
            .getRoute("BestellungErstellen")
            .attachPatternMatched(this._onPatternMatchedCreate, this);
        },

        _onPatternMatchedDetail: function (oEvent) {
          this.bCreate = false;
          let id = oEvent.getParameter("arguments").ID;
          if (id) {
            let sPath = "/Bestellungen(" + id + ")";
            this.getView().bindObject(sPath);
          }
          // let oModel = this.getView().setModel("bestellungModel");
          this._setFragement("BestellungBearbeiten");
        },

        _onPatternMatchedCreate: function (oEvent) {
          this.bCreate = true;
          this.getView().unbindElement();

          this._setFragement("BestellungErstellen");

          this.getView().setModel(
            new JSONModel({
              lieferdatum: new Date(),
              bestelldatum: new Date(),
              produkte: [
                {
                  produktid: "",
                  anzahl: 1,
                },
              ],
            }),
            "bestellungModel"
          );
        },

        _setFragement: function (sFragmentName) {
          let oPage = this.getView().byId("bestellung_page");
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

        onNewPressed: function () {
          let oModel = this.getView().getModel("bestellungModel"),
            aItems = oModel.getProperty("/produkte");

          aItems.push({
            produktid: "",
            anzahl: 1,
          });

          oModel.setProperty("/produkte", aItems);
        },

        onNavBack: function () {
          let oHistory = History.getInstance();
          let sPreviousHash = oHistory.getPreviousHash();

          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Bestellung");
          }
        },
        onEditPressed: function () {
          this._toggleEdit(true);
        },

        _toggleEdit: function (bEditMode) {
          let oEditModel = this.getView().getModel("editModel");

          oEditModel.setProperty("/editmode", bEditMode);

          this._showCustomerFragment(
            bEditMode ? "BestellungBearbeiten" : "BestellungDetails"
          );
        },

        onSavePressed: function () {
          let oModel = this.getView().getModel("bestellungModel"),
            oBestellung = {
              bestelldatum: this._formatDate(
                oModel.getProperty("/bestelldatum")
              ),
              lieferdatum: this._formatDate(oModel.getProperty("/lieferdatum")),
              //produktid: oModel.getProperty("/produkte"),
            };

          let oContext = this.getView()
              .getModel()
              .bindList("/Bestellungen")
              .create(oBestellung),
            oCreated;

          oContext
            .created()
            .then((oData, response) => {
              oContext;
              let aProdukteArray = [];

              oModel.getData().produkte.forEach((produkt) => {
                aProdukteArray.push();

                aProdukteArray.push(
                  this.getView()
                    .getModel()
                    .bindList("/Bestellposition")
                    .create({
                      produkt_ID: produkt.name,
                      anzahl: produkt.anzahl,
                      bestellung_ID: oContext.getProperty("ID"),
                    })
                    .created()
                );

                Promise.all(aProdukteArray).then(() => {
                  this.onNavBack();
                  this.getView().getModel().refresh();
                });
              });
            })
            .catch((oError) => {})
            .finally(() => {});
        },

        _formatDate: function (oDate) {
          const offset = oDate.getTimezoneOffset();
          oDate = new Date(oDate.getTime() - offset * 60 * 1000);
          return oDate.toISOString().split("T")[0];
        },
      }
    );
  }
);
