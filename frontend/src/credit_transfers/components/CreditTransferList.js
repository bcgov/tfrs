/*
 * Presentational component
 */
import React, { Component } from "react";

export default class CreditTransferList extends Component {
	render() {
		let tableClass = "table table-striped table-bordered table-hover" +
                     "table-condensed" +
                     ((this.props.isEmpty) ? ' hidden' : '');
        let emptyDivClass = 'mt-3'+ ((this.props.isEmpty & !this.props.isFetching) ? '' : ' hidden');
		return (<div>
			<div className={emptyDivClass}>No results found</div>
			<table className={tableClass}>
				<thead>
		          <tr>
		            <th>From</th>
		            <th>To</th>
		            <th>Credits</th>
		            <th>Value Per Credit</th>
		            <th>Total Amount</th>
		            <th>Status</th>
		          </tr>
		        </thead>
		        <tbody>
		          {
		            this.props.items.map( ( item ) => {
		            return <tr key={item.id}>
		              <td>{item.creditsFrom.name}</td>
		              <td>{item.creditsTo.name}</td>
		              <td>{item.numberOfCredits}</td>
		              <td>{item.fairMarketValuePerCredit}</td>
		              <td>{item.numberOfCredits * item.fairMarketValuePerCredit}</td>
		              <td>{item.status.status}</td>
		            </tr>
		          })}
		        </tbody>
		    </table>
		 </div>
		);
	}
}