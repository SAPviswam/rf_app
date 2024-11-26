sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
    ],
    function(BaseController,MessageToast,UIComponent,JSONModel) {
      "use strict";

  
      return BaseController.extend("com.app.rfapp.controller.SerialNumberLocation", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this);
            var oView = this.getView();
            // Attach event handler to the live change event of the product number and serial number fields
            oView.byId("idproductInput_SNL").attachLiveChange(this.onLiveChange, this);
            oView.byId("idSerialNoInput_SNL").attachLiveChange(this.onLiveChange, this);
        },
        onResourceDetailsLoad:function(oEvent1){
            var that = this;
            const { id } = oEvent1.getParameter("arguments");
            this.ID = id;
            console.log(this.ID);
        },
        onLiveChange: function(oEvent) {
          var oView = this.getView();
          var sProductNumber = oView.byId("idproductInput_SNL").getValue();
          var sSerialNumber = oView.byId("idSerialNoInput_SNL").getValue();
      
          // Check if both fields are filled
          if (!sProductNumber || !sSerialNumber) {
              // If either of the fields is empty, show a message
              sap.m.MessageToast.show("Both Product Number and Serial Number are required.");
              return; // Exit early if validation fails
          }
      
          // If both fields are filled, validate them
          if (this._isValidProductNumber(sProductNumber) && this._isValidSerialNumber(sSerialNumber)) {
              // Perform the backend read if inputs are valid
              this._fetchProductData(sProductNumber, sSerialNumber);
          } else {
              // If either of the inputs is invalid, show an error message
              sap.m.MessageToast.show("Please enter valid Product and Serial Number.");
          }
      },
      
      // Backend request to fetch data
      _fetchProductData: function(sProductNumber, sSerialNumber) {
          var oModel = this.getView().getModel();
          var that = this;
      
          // Construct the request URL using the provided format
          var sRequestUrl = `/SerialNoLocationSet(Matnr40='${sProductNumber}',Serid='${sSerialNumber}')`;
      
          // Perform the read operation
          oModel.read(sRequestUrl, {
            
              success: function (odata) {
                console.log(odata);
                  // Check the returned data
                  if (odata.Matnr40 === sProductNumber && odata.Serid === sSerialNumber) {
                      // Hide the first screen container and show the next screen
                      that.getView().byId("idFirstSC_SNL").setVisible(false);
                      that.getView().byId("idthirdSC_SNL").setVisible(true);
      
                      // Set the values to the corresponding SimpleForm input fields
                      that.getView().byId("idHUInput_SNL").setValue(odata.Huident);
                      that.getView().byId("idInput1_SNL").setValue(odata.HazmatInd); // Location
                      that.getView().byId("idLocInput_SNL").setValue(odata.Lgtyp);
                      that.getView().byId("idlgberInput3_SNL").setValue(odata.Lgber);
                      that.getView().byId("idLgplaInput_SNL").setValue(odata.Lgpla);
                      that.getView().byId("idLocktypeInput_SNL").setValue(odata.LocType);
                      that.getView().byId("idAqtyinput_SNL").setValue(odata.Nista);
                      that.getView().byId("idAltmeinput_SNL").setValue(odata.Altme);
                      that.getView().byId("idCatinput_SNL").setValue(odata.Cat);
                      that.getView().byId("idCharginput_SNL").setValue(odata.Charg);
                      that.getView().byId("idBrestrinput_SNL").setValue(odata.Brestr);
                      that.getView().byId("idOwnerinput_SNL").setValue(odata.Owner);
                      that.getView().byId("idEntitledinput_SNL").setValue(odata.Entitled);
                      that.getView().byId("idCooinput_SNL").setValue(odata.Coo);
                      that.getView().byId("idDocCatinput_SNL").setValue(odata.StockDoccatInd);
                      that.getView().byId("idDocNoinput_SNL").setValue(odata.StockDocno);
                      that.getView().byId("idItemNoinput_SNL").setValue(odata.StockItmno);
                  } else {
                      sap.m.MessageToast.show("Invalid Product or Serial Number.");
                  }
              },
              error: function () {
                  sap.m.MessageToast.show("Error fetching product details.");
              }
          });
      },
      
      // Custom validation functions
      _isValidProductNumber: function(sProductNumber) {
          // Implement your custom validation logic for product number
          return sProductNumber && sProductNumber.length > 0;  // Simplified validation
      },
      
      _isValidSerialNumber: function(sSerialNumber) {
          // Implement your custom validation logic for serial number
          return sSerialNumber && sSerialNumber.length > 0;  // Simplified validation
      },
        // Back Button In ScrollContainer 1
         onSNLfirxtBackBtnPress:async function(){
            var oRouter = UIComponent.getRouterFor(this);
                var oModel1 = this.getOwnerComponent().getModel();
                await oModel1.read("/RESOURCESSet('" + this.ID + "')", {
                    success: function (oData) {
                        let oUser=oData.Users.toLowerCase()
                        if(oUser ===  "resource"){
                            oRouter.navTo("RouteResourcePage",{id:this.ID});
                            this.getView().byId("idproductInput_SNL").setValue("")
                            this.getView().byId("idSerialNoInput_SNL").setValue("")
                        }
                        else{
                        oRouter.navTo("Supervisor",{id:this.ID});
                    }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("User does not exist");
                    }
                });
                
        },
        // Submit Button In ScrollContainer 1
        onSubmitpress: function () {
            // Get the input values from the input fields
            var oView = this.getView();
            var sProductNumber = oView.byId("idproductInput_SNL").getValue();
            var sSerialNumber = oView.byId("idSerialNoInput_SNL").getValue();

            // Ensure both product number and serial number are provided
            if (!sProductNumber || !sSerialNumber) {
                sap.m.MessageToast.show("Please enter both Product and Serial Number");
                return;

            }
            
        
            // Call your backend service to fetch products based on the provided keys
            var oModel = this.getView().getModel();
            var that = this;
        
            // Construct the request URL using the provided format
            var sRequestUrl = `/SerialNoLocationSet(Matnr40='${sProductNumber}',Serid='${sSerialNumber}')`;
        
            // Perform the read operation
            oModel.read(sRequestUrl, {
                success: function (odata) {
                    console.log(odata);
                    if(odata.Matnr40 === sProductNumber && odata.Serid === sSerialNumber) {
                    that.getView().byId("idFirstSC_SNL").setVisible(false);
                    that.getView().byId("idthirdSC_SNL").setVisible(true);
        
                    // Set the values to the corresponding SimpleForm input fields
                    that.getView().byId("idHUInput_SNL").setValue(odata.Huident); 
                    that.getView().byId("idInput1_SNL").setValue(odata.HazmatInd); // Location
                    that.getView().byId("idLocInput_SNL").setValue(odata.Lgtyp);
                    that.getView().byId("idlgberInput3_SNL").setValue(odata.Lgber);
                    that.getView().byId("idLgplaInput_SNL").setValue(odata.Lgpla);
                    that.getView().byId("idLocktypeInput_SNL").setValue(odata.LocType);
                    that.getView().byId("idAqtyinput_SNL").setValue(odata.Nista);
                    that.getView().byId("idAltmeinput_SNL").setValue(odata.Altme);
                    that.getView().byId("idCatinput_SNL").setValue(odata.Cat);
                    that.getView().byId("idCharginput_SNL").setValue(odata.Charg);
                    that.getView().byId("idBrestrinput_SNL").setValue(odata.Brestr);
                    that.getView().byId("idOwnerinput_SNL").setValue(odata.Owner);
                    that.getView().byId("idEntitledinput_SNL").setValue(odata.Entitled);
                    that.getView().byId("idCooinput_SNL").setValue(odata.Coo);
                    that.getView().byId("idDocCatinput_SNL").setValue(odata.StockDoccatInd);
                    that.getView().byId("idDocNoinput_SNL").setValue(odata.StockDocno);
                    that.getView().byId("idItemNoinput_SNL").setValue(odata.StockItmno);


               // Additional fields can be mapped similarly
                    } else {
                      sap.m.MessageToast.show("Enter a Valid Product and Serial number");
                    }
                },
                error: function () {
                    sap.m.MessageToast.show("Error fetching products.");
                }
            });
        },
        // Back Button In ScrollContainer 2
        onSNLthirdBackBtnPress:function(){
            this.getView().byId("idthirdSC_SNL").setVisible(false);
            this.getView().byId("idFirstSC_SNL").setVisible(true);

        },
        // Hu details Button In ScrollContainer 2
        onpresshudetails:function(){
            
             // Get the input value from the input field
             var oView = this.getView();
             var sHUNumber = oView.byId("idHUInput_SNL").getValue();
       
             sHUNumber = sHUNumber.toUpperCase();
             
             this.sHUNumber = sHUNumber;
       
             // Call your backend service to fetch products for this bin
             var oModel = this.getOwnerComponent().getModel(); // Assuming you have a model set up
             var that = this;
             var sRequestUrl = `/HandlingUnitNHSet('${sHUNumber}')`;
             oModel.read(sRequestUrl, {
               urlParameters: {
                 "$expand": "HUheadtoItems",
                 "$format": "json"
               },
       
               success: function (odata) {
                 console.log(odata)

                    that.getView().byId("idfourthSC_SNL").setVisible(true);
                    that.getView().byId("idthirdSC_SNL").setVisible(false);
 
                    let oDetails = odata.HUheadtoItems.results;

                    that.getView().byId("idPkmtinput_SNL").setValue(oDetails[0].Pmat);
                    that.getView().byId("idHtypinput_SNL").setValue(oDetails[0].Letyp);
                    that.getView().byId("idTotwinput_SNL").setValue(oDetails[0].GWeight);
                    that.getView().byId("idUnitGWinput_SNL").setValue(oDetails[0].UnitGw);
                    that.getView().byId("idTotVinput_SNL").setValue(oDetails[0].GVolume);
                    that.getView().byId("idUnitsGVinput_SNL").setValue(oDetails[0].UnitGv);
                    that.getView().byId("idMaxWinput_SNL").setValue(oDetails[0].MaxWeight);
                    that.getView().byId("idMaxVinput_SNL").setValue(oDetails[0].MaxVolume);
                    that.getView().byId("idTarWinput_SNL").setValue(oDetails[0].TWeight);
                    that.getView().byId("idTarVinput_SNL").setValue(oDetails[0].TVolume);
                    that.getView().byId("idLengthinput_SNL").setValue(oDetails[0].Length);
                    that.getView().byId("idWidthinput_SNL").setValue(oDetails[0].Width);
                    that.getView().byId("idHeightinput_SNL").setValue(oDetails[0].Height);
                    that.getView().byId("idUnitlwhinput_SNL").setValue(oDetails[0].UnitLwh);
                    that.getView().byId("idTopinput_SNL").setValue(oDetails[0].Top);
                    that.getView().byId("idLwstinput_SNL").setValue(oDetails[0].Bottom);
                    that.getView().byId("idMoveinput_SNL").setValue(oDetails[0].Flgmove);
                    that.getView().byId("idStatinput_SNL").setValue(oDetails[0].Phystat);
                    that.getView().byId("idHazmatIndinput_SNL").setValue(oDetails[0].HazmatInd);
                    that.getView().byId("idBininput_SNL").setValue(oDetails[0].Wsbin);
                    that.getView().byId("idCGrpinput_SNL").setValue(oDetails[0].Dstgrp);
                    
               },
               error: function () {
                 sap.m.MessageToast.show("Error fetching products.");
               }
             });
        },
        // Back Button In ScrollContainer 3
        onSNLfourthBackBtnPress:function(){
            this.getView().byId("idthirdSC_SNL").setVisible(true);
            this.getView().byId("idfourthSC_SNL").setVisible(false);
        },

        // Bin details Button In ScrollContainer 2
        onpressBindetails:function(){
            

            // Get the input value from the input field
            var oView = this.getView();
            var sBinNumber = oView.byId("idLgplaInput_SNL").getValue();
      
            sBinNumber = sBinNumber.toUpperCase();
            
            this.sBinNumber = sBinNumber;
      
            // Call your backend service to fetch products for this bin
            var oModel = this.getOwnerComponent().getModel(); // Assuming you have a model set up
            var that = this;
            var sRequestUrl = `/BINQItemSet('${sBinNumber}')`;
            oModel.read(sRequestUrl, {
              urlParameters: {
                "$expand": "BINQHeadSet",
                "$format": "json"
              },
      
              success: function (odata) {
                console.log(odata)

                that.getView().byId("idthirdSC_SNL").setVisible(false);
                that.getView().byId("idFifthSC_SNL").setVisible(true);

                   let oDetails = odata.BINQHeadSet.results;

                   that.getView().byId("idStypinput_SNL").setValue(odata.Lgtyp);
                   that.getView().byId("idSSecinput_SNL").setValue(odata.Lgber);
                   that.getView().byId("idBTinput_SNL").setValue(odata.Lptyp);
                   that.getView().byId("idPBinput_SNL").setValue(odata.Skzue);
                   that.getView().byId("idMHUinput_SNL").setValue(odata.Maxle);
                   that.getView().byId("idAchuinput_SNL").setValue(odata.Anzle);
                   that.getView().byId("idSectinput_SNL").setValue(odata.Plauf);
                   that.getView().byId("idRBinput_SNL").setValue(odata.Skzua);
                   that.getView().byId("idMaxWinput1_SNL").setValue(odata.MaxWeight);
                   that.getView().byId("idActwinput_SNL").setValue(odata.Weight);
                   that.getView().byId("idUnitWinput_SNL").setValue(odata.UnitW);
                   that.getView().byId("idMaxVinput1_SNL").setValue(odata.MaxVolume);
                   that.getView().byId("idActVinput_SNL").setValue(odata.Volum);
                   that.getView().byId("idUnitVinput_SNL").setValue(odata.UnitV);
                   that.getView().byId("idMaxcinput_SNL").setValue(odata.MaxCapa);
                   that.getView().byId("idAvcinput_SNL").setValue(odata.Fcapa);
                   that.getView().byId("idLMinput_SNL").setValue(odata.MovedDate);
                   that.getView().byId("idMovedTimeinput_SNL").setValue(odata.MovedTime);
                   that.getView().byId("idLCinput_SNL").setValue(odata.ClearedDate);
                   that.getView().byId("idChangedTimeinput_SNL").setValue(odata.ClearedTime);
                   that.getView().byId("idLIinput_SNL").setValue(odata.IdatuD);
                   that.getView().byId("idIdatuTinput_SNL").setValue(odata.IdatuT);
                   that.getView().byId("idIVDOinput_SNL").setValue(odata.Ivnum);
                   that.getView().byId("idIvPosinput_SNL").setValue(odata.IvPos);

                   function convertMillisecondsToTime(milliseconds) {
                    // Calculate total seconds
                    let totalSeconds = Math.floor(milliseconds / 1000);
                    // Calculate hours, minutes, and seconds
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
        
                    // Format as HH:MM:SS
                    return (
                      String(hours).padStart(2, '0') + ':' +
                      String(minutes).padStart(2, '0') + ':' +
                      String(seconds).padStart(2, '0')
                    );
                  }
        
                  // Example usage
                  const milliseconds = odata.MovedTime.ms;
                  const milliseconds1 = odata.ClearedTime.ms;
                  const milliseconds2 = odata.IdatuT.ms;
                  oView.byId("idMovedTimeinput_SNL").setValue(convertMillisecondsToTime(milliseconds));
                  oView.byId("idChangedTimeinput_SNL").setValue(convertMillisecondsToTime(milliseconds1));
                  oView.byId("idIdatuTinput_SNL").setValue(convertMillisecondsToTime(milliseconds2));
                   
              },
              error: function () {
                sap.m.MessageToast.show("Error fetching products.");
              }
            });
        },
        // Back Button In ScrollContainer 4
        onSNLfifthBackBtnPress:function(){
            this.getView().byId("idthirdSC_SNL").setVisible(true);
            this.getView().byId("idFifthSC_SNL").setVisible(false);
        }
      });
    }
  );
  