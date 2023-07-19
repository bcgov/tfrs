import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import ScheduleBContainer from '../../ScheduleBContainer'
import { BrowserRouter } from 'react-router-dom'
import FontAwesome from '../../../app/FontAwesome' // eslint-disable-line no-unused-vars

describe('ScheduleBContainer', () => {
  const props = {
    complianceReport: {
      id: 666,
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
        id: 52,
        name: 'TFRS IMBeing Green',
        organizationAddress: {
          id: 54,
          addressLine1: '123 Main Street',
          addressLine2: null,
          city: 'Anytown',
          postalCode: 'A1A 1A1',
          state: null,
          country: 'Canada',
          attorneyCity: null,
          attorneyPostalCode: null,
          attorneyProvince: null,
          attorneyCountry: null,
          attorneyAddressOther: null,
          attorneyStreetAddress: null,
          attorneyRepresentativename: null
        },
        type: 2,
        status: { id: 1, status: 'Active', description: 'Active' }
      },
      compliancePeriod: {
        id: 13,
        description: '2023',
        effectiveDate: '2023-01-01',
        expirationDate: '2023-12-31',
        displayOrder: 13
      },
      scheduleA: {
        records: [
          {
            transferType: 'Received',
            fuelClass: 'Diesel',
            quantity: '750000.00',
            tradingPartner: 'Suncor Energy Products Partnership',
            postalAddress: '2489 North Sheridan Way Mississauga, ON, L5K 1A8'
          }
        ]
      },
      scheduleB: {
        records: [
          {
            fuelType: 'Petroleum-based gasoline',
            fuelClass: 'Gasoline',
            provisionOfTheAct: 'Section 6 (5) (a)',
            quantity: '120248695.00',
            fuelCode: null,
            intensity: null,
            scheduleDSheetIndex: null,
            energyDensity: 34.69,
            eer: 1,
            ciLimit: 76.14,
            energyContent: 4171427229.55,
            effectiveCarbonIntensity: 88.14,
            credits: null,
            debits: 50057.1267546,
            petroleumDieselVolume: 0,
            petroleumGasolineVolume: 120248695,
            renewableDieselVolume: 0,
            renewableGasolineVolume: 0,
            unitOfMeasure: 'L',
            fuelCodeDescription: '',
            provisionOfTheActDescription: 'Prescribed carbon intensity'
          }
        ],
        totalCredits: 73182,
        totalDebits: 159746,
        totalPetroleumDiesel: 225750000,
        totalPetroleumGasoline: 132748695,
        totalRenewableDiesel: 17250000,
        totalRenewableGasoline: 12500000
      },
      scheduleC: {
        records: [
          {
            fuelType: 'Petroleum-based diesel',
            fuelClass: 'Diesel',
            quantity: '2238054.00',
            expectedUse: 'Heating Oil',
            rationale: '',
            petroleumDieselVolume: 2238054,
            petroleumGasolineVolume: 0,
            renewableDieselVolume: 0,
            renewableGasolineVolume: 0,
            unitOfMeasure: 'L'
          }
        ],
        totalPetroleumDiesel: 2238054,
        totalPetroleumGasoline: 0,
        totalRenewableDiesel: 0,
        totalRenewableGasoline: 0
      },
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
        creditsOffset: 69773,
        creditsOffsetA: 0,
        creditsOffsetB: 0,
        creditsOffsetC: null,
        totalPetroleumDiesel: 227988054,
        totalPetroleumGasoline: 132748695,
        totalRenewableDiesel: 17250000,
        totalRenewableGasoline: 12500000,
        netDieselClassTransferred: 750000,
        netGasolineClassTransferred: 0,
        lines: {
          1: 132748695,
          2: 12500000,
          3: 145248695,
          4: 7262435,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 12500000,
          11: 0,
          12: 227988054,
          13: 17250000,
          14: 245238054,
          15: 9809522,
          16: 750000,
          17: 0,
          18: 0,
          19: 0,
          20: 0,
          21: 18000000,
          22: 0,
          23: 73182,
          24: 159746,
          25: -86564,
          26: 69773,
          27: -16791,
          28: 10074600,
          '26A': 0,
          '26B': 0,
          '26C': 0
        },
        totalPayable: 10074600
      },
      readOnly: true,
      history: [
        {
          id: 1627,
          complianceReport: 666,
          displayName: 'Compliance Report for 2023',
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
          createTimestamp: '2023-06-09T21:56:26.087655Z'
        },
        {
          id: 1568,
          complianceReport: 666,
          displayName: 'Compliance Report for 2023',
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
              },
              {
                id: 9,
                name: 'GovDoc',
                description: 'File Submission (Government)',
                isGovernmentRole: true
              },
              {
                id: 2,
                name: 'GovUser',
                description: 'Government Analyst',
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
            directorStatus: 'Unreviewed',
            analystStatus: 'Recommended',
            managerStatus: 'Recommended'
          },
          userRole: {
            id: 1,
            name: 'Admin',
            description: 'Administrator',
            isGovernmentRole: true
          },
          createTimestamp: '2023-06-02T22:10:17.450944Z'
        }
      ],
      hasSnapshot: true,
      actions: [],
      actor: 'DIRECTOR',
      deltas: [],
      displayName: 'Compliance Report for 2023',
      supplementalNote: null,
      isSupplemental: false,
      totalPreviousCreditReductions: 0,
      creditTransactions: [
        {
          id: 1032,
          credits: 69773,
          type: 'Credit Reduction',
          supplemental: false
        }
      ],
      maxCreditOffset: 15122,
      maxCreditOffsetExcludeReserved: 15122,
      supplementalNumber: 0,
      lastAcceptedOffset: null,
      previousReportWasCredit: false
    },
    id: '666',
    loggedInUser: {
      id: 139,
      firstName: 'Jignesh',
      lastName: 'Patel',
      email: 'jignesh.patel@quartech.com',
      username: 'user1673481475861',
      displayName: 'Jignesh Patel',
      isActive: true,
      organization: {
        id: 1,
        name: 'Government of British Columbia',
        status: 1,
        statusDisplay: 'Active',
        actionsType: 1,
        actionsTypeDisplay: 'Buy And Sell',
        createTimestamp: null,
        type: 1,
        organizationBalance: {
          creditTradeId: 1083,
          validatedCredits: 999999999010714,
          deductions: 0
        },
        organizationAddress: null
      },
      roles: [
        {
          id: 1,
          name: 'Admin',
          description: 'Administrator',
          isGovernmentRole: true
        },
        {
          id: 3,
          name: 'GovDirector',
          description: 'Government Director',
          isGovernmentRole: true
        },
        {
          id: 9,
          name: 'GovDoc',
          description: 'File Submission (Government)',
          isGovernmentRole: true
        }
      ],
      isGovernmentUser: true,
      permissions: [
        {
          id: 1,
          code: 'LOGIN',
          name: 'Login',
          description:
            'authenticate using BCeID or IDIR credentials to gain access to TFRS'
        },
        {
          id: 3,
          code: 'USER_MANAGEMENT',
          name: 'User management',
          description: 'add new users and edit existing users'
        },
        {
          id: 4,
          code: 'ROLES_AND_PERMISSIONS',
          name: 'Roles and permissions',
          description: 'view roles and permissions information'
        },
        {
          id: 6,
          code: 'VIEW_APPROVED_CREDIT_TRANSFERS',
          name: 'View recorded credit transactions',
          description:
            'view credit transactions within the Historical Data Entry tool prior to them being committed'
        },
        {
          id: 7,
          code: 'VIEW_CREDIT_TRANSFERS',
          name: 'View credit transactions',
          description: 'view credit transactions'
        },
        {
          id: 8,
          code: 'VIEW_FUEL_SUPPLIERS',
          name: 'View fuel supplier organization information',
          description: 'view organization information'
        },
        {
          id: 14,
          code: 'DECLINE_CREDIT_TRANSFER',
          name: 'Decline to approve credit transfer proposals and Part 3 Awards',
          description: 'decline credit transfer proposals and Part 3 Awards'
        },
        {
          id: 15,
          code: 'APPROVE_CREDIT_TRANSFER',
          name: 'Approve credit transfer proposals and Part 3 Awards',
          description: 'approve credit transfer proposals and Part 3 Awards'
        },
        {
          id: 16,
          code: 'VIEW_PRIVILEGED_COMMENTS',
          name: 'View internal comments',
          description: 'view internal comments'
        },
        {
          id: 17,
          code: 'EDIT_PRIVILEGED_COMMENTS',
          name: 'Edit internal comments',
          description: 'add and edit internal comments where available'
        },
        {
          id: 19,
          code: 'EDIT_COMPLIANCE_PERIODS',
          name: 'Edit compliance periods',
          description: 'edit compliance periods'
        },
        {
          id: 20,
          code: 'EDIT_FUEL_SUPPLIERS',
          name: 'Organization management',
          description:
            'add new organizations and edit organization information'
        },
        {
          id: 21,
          code: 'USE_HISTORICAL_DATA_ENTRY',
          name: 'Use Historical Data Entry',
          description: 'Record credit transactions approved outside of TFRS'
        },
        {
          id: 23,
          code: 'ASSIGN_GOVERNMENT_ROLES',
          name: 'Assign Government Roles',
          description: 'assign roles to government (IDIR) users'
        },
        {
          id: 24,
          code: 'ASSIGN_FS_ROLES',
          name: 'Assign roles to users',
          description: 'assign roles to (BCeID) users'
        },
        {
          id: 28,
          code: 'DOCUMENTS_VIEW',
          name: 'View file submissions',
          description: 'view files submitted to Government'
        },
        {
          id: 29,
          code: 'ADD_COMMENT',
          name: 'Add comment',
          description: 'add comments where available'
        },
        {
          id: 30,
          code: 'DOCUMENTS_LINK_TO_CREDIT_TRADE',
          name: 'Link file submissions to Part 3 Awards',
          description:
            'establish link between file submissions and Part 3 Awards'
        },
        {
          id: 31,
          code: 'FUEL_CODES_VIEW',
          name: 'View fuel codes',
          description: 'view fuel codes'
        },
        {
          id: 32,
          code: 'FUEL_CODES_MANAGE',
          name: 'Edit fuel codes',
          description: 'add and edit fuel codes'
        },
        {
          id: 33,
          code: 'CREDIT_CALCULATION_VIEW',
          name: 'View credit calculation values',
          description: 'view values used in credit calculation formula'
        },
        {
          id: 34,
          code: 'CREDIT_CALCULATION_MANAGE',
          name: 'Edit credit calculation values',
          description: 'edit values used in credit calculation formula'
        },
        {
          id: 36,
          code: 'EDIT_FUEL_SUPPLIER',
          name: 'Edit organization address',
          description: 'edit organization address'
        },
        {
          id: 38,
          code: 'VIEW_COMPLIANCE_REPORT',
          name: 'View compliance reports',
          description: 'view compliance reports'
        },
        {
          id: 43,
          code: 'APPROVE_COMPLIANCE_REPORT',
          name: 'Accept compliance reports',
          description: 'accept compliance reports'
        },
        {
          id: 44,
          code: 'REJECT_COMPLIANCE_REPORT',
          name: 'Reject compliance reports',
          description: 'reject compliance reports'
        }
      ],
      phone: '',
      cellPhone: '',
      title: 'Developer',
      isMapped: true
    },
    period: '2023',
    readOnly: true,
    recomputedTotals: {},
    recomputing: false,
    scheduleState: {},
    snapshot: {
      id: 666,
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
          1: '132748695.0000',
          2: '12500000.0000',
          3: '145248695.0000',
          4: '7262435',
          5: '0',
          6: '0.00',
          7: '0.00',
          8: '0.00',
          9: '0.00',
          10: '12500000.0000',
          11: '0.00',
          12: '227988054.0000',
          13: '17250000.0000',
          14: '245238054.0000',
          15: '9809522',
          16: '750000.00',
          17: '0.00',
          18: '0.00',
          19: '0.00',
          20: '0.00',
          21: '18000000.0000',
          22: '0.00',
          23: '75351',
          24: '145124',
          25: '-69773',
          26: 69773,
          27: '0',
          28: '0',
          '26A': 0,
          '26B': 0
        },
        totalPayable: '0.00',
        creditsOffset: 69773,
        creditsOffsetA: 0,
        creditsOffsetB: 0,
        dieselClassDeferred: '0.00',
        dieselClassRetained: '0.00',
        totalPetroleumDiesel: '227988054.0000',
        totalRenewableDiesel: '17250000.0000',
        dieselClassObligation: '0.00',
        gasolineClassDeferred: '0.00',
        gasolineClassRetained: '0.00',
        totalPetroleumGasoline: '132748695.0000',
        totalRenewableGasoline: '12500000.0000',
        gasolineClassObligation: '0.00',
        netDieselClassTransferred: '750000.00',
        netGasolineClassTransferred: '0',
        dieselClassPreviouslyRetained: '0.00',
        gasolineClassPreviouslyRetained: '0.00'
      },
      version: 1,
      readOnly: true,
      timestamp: '2022-06-23T17:42:21.965',
      scheduleA: {
        records: [
          {
            quantity: '750000.00',
            fuelClass: 'Diesel',
            transferType: 'Received',
            postalAddress: '2489 North Sheridan Way Mississauga, ON, L5K 1A8',
            tradingPartner: 'Suncor Energy Products Partnership'
          }
        ]
      },
      scheduleB: {
        records: [
          {
            eer: '1.00',
            debits: '45468.556802095',
            credits: null,
            ciLimit: '77.24',
            quantity: '120248695.00',
            fuelCode: null,
            fuelType: 'Petroleum-based gasoline',
            intensity: null,
            fuelClass: 'Gasoline',
            energyContent: '4171427229.5500',
            energyDensity: '34.69',
            unitOfMeasure: 'L',
            provisionOfTheAct: 'Section 6 (5) (a)',
            fuelCodeDescription: '',
            scheduleDSheetIndex: null,
            petroleumDieselVolume: 0,
            renewableDieselVolume: 0,
            petroleumGasolineVolume: '120248695.00',
            renewableGasolineVolume: 0,
            effectiveCarbonIntensity: '88.14',
            provisionOfTheActDescription: 'Prescribed carbon intensity'
          },
          {
            eer: '1.00',
            debits: null,
            credits: '23061.24000000',
            ciLimit: '77.24',
            quantity: '25000000.00',
            fuelCode: 21,
            fuelType: 'Ethanol',
            intensity: null,
            fuelClass: 'Gasoline',
            energyContent: '589500000.0000',
            energyDensity: '23.58',
            unitOfMeasure: 'L',
            provisionOfTheAct: 'Section 6 (5) (c)',
            fuelCodeDescription: 'BCLCF114.0',
            scheduleDSheetIndex: null,
            petroleumDieselVolume: 0,
            renewableDieselVolume: 0,
            petroleumGasolineVolume: '12500000.0000',
            renewableGasolineVolume: '12500000.0000',
            effectiveCarbonIntensity: '38.12',
            provisionOfTheActDescription: 'Approved fuel code'
          },
          {
            eer: '1.00',
            debits: '99655.16000000',
            credits: null,
            ciLimit: '83.04',
            quantity: '220000000.00',
            fuelCode: null,
            fuelType: 'Petroleum-based diesel',
            intensity: null,
            fuelClass: 'Diesel',
            energyContent: '8503000000.0000',
            energyDensity: '38.65',
            unitOfMeasure: 'L',
            provisionOfTheAct: 'Section 6 (5) (b)',
            fuelCodeDescription: '',
            scheduleDSheetIndex: null,
            petroleumDieselVolume: '220000000.00',
            renewableDieselVolume: 0,
            petroleumGasolineVolume: 0,
            renewableGasolineVolume: 0,
            effectiveCarbonIntensity: '94.76',
            provisionOfTheActDescription: 'Prescribed carbon intensity'
          },
          {
            eer: '1.00',
            debits: null,
            credits: '51327.16800000',
            ciLimit: '83.04',
            quantity: '23000000.00',
            fuelCode: 22,
            fuelType: 'Biodiesel',
            intensity: null,
            fuelClass: 'Diesel',
            energyContent: '814200000.0000',
            energyDensity: '35.40',
            unitOfMeasure: 'L',
            provisionOfTheAct: 'Section 6 (5) (c)',
            fuelCodeDescription: 'BCLCF115.0',
            scheduleDSheetIndex: null,
            petroleumDieselVolume: '5750000.0000',
            renewableDieselVolume: '17250000.0000',
            petroleumGasolineVolume: 0,
            renewableGasolineVolume: 0,
            effectiveCarbonIntensity: '20.00',
            provisionOfTheActDescription: 'Approved fuel code'
          },
          {
            eer: '1.00',
            debits: null,
            credits: '962.76600000',
            ciLimit: '77.24',
            quantity: '20000000.00',
            fuelCode: null,
            fuelType: 'Propane',
            intensity: null,
            fuelClass: 'Gasoline',
            energyContent: '509400000.0000',
            energyDensity: '25.47',
            unitOfMeasure: 'L',
            provisionOfTheAct: 'Section 6 (5) (d) (i)',
            fuelCodeDescription: '',
            scheduleDSheetIndex: null,
            petroleumDieselVolume: 0,
            renewableDieselVolume: 0,
            petroleumGasolineVolume: 0,
            renewableGasolineVolume: 0,
            effectiveCarbonIntensity: '75.35',
            provisionOfTheActDescription: 'Default Carbon Intensity Value'
          }
        ],
        totalDebits: 145124,
        totalCredits: 75351,
        totalPetroleumDiesel: '225750000.0000',
        totalRenewableDiesel: '17250000.0000',
        totalPetroleumGasoline: '132748695.0000',
        totalRenewableGasoline: '12500000.0000'
      },
      scheduleC: {
        records: [
          {
            quantity: '2238054.00',
            fuelType: 'Petroleum-based diesel',
            rationale: '',
            fuelClass: 'Diesel',
            expectedUse: 'Heating Oil',
            unitOfMeasure: 'L',
            petroleumDieselVolume: '2238054.00',
            renewableDieselVolume: 0,
            petroleumGasolineVolume: 0,
            renewableGasolineVolume: 0
          }
        ],
        totalPetroleumDiesel: '2238054.00',
        totalRenewableDiesel: 0,
        totalPetroleumGasoline: 0,
        totalRenewableGasoline: 0
      },
      scheduleD: null,
      displayName: 'Compliance Report for 2023',
      hasSnapshot: false,
      organization: {
        id: 52,
        name: 'TFRS IMBeing Green',
        type: 2,
        status: { id: 1, status: 'Active', description: 'Active' },
        organizationAddress: {
          id: 54,
          city: 'Anytown',
          state: 'British Columbia',
          county: null,
          country: 'Canada',
          postalCode: 'A1A 1A1',
          addressLine1: '123 Main Street',
          addressLine2: 'Unit 1234',
          addressLine3: null
        }
      },
      isSupplemental: false,
      compliancePeriod: {
        id: 13,
        description: '2023',
        displayOrder: 13,
        effectiveDate: '2023-01-01',
        expirationDate: '2023-12-31'
      },
      maxCreditOffset: 15222,
      supplementalNote: null,
      creditTransactions: [],
      supplementalNumber: 0,
      lastAcceptedOffset: null,
      previousReportWasCredit: false,
      totalPreviousCreditReductions: '0'
    },
    snapshotIsLoading: false,
    valid: true,
    validating: false,
    validationMessages: {},
    referenceData: {
      isFetching: false,
      success: true,
      errorMessage: [],
      data: {
        organizationStatuses: [
          {
            id: 1,
            status: 'Active',
            description: 'Active',
            effectiveDate: '2017-01-01',
            expirationDate: null,
            displayOrder: 1
          },
          {
            id: 2,
            status: 'Archived',
            description: 'Inactive',
            effectiveDate: '2017-01-01',
            expirationDate: null,
            displayOrder: 1
          }
        ],
        documentStatuses: [
          { id: 1, status: 'Draft' },
          { id: 2, status: 'Submitted' },
          { id: 3, status: 'Received' },
          { id: 4, status: 'Security Scan Failed' },
          { id: 5, status: 'Pending Submission' },
          { id: 7, status: 'Cancelled' },
          { id: 8, status: 'Archived' }
        ],
        documentCategories: [
          {
            id: 1,
            name: 'Part 3 Agreements',
            types: [
              {
                theType: 'Application',
                id: 1,
                description: 'P3A Application'
              },
              {
                theType: 'Evidence',
                id: 2,
                description: 'P3A Milestone Evidence'
              }
            ]
          },
          {
            id: 2,
            name: 'Other',
            types: [{ theType: 'Other', id: 4, description: 'Other' }]
          }
        ],
        organizationActionsTypes: [
          {
            id: 1,
            theType: 'Buy And Sell',
            description: 'Permitted to Buy and Sell Low Carbon Fuel Credits.',
            effectiveDate: '2017-01-01',
            expirationDate: null,
            displayOrder: 1
          }
        ],
        organizationTypes: [
          {
            id: 1,
            type: 'Government',
            description: 'Government of British Columbia',
            effectiveDate: '2017-01-01',
            expirationDate: '2117-01-01',
            displayOrder: 1
          }
        ],
        fuelCodeStatuses: [
          {
            id: 1,
            createTimestamp: '2019-03-01T20:17:12.472247Z',
            updateTimestamp: '2019-03-01T20:17:12.472280Z',
            displayOrder: 1,
            effectiveDate: '2017-01-01',
            expirationDate: null,
            status: 'Draft',
            createUser: null,
            updateUser: null
          }
        ],
        transportModes: [
          { id: 1, name: 'Truck' },
          { id: 2, name: 'Rail' },
          { id: 3, name: 'Marine' },
          { id: 4, name: 'Adjacent' },
          { id: 5, name: 'Pipeline' }
        ],
        complianceReportTypes: [
          {
            theType: 'Compliance Report',
            description: 'Annual Compliance Report'
          },
          {
            theType: 'Exclusion Report',
            description: 'Annual Exclusion Report'
          }
        ],
        approvedFuels: [
          {
            id: 1,
            name: 'Biodiesel',
            description: 'Biodiesel fuel',
            fuelClasses: [{ id: 1, fuelClass: 'Diesel' }],
            creditCalculationOnly: false,
            isPartiallyRenewable: true,
            provisions: [
              {
                id: 3,
                provision: 'Section 6 (5) (c)',
                description: 'Approved fuel code',
                determinationType: { id: 2, theType: 'Fuel Code' }
              }
            ],
            unitOfMeasure: { id: 1, name: 'L' },
            effectiveDate: '2017-01-01'
          }
        ]
      }
    },
    compliancePeriods: {
      items: [
        {
          id: 1,
          description: '2010',
          effectiveDate: '2010-01-01',
          expirationDate: '2010-12-31',
          displayOrder: 1
        }
      ],
      isFetching: false,
      success: true,
      errorMessage: []
    },
    creditCalculation: { isFetching: false, item: {}, success: false }
  }

  test('should match snapshot', () => {
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ScheduleBContainer {...props} />
        </Provider>
      </BrowserRouter>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
