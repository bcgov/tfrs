/*
 * Service Layer
 *
 * Move projection and mapping out of UI layer
 */

import axios from 'axios'
import * as Routes from '../../constants/routes'

class ComplianceReportingService {
  static getAvailableScheduleDFuels (complianceReport, scheduleState) {
    let source

    if (scheduleState.scheduleD) {
      source = scheduleState.scheduleD
    } else if (complianceReport && complianceReport.scheduleD) {
      source = complianceReport.scheduleD
    }

    if (!source || !source.sheets) {
      return []
    }

    const fuels = []

    for (const [i, sheet] of source.sheets.entries()) {
      const intensity = this.computeScheduleDFuelIntensity(sheet)
      fuels.push({
        id: i,
        fuelType: sheet.fuelType,
        fuelClass: sheet.fuelClass,
        intensity,
        descriptiveName: `${sheet.fuelType} ${intensity}`
      })
    }

    return fuels
  }

  static computeScheduleDFuelIntensity (sheet) {
    let total = 0.0
    let empty = true

    for (const output of sheet.outputs) {
      total += parseFloat(output.intensity)
      empty = false
    }

    total = (total / 1000).toFixed(2)

    return empty ? null : total
  }

  static _fetchCalculationValuePromise (compliancePeriod) {
    if (!ComplianceReportingService._cache) {
      ComplianceReportingService._cache = []
    }

    const cached = ComplianceReportingService._cache.find(e => e.key === compliancePeriod)
    if (cached) {
      return new Promise((resolve) => {
        resolve(cached.data)
      })
    }

    return new Promise((resolve) => {
      axios.get(`${Routes.BASE_URL}${Routes.CREDIT_CALCULATIONS.FUEL_TYPES_API}`, {
        params: {
          compliance_period: compliancePeriod
        }
      }).then((response) => {
        // enhance the supplied data with synthetic properties
        for (let i = 0; i < response.data.length; i += 1) {
          for (let j = 0; j < response.data[i].fuelCodes.length; j += 1) {
            const fc = response.data[i].fuelCodes[j]
            response.data[i].fuelCodes[j].descriptiveName = `${fc.fuelCode}${fc.fuelCodeVersion}.${fc.fuelCodeVersionMinor}`
          }
          for (let j = 0; j < response.data[i].provisions.length; j += 1) {
            const p = response.data[i].provisions[j]
            response.data[i].provisions[j].descriptiveName = `${p.provision} - ${p.description}`
          }
        }

        ComplianceReportingService._cache.push({
          key: compliancePeriod,
          data: response.data
        })
        resolve(response.data)
      })
    })
  }

  static loadData (compliancePeriod) {
    if (!ComplianceReportingService._cache) {
      ComplianceReportingService._cache = []
    }
    const cached = ComplianceReportingService._cache.find(e => e.key === compliancePeriod)
    if (!cached) {
      return this._fetchCalculationValuePromise(compliancePeriod)
    }
    return new Promise((resolve) => {
      resolve()
    })
  }

  static computeCredits (context, sourceValues) {
    const {
      compliancePeriod,
      availableScheduleDFuels
    } = context

    const {
      fuelClass,
      fuelType,
      provisionOfTheAct,
      customIntensity,
      fuelCode,
      scheduleDIntensityValue,
      quantity,
      scheduleD_sheetIndex // eslint-disable-line camelcase
    } = sourceValues

    if (!fuelType) {
      return {
        outputs: {
          energyEffectivenessRatio: null,
          energyDensity: null,
          carbonIntensityFuel: null,
          carbonIntensityLimit: null,
          credits: null,
          debits: null,
          energyContent: null,
          customIntensityValue: null
        },
        parameters: {
          fuelClasses: [],
          fuelCodes: [],
          provisions: [],
          scheduleDSelections: [],
          unitOfMeasure: [],
          fuelCodeSelectionRequired: false,
          scheduleDSelectionRequired: false,
          intensityInputRequired: false,
          singleFuelClassAvailable: false,
          singleProvisionAvailable: false,
          scheduleD_sheetIndex: false
        }
      }
    }

    const cached = ComplianceReportingService._cache.find(e => e.key === compliancePeriod)
    if (!cached) {
      throw new Error('you must seed the cache for this compliancePeriod first')
    }
    const response = cached.data

    const fuel = response.find(e =>
      String(e.name).toUpperCase() === String(fuelType).toUpperCase())

    let selectedFuelClass = null

    if (fuel && fuel.fuelClasses && fuelClass) {
      selectedFuelClass = fuel.fuelClasses.find(item => (
        String(item.fuelClass).toUpperCase() === String(fuelClass).toUpperCase()
      ))
    }

    let selectedProvision = null

    if (fuel && fuel.provisions && provisionOfTheAct) {
      selectedProvision = fuel.provisions.find((item) => {
        const inputProvisions = provisionOfTheAct.split('-')

        return String(item.provision).toUpperCase().indexOf(
          inputProvisions[0].trim().toUpperCase()
        ) >= 0
      })
    }

    const filteredScheduleDFuels = availableScheduleDFuels.filter(f =>
      (f.fuelType === fuel.name && f.fuelClass === fuelClass))

    const result = {
      inputs: {
        fuelClass,
        fuelType,
        provisionOfTheAct,
        fuelCode,
        quantity,
        customIntensity,
        scheduleDIntensityValue
      },
      outputs: {
        energyEffectivenessRatio: null,
        energyDensity: (fuel ? fuel.energyDensity : null),
        carbonIntensityFuel: null,
        carbonIntensityLimit: null,
        credits: null,
        debits: null,
        energyContent: null,
        customIntensityValue: null
      },
      parameters: {
        fuelType: (fuel ? fuel.name : null),
        fuelClass: (selectedFuelClass ? selectedFuelClass.fuelClass : null),
        fuelClasses: (fuel ? fuel.fuelClasses : []),
        fuelCodes: (fuel ? fuel.fuelCodes : []),
        provision: (selectedProvision || null),
        provisions: (fuel ? fuel.provisions : []),
        scheduleDSelections: filteredScheduleDFuels,
        unitOfMeasure: (fuel ? fuel.unitOfMeasure : null),
        fuelCodeSelectionRequired: false,
        scheduleDSelectionRequired: false,
        intensityInputRequired: false,
        singleFuelClassAvailable: false,
        singleProvisionAvailable: false,
        scheduleD_sheetIndex // eslint-disable-line camelcase
      }
    }

    if (result.parameters.fuelClasses.length === 1) {
      result.parameters.singleFuelClassAvailable = true
      result.inputs.fuelClass = result.parameters.fuelClasses[0].fuelClass
    }

    if (result.parameters.provisions.length === 1) {
      result.parameters.singleProvisionAvailable = true
      result.inputs.provisionOfTheAct = result.parameters.provisions[0].provision
    }

    // select carbon intensity limit
    switch (String(result.inputs.fuelClass).toUpperCase()) {
      case 'DIESEL':
        result.outputs.carbonIntensityLimit = fuel.carbonIntensityLimit.diesel
        result.outputs.energyEffectivenessRatio = fuel.energyEffectivenessRatio.diesel
        break
      case 'GASOLINE':
        result.outputs.carbonIntensityLimit = fuel.carbonIntensityLimit.gasoline
        result.outputs.energyEffectivenessRatio = fuel.energyEffectivenessRatio.gasoline
        break
      default:
        break
    }

    let provisionObject = null

    if (fuel) {
      provisionObject = fuel.provisions.find(p => p.provision === provisionOfTheAct)
    }

    // select carbon intensity of fuel
    if (provisionObject) {
      switch (provisionObject.description) {
        case 'Default Carbon Intensity Value':
          result.outputs.carbonIntensityFuel = fuel.defaultCarbonIntensity
          break
        case 'Alternative Method':
          result.outputs.carbonIntensityFuel = result.inputs.customIntensity
          result.outputs.customIntensityValue = result.inputs.customIntensity
          result.parameters.intensityInputRequired = true
          break
        case 'Approved fuel code': {
          result.parameters.fuelCodeSelectionRequired = true
          const fuelCodeObject = fuel.fuelCodes.find(f => String(f.id) === String(fuelCode))
          if (fuelCodeObject) {
            result.outputs.carbonIntensityFuel = fuelCodeObject.carbonIntensity
          }
        }
          break
        case 'GHGenius modelled': {
          result.parameters.scheduleDSelectionRequired = true
          const scheduleDEntryObject = availableScheduleDFuels.find(f => String(f.id) === String(fuelCode))
          if (scheduleDEntryObject) {
            result.outputs.carbonIntensityFuel = scheduleDEntryObject.intensity
          }
        }
          break
        case 'Prescribed carbon intensity':
          result.outputs.carbonIntensityFuel = fuel.defaultCarbonIntensity // is this correct?
          break
        default:
          break
      }
    }

    // compute energy content
    if (result.inputs.quantity) {
      result.outputs.energyContent = Number(result.outputs.energyDensity) * Number(result.inputs.quantity)
    }

    // compute credit or debit
    if (result.outputs.carbonIntensityFuel && result.outputs.energyContent &&
      result.outputs.carbonIntensityLimit && result.outputs.energyEffectivenessRatio) {
      let credit = Number(result.outputs.carbonIntensityLimit) * Number(result.outputs.energyEffectivenessRatio)
      credit -= Number(result.outputs.carbonIntensityFuel)
      credit *= Number(result.outputs.energyContent)
      credit /= 1000000
      if (credit < 0) {
        result.outputs.debits = -credit
      } else {
        result.outputs.credits = credit
      }
    }

    return result
  }

  static computeSummaryValues (context, sourceValues) {
    // const {
    //   compliancePeriod,
    //   availableScheduleDFuels,
    //   scheduleA,
    //   scheduleB
    // } = context

    const {
      line6,
      line8,
      line17,
      line19
    } = sourceValues

    const result = {
      inputs: {
        line6,
        line8,
        line17,
        line19
      },
      outputs: {
        // gasoline class
        line1: null,
        line2: null,
        line3: null,
        line4: null,
        line5: null,
        line7: null,
        line9: null,
        line11: null,

        // diesel class
        line12: null,
        line13: null,
        line14: null,
        line15: null,
        line16: null,
        line18: null,
        line20: null,
        line21: null,
        line22: null,

        // part3,
        line23: null,
        line24: null,
        line25: null,
        line26: null,
        line27: null,
        line28: null,

        // penalty
        totalPenalty: null
      },
      parameters: {}
    }

    result.inputs = {
      ...result.inputs,
      line6,
      line8,
      line17,
      line19
    }

    return result
  }
}

export default ComplianceReportingService
