import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import store from "../../../store/store";
import ComplianceReports from "../ComplianceReports";

describe("ComplianceReports", () => {
  test("Should render the component", () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        items: [],
      },
      setFilter: jest.fn(),
    };
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReports {...props} />
        </Provider>
      </BrowserRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Checking the Analyst Count", () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        items: [
          {
            id: 654,
            status: {
              analystStatus: "Unreviewed",
              directorStatus: "Unreviewed",
              fuelSupplierStatus: "Submitted",
              managerStatus: "Unreviewed",
            },
            type:'Compliance Report',
            supplementalReports:[]
          },
        ],
      },
      setFilter: jest.fn(),
    };
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReports {...props} />
        </Provider>
      </BrowserRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });  

  test("Checking the Manager Count", () => {
    const props = {
        complianceReports: {
            isFinding: false,
            isGettingDashboard: false,
            items: [
              {
                id: 294,
                status: {
                  analystStatus: "Unreviewed",
                  directorStatus: "Unreviewed",
                  managerStatus: "Unreviewed",
                },
                type:'Compliance Report',
                supplementalReports:[{
                    status: {
                        analystStatus: "Recommended",
                        directorStatus: "Unreviewed",
                        managerStatus: "Unreviewed",
                    } 
                },]
              },{
                id: 295,
                status: {},
                type:'Exclusion Report',
                supplementalReports:[{
                    status: {},
                    supplementalReports:[{
                        status: {
                            analystStatus: "Recommended",
                            directorStatus: "Unreviewed",
                            managerStatus: "Unreviewed",
                        } 
                    },]
                },]
              },
            ],
          },
          setFilter: jest.fn(),
    }
    const component = renderer.create(
        <BrowserRouter>
            <Provider store={store}>
                <ComplianceReports {...props}/>
            </Provider>
        </BrowserRouter>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    
  });

  test("Checking the Director Count", () => {
    const props = {
      complianceReports: {
        isFinding: false,
        isGettingDashboard: false,
        items: [
          {
            id: 294,
            status: {
              analystStatus: "Unreviewed",
              directorStatus: "Unreviewed",
              managerStatus: "Unreviewed",
            },
            type:'Compliance Report',
            supplementalReports:[{
                status: {
                    analystStatus: "Recommended'",
                    directorStatus: "Unreviewed",
                    managerStatus: "Not Recommended",
                } 
            }]
          },
        ],
      },
      setFilter: jest.fn(),
    };
    const component = renderer.create(
      <BrowserRouter>
        <Provider store={store}>
          <ComplianceReports {...props} />
        </Provider>
      </BrowserRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
