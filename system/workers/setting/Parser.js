/**
 * Created by Geolffrey on 13/02/14.
 */

addEventListener ( 'message', function ( e ) {

	var data = e.data,
	    fields = data.fields,
	    key_recursive = {},
	    key_tree = [],
	    response = false,
	    template = data.template,
	    new_template,
	    regex_sentence_for = /((?=<%)(.*)(for)(.*)(%>))/g,
	    regex_sentence_if = /((?=<%)(.*)(if)(.*)(%>))/g,

	    Template = {
		    toObject:        function ( array ) {
			    var obj = {},
			        _i = array.length;
			    while ( _i-- ) {
				    obj[array[_i]] = array[_i];
			    }

			    return obj;
		    },
		    objectAsString: function ( obj ) {
			    return Object.prototype.toString.call ( obj )
		    },
		    clean_key:        function ( s ) {
			    return s.replace ( /(\[.*\])/g, '*' )
		    },
		    split_sentence:   function ( string ) {
			    return string
				    .split ( '%>' )
				    .join ( '\n' )
				    .split ( '<%' )
				    .join ( '\n' );
		    },
		    is_for:           function ( match ) {
			    return regex_sentence_for.test ( match )
		    },
		    is_if:            function ( match ) {
			    return regex_sentence_if.test ( match )
		    },
		    repeatString:    function ( str, times ) {
			    return Array ( times + 1 ).join ( str );
		    },
		    for_loop:         function ( loop, fields, parent ) {
			    var _vars_split,
			        _pibote, _filter,
			        _self = this,
			        _tmp_filter,
			        _keys = Object.keys ( fields ),
			        _i = _keys.length;

			    if ( _self.objectAsString ( loop ) === '[object String]' ) {
				    loop = loop.trim ();
				    loop = loop.split ( '\n' )
			    }

			    _vars_split = loop[0].split ( '|' );
			    _pibote = _vars_split[1];
			    _filter = !parent ? _vars_split[3] : false;

			    if ( _vars_split[3].indexOf ( '-' ) > -1 )
				    _filter = _self.toObject ( _vars_split[3].split ( '-' ) );

			    response = !response ? loop[1] : response;
			    _tmp_filter = _filter;

			    while ( _i-- ) {
				    //console.log(_keys[_i] + ' is ' + _self.objectAsString(fields[_keys[_i]]) + ' and value = ' + fields[_keys[_i]])

				    var _type = _self.objectAsString ( fields[_keys[_i]] );
				    if ( (_type === '[object Object]' || _type === '[object Array]') ) {


					    if ( typeof _tmp_filter === 'object' ) {
						    var _index = !parent ? _keys[_i] : parent;

						    _filter = !!_tmp_filter[_index]
							    ? _tmp_filter[_index] : true;
					    }

					    if ( _keys[_i] !== _filter && _filter && _type !== '[object Array]' ) {
						    continue;
					    }

					    var _length = Object.keys ( fields[_keys[_i]] ).length;
					    _length = typeof _tmp_filter === 'object' && _type !== '[object Array]'
						    ? Math.floor ( Object.keys ( _tmp_filter ).length / _length ) : _length;


					    if ( !parent && _length > 1 ) {
						    response = _self.repeatString ( response, _length );
					    }

					    _self.for_loop ( loop, fields[_keys[_i]], _keys[_i] );

				    } else {
					    key_tree.push ( !isNaN ( _keys[_i] ) ? parent : _keys[_i] );
					    var local_replace = _self.clean_key ( '{' + _pibote + '.' + key_tree.join ( '.' ) + '}' ),
					        value_replace = fields[_keys[_i]];

					    if ( !key_recursive[local_replace] ) {
						    key_recursive[local_replace] = [];
					    }

					    key_recursive[local_replace].push ( value_replace );
					    key_tree.length = 0;
					    delete fields[_keys[_i]];

				    }

			    }

			    return {
				    template: response,
				    replace:  key_recursive
			    };


		    },
		    if_case:          function ( condition, fields ) {
			    console.log ( condition ); //TODO
		    }
	    };

	new_template = template.replace ( /(\r?\n|((?!>)(\s)+(?=<)))/g, '' );
	new_template = new_template.replace ( /([^{]+([A-Za-z0-9]))(?=}|{)/g, function ( match ) {
		if ( !!fields[match] ) {
			return fields[match];
		}
		return match
	} ).replace ( /((<%)(.*)(for)(.*)(%>)(.*)(<%(\s)+(endfor)(\s)+%>))/g, function ( match ) {
		var loop_replace = Template.for_loop ( Template.split_sentence ( match ), fields ),
		    regex = new RegExp ( '(' + Object.keys ( loop_replace.replace ).join ( '|' ) + '|({[a-z]+.[a-z]+[*]}))', "g" );

		return loop_replace.template.replace ( regex, function ( matches ) {
			if ( loop_replace.replace[matches] ) {
				return loop_replace.replace[matches].pop ();
			}
		} );
	} ).replace ( /({|})/g, '' );

	this.postMessage ( new_template );
} )
;