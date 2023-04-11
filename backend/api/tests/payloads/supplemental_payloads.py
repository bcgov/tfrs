initial_submission_payload = {
    'status': {
        'fuelSupplierStatus': 'Submitted'
    },
    'scheduleC': {
        'records': [
            {
                'fuelType': 'LNG',
                'fuelClass': 'Diesel',
                'quantity': 10,
                'expectedUse': 'Other',
                'rationale': 'Test rationale 1'
            },
            {
                'fuelType': 'LNG',
                'fuelClass': 'Diesel',
                'quantity': 20,
                'expectedUse': 'Other',
                'rationale': 'Test rationale 2 '
            },
            {
                'fuelType': 'LNG',
                'fuelClass': 'Diesel',
                'quantity': 30,
                'expectedUse': 'Other',
                'rationale': 'Test rationale 3'
            },
            {
                'fuelType': 'LNG',
                'fuelClass': 'Diesel',
                'quantity': 40,
                'expectedUse': 'Other',
                'rationale': 'Test rationale 4 '
            }
        ]
    },
    'scheduleA': {
        'records': [
            {
                'tradingPartner': 'CD',
                'postalAddress': '123 Main St\nVictoria, BC',
                'fuelClass': 'Diesel',
                'transferType': 'Received',
                'quantity': 98
            },
            {
                'tradingPartner': 'AB',
                'postalAddress': '123 Main St\nVictoria, BC',
                'fuelClass': 'Diesel',
                'transferType': 'Received',
                'quantity': 99
            },
            {
                'tradingPartner': 'EF',
                'postalAddress': '123 Main St\nVictoria, BC',
                'fuelClass': 'Diesel',
                'transferType': 'Received',
                'quantity': 100
            }
        ]
    },
    'scheduleB': {
        'records': [
            {
                'fuelType': 'LNG',
                'fuelClass': 'Diesel',
                'quantity': 1000000,
                'provisionOfTheAct': 'Section 6 (5) (d) (ii) (A)',
                'fuelCode': None,
                'scheduleDSheetIndex': 0
            }
        ]
    },
    'scheduleD': {
        'sheets': [
            {
                'fuelType': 'LNG',
                'fuelClass': 'Diesel',
                'feedstock': 'Corn',
                'inputs': [
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'A1',
                                'value': '10',
                                'units': 'tonnes',
                                'description': 'test',
                            },
                    {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'A1',
                                'value': '20',
                                'units': 'percent',
                            }
                ],
                'outputs': [
                    {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                    {'description': 'Fuel Distribution and Storage',
                     'intensity': '1.3'},
                    {'description': 'Fuel Production', 'intensity': '1.3'},
                    {'description': 'Feedstock Transmission',
                     'intensity': '1.3'},
                    {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                    {'description': 'Feedstock Upgrading',
                     'intensity': '1.3'},
                    {'description': 'Land Use Change', 'intensity': '1.3'},
                    {'description': 'Fertilizer Manufacture',
                     'intensity': '1.3'},
                    {'description': 'Gas Leaks and Flares',
                     'intensity': '1.3'},
                    {'description': 'CO₂ and H₂S Removed',
                     'intensity': '1.3'},
                    {'description': 'Emissions Displaced',
                     'intensity': '1.3'},
                    {'description': 'Fuel Use (High Heating Value)',
                     'intensity': '1.3'}
                ]
            }
        ]
    },
    'summary': {
        'creditsOffset': 0,
    }
}

patch_supplemental_1_payload = {
    'scheduleC': {
        'records': [
            {
                'fuelType': 'LNG',
                'fuelClass': 'Diesel',
                'quantity': 10,
                'expectedUse': 'Other',
                'rationale': 'Test rationale 1'
            },
            {
                'fuelType': 'LNG',
                'fuelClass': 'Diesel',
                'quantity': 20,
                'expectedUse': 'Other',
                'rationale': 'Test rationale 2 '
            },
            {
                'fuelType': 'LNG',
                'fuelClass': 'Diesel',
                'quantity': 30,
                'expectedUse': 'Other',
                'rationale': 'Test rationale 3'
            }
        ]
    },
    'scheduleA': {
        'records': [
            {
                'tradingPartner': 'CD',
                'postalAddress': '123 Main St\nVictoria, BC',
                'fuelClass': 'Diesel',
                'transferType': 'Received',
                'quantity': 98
            },
            {
                'tradingPartner': 'AB',
                'postalAddress': '123 Main St\nVictoria, BC',
                'fuelClass': 'Diesel',
                'transferType': 'Received',
                'quantity': 99
            }
        ]
    },
    'summary': {
        'creditsOffset': 0,
    }
}