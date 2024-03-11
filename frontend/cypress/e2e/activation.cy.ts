
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

import mimelib from 'mimelib'

describe('Activation page', () => {
  let activationId: string
  let activationCode: string

  it('receive join email', () => {
    cy.request({
      method: 'GET',
      url: Cypress.env('EMAIL_API_URL'),
      headers: {
        'Api-token': Cypress.env('EMAIL_API_TOKEN'),
      },
    }).then((response) => {
      const inbox = response.body;
      expect(inbox).to.be.an('array');
      expect(inbox[0].subject).to.equal('Join');
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
        const activationIdMatch = email.match(/(?<=activation\/)[^/]+/i);
        const activationCodeMatch = email.match(/(?<=Your activation code is <b>)(\d{4})/i); // Adjusted regex
  
        if (activationIdMatch && activationCodeMatch) {
          const activationId = activationIdMatch[0];
          const activationCode = activationCodeMatch[0];
          expect(activationId).to.be.a('string');
          expect(activationCode).to.be.a('string');
        } else {
          // Handle the case where the matches are not found
          throw new Error('Activation ID or code not found in the email');
        }
      });
    });
  });
  

  it('successfully loads', () => {
    cy.visit(`auth/activation/${activationId}`)
  })

  it('resend email', () => {
    cy.contains('div', 'Resend email').click()
    cy.contains(/Check your emails!/gi, {
      timeout: 5000,
    })
  })

  it('receive resend email', () => {
    cy.request({
      method: 'GET',
      url: Cypress.env('EMAIL_API_URL'),
      headers: {
        'Api-token': Cypress.env('EMAIL_API_TOKEN'),
      },
    }).then((response) => {
      const inbox = response.body
      expect(inbox).to.be.an('array')
      expect(inbox[0].subject).to.equal('Join')
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
        if (email !== null) {
          const activationIdMatch = email.match(/(?<=activation\/)[^/]+/i);
          const activationCodeMatch = email.match(/(?<=Your activation code is <b>*)(\d{4})/i);

          if (activationIdMatch && activationCodeMatch) {
            activationId = activationIdMatch[0];
            activationCode = activationCodeMatch[0];

            expect(activationId).to.be.a('string');
            expect(activationCode).to.be.a('string');
          } else {
            // Handle the case where the matches are not found
            throw new Error('Activation ID or code not found in the email');
          }
        }
      })
    })
  })

  it('fill in activation form', () => {
    cy.get('input[placeholder="Activation code"]').type(activationCode)
  })

  it('send activation request', () => {
    cy.contains('input', 'Activate').click()
  })

  it('receive activation notification', () => {
    cy.contains(/Account activated!/gi, {
      timeout: 5000,
    })
  })
})
