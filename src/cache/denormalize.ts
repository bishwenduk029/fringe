import * as GraphQL from 'graphql'
import {
  DenormalizationResult,
  FieldNodeWithSelectionSet,
  Variables,
  ResponseObject,
  ResponseObject2,
  ResponseObjectArray,
  RootFields,
  ResolveType,
} from './types'
import {
  expandFragments,
  getDocumentDefinitions,
  fieldNameWithArguments,
  shouldIncludeField,
  defaultResolveType,
} from './functions'
import { NormKey } from './norm-map'
import { Cache } from 'cache'

type Mutable<T> = { -readonly [P in keyof T]: T[P] } // Remove readonly

type MutableResponseObject = Mutable<ResponseObject>
// eslint-disable-next-line functional/prefer-readonly-type
type MutableResponseObjectArray = Array<MutableResponseObject>
type ParentResponseObjectOrArray =
  | Mutable<ResponseObject2>
  | ResponseObjectArray
type ParentResponseKey = string | number | undefined
type StackWorkItem = readonly [
  FieldNodeWithSelectionSet,
  NormKey | ReadonlyArray<NormKey>,
  ParentResponseObjectOrArray,
  ParentResponseKey,
  NormKey,
  string,
]

/**
 * Creates a graphql response by denormalizing.
 * @param query The graphql query document
 * @param variables The graphql query variables
 * @param normMap The map of normalized objects
 * @param resolveType Function get get typeName from an object
 */
export async function denormalize(
  query: GraphQL.DocumentNode,
  variables: Variables | undefined,
  normMap: Cache,
  resolveType: ResolveType = defaultResolveType,
): Promise<DenormalizationResult> {
  const [fragmentMap, rootFieldNode] = getDocumentDefinitions(query.definitions)

  const stack: Array<StackWorkItem> = []
  const response = {}
  const usedFieldsMap: {
    // eslint-disable-next-line
    [key: string]: Set<string>
  } = {}
  stack.push([
    rootFieldNode,
    'ROOT_QUERY',
    response,
    undefined,
    'ROOT_QUERY',
    'ROOT_QUERY',
  ])
  while (stack.length > 0) {
    const [
      fieldNode,
      idOrIdArray,
      parentObjectOrArray,
      parentResponseKey,
      parentNormKey,
      fieldNameInParent,
    ] = stack.pop()!

    // The stack has work items, depending on the work item we have four different cases to handle:
    // field + id      + parentObject = denormalize(ID) => [responseObject, workitems] and parentObject[field] = responseObject
    // field + id      + parentArray  = denormalize(ID) => [responseObject, workitems] and parentArray.push(responseObject)
    // field + idArray + parentObject = stack.push(workItemsFrom(idArray)) and parentObject[field] = new Array()
    // field + idArray + parentArray  = stack.push(workItemsFrom(idArray)) and parentArray.push(new Array())

    let responseObjectOrNewParentArray:
      | MutableResponseObject
      | MutableResponseObjectArray
      | null

    if (idOrIdArray === null) {
      responseObjectOrNewParentArray = null
    } else if (!Array.isArray(idOrIdArray)) {
      const key: NormKey = idOrIdArray as NormKey

      const normObj = await normMap.get(key)

      // Does not exist in normalized map. We can't fully resolve query
      if (!normObj) {
        return {
          data: undefined,
          fields: { [parentNormKey]: new Set([fieldNameInParent]) },
        }
      }

      let usedFields = usedFieldsMap[key]
      if (usedFields === undefined) {
        usedFields = new Set()
        usedFieldsMap[key] = usedFields
      }

      // If we've been here before we need to use the previously created response object
      if (Array.isArray(parentObjectOrArray)) {
        responseObjectOrNewParentArray =
          (parentObjectOrArray as MutableResponseObjectArray)[
            parentResponseKey as number
          ] || Object.create(null)
      } else {
        responseObjectOrNewParentArray =
          (parentObjectOrArray as MutableResponseObject)[
            parentResponseKey as string
          ] || Object.create(null)
      }

      // Expand fragments and loop all fields
      const expandedSelections = expandFragments(
        resolveType,
        normObj,
        fieldNode.selectionSet.selections,
        fragmentMap,
      )
      for (const field of expandedSelections) {
        // Check if this field should be skipped according to @skip and @include directives
        const include = field.directives
          ? shouldIncludeField(field.directives, variables)
          : true
        if (include) {
          // Build key according to any arguments
          const fieldName =
            field.arguments && field.arguments.length > 0
              ? fieldNameWithArguments(field, variables)
              : field.name.value
          // Add this to used fields
          usedFields.add(fieldName)
          const normObjValue = normObj[fieldName]
          if (normObjValue !== null && field.selectionSet) {
            // Put a work-item on the stack to build this field and set it on the response object
            stack.push([
              field as FieldNodeWithSelectionSet,
              normObjValue as any,
              responseObjectOrNewParentArray as
                | MutableResponseObject
                | MutableResponseObjectArray,
              (field.alias && field.alias.value) || field.name.value,
              key,
              fieldName,
            ])
          } else {
            // This field is a primitive (not a array or object)
            if (normObjValue !== undefined) {
              ;(responseObjectOrNewParentArray as MutableResponseObject)[
                (field.alias && field.alias.value) || field.name.value
              ] = normObjValue
            } else {
              return {
                data: undefined,
                fields: { [key]: new Set([fieldName]) },
              }
            }
          }
        }
      }
    } else {
      const idArray: ReadonlyArray<NormKey> = idOrIdArray
      responseObjectOrNewParentArray =
        (parentObjectOrArray as MutableResponseObject)[
          parentResponseKey as string
        ] || []
      for (let i = 0; i < idArray.length; i++) {
        const idArrayItem = idArray[i]
        stack.push([
          fieldNode,
          idArrayItem,
          responseObjectOrNewParentArray as
            | MutableResponseObject
            | MutableResponseObjectArray,
          i,
          parentNormKey,
          fieldNameInParent,
        ])
      }
    }

    // Add to the parent, either field or an array
    if (Array.isArray(parentObjectOrArray)) {
      const parentArray: MutableResponseObjectArray = parentObjectOrArray
      parentArray[
        parentResponseKey as number
      ] = responseObjectOrNewParentArray as
        | MutableResponseObject
        | MutableResponseObjectArray
    } else {
      const parentObject: MutableResponseObject = parentObjectOrArray
      parentObject[
        parentResponseKey ||
          (fieldNode.alias && fieldNode.alias.value) ||
          fieldNode.name.value
      ] = responseObjectOrNewParentArray
    }
  }

  interface GraphQLResponse {
    readonly data: RootFields
  }

  const data = (response as GraphQLResponse).data

  return {
    data: data,
    fields: usedFieldsMap,
  }
}
