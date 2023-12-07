import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import CreditTransferSigningHistory from '../components/CreditTransferSigningHistory'
import store from '../../store/store'
import moment from 'moment'

describe('CreditTransferSigningHistory', () => {

  let agreementDate, submissionDate;

  beforeEach(() => {
    agreementDate = new Date();
    submissionDate = new Date();
  });

  describe('Component Rendering', () => {

    const historyMock = [{
      user: {
        firstName: 'John',
        lastName: 'Doe',
        organization: {
          name: 'Organization Name'
        }
      },
      status: {
        id: 1
      },
      createTimestamp: new Date().toISOString()
    }]

    test('renders the component correctly', () => {
      const props = {
        history: historyMock,
        dateOfWrittenAgreement: moment().format('YYYY-MM-DD'),
        categoryDSelected: false,
        tradeCategory: {
          id: 1,
          category: 'A'
        }
      }

      const component = renderer.create(
        <BrowserRouter>
          <Provider store={store}>
            <CreditTransferSigningHistory {...props} />
          </Provider>
        </BrowserRouter>
      )

      const tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })

    test('should render the component with dateOfWrittenAgreement as null', () => {
      const props = {
        history: historyMock,
        dateOfWrittenAgreement: null,
        categoryDSelected: false,
        tradeCategory: null
      }

      const component = renderer.create(
        <BrowserRouter>
          <Provider store={store}>
            <CreditTransferSigningHistory {...props} />
          </Provider>
        </BrowserRouter>
      )

      const tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })
  });

  describe('Category D selection logic', () => {
    test('returns category D if categoryDSelected is true', () => {
      const result = CreditTransferSigningHistory.calculateTransferCategoryAndNextChange(agreementDate, submissionDate, true, null)
      expect(result).toEqual({ category: 'D', nextChangeInMonths: null })
    })
  });

  describe('When a specific category is selected', () => {
    test('returns 6 months for next change if selected category is A', () => {
      const result = CreditTransferSigningHistory.calculateTransferCategoryAndNextChange(agreementDate, submissionDate, false, 'A');
      expect(result).toEqual({ category: 'A', nextChangeInMonths: 6 });
    });

    test('returns 12 months for next change if selected category is B', () => {
      const result = CreditTransferSigningHistory.calculateTransferCategoryAndNextChange(agreementDate, submissionDate, false, 'B');
      expect(result).toEqual({ category: 'B', nextChangeInMonths: 12 });
    });

    test('returns null for next change if selected category is C', () => {
      const result = CreditTransferSigningHistory.calculateTransferCategoryAndNextChange(agreementDate, submissionDate, false, 'C');
      expect(result).toEqual({ category: 'C', nextChangeInMonths: null });
    });
  });

  describe('Calculating category based on time since agreement', () => {
    test('returns category A if differenceInMonths <= 6', () => {
      agreementDate.setMonth(agreementDate.getMonth() - 5) // Five months ago
      const result = CreditTransferSigningHistory.calculateTransferCategoryAndNextChange(agreementDate, submissionDate, false, null)
      expect(result).toEqual({ category: 'A', nextChangeInMonths: 6 })
    })

    test('returns category B if differenceInMonths > 6 and differenceInMonths <= 12', () => {
      agreementDate.setMonth(agreementDate.getMonth() - 7) // Seven months ago
      const result = CreditTransferSigningHistory.calculateTransferCategoryAndNextChange(agreementDate, submissionDate, false, null)
      expect(result).toEqual({ category: 'B', nextChangeInMonths: 12 })
    })

    test('returns category C if differenceInMonths > 12', () => {
      agreementDate.setFullYear(agreementDate.getFullYear() - 2) // Two years ago
      const result = CreditTransferSigningHistory.calculateTransferCategoryAndNextChange(agreementDate, submissionDate, false, null)
      expect(result).toEqual({ category: 'C', nextChangeInMonths: null })
    })
  });
})
