import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { screen, render, fireEvent } from '@testing-library/react'
import store from '../../../store/store'
import ComplianceReportsBCEID from '../ComplianceReportsBCEID'

describe('ComplianceReportsBCEID', () => {
    const mockItems= [
        {
          id: 654,
          isRescinded: false,
          status: {
            status: 'Recommended',
            analystStatus: 'Unreviewed',
            directorStatus: 'Unreviewed',
            fuelSupplierStatus: 'Draft',
            managerStatus: 'Unreviewed'
          },
          type: 'Compliance Report',
          supplementalReports: [{
            status:{
              managerStatus:'Recommended',
              directorStatus:'Unreviewed'
            }
          }]
        },
        {
          id: 655,
          status: {
            analystStatus: 'Unreviewed',
            directorStatus: 'Unreviewed',
            fuelSupplierStatus: 'Submitted',
            managerStatus: 'Requested Supplemental'
          },
          type: 'Compliance Report',
          supplementalReports: []
        },
        {
          id: 656,
          status: {
            analystStatus: 'Unreviewed',
            directorStatus: 'Unreviewed',
            fuelSupplierStatus: 'Submitted',
            managerStatus: 'Unreviewed'
          },
          type: 'Exclusion Report',
          supplementalReports: []
        }
      ];
  test('Should render the component', () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        items: []
      },
      setFilter: jest.fn(),
      loggedInUser: {
        organization:{
            name:'user'
        },
        hasPermission:jest.fn().mockImplementation(() => true)
      }
    }
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReportsBCEID {...props} />
        </Provider>
      </BrowserRouter>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('Should render the component with complianceReports and creditTransfers', () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        supplementalItems: mockItems
      },
      setFilter: jest.fn(),
      loggedInUser: {
        organization:{
            name:'user'
        },
        hasPermission:jest.fn().mockImplementation(() => true)
      }
    }
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReportsBCEID {...props} />
        </Provider>
      </BrowserRouter>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()

  })

})
