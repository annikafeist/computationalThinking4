import { useEditor } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Italic from '@tiptap/extension-italic'
import { TextStyle, FontFamily } from '@tiptap/extension-text-style'

// Rich-text editor that is only editable while the item is in edit mode
export function useItemEditor(item: { content: string }, isEditing: Ref<boolean>) {
  const editor = useEditor({
    content: item.content,
    editable: isEditing.value,
    autofocus: isEditing.value ? 'end' : false,
    extensions: [Document, Paragraph, Text, Italic, TextStyle, FontFamily, FontWeight],
    onUpdate: ({ editor }) => { item.content = editor.getHTML() }
  })

  watch(isEditing, (editing) => {
    editor.value?.setEditable(editing)
    if (editing) editor.value?.commands.focus('end')
  })

  return editor
}
