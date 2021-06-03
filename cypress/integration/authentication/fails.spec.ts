import { cy, it, describe, beforeEach } from 'local-cypress'

describe('Failing authentication', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4000/')
    })

    it('fail with wrong username and password', () => {
        cy.get('input[name="username"]').type('does-not-exist')
        cy.get('input[name="password"]').type('wow hey')
        cy.get('button').contains('Login').click()

        cy.get('span.pnotify-pre-line')
            .should('contain', 'No active account found with the given credentials')
    })

    it('fail with no username', () => {
        cy.get('input[name="password"]').type('wow hey')
        cy.get('button').contains('Login').click()

        cy.get('div.error-text')
            .should('contain', 'This field is required')
    })

    it('fail with no password', () => {
        cy.get('input[name="username"]').type('does-not-exist')
        cy.get('button').contains('Login').click()

        cy.get('div.error-text')
            .should('contain', 'This field is required')
    })
})
