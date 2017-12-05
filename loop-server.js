/* https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment */

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/:loopIndex', function (req, res) {
    console.log(req.params.loopIndex);
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3456);
