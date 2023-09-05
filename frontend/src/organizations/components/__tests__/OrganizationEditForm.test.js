import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import renderer from 'react-test-renderer'
import OrganizationEditForm from '../OrganizationEditForm'
import FontAwesome from '../../../../src/app/FontAwesome' // eslint-disable-line no-unused-vars

const mockedNavigator = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator
}))

describe('OrganizationEditForm', () => {
  const props = {
    fields: {
      org_name: 'TFRS',
      org_status: 1,
      org_actionsType: '',
      org_type: 2,
      org_addressLine1: '',
      org_addressLine2: '',
      org_city: '',
      org_state: '',
      org_country: '',
      org_postalCode: '',
      att_representativeName: '',
      att_streetAddress: '',
      att_otherAddress: '',
      att_city: '',
      att_province: '',
      att_country: '',
      att_postalCode: '200001'
    },
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    loggedInUser: {
      hasPermission: jest.fn()
    },
    mode: 'add',
    referenceData: {
      organizationStatuses: [
        { id: 1, description: 'Active' },
        { id: 2, description: 'Inactive' }
      ],
      organizationTypes: [
        { id: 1 },
        { id: 2, description: 'Part 3 Fuel Supplier' }
      ]
    },
    formIsValid: true
  }
  test('Should render the component', () => {
    props.isGovernmentUser = true
    const component = renderer.create(
      <BrowserRouter>
        <OrganizationEditForm {...props} />
      </BrowserRouter>
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('Checking SaveButton', () => {
    props.isGovernmentUser = true
    render(
      <BrowserRouter>
        <OrganizationEditForm {...props} />
      </BrowserRouter>
    )

    const saveBtnEl = screen.getByRole('button', { name: /Save/i })
    console.log(saveBtnEl)
    fireEvent.click(saveBtnEl)
    expect(props.handleSubmit).toHaveBeenCalledTimes(1)
  })

  test('Checking Back Button', () => {
    render(<BrowserRouter>
        <OrganizationEditForm {...props} />
    </BrowserRouter>)
    const backBtnEl = screen.getByRole('button', { name: /Back/i })
    const val = fireEvent.click(backBtnEl)
    expect(val).toBe(true)
  })

  test('Supplier Status should be in the DOM', () => {
    props.loggedInUser.hasPermission = (val) => val === 'EDIT_FUEL_SUPPLIERS'
    render(
      <BrowserRouter>
        <OrganizationEditForm {...props} />
      </BrowserRouter>
    )
    const statusEl = screen.getByLabelText('Yes')
    expect(statusEl).toBeInTheDocument()
  })
  test('Supplier Status should not be in the DOM', () => {
    // makikng the hasPermission function to return false
    props.loggedInUser.hasPermission = (val) => val === 'EDIT_FUEL'
    render(
      <BrowserRouter>
        <OrganizationEditForm {...props} />
      </BrowserRouter>
    )
    const statusEl1 = screen.queryByLabelText('Yes')
    expect(statusEl1).not.toBeInTheDocument()
  })

  test('Checking Edit mode of the organization', () => {
    props.mode = 'edit'
    props.loggedInUser.isGovernmentUser = true
    render(
      <BrowserRouter>
        <OrganizationEditForm {...props} />
      </BrowserRouter>
    )
    const headerEl = screen.getByRole('heading', { name: 'Edit Organization' })
    expect(headerEl).toBeInTheDocument()
    const supplierTypeEl = screen.queryByRole('radio', {
      name: 'Supplier Type :'
    })
    expect(supplierTypeEl).not.toBeInTheDocument()
  })
})
