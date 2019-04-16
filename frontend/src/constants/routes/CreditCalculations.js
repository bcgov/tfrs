const BASE_PATH = '/credit_calculation';

const CREDIT_CALCULATIONS = {
  CARBON_INTENSITIES: `${BASE_PATH}/carbon_intensity_limits`,
  CARBON_INTENSITIES_DETAILS: `${BASE_PATH}/carbon_intensity_limits/view/:id`,
  CARBON_INTENSITIES_EDIT: `${BASE_PATH}/carbon_intensity_limits/edit/:id`,
  DEFAULT_CARBON_INTENSITIES: `${BASE_PATH}/default_carbon_intensities`,
  ENERGY_DENSITIES: `${BASE_PATH}/energy_densities`,
  ENERGY_EFFECTIVENESS_RATIO: `${BASE_PATH}/energy_effectiveness_ratios`,
  LIST: BASE_PATH
};

export default CREDIT_CALCULATIONS;
