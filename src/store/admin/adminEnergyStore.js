// useEnergyStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '@features/modules/api';

// This is a factory function to create a store for each energy type
const createEnergyStore = (energyType) => {
  // Normalize the energy type for API paths, keys, etc.
  const normalizedType = energyType.toLowerCase();
  
  // Create the store with Zustand
  return create(
    devtools(
      (set, get) => ({
        // State
        energyType: normalizedType,
        data: [],
        loading: false,
        error: null,
        isModalOpen: false,
        selectedYear: new Date().getFullYear(),
        generationValue: {
          totalRenewable: '',
          geothermal: '',
          hydro: '',
          biomass: '',
          solar: '',
          wind: '',
          nonRenewable: '',
          totalPower: '',
          population: '',
          gdp: ''
        },
        isEditing: false,
        editId: null,
        yearRange: {
          startYear: new Date().getFullYear() - 4,
          endYear: new Date().getFullYear() + 1
        },
        
        // Actions
        fetchData: async () => {
          set({ loading: true, error: null });
          
          try {
            // Try to fetch from API
            const response = await api.get(`/api/predictions/${normalizedType}/`);
            const formattedData = response.data.predictions.map((item, index) => ({
              id: index + 1,
              year: item.Year,
              generation: parseFloat(item['Predicted Production']),
              dateAdded: new Date().toISOString(),
            }));
            
            set({ data: formattedData });
          } catch (error) {
            console.error(`Error fetching ${normalizedType} data:`, error);
            // We'll just set an empty array and let the component use sample data
            set({ data: [], error: error.message });
          } finally {
            set({ loading: false });
          }
        },
        
        // Modal actions
        openAddModal: () => {
          const currentYear = new Date().getFullYear();
          
          set({
            isModalOpen: true,
            isEditing: false,
            selectedYear: currentYear,
            generationValue: {
              totalRenewable: '',
              geothermal: '',
              hydro: '',
              biomass: '',
              solar: '',
              wind: '',
              nonRenewable: '',
              totalPower: '',
              population: '',
              gdp: ''
            }
          });
        },
        
        openEditModal: (row) => {
          set({
            isModalOpen: true,
            isEditing: true,
            editId: row.id,
            selectedYear: row.year,
            generationValue: {
              // For the simplified version with just 'generation' field
              ...(typeof row.generation === 'number' 
                ? { 
                    [normalizedType]: row.generation.toString(),
                    // Set other fields to empty for simple implementations
                    totalRenewable: '',
                    geothermal: '',
                    hydro: '',
                    biomass: '',
                    solar: '',
                    wind: '',
                    nonRenewable: '',
                    totalPower: '',
                    population: '',
                    gdp: ''
                  }
                // For the complex version with generation as an object
                : {
                    totalRenewable: row.generation.totalRenewable?.toString() || '',
                    geothermal: row.generation.geothermal?.toString() || '',
                    hydro: row.generation.hydro?.toString() || '',
                    biomass: row.generation.biomass?.toString() || '',
                    solar: row.generation.solar?.toString() || '',
                    wind: row.generation.wind?.toString() || '',
                    nonRenewable: row.generation.nonRenewable?.toString() || '',
                    totalPower: row.generation.totalPower?.toString() || '',
                    population: row.population?.toString() || '',
                    gdp: row.gdp?.toString() || ''
                  })
            }
          });
        },
        
        closeModal: () => set({ isModalOpen: false }),
        
        // Form handling
        setSelectedYear: (year) => set({ selectedYear: year }),
        
        updateGenerationValue: (field, value) => {
          set((state) => ({
            generationValue: {
              ...state.generationValue,
              [field]: value
            }
          }));
        },
        
        // For direct event handling from form elements
        handleGenerationChange: (event, field) => {
          const { value } = event.target;
          get().updateGenerationValue(field || event.target.name, value);
        },
        
        // Update year range for filtering
        setYearRange: (startYear, endYear) => {
          set({
            yearRange: {
              startYear: startYear !== undefined 
                ? startYear 
                : get().yearRange.startYear,
              endYear: endYear !== undefined 
                ? endYear 
                : get().yearRange.endYear
            }
          });
        },
        
        // Submitting data to API
        submitData: async () => {
          const { isEditing, editId, selectedYear, generationValue, energyType } = get();
          
          set({ loading: true, error: null });
          
          try {
            // Prepare the payload
            const payload = {
              Year: selectedYear,
              'Total Renewable Energy (GWh)': parseFloat(generationValue.totalRenewable) || 0,
              'Geothermal (GWh)': parseFloat(generationValue.geothermal) || 0,
              'Hydro (GWh)': parseFloat(generationValue.hydro) || 0,
              'Biomass (GWh)': parseFloat(generationValue.biomass) || 0,
              'Solar (GWh)': parseFloat(generationValue.solar) || 0,
              'Wind (GWh)': parseFloat(generationValue.wind) || 0,
              'Non-Renewable Energy (GWh)': parseFloat(generationValue.nonRenewable) || 0,
              'Total Power Generation (GWh)': parseFloat(generationValue.totalPower) || 0,
              'Population': parseFloat(generationValue.population) || 0,
              'Gross Domestic Product (GDP)': parseFloat(generationValue.gdp) || 0
            };
            
            if (isEditing) {
              // Update existing record
              await api.put(`/api/create/${energyType}/${editId}`, payload);
            } else {
              // Add new record
              await api.post('/api/create/', payload);
            }
            
            // Close modal and refresh data
            set({ isModalOpen: false });
            get().fetchData();
            
            return true;
          } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} ${energyType} data:`, error);
            set({ error: error.message });
            return false;
          } finally {
            set({ loading: false });
          }
        },
        
        // Delete a record
        deleteRecord: async (id) => {
          if (!confirm('Are you sure you want to delete this record?')) {
            return false;
          }
          
          set({ loading: true, error: null });
          
          try {
            await api.delete(`/api/predictions/${normalizedType}/${id}`);
            get().fetchData();
            return true;
          } catch (error) {
            console.error(`Error deleting ${normalizedType} data:`, error);
            set({ error: error.message });
            return false;
          } finally {
            set({ loading: false });
          }
        },
        
        // Export data to CSV
        exportData: (data) => {
          if (!data || data.length === 0) {
            console.warn('No data to export');
            return;
          }
          
          const headers = ['Year', `${energyType} Generation (GWh)`, 'Date Added'];
          const csvData = data.map(row => [
            row.year,
            typeof row.generation === 'number' ? row.generation : row.generation[normalizedType],
            new Date(row.dateAdded).toLocaleDateString()
          ]);
          
          const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
          ].join('\n');
          
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${energyType}_Generation_Data.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        
        // Calculate totals for renewable energy
        calculateTotals: () => {
          const { generationValue } = get();
          
          // Parse values, defaulting to 0 if empty or NaN
          const parseValue = (val) => {
            const parsed = parseFloat(val);
            return isNaN(parsed) ? 0 : parsed;
          };
          
          // Calculate renewable total
          const solar = parseValue(generationValue.solar);
          const hydro = parseValue(generationValue.hydro);
          const wind = parseValue(generationValue.wind);
          const biomass = parseValue(generationValue.biomass);
          const geothermal = parseValue(generationValue.geothermal);
          const renewableTotal = solar + hydro + wind + biomass + geothermal;
          
          // Calculate power total
          const nonRenewable = parseValue(generationValue.nonRenewable);
          const powerTotal = renewableTotal + nonRenewable;
          
          // Update the state with calculated totals
          set((state) => ({
            generationValue: {
              ...state.generationValue,
              totalRenewable: renewableTotal.toFixed(2),
              totalPower: powerTotal.toFixed(2)
            }
          }));
          
          return {
            renewableTotal,
            powerTotal
          };
        }
      }),
      {
        name: `${normalizedType}-energy-store`
      }
    )
  );
};

// Create individual stores for each energy type
export const useSolarStore = createEnergyStore('solar');
export const useWindStore = createEnergyStore('wind');
export const useHydroStore = createEnergyStore('hydro');
export const useGeothermalStore = createEnergyStore('geothermal');
export const useBiomassStore = createEnergyStore('biomass');

// Create a generic function to get the appropriate store based on energy type
export const getEnergyStore = (energyType) => {
  switch (energyType.toLowerCase()) {
    case 'solar':
      return useSolarStore;
    case 'wind':
      return useWindStore;
    case 'hydro':
    case 'hydropower':
      return useHydroStore;
    case 'geothermal':
      return useGeothermalStore;
    case 'biomass':
      return useBiomassStore;
    default:
      throw new Error(`Unsupported energy type: ${energyType}`);
  }
};

export default getEnergyStore;