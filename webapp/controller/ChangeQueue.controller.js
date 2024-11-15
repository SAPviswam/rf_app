

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/f/library",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast"
], function (Controller, JSONModel, library, MessageBox, Fragment,MessageToast) {
	"use strict";
	var history = {
		prevPaymentSelect: null,
		prevDiffDeliverySelect: null
	};

	return Controller.extend("com.app.rfapp.controller.ChangeQueue", {
		onInit: function () {
			this.processGroupArray = [];

			var oModel = this.getOwnerComponent().getModel();
			this.getView().setModel(oModel)
			oModel.read("/ProcessAreaSet", {
				success: function (oData) {
					var aProcessAreas = oData.results;
					var uniqueProcessAreasSet = new Set();

					// Add unique Processarea values to the Set
					aProcessAreas.forEach(function (item) {
						var oProccessArea = item.Processarea.charAt(0).toUpperCase() + item.Processarea.slice(1).toLowerCase();
						uniqueProcessAreasSet.add(oProccessArea);
					});
					console.log(uniqueProcessAreasSet)
					// Convert the Set back to an array for the JSON model
					var aUniqueProcessAreas = Array.from(uniqueProcessAreasSet).map(function (area) {
						return { Processarea: area };
					});
					console.log(aUniqueProcessAreas)
					var oUniqueModel = new sap.ui.model.json.JSONModel({
						ProcessAreas: aUniqueProcessAreas
					});

					this.getView().byId("idProcessAreaList_changeQueue").setModel(oUniqueModel);



				}.bind(this),
				error: function (oError) {
					console.error("Error reading AreaSet:", oError);
				}
			});
			const oRouter = this.getOwnerComponent().getRouter(); // Get the router from the owner component
			oRouter.attachRoutePatternMatched(this.onResourceDetailsLoad, this); // Attach route match event to handler
			
		},
		tableContent: function () {
			var oModel = this.getOwnerComponent().getModel();
			var that=this;
			oModel.read("/RESOURCESSet('" + this.ID + "')",{
				success:function(oData){
					console.log(oData)
					var oResourceAreaArray = oData.Area.split(",").map(item => item.trim());
					const oResourceAreaArrayUpper = oResourceAreaArray.map(name => name.toUpperCase());
					var oResourceGroupArray = oData.Resourcegroup.split(",").map(item => item.trim());
					const oResourceGroupArrayUpper = oResourceGroupArray.map(name => name.toUpperCase());
					var oResourceQueueArray = oData.Queue.split(",").map(item => item.trim());
					const oResourceQueueArrayUpper = oResourceQueueArray.map(name => name.toUpperCase());

					oModel.read("/ProcessAreaSet",{
						success:function(oData){
							var oDetails=oData.results;
							var aTableDetails = [];
                        for (var i = 0; i < oDetails.length; i++) {
							if(oResourceAreaArrayUpper.includes(oDetails[i].Processarea.toUpperCase())){
								if(oResourceGroupArrayUpper.includes(oDetails[i].Processgroup.toUpperCase())){
									if(oResourceQueueArrayUpper.includes(oDetails[i].Queue.toUpperCase())){
										aTableDetails.push({
											Area: oDetails[i].Processarea,
											Group:oDetails[i].Processgroup,
											Queue:oDetails[i].Queue
										});
									}

								}
							}
                            
                        };
						
 
                        // Set model to the product details table
                        var oTableModel = new sap.ui.model.json.JSONModel({ resources: aTableDetails });
                        that.byId("idAssignedQueueTable_changeQueue").setModel(oTableModel);
 
                        // Bind table items to the product details model
                        // that.byId("idAssignedQueueTable_changeQueue").bindItems({
                        //     path: "/resources",
                        //     template: new sap.m.ColumnListItem({
                        //         cells: [
                        //             new sap.m.Text({ text: "{Area}" }),
                        //             new sap.m.Text({ text: "{Group}" }),
                        //             new sap.m.Text({ text: "{Queue}" }),
                                    
                        //         ]
                        //     })
                        // });
						
						},
						error:function(){

						}
					})
				},
				error:function(){

				}
			})
		},
		// Event handler for loading resource details when route pattern is matched
		onResourceDetailsLoad: async function (oEvent1) {
			const { id } = oEvent1.getParameter("arguments"); // Extract the 'id' parameter from the route's arguments
			this.ID = id; // Store the 'id' for use in other methods
			this.tableContent();
		},
		onAddQueueBtnPress_changeQueue: function () {
			var oTable = this.byId("idAssignedQueueTable_changeQueue");
			var aSelectedItems = oTable.getSelectedItems();
			if (aSelectedItems.length < 1) {
			this.getView().byId("idScrollContainer1_changeQueue").setVisible(false);
			this.getView().byId("idNavContainer_changeQueue").setVisible(true);
			}
			else{
				MessageToast.show("Please deselct the selected Queues")
			}

		},
		onBackBtnPress_changeQueue:async function(){
			var oRouter = this.getOwnerComponent().getRouter();
			
			
				  oRouter.navTo("Homepage", { id: this.ID });
				
			  
		},


		onSelectionChangeArea: function (oEvent) {

			var oWizard = this.byId("idProcesstWizard_changeQueue");
			var oCurrentStep = oWizard.getCurrentStep();
			var oList = this.byId("idProcessAreaList_changeQueue");

			var aSelectedItems = oList.getSelectedItems();

			// If there are selected items, extract their data
			if (aSelectedItems.length > 0) {
				var selectedData = aSelectedItems.map(function (oItem) {
					// Access the binding context of the selected item
					var oBindingContext = oItem.getBindingContext();

					// Get the "Processarea" data (or any other property you want)
					return oBindingContext.getProperty("Processarea");
				});

				// Log or process the selected data
				console.log("Selected Process Areas:", selectedData);

				// Optionally, show a message toast with the selected data
				//MessageToast.show("Selected Process Areas: " + selectedData.join(", "));
			} else {
				// If no items are selected, show a message
			    MessageToast.show("No Process Area selected!");
				selectedData = [];
			}
			//this.getView().byId("idProcessAreaWizard_changeQueue").setVisible(false);
			var oModel = this.getOwnerComponent().getModel();
			var uniqueProcessGroupsSet = new Set();
			oModel.read("/ProcessAreaSet", {
				success: function (oData) {
					var details = oData.results;
					details.forEach(element => {
						if (selectedData.includes(element.Processarea)) {
							uniqueProcessGroupsSet.add(element.Processgroup)
						}
					});
					var aUniqueProcessGroups = Array.from(uniqueProcessGroupsSet).map(function (group) {
						return { Processgroup: group };
					});
					var oUniqueModel = new sap.ui.model.json.JSONModel({
						ProcessGroups: aUniqueProcessGroups
					});

					this.getView().byId("idProcessGroupList_changeQueue").setModel(oUniqueModel);



				}.bind(this),
				error: function (oError) {
					console.error("Error reading AreaSet:", oError);
				}
			});

		},
		onSelectionChangeGroup: function (oEvent) {

			var oWizard = this.byId("idProcesstWizard_changeQueue");
			var oCurrentStep = oWizard.getCurrentStep();
			var oList = this.byId("idProcessGroupList_changeQueue");

			var aSelectedItems = oList.getSelectedItems();

			// If there are selected items, extract their data
			if (aSelectedItems.length > 0) {
				var selectedData = aSelectedItems.map(function (oItem) {
					// Access the binding context of the selected item
					var oBindingContext = oItem.getBindingContext();

					// Get the "Processarea" data (or any other property you want)
					return oBindingContext.getProperty("Processgroup");
				});

				// Log or process the selected data
				console.log("Selected Process Groups:", selectedData);

				// Optionally, show a message toast with the selected data
				//MessageToast.show("Selected Process Areas: " + selectedData.join(", "));
			} else {
				// If no items are selected, show a message
				// MessageToast.show("No Process Area selected!");
				selectedData = [];
			}
			this.processGroupArray = selectedData
			var oModel = this.getOwnerComponent().getModel();
			var uniqueProcessQueuesSet = new Set();
			var oQueuesofRes = []
			oModel.read("/RESOURCESSet('" + this.ID + "')", {
				success: function (oData) {
					console.log(oData.Queue)

					var oResourceArray = oData.Queue.split(",").map(item => item.trim());
					oResourceArray.forEach(function (queue) {

						let lOQueue = queue.toLowerCase();
						oQueuesofRes.push(lOQueue)

					});
				},
				error: function () {

				}
			})

			oModel.read("/ProcessAreaSet", {
				success: function (oData) {
					var details = oData.results;
					details.forEach(element => {
						if (selectedData.includes(element.Processgroup)) {
							if (!(oQueuesofRes.includes(element.Queue.toLowerCase()))) {
								uniqueProcessQueuesSet.add(element.Queue)
							}

						}
					});

					var aUniqueProcessQueues = Array.from(uniqueProcessQueuesSet).map(function (queue) {
						return { Processqueue: queue };
					});
					console.log(aUniqueProcessQueues)

					var oUniqueModel = new sap.ui.model.json.JSONModel({
						ProcessQueues: aUniqueProcessQueues
					});

					this.getView().byId("idProcessQueueList_changeQueue").setModel(oUniqueModel);



				}.bind(this),
				error: function (oError) {
					console.error("Error reading AreaSet:", oError);
				}
			});

		},

		onNextPressProcessArea: function () {
			var oWizard = this.byId("idProcesstWizard_changeQueue");
			var oCurrentStep = oWizard.getCurrentStep();
			var oList = this.byId("idProcessAreaList_changeQueue");

			var aSelectedItems = oList.getSelectedItems();

			// If there are selected items, extract their data
			if (aSelectedItems.length > 0) {
				oWizard.nextStep();
			}
			else{
				MessageToast.show("Please select atleast one Area")
			}

			
		},
		onNextPressProcessGroup: function () {
			var oWizard = this.byId("idProcesstWizard_changeQueue");
			var oCurrentStep = oWizard.getCurrentStep();	
			var oList = this.byId("idProcessGroupList_changeQueue");

			var aSelectedItems = oList.getSelectedItems();

			// If there are selected items, extract their data
			if (aSelectedItems.length > 0) {
				oWizard.nextStep();
			}
			else{
				MessageToast.show("Please select atleast one Group")
			}
			
		},
		OnSubmitPress: function () {
			var oList = this.byId("idProcessQueueList_changeQueue");

			var aSelectedItems = oList.getSelectedItems();

			// If there are selected items, extract their data
			if (aSelectedItems.length > 0) {
				var selectedData = aSelectedItems.map(function (oItem) {
					// Access the binding context of the selected item
					var oBindingContext = oItem.getBindingContext();
					// Get the "Processarea" data (or any other property you want)
					return oBindingContext.getProperty("Processqueue");
				});
				// Log or process the selected data
				console.log("Selected Process Groups:", selectedData);
				// Optionally, show a message toast with the selected data
				//MessageToast.show("Selected Process Areas: " + selectedData.join(", "));
			
			var oModel = this.getOwnerComponent().getModel();
			var that = this;

			oModel.read("/RESOURCESSet('" + this.ID + "')", {
				success: function (oData) {
					console.log(oData)
					var oGroupSet = new Set();
					var oResourceGroupArray = oData.Resourcegroup.split(",").map(item => item.trim());
					var comGroup = oResourceGroupArray.concat(that.processGroupArray);
					var oGroupSet = new Set(comGroup);
					let arrayFromSet = Array.from(oGroupSet);
					let resultStringGroup = arrayFromSet.join(',');
					var oResourceArray = oData.Queue.split(",").map(item => item.trim());
					var comQue = oResourceArray.concat(selectedData);
					let resultString = comQue.join(',');
					console.log(resultString);
					const resourceDetails = {
						Resourcegroup: resultStringGroup,
						Queue: resultString
					}
					oModel.update("/RESOURCESSet('" + that.ID + "')", resourceDetails, {
						success: function () {

						}.bind(this),
						error: function (oError) {
							sap.m.MessageBox.error("Failed " + oError.message);
						}.bind(this)
					});
					that.getView().byId("idNavContainer_changeQueue").setVisible(false);
					that.getView().byId("idScrollContainer1_changeQueue").setVisible(true);
					that.tableContent();

				},
				error: function () {

				}
				
			})
			var oWizard = this.byId("idProcesstWizard_changeQueue");

			// Reset the wizard to the first step
			var oFirstStep = oWizard.getSteps()[0];
			oWizard.setCurrentStep(oFirstStep);
			oWizard.goToStep(oFirstStep);
			var oList = this.byId("idProcessAreaList_changeQueue");
    
			// Clear the selection (unselect all items)
			oList.removeSelections(true);
			var oList = this.byId("idProcessGroupList_changeQueue");
    
			// Clear the selection (unselect all items)
			oList.removeSelections(true);
			var oList = this.byId("idProcessQueueList_changeQueue");
    
			// Clear the selection (unselect all items)
			oList.removeSelections(true);
			
		} else {
			// If no items are selected, show a message
			 MessageToast.show("Please select atleast one Queue");
			selectedData = [];
		}

		},
		onDeleteQueueBtnPress_changeQueue: function() {
			
			var oTable = this.byId("idAssignedQueueTable_changeQueue");
			var aSelectedItems = oTable.getSelectedItems();
			var oModel=this.getOwnerComponent().getModel();
			var that=this
			if (aSelectedItems.length > 0) {
			oModel.read("/RESOURCESSet('" + this.ID + "')",{
				success:function(oData){
					var oResourceQueueArray = oData.Queue.split(",").map(item => item.trim());
					var oResourceQueueArrayUpper = oResourceQueueArray.map(name => name.toUpperCase());
					aSelectedItems.forEach(function(oItem) {
						var oContext = oItem.getBindingContext();
						var oObject = oContext.getObject();
						if(oResourceQueueArray.includes(oObject.Queue.toUpperCase())){
							console.log(oObject.Queue.toUpperCase())
							oResourceQueueArrayUpper=oResourceQueueArrayUpper.filter(item => item !=oObject.Queue.toUpperCase())
						}
						console.log(oData);
					});
					let resultString = oResourceQueueArrayUpper.join(',');
					console.log(resultString);
					const resourceDetails = {
						Queue: resultString
					}
					oModel.update("/RESOURCESSet('" + that.ID + "')", resourceDetails, {
						success: function () {

						}.bind(this),
						error: function (oError) {
							sap.m.MessageBox.error("Failed " + oError.message);
						}.bind(this)
					});
					that.tableContent();
				},
				error:function(){

				}
			})
			console.log(aSelectedItems)
			
			} else {
				sap.m.MessageToast.show("Please Select atleast on Queue");
			}
		},
		onBackPressInWizard:function(){
			this.getView().byId("idScrollContainer1_changeQueue").setVisible(true);
			this.getView().byId("idNavContainer_changeQueue").setVisible(false);
			var oWizard = this.byId("idProcesstWizard_changeQueue");
			var oFirstStep = oWizard.getSteps()[0];
			oWizard.setCurrentStep(oFirstStep);
			oWizard.goToStep(oFirstStep);
			var oList = this.byId("idProcessAreaList_changeQueue");
    
			// Clear the selection (unselect all items)
			oList.removeSelections(true);
			var oList = this.byId("idProcessGroupList_changeQueue");
    
			// Clear the selection (unselect all items)
			oList.removeSelections(true);
			var oList = this.byId("idProcessQueueList_changeQueue");
    
			// Clear the selection (unselect all items)
			oList.removeSelections(true);
		}
		
	});
});