import * as Yup from 'yup';

/**
 * Energy data validation schema for Formik
 */
export const energyValidationSchema = Yup.object().shape({
  year: Yup.number()
    .required('Year is required')
    .integer('Year must be an integer')
    .min(1900, 'Year must be at least 1900')
    .max(2100, 'Year must be at most 2100'),
  
  totalRenewable: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .moreThan(-0.01, 'Value cannot be negative')
    .typeError('Must be a number'),
  
  geothermal: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Geothermal value is required')
    .min(0, 'Value cannot be negative')
    .typeError('Must be a number'),
  
  hydro: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Hydro value is required')
    .min(0, 'Value cannot be negative')
    .typeError('Must be a number'),
  
  biomass: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Biomass value is required')
    .min(0, 'Value cannot be negative')
    .typeError('Must be a number'),
  
  solar: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Solar value is required')
    .min(0, 'Value cannot be negative')
    .typeError('Must be a number'),
  
  wind: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Wind value is required')
    .min(0, 'Value cannot be negative')
    .typeError('Must be a number'),
  
  nonRenewable: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Non-renewable value is required')
    .min(0, 'Value cannot be negative')
    .typeError('Must be a number'),
  
  totalPower: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .min(0, 'Value cannot be negative')
    .typeError('Must be a number'),
  
  population: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Population value is required')
    .min(0, 'Value cannot be negative')
    .typeError('Must be a number'),
  
  gdp: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('GDP value is required')
    .min(0, 'Value cannot be negative')
    .typeError('Must be a number'),
});

/**
 * Transform form values to API payload format
 * @param {Object} formValues - Values from Formik form
 * @returns {Object} Formatted API payload
 */
export const transformFormValuesToPayload = (formValues) => {
  // Convert string values to numbers where needed
  const getValue = (key) => {
    const value = formValues[key];
    // Return empty string as null, but 0 as 0
    if (value === '') return null;
    // Parse string as float if it's a string
    return typeof value === 'string' ? parseFloat(value) : value;
  };

  return {
    Year: formValues.year,
    'Total Renewable Energy (GWh)': getValue('totalRenewable'),
    'Geothermal (GWh)': getValue('geothermal'),
    'Hydro (GWh)': getValue('hydro'),
    'Biomass (GWh)': getValue('biomass'),
    'Solar (GWh)': getValue('solar'),
    'Wind (GWh)': getValue('wind'),
    'Non-Renewable Energy (GWh)': getValue('nonRenewable'),
    'Total Power Generation (GWh)': getValue('totalPower'),
    'Population': getValue('population'),
    'Gross Domestic Product (GDP)': getValue('gdp')
  };
};

/**
 * Transform API data to match form field names
 * @param {Object} apiData - Data from API
 * @returns {Object} Formatted form values
 */
export const transformApiDataToFormValues = (apiData) => {
  // Helper function to safely convert values to strings
  const safeToString = (value) => {
    if (value === null || value === undefined) return '';
    return value.toString();
  };

  return {
    year: apiData.Year || new Date().getFullYear(),
    totalRenewable: safeToString(apiData['Total Renewable Energy (GWh)']),
    geothermal: safeToString(apiData['Geothermal (GWh)']),
    hydro: safeToString(apiData['Hydro (GWh)']),
    biomass: safeToString(apiData['Biomass (GWh)']),
    solar: safeToString(apiData['Solar (GWh)']),
    wind: safeToString(apiData['Wind (GWh)']),
    nonRenewable: safeToString(apiData['Non-Renewable Energy (GWh)']),
    totalPower: safeToString(apiData['Total Power Generation (GWh)']),
    population: safeToString(apiData['Population']),
    gdp: safeToString(apiData['Gross Domestic Product (GDP)'])
  };
};

/**
 * Calculate totals based on individual energy values
 * @param {Object} values - Form values
 * @returns {Object} Updated form values with calculated totals
 */
export const calculateTotals = (values) => {
  // Parse values, defaulting to 0 if empty or NaN
  const parseValue = (val) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Calculate renewable total
  const solar = parseValue(values.solar);
  const hydro = parseValue(values.hydro);
  const wind = parseValue(values.wind);
  const biomass = parseValue(values.biomass);
  const geothermal = parseValue(values.geothermal);
  const renewableTotal = solar + hydro + wind + biomass + geothermal;
  
  // Calculate power total
  const nonRenewable = parseValue(values.nonRenewable);
  const powerTotal = renewableTotal + nonRenewable;
  
  return {
    ...values,
    totalRenewable: renewableTotal.toFixed(2),
    totalPower: powerTotal.toFixed(2)
  };
};

/**
 * Generate initial form values for Formik
 * @param {Object} data - Optional data to pre-populate the form
 * @returns {Object} Initial form values
 */
export const generateInitialValues = (data = {}) => {
  return {
    year: data.year || new Date().getFullYear(),
    totalRenewable: data.totalRenewable || '',
    geothermal: data.geothermal || '',
    hydro: data.hydro || '',
    biomass: data.biomass || '',
    solar: data.solar || '',
    wind: data.wind || '',
    nonRenewable: data.nonRenewable || '',
    totalPower: data.totalPower || '',
    population: data.population || '',
    gdp: data.gdp || ''
  };
};

/**
 * Validate specific form field - useful for onChange validation
 * @param {string} field - Field name to validate
 * @param {any} value - Field value
 * @returns {string|null} Error message or null if valid
 */
export const validateField = async (field, value) => {
  try {
    // Get the validation schema for this field
    const fieldSchema = energyValidationSchema.fields[field];
    
    if (!fieldSchema) {
      return null; // No schema for this field
    }
    
    // Validate the value
    await fieldSchema.validate(value);
    return null; // Valid
  } catch (error) {
    return error.message; // Return error message
  }
};

export default {
  transformFormValuesToPayload,
  transformApiDataToFormValues,
  calculateTotals,
  energyValidationSchema,
  generateInitialValues,
  validateField
};