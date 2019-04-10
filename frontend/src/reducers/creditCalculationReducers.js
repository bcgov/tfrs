const MOCKDATA_energyEffectivenessRatios = {
  items: [{
    name: 'Hydrogen',
    effectiveDate: '2017-01-01',
    expiryDate: null,
    energyEffectivenessRatio: {
      diesel: {
        fuel: 'Diesel Class',
        ratio: 1.9
      },
      gasoline: {
        fuel: 'Gasoline Class',
        ratio: 2.5
      }
    }
  }, {
    name: 'LNG',
    effectiveDate: '2017-01-01',
    expiryDate: null,
    energyEffectivenessRatio: {
      diesel: {
        fuel: 'Diesel Class',
        ratio: 1.0
      }
    }
  }, {
    name: 'CNG',
    effectiveDate: '2017-01-01',
    expiryDate: null,
    energyEffectivenessRatio: {
      diesel: {
        fuel: 'Diesel Class',
        ratio: 0.9
      },
      gasoline: {
        fuel: 'Gasoline Class',
        ratio: 1.0
      }
    }
  }, {
    name: 'Electricity',
    effectiveDate: '2017-01-01',
    expiryDate: null,
    energyEffectivenessRatio: {
      diesel: {
        fuel: 'Diesel Class',
        ratio: 2.7
      },
      gasoline: {
        fuel: 'Gasoline Class',
        ratio: 3.4
      }
    }
  }, {
    name: 'Propane',
    effectiveDate: '2017-01-01',
    expiryDate: null,
    energyEffectivenessRatio: {
      diesel: {
        fuel: 'Diesel Class',
        ratio: 1.0
      },
      gasoline: {
        fuel: 'Gasoline Class',
        ratio: 1.0
      }
    }
  }],
  isFetching: false,
  success: true,
  errors: []
};

const MOCKDATA_carbonIntensityLimits = {
  items: [{
    compliancePeriod: 3, // id, not name
    name: '2017',
    effectiveDate: '20170101T000000-0800',
    expiryDate: '20180101T000000-0800',
    limits: {
      diesel: {
        fuel: 'Diesel Class',
        density: '80.02',
        unit: 'gCO₂e/MJ'
      },
      gasoline: {
        fuel: 'Gasoline Class Class',
        density: '84.71',
        unit: 'gCO₂e/MJ'
      }
    }
  }, {
    compliancePeriod: 4,
    name: '2018 and thereafter',
    effectiveDate: '20170101T000000-0800',
    expiryDate: null,
    limits: {
      diesel: {
        fuel: 'Diesel Class',
        density: '89.20',
        unit: 'gCO₂e/MJ'
      },
      gasoline: {
        fuel: 'Gasoline Class Class',
        density: '82.61',
        unit: 'gCO₂e/MJ'
      }
    }
  }],
  isFetching: false,
  success: true,
  errors: []
};

const MOCKDATA_energyDensities = {
  items: [{
    name: 'Propane',
    energyDensity: {
      density: 25.47,
      unitOfMeasure: 'MJ/L'
    }
  }, {
    name: 'LNG',
    energyDensity: {
      density: 52.46,
      unitOfMeasure: 'MJ/kg'
    }
  }, {
    name: 'CNG',
    energyDensity: {
      density: 37.85,
      unitOfMeasure: 'MJ/m³'
    }
  }, {
    name: 'Electricity',
    energyDensity: {
      density: 3.60,
      unitOfMeasure: 'MJ/kWh'
    }
  }, {
    name: 'Hydrogen',
    energyDensity: {
      density: 141.24,
      unitOfMeasure: 'MJ/kg'
    }
  }],
  isFetching: false,
  success: true,
  errors: []
};

const MOCKDATA_defaultCarbonIntensities = {
  items: [{
    name: 'Propane',
    carbonIntensity: 75.35
  }, {
    name: 'LNG',
    carbonIntensity: 112.65
  }, {
    name: 'CNG',
    carbonIntensity: 63.64
  }, {
    name: 'Electricity',
    carbonIntensity: 19.73
  }, {
    name: 'Hydrogen',
    carbonIntensity: 96.82
  }],
  isFetching: false,
  success: true,
  errors: []
};

const MOCKDATA_fuelTypes = {
  items: [{
    name: 'Biodiesel',
    alternatives: ['biodiesel']
  }, {
    name: 'CNG',
    alternatives: ['compressed natural gas']
  }, {
    name: 'Diesel fuel produced from biomass',
    alternatives: ['renewable diesel fuel', 'renewable diesel']
  }, {
    name: 'Electricity',
    alternatives: []
  }, {
    name: 'Ethanol produced from biomass',
    alternatives: ['ethanol']
  }, {
    name: 'Hydrogen',
    alternatives: []
  }, {
    name: 'Hydrogenation-derived renewable diesel fuel',
    alternatives: ['HDRD', 'hydrogenation-derived renewable diesel']
  }, {
    name: 'LNG',
    alternatives: ['liquefied natual gas']
  }, {
    name: 'Natural gas-based gasoline',
    alternatives: []
  }, {
    name: 'Petroleum-based diesel fuel',
    alternatives: ['diesel fuel', 'diesel', 'petroleum-based diesel']
  }, {
    name: 'Petroleum-based gasoline',
    alternatives: ['gasoline']
  }, {
    name: 'Propane',
    alternatives: []
  }, {
    name: 'Gasoline produced from biomass',
    alternatives: ['renewable gasoline']
  }],
  isFetching: false,
  success: true,
  errors: []
};

const energyEffectivenessRatios = (state = MOCKDATA_energyEffectivenessRatios, action) => (state);
const defaultCarbonIntensities = (state = MOCKDATA_defaultCarbonIntensities, action) => (state);
const energyDensities = (state = MOCKDATA_energyDensities, action) => (state);
const carbonIntensityLimits = (state = MOCKDATA_carbonIntensityLimits, action) => (state);
const fuelTypes = (state = MOCKDATA_fuelTypes, action) => (state);

export {
  energyEffectivenessRatios, defaultCarbonIntensities,
  energyDensities, carbonIntensityLimits, fuelTypes
};
