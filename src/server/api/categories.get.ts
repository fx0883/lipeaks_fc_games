import { getCategories } from '../utils/data'

export default defineEventHandler(async () => {
	const categories = await getCategories()
	return categories
})
