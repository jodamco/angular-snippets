/** @format */

export function notNull(objct: any): boolean {
	return (
		objct !== null &&
		objct !== undefined &&
		(typeof objct === 'string' || objct instanceof String ? objct !== '' : true)
	)
}

export function checkIntegrityOf(token: any): boolean {
	return notNull(token) && jwtCheck(token)
}

function jwtCheck(jwtToken: any): boolean {
	let tokenParts = jwtToken.split('.')
	if (tokenParts.length != 3) {
		return false
	}
	let parsedToken = JSON.parse(decodeURIComponent(escape(window.atob(tokenParts[1]))))
	if (parsedToken.exp < Date.now() / 1000) return false
	else return true
}

export function parseJwt(token: any) {
	var base64Url = token.split('.')[1]
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
	var jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join('')
	)

	return JSON.parse(jsonPayload)
}
