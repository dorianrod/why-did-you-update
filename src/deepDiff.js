import _, {filter} from 'lodash';
import every from 'lodash/every'
import isEqual from 'react-fast-compare'
import {shouldInclude} from './shouldInclude';

export const DIFF_TYPES = {
  UNAVOIDABLE: 'unavoidable',
  SAME: 'same',
  EQUAL: 'equal',
  FUNCTIONS: 'functions'
}

export const classifyDiff = (prev, next, name, opts = {}) => {
  if (prev === next) {
    return {
      type: DIFF_TYPES.SAME,
      name,
      prev,
      next
    }
  }

  if (isEqual(prev, next)) {
    let changedKeys = [];
    if (prev && next) {
      Object.keys(prev).forEach((key) => {
        if ( shouldInclude(key, {include: opts.includeProps, exclude: opts.excludeProps}) &&  prev[key] !== next[key]) {
          changedKeys.push(key);
        }
      });
    }

    return {
      type: DIFF_TYPES.EQUAL,
      name,
      prev,
      next,
      changedKeys
    }
  }if (prev && next) {
    Object.keys(prev).forEach((key) => {
      if ( shouldInclude(key, {include: opts.includeProps, exclude: opts.includeProps}) &&  prev[key] !== next[key]) {
        console.log('"' + key + '" property is not equal by reference');
      }
    });
  }

  if (!prev || !next) {
    return {
      type: DIFF_TYPES.UNAVOIDABLE,
      name,
      prev,
      next
    }
  }

  const isChanged = key => (prev[key] !== next[key]) && (!_.isEqual(prev[key], next[key]));
  const isSameFunction = key => {
    const prevFn = prev[key];
    const nextFn = next[key];
    return _.isFunction(prevFn) && _.isFunction(nextFn) && prevFn.name === nextFn.name;
  };

  let keys = _.union(_.keys(prev), _.keys(next));

  let {includeProps, excludeProps} = opts;
  keys = filter(keys, (key)=>{
    return shouldInclude(key, {include: includeProps, exclude: excludeProps});
  }); 

  {
    let changedKeys = _.filter(keys, isChanged);

    if (changedKeys.length && every(changedKeys, isSameFunction)) {
      return {
        type: DIFF_TYPES.FUNCTIONS,
        name,
        prev: _.pick(prev, changedKeys),
        next: _.pick(next, changedKeys)
      }
    }
  }

  return {
    type: DIFF_TYPES.UNAVOIDABLE,
    name,
    prev,
    next
  }
}
