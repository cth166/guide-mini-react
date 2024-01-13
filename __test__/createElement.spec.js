import { it, expect, describe } from 'vitest'
import React from '../core/React'

describe('create Element', () => {
  it('without props', () => {
    const el = React.createElement('div', null, '我爱王彦秋')

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "我爱王彦秋",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `)
  })

  it('with props and more children', () => {
    const el = React.createElement('div', { id: 'heihei' },
      'mini-react',
      React.createElement('span', { id: 'lover' }, '我爱王彦秋')
    )
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "mini-react",
              },
              "type": "TEXT_ELEMENT",
            },
            {
              "props": {
                "children": [
                  {
                    "props": {
                      "children": [],
                      "nodeValue": "我爱王彦秋",
                    },
                    "type": "TEXT_ELEMENT",
                  },
                ],
                "id": "lover",
              },
              "type": "span",
            },
          ],
          "id": "heihei",
        },
        "type": "div",
      }
    `)
  })
})