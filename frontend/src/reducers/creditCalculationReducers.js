const MOCKDATA_energyEffectivenessRatios = {
  items: [
    {
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
    }
  ],
  isFetching: false,
  success: true,
  errors: []
};

const MOCKDATA_carbonIntensityLimits = {
  items: [

        {
          compliancePeriod: 3, //id, not name
          name: '2017',
          effectiveDate: '20170101T000000-0800',
          expiryDate: '20180101T000000-0800',
          limits: {
            diesel: {
              fuel: "Diesel Class",
              density: "80.02",
              unit: "gCO₂e/MJ"
            },
            gasoline: {
              fuel: "Gasoline Class Class",
              density: "84.71",
              unit: "gCO₂e/MJ"
            }
          }
        },
        {
          compliancePeriod: 4,
          name: '2018 and thereafter',
          effectiveDate: '20170101T000000-0800',
          expiryDate: null,
          limits: {
            diesel: {
              fuel: "Diesel Class",
              density: "89.20",
              unit: "gCO₂e/MJ"
            },
            gasoline: {
              fuel: "Gasoline Class Class",
              density: "82.61",
              unit: "gCO₂e/MJ"
            }
          }
        }
      ],
  isFetching: false,
  success: true,
  errors: []
};

const MOCKDATA_energyDensities = {
  items: [{
    compliancePeriod: 4,
    name: '2018 and thereafter',
    effectiveDate: '20170101T000000-0800',
    expiryDate: null,
    energyDensities: [
      {
        fuel: "Biodiesel",
        density: "34.40",
        unit: "MJ/L"
      },
      {
        fuel: "CNG",
        density: "34.85",
        unit: "MJ/m³"
      }
    ]

  }],
  isFetching: false,
  success: true,
  errors: []
};

const MOCKDATA_defaultCarbonIntensities =
  {
    items: [{
      compliancePeriod: 4,
      effectiveDate: '20170101T000000-0800', //should match value from compliancePeriod
      expiryDate: null,
      energyDensities: [
        {
          fuel: "Propane",
          density: "73.35",
          unit: "gCO₂e/MJ"
        },
        {
          fuel: "CNG",
          density: "63.64",
          unit: "gCO₂e/MJ"
        }
      ]

    }],
    isFetching: false,
    success: true,
    errors: []
  };


const energyEffectivenessRatios = (state = MOCKDATA_energyEffectivenessRatios, action) => (state);
const defaultCarbonIntensities = (state = MOCKDATA_defaultCarbonIntensities, action) => (state);
const energyDensities = (state = MOCKDATA_energyDensities, action) => (state);
const carbonIntensityLimits = (state = MOCKDATA_carbonIntensityLimits, action) => (state);

export {energyEffectivenessRatios, defaultCarbonIntensities, energyDensities, carbonIntensityLimits};
