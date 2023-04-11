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

  //   test('Checking the Analyst Count', () => {
  //     const props = {
  //       complianceReports: {
  //         isFinding: false,
  //         isGettingDashboard: false,
  //         items: [
  //           {
  //             id: 654,
  //             status: {
  //               analystStatus: 'Unreviewed',
  //               directorStatus: 'Unreviewed',
  //               fuelSupplierStatus: 'Submitted',
  //               managerStatus: 'Unreviewed',
  //             },
  //             type: 'Compliance Report',
  //             supplementalReports: [],
  //           },
  //         ],
  //       },
  //       setFilter: jest.fn(),
  //     }
  //     const component = renderer.create(
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <ComplianceReports {...props} />
  //         </Provider>
  //       </BrowserRouter>
  //     )
  //     const tree = component.toJSON()
  //     expect(tree).toMatchSnapshot()
  //   })

  //   test('Checking the Manager Count', () => {
  //     const props = {
  //       complianceReports: {
  //         isFinding: false,
  //         isGettingDashboard: false,
  //         items: [
  //           {
  //             id: 294,
  //             status: {
  //               analystStatus: 'Unreviewed',
  //               directorStatus: 'Unreviewed',
  //               managerStatus: 'Unreviewed',
  //             },
  //             type: 'Compliance Report',
  //             supplementalReports: [
  //               {
  //                 status: {
  //                   analystStatus: 'Recommended',
  //                   directorStatus: 'Unreviewed',
  //                   managerStatus: 'Unreviewed',
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             id: 295,
  //             status: {},
  //             type: 'Exclusion Report',
  //             supplementalReports: [
  //               {
  //                 status: {},
  //                 supplementalReports: [
  //                   {
  //                     status: {
  //                       analystStatus: 'Recommended',
  //                       directorStatus: 'Unreviewed',
  //                       managerStatus: 'Unreviewed',
  //                     },
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       setFilter: jest.fn(),
  //     }
  //     const component = renderer.create(
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <ComplianceReports {...props} />
  //         </Provider>
  //       </BrowserRouter>
  //     )
  //     const tree = component.toJSON()
  //     expect(tree).toMatchSnapshot()
  //   })

  //   test('Checking the Director Count', () => {
  //     const props = {
  //       complianceReports: {
  //         isFinding: false,
  //         isGettingDashboard: false,
  //         items: [
  //           {
  //             id: 294,
  //             status: {
  //               analystStatus: 'Unreviewed',
  //               directorStatus: 'Unreviewed',
  //               managerStatus: 'Unreviewed',
  //             },
  //             type: 'Compliance Report',
  //             supplementalReports: [
  //               {
  //                 status: {
  //                   analystStatus: 'Recommended'',
  //                   directorStatus: 'Unreviewed',
  //                   managerStatus: 'Not Recommended',
  //                 },
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       setFilter: jest.fn(),
  //     }
  //     const component = renderer.create(
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <ComplianceReports {...props} />
  //         </Provider>
  //       </BrowserRouter>
  //     )
  //     const tree = component.toJSON()
  //     expect(tree).toMatchSnapshot()
  //   })

  test('Checking the analyst count click event', () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        items: [
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
              analystStatus: 'Unreviewed',
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
              managerStatus: 'Unreviewed'
            },
            type: 'Exclusion Report',
            supplementalReports: []
          }
        ]
      },
      setFilter: jest.fn()
    }
    render(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReports {...props} />
        </Provider>
      </BrowserRouter>
    )
    const complianceBtnEl = screen.getByRole('button', {
      name: '2 awaiting government analyst review'
    })
    const exclusionBtnEl = screen.getByRole('button', {
      name: '1 awaiting government analyst review'
    })
    const complianceBtn = fireEvent.click(complianceBtnEl)
    const exclusionBtn = fireEvent.click(exclusionBtnEl)
    expect(complianceBtn).toBe(true)
    expect(exclusionBtn).toBe(true)
    expect(props.setFilter).toHaveBeenCalledTimes(2)
  })

  test('Checking the Manager Count click', () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        items: [
          {
            id: 293,
            status: {
              analystStatus: 'Unreviewed',
              directorStatus: 'Unreviewed',
              managerStatus: 'Unreviewed'
            },
            type: 'Compliance Report',
            supplementalReports: [
              {
                status: {
                  analystStatus: 'Recommended',
                  directorStatus: 'Unreviewed',
                  managerStatus: 'Unreviewed'
                }
              }
            ]
          },
          {
            id: 294,
            status: {
              analystStatus: 'Unreviewed',
              directorStatus: 'Unreviewed',
              managerStatus: 'Unreviewed'
            },
            type: 'Compliance Report',
            supplementalReports: [
              {
                status: {
                  analystStatus: 'Recommended',
                  directorStatus: 'Unreviewed',
                  managerStatus: 'Unreviewed'
                }
              }
            ]
          },
          {
            id: 295,
            status: {},
            type: 'Exclusion Report',
            supplementalReports: [
              {
                status: {},
                supplementalReports: [
                  {
                    status: {
                      analystStatus: 'Recommended',
                      directorStatus: 'Unreviewed',
                      managerStatus: 'Unreviewed'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      setFilter: jest.fn()
    }
    render(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReports {...props} />
        </Provider>
      </BrowserRouter>
    )
    const complianceBtnEl = screen.getByRole('button', {
      name: '1 awaiting compliance manager review'
    })
    const exclusionBtnEl = screen.getByRole('button', {
      name: '0 awaiting compliance manager review'
    })
    const complianceBtn = fireEvent.click(complianceBtnEl)
    const exclusionBtn = fireEvent.click(exclusionBtnEl)
    expect(complianceBtn).toBe(true)
    expect(exclusionBtn).toBe(true)
    expect(props.setFilter).toHaveBeenCalledTimes(2)
  })

  test('Checking the Director Count click', () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        items: [
          {
            id: 294,
            status: {
              analystStatus: 'Unreviewed',
              directorStatus: 'Unreviewed',
              managerStatus: 'Unreviewed'
            },
            type: 'Compliance Report',
            supplementalReports: [
              {
                status: {
                  analystStatus: 'Recommended',
                  directorStatus: 'Unreviewed',
                  managerStatus: 'Not Recommended'
                }
              }
            ]
          },
          {
            id: 295,
            status: {
              analystStatus: 'Unreviewed',
              directorStatus: 'Unreviewed',
              managerStatus: 'Unreviewed'
            },
            type: 'Compliance Report',
            supplementalReports: [
              {
                status: {
                  analystStatus: 'Recommended',
                  directorStatus: 'Unreviewed',
                  managerStatus: 'Not Recommended'
                }
              }
            ]
          },
          {
            id: 296,
            status: {
              analystStatus: 'Unreviewed',
              directorStatus: 'Unreviewed',
              managerStatus: 'Unreviewed'
            },
            type: 'Exclusion Report',
            supplementalReports: [
              {
                status: {
                  analystStatus: 'Recommended',
                  directorStatus: 'Unreviewed',
                  managerStatus: 'Not Recommended'
                }
              }
            ]
          }
        ]
      },
      setFilter: jest.fn()
    }
    render(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReports {...props} />
        </Provider>
      </BrowserRouter>
    )
    const complianceBtnEl = screen.getByRole('button', {
      name: '2 awaiting Director review'
    })
    const exclusionBtnEl = screen.getByRole('button', {
      name: '1 awaiting Director review'
    })
    const complianceBtn = fireEvent.click(complianceBtnEl)
    const exclusionBtn = fireEvent.click(exclusionBtnEl)
    expect(complianceBtn).toBe(true)
    expect(exclusionBtn).toBe(true)
    expect(props.setFilter).toHaveBeenCalledTimes(2)
  })

  test('Check Current Compliance Period Btn and All/historical Btn', () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        items: []
      },
      setFilter: jest.fn()
    }
    render(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReports {...props} />
        </Provider>
      </BrowserRouter>
    )
    const complianceBtnEl = screen.getByText('Current compliance period')
    const historicalBtnEl = screen.getByText('All/historical')
    const complianceBtn = fireEvent.click(complianceBtnEl)
    expect(complianceBtn).toBe(true)
    const historicalBtn = fireEvent.click(historicalBtnEl)
    expect(historicalBtn).toBe(true)
    expect(props.setFilter).toHaveBeenCalledTimes(2)
  })
})
