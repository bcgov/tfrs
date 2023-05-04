import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { screen, render, fireEvent } from '@testing-library/react'
import store from '../../../store/store'
import ComplianceReports from '../ComplianceReports'

describe('ComplianceReports', () => {
  test('Should render the component', () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        items: []
      },
      setFilter: jest.fn()
    }
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReports {...props} />
        </Provider>
      </BrowserRouter>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('Should render the component with complianceReports', () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        supplementalItems: [
          {
            id: 654,
            status: {
              analystStatus: 'Unreviewed',
              directorStatus: 'Unreviewed',
              fuelSupplierStatus: 'Submitted',
              managerStatus: 'Unreviewed'
            },
            type: 'Compliance Report',
            supplementalReports: []
          },
          {
            id: 655,
            status: {
              analystStatus: 'Recommended',
              directorStatus: 'Unreviewed',
              fuelSupplierStatus: 'Submitted',
              managerStatus: 'Unreviewed'
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
              managerStatus: 'Recommended'
            },
            type: 'Exclusion Report',
            supplementalReports: []
          }
        ]
      },
      setFilter: jest.fn()
    }
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReports {...props} />
        </Provider>
      </BrowserRouter>
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
   
  })
})
