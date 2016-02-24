/**
 * Created by gmena on 11-27-15.
 */
class Function extends Function {
	clone () {

	}

	getIndex (index) {
		return index in this && this[index] || null;
	}
}
