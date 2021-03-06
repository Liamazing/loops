# L∞ps
##### by Liam Osler and Matt Gleeson

Using React, Node, and Web Audio API, we created a desktop site that allows you to customize a musical loop over eight beats.

Some notable features are the volume control, the ability to transpose between the major, natural minor, harmonic minor, and melodic minor modes, a _clear grid_ function, and the delta timing backend to ensure that the application wouldn’t skip beats/play them out of time. Users can also use the spacebar to play/pause the loop instead of clicking on the play/pause button. We also added a volume slider for more control of the volume. Integrating React and designing the UI took a lot longer than we expected, and ended up consisting of about half of the project time. We also set up our server to be constantly hosted on our AWS instance without the need for repeatedly calling the node function.

### How to Test:

The site is continuously hosted [here](http://ec2-18-216-160-244.us-east-2.compute.amazonaws.com:3456/). Note the website is currenly only working on Google Chrome.

### Guide of our files:

index.html is a boilerplate generated by the 'create-react-app' function that is the base to which all of our html gets added. We modified it slightly to support a custom tab icon and title.

index.js houses most of the interesting code. The first section is the react code that specifies what our site looks like. The second section describes the musical functionality of the site.

index.css is the css that we developed extensively.

loop-server.js is a small node/express server that we cooked up to handle serving our packaged code and allow users to save their loops.
