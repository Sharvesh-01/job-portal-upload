const JobRecruiter=require('../Model/jobRecruiterSchema')
const JobDetail=require('../Model/PostJobSchema')
const JobSeeker=require('../Model/JobSeekerSchema')
const express=require('express');
const multer=require('multer');
const path = require('path');
const app=express();
app.use("/uploads",express.static(path.join('..','view','src', 'uploads')));
//app.use("/uploads",express.static("uploads"));

const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const JWT_SECRET="scsdeghrr446745(e)gdsc";
const connection=require("../Model/db.js");
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.listen("3000",()=>console.log("port is at 3000"));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../view/src/uploads/'); // Set upload directory
    },
    filename: function (req, file, cb) {
     const uniqueSuffix =Date.now();
     cb(null,uniqueSuffix+file.originalname);
    
    }
});

// Create multer instance with specified storage
const upload = multer({ storage: storage });
app.get('/JobRecruiterSignUp',async (req,res)=>{
    res.send("hello");
});
app.post('/JobRecruiterSignUp',upload.single('companyLogo'), async (req,res)=>{

    const email = req.body.email;
    const password = req.body.password;
    const companyName = req.body.companyName;
    const headQuarters = req.body.headQuarters;
    const contactNo = req.body.contactNo;
    const companyDetails = req.body.companyDetails;
    const salt=await bcrypt.genSalt(10);
    const encryptedPassword=await bcrypt.hash(password,salt);
    // Access uploaded file information
    const companyLogo = req.file.filename;
    
    try {
        const oldRecruiter=await JobRecruiter.findOne({email});
        console.log(oldRecruiter);
        if(oldRecruiter)
        {
           return res.json({error:"user exists"});
        }
      
        const jobRecruiter = new JobRecruiter({
            email,
            password:encryptedPassword,
            companyName,
            companyLogo ,
            headQuarters,
            contactNo,
            companyDetails,
           // Store the filename of the image
        });
        console.log(companyName);
        // Save the document to the database
        await jobRecruiter.save();
        const recruiter=await JobRecruiter.findOne({email});
        res.json({ status: "ok" ,id:recruiter._id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    }
 /*   try
    {
        await Images.create({image:companyLogo})
        res.json({status:"ok"})
    }
    catch(error){
res.json({status:"error"});
    }
    console.log(companyDetails);
   // res.send("recieved");*/
})

app.get('/',(req,res)=>{
    res.send("hi")});
    app.post("/JobRecruiterLogin",async (req,res)=>{
        const {email,password}=req.body;
        console.log(req.body);
        const recruiter=await JobRecruiter.findOne({email});
        console.log(recruiter);
        if(!recruiter)
        {
            return res.json({error :"user not found"}); 
        }
        if(await bcrypt.compare(password,recruiter.password))
        {
            const token =jwt.sign(recruiter.password,JWT_SECRET);
            if(res.status(201)){
                return res.json({status:"ok",data:token,id:recruiter._id});
    
            }
            else{
                return res.json({error:"error"});
            }
        }
        res.json({status:"error",error:"Invalid password"});
    });


    app.get('/Recruiter/Profile/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const recruiter = await JobRecruiter.findById(id);
            if (!recruiter) {
                return res.status(404).json({ error: 'Recruiter not found' });
            }
            res.json(recruiter);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    });
    app.get('/Recruiter/Profile/Update/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const recruiter = await JobRecruiter.findById(id);
            if (!recruiter) {
                return res.status(404).json({ error: 'Recruiter not found' });
            }
            res.json(recruiter);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    });
    app.put('/Recruiter/Profile/Update/:id', async (req, res) => {
        const id = req.params.id;
        const { email, companyName, companyDetails, headQuarters, newPassword } = req.body;
        const salt=await bcrypt.genSalt(10);
        const encryptedPassword=await bcrypt.hash(newPassword,salt);
        try {
            const recruiter = await JobRecruiter.findByIdAndUpdate(id, {
                email,
                companyName,
                companyDetails,
                headQuarters,
                password: encryptedPassword // Assuming you want to update the password as well
            }, { new: true });
            if (!recruiter) {
                return res.status(404).json({ error: 'Recruiter not found' });
            }
            res.json(recruiter);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    });
    

    app.post("/Recruiter/PostJob/:id", async (req, res) => {
        try {
          const {
            recruiterId,
            jobTitle,
            salary,
            vacancies,
            experience,
            location,
            jobDescription,
            jobRequirement,
          } = req.body;
      
          
          const newJob = new JobDetail({
            recruiterId,
            jobTitle,
            salary,
            vacancies,
            experience,
            location,
            jobDescription,
            jobRequirement,
          });
      
          // Save the new job detail to the database
          await newJob.save();
      
          res.status(201).json({ message: "Job details saved successfully" });
        } catch (error) {
          console.error("Error saving job details:", error);
          res.status(500).json({ error: "Error saving job details" });
        }
      });


      app.get('/Recruiter/ViewPostedJob/:id',async(req,res)=>{
        const id=req.params.id;
        try{
        const job=await JobDetail.find({recruiterId:id});
        if (!job) {
            return res.status(404).json({ error: 'Recruiter not found' });
        }
        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
      });

      
      app.post('/JobSeekerSignUp', upload.fields([{ name: 'resume' }, { name: 'profilePhoto' }]),async(req,res)=>
      {
        try {
            const {fullName,email,password,phoneNumber,location,education,yearsOfExperience,workExperience,skills}=req.body;
            const resume = req.files['resume'] ? req.files['resume'][0].filename : null;
            const profilePhoto = req.files['profilePhoto'] ? req.files['profilePhoto'][0].filename : null;
            const salt=await bcrypt.genSalt(10);
            const encryptedPassword=await bcrypt.hash(password,salt);
            const oldSeeker=await JobSeeker.findOne({email});
            console.log(oldSeeker);
            if(oldSeeker)
            {
               return res.json({error:"user exists"});
            }
          
            const seeker=new JobSeeker(
                {
                    fullName,
                    email,
                    password:encryptedPassword,
                    phoneNumber,
                    location,
                    education,
                    yearsOfExperience,
                    workExperience,
                    skills,
                    resume,
                    profilePhoto,
                }
            )
            console.log("aq");
            await seeker.save();
            const seek=await JobSeeker.findOne({email});
            res.json({ status: "ok" ,id:seek._id});
        } catch (error) {
            console.error('Error signing up job seeker:', error);
            res.status(500).json({ status: "error", message: error.message });
        }
      }
      );
   

      app.post("/JobSeekerLogin",async (req,res)=>{
        const {email,password}=req.body;
        console.log(req.body);
        const seeker=await JobSeeker.findOne({email});
        console.log(seeker);
        if(!seeker)
        {
            return res.json({error :"user not found"}); 
        }
        if(await bcrypt.compare(password,seeker.password))
        {
            const token =jwt.sign(seeker.password,JWT_SECRET);
            if(res.status(201)){
                console.log(seeker._id);
                return res.json({status:"ok",data:token,id:seeker._id});
    
            }
            else{
                return res.json({error:"error"});
            }
        }
        res.json({status:"error",error:"Invalid password"});
    });


    app.get("/Seeker/Profile/:seekerId",async(req,res)=>
    {
        const id=req.params.seekerId;
        try{
            const seeker=await JobSeeker.findById(id);
            if (!seeker) {
                return res.status(404).json({ error: 'Recruiter not found' });
            }
            res.json(seeker);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    });


    app.post('/Seeker/SearchJob/:seekerId',async (req,res)=>
{
    console.log(req.body.searchTitle);
    var searchLocation=req.body.searchLocation;
    var searchTitle=req.body.searchTitle;
   // res.json({ message: 'Search request received successfully', data: req.body });
  // Initialize the query object
var query = {};

// Check if both searchTitle and searchLocation are provided
if (searchTitle && searchLocation) {
    query = {
        $and: [
            { jobTitle: { $regex: new RegExp(searchTitle, 'i') } },
            { location: { $regex: new RegExp(searchLocation, 'i') } }
        ]
    };
} 
// Check if only searchTitle is provided
else if (searchTitle) {
    query = { jobTitle: { $regex: new RegExp(searchTitle, 'i') } };
} 
// Check if only searchLocation is provided
else if (searchLocation) {
    query = { location: { $regex: new RegExp(searchLocation, 'i') } };
} 

// If neither searchTitle nor searchLocation is provided, the query remains an empty object



   
 
   try {
     const result = await JobDetail.find(query);
     console.log('Query result:', result);
     const responseObj = {
        message: 'Search request received successfully',
        data: result,
    };

    // Send the combined JSON object as the response
    res.json(responseObj);

   } catch (queryError) {
    //res.status(500).json({ error: 'Error executing query' });
     console.error('Error executing query:', queryError);
   }
});



    
app.use(express.static(path.join(__dirname, '..', 'view')));

// Define your catch-all route
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'view', 'index.html'), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});