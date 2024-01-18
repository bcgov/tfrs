import React from 'react'
import renderer from 'react-test-renderer'
import ScheduleBTotals from '../../components/ScheduleBTotals'
describe('ScheduleBTotals', () => {
  const props = {
    totals: { credit: 3457.10016, debit: 0 },
    period: {
      id: 1002,
      status: {
        fuelSupplierStatus: 'Submitted',
        directorStatus: 'Accepted',
        analystStatus: 'Recommended',
        managerStatus: 'Recommended'
      },
      type: {
        theType: 'Compliance Report',
        description: 'Annual Compliance Report'
      },
      organization: {
        id: 101,
        name: 'Zapp Brannigan Electric Co.',
        organizationAddress: {
          id: 212,
          addressLine1: '123',
          addressLine2: '',
          city: 'Nimbus',
          postalCode: '90210',
          state: 'Nimbus',
          country: 'Nimbus',
          attorneyCity: '',
          attorneyPostalCode: '',
          attorneyProvince: 'BC',
          attorneyCountry: 'Canada',
          attorneyAddressOther: '',
          attorneyStreetAddress: '',
          attorneyRepresentativename: ''
        },
        type: 2,
        status: { id: 1, status: 'Active', description: 'Active' }
      },
      compliancePeriod: {
        id: 10,
        description: '2020',
        effectiveDate: '2020-01-01',
        expirationDate: '2020-12-31',
        displayOrder: 10
      },
      scheduleA: null,
      scheduleB: {
        records: [
          {
            fuelType: 'Electricity',
            fuelClass: 'Gasoline',
            provisionOfTheAct: 'Section 6 (5) (d) (i)',
            quantity: '3800000.00',
            fuelCode: null,
            intensity: null,
            scheduleDSheetIndex: null,
            energyDensity: 3.6,
            eer: 3.4,
            ciLimit: 80.13,
            energyContent: 13680000,
            effectiveCarbonIntensity: 19.73,
            credits: 3457.10016,
            debits: null,
            petroleumDieselVolume: 0,
            petroleumGasolineVolume: 0,
            renewableDieselVolume: 0,
            renewableGasolineVolume: 0,
            unitOfMeasure: 'kWh',
            fuelCodeDescription: '',
            provisionOfTheActDescription: 'Default Carbon Intensity Value'
          }
        ],
        totalCredits: 3457,
        totalDebits: 0,
        totalPetroleumDiesel: 0,
        totalPetroleumGasoline: 0,
        totalRenewableDiesel: 0,
        totalRenewableGasoline: 0
      },
      scheduleC: null,
      scheduleD: null,
      summary: {
        dieselClassDeferred: '0.00',
        dieselClassRetained: '0.00',
        dieselClassObligation: '0.00',
        dieselClassPreviouslyRetained: '0.00',
        gasolineClassRetained: '0.00',
        gasolineClassDeferred: '0.00',
        gasolineClassObligation: '0.00',
        gasolineClassPreviouslyRetained: '0.00',
        creditsOffset: 0,
        creditsOffsetA: 0,
        creditsOffsetB: 0,
        creditsOffsetC: 0,
        totalPetroleumDiesel: 0,
        totalPetroleumGasoline: 0,
        totalRenewableDiesel: 0,
        totalRenewableGasoline: 0,
        netDieselClassTransferred: 0,
        netGasolineClassTransferred: 0,
        lines: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 0,
          16: 0,
          17: 0,
          18: 0,
          19: 0,
          20: 0,
          21: 0,
          22: 0,
          23: 3457,
          24: 0,
          25: 3457,
          26: 0,
          27: 0,
          28: 0,
          '26A': 0,
          '26B': 0,
          '26C': 0
        },
        totalPayable: 0
      },
      readOnly: true,
      history: [
        {
          id: 1655,
          complianceReport: 1002,
          displayName: 'Compliance Report for 2020 -- Supplemental Report #0',
          user: {
            id: 7,
            firstName: 'Justin',
            lastName: 'Lepitzki Test',
            displayName: 'Justin Lepitzki Test',
            email: 'Justin.Lepitzki@gov.bc.ca',
            phone: '(778) 698-7173',
            roles: [
              {
                id: 1,
                name: 'Admin',
                description: 'Administrator',
                isGovernmentRole: true
              }
            ],
            isActive: true,
            organization: {
              id: 1,
              name: 'Government of British Columbia',
              type: 1,
              status: { id: 1, status: 'Active', description: 'Active' }
            }
          },
          status: {
            fuelSupplierStatus: 'Submitted',
            directorStatus: 'Accepted',
            analystStatus: 'Recommended',
            managerStatus: 'Recommended'
          },
          userRole: {
            id: 3,
            name: 'GovDirector',
            description: 'Government Director',
            isGovernmentRole: true
          },
          createTimestamp: '2023-06-13T22:47:56.200116Z'
        }
      ],
      hasSnapshot: true,
      actions: [],
      actor: 'DIRECTOR',
      deltas: [
        {
          levelsUp: 1,
          ancestorId: 993,
          ancestorDisplayName: 'Compliance Report for 2020',
          delta: [
            {
              path: 'summary.lines',
              field: '23',
              action: 'modified',
              oldValue: '4549',
              newValue: '3457'
            }
          ],
          snapshot: {
            data: {
              id: 993,
              type: {
                theType: 'Compliance Report',
                description: 'Annual Compliance Report'
              },
              actor: 'FUEL_SUPPLIER',
              deltas: [],
              status: {
                analystStatus: null,
                managerStatus: null,
                directorStatus: null,
                fuelSupplierStatus: 'Submitted'
              },
              actions: ['CREATE_SUPPLEMENTAL'],
              history: [],
              summary: {
                lines: {
                  1: '0',
                  2: '0',
                  3: '0',
                  4: '0',
                  5: '0',
                  6: '0.00',
                  7: '0.00',
                  8: '0.00',
                  9: '0.00',
                  10: '0.00',
                  11: '0.00',
                  12: '0',
                  13: '0',
                  14: '0',
                  15: '0',
                  16: '0',
                  17: '0.00',
                  18: '0.00',
                  19: '0.00',
                  20: '0.00',
                  21: '0.00',
                  22: '0.00',
                  23: '4549',
                  24: '0',
                  25: '4549',
                  26: '0',
                  27: 0,
                  28: '0',
                  '26A': '0',
                  '26B': '0',
                  '26C': '0'
                },
                totalPayable: '0.00',
                creditsOffset: 0,
                creditsOffsetA: 0,
                creditsOffsetB: 0,
                creditsOffsetC: 0,
                dieselClassDeferred: '0.00',
                dieselClassRetained: '0.00',
                totalPetroleumDiesel: '0',
                totalRenewableDiesel: '0',
                dieselClassObligation: '0.00',
                gasolineClassDeferred: '0.00',
                gasolineClassRetained: '0.00',
                totalPetroleumGasoline: '0',
                totalRenewableGasoline: '0',
                gasolineClassObligation: '0.00',
                netDieselClassTransferred: '0',
                netGasolineClassTransferred: '0',
                dieselClassPreviouslyRetained: '0.00',
                gasolineClassPreviouslyRetained: '0.00'
              },
              version: 1,
              readOnly: true,
              timestamp: '2023-06-09T17:47:48.626',
              scheduleA: null,
              scheduleB: {
                records: [
                  {
                    eer: '3.40',
                    debits: null,
                    credits: '4548.81600000',
                    ciLimit: '80.13',
                    quantity: '5000000.00',
                    fuelCode: null,
                    fuelType: 'Electricity',
                    intensity: null,
                    fuelClass: 'Gasoline',
                    energyContent: '18000000.0000',
                    energyDensity: '3.60',
                    unitOfMeasure: 'kWh',
                    provisionOfTheAct: 'Section 6 (5) (d) (i)',
                    fuelCodeDescription: '',
                    scheduleDSheetIndex: null,
                    petroleumDieselVolume: 0,
                    renewableDieselVolume: 0,
                    petroleumGasolineVolume: 0,
                    renewableGasolineVolume: 0,
                    effectiveCarbonIntensity: '19.73',
                    provisionOfTheActDescription:
                      'Default Carbon Intensity Value'
                  }
                ],
                totalDebits: 0,
                totalCredits: 4549,
                totalPetroleumDiesel: 0,
                totalRenewableDiesel: 0,
                totalPetroleumGasoline: 0,
                totalRenewableGasoline: 0
              },
              scheduleC: null,
              scheduleD: null,
              displayName: 'Compliance Report for 2020',
              hasSnapshot: false,
              organization: {
                id: 101,
                name: 'Zapp Brannigan Electric Co.',
                type: 2,
                status: {
                  id: 1,
                  status: 'Active',
                  description: 'Active'
                },
                organizationAddress: {
                  id: 212,
                  city: 'Nimbus',
                  state: 'Nimbus',
                  country: 'Nimbus',
                  postalCode: '90210',
                  attorneyCity: '',
                  addressLine1: '123',
                  addressLine2: '',
                  attorneyCountry: 'Canada',
                  attorneyProvince: 'BC',
                  attorneyPostalCode: '',
                  attorneyAddressOther: '',
                  attorneyStreetAddress: '',
                  attorneyRepresentativename: ''
                }
              },
              isSupplemental: false,
              compliancePeriod: {
                id: 10,
                description: '2020',
                displayOrder: 10,
                effectiveDate: '2020-01-01',
                expirationDate: '2020-12-31'
              },
              maxCreditOffset: 553,
              supplementalNote: null,
              creditTransactions: [],
              supplementalNumber: 0,
              lastAcceptedOffset: null,
              previousReportWasCredit: false,
              totalPreviousCreditReductions: '0',
              maxCreditOffsetExcludeReserved: 553
            },
            computed: false
          }
        }
      ],
      displayName: 'Compliance Report for 2020 -- Supplemental Report #0',
      supplementalNote: "Oops wasn't my electricity",
      isSupplemental: true,
      totalPreviousCreditReductions: 0,
      creditTransactions: [
        {
          id: 1028,
          credits: 4549,
          type: 'Credit Validation',
          supplemental: false
        }
      ],
      maxCreditOffset: 30,
      maxCreditOffsetExcludeReserved: 3593,
      supplementalNumber: 1,
      lastAcceptedOffset: 0,
      previousReportWasCredit: true
    }
  }
  let component
  beforeAll(() => {
    component = renderer.create(<ScheduleBTotals {...props} />)
  })
  test('should match snapshot', () => {
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
