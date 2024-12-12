sap.ui.define(
    [
        "./BaseController",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent"
    ],
    function (BaseController, MessageToast, UIComponent) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.CreateConfirmAdhocProduct", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: function (oEvent1) {
                var that = this;
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
                this.applyStoredProfileImage();
            },
            onPressAvatarCCAP: function (oEvent) {
                this.onPressAvatarEveryTileHelperFunction(oEvent);
              },
            onSubmitAdhocProductBtnPress: function () {
                this.getView().byId("idInitialProductPage").setVisible(false)
                this.getView().byId("idsecondProductPage").setVisible(true)
                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idInitialAdhocProductbackbtn").setVisible(false);
            },
            onProductSrcLiveChange: function () {
                this.getView().byId("idthirdProductPage").setVisible(true);
                this.getView().byId("idsecondProductPage").setVisible(false);
                this.getView().byId("idProdutSecondbackbtn").setVisible(true);
                this.getView().byId("idProductfirstbackbtn").setVisible(false);
            },
            onProductfirstBackBtnPress: function () {
                this.getView().byId("idInitialProductPage").setVisible(true);
                this.getView().byId("idsecondProductPage").setVisible(false);
                this.getView().byId("idProductfirstbackbtn").setVisible(false);
                this.getView().byId("idInitialAdhocProductbackbtn").setVisible(true);
            },
            onProductSecondBackBtnPress: function () {
                this.getView().byId("idsecondProductPage").setVisible(true);
                this.getView().byId("idthirdProductPage").setVisible(false);
                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idProdutSecondbackbtn").setVisible(false)
            },
            onProductdetailsBtnPress: function(){
                this.getView().byId("idfourthProductPage").setVisible(true);
                this.getView().byId("idthirdProductPage").setVisible(false);
                this.getView().byId("idProductthirdbackbtn").setVisible(true);
                this.getView().byId("idProdutSecondbackbtn").setVisible(false)
            },
            onProductthirdBackBtnPress :function(){
                this.getView().byId("idfourthProductPage").setVisible(false);
                this.getView().byId("idthirdProductPage").setVisible(true);
                this.getView().byId("idProductthirdbackbtn").setVisible(false);
                this.getView().byId("idProdutSecondbackbtn").setVisible(true)
            },
            onInitialAdhocProductBackBtnPress: async function () {
                var oRouter = UIComponent.getRouterFor(this);
                var oModel1 = this.getOwnerComponent().getModel();
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser = oData.Users.toLowerCase()
                        if (oUser === "resource") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID});
                        }
                        else {
                            oRouter.navTo("Supervisor", { id: this.ID});
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
            },

        });
    }
);
