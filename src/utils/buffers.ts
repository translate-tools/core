/**
 * Convert a nodejs `Buffer` to `ArrayBuffer`
 */
export const bufferToArrayBuffer = (buffer: Buffer) => {
	const arrayBuffer = new ArrayBuffer(buffer.length);

	// Copy bytes
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; i++) {
		view[i] = buffer[i];
	}

	return arrayBuffer;
};

/**
 * Convert `ArrayBuffer` to a nodejs `Buffer`
 */
export const arrayBufferToBuffer = (arrayBuffer: ArrayBuffer) => {
	const buffer = Buffer.alloc(arrayBuffer.byteLength);

	// Copy bytes
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; i++) {
		buffer[i] = view[i];
	}

	return buffer;
};
