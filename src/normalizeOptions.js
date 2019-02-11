import _ from 'lodash'

import {defaultNotifier} from './defaultNotifier'

export const DEFAULT_INCLUDE = /./
export const DEFAULT_EXCLUDE = /[^a-zA-Z0-9()]/
export const DEFAULT_EXCLUDE_PROP = 'children';

const toRegExp = s => _.isString(s) ? new RegExp(`^${s}$`) : s
const toArray = o =>  o ? [].concat(o) : []

export const normalizeOptions = (opts = {}) => {
  let {
    include = [DEFAULT_INCLUDE],
    exclude = [DEFAULT_EXCLUDE],
    includeProps = [DEFAULT_INCLUDE],
    excludeProps = [DEFAULT_EXCLUDE_PROP],
    groupByComponent = true,
    collapseComponentGroups = true,
    notifier = defaultNotifier,
  } = opts


  return {
    notifier,
    include: toArray(include).map(toRegExp),
    exclude: toArray(exclude).map(toRegExp),
    excludeProps: toArray(excludeProps).map(toRegExp),
    includeProps: toArray(includeProps).map(toRegExp),
    groupByComponent,
    collapseComponentGroups,
  }
}
