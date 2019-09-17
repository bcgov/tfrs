const BASE_PATH = '/organizations';

const ORGANIZATIONS = {
  ADD_USER: `${BASE_PATH}/view/:organizationId/add-user`,
  BULLETIN: `https://www2.gov.bc.ca/assets/gov/farming-natural-resources-and-industry/electricity-alternative-energy/transportation/renewable-low-carbon-fuels/rlcf-013.pdf`,
  CREDIT_MARKET_REPORT: `https://www2.gov.bc.ca/assets/gov/farming-natural-resources-and-industry/electricity-alternative-energy/transportation/renewable-low-carbon-fuels/rlcf-017.pdf`,
  DETAILS: `${BASE_PATH}/view/:id`,
  EDIT: `${BASE_PATH}/edit/:id`,
  EXPORT: `${BASE_PATH}/xls`,
  LIST: BASE_PATH,
  MINE: `${BASE_PATH}/mine`,
  ADD: `${BASE_PATH}/add`,
  ROLES: `${BASE_PATH}/roles`,
  PART_3: `https://www2.gov.bc.ca/gov/content?id=053E5694562A4F538D73A427B3B43DEC`
};

export default ORGANIZATIONS;
