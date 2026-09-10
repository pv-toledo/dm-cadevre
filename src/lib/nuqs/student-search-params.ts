
import {createSearchParamsCache, parseAsBoolean, parseAsString} from 'nuqs/server'

export const studentSearchParams = {
    active: parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true, shallow: false}),
    q: parseAsString.withDefault('').withOptions({clearOnDefault:true, shallow: false})
}

export const studentSearchParamsCache = createSearchParamsCache(studentSearchParams)