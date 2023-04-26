import React from "react";
import PropTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import Loading from "../../app/components/Loading";
import COMPLIANCE_REPORTING from "../../constants/routes/ComplianceReporting";
import PERMISSIONS_COMPLIANCE_REPORT from "../../constants/permissions/ComplianceReport";
import { useNavigate } from "react-router";

const ComplianceReportsBCEID = (props) => {
  const { isFetching, supplementalItems,isGettingDashboard } = props.complianceReports;
  console.log(supplementalItems, "3636");
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
  supplementalItems && supplementalItems.forEach((item) => {
    let { status  } = item;
      if (status.fuelSupplierStatus === "Draft") {
        awaitingReview.draft += 1
        awaitingReview.total += 1
      }
      if (status.fuelSupplierStatus === "Submitted" &&
        ["Accepted", "Rejected"].indexOf(status.directorStatus) < 0 && status.analystStatus === "Requested Supplemental" ||
        status.managerStatus === "Requested Supplemental") {
              awaitingReview.manager += 1
              awaitingReview.total += 1
          }
      })

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
        <div className="value">{awaitingReview.total}</div>
        <div className="content">
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
        </div>
      </div>

      <div>
        <div className="content">
          <h2>View all reports:</h2>

          <div>
            <button
              onClick={() => {
                const currentYear = new Date().getFullYear()
                props.setFilter(
                  [
                    {
                      id: "compliance-period",
                      value: currentYear.toString(),
                    },
                  ],
                  "compliance-reporting"
                );

                return navigate(COMPLIANCE_REPORTING.LIST)
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

                return navigate(COMPLIANCE_REPORTING.LIST)
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

export default ComplianceReportsBCEID
