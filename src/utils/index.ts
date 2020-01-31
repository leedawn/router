import { RouteLocationNormalized } from '../types'
import { guardToPromiseFn } from './guardToPromiseFn'
import { RouteRecordMatched } from '../matcher/types'

export * from './guardToPromiseFn'

type GuardType = 'beforeRouteEnter' | 'beforeRouteUpdate' | 'beforeRouteLeave'
export async function extractComponentsGuards(
  matched: RouteRecordMatched[],
  guardType: GuardType,
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) {
  const guards: Array<() => Promise<void>> = []
  await Promise.all(
    matched.map(async record => {
      // TODO: cache async routes per record
      for (const name in record.components) {
        const component = record.components[name]
        // TODO: handle Vue.extend views
        // if ('options' in component) throw new Error('TODO')
        const resolvedComponent = component
        // TODO: handle async component
        // const resolvedComponent = await (typeof component === 'function'
        //   ? component()
        //   : component)

        const guard = resolvedComponent[guardType]
        if (guard) {
          guards.push(guardToPromiseFn(guard, to, from))
        }
      }
    })
  )

  return guards
}
