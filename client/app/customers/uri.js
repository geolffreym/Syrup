//Base URI
import URI from '../../system/Uri';

//Controllers
import CustomerCtrl from './controller';

//Export URI provider
export default class UriCustomers {
	static getUriCollection() {
		return [
			URI.create('/list/$', CustomerCtrl.asView())
		];
	}
}