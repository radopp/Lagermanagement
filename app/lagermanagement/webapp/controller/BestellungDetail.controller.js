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
            let sPath = "/Bestellposition(" + id + ")";
            this.getView().bindObject(sPath);
          }
          let oModel = this.getView().setModel("bestellModel");
          console.log(oModel);
          debugger;
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

          debugger;

          oContext
            .created()
            .then((oData, response) => {
              debugger;
              oContext;
              let aProdukteArray = [];

              oModel.getData().produkte.forEach((produkt) => {
                aProdukteArray.push();

                aProdukteArray.push(
                  this.getView()
                    .getModel()
                    .bindList("/Bestellposition")
                    .create({
                      produkt_ID: produkt.produkte,
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
            .catch((oError) => {
              debugger;
            })
            .finally(() => {
              debugger;
            });
        },

        onDeleteButtonPressed: function (oEvent) {
          debugger;
          let oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
          let iSelectedIndex = parseInt(
            oEvent
              .getParameters()
              .listItem.getBindingContextPath("bestellungModel")
              .split("/")
              .pop()
          );
          let oSource = oEvent.getSource();

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
                  let oModel = this.getView().getModel("bestellungModel");
                  let produkte = oModel.getProperty("/produkte");
                  produkte.splice(iSelectedIndex, 1);
                  oModel.setProperty("/produkte", produkte);
                }
              }.bind(this),
            }
          );
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

// sap.ui.define(
//   [
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/core/routing/History",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/core/Fragment",
//     "sap/base/Log",
//     "sap/m/MessageBox",
//   ],
//   /**
//    * @param {typeof sap.ui.core.mvc.Controller} Controller
//    */
//   function (Controller, History, JSONModel, Fragment, Log, MessageBox) {
//     "use strict";

//     return Controller.extend(
//       "at.clouddna.lagermanagement.controller.BestellungDetail",
//       {
//         _fragmentList: {},
//         bCreate: false,

//         onInit: function () {
//           let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
//           // oRouter
//           //   .getRoute("BestellungBearbeiten")
//           //   .attachPatternMatched(this._onPatternMatchedDetail, this);

//           oRouter
//             .getRoute("BestellungErstellen")
//             .attachPatternMatched(this._onPatternMatchedCreate, this);
//         },

//         _onPatternMatchedDetail: function (oEvent) {
//           this.bCreate = false;
//           let id = oEvent.getParameter("arguments").ID;
//           if (id) {
//             let sPath = "/Bestellposition(" + id + ")";
//             this.getView().bindObject(sPath);
//           }

//           this._setFragement("BestellungBearbeiten");
//         },

//         _onPatternMatchedCreate: function (oEvent) {
//           this.bCreate = true;
//           this.getView().unbindElement();
//           let oContext = this.getView()
//             .getModel()
//             .bindList("/Bestellposition")
//             .create(undefined, undefined, undefined, true);
//           this._setFragement("BestellungErstellen");
//           this.getView().setBindingContext(oContext);
//         },

//         // onNewPressed: function () {
//         //   let oModel = this.getView().getModel("bestellungModel"),
//         //     aItems = oModel.getProperty("/produkte");

//         //   aItems.push({
//         //     produktid: "",
//         //     anzahl: 1,
//         //   });

//         //   oModel.setProperty("/produkte", aItems);
//         // },

//         _setFragement: function (sFragmentName) {
//           let oPage = this.getView().byId("bestellung_page");
//           oPage.removeAllContent();
//           if (this._fragmentList[sFragmentName]) {
//             oPage.insertContent(this._fragmentList[sFragmentName]);
//           } else {
//             Fragment.load({
//               id: this.getView().createId(sFragmentName),
//               name:
//                 "at.clouddna.lagermanagement.view.fragment." + sFragmentName,
//               controller: this,
//             }).then(
//               function (oFragment) {
//                 this._fragmentList[sFragmentName] = oFragment;
//                 oPage.insertContent(this._fragmentList[sFragmentName]);
//               }.bind(this)
//             );
//           }
//         },

//         onNavBack: function () {
//           let oHistory = History.getInstance();
//           let sPreviousHash = oHistory.getPreviousHash();

//           if (sPreviousHash !== undefined) {
//             window.history.go(-1);
//           } else {
//             let oRouter = this.getOwnerComponent().getRouter();
//             oRouter.navTo("Bestellung");
//           }
//         },
//         onEditPressed: function () {
//           this._toggleEdit(true);
//         },

//         _toggleEdit: function (bEditMode) {
//           let oEditModel = this.getView().getModel("editModel");

//           oEditModel.setProperty("/editmode", bEditMode);

//           this._showCustomerFragment(
//             bEditMode ? "BestellungBearbeiten" : "BestellungDetails"
//           );
//         },

//         onSavePressed: function () {
//           this.onNavBack();
//           this.getView().getModel().refresh();
//         },

//         onDeleteButtonPressed: function (oEvent) {
//           let oResourceBundle = this.getView()
//             .getModel("i18n")
//             .getResourceBundle();

//           this.selectedBindngContext = oEvent.getSource().getBindingContext();
//           MessageBox.warning(
//             oResourceBundle.getText(
//               "Wollen Sie die Bestellung wirklich löschen?"
//             ),
//             {
//               title: oResourceBundle.getText("Delete"),
//               actions: [MessageBox.Action.YES, MessageBox.Action.NO],
//               emphasizedAction: MessageBox.Action.YES,
//               onClose: function (oAction) {
//                 if (MessageBox.Action.YES === oAction) {
//                   this.selectedBindngContext.delete().then(
//                     function () {
//                       this.getView().getModel().refresh();
//                     }.bind(this)
//                   );
//                 }
//               }.bind(this),
//             }
//           );
//         },
//       }
//     );
//   }
// );
