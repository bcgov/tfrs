/*
 * Service Layer
 *
 * Move projection and mapping out of UI layer
 */

class ComplianceReportingService {

  static getAvailableScheduleDFuels(complianceReport) {
    if(!complianceReport) {
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
      })
    }

    return fuels;
  }

  static computeScheduleDFuelIntensity(sheet) {
    let total = 0.0;
    let empty = true;

    for (let output of sheet.outputs) {
      total += parseFloat(output.intensity);
      empty = false;
    }

    return empty ? null : (total / 1000.0);
  }

}

export default ComplianceReportingService;
