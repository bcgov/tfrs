import React from 'react';

const CreditTransactions = props => (
  <div className="dashboard-fieldset">
    <h1>Credit Transactions</h1>
    There are:

    <div>
      <div className="value">
        3
      </div>

      <div className="content">
        <h2>credit transfers in progress:</h2>

        <div><a href="">2 awaiting government analyst review</a></div>
        <div><a href="">1 awaiting Director review and statutory decision</a></div>
      </div>
    </div>

    <div>
      <div className="value">
        2
      </div>

      <div className="content">
        <h2>Part 3 Awards in progress:</h2>

        <div><a href="">2 awaiting government analyst review</a></div>
        <div><a href="">1 awaiting Director review</a></div>
      </div>
    </div>

    <div>
      <div className="content offset-value">
        <h2>View all credit transactions:</h2>

        <div><a href="">Current compliance period</a> | <a href="">All/historical</a></div>
        <div>&nbsp;</div>
        <div><a href="">Fuel Supplier Organizations</a></div>
      </div>
    </div>
  </div>
);

CreditTransactions.defaultProps = {
};

CreditTransactions.propTypes = {
};

export default CreditTransactions;
