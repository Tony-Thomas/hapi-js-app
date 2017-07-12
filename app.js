const Hapi = require('hapi');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hapidb',
{
        useMongoClient: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

// Init Server
// https://hapijs.com/tutorials
const server = new Hapi.Server();

// Add connection
server.connection({
    port: 8000,
    host: 'localhost',
});

// Home route
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        // reply('<h1>Hello World</h1>');
        reply.view('index', {
            name: 'John Doe'
        })
    }
});

// Tasks Route
server.route({
    method: 'GET',
    path: '/tasks',
    handler: (request, reply) => {
        // reply('<h1>Hello World</h1>');
        reply.view('tasks', {
            tasks: [{
                    text: 'task one'
                },
                {
                    text: 'task two'
                },
                {
                    text: 'task three'
                }
            ]
        });
    }
});

// Dynamic Route
server.route({
    method: 'GET',
    path: '/user/{name}',
    handler: (request, reply) => {
        reply('Hello, ' + request.params.name);
    }

});



// Static Routes
server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/about',
        handler: (request, reply) => {
            reply.file('./public/about.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/image',
        handler: (request, reply) => {
            reply.file('./public/hapi.png');
        }
    });
});

// Vision Templates
// https://github.com/hapijs/vision
server.register(require('vision'), (err) => {
    if (err) {
        throw err;
    }
    server.views({
        engines: {
            html: require('handlebars')
        },
        path: __dirname + '/views'
    });
});

// Start Server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server started at: ${server.info.uri}`);
});
