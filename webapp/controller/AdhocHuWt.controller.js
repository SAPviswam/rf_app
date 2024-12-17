sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/Device"
],
    function (Controller,MessageToast,UIComponent,Device) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.AdhocHuWt", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
                if (Device.system.phone) {
                    this.getView().byId("idTitle_CAHU").addStyleClass("titleMobile");
                }
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id,idI } = oEvent1.getParameter("arguments");
                this.ID = id;
                this.IDI=idI;
            },

            onLiveChange: function () { 
                //   if(this.getView().byId("idHuInput_CAHU").getValue()=="800020"){
                this.getView().byId("idFirstSc_CAHU").setVisible(false)
                this.getView().byId("idsecondSc_CAHU").setVisible(true)
                var ohu = this.getView().byId("idHuInput_CAHU").getValue();
                this.getView().byId("idSecSCHuInput_CAHU").setValue(ohu)
                this.getView().byId("idSecSCHuInput_CAHU").setEditable(false);
            },

            onPressSubmitbtn: function () {
                debugger;

                var oView = this.getView();
                var sHunumber = oView.byId("idHuInput_CAHU").getValue();
                var sProcessType = oView.byId("idWPTInput_CAHU").getValue();

            // Ensure both product number and serial number are provided
            if (!sHunumber || !sProcessType) {
                sap.m.MessageToast.show("Please enter both Hu and Process type");
                return;
 
            }
            // Call your backend service to fetch products based on the provided keys
            var oModel = this.getView().getModel();
            var that = this;

            var sRequestUrl = `/Adhoc_warehouse_taskSet(Huident='${sHunumber}',Procty='${sProcessType}')`;

            oModel.read(sRequestUrl, {
                success: (odata) => {
                    console.log(odata);

                        if (odata.Huident === sHunumber && odata.Procty === sProcessType) {

                            that.getView().byId("idSecSCHuInput_CAHU").setValue(sHunumber);
                            that.getView().byId("idWPTInput_CAHU").setValue(sProcessType);
                            that.getView().byId("idsrcBinInput_CAHU").setValue(odata.Vlpla);
                    }
       
                    this.getView().byId("idFirstSc_CAHU").setVisible(false)
                    this.getView().byId("idsecondSc_CAHU").setVisible(true)
                },
                error: function () {
                    sap.m.MessageToast.show("Error fetching product details.");
                }
            });
            },

            onHuDetailsPress_CAHU: function () {
                this.getView().byId("idthirdSc_CAHU").setVisible(true);
                this.getView().byId("idsecondSc_CAHU").setVisible(false);

            },
            onAvatarPressedIn_AHWT: function (oEvent) {
                this.onPressAvatarEveryTileHelperFunction(oEvent);
              },
           
              onSignoutPressed:function(){
                var oRouter = this.getOwnerComponent().getRouter(this);
                oRouter.navTo("InitialScreen",{Userid:this.IDI});
              },
            onSecondBackBtnPress_CAHU: function () {
                this.getView().byId("idFirstSc_CAHU").setVisible(true);
                this.getView().byId("idsecondSc_CAHU").setVisible(false);

            },
            onThirdBackBtnPress_CAHU: function () {
                this.getView().byId("idsecondSc_CAHU").setVisible(true);

                this.getView().byId("idFirstSc_CAHU").setVisible(false);


            },
            onFirstBackBtnPress_CAHU: async function () {
                var oRouter = UIComponent.getRouterFor(this);
                var oModel1 = this.getOwnerComponent().getModel();
                var that=this;
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser = oData.Users.toLowerCase()
                        if (oUser === "resource") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID,idI: that.IDI });
                        }
                        else {
                            oRouter.navTo("Supervisor", { id: this.ID,idI: that.IDI });
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