Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

import mimelib from 'mimelib'

describe('Reset page', () => {
  let recoveryId: string
  let recoveryCode: string

  it('receive recovery email', () => {
    cy.request({
      method: 'GET',
      url: Cypress.env('EMAIL_API_URL'),
      headers: {
        'Api-token': Cypress.env('EMAIL_API_TOKEN'),
      },
    }).then((response) => {
      const inbox = response.body;
      expect(inbox).to.be.an('array');
      expect(inbox[0].subject).to.equal('Recovery');
      expect(inbox[0].to_email).to.equal('johndoe@example.com');
      const emailId = inbox[0].id;
      cy.request({
        method: 'GET',
        url: `${Cypress.env('EMAIL_API_URL')}/${emailId}/body.eml`,
        headers: {
          'Api-token': Cypress.env('EMAIL_API_TOKEN'),
        },
      }).then((response) => {
        // Decode quoted-printable body of the email
        const email = mimelib.decodeQuotedPrintable(response.body);
        const recoveryIdMatch = email.match(/(?<=reset\/)[^/]+/i);
        const recoveryCodeMatch = email.match(/(?<=Your recovery code is <b>)(\d{4})/i); // Adjusted regex
  
        if (recoveryIdMatch && recoveryCodeMatch) {
          const recoveryId = recoveryIdMatch[0];
          const recoveryCode = recoveryCodeMatch[0];
          expect(recoveryId).to.be.a('string');
          expect(recoveryCode).to.be.a('string');
        } else {
          // Handle the case where the matches are not found
          throw new Error('Recovery ID or code not found in the email');
        }
      });
    });
  });  

  it('successfully loads', () => {
    cy.visit(`auth/reset/${recoveryId}`)
  })

  it('fill in reset form', () => {
    cy.get('input[placeholder="Code"]').type(recoveryCode)
    cy.get('input[placeholder="Password"]').type('12345')
    cy.get('input[placeholder="Password again"]').type('12345')
  })

  it('send reset request', () => {
    cy.contains('input', 'Save').click()
  })

  it('receive reset notification', () => {
    cy.contains(/Password updated!/gi, {
      timeout: 5000,
    })
  })

  it('receive reset email', () => {
    cy.request({
      method: 'GET',
      url: Cypress.env('EMAIL_API_URL'),
      headers: {
        'Api-token': Cypress.env('EMAIL_API_TOKEN'),
      },
    }).then((response) => {
      const inbox = response.body
      expect(inbox).to.be.an('array')
      expect(inbox[0].subject).to.equal('Reset')
      expect(inbox[0].to_email).to.equal('johndoe@example.com')
      const emailId = inbox[0].id
      cy.request({
        method: 'GET',
        url: `${Cypress.env('EMAIL_API_URL')}/${emailId}/body.eml`,
        headers: {
          'Api-token': Cypress.env('EMAIL_API_TOKEN'),
        },
      }).then((response) => {
        // Decode quoted-printable body of the email
        const email = mimelib.decodeQuotedPrintable(response.body)
        expect(email).to.be.a('string')
      })
    })
  })
})
