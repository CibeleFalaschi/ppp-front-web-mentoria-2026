describe('Cadastro de cliente', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4000')

    // Login
    cy.get('#login-form input[name="username"]').type('admin')
    cy.get('#login-form input[name="password"]').type('admin123')
    cy.get('#login-submit').click()

    // Confirma que entrou no sistema
    cy.get('#app-page').should('be.visible')
  })

  it('Cadastro de cliente com dados válidos', () => {

    // Abrir cadastro de cliente
    cy.get('#btn-novo').click()

    // Preencher dados usando fixture
    cy.fixture('cliente').then((cliente) => {

      cy.get('#client-form input[name="nome"]').type(cliente.nome)
      cy.get('#client-form input[name="email"]').type(cliente.email)
      cy.get('#client-form input[name="telefone"]').type(cliente.telefone)
      cy.get('#client-form input[name="empresa"]').type(cliente.empresa)

      // Endereço
      cy.get('#client-form input[name="logradouro"]').type(cliente.logradouro)
      cy.get('#client-form input[name="numero"]').type(cliente.numero)
      cy.get('#client-form input[name="bairro"]').type(cliente.bairro)
      cy.get('#client-form input[name="cidade"]').type(cliente.cidade)
      cy.get('#client-form input[name="estado"]').type(cliente.estado)
      cy.get('#client-form input[name="cep"]').type(cliente.cep)

      // Status
      cy.get('#client-form select[name="status"]').select('Aberto')

      // Salvar
      cy.get('#save-client-button').click()
    })

  })

})