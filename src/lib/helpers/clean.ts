export function removeHtmlTagsFromText(text: string): string {
  return text.replace(/<(.|\n)*?>/g, '');
}