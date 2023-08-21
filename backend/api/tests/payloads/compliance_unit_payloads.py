compliance_unit_initial_payload = {
    'status': {
        'fuelSupplierStatus': 'Draft'
    },
    "scheduleB": {
        "records": [
            {
                "fuelCode": "21",
                "fuelType": "Ethanol",
                "fuelClass": "Gasoline",
                "provisionOfTheAct": "Section 6 (5) (c)",
                "quantity": 117933500
            },
            {
                "fuelCode": None,
                "fuelType": "Petroleum-based diesel",
                "fuelClass": "Diesel",
                "provisionOfTheAct": "Section 6 (5) (b)",
                "quantity": 136896000
            }
        ]
    },
    'summary': {
        'creditsOffset': 0,
    }
}

compliance_unit_supplemental_payload = {
    'status': {
        'fuelSupplierStatus': 'Submitted'
    },
    "scheduleB": {
        "records": [
            {
                "fuelCode": "21",
                "fuelType": "Ethanol",
                "fuelClass": "Gasoline",
                "provisionOfTheAct": "Section 6 (5) (c)",
                "quantity": 117933500
            },
            {
                "fuelCode": None,
                "fuelType": "Petroleum-based diesel",
                "fuelClass": "Diesel",
                "provisionOfTheAct": "Section 6 (5) (b)",
                "quantity": 136896000
            }
        ]
    },
    'summary': {
        'creditsOffset': 0,
        'creditOffsetA': 0,
        'creditOffsetB': 0,
        'creditOffsetC': 0,
    },
    'supplemental_note': 'test compliance units'
}