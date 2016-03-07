/**
 * Created by gmena on 02-28-16.
 */

import Interface from './Interface';
import iD10s from './iD10s';

/**
 * ID10sComposite (Dependencies) class specification
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `inject). See `iD10sComposite` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will available on the prototype.
 * @interface
 */
export default new Interface(
	'iD10sComposite', iD10s.extend(
		['getD10s', 'addD10s']
	)
);
