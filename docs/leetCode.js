/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

var addTwoNumbers = function (l1, l2) {
  var val = l1.val + l2.val;
  var isAdd = val >= 10 ? 1 : 0;
  var list = new ListNode(val % 10);
  var result = list;
  while (l1 && l1.next || l2 && l2.next) {
    l2 = l2 && l2.next;
    l1 = l1 && l1.next;
    val = (l1 && l1.val || 0) + (l2 && l2.val || 0) + isAdd;
    isAdd = val >= 10 ? 1 : 0;
    list.next = new ListNode(val % 10);
    list = list.next;
  }
  if (isAdd && (l1 || l2)) {
    list.next = new ListNode(1);
  }
  return result;
};

// var addTwoNumbers = function(l1, l2) {
//   var List = new ListNode(0);
//   var head = List;
//   var sum = 0;
//   var carry = 0;

//   while(l1!==null||l2!==null||sum>0){

//       if(l1!==null){
//           sum = sum + l1.val;
//           l1 = l1.next;
//       }
//       if(l2!==null){
//           sum = sum + l2.val;
//           l2 = l2.next;
//       }
//       if(sum>=10){
//           carry = 1;
//           sum = sum - 10;
//       }

//       head.next = new ListNode(sum);
//       head = head.next;

//       sum = carry;
//       carry = 0;

//   }

//   return List.next;
// };
