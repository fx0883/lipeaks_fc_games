import { getGameById } from '../../utils/data'

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id')
	if (!id) {
		throw createError({ statusCode: 400, statusMessage: 'Missing id' })
	}
	const game = await getGameById(id)
	if (!game) {
		throw createError({ statusCode: 404, statusMessage: 'Game not found' })
	}
	return game
})
