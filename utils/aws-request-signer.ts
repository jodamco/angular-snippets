/** @format */

import * as cryptojs from 'crypto-js'
import * as Buffer from 'buffer'

// var crypto = require('crypto');

var HEADERS_TO_IGNORE = {
	authorization: true,
	connection: true,
	'x-amzn-trace-id': true,
	'user-agent': true,
	expect: true,
	'presigned-expires': true,
	range: true
}

function hmac(data: string, key: string) {
	return cryptojs.HmacSHA256(data, key)
}

// function hmacHex(key, string, encoding) {
// 	return crypto.createHmac('sha256', key).update(string, 'utf8').digest(encoding)
// }

function hmacHex(key: any, string: string, encoding: string) {
	return cryptojs.HmacSHA256(string, key).toString(cryptojs.enc.Hex)
}

// function hash(string, encoding) {
// 	return crypto.createHash('sha256').update(string, 'utf8').digest(encoding)
// }

function hash(string: string, encoding: string) {
	return cryptojs.SHA256(string).toString(cryptojs.enc.Hex)
}

function getDateTime() {
	return new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
}

export interface AccessTokens {
	accessKeyId: string
	secretAccessKey: string
	sessionToken: string
}

export interface RequestData {
	host: string
	region: string
	service: string
	method: string
	path: string
	payload: string
}

export function getAws4Headers(requestData: RequestData, headers: any, tokens: AccessTokens) {
	const runTimeDate = getDateTime()
	const selfHeaders = {
		'Content-Length': Buffer.Buffer.byteLength(requestData.payload),
		'Content-Type': 'application/json',
		Host: requestData.host,
		'X-Amz-Date': runTimeDate,
		'X-Amz-Security-Token': tokens.sessionToken
	}

	const authHeader = getAuthHeader(requestData, selfHeaders, tokens, runTimeDate)
	const contentHeader = payloadHash(requestData.payload)
	const dateHeader = runTimeDate
	const tokenHeader = tokens.sessionToken

	const authHeaders = {
		Authorization: authHeader,
		'X-Amz-Content-Sha256': contentHeader,
		'X-Amz-Date': dateHeader,
		'X-Amz-Security-Token': tokenHeader
	}
	return { ...selfHeaders, ...authHeaders }
}

function getAuthHeader(requestData: RequestData, headers: any, tokens: AccessTokens, runTimeDate: string) {
	return [
		'AWS4-HMAC-SHA256 Credential=' +
			tokens.accessKeyId +
			'/' +
			getCredentialScopeString(runTimeDate, requestData.region, requestData.service),
		'SignedHeaders=' + signedHeaders(headers),
		'Signature=' + calculateSignature(requestData, headers, tokens, runTimeDate)
	].join(', ')
}

function calculateSignature(requestData: RequestData, headers: any, tokens: AccessTokens, runTimeDate: string) {
	const strToSign = createStringToSign(requestData, headers, runTimeDate)
	const signKey = calculateSigningKey(runTimeDate, tokens.secretAccessKey, requestData.region, requestData.service)
	const signature = hmacHex(signKey, strToSign, 'hex')
	return signature
}

function calculateSigningKey(date: string, secretAccessKey: string, region: string, service: string) {
	const noTimeDate = date.substr(0, 8)
	const kDate = hmac(noTimeDate, 'AWS4' + secretAccessKey)
	const kRegion = hmac(region, kDate.toString())
	const kService = hmac(service, kRegion.toString())
	const kCredentials = hmac('aws4_request', kService.toString())
	return kCredentials
}

function createStringToSign(requestData: RequestData, headers: any, runTimeDate: string) {
	const stringToSign = [
		'AWS4-HMAC-SHA256',
		runTimeDate,
		getCredentialScopeString(runTimeDate, requestData.region, requestData.service),
		createHashedCanonicalRequest(requestData, headers)
	].join('\n')
	return stringToSign
}

function getCredentialScopeString(date: any, region: string, service: string) {
	const scopeString = [date.substr(0, 8), region, service, 'aws4_request'].join('/')
	return scopeString
}

function createHashedCanonicalRequest(requestData: RequestData, headers: any) {
	const canonicalRequest = createCanonicalRequest(requestData, headers)
	const hashedCanonicalRequest = hash(canonicalRequest, 'hex')
	return hashedCanonicalRequest
}

function createCanonicalRequest(requestData: RequestData, headers: any) {
	const canonicalRequest = [
		requestData.method,
		requestData.path,
		'',
		canonicalHeaders(headers) + '\n',
		signedHeaders(headers),
		payloadHash(requestData.payload)
	].join('\n')

	const test =
		requestData.method +
		'\n' +
		requestData.path +
		'\n' +
		'' +
		'\n' +
		canonicalHeaders(headers) +
		'\n' +
		'\n' +
		signedHeaders(headers) +
		'\n' +
		payloadHash(requestData.payload)

	return canonicalRequest
}

function canonicalHeaders(headers: any) {
	function trimAll(header: string) {
		return header.toString().trim().replace(/\s+/g, ' ')
	}
	const canonicalHeaders = Object.keys(headers)
		// TODO: Resolve Typescript issue
		// .filter(function (key) {
		// 	return HEADERS_TO_IGNORE[key.toLowerCase()] == null
		// })
		.sort(function (a, b) {
			return a.toLowerCase() < b.toLowerCase() ? -1 : 1
		})
		.map(function (key) {
			return key.toLowerCase() + ':' + trimAll(headers[key])
		})
		.join('\n')

	//console.log(canonicalHeaders)
	return canonicalHeaders
}

function signedHeaders(headers: {}) {
	const signed = Object.keys(headers)
		.map(function (key) {
			return key.toLowerCase()
		})
		// TODO: Resolve Typescript issue
		// .filter(function (key) {
		// 	return HEADERS_TO_IGNORE[key] == null
		// })
		.sort()
		.join(';')

	return signed
}

function payloadHash(payload: string) {
	const payloadHashed = hash(payload, 'hex')
	return payloadHashed
}
