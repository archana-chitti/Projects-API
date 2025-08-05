const express = require('express');
const fs = require('fs');
let app = express();

let movies = JSON.parse(fs.readFileSync('./data/movies.json'))

app.use(express.json());

//get - api
app.get('/api/v1/movies', (req, res) => {
    res.status(200).json({
        status: 'sucess',
        count: movies.length,
        data: {
            movies: movies
        }
    });
});

//post - api
app.post('/api/v1/movies', (req, res) => {
   //console.log(req.body)
   const newId = movies[movies.length - 1].id + 1;

   const newMovie = Object.assign({id: newId}, req.body)

   movies.push(newMovie);
   fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
         res.status(201).json({
        status: 'success',
        data: {
            movie: newMovie
        }
    });
   })
   //res.send('created')
})

//update - api
app.patch('/api/v1/movies/:id', (req, res) => {
    let id = req.params.id * 1;
    let movieToUpdate = movies.find(el => el.id === id);

    if(!movieToUpdate){
           return res.status(404).json({
        status: 'success',
        message: 'no movie object with ID' +id+ 'id found'
    });

    }

    let index = movies.indexOf(movieToUpdate);
    Object.assign(movieToUpdate, req.body);
    movies[index] = movieToUpdate;

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
         res.status(200).json({
        status: 'success',
        data: {
            movie: movieToUpdate
        }
    });
})
})

//delete - api
app.delete('/api/v1/movies/:id', (req, res) => {
    let id = req.params.id * 1
    let movieToDelete = movies.find(el => el.id === id);

    if(!movieToDelete){
           return res.status(404).json({
        status: 'success',
        message: 'no movie object with ID' +id+ 'id found in delete'
    });

    }
    let index = movies.indexOf(movieToDelete);

    movies.splice(index, 1);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
         res.status(204).json({
        status: 'success',
        data: {
            movie: null
        }
    });
})
})


const port = 3000;
app.listen(port, () => {
    console.log('server has started..');
})