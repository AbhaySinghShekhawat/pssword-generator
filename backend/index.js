let express = require('express');
let mongoose = require('mongoose');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let dotenv = require('dotenv');
const authRouter = require('./routes/authRouter');
const vaultRouter = require('./routes/vaultRouter');
dotenv.config();

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/vault', vaultRouter);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('database connected');
    
    app.listen(process.env.PORT, ()=>{
        console.log(`server started on port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log(err)
})