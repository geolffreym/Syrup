/**
 * Created by gmena on 02-28-16.
 */

import Interface from './Interface';

/**
 * IBuilder (Dependencies) class specification
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. setName). See `iBuilder` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will available on the prototype.
 * @interface
 */
export default new Interface(
	'iBuilder', ['setName', 'build']
);

