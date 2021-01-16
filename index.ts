const main = async () => {
	const some = await import('./src/pages')
	console.log(some)
}

main()
