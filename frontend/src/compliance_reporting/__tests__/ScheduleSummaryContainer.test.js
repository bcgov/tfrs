import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import ScheduleSummaryContainer from '../ScheduleSummaryContainer'
import store from '../../../src/store/store'
import FontAwesome from '../../../src/app/FontAwesome' // eslint-disable-line no-unused-vars

describe('ScheduleSummaryContainer', () => {
  test('should render the component', () => {
    const props = {
      validationMessages: {},
      scheduleState: {
        summary: {}
      },
      complianceReport: {
        hasSnapshot: true,
        summary: {
          dieselClassDeferred: 1,
          creditsOffsetB: 1,
          dieselClassPreviouslyRetained: 1,
          dieselClassRetained: 1,
          gasolineClassDeferred: 1,
          gasolineClassObligation: 1,
          gasolineClassPreviouslyRetained: 1,
          gasolineClassRetained: 1,
          creditsOffset: 1,
          creditsOffsetA: 1
        },
        compliancePeriod: {
          description: '2021'
        }
      },
      snapshot: {
        summary: {
          lines: []
        }
      },
      recomputeRequest: jest.fn(),
      validating: true,
      valid: false,
      recomputing: false,
      readOnly: true,
      loggedInUser: {},
      showPenaltyWarning: jest.fn(),
      updateScheduleState: jest.fn()
    }

    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ScheduleSummaryContainer {...props} />
        </Provider>
      </BrowserRouter>
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should rerender component with no readonly flag', () => {
    const props = {
      validationMessages: {},
      complianceReport: {
        hasSnapshot: true,
        summary: {
          dieselClassDeferred: 1,
          creditsOffsetB: 1,
          dieselClassPreviouslyRetained: 1,
          dieselClassRetained: 1,
          gasolineClassDeferred: 1,
          gasolineClassObligation: 1,
          gasolineClassPreviouslyRetained: 1,
          gasolineClassRetained: 1,
          creditsOffset: 1,
          creditsOffsetA: 1
        },
        compliancePeriod: {
          description: '2021'
        }
      },
      scheduleState: {
      },
      snapshot: {
        summary: {
          lines: []
        }
      },
      recomputeRequest: jest.fn(),
      validating: true,
      valid: false,
      recomputing: false,
      loggedInUser: {},
      readOnly: true,
      showPenaltyWarning: jest.fn(),
      updateScheduleState: jest.fn()
    }
    let component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ScheduleSummaryContainer {...props} />
        </Provider>
      </BrowserRouter>
    )
    const updatedProps = {
      ...props,
      readOnly: false
    }
    component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ScheduleSummaryContainer {...updatedProps} />
        </Provider>
      </BrowserRouter>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('should render component with no complianceReport.snapshot', () => {
    const props = {
      complianceReport: {
        summary: {
          dieselClassDeferred: 1,
          creditsOffsetB: 1,
          dieselClassPreviouslyRetained: 1,
          dieselClassRetained: 1,
          gasolineClassDeferred: 1,
          gasolineClassObligation: 1,
          gasolineClassPreviouslyRetained: 1,
          gasolineClassRetained: 1,
          creditsOffset: 1,
          creditsOffsetA: 1
        }
      },
      scheduleState: {
      },
      snapshot: {
        summary: {
          lines: []
        }
      },
      readOnly: true,
      showPenaltyWarning: jest.fn(),
      updateScheduleState: jest.fn(),
      loadInitialState: jest.fn(),
      recomputeRequest: jest.fn(),
      validationMessages: {},
      loggedInUser: {},
      valid: false,
      recomputing: false,
      validating: true
    }
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ScheduleSummaryContainer {...props} />
        </Provider>
      </BrowserRouter>
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('should render component with recomputeRequest and loadInitialState', () => {
    const props = {
      validationMessages: {},
      scheduleState: {},
      complianceReport: {
        hasSnapshot: false,
        summary: {
          dieselClassDeferred: 1,
          creditsOffsetB: 1,
          dieselClassPreviouslyRetained: 1,
          dieselClassRetained: 1,
          gasolineClassDeferred: 1,
          gasolineClassObligation: 1,
          gasolineClassPreviouslyRetained: 1,
          gasolineClassRetained: 1,
          creditsOffset: 1,
          creditsOffsetA: 1
        }
      },
      snapshot: {
        summary: {
          lines: []
        }
      },
      readOnly: false,
      showPenaltyWarning: jest.fn(),
      updateScheduleState: jest.fn(),
      recomputeRequest: jest.fn(),
      loggedInUser: {},
      valid: false,
      recomputing: false,
      validating: true
    }
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ScheduleSummaryContainer {...props} />
        </Provider>
      </BrowserRouter>
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should render component with recomputing flag', () => {
    const props = {
      updateScheduleState: jest.fn(),
      recomputeRequest: jest.fn(),
      showPenaltyWarning: jest.fn(),
      validationMessages: {},
      complianceReport: {
        hasSnapshot: false,
        summary: {
          dieselClassDeferred: 1,
          creditsOffsetB: 1,
          dieselClassPreviouslyRetained: 1,
          dieselClassRetained: 1,
          gasolineClassDeferred: 1,
          gasolineClassObligation: 1,
          gasolineClassPreviouslyRetained: 1,
          gasolineClassRetained: 1,
          creditsOffset: 1,
          creditsOffsetA: 1
        }
      },
      scheduleState: {},
      snapshot: {
        summary: {
          lines: []
        }
      },
      loggedInUser: {},
      recomputing: true,
      readOnly: false,
      valid: false,
      validating: true
    }
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ScheduleSummaryContainer {...props} />
        </Provider>
      </BrowserRouter>
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
