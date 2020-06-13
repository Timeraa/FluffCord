export default interface ClientOptions {
	/**
	 * Discord Bot token
	 */
	token: string;
	/**
	 * Whether to log debug events
	 */
	debug?: boolean;
	/**
	 * Whether to log all requests
	 */
	debugRequests?: boolean;
	/**
	 * Dispatch events to ignore
	 */
	omittedDebugEvents?: string[];
}
