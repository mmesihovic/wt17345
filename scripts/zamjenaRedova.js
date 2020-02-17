function moveUp(row) {
  var index = row.rowIndex;
  if(index==1) return false;
  var parent = row.parentNode;
  var sibling = row.previousElementSibling;
  parent.insertBefore(row,sibling);
}

function moveDown(row) {
  var index = row.rowIndex;
  if(index==5) return false;
  let parent = row.parentNode;
  let sibling = row.nextElementSibling;
  parent.insertBefore(sibling, row);
}
