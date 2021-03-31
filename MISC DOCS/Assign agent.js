db.getCollection("tickets").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			    // enter query here
			    nsp: '/sbtjapaninquiries.com',
			    datetime: {
			        $lte: '2020-05-21T19:00:00.000Z',
			        $gte: '2020-05-20T19:00:00.000Z'
			    }
			}
		},

		// Stage 2
		{
			$group: {
			    _id: '$assigned_to',
			    total: {
			        $sum: 1
			    }
			}
		},

		// Stage 3
		{
			$sort: {
			    _id: 1
			    
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
