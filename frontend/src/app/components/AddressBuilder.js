const AddressBuilder = (prop) => {
  let address = ''

  if (prop.address_line_1) {
    address += prop.address_line_1
  }

  if (prop.address_line_2) {
    address += `, ${prop.address_line_2}`
  }

  if (prop.city) {
    address += `, ${prop.city}`
  }

  if (prop.state) {
    address += `, ${prop.state}`
  }

  if (prop.postal_code) {
    address += `, ${prop.postal_code}`
  }

  if (prop.country) {
    address += `, ${prop.country}`
  }

  return address
}

export default AddressBuilder
