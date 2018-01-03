var World = {

	PATH_INDICATOR : "assets/directionIndicator.png",
	PATH_MODEL_WT3 : "assets/wt3eye.wt3",
	MSG_MODEL_VISIBLE : "Here it is...",
	MSG_MODEL_NOTVISIBLE : "There something nearby!",

	init: function initFn() {
		
		// wait for first location signal before creating the experience to ensure you know user's location during setup process
		AR.context.onLocationChanged = function(latitude, longitude, altitude, accuracy){

			// store user's location so you have access to it at any time
			World.myLocation = {"latitude": latitude, "longitude" : longitude, "altitude" : altitude };

			// create model around the user on very first location update
			if (!World.created) {
				document.getElementById('loadingMessage').innerHTML = 'Loading...';
				World.created = true;
				World.createModelAtLocation(World.myLocation);
			}
		};

		
	},

	createModelAtLocation: function createModelAtLocationFn(location) {

		// place object around the user, in this case just a few meters next to the user. Note that the object will stay where it is, so user can move around it.
		World.modelGeoLocation = new AR.GeoLocation(location.latitude - 0.005, location.longitude + 0.0005, AR.CONST.UNKNOWN_ALTITUDE);
		
		// load model
		World.model = new AR.Model(World.PATH_MODEL_WT3, {

			// trigger animation once asset was loaded
			onLoaded: function() {

				// trigger loading of directin indicator
		        World.indicatorImage = new AR.ImageResource(World.PATH_INDICATOR);

		        // create indicator drawable using the image resource
		        World.indicatorDrawable = new AR.ImageDrawable(World.indicatorImage, 0.1, {
		            verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
		        });

		        // define model as geoObject, including its direction indicator
				World.modelGeoObject = new AR.GeoObject(World.modelGeoLocation, {
		            drawables: {
		               cam: [World.model],
		               indicator: [World.indicatorDrawable]
		            },
		            onEnterFieldOfVision: function() {
		            	World.modelVisible = true;
		            	document.getElementById('loadingMessage').innerHTML = World.MSG_MODEL_VISIBLE;
		            },
		            onExitFieldOfVision: function() {
		            	World.modelVisible = false;
		            	document.getElementById('loadingMessage').innerHTML = World.MSG_MODEL_NOTVISIBLE;
		            },
		            onClick: function() {
		            	console.log('clicked the model');
		            }
		        });

			    World.worldLoaded();

			},
			onError: function(err) {
				World.worldError('Could not load model file.');
			},
			scale: {
				x: 3.3,
				y: 3.3,
				z: 3.3
			},
			translate: {
				x: 0,
				y: 0.5,
				z: 0
			},
			rotate: {
				heading: 180,
				tilt: -40
			}
		});
	},

	worldLoaded: function worldLoadedFn() {
		World.loaded = true;
		document.getElementById('loadingMessage').innerHTML = World.modelVisible ? World.MSG_MODEL_VISIBLE : World.MSG_MODEL_NOTVISIBLE;
	},

	worldError: function worldErrorFn(msg) {
		document.getElementById('loadingMessage').innerHTML = msg ? msg : 'unexpected error';
	}
};

World.init();
