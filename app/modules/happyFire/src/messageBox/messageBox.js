/**
 * Created by gmena on 08-06-14.
 */

//Module name -> Controller and Event Syrup
Module.recipe ( 'happyFire.messageBox', function ( _, _$, globalScope ) {
	var self;
	return {
		init:     function ( tools ) {
			self = this;
			self.on ( 'change', this.manage );
		},
		box_type: function ( style ) {
			return {
				'error':   'message-box-error',
				'info':    'message-box-alert',
				'success': 'message-box-success',
				'default': 'message-box-default'
			}[style];
		},
		manage:   function ( object ) {
			var _style = _.isSet ( object.object.style ) ? object.object.style : 'default';
			_style = self.box_type ( _style );

			self.setScope ( {'message': _.isSet ( object.object.content ) ? object.object.content : ''} );
			self.serve ();
			self.dom
				.addClass ( _style )
				.animate ( [
					           {left: '-30%'},
					           {left: '3%'}
				           ], function ( elem ) {
					           elem.css ( {left: "3%"} );
					           elem.animate ( [
						                          {left: '3%'},
						                          {left: '-30%'}
					                          ], {delay: 3500}, function ( elem ) {
						           elem.css ( {left: "-30%"} );
					           } );
				           } )


		}
	}
} );