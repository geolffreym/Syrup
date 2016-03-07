/**
 * Created by gmena on 02-28-16.
 */

import Interface from './Interface';

/**
 * IUri class specification
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. getUriCollection). See `iUri` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will available on the prototype.
 * @interface
 */
export default new Interface(
	'iUri', ['getUri']
);

