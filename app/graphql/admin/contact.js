// Admin API documents live outside the Storefront codegen document globs
// (`app/graphql/**` is excluded in .graphqlrc.js) because they use the
// Admin schema, not the Storefront schema.

export const CONTACT_CUSTOMER_QUERY = `#graphql
  query ContactCustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      nodes {
        id
        email
        note
        tags
      }
    }
  }
`;

export const CONTACT_CUSTOMER_CREATE = `#graphql
  mutation ContactCustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

export const CONTACT_CUSTOMER_UPDATE = `#graphql
  mutation ContactCustomerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;
