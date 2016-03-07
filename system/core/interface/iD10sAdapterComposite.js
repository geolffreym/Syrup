/**
 * Created by gmena on 02-28-16.
 */

import Interface from './Interface';
import iAdapter from './iAdapter';

/**
 * ID10sAdapterComposite (Dependencies) class specification
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `getD10sAdapted). See `iD10sAdapterComposite` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will available on the prototype.
 * @interface
 */
export default new Interface(
	'iD10sAdapterComposite', iAdapter.extend(
		['getD10sAdapted', 'addD10sAdapter']
	)
);
