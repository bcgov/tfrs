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

compliance_unit_positive_offset_payload = {
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
            }
        ]
    },
    'summary': {
        'creditsOffset': 0,
    }
}

compliance_unit_negative_offset_payload = {
    'status': {
        'fuelSupplierStatus': 'Draft'
    },
    "scheduleB": {
        "records": [
            {
                "fuelCode": None,
                "fuelType": "Petroleum-based diesel",
                "fuelClass": "Diesel",
                "provisionOfTheAct": "Section 6 (5) (b)",
                "quantity": 136896000
            }
        ]
    },
    "summary": {
        "dieselClassDeferred": 0,
        "dieselClassObligation": 0,
        "dieselClassPreviouslyRetained": 0,
        "dieselClassRetained": 0,
        "gasolineClassDeferred": 0,
        "gasolineClassObligation": 0,
        "gasolineClassPreviouslyRetained": 0,
        "gasolineClassRetained": 0,
        "creditsOffset": 0,
        "creditsOffsetA": 0,
        "creditsOffsetB": 0,
        "creditsOffsetC": 0
    }
}

compliance_unit_positive_supplemental_payload = {
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

compliance_unit_negative_supplemental_payload = {
    'status': {
        'fuelSupplierStatus': 'Submitted'
    },
    "scheduleB": {
        "records": [
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