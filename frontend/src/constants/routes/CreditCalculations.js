const BASE_PATH = '/admin/credit_calculation';
const API_BASE_PATH = '/credit_calculation';

const CREDIT_CALCULATIONS = {
  CARBON_INTENSITIES: `${BASE_PATH}/carbon_intensity_limits`,
  CARBON_INTENSITIES_API: `${API_BASE_PATH}/carbon_intensity_limits`,
  CARBON_INTENSITIES_DETAILS: `${BASE_PATH}/carbon_intensity_limits/view/:id`,
  CARBON_INTENSITIES_EDIT: `${BASE_PATH}/carbon_intensity_limits/edit/:id`,
  DEFAULT_CARBON_INTENSITIES: `${BASE_PATH}/default_carbon_intensities`,
  DEFAULT_CARBON_INTENSITIES_API: `${API_BASE_PATH}/default_carbon_intensities`,
  DEFAULT_CARBON_INTENSITIES_DETAILS: `${BASE_PATH}/default_carbon_intensities/view/:id`,
  DEFAULT_CARBON_INTENSITIES_EDIT: `${BASE_PATH}/default_carbon_intensities/edit/:id`,
  ENERGY_DENSITIES: `${BASE_PATH}/energy_densities`,
  ENERGY_DENSITIES_API: `${API_BASE_PATH}/energy_densities`,
  ENERGY_DENSITIES_DETAILS: `${BASE_PATH}/energy_densities/view/:id`,
  ENERGY_DENSITIES_EDIT: `${BASE_PATH}/energy_densities/edit/:id`,
  ENERGY_EFFECTIVENESS_RATIO: `${BASE_PATH}/energy_effectiveness_ratios`,
  ENERGY_EFFECTIVENESS_RATIO_API: `${API_BASE_PATH}/energy_effectiveness_ratios`,
  ENERGY_EFFECTIVENESS_RATIO_DETAILS: `${BASE_PATH}/energy_effectiveness_ratios/view/:id`,
  ENERGY_EFFECTIVENESS_RATIO_EDIT: `${BASE_PATH}/energy_effectiveness_ratios/edit/:id`,
  EXPECTED_USES: `${API_BASE_PATH}/expected_uses`,
  FUEL_CLASSES: `${API_BASE_PATH}/fuel_classes`,
  FUEL_TYPES_API: `${API_BASE_PATH}/fuel_types`,
  LIST: BASE_PATH,
  NOTIONAL_TRANFER_TYPES: `${API_BASE_PATH}/notional_transfer_types`,
  PETROLEUM_CARBON_INTENSITIES: `${BASE_PATH}/petroleum_carbon_intensities`,
  PETROLEUM_CARBON_INTENSITIES_API: `${API_BASE_PATH}/petroleum_carbon_intensities`,
  PETROLEUM_CARBON_INTENSITIES_DETAILS: `${BASE_PATH}/petroleum_carbon_intensities/view/:id`,
  PETROLEUM_CARBON_INTENSITIES_EDIT: `${BASE_PATH}/petroleum_carbon_intensities/edit/:id`
};

export default CREDIT_CALCULATIONS;
