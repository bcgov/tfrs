/*
 * Service Layer
 *
 * Move projection and mapping out of UI layer
 */

import axios from "axios";
import * as Routes from "../../constants/routes";

class ComplianceReportingService {

  static getAvailableScheduleDFuels(complianceReport) {

    if (!complianceReport) {
      throw 'complianceReport is a required parameter'
    }

    if (!complianceReport.scheduleD)
      return [];

    let fuels = [];

    for (let [i, sheet] of complianceReport.scheduleD.sheets.entries()) {
      fuels.push({
        index: i,
        fuelType: sheet.fuelType,
        fuelClass: sheet.fuelClass,
        intensity: this.computeScheduleDFuelIntensity(sheet)
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

    return empty ? null : (total / 1000.0);
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
        ComplianceReportingService._cache.push({
          key: compliancePeriod,
          data: response.data
        });
        resolve(response.data);
      });
    });
  }

  static computeCredits(context, sourceValues) {
    const {
      compliancePeriod
    } = context;

    const {
      fuelClass,
      fuelType,
      provisionOfTheAct,
      customIntensity,
      scheduleDIntensityValue
    } = sourceValues;

    if (!fuelType) {
      return new Promise(resolve => (
        {
          outputs: {
            credits: null,
            debits: null,
            carbonIntensityLimit: null
          }
        })
      );
    }

    return new Promise((resolve, reject) => {
      ComplianceReportingService._fetchCalculationValuePromise(compliancePeriod).then((response) => {

        const fuel = response.find(e => e.name === fuelType);

        let result = {
          inputs: {
            fuelClass,
            fuelType,
            provisionOfTheAct,
            customIntensity,
            scheduleDIntensityValue
          },
          outputs: {
            energyEffectivenessRatio: null,
            energyDensity: null,
            carbonIntensityFuel: null,
            carbonIntensityLimit: null,
            credits: null,
            debits: null,
            energyContent: null
          },
          parameters: {
            fuelClasses: (fuel != null ? fuel.fuelClasses : []),
            fuelCodes: (fuel != null ? fuel.fuelCodes : []),
            provisions: (fuel != null ? fuel.provisions : []),
            unitOfMeasure: (fuel != null ? fuel.unitOfMeasure : null),
            selectFuelCodeFromScheduleD: false,
            intensityInputRequired: false
          }
        };

        switch (result.inputs.provisionOfTheAct) {
          case 'Default Carbon Intensity Value':
            console.log('dciv');
            break;
          default:
            console.log(result.inputs.provisionOfTheAct);
        }

        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }

}

export default ComplianceReportingService;
