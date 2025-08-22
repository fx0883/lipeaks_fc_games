import { getGamesByCategory } from '../../../utils/data'

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id')
	if (!id) {
		throw createError({ statusCode: 400, statusMessage: 'Missing category id' })
	}
	const list = await getGamesByCategory(id)
	return list
})
