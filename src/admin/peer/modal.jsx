 {/* Add/Edit Modal */}
 <Dialog open={isModalOpen} onClose={closeModal} maxWidth="md" fullWidth>
 <DialogTitle className="flex justify-between items-center">
   <span className="text-lg font-medium">{selectedRecord.id ? 'Edit Record' : 'Add New Record'}</span>
   <IconButton onClick={closeModal} size="small">
     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <line x1="18" y1="6" x2="6" y2="18"></line>
       <line x1="6" y1="6" x2="18" y2="18"></line>
     </svg>
   </IconButton>
 </DialogTitle>
 <DialogContent>
   <Box className="p-4 space-y-6">
     <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
         Year
       </label>
       <SingleYearPicker
                      initialYear={selectedYear}
                      onYearChange={handleYearChange}
                    />
     </div>
     
     {/* Cebu Section */}
     <div className="border p-4 rounded-md">
       <h3 className="text-lg font-medium mb-4">Cebu</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <NumberBox
           label="Total Power Generation (GWh)"
           value={selectedRecord["Cebu Total Power Generation (GWh)"]}
           onChange={handleCebuTotalPowerGenerationChange}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Non-Renewable Energy (GWh)"
           value={selectedRecord["Cebu Total Non-Renewable Energy (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Renewable Energy (GWh)"
           value={selectedRecord["Cebu Total Renewable Energy (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Geothermal (GWh)"
           value={selectedRecord["Cebu Geothermal (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Hydro (GWh)"
           value={selectedRecord["Cebu Hydro (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Biomass (GWh)"
           value={selectedRecord["Cebu Biomass (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Solar (GWh)"
           value={selectedRecord["Cebu Solar (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Wind (GWh)"
           value={selectedRecord["Cebu Wind (GWh)"]}
           placeholder="Enter value"
         />
       </div>
     </div>
     
     {/* Negros Section */}
     <div className="border p-4 rounded-md">
       <h3 className="text-lg font-medium mb-4">Negros</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <NumberBox
           label="Total Power Generation (GWh)"
           value={selectedRecord["Negros Total Power Generation (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Non-Renewable Energy (GWh)"
           value={selectedRecord["Negros Total Non-Renewable Energy (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Renewable Energy (GWh)"
           value={selectedRecord["Negros Total Renewable Energy (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Geothermal (GWh)"
           value={selectedRecord["Negros Geothermal (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Hydro (GWh)"
           value={selectedRecord["Negros Hydro (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Biomass (GWh)"
           value={selectedRecord["Negros Biomass (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Solar (GWh)"
           value={selectedRecord["Negros Solar (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Wind (GWh)"
           value={selectedRecord["Negros Wind (GWh)"]}
           placeholder="Enter value"
         />
       </div>
     </div>
     
     {/* Panay Section */}
     <div className="border p-4 rounded-md">
       <h3 className="text-lg font-medium mb-4">Panay</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <NumberBox
           label="Total Power Generation (GWh)"
           value={selectedRecord["Panay Total Power Generation (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Non-Renewable Energy (GWh)"
           value={selectedRecord["Panay Total Non-Renewable Energy (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Renewable Energy (GWh)"
           value={selectedRecord["Panay Total Renewable Energy (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Geothermal (GWh)"
           value={selectedRecord["Panay Geothermal (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Hydro (GWh)"
           value={selectedRecord["Panay Hydro (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Biomass (GWh)"
           value={selectedRecord["Panay Biomass (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Solar (GWh)"
           value={selectedRecord["Panay Solar (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Wind (GWh)"
           value={selectedRecord["Panay Wind (GWh)"]}
           placeholder="Enter value"
         />
       </div>
     </div>
     
     {/* Leyte-Samar Section */}
     <div className="border p-4 rounded-md">
       <h3 className="text-lg font-medium mb-4">Leyte-Samar</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <NumberBox
           label="Total Power Generation (GWh)"
           value={selectedRecord["Leyte-Samar Total Power Generation (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Non-Renewable Energy (GWh)"
           value={selectedRecord["Leyte-Samar Total Non-Renewable (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Renewable Energy (GWh)"
           value={selectedRecord["Leyte-Samar Total Renewable (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Geothermal (GWh)"
           value={selectedRecord["Leyte-Samar Geothermal (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Hydro (GWh)"
           value={selectedRecord["Leyte-Samar Hydro (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Biomass (GWh)"
           value={selectedRecord["Leyte-Samar Biomass (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Solar (GWh)"
           value={selectedRecord["Leyte-Samar Solar (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Wind (GWh)"
           value={selectedRecord["Leyte-Samar Wind (GWh)"]}
           placeholder="Enter value"
         />
       </div>
     </div>
     
     {/* Bohol Section */}
     <div className="border p-4 rounded-md">
       <h3 className="text-lg font-medium mb-4">Bohol</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <NumberBox
           label="Total Power Generation (GWh)"
           value={selectedRecord["Bohol Total Power Generation (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Non-Renewable Energy (GWh)"
           value={selectedRecord["Bohol Total Non-Renewable (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Total Renewable Energy (GWh)"
           value={selectedRecord["Bohol Total Renewable (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Geothermal (GWh)"
           value={selectedRecord["Bohol Geothermal (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Hydro (GWh)"
           value={selectedRecord["Bohol Hydro (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Biomass (GWh)"
           value={selectedRecord["Bohol Biomass (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Solar (GWh)"
           value={selectedRecord["Bohol Solar (GWh)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="Wind (GWh)"
           value={selectedRecord["Bohol Wind (GWh)"]}
           placeholder="Enter value"
         />
       </div>
     </div>
     
     {/* Visayas Total */}
     <div className="border p-4 rounded-md bg-gray-50">
       <h3 className="text-lg font-medium mb-4">Visayas</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <NumberBox
           label="Total Power Generation (GWh)"
           value={selectedRecord["Visayas Total Power Generation (GWh)"]}
           placeholder="Enter value"
           disabled={true}
         />
         <NumberBox
           label="Total Power Consumption (GWh)"
           value={selectedRecord["Visayas Total Power Consumption (GWh)"]}
           placeholder="Enter value"
         />
       </div>
     </div>
     
     {/* Recommendation Parameters */}
     <div className="border p-4 rounded-md bg-blue-50">
       <h3 className="text-lg font-medium mb-4">Recommendation Parameters</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <NumberBox
           label="Solar Cost (PHP/W)"
           value={selectedRecord["Solar Cost (PHP/W)"]}
           placeholder="Enter value"
         />
         <NumberBox
           label="MERALCO Rate (PHP/kWh)"
           value={selectedRecord["MERALCO Rate (PHP/kWh)"]}
           placeholder="Enter value"
         />
       </div>
     </div>
   </Box>
 </DialogContent>
 <DialogActions className="p-4">
   <Button
     variant="secondary"
     onClick={closeModal}
     className="mr-2"
   >
     Cancel
   </Button>
   <Button
     variant="primary"
     onClick={closeModal}
   >
     {selectedRecord.id ? 'Update' : 'Save'}
   </Button>
 </DialogActions>
</Dialog>