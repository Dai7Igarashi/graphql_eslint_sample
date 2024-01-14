import { GraphQLESLintRule } from '@graphql-eslint/eslint-plugin';
import type { GraphQLESTreeNode } from '@graphql-eslint/eslint-plugin/esm/estree-converter/types.d.mts';
import { Kind, SelectionNode } from 'graphql';

export const RULE_ID = 'require-typename';

export const rule: GraphQLESLintRule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [],
    hasSuggestions: true,
    docs: {
      category: 'Operations',
      description:
        'Require __typename in all fragment and inline-fragment field',
      url: '',
      examples: [
        {
          title: 'Incorrect (inline-fragment)',
          code: /* GraphQL */ `
            query getEntry($amebaId: String!, $entryId: Int64!) {
              entry(amebaId: $amebaId, entryId: $entryId) {
                ... on Entry {
                  # __typename is required in inline-fragment
                  title
                }
                ... on Failure {
                  # __typename is required in inline-fragment
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
          title: 'Incorrect (fragment)',
          code: /* GraphQL */ `
            query getEntry($amebaId: String!, $entryId: Int64!) {
              entry(amebaId: $amebaId, entryId: $entryId) {
                ... on Entry {
                  ...EntryFields
                }
                ... on Failure {
                  # __typename is required in inline-fragment
                  code
                }
              }
            }

            fragment EntryFields on Entry {
              # __typename is required in fragment.
              title
            }
          `,
        },
        {
          title: 'Correct(inline-fragment)',
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
          title: 'Correct (fragment)',
          code: /* GraphQL */ `
            query getEntry($amebaId: String!, $entryId: Int64!) {
              entry(amebaId: $amebaId, entryId: $entryId) {
                ... on Entry {
                  ...EntryFields
                }
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
      ],
    },
  },
  create(context) {
    function hasTypenameInEachField(
      node: GraphQLESTreeNode<SelectionNode>,
      values: string[],
    ): void {
      const hasTypename = values.includes('__typename');
      if (!hasTypename) {
        context.report({
          node,
          message: 'Require __typename in all fragment and inline-fragment',
          suggest: [
            {
              desc: 'Add __typename before field',
              fix(fixer) {
                const necessaryWhitespace = ' '.repeat(node.loc.start.column);
                return fixer.insertTextBeforeRange(
                  [node.range[0], node.range[1]],
                  `__typename\n${necessaryWhitespace}`,
                );
              },
            },
          ],
        });
      }
    }

    return {
      /** inline-fragmentに対するlint */
      SelectionSet: function (node) {
        for (const selection of node.selections) {
          if (selection.kind === Kind.INLINE_FRAGMENT) {
            const values: string[] = [];
            const inlineFragmentSelections = selection.selectionSet.selections;
            for (const inlineFragmentSelection of inlineFragmentSelections) {
              if (inlineFragmentSelection.kind === Kind.FIELD) {
                values.push(inlineFragmentSelection.name.value || '');
              }
            }
            hasTypenameInEachField(inlineFragmentSelections[0], values);
          }
        }
      },
      /** fragmentに対するlint */
      FragmentDefinition: function (node) {
        const values: string[] = [];
        for (const selection of node.selectionSet.selections) {
          if (selection.kind === Kind.FIELD) {
            values.push(selection.name.value || '');
          }
        }
        hasTypenameInEachField(node.selectionSet.selections[0], values);
      },
    };
  },
};
