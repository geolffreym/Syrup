/**
 * Created by gmena on 02-28-16.
 */

import Interface from './Interface';
import iD10sInjectable from './iD10sInjectable';

/**
 * ID10s (Dependencies) class specification
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `inject). See `iD10s` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will available on the prototype.
 * @interface
 */
export default new Interface(
	'iCore', iD10sInjectable.extend(
		['i18n', 'assert', 'getNav']
	)
);
