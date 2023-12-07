describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user1 = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user1);

    const user2 = {
      name: "Test User",
      username: "testusername",
      password: "testpassword",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user2);

    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
  });

  describe("Login", function () {
    it("login form can be opened", function () {
      cy.contains("log in").click();
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("salainen");
      cy.get("#login-button").click();

      cy.contains("Matti Luukkainen logged in");
    });

    it("login fails with wrong password", function () {
      cy.contains("log in").click();
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");

      cy.contains("Matti Luukkainen logged in").should("not.exist");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "mluukkai", password: "salainen" });
      cy.createBlog({
        title: "first blog",
        author: "A Guy",
        url: "www.stuff.com",
        likes: 1,
      });
      cy.createBlog({
        title: "second blog",
        author: "Another Guy",
        url: "www.stuff2.com",
        likes: 2,
      });
    });

    it("A blog can be created", function () {
      cy.createBlog({
        title: "created blog",
        author: "A dude Guy",
        url: "www.who.com",
      });

      cy.contains("created blog");
    });

    it("A user can like a blog", function () {
      cy.contains("view").click();
      cy.contains("like").click();

      cy.get("#likes").contains("Likes: 2");
    });

    it("A user can delete a blog if they created it", function () {
      cy.contains("second blog").find("button").as("theButton");
      cy.get("@theButton").click();
      cy.contains("delete").click();

      cy.contains("second blog").not();
    });

    it("A user cannot delete a blog if they did not create it", function () {
      cy.contains("Logout").click();
      cy.login({ username: "testusername", password: "testpassword" });

      cy.contains("view").click();
      cy.contains("first blog").find("button").as("theButton").not();
    });

    it("Blogs are ordered according to likes from highest to lowest", function () {
      cy.get(".blog").eq(0).should("contain", "second blog");
      cy.get(".blog").eq(1).should("contain", "first blog");
    });
  });
});
