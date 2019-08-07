/*
 * Service Layer
 *
 * Move projection and mapping out of UI layer
 */

import axios from "axios";
import * as Routes from "../../constants/routes";

class ComplianceReportingService {

  static getAvailableScheduleDFuels(complianceReport, scheduleState) {
    let source;

    if (scheduleState.scheduleD) {
      source = scheduleState.scheduleD;
    } else if (complianceReport && complianceReport.scheduleD) {
      source = complianceReport.scheduleD;
    }

    if (!source || !source.sheets) {
      return [];
    }

    let fuels = [];

    for (let [i, sheet] of source.sheets.entries()) {
      const intensity = this.computeScheduleDFuelIntensity(sheet);
      fuels.push({
        id: i,
        fuelType: sheet.fuelType,
        fuelClass: sheet.fuelClass,
        intensity,
        descriptiveName: `${sheet.fuelType} ${intensity}`
      });
    }

    return fuels;
  }

  static computeScheduleDFuelIntensity(sheet) {
    let total = 0.0;
    let empty = true;

    for (const output of sheet.outputs) {
      total += parseFloat(output.intensity);
      empty = false;
    }

    total = (total / 1000).toFixed(2);

    return empty ? null : total;
  }

  static _fetchCalculationValuePromise(compliancePeriod) {
    if (!ComplianceReportingService._cache) {
      ComplianceReportingService._cache = [];
    }

    const cached = ComplianceReportingService._cache.find(e => e.key === compliancePeriod);
    if (cached) {
      return new Promise((resolve) => {
        resolve(cached.data);
      });
    }

    return new Promise((resolve) => {
      axios.get(`${Routes.BASE_URL}${Routes.CREDIT_CALCULATIONS.FUEL_TYPES_API}`, {
        params: {
          compliance_period: compliancePeriod
        }
      }).then((response) => {

        // enhance the supplied data with synthetic properties
        for (let i = 0; i < response.data.length; i++) {
          for (let j = 0; j < response.data[i].fuelCodes.length; j++) {
            const fc = response.data[i].fuelCodes[j];
            response.data[i].fuelCodes[j].descriptiveName = `${fc.fuelCode}${fc.fuelCodeVersion}.${fc.fuelCodeVersionMinor}`;
          }
          for (let j = 0; j < response.data[i].provisions.length; j++) {
            const p = response.data[i].provisions[j];
            response.data[i].provisions[j].descriptiveName = `${p.provision} - ${p.description}`;
          }
        }

        ComplianceReportingService._cache.push({
          key: compliancePeriod,
          data: response.data
        });
        resolve(response.data);
      });
    });
  }

  static loadData(compliancePeriod) {
    if (!ComplianceReportingService._cache) {
      ComplianceReportingService._cache = [];
    }
    const cached = ComplianceReportingService._cache.find(e => e.key === compliancePeriod);
    if (!cached) {
      return this._fetchCalculationValuePromise(compliancePeriod);
    }
    return new Promise(resolve => {
      resolve();
    });
  }

  static computeCredits(context, sourceValues) {

    const {
      compliancePeriod,
      availableScheduleDFuels
    } = context;

    const {
      fuelClass,
      fuelType,
      provisionOfTheAct,
      customIntensity,
      fuelCode,
      scheduleDIntensityValue,
      quantity
    } = sourceValues;

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
          singleProvisionAvailable: false
        }
      };
    }

    const cached = ComplianceReportingService._cache.find(e => e.key === compliancePeriod);
    if (!cached) {
      throw {msg: 'you must seed the cache for this compliancePeriod first'}
    }
    const response = cached.data;

    const fuel = response.find(e => e.name === fuelType);
    const filteredScheduleDFuels = availableScheduleDFuels.filter(f =>
      (f.fuelType === fuel.name) &&
      (fuel.fuelClasses.some(fc => f.fuelClass === fc.fuelClass))
    );

    let result = {
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
        energyDensity: fuel.energyDensity,
        carbonIntensityFuel: null,
        carbonIntensityLimit: null,
        credits: null,
        debits: null,
        energyContent: null,
        customIntensityValue: null
      },
      parameters: {
        fuelClasses: (fuel ? fuel.fuelClasses : []),
        fuelCodes: (fuel ? fuel.fuelCodes : []),
        provisions: (fuel ? fuel.provisions : []),
        scheduleDSelections: filteredScheduleDFuels,
        unitOfMeasure: (fuel ? fuel.unitOfMeasure : null),
        fuelCodeSelectionRequired: false,
        scheduleDSelectionRequired: false,
        intensityInputRequired: false,
        singleFuelClassAvailable: false,
        singleProvisionAvailable: false
      }
    };

    if (result.parameters.fuelClasses.length === 1) {
      result.parameters.singleFuelClassAvailable = true;
      result.inputs.fuelClass = result.parameters.fuelClasses[0].fuelClass;
    }

    if (result.parameters.provisions.length === 1) {
      result.parameters.singleProvisionAvailable = true;
      result.inputs.provisionOfTheAct = result.parameters.provisions[0].provision;
    }

// select carbon intensity limit
    switch (result.inputs.fuelClass) {
      case 'Diesel':
        result.outputs.carbonIntensityLimit = fuel.carbonIntensityLimit.diesel;
        result.outputs.energyEffectivenessRatio = fuel.energyEffectivenessRatio.diesel;
        break;
      case 'Gasoline':
        result.outputs.carbonIntensityLimit = fuel.carbonIntensityLimit.gasoline;
        result.outputs.energyEffectivenessRatio = fuel.energyEffectivenessRatio.gasoline;
        break;
      default:
        break;
    }

    const provisionObject = fuel.provisions.find(p => p.provision === provisionOfTheAct);

// select carbon intensity of fuel
    if (provisionObject) {
      switch (provisionObject.description) {
        case 'Default Carbon Intensity Value':
          result.outputs.carbonIntensityFuel = fuel.defaultCarbonIntensity;
          break;
        case 'Alternative Method':
          result.outputs.carbonIntensityFuel = result.inputs.customIntensity;
          result.outputs.customIntensityValue = result.inputs.customIntensity;
          result.parameters.intensityInputRequired = true;
          break;
        case 'Approved fuel code': {
          result.parameters.fuelCodeSelectionRequired = true;
          const fuelCodeObject = fuel.fuelCodes.find(f => String(f.id) === String(fuelCode));
          if (fuelCodeObject) {
            result.outputs.carbonIntensityFuel = fuelCodeObject.carbonIntensity;
          }
        }
          break;
        case 'GHGenius modelled': {
          result.parameters.scheduleDSelectionRequired = true;
          const scheduleDEntryObject = availableScheduleDFuels.find(f => String(f.id) === String(fuelCode));
          if (scheduleDEntryObject) {
            result.outputs.carbonIntensityFuel = scheduleDEntryObject.intensity;
          }
        }
          break;
        case 'Prescribed carbon intensity':
          result.outputs.carbonIntensityFuel = fuel.defaultCarbonIntensity; // is this correct?
          break;
        default:
          break;
      }
    }

// compute energy content
    if (result.inputs.quantity) {
      result.outputs.energyContent = Number(result.outputs.energyDensity) * Number(result.inputs.quantity);
    }

// compute credit or debit
    if (result.outputs.carbonIntensityFuel && result.outputs.energyContent &&
      result.outputs.carbonIntensityLimit && result.outputs.energyEffectivenessRatio) {
      let credit = Number(result.outputs.carbonIntensityLimit) * Number(result.outputs.energyEffectivenessRatio);
      credit -= Number(result.outputs.carbonIntensityFuel);
      credit *= Number(result.outputs.energyContent);
      credit /= 1000000;
      if (credit < 0) {
        result.outputs.debits = -credit;
      } else {
        result.outputs.credits = credit;
      }
    }

    return result;
  }

}

export default ComplianceReportingService;
