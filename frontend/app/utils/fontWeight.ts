import { Extension } from '@tiptap/vue-3'

// Adds a font-weight attribute to the textStyle mark (Tiptap has none built in)
export const FontWeight = Extension.create({
  name: 'fontWeight',
  addGlobalAttributes() {
    return [{
      types: ['textStyle'],
      attributes: {
        fontWeight: {
          default: null,
          parseHTML: el => el.style.fontWeight || null,
          renderHTML: attrs => attrs.fontWeight ? { style: `font-weight: ${attrs.fontWeight}` } : {}
        }
      }
    }]
  }
})
