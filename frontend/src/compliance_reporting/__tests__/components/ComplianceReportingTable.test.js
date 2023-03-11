import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import renderer from 'react-test-renderer'
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
})