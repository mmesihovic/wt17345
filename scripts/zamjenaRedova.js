function moveUp(row) {
  var index = row.rowIndex;
  if(index==1) return false;
  var table = document.getElementsByClassName('tabela')[0];
  var tempRow = table.rows[index-1].innerHTML;
  table.rows[index-1].innerHTML = table.rows[index].innerHTML;
  table.rows[index].innerHTML = tempRow;
}

function moveDown(row) {
  var index = row.rowIndex;
  if(index==5) return false;
  var table = document.getElementsByClassName('tabela')[0];
  var tempRow = table.rows[index+1].innerHTML;
  table.rows[index+1].innerHTML = table.rows[index].innerHTML;
  table.rows[index].innerHTML = tempRow;
}
