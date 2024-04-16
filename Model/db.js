const express=require('express');
const app=express();
const mongoose=require('mongoose');
const mongo_url='mongodb+srv://vnivedha9:Nivi1801@clusterformern.nzpqsws.mongodb.net/JobPortal?retryWrites=true&w=majority';
mongoose.connect(mongo_url);
  const connection=mongoose.connection;
  connection.on('connected',()=>{console.log("connected")});
  connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  module.exports=connection;