import { promises as fs } from 'fs'
import path from 'path'

// Simple in-memory cache
const cache = new Map<string, any>()

const PUBLIC_DATA_ROOT = path.resolve(process.cwd(), 'public', 'data')

async function readJSON<T = any>(filePath: string): Promise<T> {
	const abs = path.resolve(filePath)
	const key = `json:${abs}`
	if (cache.has(key)) return cache.get(key)
	const data = await fs.readFile(abs, 'utf-8')
	const parsed = JSON.parse(data)
	cache.set(key, parsed)
	return parsed
}

export async function getCategories(): Promise<any[]> {
	const fp = path.join(PUBLIC_DATA_ROOT, 'categories.json')
	return readJSON<any[]>(fp)
}

function categoryToDir(categoryId: string): { dir: string; file: string }[] {
	// categoryId examples: fc-action, fc-stg, arcade-action, arcade-etc, or top-level fc/arcade
	const candidates: { dir: string; file: string }[] = []
	const file = `${categoryId}.json`
	if (categoryId.startsWith('fc')) {
		candidates.push({ dir: path.join(PUBLIC_DATA_ROOT, 'games', 'fc'), file })
	}
	if (categoryId.startsWith('arcade')) {
		candidates.push({ dir: path.join(PUBLIC_DATA_ROOT, 'games', 'arcade'), file })
	}
	// Fallback: try both roots
	candidates.push({ dir: path.join(PUBLIC_DATA_ROOT, 'games', 'fc'), file })
	candidates.push({ dir: path.join(PUBLIC_DATA_ROOT, 'games', 'arcade'), file })
	return candidates
}

export async function getGamesByCategory(categoryId: string): Promise<any[]> {
	const candidates = categoryToDir(categoryId)
	for (const c of candidates) {
		try {
			const fp = path.join(c.dir, c.file)
			const list = await readJSON<any[]>(fp)
			if (Array.isArray(list)) return list
		} catch (_) {
			// try next
		}
	}
	return []
}

async function getAllCategoryFiles(): Promise<string[]> {
	const dirs = [path.join(PUBLIC_DATA_ROOT, 'games', 'fc'), path.join(PUBLIC_DATA_ROOT, 'games', 'arcade')]
	const files: string[] = []
	for (const dir of dirs) {
		try {
			const entries = await fs.readdir(dir)
			entries.filter(e => e.endsWith('.json')).forEach(e => files.push(path.join(dir, e)))
		} catch (_) {
			// ignore missing
		}
	}
	return files
}

export async function getGameById(gameId: string): Promise<any | null> {
	const files = await getAllCategoryFiles()
	for (const fp of files) {
		try {
			const list = await readJSON<any[]>(fp)
			const found = list.find(g => String(g.id) === String(gameId))
			if (found) return found
		} catch (_) {
			// continue
		}
	}
	return null
}

export async function searchGames(query: string): Promise<any[]> {
	const q = query.trim().toLowerCase()
	if (!q) return []
	const files = await getAllCategoryFiles()
	const results: any[] = []
	for (const fp of files) {
		try {
			const list = await readJSON<any[]>(fp)
			for (const g of list) {
				const name = String(g.name || g.title || '').toLowerCase()
				if (name.includes(q)) results.push(g)
			}
		} catch (_) {}
	}
	return results
}
