export function levelFilters(level) {
  let txt = '';
  switch (level) {
    case 1:
      txt = '国家级';
      break;
    case 2:
      txt = '省部级';
      break;
    case 3:
      txt = '市厅级';
      break;
    case 4:
      txt = '院级';
      break;
  }
  return txt;
}
export function typeFilters(level) {
  let txt = '';
  switch (level) {
    case 1:
      txt = '纵向';
      break;
    case 2:
      txt = '横向';
      break;
  
  }
  return txt;
}
