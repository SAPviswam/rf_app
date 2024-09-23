sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.app.rfapp.controller.AutomaticallyRepackHUItem", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            },
            onResourceDetailsLoad: async function (oEvent1) {
                const { id } = oEvent1.getParameter("arguments");
                this.ID = id;
            },
            //Back Btn from 1st ScrollContainer Page 1 =>idPage1_ARHUI
            onPressBackBtnPage1_ARHUI: async function () {
                var oRouter = this.getOwnerComponent().getRouter();
                var oModel1 = this.getOwnerComponent().getModel();
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        if (oData.Users === "RESOURCE") {
                            oRouter.navTo("RouteResourcePage", { id: this.ID });
                        }
                        else {
                            oRouter.navTo("Supervisor", { id: this.ID });
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
            },

            //Back Btn from ScrollContainer Page 2 =>idPage2HUDetails 
            onBackBtnPressPage2_ARHUI: function () {
                var oScrollContainer1 = this.byId("idPage1AutomaticallyRHUI_ARHUI");
                var oScrollContainer2 = this.byId("idPage2AutomaticallyRepackHUI_ARHUI");

                // show the Scanner form VBox
                oScrollContainer1.setVisible(true);

                //Hide the Second Page scroll container
                oScrollContainer2.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 3 =>idPage3AutomaticallyRepackHUI_ARHUI 
            onBackBtnPressPage3_ARHUI: function () {
                var oScrollContainer2 = this.byId("idPage2AutomaticallyRepackHUI_ARHUI");
                var oScrollContainer3 = this.byId("idPage3AutomaticallyRepackHUI_ARHUI");

                // show the second page
                oScrollContainer2.setVisible(true);

                //Hide the third Page scroll container
                oScrollContainer3.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 4 =>idPage4AutomticallyRHUI_ARHUI 
            onBackPressPage4_ARHUI: function () {
                var oScrollContainer4 = this.byId("idPage4AutomticallyRHUI_ARHUI");
                var oScrollContainer3 = this.byId("idPage3AutomaticallyRepackHUI_ARHUI");

                // show the Third page
                oScrollContainer3.setVisible(true);

                //Hide the Fourth Page scroll container
                oScrollContainer4.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 5 =>idPage5AutomticallyRHUI_ARHUI 
            onBackPressPage5_ARHUI: function () {
                var oScrollContainer4 = this.byId("idPage4AutomticallyRHUI_ARHUI");
                var oScrollContainer5 = this.byId("idPage5AutomticallyRHUI_ARHUI");

                // show the Fourth page
                oScrollContainer4.setVisible(true);

                //Hide the Fifth Page scroll container
                oScrollContainer5.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 6 =>idPage5AutomticallyRHUI_ARHUI 
            onBackPressPage6_ARHUI: function () {
                var oScrollContainer6 = this.byId("idPage6AutomticallyRHUI_ARHUI");
                var oScrollContainer5 = this.byId("idPage5AutomticallyRHUI_ARHUI");

                // show the fifth page
                oScrollContainer5.setVisible(true);

                //Hide the sixth Page scroll container
                oScrollContainer6.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 7 =>idPage5AutomticallyRHUI_ARHUI 
            onBackButtonPressPage7_ARHUI: function () {
                var oScrollContainer6 = this.byId("idPage6AutomticallyRHUI_ARHUI");
                var oScrollContainer7 = this.byId("idPage7AutomticallyRHUI_ARHUI");

                // show the 6th page
                oScrollContainer6.setVisible(true);

                //Hide the 7th Page scroll container
                oScrollContainer7.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 8 =>idPage5AutomticallyRHUI_ARHUI 
            onBackBtnPressPage8_ARHUI: function () {
                var oScrollContainer8 = this.byId("idPage8AutomticallyRHUI_ARHUI");
                var oScrollContainer7 = this.byId("idPage7AutomticallyRHUI_ARHUI");

                // show the 7th page
                oScrollContainer7.setVisible(true);

                //Hide the 8th scroll container
                oScrollContainer8.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 9 =>idPage9AutomticallyRHUI_ARHUI 
            onBackBtnPressPage9_ARHUI: function () {
                var oScrollContainer8 = this.byId("idPage8AutomticallyRHUI_ARHUI");
                var oScrollContainer9 = this.byId("idPage9AutomticallyRHUI_ARHUI");

                // show the 8th page
                oScrollContainer8.setVisible(true);

                //Hide the 9th Page scroll container
                oScrollContainer9.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 10 =>idPage9AutomticallyRHUI_ARHUI 
            onBackBtnPressPage10_ARHUI: function () {
                var oScrollContainer10 = this.byId("idPage10AutomticallyRHUI_ARHUI");
                var oScrollContainer6 = this.byId("idPage6AutomticallyRHUI_ARHUI");

                // show the 8th page
                oScrollContainer6.setVisible(true);

                //Hide the 9th Page scroll container
                oScrollContainer10.setVisible(false);
            },

            //Back Btn from ScrollContainer Page 11 =>idPage9AutomticallyRHUI_ARHUI 
            onBackBtnPressPage11_ARHUI: function () {
                var oScrollContainer11 = this.byId("idPage11AutomticallyRHUI_ARHUI");
                var oScrollContainer6 = this.byId("idPage6AutomticallyRHUI_ARHUI");

                // show the 8th page
                oScrollContainer6.setVisible(true);

                //Hide the 9th Page scroll container
                oScrollContainer11.setVisible(false);
            },

            //Enter Btn from ScrollContainer Page 1=> idPage1AutomaticallyRHUI_ARHUI..
            onEnterPressAutomaticallyRepackHUI_ARHUI: function () {
                var oScrollContainer1 = this.byId("idPage1AutomaticallyRHUI_ARHUI");
                var oScrollContainer2 = this.byId("idPage2AutomaticallyRepackHUI_ARHUI");

                // Hide the Scanner form VBox
                oScrollContainer1.setVisible(false);

                // Show the Second Page scroll container
                oScrollContainer2.setVisible(true);
            },

            //Enter Btn from ScrollContainer Page 2=> idPage1AutomaticallyRHUI_ARHUI..
            onPressEnterBtn_ARHUI: function () {
                var oScrollContainer2 = this.byId("idPage2AutomaticallyRepackHUI_ARHUI");
                var oScrollContainer3 = this.byId("idPage3AutomaticallyRepackHUI_ARHUI");

                // Hide the Second Page
                oScrollContainer2.setVisible(false);

                // Show the Third Page
                oScrollContainer3.setVisible(true);
            },

            //Enter Btn from ScrollContainer Page 3=> idPage1AutomaticallyRHUI_ARHUI..
            onPressBtnEnterPage3_ARHUI: function () {
                var oScrollContainer4 = this.byId("idPage4AutomticallyRHUI_ARHUI");
                var oScrollContainer3 = this.byId("idPage3AutomaticallyRepackHUI_ARHUI");

                // Hide the third Page
                oScrollContainer3.setVisible(false);

                // Show the Fourth Page
                oScrollContainer4.setVisible(true);
            },

            //Enter Btn from ScrollContainer Page 4=> idPage4AutomticallyRHUI_ARHUI..
            onPressEnterPage4_ARHUI: function () {
                var oScrollContainer4 = this.byId("idPage4AutomticallyRHUI_ARHUI");
                var oScrollContainer5 = this.byId("idPage5AutomticallyRHUI_ARHUI");

                // Hide the Fourth Page
                oScrollContainer4.setVisible(false);

                // Show the Fifth Page
                oScrollContainer5.setVisible(true);
            },

            //Save Btn from ScrollContainer Page 5=> idPage4AutomticallyRHUI_ARHUI..
            onPressSavePage4_ARHUI: function () {
                var oScrollContainer5 = this.byId("idPage5AutomticallyRHUI_ARHUI");
                var oScrollContainer6 = this.byId("idPage6AutomticallyRHUI_ARHUI");

                // Hide the fifth Page
                oScrollContainer5.setVisible(false);

                // Show the sixth Page
                oScrollContainer6.setVisible(true);
            },

            //HU CREATE Btn from ScrollContainer Page 6=> idPage6AutomticallyRHUI_ARHUI..
            onPressBtnPage6HUCREATE_ARHUI: function () {
                var oScrollContainer6 = this.byId("idPage6AutomticallyRHUI_ARHUI");
                var oScrollContainer3 = this.byId("idPage3AutomaticallyRepackHUI_ARHUI");

                // Hide the 6th Page
                oScrollContainer6.setVisible(false);

                // Show the 3rd Page
                oScrollContainer3.setVisible(true);
            },

            //HU Overview Btn from ScrollContainer Page 6=> idPage6AutomticallyRHUI_ARHUI..
            onPressBtnPage6HUOVERVIEW_ARHUI: function () {
                var oScrollContainer6 = this.byId("idPage6AutomticallyRHUI_ARHUI");
                var oScrollContainer7 = this.byId("idPage7AutomticallyRHUI_ARHUI");

                // Hide the 6th Page
                oScrollContainer6.setVisible(false);

                // Show the 7th Page
                oScrollContainer7.setVisible(true);
            },

            //HU ItemList Btn from ScrollContainer Page 6=> idPage6AutomticallyRHUI_ARHUI..
            onPressBtnPage6HUITEMLIST_ARHUI: function () {
                var oScrollContainer6 = this.byId("idPage6AutomticallyRHUI_ARHUI");
                var oScrollContainer10 = this.byId("idPage10AutomticallyRHUI_ARHUI");

                // Hide the 6th Page
                oScrollContainer6.setVisible(false);

                // Show the 10th Page
                oScrollContainer10.setVisible(true);
            },

            //Mat Details Btn Btn from ScrollContainer Page 6=> idPage6AutomticallyRHUI_ARHUI..
            onPressBtnPage6MATERIALDETAILS_ARHUI: function () {
                var oScrollContainer6 = this.byId("idPage6AutomticallyRHUI_ARHUI");
                var oScrollContainer11 = this.byId("idPage11AutomticallyRHUI_ARHUI");

                // Hide the 6th Page
                oScrollContainer6.setVisible(false);

                // Show the 10th Page
                oScrollContainer11.setVisible(true);
            },

            //Next Btn from ScrollContainer Page 7=> idPage5AutomticallyRHUI_ARHUI..
            onPressNextBtnPage7_ARHUI: function () {
                var oScrollContainer7 = this.byId("idPage7AutomticallyRHUI_ARHUI");
                var oScrollContainer8 = this.byId("idPage8AutomticallyRHUI_ARHUI");

                // Hide the 7th Page
                oScrollContainer7.setVisible(false);

                // Show the 8th Page
                oScrollContainer8.setVisible(true);
            },

            //Change Btn from ScrollContainer Page 8=> idPage5AutomticallyRHUI_ARHUI..
            onPressChangePage8_ARHUI: function () {
                var oScrollContainer8 = this.byId("idPage8AutomticallyRHUI_ARHUI");
                var oScrollContainer9 = this.byId("idPage9AutomticallyRHUI_ARHUI");

                // Hide the 7th Page
                oScrollContainer8.setVisible(false);

                // Show the 8th Page
                oScrollContainer9.setVisible(true);
            },
        });
    }
);
