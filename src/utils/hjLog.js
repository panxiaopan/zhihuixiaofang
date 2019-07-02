export default function hjLog({
  content,
  pre,
  postfix,
  method
} = {
  content: 'content',
  pre: 'pre',
  postfix: 'postfix',
  method: 'log'
}) {
  pre = pre || '';
  postfix = postfix || '';
  console[method](pre + ', ' + content + ', ' + postfix)

}
