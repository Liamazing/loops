# Loop Site (Creative Project)
# Matt Gleeson and Liam Osler

Description: Our idea is to make a website where you are presented with a number of beats (probably 8) where you can select any of the diatonic notes from the scale and

Total 95pts

35pts Music

  10pts Users can select a different note on each beat that is played each time the beat falls upon its column.

  5pts Users can select multiple notes on each beat (chords).

  5pts Users can change the tempo.

  5pts Users can pause and play the loop.

  10pts Users can transpose their loops to a different key.

25pts Other Functionality

  10pts Users can save their loops, and get a shareable link to their loop.

  10pts The sound is generated through the use of the Web Audio API.

    https://css-tricks.com/introduction-web-audio-api/

  5pts The note grid is generated and handled through the use of React.

    https://reactjs.org/tutorial/tutorial.html

10pts Usability


  5pts Site is visually appealing.

  5pts Use of the site is intuitive and easy.

5pts Best Practices

  3pts Code is well formatted and commented throughout

  2pts Code passes the html validator

20pts Creative Portion

5pts Rubric was submitted on time (obv)

Creative Portion Description:

For our creative portion, we added a volume control function, used express and socket.io to allow asynchronous saving of files, added the ability to transpose between the Major, Natural Minor, Harmonic Minor, and Melodic Minor of the key, added a clear grid function, and used delta timing to ensure that the application wouldn’t skip beats/play them out of time. Users can also use the spacebar to play/pause the loop instead of clicking on the play/pause button. Integrating React and designing the UI took a lot longer than we expected, and ended up consisting of about half of the project time. We also set up our server to be constantly hosted on our AWS instance without the need for repeatedly calling the node function.
