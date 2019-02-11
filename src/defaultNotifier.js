import {DIFF_TYPES} from './deepDiff'
import { some } from 'lodash';

export const defaultNotifier = (groupByComponent, collapseComponentGroups, displayName, diffs, opts) => {
  let hasDiffToDisplay = some(diffs, (diff)=>{
    return diff.type == DIFF_TYPES.EQUAL ? diff.changedKeys.length > 0 : !(diff.type == DIFF_TYPES.SAME); 
  });

  if(!hasDiffToDisplay) return;

  if (groupByComponent && collapseComponentGroups) {
    console.groupCollapsed && console.groupCollapsed(displayName)
  } else if (groupByComponent) {
    console.group && console.group(displayName)
  }

  diffs.forEach(function(item){
    notifyDiff.call(this, item, opts);
  })

  if (groupByComponent) {
    console.groupEnd && console.groupEnd()
  }
}

// Disables yellow box in React Native before warn
const consoleWarn = (args) => {
  const oldDisableYellowBox = console.disableYellowBox;
  console.disableYellowBox = true;
  console.warn(args);
  console.disableYellowBox = oldDisableYellowBox;
};

const notifyDiff = ({name, prev, changedKeys, next, type}, opts) => {
  switch (type) {
  case DIFF_TYPES.SAME:
    consoleWarn(`${name}: Value is the same (equal by reference). Avoidable re-render!`);
    console.log(`Value:`, prev);
    break;
  case DIFF_TYPES.EQUAL:
    consoleWarn(`${name}: Value did not change. Avoidable re-render!`);
    console.log(`Before:`, prev);
    console.log(`After:`, next);
    (changedKeys || []).forEach((key)=>{
      console.log('"' + key + '" property is not equal by reference');
    });
    break;
  case DIFF_TYPES.FUNCTIONS:
    consoleWarn(`${name}: Changes are in functions only. Possibly avoidable re-render?`);
    console.log(`Functions before:`, prev);
    console.log(`Functions after:`, next);
    break;
  }
}
