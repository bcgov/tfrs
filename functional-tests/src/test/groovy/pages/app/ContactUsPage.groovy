package pages

class ContactUsPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Contact Us' }
  static url = '/contact_us'
  static content = {
    pageTitle { $('#main .page_contact_us h1') }
  }
}
