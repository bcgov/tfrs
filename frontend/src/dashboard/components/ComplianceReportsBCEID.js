import React, { useState } from "react";
import PropTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import Loading from "../../app/components/Loading";
import COMPLIANCE_REPORTING from "../../constants/routes/ComplianceReporting";
import PERMISSIONS_COMPLIANCE_REPORT from "../../constants/permissions/ComplianceReport";
import { useNavigate } from "react-router";

const ComplianceReportsBCEID = (props) => {
  const { isFetching, items, isGettingDashboard } = props.complianceReports;
  console.log(items, "3636");
  const navigate = useNavigate();

  if (isFetching || isGettingDashboard) {
    return <Loading />;
  }

  const awaitingReview = {
    draft: 0,
    review: 0,
    supplemental: 0,
    total: 0
  };
  const deepestSupplementalReports_id = new Set();
  items.forEach((item) => {
    let { status, id } = item;
    const { supplementalReports, type } = item;

    if (supplementalReports.length > 0) {
      let [deepestSupplementalReport] = supplementalReports;

      while (
        deepestSupplementalReport.supplementalReports &&
        deepestSupplementalReport.supplementalReports.length > 0
      ) {
        [deepestSupplementalReport] =
          deepestSupplementalReport.supplementalReports;
      }
      console.log(deepestSupplementalReport, "line 50");
      {
        if (!deepestSupplementalReports_id.has(deepestSupplementalReport.id)) {
          deepestSupplementalReports_id.add(deepestSupplementalReport.id)[
            deepestSupplementalReport
          ] = deepestSupplementalReport.supplementalReports;
        } else {
          return;
        }
      }
      ({ status } = deepestSupplementalReport);
      if (status.fuelSupplierStatus === "Draft") {
        awaitingReview.draft += 1
        awaitingReview.total += 1
      }
      if (
        status.fuelSupplierStatus === "Submitted" &&
        ["Accepted", "Rejected"].indexOf(status.directorStatus) < 0
      ) {
        if (
          status.analystStatus === "Requested Supplemental" ||
          status.managerStatus === "Requested Supplemental"
        ) {
          awaitingReview.supplemental += 1;
        }
        awaitingReview.total += 1;
      }
    } else {
      if (!deepestSupplementalReports_id.has(id)) {
        deepestSupplementalReports_id.add(id)
        if (status.fuelSupplierStatus === "Draft") {
          awaitingReview.draft += 1
          awaitingReview.total += 1
        }
      }
      if (!deepestSupplementalReports_id.has(id)) {
        deepestSupplementalReports_id.add(id)
        if (
          status.fuelSupplierStatus === "Submitted" &&
          ["Accepted", "Rejected"].indexOf(status.directorStatus) < 0
        ) {
          if (
            status.analystStatus === "Requested Supplemental" ||
            status.managerStatus === "Requested Supplemental"
          ) {
            awaitingReview.supplemental += 1
          }
          awaitingReview.total += 1
        }
      }
    }
  });

  

  const handeleFun = () => {
    props.setFilter(
      [
        {
          id: "current-status",
          value: ["In Draft", "Supplemental Requested"],
        },
      ],
      "compliance-reporting"
    );
  };
  return (
    <div className="dashboard-fieldset">
      <h1>Compliance &amp; Exclusion Reports</h1>
      {props.loggedInUser.organization.name} has:
      <div>
        <div className="value">{awaitingReview.total}---</div>
        <div className="content">
          {/* <h4>Compliance & Exclusion Reports  in Progress</h4> */}
          <button
            onClick={() => {
              props.setFilter(
                [
                  {
                    id: "current-status",
                    value: ["In Draft", "Supplemental Requested"],
                  },
                ],
                "compliance-reporting"
              );

              return navigate(COMPLIANCE_REPORTING.LIST, {
                state: { items: ["In Draft", "Supplemental Requested"] },
              });
            }}
            type="button"
          >
            Compliance & Exclusion Reports in Progress
          </button>
          {/* Draft */}
          {/* <div>
            <button
              onClick={() => {
                props.setFilter([ {
                  id: 'current-status',
                  value: ['In Draft']s
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.complianceReports.draft} in draft
            </button>
          </div> */}

          {/* Requested Supplemental */}
          {/* <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Compliance Report'
                }, {
                  id: 'current-status',
                  value: 'Supplemental Requested'
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.complianceReports.supplemental} supplemental requested
            </button>
          </div> */}

          {/* Awaiting Government Review */}
          {/* <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Compliance Report'
                }, {
                  id: 'current-status',
                  value: 'Submitted'
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.complianceReports.review} awaiting government review
            </button>
          </div> */}
        </div>
      </div>
      {/* Exclusion Report 
      <div>
        <div className="value">
          {awaitingReview.exclusionReports.total}
        </div>
        <div className="content">
          <h2>exclusion reports in progress:</h2>

          <div>* Draft 
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Draft'
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.draft} in draft
            </button>
          </div>

          <div> Requested Supplemental 
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Supplemental Requested'
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.supplemental} supplemental requested
            </button>
          </div>

          <div> Awaiting Government Review 
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Submitted'
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.review} awaiting government review
            </button>
          </div>
        </div>
      </div> */}
      <div>
        <div className="content">
          <h2>View all reports:</h2>

          <div>
            <button
              onClick={() => {
                const currentYear = new Date().getFullYear();

                props.setFilter(
                  [
                    {
                      id: "compliance-period",
                      value: currentYear.toString(),
                    },
                  ],
                  "compliance-reporting"
                );

                return navigate(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              Current compliance period
            </button>
            {" | "}
            <button
              onClick={() => {
                props.setFilter(
                  [
                    {
                      id: "compliance-period",
                      value: "",
                    },
                  ],
                  "compliance-reporting"
                );

                return navigate(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              All/historical
            </button>
          </div>
        </div>
      </div>
      {props.loggedInUser.hasPermission(
        PERMISSIONS_COMPLIANCE_REPORT.MANAGE
      ) && (
        <div className="add-button">
          <FontAwesomeIcon icon="play" />{" "}
          <button
            onClick={() => navigate(COMPLIANCE_REPORTING.LIST)}
            type="button"
          >
            Start a new compliance report or exclusion report
          </button>
        </div>
      )}
    </div>
  );
};

ComplianceReportsBCEID.defaultProps = {};

ComplianceReportsBCEID.propTypes = {
  complianceReports: PropTypes.shape({
    isFetching: PropTypes.bool,
    isGettingDashboard: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  setFilter: PropTypes.func.isRequired,
};

export default ComplianceReportsBCEID;
