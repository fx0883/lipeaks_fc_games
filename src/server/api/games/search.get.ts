import { searchGames } from '../../utils/data'

export default defineEventHandler(async (event) => {
	const q = getQuery(event)?.q as string | undefined
	if (!q || !q.trim()) return []
	const results = await searchGames(q)
	return results
})
