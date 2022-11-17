const calculateCredit = (
  carbonIntensityLimit,
  carbonIntensityFuel,
  energyEffectivenessRatio,
  energyContent
) => {
  let credit = Number(carbonIntensityLimit) * Number(energyEffectivenessRatio)
  credit -= Number(carbonIntensityFuel)
  credit *= Number(energyContent)
  credit /= 1000000

  return credit
}

const getCarbonIntensityLimit = (creditCalculationValues, fuelClass) => {
  if (fuelClass === 'Diesel') {
    return creditCalculationValues.carbonIntensityLimit.diesel.toFixed(2)
  }

  if (fuelClass === 'Gasoline') {
    return creditCalculationValues.carbonIntensityLimit.gasoline.toFixed(2)
  }

  return '-'
}

const getCreditCalculationValues = (creditCalculationValues, id) => (
  creditCalculationValues.find(fuel => fuel.id === id)
)

const getDefaultCarbonIntensity = (values, selectedFuel, determinationType, fuelCodeId) => {
  if (selectedFuel.provisions.length === 1 ||
    (determinationType.theType === 'Default Carbon Intensity')) {
    return values.defaultCarbonIntensity.toFixed(2)
  }

  if (determinationType.theType === 'Fuel Code' && fuelCodeId && fuelCodeId !== '') {
    const { fuelCodes } = values
    const selectedFuelCode = getFuelCode(fuelCodes, fuelCodeId)

    return selectedFuelCode.carbonIntensity
  }

  if (determinationType.theType === 'Alternative') {
    return '-'
  }

  return '-'
}

const getEnergyEffectivenessRatio = (creditCalculationValues, fuelClass) => {
  let energyEffectivenessRatio = 0

  if (creditCalculationValues.energyEffectivenessRatio.diesel && fuelClass === 'Diesel') {
    energyEffectivenessRatio = creditCalculationValues.energyEffectivenessRatio.diesel.toFixed(1)
  } else if (creditCalculationValues.energyEffectivenessRatio.gasoline && fuelClass === 'Gasoline') {
    energyEffectivenessRatio = creditCalculationValues.energyEffectivenessRatio.gasoline.toFixed(1)
  }

  return energyEffectivenessRatio
}

const getEnergyContent = (creditCalculationValues, quantity) => {
  const { energyDensity } = creditCalculationValues
  return Number(energyDensity) * quantity
}

const getFuelCode = (fuelCodes, id) => {
  if (!fuelCodes) {
    return []
  }

  return fuelCodes.find(code => code.id === id)
}

const getSelectedFuel = (approvedFuels, value) => (
  approvedFuels.find(fuel => fuel.name === value)
)

const getSelectedProvision = (selectedFuel, value) => (
  selectedFuel.provisions.find(fuel => fuel.provision === value)
)

export {
  calculateCredit,
  getCarbonIntensityLimit,
  getCreditCalculationValues,
  getDefaultCarbonIntensity,
  getEnergyContent,
  getEnergyEffectivenessRatio,
  getFuelCode,
  getSelectedFuel,
  getSelectedProvision
}
