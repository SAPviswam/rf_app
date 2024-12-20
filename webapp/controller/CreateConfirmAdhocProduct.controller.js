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
                const { id, idI } = oEvent1.getParameter("arguments");
                this.ID = id;
                this.IDI = idI;
                console.log(this.ID);
            },
            onAvatarPressed_CCAP: function (oEvent) {
                this.onPressAvatarEveryTileHelperFunction(oEvent);

            },
            onSignoutPressed: function () {
                var oRouter = this.getOwnerComponent().getRouter(this);
                oRouter.navTo("InitialScreen", { Userid: this.IDI });
            },

            onSubmitAdhocProductBtnPress: function () {
                var oView = this.getView();
                var sProductnumber = oView.byId("1_CidProductInputCAP").getValue();

                // Convert the product number to uppercase and store it
                sProductnumber = sProductnumber.toUpperCase();
                this.sProductnumber = sProductnumber;

                // Check if the product number is provided, if not show a message
                if (!sProductnumber) {
                    sap.m.MessageToast.show("Please enter a ProductNumber");
                    return;
                }
                this.getView().byId("idInitialProductPage").setVisible(false)
                this.getView().byId("idsecondProductPage").setVisible(true)
                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idInitialAdhocProductbackbtn").setVisible(false);
                this.getView().byId("idproductInput1").setValue(sProductnumber);
            },
            onSecondSubmitBtnPress: function () {
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
            onThirdSubmitBtnPress:function() {
                this.getView().byId("idsecondProductPage").setVisible(false);
                this.getView().byId("idthirdProductPage").setVisible(false);
                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idProdutSecondbackbtn").setVisible(false);
                this.getView().byId("idfifthProductPage").setVisible(true)

            },
            onbackbuttonfromtablepress:function() {
                this.getView().byId("idsecondProductPage").setVisible(false);
                this.getView().byId("idthirdProductPage").setVisible(true);
                this.getView().byId("idProductfirstbackbtn").setVisible(true);
                this.getView().byId("idProdutSecondbackbtn").setVisible(false);
                this.getView().byId("idfifthProductPage").setVisible(false);
                this.getView().byId("idfourthProductPage").setVisible(false)

            },
            onProductdetailsBtnPress: function () {
                this.getView().byId("idfourthProductPage").setVisible(true);
                this.getView().byId("idthirdProductPage").setVisible(false);
                this.getView().byId("idProductthirdbackbtn").setVisible(true);
                this.getView().byId("idProdutSecondbackbtn").setVisible(false)
            },
            onProductthirdBackBtnPress: function () {
                this.getView().byId("idfourthProductPage").setVisible(false);
                this.getView().byId("idthirdProductPage").setVisible(true);
                this.getView().byId("idProductthirdbackbtn").setVisible(false);
                this.getView().byId("idProdutSecondbackbtn").setVisible(true)
            },
            onInitialAdhocProductBackBtnPress: async function () {
                var oRouter = UIComponent.getRouterFor(this);
                var oModel1 = this.getOwnerComponent().getModel();
                var that = this;
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser = oData.Users.toLowerCase()
                        if (oUser === "resource") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID, idI: that.IDI });
                        }
                        else {
                            oRouter.navTo("Supervisor", { id: this.ID, idI: that.IDI });
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
