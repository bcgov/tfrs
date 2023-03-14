import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import renderer from 'react-test-renderer'
import {screen, render} from '@testing-library/react'
import ComplianceReportingTable from "../../components/ComplianceReportingTable";
import store from "../../../store/store";

describe('ComplianceReportingTable', ()=> {
    test('should render the component', ()=> {
        const props = {
            loggedInUser : {
                isGovernmentUser: true
            },
            items : [],
            isFetching:true,
            navigate : jest.fn(),
            itemsCount:0,
            isEmpty: true,
            isFetching: false,
            getComplianceReports: jest.fn()
        }
        const component = renderer.create(
            <BrowserRouter>
                <Provider store={store}>
                    <ComplianceReportingTable {...props} />
                </Provider>
            </BrowserRouter>
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    test('Checking Functionality', ()=> {
        const props= {
            loggedInUser : {
                isGovernmentUser: true
            },
            items : [{
                id: 654,
                status: {
                  fuelSupplierStatus: "Submitted",
                  directorStatus: "Unreviewed",
                  analystStatus: "Unreviewed",
                  managerStatus: "Unreviewed"
                },
                type: "Compliance Report",
                organization: {
                  id: 13,
                  name: "South Coast Fuels Co.",
                  type: 2,
                  status: {
                    id: 2,
                    status: "Archived",
                    description: "Inactive"
                  }
                },
                compliancePeriod: {
                  id: 13,
                  description: "2023",
                  effectiveDate: "2023-01-01",
                  expirationDate: "2023-12-31",
                  displayOrder: 13
                },
                updateTimestamp: "2022-04-01T18:24:30.004626Z",
                hasSnapshot: true,
                readOnly: true,
                groupId: 654,
                supplementalReports: [],
                supplements: null,
                displayName: "Compliance Report for 2023",
                sortDate: "2022-04-01T18:24:30.004626Z",
                originalReportId: 654
              }],
            isFetching:true,
            navigate : jest.fn(),
            itemsCount:0,
            isEmpty: true,
            isFetching: false,
            getComplianceReports: jest.fn()
        }
        const component = renderer.create(
            <BrowserRouter>
                <Provider store={store}>
                    <ComplianceReportingTable {...props} />
                </Provider>
            </BrowserRouter>
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})