import { GraphQLRuleTester } from '@graphql-eslint/eslint-plugin';
import { rule, RULE_ID } from '../rules/require-typename';

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests(RULE_ID, rule, {
  valid: [
    {
      name: '__typename in inline-fragment',
      code: /* GraphQL */ `
        query getEntry($amebaId: String!, $entryId: Int64!) {
          entry(amebaId: $amebaId, entryId: $entryId) {
            ... on Entry {
              __typename
              title
            }
            ... on Failure {
              __typename
              code
            }
          }
        }
      `,
    },
    {
      name: '__typename in fragment',
      code: /* GraphQL */ `
        query getEntry($amebaId: String!, $entryId: Int64!) {
          entry(amebaId: $amebaId, entryId: $entryId) {
            ...EntryFields
            ... on Failure {
              __typename
              code
            }
          }
        }

        fragment EntryFields on Entry {
          __typename
          title
        }
      `,
    },
    {
      name: '__typename except inline-fragment or fragment',
      code: /* GraphQL */ `
        query getEntry($amebaId: String!, $entryId: Int64!) {
          entry(amebaId: $amebaId, entryId: $entryId) {
            id
          }
        }
      `,
    },
  ],
  invalid: [
    {
      name: 'no __typename in inline-fragment',
      code: /* GraphQL */ `
        query getEntry($amebaId: String!, $entryId: Int64!) {
          entry(amebaId: $amebaId, entryId: $entryId) {
            ... on Entry {
              title
            }
            ... on Failure {
              code
            }
          }
        }
      `,
      errors: [
        { message: 'Require __typename in all fragment and inline-fragment' },
        { message: 'Require __typename in all fragment and inline-fragment' },
      ],
    },
  ],
});
