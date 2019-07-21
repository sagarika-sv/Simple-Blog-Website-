//This app follows the RESTful routing convention 

//Define Packages
var express 			= 	require ("express"),
	mongoose 			= 	require ("mongoose"),
	bodyParser 			= 	require("body-parser"),
	methodOverride		=	require("method-override"),
	expressSanitizer	= 	require("express-sanitizer"),	
	Blog 				=   require("./models/Blog"),
	app 				= 	express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public")); 
app.use(methodOverride("_method"));

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
//Blog.create(

//	{
//		title : "Cats are affectionate, too",
//		image : "https://images.unsplash.com/photo-1493101561740-e745892775b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//		body : "You are wrong if you think cats can't be friendly and affectionate."
//	}, function(err,blogpost){
//		if(err)
//			console.log(err);
//		else
//			console.log(blogpost);
//	});


//HOME Page
app.get("/",function(req,res){
	
	res.redirect("/blogs");
});

//INDEX Route
app.get("/blogs",function(req,res){
		
		Blog.find({},function(err, blogs){
	
		if(err)
			console.log("Something went wrong while showing the posts");
		else{
			
			res.render("index",{blogs:blogs});
			
		}
	
});
	});

//NEW Route

app.get("/blogs/new",function(req,res){
	
		res.render("new");
	
});

//CREATE Route

app.post("/blogs",function(req,res){
	
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err, newblog){
		
		if(err)
		{
			res.render("new");
			console.log(err);
		}
		else
			res.redirect("/blogs");
		
	});	
	
});

//SHOW Route

app.get("/blogs/:id",function(req,res){
	
	Blog.findById(req.params.id, function(err, foundBlog){
			
			if(err)
				res.redirect("/blogs");
			else
				
				res.render("show", {blog:foundBlog});			
				
		});
				  });
	
//EDIT Route

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            res.redirect("/blogs");
         else 
            res.render("edit", {blog: foundBlog});
        
    });
});

//UPDATE Route

app.put("/blogs/:id",function(req,res){
	
	  req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		
		if(err)
			res.redirect("/blogs");
		else
			res.redirect("/blogs/" +req.params.id);
		
	});
	
});

//DESTROY Route

app.delete("/blogs/:id",function(req,res){
	
	Blog.findByIdAndRemove(req.params.id,function(err){
		
		if(err)
			res.redirect("/blogs");
		else
		res.redirect("/blogs");
	});
	
});

var port = 3000 || process.env.PORT;
app.listen(port, function () {
  console.log("Blog Post App has started!");

});
